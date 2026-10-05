/* ---------- rows that open: tap a checklist item or a Next up card to see details; only the checkbox completes it ---------- */
state.ckOpen=state.ckOpen||{};state.nuOpen=state.nuOpen||{};
function ckEnd(c){return ckReset(c)+(c[0]==='d'?DAY:7*DAY)}
function ckLive(c){const w=WS;const id=c[1];if(!w)return HOSTED&&!WSerr?'<div class="small muted">Loading live details…</div>':'';
  if(id==='sortie'&&w.sortie&&w.sortie.variants)return `<div class="small"><b>${esc(w.sortie.boss||'Sortie')}</b>${w.sortie.faction?' · '+esc(w.sortie.faction):''}</div><ol class="ckol small">${w.sortie.variants.map(v=>`<li><b>${esc(v.missionType)}</b> · ${esc(v.node)}<div class="muted">${esc(v.modifier)}</div></li>`).join('')}</ol>`;
  if(id==='archon'&&w.archonHunt&&w.archonHunt.missions)return `<div class="small"><b>${esc(w.archonHunt.boss||'Archon Hunt')}</b></div><ol class="ckol small">${w.archonHunt.missions.map(v=>`<li><b>${esc(v.type)}</b> · ${esc(v.node)}</li>`).join('')}</ol>`;
  if((id==='nwd'||id==='nww')&&w.nightwave&&w.nightwave.activeChallenges){const ac=w.nightwave.activeChallenges.filter(x=>id==='nwd'?x.isDaily:!x.isDaily);
    return ac.length?`<ul class="ckol small">${ac.map(x=>`<li><b>${esc(x.title)}</b> · ${fmt(x.reputation)} standing${x.isElite?' (elite)':''}<div class="muted">${esc(x.desc)}${(P.dw||{})['nw|'+x.id]?' · done':''}</div></li>`).join('')}</ul><div class="small muted">Tick single acts under <b>Nightwave acts</b> further down.</div>`:''}
  if(id==='teshin'&&w.steelPath&&w.steelPath.currentReward)return `<div class="small">This week: <b>${esc(w.steelPath.currentReward.name)}</b> for ${w.steelPath.currentReward.cost} Steel Essence.</div>`;
  return ''}
const CKLINK={synd:['#synd','Open Syndicates'],openworld:['#synd','Open Syndicates'],simaris:['#synd','Open Syndicates'],sortie:null,teshin:null};
function ckMore(c){const end=ckEnd(c),ok=gateOK(c[4]);const lk=CKLINK[c[1]];
  return `<div class="ckmore" id="ckm-${esc(c[1].replace(/\W/g,'_'))}">${ckLive(c)}
   <div class="small muted">${ckDone(c)?'Done '+new Date((P.dw||{})[c[1]]).toLocaleString([],{weekday:'short',hour:'numeric',minute:'2-digit'})+' · ':''}Resets in ${left(end-Date.now())} (${lt(end)} your time)</div>
   ${ok?'':`<div class="small">Unlocks after the quest <a class="ln" href="#quests" data-q="${esc(c[4])}">${esc(c[4])}</a>.</div>`}
   <div class="row ckact">${lk?`<a class="btn sm" href="${lk[0]}">${lk[1]}</a>`:''}${ltBtn(c[2],new Date(end).toISOString())}${ckTools(c)}</div></div>`}
function ckRow(c){const ok=gateOK(c[4]),dn=ckDone(c),open=!!state.ckOpen[c[1]];const mid='ckm-'+c[1].replace(/\W/g,'_');
  return `<div class="qrow ckrow${dn?' done':''}${open?' open':''}"><input type="checkbox" class="ck" data-dw="${esc(c[1])}" ${dn?'checked':''} ${ok?'':'disabled'} aria-label="Mark done: ${esc(c[2])}">
   <div class="ckbody"><button type="button" class="ckhead" data-ckx="${esc(c[1])}" aria-expanded="${open}" aria-controls="${esc(mid)}"><span class="nm lbl">${esc(c[2])}</span><span class="chip">${c[0]==='d'?'Daily':'Weekly'}</span>${ok?'':'<span class="chip warn">Locked</span>'}${(P.ckPin||[]).includes(c[1])?`<span class="ckpin" title="Pinned">${ic('pin','fill')}</span>`:''}<span class="ckchev" aria-hidden="true">${ic('chev')}</span></button>
   <div class="small muted">${esc(c[3])}</div>${open?ckMore(c):''}</div></div>`}

/* next up: the checkbox completes, the card opens */
function nextCard(){NU=nextUp();const nz=Object.values(P.nuSnz||{}).filter(z=>z>=lastDaily()).length;
  const openL=x=>x.go?`<a class="btn sm" href="#" data-go="${esc(x.go)}">Open</a>`:x.q?`<a class="btn sm" href="#quests" data-q="${esc(x.q)}">Open quest</a>`:x.href?`<a class="btn sm" href="${x.href}" ${x.tt?`data-ttab="${x.tt}"`:''}>Open</a>`:'';
  return `<section class="panel cut stack nextup" style="gap:8px" aria-labelledby="nu-h"><div class="row" style="justify-content:space-between"><h2 id="nu-h">Next up</h2><span class="small muted">${esc(stage())}</span></div>
  ${NU.map((x,i)=>{const open=!!state.nuOpen[x.id];const pic=x.go&&x.go.startsWith('item|')&&art(x.go.slice(5),'mini');
   return `<div class="nu2${open?' open':''}">${x.done?`<input type="checkbox" class="ck" data-nudone="${i}" aria-label="${esc(x.doneL||'Done')}: ${esc(x.t)}">`:`<span class="nun" aria-hidden="true">${i+1}</span>`}
   <div class="nut"><button type="button" class="nuhead" data-nux="${esc(x.id)}" aria-expanded="${open}">${pic||''}<span class="nutx"><b>${esc(x.t)}</b><span class="small muted">${esc(x.why)}</span></span><span class="ckchev" aria-hidden="true">${ic('chev')}</span></button>
   ${open?`<div class="numore">${x.pre&&x.pre.length?`<ul class="small">${x.pre.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:''}
    <div class="nuact">${openL(x)}${x.task?taskBtn(...x.task):''}<button type="button" class="btn sm ghost" data-nusnz="${i}" aria-label="Not now: ${esc(x.t)}">Not now</button></div>
    ${x.done?`<div class="small muted">Tick the box when it's done${x.doneL?` (${esc(x.doneL.toLowerCase())})`:''}. Mistake? Undo it from <a class="ln" href="#achievements">Achievements</a>.</div>`:''}</div>`:''}</div></div>`}).join('')||'<div class="small muted">You\'re all caught up. Pick something from Goals or the rank-up plan.</div>'}
  ${nz?`<button type="button" class="small linkbtn" id="nuunsnz">Show ${nz} snoozed suggestion${nz>1?'s':''}</button>`:''}</section>`}

function rowToggle(store,id){store[id]=!store[id];const y=scrollY;rerender();scrollTo(0,y);
  const b=document.querySelector(`[data-ckx="${CSS.escape(id)}"],[data-nux="${CSS.escape(id)}"]`);if(b)b.focus({preventScroll:true})}
document.addEventListener('click',e=>{
  const h=e.target.closest('[data-ckx],[data-nux]');if(h){rowToggle(h.dataset.ckx!=null?state.ckOpen:state.nuOpen,h.dataset.ckx!=null?h.dataset.ckx:h.dataset.nux);return}
  /* a tap on the empty part of a row opens it too */
  const row=e.target.closest('.ckrow,.nu2');if(!row||e.target.closest('a,button,input,select,textarea,label,summary,.ckmore,.numore'))return;
  const b=row.querySelector('[data-ckx],[data-nux]');if(b)b.click()});
