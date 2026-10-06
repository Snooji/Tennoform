/* ---------- Feedback status: the admin marks feedback Seen, Working on it or Done, and the sender sees it ---------- */
/* Senders can read only their own feedback (firestore.rules). When the status of something you sent changes,
   you get a note the next time you open Tennoform, and the Feedback page lists everything you've sent. */
const FB_ST={seen:'Seen',working:'Working on it',done:'Done'};
const fbStatusOf=x=>x.status||(x.done?'done':'');
const MYFB={list:null,tried:false};
async function myFeedbackLoad(force){if(!FB||!SO.uid||(MYFB.tried&&!force))return;MYFB.tried=true;
  try{const s=await FB.fs.collection('feedback').where('uid','==',SO.uid).limit(50).get();
    MYFB.list=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.at-a.at);
    /* tell the sender once about each status change */
    const seen=lsGet('tf-fbseen',{});let news=MYFB.list.filter(x=>fbStatusOf(x)&&seen[x.id]!==fbStatusOf(x));
    if(news.length){const x=news[0];const t=String(x.text||'').slice(0,50);
      const msg=news.length>1?`${news.length} of your feedback messages have updates`:`Your feedback "${t}${(x.text||'').length>50?'…':''}": ${FB_ST[fbStatusOf(x)]}`;
      if(window.TF_UI&&TF_UI.toast)TF_UI.toast(msg,{label:'View',fn:()=>{location.hash='feedback'}});else toast(msg)}
    MYFB.list.forEach(x=>{seen[x.id]=fbStatusOf(x)});lsSet('tf-fbseen',seen)}catch(e){MYFB.list=MYFB.list||[]}tfNotify()}
{const _si=socialInit;socialInit=async function(uid){const r=await _si.apply(this,arguments);MYFB.list=null;MYFB.tried=false;setTimeout(()=>myFeedbackLoad(),2500);return r}}
{const _fd=feedbackData;feedbackData=function(){const d=_fd.apply(this,arguments);if(SO.uid&&!MYFB.tried)myFeedbackLoad();
  d.mine=(MYFB.list||[]).map(x=>({id:x.id,kind:x.kind||'other',text:String(x.text||''),at:new Date(x.at).toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'}),status:fbStatusOf(x),label:FB_ST[fbStatusOf(x)]||'Sent'}));
  d.mineLoading=!!SO.uid&&MYFB.list==null;return d}}
/* after sending, show it in the list straight away */
{const _send=window.TF.feedbackSend;window.TF.feedbackSend=async(...a)=>{const ok=await _send(...a);if(ok)myFeedbackLoad(true);return ok}}
/* admin: status and copy */
{const _ad=adminData;adminData=function(){const d=_ad.apply(this,arguments);if(d.feedback){const by={};(FBK.list||[]).forEach(x=>by[x.id]=x);
  d.feedback.forEach(f=>{const x=by[f.id]||{};f.status=fbStatusOf(x);f.signed=!!x.uid})}return d}}
async function fbSetStatus(id,st){const x=(FBK.list||[]).find(y=>y.id===id);if(!x)return;const prev={status:x.status,done:x.done,statusAt:x.statusAt};
  st=fbStatusOf(x)===st?'':st;Object.assign(x,{status:st,done:st==='done',statusAt:Date.now()});tfNotify();
  try{await FB.fs.collection('feedback').doc(id).update({status:st,done:st==='done',statusAt:x.statusAt});toast(st?`Marked ${FB_ST[st]}. They'll see it next time they open Tennoform.`:'Status cleared')}
  catch(e){Object.assign(x,prev);tfNotify();toast("Couldn't update. Publish the latest firestore.rules.")}}
function fbCopy(id){const x=(FBK.list||[]).find(y=>y.id===id);if(!x)return;
  copy(`[${x.kind||'other'}] ${x.text||''}\n— ${x.name||'Anonymous'}${x.contact?' ('+x.contact+')':''}, ${new Date(x.at).toLocaleString()}${x.page?', from '+x.page:''}`,'Feedback copied')}
Object.assign(window.TF,{fbStatus:(id,st)=>fbSetStatus(id,st),fbCopy:id=>fbCopy(id),fbDone:id=>{const x=(FBK.list||[]).find(y=>y.id===id);if(x)fbSetStatus(id,'done')}});
