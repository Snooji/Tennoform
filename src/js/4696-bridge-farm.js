/* ---------- bridge: Farm finder for the React page ---------- */
/* embedded old markup ("islands"): rebuilt when a button inside is used, kept as is when a step is ticked so open sections stay open */
let ISLV=0;
document.addEventListener('click',e=>{if(e.target.closest('.tf-island')&&e.target.closest('button,a'))ISLV++},true);
const FFD={key:'',html:''};
function farmDetail(){const sel=state.farmSel||'';if(!sel)return '';const k=sel+'|'+ISLV;if(FFD.key!==k){FFD.key=k;FFD.html=detail(sel)}return FFD.html}
function farmData(){const ft=state.ffT||'all';const cats=ffCats(ft);const cat=cats.some(c=>c[0]===state.ffC)?state.ffC:'';const q=state.farmQ||'';
  const total=search('',ft,cat).length;const r=unvFilter(search(q,ft,cat));const lim=state.ffLim||60;
  const items=r.slice(0,lim).map(([n,t,l])=>{const it=t==='item'?MIX[n]:null;const left=it?mxp(it)-itemXP(n):0;return {n,t,label:l,key:t+'|'+n,xp:it?mxp(it):0,left,img:t==='item'||t==='part'?IMG(t==='part'?((partOwner(n)||{}).n||''):n):''}});
  const sel=state.farmSel||'';const si=sel.indexOf('|');
  return {q,ty:ft,cat,unv:!!state.unvOnly,types:FFT.map(([value,label])=>({value,label})),cats:cats.map(([c,n])=>({value:c,label:c,n})),
    total,count:r.length,items,more:Math.max(0,r.length-lim),filtered:!!(q||ft!=='all'||cat||state.unvOnly),
    sel,selName:si>0?sel.slice(si+1):'',detail:farmDetail()}}
Object.assign(window.TF,{
  farm:()=>farmData(),
  farmSet:o=>{if(o.q!=null)state.farmQ=o.q;if(o.ty!=null){state.ffT=o.ty;state.ffC=''}if(o.cat!=null)state.ffC=o.cat;if(o.unv!=null)state.unvOnly=o.unv;state.ffLim=60;saveUI();tfNotify()},
  farmClear:()=>{state.farmQ='';state.ffT='all';state.ffC='';state.unvOnly=false;state.ffLim=60;saveUI();tfNotify()},
  farmMore:()=>{state.ffLim=(state.ffLim||60)+60;tfNotify()},
  farmPick:key=>{state.farmSel=key||null;tfNotify()},
  island:el=>{if(el)refresh(el)}
});
/* picks from anywhere (search, links inside details) land in the React page instead of the old #fdet panel */
document.addEventListener('click',e=>{const t=e.target.closest('[data-pick]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('farm')))return;
  e.preventDefault();e.stopPropagation();state.farmSel=t.dataset.pick;if(HASH()!=='#farm')GO('farm');else tfNotify()},true);
const _farmRoute=routes.farm;
routes.farm=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('farm')?'':_farmRoute()};
