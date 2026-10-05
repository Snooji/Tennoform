/* ---------- helpers ---------- */
function priceChip(n,label){const p=PR[n];if(!p)return'';const v=p.a7??p.a30;if(v==null)return'';
  return `<a class="chip gold" href="https://warframe.market/items/${MS[n]}" target="_blank" rel="noopener" title="warframe.market 7-day average">${label||''}${Math.round(v)}p</a>`}
function whisper(item,s){return `/w ${s[0]} Hi! I want to buy: "${item}" for ${s[1]} platinum. (warframe.market)`}
function sellerRow(item){const s=(SEL[item]||[]).filter(x=>x[0]!=='__buy');if(!s.length)return'';const b=s[0];
  return `<div class="seller"><span class="muted">Cheapest seller:</span><b>${esc(b[0])}</b><span class="chip gold">${b[1]}p</span>${b[2]>1?`<span class="muted small">×${b[2]}</span>`:''}<button class="btn sm" data-wh="${esc(whisper(item,b))}">Copy whisper</button></div>`}
function farmFor(rn){const r=RES[rn];
  if(RT[rn]){const t=RT[rn].tiers;const best=r&&r.best;const pick=(t['Mid game']||[])[0]||(t['Early game']||[])[0];return (best?`<b>${esc(best)}</b>`:pick?`<b>${esc(pick[0])}</b> (${esc(pick[1])})`:'')+` · <a class="ln" href="#" data-go="res|${esc(rn)}">farms by stage</a>`}
  const s=RSRC[rn];if(s&&s.length)return `<b>${esc(s[0][0])}</b>${s[0][1]?' — '+esc(s[0][1]):''}${s.length>1?` · <a class="ln" href="#" data-go="res|${esc(rn)}">${s.length} options</a>`:''}`;
  if(r&&r.loc)return 'Found on: '+esc(r.loc);return '<span class="muted">See wiki</span>'}
function haveTag(rn,q){const h=P.inv&&P.inv[rn];if(h==null||h==='')return'';return `<span class="have ${+h>=q?'ok':'no'}">have ${fmt(h)}</span>`}
function relSort(a,b){return 'CUR'.indexOf(a[1])-'CUR'.indexOf(b[1])}
function relicChips(list){if(!list||!list.length)return'';
  const open=list.filter(x=>!REL[x[0]]?.v).sort(relSort),vault=list.filter(x=>REL[x[0]]?.v).sort(relSort);
  let h='';
  if(open.length)h+=`<div class="small" style="margin-top:6px;color:var(--ok);font-weight:600">${open.length} relic${open.length>1?'s':''} farmable now. Tap one for the best nodes.</div><div class="relics">${open.map(([r,rr])=>relicDetails(r,rr)).join('')}</div>`;
  else h+=`<div class="small" style="margin-top:6px"><span class="vault">All relics vaulted.</span> Buy the part or a relic on warframe.market, or wait for Prime Resurgence (Varzia).</div>`;
  if(vault.length)h+=`<details class="more"><summary>${vault.length} vaulted relic${vault.length>1?'s':''} (trade only)</summary><div class="relics">${vault.slice(0,24).map(([r,rr])=>relicDetails(r,rr)).join('')}</div></details>`;
  return h}
function relicDetails(r,rar){const v=REL[r]?.v;
  return `<details class="relic"><summary><span class="dot rar-${rar}"></span>${esc(r)} <span class="rar-${rar}">${RAR[rar]||''}</span>${v?' <span class="tag-v">vaulted</span>':''}</summary><div class="body">${relicBody(r)}</div></details>`}
function nodeLink(label){const m=String(label).match(/^([^/]+)\/([^(·]+?)\s*\(/);if(m){const nd=ALLN.find(x=>x.n===m[2].trim()&&x.p===m[1].trim());if(nd)return `<a class="ln" href="#" data-go="node|${esc(nd.p)}">${esc(label)}</a>`}return esc(label)}
function relicBody(r){const R=REL[r];if(!R)return'No data';let h='';
  if(R.v)h+=`<div><span class="vault">Vaulted.</span> Not dropping right now. Buy it ${MS[r+' Relic']?`on <a href="https://warframe.market/items/${MS[r+' Relic']}" target="_blank" rel="noopener">warframe.market</a>`:'from other players'} or wait for Prime Resurgence.</div>${sellerRow(r+' Relic')}`;
  else{h+=`<div><b>Best nodes:</b></div><ol style="margin:4px 0 6px;padding-left:20px">`+(R.loc||[]).map(l=>`<li>${nodeLink(l[0])} <span class="mono">${l[1]}%</span></li>`).join('')+`</ol><div class="muted">Fast community pick for ${R.era} relics: ${esc(ERA_TIP[R.era]||'')}.</div>`+srcLine('relic')}
  h+=`<details class="more"><summary>What's inside</summary><ul style="margin:4px 0 0;padding-left:18px">`+R.rw.map(([n,rr])=>`<li><span class="rar-${rr}">${L(n)}</span> <span class="muted">${RAR[rr]}</span> ${priceChip(n)}</li>`).join('')+`</ul><div class="muted" style="margin-top:4px">Intact: Common 25.33% · Uncommon 11% · Rare 2%. Radiant: 16.67 / 20 / 10%.</div></details>`;return h}
function dropsList(dr,n){if(!dr||!dr.length)return'';return dr.slice(0,n||2).map(d=>`<b>${nodeLink(d[0])}</b> <span class="mono">${d[1]}%</span>`).join('<br>')}
function progHTML(){return `<div class="prog"><div class="track"><div class="fill"></div></div><span class="txt">0/0</span></div>`}
function refresh(root){(root||document).querySelectorAll('[data-scope]').forEach(sc=>{const sel=sc.dataset.scope||'input.ck[data-k]';const all=sc.querySelectorAll(sel);let n=0;all.forEach(i=>{if(i.checked)n++});
  const p=sc.querySelector(':scope > summary .prog, :scope > .obj-h .prog');if(p){p.querySelector('.fill').style.width=(all.length?n/all.length*100:0)+'%';p.querySelector('.txt').textContent=n+'/'+all.length}})}
function ck(k,cls){return `<input type="checkbox" class="ck ${cls||''}" data-k="${esc(k)}" ${on(k)?'checked':''} aria-label="Mark done">`}
function step(k,label,body){return `<li class="step${on(k)?' done':''}">${ck(k)}<div><div class="lbl">${label}</div>${body?`<div class="src">${body}</div>`:''}</div></li>`}
function toast(t){document.querySelectorAll('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3200)}
function vaultChip(it){if(!it||!it.p)return'';const v=VAULT[it.n]||{};
  if(v.now)return `<span class="chip ok">Resurgence until ${fdate(v.now)}</span>`;
  if(it.v)return `<span class="chip bad">Vaulted${v.est?' · back ~'+fdate(v.est):''}</span>`;
  return `<span class="chip teal">Farmable${it.evd?' · vaults ~'+fdate(it.evd):''}</span>`}

