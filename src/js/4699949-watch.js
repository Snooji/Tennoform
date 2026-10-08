/* ---------- Prime Resurgence watchlist: star any Prime and get an alert when Varzia brings it back ---------- */
const watchList=()=>Array.isArray(P.watch)?P.watch:[];
function watchToggle(n){const w=watchList().filter(x=>x!==n);if(w.length===watchList().length)w.push(n);P.watch=w;saveProfile();
  if(typeof FFD!=='undefined')FFD.key='';tfNotify();toast(w.includes(n)?`Watching ${n}. You'll get an alert when it's in Prime Resurgence.`:`Stopped watching ${n}.`)}
{const _m=marketData;marketData=function(){const out=_m();if(out.tab!=='vault')return out;const W=watchList();
  const mark=c=>({...c,watched:W.includes(c.n)});['now','farm','vault'].forEach(k=>{out[k]=(out[k]||[]).map(mark)});
  const all=[...out.now,...out.farm,...out.vault];out.watch=W.map(n=>all.find(c=>c.n===n)).filter(Boolean);return out}}
{const _a=alertsAll;alertsAll=function(){const out=_a();if(!alertPrefs().resurgence)return out;
  const back=watchList().filter(n=>VAULT[n]&&VAULT[n].now);
  if(back.length){const until=VAULT[back[0]].now;out.unshift({id:'watch:'+until+':'+back.slice().sort().join(','),kind:'resurgence',title:`Back in Prime Resurgence: ${back.length===1?back[0]:back.length+' Primes you watch'}`,
    text:`Varzia has their relics until ${fdate(until)}. Buy them with Aya or Regal Aya.`,items:back.slice(0,6),href:'market'})}
  return out}}
/* item pages: a Watch button and the item's Resurgence status, for Primes */
function watchHTML(n){const it=I[n];if(!it||!it.p)return '';const v=VAULT[n]||{},w=watchList().includes(n);
  const st=v.now?`In Prime Resurgence now, until ${fdate(v.now)}.`:!it.v?'Not vaulted: its relics drop now.':`Vaulted.${v.last?` Last in Resurgence ${fdate(v.last)}.`:''}${v.est?` Rough estimate for its return: ${fdate(v.est)}.`:''}`;
  return `<section class="obj"><div class="obj-h"><div class="title"><h3>Prime Resurgence</h3><span style="margin-left:auto"><button type="button" class="btn sm" data-watch="${esc(n)}" aria-pressed="${w}">${w?'Watching':'Watch'}</button></span></div></div>
  <div style="padding:10px 14px" class="small">${esc(st)} ${w?'You\'ll get an alert on Home and Today when it comes back.':'Watch it to get an alert when it comes back.'}</div></section>`}
{const _d=detail;detail=function(sel){const h=_d(sel);return sel.startsWith('item|')&&h?h+watchHTML(sel.slice(5)):h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-watch]');if(b){e.preventDefault();watchToggle(b.getAttribute('data-watch'))}});
Object.assign(window.TF,{watchToggle:n=>watchToggle(n)});
