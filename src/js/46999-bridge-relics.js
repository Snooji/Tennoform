/* ---------- bridge: Relics for the React page ---------- */
function relicsData(){const tab=state.rlTab||'mine';const out={tab};
  if(tab==='mine'){const mine=Object.keys(P.rel||{}).filter(r=>REL[r]&&relCount(r)>0);const ef=state.rlE||'all',so=state.rlO||'need';
    let list=mine.filter(r=>ef==='all'||REL[r].era===ef||(ef==='need'&&relicAdvice(r).need.length));const val=r=>relicEV(r,'i').pl;
    list.sort((a,b)=>so==='name'?a.localeCompare(b):so==='plat'?val(b)-val(a):so==='count'?relCount(b)-relCount(a):(relicAdvice(b).need.length-relicAdvice(a).need.length)||val(b)-val(a));
    Object.assign(out,{era:ef,sort:so,kinds:mine.length,tot:mine.reduce((a,r)=>a+relCount(r),0),totPl:Math.round(mine.reduce((a,r)=>a+val(r)*relCount(r),0)),withNeed:mine.filter(r=>relicAdvice(r).need.length).length,traces:+P.traces||0,
      cards:list.map(r=>{const R=REL[r];const a=relicAdvice(r);const x=P.rel[r]||{};return {r,vaulted:!!R.v,advice:{t:a.t,why:a.why,k:a.k},counts:{i:+x.i||0,e:+x.e||0,f:+x.f||0,r:+x.r||0},
        rewards:R.rw.map(([n,rr])=>({n,rar:rr,go:linkKey(n),need:!/Forma/.test(n)&&partNeeded(n),goal:!!partGoal(n),plat:pv(n)!=null?Math.round(pv(n)):null,du:partDu(n)||0})),evI:Math.round(relicEV(r,'i').pl),evR:Math.round(relicEV(r,'r').pl)}})})}
  else if(tab==='add'){const q=(state.raQ||'').toLowerCase().trim(),ef=state.raE||'all';
    const list=Object.keys(REL).filter(r=>(!q||r.toLowerCase().includes(q))&&(ef==='all'||REL[r].era===ef||(ef==='open'&&!REL[r].v)||(ef==='need'&&REL[r].rw.some(([n])=>!/Forma/.test(n)&&partNeeded(n)&&partGoal(n))))).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
    Object.assign(out,{q:state.raQ||'',filter:ef,total:list.length,list:list.slice(0,150).map(r=>{const R=REL[r];const rare=R.rw.find(x=>x[1]==='R');return {r,vaulted:!!R.v,rare:rare?rare[0]:'',count:+(((P.rel||{})[r]||{}).i)||0}})})}
  else{const so=state.duO||'ratio',f=state.duF||'all',q=(state.duQ||'').toLowerCase().trim();const dup=P.dup||{};
    let list=allParts().filter(x=>x.du&&(!q||x.n.toLowerCase().includes(q))).map(x=>({...x,r:x.p?x.du/x.p:null,c:+dup[x.n]||0}));
    list=list.filter(x=>f==='all'||(f==='mine'&&x.c>0)||(f==='baro'&&x.r!=null&&x.r>=10)||(f==='plat'&&x.p!=null&&x.p>=8)||(f==='junk'&&x.p!=null&&x.p<=4));
    list.sort((a,b)=>so==='plat'?((b.p??-1)-(a.p??-1)):so==='du'?b.du-a.du:so==='name'?a.n.localeCompare(b.n):so==='mine'?b.c-a.c:((b.r??-1)-(a.r??-1)));
    const mine=allParts().filter(x=>(+dup[x.n]||0)>0);const vt=WS&&WS.voidTrader;const now=new Date();const act=!!(vt&&new Date(vt.activation)<=now&&now<new Date(vt.expiry));if(HOSTED&&!WS&&!WSerr)loadWS();
    Object.assign(out,{q:state.duQ||'',filter:f,sort:so,snapshot:D.meta.prices,spares:mine.reduce((a,x)=>a+(+dup[x.n]),0),plat:Math.round(mine.reduce((a,x)=>a+(x.p||0)*(+dup[x.n]),0)),ducats:mine.reduce((a,x)=>a+(x.du||0)*(+dup[x.n]),0),
      baro:{state:vt?(act?'Here now':'Away'):'—',text:vt?(act?'leaves in '+untilIso(vt.expiry)+' · '+(vt.location||''):'arrives in '+untilIso(vt.activation)):!HOSTED?'live on the hosted site':WSerr?'live data unavailable':'checking…'},
      count:list.length,rows:list.slice(0,250).map(x=>({n:x.n,go:linkKey(x.n),plat:x.p!=null?Math.round(x.p):null,du:x.du,spares:x.c,tag:x.r!=null&&x.r>=10?'Baro':x.p!=null&&x.p>=8?'Sell':''})),
      stock:act&&vt.inventory?vt.inventory.map(i=>({item:i.item,go:linkKey(i.item),ducats:i.ducats,credits:i.credits})):[]})}
  return out}
const relClean=r=>{if(!relCount(r))delete P.rel[r]};
Object.assign(window.TF,{
  relics:()=>relicsData(),
  relicsSet:o=>{const m={tab:'rlTab',era:'rlE',sort:'rlO',raq:'raQ',rae:'raE',duq:'duQ',duf:'duF',duo:'duO'};for(const k in o)if(m[k])state[m[k]]=o[k];saveUI();tfNotify()},
  relAdj:(r,k,d)=>{P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,(+x[k]||0)+d);relClean(r);saveProfile();tfNotify()},
  relSet:(r,k,v)=>{P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,+v||0);relClean(r);saveProfile();tfNotify()},
  setTraces:v=>{P.traces=Math.max(0,+v||0);saveProfile();tfNotify()},
  setDup:(n,v)=>{P.dup=P.dup||{};const c=Math.max(0,+v||0);if(c)P.dup[n]=c;else delete P.dup[n];saveProfile();tfNotify()}
});
document.addEventListener('click',e=>{const t=e.target.closest('[data-rltab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('relics')))return;
  e.preventDefault();e.stopPropagation();state.rlTab=t.dataset.rltab;saveUI();if(location.hash!=='#relics')location.hash='relics';else tfNotify()},true);
const _relicsRoute=routes.relics;
routes.relics=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('relics')?'':_relicsRoute()};
