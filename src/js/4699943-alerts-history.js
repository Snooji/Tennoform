/* ---------- Alerts and progress history ---------- */
/* Alerts use only data Tennoform already has (the live feed it loads anyway and your own progress), so they add
   no requests. They show on Home and Today; with "Notify me" on, the browser also pops one up while the site is open. */
const AL_DEF={baro:true,resurgence:true,fissure:true,notify:false};
const alertPrefs=()=>({...AL_DEF,...(P.alertPrefs||{})});
const AL_HIDE=(()=>{const h=lsGet('tf-alert-hide',[]);return Array.isArray(h)?h:[]})();
function alertsAll(){const pr=alertPrefs(),out=[],now=Date.now(),w=WS;
  if(pr.baro&&w&&w.voidTrader){const vt=w.voidTrader,a=new Date(vt.activation).getTime(),e=new Date(vt.expiry).getTime();
    if(a<=now&&now<e)out.push({id:'baro:'+vt.activation,kind:'baro',title:"Baro Ki'Teer is here",text:`At ${vt.location||'a relay'} for ${left(e-now)}.`,items:[],href:'today'});
    else if(a>now&&a-now<48*3600e3)out.push({id:'baro-soon:'+vt.activation,kind:'baro',title:"Baro Ki'Teer arrives soon",text:`In ${left(a-now)}${vt.location?' at '+vt.location:''}. Ducats ready?`,items:[],href:'today'})}
  if(pr.resurgence){const need=Object.keys(VAULT).filter(n=>VAULT[n].now&&I[n]&&((P.goals||[]).includes(n)||(!on('m|'+n)&&!ownedItem(n))));
    if(need.length){const until=VAULT[need[0]].now;out.push({id:'res:'+until+':'+need.sort().join(','),kind:'resurgence',title:`Prime Resurgence: ${need.length} you need`,
      text:`Varzia has their relics until ${fdate(until)}. Buy them with Aya or Regal Aya.`,items:need.slice(0,6).concat(need.length>6?[`and ${need.length-6} more`]:[]),href:'market'})}}
  if(pr.fissure&&w&&w.fissures){const mine=Object.keys(P.rel||{}).filter(r=>REL[r]&&relCount(r)>0);const eras={};
    mine.forEach(r=>{const e=REL[r].era;const x=eras[e]=eras[e]||{n:0,need:0};x.n+=relCount(r);if(relicAdvice(r).need.length)x.need++});
    const fis=w.fissures.filter(f=>!f.expired&&new Date(f.expiry).getTime()>now&&eras[f.tier]).sort((a,b)=>(eras[b.tier].need-eras[a.tier].need)||new Date(a.expiry)-new Date(b.expiry));
    if(fis.length){const es=[...new Set(fis.map(f=>f.tier))];out.push({id:'fis:'+fis.map(f=>f.id||f.node+f.tier).sort().join(',').slice(0,300),kind:'fissure',
      title:`Fissures for your relics: ${es.join(', ')}`,text:es.map(e=>`${e}: ${eras[e].n} relic${eras[e].n>1?'s':''}${eras[e].need?`, ${eras[e].need} with parts you need`:''}`).join(' · '),
      items:fis.slice(0,5).map(f=>`${f.tier} ${f.missionType} · ${f.node}${f.isHard?' · Steel Path':''}${f.isStorm?' · Void Storm':''} · ${left(new Date(f.expiry)-now)} left`),href:'today'})}}
  return out}
function alertsData(){const pr=alertPrefs();return {prefs:pr,live:!!WS,list:alertsAll().filter(a=>!AL_HIDE.includes(a.id)),hidden:alertsAll().filter(a=>AL_HIDE.includes(a.id)).length,
  canNotify:typeof Notification!=='undefined',perm:typeof Notification!=='undefined'?Notification.permission:'unsupported'}}
/* pop up new alerts while the site is open (no background service, nothing sent anywhere) */
function alertsCheck(){const pr=alertPrefs();const seen=new Set(lsGet('tf-alert-seen',[])||[]);const fresh=alertsAll().filter(a=>!seen.has(a.id)&&!AL_HIDE.includes(a.id));
  if(!fresh.length)return;fresh.forEach(a=>seen.add(a.id));lsSet('tf-alert-seen',[...seen].slice(-100));
  if(pr.notify&&typeof Notification!=='undefined'&&Notification.permission==='granted'&&document.hidden){fresh.forEach(a=>{try{const n=new Notification(a.title,{body:a.text,tag:a.id,icon:'/icon-192.png'});n.onclick=()=>{window.focus();GO(a.href);n.close()}}catch(e){}})}
  tfNotify()}
setInterval(alertsCheck,60e3);setTimeout(alertsCheck,8e3);
Object.assign(window.TF,{alerts:()=>alertsData(),
  alertPrefsSet:o=>{P.alertPrefs={...alertPrefs(),...o};saveProfile();tfNotify()},
  alertDismiss:id=>{if(!AL_HIDE.includes(id))AL_HIDE.push(id);while(AL_HIDE.length>200)AL_HIDE.shift();lsSet('tf-alert-hide',AL_HIDE);tfNotify()},
  alertShowHidden:()=>{AL_HIDE.length=0;lsSet('tf-alert-hide',AL_HIDE);tfNotify()},
  alertNotify:async on=>{if(!on){P.alertPrefs={...alertPrefs(),notify:false};saveProfile();tfNotify();return}
    if(typeof Notification==='undefined'){toast("This browser can't show notifications.");return}
    const p=Notification.permission==='granted'?'granted':await Notification.requestPermission();
    if(p==='granted'){P.alertPrefs={...alertPrefs(),notify:true};saveProfile();toast("You'll get a notification for new alerts while Tennoform is open.")}
    else toast('Notifications are blocked for this site. Allow them in your browser settings to turn this on.');tfNotify()}});

/* ---------- progress history: one snapshot a day of your mastery and collection, kept in your profile (and synced when signed in) ---------- */
function histSnap(){const t=totalXP();let mastered=0,owned=0;for(const it of MI){if(on('m|'+it.n))mastered++;if(ownedItem(it.n))owned++}
  const nodes=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length;return {xp:Math.round(t.total),mr:mrInfo(t.total).mr,mastered,owned,nodes}}
const histDay=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
/* only record once your saved progress has loaded: never in demo mode, never while accounts are still starting,
   never for a signed-in account before its cloud copy is attached, and never an empty snapshot */
function histReady(){if(typeof DEMO!=='undefined'&&DEMO)return false;if(typeof FBST!=='undefined'&&FBST==='loading')return false;
  try{if(window.firebase&&firebase.apps&&firebase.apps.length&&firebase.auth().currentUser&&!synced)return false}catch(e){return false}return true}
function histRecord(){if(!histReady())return;const s=histSnap();if(!s.xp&&!s.mastered&&!s.owned&&!s.nodes)return;const day=histDay();P.hist=P.hist&&typeof P.hist==='object'?P.hist:{};const cur=P.hist[day];
  if(cur&&cur.xp===s.xp&&cur.mastered===s.mastered&&cur.owned===s.owned&&cur.nodes===s.nodes)return;
  /* a day where nothing changed since the last snapshot isn't stored; only days with progress */
  const days=Object.keys(P.hist).sort();const last=days.length?P.hist[days[days.length-1]]:null;
  if(!cur&&last&&last.xp===s.xp&&last.mastered===s.mastered&&last.owned===s.owned&&last.nodes===s.nodes)return;
  P.hist[day]=s;const keep=Object.keys(P.hist).sort().slice(-400);if(keep.length<Object.keys(P.hist).length){const h={};keep.forEach(k=>h[k]=P.hist[k]);P.hist=h}saveProfile()}
setTimeout(histRecord,20e3);setInterval(histRecord,5*60e3);
function histData(){const days=Object.keys(P.hist||{}).sort();const pts=days.map(d=>({d,...P.hist[d]}));const now=histSnap();
  const ago=n=>{const t=new Date();t.setDate(t.getDate()-n);const key=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
    let best=null;for(const p of pts)if(p.d<=key)best=p;return best};
  const delta=n=>{const b=ago(n);return b?{xp:now.xp-b.xp,mastered:now.mastered-b.mastered,owned:now.owned-b.owned,nodes:now.nodes-b.nodes,since:b.d}:null};
  return {points:pts,now,week:delta(7),month:delta(30),first:days[0]||''}}
Object.assign(window.TF,{history:()=>histData()});
