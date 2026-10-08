/* ---------- Baro wishlist, Circuit alerts and build dates ---------- */
/* Baro: list what you want him to bring; when he's at a relay with any of it, an alert says so. His stock is only known
   once he arrives (the live feed lists it then). Circuit: ring the bell on a Warframe or adapter; the alert fires in the
   week the Circuit offers it, and the forecast shows how many weeks away it is. All saved in your profile. */
const wishList=()=>Array.isArray(P.baroWish)?P.baroWish:[];
const wishKey=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const onWish=n=>wishList().some(w=>wishKey(w)===wishKey(n));
function baroWishSet(n,v){n=String(n||'').trim().slice(0,60);if(!n)return;const rest=wishList().filter(w=>wishKey(w)!==wishKey(n));P.baroWish=v?[...rest,n]:rest;saveProfile();tfNotify()}
/* names to suggest while typing: the things Baro sells (Primed mods, Prisma weapons and the like) plus any mod or item */
function baroSuggest(q){q=wishKey(q);if(q.length<2)return [];const pool=[...Object.keys(MODS),...Object.keys(I).filter(n=>/\/VoidTrader\//.test(I[n].u)||/^(Prisma |Mara )/.test(n))];
  const hit=pool.filter(n=>wishKey(n).includes(q)&&!onWish(n));hit.sort((a,b)=>(/^Primed |^Prisma /.test(b)-/^Primed |^Prisma /.test(a))||a.length-b.length);return hit.slice(0,8)}
const ownedAny=n=>(I[n]&&ownedItem(n))||on('mod|'+n)||on('arc|'+n);
{const _t=todayData;todayData=function(){const out=_t();const b=out.live&&out.live.baro;
  if(b){b.inv=b.inv.map(x=>({...x,wish:onWish(x.item),own:ownedAny(x.item)}));b.wish=wishList().map(n=>({n,here:b.here&&b.inv.some(x=>wishKey(x.item)===wishKey(n))}))}
  if(out.live)out.live.baroWish=wishList();return out}}

const cirWatch=()=>Array.isArray(P.cirWatch)?P.cirWatch:[];
function cirWatchSet(n,v){const rest=cirWatch().filter(x=>x!==n);P.cirWatch=v?[...rest,n]:rest;saveProfile();tfNotify()}
{const _c=circuitData;circuitData=function(){const d=_c();const W=cirWatch();
  d.weeks.forEach(w=>{w.frames.forEach(f=>f.watch=W.includes(f.n));w.adapters.forEach(a=>a.watch=W.includes(a.n))});
  d.watching=W.map(n=>{const i=d.weeks.findIndex(w=>w.frames.some(f=>f.n===n)||w.adapters.some(a=>a.n===n));return {n,week:i,label:i<0?'not in the next 10 weeks':i===0?'this week':i===1?'next week':'in '+i+' weeks'}});
  return d}}

{const _a=alertsAll;alertsAll=function(){const out=_a();
  const vt=WS&&WS.voidTrader,now=Date.now();
  if(vt&&vt.inventory&&wishList().length&&new Date(vt.activation).getTime()<=now&&now<new Date(vt.expiry).getTime()){
    const hits=vt.inventory.map(x=>x.item).filter(onWish);
    if(hits.length)out.unshift({id:'baro-wish:'+vt.activation+':'+hits.map(wishKey).sort().join(','),kind:'baro',title:`Baro has ${hits.length===1?hits[0]:hits.length+' things'} from your wishlist`,
      text:`At ${vt.location||'a relay'} for ${left(new Date(vt.expiry)-now)}.`,items:hits.slice(0,6),href:'today'})}
  if(cirWatch().length){const w0=circuitData().weeks[0];const hits=[...w0.frames.filter(f=>f.watch).map(f=>f.n),...w0.adapters.filter(a=>a.watch).map(a=>a.n+' Incarnon Genesis')];
    if(hits.length)out.push({id:'circuit:'+w0.start+':'+hits.join(','),kind:'circuit',title:`This week's Circuit has ${hits.length===1?hits[0]:hits.length+' things you want'}`,
      text:`Until the Monday reset (${w0.endsIn}). Run the ${w0.adapters.some(a=>a.watch)?'Steel Path ':''}Circuit in Duviri to pick it.`,items:hits,href:'today'})}
  return out}}

/* builds: when each one was shared or last reviewed, and a note when it's old enough that patches may have changed it */
const BUILDS_REVIEWED='2026-10-05';   /* the community picks were last checked against the game on this date */
const STALE_DAYS=180;
{const _b=bCard;bCard=function(b){const c=_b(b);const t=b.src==='player'?(b.at||0):Date.parse(BUILDS_REVIEWED);
  c.dated=t?(b.src==='player'?'Shared ':'Reviewed ')+fdate(new Date(t).toISOString().slice(0,10)):'';c.stale=!!t&&Date.now()-t>STALE_DAYS*DAY;return c}}

Object.assign(window.TF,{baroWish:(n,v)=>baroWishSet(n,v),baroSuggest:q=>baroSuggest(q),circuitWatch:(n,v)=>cirWatchSet(n,v)});
