/* ---------- bridge: Guides for the React page ---------- */
routes.guides=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('guides')?'':guides()};
function guideCard(g){const st=guideSteps(g.id),n=(g.steps||[]).length;const u=guideUnlock(g);
  return {id:g.id,n:g.n,kind:g.kind,sum:g.sum||'',time:g.time||'',steps:n,doneSteps:Math.min(st.length,n),ready:u.ready,done:g.kind==='quest'&&qDone(g.n)}}
function guidesData(){const f=state.gF||'all',q=(state.gQ||'').toLowerCase().trim();
  const words=q.split(/\s+/).filter(w=>w&&!CMD_STOP.has(w));
  const match=g=>!words.length||words.every(w=>[g.n,...(g.aka||[]),g.sum||''].join(' ').toLowerCase().includes(w));
  const all=GUIDES.filter(match);const list=all.filter(g=>f==='all'||g.kind===f).map(guideCard);
  const counts={all:all.length,quest:all.filter(g=>g.kind==='quest').length,system:all.filter(g=>g.kind==='system').length,mode:all.filter(g=>g.kind==='mode').length};
  const g=GIDX[state.gSel];let sel=null;
  if(g){const st=guideSteps(g.id);const u=guideUnlock(g);
    const needs=GUIDES.filter(x=>x.id!==g.id&&((x.unlock||{}).quests||[]).includes(g.n)).map(x=>({id:x.id,n:x.n,kind:x.kind}));
    sel={...guideCard(g),aka:g.aka||[],unlock:u,fast:g.fast||[],rw:g.rw||[],w:g.w||'',
      stepList:(g.steps||[]).map((s,i)=>({t:s.t,tip:s.tip||'',done:st.includes(i)})),
      go:(g.go||[]).map(n=>({n,key:guideKey(n)})).filter(x=>x.key),
      opens:needs,questKey:g.kind==='quest'&&Q.some(x=>x.n===g.n)?'quest|'+g.n:'',
      hasTask:(P.tasks||[]).some(t=>!t.d&&t.k==='guide'&&t.r===g.id)}}
  return {filter:f,q:state.gQ||'',counts,list,sel,total:GUIDES.length}}
Object.assign(window.TF,{
  guides:()=>guidesData(),
  guidesSet:o=>{if(o.filter!=null)state.gF=o.filter;if(o.q!=null)state.gQ=o.q;if('sel' in o){state.gSel=o.sel;window.scrollTo(0,0)}tfNotify()},
  guideStep:(id,i,v)=>{P.gd=P.gd||{};const a=new Set(P.gd[id]||[]);if(v)a.add(i);else a.delete(i);P.gd[id]=[...a].sort((x,y)=>x-y);if(!P.gd[id].length)delete P.gd[id];saveProfile();tfNotify()},
  guideReset:id=>{const prev=(P.gd||{})[id];if(!prev)return;delete P.gd[id];saveProfile();tfNotify();
    if(window.TF_UI)TF_UI.toast('Steps cleared',{label:'Undo',fn:()=>{P.gd=P.gd||{};P.gd[id]=prev;saveProfile();tfNotify()}})},
  guideTask:id=>{const g=GIDX[id];if(!g)return;if(addTask('guide',g.id,(g.kind==='quest'?'Finish ':g.kind==='system'?'Unlock ':'Try ')+g.n))toast('Added to your tasks');tfNotify()}
});
