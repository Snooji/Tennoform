/* ---------- bridge: Warframes for the React page ---------- */
const FRT={key:'',html:''};
function framesData(){const ff=state.frF||'all';const allF=Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth');
  let fr=allF.filter(i=>{const r=rankOf(i.n);return ff==='all'||(ff==='owned'&&r>0)||(ff==='not'&&r===0)||(ff==='mastered'&&r>=maxRank(i))||(ff==='prime'&&i.p)||(ff==='farm'&&i.p&&!i.v)||(ff==='goals'&&(P.goals||[]).includes(i.n))}).map(i=>i.n).sort();
  const filteredEmpty=!fr.length;if(!fr.length)fr=allF.map(i=>i.n).sort();
  if(!state.frame||!I[state.frame]||!fr.includes(state.frame))state.frame=fr.includes('Saryn Prime')?'Saryn Prime':fr[0];
  const name=state.frame,base=baseOf(name);const builds=D.builds[base]||D.builds[name]||[];const bi=Math.max(0,Math.min(state.build||0,builds.length-1));
  const k=name+'|'+ISLV;if(FRT.key!==k){FRT.key=k;FRT.html=itemTree(name)}
  const modOf=(slot,m,arc)=>{const md=(arc?ARC[m]:MODS[m])||{};const key=(arc?'arc|':'mod|')+m;
    return {slot,m,key,pol:arc?'':(md.pol||''),done:on(key),price:strip(priceChip(m)),src:md.src?md.src:(md.dr&&md.dr.length?strip(dropsList(md.dr,2)):'Trade on warframe.market'),seller:sellerRow(m)}};
  let build=null;if(builds.length){const b=builds[bi];const sw=m=>state.budget&&D.budget[m]?D.budget[m]:m;
    build={role:b.role,helminth:b.helminth,notes:b.notes||'',mods:[modOf('Aura',sw(b.aura)),modOf('Exilus',sw(b.exilus)),...b.mods.map(m=>modOf('Mod',sw(m)))],arcanes:b.arcanes.map(a=>modOf('Arcane',a,true))}}
  return {filter:ff,filteredEmpty,list:fr,name,img:IMG(name),base,prime:I[base+' Prime']&&name!==base+' Prime'?base+' Prime':'',baseVer:name!==base&&I[base]?base:'',tree:FRT.html,
    builds:builds.map((b,i)=>({value:String(i),label:b.name})),bi:String(bi),budget:!!state.budget,build}}
Object.assign(window.TF,{
  frames:()=>framesData(),
  framesSet:o=>{if(o.f!=null)state.frF=o.f;if(o.frame!=null){state.frame=o.frame;state.build=0}if(o.build!=null)state.build=+o.build;if(o.budget!=null)state.budget=o.budget;saveUI();tfNotify()}
});
const _framesRoute=routes.frames;
routes.frames=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('frames')?'':_framesRoute()};
