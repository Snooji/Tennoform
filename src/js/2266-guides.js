/* ---------- guides: quests, unlockable systems and mission types, step by step ---------- */
const GUIDES=D.guides||[];const GIDX=Object.fromEntries(GUIDES.map(g=>[g.id,g]));
const GKIND={quest:'Quests',system:'Unlocks',mode:'Missions'};
const guideOfQuest=n=>GUIDES.find(g=>g.kind==='quest'&&g.n===n);
function guideKey(n){if(I[n])return 'item|'+n;if(Q.some(q=>q.n===n))return 'quest|'+n;if(RES[n])return 'res|'+n;if(MODS[n])return 'mod|'+n;if(ARC[n])return 'arc|'+n;const g=GUIDES.find(x=>x.n===n);return g?'guide|'+g.id:''}
function guideSteps(id){return ((P.gd||{})[id])||[]}
function guideUnlock(g){const m=mrInfo(totalXP().total).mr;const u=g.unlock||{};
  const qs=(u.quests||[]).map(n=>({n,done:qDone(n),guide:(guideOfQuest(n)||{}).id||''}));
  const mrOk=u.mr==null||m>=u.mr;return {mr:u.mr==null?null:u.mr,mrHave:m,mrOk,quests:qs,other:u.other||[],ready:mrOk&&qs.every(q=>q.done)}}
/* search: guides first, matched by name and everyday words ("helminth chair") */
const _cmdIndex=cmdIndex;cmdIndex=function(){if(CMDX)return CMDX;const x=_cmdIndex();
  for(const g of GUIDES)x.push({n:g.n+(g.kind==='quest'?' guide':''),g:'Guides',act:'guide|'+g.id,l:(g.n+(g.kind==='quest'?' guide':'')).toLowerCase(),a:[...(g.aka||[]),GKIND[g.kind]||'',...(g.was||[])].join(' ').toLowerCase().replace(/[^a-z0-9 ]+/g,' ')});
  return CMDX=x};
CMDG.unshift('Guides');
const CMD_STOP=new Set(['how','to','do','i','get','the','a','an','unlock','unlocking','unlocked','where','is','what','find','for','can','you','my','in','of','guide','quest','open','start','make','build','farm','obtain']);
const _cmdFind=cmdFind;cmdFind=function(q){const raw=(q||'').toLowerCase().trim();const k=raw.split(/\s+/).filter(w=>w&&!CMD_STOP.has(w)).join(' ');
  if(k&&k!==raw){const r=_cmdFind(k);if(r.length)return r}return _cmdFind(raw)};
const _go=go;go=function(t){if(t.startsWith('guide|')){state.gSel=t.slice(6);state.gQ='';if(location.hash!=='#guides')location.hash='guides';else render();window.scrollTo(0,0);return}_go(t)};
function guides(){const k=state.gF||'all';const L=GUIDES.filter(g=>k==='all'||g.kind===k);
  return `<div class="stack"><div class="head"><div class="eyebrow">Plan</div><h1>Guides</h1><p class="lede">Step-by-step guides for every quest, unlockable system and mission type.</p></div>
  <div class="panel cut stack">${L.map(g=>`<a class="ln" href="#" data-go="guide|${esc(g.id)}">${esc(g.n)}</a>`).join('<br>')||'No guides yet.'}</div></div>`}
