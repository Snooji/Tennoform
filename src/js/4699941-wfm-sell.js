/* ---------- Sell on warframe.market: suggested prices from the daily snapshot, a trade-chat line, and the item's page ---------- */
/* Tennoform never signs in to warframe.market for anyone: the player places the order there themselves.
   Prices come from the daily snapshot, so the page says how old they are. */
function sellDucats(n){const base=n.replace(/ Set$/,'');const it=I[base];if(it&&n.endsWith(' Set'))return it.parts.filter(p=>p.k==='p').reduce((a,p)=>a+(p.du||0),0)||null;
  for(const i of Object.values(I)){if(!i.p)continue;for(const p of i.parts)if(p.k==='p'&&(p.full===n||(p.n==='Blueprint'&&i.n+' Blueprint'===n)))return p.du||null}return null}
function sellData(){const n=state.sell;if(!n||!MS[n])return null;const p=PR[n]||{};const sl=(SEL[n]||[]).filter(x=>x[0]!=='__buy');const low=sl.length?sl[0][1]:null;
  const avg=p.a7??p.a30??null;
  /* quick: just under the cheapest seller (but not far below the usual price); fair: the 7-day average */
  const quick=low!=null?Math.max(1,avg!=null?Math.max(low-1,Math.round(avg*0.8)):low-1):avg!=null?Math.max(1,Math.round(avg*0.9)):null;
  const fair=avg!=null?Math.max(1,Math.round(avg)):low;
  const isMod=!!(MODS[n]||ARC[n]);
  return {n,url:'https://warframe.market/items/'+MS[n],low,avg:avg!=null?Math.round(avg):null,a30:p.a30!=null?Math.round(p.a30):null,v7:p.v7||0,quick,fair,
    du:sellDucats(n),rank:isMod,date:D.meta.prices,sellers:sl.slice(0,3).map(s=>({name:s[0],price:s[1],rank:s[5]??null,status:s[4]==='ingame'?'In game':s[4]==='online'?'Online':''})),
    chat:p=>`WTS [${n}] ${p}p`}}
Object.assign(window.TF,{sell:()=>{const d=sellData();if(!d)return null;const {chat,...rest}=d;return {...rest,chatQuick:d.quick!=null?chat(d.quick):'',chatFair:d.fair!=null?chat(d.fair):''}},
  sellOpen:n=>{if(!MS[n]){toast("That item isn't traded on warframe.market.");return}state.sell=n;tfNotify()},sellClose:()=>{state.sell=null;tfNotify()},sellable:n=>!!MS[n]});
document.addEventListener('click',e=>{const t=e.target.closest('[data-sell]');if(!t)return;e.preventDefault();e.stopPropagation();window.TF.sellOpen(t.dataset.sell)},true);
/* moving to another page closes it, so it never sits over a page it doesn't belong to */
window.addEventListener('hashchange',()=>{if(state.sell){state.sell=null;tfNotify()}});
