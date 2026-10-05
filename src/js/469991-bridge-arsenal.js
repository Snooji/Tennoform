/* ---------- bridge: Builds (arsenal) for the React page ---------- */
function modSlot(slot,m,arc){const md=(arc?ARC[m]:MODS[m])||{};const key=(arc?'arc|':'mod|')+m;
  return {slot,m,key,pol:arc?'':(md.pol||''),done:on(key),price:strip(priceChip(m)),src:md.src?md.src:(md.dr&&md.dr.length?strip(dropsList(md.dr,2)):'Trade on warframe.market'),seller:sellerRow(m)}}
const ART={key:'',html:''};
function buildsData(src,kind){const cats=[...new Set(Object.keys(src).map(n=>I[n]?I[n].c:'Other'))].sort();const cf=kind==='w'?(state.wbC||'all'):'all',of=state.wbO||'all';
  let names=Object.keys(src).filter(n=>(cf==='all'||(I[n]&&I[n].c===cf))&&(of==='all'||(of==='own'&&ownedItem(n))||(of==='not'&&!ownedItem(n))||(of==='unmastered'&&!on('m|'+n)))).sort();
  const filteredEmpty=!names.length;if(!names.length)names=Object.keys(src).sort();
  const key=kind==='w'?'wbSel':'cbSel';let cur=state[key];if(!cur||!names.includes(cur))cur=names[0];state[key]=cur;
  const bs=src[cur]||[];const bi=Math.max(0,Math.min(state.wbI||0,bs.length-1));const b=bs[bi];
  const k=cur+'|'+ISLV;if(ART.key!==k){ART.key=k;ART.html=I[cur]?itemTree(cur):''}
  return {cats:kind==='w'?cats:[],cat:cf,own:of,names,cur,img:IMG(cur),filteredEmpty,tree:ART.html,builds:bs.map((x,i)=>({value:String(i),label:x.name})),bi:String(bi),
    build:b?{role:b.role,name:b.name,notes:b.notes||'',mods:[...(b.exilus?[modSlot('Exilus',b.exilus)]:[]),...b.mods.map(m=>modSlot('Mod',m))],arcanes:b.arcanes.map(a=>modSlot('Arcane',a,true))}:null}}
function arsenalData(){const tab=state.aTab||'builds';const out={tab};
  if(tab==='builds')Object.assign(out,buildsData(D.wbuilds,'w'));
  else if(tab==='comp')Object.assign(out,buildsData(D.cbuilds,'c'));
  else if(tab==='lich'){const ff=state.lF||'all',sf=state.lS||'all';const L2=P.lich||{};const own=n=>on('lich|'+n)||ownedItem(n);
    const list=D.lich.filter(w=>(ff==='all'||w.f===ff)&&(sf==='all'||(sf==='own'&&own(w.n))||(sf==='miss'&&!own(w.n))||(sf==='low'&&own(w.n)&&(+((L2[w.n]||{}).b)||0)<60)||(sf==='unm'&&!on('m|'+w.n)))).sort((a,b)=>a.f.localeCompare(b.f)||a.n.localeCompare(b.n));
    Object.assign(out,{faction:ff,status:sf,total:D.lich.length,have:D.lich.filter(w=>own(w.n)).length,mastered:D.lich.filter(w=>on('m|'+w.n)).length,
      factions:['Kuva','Tenet','Coda'].map(f=>{const a=D.lich.filter(w=>w.f===f);return {f,have:a.filter(w=>own(w.n)).length,total:a.length}}),
      how:Object.entries(D.lichsrc).map(([f,s])=>({f,who:s.who,how:s.how,vanq:s.vanq,alt:s.alt})),elements:ELEM.slice(1),
      list:list.map(w=>{const v=L2[w.n]||{};const it=MIX[w.n];return {n:w.n,f:w.f,c:w.c,go:linkKey(w.n),own:own(w.n),key:'lich|'+w.n,rank:rankOf(w.n)&&!on('m|'+w.n)?rankOf(w.n):0,left:it?mxp(it)-itemXP(w.n):0,xp:it?mxp(it):0,price:strip(priceChip(w.n)),el:v.e||'',bonus:+v.b||0}})})}
  else if(tab==='arc'){const q=(state.arQ||'').toLowerCase().trim(),tf=state.arT||'all',sf=state.arS||'all',so=state.arO||'use';const A=P.arc||{};const U2=arcUses();
    const types=[...new Set(Object.values(ARC).map(a=>a.ty).filter(Boolean))].sort();
    let list=Object.values(ARC).filter(a=>(!q||a.n.toLowerCase().includes(q))&&(tf==='all'||a.ty===tf)).filter(a=>{const c=+A[a.n]||0,mx=arcCopies(a.mx||5);return sf==='all'||(sf==='used'&&U2[a.n])||(sf==='own'&&c>0)||(sf==='max'&&c>=mx)||(sf==='part'&&c>0&&c<mx)||(sf==='none'&&!c)});
    list.sort((a,b)=>so==='name'?a.n.localeCompare(b.n):so==='price'?((pv(b.n)??-1)-(pv(a.n)??-1)):so==='need'?((arcCopies(b.mx||5)-(+A[b.n]||0))-(arcCopies(a.mx||5)-(+A[a.n]||0))):(((U2[b.n]?U2[b.n].size:0)-(U2[a.n]?U2[a.n].size:0))||a.n.localeCompare(b.n)));
    Object.assign(out,{q:state.arQ||'',type:tf,status:sf,sort:so,types,count:Object.keys(ARC).length,owned:Object.values(ARC).filter(a=>(+A[a.n]||0)>0).length,maxed:Object.values(ARC).filter(a=>(+A[a.n]||0)>=arcCopies(a.mx||5)).length,
      arcs:list.slice(0,200).map(a=>{const c=+A[a.n]||0,mx=a.mx||5,need=arcCopies(mx);const u=U2[a.n];return {n:a.n,go:linkKey(a.n),copies:c,need,maxRank:mx,rank:arcRank(c),price:strip(priceChip(a.n)),type:a.ty||'',uses:u?[...u]:[],drops:a.dr&&a.dr.length?strip(dropsList(a.dr,2)):''}})})}
  else{const sf=state.kmS||'all',tf=state.kmT||'all';const all=keyMods();const types=[...new Set(all.map(x=>x.md.ty).filter(Boolean))].sort();
    const list=all.filter(x=>(tf==='all'||x.md.ty===tf)&&(sf==='all'||(sf==='miss'&&!on('mod|'+x.n))||(sf==='have'&&on('mod|'+x.n))||(sf==='trade'&&x.md.tr)));
    Object.assign(out,{type:tf,status:sf,types,have:all.filter(x=>on('mod|'+x.n)).length,total:all.length,
      mods:list.map(x=>({n:x.n,go:linkKey(x.n),key:'mod|'+x.n,done:on('mod|'+x.n),price:strip(priceChip(x.n)),type:x.md.ty||'',uses:x.s.size,src:x.md.src?x.md.src:x.md.dr&&x.md.dr.length?strip(dropsList(x.md.dr,2)):'Trade on warframe.market'}))})}
  return out}
Object.assign(window.TF,{
  arsenal:()=>arsenalData(),
  arsenalSet:o=>{const m={tab:'aTab',cat:'wbC',own:'wbO',lf:'lF',ls:'lS',arq:'arQ',art:'arT',ars:'arS',aro:'arO',kmt:'kmT',kms:'kmS'};for(const k in o)if(m[k])state[m[k]]=o[k];
    if(o.sel!=null){state[(state.aTab||'builds')==='comp'?'cbSel':'wbSel']=o.sel;state.wbI=0}if(o.bi!=null)state.wbI=+o.bi;saveUI();tfNotify()},
  arcAdj:(n,d)=>{P.arc=P.arc||{};P.arc[n]=Math.max(0,(+P.arc[n]||0)+d);if(!P.arc[n])delete P.arc[n];saveProfile();tfNotify()},
  arcSet:(n,v)=>{P.arc=P.arc||{};const c=Math.max(0,+v||0);if(c)P.arc[n]=c;else delete P.arc[n];saveProfile();tfNotify()},
  lichSet:(n,o)=>{P.lich=P.lich||{};const v=P.lich[n]=P.lich[n]||{};if(o.e!=null)v.e=o.e;if(o.b!=null)v.b=Math.max(0,Math.min(60,+o.b||0));saveProfile();tfNotify()}
});
document.addEventListener('click',e=>{const t=e.target.closest('[data-atab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('arsenal')))return;
  e.preventDefault();e.stopPropagation();state.aTab=t.dataset.atab;saveUI();if(location.hash!=='#arsenal')location.hash='arsenal';else tfNotify()},true);
const _arsenalRoute=routes.arsenal;
routes.arsenal=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('arsenal')?'':_arsenalRoute()};
