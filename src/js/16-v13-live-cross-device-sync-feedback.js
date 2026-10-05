/* ---------- v13: live cross-device sync, feedback ---------- */
let saveErrShown=false;
function saveFail(){if(saveErrShown)return;saveErrShown=true;toast('Couldn\'t save to your account. Check your connection; changes are kept on this device and retried.');setTimeout(()=>saveErrShown=false,60000)}
function liveRender(){if(document.activeElement&&document.activeElement.matches('input,textarea,select'))return;const y=scrollY;render();scrollTo(0,y)}
function liveSync(uid){const base=FB.fs.collection('users').doc(uid).collection('data');
  SO.unsub.push(base.doc('progress').onSnapshot(s=>{if(s.metadata.hasPendingWrites||!s.exists)return;const rc=(s.data()||{}).c||{};let ch=false;
    for(const k in rc){if(k in pending)continue;const v=!!rc[k];if(v!==!!C[k]){if(v)C[k]=1;else delete C[k];ch=true}}
    if(ch){lsSet('tenno-codex',C);updateMR();liveRender()}},()=>{}));
  SO.unsub.push(base.doc('profile').onSnapshot(s=>{if(s.metadata.hasPendingWrites||!s.exists)return;const d=s.data()||{};if(typeof d.j!=='string')return;
    if(d.edited&&P.edited&&d.edited<=P.edited)return;let o;try{o=JSON.parse(d.j)}catch(e){return}Object.assign(P,o);lsSet('tenno-profile',P);updateMR();liveRender()},()=>{}))}

/* ---- feedback ---- */
const FBK={list:null,admin:false,tried:false};
async function loadFeedback(){if(!FB||!SO.uid||FBK.tried)return;FBK.tried=true;
  try{const s=await FB.fs.collection('feedback').orderBy('at','desc').limit(200).get();FBK.list=s.docs.map(d=>({id:d.id,...d.data()}));FBK.admin=true;FBK.err='';if(location.hash==='#feedback'||location.hash==='#admin')liveRender()}catch(e){FBK.admin=false;FBK.err=(e&&e.code)||'error';if(location.hash==='#admin')liveRender()}}
function feedback(){if(HOSTED&&FB&&SO.uid&&!FBK.tried)loadFeedback();const f=state.fbF||'open';
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Feedback</div><h1>Feedback</h1><p class="lede">Found a bug, missing data or have an idea? Tennoform is built by one developer, and every message gets read.</p></div>`;
  if(!HOSTED)return h+`<div class="panel cut">Send feedback from <a class="ln" href="https://tennoform.com/#feedback" target="_blank" rel="noopener">tennoform.com</a>.</div></div>`;
  if(!FB)h+=`<div class="panel cut">Loading…</div>`;
  else if(!SO.uid)h+=`<div class="panel cut stack"><b>Sign in to send feedback.</b><span class="small muted">It only takes a moment with Google, and keeps spam out so every message gets read.</span><a class="btn primary" href="#tenno" data-ttab="account" style="align-self:flex-start">Sign in</a></div>`;
  else h+=`<section class="panel cut stack" style="gap:10px">
   <div class="row">${sel('fbkind',state.fbKind||'bug',[['bug','Something is wrong'],['idea','Idea or request'],['other','Other']],'Feedback type').replace('style="width:auto"','style="width:auto" id="fbkind"')}${state.fbFrom&&state.fbFrom!=='feedback'?`<span class="small muted">About the ${esc(PL[state.fbFrom]||state.fbFrom)} page</span>`:''}</div>
   <textarea id="fbtext" maxlength="2000" placeholder="What happened, or what would you like to see? The more detail the better." aria-label="Your feedback" style="min-height:140px;font:14.5px var(--f-body)">${esc(state.fbPrefill||'')}</textarea>
   <input id="fbcontact" type="text" maxlength="120" placeholder="Optional: Discord, email or in-game name if you'd like a reply" aria-label="Contact (optional)">
   <div class="row"><button class="btn primary" id="fbsend">Send feedback</button><span class="small muted">Only the developer can read this.</span></div></section>`;
  if(FBK.admin)h+=`<div class="callout small">You're an admin. <a class="ln" href="#admin">Open the Backend</a> to read feedback and log donations.</div>`;
  return h+'</div>'}
function fbInbox(){const f=state.fbF||'open';const L2=(FBK.list||[]).filter(x=>f==='all'||(f==='open'&&!x.done)||(f==='done'&&x.done)||f===x.kind);const open=(FBK.list||[]).filter(x=>!x.done).length;
    return `<section class="obj"><div class="obj-h"><div class="row" style="justify-content:space-between"><h3>Feedback inbox <span class="chip gold">${open} open</span></h3><span class="row">${sel('fbf',f,[['open','Open'],['done','Done'],['all','All'],['bug','Bugs'],['idea','Ideas'],['other','Other']],'Filter feedback')}<button class="btn sm" id="fbreload">Refresh</button></span></div></div>
     ${L2.map(x=>`<div class="fbi${x.done?' done':''}"><div class="row" style="justify-content:space-between;gap:6px"><span class="row" style="gap:6px"><span class="chip ${x.kind==='bug'?'bad':x.kind==='idea'?'teal':''}">${esc(x.kind)}</span><span class="small muted mono">${new Date(x.at).toLocaleString()}</span>${x.page?`<span class="small muted">· ${esc(x.page)}</span>`:''}</span><span class="row" style="gap:4px"><button class="btn sm" data-fbdone="${esc(x.id)}">${x.done?'Reopen':'Done'}</button><button class="btn sm" data-fbdel="${esc(x.id)}">Delete</button></span></div>
      <div class="fbt">${esc(x.text)}</div><div class="small muted">${x.name?esc(x.name):'Anonymous'}${x.contact?' · '+esc(x.contact):''}</div></div>`).join('')||'<div class="empty">Nothing here.</div>'}</section>`}
async function sendFeedback(){const text=($('#fbtext')&&$('#fbtext').value||'').trim();if(text.length<3)return toast('Write a little more first');
  if(!FB)return toast('Still loading. Try again in a moment.');
  state.fbPrefill='';const d={text:text.slice(0,2000),kind:($('#fbkind')||{}).value||'other',page:(state.fbFrom||'home').slice(0,40),at:Date.now()};const c=($('#fbcontact')&&$('#fbcontact').value||'').trim();if(c)d.contact=c.slice(0,120);
  if(!SO.uid)return toast('Sign in to send feedback');d.uid=SO.uid;d.name=myName();
  try{await FB.fs.collection('feedback').add(d);$('#fbtext').value='';if($('#fbcontact'))$('#fbcontact').value='';toast('Thanks! Your feedback was sent.')}catch(e){toast('Couldn\'t send. Try again in a moment.')}}
document.addEventListener('click',async e=>{const t=e.target.closest('#fbsend,[data-fbdone],[data-fbdel],#fbreload,a[href="#feedback"]');if(!t)return;
  if(t.matches('a[href="#feedback"]')){state.fbFrom=(location.hash||'#home').slice(1);return}
  if(t.id==='fbsend'){t.disabled=true;await sendFeedback();t.disabled=false;return}
  if(t.id==='fbreload'){FBK.tried=false;loadFeedback();return}
  if(t.dataset.fbdone){const x=FBK.list.find(y=>y.id===t.dataset.fbdone);if(!x)return;x.done=!x.done;FB.fs.collection('feedback').doc(x.id).update({done:x.done}).catch(()=>toast('Couldn\'t update'));liveRender();return}
  if(t.dataset.fbdel){if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Tap again';return}FB.fs.collection('feedback').doc(t.dataset.fbdel).delete().catch(()=>{});FBK.list=FBK.list.filter(y=>y.id!==t.dataset.fbdel);liveRender();return}});
document.addEventListener('change',e=>{if(e.target.id==='fbf'){state.fbF=e.target.value;liveRender()}});

