/* ---------- owned items, quest detection ---------- */
function stepKeys(n){const it=I[n];if(!it)return[];const k=['bp|'+n];let pi=0;for(const p of it.parts){pi++;if(p.k==='p'&&p.n==='Blueprint')continue;
  if(p.k==='p'){k.push('part|'+n+'|'+p.n);if(p.sub){k.push('built|'+n+'|'+p.n);p.sub.forEach(([r])=>k.push('res|'+n+'|'+p.n+'|'+r))}}else if(p.k==='i')k.push('have|'+n+'|'+p.n+'|'+pi);else if(p.k==='r')k.push('res|'+n+'|main|'+p.n)}
  k.push('build|'+n);return k}
function setQ(k){const e=kenc(k);if(C[e])return;C[e]=1;if(docRef){pending[e]=1;clearTimeout(timer);timer=setTimeout(flush,SAVE_MS)}}
function exclusive(it){return it&&!it.p&&!it.bc&&!(it.bpd&&it.bpd.length)&&!(it.dr&&it.dr.length)&&!it.bprel}
function detectQuests(j,mis,owned){const det=new Set(['Awakening',"Vor's Prize"]);const nq=s=>s.toLowerCase().replace(/^the /,'').replace(/[^a-z0-9]/g,'');
  const ch=(j.ChallengeProgress||[]).map(c=>String(c.Name||'').toLowerCase());
  Q.forEach(q=>{const k=nq(q.n);if(k.length>=6&&ch.some(c=>c.includes(k)))det.add(q.n)});
  const PQ={Lua:'The Second Dream','Kuva Fortress':'The War Within',Deimos:'Heart of Deimos',Zariman:'Angels of the Zariman','Höllvania':'The Hex',Duviri:'The Duviri Paradox'};
  for(const m of mis){const nd=NX[m.Tag];if(nd&&m.Completes>0&&!/Junction|Hub|Relay/.test(nd.t)&&PQ[nd.p])det.add(PQ[nd.p])}
  for(const q of Q)for(const r of q.rw){const m=Object.keys(I).find(n=>r===n||r.toLowerCase().startsWith(n.toLowerCase()+' '));if(m&&owned.has(m)&&exclusive(I[m]))det.add(q.n)}
  if([...owned].some(n=>I[n].c==='Archwing'))det.add('The Archwing');
  if([...owned].some(n=>I[n].c==='Companion'&&/Kubrow/.test(n)))det.add('Howl of the Kubrow');
  const add=n=>{det.add(n);const q=Q.find(x=>x.n===n);if(q)qPrereqs(q).forEach(p=>{if(!det.has(p.n))add(p.n)})};[...det].forEach(add);
  return [...det].filter(n=>Q.some(q=>q.n===n))}

