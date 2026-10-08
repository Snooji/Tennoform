/* ---------- helminth ---------- */
function helminthTab(){const f=state.hF||'all';let fr=MI.filter(i=>i.c==='Warframe'&&!i.p&&!/Umbra$/.test(i.n)).map(i=>i.n).sort();
  const owned=n=>rankOf(n)>0||rankOf(n+' Prime')>0;
  if(f==='done')fr=fr.filter(n=>on('hel|'+n));if(f==='ready')fr=fr.filter(n=>!on('hel|'+n)&&owned(n));if(f==='todo')fr=fr.filter(n=>!on('hel|'+n));
  const all=MI.filter(i=>i.c==='Warframe'&&!i.p&&!/Umbra$/.test(i.n));
  return `<div class="panel stack cut"><h2>Helminth</h2><p class="small" style="margin:0">Feeding (subsuming) a Warframe to the Helminth unlocks one of its abilities, which you can then infuse onto any other Warframe in place of one of theirs. Each Warframe only needs feeding once, so this list is how you keep track of which ones you've done.</p>
  <details class="small"><summary><b>Why you tick these yourself</b></summary><div class="stack" style="padding-top:6px">
  <div>The public profile Tennoform syncs from doesn't say which Warframes you've fed, so there's nothing to read automatically. You only do this occasionally, so ticking the box right after you feed one in game keeps the list right.</div>
  <div><b>How to use it:</b> choose "Owned, not fed yet" to see the Warframes you could feed next. After you subsume one in game, tick it here. Your ticks are saved on this device (and synced if you're signed in).</div>
  <div><b>Good to know:</b> feeding uses up that copy of the Warframe, but you keep its Mastery. Many players build a spare copy to feed rather than giving up one they play. The list has one entry per Warframe, so Prime versions aren't listed separately.</div>
  <div><b>Getting the Helminth:</b> play Heart of Deimos, then buy the Helminth Segment from Son in the Necralisk and build it in your Orbiter.</div></div></details>
  <div class="row"><span class="chip gold">${all.filter(i=>on('hel|'+i.n)).length}/${all.length} subsumed</span><select id="hf" aria-label="Filter" style="width:auto">${[['all','All Warframes'],['ready','Owned, not fed yet'],['todo','Not fed yet'],['done','Fed']].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="obj">${fr.map(n=>`<div class="qrow${on('hel|'+n)?' done':''}">${ck('hel|'+n)}<div><div class="row" style="gap:6px"><span class="nm lbl">${esc(n)}</span>${owned(n)?'<span class="chip teal">Owned</span>':''}</div></div></div>`).join('')||'<div class="empty">Nothing here.</div>'}</div></div>`}

