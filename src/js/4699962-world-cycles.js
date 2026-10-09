/* ---------- open worlds: the live cycle of every world on every tab, so nobody has to leave the page to check ---------- */
const DUVIRI_MOODS=['sorrow','fear','joy','anger','envy'];
function worldCycles(){
  if(!WS){if(HOSTED&&!WSerr)loadWS();return {state:WSerr?'error':'loading',list:[]}}
  const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):'';
  const one=(region,hub,c,now,next)=>c&&c.expiry?{region,hub,now:now(c),next:next(c),expiry:c.expiry}:null;
  const fass=c=>(c.state||c.active)!=='vome';
  const mood=c=>{const i=DUVIRI_MOODS.indexOf(c.state);return i<0?'':cap(DUVIRI_MOODS[(i+1)%5])};
  return {state:'ok',list:[
    one('Plains of Eidolon','Cetus',WS.cetusCycle,c=>c.isDay?'Day':'Night',c=>c.isDay?'Night':'Day'),
    one('Orb Vallis','Fortuna',WS.vallisCycle,c=>c.isWarm?'Warm':'Cold',c=>c.isWarm?'Cold':'Warm'),
    one('Cambion Drift','Necralisk',WS.cambionCycle,c=>fass(c)?'Fass':'Vome',c=>fass(c)?'Vome':'Fass'),
    one('Duviri','Duviri',WS.duviriCycle,c=>cap(c.state),mood)].filter(Boolean)}}
{const _w=worldData;worldData=function(){const d=_w();d.cycles=worldCycles();return d}}
/* a cycle ran out: fetch the new one (at most every 30 seconds) */
window.TF.wsRefresh=()=>{if(HOSTED&&!WSload&&Date.now()-WSat>30000){WSat=0;loadWS()}};
