/* ---------- helminth ---------- */
function helminthTab(){const f=state.hF||'all';let fr=MI.filter(i=>i.c==='Warframe'&&!i.p&&!/Umbra$/.test(i.n)).map(i=>i.n).sort();
  const owned=n=>rankOf(n)>0||rankOf(n+' Prime')>0;
  if(f==='done')fr=fr.filter(n=>on('hel|'+n));if(f==='ready')fr=fr.filter(n=>!on('hel|'+n)&&owned(n));if(f==='todo')fr=fr.filter(n=>!on('hel|'+n));
  const all=MI.filter(i=>i.c==='Warframe'&&!i.p&&!/Umbra$/.test(i.n));
  return `<div class="panel stack cut"><h2>Helminth</h2><p class="small" style="margin:0">Tick each Warframe you've fed to the Helminth to unlock its ability for infusing. Unlock the Helminth chamber by buying its segment from Son in the Necralisk (needs Heart of Deimos).</p>
  <div class="row"><span class="chip gold">${all.filter(i=>on('hel|'+i.n)).length}/${all.length} subsumed</span><select id="hf" aria-label="Filter" style="width:auto">${[['all','All Warframes'],['ready','Owned, not fed yet'],['todo','Not fed yet'],['done','Fed']].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="obj">${fr.map(n=>`<div class="qrow${on('hel|'+n)?' done':''}">${ck('hel|'+n)}<div><div class="row" style="gap:6px"><span class="nm lbl">${esc(n)}</span>${owned(n)?'<span class="chip teal">Owned</span>':''}</div></div></div>`).join('')||'<div class="empty">Nothing here.</div>'}</div></div>`}

