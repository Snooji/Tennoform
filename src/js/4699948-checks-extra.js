/* ---------- more daily/weekly checklist items, and Baro as a per-visit item ---------- */
/* Each entry: [period, id, title, description, quest that unlocks it]. Period 'd' resets 00:00 UTC, 'w' Monday 00:00 UTC. */
const CK_MORE=[
  ['d','kim','1999 chatroom (KIM)','Chat with each Hex member once a day for Hex standing.','The Hex'],
  ['w','yonta','Yonta: weekly Kuva','35,000 Kuva for 5 Voidplume Pinions in the Chrysalith.','Angels of the Zariman'],
  ['w','bird3','Bird 3: weekly Archon Shard','One Archon Shard a week for Cavia standing in the Sanctum Anatomica.','Whispers in the Walls'],
  ['w','helminth','Helminth Invigorations','New Invigoration offers each week: a 7-day boost for a Warframe. See the Helminth tab on your Tenno page for which frames you\'ve fed.','Heart of Deimos'],
  ['w','tarch','Temporal Archimedea','Weekly run from Kaya Velasco in Höllvania. Uses 2 of your 5 weekly Search Pulses.','The Hex']];
for(const c of CK_MORE)if(!D.checks.some(x=>x[1]===c[1]))D.checks.push(c);
{const n=D.checks.find(x=>x[1]==='netra');if(n)n[3]='5 Search Pulses a week, shared with Deep and Temporal Archimedea (2 each). Rewards Archon Shards and Arcanes.';
 const e=D.checks.find(x=>x[1]==='eda');if(e)e[3]='Weekly high-difficulty run. Uses 2 of your 5 weekly Search Pulses.';
 const p=D.checks.find(x=>x[1]==='palladino');if(p)p[3]='35,000 Kuva for 10 Riven Slivers, plus her other weekly offers.'}
/* Baro Ki'Teer: shows only while he's at a relay, and the tick lasts for that visit */
function baroVisit(){const vt=WS&&WS.voidTrader;if(!vt)return null;const a=new Date(vt.activation).getTime(),e=new Date(vt.expiry).getTime(),now=Date.now();return a<=now&&now<e?{a,e,loc:vt.location||'a relay'}:null}
{const _all=allChecks;allChecks=function(){const out=_all();const b=baroVisit();
  if(b)out.push(['b','baro:'+b.a,"Visit Baro Ki'Teer",`He's at ${b.loc} until ${lt(b.e)} your time. Bring Ducats and credits.`,'']);return out}}
{const _r=ckReset;ckReset=function(c){if(c[0]==='b'){const b=baroVisit();return b?b.a:0}return _r(c)}}
{const _e=ckEnd;ckEnd=function(c){if(c[0]==='b'){const b=baroVisit();return b?b.e:Date.now()}return _e(c)}}
