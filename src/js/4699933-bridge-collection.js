/* ---------- My collection: everything you own and everything you've mastered, across every category ---------- */
/* Owned = ranked, mastered, built or ticked as owned, minus anything marked "Don't own it". Mastery comes from ranks. */
function collectionData(){const f=state.colF||'owned',q=(state.colQ||'').toLowerCase().trim();let owned=0,mast=0,level=0,total=0;
  const cats=CATS.map(c=>{const all=MI.filter(i=>i.c===c);if(!all.length)return null;let o=0,m=0,l=0;
    const items=all.map(i=>{const has=ownedItem(i.n),r=rankOf(i.n),mx=maxRank(i),done=r>=mx;if(has)o++;if(done)m++;if(has&&!done)l++;return {n:i.n,img:IMG(i.n),r,mx,has,done}})
      .filter(x=>(f==='owned'?x.has:f==='mastered'?x.done:f==='level'?x.has&&!x.done:true)&&(!q||x.n.toLowerCase().includes(q))).sort((a,b)=>a.n.localeCompare(b.n));
    owned+=o;mast+=m;level+=l;total+=all.length;return {id:c,label:CATL[c],owned:o,mastered:m,level:l,total:all.length,items}}).filter(Boolean);
  const inv=Object.values(P.inv||{}).filter(v=>+v>0).length;
  return {f,q:state.colQ||'',owned,mastered:mast,level,total,inv,cats:cats.filter(c=>c.items.length||!q)}}
Object.assign(window.TF,{collection:()=>collectionData(),
  collectionSet:o=>{if(o.f!=null)state.colF=o.f;if(o.q!=null)state.colQ=o.q;saveUI();tfNotify()},
  showInRanks:n=>{state.rkQ=n;state.rkF='all';saveUI();location.hash='ranks';tfNotify()}});
routes.collection=function(){return ''};
