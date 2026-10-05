/* ---------- farm finder ---------- */
let IDX=null;
function buildIdx(){IDX=[];for(const n in I)IDX.push([n,'item',I[n].p?'Prime set':I[n].c]);
  for(const n in D.partrel)IDX.push([n,'part','Prime part']);for(const n in REL)IDX.push([n,'relic','Relic'+(REL[n].v?' · vaulted':'')]);
  for(const n in MODS)IDX.push([n,'mod',MODS[n].ty||'Mod']);for(const n in ARC)IDX.push([n,'arc','Arcane']);for(const n in RES)IDX.push([n,'res','Resource'])}
function search(q){if(!IDX)buildIdx();q=q.toLowerCase().trim();if(!q)return[];const w=q.split(/\s+/);
  const r=IDX.filter(([n])=>{const l=n.toLowerCase();return w.every(x=>l.includes(x))});
  r.sort((a,b)=>{const al=a[0].toLowerCase(),bl=b[0].toLowerCase();return (bl.startsWith(q)-al.startsWith(q))||a[0].length-b[0].length});return r.slice(0,50)}
function farm(){const sel=state.farmSel;
  return `<div class="stack"><div class="head"><div class="eyebrow">Farm Finder</div><h1>What do you want to farm?</h1></div>
  <div class="split two"><div class="stack" style="gap:8px"><input id="fq" type="search" placeholder="Saryn Prime, Neo S10, Primed Flow, Orokin Cell…" value="${esc(state.farmQ)}" autocomplete="off" enterkeyhint="search" aria-label="Search">
  <div class="row">${`<select id="fft" aria-label="Result type" style="width:auto">${[['all','Everything'],['item','Gear & sets'],['part','Prime parts'],['relic','Relics'],['mod','Mods'],['arc','Arcanes'],['res','Resources']].map(([k,l])=>`<option value="${k}" ${(state.ffT||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}<button class="btn ${state.unvOnly?'on':''}" id="unv">Farmable now only</button>${sel?`<button class="btn" id="jump">Jump to result ↓</button>`:''}</div>
  <div class="results" id="fres">${resultsHTML()}</div></div><div id="fdet">${sel?detail(sel):''}</div></div></div>`}
function resultsHTML(){let r=state.farmQ?search(state.farmQ):[];const ft=state.ffT||'all';if(ft!=='all')r=r.filter(x=>x[1]===ft);
  if(state.unvOnly)r=r.filter(([n,t])=>t==='relic'?!REL[n].v:t==='part'?D.partrel[n].some(x=>!REL[x[0]]?.v):t==='item'&&I[n].p?!I[n].v:true);
  if(!state.farmQ){const sets=Object.values(I).filter(i=>i.p&&!i.v&&i.c!=='Companion').map(i=>[i.n,'item','Farmable Prime']);
    return `<div class="small muted">Prime gear you can farm right now (${sets.length}):</div>`+sets.map(hit).join('')}
  return r.length?countLine(r.length,r.length,r.length===1?'result':'results',ft!=='all'||!!state.unvOnly,'ffclear')+r.map(hit).join(''):'<div class="small muted">No matches.</div>'}
function hit([n,t,l]){const s=state.farmSel===t+'|'+n;return `<button class="hit ${s?'sel':''}" data-pick="${esc(t+'|'+n)}"><span>${esc(n)}</span><span class="row" style="gap:4px">${t==='item'?mxChip(n):''}<span class="chip">${esc(l)}</span></span></button>`}
function detail(sel){const i=sel.indexOf('|');const t=sel.slice(0,i),n=sel.slice(i+1);
  if(t==='item')return itemTree(n);
  if(t==='res')return resDetail(n);
  if(t==='relic')return REL[n]?`<section class="obj"><div class="obj-h"><div class="title"><h3>${esc(n)} Relic</h3>${REL[n].v?'<span class="chip bad">Vaulted</span>':'<span class="chip ok">Farmable</span>'}${priceChip(n+' Relic')}<span style="margin-left:auto">${taskBtn('relic',n,(REL[n].v?'Buy ':'Farm ')+n+' relic')}</span></div></div><div style="padding:12px 14px" class="small">${relicBody(n)}</div></section>`:'';
  if(t==='part'){const own=partOwner(n)||I[n.replace(/ Blueprint$/,'')];
    return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3>${priceChip(n)}</div>${sellerRow(n)}${progHTML()}</div><ol class="steps">${step('got|'+n,'Get '+esc(n),relicChips(D.partrel[n]))}</ol>${own?`<div style="padding:0 14px 12px"><button class="btn" data-pick="item|${esc(own.n)}">Open the full ${esc(own.n)} set</button></div>`:''}</section>`}
  if(t==='mod'&&MODS[n]){const md=MODS[n];return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3><span class="chip">${esc(md.ty)}</span><span style="margin-left:auto">${taskBtn('mod',n,'Get '+n)}</span></div>${progHTML()}</div><div style="padding:12px 14px">${modCard(RAR[md.r]||'Mod',n)}</div></section>`}
  if(t==='arc'&&ARC[n])return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3><span style="margin-left:auto">${taskBtn('arc',n,'Get '+n)}</span></div>${progHTML()}</div><div style="padding:12px 14px">${arcCard(n)}</div></section>`;
  return ''}

