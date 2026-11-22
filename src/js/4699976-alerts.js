/* ---------- Foundry and reset alerts ----------
   Worked out on this device from the player's own Foundry timers and the fixed UTC reset times; nothing is fetched.
   In the app (Capacitor) they're scheduled with the phone's local notifications, so they arrive while the app is closed.
   On the website they fire while Tennoform is open (any tab), through the same notification path as chat. */
const ALERT_IDS={foundry:100000,daily:1,weekly:2};
function nextUTC(dayOfWeek){const d=new Date();const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+1));
  if(dayOfWeek!=null){while(t.getUTCDay()!==dayOfWeek)t.setUTCDate(t.getUTCDate()+1)}return t.getTime()}
function alertPlan(){const pr=ntfPrefs();if(!pr.on)return [];const now=Date.now(),out=[];
  if(pr.foundry)(P.foundry||[]).forEach((f,i)=>{const at=f.t0+f.dur*1000;if(at>now)out.push({id:ALERT_IDS.foundry+i,at,title:'Ready in the Foundry',body:`${f.n} is ready to claim.`,url:'/#foundry'})});
  const hr=3600e3;
  if(pr.daily){let at=nextUTC()-hr;if(at<=now)at+=864e5;out.push({id:ALERT_IDS.daily,at,title:'Daily reset in an hour',body:'Finish your dailies and use your standing cap before 00:00 UTC.',url:'/#today'})}
  if(pr.weekly){let at=nextUTC(1)-hr;if(at<=now)at+=7*864e5;out.push({id:ALERT_IDS.weekly,at,title:'Weekly reset in an hour',body:'Last chance for this week\'s Archon, Netracells and weekly missions.',url:'/#today'})}
  return out}
const NATIVE_LN=()=>window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()&&Capacitor.Plugins&&Capacitor.Plugins.LocalNotifications;
let ALERT_T=[],ALERT_SIG='';
async function alertSchedule(){const plan=alertPlan();const sig=JSON.stringify(plan.map(a=>[a.id,a.at]));if(sig===ALERT_SIG)return;ALERT_SIG=sig;
  ALERT_T.forEach(clearTimeout);ALERT_T=[];
  const LN=NATIVE_LN();
  if(LN){try{const p=await LN.getPending();if(p&&p.notifications&&p.notifications.length)await LN.cancel({notifications:p.notifications.map(n=>({id:n.id}))});
      if(plan.length)await LN.schedule({notifications:plan.map(a=>({id:a.id,title:a.title,body:a.body,schedule:{at:new Date(a.at),allowWhileIdle:true},extra:{url:a.url}}))})}catch(e){}return}
  for(const a of plan){const ms=a.at-Date.now();if(ms>0&&ms<2147e6)ALERT_T.push(setTimeout(()=>{ALERT_SIG='';ntfShow(a.title,a.body,'alert:'+a.id,a.url);alertSchedule()},ms))}}
{let t=0;window.addEventListener('tf:update',()=>{clearTimeout(t);t=setTimeout(alertSchedule,400)})}
window.addEventListener('load',()=>setTimeout(alertSchedule,1500));
/* tapping a native alert opens the right page */
window.addEventListener('load',()=>{const LN=NATIVE_LN();if(LN&&LN.addListener)LN.addListener('localNotificationActionPerformed',e=>{const u=e&&e.notification&&e.notification.extra&&e.notification.extra.url;if(u)GO(String(u).replace(/^.*#/,''))})});
