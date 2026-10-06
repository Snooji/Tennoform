/* ---------- mastery ---------- */
function mastery(){const tab=state.mTab;
  const tabs=[['path','Path to max'],['ladder','Rank ladder'],['sheet','Starter weapons (MR 0–12)'],['sframes','Easy Warframes'],['craft','Crafting chains'],['xp','XP farms']];
  let h=`<div class="stack"><div class="head"><div class="eyebrow">MR plan</div><h1>MR plan</h1><p class="lede">What to do next to reach your target rank, the full rank ladder, and the easiest gear to rank first. Enter what you've already ranked on the <a class="ln" href="#ranks">Ranks</a> page.</p></div>${bigMR()}<div class="seg" role="tablist">${tabs.map(([k,l])=>`<button class="btn ${tab===k?'on':''}" data-mtab="${k}" role="tab" aria-selected="${tab===k}">${l}</button>`).join('')}</div>`;
  if(tab==='path')h+=pathTab();
  if(tab==='ladder')h+=ladderTab();
  if(tab==='all')h+=allTab();
  if(tab==='sheet'){const by={};M.weapons.forEach(w=>(by[w.mr]=by[w.mr]||[]).push(w));
    h+=`<p class="small muted" style="margin:0">The cheapest weapons to rank, grouped by the Mastery Rank you need to build them. Together they give ${fmt(D.meta.sheetXp)} XP, enough to reach MR 12. "Path to max" carries on from there.</p>`+Object.keys(by).sort((a,b)=>a-b).map(mr=>`<details class="obj grp" data-scope="input.ck.mk" ${mr<=2?'open':''}><summary><h3>Mastery ${mr}</h3>${progHTML()}</summary>${by[mr].map(w=>mrow(w.id,w.slot)).join('')}</details>`).join('')}
  if(tab==='sframes')h+=`<details class="obj grp" data-scope="input.ck.mk" open><summary><h3>Easy Warframes</h3>${progHTML()}</summary>${M.frames.map(f=>mrow(f.id,f.src)).join('')}</details>
    <details class="obj grp" data-scope="input.ck.mk" open><summary><h3>Market companions</h3>${progHTML()}</summary>${M.companions.map(f=>mrow(f.id,'Market blueprint')).join('')}</details>`;
  if(tab==='craft'){const by={};M.craft.forEach(x=>(by[x.mr]=by[x.mr]||[]).push(x));
    h+=`<div class="callout small">Weapons used to craft other weapons. Rank the ingredient for its XP first, then build a spare copy for the recipe.</div>`+
    Object.keys(by).sort((a,b)=>a-b).map(mr=>`<details class="obj grp" data-scope="input.ck.mk" open><summary><h3>MR ${mr}</h3>${progHTML()}</summary>${by[mr].map(x=>`<div style="padding:10px 14px 0;border-top:1px solid var(--line)"><div class="mono small">${esc(x.recipe)} · ${fmt(x.xp)} XP</div>${x.note?`<div class="small" style="color:var(--warn)">${esc(x.note)}</div>`:''}</div>${x.targets.map(t=>mrow(t.id,'')).join('')}`).join('')}</details>`).join('')}
  if(tab==='xp')h+=`<div class="panel stack cut"><h2>Where to level gear fast</h2>
    <p class="small muted" style="margin:0">Best spots first. A frame that clears whole rooms ranks a fresh weapon to 30 in a few waves; stack an Affinity Booster on days you level several items.</p></div>
    <ol class="steps obj">${[['Hydron, Sedna (Defense)','Classic spot. Bring a frame that clears rooms (Saryn, Mesa, Gyre). Leave after wave 5–10.'],['Helene, Saturn (Defense)','Lower level than Hydron, good for new players. Also drops Orokin Cells.'],['Elite Sanctuary Onslaught','Best XP per minute once you have a strong frame. Talk to Cephalon Simaris in a Relay (needs The New Strange).'],['Steel Path Hydron / Helene','Same nodes on Steel Path give much more XP. Needs a strong build.'],['Affinity Booster + Sortie/Arbitration boosters','Boosters stack. Save them for a day you plan to level several items.'],['Star chart + Steel Path completion','The first clear of each node gives Mastery XP, and Steel Path pays it again. Track it under Missions.']].map(([a,b],i)=>step('xpfarm|'+i,a,b)).join('')}</ol>`;
  return h+'</div>'}
function ease(it){if(it.p)return it.v?(VAULT[it.n]&&VAULT[it.n].now?2:4):2;if(it.bc)return 0;if(it.bpd||it.dr)return 1;return 3}
const EASE=['Market blueprints','Boss and node drops','Farm relics','Quest, syndicate or vendor','Vaulted: buy on warframe.market'];
function pathTab(){const t=totalXP(),cur=mrInfo(t.total).mr;let target=+state.target||cur+1;if(target<=cur)target=cur+1;
  const need=Math.max(0,mrNeed(target)-t.total);const cap=Math.min(Math.max(cur,0),30);
  const cand=MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=Math.max(cap,Math.min(target,30))).map(it=>({it,gain:mxp(it)-itemXP(it.n),e:ease(it)})).filter(x=>x.gain>0).sort((a,b)=>a.e-b.e||b.gain-a.gain||(a.it.mr||0)-(b.it.mr||0));
  let acc=0;const plan=[];for(const x of cand){if(acc>=need)break;plan.push(x);acc+=x.gain}
  const nodesLeft=NODES.filter(n=>!on('n|'+n.id)),spLeft=NODES.filter(n=>!on('sp|'+n.id));const nx=nodesLeft.reduce((a,n)=>a+n.x,0),sx=spLeft.reduce((a,n)=>a+n.x,0);
  const gearLeft=cand.reduce((a,x)=>a+x.gain,0);
  const opts=[];for(let m=cur+1;m<=Math.max(cur+6,40);m++)opts.push(m);
  const by={};plan.forEach(x=>(by[x.e]=by[x.e]||[]).push(x));
  return `<div class="panel stack cut"><h2>Plan to rank ${mrLabel(target)}</h2>
  <div class="row"><label class="small" for="tgt">Target</label><select id="tgt" style="width:auto;flex:0 1 240px">${opts.map(m=>`<option value="${m}" ${m===target?'selected':''}>${m>30?'Legendary '+(m-30):'MR '+m} · ${fmt(mrNeed(m))} XP</option>`).join('')}</select></div>
  <div class="kv"><span>XP still needed</span><span class="num"><b>${fmt(need)}</b></span><span>XP left in gear you can use</span><span class="num">${fmt(gearLeft)}</span><span>XP left on the star chart</span><span class="num">${fmt(nx)}</span><span>XP left on Steel Path</span><span class="num">${fmt(sx)}</span></div>
  ${need>gearLeft+nx+sx?`<div class="callout small">That's more XP than is left in gear and nodes you can use right now. The rest comes from intrinsics, gear that unlocks at a higher MR, and new releases.</div>`:''}
  <div class="small muted">The plan picks the easiest gear first (market blueprints, then boss drops, then farmable Primes) until the gap is covered. Clearing star chart and Steel Path nodes counts too.</div></div>
  ${Object.keys(by).sort().map(e=>`<details class="obj grp" data-scope="input.ck.mk" open><summary><h3>${EASE[e]}</h3>${progHTML()}<span class="mono small muted">${fmt(by[e].reduce((a,x)=>a+x.gain,0))} XP</span></summary>${by[e].map(x=>mrow(x.it.n,'')).join('')}</details>`).join('')}
  ${nodesLeft.length?`<a class="panel navcard cut" href="#missions"><span class="eyebrow">Also counts</span><h3>${nodesLeft.length} star chart nodes left · ${fmt(nx)} XP</h3><span class="small muted">Plus ${spLeft.length} Steel Path nodes (${fmt(sx)} XP). Open Missions.</span></a>`:''}`}
function ladderTab(){const t=totalXP(),cur=mrInfo(t.total).mr;const rows=[];
  for(let m=1;m<=40;m++){const gear=m<=30?MI.filter(i=>(i.mr||0)===m):[];const qs=Q.filter(q=>q.req.some(r=>r==='Mastery Rank '+m));
    rows.push(`<div class="card cut" ${m===cur+1?'style="border-color:var(--gold)"':''}><div class="top"><span class="nm">${m>30?'Legendary '+(m-30):'MR '+m}</span><span class="row">${m<=cur?'<span class="chip good">Reached</span>':m===cur+1?'<span class="chip teal">Next</span>':''}<span class="mono small">${fmt(mrNeed(m))} XP</span></span></div>
    ${m<=30?`<div class="small muted">Trades per day: ${m} · Daily standing cap: ${fmt(16000+500*m)}</div>`:`<div class="small muted">Each Legendary rank needs 147,500 more XP.</div>`}
    ${qs.length?`<div class="small">Quests unlocked: ${qs.map(q=>`<a class="ln" href="#quests" data-q="${esc(q.n)}">${esc(q.n)}</a>`).join(', ')}</div>`:''}
    ${gear.length?`<details class="more"><summary>Gear that needs MR ${m} (${gear.filter(g=>on('m|'+g.n)).length}/${gear.length} mastered)</summary><div class="row">${gear.map(g=>`<button class="btn sm" data-go="item|${esc(g.n)}">${esc(g.n)}${on('m|'+g.n)?' ✓':''}</button>`).join('')}</div></details>`:''}</div>`)}
  return `<div class="cards">${rows.join('')}</div>`}
function mrow(id,note){if(!id)return'';const it=I[id];const k='m|'+id;const rk=P.rk[id];
  return `<div class="mitem${on(k)?' done':''}"><div class="top">${ck(k,'mk')}<details class="lazy" data-tree="${esc(id)}" data-note="${esc(note||'')}"><summary><span class="nm">${esc(id)}</span>${it&&it.mr?`<span class="chip">MR ${it.mr}</span>`:''}${rk&&!on(k)?`<span class="chip teal">R${rk}</span>`:''}<span class="chip">${fmt(mxp(it))} XP</span>${it&&it.p?priceChip(id+' Set'):''}<span class="open">Steps ▾</span>${note?`<span class="small muted" style="flex-basis:100%">${esc(note)}</span>`:''}</summary><div class="lazybody"></div></details></div></div>`}
function allTab(){const cats=['Warframe','Primary','Secondary','Melee','Companion','Archwing','Arch-Gun','Arch-Melee','Robotic Weapon'];
  const cat=state.allCat;const q=state.allQ.toLowerCase();
  let list=q?Object.values(I).filter(i=>i.n.toLowerCase().includes(q)):Object.values(I).filter(i=>i.c===cat);
  list.sort((a,b)=>a.n.localeCompare(b.n));if(state.allHide)list=list.filter(i=>!on('m|'+i.n));
  return `<div class="seg">${cats.map(c=>{const all=Object.values(I).filter(i=>i.c===c);const d=all.filter(i=>on('m|'+i.n)).length;return `<button class="btn ${c===cat&&!q?'on':''}" data-cat="${c}">${c} <span class="mono small">${d}/${all.length}</span></button>`}).join('')}</div>
  <div class="row"><input id="allq" type="search" placeholder="Search all gear" value="${esc(state.allQ)}" style="flex:1 1 200px" aria-label="Search all gear"><button class="btn ${state.allHide?'on':''}" id="allhide">Hide mastered</button></div>
  <div class="obj" data-scope="input.ck.mk"><div class="obj-h"><b>${q?'Search results':esc(cat)}</b>${progHTML()}</div>${list.slice(0,400).map(i=>mrow(i.n,'')).join('')||'<div class="empty">Nothing left here. Everything is mastered.</div>'}</div>`}

