/* ---------- activity log: what you did today, this week and all time, with undo ---------- */
Object.assign(IC,{undo:'M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',chev:'M6 9l6 6 6-6',bars:'M5 20v-8M12 20V5M19 20v-6',map:'M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z',
  book:'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',list:'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',trophy:'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8'});
const LOG_MAX=400;
function logList(){return Array.isArray(P.log)?P.log:(P.log=[])}
function logAdd(e){if(LOGMUTE)return null;const L=logList();e.id=newId();e.t=Date.now();L.unshift(e);if(L.length>LOG_MAX)L.length=LOG_MAX;return e}
function logDrop(key,k){const L=logList();const i=L.findIndex(x=>x.key===key&&(!k||x.k===k));if(i>=0){L.splice(i,1);return true}return false}
const LOGK={m:'Mastered',n:'Cleared',sp:'Cleared on Steel Path',q:'Completed quest',build:'Built',bp:'Got blueprint',part:'Got'};
function logKeyInfo(key,v0){const p=key.split('|'),k=p[0];if(!LOGK[k])return null;
  if(k==='m'){const it=I[p[1]];return {k,label:'Mastered '+p[1],xp:it?mxp(it)-v0:0}}
  if(k==='n'||k==='sp'){const nd=NX[p[1]];return {k,label:LOGK[k]+' '+(nd?nd.n+' ('+nd.p+')':p[1]),xp:nd&&!isJ(nd)?nd.x||0:0}}
  if(k==='q')return {k,label:'Completed '+p[1],xp:0};
  if(k==='build')return {k,label:'Built '+p[1],xp:0};
  if(k==='bp')return {k,label:'Got the '+p[1]+' Blueprint',xp:0};
  if(k==='part')return {k,label:'Got '+p[1]+' '+p[2],xp:0};return null}

/* one switch for every place that ticks a key, a rank, a checklist item or a task */
const _setK0=setK;
setK=function(k,v){if(LOGMUTE)return _setK0(k,v);const was=on(k);const n=k.startsWith('m|')?k.slice(2):null;const v0=n&&I[n]?itemXP(n):0;const pr=n?P.rk[n]:undefined;
  _setK0(k,v);if(was===!!v)return;
  if(v){const inf=logKeyInfo(k,v0);if(inf){const e={...inf,key:k};if(n&&pr!=null)e.pr=pr;logAdd(e);saveProfile()}}
  else if(logDrop(k))saveProfile()};
const _setRank0=setRank;
setRank=function(n,r){const from=rankOf(n),x0=itemXP(n);LOGMUTE++;let out;try{out=_setRank0(n,r)}finally{LOGMUTE--}const to=rankOf(n);if(to===from||LOGMUTE)return out;
  const it=I[n],mx=maxRank(it),L=logList(),top=L.find(x=>x.key==='rk|'+n);
  if(top&&L.indexOf(top)<3&&Date.now()-top.t<10*60e3){top.to=to;top.xp=(top.xp||0)+itemXP(n)-x0;top.t=Date.now();if(top.to===top.from)L.splice(L.indexOf(top),1);else top.label=to>=mx?'Mastered '+n:n+' rank '+top.from+' → '+to}
  else logAdd({k:'rk',key:'rk|'+n,label:to>=mx?'Mastered '+n:n+' rank '+from+' → '+to,from,to,xp:itemXP(n)-x0});
  saveProfile();return out};
function logDW(id,v){if(!v){logDrop(id,'dw');return}const c=allChecks().find(x=>x[1]===id);let label=c?c[2]:id;
  if(id.startsWith('nw|')&&WS&&WS.nightwave){const a=(WS.nightwave.activeChallenges||[]).find(x=>'nw|'+x.id===id);label='Nightwave: '+(a?a.title:'act')}
  logAdd({k:'dw',key:id,label,per:c?c[0]:'w'})}
const _toggleTask0=toggleTask;
toggleTask=async function(id,v){const x=(P.tasks||[]).find(t=>t.id===id);const r=await _toggleTask0(id,v);if(x){if(v)logAdd({k:'t',key:'t|'+id,label:x.t});else logDrop('t|'+id,'t');saveProfile()}return r};

/* bulk changes (sync, max all, a whole planet) log one line; the line can undo the whole change */
function logSnap(){return {c:{...C},rk:{...P.rk},xp:totalXP().total}}
function logSummary(k,label,a,undoable){if(LOGMUTE)return;const on1=Object.keys(C).filter(e=>!a.c[e]),off=Object.keys(a.c).filter(e=>!C[e]);const rk={};
  for(const n of new Set([...Object.keys(a.rk),...Object.keys(P.rk)]))if(a.rk[n]!==P.rk[n])rk[n]=a.rk[n]==null?null:a.rk[n];
  const xp=totalXP().total-a.xp;if(!on1.length&&!off.length&&!Object.keys(rk).length&&!xp)return;
  const items=on1.filter(e=>e.startsWith('m|')).length,nodes=on1.filter(e=>/^(n|sp)\|/.test(e)).length,qs=on1.filter(e=>e.startsWith('q|')).length;
  const e={k,key:k+'|'+Date.now(),label,xp,items,nodes,qs};if(undoable&&on1.length+off.length<=600){e.on=on1;e.off=off;e.rk=rk}logAdd(e);saveProfile()}
function logBulk(label,fn){const a=logSnap();LOGMUTE++;try{fn()}finally{LOGMUTE--}logSummary('bulk',label,a,true)}

/* undo: put things back the way they were and drop the line */
function logUndo(id){const L=logList();const e=L.find(x=>x.id===id);if(!e)return;LOGMUTE++;
  try{if(e.k==='rk'){const n=e.key.slice(3);_setRank0(n,e.from)}
    else if(e.k==='m'){const n=e.key.slice(2);_setK0(e.key,0);if(e.pr!=null)P.rk[n]=e.pr}
    else if(LOGK[e.k])_setK0(e.key,0);
    else if(e.k==='dw'){if(P.dw)delete P.dw[e.key]}
    else if(e.k==='t'){const x=(P.tasks||[]).find(t=>'t|'+t.id===e.key);if(x){x.d=0;x.dat=0}}
    else if(e.on){e.on.forEach(k=>{delete C[k]});e.off.forEach(k=>{C[k]=1});for(const n in e.rk){if(e.rk[n]==null)delete P.rk[n];else P.rk[n]=e.rk[n]}if(typeof pushAll==='function')pushAll();lsSet('tenno-codex',C)}}
  finally{LOGMUTE--}
  L.splice(L.indexOf(e),1);if(typeof UNDO!=='undefined'&&UNDO)clearTimeout(UNDO.tm);saveProfile();updateMR();rerender();toast('Undone: '+e.label)}

/* achievements page */
function logSince(p){return p==='today'?lastDaily():p==='week'?lastWeekly():0}
function logSum(list){const s={xp:0,m:0,rk:0,n:0,q:0,dw:0,t:0,b:0};for(const e of list){s.xp+=e.xp||0;
  if(e.k==='m'||(e.k==='rk'&&e.label.startsWith('Mastered')))s.m++;if(e.k==='rk')s.rk+=Math.max(0,(e.to||0)-(e.from||0));if(e.k==='n'||e.k==='sp')s.n++;if(e.k==='q')s.q++;if(e.k==='dw')s.dw++;if(e.k==='t')s.t++;if(e.k==='build')s.b++;
  if(e.items)s.m+=e.items;if(e.nodes)s.n+=e.nodes;if(e.qs)s.q+=e.qs}return s}
const LOGIC={m:'star',rk:'bars',n:'map',sp:'map',q:'book',build:'check',bp:'check',part:'check',dw:'cal',t:'list',sync:'repeat',bulk:'check'};
function logRow(e){const tm=new Date(e.t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});const canUndo=e.k!=='sync';
  const extra=e.k==='sync'||e.k==='bulk'?[e.items?e.items+' mastered':'',e.nodes?e.nodes+' nodes':'',e.qs?e.qs+' quests':''].filter(Boolean).join(' · '):e.k==='dw'?(e.per==='d'?'Daily':'Weekly')+' checklist':e.k==='t'?'Task':'';
  return `<li class="lgrow"><span class="lgic" aria-hidden="true">${ic(LOGIC[e.k]||'check')}</span><span class="lgt"><span class="lgl">${esc(e.label)}</span><span class="small muted">${tm}${extra?' · '+esc(extra):''}</span></span>
   ${e.xp?`<span class="chip mxc">${e.xp>0?'+':''}${fmt(e.xp)} XP</span>`:'<span></span>'}${canUndo?`<button type="button" class="btn sm" data-logundo="${esc(e.id)}" aria-label="Undo: ${esc(e.label)}">${ic('undo')}Undo</button>`:'<span class="small muted lgnote">Sync</span>'}</li>`}
function achievements(){const p=state.lgP||'today';const L=logList();const since=logSince(p);const list=L.filter(e=>e.t>=since);const s=logSum(list);
  const t=totalXP(),m=mrInfo(t.total);const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length,nodes=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,qd=Q.filter(q=>qDone(q.n)).length;
  const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1])),wd=allChecks().filter(c=>c[0]==='w'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));
  const tile=(k,v,x)=>`<div class="tile"><span class="k">${k}</span><span class="v num">${v}</span>${x?`<span class="x">${x}</span>`:''}</div>`;
  let tiles;
  if(p==='all')tiles=tile('Mastery XP',fmt(t.total),'MR '+mrLabel(m.mr)+(L.length?' · +'+fmt(s.xp)+' logged here':''))+tile('Items mastered',fmt(maxed),MI.length+' in the game')+tile('Star chart nodes',fmt(nodes),ALLN.filter(n=>!isJ(n)).length+' in total')+tile('Quests done',fmt(qd),Q.length+' in total');
  else tiles=tile('Mastery XP gained','+'+fmt(s.xp),s.rk?s.rk+' rank'+(s.rk>1?'s':'')+' gained':'')+tile('Items mastered',fmt(s.m),s.b?s.b+' built':'')+tile('Checklist ticks',fmt(s.dw),p==='today'?'Today '+dd.filter(ckDone).length+'/'+dd.length:'Weekly items '+wd.filter(ckDone).length+'/'+wd.length)+tile('Nodes · quests · tasks',`${s.n} · ${s.q} · ${s.t}`,'');
  const days=[];if(p!=='today'){const t0=lastDaily();for(let i=6;i>=0;i--){const a=t0-i*DAY,b=a+DAY;const de=L.filter(e=>e.t>=a&&e.t<b);days.push({a,n:de.length,xp:de.reduce((q,e)=>q+(e.xp||0),0)})}}
  const mx=Math.max(1,...days.map(d=>d.n));
  const groups=[];for(const e of list){const d=new Date(e.t).toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'});let g=groups[groups.length-1];if(!g||g.d!==d){g={d,items:[]};groups.push(g)}g.items.push(e)}
  return `<div class="stack"><div class="head"><div class="eyebrow">Today</div><h1>Achievements</h1><p class="lede">Everything you've ticked off, ranked up or mastered. Tapped something by mistake? Undo it here.</p></div>
   ${segBtns('lgp',p,[['today','Today'],['week','This week'],['all','All time']])}
   <div class="tiles">${tiles}</div>
   ${days.length?`<section class="panel lgweek" aria-label="Last 7 days"><div class="lgbars">${days.map(d=>`<div class="lgday" title="${d.n} things · +${fmt(d.xp)} XP"><span class="lgb"><i style="height:${(d.n/mx*100).toFixed(0)}%"></i></span><span class="small muted">${new Date(d.a).toLocaleDateString([],{weekday:'short',timeZone:'UTC'})}</span><span class="small num">${d.n}</span></div>`).join('')}</div></section>`:''}
   <p class="small muted" style="margin:0">${p==='today'?`Since the daily reset (${lt(lastDaily())} your time).`:p==='week'?`Since the weekly reset (Monday ${lt(lastWeekly())} your time).`:L.length?`Your log keeps the last ${LOG_MAX} things you did, back to ${fdate(new Date(L[L.length-1].t).toISOString())}.`:''}</p>
   ${groups.length?groups.map(g=>`<section class="obj"><div class="obj-h"><h3>${esc(g.d)}</h3></div><ul class="lglist">${g.items.map(logRow).join('')}</ul></section>`).join('')
     :`<div class="panel empty stack" style="gap:8px;text-align:left"><b>${p==='today'?'Nothing yet today.':p==='week'?'Nothing yet this week.':'Nothing logged yet.'}</b><span class="small">Tick a checklist item on <a class="ln" href="#today">Today</a>, update a rank on <a class="ln" href="#ranks">Ranks</a>, or finish a task, and it shows up here.</span></div>`}
  </div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-lgp],[data-logundo]');if(!t)return;
  if(t.dataset.lgp){state.lgP=t.dataset.lgp;saveUI();rerender();return}
  if(t.dataset.logundo){logUndo(t.dataset.logundo)}});
