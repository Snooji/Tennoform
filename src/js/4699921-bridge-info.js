/* ---------- bridge: Support, Feedback, About and Backend for the React pages ---------- */
function supportData(){const ign=DONATE.ign;return {ign,paypal:DONATE.paypal,whisper:ign?`/w ${ign} Hi! I'd like to donate platinum to Tennoform.`:''}}
function feedbackData(){if(HOSTED&&FB&&SO.uid&&!FBK.tried)loadFeedback();const from=state.fbFrom&&state.fbFrom!=='feedback'?state.fbFrom:'';
  return {hosted:HOSTED,ready:!!FB,signed:!!SO.uid,kind:state.fbKind||'bug',from:from?(PL[from]||from):'',prefill:state.fbPrefill||'',admin:!!FBK.admin}}
function aboutData(){const age=d=>{const t=Date.parse(d);return isNaN(t)?null:(Date.now()-t)/864e5};const g=age(D.meta.built),p=age(D.meta.prices);
  const lk=!HOSTED?'off':WS?'ok':WSerr?'bad':'off';
  return {pitch:PITCH,site:D.meta.site||D.meta.built,wfcd:D.meta.wfcd||'',built:D.meta.built,prices:D.meta.prices,sec:state.aboutSec||'',
    changes:CHANGES.map(([d,t])=>({d:fdate(d),t})),
    feeds:[{k:g==null||g<21?'ok':'warn',t:`Game data ${D.meta.wfcd?'v'+D.meta.wfcd+', ':''}${D.meta.built}${g!=null&&g>=21?' (may be out of date)':''}`},
      {k:p==null||p<3?'ok':'warn',t:`Prices ${D.meta.prices}${p!=null&&p>=3?' (delayed)':''}`},
      {k:lk,t:`Live game feed ${lk==='ok'?'connected':lk==='bad'?'unavailable':HOSTED?'not loaded yet':'on tennoform.com only'}`}]}}
function adminData(){const base={state:'',email:(typeof acct!=='undefined'&&acct&&(acct.email||acct.name))||'',uid:SO.uid||'',err:''};
  if(!HOSTED||!FB||!SO.uid)return {...base,state:'signin'};
  if(!FBK.tried){loadFeedback().then(()=>{if(FBK.admin)loadDonations();tfNotify()});return {...base,state:'checking'}}
  if(!FBK.admin)return {...base,state:'denied',err:/permission/.test(FBK.err||'')?"permission denied (the ID isn't in admins, or the rules aren't published)":FBK.err||'unknown'};
  if(!DON.tried)loadDonations();const fl=FBK.list||[],dl=DON.list||[],t=donTotals(dl),f=state.fbF||'open';
  return {...base,state:'ok',tab:state.adTab||'feedback',filter:f,open:fl.filter(x=>!x.done).length,fbTotal:fl.length,
    totals:{usdM:money(t.usdM),usd:money(t.usd),platM:fmt(t.platM)+'p',plat:fmt(t.plat)+'p',n:t.n,who:Object.keys(t.who).length},
    feedback:fl.filter(x=>f==='all'||(f==='open'&&!x.done)||(f==='done'&&x.done)||f===x.kind).map(x=>({id:x.id,kind:x.kind||'other',at:new Date(x.at).toLocaleString(),page:x.page||'',text:x.text||'',name:x.name||'',contact:x.contact||'',done:!!x.done})),
    donErr:!!DON.err,donLoading:DON.list==null,
    donations:dl.map(d=>({id:d.id,amount:d.kind==='plat'?fmt(d.amount)+'p':money(+d.amount||0),who:d.who||'',date:fdate(new Date(d.at).toISOString()),kind:d.kind==='plat'?'Platinum':d.kind==='paypal'?'PayPal':'Other',note:d.note||''}))}}
Object.assign(window.TF,{
  support:()=>supportData(),
  copy:(text,msg)=>copy(text,msg||'Copied'),
  feedback:()=>feedbackData(),
  feedbackSet:o=>{if(o.kind!=null)state.fbKind=o.kind;tfNotify()},
  feedbackSend:async(kind,text,contact)=>{text=(text||'').trim();if(text.length<3){toast('Write a little more first');return false}
    if(!FB){toast('Still loading. Try again in a moment.');return false}if(!SO.uid){toast('Sign in to send feedback');return false}
    const d={text:text.slice(0,2000),kind:kind||'other',page:(state.fbFrom||'home').slice(0,40),at:Date.now(),uid:SO.uid,name:myName()};contact=(contact||'').trim();if(contact)d.contact=contact.slice(0,120);
    try{await FB.fs.collection('feedback').add(d);state.fbPrefill='';toast('Thanks! Your feedback was sent.');return true}catch(e){toast("Couldn't send. Try again in a moment.");return false}},
  about:()=>aboutData(),
  admin:()=>adminData(),
  adminSet:o=>{if(o.tab!=null)state.adTab=o.tab;if(o.filter!=null)state.fbF=o.filter;saveUI();tfNotify()},
  adminRecheck:()=>{FBK.tried=false;loadFeedback().then(()=>{if(FBK.admin){DON.tried=false;loadDonations()}tfNotify()})},
  fbReload:()=>{FBK.tried=false;loadFeedback().then(tfNotify)},
  fbDone:id=>{const x=(FBK.list||[]).find(y=>y.id===id);if(!x)return;x.done=!x.done;FB.fs.collection('feedback').doc(id).update({done:x.done}).catch(()=>toast("Couldn't update"));tfNotify()},
  fbDel:id=>{const x=(FBK.list||[]).find(y=>y.id===id);if(!x)return;const i=FBK.list.indexOf(x);FBK.list=FBK.list.filter(y=>y.id!==id);tfNotify();
    let undone=false;const t=setTimeout(()=>{if(!undone)FB.fs.collection('feedback').doc(id).delete().catch(()=>toast("Couldn't delete"))},7000);
    undoToast('Feedback deleted',()=>{undone=true;clearTimeout(t);FBK.list.splice(i,0,x);tfNotify()})},
  donAdd:async o=>{const amt=parseFloat(o.amount);if(!(amt>0)){toast('Enter an amount');return false}
    const d={kind:o.kind||'paypal',amount:Math.round(amt*100)/100,at:o.date?Date.parse(o.date+'T12:00:00'):Date.now(),by:SO.uid};const who=(o.who||'').trim(),note=(o.note||'').trim();if(who)d.who=who.slice(0,60);if(note)d.note=note.slice(0,200);
    try{const r=await FB.fs.collection('donations').add(d);DON.list=[{id:r.id,...d},...(DON.list||[])].sort((a,b)=>b.at-a.at);toast('Donation logged');tfNotify();return true}catch(e){toast("Couldn't save. Are the latest Firestore rules published?");return false}},
  donDel:async id=>{try{await FB.fs.collection('donations').doc(id).delete();DON.list=(DON.list||[]).filter(x=>x.id!==id);tfNotify();toast('Deleted')}catch(x){toast("Couldn't delete")}},
  donReload:()=>loadDonations(true).then(tfNotify),
  donCSV:()=>donCSV()
});
function undoToast(text,fn){if(window.TF_UI&&TF_UI.toast)TF_UI.toast(text,{label:'Undo',fn});else toast(text)}
[['donate','donate'],['feedback','feedback'],['about','about'],['admin','admin']].forEach(([r,k])=>{const _r=routes[r];routes[r]=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns(k)?'':_r()}});
/* "What's new" links open the changes list on the React About page */
document.addEventListener('click',e=>{const t=e.target.closest('[data-about]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('about')))return;
  e.preventDefault();e.stopPropagation();state.aboutSec=t.dataset.about;if(location.hash!=='#about')location.hash='about';else tfNotify();
  setTimeout(()=>{const c=document.getElementById('changes');if(c)c.scrollIntoView({block:'start'})},200)},true);
/* the account menu shows Backend once the admin check finishes; tell the shell when it does */
{const _lf=loadFeedback;loadFeedback=async function(){const r=await _lf.apply(this,arguments);tfNotify();return r}
 const _ld=loadDonations;loadDonations=async function(){const r=await _ld.apply(this,arguments);tfNotify();return r}}
