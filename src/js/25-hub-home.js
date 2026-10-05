/* ---------- hub (home) ---------- */
function easiest(k){const cur=Math.max(mrInfo(totalXP().total).mr,1);return MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=Math.min(cur,30)).map(it=>({it,gain:mxp(it)-itemXP(it.n),e:ease(it)})).filter(x=>x.gain>0).sort((a,b)=>a.e-b.e||b.gain-a.gain).slice(0,k)}
function heroHTML(){const t=totalXP(),m=mrInfo(t.total);const name=P.tname||(P.prof&&P.prof.name)||'Tenno';const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length;
  return `<section class="hero cut" id="hero"><div class="ring big" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></div>
  <div class="hero-t"><div class="eyebrow">${m.mr>30?'Legendary rank':'Mastery rank'} ${mrLabel(m.mr)}${P.prof&&P.prof.mr!=null?` · in-game ${mrLabel(P.prof.mr)}`:''}</div><h1>${esc(name)}</h1>
  <div class="xpline"><b class="num">${fmt(t.total)}</b> <span class="muted">/ ${fmt(m.next)} XP</span></div>
  <div class="nextbar"><i style="width:${m.pct.toFixed(1)}%"></i></div>
  <div class="small muted">${fmt(m.next-t.total)} XP to ${m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1)} · ${maxed} items mastered</div>
  <div class="row" style="margin-top:6px"><a class="btn primary" href="#ranks">Update ranks</a><a class="btn" href="#tenno" data-ttab="breakdown">Breakdown</a><a class="btn" href="#mastery">Rank-up plan</a></div></div></section>`}
function syncCard(){const L2=P.lastSync;if(!L2)return'';return `<div class="panel cut stack" style="gap:6px"><div class="row" style="justify-content:space-between"><span class="eyebrow">Last sync · ${fdate(L2.at)}</span><a class="small ln" href="#tenno" data-ttab="account">Sync again</a></div>
  <div class="row small" style="gap:6px"><span class="chip good">${L2.maxed} mastered</span><span class="chip teal">${L2.partial} in progress</span><span class="chip">${L2.nodes} nodes</span><span class="chip">${L2.quests.length} quests detected</span><span class="chip">${L2.synd} syndicates</span><span class="chip">${L2.owned} items owned → crafting steps ticked</span></div>
  ${L2.quests.length?`<div class="small muted">Quests detected from your account: ${L2.quests.map(q=>esc(q)).join(', ')}.</div>`:''}</div>`}
