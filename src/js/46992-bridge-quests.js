/* ---------- bridge: Quests for the React page ---------- */
function rewardOf(r){const m=Object.keys(I).find(n=>r.toLowerCase().startsWith(n.toLowerCase()+' ')||r===n);if(m){const it=MIX[m];return {text:r,go:'item|'+m,left:it?mxp(it)-itemXP(m):0,xp:it?mxp(it):0}}
  const go=RES[r]?'res|'+r:MODS[r]?'mod|'+r:ARC[r]?'arc|'+r:'';return {text:r,go,left:0,xp:0}}
function questsData(){const f=state.qF||'all';const nq=nextQuest();const groups=[...new Set(Q.map(q=>q.g))];
  return {filter:f,next:nq?nq.n:'',focus:state.qFocus||'',total:Q.length,done:Q.filter(q=>qDone(q.n)).length,
    groups:groups.map(g=>{const all=Q.filter(q=>q.g===g);const qs=all.filter(q=>{const lk=qPrereqs(q).some(p=>!qDone(p.n));return f==='all'||(f==='done'&&qDone(q.n))||(f==='todo'&&!qDone(q.n))||(f==='locked'&&!qDone(q.n)&&lk)||(f==='avail'&&!qDone(q.n)&&!lk)});
      return {name:g,done:all.filter(q=>qDone(q.n)).length,total:all.length,quests:qs.map(q=>{const pre=qPrereqs(q);return {n:q.n,id:'q-'+q.n.replace(/\W/g,''),done:qDone(q.n),locked:pre.some(p=>!qDone(p.n)),desc:q.d||'',wiki:q.w||'',
        req:q.req.map(r=>{const p=pre.find(x=>qClean(r)===x.n);return p?{text:r,quest:p.n,done:qDone(p.n)}:{text:r,quest:'',done:false}}),rewards:q.rw.map(rewardOf),
        guide:(guideOfQuest(q.n)||{}).id||'',hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='quest'&&x.r===q.n),upto:Q.indexOf(q)>0}})}}).filter(g=>g.quests.length)}}
function questUndoToast(label,key){const e=logList().find(x=>x.key===key);toastAction(label,'Undo',()=>{if(e)logUndo(e.id)})}
Object.assign(window.TF,{
  quests:()=>questsData(),
  questsSet:o=>{if(o.f!=null)state.qF=o.f;saveUI();tfNotify()},
  questTick:(n,v)=>{setK('q|'+n,v?1:0);tfNotify();if(v)questUndoToast('Completed '+n,'q|'+n)},
  questUpto:n=>{const q=Q.find(x=>x.n===n);if(!q)return;const idx=Q.indexOf(q);const arc=/^Arc/.test(q.g);
    logBulk('Quests up to '+n,()=>Q.forEach((o,i)=>{if(i<=idx&&(arc?/^Arc/.test(o.g):o.g===q.g))setK('q|'+o.n,1)}));tfNotify();
    const e=logList()[0];toastAction('Marked quests up to '+n+' complete','Undo',()=>{if(e&&e.k==='bulk')logUndo(e.id)})},
  questFocused:()=>{state.qFocus=null}
});
/* quest links from anywhere open the React list at that quest */
document.addEventListener('click',e=>{const t=e.target.closest('[data-q]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('quests')))return;
  e.preventDefault();e.stopPropagation();state.qFocus=t.dataset.q;if(HASH()!=='#quests')GO('quests');else tfNotify()},true);
const _questsRoute=routes.quests;
routes.quests=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('quests')?'':_questsRoute()};
