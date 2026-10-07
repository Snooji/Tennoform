/* ---------- bridge: status of each data source (live game feed, prices, game data, profile sync) ---------- */
/* Connection and freshness are reported separately: the feed can answer fine and still be behind the game. */
function wsEnded(){if(!WS)return [];const now=Date.now(),out=[];const gone=x=>x&&new Date(x)<=now;
  [['Cetus',WS.cetusCycle],['Orb Vallis',WS.vallisCycle],['Cambion Drift',WS.cambionCycle]].forEach(([n,c])=>{if(c&&gone(c.expiry))out.push(n)});
  if(WS.sortie&&WS.sortie.variants&&gone(WS.sortie.expiry))out.push('Sortie');
  if(WS.archonHunt&&WS.archonHunt.missions&&gone(WS.archonHunt.expiry))out.push('Archon Hunt');
  return out}
const agoTxt=ms=>ms<60e3?'just now':ms<36e5?Math.floor(ms/6e4)+'m ago':ms<864e5?Math.floor(ms/36e5)+'h ago':Math.floor(ms/864e5)+(ms<1728e5?' day':' days')+' ago';
function liveInfo(){
  if(!HOSTED)return {state:'offline',conn:'Works on tennoform.com',fresh:'',at:'',ended:[],busy:false,retry:false};
  const age=WS?Date.now()-WSat:null,ended=wsEnded();
  const state=!WS?(WSerr?'error':'loading'):WSerr?'error':ended.length?'delayed':age>15*60e3?'stale':'ok';
  const conn=WSload?'Checking…':WSerr?(netStatus('ws')||"Can't reach warframestat.us"):WS?'Connected to warframestat.us':'Connecting…';
  const fresh=!WS?'':ended.length?`${ended.join(', ')} ended. The feed hasn't sent the new ${ended.length>1?'ones':'one'} yet; it's checked again every minute.`
    :WSerr?`Showing what it last sent, ${agoTxt(age)}.`:age>15*60e3?`Last update was ${agoTxt(age)}.`:'Timers are up to date.';
  return {state,conn,fresh,at:WS?agoTxt(age):'',ended,busy:WSload,retry:true}}
/* while a timer has run out, ask the feed again each minute (it usually catches up within a few) */
setInterval(()=>{if(!HOSTED||document.hidden||!WS||WSload)return;const h=location.hash.slice(1)||'home';if(!['today','home','world','relics'].includes(h))return;
  if(wsEnded().length&&Date.now()-WSat>60e3){WSat=0;loadWS()}},20e3);
function feedsData(){const day=d=>{const t=Date.parse(d);return isNaN(t)?null:(Date.now()-t)/864e5};const g=day(D.meta.built),p=day(D.meta.prices);const L=liveInfo();
  const ls=P.at?Date.now()-Date.parse(P.at):null;
  return [
    {id:'live',name:'Live game feed',k:L.state==='ok'?'ok':L.state==='offline'||L.state==='loading'?'off':L.state==='error'?'bad':'warn',
      t:L.state==='offline'?'Works on tennoform.com':L.state==='loading'?'Connecting…':L.state==='error'?(WS?`Unavailable · last good data ${L.at}`:'Unavailable'):L.state==='delayed'?`Connected · ${L.ended.join(', ')} waiting for new data`:L.state==='stale'?`Connected · last update ${L.at}`:`Connected · updated ${L.at}`,
      retry:HOSTED},
    {id:'prices',name:'Market prices',k:p==null||p<3?'ok':'warn',t:`Updated ${D.meta.prices}${p!=null&&p>=3?' · delayed, the daily refresh is behind':''}`,retry:false},
    {id:'game',name:'Game data',k:g==null||g<21?'ok':'warn',t:`${D.meta.wfcd?'v'+D.meta.wfcd+', ':''}${D.meta.built}${g!=null&&g>=21?' · may be missing the newest items':''}`,retry:false},
    {id:'profile',name:'Your profile sync',k:!P.at?'off':ls>7*864e5?'warn':'ok',t:!P.at?'Not linked yet':`Last synced ${agoTxt(ls)}`,retry:false}]}
Object.assign(window.TF,{liveInfo:()=>liveInfo(),feeds:()=>feedsData(),
  retryLive:()=>{WSerr=false;WSat=0;loadWS();tfNotify()}});
/* the footer shown under every page */
/* state shown as an icon beside the words (never a coloured dot alone) */
feedStatus=function(){const dot=k=>ic({ok:'check',warn:'timer',bad:'warn'}[k]||'minus','fstate '+k);
  return feedsData().filter(f=>f.id!=='profile').map(f=>`<span>${dot(f.k)}${esc(f.name)}: ${esc(f.t)}${f.retry&&f.k!=='ok'&&f.k!=='off'?' <button type="button" class="linkbtn" id="wsretry">Try again</button>':''}</span>`).join('')};
/* profile sync status for the Home hero: a Sync button until you're synced, then a green "Synced" status */
let SYNCING=false;{const _as=autoSync;autoSync=async function(){SYNCING=true;tfNotify();try{return await _as.apply(this,arguments)}finally{SYNCING=false;tfNotify()}}}
function syncStatus(){if(!HOSTED)return {state:'off',at:'',linked:false};const linked=/^[0-9a-f]{24}$/i.test(P.wfid||'');const last=[P.auto,P.at].filter(Boolean).sort().pop();const age=last?Date.now()-Date.parse(last):null;
  return {state:SYNCING?'busy':!last?'none':age>864e5?'stale':'ok',at:last?agoTxt(age):'',linked}}
Object.assign(window.TF,{syncStatus:()=>syncStatus()});
