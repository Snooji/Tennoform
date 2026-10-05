/* ---------- mastery breakdown (in-game layout) ---------- */
const BDG=[['Warframe','Primary','Secondary','Melee'],['chart','sp','rail','drift'],['Sentinel','Robotic Weapon','Companion'],['Archwing','Arch-Gun','Arch-Melee'],['Necramech','K-Drive','Zaw','Kitgun','Amp','other']];
function bdLabel(k){return CATL[k]||(EXTRA.find(e=>e[0]===k)||[])[1]||k}
function bdPanel(){const t=totalXP(),m=mrInfo(t.total);
  const row=k=>{const x=catXP(k);const isC=CATS.includes(k);const a=isC?autoCat(k):null;const tgt=isC?`data-rkcat="${esc(k)}"`:k==='rail'||k==='drift'?'data-rkcat="Intrinsics"':`data-scp=""`;
    return `<button class="bdl" ${tgt}><b class="num">${fmt(x)}</b><span>${bdLabel(k)}</span>${a?`<small class="mono">${a.m}/${a.t}</small>`:''}${isOv(k)?'<small class="ovt">set</small>':''}</button>`};
  return `<section class="bdp cut center" id="bdp"><div class="bdhead"><div class="ring" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></div><div class="stack" style="gap:2px;min-width:0;flex:1"><div class="row" style="justify-content:space-between"><h2>Mastery breakdown</h2><a class="small ln" href="#tenno" data-ttab="breakdown">Adjust</a></div><span class="small muted mono">${fmt(t.total)} / ${fmt(m.next)} XP · ${fmt(m.next-t.total)} to ${m.mr>=30?'L'+(m.mr-29):'MR '+(m.mr+1)}</span><div class="nextbar"><i style="width:${m.pct.toFixed(1)}%"></i></div></div></div>
  ${BDG.map((g,i)=>{const rows=g.filter(k=>i<4||catXP(k)>0||(CATS.includes(k)&&autoCat(k).p));return rows.length?`<div class="bdg">${rows.map(row).join('')}</div>`:''}).join('')}
  ${t.un?`<div class="bdg"><button class="bdl un" data-ttab="breakdown"><b class="num">${fmt(t.un)}</b><span>Unaccounted</span><small>in game</small></button><div class="bdnote">From ${esc(t.base.src)}, not itemised here yet. Anything you tick (missions, junctions, gear) fills this first, so your total stays the same until it's used up.</div></div>`:''}
  <div class="bdtot"><span>Total</span><b class="num">${fmt(t.total)}</b></div></section>`}
function testBanner(){const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;if(g==null||m.mr<=g)return'';
  return `<div class="callout small" style="border-color:var(--ok)"><b style="color:var(--ok)">Rank-up test ready.</b> You have the XP for ${m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr}; your account is still MR ${g} in game. Take the test from the Mastery shrine in a Relay or your Orbiter.</div>`}

