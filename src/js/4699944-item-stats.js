/* ---------- item stats on item pages (health, shields, armour, abilities; damage, crit, status, fire rate, melee) ---------- */
/* data/stats.json is built from WFCD by build/make_stats.py and only loaded when an item page first opens. */
const ST={data:null,busy:false,err:false};
function loadStats(){if(ST.data||ST.busy||ST.err)return;ST.busy=true;
  fetch('/data/stats.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{ST.data=j}).catch(()=>{ST.err=true}).finally(()=>{ST.busy=false;
    if(typeof FRT!=='undefined')FRT.key='';if(typeof render==='function')render();tfNotify()})}
const DMG_L={impact:'Impact',puncture:'Puncture',slash:'Slash',heat:'Heat',cold:'Cold',electricity:'Electricity',toxin:'Toxin',blast:'Blast',radiation:'Radiation',gas:'Gas',magnetic:'Magnetic',viral:'Viral',corrosive:'Corrosive',void:'Void',tau:'Tau',true:'True'};
const pct=v=>Math.round(v*1000)/10+'%';
function statsHTML(name){if(!ST.data){loadStats();return ST.err?'':`<div class="small muted" style="padding:10px 14px">Loading stats…</div>`}
  const s=ST.data[name];if(!s)return '';const tile=(k,v,x)=>`<div class="tile" style="cursor:default"><span class="small muted">${k}</span><b class="num">${v}</b>${x?`<span class="small muted">${x}</span>`:''}</div>`;
  let h='';const t=[];
  if(s.h)t.push(tile('Health',fmt(s.h)));if(s.s)t.push(tile('Shields',fmt(s.s)));if(s.a)t.push(tile('Armor',fmt(s.a)));if(s.e)t.push(tile('Energy',fmt(s.e)));if(s.sp)t.push(tile('Sprint speed',s.sp));
  if(s.tot)t.push(tile('Damage',fmt(s.tot),s.ms&&s.ms>1?`×${s.ms} multishot`:''));if(s.cc!=null)t.push(tile('Critical chance',pct(s.cc),s.cm?`${s.cm}× damage`:''));if(s.sc!=null)t.push(tile('Status chance',pct(s.sc)));
  if(s.fr)t.push(tile(s.rng?'Attack speed':'Fire rate',s.fr+(s.rng?'':'/s')));if(s.mag)t.push(tile('Magazine',fmt(s.mag),s.rl?`${s.rl}s reload`:''));
  if(s.rng)t.push(tile('Range',s.rng+' m'));if(s.hv)t.push(tile('Heavy attack',fmt(s.hv),s.wu?`${s.wu}s wind-up`:''));if(s.sl)t.push(tile('Slam',fmt(s.sl)));
  if(s.cd)t.push(tile('Combo duration',s.cd+'s'));if(s.ft)t.push(tile('Follow-through',pct(s.ft)));if(s.ba)t.push(tile('Block angle',s.ba+'°'));
  if(s.dispo)t.push(tile('Riven disposition','●'.repeat(s.dispo)+'○'.repeat(Math.max(0,5-s.dispo)),['','Weakest','Weak','Average','Strong','Strongest'][s.dispo]||''));
  if(t.length)h+=`<div class="tiles">${t.join('')}</div>`;
  if(s.dmg&&Object.keys(s.dmg).length){const tot=Object.values(s.dmg).reduce((a,b)=>a+b,0)||1;
    h+=`<div class="kv" style="margin-top:10px">${Object.entries(s.dmg).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span>${DMG_L[k]||k}</span><span class="num">${v} <span class="small muted">(${Math.round(v/tot*100)}%)</span></span>`).join('')}</div>`}
  const extra=[s.trig?'Trigger: '+s.trig:'',s.noise?'Noise: '+s.noise:''].filter(Boolean).join(' · ');if(extra)h+=`<div class="small muted" style="margin-top:8px">${esc(extra)}</div>`;
  if(s.pass)h+=`<p class="small" style="margin:10px 0 0"><b>Passive.</b> ${esc(s.pass)}</p>`;
  if(s.ab&&s.ab.length)h+=`<ol class="small" style="margin:10px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:6px">${s.ab.map(([n,d])=>`<li><b>${esc(n)}.</b> ${esc(d)}</li>`).join('')}</ol>`;
  return `<details class="istats" open style="padding:10px 14px;border-top:1px solid var(--line)"><summary style="cursor:pointer;font-weight:600">Stats</summary><div style="margin-top:10px">${h}</div><div class="small muted" style="margin-top:8px">Base stats without mods, from WFCD game data.</div></details>`}
{const _it=itemTree;itemTree=function(name,opts){const h=_it.apply(this,arguments);if((opts&&opts.depth)||!I[name])return h;
  const st=statsHTML(name);if(!st)return h;const i=h.lastIndexOf('</section>');return i<0?h+st:h.slice(0,i)+st+h.slice(i)}}
