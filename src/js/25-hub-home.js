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
function home(){const qd=Q.filter(q=>on('q|'+q.n)).length;const nq=nextQuest();
  const now=Date.now();const fl=(P.foundry||[]).slice().sort((a,b)=>(a.t0+a.dur*1000)-(b.t0+b.dur*1000));const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;
  const nd=ALLN.filter(n=>on('n|'+n.id)).length,sd=ALLN.filter(n=>on('sp|'+n.id)).length;
  const dd=allChecks().filter(c=>gateOK(c[4]));const ddone=dd.filter(ckDone).length;
  const syn=D.synd.filter(e=>gateOK(e.gate)&&e.ranks.length);const near=syn.map(e=>{const st=synState(e),rr=rankRow(e,st.r);return [e,rr.max!=null?rr.max-st.s:1e9,st]}).filter(x=>x[1]>0&&x[1]<1e9).sort((a,b)=>a[1]-b[1])[0];
  const ez=easiest(5);
  return `<div class="stack"><div class="hubtop"><a class="donate-mini" href="#donate">♥ Support Tennoform <span class="muted">· built by one developer</span></a><a class="donate-mini" href="#feedback">✉ Feedback</a></div>${state.qs?quickStart():isNew()?welcome():`<p class="pitch">${PITCH}</p>`+heroHTML()}
  ${!isNew()&&HOSTED&&FB&&!synced?`<a class="nudge" href="#tenno" data-ttab="account"><span>💾</span><span><b>Sign in so you never lose progress.</b> <span class="muted">Free, with Google or email.</span></span><span class="go">Sign in →</span></a>`:''}
  ${isNew()?'':!P.at?`<a class="panel navcard cut" href="#tenno" data-ttab="account"><span class="eyebrow">Link your account</span><h3>Sync your Warframe profile</h3><span class="small muted">Optional. Fills in your ranks, missions, quests and syndicates from your public profile.</span></a>`:''}
  ${hubGrid()}${!isNew()&&P.at?syncCard():''}
  <details class="obj grp explore" ${lsGet('tf-explore',!PHONE())?'open':''}><summary><h3>All pages</h3></summary><div class="grid" style="padding:10px">${GROUPS.map(([g,rs])=>`<div class="stack" style="gap:6px"><span class="eyebrow">${g}</span>${rs.filter(r=>PL[r]&&r!=='home').map(r=>`<a class="panel navcard cut" href="#${r}"><h3>${PL[r]}</h3></a>`).join('')}</div>`).join('')}</div></details>
  <div class="callout small">${synced?(acct&&acct.kind==='fb'?'Signed in as '+esc(acct.email||acct.name||'you')+'. Everything saves to your account.':'Signed in: everything saves to your claude.ai account and follows you to any device.'):HOSTED?(FB?'Saving in this browser only. <a class="ln" href="#tenno" data-ttab="account">Sign in</a> to keep your progress forever on any device.':'Your progress saves in this browser. To move it to another device, use Tenno → Backup.'):'Your progress saves on this device. Sign in to claude.ai to sync it across devices.'}</div>
  </div>`}

