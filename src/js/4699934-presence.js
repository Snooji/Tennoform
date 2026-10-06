/* ---------- presence: lets the Backend count live and daily players ---------- */
/* Signed-in players only. Stores when you were last active and which UTC days you visited; nothing else. */
const utcDay=t=>new Date(t).toISOString().slice(0,10);
let presLast=0;
async function presencePing(force){if(!HOSTED||!FB||!SO.uid||document.hidden)return;const now=Date.now();if(!force&&now-presLast<2*60e3)return;presLast=now;
  const day=utcDay(now),ref=FB.fs.collection('presence').doc(SO.uid);
  try{await ref.set({at:now,day,days:firebase.firestore.FieldValue.arrayUnion(day)},{merge:true})}
  catch(e){try{await ref.set({at:now,day,days:[day]})}catch(e2){}}} /* a very long day list is restarted */
setInterval(()=>presencePing(false),60e3);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)presencePing(true)});
{const _si=socialInit;socialInit=async function(uid){const r=await _si.apply(this,arguments);presLast=0;presencePing(true);return r}}
/* Backend numbers: live (active in the last 5 minutes), today, 7 and 30 days, total, and the last 14 days */
const PRES={loading:false,err:'',data:null};
async function loadPlayerStats(force){if(!FB||!FBK.admin||PRES.loading||(PRES.data&&!force&&Date.now()-PRES.data.at<60e3))return;PRES.loading=true;PRES.err='';tfNotify();
  try{const [pr,pu]=await Promise.all([FB.fs.collection('presence').get(),FB.fs.collection('public').get()]);
    const now=Date.now(),today=utcDay(now);const ps=pr.docs.map(d=>({id:d.id,...d.data()}));
    const within=ms=>ps.filter(p=>now-(+p.at||0)<ms).length;
    const hist=[];for(let i=13;i>=0;i--){const d=utcDay(now-i*864e5);hist.push({d,n:ps.filter(p=>(p.days||[]).includes(d)||p.day===d).length})}
    const ids=new Set([...pu.docs.map(d=>d.id),...ps.map(p=>p.id)]);
    PRES.data={live:within(5*60e3),hour:within(36e5),dau:ps.filter(p=>p.day===today).length,wau:within(7*864e5),mau:within(30*864e5),total:ids.size,tracked:ps.length,hist,at:now}}
  catch(e){PRES.err=/permission/i.test((e&&e.code)||'')?'permission':((e&&e.code)||'error')}
  PRES.loading=false;tfNotify()}
setInterval(()=>{if(location.hash==='#admin'&&!document.hidden&&FBK.admin)loadPlayerStats(true)},60e3);
function playerStats(){if(FBK.admin&&!PRES.data&&!PRES.loading&&!PRES.err)loadPlayerStats();
  const d=PRES.data;return {loading:PRES.loading,err:PRES.err,data:d?{...d,ago:d.at?(Date.now()-d.at<60e3?'just now':Math.floor((Date.now()-d.at)/6e4)+'m ago'):''}:null}}
Object.assign(window.TF,{playerStats:()=>playerStats(),playerStatsReload:()=>loadPlayerStats(true)});
