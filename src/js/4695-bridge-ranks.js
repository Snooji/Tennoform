/* ---------- bridge: Ranks for the React page. The row order is kept while you edit, so rows don't jump under your finger. ---------- */
const RKC={key:'',order:[]};
function relicsDrop(n){const it=I[n];if(!it||!it.p||ownedItem(n))return false;const has=rel=>(rel||[]).some(([r])=>relCount(r)>0);
  if(!on('bp|'+n)&&has(it.bprel))return true;return it.parts.some(p=>p.k==='p'&&p.n!=='Blueprint'&&!on('part|'+n+'|'+p.n)&&has(p.rel))}
function rkItem(n){const it=I[n];const r=rankOf(n),mx=maxRank(it);const v=VAULT[n]||{};
  return {n,img:IMG(n),mr:it.mr||0,r,mx,xp:itemXP(n),max:mxp(it),per:perRank(it),prime:!!it.p,vaulted:!!(it.p&&it.v&&!v.now),resurgence:!!v.now,owned:ownedItem(n)&&r<mx,notOwned:on('nown|'+n),has:ownedItem(n),relics:relicsDrop(n)}}
function ranksData(fresh){const cat=state.rkCat||'Warframe',qr=state.rkQ||'',q=qr.toLowerCase().trim(),f=state.rkF||'all',s=state.rkS||'name';const key=[cat,q,f,s,state.rkT||'all',SREV.rkS?1:0].join('|');
  if(state._rkKey!==key){state._rkKey=key;state.rkLim=60;fresh=true}
  const cats=CATS.filter(c=>MI.some(i=>i.c===c)).map(c=>{const a=autoCat(c);return {id:c,label:CATL[c],m:a.m,t:a.t}}).concat([{id:'Intrinsics',label:'Intrinsics',m:0,t:0},{id:'Other',label:'Other gear',m:0,t:0}]);
  const base={cat,q:qr,f,s,t:state.rkT||'all',cats,island:'',items:[],total:0,shown:0,notMax:0,head:{label:'',m:0,t:0,p:0,x:0,search:!!q}};
  if(!q&&(cat==='Intrinsics'||cat==='Other')){base.island=cat==='Intrinsics'?intrHTML():othHTML();base.head.label=cat==='Intrinsics'?'Intrinsics':'Other gear';base.head.x=cat==='Intrinsics'?catXP('rail')+catXP('drift'):othXP();return base}
  if(fresh||RKC.key!==key){let list=q?MI.filter(i=>i.n.toLowerCase().includes(q)||(I[i.n]&&I[i.n].parts.some(p=>(p.full||p.n).toLowerCase().includes(q)))):MI.filter(i=>i.c===cat);const ty=state.rkT||'all';if(ty==='prime')list=list.filter(i=>I[i.n]&&I[i.n].p);if(ty==='normal')list=list.filter(i=>!(I[i.n]&&I[i.n].p));if(ty==='relics')list=list.filter(i=>relicsDrop(i.n));
    if(f==='notmax')list=list.filter(i=>rankOf(i.n)<maxRank(i));if(f==='todo')list=list.filter(i=>rankOf(i.n)===0);if(f==='prog')list=list.filter(i=>{const r=rankOf(i.n);return r>0&&r<maxRank(i)});if(f==='max')list=list.filter(i=>rankOf(i.n)>=maxRank(i));if(f==='own')list=list.filter(i=>ownedItem(i.n));if(f==='nown')list=list.filter(i=>!ownedItem(i.n));
    list.sort((a,b)=>s==='mr'?(a.mr||0)-(b.mr||0)||a.n.localeCompare(b.n):s==='close'?((mxp(a)-itemXP(a.n))||1e9)-((mxp(b)-itemXP(b.n))||1e9):s==='left'?(mxp(b)-itemXP(b.n))-(mxp(a)-itemXP(a.n)):a.n.localeCompare(b.n));rv('rkS',list);
    RKC.key=key;RKC.order=list.map(i=>i.n)}
  state._rkList=RKC.order;const total=RKC.order.length,shown=Math.min(state.rkLim||60,total);
  base.items=RKC.order.slice(0,shown).map(rkItem);base.total=total;base.shown=shown;base.notMax=RKC.order.filter(n=>rankOf(n)<maxRank(I[n])).length;base.owned=RKC.order.filter(n=>ownedItem(n)).length;base.signedIn=signedIn();
  if(q)base.head.label='Search results';else{const a=autoCat(cat);Object.assign(base.head,{label:CATL[cat],m:a.m,t:a.t,p:a.p,x:a.x})}
  return base}
Object.assign(window.TF,{
  ranks:fresh=>ranksData(!!fresh),
  ranksSet:o=>{if(o.cat!=null){state.rkCat=o.cat;state.rkQ=''}if(o.q!=null)state.rkQ=o.q;if(o.f!=null)state.rkF=o.f;if(o.s!=null)state.rkS=o.s;if(o.t!=null)state.rkT=o.t;saveUI();tfNotify()},
  ranksMore:all=>{state.rkLim=all?1e5:(state.rkLim||60)+60;tfNotify()},
  ranksRefresh:()=>{RKC.key='';tfNotify()},
  setRank:(n,r)=>{setRank(n,r);tfNotify()},
  maxAll:()=>{const L=(state._rkList||[]).filter(n=>!on('m|'+n));if(!L.length)return 0;logBulk('Maxed '+L.length+' items on Ranks',()=>L.forEach(n=>setRank(n,99)));updateMR();clearTimeout(RKT);
    toastAction(`Marked ${L.length} item${L.length===1?'':'s'} mastered`,'Undo',()=>{const e=logList()[0];if(e&&e.k==='bulk')logUndo(e.id)});return L.length}
});
const _ranksRoute=routes.ranks;
routes.ranks=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('ranks')?'':_ranksRoute()};
