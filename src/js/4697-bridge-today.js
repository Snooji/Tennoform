/* ---------- bridge: Today for the React page ---------- */
const hasTaskT=t=>(P.tasks||[]).some(x=>!x.d&&x.t===t);
function ckLiveData(c){const w=WS,id=c[1];if(!w)return null;
  if(id==='sortie'&&w.sortie&&w.sortie.variants)return {head:[w.sortie.boss,w.sortie.faction].filter(Boolean).join(' · '),list:w.sortie.variants.map(v=>({t:v.missionType,s:v.node,n:v.modifier}))};
  if(id==='archon'&&w.archonHunt&&w.archonHunt.missions)return {head:w.archonHunt.boss||'',list:w.archonHunt.missions.map(v=>({t:v.type,s:v.node,n:''}))};
  if((id==='nwd'||id==='nww')&&w.nightwave&&w.nightwave.activeChallenges){const ac=w.nightwave.activeChallenges.filter(x=>id==='nwd'?x.isDaily:!x.isDaily);return ac.length?{head:'',list:ac.map(x=>({t:x.title,s:fmt(x.reputation)+' standing'+(x.isElite?' (elite)':''),n:x.desc+((P.dw||{})['nw|'+x.id]?' · done':'')}))}:null}
  if(id==='teshin'&&w.steelPath&&w.steelPath.currentReward)return {head:'This week: '+w.steelPath.currentReward.name+' for '+w.steelPath.currentReward.cost+' Steel Essence',list:[]};
  return null}
const CKLINK2={synd:['synd','Open Syndicates'],openworld:['synd','Open Syndicates'],simaris:['synd','Open Syndicates']};
function todayData(){const f=state.ckF||'todo';const now=Date.now();if(HOSTED&&!WS&&!WSerr)loadWS();
  const HID=P.ckHide||[],PIN=P.ckPin||[];const all=allChecks();
  const rows=all.filter(c=>f==='hidden'?HID.includes(c[1]):!HID.includes(c[1])&&(f==='all'||(f==='todo'&&!ckDone(c)&&gateOK(c[4]))||(f===c[0])||(f==='locked'&&!gateOK(c[4])))).sort((a,b)=>PIN.includes(b[1])-PIN.includes(a[1]))
    .map(c=>{const end=ckEnd(c);return {id:c[1],per:c[0],title:c[2],desc:c[3],gate:c[4]||'',locked:!gateOK(c[4]),done:ckDone(c),doneAt:ckDone(c)?(P.dw||{})[c[1]]:0,pinned:PIN.includes(c[1]),hidden:HID.includes(c[1]),custom:c[1].startsWith('cu|'),
      resetIn:left(end-now),resetAt:lt(end),endIso:new Date(end).toISOString(),hasTask:hasTaskT(c[2]),link:CKLINK2[c[1]]?{route:CKLINK2[c[1]][0],label:CKLINK2[c[1]][1]}:null,live:ckLiveData(c)}});
  const vis=c=>gateOK(c[4])&&!HID.includes(c[1]);const dd=all.filter(c=>c[0]==='d'&&vis(c)),wd=all.filter(c=>c[0]==='w'&&vis(c));
  const tiles=[{k:'Daily reset',v:lastDaily()+DAY-now<60000?'Resetting…':left(lastDaily()+DAY-now),x:lt(lastDaily()+DAY)+' your time (00:00 UTC)',done:dd.filter(ckDone).length,total:dd.length},
    {k:'Sortie reset',v:lastSortie()+DAY-now<60000?'Resetting…':left(lastSortie()+DAY-now),x:lt(lastSortie()+DAY)+' your time (16:00 UTC)'},
    {k:'Weekly reset',v:lastWeekly()+7*DAY-now<60000?'Resetting…':left(lastWeekly()+7*DAY-now),x:ltw(lastWeekly()+7*DAY)+' your time (Mon 00:00 UTC)',done:wd.filter(ckDone).length,total:wd.length}];
  const out={filter:f,rows,hiddenCount:HID.length,tiles,hosted:HOSTED,live:null,liveState:!HOSTED?'offline':WS?'ok':WSerr?'error':'loading'};
  const w=WS;if(!w)return out;
  const cyc=(name,c,lab)=>c?{name,state:lab(c),left:untilIso(c.expiry)}:null;
  const L={cycles:[cyc('Cetus',w.cetusCycle,c=>c.isDay?'Day':'Night'),cyc('Orb Vallis',w.vallisCycle,c=>c.isWarm?'Warm':'Cold'),cyc('Cambion Drift',w.cambionCycle,c=>c.state==='vome'?'Vome':'Fass'),cyc('Duviri',w.duviriCycle,c=>c.state?c.state.charAt(0).toUpperCase()+c.state.slice(1):'')].filter(Boolean)};
  if(w.sortie&&w.sortie.variants)L.sortie={boss:w.sortie.boss||'',faction:w.sortie.faction||'',left:untilIso(w.sortie.expiry),expiry:w.sortie.expiry,variants:w.sortie.variants.map(v=>({t:v.missionType,s:v.node,n:v.modifier})),task:'Do the Sortie',hasTask:hasTaskT('Do the Sortie')};
  if(w.archonHunt&&w.archonHunt.missions)L.archon={boss:w.archonHunt.boss||'',left:untilIso(w.archonHunt.expiry),expiry:w.archonHunt.expiry,missions:w.archonHunt.missions.map(v=>({t:v.type,s:v.node})),task:'Do the Archon Hunt',hasTask:hasTaskT('Do the Archon Hunt')};
  const vt=w.voidTrader;if(vt){const act=new Date(vt.activation)<=now&&now<new Date(vt.expiry);L.baro={here:act,left:act?untilIso(vt.expiry):untilIso(vt.activation),location:vt.location||'',inv:act&&vt.inventory?vt.inventory.map(x=>({item:x.item,ducats:x.ducats,credits:x.credits})):[]}}
  if(w.steelPath&&w.steelPath.currentReward)L.steel={name:w.steelPath.currentReward.name,cost:w.steelPath.currentReward.cost};
  if(w.arbitration&&!w.arbitration.expired&&w.arbitration.type!=='Unknown'){const t='Run Arbitration: '+w.arbitration.type+' · '+w.arbitration.node;L.arbitration={type:w.arbitration.type,node:w.arbitration.node,enemy:w.arbitration.enemy||'',left:untilIso(w.arbitration.expiry),expiry:w.arbitration.expiry,task:t,hasTask:hasTaskT(t)}}
  if(w.nightwave&&w.nightwave.activeChallenges)L.nightwave=w.nightwave.activeChallenges.map(c=>({id:'nw|'+c.id,title:c.title,desc:c.desc,rep:c.reputation,kind:c.isDaily?'Daily':c.isElite?'Elite weekly':'Weekly',done:!!(P.dw||{})['nw|'+c.id],left:untilIso(c.expiry),expiry:c.expiry,task:'Nightwave: '+c.title,hasTask:hasTaskT('Nightwave: '+c.title)}));
  const need=neededEras();const ff=state.fiF||'all',fm=state.fiM||'all';
  const fis=(w.fissures||[]).filter(x=>!x.expired&&new Date(x.expiry)>now).filter(x=>(ff==='all'||x.tier===ff||(ff==='need'&&need[x.tier]))&&(fm==='all'||(fm==='sp'&&x.isHard)||(fm==='n'&&!x.isHard&&!x.isStorm)||(fm==='storm'&&x.isStorm)))
    .sort((a,b)=>(a.tierNum-b.tierNum)||(new Date(a.expiry)-new Date(b.expiry)));
  const mine=era=>Object.keys(P.rel||{}).filter(r=>REL[r]&&REL[r].era===era&&relCount(r)>0).length;
  L.fissures={era:ff,mode:fm,need:Object.entries(need).map(([era,s])=>({era,relics:[...s].slice(0,6),more:Math.max(0,s.size-6)})),
    list:fis.map(x=>{const t=x.tier+' fissure: '+x.missionType+' · '+x.node;return {id:x.id||x.node+x.tier,tier:x.tier,need:!!need[x.tier],mission:x.missionType,node:x.node,hard:!!x.isHard,storm:!!x.isStorm,left:untilIso(x.expiry),expiry:x.expiry,mine:mine(x.tier),task:t,hasTask:hasTaskT(t)}})};
  const GOOD=/Catalyst|Reactor|Forma|Exilus|Wraith|Vandal|Mutalist|Detonite|Fieldron|Mutagen/;const rw=s=>((s&&s.countedItems)||[]).map(c=>(c.count>1?c.count+'× ':'')+c.type).join(', ');
  L.invasions=(w.invasions||[]).filter(x=>!x.completed).map(x=>{const a=rw(x.attacker&&x.attacker.reward),d=rw(x.defender&&x.defender.reward);const r=[a,d].filter(Boolean).join(' / ');return {id:x.id||x.node,node:x.node,desc:x.desc,rewards:r,good:GOOD.test(r),pct:Math.round(x.completion||0)}});
  out.live=L;return out}
function ckTick(id,v){P.dw=P.dw||{};if(v)P.dw[id]=Date.now();else delete P.dw[id];logDW(id,v);saveProfile();updateMR();
  if(v){const c=allChecks().find(x=>x[1]===id);let lab=c?c[2]:'Done';if(id.startsWith('nw|')){const e=logList()[0];if(e&&e.key===id)lab=e.label}const lg=logList()[0];
    toastAction(lab+' ticked off','Undo',()=>{if(lg&&lg.key===id)logUndo(lg.id);else{delete P.dw[id];logDW(id,false);saveProfile();updateMR()}})}}
Object.assign(window.TF,{
  today:()=>todayData(),
  todaySet:o=>{if(o.ckF!=null)state.ckF=o.ckF;if(o.fiF!=null)state.fiF=o.fiF;if(o.fiM!=null)state.fiM=o.fiM;saveUI();tfNotify()},
  ckTick:(id,v)=>ckTick(id,v),
  ckPin:id=>tfAct('button',{'data-ckpin':id}),
  ckHide:id=>tfAct('button',{'data-ckhide':id}),
  ckAdd:(text,per)=>{const v=String(text||'').trim();if(!v)return false;P.ckCustom=P.ckCustom||[];P.ckCustom.push({id:newId(),t:v.slice(0,80),p:per==='w'?'w':'d'});saveProfile();tfNotify();return true},
  liveTask:(t,exp)=>tfAct('button',{'data-livetask':t,'data-ltexp':exp||''}),
  fisRelics:era=>tfAct('button',{'data-fisrel':era}),
  retryLive:()=>{WSerr=false;WSat=0;loadWS();tfNotify()}
});
const _todayRoute=routes.today;
routes.today=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('today')?'':_todayRoute()};
