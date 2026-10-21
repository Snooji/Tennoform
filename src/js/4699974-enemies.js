/* ---------- enemies: every enemy in the main search and the Farm finder, with its own details page ----------
   What it is, its health, shields and armour, what each layer is weak to, the planets it spawns on (and the node for
   bosses), and what it drops with the chance per kill. Data: build/enemies.json (build/make_enemies.py, from WFCD),
   fetched just after the page is up like the guides. */
const ENM={};
LAZY.enemies={done:false,busy:false,err:false,add:j=>{for(const e of j)ENM[e.n]=e;ISLV++}};
const enmSub=e=>e.f+(e.boss?' · boss':'');
{const _b=buildIdx;buildIdx=function(){_b();for(const e of Object.values(ENM))IDX.push([e.n,'enemy',enmSub(e),e.f])}}
FFT.push(['enemy','Enemies']);
{const _c=cmdIndex;cmdIndex=function(){if(typeof lazyLoad==='function')lazyLoad('enemies');if(CMDX)return CMDX;const x=_c();
  for(const e of Object.values(ENM))x.push({n:e.n,g:'Enemies',act:'enemy|'+e.n,s:enmSub(e),l:e.n.toLowerCase(),a:['enemy','enemies',e.f,e.boss?'boss assassination':''].join(' ').toLowerCase()});
  return CMDX=x}}
CMDG.push('Enemies');
DET_KIND.enemy='Enemy';
/* a drop's own page: mods and arcanes by name, blueprints and parts through the gear they make */
function enmDropKey(n,k){if(k==='mod'&&MODS[n])return 'mod|'+n;if(k==='arc'&&ARC[n])return 'arc|'+n;if(k==='res'&&RES[n])return 'res|'+n;
  if(I[n])return 'item|'+n;const b=n.replace(/ Blueprint$/,'');if(I[b])return 'item|'+b;
  const own=Object.keys(I).filter(x=>n.startsWith(x+' ')).sort((a,b)=>b.length-a.length)[0];return own?'item|'+own:''}
const ENM_KIND={mod:'Mod',arc:'Arcane',item:'Blueprint or part',res:'Resource'};
function enemyDetail(n){
  if(!LAZY.enemies.done){lazyLoad('enemies');return LAZY.enemies.err?`<section class="obj"><div style="padding:12px 14px">Couldn't load enemy data. Check your connection and try again.</div></section>`
    :`<section class="obj"><div style="padding:12px 14px" class="muted" role="status">Loading enemy data…</div></section>`}
  const e=ENM[n];if(!e)return '';
  const img=e.img?`<img src="https://cdn.warframestat.us/img/${encodeURIComponent(e.img)}" alt="" width="56" height="56" loading="lazy" style="border-radius:10px;object-fit:contain;background:var(--muted)">`:'';
  const stat=(l,v)=>v?`<span class="chip">${l} ${fmt(v)}</span>`:'';
  const plx=k=>typeof PLX!=='undefined'?(PLX[k]?k:Object.keys(PLX).find(x=>x.startsWith(k+' ('))||''):'';
  /* level ranges only when they are narrow enough to mean something (Deimos and Lua span most of the game) */
  const reg=(e.reg||[]).map(([p,lo,hi])=>`<button type="button" class="btn sm" data-go="node|${esc(p)}">${esc(p)}${lo&&hi-lo<=60?` · level ${lo}–${hi}`:''}</button>`).join('');
  const boss=(e.boss||[]).map(([nd,p])=>{const k=plx(nd);return k?`<button type="button" class="btn sm" data-go="place|${esc(k)}">${esc(nd)}, ${esc(p)} (Assassination)</button>`:`<span class="chip">${esc(nd)}, ${esc(p)}</span>`}).join('');
  const lay=(e.lay||[]).filter(l=>l[1]).map(([t,a,w,r])=>`<li><b>${esc(t)}</b> ${fmt(a)}${w.length?` · <span>weak to ${esc(w.join(', '))}</span>`:''}${r.length?` · <span class="muted">resists ${esc(r.join(', '))}</span>`:''}</li>`).join('');
  const dr=(e.dr||[]).map(([d,k,c])=>{const key=enmDropKey(d,k);
    return `<tr><td>${key?`<a href="#" data-go="${esc(key)}">${esc(d)}</a>`:esc(d)}</td><td class="muted">${ENM_KIND[k]||''}</td><td class="num">${c>=1?c.toFixed(c%1?1:0):c.toFixed(2)}%</td></tr>`}).join('');
  const wiki='https://wiki.warframe.com/w/'+encodeURIComponent(n.replace(/ /g,'_'));
  return `<section class="obj" data-scope><div class="obj-h"><div class="title" style="display:flex;gap:12px;align-items:center">${img}<div><h3>${esc(n)}</h3><span class="chip">${esc(e.f)}</span>${e.boss?'<span class="chip gold">Boss</span>':''}</div></div></div><div style="padding:12px 14px" class="stack">
    ${e.d?`<div>${esc(e.d)}</div>`:''}
    <div class="tier cut"><h4>Where it shows up</h4>
      ${boss?`<div class="small">Fought on:</div><div class="row">${boss}</div>`:''}
      ${reg?`<div class="small">${boss?'Also spawns on':'Spawns on'} these planets (from the game's own spawn list):</div><div class="row">${reg}</div>`:''}
      ${e.where?`<div class="small">${esc(e.where)}</div>`:''}
      ${!reg&&!boss&&!e.where?`<div class="small">Not tied to one planet: it shows up in special missions, events or open worlds, or is summoned by another enemy. The wiki page has the details.</div>`:''}
      <div class="small muted">${e.boss?'':'Enemies of its faction also turn up in invasions, Arbitrations, Steel Path and events on other planets.'}</div></div>
    <div class="tier cut"><h4>Toughness</h4><div class="row">${stat('Health',e.hp)}${stat('Shields',e.sh)}${stat('Armor',e.ar)}</div>
      ${lay?`<ul class="small" style="margin:0;padding-left:18px;list-style:disc;display:grid;gap:4px">${lay}</ul>`:''}
      <div class="small muted">Base values. They grow with the enemy's level.</div></div>
    ${dr?`<div class="tier cut"><h4>Drops</h4><table class="small" style="width:100%"><thead><tr><th scope="col" style="text-align:left">Item</th><th scope="col" style="text-align:left">Kind</th><th scope="col" class="num">Per kill</th></tr></thead><tbody>${dr}</tbody></table></div>`
      :`<div class="small muted">No known item drops.</div>`}
    <div class="row"><a class="btn sm" href="${esc(wiki)}" target="_blank" rel="noopener">Warframe wiki</a></div>
  </div></section>`}
{const _d=detail;detail=function(sel){return sel.startsWith('enemy|')?enemyDetail(sel.slice(6)):_d(sel)}}
