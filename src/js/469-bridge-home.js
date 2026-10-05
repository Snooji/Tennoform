/* ---------- bridge: Home data for the React dashboard. Same numbers the old Home showed; actions reuse the existing handlers. ---------- */
const IMG=n=>I[n]&&I[n].img?'https://cdn.warframestat.us/img/'+encodeURIComponent(I[n].img):'';
/* run an existing delegated handler: build a throwaway element with the same attributes and click it */
function tfAct(tag,attrs){const box=document.getElementById('tf-act')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'tf-act',hidden:true}));
  const el=document.createElement(tag||'button');for(const k in attrs)el.setAttribute(k,attrs[k]);box.appendChild(el);el.click();setTimeout(()=>el.remove(),20000)}
function homeData(){const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;const now=Date.now();
  const stale=!!(P.wfid&&(!P.auto||now-Date.parse(P.auto)>864e5));
  const parts=[['Gear',t.it],['Star chart',t.ch],['Steel Path',t.sp],['Intrinsics',t.intr],['Other',(t.other||0)+(t.adj||0)+(t.un||0)]].filter(p=>p[1]>0).map(([label,xp])=>({label,xp}));
  /* since last time (same rule as the old Home: compare with a visit 30+ minutes ago) */
  const cur=seenNow();if(!SEEN){const prev=lsGet('tf-seen',null);SEEN=prev&&cur.t-prev.t>30*60e3?prev:(prev||cur);if(!prev||cur.t-prev.t>30*60e3)lsSet('tf-seen',cur)}
  const since=[];if(SEEN!==cur&&SEEN.t<cur.t){if(cur.mr>SEEN.mr)since.push(`MR ${SEEN.mr} → ${cur.mr}`);if(cur.maxed>SEEN.maxed)since.push(`+${cur.maxed-SEEN.maxed} mastered`);if(cur.xp>SEEN.xp)since.push(`+${fmt(cur.xp-SEEN.xp)} XP`);if(cur.q>SEEN.q)since.push(`+${cur.q-SEEN.q} quest${cur.q-SEEN.q>1?'s':''}`)}
  const fl=P.foundry||[];const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;
  /* next up */
  NU=nextUp();const nz=Object.values(P.nuSnz||{}).filter(z=>z>=lastDaily()).length;
  const next=NU.map((x,i)=>({i,id:x.id,title:x.t,why:x.why||'',steps:x.pre||[],done:!!x.done,doneLabel:x.doneL||'Done',img:x.go&&x.go.startsWith('item|')?IMG(x.go.slice(5)):'',
    open:x.go?{tag:'a',attrs:{href:'#','data-go':x.go}}:x.q?{tag:'a',attrs:{href:'#quests','data-q':x.q}}:x.href?{tag:'a',attrs:{href:x.href,...(x.tt?{'data-ttab':x.tt}:{})}}:null,
    task:x.task?{has:(P.tasks||[]).some(y=>!y.d&&y.k===x.task[0]&&y.r===x.task[1]),key:x.task[0]+'|'+x.task[1],label:x.task[2]||''}:null}));
  /* today */
  if(HOSTED&&!WS&&!WSerr)loadWS();const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const wd=allChecks().filter(c=>c[0]==='w'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));
  const today=[{k:'Daily reset',v:lastDaily()+DAY-now<60000?'Resetting…':left(lastDaily()+DAY-now),x:`${dd.filter(ckDone).length}/${dd.length} done`,route:'today',done:dd.filter(ckDone).length,total:dd.length}];
  if(WS&&WS.sortie&&WS.sortie.variants)today.push({k:'Sortie',v:WS.sortie.boss||'Today',x:untilIso(WS.sortie.expiry)+' left',route:'today'});
  if(WS&&WS.fissures){const need=neededEras();const n=WS.fissures.filter(x=>!x.expired&&new Date(x.expiry)>now&&need[x.tier]).length;if(Object.keys(need).length)today.push({k:'Fissures you need',v:String(n),x:Object.keys(need).slice(0,3).join(', '),route:'today'})}
  if(WS&&WS.steelPath&&WS.steelPath.currentReward)today.push({k:'Steel Path reward',v:WS.steelPath.currentReward.name,x:WS.steelPath.currentReward.cost+' essence',route:'today'});
  if(fl.length)today.push({k:'Foundry',v:`${ready}/${fl.length} ready`,x:ready?'Claim in game':'Next in '+hrs((Math.min(...fl.map(f=>f.t0+f.dur*1000))-now)/1000),route:'tenno',ttab:'foundry'});
  today.push({k:'Weekly reset',v:left(lastWeekly()+7*DAY-now),x:`${wd.filter(ckDone).length}/${wd.length} weekly done`,route:'today'});
  const lg=logList().filter(e=>e.t>=lastDaily());
  /* goals and tasks */
  const goals=(P.goals||[]).filter(n=>I[n]&&!on('build|'+n));taskResets();const open=(P.tasks||[]).filter(x=>!x.d);
  return {name:P.tname||(P.prof&&P.prof.name)||'',mr:m.mr,mrLabel:m.mr>30?'Legendary '+(m.mr-30):'Mastery rank '+m.mr,mrShort:mrLabel(m.mr),inGame:g!=null&&g!==m.mr?mrLabel(g):'',
    maxed:cur.maxed,xp:t.total,next:m.next,toNext:Math.max(0,m.next-t.total),nextLabel:m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1),pct:m.pct,parts,
    action:HOSTED&&!P.at&&!P.wfid?'link':HOSTED&&stale?'sync':'plan',since,foundryReady:ready,upNext:next,snoozed:nz,today,
    doneToday:{n:lg.length,xp:lg.reduce((a,e)=>a+(e.xp||0),0)},
    goals:goals.slice(0,4).map(n=>{const k=stepKeys(n);return {name:n,img:IMG(n),done:k.filter(on).length,total:k.length}}),goalCount:goals.length,
    tasks:open.slice(0,6).map(x=>({id:x.id,title:x.t,kind:x.k&&x.k!=='note'?(TKL[x.k]||x.k):'',due:x.due||'',over:!!(x.due&&new Date(x.due+'T23:59:59')<new Date()),rep:x.rep||'',open:(()=>{const g2=taskGo(x);if(!g2)return null;const a={};g2.replace(/([\w-]+)="([^"]*)"/g,(_,k,v)=>{a[k]=v.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')});return {tag:'a',attrs:a}})()})),taskCount:open.length,
    showSign:canAcct()&&!signedIn(),demo:!!DEMO,stage:stage()}}
Object.assign(window.TF,{
  home:()=>homeData(),
  act:(tag,attrs)=>tfAct(tag,attrs),
  nuDone:i=>tfAct('button',{'data-nudone':String(i)}),
  nuSnooze:i=>tfAct('button',{'data-nusnz':String(i)}),
  nuUnsnooze:()=>tfAct('button',{id:'nuunsnz'}),
  addTaskFrom:(key,label)=>tfAct('button',{'data-addtask':key,'data-tlabel':label||''}),
  taskDone:async(id,v)=>{await toggleTask(id,v);if(v){const x=(P.tasks||[]).find(t=>t.id===id);toastAction((x?x.t:'Task')+' done','Undo',async()=>{await toggleTask(id,false);rerender()})}rerender()},
  addTask:text=>{const v=String(text||'').trim();if(!v)return false;const r=addTask('note',v,v);rerender();return !!r},
  sync:()=>tfAct('button',{id:'autosync'}),
  qs:()=>!!state.qs
});
/* the React Home replaces the old one once the shell says it can draw it; the welcome and quick start stay as they are */
const _homeRoute=routes.home;
routes.home=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('home')&&!state.qs&&!isNew()?'':_homeRoute()};
const _demoBar=demoBar;demoBar=function(){return window.TF_UI&&TF_UI.owns?'':_demoBar()};
/* live game info arrives after the first paint; let the shell know */
const _loadWS=loadWS;loadWS=async function(){const r=await _loadWS();tfNotify();return r};
/* pages the shell draws have no old controls to wire up */
const _bindPage=bindPage;bindPage=function(r){if(window.TF_UI&&TF_UI.owns&&TF_UI.owns(r))return;return _bindPage(r)};
