/* ---------- bridge: Ranks for the React page. The row order is kept while you edit, so rows don't jump under your finger. ---------- */
const RKC={key:'',order:[]};
function rkItem(n){const it=I[n];const r=rankOf(n),mx=maxRank(it);return {n,img:IMG(n),mr:it.mr||0,r,mx,xp:itemXP(n),max:mxp(it),per:perRank(it)}}
function ranksData(fresh){const cat=state.rkCat||'Warframe',qr=state.rkQ||'',q=qr.toLowerCase().trim(),f=state.rkF||'all',s=state.rkS||'name';const key=[cat,q,f,s].join('|');
  if(state._rkKey!==key){state._rkKey=key;state.rkLim=60;fresh=true}
  const cats=CATS.filter(c=>MI.some(i=>i.c===c)).map(c=>{const a=autoCat(c);return {id:c,label:CATL[c],m:a.m,t:a.t}}).concat([{id:'Intrinsics',label:'Intrinsics',m:0,t:0},{id:'Other',label:'Other gear',m:0,t:0}]);
  const base={cat,q:qr,f,s,cats,island:'',items:[],total:0,shown:0,notMax:0,head:{label:'',m:0,t:0,p:0,x:0,search:!!q}};
  if(!q&&(cat==='Intrinsics'||cat==='Other')){base.island=cat==='Intrinsics'?intrHTML():othHTML();base.head.label=cat==='Intrinsics'?'Intrinsics':'Other gear';base.head.x=cat==='Intrinsics'?catXP('rail')+catXP('drift'):othXP();return base}
  if(fresh||RKC.key!==key){let list=q?MI.filter(i=>i.n.toLowerCase().includes(q)):MI.filter(i=>i.c===cat);
    if(f==='notmax')list=list.filter(i=>rankOf(i.n)<maxRank(i));if(f==='todo')list=list.filter(i=>rankOf(i.n)===0);if(f==='prog')list=list.filter(i=>{const r=rankOf(i.n);return r>0&&r<maxRank(i)});if(f==='max')list=list.filter(i=>rankOf(i.n)>=maxRank(i));
    list.sort((a,b)=>s==='mr'?(a.mr||0)-(b.mr||0)||a.n.localeCompare(b.n):s==='close'?((mxp(a)-itemXP(a.n))||1e9)-((mxp(b)-itemXP(b.n))||1e9):s==='left'?(mxp(b)-itemXP(b.n))-(mxp(a)-itemXP(a.n)):a.n.localeCompare(b.n));
    RKC.key=key;RKC.order=list.map(i=>i.n)}
  state._rkList=RKC.order;const total=RKC.order.length,shown=Math.min(state.rkLim||60,total);
  base.items=RKC.order.slice(0,shown).map(rkItem);base.total=total;base.shown=shown;base.notMax=RKC.order.filter(n=>rankOf(n)<maxRank(I[n])).length;
  if(q)base.head.label='Search results';else{const a=autoCat(cat);Object.assign(base.head,{label:CATL[cat],m:a.m,t:a.t,p:a.p,x:a.x})}
  return base}
Object.assign(window.TF,{
  ranks:fresh=>ranksData(!!fresh),
  ranksSet:o=>{if(o.cat!=null){state.rkCat=o.cat;state.rkQ=''}if(o.q!=null)state.rkQ=o.q;if(o.f!=null)state.rkF=o.f;if(o.s!=null)state.rkS=o.s;saveUI();tfNotify()},
  ranksMore:all=>{state.rkLim=all?1e5:(state.rkLim||60)+60;tfNotify()},
  ranksRefresh:()=>{RKC.key='';tfNotify()},
  setRank:(n,r)=>{setRank(n,r);tfNotify()},
  maxAll:()=>{const L=(state._rkList||[]).filter(n=>!on('m|'+n));if(!L.length)return 0;logBulk('Maxed '+L.length+' items on Ranks',()=>L.forEach(n=>setRank(n,99)));updateMR();clearTimeout(RKT);
    toastAction(`Marked ${L.length} item${L.length===1?'':'s'} mastered`,'Undo',()=>{const e=logList()[0];if(e&&e.k==='bulk')logUndo(e.id)});return L.length}
});
const _ranksRoute=routes.ranks;
routes.ranks=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('ranks')?'':_ranksRoute()};
