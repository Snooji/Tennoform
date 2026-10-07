/* ---------- request guard: every request to Warframe-related services (profile relay, warframestat) goes through here ---------- */
/* Warframe publishes no API or rate limits for these endpoints, so the limits below are deliberately conservative:
   - each endpoint has a cache (same answer for a while), a request budget per time window, and a minimum gap;
   - network errors and 5xx back off exponentially (state is kept in localStorage, so reloading doesn't reset it);
   - 403 or 429 stops that endpoint completely for a long while and the app says so; nothing retries it automatically.
   No proxies are rotated and no access restrictions are worked around. */
const NET_RULES={
  relay:{ttl:10*60e3,gap:20e3,max:4,per:15*60e3,base:5*60e3,cap:12*3600e3,stop:6*3600e3,label:'Profile sync'},
  ws:{ttl:3*60e3,gap:60e3,max:6,per:30*60e3,base:2*60e3,cap:60*60e3,stop:2*3600e3,label:'The live game feed'},
  vault:{ttl:60*60e3,gap:60e3,max:2,per:60*60e3,base:15*60e3,cap:12*3600e3,stop:6*3600e3,label:'Prime Resurgence'}};
const NETG=(()=>{const g=lsGet('tf-netguard',{});return g&&typeof g==='object'?g:{}})();
const NETC={};
const netSave=()=>lsSet('tf-netguard',NETG);
class NetErr extends Error{constructor(kind,msg,status){super(msg);this.kind=kind;this.status=status||0}}
const netMins=ms=>ms<60e3?'under a minute':ms<3600e3?Math.ceil(ms/60e3)+' minutes':Math.round(ms/3600e3*10)/10+' hours';
/* what the app tells you when an endpoint is paused; '' when it's fine */
function netStatus(ep){const g=NETG[ep];const now=Date.now();if(!g)return '';const R=NET_RULES[ep];
  if(g.stopUntil>now)return `${R.label} is paused for ${netMins(g.stopUntil-now)}: the server refused requests (${g.status}). Tennoform won't ask again until then.`;
  if(g.next>now&&g.fails)return `${R.label} hit an error, so it waits ${netMins(g.next-now)} before trying again.`;return ''}
async function netJSON(ep,url){const R=NET_RULES[ep];const g=NETG[ep]=NETG[ep]||{};const now=Date.now();
  const c=NETC[url];if(c&&now-c.at<R.ttl)return c.data;
  if(g.stopUntil>now)throw new NetErr('stopped',netStatus(ep),g.status);
  if(g.next>now)throw new NetErr('backoff',netStatus(ep)||`${R.label}: try again in ${netMins(g.next-now)}.`);
  g.log=(g.log||[]).filter(t=>now-t<R.per);
  if(g.log.length>=R.max)throw new NetErr('budget',`${R.label} has asked enough for now. Try again in ${netMins(R.per-(now-g.log[0]))}.`);
  if(g.last&&now-g.last<R.gap)throw new NetErr('budget',`${R.label}: wait ${netMins(R.gap-(now-g.last))} between requests.`);
  g.last=now;g.log.push(now);netSave();
  let r;try{r=await fetch(url,{cache:'no-store'})}catch(e){netFail(ep,0);throw new NetErr('network',`${R.label} couldn't connect.`)}
  if(r.status===403||r.status===429){netStop(ep,r.status);throw new NetErr('stopped',netStatus(ep),r.status)}
  if(!r.ok){netFail(ep,r.status);throw new NetErr('http',`${R.label} answered ${r.status}.`,r.status)}
  let j;try{j=await r.json()}catch(e){netFail(ep,r.status);throw new NetErr('http',`${R.label} sent something unreadable.`)}
  /* the profile relay reports Warframe's own answer in its JSON */
  if(j&&(j.status===403||j.status===429)){netStop(ep,j.status);throw new NetErr('stopped',netStatus(ep),j.status)}
  if(j&&j.status>=500){netFail(ep,j.status);throw new NetErr('http',`${R.label}: Warframe answered ${j.status}.`,j.status)}
  g.fails=0;g.next=0;netSave();NETC[url]={at:Date.now(),data:j};return j}
function netFail(ep,status){const R=NET_RULES[ep],g=NETG[ep];g.fails=(g.fails||0)+1;g.status=status;g.next=Date.now()+Math.min(R.cap,R.base*Math.pow(2,g.fails-1));netSave()}
function netStop(ep,status){const R=NET_RULES[ep],g=NETG[ep];g.status=status;g.stopUntil=Date.now()+R.stop;g.fails=(g.fails||0)+1;netSave()}
