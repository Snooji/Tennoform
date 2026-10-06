/* ---------- farm finder: "ways to farm" things that aren't one item drop (credits, standing, Endo, affinity, Focus, Forma...) ---------- */
const WAYS=D.ways||[];const WBN=Object.fromEntries(WAYS.map(w=>[w.n,w]));
FFT.splice(1,0,['way','Credits, standing & more']);
const _buildIdx=buildIdx;buildIdx=function(){_buildIdx();for(const w of WAYS)IDX.push([w.n,'way',w.cat,w.cat])};
const wayText=w=>[w.n,...(w.aka||[])].join(' ').toLowerCase();
const _search=search;search=function(q,ty,cat){const r=_search(q,ty,cat);const ql=(q||'').toLowerCase().trim();if(!ql||(ty&&ty!=='all'&&ty!=='way'))return r;
  const w=ql.split(/\s+/);const have=new Set(r.filter(x=>x[1]==='way').map(x=>x[0]));
  const extra=WAYS.filter(x=>!have.has(x.n)&&(!cat||x.cat===cat)&&w.every(t=>wayText(x).includes(t))).map(x=>[x.n,'way',x.cat,x.cat]);
  return [...r.filter(x=>x[1]==='way'),...extra,...r.filter(x=>x[1]!=='way')]};
const _detail=detail;detail=function(sel){return sel.startsWith('way|')?'':_detail(sel)};
function wayData(n){const w=WBN[n];if(!w)return null;
  return {n:w.n,cat:w.cat,sum:w.sum||'',w:w.w||'',tips:w.tips||[],hasTask:(P.tasks||[]).some(t=>!t.d&&t.k==='way'&&t.r===w.n),
    ways:(w.ways||[]).map(x=>({t:x.t,how:x.how||'',why:x.why||'',req:x.req||'',tags:x.tags||[],node:x.node||'',planet:x.planet||''}))}}
const _farmData=farmData;farmData=function(){const d=_farmData();const s=d.sel||'';
  if(s.startsWith('way|')){d.way=wayData(s.slice(4));d.detail=d.way?'way':''}else d.way=null;
  d.items.forEach(it=>{if(it.t==='way')it.img=''});return d};
TF.farm=()=>farmData();
/* main search: ways sit right after guides */
const _cmdIndex2=cmdIndex;cmdIndex=function(){if(CMDX)return CMDX;const x=_cmdIndex2();for(const w of WAYS)x.push({n:w.n,g:'Farming',act:'way|'+w.n,l:w.n.toLowerCase(),a:[...(w.aka||[]),'farm',w.cat].join(' ').toLowerCase()});return CMDX=x};
CMDG.splice(1,0,'Farming');
Object.assign(window.TF,{wayTask:n=>{const w=WBN[n];if(!w)return;if(addTask('way',w.n,'Farm '+w.n))toast('Added to your tasks');tfNotify()}});
