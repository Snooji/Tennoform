/* ---------- farm finder: "ways to farm" things that aren't one item drop (credits, standing, Endo, affinity, Focus, Forma...) ---------- */
const WAYS=D.ways||[];const WBN=Object.fromEntries(WAYS.map(w=>[w.n,w]));
LAZY.ways={done:WAYS.length>0,busy:false,err:false,add:j=>{WAYS.push(...j);Object.assign(WBN,Object.fromEntries(j.map(w=>[w.n,w])))}};
FFT.splice(1,0,['way','Credits, standing & more']);
const _buildIdx=buildIdx;buildIdx=function(){_buildIdx();for(const w of WAYS)IDX.push([w.n,'way',w.cat,w.cat])};
const wayText=w=>[w.n,...(w.aka||[])].join(' ').toLowerCase();
const _search=search;search=function(q,ty,cat){const r=_search(q,ty,cat);const ql=(q||'').toLowerCase().trim();if(!ql||(ty&&ty!=='all'&&ty!=='way'))return r;
  const w=ql.split(/\s+/);const have=new Set(r.filter(x=>x[1]==='way').map(x=>x[0]));
  const extra=WAYS.filter(x=>!have.has(x.n)&&(!cat||x.cat===cat)&&w.every(t=>wayText(x).includes(t))).map(x=>[x.n,'way',x.cat,x.cat]);
  return [...r.filter(x=>x[1]==='way'),...extra,...r.filter(x=>x[1]!=='way')]};
const _detail=detail;detail=function(sel){return sel.startsWith('way|')?'':_detail(sel)};
/* Platinum: things that are easy to farm and sell well on warframe.market, ranked by platinum you can expect per attempt
   (price × chance from one relic opening or one mission run). Only things that actually sell: 10+ sold last week, 8p or more. */
const PF_CH={C:.2533,U:.11,R:.02};const PF_RL={C:'Common',U:'Uncommon',R:'Rare'};
function platFarms(){const sells=n=>{const p=PR[n];const v=p&&(p.a7??p.a30);return MS[n]&&v>=8&&(p.v7||0)>=10?{price:Math.round(v),sold:p.v7||0}:null};
  const row=(n,kind,how,chance,img)=>{const s=sells(n);return s?{n,kind,how,chance:Math.round(chance*1000)/10,price:s.price,sold:s.sold,per:Math.round(s.price*chance*10)/10,img:img||'',key:''}:null};
  const parts=[];for(const [n,rels] of Object.entries(D.partrel||{})){let best=null;
    for(const [r,rar] of rels){const R=REL[r];if(!R||R.v||!(R.loc&&R.loc.length))continue;const c=PF_CH[rar]||0;if(!best||c>best.c)best={r,rar,c,where:String(R.loc[0][0]).trim()}}
    if(best){const x=row(n,'Prime part',`${best.r} relic (${PF_RL[best.rar]||best.rar}). Relic from ${best.where}`,best.c,IMG(typeof partOwner==='function'?(partOwner(n)||n):n));if(x){x.key='part|'+n;parts.push(x)}}}
  /* drops are random (chance under 100%); a 100% "drop" is a syndicate or vendor offering bought with standing */
  const drops=[],offers=[];
  for(const [src,kind,pre] of [[MODS,'Mod','mod'],[ARC,'Arcane','arc']])for(const [n,m] of Object.entries(src)){
    const dr=(m.dr||[]).map(d=>[String(d[0]).replace(/\s+/g,' ').trim(),d[1]]);const rnd=dr.filter(d=>d[1]<100).sort((a,b)=>b[1]-a[1])[0],off=dr.find(d=>d[1]>=100);
    if(rnd){const x=row(n,kind,rnd[0],rnd[1]/100);if(x){x.key=pre+'|'+n;drops.push(x)}}
    else if(off){const x=row(n,kind,'From '+off[0].replace(new RegExp(',\\s*'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'),''),1);if(x){x.key=pre+'|'+n;offers.push(x)}}}
  const by=a=>a.sort((x,y)=>y.per-x.per||y.sold-x.sold).slice(0,6);
  return {date:D.meta.prices||'',groups:[{t:'Prime parts from relics you can farm now',per:'per relic opened',items:by(parts)},
    {t:'Mod and arcane drops',per:'per run',items:by(drops)},
    {t:'Buy with syndicate or vendor standing, sell for platinum',per:'each',items:offers.sort((x,y)=>y.price*Math.min(y.sold,100)-x.price*Math.min(x.sold,100)).slice(0,6)}].filter(g=>g.items.length)}}
function wayData(n){const w=WBN[n];if(!w)return null;
  return {n:w.n,cat:w.cat,sum:w.sum||'',w:w.w||'',tips:w.tips||[],hasTask:(P.tasks||[]).some(t=>!t.d&&t.k==='way'&&t.r===w.n),
    ways:(w.ways||[]).map(x=>({t:x.t,how:x.how||'',why:x.why||'',req:x.req||'',tags:x.tags||[],node:x.node||'',planet:x.planet||''})),plat:w.n==='Platinum'?platFarms():null}}
const _farmData=farmData;farmData=function(){lazyLoad('ways');const d=_farmData();d.waysLoading=lazyLoading('ways');const s=d.sel||'';
  if(s.startsWith('way|')){d.way=wayData(s.slice(4));d.detail=d.way?'way':''}else d.way=null;
  d.items.forEach(it=>{if(it.t==='way')it.img=''});return d};
TF.farm=()=>farmData();
/* main search: ways sit right after guides */
const _cmdIndex2=cmdIndex;cmdIndex=function(){if(CMDX)return CMDX;const x=_cmdIndex2();for(const w of WAYS)x.push({n:w.n,g:'Farming',act:'way|'+w.n,l:w.n.toLowerCase(),a:[...(w.aka||[]),'farm',w.cat].join(' ').toLowerCase()});return CMDX=x};
CMDG.splice(1,0,'Farming');
Object.assign(window.TF,{wayTask:n=>{const w=WBN[n];if(!w)return;if(addTask('way',w.n,'Farm '+w.n))toast('Added to your tasks');tfNotify()}});
