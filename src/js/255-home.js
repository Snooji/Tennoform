/* ---------- home: one question, five groups ---------- */
function mrCard(){const t=totalXP(),m=mrInfo(t.total);const name=P.tname||(P.prof&&P.prof.name)||'';const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;
  const toNext=m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1);const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length;
  const stale=P.wfid&&(!P.auto||Date.now()-Date.parse(P.auto)>864e5);
  const act=HOSTED&&!P.at&&!P.wfid?`<a class="btn primary" href="#tenno" data-ttab="account">Sync your profile</a>`
    :HOSTED&&stale?`<button type="button" class="btn primary" id="autosync">Sync now</button>`
    :`<a class="btn primary" href="#mastery">See rank-up plan</a>`;
  const parts=[['Gear',t.it,'var(--gold)'],['Star chart',t.ch,'var(--gold-dim)'],['Steel Path',t.sp,'var(--ink2)'],['Intrinsics',t.intr,'var(--line2)'],['Other',(t.other||0)+(t.adj||0)+(t.un||0),'var(--line)']].filter(p=>p[1]>0);
  const sum=parts.reduce((a,p)=>a+p[1],0)||1;
  return `<section class="mrcard" aria-labelledby="mr-h"><div class="mrtop"><div class="ring big" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></div>
   <div class="mrtxt"><h1 id="mr-h">${name?esc(name):(m.mr>30?'Legendary '+(m.mr-30):'Mastery rank '+m.mr)}</h1>
   <div class="small muted">${name?(m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr)+' · ':''}${g!=null&&g!==m.mr?`in game MR ${mrLabel(g)} · `:''}${maxed} items mastered</div>
   <div class="mrxp"><b>${fmt(t.total)}</b> <span class="muted">/ ${fmt(m.next)} XP · ${fmt(m.next-t.total)} to ${toNext}</span></div></div></div>
   <div class="small muted bdlab">Where your Mastery XP comes from</div>
   <div class="bdbar" role="img" aria-label="Mastery XP by source: ${parts.map(p=>p[0]+' '+fmt(p[1])).join(', ')}">${parts.map(p=>`<i style="width:${(p[1]/sum*100).toFixed(2)}%;background:${p[2]}"></i>`).join('')}</div>
   <div class="bdleg small">${parts.map(p=>`<span><i style="background:${p[2]}" aria-hidden="true"></i>${p[0]} <b>${fmt(p[1])}</b></span>`).join('')}</div>
   <div class="row mract">${act}<a class="btn" href="#ranks">Update ranks</a><a class="ln small" href="#tenno" data-ttab="breakdown">Full breakdown</a><button type="button" class="linkbtn small" data-share>Share progress</button></div></section>`}

/* since last time: compare with the totals from the previous visit (at least 30 minutes ago) */
let SEEN=null;
function seenNow(){const t=totalXP();return {t:Date.now(),xp:t.total,mr:mrInfo(t.total).mr,maxed:MI.filter(i=>itemXP(i.n)>=mxp(i)).length,q:Q.filter(q=>qDone(q.n)).length}}
function sinceLast(){const cur=seenNow();if(!SEEN){const prev=lsGet('tf-seen',null);SEEN=prev&&cur.t-prev.t>30*60e3?prev:(prev||cur);if(!prev||cur.t-prev.t>30*60e3)lsSet('tf-seen',cur)}
  const now=Date.now();const ready=(P.foundry||[]).filter(f=>now>=f.t0+f.dur*1000).length;const bits=[];
  if(SEEN!==cur&&SEEN.t<cur.t){if(cur.mr>SEEN.mr)bits.push(`MR ${SEEN.mr} → ${cur.mr}`);if(cur.maxed>SEEN.maxed)bits.push(`+${cur.maxed-SEEN.maxed} mastered`);if(cur.xp>SEEN.xp)bits.push(`+${fmt(cur.xp-SEEN.xp)} XP`);if(cur.q>SEEN.q)bits.push(`+${cur.q-SEEN.q} quest${cur.q-SEEN.q>1?'s':''}`)}
  if(ready)bits.push(`<a class="ln" href="#tenno" data-ttab="foundry">${ready} ready in the Foundry</a>`);
  return bits.length?`<p class="since small"><span class="muted">Since last time:</span> ${bits.join(' · ')}</p>`:''}

/* today strip: what is on before the next reset */
function todayStrip(){const now=Date.now();if(HOSTED&&!WS&&!WSerr)loadWS();const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const done=dd.filter(ckDone).length;
  const fl=(P.foundry||[]);const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;const tiles=[];
  tiles.push(`<a class="ts" href="#today"><span class="k">Daily reset</span><b>${lastDaily()+DAY-now<60000?'Resetting…':left(lastDaily()+DAY-now)}</b><span class="x">${done}/${dd.length} done</span></a>`);
  {const lg=logList().filter(e=>e.t>=lastDaily());const xp=lg.reduce((a,e)=>a+(e.xp||0),0);tiles.push(`<a class="ts" href="#achievements"><span class="k">Done today</span><b>${lg.length} thing${lg.length===1?'':'s'}</b><span class="x">${xp?'+'+fmt(xp)+' XP · ':''}Achievements</span></a>`)}
  if(WS&&WS.sortie&&WS.sortie.variants)tiles.push(`<a class="ts" href="#today"><span class="k">Sortie</span><b>${esc(WS.sortie.boss||'Today')}</b><span class="x">${untilIso(WS.sortie.expiry)} left</span></a>`);
  if(WS&&WS.fissures){const need=neededEras();const n=WS.fissures.filter(x=>!x.expired&&new Date(x.expiry)>now&&need[x.tier]).length;if(Object.keys(need).length)tiles.push(`<a class="ts" href="#today"><span class="k">Fissures you need</span><b>${n}</b><span class="x">${Object.keys(need).slice(0,3).join(', ')}</span></a>`)}
  if(WS&&WS.steelPath&&WS.steelPath.currentReward)tiles.push(`<a class="ts" href="#today"><span class="k">Steel Path reward</span><b>${esc(WS.steelPath.currentReward.name)}</b><span class="x">${WS.steelPath.currentReward.cost} essence</span></a>`);
  if(fl.length)tiles.push(`<a class="ts" href="#tenno" data-ttab="foundry"><span class="k">Foundry</span><b>${ready}/${fl.length} ready</b><span class="x">${ready?'Claim in game':'Next in '+hrs((Math.min(...fl.map(f=>f.t0+f.dur*1000))-now)/1000)}</span></a>`);
  tiles.push(`<a class="ts" href="#today"><span class="k">Weekly reset</span><b>${left(lastWeekly()+7*DAY-now)}</b><span class="x">Monday 00:00 UTC</span></a>`);
  return `<section aria-labelledby="ts-h"><div class="hsec"><h2 id="ts-h">Today</h2><a class="ln small" href="#today">All of today</a></div><div class="tstrip">${tiles.join('')}</div></section>`}

function homeGoals(){const g=(P.goals||[]).filter(n=>I[n]&&!on('build|'+n));
  return `<section aria-labelledby="hg-h"><div class="hsec"><h2 id="hg-h">Goals</h2><a class="ln small" href="#goals">${g.length>3?'All '+g.length:'Goals'}</a></div>
   ${g.length?`<div class="hlist">${g.slice(0,3).map(n=>{const k=stepKeys(n);const d=k.filter(on).length;return `<a class="hrow" href="#" data-go="item|${esc(n)}">${art(n,'mini')||'<span class="mini"></span>'}<span class="hrt"><span class="nm">${esc(n)}</span><span class="nextbar"><i style="width:${(d/k.length*100).toFixed(1)}%"></i></span></span><span class="small muted">${d}/${k.length}</span></a>`}).join('')}</div>`
   :`<p class="small muted" style="margin:0">Nothing tracked. Open any item and choose <b>Track</b>.</p>`}</section>`}

function home(){if(state.qs)return `<div class="stack">${quickStart()}</div>`;if(isNew())return `<div class="stack">${welcome()}</div>`;
  return `<div class="home2">${mrCard()}${signBlock('home')}${sinceLast()}
   <div class="hgrid"><div class="hmain">${nextCard()}</div><div class="hside">${todayStrip()}${homeGoals()}${taskPanel()}</div></div></div>`}
