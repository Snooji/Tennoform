/* ---------- bridge: Tasks for the React page ---------- */
function actOf(x){const g=taskGo(x);if(!g)return null;const a={};g.replace(/([\w-]+)="([^"]*)"/g,(_,k,v)=>{a[k]=v.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')});return {tag:'a',attrs:a}}
function tasksData(){taskResets();const f=state.tkF||'open',so=state.tkS||'new';const all=P.tasks||[];let L2=all.slice();
  L2=L2.filter(x=>f==='all'||(f==='open'&&!x.d)||(f==='done'&&x.d)||(f==='shared'&&((x.with||[]).length||x.from))||(f===x.k));
  L2.sort((a,b)=>so==='due'?((a.due||'9999')<(b.due||'9999')?-1:(a.due||'9999')>(b.due||'9999')?1:b.at-a.at):so==='old'?a.at-b.at:so==='kind'?(a.k||'').localeCompare(b.k||'')||b.at-a.at:b.at-a.at);rv('tkS',L2);
  const dn=all.filter(x=>x.d).length;
  return {filter:f,sort:so,todo:all.length-dn,done:dn,signedIn:!!SO.uid,friends:(SO.friends||[]).filter(x=>!x.pending).map(x=>({uid:x.uid,name:x.name||'Friend'})),
    list:L2.map(x=>({id:x.id,title:x.t,kind:x.k&&x.k!=='note'?(TKL[x.k]||x.k):'',done:!!x.d,due:x.due||'',over:!!(x.due&&!x.d&&new Date(x.due+'T23:59:59')<new Date()),rep:x.rep||'',note:x.note||'',
      with:(x.with||[]).map(w=>w.name||'Friend'),from:x.from?x.from.name||'Friend':'',open:actOf(x)}))}}
Object.assign(window.TF,{
  tasks:()=>tasksData(),
  tasksSet:o=>{if(o.f!=null)state.tkF=o.f;if(o.s!=null)state.tkS=o.s;saveUI();tfNotify()},
  taskUndone:async id=>{await toggleTask(id,false);rerender()},
  taskEdit:(id,o)=>{const y=(P.tasks||[]).find(t=>t.id===id);if(!y)return;if(o.note!=null)y.note=String(o.note).slice(0,1000);if(o.rep!=null){if(o.rep)y.rep=o.rep;else delete y.rep}if(o.due!=null){if(o.due)y.due=o.due;else delete y.due}
    if(o.title!=null&&String(o.title).trim())y.t=String(o.title).trim().slice(0,120);saveProfile();tfNotify()},
  taskDel:id=>{const L=P.tasks||[];const i=L.findIndex(x=>x.id===id);if(i<0)return;const x=L[i];L.splice(i,1);saveProfile();tfNotify();
    toastAction('Deleted “'+x.t.slice(0,40)+'”','Undo',()=>{P.tasks=P.tasks||[];P.tasks.splice(Math.min(i,P.tasks.length),0,x);saveProfile();tfNotify()})},
  taskClearDone:()=>{const was=(P.tasks||[]).slice();const n=was.filter(x=>x.d).length;if(!n)return;P.tasks=was.filter(x=>!x.d);saveProfile();tfNotify();
    toastAction(`Cleared ${n} done task${n===1?'':'s'}`,'Undo',()=>{P.tasks=was;saveProfile();tfNotify()})},
  taskInvite:(id,uid)=>tfAct('button',{'data-tinvite':id+'|'+uid})
});
const _tasksRoute=routes.tasks;
routes.tasks=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('tasks')?'':_tasksRoute()};
