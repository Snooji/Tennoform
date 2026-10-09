/* ---------- Foundry page: a planner for every blueprint (gear, plus Forma, Specters, keys, alloys... from build/crafts.json)
   and the build timers that used to live in Profile. Tracking a blueprint puts its materials on Goals and the to-do list. ---------- */
const CRAFT=D.crafts||{};
/* recipes for crafts: the same totals() the goals use, so tracked Forma or Specters add to the shopping list */
{const _t=totals;totals=function(name,mult,acc,seen){if(I[name]||!CRAFT[name])return _t(name,mult,acc,seen);const c=CRAFT[name];const runs=Math.ceil(mult/(c.q||1));
  acc.cr+=(c.cr||0)*runs;if(c.t)acc.pt=Math.max(acc.pt||0,c.t);
  for(const p of c.parts){if(p.k==='i'||(p.k==='r'&&CRAFT[p.n]&&!RES[p.n]))totals(p.n,p.q*runs,acc,[...seen,name]);
    else if(p.k==='p'){acc.cr+=(p.cr||0)*runs*p.q;(p.sub||[]).forEach(([n,q])=>acc.r[n]=(acc.r[n]||0)+q*runs*p.q)}else acc.r[p.n]=(acc.r[p.n]||0)+p.q*runs}
  return acc}}
const fdKind=n=>I[n]?I[n].c:CRAFT[n]?CRAFT[n].c==='Misc'?'Item':CRAFT[n].c:'';
const fdHave=n=>P.inv&&P.inv[n]!=null?+P.inv[n]:null;
const fdTracked=()=>[...(P.goals||[]).filter(n=>I[n]&&!on('build|'+n)).map(n=>({n,qty:1,kind:fdKind(n),gear:true})),...Object.entries(P.craftq||{}).filter(([n])=>CRAFT[n]).map(([n,q])=>({n,qty:q,kind:fdKind(n),gear:false}))];
function fdRow(n,q){const h=fdHave(n);return {n,need:q,have:h,left:Math.max(0,q-(h||0)),where:strip(farmFor(n)),go:RES[n]?'res|'+n:I[n]?'item|'+n:''}}
function fdDetail(n,qty){const it=I[n],c=CRAFT[n];if(!it&&!c)return null;qty=Math.max(1,qty||1);
  const parts=it?it.parts.map(p=>p.k==='p'?{n:p.full||it.n+' '+p.n,q:p.q*qty,sub:(p.sub||[]).map(([m,q])=>fdRow(m,q*p.q*qty)),cr:(p.cr||0)*qty,t:p.t||0}:fdRow(p.n,p.q*qty))
    :c.parts.map(p=>p.k==='p'?{n:p.n,q:p.q*Math.ceil(qty/(c.q||1)),sub:(p.sub||[]).map(([m,q])=>fdRow(m,q*p.q*Math.ceil(qty/(c.q||1)))),cr:(p.cr||0),t:p.t||0}:fdRow(p.n,p.q*Math.ceil(qty/(c.q||1))));
  const acc=totals(n,qty,{cr:0,r:{},pt:0},[]);
  const raw=Object.entries(acc.r).sort((a,b)=>b[1]-a[1]).map(([m,q])=>fdRow(m,q));
  const tracked=it?(P.goals||[]).includes(n):!!(P.craftq||{})[n];
  return {n,kind:fdKind(n),gear:!!it,img:it?IMG(n):'',qty,makes:c?c.q||1:1,credits:acc.cr,time:it?it.t||0:c.t||0,parts,raw,tracked,bp:it?strip(bpSource(it)):''}}
function foundryData(){const tab=state.fdTab||'planner';const q=(state.fdQ||'').toLowerCase().trim(),kind=state.fdK||'all';
  const names=[...Object.keys(I),...Object.keys(CRAFT)];const kinds=[...new Set(names.map(fdKind))].filter(Boolean).sort();
  let list=names.filter(n=>(kind==='all'||fdKind(n)===kind)&&(!q||q.split(/\s+/).every(w=>n.toLowerCase().includes(w))));
  list.sort((a,b)=>(q?(b.toLowerCase().startsWith(q)-a.toLowerCase().startsWith(q)):0)||a.localeCompare(b));
  const sel=state.fdSel&&(I[state.fdSel]||CRAFT[state.fdSel])?state.fdSel:'';
  const now=Date.now();const timers=(P.foundry||[]).length;const ready=(P.foundry||[]).filter(f=>now>=f.t0+f.dur*1000).length;
  return {tab,q:state.fdQ||'',kind,kinds:['all',...kinds],total:list.length,results:list.slice(0,80).map(n=>({n,kind:fdKind(n),img:I[n]?IMG(n):''})),
    sel,detail:sel?fdDetail(sel,state.fdQty||1):null,tracked:fdTracked(),timers,ready,html:tab==='timers'?foundryTab():''}}
function fdTrack(n,qty){if(I[n]){P.goals=P.goals||[];if(!P.goals.includes(n))P.goals.push(n)}else if(CRAFT[n]){P.craftq=P.craftq||{};P.craftq[n]=Math.max(1,qty||1)}else return;
  const d=fdDetail(n,qty);let added=0;P.tasks=P.tasks||[];
  for(const r of d.raw)if(r.left>0&&RES[r.n]&&!P.tasks.some(x=>!x.d&&x.k==='res'&&x.r===r.n)){P.tasks.unshift({id:newId(),t:'Farm '+fmt(r.left)+' '+r.n,k:'res',r:r.n,d:0,at:Date.now()});added++}
  saveProfile();tfNotify();toast(`Tracking ${n}${added?` · ${added} farming task${added===1?'':'s'} added`:''}`)}
function fdUntrack(n){if(I[n]){const i=(P.goals||[]).indexOf(n);if(i>=0)P.goals.splice(i,1)}else if(P.craftq)delete P.craftq[n];saveProfile();tfNotify()}
/* tracked crafts join the gear goals' shopping list on the Goals page */
{const _g=goalsData;goalsData=function(){const d=_g();const cq=Object.entries(P.craftq||{}).filter(([n])=>CRAFT[n]);d.crafts=cq.map(([n,q])=>({n,qty:q,kind:fdKind(n)}));if(!cq.length)return d;
  const acc={cr:0,r:{},pt:0};for(const [n,q] of cq)totals(n,q,acc,[]);d.credits+=acc.cr;const by=Object.fromEntries(d.shop.map(x=>[x.n,x]));
  for(const [n,q] of Object.entries(acc.r)){const h=+((P.inv||{})[n]||0),known=P.inv&&P.inv[n]!=null;
    if(by[n]){const x=by[n];x.need+=q;x.left=Math.max(0,x.need-h);x.task.label='Farm '+fmt(x.left)+' '+n}
    else if(!(d.short&&known&&h>=q)){const rem=Math.max(0,q-h);d.shop.push({n,need:q,have:known?h:null,left:rem,where:strip(farmFor(n)),task:{has:(P.tasks||[]).some(x=>!x.d&&x.k==='res'&&x.r===n),key:'res|'+n,label:'Farm '+fmt(rem)+' '+n}})}}
  d.shop.sort((a,b)=>b.need-a.need);return d}}
/* Foundry timers: crafts get their build time too */
{const _f=foundryFind;foundryFind=function(n){const r=_f(n);if(r!=null)return r;return CRAFT[n]?CRAFT[n].t||null:null}}
Object.assign(window.TF,{
  foundry:()=>foundryData(),
  foundrySet:o=>{if(o.tab!=null)state.fdTab=o.tab;if(o.q!=null)state.fdQ=o.q;if(o.kind!=null)state.fdK=o.kind;if(o.sel!==undefined){state.fdSel=o.sel||null;state.fdQty=o.sel&&CRAFT[o.sel]&&P.craftq&&P.craftq[o.sel]||1}if(o.qty!=null)state.fdQty=Math.max(1,Math.min(999,+o.qty||1));tfNotify()},
  foundryTrack:(n,q)=>fdTrack(n,q),foundryUntrack:n=>fdUntrack(n),
  foundryTimer:n=>{const d=foundryFind(n);P.foundry=P.foundry||[];P.foundry.push({id:Date.now().toString(36),n,t0:Date.now(),dur:d||43200});saveProfile();tfNotify();toast(n+' timer started')}
});
routes.foundry=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('foundry')?'':`<div class="panel">${foundryTab()}</div>`};
/* links to the timers (Home's "ready in the Foundry") open the Timers tab */
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-fdtimers]'))state.fdTab='timers'},true);
/* the Foundry tab moved out of Profile */
{const i=TTABS.findIndex(t=>t[0]==='foundry');if(i>=0)TTABS.splice(i,1);if(state.tTab==='foundry')state.tTab='profile'}
/* the timer box suggests crafts too */
{const _ft=foundryTab;foundryTab=function(){return _ft().replace('</datalist>',Object.keys(CRAFT).map(n=>`<option value="${esc(n)}">`).join('')+'</datalist>')}}
