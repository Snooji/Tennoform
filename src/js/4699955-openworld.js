/* ---------- open worlds: one search across fishing, mining and conservation, also in the Farm finder ---------- */
/* Every fish, ore, gem and animal gets a guide (where, when, what to bring, what it gives) under the key ow|<name>.
   They show up in the Farm finder as the "Open worlds" type and in the search on the Open worlds page. */
function owEntries(){const out=[];
  for(const f of D.fish||[])out.push({n:f.n,kind:'Fish',reg:f.reg,r:f.r,f});
  for(const rg in (D.mine&&D.mine.reg)||{}){const R=D.mine.reg[rg];for(const [n,r] of R.ore||[])out.push({n,kind:'Ore',reg:rg,r});for(const [n,r] of R.gem||[])out.push({n,kind:'Gem',reg:rg,r})}
  for(const w of (typeof CONSERVATION!=='undefined'?CONSERVATION.worlds:[]))for(const a of w.species)out.push({n:a.n,kind:'Animal',reg:w.world,r:(a.rare||[]).length?'Has rare variants':'',a,w});
  return out}
let OWX=null;const owIndex=()=>OWX||(OWX=Object.fromEntries(owEntries().map(e=>[e.n,e])));
const OW_DO={Fish:'Fishing',Ore:'Mining',Gem:'Mining',Animal:'Conservation'};
{const _b=buildIdx;buildIdx=function(){_b();for(const e of Object.values(owIndex()))IDX.push([e.n,'ow',e.kind+' · '+e.reg,OW_DO[e.kind]])}}
FFT.push(['ow','Open worlds']);
const owKey=e=>e.kind==='Fish'?'fish|'+e.n:e.kind==='Animal'?'animal|'+e.n:'ore|'+e.n;
function owGuide(e){const rows=[];const it=(k,v)=>v?rows.push(`<div><b>${k}:</b> ${esc(v)}</div>`):0;
  if(e.kind==='Fish'){const f=e.f,R=(D.fishreg||{})[e.reg]||{};it('Where',`${e.reg}, ${f.bio||'any water'}`);it('When',f.time);it('Spear',f.sp||R.sp);it('Bait',f.bait||'None needed');
    if(f.spots&&f.spots.length)it('Good spots',f.spots.join('; '));if(f.dr&&f.dr.length)rows.push(`<div><b>Gives:</b> ${f.dr.map(x=>RES[x]?L(x):esc(x)).join(', ')}</div>`);it('Sell or trade',R.v?R.v+'. '+(R.use||''):'')}
  else if(e.kind==='Animal'){const a=e.a;it('Where',`${e.reg}: ${a.where}`);it('When',a.time);it('How to call it',a.lure);if(a.variants&&a.variants.length)it('Variants',a.variants.join(', ')+((a.rare||[]).length?` (rare: ${a.rare.join(', ')})`:''));
    it('Perfect captures give',a.reward);it('Tip',a.tip);it('Vendor',e.w.vendor)}
  else{const R=D.mine.reg[e.reg];it('Where',e.reg);it('Vein',e.kind==='Ore'?'Red veins (ores)':'Blue veins (gems)');if(R.spots&&R.spots.length)it('Best spots',R.spots.join('; '));
    it('Cutter',e.r==='Rare'||e.r==='Special'?'Advanced cutter or Sunpoint Plasma Drill for the best odds':'Any cutter');it('Sell or trade',R.v)}
  return rows.join('')}
function owDetail(n){const e=owIndex()[n];if(!e)return '';const k=owKey(e);
  return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3><span class="chip">${esc(e.kind)} · ${esc(e.reg)}</span>${e.r?`<span class="chip ${/Rare|Legendary|Special/.test(e.r)?'gold':''}">${esc(e.r)}</span>`:''}<span style="margin-left:auto">${taskBtn(e.kind==='Fish'?'fish':e.kind==='Animal'?'animal':'ore',n,(e.kind==='Fish'?'Catch ':e.kind==='Animal'?'Capture ':'Mine ')+n)}</span></div></div>
  <div style="padding:12px 14px" class="small stack">${owGuide(e)}<label class="row" style="gap:8px">${ck(k)} ${e.kind==='Fish'?'Caught':e.kind==='Animal'?'Captured':'Mined'}</label></div></section>`}
{const _d=detail;detail=function(sel){return sel.startsWith('ow|')?owDetail(sel.slice(3)):_d(sel)}}
/* the search on the Open worlds page */
function owSearch(q){q=String(q||'').toLowerCase().trim();if(q.length<2)return [];const w=q.split(/\s+/);
  return Object.values(owIndex()).filter(e=>{const hay=(e.n+' '+e.kind+' '+e.reg+' '+(e.f?e.f.bio+' '+e.f.time:'')+(e.a?' '+e.a.where+' '+(e.a.time||'')+' '+(e.a.variants||[]).join(' '):'')).toLowerCase();return w.every(x=>hay.includes(x))})
    .sort((a,b)=>(b.n.toLowerCase().startsWith(q)-a.n.toLowerCase().startsWith(q))||a.n.localeCompare(b.n)).slice(0,30)
    .map(e=>({n:e.n,kind:e.kind,reg:e.reg,r:e.r,done:on(owKey(e)),key:'ow|'+e.n,line:e.kind==='Fish'?[e.f.bio,e.f.time].filter(Boolean).join(' · '):e.kind==='Animal'?[e.a.time,e.a.where].filter(Boolean).join(' · ').slice(0,120):e.kind==='Ore'?'Red vein':'Blue vein'}))}
/* conservation tab data */
function conservationData(){const C=typeof CONSERVATION!=='undefined'?CONSERVATION:null;if(!C)return null;const rg=state.cvR&&C.worlds.some(w=>w.world===state.cvR)?state.cvR:C.worlds[0].world;
  const w=C.worlds.find(x=>x.world===rg);return {steps:C.steps,regions:C.worlds.map(x=>x.world),region:rg,vendor:w.vendor,species:w.species.map(a=>({...a,key:'animal|'+a.n,done:on('animal|'+a.n),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='animal'&&x.r===a.n)}))}}
{const _w=worldData;worldData=function(){if(state.wTab==='cons')return {tab:'cons',region:'',regions:[],cons:conservationData()};return _w()}}
Object.assign(window.TF,{worldSearch:q=>owSearch(q),conservation:()=>conservationData(),conservationSet:r=>{state.cvR=r;tfNotify()}});
/* a link from another page into the Farm finder opens its guide straight away on a phone too */
let FARM_JUMP=false;{const _g=go;go=function(t){const was=HASH();_g(t);FARM_JUMP=was!=='#farm'&&HASH()==='#farm'}}
addEventListener('hashchange',()=>{if(HASH()!=='#farm')FARM_JUMP=false});
window.TF.farmJumped=()=>FARM_JUMP;
