/* ---------- quests ---------- */
function qDone(n){return on('q|'+n)}
const qClean=r=>r.replace(/^Completed /,'').replace(/ \(Quest\)$/,'').replace(/ completed$/i,'').replace(/ Complete$/,'').trim();
function qPrereqs(q){return Q.filter(o=>o.n!==q.n&&q.req.some(r=>qClean(r)===o.n))}
function nextQuest(){return Q.find(q=>!qDone(q.n)&&qPrereqs(q).every(p=>qDone(p.n)))||null}
function quests(){const groups=[...new Set(Q.map(q=>q.g))];const nq=nextQuest();
  return `<div class="stack"><div class="head"><div class="eyebrow">Codex</div><h1>Quests</h1><p class="lede">Story order from the in-game Codex, with requirements and rewards from the wiki.</p></div>
  ${nq?`<div class="callout small">Next: <a class="ln" href="#quests" data-q="${esc(nq.n)}"><b>${esc(nq.n)}</b></a></div>`:''}
  <div class="row">${`<select id="qf" aria-label="Filter quests" style="width:auto">${[['all','All quests'],['avail','Available now'],['todo','Not done'],['locked','Locked'],['done','Done']].map(([k,l])=>`<option value="${k}" ${(state.qF||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}</div>
  ${groups.map(g=>{const f=state.qF||'all';const qs=Q.filter(q=>q.g===g).filter(q=>{const lk=qPrereqs(q).some(p=>!qDone(p.n));return f==='all'||(f==='done'&&qDone(q.n))||(f==='todo'&&!qDone(q.n))||(f==='locked'&&!qDone(q.n)&&lk)||(f==='avail'&&!qDone(q.n)&&!lk)});return qs.length?`<details class="obj grp" data-scope open><summary><h3>${esc(g)}</h3>${progHTML()}</summary>${qs.map(qrow).join('')}</details>`:''}).join('')||'<div class="panel empty cut">No quests match this filter.</div>'}</div>`}
function rewardLink(r){const m=Object.keys(I).find(n=>r.toLowerCase().startsWith(n.toLowerCase()+' ')||r===n);if(m)return `<a class="ln" href="#" data-go="item|${esc(m)}">${esc(r)}</a> ${mxChip(m)}`;if(MODS[r]||RES[r]||ARC[r])return L(r);return esc(r)}
function qrow(q){const k='q|'+q.n;const pre=qPrereqs(q);const locked=pre.some(p=>!qDone(p.n));
  return `<div class="qrow${qDone(q.n)?' done':''}" id="q-${esc(q.n.replace(/\W/g,''))}">${ck(k)}<div><div class="row" style="gap:6px"><span class="nm lbl">${esc(q.n)}</span>${locked&&!qDone(q.n)?'<span class="chip warn">Locked</span>':''}<a class="small ln" href="${q.w}" target="_blank" rel="noopener">Wiki</a>${!qDone(q.n)?taskBtn('quest',q.n,'Do quest: '+q.n):''}${!qDone(q.n)&&Q.indexOf(q)>0?`<button class="btn sm" data-qupto="${esc(q.n)}">Done to here</button>`:''}</div>
   ${q.d&&!qDone(q.n)?`<div class="small muted" style="margin-top:2px">${esc(q.d)}</div>`:''}
   ${q.req.length?`<div class="small" style="margin-top:6px"><b>Needs:</b> ${q.req.map(r=>{const p=pre.find(x=>qClean(r)===x.n);return p?`<a class="ln" href="#quests" data-q="${esc(p.n)}" style="color:var(--${qDone(p.n)?'ok':'warn'})">${esc(r)}</a>`:esc(r)}).join(' · ')}</div>`:''}
   ${q.rw.length?`<details class="more"><summary>Rewards (${q.rw.length})</summary><ul>${q.rw.map(r=>`<li>${rewardLink(r)}</li>`).join('')}</ul></details>`:''}</div></div>`}

