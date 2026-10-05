/* ---------- bridge: Resources for the React page ---------- */
const RSD={key:'',html:''};
function resData(){const sel=state.resSel&&RES[state.resSel]?state.resSel:'';const q=(state.resQ||'').toLowerCase().trim();
  const main=MAINRES.filter(n=>RES[n]);const rest=Object.keys(RES).filter(n=>!main.includes(n)).sort();
  const gneed={};(P.goals||[]).filter(n=>I[n]&&!on('build|'+n)).forEach(n=>{const a=totals(n,1,{cr:0,r:{},pt:0},[]);for(const r in a.r)gneed[r]=(gneed[r]||0)+a.r[r]});
  const rf=state.rsF||'all';let list=q?Object.keys(RES).filter(n=>n.toLowerCase().includes(q)):null;
  if(rf!=='all'){list=(list||Object.keys(RES)).filter(n=>rf==='inv'?(P.inv&&P.inv[n]!=null):rf==='goal'?gneed[n]:rf==='short'?(gneed[n]&&!(P.inv&&+P.inv[n]>=gneed[n])):RT[n]);list.sort()}
  const row=n=>({n,have:P.inv&&P.inv[n]!=null?+P.inv[n]:null,label:RT[n]?'by stage':(RSRC[n]||[]).length+' farms',need:gneed[n]||0});
  if(sel){const k=sel+'|'+ISLV;if(RSD.key!==k){RSD.key=k;RSD.html=resDetail(sel)}}
  return {q:state.resQ||'',filter:rf,sel,total:Object.keys(RES).length,list:list?list.map(row):null,main:list?[]:main.map(row),rest:list?[]:rest.map(row),detail:sel?RSD.html:''}}
Object.assign(window.TF,{
  res:()=>resData(),
  resSet:o=>{if(o.q!=null)state.resQ=o.q;if(o.f!=null)state.rsF=o.f;saveUI();tfNotify()},
  resPick:n=>{state.resSel=n||null;tfNotify()}
});
const _resRoute=routes.resources;
routes.resources=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('resources')?'':_resRoute()};
