/* ---------- bridge: Achievements for the React page ---------- */
function achData(){const p=state.lgP||'today';const L=logList();const since=logSince(p);const list=L.filter(e=>e.t>=since);const s=logSum(list);
  const t=totalXP(),m=mrInfo(t.total);const vis=c=>gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]);const dd=allChecks().filter(c=>c[0]==='d'&&vis(c)),wd=allChecks().filter(c=>c[0]==='w'&&vis(c));
  let tiles;
  if(p==='all')tiles=[{k:'Mastery XP',v:fmt(t.total),x:'MR '+mrLabel(m.mr)+(L.length?' · +'+fmt(logSum(L).xp)+' logged here':'')},{k:'Items mastered',v:fmt(MI.filter(i=>itemXP(i.n)>=mxp(i)).length),x:fmt(MI.length)+' in the game'},
    {k:'Star chart nodes',v:fmt(ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length),x:fmt(ALLN.filter(n=>!isJ(n)).length)+' in total'},{k:'Quests done',v:fmt(Q.filter(q=>qDone(q.n)).length),x:Q.length+' in total'}];
  else tiles=[{k:'Mastery XP gained',v:'+'+fmt(s.xp),x:s.rk?s.rk+' rank'+(s.rk>1?'s':'')+' gained':'',xp:s.xp},{k:'Items mastered',v:fmt(s.m),x:s.b?s.b+' built':''},
    {k:'Checklist ticks',v:fmt(s.dw),x:p==='today'?'Today '+dd.filter(ckDone).length+'/'+dd.length:'Weekly items '+wd.filter(ckDone).length+'/'+wd.length},{k:'Nodes · quests · tasks',v:`${s.n} · ${s.q} · ${s.t}`,x:''}];
  const days=[];{const t0=lastDaily();for(let i=6;i>=0;i--){const a=t0-i*DAY,b=a+DAY;const de=L.filter(e=>e.t>=a&&e.t<b);days.push({label:new Date(a).toLocaleDateString([],{weekday:'short',timeZone:'UTC'}),n:de.length,xp:de.reduce((q,e)=>q+(e.xp||0),0),today:i===0})}}
  const groups=[];for(const e of list){const d=new Date(e.t).toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'});let g=groups[groups.length-1];if(!g||g.d!==d){g={d,items:[]};groups.push(g)}
    const extra=e.k==='sync'||e.k==='bulk'?[e.items?e.items+' mastered':'',e.nodes?e.nodes+' nodes':'',e.qs?e.qs+' quests':''].filter(Boolean).join(' · '):e.k==='dw'?(e.per==='d'?'Daily':'Weekly')+' checklist':e.k==='t'?'Task':'';
    g.items.push({id:e.id,k:e.k,label:e.label,time:new Date(e.t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}),extra,xp:e.xp||0,canUndo:e.k!=='sync'})}
  const note=p==='today'?`Since the daily reset (${lt(lastDaily())} your time).`:p==='week'?`Since the weekly reset (Monday ${lt(lastWeekly())} your time).`:L.length?`Your log keeps the last ${LOG_MAX} things you did, back to ${fdate(new Date(L[L.length-1].t).toISOString())}.`:'';
  return {period:p,tiles,days,groups,note,empty:!list.length}}
Object.assign(window.TF,{
  ach:()=>achData(),
  achSet:p=>{state.lgP=p;saveUI();tfNotify()},
  logUndo:id=>logUndo(id)
});
const _achRoute=routes.achievements;
routes.achievements=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('achievements')?'':_achRoute()};
