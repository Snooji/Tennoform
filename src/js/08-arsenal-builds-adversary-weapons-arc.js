/* ---------- arsenal: builds, adversary weapons, arcanes, key mods ---------- */
function arsenal(){const tab=state.aTab||'builds';
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Arsenal</div><h1>Builds & collections</h1><p class="lede">Weapon and companion builds, your Kuva, Tenet and Coda weapons, arcanes and the mods every build leans on.</p></div>
  ${segBtns('atab',tab,[['builds','Weapon builds'],['comp','Companion builds'],['lich','Kuva · Tenet · Coda'],['arc','Arcanes'],['mods','Key mods']])}`;
  h+=tab==='comp'?buildsTab(D.cbuilds,'comp'):tab==='lich'?lichTab():tab==='arc'?arcTab():tab==='mods'?keyModsTab():buildsTab(D.wbuilds,'w');
  return h+'</div>'}
function buildsTab(src,kind){const cats=[...new Set(Object.keys(src).map(n=>I[n]?I[n].c:'Other'))];
  const cf=kind==='w'?(state.wbC||'all'):'all',of=state.wbO||'all';
  let names=Object.keys(src).filter(n=>(cf==='all'||(I[n]&&I[n].c===cf))&&(of==='all'||(of==='own'&&ownedItem(n))||(of==='not'&&!ownedItem(n))||(of==='unmastered'&&!on('m|'+n)))).sort();
  if(!names.length)names=Object.keys(src).sort();
  const key=kind==='w'?'wbSel':'cbSel';let cur=state[key];if(!cur||!names.includes(cur))cur=names[0];state[key]=cur;
  const bs=src[cur]||[];const bi=Math.max(0,Math.min(state.wbI||0,bs.length-1));const b=bs[bi];
  let h=`<div class="row">${kind==='w'?sel('wbc',cf,[['all','All weapons'],...cats.sort().map(c=>[c,c])],'Weapon type'):''}${sel('wbo',of,[['all','Owned or not'],['own','Owned'],['not','Not owned'],['unmastered','Not mastered']],'Ownership')}
   ${sel('wbsel',cur,names.map(n=>[n,n]),kind==='w'?'Weapon':'Companion').replace('style="width:auto"','style="flex:1 1 200px"')}</div>
  <div class="split wf">${I[cur]?itemTree(cur):`<div class="panel">${esc(cur)}</div>`}`;
  if(b){const slots=[...(b.exilus?[['Exilus',b.exilus]]:[]),...b.mods.map(m=>['Mod',m])];
    h+=`<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>Build</h3></div>${bs.length>1?segBtns('wbi',String(bi),bs.map((x,i)=>[String(i),esc(x.name)])):''}${progHTML()}</div>
    <div style="padding:12px 14px" class="stack"><div class="row"><span class="chip teal">${esc(b.role)}</span><b>${esc(b.name)}</b></div>${b.notes?`<div class="small muted">${esc(b.notes)}</div>`:''}
    <div class="mods">${slots.map(([s,m])=>modCard(s,m)).join('')}${b.arcanes.map(a=>arcCard(a)).join('')}</div>
    <div class="small muted">Community consensus build. Pick elements to match the faction you're fighting.</div></div></section>`}
  return h+'</div>'}
const ELEM=['','Heat','Cold','Electricity','Toxin','Impact','Magnetic','Radiation'];
function lichTab(){const ff=state.lF||'all',sf=state.lS||'all';const L2=P.lich||{};
  const own=n=>on('lich|'+n)||ownedItem(n);
  let list=D.lich.filter(w=>(ff==='all'||w.f===ff)&&(sf==='all'||(sf==='own'&&own(w.n))||(sf==='miss'&&!own(w.n))||(sf==='low'&&own(w.n)&&(+((L2[w.n]||{}).b)||0)<60)||(sf==='unm'&&!on('m|'+w.n))));
  list.sort((a,b)=>a.f.localeCompare(b.f)||a.n.localeCompare(b.n));
  const tot=D.lich.length,have=D.lich.filter(w=>own(w.n)).length,mast=D.lich.filter(w=>on('m|'+w.n)).length;
  let h=`<div class="tiles"><div class="tile cut"><span class="k">Owned</span><span class="v num">${have}<small>/${tot}</small></span><span class="tbar"><i style="width:${have/tot*100}%"></i></span></div>
   <div class="tile cut"><span class="k">Mastered</span><span class="v num">${mast}<small>/${tot}</small></span><span class="tbar"><i style="width:${mast/tot*100}%"></i></span><span class="x">rank 40 · 4,000 XP each</span></div>
   ${['Kuva','Tenet','Coda'].map(f=>{const a=D.lich.filter(w=>w.f===f);const o=a.filter(w=>own(w.n)).length;return `<div class="tile cut"><span class="k">${f}</span><span class="v num">${o}<small>/${a.length}</small></span><span class="tbar"><i style="width:${o/a.length*100}%"></i></span></div>`}).join('')}</div>
  <details class="obj grp"><summary><h3>How to get them</h3></summary><div class="stack" style="padding:10px 14px">${Object.entries(D.lichsrc).map(([f,s])=>`<div><b>${f} · ${esc(s.who)}</b><div class="small">${esc(s.how)}</div><div class="small muted">Vanquish: ${esc(s.vanq)} ${esc(s.alt)}</div></div>`).join('')}
   <div class="small muted">Valence Fusion: combine two copies of the same weapon to raise its bonus element. Max is 60%.</div></div></details>
  <div class="row">${sel('lf',ff,[['all','All factions'],['Kuva','Kuva'],['Tenet','Tenet'],['Coda','Coda']],'Faction')}${sel('ls',sf,[['all','All weapons'],['own','Owned'],['miss','Missing'],['low','Owned, under 60%'],['unm','Not mastered']],'Status')}</div>
  <div class="obj" data-scope="input.ck.lw"><div class="obj-h"><b>${list.length} weapons</b>${progHTML()}</div><div class="lichl">${list.map(w=>{const v=L2[w.n]||{};const o=own(w.n);
    return `<div class="lrow${o?' done':''}"><div class="lnm">${ck('lich|'+w.n,'sm lw')}<span>${L(w.n)} <span class="small muted">${esc(w.c)}${rankOf(w.n)&&!on('m|'+w.n)?' · rank '+rankOf(w.n):''}</span></span>${mxChip(w.n)}${priceChip(w.n)}</div>
    <div class="lctl"><select data-lel="${esc(w.n)}" aria-label="Bonus element for ${esc(w.n)}">${ELEM.map(e=>`<option value="${e}" ${v.e===e?'selected':''}>${e||'Element'}</option>`).join('')}</select>
    <input type="number" min="25" max="60" inputmode="numeric" data-lb="${esc(w.n)}" value="${v.b||''}" placeholder="%" aria-label="Bonus percent" style="width:70px">${v.b>=60?'<span class="chip ok">60%</span>':''}</div></div>`}).join('')||'<div class="empty">Nothing matches.</div>'}</div></div>`;
  return h}
const arcCopies=r=>(r+1)*(r+2)/2;
function arcRank(c){let r=-1;while(arcCopies(r+1)<=c)r++;return r}
function arcUses(){if(arcUses.m)return arcUses.m;const m={};const add=(bs,w)=>bs.forEach(b=>(b.arcanes||[]).forEach(a=>{(m[a]=m[a]||new Set()).add(w)}));
  for(const w in D.builds)add(D.builds[w],w);for(const w in D.wbuilds)add(D.wbuilds[w],w);return arcUses.m=m}
function arcTab(){const q=(state.arQ||'').toLowerCase(),tf=state.arT||'all',sf=state.arS||'all',so=state.arO||'use';const A=P.arc||{};const U2=arcUses();
  const types=[...new Set(Object.values(ARC).map(a=>a.ty).filter(Boolean))].sort();
  let list=Object.values(ARC).filter(a=>(!q||a.n.toLowerCase().includes(q))&&(tf==='all'||a.ty===tf)).filter(a=>{const c=+A[a.n]||0,mx=arcCopies(a.mx||5);return sf==='all'||(sf==='used'&&U2[a.n])||(sf==='own'&&c>0)||(sf==='max'&&c>=mx)||(sf==='part'&&c>0&&c<mx)||(sf==='none'&&!c)});
  list.sort((a,b)=>so==='name'?a.n.localeCompare(b.n):so==='price'?((pv(b.n)??-1)-(pv(a.n)??-1)):so==='need'?((arcCopies(b.mx||5)-(+A[b.n]||0))-(arcCopies(a.mx||5)-(+A[a.n]||0))):(((U2[b.n]?U2[b.n].size:0)-(U2[a.n]?U2[a.n].size:0))||a.n.localeCompare(b.n)));
  const owned=Object.values(ARC).filter(a=>(+A[a.n]||0)>0).length,maxed=Object.values(ARC).filter(a=>(+A[a.n]||0)>=arcCopies(a.mx||5)).length;
  return `<div class="tiles"><div class="tile cut"><span class="k">Arcanes owned</span><span class="v num">${owned}<small>/${Object.keys(ARC).length}</small></span></div><div class="tile cut"><span class="k">Max rank</span><span class="v num">${maxed}</span><span class="x">rank 5 takes 21 copies</span></div></div>
  <p class="small muted" style="margin:0">Enter how many copies you have in total (ranked ones count all the copies fused into them). The rank and copies left to max are worked out for you.</p>
  <div class="row"><input id="arq" type="search" placeholder="Find an arcane" value="${esc(state.arQ||'')}" style="flex:1 1 160px" aria-label="Find an arcane">${sel('art',tf,[['all','All types'],...types.map(t=>[t,t])],'Arcane type')}${sel('ars',sf,[['all','All'],['used','Used in builds'],['own','Owned'],['part','Not maxed'],['max','Maxed'],['none','Missing']],'Status')}${sel('aro',so,[['use','Sort: most used'],['need','Sort: copies needed'],['price','Sort: price'],['name','Sort: name']],'Sort')}</div>
  <div class="cards">${list.slice(0,200).map(a=>{const c=+A[a.n]||0,mx=a.mx||5,need=arcCopies(mx),r=arcRank(c);const u=U2[a.n];
    return `<div class="card cut"><div class="top"><span class="nm">${L(a.n)}</span>${c>=need?'<span class="chip ok">Max</span>':c?`<span class="chip teal">Rank ${r}</span>`:''}${priceChip(a.n)}</div>
    <div class="row small" style="gap:8px"><label for="ac-${esc(a.n.replace(/\W/g,''))}" class="muted">Copies</label><button class="btn sm" data-arcd="${esc(a.n)}|-1" aria-label="One fewer">−</button><input id="ac-${esc(a.n.replace(/\W/g,''))}" type="number" min="0" inputmode="numeric" data-arc="${esc(a.n)}" value="${c||''}" placeholder="0" style="width:70px"><button class="btn sm" data-arcd="${esc(a.n)}|1" aria-label="One more">+</button><span class="muted">${c>=need?'maxed':`${need-c} more to rank ${mx}`}</span></div>
    <div class="small muted">${esc(a.ty||'')}${u?` · used in ${[...u].slice(0,4).map(esc).join(', ')}${u.size>4?' +'+(u.size-4):''}`:''}</div>
    ${a.dr&&a.dr.length?`<div class="small">${dropsList(a.dr,2)}</div>`:''}</div>`}).join('')||'<div class="empty">Nothing matches.</div>'}</div>`}
function keyMods(){if(keyMods.m)return keyMods.m;const m={};const add=(bs,w)=>bs.forEach(b=>[b.aura,b.exilus,...(b.mods||[])].filter(Boolean).forEach(x=>{(m[x]=m[x]||new Set()).add(w)}));
  for(const w in D.builds)add(D.builds[w],w);for(const w in D.wbuilds)add(D.wbuilds[w],w);for(const w in D.cbuilds)add(D.cbuilds[w],w);
  return keyMods.m=Object.entries(m).map(([n,s])=>({n,s,md:MODS[n]||{}})).sort((a,b)=>b.s.size-a.s.size||a.n.localeCompare(b.n))}
function keyModsTab(){const sf=state.kmS||'all',tf=state.kmT||'all';const all=keyMods();const types=[...new Set(all.map(x=>x.md.ty).filter(Boolean))].sort();
  const list=all.filter(x=>(tf==='all'||x.md.ty===tf)&&(sf==='all'||(sf==='miss'&&!on('mod|'+x.n))||(sf==='have'&&on('mod|'+x.n))||(sf==='trade'&&x.md.tr)));
  const have=all.filter(x=>on('mod|'+x.n)).length;
  return `<p class="small muted" style="margin:0">Every mod used by the builds in this app, most-used first. Tick the ones you own; the same ticks show on every build.</p>
  <div class="row">${sel('kmt',tf,[['all','All mod types'],...types.map(t=>[t,t])],'Mod type')}${sel('kms',sf,[['all','All'],['miss','Missing'],['have','Owned'],['trade','Tradeable']],'Status')}<span class="chip gold">${have}/${all.length} owned</span></div>
  <div class="obj" data-scope="input.ck.km"><div class="obj-h"><b>${list.length} mods</b>${progHTML()}</div><ol class="steps">${list.map(x=>{const md=x.md;const k='mod|'+x.n;
    return `<li class="step${on(k)?' done':''}">${ck(k,'km')}<div><div class="lbl">${esc(x.n)} ${priceChip(x.n)} <span class="small muted">${esc(md.ty||'')} · in ${x.s.size} build${x.s.size>1?'s':''}</span></div><div class="src">${md.src?esc(md.src):md.dr&&md.dr.length?dropsList(md.dr,2):'Trade on warframe.market'}</div></div></li>`}).join('')}</ol></div>`}

