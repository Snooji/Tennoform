/* ---------- Friends: where each friend is at, and how you can help them ---------- */
/* Each player can share a small "what I'm working on" note with their friends only (Firestore share/{uid}, readable by
   people on their friends list): the gear they're tracking, the parts they still need, what they'd like help with and a
   short note. Your side matches that against what you own: spare parts, relics that drop their parts, gear you've built. */
const LF_TAGS=['Relic runs','Steel Path','Eidolons','Archon hunts','Railjack','Levelling gear','Resource farming','Liches & Sisters','Open-world bounties','Duviri & Circuit','Netracells & Archimedea','New player help'];
SO.share=SO.share||{};
let SHP=0;

/* what I share */
function shareOut(){const goals=(P.goals||[]).filter(n=>I[n]&&!on('m|'+n)&&!on('build|'+n)).slice(0,20);const need=[];
  /* only parts that come from relics or drops: a Market blueprint is just bought, nobody needs help with it */
  for(const g of goals){const it=I[g];if(!on('bp|'+g)&&(it.bprel||it.bpd))need.push(g+' Blueprint');
    for(const p of it.parts){if(p.k!=='p'||p.n==='Blueprint'||!(p.rel||(p.dr&&p.dr.length)))continue;if(on('part|'+g+'|'+p.n)||on('built|'+g+'|'+p.n))continue;need.push(p.full||(g+' '+p.n))}}
  /* open to-do tasks as "kind|ref|title" so friends can open the same page */
  const tasks=(P.tasks||[]).filter(x=>!x.d&&x.t).slice(0,20).map(x=>[x.k||'note',String(x.r||'').slice(0,80),String(x.t).slice(0,100)].join('|'));
  return {at:Date.now(),goals,need:[...new Set(need)].slice(0,40),lf:(P.lf||[]).filter(t=>LF_TAGS.includes(t)).slice(0,12),note:String(P.lfNote||'').slice(0,120),tasks}}
function publishShare(){if(!SO.uid||!FB)return Promise.resolve();const ref=FB.fs.collection('share').doc(SO.uid);
  if(P.shareOff)return ref.delete().catch(()=>{});const d=shareOut();
  /* until the updated rules (with tasks) are published, share everything else */
  return ref.set(d).catch(()=>{const {tasks,...rest}=d;return ref.set(rest).catch(()=>{})})}
{const _pp=publishPublic;publishPublic=function(){const r=_pp();publishShare();return r}}

/* what my friends share with me */
let SHT=0;
async function loadShares(){if(!FB||!SO.uid)return;let changed=false;
  for(const f of SO.friends){if(f.pending)continue;const c=SO.share[f.uid];if(c&&Date.now()-c._t<300000)continue;
    try{const d=await FB.fs.collection('share').doc(f.uid).get();SO.share[f.uid]={...(d.exists?d.data():{}),_t:Date.now(),st:d.exists?'ok':'none'}}
    catch(e){SO.share[f.uid]={_t:Date.now(),st:'none'}}changed=true}
  if(changed)tfNotify()}
{const _lf=loadFriendCards;loadFriendCards=async function(){const r=await _lf.apply(this,arguments);loadShares();return r}}

/* part name -> the item it belongs to and the relics that drop it */
let PARTIX=null;
function partIx(){if(PARTIX)return PARTIX;PARTIX={};
  for(const it of Object.values(I)){if(it.bprel)PARTIX[it.n+' Blueprint']={item:it.n,rel:it.bprel,dr:it.bpd||null};
    for(const p of it.parts||[])if(p.k==='p'){const full=p.full||(it.n+' '+p.n);if(!PARTIX[full])PARTIX[full]={item:it.n,rel:p.rel||null,dr:p.dr||null}}}
  return PARTIX}
const relName=r=>String(Array.isArray(r)?r[0]:r);
const TASK_GO={res:'res',item:'item',relic:'relic',mod:'mod',arc:'arc',part:'part',guide:'guide',way:'way',quest:'guide'};
function shareTasks(sh){return (Array.isArray(sh.tasks)?sh.tasks:[]).filter(x=>typeof x==='string').map(x=>{const a=x.split('|');const k=a[0]||'note',r=a[1]||'',t=a.slice(2).join('|')||r;
  return {k,r,t,go:TASK_GO[k]&&r?TASK_GO[k]+'|'+r:''}}).filter(x=>x.t)}
function helpFor(sh,theirMr,myMr){const out=[];const ix=partIx();
  for(const x of shareTasks(sh)){
    if(x.k==='relic'&&REL[x.r]&&relCount(x.r)>0)out.push({k:'relic',t:`They're working on ${x.t}, and you have ${relCount(x.r)} ${x.r}. Run it together.`,go:'relic|'+x.r});
    else if(x.k==='item'&&I[x.r]&&on('m|'+x.r))out.push({k:'build',t:`They're working on ${x.t}. You've mastered ${x.r}, so share your build or tips.`,go:'item|'+x.r})}const need=(sh.need||[]).filter(x=>typeof x==='string');
  for(const part of need){const p=ix[part]||{};const spare=+((P.dup||{})[part])||0;
    if(spare){out.push({k:'give',t:`You have ${spare} spare ${part}. Trade it to them.`,go:'part|'+part});continue}
    const mine=(p.rel||[]).map(relName).filter(r=>REL[r]&&relCount(r)>0);
    if(mine.length){out.push({k:'relic',t:`Your ${mine.slice(0,3).map(r=>`${r} (${relCount(r)})`).join(', ')} ${mine.length>1?'drop':'drops'} their ${part}. Open ${mine.length>1?'them':'it'} together.`,go:'relic|'+mine[0]});continue}
    if(p.item&&on('m|'+p.item)&&!(sh.goals||[]).includes(p.item))out.push({k:'know',t:`You've built ${p.item}, so you know where ${part} comes from. Farm it with them.`,go:'item|'+p.item})}
  for(const g of sh.goals||[])if(typeof g==='string'&&I[g]&&on('m|'+g))out.push({k:'build',t:`You've mastered ${g}. Share your build or tips for it.`,go:'item|'+g});
  const lf=(sh.lf||[]).filter(t=>LF_TAGS.includes(t));
  const relN=Object.keys(P.rel||{}).filter(r=>relCount(r)>0).length;const spOn=ALLN.some(n=>on('sp|'+n.id));
  for(const t of lf){const why=t==='Relic runs'&&relN?`you have ${relN} kind${relN>1?'s':''} of relics`:t==='Steel Path'&&spOn?'you have Steel Path':t==='New player help'&&myMr>theirMr+4?`you're ${myMr-theirMr} ranks ahead`:'';
    if(why)out.push({k:'lf',t:`They want help with ${t}, and ${why}.`})}
  const seen=new Set();return out.filter(h=>{const key=h.k==='build'?'build|'+h.go:h.t;if(seen.has(key))return false;seen.add(key);return true}).slice(0,12)}

function agoText(at){if(!at)return '';const s=(Date.now()-at)/1000;if(s<120)return 'Active just now';if(s<3600)return `Active ${Math.round(s/60)} min ago`;
  if(s<86400)return `Active ${Math.round(s/3600)} h ago`;const d=Math.round(s/86400);return d<60?`Active ${d} day${d>1?'s':''} ago`:'Not active lately'}

function friendsHubData(){const sq=squadData();if(sq.status!=='ok')return {status:sq.status};
  if(Date.now()-SHT>60000){SHT=Date.now();loadShares()}
  const myMr=mrInfo(totalXP().total).mr;const pins=P.fpin||[];const q=(state.fhQ||'').toLowerCase().trim();const so=state.fhS||'active';
  const base=Object.fromEntries((sq.friends||[]).map(f=>[f.uid,f]));
  let list=SO.friends.map(f=>{const p=SO.pub[f.uid]||{};const b=base[f.uid]||{};const sh=SO.share[f.uid]||{};
    const xp=+p.xp||0;const m=p.mr!=null?mrInfo(xp):null;const mr=p.mr!=null?+p.mr:null;
    return {uid:f.uid,name:sqName(f.uid),av:b.av||'',pending:!!f.pending,pinned:pins.includes(f.uid),unread:b.unread||0,code:f.code||p.code||'',
      mr,mrLabel:mr!=null?'MR '+mrLabel(mr):'',pct:m?Math.round(m.pct):0,toNext:m?Math.max(0,m.next-xp):0,nextLabel:m?'MR '+mrLabel(m.mr+1):'',
      diff:mr!=null?mr-myMr:0,at:+p.at||0,active:agoText(+p.at||0),
      nodes:+p.nodes||0,sp:+p.sp||0,maxed:+p.maxed||0,
      shared:f.pending?'pending':sh.st||'loading',goals:(sh.goals||[]).filter(x=>typeof x==='string'),need:(sh.need||[]).filter(x=>typeof x==='string'),
      lf:(sh.lf||[]).filter(t=>LF_TAGS.includes(t)),note:typeof sh.note==='string'?sh.note:'',tasks:sh.st==='ok'?shareTasks(sh):[],help:mr!=null&&sh.st==='ok'?helpFor(sh,mr,myMr):[]}});
  if(q)list=list.filter(f=>f.name.toLowerCase().includes(q)||f.code.toLowerCase().includes(q));
  list.sort((a,b)=>(b.pinned-a.pinned)||(a.pending-b.pending)||(so==='mr'?((b.mr??-1)-(a.mr??-1)):so==='name'?a.name.localeCompare(b.name):(b.unread-a.unread)||(b.at-a.at))||a.name.localeCompare(b.name));
  const mine=shareOut();
  return {status:'ok',q:state.fhQ||'',sort:so,open:state.fhOpen||'',myMr,count:SO.friends.filter(f=>!f.pending).length,friends:list,lfTags:LF_TAGS,
    me:{on:!P.shareOff,lf:(P.lf||[]).filter(t=>LF_TAGS.includes(t)),note:P.lfNote||'',goals:mine.goals.length,need:mine.need.length}}}

Object.assign(window.TF,{
  friendsHub:()=>friendsHubData(),
  friendsHubSet:o=>{if(o.q!=null)state.fhQ=o.q;if(o.sort!=null)state.fhS=o.sort;if('open' in o)state.fhOpen=state.fhOpen===o.open?'':o.open;tfNotify()},
  friendPin:uid=>{P.fpin=P.fpin||[];const i=P.fpin.indexOf(uid);if(i>=0)P.fpin.splice(i,1);else P.fpin.push(uid);saveProfile();tfNotify()},
  shareSet:o=>{if(o.on!=null)P.shareOff=!o.on;if(o.lf!=null){P.lf=P.lf||[];const i=P.lf.indexOf(o.lf);if(i>=0)P.lf.splice(i,1);else if(LF_TAGS.includes(o.lf))P.lf.push(o.lf)}
    if(o.note!=null)P.lfNote=String(o.note).slice(0,120);saveProfile();clearTimeout(SHP);SHP=setTimeout(publishShare,1500);tfNotify()},
});
