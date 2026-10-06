/* ---------- warframes ---------- */
function baseOf(n){return n.replace(/ Prime$/,'').replace(/ Umbra$/,'')}
function frames(){const ff=state.frF||'all';const fr=Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth').filter(i=>{const r=rankOf(i.n);return ff==='all'||(ff==='owned'&&r>0)||(ff==='not'&&r===0)||(ff==='mastered'&&r>=maxRank(i))||(ff==='prime'&&i.p)||(ff==='farm'&&i.p&&!i.v)||(ff==='goals'&&(P.goals||[]).includes(i.n))}).map(i=>i.n).sort();
  if(!fr.length)fr.push(...Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth').map(i=>i.n).sort());
  if(!state.frame||!I[state.frame]||!fr.includes(state.frame))state.frame=fr.includes('Saryn Prime')?'Saryn Prime':fr[0];
  const name=state.frame,base=baseOf(name);const builds=D.builds[base]||D.builds[name]||[];const bi=Math.max(0,Math.min(state.build,builds.length-1));
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Arsenal</div><h1>${esc(name)}</h1></div>
  <div class="row">${`<select id="frf" aria-label="Filter Warframes" style="width:auto">${[['all','All Warframes'],['owned','Owned'],['not','Not owned'],['mastered','Mastered'],['prime','Prime'],['farm','Prime, farmable now'],['goals','In my goals']].map(([k,l])=>`<option value="${k}" ${(state.frF||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}<select id="fsel" aria-label="Choose a Warframe" style="flex:1 1 200px">${fr.map(n=>`<option ${n===name?'selected':''}>${esc(n)}</option>`).join('')}</select>
  ${I[base+' Prime']&&name!==base+' Prime'?`<button class="btn" data-frame="${esc(base+' Prime')}">Prime version</button>`:''}${name!==base&&I[base]?`<button class="btn" data-frame="${esc(base)}">Base version</button>`:''}</div>
  <div class="split wf">${itemTree(name)}`;
  if(builds.length){const b=builds[bi];const sw=m=>state.budget&&D.budget[m]?D.budget[m]:m;
    const slots=[['Aura',sw(b.aura)],['Exilus',sw(b.exilus)],...b.mods.map(m=>['Mod',sw(m)])];
    h+=`<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>Meta build</h3></div>
      <div class="seg">${builds.map((x,i)=>`<button class="btn ${i===bi?'on':''}" data-build="${i}">${esc(x.name)}</button>`).join('')}<button class="btn ${state.budget?'on':''}" id="budget">Budget mods</button></div>${progHTML()}</div>
      <div style="padding:12px 14px" class="stack"><div class="row"><span class="chip teal">${esc(b.role)}</span><span class="small">Helminth: <b>${esc(b.helminth)}</b></span></div>${b.notes?`<div class="small muted">${esc(b.notes)}</div>`:''}
      <div class="mods">${slots.map(([s,m])=>modCard(s,m)).join('')}${b.arcanes.map(a=>arcCard(a)).join('')}</div>
      <div class="small muted">Forma each slot to match its mod's polarity.</div></div></section>`}
  return h+'</div></div>'}
function modCard(slot,m){const md=MODS[m]||{};const k='mod|'+m;
  const src=md.src?esc(md.src):(md.dr&&md.dr.length?dropsList(md.dr,2):'Trade on warframe.market');
  return `<div class="mod${on(k)?' done':''}">${ck(k)}<div><div class="slot">${slot}${md.pol?` · <span class="pol">${esc(md.pol)}</span>`:''}</div><div class="nm"><span class="lbl">${esc(m)}</span> ${priceChip(m)}</div><div class="src">${src}</div>${sellerRow(m)}</div></div>`}
function arcCard(a){const ad=ARC[a]||{};const k='arc|'+a;
  return `<div class="mod${on(k)?' done':''}">${ck(k)}<div><div class="slot">Arcane</div><div class="nm"><span class="lbl">${esc(a)}</span> ${priceChip(a)}</div><div class="src">${ad.dr&&ad.dr.length?dropsList(ad.dr,2):'Trade on warframe.market'}</div>${sellerRow(a)}</div></div>`}

