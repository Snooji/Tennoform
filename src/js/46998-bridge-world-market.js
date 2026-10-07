/* ---------- bridge: Open worlds and Market for the React pages ---------- */
function worldData(){const tab=state.wTab||'fish';const out={tab};
  if(tab==='fish'){const rg=state.fR||'Plains of Eidolon',rr=state.fRr||'all',tm=state.fT||'all';const regs=Object.keys(D.fishreg);const R=D.fishreg[rg]||{};
    const times=[...new Set(D.fish.filter(f=>f.reg===rg).map(f=>f.time))].filter(Boolean).sort();
    const all=D.fish.filter(f=>f.reg===rg);const list=all.filter(f=>(rr==='all'||f.r===rr||(rr==='todo'&&!on('fish|'+f.n)))&&(tm==='all'||f.time===tm));
    let cyc='';if(WS){const c=rg==='Plains of Eidolon'?WS.cetusCycle:rg==='Orb Vallis'?WS.vallisCycle:WS.cambionCycle;if(c)cyc=(c.state||c.active||'')+(c.timeLeft?' · '+c.timeLeft:'')}else if(HOSTED&&!WSerr)loadWS();
    Object.assign(out,{region:rg,regions:regs,rarity:rr,time:tm,times,cycle:cyc,info:{spears:R.sp||'',vendor:R.v||'',use:R.use||'',tips:R.tips||[]},caught:all.filter(f=>on('fish|'+f.n)).length,total:all.length,
      fish:list.map(f=>({n:f.n,key:'fish|'+f.n,done:on('fish|'+f.n),rarity:f.r,bio:f.bio,time:f.time,spear:f.sp||'any',bait:f.bait||'',spots:f.spots||[],gives:f.dr.map(d=>({n:d,go:linkKey(d)})),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='fish'&&x.r===f.n)}))})}
  else{const M2=D.mine;const rg=state.mR||'Plains of Eidolon';const R=M2.reg[rg];const row=(n,r,kind)=>({n,key:'ore|'+n,done:on('ore|'+n),rarity:r,kind,go:linkKey(n),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='ore'&&x.r===n)});
    Object.assign(out,{region:rg,regions:Object.keys(M2.reg),spots:R.spots,vendor:R.v,ores:[...R.ore.map(([n,r])=>row(n,r,'ore · red vein')),...R.gem.map(([n,r])=>row(n,r,'gem · blue vein'))],
      cutters:M2.cut.map(([n,w,d])=>({n,key:'cut|'+n,done:on('cut|'+n),where:w,desc:d})),tips:M2.tips})}
  return out}
function marketData(){const tab=state.mkTab||'sets';const out={tab,snapshot:D.meta.prices};
  if(tab==='sets'){const rows=Object.entries(D.sets).map(([n,s])=>{const base=n.replace(/ Set$/,'');const it=I[base];let ps=0,du=0,okp=true;
      if(it){const parts=it.parts.filter(p=>p.k==='p');const names=[base+' Blueprint',...parts.filter(p=>p.n!=='Blueprint').map(p=>p.full)];names.forEach(x=>{const p=PR[x];if(p&&(p.a7??p.a30)!=null)ps+=(p.a7??p.a30);else okp=false});parts.forEach(p=>du+=p.du||0)}
      const sl=(SEL[n]||[]).filter(x=>x[0]!=='__buy');return {n,base,it,a7:s.a7,a30:s.a30,v7:s.v7,ps:okp&&ps?Math.round(ps):null,du:du||null,low:sl[0]?sl[0][1]:null,b:sl[0]||null}});
    const q=(state.mkQ||'').toLowerCase().trim();const mf=state.mkF||'all';let r=rows.filter(x=>!q||x.n.toLowerCase().includes(q)).filter(x=>{const v=VAULT[x.base]||{};return mf==='all'||(mf==='farm'&&x.it&&!x.it.v&&!v.now)||(mf==='vault'&&x.it&&x.it.v&&!v.now)||(mf==='now'&&v.now)||(mf==='goals'&&(P.goals||[]).includes(x.base))});
    const k=state.mkSort||'a7';r.sort((a,b)=>k==='n'?a.n.localeCompare(b.n):k==='low'?((a.low??1e9)-(b.low??1e9)):((b[k]??-1)-(a[k]??-1)));rv('mkSort',r);const lim=state.mkLim||60;
    Object.assign(out,{q:state.mkQ||'',filter:mf,sort:k,total:rows.length,count:r.length,more:Math.max(0,r.length-lim),
      sets:r.slice(0,lim).map(x=>{const it=MIX[x.base];return {n:x.n,base:x.base,img:IMG(x.base),vault:vaultOf(x.it),left:it?mxp(it)-itemXP(x.base):0,xp:it?mxp(it):0,
        price:x.a7!=null?Math.round(x.a7):null,meta:[x.ps!=null?'Parts '+x.ps+'p':'',x.du?x.du+' ducats':'',x.v7?fmt(x.v7)+' sold a week':''].filter(Boolean).join(' · '),
        seller:x.b?{name:x.b[0],price:x.b[1],wh:whisper(x.n,x.b)}:null,url:'https://warframe.market/items/'+(MS[x.n]||'')}})})}
  else{const primes=Object.values(I).filter(i=>i.p);const isNow=i=>VAULT[i.n]&&VAULT[i.n].now;
    const now=primes.filter(isNow),farm=primes.filter(i=>!i.v&&!isNow(i)),vault=primes.filter(i=>i.v&&!isNow(i));
    vault.sort((a,b)=>((VAULT[a.n]||{}).est||'9').localeCompare((VAULT[b.n]||{}).est||'9'));farm.sort((a,b)=>(a.evd||'9').localeCompare(b.evd||'9'));
    const card=i=>{const v=VAULT[i.n]||{};return {n:i.n,c:i.c,img:IMG(i.n),text:v.now?`In Varzia's Prime Resurgence until ${fdate(v.now)} at ${D.vtnow.loc||"Maroo's Bazaar"}. Buy its relics with Aya or Regal Aya.`:
      !i.v?(i.evd?`Drops from relics now. Expected to vault around ${fdate(i.evd)}.`:'Drops from relics now. Not scheduled to vault.'):
      `Vaulted${i.vd?' since '+fdate(i.vd):''}.${v.last?` Last in Resurgence ${fdate(v.last)}.`:' Not seen in Resurgence yet.'}${v.est?` Rough estimate for its return: ${fdate(v.est)}.`:''}`}};
    Object.assign(out,{gapMonths:Math.round(D.medgap/30),now:now.map(card),farm:farm.map(card),vault:vault.map(card)})}
  return out}
Object.assign(window.TF,{
  world:()=>worldData(),
  worldSet:o=>{if(o.tab!=null)state.wTab=o.tab;if(o.region!=null){if((state.wTab||'fish')==='fish')state.fR=o.region;else state.mR=o.region}if(o.rarity!=null)state.fRr=o.rarity;if(o.time!=null)state.fT=o.time;saveUI();tfNotify()},
  market:()=>marketData(),
  marketSet:o=>{if(o.tab!=null)state.mkTab=o.tab;if(o.q!=null){state.mkQ=o.q;state.mkLim=60}if(o.f!=null){state.mkF=o.f;state.mkLim=60}if(o.sort!=null)state.mkSort=o.sort;saveUI();tfNotify()},
  marketMore:()=>{state.mkLim=(state.mkLim||60)+60;tfNotify()},
  whisper:t=>tfAct('button',{'data-wh':t})
});
const _worldRoute=routes.world,_marketRoute=routes.market;
routes.world=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('world')?'':_worldRoute()};
routes.market=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('market')?'':_marketRoute()};
