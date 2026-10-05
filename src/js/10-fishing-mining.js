/* ---------- fishing & mining ---------- */
function world(){const tab=state.wTab||'fish';
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Open worlds</div><h1>Fishing & mining</h1><p class="lede">Where and when each fish bites, which spear and bait to bring, and the best mining spots in every open world.</p></div>
  ${segBtns('wtab',tab,[['fish','Fishing'],['mine','Mining']])}`;
  h+=tab==='mine'?mineTab():fishTab();return h+'</div>'}
function fishTab(){const rg=state.fR||'Plains of Eidolon',rr=state.fRr||'all',tm=state.fT||'all';const regs=Object.keys(D.fishreg);const R=D.fishreg[rg]||{};
  const times=[...new Set(D.fish.filter(f=>f.reg===rg).map(f=>f.time))].filter(Boolean).sort();
  const list=D.fish.filter(f=>f.reg===rg&&(rr==='all'||f.r===rr||(rr==='todo'&&!on('fish|'+f.n)))&&(tm==='all'||f.time===tm));
  let cyc='';if(WS){const c=rg==='Plains of Eidolon'?WS.cetusCycle:rg==='Orb Vallis'?WS.vallisCycle:WS.cambionCycle;if(c)cyc=`<span class="chip teal">Now: ${esc(c.state||c.active||'')}${c.timeLeft?' · '+esc(c.timeLeft):''}</span>`}else if(HOSTED&&!WSerr)loadWS();
  return `${segBtns('freg',rg,regs.map(r=>[r,r]))}
  <div class="panel cut stack" style="gap:6px"><div class="row" style="justify-content:space-between"><b>${esc(rg)}</b>${cyc}</div><div class="small"><b>Spears:</b> ${esc(R.sp)}</div><div class="small"><b>Vendor:</b> ${esc(R.v)}. ${esc(R.use)}</div><ul class="small" style="margin:0;padding-left:18px">${(R.tips||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>
  <div class="row">${sel('frr',rr,[['all','All rarities'],['todo','Not caught yet'],['Common','Common'],['Uncommon','Uncommon'],['Rare','Rare'],['Legendary','Legendary']],'Rarity')}${sel('ftm',tm,[['all','Any time'],...times.map(t=>[t,t])],'Time')}</div>
  <div class="obj" data-scope="input.ck.fi"><div class="obj-h"><b>${list.length} fish</b> <span class="small muted">tick once caught</span>${progHTML()}</div><ol class="steps">${list.map(f=>{const k='fish|'+f.n;
    return `<li class="step${on(k)?' done':''}">${ck(k,'fi')}<div><div class="lbl">${esc(f.n)} <span class="chip ${f.r==='Rare'||f.r==='Legendary'?'gold':''}">${esc(f.r)}</span> ${taskBtn('fish',f.n,'Catch '+f.n)}</div><div class="src"><b>${esc(f.bio)}</b> · ${esc(f.time)} · spear: ${esc(f.sp||'any')}${f.bait?` · bait: <b>${esc(f.bait)}</b>`:''}${f.spots&&f.spots.length?` · spot: ${f.spots.map(esc).join(', ')}`:''}${f.dr.length?`<br><span class="muted">Gives ${f.dr.map(d=>L(d)).join(', ')}</span>`:''}</div></div></li>`}).join('')}</ol></div>`}
function mineTab(){const M2=D.mine;const rg=state.mR||'Plains of Eidolon';const R=M2.reg[rg];
  const rowF=(arr,kind)=>arr.map(([n,r])=>{const k='ore|'+n;return `<li class="step${on(k)?' done':''}">${ck(k,'mi')}<div><div class="lbl">${L(n)} <span class="chip ${r==='Rare'||r==='Special'?'gold':''}">${r}</span> <span class="small muted">${kind}</span> ${taskBtn('ore',n,'Mine '+n)}</div></div></li>`}).join('');
  return `${segBtns('mreg',rg,Object.keys(M2.reg).map(r=>[r,r]))}
  <div class="panel cut stack" style="gap:6px"><b>Best spots in ${esc(rg)}</b><ul class="small" style="margin:0;padding-left:18px">${R.spots.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="small muted">${esc(R.v)}</div></div>
  <div class="obj" data-scope="input.ck.mi"><div class="obj-h"><b>Ores and gems</b> <span class="small muted">tick once mined</span>${progHTML()}</div><ol class="steps">${rowF(R.ore,'ore · red vein')}${rowF(R.gem,'gem · blue vein')}</ol></div>
  <details class="obj grp" open><summary><h3>Cutters</h3></summary><ol class="steps">${M2.cut.map(([n,w,d])=>{const k='cut|'+n;return `<li class="step${on(k)?' done':''}">${ck(k)}<div><div class="lbl">${esc(n)}</div><div class="src">${esc(w)} · ${esc(d)}</div></div></li>`}).join('')}</ol></details>
  <div class="panel cut"><ul class="small" style="margin:0;padding-left:18px">${M2.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`}

