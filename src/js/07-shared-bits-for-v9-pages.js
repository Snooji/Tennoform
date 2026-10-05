/* ---------- shared bits for v9 pages ---------- */
const sel=(id,cur,opts,lab)=>`<select id="${id}" aria-label="${esc(lab||'Filter')}" style="width:auto">${opts.map(([k,l])=>`<option value="${esc(k)}" ${String(cur)===String(k)?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
const segBtns=(attr,cur,list)=>`<div class="seg">${list.map(([k,l])=>`<button class="btn ${cur===k?'on':''}" data-${attr}="${k}">${l}</button>`).join('')}</div>`;
const pv=n=>{const p=PR[n];return p?(p.a7??p.a30??null):null};
function ownedItem(n){return on('m|'+n)||rankOf(n)>0||on('build|'+n)}
function partKey(full){const it=partOwner(full);if(!it){return 'got|'+full}
  if(full===it.n+' Blueprint')return 'bp|'+it.n;const p=it.parts.find(x=>x.full===full);return p?'part|'+it.n+'|'+p.n:'got|'+full}
function partNeeded(full){const it=partOwner(full)||I[full.replace(/ Blueprint$/,'')];if(on(partKey(full))||on('got|'+full))return false;if(it&&ownedItem(it.n))return false;return true}
function partGoal(full){const it=partOwner(full)||I[full.replace(/ Blueprint$/,'')];return !!(it&&(P.goals||[]).includes(it.n))}
const rerender=()=>{const y=scrollY;render();scrollTo(0,y)};

