/* ---------- market ---------- */
function market(){const tab=state.mkTab;
  let h=`<div class="stack"><div class="head"><div class="eyebrow">warframe.market · snapshot ${esc(D.meta.prices)}</div><h1>Market</h1></div>
  <div class="seg">${[['sets','Prime sets'],['vault','Vault tracker']].map(([k,l])=>`<button class="btn ${tab===k?'on':''}" data-mk="${k}">${l}</button>`).join('')}</div>`;
  h+=tab==='vault'?vaultTab():setsTab();return h+'</div>'}
function setsTab(){const rows=Object.entries(D.sets).map(([n,s])=>{const base=n.replace(/ Set$/,'');const it=I[base];let ps=0,du=0,okp=true;
    if(it){const parts=it.parts.filter(p=>p.k==='p');const names=[base+' Blueprint',...parts.filter(p=>p.n!=='Blueprint').map(p=>p.full)];
      names.forEach(x=>{const p=PR[x];if(p&&(p.a7??p.a30)!=null)ps+=(p.a7??p.a30);else okp=false});parts.forEach(p=>du+=p.du||0)}
    const sl=(SEL[n]||[]).filter(x=>x[0]!=='__buy');
    return {n,base,it,a7:s.a7,a30:s.a30,v7:s.v7,ps:okp&&ps?Math.round(ps):null,du:du||null,low:sl[0]?sl[0][1]:null}});
  const q=state.mkQ.toLowerCase();const mf=state.mkF||'all';let r=rows.filter(x=>!q||x.n.toLowerCase().includes(q)).filter(x=>{const v=VAULT[x.base]||{};return mf==='all'||(mf==='farm'&&x.it&&!x.it.v&&!v.now)||(mf==='vault'&&x.it&&x.it.v&&!v.now)||(mf==='now'&&v.now)||(mf==='goals'&&(P.goals||[]).includes(x.base))});const k=state.mkSort;
  r.sort((a,b)=>k==='n'?a.n.localeCompare(b.n):k==='low'?((a.low??1e9)-(b.low??1e9)):((b[k]??-1)-(a[k]??-1)));
  return `<p class="small muted" style="margin:0">7-day average sale price, the cheapest online seller when the snapshot was taken, and a ready-to-paste whisper. Sellers go offline, so check <b>Live listings</b> before you trade.</p>
  <div class="row"><input id="mq" type="search" placeholder="Filter sets" value="${esc(state.mkQ)}" style="flex:1 1 200px" aria-label="Filter sets"><select id="msort" aria-label="Sort by" style="flex:0 1 200px">${[['a7','7-day price'],['low','Cheapest seller'],['v7','Trades'],['ps','Parts total'],['du','Ducats'],['n','Name']].map(([c,l])=>`<option value="${c}" ${k===c?'selected':''}>Sort: ${l}</option>`).join('')}</select>${`<select id="mkf" aria-label="Filter sets" style="width:auto">${[['all','All sets'],['farm','Farmable now'],['now','In Prime Resurgence'],['vault','Vaulted'],['goals','In my goals']].map(([k,l])=>`<option value="${k}" ${(state.mkF||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}</div>
  ${countLine(r.length,rows.length,'sets',!!(q||mf!=='all'),'mkclear')}<div class="cards">${r.map(x=>`<div class="card cut"><div class="top"><a class="nm ln" href="#" data-go="item|${esc(x.base)}">${esc(x.base)}</a><span class="row" style="gap:4px">${mxChip(x.base)}${vaultChip(x.it)}</span></div>
   <div class="row small"><span class="chip gold">${x.a7!=null?Math.round(x.a7)+'p':'—'} avg</span><span class="muted">Parts ${x.ps!=null?x.ps+'p':'—'} · ${fmt(x.v7)} trades/wk${x.du?` · ${x.du} ducats`:''}</span></div>
   ${sellerRow(x.n)}<div><a class="small" href="https://warframe.market/items/${MS[x.n]||''}" target="_blank" rel="noopener">Live listings ↗</a></div></div>`).join('')}</div>`}
function vaultTab(){const primes=Object.values(I).filter(i=>i.p);
  const isNow=i=>VAULT[i.n]&&VAULT[i.n].now;
  const now=primes.filter(isNow),farm=primes.filter(i=>!i.v&&!isNow(i)),vault=primes.filter(i=>i.v&&!isNow(i));
  vault.sort((a,b)=>((VAULT[a.n]||{}).est||'9').localeCompare((VAULT[b.n]||{}).est||'9'));farm.sort((a,b)=>(a.evd||'9').localeCompare(b.evd||'9'));
  const card=i=>{const v=VAULT[i.n]||{};return `<div class="card cut"><div class="top"><a class="nm ln" href="#" data-go="item|${esc(i.n)}">${esc(i.n)}</a><span class="chip">${esc(i.c)}</span></div><div class="small muted">${
    v.now?`In Varzia's Prime Resurgence until <b style="color:var(--ok)">${fdate(v.now)}</b> at ${esc(D.vtnow.loc||"Maroo's Bazaar")}. Buy its relics with Aya or Regal Aya.`:
    !i.v?(i.evd?`Drops from relics now. Expected to vault around <b>${fdate(i.evd)}</b>.`:'Drops from relics now. Not scheduled to vault.'):
    `Vaulted${i.vd?' since '+fdate(i.vd):''}.${v.last?` Last in Resurgence ${fdate(v.last)}.`:' Not seen in Resurgence yet.'}${v.est?` Rough estimate for its return: <b style="color:var(--gold)">${fdate(v.est)}</b>.`:''}`}</div></div>`};
  return `<p class="small muted" style="margin:0">Prime Resurgence brings back two vaulted Warframes with their weapons every 4 weeks. Return dates are rough estimates from each pair's past appearances (typical gap about ${Math.round(D.medgap/30)} months). Digital Extremes doesn't publish a schedule.</p>
  <details class="obj grp" open><summary><h3>Unvaulted now: Prime Resurgence</h3><span class="chip ok">${now.length}</span></summary><div class="cards" style="padding:10px">${now.map(card).join('')||'<div class="empty">Nothing right now.</div>'}</div></details>
  <details class="obj grp" open><summary><h3>Farmable from relics</h3><span class="chip teal">${farm.length}</span></summary><div class="cards" style="padding:10px">${farm.map(card).join('')}</div></details>
  <details class="obj grp"><summary><h3>Vaulted · soonest return first</h3><span class="chip bad">${vault.length}</span></summary><div class="cards" style="padding:10px">${vault.map(card).join('')}</div></details>`}

