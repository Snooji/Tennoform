
(function(){
if(/(^|\.)tennoform\.com$|github\.io$/.test(location.hostname)&&window.top!==window.self){try{window.top.location.replace(location.href)}catch(e){}document.documentElement.innerHTML='';return}
document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&!t.closest('[data-thumb]')&&/cdn\.warframestat\.us|githubusercontent/.test(t.src||''))t.remove()},true);
/* game data and the daily prices load as their own cached files (bundle/game-*.js, bundle/market-*.js) just before this one */
if(!self.TF_GAME||!self.TF_MARKET){document.body.insertAdjacentHTML('afterbegin','<p style="padding:24px;font:16px system-ui">Tennoform couldn\'t finish loading. Check your connection and refresh the page.</p>');throw new Error('Tennoform data files did not load')}
const D=Object.assign({},self.TF_GAME,self.TF_MARKET);
const I=D.items, REL=D.relics, MODS=D.mods, ARC=D.arcanes, RES=D.res, PR=D.prices, MS=D.mslug, M=D.mastery, Q=D.quests, NODES=D.nodes, ALLN=D.allnodes, RT=D.rtiers, RSRC=D.rsrc, VAULT=D.vault, SEL=D.sellers;
const U={};for(const n in I)U[I[n].u]=n;
const QU={};Q.forEach(q=>{if(q.u)QU[q.u]=q.n});
const NX={};ALLN.forEach(n=>NX[n.id]=n);
const $=s=>document.querySelector(s);
const HOSTED=true; /* the site always runs as tennoform.com now; kept so older checks still read */
const STANDALONE=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n==null||n===''||isNaN(n)?'—':Number(Math.round(n)).toLocaleString('en-US');
const hrs=s=>{if(!s)return'instant';const h=s/3600;return h>=24?(+(h/24).toFixed(1))+' d':(+h.toFixed(1))+' h'};
const fdate=s=>{if(!s)return'';const d=new Date(s.length===10?s+'T12:00:00Z':s);return isNaN(d)?'':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
const RAR={C:'Common',U:'Uncommon',R:'Rare'};
const ERA_TIP={Lith:'Hepit, Void (Capture)',Meso:'Ukko, Void (Capture) or Io, Jupiter (Defense)',Neo:'Ukko, Void (Capture) or Mot, Void (Survival)',Axi:'Apollo, Lua (Disruption)',Requiem:'Kuva Lich / Sister requiem drops'};
const PAGES=[['home','Home'],['today','Today'],['ranks','Ranks'],['collection','My collection'],['synd','Syndicates'],['quests','Quests'],['guides','Guides'],['missions','Star chart'],['resources','Resources'],['goals','Gear goals'],['relics','Relics'],['mastery','MR plan'],['tenno','Profile'],['frames','Warframes'],['arsenal','Builds'],['world','Open worlds'],['farm','Farm finder'],['market','Market'],['tasks','To-do list'],['achievements','Achievements'],['chat','Chat'],['friends','Friends'],['donate','Support'],['feedback','Feedback'],['about','About']];
const ICON={squad:'M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm9 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM1 21v-1c0-3.9 3.1-7 7-7s7 3.1 7 7v1zm15.4-7.9c3.2.2 5.6 2.8 5.6 6V21h-5v-1c0-2.6-.9-5-2.5-6.7.6-.1 1.2-.2 1.9-.2z',me:'M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-9 10c0-5 4-8 9-8s9 3 9 8z',tasks:'M9 4h11v2H9zm0 7h11v2H9zm0 7h11v2H9zM3.5 3.5l1.5 1.5 3-3 1 1-4 4-2.5-2.5zm0 7l1.5 1.5 3-3 1 1-4 4-2.5-2.5zM4 17h3v3H4z',home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',tenno:'M12 2a5 5 0 0 1 5 5v3l3 3-3 1v6h-4v-4h-2v4H7v-6l-3-1 3-3V7a5 5 0 0 1 5-5z',missions:'M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z',resources:'M12 2l9 5v10l-9 5-9-5V7zm0 3.3L6 8.6v6.8l6 3.3 6-3.3V8.6z',ranks:'M4 20h4V10H4zm6 0h4V4h-4zm6 0h4v-7h-4z',today:'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm-2 8h14v10H5z',quests:'M6 2h10l4 4v16H6zm3 7h8v2H9zm0 4h8v2H9zm0 4h5v2H9z'};
/* Five places. Every page belongs to one; the place link reopens the last page used in it. */
const PLACES=[['home','Home','home',['home']],['plan','Plan','mastery',['mastery','ranks','collection','goals','tasks','missions','quests','guides']],['farm','Farm','farm',['farm','resources','relics','world','market','arsenal','frames']],['today','Today','today',['today','synd','achievements']],['squad','Squad','chat',['chat','friends']]];
const PICON={home:'home',plan:'ranks',farm:'resources',today:'today',squad:'squad'};
const SUBL={ranks:'Ranks',mastery:'MR plan',collection:'My collection',goals:'Goals & to-dos',tasks:'To-do list',missions:'Star chart & quests',quests:'Quests',guides:'Guides',farm:'Farm finder',resources:'Resources',relics:'Relics',world:'Open worlds',market:'Market',arsenal:'Builds',frames:'Warframes',today:'Today',synd:'Syndicates',achievements:'Achievements',chat:'Chat',friends:'Friends'};
const MENU=[['tenno','Profile & account'],['donate','Support Tennoform'],['feedback','Feedback'],['about','About & privacy']];
const BAR=PLACES.flatMap(p=>p[3]);
/* paired pages share one menu entry (Gear goals + To-do list, Star chart + Quests); a switch on the page moves between them */
const NAV_PAIRED=new Set(['tasks','quests']);
const PL=Object.fromEntries(PAGES);PL.admin='Backend';PL.home='Home';
const GROUPS=PLACES.filter(p=>p[3].length>1).map(p=>[p[1],p[3]]).concat([['More',MENU.map(m=>m[0])]]);
function placeOf(r){return PLACES.find(p=>p[3].includes(r))||null}
function placeLast(p){const m=lsGet('tf-place',{})||{};return p[3].includes(m[p[0]])?m[p[0]]:p[2]}
function navPaint(key){const pl=placeOf(key);if(pl&&pl[3].length>1){const m=lsGet('tf-place',{})||{};m[pl[0]]=key;lsSet('tf-place',m)}
  document.querySelectorAll('[data-place]').forEach(a=>{const p=PLACES.find(x=>x[0]===a.dataset.place);a.setAttribute('href','#'+placeLast(p));if(pl&&pl[0]===p[0])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function subnav(key){if(window.TF_UI)return'';const pl=placeOf(key);if(!pl||pl[3].length<2)return'';
  return `<nav class="subnav" aria-label="${esc(pl[1])}">${pl[3].map(r=>`<a href="#${r}"${r===key?' aria-current="page"':''}>${SUBL[r]||PL[r]}</a>`).join('')}</nav>`}
const navIcon=k=>`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="${ICON[k]}"/></svg>`;
if($('nav.tabs'))$('nav.tabs').innerHTML=PLACES.map(p=>`<a href="#${p[2]}" data-place="${p[0]}">${p[1]}</a>`).join('');
if($('.bnav'))$('.bnav').innerHTML=PLACES.map(p=>`<a href="#${p[2]}" data-place="${p[0]}">${navIcon(PICON[p[0]])}${p[1]}</a>`).join('');
function menuHTML(){const who=signedIn()?`<div class="mehead small muted">Signed in as <b>${esc(acct.name||acct.email||'you')}</b></div>`:canAcct()?signBlock('inmenu'):'<div class="mehead small muted">Progress is saved on this device</div>';
  return `${who}${typeof FBK!=='undefined'&&FBK.admin?'<a href="#admin">Backend</a>':''}${MENU.map(([r,l])=>`<a href="#${r}">${l}</a>`).join('')}<a href="#about" data-about="changes">What's new</a>${signedIn()?'<button type="button" class="melink" id="lgout">Sign out</button>':''}<div class="mefoot small">Theme ${themeSw()}</div>`}
function setMenu(o){if(window.TF_UI&&TF_UI.openMenu){if(o)TF_UI.openMenu();return}const d=$('#drawer');if(!d)return;if(o)$('#sheet').innerHTML=menuHTML();d.classList.toggle('open',o);$('#hamb').setAttribute('aria-expanded',o?'true':'false');if(o)setTimeout(()=>{const a=$('#sheet a');a&&a.focus()},30)}
$('#hamb')&&$('#hamb').addEventListener('click',()=>setMenu(!$('#drawer').classList.contains('open')));
$('#sheet')&&$('#sheet').addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

/* ---------- theme: a mode (auto follows the device, dark, light) and a style (Default, Foundry, Prime, or a faction: Grineer, Corpus, Entrati, Lotus, Infested) ---------- */
/* The .dark class drives every colour token; data-theme picks the style; data-accent (set by the React shell) picks the colour palette.
   Every style has a light and a dark version, and every palette works in every style. */
const THEME_STYLES=['default','foundry','prime','grineer','corpus','entrati','lotus','infested'];
function themeGet(){try{const t=JSON.parse(localStorage.getItem('tf-theme')||'"dark"');return t==='foundry'?'light':['dark','light','auto'].includes(t)?t:'dark'}catch(e){return 'dark'}}
function themeStyle(){try{const s=JSON.parse(localStorage.getItem('tf-style')||'null');if(THEME_STYLES.includes(s))return s;
  /* before styles were separate, Foundry was a theme of its own (a light one) */
  return JSON.parse(localStorage.getItem('tf-theme')||'""')==='foundry'?'foundry':'default'}catch(e){return 'default'}}
const THEME_BAR={default:['#100f0d','#f5f5f3'],foundry:['#0f1a24','#b4bfcb'],prime:['#07060a','#f4efe3'],grineer:['#15130e','#d9d2bf'],corpus:['#06111c','#eef3f7'],entrati:['#1a0d10','#efe3d0'],lotus:['#071417','#eef6f4'],infested:['#0d0a0c','#ece4dc']};
function themeApply(t,st){st=st||themeStyle();const r=document.documentElement;
  const dark=t==='dark'||(t==='auto'&&!(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches));
  r.classList.toggle('dark',dark);if(st==='default')delete r.dataset.theme;else r.dataset.theme=st;r.style.colorScheme=dark?'dark':'light';
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=THEME_BAR[st][dark?0:1]}
function themeSave(){if(typeof tfNotify==='function')tfNotify()}
function themeSet(t){try{localStorage.setItem('tf-theme',JSON.stringify(t));if(!localStorage.getItem('tf-style'))localStorage.setItem('tf-style',JSON.stringify(themeStyle()))}catch(x){}themeApply(t);themeSave()}
function themeStyleSet(s){if(!THEME_STYLES.includes(s))return;try{localStorage.setItem('tf-style',JSON.stringify(s));localStorage.setItem('tf-theme',JSON.stringify(themeGet()))}catch(x){}themeApply(themeGet(),s);themeSave()}
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(themeGet()==='auto')themeApply('auto')})}catch(e){}
themeApply(themeGet());
function themeSw(){const t=themeGet(),st=themeStyle();
  return `<span class="themesw" role="group" aria-label="Mode">${[['auto','Auto'],['dark','Dark'],['light','Light']].map(([k,l])=>`<button type="button" class="btn sm${t===k?' on':''}" data-theme-set="${k}" aria-pressed="${t===k}">${l}</button>`).join('')}</span>
  <span class="themesw" role="group" aria-label="Style">${[['default','Default'],['foundry','Foundry'],['prime','Prime'],['grineer','Grineer'],['corpus','Corpus'],['entrati','Entrati'],['lotus','Lotus'],['infested','Infested']].map(([k,l])=>`<button type="button" class="btn sm${st===k?' on':''}" data-style-set="${k}" aria-pressed="${st===k}">${l}</button>`).join('')}</span>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-set],[data-style-set]');if(!b)return;if(b.dataset.themeSet)themeSet(b.dataset.themeSet);else themeStyleSet(b.dataset.styleSet);rerender()});
/* ---------- icons: one drawn set, 24px grid, 1.5px stroke, sized to the text ---------- */
const IC={check:'M5 12.5l4.5 4.5L19 7.5',minus:'M6 12h12',close:'M6 6l12 12M18 6L6 18',star:'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z',
  pin:'M9 3.5h6M10 3.5v6l-3.5 4h11L14 9.5v-6M12 13.5V21',more:'M5.5 12h.01M12 12h.01M18.5 12h.01',repeat:'M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3',
  timer:'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2M9.5 2.5h5',ext:'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  edit:'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',plus:'M12 5v14M5 12h14',warn:'M12 4l9 16H3zM12 10v4M12 17.5h.01',search:'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM16 16l5 5'};
function ic(n,cls){return `<svg class="ic${cls?' '+cls:''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[n]}"/></svg>`}
/* ---------- storage ---------- */
let C={},P={rk:{},other:0,intr:0,mr:null,name:'',at:'',adj:0,wfid:'',prof:null,mc:{},inv:{},foundry:[]};
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
C=lsGet('tenno-codex',{})||{};Object.assign(P,lsGet('tenno-profile',{})||{});
if(!P.wfid)P.wfid=lsGet('tenno-acct','')||'';
const kenc=k=>k.replace(/[.\/\[\]#$]/g,'_');
const on=k=>!!C[kenc(k)];
let docRef=null,profRef=null,pending={},timer=null,ptimer=null,synced=false,acct=null,FB=null;
const SAVE_MS=600;var LOGMUTE=0;
function setK(k,v){const e=kenc(k);if(v)C[e]=1;else delete C[e];lsSet('tenno-codex',C);
  if(docRef){pending[e]=v?1:0;clearTimeout(timer);timer=setTimeout(flush,SAVE_MS)}updateMR()}
async function flush(){if(!docRef)return;const p=pending;pending={};if(!Object.keys(p).length)return;
  try{await docRef.update({c:p})}catch(e){try{await docRef.set({c:C})}catch(e2){Object.assign(pending,p);saveFail();clearTimeout(timer);timer=setTimeout(flush,5000)}}}
function saveProfile(){P.edited=new Date().toISOString();if(typeof schedulePublic==='function')schedulePublic();lsSet('tenno-profile',P);clearTimeout(ptimer);ptimer=setTimeout(()=>{if(profRef)Promise.resolve(profRef.set(JSON.parse(JSON.stringify(P)))).catch(saveFail)},SAVE_MS)}
async function pushAll(){clearTimeout(timer);pending={};if(docRef){try{await docRef.set({c:C})}catch(e){}}saveProfile()}
async function attach(dr,pr,info){docRef=dr;profRef=pr;
  const [snap,ps]=await Promise.all([docRef.get(),profRef.get()]);
  if(snap.exists){const rc=(snap.data()||{}).c||{};const localOnly=Object.keys(C).filter(k=>!(k in rc));
    const m={...C};for(const k in rc){if(rc[k])m[k]=1;else delete m[k]}C=m;lsSet('tenno-codex',C);
    if(localOnly.length){localOnly.forEach(k=>pending[k]=1);flush()}}
  else await docRef.set({c:C});
  if(ps.exists){const pd=ps.data()||{};if(!P.edited||(pd.edited&&pd.edited>=P.edited))Object.assign(P,pd);lsSet('tenno-profile',P)}
  else if(P.edited||P.at)profRef.set(JSON.parse(JSON.stringify(P))).catch(()=>{});
  synced=true;acct=info;if(!document.activeElement||!document.activeElement.matches('input,textarea'))render()}
function detach(){flushNow();docRef=null;profRef=null;synced=false;acct=null;render()}
function flushNow(){if(!docRef)return;clearTimeout(timer);flush();clearTimeout(ptimer);if(profRef)profRef.set(JSON.parse(JSON.stringify(P))).catch(()=>{})}
window.addEventListener('pagehide',flushNow);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushNow()});
/* ---------- hosted accounts (Firebase Auth + Firestore, free tier) ---------- */
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
async function fbInit(){if(!HOSTED)return;try{await loadScript('/firebase-config.js')}catch(e){bootSync();return}bootSync();
  let cfg=window.TENNO_FIREBASE;if(!cfg||!cfg.apiKey){FBST='off';render();return}
  const B='/vendor/firebase-10.12.2/';
  try{await loadScript(B+'firebase-app-compat.js');await loadScript(B+'firebase-auth-compat.js');await loadScript(B+'firebase-firestore-compat.js')}catch(e){FBST='off';render();return}
  if(window.TENNO_SELF_AUTH&&location.hostname==='tennoform.com'&&(STANDALONE||IOS))cfg=Object.assign({},cfg,{authDomain:'tennoform.com'});
  firebase.initializeApp(cfg);const auth=firebase.auth();try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}const fs=firebase.firestore();if(window.TENNO_EMU){auth.useEmulator('http://127.0.0.1:9099');fs.useEmulator('127.0.0.1',8085)}FB={auth,fs};FBST='ready';render();
  try{await auth.getRedirectResult()}catch(e){toast(authMsg(e))}
  auth.onAuthStateChanged(async u=>{if(u){const base=fs.collection('users').doc(u.uid).collection('data');
      const wrap=r=>({get:()=>r.get(),set:o=>r.set(o),update:o=>r.set(o,{merge:true})});const wrapP=r=>{const put=o=>r.set({j:JSON.stringify(o),edited:o.edited||''});return {get:async()=>{const sn=await r.get();const d=sn.exists?(sn.data()||{}):null;return {exists:!!d,data:()=>d&&typeof d.j==='string'?JSON.parse(d.j):d}},set:put,update:put}};
      try{await attach(wrap(base.doc('progress')),wrapP(base.doc('profile')),{kind:'fb',email:u.email,name:u.displayName||'',uid:u.uid})}catch(e){toast('Signed in, but your saved data could not load. Check your connection.')}socialInit(u.uid)}
    else{socialStop();if(acct&&acct.kind==='fb')detach()}})}
function authMsg(e){const c=(e&&e.code)||'';return ({'auth/invalid-credential':'Wrong email or password.','auth/wrong-password':'Wrong email or password.','auth/user-not-found':'No account with that email. Tap Create account.','auth/email-already-in-use':'That email already has an account. Tap Sign in.','auth/weak-password':'Use a password with at least 6 characters.','auth/invalid-email':'That email address doesn\'t look right.','auth/popup-closed-by-user':'Sign-in was cancelled.','auth/too-many-requests':'Too many tries. Wait a minute and try again.','auth/network-request-failed':'No connection. Check your internet and try again.'})[c]||'Sign-in failed. Try again.'}
async function signGoogle(){if(!FB)return;const pr=new firebase.auth.GoogleAuthProvider();pr.setCustomParameters({prompt:'select_account'});if(STANDALONE||IOS){try{await FB.auth.signInWithRedirect(pr)}catch(e){toast(authMsg(e))}return}try{await FB.auth.signInWithPopup(pr)}catch(e){if(/popup-blocked|operation-not-supported|cancelled-popup/.test(e.code||''))await FB.auth.signInWithRedirect(pr);else toast(authMsg(e))}}
async function signEmail(create){if(!FB)return;const em=($('#lgemail')||{}).value?.trim(),pw=($('#lgpw')||{}).value||'';if(!em||!pw){toast('Enter your email and password');return}
  try{if(create)await FB.auth.createUserWithEmailAndPassword(em,pw);else await FB.auth.signInWithEmailAndPassword(em,pw);toast(create?'Account created. Your progress now saves to it.':'Signed in')}catch(e){toast(authMsg(e))}}
async function resetPw(){if(!FB)return;const em=($('#lgemail')||{}).value?.trim();if(!em){toast('Type your email first');return}try{await FB.auth.sendPasswordResetEmail(em);toast('Password reset email sent')}catch(e){toast(authMsg(e))}}
function accountPanel(){if(!HOSTED)return '';
  if(!FB&&FBST==='loading')return `<div class="panel cut" role="status">Loading sign-in…</div>`;if(!FB)return `<div class="panel stack cut"><h2>Sign in</h2><p class="small muted" style="margin:0">Accounts aren't switched on for this site yet. Progress saves in this browser; use Backup to move it.</p></div>`;
  if(acct&&acct.kind==='fb')return `<div class="panel stack cut"><h2>Signed in</h2><div class="kv"><span>Account</span><span>${esc(acct.email||acct.name||'Google account')}</span></div><p class="small muted" style="margin:0">Everything saves to your account automatically, so you can sign in on any device and pick up where you left off. You stay signed in on this device until you sign out.</p><div class="row"><button class="btn" id="lgout">Sign out</button><button type="button" class="btn" id="delacct">Delete account…</button></div><div class="small muted">Deleting removes your saved progress, friends, messages and friend code from Tennoform's servers. Progress in this browser stays.</div></div>`;
  return `<div class="panel stack cut" id="signin"><h2>Save your progress to an account</h2><p class="small" style="margin:0">A free account keeps your ranks, goals, tasks, checklist and builds safe and on every device. What you've already done here carries over. This is separate from linking your Warframe profile below, which only reads your in-game progress.</p>
  ${IOS&&!STANDALONE?'<div class="callout small"><b>iPhone tip:</b> tap <b>Share → Add to Home Screen</b> in Safari, then open Tennoform from your home screen and sign in once. It keeps you signed in like an app.</div>':''}
  <button class="btn primary" id="lggoogle">Continue with Google</button>
  <div class="small muted">or use email</div>
  <input id="lgemail" type="text" inputmode="email" autocomplete="email" placeholder="Email" aria-label="Email"><input id="lgpw" type="password" autocomplete="current-password" placeholder="Password (6+ characters)" aria-label="Password">
  <div class="row"><button class="btn" id="lgin">Sign in</button><button class="btn" id="lgnew">Create account</button><button class="btn sm" id="lgreset">Forgot password</button></div></div>`}

/* ---------- mastery math ---------- */
const BIG=['Warframe','Sentinel','Companion','Archwing','K-Drive','Necramech'];
const CATS=['Warframe','Primary','Secondary','Melee','Sentinel','Robotic Weapon','Companion','Archwing','Arch-Gun','Arch-Melee','Necramech','K-Drive','Zaw','Kitgun','Amp'];
const CATL={Warframe:'Warframes',Primary:'Primary Weapons',Secondary:'Secondary Weapons',Melee:'Melee Weapons',Sentinel:'Sentinels','Robotic Weapon':'Sentinel Weapons',Companion:'Companions',Archwing:'Archwing','Arch-Gun':'Archgun','Arch-Melee':'Archmelee',Necramech:'Necramechs','K-Drive':'K-Drives',Zaw:'Zaws',Kitgun:'Kitguns',Amp:'Amps'};
const EXTRA=[['chart','Missions'],['sp','The Steel Path Missions'],['rail','Railjack Intrinsics'],['drift','Drifter Intrinsics'],['other','Other gear (MOAs, Hounds, Amps…)']];
const IR=['Tactical','Piloting','Gunnery','Engineering','Command'],ID=['Riding','Combat','Opportunity','Endurance'];
const MI=Object.values(I).filter(i=>i.n!=='Helminth');
function isMech(it){return it&&it.c==='Necramech'}
function perRank(it){return it&&(BIG.includes(it.c)||isMech(it))?200:100}
function maxRank(it){return it&&(/^(Kuva|Tenet|Coda) /.test(it.n)||it.n==='Paracesis'||isMech(it))?40:30}
function mxp(it){return it?perRank(it)*maxRank(it):0}
function itemXP(n){const it=I[n];if(on('m|'+n))return mxp(it);const r=P.rk[n];return r?Math.min(r,maxRank(it))*perRank(it):0}
function rankOf(n){const it=I[n];return on('m|'+n)?maxRank(it):Math.min(+(P.rk[n]||0),maxRank(it))}
function setRank(n,r){const it=I[n];const mx=maxRank(it);r=Math.max(0,Math.min(mx,Math.round(+r||0)));const _prev={rk:P.rk[n],m:on('m|'+n)};const _was=rankOf(n);
  if(r>=mx){delete P.rk[n];if(!on('m|'+n))setK('m|'+n,1)}else{if(on('m|'+n))setK('m|'+n,0);if(r)P.rk[n]=r;else delete P.rk[n]}saveProfile();updateMR();if(_was!==rankOf(n))undoPush(n,_prev);return r}
function autoCat(c){let x=0,m=0,t=0,p=0;for(const it of MI)if(it.c===c){t++;const v=itemXP(it.n);x+=v;if(v>=mxp(it))m++;else if(v>0)p++}return {x,m,t,p}}
function intrSum(o){return Object.values(o||{}).reduce((a,v)=>a+(+v||0),0)}
function autoExtra(k){if(k==='chart')return NODES.reduce((a,n)=>a+(on('n|'+n.id)?n.x:0),0);if(k==='sp')return NODES.reduce((a,n)=>a+(on('sp|'+n.id)?n.x:0),0);
  if(k==='rail'){const s=intrSum(P.intrR);return (s||(!P.intrD&&+P.intr)||0)*1500}if(k==='drift')return intrSum(P.intrD)*1500;if(k==='other')return (+P.other||0)+othXP();return 0}
function isOv(k){return P.bo&&P.bo[k]!=null&&P.bo[k]!==''}
function catXP(k){if(isOv(k))return +P.bo[k];return CATS.includes(k)?autoCat(k).x:autoExtra(k)}
function totalXP(){const rows=[...CATS,...EXTRA.map(e=>e[0])].map(k=>[k,catXP(k)]);const g=k=>rows.find(r=>r[0]===k)[1];
  const it=CATS.reduce((a,k)=>a+g(k),0);const adj=+P.adj||0;const raw=rows.reduce((a,r)=>a+r[1],0)+adj;const base=inGameBase();const un=base?Math.max(0,base.x-raw):0;
  return {rows,it,ch:g('chart'),sp:g('sp'),intr:g('rail')+g('drift'),other:g('other'),adj,raw,un,base,total:raw+un}}
const mrNeed=m=>m<=30?2500*m*m:2250000+(m-30)*147500;
function mrInfo(x){let mr=0;while(mr<30&&mrNeed(mr+1)<=x)mr++;if(mr===30)mr=30+Math.max(0,Math.floor((x-2250000)/147500));
  const cur=mrNeed(mr),next=mrNeed(mr+1);return {mr,cur,next,pct:Math.max(0,Math.min(100,(x-cur)/(next-cur)*100))}}
const mrLabel=m=>m>30?'L'+(m-30):String(m);
function updateMR(){const b=$('#bigmr');if(b)b.outerHTML=bigMR();const hh=$('#hero');if(hh)hh.outerHTML=heroHTML();if(typeof rkHdr==='function')rkHdr();tfNotify()}

/* ---------- linking ---------- */
function partOwner(n){return Object.values(I).find(it=>it.parts.some(p=>p.full===n))}
function L(name,label){label=label??name;const n=String(name);
  let t=null;if(RES[n])t='res|'+n;else if(I[n])t='item|'+n;else if(D.partrel[n])t='part|'+n;else if(REL[n.replace(/ Relic$/,'')])t='relic|'+n.replace(/ Relic$/,'');else if(MODS[n])t='mod|'+n;else if(ARC[n])t='arc|'+n;
  else{const m=n.match(/^(.+?) (Neuroptics|Chassis|Systems|Blueprint|Harness|Wings)$/);if(m&&I[m[1]])t='item|'+m[1]}
  return t?`<a class="ln" href="#" data-go="${esc(t)}">${esc(label)}</a>`:esc(label)}
function go(t){const i=t.indexOf('|');const ty=t.slice(0,i),n=t.slice(i+1);
  if(ty==='res'){state.resSel=n;state.resQ='';if(location.hash!=='#resources')location.hash='resources';else{render();window.scrollTo(0,0)}return}
  if(ty==='item'&&I[n]&&I[n].c==='Warframe'){state.frame=n;state.build=0;saveUI();if(location.hash!=='#frames')location.hash='frames';else{render();window.scrollTo(0,0)}return}
  if(ty==='node'){state.scP=n||null;state.planet=null;if(location.hash!=='#missions')location.hash='missions';else render();return}
  state.farmSel=t;if(location.hash!=='#farm')location.hash='farm';else{render();setTimeout(()=>$('#fdet')?.scrollIntoView({block:'start',behavior:'smooth'}),30)}}

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
/* ---------- helpers ---------- */
function priceChip(n,label){const p=PR[n];if(!p)return'';const v=p.a7??p.a30;if(v==null)return'';
  return `<a class="chip gold" href="https://warframe.market/items/${MS[n]}" target="_blank" rel="noopener" title="warframe.market 7-day average">${label||''}${Math.round(v)}p</a>`}
/* sellers: [name, platinum, quantity, reputation, status, rank]; rank is set for mods and arcanes (0 = unranked) */
const rankTxt=r=>r==null?'':r===0?'Unranked':'Rank '+r;
/* ascending/descending for every sort menu: rv(key) reverses the sorted list before it's paged; the key is the sort's state name */
const SREV=lsGet('tf-sortrev',{})||{};
function rv(k,a){if(SREV[k])a.reverse();return a}
/* a Sell button next to a price: opens the Sell dialog (4699941-wfm-sell.js) */
function sellChip(n){return MS[n]?`<button type="button" class="chip" data-sell="${esc(n)}" aria-label="Sell ${esc(n)}">Sell</button>`:''}
function whisper(item,s){return `/w ${s[0]} Hi! I want to buy: "${item}${s[5]!=null?` (rank ${s[5]})`:''}" for ${s[1]} platinum. (warframe.market)`}
function sellerRow(item){const s=(SEL[item]||[]).filter(x=>x[0]!=='__buy');if(!s.length)return'';const b=s[0];
  return `<div class="seller"><span class="muted">Cheapest:</span><b>${esc(b[0])}</b><span class="chip gold">${b[1]}p</span>${b[5]!=null?`<span class="chip" title="Rank of the mod or arcane being sold">${rankTxt(b[5])}</span>`:''}${b[2]>1?`<span class="muted small">×${b[2]}</span>`:''}<button class="btn sm" data-wh="${esc(whisper(item,b))}">Copy whisper</button></div>`}
function farmFor(rn){const r=RES[rn];
  if(RT[rn]){const t=RT[rn].tiers;const best=r&&r.best;const pick=(t['Mid game']||[])[0]||(t['Early game']||[])[0];return (best?`<b>${esc(best)}</b>`:pick?`<b>${esc(pick[0])}</b> (${esc(pick[1])})`:'')+` · <a class="ln" href="#" data-go="res|${esc(rn)}">farms by stage</a>`}
  const s=RSRC[rn];if(s&&s.length)return `<b>${esc(s[0][0])}</b>${s[0][1]?': '+esc(s[0][1]):''}${s.length>1?` · <a class="ln" href="#" data-go="res|${esc(rn)}">${s.length} options</a>`:''}`;
  if(r&&r.loc)return 'Found on: '+esc(r.loc);return '<span class="muted">See wiki</span>'}
function haveTag(rn,q){const h=P.inv&&P.inv[rn];if(h==null||h==='')return'';return `<span class="have ${+h>=q?'ok':'no'}">have ${fmt(h)}</span>`}
function relSort(a,b){return 'CUR'.indexOf(a[1])-'CUR'.indexOf(b[1])}
function relicChips(list){if(!list||!list.length)return'';
  const open=list.filter(x=>!REL[x[0]]?.v).sort(relSort),vault=list.filter(x=>REL[x[0]]?.v).sort(relSort);
  let h='';
  if(open.length)h+=`<div class="small" style="margin-top:6px;color:var(--ok);font-weight:600">Farm from ${open.length} relic${open.length>1?'s':''}:</div><div class="relics">${open.map(([r,rr])=>relicDetails(r,rr)).join('')}</div>`;
  else h+=`<div class="small" style="margin-top:6px"><span class="vault">Vaulted.</span> Buy it, or wait for Resurgence.</div>`;
  if(vault.length)h+=`<details class="more"><summary>${vault.length} vaulted relic${vault.length>1?'s':''}</summary><div class="relics">${vault.slice(0,24).map(([r,rr])=>relicDetails(r,rr)).join('')}</div></details>`;
  return h}
function relicDetails(r,rar){const v=REL[r]?.v;
  return `<details class="relic"><summary><span class="dot rar-${rar}"></span>${esc(r)} <span class="rar-${rar}">${RAR[rar]||''}</span>${v?' <span class="tag-v">vaulted</span>':''}</summary><div class="body">${relicBody(r)}</div></details>`}
function nodeLink(label){const m=String(label).match(/^([^/]+)\/([^(·]+?)\s*\(/);if(m){const nd=ALLN.find(x=>x.n===m[2].trim()&&x.p===m[1].trim());if(nd)return `<a class="ln" href="#" data-go="node|${esc(nd.p)}">${esc(label)}</a>`}return esc(label)}
function relicBody(r){const R=REL[r];if(!R)return'No data';let h='';
  if(R.v)h+=`<div><span class="vault">Vaulted.</span> Not dropping right now. Buy it ${MS[r+' Relic']?`on <a href="https://warframe.market/items/${MS[r+' Relic']}" target="_blank" rel="noopener">warframe.market</a>`:'from other players'} or wait for Prime Resurgence.</div>${sellerRow(r+' Relic')}`;
  else{h+=`<div><b>Best nodes:</b></div><ol style="margin:4px 0 6px;padding-left:20px">`+(R.loc||[]).map(l=>`<li>${nodeLink(l[0])} <span class="mono">${l[1]}%</span></li>`).join('')+`</ol><div class="muted">Fast community pick for ${R.era} relics: ${esc(ERA_TIP[R.era]||'')}.</div>`+srcLine('relic')}
  h+=`<details class="more"><summary>What's inside</summary><ul style="margin:4px 0 0;padding-left:18px">`+R.rw.map(([n,rr])=>`<li><span class="rar-${rr}">${L(n)}</span> <span class="muted">${RAR[rr]}</span> ${priceChip(n)}</li>`).join('')+`</ul><div class="muted" style="margin-top:4px">Intact: Common 25.33% · Uncommon 11% · Rare 2%. Radiant: 16.67 / 20 / 10%.</div></details>`;return h}
function dropsList(dr,n){if(!dr||!dr.length)return'';return dr.slice(0,n||2).map(d=>`<b>${nodeLink(d[0])}</b> <span class="mono">${d[1]}%</span>`).join('<br>')}
function progHTML(){return `<div class="prog"><div class="track"><div class="fill"></div></div><span class="txt">0/0</span></div>`}
function refresh(root){(root||document).querySelectorAll('[data-scope]').forEach(sc=>{const sel=sc.dataset.scope||'input.ck[data-k]';const all=sc.querySelectorAll(sel);let n=0;all.forEach(i=>{if(i.checked)n++});
  const p=sc.querySelector(':scope > summary .prog, :scope > .obj-h .prog');if(p){p.querySelector('.fill').style.width=(all.length?n/all.length*100:0)+'%';p.querySelector('.txt').textContent=n+'/'+all.length}})}
function ck(k,cls){return `<input type="checkbox" class="ck ${cls||''}" data-k="${esc(k)}" ${on(k)?'checked':''} aria-label="Mark done">`}
function step(k,label,body){return `<li class="step${on(k)?' done':''}">${ck(k)}<div><div class="lbl">${label}</div>${body?`<div class="src">${body}</div>`:''}</div></li>`}
function toast(t){if(window.TF_UI&&TF_UI.toast){TF_UI.toast(t);return}document.querySelectorAll('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3200)}
function vaultChip(it){if(!it||!it.p)return'';const v=VAULT[it.n]||{};
  if(v.now)return `<span class="chip ok">Resurgence until ${fdate(v.now)}</span>`;
  if(it.v)return `<span class="chip bad">Vaulted${v.est?' · back ~'+fdate(v.est):''}</span>`;
  return `<span class="chip teal">Farmable${it.evd?' · vaults ~'+fdate(it.evd):''}</span>`}

/* ---------- item objective tree ---------- */
function totals(name,mult,acc,seen){const it=I[name];if(!it)return acc;
  acc.cr+=(it.cr||0)*mult;
  for(const p of it.parts){if(p.k==='r')acc.r[p.n]=(acc.r[p.n]||0)+p.q*mult;
    else if(p.k==='p'){acc.cr+=(p.cr||0)*mult;(p.sub||[]).forEach(([n,q])=>acc.r[n]=(acc.r[n]||0)+q*mult);if(p.t)acc.pt=Math.max(acc.pt,p.t)}
    else if(p.k==='i'&&I[p.n]&&!seen.includes(p.n))totals(p.n,p.q*mult,acc,[...seen,name])}
  return acc}
function bpSource(it,note){const n=it.n;
  if(it.bprel)return `Drops from Void Relics ${priceChip(n+' Blueprint','BP ')}${sellChip(n+' Blueprint')}${sellerRow(n+' Blueprint')}`+relicChips(it.bprel);
  let h='';if(it.bpd&&it.bpd.length)h+=dropsList(it.bpd,2);
  if(it.bc)h+=(h?'<br>':'')+`Buy the blueprint in the in-game <b>Market for ${fmt(it.bc)} credits</b>`;
  if(it.dr&&it.dr.length&&!it.bpd)h+=(h?'<br>':'')+dropsList(it.dr,2);
  if(note)h+=(h?'<br>':'')+`<b>Tip:</b> ${esc(note)}`;
  const qs=Q.filter(q=>q.rw.some(r=>r.toLowerCase().startsWith(n.toLowerCase()+' ')));
  if(qs.length)h+=(h?'<br>':'')+`Quest reward: ${qs.map(q=>`<a class="ln" href="#quests" data-q="${esc(q.n)}">${esc(q.n)}</a>`).join(', ')}`;
  if(!h)h=`Special source (syndicate, vendor or event). ${it.w?`<a href="${it.w}" target="_blank" rel="noopener">Wiki</a>`:''}`;
  if(it.mp)h+=`<br><span class="muted">Or buy it ready-built for ${it.mp} platinum.</span>`;
  return h}
function resRows(list,prefix){return `<ul class="reslist">`+list.map(([n,q])=>`<li>${ck(prefix+'|'+n,'sm')}<span class="q">${fmt(q)} × ${L(n)}${haveTag(n,q)}</span><span class="where">${farmFor(n)}</span></li>`).join('')+'</ul>'}
function itemTree(name,opts){opts=opts||{};const it=I[name];if(!it)return `<div class="panel">No data for ${esc(name)}</div>`;
  const depth=opts.depth||0;const rk=P.rk[name];
  let h=`<section class="obj" data-scope><div class="obj-h">${depth===0?art(name,'hero-art'):''}<div class="title"><h3>${esc(name)}</h3>
    <span class="chip">${esc(it.c)}</span>${it.mr?`<span class="chip">MR ${it.mr}</span>`:''}${vaultChip(it)}${rk&&!on('m|'+name)?`<span class="chip teal">Rank ${rk}</span>`:''}${it.p?priceChip(name+' Set','Set ')+sellChip(name+' Set'):''}
    ${mxChip(name)}${it.w?`<a class="small" href="${it.w}" target="_blank" rel="noopener">wiki</a>`:''}<span class="row" style="margin-left:auto;gap:4px">${it.t?`<button class="btn sm" data-fstart="${esc(name)}" title="Start a Foundry timer">${ic('timer')}Foundry</button>`:''}${taskBtn('item',name,'Build '+name)}<button class="btn sm ${(P.goals||[]).includes(name)?'on':''}" data-goal="${esc(name)}">${(P.goals||[]).includes(name)?ic('star','fill')+'Tracking':ic('star')+'Track'}</button></span></div>${it.p?sellerRow(name+' Set'):''}${progHTML()}</div><ol class="steps">`;
  h+=step('bp|'+name,'Get the blueprint',bpSource(it,opts.note));
  let pi=0;for(const p of it.parts){pi++;
    if(p.k==='p'&&p.n==='Blueprint')continue;
    if(p.k==='p'){const full=p.full||(name+' '+p.n);
      let src='';if(p.rel)src=`${priceChip(full)}${sellChip(full)}${p.du?` <span class="chip">${p.du} ducats</span>`:''}${sellerRow(full)}`+relicChips(p.rel);
      else if(p.dr&&p.dr.length)src=dropsList(p.dr,2);else src='Same source as the blueprint.';
      h+=step('part|'+name+'|'+p.n,`Get ${esc(full)}${p.sub&&!/Blueprint$/.test(full)?' blueprint':''}`,src);
      if(p.sub)h+=step('built|'+name+'|'+p.n,`Craft ${esc(p.n)} · ${hrs(p.t)} · ${fmt(p.cr)} cr`,resRows(p.sub,'res|'+name+'|'+p.n)+`<button class="btn sm" style="margin-top:8px" data-fstart="${esc(name+' '+p.n)}">${ic('timer')}Start Foundry timer</button>`);
    }else if(p.k==='i'){
      h+=step('have|'+name+'|'+p.n+'|'+pi,`Have a spare ${L(p.n)}${p.q>1?' ×'+p.q:''} (used up by the recipe)`,
        depth<3?`<details class="more lazy" data-tree="${esc(p.n)}" data-depth="${depth+1}"><summary>${esc(p.n)} steps</summary><div class="sub"></div></details>`:'');
    }}
  const rs=it.parts.filter(p=>p.k==='r').map(p=>[p.n,p.q]);
  h+=step('build|'+name,`Build in Foundry · ${hrs(it.t)} · ${fmt(it.cr)} cr${it.rush?` <span class="muted">(rush ${it.rush}p)</span>`:''}`,(rs.length?resRows(rs,'res|'+name+'|main'):'')+`<button class="btn sm" style="margin-top:8px" data-fstart="${esc(name)}">Start Foundry timer</button>`);
  h+=step('m|'+name,`Rank to ${maxRank(it)} · ${mxChip(name)}`,`Level it fast on Hydron (Sedna) or Elite Sanctuary Onslaught.`);
  h+='</ol>';
  const T=totals(name,1,{cr:0,r:{},pt:0},[]);const tr=Object.entries(T.r).sort((a,b)=>b[1]-a[1]);
  if(tr.length)h+=`<details class="more" style="padding:4px 14px 12px"><summary>Total shopping list</summary><div class="small"><div style="margin:6px 0"><b>${fmt(T.cr)} credits</b> · fastest finish <b>${hrs((T.pt||0)+(it.t||0))}</b> (build parts together, then the final build)</div><ul class="reslist">${tr.map(([n,q])=>shopLi(n,q)).join('')}</ul></div></details>`;
  return h+'</section>'}

/* ---------- shared bits for v9 pages ---------- */
const sel=(id,cur,opts,lab)=>`<select id="${id}" aria-label="${esc(lab||'Filter')}" style="width:auto">${opts.map(([k,l])=>`<option value="${esc(k)}" ${String(cur)===String(k)?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
const segBtns=(attr,cur,list)=>`<div class="seg">${list.map(([k,l])=>`<button class="btn ${cur===k?'on':''}" data-${attr}="${k}">${l}</button>`).join('')}</div>`;
const pv=n=>{const p=PR[n];return p?(p.a7??p.a30??null):null};
function ownedItem(n){return on('m|'+n)||rankOf(n)>0||on('build|'+n)}
function partKey(full){const it=partOwner(full);if(!it){return 'got|'+full}
  if(full===it.n+' Blueprint')return 'bp|'+it.n;const p=it.parts.find(x=>x.full===full);return p?'part|'+it.n+'|'+p.n:'got|'+full}
function partNeeded(full){const it=partOwner(full)||I[full.replace(/ Blueprint$/,'')];if(on(partKey(full))||on('got|'+full))return false;if(it&&ownedItem(it.n))return false;return true}
function partGoal(full){const it=partOwner(full)||I[full.replace(/ Blueprint$/,'')];return !!(it&&(P.goals||[]).includes(it.n))}
const rerender=()=>{const y=scrollY;render();scrollTo(0,y)};

/* ---------- arsenal: builds, adversary weapons, arcanes, key mods ---------- */
function arsenal(){const tab=state.aTab||'builds';
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Arsenal</div><h1>Builds</h1><p class="lede">Weapon and companion builds, your Kuva, Tenet and Coda weapons, arcanes and the mods every build leans on.</p></div>
  ${segBtns('atab',tab,[['builds','Weapon builds'],['comp','Companion builds'],['lich','Kuva · Tenet · Coda'],['arc','Arcanes'],['mods','Key mods']])}`;
  h+=tab==='comp'?buildsTab(D.cbuilds,'comp'):tab==='lich'?lichTab():tab==='arc'?arcTab():tab==='mods'?keyModsTab():buildsTab(D.wbuilds,'w');
  return h+'</div>'}
function buildsTab(src,kind){const cats=[...new Set(Object.keys(src).map(n=>I[n]?I[n].c:'Other'))];
  const cf=kind==='w'?(state.wbC||'all'):'all',of=state.wbO||'all';
  let names=Object.keys(src).filter(n=>(cf==='all'||(I[n]&&I[n].c===cf))&&(of==='all'||(of==='own'&&ownedItem(n))||(of==='not'&&!ownedItem(n))||(of==='unmastered'&&!on('m|'+n)))).sort();
  if(!names.length)names=Object.keys(src).sort();
  const key=kind==='w'?'wbSel':'cbSel';let cur=state[key];if(!cur||!names.includes(cur))cur=names[0];state[key]=cur;
  const bs=src[cur]||[];const bi=Math.max(0,Math.min(state.wbI||0,bs.length-1));const b=bs[bi];
  let h=`<div class="row">${kind==='w'?sel('wbc',cf,[['all','All weapons'],...cats.sort().map(c=>[c,c])],'Weapon type'):''}${sel('wbo',of,[['all','Owned or not'],['own','Owned'],['not','Not owned'],['unmastered','Not mastered']],'Ownership')}
   ${sel('wbsel',cur,names.map(n=>[n,n]),kind==='w'?'Weapon':'Companion').replace('style="width:auto"','style="flex:1 1 200px"')}</div>
  <div class="split wf">${I[cur]?itemTree(cur):`<div class="panel">${esc(cur)}</div>`}`;
  if(b){const slots=[...(b.exilus?[['Exilus',b.exilus]]:[]),...b.mods.map(m=>['Mod',m])];
    h+=`<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>Build</h3></div>${bs.length>1?segBtns('wbi',String(bi),bs.map((x,i)=>[String(i),esc(x.name)])):''}${progHTML()}</div>
    <div style="padding:12px 14px" class="stack"><div class="row"><span class="chip teal">${esc(b.role)}</span><b>${esc(b.name)}</b></div>${b.notes?`<div class="small muted">${esc(b.notes)}</div>`:''}
    <div class="mods">${slots.map(([s,m])=>modCard(s,m)).join('')}${b.arcanes.map(a=>arcCard(a)).join('')}</div>
    <div class="small muted">Community consensus build. Pick elements to match the faction you're fighting.</div></div></section>`}
  return h+'</div>'}
const ELEM=['','Heat','Cold','Electricity','Toxin','Impact','Magnetic','Radiation'];
function lichTab(){const ff=state.lF||'all',sf=state.lS||'all';const L2=P.lich||{};
  const own=n=>on('lich|'+n)||ownedItem(n);
  let list=D.lich.filter(w=>(ff==='all'||w.f===ff)&&(sf==='all'||(sf==='own'&&own(w.n))||(sf==='miss'&&!own(w.n))||(sf==='low'&&own(w.n)&&(+((L2[w.n]||{}).b)||0)<60)||(sf==='unm'&&!on('m|'+w.n))));
  list.sort((a,b)=>a.f.localeCompare(b.f)||a.n.localeCompare(b.n));
  const tot=D.lich.length,have=D.lich.filter(w=>own(w.n)).length,mast=D.lich.filter(w=>on('m|'+w.n)).length;
  let h=`<div class="tiles"><div class="tile cut"><span class="k">Owned</span><span class="v num">${have}<small>/${tot}</small></span><span class="tbar"><i style="width:${have/tot*100}%"></i></span></div>
   <div class="tile cut"><span class="k">Mastered</span><span class="v num">${mast}<small>/${tot}</small></span><span class="tbar"><i style="width:${mast/tot*100}%"></i></span><span class="x">rank 40 · 4,000 XP each</span></div>
   ${['Kuva','Tenet','Coda'].map(f=>{const a=D.lich.filter(w=>w.f===f);const o=a.filter(w=>own(w.n)).length;return `<div class="tile cut"><span class="k">${f}</span><span class="v num">${o}<small>/${a.length}</small></span><span class="tbar"><i style="width:${o/a.length*100}%"></i></span></div>`}).join('')}</div>
  <details class="obj grp"><summary><h3>How to get them</h3></summary><div class="stack" style="padding:10px 14px">${Object.entries(D.lichsrc).map(([f,s])=>`<div><b>${f} · ${esc(s.who)}</b><div class="small">${esc(s.how)}</div><div class="small muted">Vanquish: ${esc(s.vanq)} ${esc(s.alt)}</div></div>`).join('')}
   <div class="small muted">Valence Fusion: combine two copies of the same weapon to raise its bonus element. Max is 60%.</div></div></details>
  <div class="row">${sel('lf',ff,[['all','All factions'],['Kuva','Kuva'],['Tenet','Tenet'],['Coda','Coda']],'Faction')}${sel('ls',sf,[['all','All weapons'],['own','Owned'],['miss','Missing'],['low','Owned, under 60%'],['unm','Not mastered']],'Status')}</div>
  <div class="obj" data-scope="input.ck.lw"><div class="obj-h"><b>${list.length} weapons</b>${progHTML()}</div><div class="lichl">${list.map(w=>{const v=L2[w.n]||{};const o=own(w.n);
    return `<div class="lrow${o?' done':''}"><div class="lnm">${ck('lich|'+w.n,'sm lw')}<span>${L(w.n)} <span class="small muted">${esc(w.c)}${rankOf(w.n)&&!on('m|'+w.n)?' · rank '+rankOf(w.n):''}</span></span>${mxChip(w.n)}${priceChip(w.n)}</div>
    <div class="lctl"><select data-lel="${esc(w.n)}" aria-label="Bonus element for ${esc(w.n)}">${ELEM.map(e=>`<option value="${e}" ${v.e===e?'selected':''}>${e||'Element'}</option>`).join('')}</select>
    <input type="number" min="25" max="60" inputmode="numeric" data-lb="${esc(w.n)}" value="${v.b||''}" placeholder="%" aria-label="Bonus percent" style="width:70px">${v.b>=60?'<span class="chip ok">60%</span>':''}</div></div>`}).join('')||'<div class="empty">Nothing matches.</div>'}</div></div>`;
  return h}
const arcCopies=r=>(r+1)*(r+2)/2;
function arcRank(c){let r=-1;while(arcCopies(r+1)<=c)r++;return r}
function arcUses(){if(arcUses.m)return arcUses.m;const m={};const add=(bs,w)=>bs.forEach(b=>(b.arcanes||[]).forEach(a=>{(m[a]=m[a]||new Set()).add(w)}));
  for(const w in D.builds)add(D.builds[w],w);for(const w in D.wbuilds)add(D.wbuilds[w],w);return arcUses.m=m}
function arcTab(){const q=(state.arQ||'').toLowerCase(),tf=state.arT||'all',sf=state.arS||'all',so=state.arO||'use';const A=P.arc||{};const U2=arcUses();
  const types=[...new Set(Object.values(ARC).map(a=>a.ty).filter(Boolean))].sort();
  let list=Object.values(ARC).filter(a=>(!q||a.n.toLowerCase().includes(q))&&(tf==='all'||a.ty===tf)).filter(a=>{const c=+A[a.n]||0,mx=arcCopies(a.mx||5);return sf==='all'||(sf==='used'&&U2[a.n])||(sf==='own'&&c>0)||(sf==='max'&&c>=mx)||(sf==='part'&&c>0&&c<mx)||(sf==='none'&&!c)});
  list.sort((a,b)=>so==='name'?a.n.localeCompare(b.n):so==='price'?((pv(b.n)??-1)-(pv(a.n)??-1)):so==='need'?((arcCopies(b.mx||5)-(+A[b.n]||0))-(arcCopies(a.mx||5)-(+A[a.n]||0))):(((U2[b.n]?U2[b.n].size:0)-(U2[a.n]?U2[a.n].size:0))||a.n.localeCompare(b.n)));
  const owned=Object.values(ARC).filter(a=>(+A[a.n]||0)>0).length,maxed=Object.values(ARC).filter(a=>(+A[a.n]||0)>=arcCopies(a.mx||5)).length;
  return `<div class="tiles"><div class="tile cut"><span class="k">Arcanes owned</span><span class="v num">${owned}<small>/${Object.keys(ARC).length}</small></span></div><div class="tile cut"><span class="k">Max rank</span><span class="v num">${maxed}</span><span class="x">rank 5 takes 21 copies</span></div></div>
  <p class="small muted" style="margin:0">Enter how many copies you have in total (ranked ones count all the copies fused into them). The rank and copies left to max are worked out for you.</p>
  <div class="row"><input id="arq" type="search" placeholder="Find an arcane" value="${esc(state.arQ||'')}" style="flex:1 1 160px" aria-label="Find an arcane">${sel('art',tf,[['all','All types'],...types.map(t=>[t,t])],'Arcane type')}${sel('ars',sf,[['all','All'],['used','Used in builds'],['own','Owned'],['part','Not maxed'],['max','Maxed'],['none','Missing']],'Status')}${sel('aro',so,[['use','Sort: most used'],['need','Sort: copies needed'],['price','Sort: price'],['name','Sort: name']],'Sort')}</div>
  <div class="cards">${list.slice(0,200).map(a=>{const c=+A[a.n]||0,mx=a.mx||5,need=arcCopies(mx),r=arcRank(c);const u=U2[a.n];
    return `<div class="card cut"><div class="top"><span class="nm">${L(a.n)}</span>${c>=need?'<span class="chip ok">Max</span>':c?`<span class="chip teal">Rank ${r}</span>`:''}${priceChip(a.n)}</div>
    <div class="row small" style="gap:8px"><label for="ac-${esc(a.n.replace(/\W/g,''))}" class="muted">Copies</label><button class="btn sm" data-arcd="${esc(a.n)}|-1" aria-label="One fewer">−</button><input id="ac-${esc(a.n.replace(/\W/g,''))}" type="number" min="0" inputmode="numeric" data-arc="${esc(a.n)}" value="${c||''}" placeholder="0" style="width:70px"><button class="btn sm" data-arcd="${esc(a.n)}|1" aria-label="One more">+</button><span class="muted">${c>=need?'maxed':`${need-c} more to rank ${mx}`}</span></div>
    <div class="small muted">${esc(a.ty||'')}${u?` · used in ${[...u].slice(0,4).map(esc).join(', ')}${u.size>4?' +'+(u.size-4):''}`:''}</div>
    ${a.dr&&a.dr.length?`<div class="small">${dropsList(a.dr,2)}</div>`:''}</div>`}).join('')||'<div class="empty">Nothing matches.</div>'}</div>`}
function keyMods(){if(keyMods.m)return keyMods.m;const m={};const add=(bs,w)=>bs.forEach(b=>[b.aura,b.exilus,...(b.mods||[])].filter(Boolean).forEach(x=>{(m[x]=m[x]||new Set()).add(w)}));
  for(const w in D.builds)add(D.builds[w],w);for(const w in D.wbuilds)add(D.wbuilds[w],w);for(const w in D.cbuilds)add(D.cbuilds[w],w);
  return keyMods.m=Object.entries(m).map(([n,s])=>({n,s,md:MODS[n]||{}})).sort((a,b)=>b.s.size-a.s.size||a.n.localeCompare(b.n))}
function keyModsTab(){const sf=state.kmS||'all',tf=state.kmT||'all';const all=keyMods();const types=[...new Set(all.map(x=>x.md.ty).filter(Boolean))].sort();
  const list=all.filter(x=>(tf==='all'||x.md.ty===tf)&&(sf==='all'||(sf==='miss'&&!on('mod|'+x.n))||(sf==='have'&&on('mod|'+x.n))||(sf==='trade'&&x.md.tr)));
  const have=all.filter(x=>on('mod|'+x.n)).length;
  return `<p class="small muted" style="margin:0">Every mod used by the builds in this app, most-used first. Tick the ones you own; the same ticks show on every build.</p>
  <div class="row">${sel('kmt',tf,[['all','All mod types'],...types.map(t=>[t,t])],'Mod type')}${sel('kms',sf,[['all','All'],['miss','Missing'],['have','Owned'],['trade','Tradeable']],'Status')}<span class="chip gold">${have}/${all.length} owned</span></div>
  <div class="obj" data-scope="input.ck.km"><div class="obj-h"><b>${list.length} mods</b>${progHTML()}</div><ol class="steps">${list.map(x=>{const md=x.md;const k='mod|'+x.n;
    return `<li class="step${on(k)?' done':''}">${ck(k,'km')}<div><div class="lbl">${esc(x.n)} ${priceChip(x.n)} <span class="small muted">${esc(md.ty||'')} · in ${x.s.size} build${x.s.size>1?'s':''}</span></div><div class="src">${md.src?esc(md.src):md.dr&&md.dr.length?dropsList(md.dr,2):'Trade on warframe.market'}</div></div></li>`}).join('')}</ol></div>`}

/* ---------- relics: inventory planner, ducats & trading ---------- */
const RCH={i:{C:25.33,U:11,R:2},e:{C:23.33,U:13,R:4},f:{C:20,U:17,R:6},r:{C:16.67,U:20,R:10}};
const RLAB={i:'Intact',e:'Exceptional',f:'Flawless',r:'Radiant'},RCOST={i:0,e:25,f:50,r:100};
function partDu(full){const it=partOwner(full);if(it){if(full===it.n+' Blueprint')return it.bpdu||(it.parts.find(p=>p.n==='Blueprint')||{}).du||null;const p=it.parts.find(x=>x.full===full);return p&&p.du||null}return null}
function relicEV(r,ref){const R=REL[r];let pl=0,du=0;R.rw.forEach(([n,rr])=>{const c=RCH[ref][rr]/100;const p=pv(n);if(p!=null)pl+=c*p;du+=c*(partDu(n)||0)});return {pl,du}}
function relicAdvice(r){const R=REL[r];const need=R.rw.filter(([n])=>!/Forma/.test(n)&&partNeeded(n));const rareNeed=need.some(([,rr])=>rr==='R');
  const ev={};['i','r'].forEach(k=>ev[k]=relicEV(r,k));const gain=ev.r.pl-ev.i.pl;
  if(rareNeed)return {t:'Refine to Radiant',why:'It holds a rare part you still need (2% → 10%).',k:'r',need};
  if(need.length)return {t:'Crack Intact',why:'The part you need is common or uncommon, so refining barely helps.',k:'i',need};
  if(gain>8)return {t:'Radiant for plat',why:`Radiant adds about ${Math.round(gain)}p of value per run.`,k:'r',need};
  return {t:'Crack Intact',why:'Nothing you need. Farm traces or sell the drops.',k:'i',need}}
function relicsPage(){const tab=state.rlTab||'mine';
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Void relics</div><h1>Relics</h1><p class="lede">Track the relics you own, see which to refine, and decide what to sell for platinum or ducats.</p></div>
  ${segBtns('rltab',tab,[['mine','My relics'],['add','Add relics'],['ducats','Ducats & trading']])}`;
  h+=tab==='add'?relicAdd():tab==='ducats'?ducatTab():relicMine();return h+'</div>'}
function relCount(r){const x=(P.rel||{})[r]||{};return ['i','e','f','r'].reduce((a,k)=>a+(+x[k]||0),0)}
function relicMine(){const mine=Object.keys(P.rel||{}).filter(r=>REL[r]&&relCount(r)>0);const ef=state.rlE||'all',so=state.rlO||'need';
  let list=mine.filter(r=>ef==='all'||REL[r].era===ef||(ef==='need'&&relicAdvice(r).need.length));
  const val=r=>relicEV(r,'i').pl;list.sort((a,b)=>so==='name'?a.localeCompare(b):so==='plat'?val(b)-val(a):so==='count'?relCount(b)-relCount(a):(relicAdvice(b).need.length-relicAdvice(a).need.length)||val(b)-val(a));
  const tot=mine.reduce((a,r)=>a+relCount(r),0),totPl=mine.reduce((a,r)=>a+val(r)*relCount(r),0),withNeed=mine.filter(r=>relicAdvice(r).need.length).length;
  let h=`<div class="tiles"><div class="tile cut"><span class="k">Relics</span><span class="v num">${fmt(tot)}</span><span class="x">${mine.length} kinds</span></div><div class="tile cut"><span class="k">Hold parts you need</span><span class="v num">${withNeed}</span></div><div class="tile cut"><span class="k">Expected value</span><span class="v num">${fmt(totPl)}p</span><span class="x">cracking all Intact</span></div>
   <div class="tile cut"><span class="k">Void traces</span><span class="v"><input type="number" min="0" inputmode="numeric" data-ptr="traces" value="${+P.traces||''}" placeholder="0" style="width:100px" aria-label="Void traces"></span><span class="x">Radiant costs 100</span></div></div>`;
  if(!mine.length)return h+`<div class="empty panel">No relics yet. Use <button class="btn sm" data-rltab="add">Add relics</button> to enter what's in your inventory.</div>`;
  h+=`<div class="row">${sel('rle',ef,[['all','All eras'],['need','Has parts I need'],['Lith','Lith'],['Meso','Meso'],['Neo','Neo'],['Axi','Axi'],['Requiem','Requiem']],'Era')}${sel('rlo',so,[['need','Sort: parts I need'],['plat','Sort: plat value'],['count','Sort: how many'],['name','Sort: name']],'Sort')}</div>
  ${countLine(list.length,mine.length,'relic kinds',ef!=='all','rlclear')}<div class="cards">${list.map(r=>{const R=REL[r];const a=relicAdvice(r);const x=P.rel[r];
    return `<div class="card cut"><div class="top"><a class="nm ln" href="#" data-go="relic|${esc(r)}">${esc(r)}</a>${R.v?'<span class="chip bad">Vaulted</span>':''}<span class="chip ${a.k==='r'?'gold':'teal'}">${a.t}</span></div>
    <div class="small muted">${esc(a.why)}</div>
    <div class="relrf">${['i','e','f','r'].map(k=>`<label class="small">${RLAB[k]}<span class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn sm" data-reld="${esc(r)}|${k}|-1" aria-label="One fewer ${RLAB[k]}">−</button><input type="number" min="0" inputmode="numeric" data-rel="${esc(r)}|${k}" value="${+x[k]||''}" placeholder="0" style="width:56px"><button class="btn sm" data-reld="${esc(r)}|${k}|1" aria-label="One more ${RLAB[k]}">+</button></span></label>`).join('')}</div>
    <ul class="rw">${R.rw.map(([n,rr])=>{const nd=!/Forma/.test(n)&&partNeeded(n);const du=partDu(n);return `<li><span class="dot rar-${rr}"></span><span class="rar-${rr}">${L(n)}</span>${nd?' <span class="chip warn">need</span>':''}${partGoal(n)?' <span class="chip gold">goal</span>':''} <span class="muted small">${pv(n)!=null?Math.round(pv(n))+'p':''}${du?' · '+du+'d':''}</span></li>`}).join('')}</ul>
    <div class="small muted">Value per run: Intact ${Math.round(relicEV(r,'i').pl)}p · Radiant ${Math.round(relicEV(r,'r').pl)}p</div></div>`}).join('')}</div>`;
  return h}
function relicAdd(){const q=(state.raQ||'').toLowerCase().trim(),ef=state.raE||'all';
  let list=Object.keys(REL).filter(r=>(!q||r.toLowerCase().includes(q))&&(ef==='all'||REL[r].era===ef||(ef==='open'&&!REL[r].v)||(ef==='need'&&REL[r].rw.some(([n])=>!/Forma/.test(n)&&partNeeded(n)&&partGoal(n)))));
  list.sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
  return `<p class="small muted" style="margin:0">Search a relic and tap + for each one you own. Most players type the era and letter, like “neo s”. Refined relics can be set on the My relics tab.</p>
  <div class="row"><input id="raq" type="search" placeholder="Lith A1, Neo S10…" value="${esc(state.raQ||'')}" style="flex:1 1 160px" aria-label="Find a relic">${sel('rae',ef,[['all','All relics'],['open','Farmable now'],['need','Drops a goal part'],['Lith','Lith'],['Meso','Meso'],['Neo','Neo'],['Axi','Axi'],['Requiem','Requiem']],'Relic filter')}</div>
  <div class="addl">${list.slice(0,150).map(r=>{const c=+(((P.rel||{})[r]||{}).i)||0;const R=REL[r];const rare=R.rw.find(x=>x[1]==='R');
    return `<div class="arow"><div style="min-width:0"><b>${esc(r)}</b> ${R.v?'<span class="small muted">vaulted</span>':''}<div class="small muted ell">Rare: ${rare?esc(rare[0]):'—'}</div></div><div class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn sm" data-reld="${esc(r)}|i|-1" aria-label="Remove one ${esc(r)}">−</button><span class="mono" style="min-width:24px;text-align:center">${c}</span><button class="btn sm primary" data-reld="${esc(r)}|i|1" aria-label="Add one ${esc(r)}">+</button></div></div>`}).join('')}${list.length>150?`<div class="small muted">Showing 150 of ${list.length}. Search to narrow it down.</div>`:''}</div>`}
function allParts(){if(allParts.m)return allParts.m;const out=[];for(const n in D.partrel){const du=partDu(n);out.push({n,du,p:pv(n),it:partOwner(n)||I[n.replace(/ Blueprint$/,'')]})}return allParts.m=out}
function ducatTab(){const so=state.duO||'ratio',f=state.duF||'all',q=(state.duQ||'').toLowerCase();const dup=P.dup||{};
  let list=allParts().filter(x=>x.du&&(!q||x.n.toLowerCase().includes(q))).map(x=>({...x,r:x.p?x.du/x.p:null,c:+dup[x.n]||0}));
  list=list.filter(x=>f==='all'||(f==='mine'&&x.c>0)||(f==='baro'&&x.r!=null&&x.r>=10)||(f==='plat'&&x.p!=null&&x.p>=8)||(f==='junk'&&x.p!=null&&x.p<=4));
  list.sort((a,b)=>so==='plat'?((b.p??-1)-(a.p??-1)):so==='du'?b.du-a.du:so==='name'?a.n.localeCompare(b.n):so==='mine'?b.c-a.c:((b.r??-1)-(a.r??-1)));
  const mine=allParts().filter(x=>(+dup[x.n]||0)>0);const sumP=mine.reduce((a,x)=>a+(x.p||0)*(+dup[x.n]),0),sumD=mine.reduce((a,x)=>a+(x.du||0)*(+dup[x.n]),0);
  const vt=WS&&WS.voidTrader;const now=new Date();const act=vt&&new Date(vt.activation)<=now&&now<new Date(vt.expiry);
  if(HOSTED&&!WS&&!WSerr)loadWS();
  return `<div class="tiles"><div class="tile cut"><span class="k">Spare parts</span><span class="v num">${fmt(mine.reduce((a,x)=>a+(+dup[x.n]),0))}</span></div><div class="tile cut"><span class="k">Worth in plat</span><span class="v num">${fmt(sumP)}p</span><span class="x">7-day averages</span></div><div class="tile cut"><span class="k">Worth in ducats</span><span class="v num">${fmt(sumD)}</span></div>
   <div class="tile cut"><span class="k">Baro Ki'Teer</span><span class="v" style="font-size:16px">${vt?(act?'Here now':'Away'):'—'}</span><span class="x">${vt?(act?(untilIso(vt.expiry)?'leaves in '+untilIso(vt.expiry):'leaving now')+' · '+esc(vt.location||''):(untilIso(vt.activation)?'arrives in '+untilIso(vt.activation):'arriving now')):!HOSTED?'live on the hosted site':WSerr?'live data unavailable':'checking…'}</span></div></div>
  <div class="panel cut small stack" style="gap:4px"><b>Rule of thumb</b><span>Sell to players when a part is worth 8p or more. Give it to Baro when it's worth 10 or more ducats per platinum, so a 45-ducat part selling for 3p goes to Baro.</span><span class="muted">Ducat kiosks are in every relay. Prices are a ${esc(D.meta.prices)} snapshot${HOSTED?' refreshed daily':''}.</span></div>
  <div class="row"><input id="duq" type="search" placeholder="Find a prime part" value="${esc(state.duQ||'')}" style="flex:1 1 160px" aria-label="Find a prime part">${sel('duf',f,[['all','All prime parts'],['mine','My spares'],['baro','Best for ducats'],['plat','Worth selling (8p+)'],['junk','Cheap (≤4p)']],'Filter')}${sel('duo',so,[['ratio','Sort: ducats per plat'],['plat','Sort: plat'],['du','Sort: ducats'],['mine','Sort: my spares'],['name','Sort: name']],'Sort')}</div>
  <div class="dtbl"><div class="h">Part</div><div class="h c">Plat</div><div class="h c">Ducats</div><div class="h c">Spares</div>${list.slice(0,250).map(x=>`<div class="ell">${L(x.n)} ${x.r!=null&&x.r>=10?'<span class="chip warn">Baro</span>':x.p!=null&&x.p>=8?'<span class="chip ok">Sell</span>':''}</div><div class="c mono">${x.p!=null?Math.round(x.p):'—'}</div><div class="c mono">${x.du}</div><div class="c"><input type="number" min="0" inputmode="numeric" data-dup="${esc(x.n)}" value="${x.c||''}" placeholder="0" style="width:60px" aria-label="Spare ${esc(x.n)}"></div>`).join('')}</div>
  ${act&&vt.inventory&&vt.inventory.length?`<details class="obj grp" open><summary><h3>Baro's stock</h3><span class="chip">${vt.inventory.length}</span></summary><div class="dtbl" style="padding:8px 14px"><div class="h">Item</div><div class="h c">Ducats</div><div class="h c">Credits</div><div class="h c"></div>${vt.inventory.map(i=>`<div>${L(i.item)}</div><div class="c mono">${fmt(i.ducats)}</div><div class="c mono">${fmt(i.credits)}</div><div></div>`).join('')}</div></details>`:''}`}

/* ---------- fishing & mining ---------- */
function world(){const tab=state.wTab||'fish';
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Open worlds</div><h1>Open worlds</h1><p class="lede">Where and when each fish bites, which spear and bait to bring, and the best mining spots in every open world.</p></div>
  ${segBtns('wtab',tab,[['fish','Fishing'],['mine','Mining']])}`;
  h+=tab==='mine'?mineTab():fishTab();return h+'</div>'}
function fishTab(){const rg=state.fR||'Plains of Eidolon',rr=state.fRr||'all',tm=state.fT||'all';const regs=Object.keys(D.fishreg);const R=D.fishreg[rg]||{};
  const times=[...new Set(D.fish.filter(f=>f.reg===rg).map(f=>f.time))].filter(Boolean).sort();
  const list=D.fish.filter(f=>f.reg===rg&&(rr==='all'||f.r===rr||(rr==='todo'&&!on('fish|'+f.n)))&&(tm==='all'||f.time===tm));
  let cyc='';if(WS){const c=rg==='Plains of Eidolon'?WS.cetusCycle:rg==='Orb Vallis'?WS.vallisCycle:WS.cambionCycle;if(c)cyc=`<span class="chip teal">Now: ${esc(c.state||c.active||'')}${c.timeLeft?' · '+esc(c.timeLeft):''}</span>`}else if(HOSTED&&!WSerr)loadWS();
  return `${segBtns('freg',rg,regs.map(r=>[r,r]))}
  <div class="panel cut stack" style="gap:6px"><div class="row" style="justify-content:space-between"><b>${esc(rg)}</b>${cyc}</div><div class="small"><b>Spears:</b> ${esc(R.sp)}</div><div class="small"><b>Vendor:</b> ${esc(R.v)}. ${esc(R.use)}</div><ul class="small" style="margin:0;padding-left:18px">${(R.tips||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>
  <div class="row">${sel('frr',rr,[['all','All rarities'],['todo','Not caught yet'],['Common','Common'],['Uncommon','Uncommon'],['Rare','Rare'],['Legendary','Legendary']],'Rarity')}${sel('ftm',tm,[['all','Any time'],...times.map(t=>[t,t])],'Time')}</div>
  <div class="obj" data-scope="input.ck.fi"><div class="obj-h"><b>${list.length} fish</b> <span class="small muted">tick once caught</span>${progHTML()}</div><ol class="steps">${list.map(f=>{const k='fish|'+f.n;
    return `<li class="step${on(k)?' done':''}">${ck(k,'fi')}<div><div class="lbl">${esc(f.n)} <span class="chip ${f.r==='Rare'||f.r==='Legendary'?'gold':''}">${esc(f.r)}</span> ${taskBtn('fish',f.n,'Catch '+f.n)}</div><div class="src"><b>${esc(f.bio)}</b> · ${esc(f.time)} · spear: ${esc(f.sp||'any')}${f.bait?` · bait: <b>${esc(f.bait)}</b>`:''}${f.spots&&f.spots.length?` · spot: ${f.spots.map(esc).join(', ')}`:''}${f.dr.length?`<br><span class="muted">Gives ${f.dr.map(d=>L(d)).join(', ')}</span>`:''}</div></div></li>`}).join('')}</ol></div>`}
function mineTab(){const M2=D.mine;const rg=state.mR||'Plains of Eidolon';const R=M2.reg[rg];
  const rowF=(arr,kind)=>arr.map(([n,r])=>{const k='ore|'+n;return `<li class="step${on(k)?' done':''}">${ck(k,'mi')}<div><div class="lbl">${L(n)} <span class="chip ${r==='Rare'||r==='Special'?'gold':''}">${r}</span> <span class="small muted">${kind}</span> ${taskBtn('ore',n,'Mine '+n)}</div></div></li>`}).join('');
  return `${segBtns('mreg',rg,Object.keys(M2.reg).map(r=>[r,r]))}
  <div class="panel cut stack" style="gap:6px"><b>Best spots in ${esc(rg)}</b><ul class="small" style="margin:0;padding-left:18px">${R.spots.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="small muted">${esc(R.v)}</div></div>
  <div class="obj" data-scope="input.ck.mi"><div class="obj-h"><b>Ores and gems</b> <span class="small muted">tick once mined</span>${progHTML()}</div><ol class="steps">${rowF(R.ore,'ore · red vein')}${rowF(R.gem,'gem · blue vein')}</ol></div>
  <details class="obj grp" open><summary><h3>Cutters</h3></summary><ol class="steps">${M2.cut.map(([n,w,d])=>{const k='cut|'+n;return `<li class="step${on(k)?' done':''}">${ck(k)}<div><div class="lbl">${esc(n)}</div><div class="src">${esc(w)} · ${esc(d)}</div></div></li>`}).join('')}</ol></details>
  <div class="panel cut"><ul class="small" style="margin:0;padding-left:18px">${M2.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`}

/* ---------- junction tasks ---------- */
function juncTasks(){const order=['Venus','Mercury','Mars','Phobos','Ceres','Jupiter','Europa','Saturn','Uranus','Neptune','Pluto','Eris','Sedna'];
  return `<details class="obj grp" data-scope="input.ck.jt,input.ck.jx"><summary><h3>Junction tasks</h3>${progHTML()}</summary><div class="small muted" style="padding:10px 14px 0">Each junction unlocks once its tasks are done. Tick tasks as you go; beating the Specter marks the junction.</div>
  ${order.filter(p=>D.junc[p]).map(p=>{const j=D.junc[p];const node=ALLN.find(n=>isJ(n)&&n.n===p+' Junction');const k=node?'n|'+node.id:'';
    const done=j.tasks.filter((t,i)=>on('jt|'+p+'|'+i)).length;
    return `<details class="jt"><summary><span>${orb(j.from,18)} <b>${esc(j.from)} → ${esc(p)}</b> <span class="small muted">${esc(j.spec)}</span></span><span class="chip ${k&&on(k)?'ok':''}">${k&&on(k)?'Done':done+'/'+j.tasks.length}</span></summary><ol class="steps">
    ${j.tasks.map((t,i)=>{const last=/^Complete the Junction$/i.test(t.t);const kk=last&&k?k:'jt|'+p+'|'+i;return `<li class="step${on(kk)?' done':''}">${ck(kk,last?'jn jx':'jt')}<div><div class="lbl">${last?'Beat the '+esc(j.spec):esc(t.t)}</div><div class="src">${t.h?esc(t.h)+'<br>':''}${t.r.length?'<span class="muted">Reward: '+t.r.map(r=>{const m=r.replace(/ Blueprint$/,'');return esc(r)+(MIX[m]?' '+mxChip(m):'')}).join(', ')+'</span>':''}</div></div></li>`}).join('')}</ol></details>`}).join('')}</details>`}

/* ---------- friends & clan ---------- */
function summarize(raw){const j=raw.Results&&raw.Results[0]?raw.Results[0]:raw;const xpi=(j.LoadOutInventory&&j.LoadOutInventory.XPInfo)||findKey(j,'XPInfo',0)||[];const mis=j.Missions||[];const sk=j.PlayerSkills||{};
  const cat={};let gear=0,maxed=0;for(const e of xpi){const n=U[e.ItemType];if(!n)continue;const it=I[n];const k=perRank(it)===200?1000:500;const r=Math.min(maxRank(it),Math.floor(Math.sqrt((e.XP||0)/k)));const x=r*perRank(it);gear+=x;cat[it.c]=(cat[it.c]||0)+x;if(r>=maxRank(it))maxed++}
  let ch=0,sp=0,nodes=0,spn=0;for(const m of mis){const nd=NX[m.Tag];if(!nd)continue;if(m.Completes>0){ch+=nd.x;nodes++}if(m.Tier===1){sp+=nd.x;spn++}}
  let intr=0;for(const s in sk)if(/^LPS_/.test(s)&&typeof sk[s]==='number')intr+=sk[s]*1500;
  const syn=(j.Affiliations||[]).map(a=>({n:SYN[a.Tag]||pretty(a.Tag),t:a.Title||0})).sort((a,b)=>b.t-a.t).slice(0,3);
  return {name:j.DisplayName||j.displayName||'Tenno',mr:j.PlayerLevel??null,gear,maxed,ch,sp,nodes,spn,intr,total:gear+ch+sp+intr,cat,syn,at:new Date().toISOString()}}
function friendsTab(){const F=P.friends||[];const t=totalXP();const me={name:'You',mr:mrInfo(t.total).mr,total:t.total,gear:t.it,maxed:MI.filter(i=>itemXP(i.n)>=mxp(i)).length,nodes:ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,spn:ALLN.filter(n=>!isJ(n)&&on('sp|'+n.id)).length,intr:t.intr,cat:Object.fromEntries(CATS.map(c=>[c,catXP(c)]))};
  const all=[me,...F];const best=k=>Math.max(...all.map(x=>+x[k]||0));
  const row=(lab,k,f)=>`<div class="fl">${lab}</div>${all.map(x=>`<div class="c mono${(+x[k]||0)===best(k)&&best(k)>0?' top':''}">${f?f(x[k]):fmt(x[k])}</div>`).join('')}`;
  return `<div class="panel stack cut"><h2>Friends & clan</h2><p class="small muted" style="margin:0">Compare yourself with friends or clanmates. Paste their profile page (from the same link you use for yourself) or their 24-character ID${HOSTED&&window.TENNO_PROXY?'':'. IDs only load automatically on the hosted site with the sync relay set up'}.</p>
  <textarea id="frin" placeholder="Paste a profile page or an account ID"></textarea><div class="row"><button class="btn primary" id="fradd">Add to comparison</button></div><div class="small muted" id="frmsg"></div></div>
  ${F.length?`<div class="panel cut" style="overflow-x:auto"><div class="ftbl" style="grid-template-columns:minmax(120px,1fr) repeat(${all.length},minmax(80px,auto))"><div class="h"></div>${all.map((x,i)=>`<div class="h c">${esc(x.name)}${i?`<br><button class="btn sm" data-frdel="${i-1}" aria-label="Remove ${esc(x.name)}">Remove</button>`:''}</div>`).join('')}
   ${row('Mastery rank','mr',v=>v==null?'—':mrLabel(v))}${row('Total XP','total')}${row('Gear XP','gear')}${row('Items mastered','maxed')}${row('Nodes','nodes')}${row('Steel Path nodes','spn')}${row('Intrinsics XP','intr')}
   ${CATS.filter(c=>all.some(x=>x.cat&&x.cat[c])).map(c=>`<div class="fl small muted">${esc(c)}</div>${all.map(x=>`<div class="c mono small">${fmt(x.cat&&x.cat[c])}</div>`).join('')}`).join('')}</div>
   <div class="small muted" style="margin-top:8px">Friends' data is a snapshot from when you added them${F[0].at?' (oldest '+fdate(F.reduce((a,x)=>x.at<a?x.at:a,F[0].at))+')':''}. Add them again to refresh.</div></div>`:''}`}
async function addFriend(txt){txt=String(txt||'').trim();const msg=m=>{const el=$('#frmsg');if(el)el.textContent=m;toast(m)};if(!txt)return;
  let raw=null;try{raw=JSON.parse(txt)}catch(e){}
  if(!raw){const id=findId(txt);if(!id)return msg('Paste a profile page or a 24-character ID.');
    try{let j=null;if(window.TENNO_PROXY){j=await netJSON('relay',window.TENNO_PROXY+'?playerId='+id);if(!(j&&j.Results))j=null}
      if(!j){j=fromParsed(await netJSON('relay','https://api.warframestat.us/profile/'+id+'/?language=en'))}
      if(!j)throw 0;raw=j}catch(e){if(e instanceof NetErr&&e.kind!=='network'&&e.kind!=='http')return msg(e.message);return msg('Couldn\'t load that ID from here. Open https://api.warframe.com/cdn/getProfileViewingData.php?playerId='+id+' and paste the page instead.')}}
  const s=summarize(raw);if(!s.total)return msg('No ranks found in that data.');P.friends=(P.friends||[]).filter(f=>f.name!==s.name);P.friends.push(s);saveProfile();render();toast('Added '+s.name)}

/* ---------- v9 events ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-atab],[data-wbi],[data-rltab],[data-wtab],[data-freg],[data-mreg],[data-reld],[data-arcd],[data-frdel],#fradd');if(!t)return;
  if(t.dataset.atab){state.aTab=t.dataset.atab;saveUI();render();return}
  if(t.dataset.wbi!==undefined){state.wbI=+t.dataset.wbi;rerender();return}
  if(t.dataset.rltab){state.rlTab=t.dataset.rltab;saveUI();if(location.hash!=='#relics')location.hash='relics';else render();return}
  if(t.dataset.wtab){state.wTab=t.dataset.wtab;saveUI();render();return}
  if(t.dataset.freg){state.fR=t.dataset.freg;state.fT='all';saveUI();rerender();return}
  if(t.dataset.mreg){state.mR=t.dataset.mreg;saveUI();rerender();return}
  if(t.dataset.reld){const [r,k,d]=t.dataset.reld.split('|');P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,(+x[k]||0)+(+d));if(!relCount(r))delete P.rel[r];saveProfile();rerender();return}
  if(t.dataset.arcd){const [n,d]=t.dataset.arcd.split('|');P.arc=P.arc||{};P.arc[n]=Math.max(0,(+P.arc[n]||0)+(+d));if(!P.arc[n])delete P.arc[n];saveProfile();rerender();return}
  if(t.dataset.frdel!==undefined){P.friends.splice(+t.dataset.frdel,1);saveProfile();rerender();return}
  if(t.id==='fradd'){addFriend($('#frin').value);return}});
document.addEventListener('change',e=>{const t=e.target;const S3={wbc:'wbC',wbo:'wbO',lf:'lF',ls:'lS',art:'arT',ars:'arS',aro:'arO',kmt:'kmT',kms:'kmS',rle:'rlE',rlo:'rlO',rae:'raE',duf:'duF',duo:'duO',frr:'fRr',ftm:'fT'};
  if(S3[t.id]){state[S3[t.id]]=t.value;saveUI();rerender();return}
  if(t.id==='wbsel'){state[state.aTab==='comp'?'cbSel':'wbSel']=t.value;state.wbI=0;saveUI();render();return}
  if(t.dataset.lel!==undefined||t.dataset.lb!==undefined){const n=t.dataset.lel||t.dataset.lb;P.lich=P.lich||{};const v=P.lich[n]=P.lich[n]||{};if(t.dataset.lel!==undefined)v.e=t.value;else v.b=Math.max(0,Math.min(60,+t.value||0));if(v.e||v.b){if(!on('lich|'+n))setK('lich|'+n,1)}saveProfile();rerender();return}
  if(t.dataset.arc){P.arc=P.arc||{};const v=Math.max(0,+t.value||0);if(v)P.arc[t.dataset.arc]=v;else delete P.arc[t.dataset.arc];saveProfile();rerender();return}
  if(t.dataset.rel){const [r,k]=t.dataset.rel.split('|');P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,+t.value||0);if(!relCount(r))delete P.rel[r];saveProfile();rerender();return}
  if(t.dataset.dup){P.dup=P.dup||{};const v=Math.max(0,+t.value||0);if(v)P.dup[t.dataset.dup]=v;else delete P.dup[t.dataset.dup];saveProfile();rerender();return}
  if(t.dataset.ptr){P[t.dataset.ptr]=Math.max(0,+t.value||0);saveProfile();return}});

/* ---------- v11: mastery everywhere, tasks, friends & messages ---------- */
const MIX={};MI.forEach(i=>MIX[i.n]=i);
function mxChip(n){const it=MIX[n];if(!it)return'';const tot=mxp(it),left=tot-itemXP(n);
  return left<=0?`<span class="chip mxc done" title="Mastery XP earned">${ic('check')}${fmt(tot)} MR XP</span>`:`<span class="chip mxc" title="Mastery XP still to earn">+${fmt(left)} MR XP</span>`}
function inGameBase(){const g=[];if(P.gxp)g.push({x:+P.gxp,src:'your in-game total'});const mr=P.prof&&P.prof.mr;if(mr!=null&&(P.at||P.gmr!=null))g.push({x:mrNeed(mr),src:'MR '+mrLabel(mr)+' in game'});return g.sort((a,b)=>b.x-a.x)[0]||null}

/* ---- tasks ---- */
const TK={res:'Farm',item:'Build',relic:'Crack',quest:'Do quest',mod:'Get',arc:'Get',node:'Clear',synd:'Rank up',fish:'Catch',ore:'Mine',lich:'Get',note:''};
function taskBtn(k,r,label){const has=(P.tasks||[]).some(x=>!x.d&&x.k===k&&x.r===r);
  return `<button class="btn sm tb${has?' on':''}" data-addtask="${esc(k+'|'+r)}" data-tlabel="${esc(label||'')}" title="${has?'Already in your tasks':'Add to your tasks'}">${has?ic('check')+'In tasks':ic('plus')+'Task'}</button>`}
function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function addTask(k,r,t,extra){P.tasks=P.tasks||[];if(k!=='note'&&P.tasks.some(x=>!x.d&&x.k===k&&x.r===r)){toast('Already in your tasks');return null}
  const task={id:newId(),t:t||((TK[k]?TK[k]+' ':'')+r),k,r,d:0,at:Date.now(),...(extra||{})};P.tasks.unshift(task);saveProfile();return task}
function taskGo(x){if(x.k==='quest')return `href="#quests" data-q="${esc(x.r)}"`;if(x.k==='node')return `href="#missions" data-scp="${esc(x.r)}"`;if(x.k==='synd')return 'href="#synd"';
  if(x.k==='fish'||x.k==='ore')return 'href="#world"';if(x.k==='animal')return `href="#" data-go="ow|${esc(x.r)}"`;if(x.k==='lich')return `href="#" data-go="item|${esc(x.r)}"`;if(['res','item','relic','mod','arc','guide','way'].includes(x.k))return `href="#" data-go="${esc(x.k+'|'+x.r)}"`;return ''}
function taskRow(x,compact){const go=taskGo(x);
  return `<div class="trow${x.d?' done':''}"><input type="checkbox" class="ck sm" data-tdone="${esc(x.id)}" ${x.d?'checked':''} aria-label="Done"><div class="tmain">${go?`<a class="ln" ${go}>${esc(x.t)}</a>`:`<span>${esc(x.t)}</span>`}${taskMeta(x)}
   ${(x.with||[]).length?`<div class="small muted">with ${x.with.map(w=>esc(w.name)).join(', ')}</div>`:''}${x.from?`<div class="small muted">from ${esc(x.from.name)}</div>`:''}</div>
   <div class="tact"><button type="button" class="btn sm" data-tedit="${esc(x.id)}" aria-expanded="${state.tEdit===x.id}" aria-label="Notes, repeat and due date" title="Notes, repeat and due date">${ic('more')}</button>${SO.uid&&!x.d?`<button class="btn sm" data-tshare="${esc(x.id)}" title="Invite a friend">Invite</button>`:''}${compact?'':`<button class="btn sm" data-tdel="${esc(x.id)}" aria-label="Delete task">${ic('close')}</button>`}</div></div>
   ${state.tShare===x.id?shareBox(x):''}${state.tEdit===x.id?taskEditor(x):''}`}
function shareBox(x){const fr=SO.friends.filter(f=>!f.pending);
  return `<div class="sharebox">${fr.length?`<span class="small">Invite to <b>${esc(x.t)}</b>:</span><div class="row">${fr.map(f=>`<button class="btn sm${(x.with||[]).some(w=>w.uid===f.uid)?' on':''}" data-tinvite="${esc(x.id+'|'+f.uid)}">${esc(f.name||'Friend')}</button>`).join('')}</div>`:`<span class="small muted">Add friends on the <a class="ln" href="#friends">Friends</a> page first.</span>`}</div>`}
function taskPanel(){taskResets();const open=(P.tasks||[]).filter(x=>!x.d);
  return `<section class="panel cut stack tpanel" style="gap:8px"><div class="row" style="justify-content:space-between"><h2>My tasks</h2><a class="small ln" href="#tasks">All tasks</a></div>
   <div class="row" style="flex-wrap:nowrap"><input id="tnew" type="text" placeholder="Add something you want to do" maxlength="120" aria-label="New task"><button class="btn primary" id="taddb">Add</button></div>
   <div class="tlist">${open.slice(0,8).map(x=>taskRow(x,1)).join('')||'<div class="small muted">Nothing yet. Type above, or tap <b>+ Task</b> on any resource, item, relic, quest or syndicate.</div>'}${open.length>8?`<a class="small ln" href="#tasks">${open.length-8} more</a>`:''}</div></section>`}
function tasks(){taskResets();const f=state.tkF||'open',so=state.tkS||'new';let L2=(P.tasks||[]).slice();
  L2=L2.filter(x=>f==='all'||(f==='open'&&!x.d)||(f==='done'&&x.d)||(f==='shared'&&((x.with||[]).length||x.from))||(f===x.k));
  L2.sort((a,b)=>so==='due'?((a.due||'9999')<(b.due||'9999')?-1:(a.due||'9999')>(b.due||'9999')?1:b.at-a.at):so==='old'?a.at-b.at:so==='kind'?(a.k||'').localeCompare(b.k||'')||b.at-a.at:b.at-a.at);
  const all=P.tasks||[];const dn=all.filter(x=>x.d).length;
  return `<div class="stack"><div class="head"><div class="eyebrow">Checklist</div><h1>Tasks</h1><p class="lede">${TRK} Your own to-do list. Add anything, or tap <b>+ Task</b> on a resource, item, relic, quest, mod, syndicate, fish or ore anywhere in the app. Invite friends to join you.</p></div>
  <div class="row" style="flex-wrap:nowrap"><input id="tnew" type="text" placeholder="Add something you want to do" maxlength="120" aria-label="New task"><button class="btn primary" id="taddb">Add</button></div>
  <div class="row">${sel('tkf',f,[['open','To do'],['done','Done'],['shared','Shared with friends'],['all','All'],['res','Resources'],['item','Builds'],['relic','Relics'],['quest','Quests'],['synd','Syndicates'],['note','My notes']],'Filter tasks')}${sel('tks',so,[['new','Newest first'],['due','By due date'],['old','Oldest first'],['kind','By type']],'Sort tasks')}<span class="chip gold">${all.length-dn} to do · ${dn} done</span>${dn?'<button class="btn sm" id="tclear">Clear done</button>':''}</div>
  <div class="panel cut tlist">${L2.map(x=>taskRow(x,0)).join('')||`<div class="empty stack" style="gap:8px;text-align:left"><b>${f==='open'?'No tasks yet.':'Nothing matches this filter.'}</b><span class="small">Type above and press Enter, or add tasks from anywhere in Tennoform. For example: open <a class="ln" href="#goals">Goals</a>, find a material you're short on in the shopping list, and tap <b>+ Task</b>. Quests, relics, syndicates, resources and fish have the same button.</span>${f!=='open'?'<button type="button" class="btn sm" data-tkreset style="align-self:flex-start">Show my to-do tasks</button>':''}</div>`}</div></div>`}
async function toggleTask(id,v){const x=(P.tasks||[]).find(t=>t.id===id);if(!x)return;x.d=v?1:0;x.dat=v?Date.now():0;saveProfile();
  if(v&&SO.uid&&x.g){gpost(x.g,{type:'taskdone',task:{id:x.src?x.src.id:x.id,t:x.t}}).catch(()=>{})}else if(v&&SO.uid){for(const w of x.with||[])sendMsg(w.uid,{type:'taskdone',task:{id:x.src?x.src.id:x.id,t:x.t}},false).catch(()=>{});if(x.from)sendMsg(x.from.uid,{type:'taskdone',task:{id:x.src?x.src.id:x.id,t:x.t}},false).catch(()=>{})}}

/* ---- friends & messages (Firebase) ---- */
const SO={uid:null,code:'',friends:[],inbox:[],pub:{},unsub:[],ready:false,groups:[],gm:{},gun:{}};
const CODE_AB='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function myName(){return String(P.tname||(P.prof&&P.prof.name)||(acct&&acct.name)||(acct&&acct.email||'').split('@')[0]||'Tenno').slice(0,40)}
function socialStop(){SO.unsub.forEach(f=>{try{f()}catch(e){}});Object.values(SO.gun).forEach(f=>{try{f()}catch(e){}});Object.assign(SO,{uid:null,code:'',friends:[],inbox:[],pub:{},unsub:[],ready:false,groups:[],gm:{},gun:{}});badge()}
async function socialInit(uid){socialStop();if(!FB)return;SO.uid=uid;const fs=FB.fs;liveSync(uid);FBK.tried=false;FBK.admin=false;setTimeout(liveRender,0);
  try{const ps=await fs.collection('public').doc(uid).get();const pd=ps.exists?ps.data():null;SO.code=pd&&pd.code||'';
    if(!SO.code){for(let i=0;i<6&&!SO.code;i++){const c=Array.from({length:6},()=>CODE_AB[Math.floor(Math.random()*CODE_AB.length)]).join('');try{await fs.collection('codes').doc(c).set({uid});SO.code=c}catch(e){}}}
    await publishPublic()}catch(e){}
  SO.unsub.push(fs.collection('users').doc(uid).collection('friends').onSnapshot(s=>{SO.friends=s.docs.map(d=>({uid:d.id,...d.data()}));loadFriendCards();socialRender()},()=>{}));
  SO.unsub.push(fs.collection('groups').where('members','array-contains',uid).onSnapshot(s=>{SO.groups=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.at||0)-(a.at||0));syncGroupListeners();socialRender()},()=>{}));
  SO.unsub.push(fs.collection('inbox').doc(uid).collection('msgs').orderBy('at','desc').limit(400).onSnapshot(s=>{SO.inbox=s.docs.map(d=>({id:d.id,...d.data()}));SO.ready=true;processInbox();socialRender()},()=>{}))}
let pubT=null;
function publishPublic(){if(!SO.uid||!FB)return Promise.resolve();const t=totalXP();const cats={};CATS.forEach(c=>{const x=catXP(c);if(x)cats[c]=x});
  const d={name:myName(),code:SO.code||'',mr:mrInfo(t.total).mr,xp:t.total,nodes:ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,sp:ALLN.filter(n=>!isJ(n)&&on('sp|'+n.id)).length,maxed:MI.filter(i=>itemXP(i.n)>=mxp(i)).length,cats,at:Date.now()};
  return FB.fs.collection('public').doc(SO.uid).set(d).catch(()=>{})}
function schedulePublic(){if(!SO.uid)return;clearTimeout(pubT);pubT=setTimeout(publishPublic,15000)}
async function loadFriendCards(){if(!FB)return;for(const f of SO.friends){if(SO.pub[f.uid]&&Date.now()-SO.pub[f.uid]._t<300000)continue;try{const d=await FB.fs.collection('public').doc(f.uid).get();SO.pub[f.uid]={...(d.exists?d.data():{}),_t:Date.now()}}catch(e){}}socialRender()}
function sendMsg(to,body,copy){if(!SO.uid)return Promise.reject();const fs=FB.fs;const at=Date.now();const m={from:SO.uid,fromName:myName(),at,...body};
  const ps=[fs.collection('inbox').doc(to).collection('msgs').add(m)];
  if(copy!==false){const c={from:SO.uid,to,type:'sent',at,text:body.text||''};if(body.task)c.task=body.task;ps.push(fs.collection('inbox').doc(SO.uid).collection('msgs').add(c))}
  return Promise.all(ps)}
function processInbox(){const fs=FB.fs;
  for(const m of SO.inbox){
    if(m.type==='accept'&&SO.friends.some(f=>f.uid===m.from&&f.pending)){fs.collection('users').doc(SO.uid).collection('friends').doc(m.from).set({name:m.fromName||'Friend',code:m.code||'',at:Date.now()}).then(()=>fs.collection('inbox').doc(SO.uid).collection('msgs').doc(m.id).delete()).catch(()=>{});toast((m.fromName||'A friend')+' accepted your friend request')}
    if(m.type==='taskok'&&!m.ans){const x=(P.tasks||[]).find(t=>t.id===(m.task&&m.task.id));if(x){x.with=x.with||[];if(!x.with.some(w=>w.uid===m.from))x.with.push({uid:m.from,name:m.fromName||'Friend'});saveProfile()}
      fs.collection('inbox').doc(SO.uid).collection('msgs').doc(m.id).update({ans:'seen'}).catch(()=>{})}}}
function unread(){const lr=lsGet('tf-read',{});let n=0;const per={};for(const g of SO.groups){const c=(SO.gm[g.id]||[]).filter(m=>m.from!==SO.uid&&m.at>(lr['g:'+g.id]||0)).length;if(c){n+=c;per['g:'+g.id]=c}}for(const m of SO.inbox){if(m.type==='sent'||m.type==='accept')continue;if(m.type==='friend'){n++;continue}if(m.at>(lr[m.from]||0)){n++;per[m.from]=(per[m.from]||0)+1}}return {n,per}}
function badge(){const u=SO.uid?unread().n:0;document.querySelectorAll('.nbadge').forEach(e=>e.remove());if(!u)return;
  document.querySelectorAll('a[href="#friends"],#hamb,#menu').forEach(a=>{const b=document.createElement('span');b.className='nbadge';b.textContent=u>9?'9+':u;a.appendChild(b)})}
function socialRender(){badge();if(location.hash==='#friends'&&!(document.activeElement&&document.activeElement.matches('input,textarea'))){const y=scrollY;render();scrollTo(0,y)}else if(location.hash==='#friends'){const box=$('#chatlog');if(box){const g=state.chat&&state.chat.startsWith('g:')?SO.groups.find(x=>'g:'+x.id===state.chat):null;box.innerHTML=g?groupLog(g):chatLog(state.chat);box.scrollTop=box.scrollHeight}}}
function chatLog(fid){const ms=SO.inbox.filter(m=>!blocked(m.from)&&(m.from===fid&&m.type!=='friend'&&m.type!=='accept')||(m.type==='sent'&&m.to===fid)).sort((a,b)=>a.at-b.at);
  return ms.map(m=>{const mine=m.type==='sent';const t=new Date(m.at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
    let body=esc(m.text||'');
    if(m.type==='task')body=`<b>Invite:</b> ${esc(m.task&&m.task.t)}${m.ans?`<div class="small muted">${m.ans==='ok'?'You joined':'You declined'}</div>`:`<div class="row" style="margin-top:6px"><button class="btn sm primary" data-tjoin="${esc(m.id)}">Join</button><button class="btn sm" data-tdecline="${esc(m.id)}">Decline</button></div>`}`;
    if(m.type==='taskok')body=`Joined your task: <b>${esc(m.task&&(m.task.t||''))||'your task'}</b>`;
    if(m.type==='taskno')body=`Can't join: <b>${esc(m.task&&m.task.t||'your task')}</b>`;
    if(m.type==='taskdone')body=`Finished: <b>${esc(m.task&&m.task.t)}</b> ✓`;
    if(mine&&m.task&&!m.text)body=`Invited to: <b>${esc(m.task.t)}</b>`;
    return `<div class="msg${mine?' me':''}"><div class="bub">${body}</div><div class="mt">${t}</div></div>`}).join('')||'<div class="small muted" style="padding:10px">No messages yet. Say hi, or invite them to a task.</div>'}
function friends(){const signed=SO.uid;
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Squad</div><h1>Friends</h1><p class="lede">Add friends with their friend code, chat one-on-one or in groups, and invite them to join your tasks.</p></div>`;
  if(!HOSTED)return h+`<div class="panel cut">Friends and messages work on <a class="ln" href="https://tennoform.com" target="_blank" rel="noopener">tennoform.com</a> after you sign in.</div></div>`;
  if(!FB)return h+`<div class="panel cut" role="status">${FBST==='loading'?'Loading…':'Accounts aren\'t available right now. Try again later.'}</div></div>`;
  if(!signed)return h+`<div class="panel cut stack"><b>Sign in to add friends.</b><span class="small muted">Friends, messages and shared tasks are tied to your account.</span><a class="btn primary" href="#tenno" data-ttab="account" style="align-self:flex-start">Sign in</a></div></div>`;
  const reqs=SO.inbox.filter(m=>m.type==='friend'&&!blocked(m.from));const ur=unread().per;const cur=state.chat&&SO.friends.some(f=>f.uid===state.chat)?state.chat:null;const curG=state.chat&&state.chat.startsWith('g:')?SO.groups.find(g=>'g:'+g.id===state.chat):null;
  h+=`<div class="panel cut row" style="justify-content:space-between"><div><span class="eyebrow">Your friend code</span><div class="fcode">${esc(SO.code||'…')}</div></div><button class="btn" data-copy="${esc(SO.code)}">Copy code</button></div>
  <div class="panel cut stack" style="gap:8px"><b>Add a friend</b><div class="row" style="flex-wrap:nowrap"><input id="fcode" type="text" placeholder="Their 6-character code" maxlength="6" autocomplete="off" style="text-transform:uppercase" aria-label="Friend code"><button class="btn primary" id="faddc">Send request</button></div></div>
  ${reqs.length?`<div class="panel cut stack" style="gap:8px;border-color:var(--gold-dim)"><b>Friend requests</b>${reqs.map(m=>`<div class="row" style="justify-content:space-between"><span><b>${esc(m.fromName||'Tenno')}</b> <span class="small muted mono">${esc(m.code||'')}</span></span><span class="row"><button class="btn sm primary" data-facc="${esc(m.id)}">Accept</button><button class="btn sm" data-fdec="${esc(m.id)}">Decline</button></span></div>`).join('')}</div>`:''}
  ${state.newGroup?newGroupForm():''}
  <div class="chatwrap"><div class="flist"><div class="fsec"><span>Groups</span><button class="btn sm" id="gnew">+ New group</button></div>${SO.groups.map(g=>`<button class="fitem${curG&&curG.id===g.id?' on':''}" data-chat="g:${esc(g.id)}"><span class="fn">${esc(g.name)}</span><span class="small muted">${g.members.length} members</span>${ur['g:'+g.id]?`<span class="nb">${ur['g:'+g.id]}</span>`:''}</button>`).join('')||'<div class="small muted" style="padding:8px 12px">No groups yet.</div>'}<div class="fsec"><span>Friends</span></div>${SO.friends.length?SO.friends.map(f=>{const p=SO.pub[f.uid]||{};return `<button class="fitem${cur===f.uid?' on':''}" data-chat="${esc(f.uid)}"><span class="fn">${esc(p.name||f.name||'Friend')}${f.pending?' <span class="chip">pending</span>':''}</span><span class="small muted mono">${[p.mr!=null?'MR '+esc(mrLabel(p.mr)):'',p.xp?fmt(p.xp)+' XP':''].filter(Boolean).join(' · ')}</span>${ur[f.uid]?`<span class="nb">${ur[f.uid]}</span>`:''}</button>`}).join(''):'<div class="small muted" style="padding:12px">No friends yet. Share your code or enter theirs above.</div>'}</div>
  <div class="chat">${cur?chatPane(cur):curG?groupPane(curG):'<div class="empty">Pick a friend or group to start chatting.</div>'}</div></div>
  ${SO.friends.length?compareFriends():''}</div>`;
  return h}
function chatPane(fid){const f=SO.friends.find(x=>x.uid===fid)||{};const p=SO.pub[fid]||{};const lr=lsGet('tf-read',{});lr[fid]=Date.now();lsSet('tf-read',lr);setTimeout(badge,0);
  const mine=(P.tasks||[]).filter(x=>!x.d);
  return `<div class="row chath" style="justify-content:space-between"><b>${esc(p.name||f.name||'Friend')}</b><span class="row"><select id="tinv" aria-label="Invite to a task" style="width:auto;max-width:200px"><option value="">Invite to a task…</option>${mine.map(x=>`<option value="${esc(x.id)}">${esc(x.t)}</option>`).join('')}</select><button class="btn sm" data-funf="${esc(fid)}" title="Remove friend">Remove</button><button type="button" class="btn sm" data-fblock="${esc(fid)}">Block</button><button type="button" class="btn sm" data-freport="${esc(fid+'|'+(p.name||f.name||'Friend')+'|'+(f.code||''))}">Report</button></span></div>
  ${f.pending?'<div class="small muted" style="padding:8px 12px">Waiting for them to accept. You can message once they do.</div>':''}
  <div class="chatlog" id="chatlog">${chatLog(fid)}</div>
  <div class="row chatin" style="flex-wrap:nowrap"><input id="msgin" type="text" maxlength="1000" placeholder="Message" aria-label="Message" ${f.pending?'disabled':''}><button class="btn primary" id="msgsend" ${f.pending?'disabled':''}>Send</button></div>`}
function compareFriends(){const t=totalXP();const me={name:'You',mr:mrInfo(t.total).mr,xp:t.total,maxed:MI.filter(i=>itemXP(i.n)>=mxp(i)).length,nodes:ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,sp:ALLN.filter(n=>!isJ(n)&&on('sp|'+n.id)).length};
  const all=[me,...SO.friends.filter(f=>!f.pending).map(f=>({name:(SO.pub[f.uid]||{}).name||f.name,...(SO.pub[f.uid]||{})}))];const best=k=>Math.max(...all.map(x=>+x[k]||0));
  const row=(lab,k,fm)=>`<div class="fl">${lab}</div>${all.map(x=>`<div class="c mono${(+x[k]||0)===best(k)&&best(k)>0?' top':''}">${x[k]==null?'—':fm?fm(x[k]):fmt(x[k])}</div>`).join('')}`;
  return `<details class="obj grp" open><summary><h3>Compare</h3></summary><div style="overflow-x:auto;padding:10px 14px"><div class="ftbl" style="grid-template-columns:minmax(120px,1fr) repeat(${all.length},minmax(80px,auto))"><div class="h"></div>${all.map(x=>`<div class="h c">${esc(x.name||'Friend')}</div>`).join('')}
   ${row('Mastery rank','mr',v=>esc(mrLabel(v)))}${row('Total XP','xp')}${row('Items mastered','maxed')}${row('Nodes','nodes')}${row('Steel Path','sp')}</div></div></details>`}
async function addFriendCode(code){code=String(code||'').trim().toUpperCase();if(!/^[A-Z0-9]{6}$/.test(code))return toast('Friend codes are 6 letters and numbers');if(code===SO.code)return toast("That's your own code");
  try{const d=await FB.fs.collection('codes').doc(code).get();if(!d.exists)return toast('No one has that code. Check it and try again.');const uid=d.data().uid;
    if(SO.friends.some(f=>f.uid===uid))return toast('Already in your friends');
    await FB.fs.collection('users').doc(SO.uid).collection('friends').doc(uid).set({name:'Pending',code,pending:true,at:Date.now()});
    await sendMsg(uid,{type:'friend',code:SO.code},false);toast('Friend request sent');const el=$('#fcode');if(el)el.value=''}catch(e){toast('Couldn\'t send the request. Try again.')}}
async function acceptFriend(id){const m=SO.inbox.find(x=>x.id===id);if(!m)return;const fs=FB.fs;
  try{await fs.collection('users').doc(SO.uid).collection('friends').doc(m.from).set({name:m.fromName||'Friend',code:m.code||'',at:Date.now()});
    await sendMsg(m.from,{type:'accept',code:SO.code},false);await fs.collection('inbox').doc(SO.uid).collection('msgs').doc(id).delete();toast('Friend added')}catch(e){toast('Couldn\'t accept. Try again.')}}
async function answerInvite(id,ok){const m=SO.inbox.find(x=>x.id===id);if(!m||!m.task)return;const fs=FB.fs;
  if(ok){addTask(m.task.k||'note',m.task.r||m.task.t,m.task.t,{from:{uid:m.from,name:m.fromName||'Friend'},src:{uid:m.from,id:m.task.id}})}
  try{await fs.collection('inbox').doc(SO.uid).collection('msgs').doc(id).update({ans:ok?'ok':'no'});await sendMsg(m.from,{type:ok?'taskok':'taskno',task:{id:m.task.id,t:m.task.t}},false);toast(ok?'Added to your tasks':'Declined')}catch(e){toast('Couldn\'t reach your friend. Try again.')}}

/* ---- home: breakdown in the centre ---- */
function hubLeft(){const nd=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,all=ALLN.filter(n=>!isJ(n)).length,J=ALLN.filter(isJ),jd=J.filter(n=>on('n|'+n.id)).length;
  const qd=Q.filter(q=>on('q|'+q.n)).length;const nq=nextQuest();const ez=easiest(5);
  const syn=D.synd.filter(e=>gateOK(e.gate)&&e.ranks.length);const near=syn.map(e=>{const st=synState(e),rr=rankRow(e,st.r);return [e,rr.max!=null?rr.max-st.s:1e9,st]}).filter(x=>x[1]>0&&x[1]<1e9).sort((a,b)=>a[1]-b[1])[0];
  const leftNodes=NODES.reduce((a,n)=>a+(on('n|'+n.id)?0:n.x),0);
  return `<div class="stack hl">
   <div class="panel cut stack" style="gap:6px"><span class="eyebrow">Easiest Mastery XP right now</span>${ez.map(x=>`<div class="row" style="justify-content:space-between;gap:6px;flex-wrap:nowrap">${art(x.it.n,'mini')}<a class="ln ell" style="flex:1" href="#" data-go="item|${esc(x.it.n)}">${esc(x.it.n)}</a><span class="chip mxc">+${fmt(x.gain)}</span></div>`).join('')||'<span class="small muted">Everything you can use is mastered.</span>'}<a class="small ln" href="#mastery">Full rank-up plan</a></div>
   <div class="tiles t2">
    <a class="tile cut" href="#missions"><span class="k">Star chart</span><span class="v num">${nd}<small>/${all}</small></span><span class="tbar"><i style="width:${nd/all*100}%"></i></span><span class="x">+${fmt(leftNodes)} MR XP left · junctions ${jd}/${J.length}</span></a>
    <a class="tile cut" href="#quests"><span class="k">Quests</span><span class="v num">${qd}<small>/${Q.length}</small></span><span class="tbar"><i style="width:${qd/Q.length*100}%"></i></span><span class="x">${nq?'Next: '+esc(nq.n):'All done'}</span></a>
    <a class="tile cut" href="#ranks" data-rkcat="Intrinsics"><span class="k">Intrinsics</span><span class="v num">${fmt(catXP('rail')+catXP('drift'))}</span><span class="x">1,500 MR XP per rank</span></a>
    <a class="tile cut" href="#synd"><span class="k">Syndicates</span><span class="v num">${syn.filter(e=>synState(e).r>0).length}<small>/${syn.length}</small></span><span class="tbar"><i style="width:${syn.length?syn.filter(e=>synState(e).r>0).length/syn.length*100:0}%"></i></span><span class="x">${near?'Closest: '+esc(near[0].n):'Ranked up'}</span></a>
   </div>
   ${near?`<a class="panel navcard cut" href="#synd"><span class="eyebrow">Closest syndicate rank-up</span><h3>${esc(near[0].n)}</h3><span class="small muted">${fmt(near[1])} standing to ${esc(rankRow(near[0],near[2].r+1).t||'next rank')}. Rank-ups unlock gear that gives Mastery XP.</span></a>`:''}</div>`}
function hubRight(){const now=Date.now();const fl=(P.foundry||[]).slice().sort((a,b)=>(a.t0+a.dur*1000)-(b.t0+b.dur*1000));const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;
  const dd=allChecks().filter(c=>gateOK(c[4]));const ddone=dd.filter(ckDone).length;const u=SO.uid?unread():null;
  return `<div class="stack hr">${taskPanel()}
   <div class="tiles t2">
    <a class="tile cut" href="#today"><span class="k">Today</span><span class="v num">${ddone}<small>/${dd.length}</small></span><span class="tbar"><i style="width:${dd.length?ddone/dd.length*100:0}%"></i></span><span class="x">Reset in ${left(lastDaily()+DAY-now)}</span></a>
    <a class="tile cut" href="#tenno" data-ttab="foundry"><span class="k">Foundry</span><span class="v num">${ready}<small>/${fl.length}</small></span><span class="tbar"><i style="width:${fl.length?ready/fl.length*100:0}%"></i></span><span class="x">${fl.length?(ready?'Ready to claim':'Next in '+hrs((fl[0].t0+fl[0].dur*1000-now)/1000)):'Nothing building'}</span></a>
    <a class="tile cut" href="#goals"><span class="k">Goals</span><span class="v num">${(P.goals||[]).length}</span><span class="x">Tracked items</span></a>
    <a class="tile cut" href="#friends"><span class="k">Friends</span><span class="v num">${SO.uid?SO.friends.filter(f=>!f.pending).length:'—'}</span><span class="x">${u&&u.n?u.n+' new':SO.uid?'Message & invite':HOSTED?'Sign in to add':'On tennoform.com'}</span></a>
   </div></div>`}

/* ---- v11 events ---- */
document.addEventListener('click',async e=>{const t=e.target.closest('[data-addtask],#taddb,[data-tdel],[data-tshare],[data-tinvite],#tclear,#faddc,[data-facc],[data-fdec],[data-chat],#msgsend,[data-funf],[data-tjoin],[data-tdecline],[data-copy]');if(!t)return;
  if(t.dataset.addtask){e.preventDefault();const i=t.dataset.addtask.indexOf('|');const k=t.dataset.addtask.slice(0,i),r=t.dataset.addtask.slice(i+1);const lab=t.dataset.tlabel||'';
    if((P.tasks||[]).some(x=>!x.d&&x.k===k&&x.r===r)){location.hash='tasks';return}if(addTask(k,r,lab)){toast('Added to your tasks');t.classList.add('on');t.textContent='✓ In tasks'}return}
  if(t.id==='taddb'){const el=$('#tnew');const v=(el&&el.value||'').trim();if(!v)return;addTask('note',v,v);rerender();return}
  if(t.dataset.tdel){P.tasks=(P.tasks||[]).filter(x=>x.id!==t.dataset.tdel);saveProfile();rerender();return}
  if(t.dataset.tshare){state.tShare=state.tShare===t.dataset.tshare?null:t.dataset.tshare;rerender();return}
  if(t.dataset.tinvite){const [id,uid]=t.dataset.tinvite.split('|');const x=(P.tasks||[]).find(y=>y.id===id);if(!x)return;
    try{await sendMsg(uid,{type:'task',task:{id:x.id,t:x.t,k:x.k,r:x.r}});toast('Invite sent');state.tShare=null;rerender()}catch(err){toast('Couldn\'t send. They need to accept your friend request first.')}return}
  if(t.id==='tclear'){P.tasks=(P.tasks||[]).filter(x=>!x.d);saveProfile();rerender();return}
  if(t.id==='faddc'){addFriendCode($('#fcode')&&$('#fcode').value);return}
  if(t.dataset.facc){acceptFriend(t.dataset.facc);return}
  if(t.dataset.fdec){FB.fs.collection('inbox').doc(SO.uid).collection('msgs').doc(t.dataset.fdec).delete().catch(()=>{});return}
  if(t.dataset.chat){state.chat=t.dataset.chat;rerender();const b=$('#chatlog');if(b)b.scrollTop=b.scrollHeight;return}
  if(t.id==='msgsend'){const el=$('#msgin');const v=(el&&el.value||'').trim();if(!v||!state.chat)return;el.value='';try{if(state.chat.startsWith('g:'))await gpost(state.chat.slice(2),{type:'msg',text:v});else await sendMsg(state.chat,{type:'msg',text:v})}catch(err){toast('Couldn\'t send. They may not have accepted yet.');el.value=v}return}
  if(t.dataset.funf){if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Tap again';setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.textContent='Remove'}},3000);return}
    FB.fs.collection('users').doc(SO.uid).collection('friends').doc(t.dataset.funf).delete().catch(()=>{});state.chat=null;return}
  if(t.dataset.tjoin){answerInvite(t.dataset.tjoin,true);return}
  if(t.dataset.tdecline){answerInvite(t.dataset.tdecline,false);return}
  if(t.dataset.copy){copy(t.dataset.copy,'Copied');return}});
document.addEventListener('change',async e=>{const t=e.target;
  if(t.dataset.tdone){await toggleTask(t.dataset.tdone,t.checked);rerender();return}
  if(t.id==='tkf'||t.id==='tks'){state[t.id==='tkf'?'tkF':'tkS']=t.value;saveUI();rerender();return}
  if(t.id==='tinv'&&t.value&&state.chat){const x=(P.tasks||[]).find(y=>y.id===t.value);if(x){try{await sendMsg(state.chat,{type:'task',task:{id:x.id,t:x.t,k:x.k,r:x.r}});toast('Invite sent')}catch(err){toast('Couldn\'t send the invite.')}}t.value=''}});
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const id=e.target&&e.target.id;
  if(id==='tnew'){e.preventDefault();$('#taddb')&&$('#taddb').click()}if(id==='msgin'){e.preventDefault();$('#msgsend')&&$('#msgsend').click()}if(id==='fcode'){e.preventDefault();$('#faddc')&&$('#faddc').click()}});

/* ---------- v12: group chats, support page ---------- */
const DONATE={ign:'',paypal:'https://paypal.me/snooji'};
function syncGroupListeners(){const fs=FB.fs;const ids=new Set(SO.groups.map(g=>g.id));
  for(const id in SO.gun)if(!ids.has(id)){try{SO.gun[id]()}catch(e){}delete SO.gun[id];delete SO.gm[id]}
  for(const g of SO.groups)if(!SO.gun[g.id])SO.gun[g.id]=fs.collection('groups').doc(g.id).collection('msgs').orderBy('at','desc').limit(200).onSnapshot(s=>{SO.gm[g.id]=s.docs.map(d=>({id:d.id,...d.data()}));processGroup(g.id);socialRender()},()=>{})}
function gpost(gid,body){return FB.fs.collection('groups').doc(gid).collection('msgs').add({from:SO.uid,fromName:myName(),at:Date.now(),...body})}
function processGroup(gid){for(const m of SO.gm[gid]||[]){if(m.type!=='taskok'||m.from===SO.uid)continue;const x=(P.tasks||[]).find(t=>t.id===(m.task&&m.task.id));
  if(x&&!(x.with||[]).some(w=>w.uid===m.from)){x.with=x.with||[];x.with.push({uid:m.from,name:m.fromName||'Friend'});saveProfile()}}}
function gname(g,uid){return (g.names&&g.names[uid])||(SO.pub[uid]&&SO.pub[uid].name)||((SO.friends.find(f=>f.uid===uid)||{}).name)||'Tenno'}
function groupLog(g){const ms=(SO.gm[g.id]||[]).filter(m=>!blocked(m.from)).slice().sort((a,b)=>a.at-b.at);
  return ms.map(m=>{const mine=m.from===SO.uid;const t=new Date(m.at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});const who=mine?'':`<div class="mw">${esc(m.fromName||gname(g,m.from))}</div>`;
    if(m.type==='sys')return `<div class="msys">${esc(m.text)}</div>`;
    let body=esc(m.text||'');
    if(m.type==='task'){const joined=(P.tasks||[]).some(x=>x.src&&x.src.id===(m.task&&m.task.id))||mine;body=`<b>${mine?'You invited the group to':'Invite'}:</b> ${esc(m.task&&m.task.t)}${joined?(mine?'':'<div class="small muted">You joined</div>'):`<div class="row" style="margin-top:6px"><button class="btn sm primary" data-gjoin="${esc(g.id+'|'+m.id)}">Join</button></div>`}`}
    if(m.type==='taskok')body=`Joined: <b>${esc(m.task&&m.task.t||'a task')}</b>`;
    if(m.type==='taskdone')body=`Finished: <b>${esc(m.task&&m.task.t)}</b> ✓`;
    return `<div class="msg${mine?' me':''}">${who}<div class="bub">${body}</div><div class="mt">${t}</div></div>`}).join('')||'<div class="small muted" style="padding:10px">No messages yet. Say hi to the group.</div>'}
function groupPane(g){const lr=lsGet('tf-read',{});lr['g:'+g.id]=Date.now();lsSet('tf-read',lr);setTimeout(badge,0);
  const mine=(P.tasks||[]).filter(x=>!x.d);const addable=SO.friends.filter(f=>!f.pending&&!g.members.includes(f.uid));
  return `<div class="row chath" style="justify-content:space-between"><div style="min-width:0"><b>${esc(g.name)}</b><div class="small muted ell">${g.members.map(u=>u===SO.uid?'You':esc(gname(g,u))).join(', ')}</div></div>
   <span class="row"><select id="ginv" aria-label="Invite the group to a task" style="width:auto;max-width:180px"><option value="">Invite to a task…</option>${mine.map(x=>`<option value="${esc(x.id)}">${esc(x.t)}</option>`).join('')}</select>
   ${addable.length?`<select id="gadd" aria-label="Add a friend to the group" style="width:auto;max-width:160px"><option value="">Add friend…</option>${addable.map(f=>`<option value="${esc(f.uid)}">${esc((SO.pub[f.uid]||{}).name||f.name)}</option>`).join('')}</select>`:''}
   <button class="btn sm" data-gleave="${esc(g.id)}">Leave</button></span></div>
  <div class="chatlog" id="chatlog">${groupLog(g)}</div>
  <div class="row chatin" style="flex-wrap:nowrap"><input id="msgin" type="text" maxlength="1000" placeholder="Message ${esc(g.name)}" aria-label="Message"><button class="btn primary" id="msgsend">Send</button></div>`}
function newGroupForm(){const fr=SO.friends.filter(f=>!f.pending);
  return `<div class="panel cut stack" style="gap:8px"><b>New group chat</b>${fr.length?`<input id="gname" type="text" maxlength="40" placeholder="Group name (e.g. Eidolon squad)" aria-label="Group name">
   <div class="gpick">${fr.map(f=>`<label class="small"><input type="checkbox" data-gpick="${esc(f.uid)}"> ${esc((SO.pub[f.uid]||{}).name||f.name)}</label>`).join('')}</div>
   <div class="row"><button class="btn primary" id="gcreate">Create group</button><button class="btn" id="gcancel">Cancel</button></div>`:'<span class="small muted">Add at least one friend first.</span><div><button class="btn" id="gcancel">Close</button></div>'}</div>`}
async function createGroup(){const name=($('#gname')&&$('#gname').value||'').trim().slice(0,40);const picks=[...document.querySelectorAll('[data-gpick]:checked')].map(i=>i.dataset.gpick);
  if(!name)return toast('Give the group a name');if(!picks.length)return toast('Pick at least one friend');
  const names={[SO.uid]:myName()};picks.forEach(u=>names[u]=String((SO.pub[u]||{}).name||(SO.friends.find(f=>f.uid===u)||{}).name||'Tenno').slice(0,40));
  try{const r=await FB.fs.collection('groups').add({name,owner:SO.uid,members:[SO.uid,...picks],names,at:Date.now()});await gpost(r.id,{type:'sys',text:myName()+' created '+name});state.newGroup=false;state.chat='g:'+r.id;rerender()}catch(e){toast('Couldn\'t create the group. Check the Firebase rules are up to date.')}}
async function gAdd(gid,uid){const g=SO.groups.find(x=>x.id===gid);if(!g)return;const nm=String((SO.pub[uid]||{}).name||(SO.friends.find(f=>f.uid===uid)||{}).name||'Tenno').slice(0,40);
  try{await FB.fs.collection('groups').doc(gid).update({members:firebase.firestore.FieldValue.arrayUnion(uid),['names.'+uid]:nm,at:Date.now()});await gpost(gid,{type:'sys',text:myName()+' added '+nm})}catch(e){toast('Couldn\'t add them. Groups hold up to 25 people.')}}
async function gLeave(gid){const g=SO.groups.find(x=>x.id===gid);if(!g)return;
  try{await gpost(gid,{type:'sys',text:myName()+' left'});if(g.owner===SO.uid&&g.members.length<=1)await FB.fs.collection('groups').doc(gid).delete();else await FB.fs.collection('groups').doc(gid).update({members:firebase.firestore.FieldValue.arrayRemove(SO.uid),at:Date.now()});state.chat=null;rerender()}catch(e){toast('Couldn\'t leave. Try again.')}}
async function gJoin(gid,mid){const m=(SO.gm[gid]||[]).find(x=>x.id===mid);if(!m||!m.task)return;
  addTask(m.task.k||'note',m.task.r||m.task.t,m.task.t,{from:{uid:m.from,name:m.fromName||'Tenno'},src:{uid:m.from,id:m.task.id},g:gid});
  try{await gpost(gid,{type:'taskok',task:{id:m.task.id,t:m.task.t}});toast('Added to your tasks')}catch(e){}rerender()}

/* ---- support page ---- */
function donate(){const ign=DONATE.ign,pp=DONATE.paypal;const wh=ign?`/w ${ign} Hi! I'd like to donate platinum to Tennoform.`:'';
  return `<div class="stack"><div class="head"><div class="eyebrow">Support</div><h1>Support Tennoform</h1><p class="lede">Free, no ads. Made by Snooji. If it saved you time, plat or PayPal both help.</p></div>
  <div class="split two dongrid">
   <section class="panel cut stack dcard"><div class="dic">${PLAT_SVG}</div><h2>Donate platinum</h2>
    ${ign?`<p class="small" style="margin:0">Send any amount of platinum in game to <b class="mono" style="color:var(--gold)">${esc(ign)}</b>.</p>
    <ol class="small" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px"><li>Copy the whisper below and paste it into in-game chat.</li><li>Meet in Maroo's Bazaar (Mars) or a Clan Dojo Trading Post.</li><li>Open a trade and add the platinum. Trading needs MR 2 and two-factor sign-in, and costs a small credit tax.</li></ol>
    <div class="row"><button class="btn primary" data-copy="${esc(wh)}">Copy whisper</button><button class="btn" data-copy="${esc(ign)}">Copy name</button></div>`:'<p class="small muted" style="margin:0">Platinum donations open soon.</p>'}
   </section>
   <section class="panel cut stack dcard"><div class="dic">${PP_SVG}</div><h2>Donate with PayPal</h2>
    ${pp?`<p class="small" style="margin:0">One-off donation in any amount through PayPal. You don't need a PayPal account to pay by card.</p><a class="btn primary" href="${esc(pp)}" target="_blank" rel="noopener" style="align-self:flex-start">Donate on PayPal ${ic('ext')}</a>`:'<p class="small muted" style="margin:0">PayPal donations open soon.</p>'}
   </section></div>
  <div class="callout small">Donations don't unlock anything. Every feature stays free for everyone.</div></div>`}
const PLAT_SVG='<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><path d="M24 3 42 14v20L24 45 6 34V14z" fill="#0d1a22" stroke="#6FD6E8" stroke-width="2"/><path d="M24 11 35 17.5v13L24 37 13 30.5v-13z" fill="#6FD6E8" opacity=".25" stroke="#BDF2FA" stroke-width="1.5"/><path d="M24 11v26M13 17.5l22 13M35 17.5l-22 13" stroke="#BDF2FA" stroke-width="1" opacity=".6"/></svg>';
const PP_SVG='<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#0d1a22" stroke="#D9B45E" stroke-width="2"/><path d="M24 34s-9-5.6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.4-9 12-9 12z" fill="#D9B45E"/></svg>';

/* ---- v12 events ---- */
document.addEventListener('click',async e=>{const t=e.target.closest('#gnew,#gcreate,#gcancel,[data-gleave],[data-gjoin]');if(!t)return;
  if(t.id==='gnew'){state.newGroup=true;rerender();setTimeout(()=>$('#gname')&&$('#gname').focus(),30);return}
  if(t.id==='gcancel'){state.newGroup=false;rerender();return}
  if(t.id==='gcreate'){createGroup();return}
  if(t.dataset.gleave){if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Tap again';setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.textContent='Leave'}},3000);return}gLeave(t.dataset.gleave);return}
  if(t.dataset.gjoin){const [g,m]=t.dataset.gjoin.split('|');gJoin(g,m);return}},true);
document.addEventListener('change',async e=>{const t=e.target;const gid=state.chat&&state.chat.startsWith('g:')?state.chat.slice(2):null;if(!gid)return;
  if(t.id==='gadd'&&t.value){gAdd(gid,t.value);t.value=''}
  if(t.id==='ginv'&&t.value){const x=(P.tasks||[]).find(y=>y.id===t.value);if(x){x.g=gid;saveProfile();try{await gpost(gid,{type:'task',task:{id:x.id,t:x.t,k:x.k,r:x.r}});toast('Invite sent to the group')}catch(err){toast('Couldn\'t send the invite.')}}t.value=''}});

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

/* ---------- v14: trust, orientation, freshness, about ---------- */
const PITCH='Track your mastery, plan your next farms and keep up with daily Warframe activities.';
const CHANGES=[
 ['2026-10-05','New look: calmer colours with a light theme, five sections instead of twenty pages, a simpler home, search everything with Ctrl+K, a sample account to try first, and a progress card you can share.'],
 ['2026-10-05','Big usability update: welcome screen with two clear starts, customizable dashboard with a reasoned Next up list, undo for rank changes, sync, restores and hidden checklist items, need/have/left shopping lists that turn into tasks, task notes, repeats and due dates, your own daily/weekly checklist items, syndicate side effects, farms marked for your stage, phone-friendly layout with larger tap targets, full accessibility pass, block and report for friends, About & privacy page, delete-account option.'],
 ['2026-10-05','Security hardening, stay signed in on the iPhone home-screen app, feedback page, group chats, friends and messages, shared tasks, live sync across devices.'],
 ['2026-10-04','Tennoform launched: mastery tracking, star chart, quests, syndicates, resources, relics, market prices, builds.']];
const LOGO_HTML=()=>{const l=document.getElementById('tf-logo');return l?l.innerHTML.trim():''};
function isNew(){return !P.onb&&!P.at&&!Object.keys(P.rk||{}).length&&Object.keys(C).length<3&&!(P.tasks||[]).length&&!synced}
function welcome(){return `<section class="welcome cut"><div class="wl">${LOGO_HTML()}<div><div class="eyebrow">Welcome, Tenno</div><h1>Tennoform</h1><p class="lede" style="margin:4px 0 0">${PITCH}</p></div></div>
 <div class="wchoices">
  <button type="button" class="wchoice cut" data-qsopen><span class="wn" aria-hidden="true">1</span><b>Quick start <span class="chip">1 minute</span></b><span class="small muted">Enter your Mastery Rank and tick any starter gear you've maxed. No account needed; it saves in this browser. Fill in individual items later, only if you want to.</span><span class="wgo">Quick start →</span></button>
  <button type="button" class="wchoice cut" data-onb="import"><span class="wn" aria-hidden="true">2</span><b>Link your Warframe profile <span class="chip">optional</span></b><span class="small muted">Read-only. Fills in your ranks, star chart, syndicates and quests from the public profile Warframe shows for your account ID. No password, nothing changes in game. To keep your Tennoform progress on other devices, sign in as well.</span><span class="wgo">Link my profile →</span></button>
 </div>
 <div class="row small" style="justify-content:space-between"><span class="muted">${HOSTED&&FB?'Already use Tennoform? <a class="ln" href="#tenno" data-ttab="account">Sign in</a> to load your saved progress. ':''}Prefer to tick every item yourself? <button type="button" class="linkbtn" data-onb="manual">Track by hand</button> (optional, can take a while).</span><button type="button" class="btn sm" data-onb="skip">Just exploring</button></div></section>`}
const lt=ts=>new Date(ts).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
const ltw=ts=>new Date(ts).toLocaleString([],{weekday:'short',hour:'numeric',minute:'2-digit'});
function liveStatus(){if(!HOSTED)return `<span class="fresh"><span class="dot" aria-hidden="true"></span>Live info works on <a class="ln" href="https://tennoform.com/#today" target="_blank" rel="noopener">tennoform.com</a></span>`;
  const age=WS?Date.now()-WSat:null;const stale=age!=null&&age>15*60e3;const cls=WSerr?'bad':stale?'warn':WS?'ok':'';
  const txt=WSload?'Updating…':WSerr?(WS?'Offline · showing data from '+left(age)+' ago':'Couldn\'t reach live data'):WS?(stale?'Data is '+left(age)+' old':'Updated '+(age<60e3?'just now':left(age)+' ago')):'Loading…';
  return `<span class="fresh ${cls}" role="status"><span class="dot" aria-hidden="true"></span>${txt} · source <a class="ln" href="https://docs.warframestat.us" target="_blank" rel="noopener">warframestat.us</a><button type="button" class="btn sm" id="wsretry">${WSerr?'Retry':'Refresh'}</button></span>`}
/* one status per data feed: fresh, delayed or unavailable */
function feedStatus(){const age=d=>{const t=Date.parse(d);return isNaN(t)?null:(Date.now()-t)/864e5};const dot=k=>ic({ok:'check',warn:'timer',bad:'warn'}[k]||'minus','fstate '+k);
  const g=age(D.meta.built),p=age(D.meta.prices);const gk=g==null||g<21?'ok':'warn',pk=p==null||p<3?'ok':'warn';
  const lk=!HOSTED?'off':WS?'ok':WSerr?'bad':'off';
  return `<span>${dot(gk)}Game data ${D.meta.wfcd?'v'+esc(D.meta.wfcd)+', ':''}${esc(D.meta.built)}${gk==='warn'?' (may be out of date)':''}</span><span>${dot(pk)}Prices ${esc(D.meta.prices)}${pk==='warn'?' (delayed)':''}</span><span>${dot(lk)}Live game feed ${lk==='ok'?'connected':lk==='bad'?'unavailable':HOSTED?'not loaded yet':'on tennoform.com only'}</span>`}
function siteFoot(){return `<footer class="sitefoot"><div class="footcta" role="navigation" aria-label="Tennoform"><a class="btn sm primary" href="#donate">Support Tennoform</a><a class="btn sm" href="#feedback">Send feedback</a><a class="btn sm" href="#about" data-about="changes">What's new</a></div><div class="feeds">${feedStatus()}</div>
 <div><a class="ln" href="#about">About, data &amp; privacy</a> · <a class="ln" href="#feedback">Feedback</a> · <a class="ln" href="#donate">Support</a> · <a class="ln" href="#about" data-about="changes">What's new</a> · Made by <a class="ln" href="#about">Snooji</a></div>
 <div class="muted">Tennoform is a free, community-made tool. It is not affiliated with, endorsed or sponsored by Digital Extremes. Warframe, its content and its item pictures are trademarks and property of Digital Extremes Ltd.</div></footer>`}
function syncInfo(){const ls=P.lastSync;const pre=lsGet('tf-presync',null);
  return `<details class="panel cut syncinfo" ${P.at?'':'open'}><summary><h2>How syncing works</h2><span class="small muted">What's read, what isn't, and how to undo it</span></summary>
  <dl class="faq">
   <dt>What does it read?</dt><dd>The public profile Warframe publishes for an account ID, the same information other players see when they view your profile in game. Tennoform only reads it. It never signs in to Warframe and never asks for your password.</dd>
   <dt>What gets filled in?</dt><dd>Item ranks and mastered gear, star chart and Steel Path completions, junctions, intrinsics, syndicate ranks and standing, Nightwave, today's standing caps, and the quests your progress shows you've finished (tick any it missed on the Quests page).</dd>
   <dt>What stays manual?</dt><dd>Warframe keeps these private: inventory and resource counts, the Foundry, relics, mods and arcanes you own, platinum, and Lich or Sister weapon bonuses. Track them in their own tabs.</dd>
   <dt>What if a sync fails?</dt><dd>Nothing changes. Your saved progress stays exactly as it was. Try again later or use the copy-and-paste method.</dd>
   <dt>What if my profile changed?</dt><dd>Syncing again updates ranks for gear Warframe reports and adds newly finished missions and quests. Anything you set by hand for gear Warframe doesn't report is kept.</dd>
  </dl>
  <div class="kv small"><span>Last sync</span><span>${ls?esc(new Date(ls.at).toLocaleString()):'Never'}</span><span>Linked account ID</span><span class="mono">${P.wfid?esc(P.wfid):'None'}</span></div>
  <div class="row">${pre?`<button type="button" class="btn" id="undosync">Undo last sync</button>`:''}${P.at?'<button type="button" class="btn" id="clearimp">Clear imported data</button>':''}${P.wfid?'<button type="button" class="btn" id="unlink">Unlink ID</button>':''}</div>
  <div class="small muted">${pre?`Undo last sync puts everything back the way it was before the sync on ${esc(new Date(pre.at).toLocaleString())}. `:''}Clear imported data removes the in-game snapshot (in-game MR, synced syndicates, Nightwave, run counts). Your ranks and ticks stay; change them on the Ranks page.</div></details>`}
function about(){const sec=state.aboutSec;
  return `<div class="stack"><div class="head"><div class="eyebrow">About</div><h1>About</h1><p class="lede">${PITCH}</p></div>
  <p style="margin:0;max-width:68ch">Tennoform is made and maintained by <b>Snooji</b>, a Warframe player, on their own time. Ideas and bug reports go straight to them through <a class="ln" href="#feedback">Feedback</a>, and every change is listed under What's new below.</p><div class="small muted">Site updated ${esc(D.meta.site||D.meta.built)}</div><div class="callout small"><b>Unofficial community tool.</b> Tennoform is made by one independent developer. It is not affiliated with, endorsed or sponsored by Digital Extremes, and it is not an official Warframe service. For Foundry orders and in-game actions, use Warframe or the official Warframe Companion app.</div>
  <section class="panel cut stack"><h2>Where the data comes from</h2><div class="kv small">
   <span>Items, mastery, relics, mods, arcanes</span><span><a class="ln" href="https://github.com/WFCD/warframe-items" target="_blank" rel="noopener">WFCD warframe-items</a> v${esc(D.meta.wfcd||'')}</span>
   <span>Drop locations, quests, junctions, syndicates, fishing and mining</span><span><a class="ln" href="https://wiki.warframe.com" target="_blank" rel="noopener">Warframe Wiki</a></span>
   <span>Live cycles, fissures, Baro, Sortie, Prime Resurgence</span><span><a class="ln" href="https://docs.warframestat.us" target="_blank" rel="noopener">warframestat.us</a> (checked when you open Today)</span>
   <span>Prices and cheapest sellers</span><span><a class="ln" href="https://warframe.market" target="_blank" rel="noopener">warframe.market</a> (refreshed daily)</span>
   <span>Your profile sync</span><span>Warframe's public profile for your account ID, read-only</span></div>
   <div class="small muted">Game data last updated ${esc(D.meta.built)}; prices ${esc(D.meta.prices)}. New game content is checked weekly against the WFCD data set. Recommendations such as farms and builds are community guidance, not guarantees. If something looks wrong, <a class="ln" href="#feedback">send feedback</a>.</div></section>
  <section class="panel cut stack"><h2>Privacy</h2><ul class="small" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px">
   <li><b>Without an account</b> your progress stays in this browser only.</li>
   <li><b>With an account</b> your progress, tasks and settings are stored in Google Firebase so they follow you between devices. Only you can read them.</li>
   <li><b>Friends</b> can see your display name, friend code, MR, total Mastery XP and node counts. Messages are stored until you or the recipient deletes them.</li>
   <li><b>Feedback</b> is readable only by the developer.</li>
   <li><b>No ads, no analytics, no tracking.</b> Your browser contacts warframestat.us (live data and item pictures), Tennoform's profile relay (when you sync) and Firebase (when signed in).</li>
   <li>You can export your data any time (Profile → Backup &amp; export) and delete your account and everything stored with it (Profile → Account &amp; sync).</li></ul></section>
  <details class="obj grp" ${sec==='changes'?'open':''} id="changes"><summary><h3>What's new</h3></summary><div class="stack" style="padding:10px 14px;gap:8px">${CHANGES.map(([d,t])=>`<div class="small"><b class="mono">${esc(fdate(d))}</b> · ${esc(t)}</div>`).join('')}</div></details>
  <section class="panel cut stack"><h2>Contact</h2><span class="small">Bugs, ideas or wrong data: <a class="ln" href="#feedback">Feedback page</a>. Like the app? <a class="ln" href="#donate">Support Tennoform</a>.</span></section></div>`}
async function deleteAccount(){const u=FB&&FB.auth.currentUser;if(!u)return;const fs=FB.fs;const uid=u.uid;
  const last=new Date(u.metadata.lastSignInTime||0).getTime();if(Date.now()-last>5*60e3){toast('For safety, sign out, sign back in, then delete within 5 minutes.');return}
  try{for(const g of SO.groups){if(g.owner===uid)await fs.collection('groups').doc(g.id).delete().catch(()=>{});else await fs.collection('groups').doc(g.id).update({members:firebase.firestore.FieldValue.arrayRemove(uid),at:Date.now()}).catch(()=>{})}
    const del=async col=>{const s=await col.get();await Promise.all(s.docs.map(d=>d.ref.delete()))};
    await del(fs.collection('inbox').doc(uid).collection('msgs')).catch(()=>{});await del(fs.collection('users').doc(uid).collection('friends')).catch(()=>{});
    await fs.collection('public').doc(uid).delete().catch(()=>{});await fs.collection('share').doc(uid).delete().catch(()=>{});await fs.collection('presence').doc(uid).delete().catch(()=>{});if(SO.code)await fs.collection('codes').doc(SO.code).delete().catch(()=>{});
    docRef=null;profRef=null;await fs.collection('users').doc(uid).collection('data').doc('progress').delete().catch(()=>{});await fs.collection('users').doc(uid).collection('data').doc('profile').delete().catch(()=>{});
    socialStop();await u.delete();toast('Your account and its data were deleted. Progress in this browser was kept.');render()}
  catch(e){toast(e&&e.code==='auth/requires-recent-login'?'Sign out and back in, then try again.':'Couldn\'t finish deleting. Try again.')}}

/* ---- v14 events ---- */
document.addEventListener('click',async e=>{const t=e.target.closest('[data-onb],#wsretry,#undosync,#clearimp,#delacct,[data-about]');if(!t)return;
  if(t.dataset.onb){P.onb=t.dataset.onb;saveProfile();if(t.dataset.onb==='manual'){state.rkCat='Warframe';location.hash='ranks'}else if(t.dataset.onb==='import'){state.tTab='account';location.hash='tenno'}else rerender();return}
  if(t.dataset.about){state.aboutSec=t.dataset.about;if(location.hash==='#about'){rerender();$('#changes')&&$('#changes').scrollIntoView({block:'start'})}else setTimeout(()=>{const c=$('#changes');if(c){c.open=true;c.scrollIntoView({block:'start'})}},150);return}
  if(t.id==='wsretry'){WSat=0;WSerr=false;const p=loadWS();rerender();await p;rerender();return}
  if(t.id==='undosync'){const s=lsGet('tf-presync',null);if(!s)return;C=s.C||{};for(const k in P)delete P[k];Object.assign(P,s.P||{});lsSet('tenno-codex',C);try{localStorage.removeItem('tf-presync')}catch(err){}pushAll();updateMR();rerender();toast('Sync undone. Everything is back the way it was.');return}
  if(t.id==='clearimp'){if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Tap again to clear';return}
    ['prof','nw','daily','lastSync','mc','at','auto'].forEach(k=>delete P[k]);if(P.syn)for(const k in P.syn)if(P.syn[k].sync)delete P.syn[k];saveProfile();updateMR();rerender();toast('Imported snapshot cleared');return}
  if(t.id==='delacct'){if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Tap again: delete everything';t.classList.add('danger');return}t.disabled=true;await deleteAccount();return}});
setInterval(()=>{if(location.hash==='#today'&&HOSTED&&!document.hidden&&!(document.activeElement&&document.activeElement.matches('input,select,textarea'))){loadWS();rerender()}},5*60e3);

/* ---------- v15: dashboard, reasons, undo, goal → farm → task ---------- */
function toastAction(text,label,fn){if(window.TF_UI&&TF_UI.toast){TF_UI.toast(text,{label,fn});return}document.querySelectorAll('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast act';d.setAttribute('role','status');
  const s=document.createElement('span');s.textContent=text;d.appendChild(s);const b=document.createElement('button');b.type='button';b.className='btn sm';b.textContent=label;b.onclick=()=>{d.remove();fn()};d.appendChild(b);document.body.appendChild(d);setTimeout(()=>d.remove(),7000)}
/* rank undo */
let UNDO=null;
function undoPush(n,prev){if(!UNDO||Date.now()-UNDO.t>1500)UNDO={t:0,list:[]};if(!UNDO.list.some(x=>x.n===n))UNDO.list.push({n,...prev});UNDO.t=Date.now();clearTimeout(UNDO.tm);
  const u=UNDO;UNDO.tm=setTimeout(()=>toastAction(u.list.length>1?`Changed ${u.list.length} ranks`:`${u.list[0].n} → rank ${rankOf(u.list[0].n)}`,'Undo',()=>{u.list.slice().reverse().forEach(x=>{if(x.rk==null)delete P.rk[x.n];else P.rk[x.n]=x.rk;if(on('m|'+x.n)!==!!x.m)setK('m|'+x.n,x.m?1:0)});saveProfile();updateMR();rerender();toast('Undone')}),200)}

/* player stage & item reasons */
function stage(){const mr=mrInfo(totalXP().total).mr;const nd=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length;return mr<6||nd<90?'Early game':mr<16||nd<250?'Mid game':'Late game'}
function whyItem(it){const r=[];const rk=rankOf(it.n);if(rk>0)r.push(`in progress, rank ${rk}/${maxRank(it)}`);
  if(it.bc)r.push(`Market blueprint, ${fmt(it.bc)} credits`);else if(it.bprel)r.push(it.v&&!(VAULT[it.n]&&VAULT[it.n].now)?'Prime, vaulted: trade for it':'Prime, relics farmable now');
  else if(it.bpd&&it.bpd.length)r.push('drops from '+String(it.bpd[0][0]).replace(/ · Rot.*$/,'').replace(/\s*\(.*\)$/,''));else if(it.dr&&it.dr.length)r.push('drops from '+String(it.dr[0][0]).replace(/\s*\(.*\)$/,''));
  else{const q=Q.find(q=>q.rw.some(x=>x.toLowerCase().startsWith(it.n.toLowerCase()+' ')||x===it.n));r.push(q?'quest reward: '+q.n:'vendor or event item')}
  if(it.mr)r.push('needs MR '+it.mr);if(it.t&&!rk)r.push(hrs(it.t)+' to build');if((P.goals||[]).includes(it.n))r.push('in your goals');return r.join(' · ')}
function easiest2(k){const cur=Math.max(mrInfo(totalXP().total).mr,1);
  return MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=Math.min(cur,30)).map(it=>{const gain=mxp(it)-itemXP(it.n);const prog=rankOf(it.n)>0,goal=(P.goals||[]).includes(it.n);return {it,gain,score:ease(it)*10-(prog?25:0)-(goal?15:0)}}).filter(x=>x.gain>0).sort((a,b)=>a.score-b.score||b.gain-a.gain).slice(0,k)}

/* next up */
function nextUp(){const out=[];const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;
  if(g!=null&&m.mr>g)out.push({s:100,t:`Take your ${m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr} test`,why:`You have the XP; in game you're still MR ${g}. Use the Mastery shrine in a Relay or your Orbiter.`});
  const now=Date.now();const ready=(P.foundry||[]).filter(f=>now>=f.t0+f.dur*1000);if(ready.length)out.push({s:90,t:`Claim ${ready.length} Foundry item${ready.length>1?'s':''}`,why:ready.slice(0,3).map(f=>f.n).join(', '),href:'#tenno',tt:'foundry'});
  for(const e of D.synd){if(!gateOK(e.gate)||!e.ranks.length)continue;const st=synState(e);const rr=rankRow(e,st.r);if(rr.max!=null&&st.s>=rr.max&&rankRow(e,st.r+1).t){out.push({s:80,t:`Rank up with ${e.n}`,why:`You have the standing for ${rankRow(e,st.r+1).t}.`,href:'#synd',task:['synd',e.n,'Rank up '+e.n]});break}}
  const goal=(P.goals||[]).find(n=>I[n]&&!on('build|'+n));if(goal){const k=stepKeys(goal);const d=k.filter(on).length;out.push({s:70,t:`Keep going on ${goal}`,why:`${d}/${k.length} steps done${mxChip(goal)?'':''} · ${whyItem(I[goal])}`,go:'item|'+goal,task:['item',goal,'Build '+goal]})}
  const nq=nextQuest();if(nq&&!qDone(nq.n))out.push({s:Q.indexOf(nq)<12?75:55,t:`Do the quest ${nq.n}`,why:nq.d?nq.d.slice(0,110)+(nq.d.length>110?'…':''):'Next in the story; unlocks new areas and gear.',q:nq.n,task:['quest',nq.n,'Do quest: '+nq.n]});
  const ez=easiest2(1)[0];if(ez)out.push({s:50,t:`Get ${ez.it.n} for +${fmt(ez.gain)} MR XP`,why:whyItem(ez.it),go:'item|'+ez.it.n,task:['item',ez.it.n,'Build '+ez.it.n]});
  const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const left2=dd.filter(c=>!ckDone(c)).length;if(left2)out.push({s:45,t:`Finish today's checklist (${left2} left)`,why:`Daily reset in ${left(lastDaily()+DAY-now)}.`,href:'#today'});
  return out.sort((a,b)=>b.s-a.s).slice(0,3)}
function nextCard(){const n=nextUp();
  return `<section class="panel cut stack nextup" style="gap:8px"><div class="row" style="justify-content:space-between"><h2>Next up</h2><span class="small muted">${esc(stage())}</span></div>
  ${n.map((x,i)=>`<div class="nu"><span class="nun" aria-hidden="true">${i+1}</span><div class="nut"><b>${x.go?`<a class="ln" href="#" data-go="${esc(x.go)}">${esc(x.t)}</a>`:x.q?`<a class="ln" href="#quests" data-q="${esc(x.q)}">${esc(x.t)}</a>`:x.href?`<a class="ln" href="${x.href}" ${x.tt?`data-ttab="${x.tt}"`:''}>${esc(x.t)}</a>`:esc(x.t)}</b><div class="small muted">${esc(x.why)}</div></div>${x.task?taskBtn(...x.task):''}</div>`).join('')||'<div class="small muted">You\'re all caught up. Pick something from Goals or the rank-up plan.</div>'}</section>`}
function easyCard(){const ez=easiest2(5);
  return `<section class="panel cut stack" style="gap:6px"><span class="eyebrow">Easiest Mastery XP for you</span>${ez.map(x=>`<div class="ezr">${art(x.it.n,'mini')}<div class="ezt"><a class="ln" href="#" data-go="item|${esc(x.it.n)}">${esc(x.it.n)}</a><div class="small muted">${esc(whyItem(x.it))}</div></div><span class="chip mxc">+${fmt(x.gain)}</span></div>`).join('')||'<span class="small muted">Everything you can use is mastered.</span>'}<a class="small ln" href="#mastery">Full rank-up plan</a></section>`}
function todayCard(){const now=Date.now();const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const done=dd.filter(ckDone).length;if(HOSTED&&!WS&&!WSerr)loadWS();
  const cyc=WS?[['Cetus',WS.cetusCycle,c=>c.isDay?'Day':'Night'],['Vallis',WS.vallisCycle,c=>c.isWarm?'Warm':'Cold'],['Cambion',WS.cambionCycle,c=>c.state==='vome'?'Vome':'Fass']].filter(x=>x[1]):[];
  return `<a class="panel cut stack navcard" href="#today" style="gap:6px"><div class="row" style="justify-content:space-between"><span class="eyebrow">Today</span><span class="small mono">${done}/${dd.length} daily done</span></div><div class="nextbar"><i style="width:${dd.length?done/dd.length*100:0}%"></i></div>
   <div class="small">Daily reset in <b>${left(lastDaily()+DAY-now)}</b> · weekly in <b>${left(lastWeekly()+7*DAY-now)}</b></div>
   ${cyc.length?`<div class="row small" style="gap:6px">${cyc.map(([n,c,f])=>`<span class="chip">${n}: ${esc(f(c))} · ${leftOf(c.expiry)}</span>`).join('')}</div>`:''}</a>`}
function goalsCard(){const g=(P.goals||[]).filter(n=>I[n]&&!on('build|'+n));
  return `<section class="panel cut stack" style="gap:6px"><div class="row" style="justify-content:space-between"><span class="eyebrow">Active goals</span><a class="small ln" href="#goals">Goals</a></div>${g.slice(0,4).map(n=>{const k=stepKeys(n);const d=k.filter(on).length;return `<div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><a class="ln ell" href="#" data-go="item|${esc(n)}">${esc(n)}</a><span class="small mono">${d}/${k.length}</span></div><div class="nextbar"><i style="width:${d/k.length*100}%"></i></div></div>`}).join('')||'<span class="small muted">Choose <b>Track</b> on any item to plan it here.</span>'}</section>`}
function quickCard(){const now=Date.now();const fl=(P.foundry||[]).slice().sort((a,b)=>(a.t0+a.dur*1000)-(b.t0+b.dur*1000));const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;const u=SO.uid?unread():null;
  return `<div class="tiles t2"><a class="tile cut" href="#tenno" data-ttab="foundry"><span class="k">Foundry</span><span class="v num">${ready}<small>/${fl.length}</small></span><span class="x">${fl.length?(ready?'Ready to claim':'Next in '+hrs((fl[0].t0+fl[0].dur*1000-now)/1000)):'Nothing building'}</span></a>
   <a class="tile cut" href="#friends"><span class="k">Friends</span><span class="v num">${SO.uid?SO.friends.filter(f=>!f.pending).length:'—'}</span><span class="x">${u&&u.n?u.n+' new':SO.uid?'Message & invite':HOSTED?'Sign in to add':'On tennoform.com'}</span></a></div>`}
function progressCard(){const nd=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,all=ALLN.filter(n=>!isJ(n)).length,J=ALLN.filter(isJ),jd=J.filter(n=>on('n|'+n.id)).length;const qd=Q.filter(q=>on('q|'+q.n)).length;const nq=nextQuest();
  const syn=D.synd.filter(e=>gateOK(e.gate)&&e.ranks.length);const leftNodes=NODES.reduce((a,n)=>a+(on('n|'+n.id)?0:n.x),0);
  return `<div class="tiles t2"><a class="tile cut" href="#missions"><span class="k">Star chart</span><span class="v num">${nd}<small>/${all}</small></span><span class="tbar"><i style="width:${nd/all*100}%"></i></span><span class="x">+${fmt(leftNodes)} MR XP left · junctions ${jd}/${J.length}</span></a>
   <a class="tile cut" href="#quests"><span class="k">Quests</span><span class="v num">${qd}<small>/${Q.length}</small></span><span class="tbar"><i style="width:${qd/Q.length*100}%"></i></span><span class="x">${nq?'Next: '+esc(nq.n):'All done'}</span></a>
   <a class="tile cut" href="#ranks" data-rkcat="Intrinsics"><span class="k">Intrinsics</span><span class="v num">${fmt(catXP('rail')+catXP('drift'))}</span><span class="x">1,500 MR XP per rank</span></a>
   <a class="tile cut" href="#synd"><span class="k">Syndicates</span><span class="v num">${syn.filter(e=>synState(e).r>0).length}<small>/${syn.length}</small></span><span class="tbar"><i style="width:${syn.length?syn.filter(e=>synState(e).r>0).length/syn.length*100:0}%"></i></span><span class="x">Ranked up</span></a></div>`}
const HUB={next:['Next up',nextCard],breakdown:['Mastery breakdown',()=>bdCard()],today:['Today',todayCard],tasks:['My tasks',()=>taskPanel()],goals:['Active goals',goalsCard],easy:['Easiest Mastery XP',easyCard],progress:['Progress',progressCard],quick:['Foundry & friends',quickCard]};
const HUB_DEF={l:['easy','progress'],c:['next','breakdown'],r:['today','tasks','goals','quick']};
function hubLayout(){const h=P.hub||{};const z={l:[],c:[],r:[]};const seen=new Set();
  for(const k of ['l','c','r'])for(const id of ((h.z&&h.z[k])||HUB_DEF[k]))if(HUB[id]&&!seen.has(id)){z[k].push(id);seen.add(id)}
  for(const k of ['l','c','r'])for(const id of HUB_DEF[k])if(!seen.has(id)){z[k].push(id);seen.add(id)}
  return {z,hid:new Set(h.hid||[])}}
function hubGrid(){const {z,hid}=hubLayout();const ed=state.hubEdit;
  const card=(id,zone,i,len)=>{if(hid.has(id)&&!ed)return'';const [title,fn]=HUB[id];
    return ed?`<div class="hcard edit${hid.has(id)?' hidden':''}"><div class="hctl"><b>${esc(title)}</b><span class="row" style="gap:4px"><button type="button" class="btn sm" data-hmv="${id}|up" ${i?'':'disabled'} aria-label="Move ${esc(title)} up">↑</button><button type="button" class="btn sm" data-hmv="${id}|down" ${i<len-1?'':'disabled'} aria-label="Move ${esc(title)} down">↓</button><button type="button" class="btn sm" data-hmv="${id}|left" ${zone==='l'?'disabled':''} aria-label="Move ${esc(title)} left">←</button><button type="button" class="btn sm" data-hmv="${id}|right" ${zone==='r'?'disabled':''} aria-label="Move ${esc(title)} right">→</button><button type="button" class="btn sm" data-hmv="${id}|hide">${hid.has(id)?'Show':'Hide'}</button></span></div>${hid.has(id)?'':fn()}</div>`:`<div class="hcard">${fn()}</div>`};
  const col=k=>`<div class="h${k} stack">${z[k].map((id,i)=>card(id,k,i,z[k].length)).join('')}</div>`;
  return `<div class="row hubbar" style="justify-content:flex-end"><button type="button" class="btn sm" id="hubedit">${ed?'Done':'Customize'}</button>${ed?'<button type="button" class="btn sm" id="hubreset">Reset layout</button>':''}</div>
   <div class="hub3">${col('l')}${col('c')}${col('r')}</div>`}
function hubMove(id,dir){const {z,hid}=hubLayout();let zone=Object.keys(z).find(k=>z[k].includes(id));const a=z[zone];const i=a.indexOf(id);
  if(dir==='hide'){hid.has(id)?hid.delete(id):hid.add(id)}
  else if(dir==='up'&&i>0)[a[i-1],a[i]]=[a[i],a[i-1]];else if(dir==='down'&&i<a.length-1)[a[i+1],a[i]]=[a[i],a[i+1]];
  else if(dir==='left'||dir==='right'){const order=['l','c','r'];const nz=order[order.indexOf(zone)+(dir==='left'?-1:1)];if(nz){a.splice(i,1);z[nz].push(id)}}
  P.hub={z,hid:[...hid]};saveProfile();rerender()}

/* today: custom, pinned, hidden */
function allChecks(){return [...D.checks,...(P.ckCustom||[]).map(x=>[x.p,'cu|'+x.id,x.t,x.p==='d'?'Your own daily':'Your own weekly',''])]}
function ckTools(c){const pin=(P.ckPin||[]).includes(c[1]),hid=(P.ckHide||[]).includes(c[1]);const cu=c[1].startsWith('cu|');
  return `<span class="cktools"><button type="button" class="btn sm ${pin?'on':''}" data-ckpin="${esc(c[1])}" aria-label="${pin?'Unpin':'Pin'} ${esc(c[2])}" title="${pin?'Unpin':'Pin to top'}">${ic('pin',pin?'fill':'')}</button><button type="button" class="btn sm" data-ckhide="${esc(c[1])}" aria-label="${cu?'Delete':hid?'Show':'Hide'} ${esc(c[2])}" title="${cu?'Delete':hid?'Show again':'Hide'}">${cu?ic('close'):hid?'Show':'Hide'}</button></span>`}

/* tasks: notes, repeat, due */
const TKL={res:'Resource',item:'Build',relic:'Relic',quest:'Quest',mod:'Mod',arc:'Arcane',node:'Planet',synd:'Syndicate',fish:'Fish',ore:'Ore',lich:'Weapon',guide:'Guide',way:'Farm',note:'Note'};
function taskResets(){let ch=false;for(const x of P.tasks||[]){if(x.d&&x.rep&&x.dat&&x.dat<(x.rep==='d'?lastDaily():lastWeekly())){x.d=0;ch=true}}if(ch)saveProfile()}
function taskMeta(x){const due=x.due?new Date(x.due+'T23:59:59'):null;const over=due&&!x.d&&due<new Date();
  return `<span class="tmeta">${x.k&&x.k!=='note'?`<span class="chip">${esc(TKL[x.k]||x.k)}</span>`:''}${x.rep?`<span class="chip teal">${ic('repeat')} ${x.rep==='d'?'Daily':'Weekly'}</span>`:''}${due?`<span class="chip ${over?'bad':''}">${over?'Overdue · ':'Due '}${esc(fdate(x.due))}</span>`:''}${x.note?'<span class="chip" title="Has notes">✎</span>':''}</span>`}
function taskEditor(x){return `<div class="tedit"><label class="small" for="tn-${esc(x.id)}">Notes</label><textarea id="tn-${esc(x.id)}" data-tnote="${esc(x.id)}" maxlength="1000" placeholder="Anything to remember: node, squad, how many…">${esc(x.note||'')}</textarea>
  <div class="row"><label class="small" for="tr-${esc(x.id)}">Repeat</label><select id="tr-${esc(x.id)}" data-trep="${esc(x.id)}" style="width:auto"><option value="" ${!x.rep?'selected':''}>Never</option><option value="d" ${x.rep==='d'?'selected':''}>Every daily reset</option><option value="w" ${x.rep==='w'?'selected':''}>Every weekly reset</option></select>
  <label class="small" for="td-${esc(x.id)}">Due</label><input id="td-${esc(x.id)}" type="date" data-tdue="${esc(x.id)}" value="${esc(x.due||'')}" style="width:auto"></div></div>`}

/* syndicate consequences */
function synEffects(e){if(e.kind!=='faction')return'';const st=n=>((P.syn||{})[n]||{});const warn=[e.opp,e.enemy].filter(n=>(+st(n).r||0)>0);
  return `<div class="small syneff"><span class="muted">Per 1,000 earned:</span> <span style="color:var(--ok)">+500 ${esc(e.ally)}</span> · <span style="color:var(--warn)">−500 ${esc(e.opp)}</span> · <span style="color:var(--bad)">−1,000 ${esc(e.enemy)}</span>${warn.length?`<div class="warnline">Lowers your rank with ${warn.map(esc).join(' and ')}.</div>`:''}</div>`}

/* resources: stage-aware farms */
function planetOpen(p){if(['Earth','Mercury','Venus'].includes(p))return true;if(ALLN.some(n=>n.p===p&&!isJ(n)&&on('n|'+n.id)))return true;return ALLN.some(n=>isJ(n)&&new RegExp('To'+p.replace(/\W/g,'')+'Junction$').test(n.id)&&on('n|'+n.id))}

/* backup with preview */
function backupObj(){return {app:'tennoform',v:4,exported:new Date().toISOString(),c:C,p:P}}
function parseBackup(txt){txt=String(txt||'').trim();if(!txt)return null;let o=null;try{o=JSON.parse(txt)}catch(e){try{o=JSON.parse(decodeURIComponent(escape(atob(txt))))}catch(e2){return null}}if(!o||typeof o!=='object'||!o.c||typeof o.c!=='object')return null;return o}
function backupSummary(o){const p=o.p||{};const c=o.c||{};const tick=Object.keys(c).length;const mast=Object.keys(c).filter(k=>/^m\|/.test(k)&&c[k]).length;
  return `<div class="kv small"><span>Exported</span><span>${o.exported?esc(new Date(o.exported).toLocaleString()):'Unknown (older backup)'}</span><span>Name</span><span>${esc(p.tname||(p.prof&&p.prof.name)||'—')}</span><span>Items mastered</span><span>${fmt(mast)}</span><span>Ticks and checkmarks</span><span>${fmt(tick)}</span><span>Ranked items in progress</span><span>${fmt(Object.keys(p.rk||{}).length)}</span><span>Tasks · Goals</span><span>${fmt((p.tasks||[]).length)} · ${fmt((p.goals||[]).length)}</span></div>`}

/* ---- v15 events ---- */
document.addEventListener('click',e=>{const t=e.target.closest('#hubedit,#hubreset,[data-hmv],[data-ckpin],[data-ckhide],#ckadd,[data-tedit],#bkprev,#bkapply,#bkcancel');if(!t)return;
  if(t.id==='hubedit'){state.hubEdit=!state.hubEdit;rerender();return}
  if(t.id==='hubreset'){delete P.hub;saveProfile();rerender();return}
  if(t.dataset.hmv){const [id,d]=t.dataset.hmv.split('|');hubMove(id,d);return}
  if(t.dataset.ckpin){const k=t.dataset.ckpin;P.ckPin=P.ckPin||[];const i=P.ckPin.indexOf(k);i>=0?P.ckPin.splice(i,1):P.ckPin.push(k);saveProfile();rerender();return}
  if(t.dataset.ckhide){const k=t.dataset.ckhide;if(k.startsWith('cu|')){P.ckCustom=(P.ckCustom||[]).filter(x=>'cu|'+x.id!==k);saveProfile();rerender();return}
    P.ckHide=P.ckHide||[];const i=P.ckHide.indexOf(k);if(i>=0)P.ckHide.splice(i,1);else{P.ckHide.push(k);toastAction('Hidden from your checklist','Undo',()=>{P.ckHide=P.ckHide.filter(x=>x!==k);saveProfile();rerender()})}saveProfile();rerender();return}
  if(t.id==='ckadd'){const v=($('#cknew')&&$('#cknew').value||'').trim();if(!v)return;P.ckCustom=P.ckCustom||[];P.ckCustom.push({id:newId(),t:v.slice(0,80),p:($('#ckper')||{}).value==='w'?'w':'d'});saveProfile();rerender();return}
  if(t.dataset.tedit){state.tEdit=state.tEdit===t.dataset.tedit?null:t.dataset.tedit;rerender();return}
  if(t.id==='bkprev'){const o=parseBackup($('#bk-in')&&$('#bk-in').value);if(!o){toast('That isn\'t a Tennoform backup. Paste the whole code or file.');return}state.bkPrev=o;rerender();return}
  if(t.id==='bkcancel'){state.bkPrev=null;rerender();return}
  if(t.id==='bkapply'){const o=state.bkPrev;if(!o)return;const old={c:C,p:JSON.parse(JSON.stringify(P))};C=o.c;for(const k in P)delete P[k];Object.assign(P,o.p||{});lsSet('tenno-codex',C);pushAll();state.bkPrev=null;updateMR();rerender();
    toastAction('Backup restored','Undo',()=>{C=old.c;for(const k in P)delete P[k];Object.assign(P,old.p);lsSet('tenno-codex',C);pushAll();updateMR();rerender()});return}},true);
document.addEventListener('change',e=>{const t=e.target;const x=id=>(P.tasks||[]).find(y=>y.id===id);
  if(t.dataset.tnote){const y=x(t.dataset.tnote);if(y){y.note=t.value.slice(0,1000);saveProfile()}return}
  if(t.dataset.trep!==undefined){const y=x(t.dataset.trep);if(y){y.rep=t.value||undefined;if(!y.rep)delete y.rep;saveProfile();rerender()}return}
  if(t.dataset.tdue!==undefined){const y=x(t.dataset.tdue);if(y){if(t.value)y.due=t.value;else delete y.due;saveProfile();rerender()}return}
  if(t.id==='bkfile'&&t.files&&t.files[0]){t.files[0].text().then(txt=>{const o=parseBackup(txt);if(!o){toast('That file isn\'t a Tennoform backup.');return}state.bkPrev=o;rerender()})}});
document.addEventListener('keydown',e=>{const t=e.target;if(e.key==='Enter'&&t&&t.matches&&t.matches('[data-rkin]')){e.preventDefault();const all=[...document.querySelectorAll('[data-rkin]')];const i=all.indexOf(t);t.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>{const nx=[...document.querySelectorAll('[data-rkin]')][i+1];if(nx){nx.focus();nx.select()}},30)}
  if(e.key==='Enter'&&t&&t.id==='cknew'){e.preventDefault();$('#ckadd')&&$('#ckadd').click()}});
function shopLi(n,q){const known=P.inv&&P.inv[n]!=null;const h=+((P.inv||{})[n]||0);const rem=Math.max(0,q-h);
  return `<li><span></span><span class="q">${L(n)} <span class="mono small">need ${fmt(q)} · have ${known?fmt(h):'?'}${known?(rem?` · <b>${fmt(rem)} left</b>`:' · <span style="color:var(--ok)">✓ enough</span>'):''}</span></span><span class="where">${farmFor(n)}${rem?' '+taskBtn('res',n,'Farm '+fmt(rem)+' '+n):''}</span></li>`}

/* ---------- v16: mobile ---------- */
const PHONE=()=>window.innerWidth<700;
function bdCard(){if(!PHONE())return bdPanel();const t=totalXP(),m=mrInfo(t.total);const open=lsGet('tf-bdopen',false);
  return `<details class="bdwrap"${open?' open':''}><summary class="bdsum"><span class="ring" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></span><span class="bdst"><b>Mastery breakdown</b><span class="small muted mono">${fmt(t.total)} XP · ${fmt(m.next-t.total)} to next rank</span></span><span class="bdchev" aria-hidden="true">▾</span></summary>${bdPanel()}</details>`}
document.addEventListener('toggle',e=>{const d=e.target;if(d.classList&&d.classList.contains('bdwrap'))lsSet('tf-bdopen',d.open);if(d.classList&&d.classList.contains('explore'))lsSet('tf-explore',d.open)},true);
new MutationObserver(()=>document.querySelectorAll('input[type=search]:not([enterkeyhint])').forEach(i=>i.setAttribute('enterkeyhint','search'))).observe(document.getElementById('app'),{childList:true});
let lastW=window.innerWidth;window.addEventListener('resize',()=>{const w=window.innerWidth;if((w<700)!==(lastW<700)&&!(document.activeElement&&document.activeElement.matches('input,textarea,select'))){lastW=w;rerender()}lastW=w});

/* ---------- v17: accessibility, states, search, status, safety ---------- */
let FBST=HOSTED?'loading':'off';
const plain=h=>{const d=document.createElement('div');d.innerHTML=String(h||'');return (d.textContent||'').replace(/\s+/g,' ').trim()};
ck=function(k,cls,lab){return `<input type="checkbox" class="ck ${cls||''}" data-k="${esc(k)}" ${on(k)?'checked':''} aria-label="${esc(lab?'Done: '+lab:'Mark done')}">`};
step=function(k,label,body){return `<li class="step${on(k)?' done':''}">${ck(k,'',plain(label))}<div><div class="lbl">${label}</div>${body?`<div class="src">${body}</div>`:''}</div></li>`};
hit=function([n,t,l]){const s=state.farmSel===t+'|'+n;let st='';
  if(t==='item'&&I[n]){const it=I[n];st=(on('m|'+n)?'<span class="chip good">'+ic('check')+'Mastered</span>':mxChip(n))+(it.p?(it.v&&!(VAULT[n]&&VAULT[n].now)?'<span class="chip bad">Vaulted</span>':'<span class="chip ok">Farmable</span>'):'')}
  else if(t==='relic'&&REL[n])st=REL[n].v?'<span class="chip bad">Vaulted</span>':'<span class="chip ok">Farmable</span>';
  else if(t==='mod')st=on('mod|'+n)?'<span class="chip good">✓ Owned</span>':'';
  else if(t==='res'&&P.inv&&P.inv[n]!=null)st=`<span class="chip">Have ${fmt(P.inv[n])}</span>`;
  else if(t==='part')st=partNeeded(n)?'':'<span class="chip good">✓ Have</span>';
  return `<button type="button" class="hit ${s?'sel':''}" data-pick="${esc(t+'|'+n)}" aria-pressed="${s}"><span>${esc(n)}</span><span class="row hitst">${st}<span class="chip">${esc(l)}</span></span></button>`};
/* screen readers: announce rank-ups and page changes; pressed state on toggle buttons */
const SR=document.createElement('div');SR.className='sr-only';SR.setAttribute('aria-live','polite');SR.setAttribute('role','status');document.body.appendChild(SR);
function announce(t){SR.textContent='';setTimeout(()=>SR.textContent=t,50)}
let lastMR=null;const _updateMR=updateMR;updateMR=function(){_updateMR();const m=mrInfo(totalXP().total).mr;if(lastMR!=null&&m!==lastMR)announce('Mastery rank '+mrLabel(m));lastMR=m};
function a11yPass(){document.querySelectorAll('.seg .btn:not([role=tab])').forEach(b=>b.setAttribute('aria-pressed',b.classList.contains('on')?'true':'false'));
  document.querySelectorAll('.nextbar,.tbar,.rkbar,.prog .track').forEach(b=>b.setAttribute('aria-hidden','true'))}
/* skip link + keyboard shortcut */
(function(){const a=document.createElement('button');a.type='button';a.className='skip';a.textContent='Skip to content';a.onclick=()=>{const m=$('#app');m.setAttribute('tabindex','-1');m.focus()};document.body.insertBefore(a,document.body.firstChild)})();
document.addEventListener('keydown',e=>{if(e.key==='/'&&!(e.target&&e.target.matches&&e.target.matches('input,textarea,select'))&&!e.ctrlKey&&!e.metaKey){e.preventDefault();if(location.hash!=='#farm')location.hash='farm';setTimeout(()=>$('#fq')&&$('#fq').focus(),60)}});
/* the home title matches the one in the page head (build/make_site.py), which is what search results show */
const HOME_TITLE='Tennoform: Warframe Mastery Tracker, Farming Guide and Market Prices';
/* page status: where data lives / how fresh it is */
const STATUS={today:'live',market:'snap',friends:'acct',feedback:'acct',tasks:'save',goals:'save',ranks:'save',missions:'save',quests:'save',synd:'save',relics:'save',arsenal:'save',world:'save',tenno:'save',mastery:'data',resources:'data',farm:'data',frames:'data'};
function statusChip(k){const s=STATUS[k];if(!s)return'';const where=synced?'Saved to your account':'Saved in this browser';
  const map={live:['live','● Live game data'],snap:['','Prices: daily snapshot '+D.meta.prices],acct:['',SO.uid?'Signed in':'Needs sign-in'],save:[synced?'live':'',where],data:['','Game data '+D.meta.built]};const [c,t]=map[s];return `<span class="pstat ${c}">${esc(t)}</span>`}
function afterRender(key,nav){a11yPass();const ey=document.querySelector('#app .head .eyebrow');if(ey&&!ey.querySelector('.pstat'))ey.insertAdjacentHTML('beforeend',statusChip(key));
  document.title=key==='home'?HOME_TITLE:(PL[key]||key)+' · Tennoform';if(nav){const h=document.querySelector('#app h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}}
window.addEventListener('hashchange',()=>setTimeout(()=>afterRender((location.hash||'#home').slice(1),true),0));
/* menu focus handling */
$('#hamb')&&$('#hamb').addEventListener('click',()=>setTimeout(()=>{if($('#drawer').classList.contains('open')){const a=$('#sheet a');a&&a.focus()}},30));
/* block & report */
function blocked(uid){return (P.block||[]).includes(uid)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-fblock],[data-freport]');if(!t)return;
  if(t.dataset.fblock){const uid=t.dataset.fblock;if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Tap to confirm';return}
    P.block=P.block||[];if(!P.block.includes(uid))P.block.push(uid);saveProfile();FB&&FB.fs.collection('users').doc(SO.uid).collection('friends').doc(uid).delete().catch(()=>{});
    SO.inbox.filter(m=>m.from===uid&&m.type==='friend').forEach(m=>FB.fs.collection('inbox').doc(SO.uid).collection('msgs').doc(m.id).delete().catch(()=>{}));state.chat=null;rerender();toast('Blocked. They can\'t message you or send requests.');return}
  if(t.dataset.freport){const [uid,name,code]=t.dataset.freport.split('|');state.fbPrefill=`Report: ${name} (friend code ${code||'?'}, id ${uid}).\nWhat happened: `;state.fbKind='other';state.fbFrom='friends';location.hash='feedback'}});

/* ---------- v18: friction fixes ---------- */
const STARTERS=['Excalibur','Mag','Volt','Mk1-Braton','Mk1-Paris','Mk1-Strun','Braton','Lato','Mk1-Furis','Mk1-Kunai','Skana','Mk1-Bo','Mk1-Furax'].filter(n=>I[n]);
function quickStart(){return `<section class="panel cut stack qs" style="gap:10px;border-color:var(--gold-dim)"><h2>Quick start</h2>
 <p class="small" style="margin:0">Tell Tennoform where you are now; you can fill in details later. Ticking every item by hand is optional and can take a while with 800+ items.</p>
 <div class="qsgrid"><label class="small" for="qsmr">Your Mastery Rank in game</label><input id="qsmr" type="number" min="0" max="60" inputmode="numeric" placeholder="e.g. 8">
 <label class="small" for="qsxp">Total Mastery XP <span class="muted">(optional · Profile → Mastery in game)</span></label><input id="qsxp" type="number" min="0" inputmode="numeric" placeholder="e.g. 208697"></div>
 <fieldset class="qsf"><legend class="small">Starter gear you've already maxed <span class="muted">(optional)</span></legend><div class="gpick">${STARTERS.map(n=>`<label class="small"><input type="checkbox" data-qsitem="${esc(n)}"> ${esc(n)}</label>`).join('')}</div></fieldset>
 <div class="row"><button type="button" class="btn primary" id="qsgo">Save and show my dashboard</button><button type="button" class="btn" data-onb="manual">Skip, I'll track by hand</button></div>
 <div class="small muted">Your MR and XP set your in-game baseline: anything you tick later fills the gap first, so your total always matches the game.</div></section>`}
function moreRow(shown,total){return total>shown?`<div class="more-row" role="status"><span class="small muted">Showing ${fmt(shown)} of ${fmt(total)}</span><button type="button" class="btn" id="rkmore">Show ${fmt(Math.min(60,total-shown))} more</button><button type="button" class="btn sm" id="rkall">Show all</button></div>`:`<div class="more-row"><span class="small muted">${fmt(total)} item${total===1?'':'s'}</span></div>`}
function segKeys(e){const b=e.target.closest&&e.target.closest('.seg .btn');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const all=[...b.parentElement.querySelectorAll('.btn')];let i=all.indexOf(b);
  i=e.key==='Home'?0:e.key==='End'?all.length-1:i+(e.key==='ArrowRight'?1:-1);if(all[i]){e.preventDefault();all[i].focus();all[i].scrollIntoView({inline:'nearest',block:'nearest'})}}
document.addEventListener('keydown',segKeys);
function segActive(){document.querySelectorAll('#app .seg').forEach(s=>{const on=s.querySelector('.btn.on');if(on&&s.scrollWidth>s.clientWidth){const l=on.offsetLeft-s.clientWidth/2+on.offsetWidth/2;s.scrollLeft=Math.max(0,l)}s.classList.toggle('scrolls',s.scrollWidth>s.clientWidth+2)})}
document.addEventListener('click',e=>{const t=e.target.closest('#rkmore,#rkall,#qsgo,[data-tkreset],[data-qsopen]');if(!t)return;
  if(t.id==='rkmore'){state.rkLim=(state.rkLim||60)+60;rerender();return}
  if(t.id==='rkall'){state.rkLim=1e5;rerender();return}
  if(t.dataset.tkreset!==undefined){state.tkF='open';saveUI();rerender();return}
  if(t.dataset.qsopen!==undefined){state.qs=true;rerender();setTimeout(()=>$('#qsmr')&&$('#qsmr').focus(),30);return}
  if(t.id==='qsgo'){const mr=$('#qsmr').value.trim(),xp=$('#qsxp').value.trim();if(mr===''&&xp===''&&!document.querySelector('[data-qsitem]:checked')){toast('Enter your MR, or pick some starter gear');return}
    if(mr!==''){P.gmr=+mr;P.prof=P.prof||{};P.prof.mr=+mr}if(xp!=='')P.gxp=+xp;document.querySelectorAll('[data-qsitem]:checked').forEach(i=>setRank(i.dataset.qsitem,99));
    P.onb='quick';state.qs=false;saveProfile();updateMR();rerender();toast('Saved. Your dashboard now starts from your in-game rank.')}});
setInterval(()=>{if(location.hash==='#today'&&!document.hidden&&!(document.activeElement&&document.activeElement.matches('input,select,textarea'))){const y=scrollY;render();scrollTo(0,y)}},30000);

/* ---- v19: pass B (main loops) ---- */
/* next up: complete, context-aware actions */
function nuLabel(k){const p=k.split('|');if(p[0]==='bp')return 'Get the '+p[1]+' Blueprint';if(p[0]==='part')return 'Get '+p[2];if(p[0]==='built')return 'Build '+p[2];
  if(p[0]==='res')return (p[2]==='main'?'Collect ':'Collect for '+p[2]+': ')+p[3];if(p[0]==='have')return 'Have '+p[2];if(p[0]==='build')return 'Build '+p[1]+' in the Foundry';return k}
function nuSnoozed(id){const z=(P.nuSnz||{})[id];return z&&z>=lastDaily()}
function nuItems(){const out=[];const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;const now=Date.now();
  if(g!=null&&m.mr>g){const lab=m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr;out.push({id:'mr|'+m.mr,s:100,t:`Take your ${lab} test`,why:`You have the XP; in game you're still MR ${g}.`,href:'#mastery',
    pre:['Go to the Mastery shrine in any Relay, or the one in your Orbiter.','You can practise the test for free first.','If you fail, you can try again after 24 hours.'],
    done:()=>{const o={pm:P.prof.mr,g:P.gmr};P.prof.mr=m.mr;P.gmr=m.mr;return ()=>{P.prof.mr=o.pm;P.gmr=o.g}},doneL:'I passed'})}
  const ready=(P.foundry||[]).filter(f=>now>=f.t0+f.dur*1000);if(ready.length)out.push({id:'fd',s:90,t:`Claim ${ready.length} Foundry item${ready.length>1?'s':''}`,why:ready.slice(0,3).map(f=>f.n).join(', '),href:'#tenno',tt:'foundry',
    pre:ready.map(f=>f.n+' is ready'),done:()=>{const f0=P.foundry.slice(),c0=JSON.stringify(C);ready.forEach(f=>{P.foundry=P.foundry.filter(x=>x!==f);if(I[f.n])setK('build|'+f.n,1)});return ()=>{P.foundry=f0;const c1=JSON.parse(c0);Object.keys({...C,...c1}).forEach(e=>{if(!!C[e]!==!!c1[e])setK(e,c1[e]?1:0)})}},doneL:'Claimed'});
  for(const e of D.synd){if(!gateOK(e.gate)||!e.ranks.length)continue;const st=synState(e);const rr=rankRow(e,st.r),nx=rankRow(e,st.r+1);
    if(rr.max!=null&&st.s>=rr.max&&nx.t&&!nuSnoozed('sy|'+e.n)){const cost=[nx.cr?fmt(nx.cr)+' credits':'',...(nx.items||[]).map(([q,n])=>(q>1?fmt(q)+'× ':'')+n)].filter(Boolean);
      out.push({id:'sy|'+e.n,s:80,t:`Rank up with ${e.n}`,why:`You have the standing for ${nx.t}.`,href:'#synd',task:['synd',e.n,'Rank up '+e.n],
        pre:[cost.length?'Costs '+cost.join(', '):'No item cost',`Talk to ${e.n} in a Relay or its hub to rank up`],
        done:()=>{P.syn=P.syn||{};const o=P.syn[e.n]?{...P.syn[e.n]}:null;P.syn[e.n]={...(P.syn[e.n]||{}),r:st.r+1};return ()=>{if(o)P.syn[e.n]=o;else delete P.syn[e.n]}},doneL:'Ranked up'});break}}
  const goal=(P.goals||[]).find(n=>I[n]&&!on('build|'+n)&&!nuSnoozed('g|'+n));if(goal){const k=stepKeys(goal);const d=k.filter(on).length;const rest=k.filter(x=>!on(x));
    out.push({id:'g|'+goal,s:70,t:`Keep going on ${goal}`,why:`${d}/${k.length} steps done · ${whyItem(I[goal])}`,go:'item|'+goal,task:['item',goal,'Build '+goal],
      pre:rest.slice(0,5).map(nuLabel).concat(rest.length>5?[`…and ${rest.length-5} more steps`]:[]),
      done:()=>{setK('build|'+goal,1);return ()=>setK('build|'+goal,0)},doneL:'Built it'})}
  const nq=nextQuest();if(nq&&!qDone(nq.n)&&!nuSnoozed('q|'+nq.n)){const pq=qPrereqs(nq);const other=(nq.req||[]).filter(r=>!pq.some(p=>qClean(r)===p.n));
    out.push({id:'q|'+nq.n,s:Q.indexOf(nq)<12?75:55,t:`Do the quest ${nq.n}`,why:nq.d?nq.d.slice(0,110)+(nq.d.length>110?'…':''):'Next in the story; unlocks new areas and gear.',q:nq.n,task:['quest',nq.n,'Do quest: '+nq.n],
      pre:[...pq.map(p=>(qDone(p.n)?'✓ ':'✗ ')+p.n),...other.map(String)].concat(pq.length||other.length?[]:['No other quests needed first']),
      done:()=>{setK('q|'+nq.n,1);return ()=>setK('q|'+nq.n,0)},doneL:'Completed'})}
  const ez=easiest2(4).find(x=>!nuSnoozed('i|'+x.it.n));if(ez){const it=ez.it;const parts=(it.parts||[]).filter(p=>p.k==='p'||p.k==='i').map(p=>p.n).slice(0,5);
    out.push({id:'i|'+it.n,s:50,t:`Get ${it.n} for +${fmt(ez.gain)} MR XP`,why:whyItem(it),go:'item|'+it.n,task:['item',it.n,'Build '+it.n],
      pre:[parts.length?'Needs '+parts.join(', '):'No parts needed',`Rank it to ${maxRank(it)} to collect the XP`],
      done:()=>{const o={rk:P.rk[it.n],m:on('m|'+it.n)};setRank(it.n,99);return ()=>{if(o.rk==null)delete P.rk[it.n];else P.rk[it.n]=o.rk;if(on('m|'+it.n)!==!!o.m)setK('m|'+it.n,o.m?1:0)}},doneL:'Mastered'})}
  const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const left2=dd.filter(c=>!ckDone(c)).length;
  if(left2&&!nuSnoozed('ck'))out.push({id:'ck',s:45,t:`Finish today's checklist (${left2} left)`,why:`Daily reset in ${left(lastDaily()+DAY-now)}.`,href:'#today',pre:dd.filter(c=>!ckDone(c)).slice(0,5).map(c=>c[2])});
  return out.filter(x=>!nuSnoozed(x.id)).sort((a,b)=>b.s-a.s)}
function nextUp(){return nuItems().slice(0,3)}
let NU=[];
function nextCard(){NU=nextUp();const nz=Object.values(P.nuSnz||{}).filter(z=>z>=lastDaily()).length;
  const open=x=>x.go?`<a class="ln" href="#" data-go="${esc(x.go)}">${esc(x.t)}</a>`:x.q?`<a class="ln" href="#quests" data-q="${esc(x.q)}">${esc(x.t)}</a>`:x.href?`<a class="ln" href="${x.href}" ${x.tt?`data-ttab="${x.tt}"`:''}>${esc(x.t)}</a>`:esc(x.t);
  return `<section class="panel cut stack nextup" style="gap:8px" aria-labelledby="nu-h"><div class="row" style="justify-content:space-between"><h2 id="nu-h">Next up</h2><span class="small muted">${esc(stage())}</span></div>
  ${NU.map((x,i)=>`<div class="nu">${x.go&&x.go.startsWith('item|')&&art(x.go.slice(5),'mini')||`<span class="nun" aria-hidden="true">${i+1}</span>`}<div class="nut"><b>${open(x)}</b><div class="small muted">${esc(x.why)}</div>
   ${x.pre&&x.pre.length?`<details class="nupre"><summary class="small">Details</summary><ul class="small">${x.pre.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></details>`:''}
   <div class="nuact">${x.done?`<button type="button" class="btn sm" data-nudone="${i}">${ic('check')}${esc(x.doneL||'Done')}</button>`:''}${x.task?taskBtn(...x.task):''}<button type="button" class="btn sm ghost" data-nusnz="${i}" aria-label="Not now: ${esc(x.t)}">Not now</button></div></div></div>`).join('')||'<div class="small muted">You\'re all caught up. Pick something from Goals or the rank-up plan.</div>'}
  ${nz?`<button type="button" class="small linkbtn" id="nuunsnz">Show ${nz} snoozed suggestion${nz>1?'s':''}</button>`:''}</section>`}

/* customize: first-use hint, saved status, focus kept */
const _hubGrid=hubGrid;
hubGrid=function(){let g=_hubGrid();const hint=!P.hub&&!lsGet('tf-hubhint',0)&&!state.hubEdit;
  if(state.hubEdit)g=g.replace('<div class="hub3">',`<div class="callout small hubhelp" id="hubhelp">Move cards with the arrow buttons, or hide the ones you don't use. Changes save automatically. ${state.hubSaved?'<span class="chip ok" id="hubsaved">'+ic('check')+'Saved</span>':''}</div><div class="hub3">`);
  else if(hint)g=g.replace('<div class="hub3">',`<div class="callout small row hubhint" style="justify-content:space-between"><span>You can move or hide these cards with <b>Customize</b>, above.</span><button type="button" class="btn sm" id="hubhintx">Got it</button></div><div class="hub3">`);
  return g};
const _hubMove=hubMove;
hubMove=function(id,dir){state.hubSaved=1;_hubMove(id,dir);const {z,hid}=hubLayout();const zone=Object.keys(z).find(k=>z[k].includes(id));
  const name=HUB[id][0],col={l:'left',c:'middle',r:'right'}[zone];announce(dir==='hide'?(hid.has(id)?name+' hidden':name+' shown'):`${name} moved to ${col} column, position ${z[zone].indexOf(id)+1}. Saved.`);
  setTimeout(()=>{const b=document.querySelector(`[data-hmv="${id}|${dir}"]:not([disabled])`)||document.querySelector(`[data-hmv^="${id}|"]:not([disabled])`);if(b)b.focus()},20)};

/* sync & paste: preview before apply */
const _imp=importProfile;let DRY=false,PENDING=null;
function profSum(){const rk={};for(const it of MI){const r=rankOf(it.n);if(r)rk[it.n]=r}const t=totalXP();
  return {xp:t.total,mr:mrInfo(t.total).mr,rk,nodes:ALLN.filter(n=>on('n|'+n.id)).length,sp:ALLN.filter(n=>on('sp|'+n.id)).length,q:Q.filter(q=>qDone(q.n)).length,syn:JSON.stringify(P.syn||{}),intr:catXP('rail')+catXP('drift'),name:(P.prof&&P.prof.name)||P.tname||'',gmr:P.prof&&P.prof.mr}}
function dryImport(txt){const sc=JSON.stringify(C),sp=JSON.stringify(P);const dr=docRef,pr=profRef;const f={ls:lsSet,sv:saveProfile,um:updateMR};const a=profSum();let msg,b;
  docRef=null;profRef=null;lsSet=function(){};saveProfile=function(){};updateMR=function(){};
  try{msg=_imp(txt);b=profSum()}finally{C=JSON.parse(sc);P=JSON.parse(sp);docRef=dr;profRef=pr;lsSet=f.ls;saveProfile=f.sv;updateMR=f.um;lastMR=null;updateMR()}
  return {msg,a,b}}
function diffRows(a,b){const ch=[];for(const n of new Set([...Object.keys(a.rk),...Object.keys(b.rk)])){const x=a.rk[n]||0,y=b.rk[n]||0;if(x!==y)ch.push([n,x,y])}ch.sort((p,q)=>(q[2]-q[1])-(p[2]-p[1]));return ch}
function previewHTML(p){const {a,b,msg}=p.r;const ch=diffRows(a,b);const up=ch.filter(c=>c[2]>c[1]),dn=ch.filter(c=>c[2]<c[1]);const row=(k,x,y,f)=>x===y?'':`<span>${k}</span><span class="num">${f?f(x):x} → <b>${f?f(y):y}</b></span>`;
  const rows=[row('Mastery Rank',a.mr,b.mr),row('Total Mastery XP',a.xp,b.xp,fmt),row('Star chart nodes',a.nodes,b.nodes),row('Steel Path nodes',a.sp,b.sp),row('Quests done',a.q,b.q),row('Intrinsics XP',a.intr,b.intr,fmt),row('In-game MR',a.gmr==null?'—':a.gmr,b.gmr==null?'—':b.gmr),a.name!==b.name?`<span>Name</span><span>${esc(a.name||'—')} → <b>${esc(b.name||'—')}</b></span>`:'',a.syn!==b.syn?'<span>Syndicate ranks</span><span>updated</span>':''].join('');
  const none=!rows&&!ch.length;
  return `<div class="dlgbk" id="prevbk"><div class="dlg panel cut stack" role="dialog" aria-modal="true" aria-labelledby="prev-h" style="gap:10px"><h2 id="prev-h" tabindex="-1">${p.src==='sync'?'Review this sync':'Review this import'}</h2>
   ${none?`<p class="small" style="margin:0">${esc(/^(That|No |Make)/.test(msg||'')?msg:'Nothing would change. Your progress already matches this profile.')}</p>`:`<p class="small muted" style="margin:0">Nothing has changed yet. Here's what applying it would do.</p>
   ${rows?`<div class="kv small">${rows}</div>`:''}
   ${up.length?`<details class="more" ${up.length<=8?'open':''}><summary class="small">${up.length} item${up.length>1?'s':''} ranked up</summary><div class="kv small">${up.slice(0,60).map(([n,x,y])=>`<span>${esc(n)}</span><span class="num">${x} → ${y}</span>`).join('')}${up.length>60?`<span class="muted">…and ${up.length-60} more</span><span></span>`:''}</div></details>`:''}
   ${dn.length?`<details class="more"><summary class="small">${dn.length} lower than what you entered (kept at the higher rank)</summary><div class="kv small">${dn.slice(0,40).map(([n,x,y])=>`<span>${esc(n)}</span><span class="num">${x} → ${y}</span>`).join('')}</div></details>`:''}
   <p class="small muted" style="margin:0">You can undo a sync later from Account &amp; sync.</p>`}
   <div class="row" style="justify-content:flex-end">${none?'':'<button type="button" class="btn primary" id="prevok">Apply changes</button>'}<button type="button" class="btn" id="prevno">${none?'Close':'Cancel'}</button></div></div></div>`}
function showPreview(p){PENDING=p;closePreview(true);document.body.insertAdjacentHTML('beforeend',previewHTML(p));const h=$('#prev-h');if(h)h.focus()}
function closePreview(keep){const el=$('#prevbk');if(el)el.remove();if(!keep){PENDING=null;const b=$('#autosync')||$('#imp');if(b)b.focus()}}
importProfile=function(txt){if(!DRY)return _imp(txt);DRY=false;const src=DRY_SRC;const r=dryImport(txt);const auto=P.auto;showPreview({txt,src,r});
  if(src==='sync')setTimeout(()=>{P.auto=auto;saveProfile()},0);return 'Review the changes, then tap Apply.'};
let DRY_SRC='paste';
document.addEventListener('click',e=>{const t=e.target.closest('#autosync,#imp');if(t){DRY=true;DRY_SRC=t.id==='autosync'?'sync':'paste';setTimeout(()=>{DRY=false},15000)}},true);
document.addEventListener('click',e=>{const t=e.target.closest('#prevok,#prevno,#prevbk');if(!t)return;
  if(t.id==='prevbk'&&e.target!==t)return;
  if(t.id==='prevok'&&PENDING){const p=PENDING;closePreview(true);PENDING=null;DRY=false;const msg=_imp(p.txt);if(p.src==='sync')P.auto=new Date().toISOString();saveProfile();render();toast(msg);return}
  closePreview()});
document.addEventListener('keydown',e=>{const bk=$('#prevbk');if(!bk)return;if(e.key==='Escape'){closePreview();return}
  if(e.key==='Tab'){const f=[...bk.querySelectorAll('button,summary,[tabindex="-1"]')];const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});

/* live events: quick actions */
function ymd(t){const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function ltBtn(t,exp,lab){const has=(P.tasks||[]).some(x=>!x.d&&x.t===t);return `<button type="button" class="btn sm tb${has?' on':''}" data-livetask="${esc(t)}" data-ltexp="${esc(exp||'')}" aria-label="${has?'In your tasks':'Add to your tasks'}: ${esc(t)}">${has?ic('check')+'In tasks':ic('plus')+(lab||'Task')}</button>`}
function relBtn(era){const n=Object.keys(P.rel||{}).filter(r=>REL[r]&&REL[r].era===era&&relCount(r)>0).length;return `<button type="button" class="btn sm" data-fisrel="${esc(era)}" title="${n?'Open your '+era+' relics':'Find '+era+' relics to farm'}">${n?`My ${esc(era)} relics (${n})`:`Find ${esc(era)} relics`}</button>`}

/* tracked by you */
const TRK=`<span class="chip trk" title="Warframe doesn't share this, so it's tracked by you">Tracked by you</span>`;

/* data sources */
function srcLine(kind){const g=`game data v${esc(D.meta.wfcd||'')} · updated ${esc(D.meta.built)}`;
  return `<div class="small muted srcline">${kind==='relic'?`Drop chances from the official drop tables (${g}). Node picks are community favourites.`:kind==='res'?`Farm picks are community recommendations by mission type and level, not measured drop rates. Item data: ${g}.`:kind==='market'?`Prices: warframe.market 7-day averages, snapshot ${esc(D.meta.prices)}.`:`Source: ${g}. Drop chances from the official drop tables.`}</div>`}

/* counts & clear filters */
function countLine(shown,total,what,active,clearId){return `<div class="small muted countline" role="status">${shown===total?`${fmt(total)} ${what}`:`Showing ${fmt(shown)} of ${fmt(total)} ${what}`}${active?` · <button type="button" class="linkbtn small" id="${clearId}">Clear filters</button>`:''}</div>`}
const _saveUI=saveUI;saveUI=function(){_saveUI();lsSet('tenno-uiq',{resQ:state.resQ,farmQ:state.farmQ,mkQ:state.mkQ,mkSort:state.mkSort})};
let _uiqT=null;document.addEventListener('input',e=>{if(e.target.matches('#rq,#fq,#mq')){clearTimeout(_uiqT);_uiqT=setTimeout(()=>{saveUI();const c=$('.countline');if(c&&e.target.id==='rq'){const n=document.querySelectorAll('#rres > .hit').length;if(n)c.textContent=n+' materials match'}},400)}});

/* ---- v19 events ---- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-nudone],[data-nusnz],#nuunsnz,#hubtry,#hubhintx,[data-livetask],[data-fisrel],#rsclear,#mkclear,#rlclear,#ffclear');if(!t)return;
  if(t.dataset.nudone!=null){const x=NU[+t.dataset.nudone];if(!x||!x.done)return;const undo=x.done();saveProfile();updateMR();rerender();
    toastAction(x.t.replace(/^(Take your|Claim|Rank up with|Keep going on|Do the quest|Get|Finish)\s*/,'')+' marked done','Undo',()=>{undo();saveProfile();updateMR();rerender();toast('Undone')});
    setTimeout(()=>{const n=$('#nu-h');if(n){n.setAttribute('tabindex','-1');n.focus()}},30);return}
  if(t.dataset.nusnz!=null){const x=NU[+t.dataset.nusnz];if(!x)return;P.nuSnz=P.nuSnz||{};for(const k in P.nuSnz)if(P.nuSnz[k]<lastDaily())delete P.nuSnz[k];P.nuSnz[x.id]=Date.now();saveProfile();rerender();
    toastAction('Hidden until the daily reset','Undo',()=>{delete P.nuSnz[x.id];saveProfile();rerender()});setTimeout(()=>{const n=$('#nu-h');if(n){n.setAttribute('tabindex','-1');n.focus()}},30);return}
  if(t.id==='nuunsnz'){P.nuSnz={};saveProfile();rerender();return}
  if(t.id==='hubtry'){state.hubSaved=0;lsSet('tf-hubhint',1);state.hubEdit=true;rerender();setTimeout(()=>{const b=$('#hubedit');if(b)b.focus()},30);return}
  if(t.id==='hubhintx'){lsSet('tf-hubhint',1);rerender();return}
  if(t.dataset.livetask){const tx=t.dataset.livetask;if((P.tasks||[]).some(x=>!x.d&&x.t===tx)){toast('Already in your tasks');return}const ex=t.dataset.ltexp;addTask('note','',tx,ex?{due:ymd(ex)}:{});rerender();toast('Added to your tasks');return}
  if(t.dataset.fisrel){const era=t.dataset.fisrel;const n=Object.keys(P.rel||{}).some(r=>REL[r]&&REL[r].era===era&&relCount(r)>0);
    if(n){state.rlTab='mine';state.rlE=era;saveUI();location.hash='#relics'}else{state.farmQ=era;state.ffT='relic';state.unvOnly=true;saveUI();location.hash='#farm'}return}
  if(t.id==='rsclear'){state.resQ='';state.rsF='all';saveUI();rerender();return}
  if(t.id==='mkclear'){state.mkQ='';state.mkF='all';saveUI();rerender();return}
  if(t.id==='rlclear'){state.rlE='all';saveUI();rerender();return}
  if(t.id==='ffclear'){state.farmQ='';state.ffT='all';state.ffC='';state.unvOnly=false;saveUI();rerender();return}});
/* reset layout with undo */
document.addEventListener('click',e=>{const t=e.target.closest('#hubreset');if(!t)return;e.stopPropagation();const o=P.hub;delete P.hub;saveProfile();rerender();announce('Layout reset');
  toastAction('Home layout reset','Undo',()=>{P.hub=o;saveProfile();rerender()})},true);

/* ---------- phone detail sheet: picking a result opens its detail over the list ---------- */
let SHEET=null;
const isPhone=()=>window.innerWidth<900;
function sheetOpen(sel,push){const el=$(sel);if(!el||!isPhone()||!el.innerHTML.trim())return;SHEET=sel;el.classList.add('msheet');el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Details');
  if(!el.querySelector(':scope > .msheet-bar'))el.insertAdjacentHTML('afterbegin','<div class="msheet-bar"><span class="msheet-grip" aria-hidden="true"></span><button type="button" class="btn sm" data-sheetx>Close</button></div>');
  document.body.classList.add('sheet-on');if(push)history.pushState({sheet:1},'');el.scrollTop=0;setTimeout(()=>{const b=el.querySelector('[data-sheetx]');b&&b.focus()},40)}
function sheetClose(fromPop){const el=SHEET&&$(SHEET);SHEET=null;document.body.classList.remove('sheet-on');if(el){el.classList.remove('msheet');el.removeAttribute('role');el.removeAttribute('aria-modal');const bar=el.querySelector(':scope > .msheet-bar');bar&&bar.remove()}
  if(!fromPop&&history.state&&history.state.sheet)history.back()}
function sheetRestore(){if(SHEET){const s=SHEET;SHEET=null;if($(s)&&$(s).innerHTML.trim())sheetOpen(s,false);else{document.body.classList.remove('sheet-on')}}}
document.addEventListener('click',e=>{if(e.target.closest('[data-sheetx]')){sheetClose(false);return}
  if(!isPhone())return;const p=e.target.closest('#fres [data-pick]');if(p){setTimeout(()=>sheetOpen('#fdet',true),60);return}
  const r=e.target.closest('#rres [data-go^="res|"]');if(r)setTimeout(()=>sheetOpen('#rdet',true),80)});
window.addEventListener('popstate',()=>{if(SHEET)sheetClose(true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&SHEET)sheetClose(false)});
window.addEventListener('hashchange',()=>{if(SHEET)sheetClose(true)});
document.addEventListener('click',e=>{if(e.target.closest('#mkmore')){state.mkLim=(state.mkLim||60)+60;rerender()}});
document.addEventListener('click',e=>{if(e.target.closest('#ffmore')){state.ffLim=(state.ffLim||60)+60;$('#fres').innerHTML=resultsHTML()}});
document.addEventListener('change',e=>{if(e.target.id==='fft'){state.ffC='';state.ffLim=60}if(e.target.id==='ffc')state.ffLim=60},true);
/* ---------- search: Ctrl+K, "/" or the header button; any page, item, relic, quest or planet ---------- */
const PAGE_ALIAS={today:'dailies daily reset fissures sortie nightwave baro arbitration',synd:'standing reputation rep sigil',market:'prices plat platinum trade sell',missions:'nodes planets junctions star chart',ranks:'mastery mr level',mastery:'rank up plan mr test',farm:'drop drops where farm',relics:'void relic refine radiant ducats',friends:'squad clan chat message group',tasks:'todo to-do checklist',goals:'wishlist track tracked',world:'fishing mining fish ore open worlds cetus fortuna deimos',arsenal:'arsenal builds mods loadout arcane lich sister',frames:'warframe frames helminth',tenno:'tenno profile account sync backup foundry inventory import',home:'hub dashboard',quests:'story quest',resources:'materials resources',donate:'support donate paypal',feedback:'bug idea',about:'privacy changelog new'};
let CMDX=null;
function cmdIndex(){if(typeof lazyLoad==='function'){lazyLoad('guides');lazyLoad('ways')}if(CMDX)return CMDX;const x=[];const add=(n,g,act,extra)=>x.push({n,g,act,l:n.toLowerCase(),a:(extra||'').toLowerCase()});
  for(const [r,l] of PAGES)add(SUBL[r]||l,'Pages','#'+r,PAGE_ALIAS[r]);
  for(const n in I)add(n,'Gear','item|'+n,I[n].c);
  for(const n in RES)add(n,'Resources','res|'+n);
  for(const n in REL)add(n+' Relic','Relics','relic|'+n);
  for(const n in MODS)add(n,'Mods','mod|'+n);
  for(const n in ARC)add(n,'Arcanes','arc|'+n);
  for(const q of Q)add(q.n,'Quests','quest|'+q.n);
  for(const p of [...new Set(ALLN.map(n=>n.p).filter(Boolean))])add(p,'Planets','node|'+p);
  for(const e of D.synd)add(e.n,'Syndicates','#synd');
  return CMDX=x}
const CMDG=['Pages','Gear','Resources','Relics','Quests','Planets','Syndicates','Mods','Arcanes'];
function cmdFind(q){q=q.toLowerCase().trim().replace(/\s+/g,' ');if(!q)return [];const w=q.split(' ');const out=[];
  for(const e of cmdIndex()){const words=e.l.split(/[\s\-']+/);let s=null;
    if(e.l===q)s=0;else if(w.every(t=>words.includes(t)))s=1;else if(e.l.startsWith(q))s=1.5;else if(w.every(t=>words.some(x=>x.startsWith(t))))s=2;else if(e.a&&w.every(t=>e.a.split(' ').some(x=>x.startsWith(t))))s=2.5;else if(q.length>2&&e.l.includes(q))s=3;
    if(s!=null)out.push([s+CMDG.indexOf(e.g)*.01+e.n.length*.0001,e])}
  out.sort((a,b)=>a[0]-b[0]);const per={};return out.map(x=>x[1]).filter(e=>(per[e.g]=(per[e.g]||0)+1)<=(e.g==='Pages'?4:6)).slice(0,24)}
let CMDI=0,CMDR=[],CMDLAST=null;
function cmdOpen(){if(window.TF_UI&&TF_UI.openSearch){TF_UI.openSearch();return}if($('#cmdbk'))return;CMDLAST=document.activeElement;document.body.insertAdjacentHTML('beforeend',`<div class="dlgbk" id="cmdbk"><div class="cmd" role="dialog" aria-modal="true" aria-label="Search Tennoform">
  <div class="cmdin">${ic('search')}<input id="cmdq" type="text" role="combobox" aria-expanded="true" aria-controls="cmdres" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Search gear, relics, quests, planets, pages…" enterkeyhint="go"><button type="button" class="btn sm" data-cmdx>Esc</button></div>
  <div id="cmdres" role="listbox" aria-label="Results"></div><div class="cmdfoot small muted">↑ ↓ to move · Enter to open · Esc to close · <kbd>?</kbd> for shortcuts</div></div></div>`);
  cmdPaint();setTimeout(()=>$('#cmdq').focus(),10)}
function cmdClose(){const b=$('#cmdbk');if(b)b.remove();if(CMDLAST&&CMDLAST.focus&&document.contains(CMDLAST))CMDLAST.focus()}
function cmdPaint(){const q=$('#cmdq')?$('#cmdq').value:'';CMDR=cmdFind(q);CMDI=Math.min(CMDI,Math.max(0,CMDR.length-1));const box=$('#cmdres');if(!box)return;
  if(!q.trim()){box.innerHTML=`<div class="cmdhint small muted">Try “mag p”, “neuro”, “axi”, “vox”, “fissures” or “standing”.</div>`;$('#cmdq').removeAttribute('aria-activedescendant');return}
  if(!CMDR.length){box.innerHTML=`<div class="cmdhint small muted">Nothing matches “${esc(q)}”.</div>`;return}
  let h='',g=null;CMDR.forEach((e,i)=>{if(e.g!==g){if(g)h+='</div>';g=e.g;h+=`<div role="group" aria-label="${e.g}"><div class="cmdg small muted" aria-hidden="true">${e.g}</div>`}
    h+=`<div class="cmdo${i===CMDI?' on':''}" role="option" id="cmd-${i}" aria-selected="${i===CMDI}" data-cmdi="${i}">${e.g==='Gear'?art(e.n,'mini')||'<span class="mini"></span>':''}<span class="cmdn">${esc(e.n)}</span><span class="small muted">${e.g==='Gear'?esc(I[e.n].c):e.g==='Pages'?'Page':esc(e.g.replace(/s$/,''))}</span></div>`});
  box.innerHTML=h+'</div>';$('#cmdq').setAttribute('aria-activedescendant','cmd-'+CMDI);const on=$('#cmd-'+CMDI);on&&on.scrollIntoView({block:'nearest'})}
function cmdGo(e){cmdClose();if(!e)return;const a=e.act;
  if(a[0]==='#'){if(location.hash===a)render();else location.hash=a.slice(1);return}
  if(a.startsWith('quest|')){state.qFocus=a.slice(6);state.qF='all';if(location.hash==='#quests')render();else location.hash='quests';return}
  go(a)}
document.addEventListener('input',e=>{if(e.target.id==='cmdq'){CMDI=0;cmdPaint()}});
document.addEventListener('keydown',e=>{const typing=e.target&&e.target.matches&&e.target.matches('input,textarea,select,[contenteditable]');
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#cmdbk')?cmdClose():cmdOpen();return}
  if($('#cmdbk')){if(e.key==='Escape'){e.preventDefault();cmdClose()}else if(e.key==='ArrowDown'){e.preventDefault();CMDI=Math.min(CMDI+1,CMDR.length-1);cmdPaint()}else if(e.key==='ArrowUp'){e.preventDefault();CMDI=Math.max(CMDI-1,0);cmdPaint()}else if(e.key==='Enter'&&e.target.id==='cmdq'){e.preventDefault();cmdGo(CMDR[CMDI])}else if(e.key==='Tab'){e.preventDefault();$('#cmdq').focus()}return}
  if(typing||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='/'){e.preventDefault();e.stopImmediatePropagation();cmdOpen();return}
  if(e.key==='?'){e.preventDefault();keysOpen();return}
  if(/^[1-5]$/.test(e.key)&&!$('#keysbk')&&!$('#prevbk')){const p=PLACES[+e.key-1];location.hash=placeLast(p)}},true);
document.addEventListener('click',e=>{if(e.target.closest('#srchbtn')){cmdOpen();return}
  const o=e.target.closest('[data-cmdi]');if(o){cmdGo(CMDR[+o.dataset.cmdi]);return}
  if(e.target.closest('[data-cmdx]')||e.target.id==='cmdbk'){cmdClose();return}
  if(e.target.closest('[data-keysx]')||e.target.id==='keysbk'){keysClose()}});
/* shortcuts sheet */
function keysOpen(){if($('#keysbk'))return;CMDLAST=document.activeElement;const k=[['Ctrl K or /','Search everything'],['1 – 5','Home, Plan, Farm, Today, Squad'],['?','Show these shortcuts'],['Esc','Close a menu, panel or dialog'],['← →','Move between category buttons'],['Enter (in a rank box)','Save and jump to the next item']];
  document.body.insertAdjacentHTML('beforeend',`<div class="dlgbk" id="keysbk"><div class="dlg panel stack" role="dialog" aria-modal="true" aria-labelledby="keys-h" style="gap:10px"><h2 id="keys-h" tabindex="-1">Keyboard shortcuts</h2><div class="kv small">${k.map(([a,b])=>`<span><kbd>${a}</kbd></span><span>${b}</span>`).join('')}</div><div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-keysx>Close</button></div></div></div>`);
  setTimeout(()=>$('#keys-h').focus(),10)}
function keysClose(){const b=$('#keysbk');if(b)b.remove();if(CMDLAST&&CMDLAST.focus&&document.contains(CMDLAST))CMDLAST.focus()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#keysbk'))keysClose()});
/* phones: hide the bottom bar while typing and keep the field in view */
document.addEventListener('focusin',e=>{if(window.innerWidth<900&&e.target.matches('input:not([type=checkbox]):not([type=radio]),textarea,select')){document.body.classList.add('typing');setTimeout(()=>{try{e.target.scrollIntoView({block:'center'})}catch(x){}},250)}});
document.addEventListener('focusout',()=>setTimeout(()=>{if(!(document.activeElement&&document.activeElement.matches('input:not([type=checkbox]),textarea,select')))document.body.classList.remove('typing')},50));
/* ---------- guides: quests, unlockable systems and mission types, step by step ---------- */
const GUIDES=D.guides||[];const GIDX=Object.fromEntries(GUIDES.map(g=>[g.id,g]));
/* guides and farm "ways" come as their own files (bundle/guides-*.json, bundle/ways-*.json), fetched just after the page is up,
   or straight away when a page or search needs them; the search index is rebuilt when they arrive */
const LAZY={guides:{done:GUIDES.length>0,busy:false,err:false,add:j=>{GUIDES.push(...j);Object.assign(GIDX,Object.fromEntries(j.map(g=>[g.id,g])))}}};
function lazyLoad(k){const L=LAZY[k];const url=L&&L.url?L.url():D.lazy&&D.lazy[k];if(!L||L.done||L.busy||!url)return;L.busy=true;L.err=false;
  fetch(url).then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{L.add(j);L.done=true;CMDX=null;IDX=null})
    .catch(()=>{L.err=true}).finally(()=>{L.busy=false;if(typeof render==='function')try{render()}catch(e){}tfNotify()})}
const lazyLoading=k=>!!(LAZY[k]&&!LAZY[k].done&&!LAZY[k].err);
/* files marked demand load only when something asks for them (e.g. price history when a chart opens) */
setTimeout(()=>Object.keys(LAZY).filter(k=>!LAZY[k].demand).forEach(lazyLoad),1200);
const GKIND={quest:'Quests',system:'Unlocks',mode:'Missions'};
const guideOfQuest=n=>GUIDES.find(g=>g.kind==='quest'&&g.n===n);
function guideKey(n){if(I[n])return 'item|'+n;if(Q.some(q=>q.n===n))return 'quest|'+n;if(RES[n])return 'res|'+n;if(MODS[n])return 'mod|'+n;if(ARC[n])return 'arc|'+n;const g=GUIDES.find(x=>x.n===n);return g?'guide|'+g.id:''}
function guideSteps(id){return ((P.gd||{})[id])||[]}
function guideUnlock(g){const m=mrInfo(totalXP().total).mr;const u=g.unlock||{};
  const qs=(u.quests||[]).map(n=>({n,done:qDone(n),guide:(guideOfQuest(n)||{}).id||''}));
  const mrOk=u.mr==null||m>=u.mr;return {mr:u.mr==null?null:u.mr,mrHave:m,mrOk,quests:qs,other:u.other||[],ready:mrOk&&qs.every(q=>q.done)}}
/* search: guides first, matched by name and everyday words ("helminth chair") */
const _cmdIndex=cmdIndex;cmdIndex=function(){if(CMDX)return CMDX;const x=_cmdIndex();
  for(const g of GUIDES)x.push({n:g.n+(g.kind==='quest'?' guide':''),g:'Guides',act:'guide|'+g.id,l:(g.n+(g.kind==='quest'?' guide':'')).toLowerCase(),a:[...(g.aka||[]),GKIND[g.kind]||'',...(g.was||[])].join(' ').toLowerCase().replace(/[^a-z0-9 ]+/g,' ')});
  return CMDX=x};
CMDG.unshift('Guides');
const CMD_STOP=new Set(['how','to','do','i','get','the','a','an','unlock','unlocking','unlocked','where','is','what','find','for','can','you','my','in','of','guide','quest','open','start','make','build','farm','obtain']);
const _cmdFind=cmdFind;cmdFind=function(q){const raw=(q||'').toLowerCase().replace(/[.?!,:;_]+/g,' ').trim();const k=raw.split(/\s+/).filter(w=>w&&!CMD_STOP.has(w)).join(' ');
  if(k&&k!==raw){const r=_cmdFind(k);if(r.length)return r}return _cmdFind(raw)};
const _go=go;go=function(t){if(t.startsWith('guide|')){state.gSel=t.slice(6);state.gQ='';if(location.hash!=='#guides')location.hash='guides';else render();window.scrollTo(0,0);return}_go(t)};
function guides(){const k=state.gF||'all';const L=GUIDES.filter(g=>k==='all'||g.kind===k);
  return `<div class="stack"><div class="head"><div class="eyebrow">Plan</div><h1>Guides</h1><p class="lede">Step-by-step guides for every quest, unlockable system and mission type.</p></div>
  <div class="panel cut stack">${L.map(g=>`<a class="ln" href="#" data-go="guide|${esc(g.id)}">${esc(g.n)}</a>`).join('<br>')||'No guides yet.'}</div></div>`}
/* ---------- router ---------- */
const routes={home,today,ranks,synd,goals,tenno,missions,resources,mastery,frames,farm,quests,market,arsenal,relics:relicsPage,world,tasks,friends,donate,feedback,about,admin:backend,achievements};
let state={frame:null,farmQ:'',farmSel:null,mTab:'path',mkTab:'sets',mkSort:'a7',mkQ:'',budget:false,build:0,unvOnly:false,allCat:'Warframe',allHide:false,allQ:'',qFocus:null,resSel:null,resQ:'',planet:null,misHide:false,target:null,tTab:'profile',invQ:'',rkCat:'Warframe',rkQ:'',rkF:'all'};
Object.assign(state,lsGet('tenno-ui',{}));Object.assign(state,(()=>{const q=lsGet('tenno-uiq',{})||{};return {resQ:q.resQ||state.resQ||'',farmQ:q.farmQ||state.farmQ||'',mkQ:q.mkQ||state.mkQ||'',mkSort:q.mkSort||state.mkSort||'a7'}})());
if(!['path','ladder','sheet','sframes','craft','xp'].includes(state.mTab))state.mTab='path';
function saveUI(){lsSet('tenno-ui',{ckF:state.ckF,fiF:state.fiF,fiM:state.fiM,syF:state.syF,syS:state.syS,syH:state.syH,gS:state.gS,hF:state.hF,qF:state.qF,misType:state.misType,rsF:state.rsF,ffT:state.ffT,ffC:state.ffC,frF:state.frF,mkF:state.mkF,rkS:state.rkS,rkCat:state.rkCat,rkF:state.rkF,frame:state.frame,mTab:state.mTab,budget:state.budget,allCat:state.allCat,allHide:state.allHide,mkTab:state.mkTab,tTab:state.tTab,misHide:state.misHide,aTab:state.aTab,wbC:state.wbC,wbO:state.wbO,wbSel:state.wbSel,cbSel:state.cbSel,lF:state.lF,lS:state.lS,arT:state.arT,arS:state.arS,arO:state.arO,kmT:state.kmT,kmS:state.kmS,rlTab:state.rlTab,rlE:state.rlE,rlO:state.rlO,raE:state.raE,duF:state.duF,duO:state.duO,wTab:state.wTab,fR:state.fR,fRr:state.fRr,fT:state.fT,mR:state.mR,tkF:state.tkF,tkS:state.tkS})}
function render(){const r=(location.hash||'#home').slice(1);const key=routes[r]?r:'home';
  navPaint(key);
  setMenu(false);
  $('#app').innerHTML=demoBar()+subnav(key)+routes[key]()+siteFoot();refresh();bindPage(key);updateMR();afterRender(key,false);segActive();sheetRestore()}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});

/* ---------- home ---------- */
function sheetItems(){const s=new Set();M.weapons.forEach(w=>w.id&&s.add(w.id));M.companions.forEach(w=>w.id&&s.add(w.id));M.frames.forEach(w=>w.id&&s.add(w.id));M.craft.forEach(x=>x.targets.forEach(t=>t.id&&s.add(t.id)));return [...s]}
function bigMR(){const t=totalXP(),m=mrInfo(t.total);const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length;
  return `<div class="panel stack cut" id="bigmr"><div class="bigmr"><div class="ring" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></div><div class="stack" style="gap:4px;min-width:0"><div class="eyebrow">${m.mr>30?'Legendary rank':'Mastery rank'}</div><div class="num" style="font-size:20px;font-weight:600">${fmt(t.total)} XP</div><div class="small muted">${fmt(m.next-t.total)} XP to ${m.mr>=30?'L'+(m.mr-29):'MR '+(m.mr+1)}${P.mr!=null?` · in-game at last sync: ${mrLabel(P.mr)}`:''}</div></div></div>
  <div class="bd"><span>Gear (${maxed} maxed)</span><span class="num">${fmt(t.it)}</span><span>Star chart nodes</span><span class="num">${fmt(t.ch)}</span><span>Steel Path nodes</span><span class="num">${fmt(t.sp)}</span><span>Intrinsics</span><span class="num">${fmt(t.intr)}</span>${t.other?`<span>Other gear</span><span class="num">${fmt(t.other)}</span>`:''}${t.adj?`<span>Manual adjustment</span><span class="num">${fmt(t.adj)}</span>`:''}${t.un?`<span style="color:var(--warn)">Unaccounted (in game)</span><span class="num" style="color:var(--warn)">${fmt(t.un)}</span>`:''}</div></div>`}
/* ---------- hub (home) ---------- */
function easiest(k){const cur=Math.max(mrInfo(totalXP().total).mr,1);return MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=Math.min(cur,30)).map(it=>({it,gain:mxp(it)-itemXP(it.n),e:ease(it)})).filter(x=>x.gain>0).sort((a,b)=>a.e-b.e||b.gain-a.gain).slice(0,k)}
function heroHTML(){const t=totalXP(),m=mrInfo(t.total);const name=P.tname||(P.prof&&P.prof.name)||'Tenno';const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length;
  return `<section class="hero cut" id="hero"><div class="ring big" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></div>
  <div class="hero-t"><div class="eyebrow">${m.mr>30?'Legendary rank':'Mastery rank'} ${mrLabel(m.mr)}${P.prof&&P.prof.mr!=null?` · in-game ${mrLabel(P.prof.mr)}`:''}</div><h1>${esc(name)}</h1>
  <div class="xpline"><b class="num">${fmt(t.total)}</b> <span class="muted">/ ${fmt(m.next)} XP</span></div>
  <div class="nextbar"><i style="width:${m.pct.toFixed(1)}%"></i></div>
  <div class="small muted">${fmt(m.next-t.total)} XP to ${m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1)} · ${maxed} items mastered</div>
  <div class="row" style="margin-top:6px"><a class="btn primary" href="#ranks">Update ranks</a><a class="btn" href="#tenno" data-ttab="breakdown">Breakdown</a><a class="btn" href="#mastery">Rank-up plan</a></div></div></section>`}
function syncCard(){const L2=P.lastSync;if(!L2)return'';return `<div class="panel cut stack" style="gap:6px"><div class="row" style="justify-content:space-between"><span class="eyebrow">Last sync · ${fdate(L2.at)}</span><a class="small ln" href="#tenno" data-ttab="account">Sync again</a></div>
  <div class="row small" style="gap:6px"><span class="chip good">${L2.maxed} mastered</span><span class="chip teal">${L2.partial} in progress</span><span class="chip">${L2.nodes} nodes</span><span class="chip">${L2.quests.length} quests detected</span><span class="chip">${L2.synd} syndicates</span><span class="chip">${L2.owned} items owned → crafting steps ticked</span></div>
  ${L2.quests.length?`<div class="small muted">Quests detected from your account: ${L2.quests.map(q=>esc(q)).join(', ')}.</div>`:''}</div>`}
/* ---------- home: one question, five groups ---------- */
function mrCard(){const t=totalXP(),m=mrInfo(t.total);const name=P.tname||(P.prof&&P.prof.name)||'';const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;
  const toNext=m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1);const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length;
  const stale=P.wfid&&(!P.auto||Date.now()-Date.parse(P.auto)>864e5);
  const act=HOSTED&&!P.at&&!P.wfid?`<a class="btn primary" href="#tenno" data-ttab="account">Link Warframe profile</a>`
    :HOSTED&&stale?`<button type="button" class="btn primary" id="autosync">Update from Warframe</button>`
    :`<a class="btn primary" href="#mastery">See rank-up plan</a>`;
  const parts=[['Gear',t.it,'var(--gold)'],['Star chart',t.ch,'var(--gold-dim)'],['Steel Path',t.sp,'var(--ink2)'],['Intrinsics',t.intr,'var(--line2)'],['Other',(t.other||0)+(t.adj||0)+(t.un||0),'var(--line)']].filter(p=>p[1]>0);
  const sum=parts.reduce((a,p)=>a+p[1],0)||1;
  return `<section class="mrcard" aria-labelledby="mr-h"><div class="mrtop"><div class="ring big" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></div>
   <div class="mrtxt"><h1 id="mr-h">${name?esc(name):(m.mr>30?'Legendary '+(m.mr-30):'Mastery rank '+m.mr)}</h1>
   <div class="small muted">${name?(m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr)+' · ':''}${g!=null&&g!==m.mr?`in game MR ${mrLabel(g)} · `:''}${maxed} items mastered</div>
   <div class="mrxp"><b>${fmt(t.total)}</b> <span class="muted">/ ${fmt(m.next)} XP · ${fmt(m.next-t.total)} to ${toNext}</span></div></div></div>
   <div class="small muted bdlab">Where your Mastery XP comes from</div>
   <div class="bdbar" role="img" aria-label="Mastery XP by source: ${parts.map(p=>p[0]+' '+fmt(p[1])).join(', ')}">${parts.map(p=>`<i style="width:${(p[1]/sum*100).toFixed(2)}%;background:${p[2]}"></i>`).join('')}</div>
   <div class="bdleg small">${parts.map(p=>`<span><i style="background:${p[2]}" aria-hidden="true"></i>${p[0]} <b>${fmt(p[1])}</b></span>`).join('')}</div>
   <div class="row mract">${act}<a class="btn" href="#ranks">Update ranks</a><a class="ln small" href="#tenno" data-ttab="breakdown">Full breakdown</a><button type="button" class="linkbtn small" data-share>Share progress</button></div></section>`}

/* since last time: compare with the totals from the previous visit (at least 30 minutes ago) */
let SEEN=null;
function seenNow(){const t=totalXP();return {t:Date.now(),xp:t.total,mr:mrInfo(t.total).mr,maxed:MI.filter(i=>itemXP(i.n)>=mxp(i)).length,q:Q.filter(q=>qDone(q.n)).length}}
function sinceLast(){const cur=seenNow();if(!SEEN){const prev=lsGet('tf-seen',null);SEEN=prev&&cur.t-prev.t>30*60e3?prev:(prev||cur);if(!prev||cur.t-prev.t>30*60e3)lsSet('tf-seen',cur)}
  const now=Date.now();const ready=(P.foundry||[]).filter(f=>now>=f.t0+f.dur*1000).length;const bits=[];
  if(SEEN!==cur&&SEEN.t<cur.t){if(cur.mr>SEEN.mr)bits.push(`MR ${SEEN.mr} → ${cur.mr}`);if(cur.maxed>SEEN.maxed)bits.push(`+${cur.maxed-SEEN.maxed} mastered`);if(cur.xp>SEEN.xp)bits.push(`+${fmt(cur.xp-SEEN.xp)} XP`);if(cur.q>SEEN.q)bits.push(`+${cur.q-SEEN.q} quest${cur.q-SEEN.q>1?'s':''}`)}
  if(ready)bits.push(`<a class="ln" href="#tenno" data-ttab="foundry">${ready} ready in the Foundry</a>`);
  return bits.length?`<p class="since small"><span class="muted">Since last time:</span> ${bits.join(' · ')}</p>`:''}

/* today strip: what is on before the next reset */
function todayStrip(){const now=Date.now();if(HOSTED&&!WS&&!WSerr)loadWS();const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const done=dd.filter(ckDone).length;
  const fl=(P.foundry||[]);const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;const tiles=[];
  tiles.push(`<a class="ts" href="#today"><span class="k">Daily reset</span><b>${lastDaily()+DAY-now<60000?'Resetting…':left(lastDaily()+DAY-now)}</b><span class="x">${done}/${dd.length} done</span></a>`);
  {const lg=logList().filter(e=>e.t>=lastDaily()&&e.k!=='sync');const xp=lg.reduce((a,e)=>a+(e.xp||0),0);tiles.push(`<a class="ts" href="#achievements"><span class="k">Done today</span><b>${lg.length} thing${lg.length===1?'':'s'}</b><span class="x">${xp?'+'+fmt(xp)+' XP · ':''}Achievements</span></a>`)}
  if(WS&&WS.sortie&&WS.sortie.variants)tiles.push(`<a class="ts" href="#today"><span class="k">Sortie</span><b>${esc(WS.sortie.boss||'Today')}</b><span class="x">${leftOf(WS.sortie.expiry)}</span></a>`);
  if(WS&&WS.fissures){const need=neededEras();const n=WS.fissures.filter(x=>!x.expired&&new Date(x.expiry)>now&&need[x.tier]).length;if(Object.keys(need).length)tiles.push(`<a class="ts" href="#today"><span class="k">Fissures you need</span><b>${n}</b><span class="x">${Object.keys(need).slice(0,3).join(', ')}</span></a>`)}
  if(WS&&WS.steelPath&&WS.steelPath.currentReward)tiles.push(`<a class="ts" href="#today"><span class="k">Steel Path reward</span><b>${esc(WS.steelPath.currentReward.name)}</b><span class="x">${WS.steelPath.currentReward.cost} essence</span></a>`);
  if(fl.length)tiles.push(`<a class="ts" href="#tenno" data-ttab="foundry"><span class="k">Foundry</span><b>${ready}/${fl.length} ready</b><span class="x">${ready?'Claim in game':'Next in '+hrs((Math.min(...fl.map(f=>f.t0+f.dur*1000))-now)/1000)}</span></a>`);
  tiles.push(`<a class="ts" href="#today"><span class="k">Weekly reset</span><b>${left(lastWeekly()+7*DAY-now)}</b><span class="x">Monday 00:00 UTC</span></a>`);
  return `<section aria-labelledby="ts-h"><div class="hsec"><h2 id="ts-h">Today</h2><a class="ln small" href="#today">All of today</a></div><div class="tstrip">${tiles.join('')}</div></section>`}

function homeGoals(){const g=(P.goals||[]).filter(n=>I[n]&&!on('build|'+n));
  return `<section aria-labelledby="hg-h"><div class="hsec"><h2 id="hg-h">Goals</h2><a class="ln small" href="#goals">${g.length>3?'All '+g.length:'Goals'}</a></div>
   ${g.length?`<div class="hlist">${g.slice(0,3).map(n=>{const k=stepKeys(n);const d=k.filter(on).length;return `<a class="hrow" href="#" data-go="item|${esc(n)}">${art(n,'mini')||'<span class="mini"></span>'}<span class="hrt"><span class="nm">${esc(n)}</span><span class="nextbar"><i style="width:${(d/k.length*100).toFixed(1)}%"></i></span></span><span class="small muted">${d}/${k.length}</span></a>`}).join('')}</div>`
   :`<p class="small muted" style="margin:0">Nothing tracked. Open any item and choose <b>Track</b>.</p>`}</section>`}

function home(){if(state.qs)return `<div class="stack">${quickStart()}</div>`;if(isNew())return `<div class="stack">${welcome()}</div>`;
  return `<div class="home2">${mrCard()}${signBlock('home')}${sinceLast()}
   <div class="hgrid"><div class="hmain">${nextCard()}</div><div class="hside">${todayStrip()}${homeGoals()}${taskPanel()}</div></div></div>`}
/* ---------- first visit: sync first, quick start, or look around a sample account ---------- */
function welcome(){return `<section class="welcome"><div class="wl">${LOGO_HTML()}<div><h1>Know what to rank next</h1><p class="lede" style="margin:4px 0 0;display:block">Tennoform reads your Warframe profile and tells you what to master, farm and do before reset.</p></div></div>
 <div class="wchoices">
  <button type="button" class="wchoice" data-onb="import"><b>Sync my profile <span class="chip good">Recommended</span></b><span class="small muted">Paste your account ID. Read-only: no password, nothing changes in game.</span><span class="wgo">Sync →</span></button>
  <button type="button" class="wchoice" data-qsopen><b>Quick start</b><span class="small muted">Enter your Mastery Rank and tick the gear you've maxed. About a minute.</span><span class="wgo">Start →</span></button>
  <button type="button" class="wchoice" data-demo><b>Look around first</b><span class="small muted">Open a sample MR 11 account. Nothing is saved.</span><span class="wgo">Open sample →</span></button>
 </div>
 ${signBlock('welcome')}<div class="small muted">Or <button type="button" class="linkbtn" data-onb="manual">track every item by hand</button>.</div></section>`}

/* sample account: swaps in made-up progress, saves nothing, and puts everything back on exit */
let DEMO=null;
function demoStart(){if(DEMO)return;DEMO={c:JSON.stringify(C),p:JSON.stringify(P),dr:docRef,pr:profRef,ls:lsSet};docRef=null;profRef=null;lsSet=function(){};
  const c={};const m=k=>{c[kenc(k)]=1};const pool=MI.filter(i=>(i.mr||0)<=8).sort((a,b)=>(a.mr||0)-(b.mr||0)||a.n.localeCompare(b.n));
  pool.slice(0,62).forEach(i=>m('m|'+i.n));ALLN.filter(n=>!isJ(n)).slice(0,140).forEach(n=>m('n|'+n.id));Q.slice(0,14).forEach(q=>m('q|'+q.n));
  const now=Date.now();C=c;P={rk:{},other:0,intr:0,mr:null,name:'',at:'',adj:0,wfid:'',mc:{},inv:{},prof:{mr:11,name:'Sample Tenno'},tname:'Sample Tenno',onb:'demo',
    foundry:[{id:'d1',n:'Nikana Prime',t0:now-4*36e5,dur:3*3600},{id:'d2',n:'Rhino',t0:now,dur:3*86400}],goals:['Saryn Prime','Nikana Prime'],
    tasks:[{id:'t1',t:'Farm 10 Orokin Cells',k:'res',r:'Orokin Cell',d:0,at:now}],syn:{'Cephalon Suda':{r:2,s:46000},'Ostron':{r:1,s:4000}}};
  pool.slice(62,70).forEach((i,k)=>{P.rk[i.n]=10+k*2});
  lastMR=null;updateMR();document.body.classList.add('demo');if(location.hash&&location.hash!=='#home')location.hash='home';else render();window.scrollTo(0,0);announce('Sample account open. Nothing is saved.')}
function demoExit(){if(!DEMO)return;C=JSON.parse(DEMO.c);P=JSON.parse(DEMO.p);docRef=DEMO.dr;profRef=DEMO.pr;lsSet=DEMO.ls;DEMO=null;document.body.classList.remove('demo');lastMR=null;updateMR();render();window.scrollTo(0,0)}
function demoBar(){return DEMO&&!window.TF_UI?`<div class="demobar" role="status"><span><b>Sample account.</b> These ranks, goals and tasks are examples, not yours, and nothing here is saved.</span><button type="button" class="btn sm primary" data-demox>Use my own</button></div>`:''}
document.addEventListener('click',e=>{if(e.target.closest('[data-demo]')){demoStart();return}if(e.target.closest('[data-demox]')){demoExit()}});

/* share card: a 1200 x 630 image of your progress, drawn in the browser */
async function shareCard(){const t=totalXP(),m=mrInfo(t.total);const name=P.tname||(P.prof&&P.prof.name)||'Tenno';const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length;
  const nodes=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,qd=Q.filter(q=>qDone(q.n)).length;
  try{await document.fonts.ready}catch(e){}
  const W=1200,H=630,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
  const gold='#C8A35A',ink='#ECE7DC',mut='#A29D92',bg='#0C0C0E',line='#2A2A30',D1='"Barlow Semi Condensed", Arial Narrow, sans-serif',B1='"Source Sans 3", Arial, sans-serif';
  x.fillStyle=bg;x.fillRect(0,0,W,H);
  x.strokeStyle=line;x.lineWidth=2;x.strokeRect(28,28,W-56,H-56);x.strokeStyle='rgba(200,163,90,.45)';x.lineWidth=1.5;x.strokeRect(40,40,W-80,H-80);
  x.save();x.translate(W/2,40);x.rotate(Math.PI/4);x.fillStyle=bg;x.fillRect(-9,-9,18,18);x.strokeStyle=gold;x.strokeRect(-9,-9,18,18);x.restore();
  x.fillStyle=mut;x.font=`600 26px ${D1}`;x.fillText('TENNOFORM',90,110);
  x.fillStyle=ink;x.font=`600 64px ${D1}`;x.fillText(name.slice(0,26),90,190);
  const cx=1000,cy=230,r=110;x.lineWidth=16;x.strokeStyle=line;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.stroke();
  x.strokeStyle=gold;x.lineCap='round';x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(.01,m.pct/100));x.stroke();
  x.fillStyle=gold;x.textAlign='center';x.font=`600 96px ${D1}`;x.fillText(m.mr>30?'L'+(m.mr-30):String(m.mr),cx,cy+32);x.fillStyle=mut;x.font=`400 24px ${B1}`;x.fillText(m.mr>30?'Legendary':'Mastery rank',cx,cy+r+56);x.textAlign='left';
  x.fillStyle=ink;x.font=`600 40px ${B1}`;x.fillText(fmt(t.total)+' XP',90,262);x.fillStyle=mut;x.font=`400 26px ${B1}`;x.fillText(fmt(m.next-t.total)+' to '+(m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1)),90,302);
  x.fillStyle=line;x.fillRect(90,330,720,10);x.fillStyle=gold;x.fillRect(90,330,720*m.pct/100,10);
  const stat=(v,k,i)=>{const sx=90+i*250;x.fillStyle=ink;x.font=`600 56px ${D1}`;x.fillText(v,sx,450);x.fillStyle=mut;x.font=`400 24px ${B1}`;x.fillText(k,sx,488)};
  stat(fmt(maxed),'items mastered',0);stat(fmt(nodes),'star chart nodes',1);stat(fmt(qd),'quests done',2);
  x.fillStyle=mut;x.font=`400 22px ${B1}`;x.fillText('tennoform.com · '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),90,560);
  const blob=await new Promise(res=>cv.toBlob(res,'image/png'));if(!blob){toast("Couldn't make the image");return}
  const file=new File([blob],'tennoform-progress.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'My Warframe progress'});return}catch(e){if(e&&e.name==='AbortError')return}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tennoform-progress.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Image saved')}
document.addEventListener('click',e=>{if(e.target.closest('[data-share]'))shareCard()});
/* ---------- accounts front and centre: sign in from the header, the menu, home and the first visit ---------- */
function canAcct(){return HOSTED&&!!(window.TENNO_FIREBASE&&window.TENNO_FIREBASE.apiKey)}
function signedIn(){return !!(acct&&acct.kind==='fb')}
const G_LOGO='<svg class="glogo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.2C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17.1z"/><path fill="#FBBC05" d="M10.6 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7.9-6.2C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.7 2.3-8.7 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z"/></svg>';
function signBlock(where){if(!canAcct()||signedIn())return'';
  return `<div class="signbox ${where||''}"><div class="signtxt"><b>Save your progress to an account</b><span class="small muted">Free. Sign in on any phone or computer and your ranks, goals, tasks and friends are there.</span></div>
   <div class="signbtns"><button type="button" class="btn gbtn" data-google>${G_LOGO}Continue with Google</button><a class="btn" href="#tenno" data-ttab="account">Sign up or sign in with email</a></div></div>`}
document.addEventListener('click',e=>{const g=e.target.closest('[data-google]');if(!g)return;if(typeof setMenu==='function')setMenu(false);if(!FB){toast('Sign-in is still loading. Try again in a moment.');return}signGoogle()});
document.addEventListener('click',e=>{if(e.target.closest('#signbtn')){setMenu(true)}});
/* ---------- backend (admins only): feedback inbox and donation log ---------- */
const DON={list:null,tried:false,err:false};
async function loadDonations(force){if(!FB||!SO.uid||!FBK.admin||(DON.tried&&!force))return;DON.tried=true;
  try{const s=await FB.fs.collection('donations').orderBy('at','desc').limit(500).get();DON.list=s.docs.map(d=>({id:d.id,...d.data()}));DON.err=false}catch(e){DON.err=true}
  if(location.hash==='#admin')liveRender()}
const _socialInit=socialInit;socialInit=async function(uid){const r=await _socialInit(uid);FBK.tried=false;DON.tried=false;loadFeedback().then(()=>{if(FBK.admin)loadDonations()});return r};
const money=n=>'$'+(Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
function donTotals(list){const now=new Date(),m0=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1);const t={plat:0,usd:0,platM:0,usdM:0,n:list.length,who:{}};
  for(const d of list){const usd=d.kind==='paypal'||d.kind==='other';t[usd?'usd':'plat']+=+d.amount||0;if(d.at>=m0)t[usd?'usdM':'platM']+=+d.amount||0;if(d.who){const k=d.who.trim();t.who[k]=(t.who[k]||0)+1}}return t}
function backend(){const head=`<div class="stack"><div class="head"><h1>Backend</h1></div>`;
  if(!HOSTED||!FB||!SO.uid)return head+`<div class="panel">Sign in with your admin account on tennoform.com to see this page.</div></div>`;
  if(!FBK.tried){loadFeedback().then(()=>{if(FBK.admin)loadDonations()});return head+`<div class="panel" role="status">Checking access…</div></div>`}
  if(!FBK.admin){const pd=/permission/.test(FBK.err||'');
    return head+`<div class="panel stack" style="gap:10px"><b>No admin access for this account yet.</b>
     <div class="small">Signed in as <b>${esc((acct&&(acct.email||acct.name))||'this account')}</b>. Your user ID:</div>
     <div class="row"><code class="uidbox">${esc(SO.uid)}</code><button type="button" class="btn sm" data-copy="${esc(SO.uid)}">Copy</button></div>
     <ol class="small" style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px">
      <li>In Firebase, open <b>Firestore Database → Data</b>.</li>
      <li>Open the <code>admins</code> collection. There must be a document whose ID is exactly the user ID above (no spaces).</li>
      <li>On the <b>Rules</b> tab, paste the rules from GitHub and tap <b>Publish</b>.</li>
      <li>Come back here and tap <b>Check again</b>.</li></ol>
     <div class="small muted">Firebase said: ${esc(pd?'permission denied (the ID isn\'t in admins, or the rules aren\'t published)':FBK.err||'unknown')}</div>
     <div><button type="button" class="btn primary" id="adrecheck">Check again</button></div></div></div>`}
  if(!DON.tried)loadDonations();const tab=state.adTab||'feedback';const fl=FBK.list||[],open=fl.filter(x=>!x.done).length;const dl=DON.list||[];const t=donTotals(dl);
  let h=head+`<div class="tiles"><div class="tile"><span class="k">Open feedback</span><span class="v num">${open}</span><span class="x">${fl.length} total</span></div>
   <div class="tile"><span class="k">PayPal this month</span><span class="v num">${money(t.usdM)}</span><span class="x">${money(t.usd)} all time</span></div>
   <div class="tile"><span class="k">Platinum this month</span><span class="v num">${fmt(t.platM)}p</span><span class="x">${fmt(t.plat)}p all time</span></div>
   <div class="tile"><span class="k">Donations logged</span><span class="v num">${t.n}</span><span class="x">${Object.keys(t.who).length} supporters</span></div></div>
   ${segBtns('adtab',tab,[['feedback','Feedback ('+open+')'],['donations','Donations']])}`;
  if(tab==='feedback')h+=fbInbox();
  else{const today=new Date().toISOString().slice(0,10);
    h+=`<section class="panel stack" style="gap:10px" aria-labelledby="don-h"><h2 id="don-h">Log a donation</h2>
     <div class="donform"><label class="small">Type<select id="dkind"><option value="paypal">PayPal ($)</option><option value="plat">Platinum (in game)</option><option value="other">Other ($)</option></select></label>
     <label class="small">Amount<input id="damt" type="number" inputmode="decimal" min="0" step="0.01" placeholder="5"></label>
     <label class="small">From<input id="dwho" type="text" maxlength="60" placeholder="Name or in-game name"></label>
     <label class="small">Date<input id="ddate" type="date" value="${today}"></label>
     <label class="small dnote">Note<input id="dnote" type="text" maxlength="200" placeholder="Optional, e.g. message they sent"></label></div>
     <div class="row"><button type="button" class="btn primary" id="dadd">Add donation</button><span class="small muted">Only admins can see this log. PayPal and in-game trades don't report to the site, so log each one here.</span></div></section>
     <section class="obj"><div class="obj-h"><div class="row" style="justify-content:space-between"><h3>Donations</h3><span class="row" style="gap:6px"><button type="button" class="btn sm" id="dcsv">Export CSV</button><button type="button" class="btn sm" id="dreload">Refresh</button></span></div></div>
     ${DON.err?`<div class="empty">Couldn't load the log. Publish the latest Firestore rules (they add the donations collection), then tap Refresh.</div>`:DON.list==null?'<div class="empty" role="status">Loading…</div>':
       dl.length?`<div class="donlist">${dl.map(d=>`<div class="donrow"><span class="donamt">${d.kind==='plat'?fmt(d.amount)+'p':money(+d.amount||0)}</span><span class="dont"><b>${esc(d.who||'Anonymous')}</b><span class="small muted">${fdate(new Date(d.at).toISOString())} · ${d.kind==='plat'?'Platinum':d.kind==='paypal'?'PayPal':'Other'}${d.note?' · '+esc(d.note):''}</span></span><button type="button" class="btn sm" data-ddel="${esc(d.id)}" aria-label="Delete donation from ${esc(d.who||'Anonymous')}">${ic('close')}</button></div>`).join('')}</div>`:'<div class="empty">No donations logged yet.</div>'}</section>`}
  return h+'</div>'}
async function addDonation(){const amt=parseFloat(($('#damt')||{}).value);if(!(amt>0))return toast('Enter an amount');const kind=$('#dkind').value;const ds=$('#ddate').value;
  const d={kind,amount:Math.round(amt*100)/100,at:ds?Date.parse(ds+'T12:00:00'):Date.now(),by:SO.uid};const who=$('#dwho').value.trim(),note=$('#dnote').value.trim();if(who)d.who=who.slice(0,60);if(note)d.note=note.slice(0,200);
  try{const r=await FB.fs.collection('donations').add(d);DON.list=[{id:r.id,...d},...(DON.list||[])].sort((a,b)=>b.at-a.at);toast('Donation logged');rerender()}catch(e){toast("Couldn't save. Are the latest Firestore rules published?")}}
function donCSV(){const rows=[['date','type','amount','from','note']].concat((DON.list||[]).map(d=>[new Date(d.at).toISOString().slice(0,10),d.kind,d.amount,d.who||'',d.note||'']));
  const csv=rows.map(r=>r.map(v=>/[",\n]/.test(String(v))?'"'+String(v).replace(/"/g,'""')+'"':v).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='tennoform-donations.csv';document.body.appendChild(a);a.click();a.remove()}
document.addEventListener('click',e=>{if(e.target.closest('#adrecheck')){FBK.tried=false;loadFeedback().then(()=>{if(FBK.admin){DON.tried=false;loadDonations()}rerender()})}});
document.addEventListener('click',async e=>{const t=e.target.closest('[data-adtab],#dadd,#dreload,#dcsv,[data-ddel]');if(!t)return;
  if(t.dataset.adtab){state.adTab=t.dataset.adtab;rerender();return}
  if(t.id==='dadd'){t.disabled=true;await addDonation();t.disabled=false;return}
  if(t.id==='dreload'){loadDonations(true);return}
  if(t.id==='dcsv'){donCSV();return}
  if(t.dataset.ddel){if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Delete?';setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.innerHTML=ic('close')}},4000);return}
    try{await FB.fs.collection('donations').doc(t.dataset.ddel).delete();DON.list=(DON.list||[]).filter(x=>x.id!==t.dataset.ddel);rerender();toast('Deleted')}catch(x){toast("Couldn't delete")}}});
/* ---------- ranks ---------- */
function ranks(){const cat=state.rkCat||'Warframe';const q=(state.rkQ||'').toLowerCase();const f=state.rkF||'all';{const _k=cat+'|'+q+'|'+f+'|'+(state.rkS||'');if(state._rkKey!==_k){state._rkKey=_k;state.rkLim=60}}
  const cats=CATS.filter(c=>MI.some(i=>i.c===c));
  const chips=cats.map(c=>{const a=autoCat(c);return `<button class="btn ${c===cat&&!q?'on':''}" data-rkcat="${esc(c)}">${CATL[c]} <span class="mono small">${a.m}/${a.t}</span></button>`}).join('')+`<button class="btn ${cat==='Intrinsics'&&!q?'on':''}" data-rkcat="Intrinsics">Intrinsics</button><button class="btn ${cat==='Other'&&!q?'on':''}" data-rkcat="Other">Other gear</button>`;
  let body,head;
  if(cat==='Intrinsics'&&!q){body=intrHTML();head=`<b>Intrinsics</b><span class="small muted">${fmt(catXP('rail')+catXP('drift'))} XP</span>`}
  else if(cat==='Other'&&!q){body=othHTML();head=`<b>Other gear</b><span class="small muted">${fmt(othXP())} XP</span>`}
  else{let list=q?MI.filter(i=>i.n.toLowerCase().includes(q)):MI.filter(i=>i.c===cat);
    if(f==='notmax')list=list.filter(i=>rankOf(i.n)<maxRank(i));if(f==='todo')list=list.filter(i=>rankOf(i.n)===0);if(f==='prog')list=list.filter(i=>{const r=rankOf(i.n);return r>0&&r<maxRank(i)});if(f==='max')list=list.filter(i=>rankOf(i.n)>=maxRank(i));
    const rs=state.rkS||'name';list.sort((a,b)=>rs==='mr'?(a.mr||0)-(b.mr||0)||a.n.localeCompare(b.n):rs==='close'?((mxp(a)-itemXP(a.n))||1e9)-((mxp(b)-itemXP(b.n))||1e9):rs==='left'?(mxp(b)-itemXP(b.n))-(mxp(a)-itemXP(a.n)):a.n.localeCompare(b.n));state._rkList=list.map(i=>i.n);
    const a=q?null:autoCat(cat);
    head=`<b>${q?'Search results':CATL[cat]}</b><span class="small muted" id="rkhdr">${a?`${a.m}/${a.t} mastered · ${a.p} in progress · ${fmt(a.x)} XP`:list.length+' items'}</span>${list.filter(i=>rankOf(i.n)<maxRank(i)).length?`<button class="btn sm" id="rkmaxall">Max all in this list…</button>`:''}`;
    body=list.slice(0,state.rkLim).map(rkRow).join('')+moreRow(Math.min(state.rkLim,list.length),list.length)||'<div class="empty">Nothing matches this filter.</div>'}
  return `<div class="stack"><div class="head"><div class="eyebrow">Rank tracker</div><h1>Ranks</h1><p class="lede">Set the rank of everything you've leveled. Mastered gear counts in full and partial ranks count too. Your MR, breakdown and rank-up plan update right away.</p><p class="small muted" style="margin:0">Frames and companions: 200 XP a rank. Weapons: 100. Kuva, Tenet, Coda, Paracesis and Necramechs go to rank 40. Enter jumps to the next item.</p></div>
  ${bigMR()}
  <div class="seg wrapseg" role="toolbar" aria-label="Gear categories">${chips}</div>
  <div class="row"><input id="rkq" type="search" placeholder="Search everything that ranks up" value="${esc(state.rkQ||'')}" style="flex:1 1 200px" aria-label="Search gear"><select id="rkf" aria-label="Filter" style="flex:0 1 180px">${[['all','All'],['notmax','Not mastered'],['todo','Not started'],['prog','In progress'],['max','Mastered']].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select>${`<select id="rks" aria-label="Sort" style="width:auto">${[['name','Sort: name'],['mr','Sort: MR needed'],['close','Sort: closest to mastered'],['left','Sort: most XP left']].map(([k,l])=>`<option value="${k}" ${(state.rkS||'name')===k?'selected':''}>${l}</option>`).join('')}</select>`}</div>
  <div class="obj"><div class="obj-h"><div class="row" style="justify-content:space-between">${head}</div></div><div id="rklist">${body}</div></div></div>`}
function rkRow(it){const r=rankOf(it.n),mx=maxRank(it);
  return `<div class="rk${r>=mx?' done':''}" data-n="${esc(it.n)}"><div class="rk-main"><div class="row" style="gap:8px">${art(it.n)}<a class="ln nm" href="#" data-go="item|${esc(it.n)}">${esc(it.n)}</a>${it.mr?`<span class="chip">MR ${it.mr}</span>`:''}${r>=mx?'<span class="chip good">Mastered</span>':''}</div>
  <div class="rkbar"><i style="width:${r/mx*100}%"></i></div><div class="small muted mono">${fmt(r*perRank(it))} / ${fmt(mxp(it))} XP</div></div>
  <div class="stepper"><button class="sbtn" data-rk="-1" aria-label="Lower rank of ${esc(it.n)}">−</button><input type="number" inputmode="numeric" min="0" max="${mx}" value="${r}" data-rkin aria-label="Rank of ${esc(it.n)}"><button class="sbtn" data-rk="1" aria-label="Raise rank of ${esc(it.n)}">+</button><button class="sbtn mx" data-rk="max" aria-label="Set ${esc(it.n)} to max rank">Max</button></div></div>`}
function setIntr(spec,v){const [key,n]=spec.split('|');P[key]=P[key]||{};P[key][n]=Math.max(0,Math.min(10,Math.round(+v||0)));if(!P[key][n])delete P[key][n];P.intr=intrSum(P.intrR)+intrSum(P.intrD);saveProfile();updateMR()}
function rkHdr(){const h=$('#rkhdr');if(h&&state.rkCat&&CATS.includes(state.rkCat)&&!state.rkQ){const a=autoCat(state.rkCat);h.textContent=`${a.m}/${a.t} mastered · ${a.p} in progress · ${fmt(a.x)} XP`}}

/* ---------- breakdown ---------- */
function breakdownTab(){const t=totalXP(),m=mrInfo(t.total);
  const row=(k,label,auto,autoTxt)=>`<div class="bdr"><div><b>${label}</b><div class="small muted">${autoTxt}</div></div><input type="number" inputmode="numeric" min="0" data-bo="${esc(k)}" value="${isOv(k)?esc(P.bo[k]):''}" placeholder="${auto}" aria-label="${label} XP"><span class="num ${isOv(k)?'ov':''}">${fmt(catXP(k))}</span></div>`;
  return `<div class="panel stack cut"><h2>Mastery breakdown</h2>
  <p class="small" style="margin:0">In Warframe, open <b>Profile → Mastery</b> to see your XP in each category. Type a number here to match the game exactly; leave it blank to use what you set on the Ranks page. Your rank and rank-up plan update as you type.</p>
  <div class="bdr hd"><span>Category</span><span>In-game XP</span><span>Counted</span></div>
  ${BDG.flat().map(k=>CATS.includes(k)?(()=>{const a=autoCat(k);return row(k,CATL[k],a.x,`${a.m}/${a.t} mastered · from Ranks: ${fmt(a.x)}`)})():row(k,bdLabel(k),autoExtra(k),k==='other'?'Gear this app doesn\'t list (from sync or your entry)':'From your ticks: '+fmt(autoExtra(k)))).join('')}
  <div class="bdr"><div><b>Adjustment</b><div class="small muted">Anything else, to match your in-game total</div></div><input id="adj" type="number" inputmode="numeric" value="${+P.adj||0}" aria-label="Adjustment XP"><span class="num">${fmt(+P.adj||0)}</span></div>
  ${t.un?`<div class="bdr"><div><b style="color:var(--warn)">Unaccounted</b><div class="small muted">In game (${esc(t.base.src)}) but not itemised here yet. Ticking more fills this first.</div></div><span></span><span class="num" style="color:var(--warn)">${fmt(t.un)}</span></div>`:''}
  <div class="bdr tot"><b>Total</b><span></span><span class="num">${fmt(t.total)}</span></div>
  <div class="panel stack cut" style="margin-top:6px"><b>Check against the game</b><div class="small muted">Type the totals from your in-game profile. The app shows where the difference is.</div><div class="row"><label class="small" for="gmr">In-game MR</label><input id="gmr" type="number" inputmode="numeric" value="${P.gmr??''}" style="width:90px"><label class="small" for="gxp">In-game total XP</label><input id="gxp" type="number" inputmode="numeric" value="${P.gxp??''}" style="width:140px"></div>${P.gxp?`<div class="small">${+P.gxp===t.total?'<b style="color:var(--ok)">Matches the game exactly.</b>':`Tracked total is <b>${fmt(Math.abs(t.total-P.gxp))} XP ${t.total>P.gxp?'more':'less'}</b> than the game. ${t.total<P.gxp?'Most often this is junctions or Steel Path nodes not ticked on the Star Chart, intrinsics, or MOAs, Hounds and Amps under Ranks → Other gear.':'Check for gear marked mastered that isn\'t, or a typed number that\'s too high.'}`}</div>`:''}${P.gmr!=null&&P.gmr!==''&&+P.gmr!==m.mr?`<div class="small">In game you're MR ${P.gmr}; tracked is MR ${m.mr}. ${+P.gmr>m.mr?`MR ${+P.gmr} needs ${fmt(mrNeed(+P.gmr))} XP, so at least ${fmt(mrNeed(+P.gmr)-t.total)} XP is missing from what you've entered.`:`If your in-game XP really reaches MR ${m.mr}, your rank-up test is waiting. Otherwise something is counted that shouldn't be.`}</div>`:''}</div>
  <div class="row"><span class="chip gold">${m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr}</span><span class="small muted">${fmt(m.next-t.total)} XP to the next rank</span><button class="btn sm" id="boreset">Clear in-game numbers</button></div></div>`}

/* ---------- owned items, quest detection ---------- */
function stepKeys(n){const it=I[n];if(!it)return[];const k=['bp|'+n];let pi=0;for(const p of it.parts){pi++;if(p.k==='p'&&p.n==='Blueprint')continue;
  if(p.k==='p'){k.push('part|'+n+'|'+p.n);if(p.sub){k.push('built|'+n+'|'+p.n);p.sub.forEach(([r])=>k.push('res|'+n+'|'+p.n+'|'+r))}}else if(p.k==='i')k.push('have|'+n+'|'+p.n+'|'+pi);else if(p.k==='r')k.push('res|'+n+'|main|'+p.n)}
  k.push('build|'+n);return k}
function setQ(k){const e=kenc(k);if(C[e])return;C[e]=1;if(docRef){pending[e]=1;clearTimeout(timer);timer=setTimeout(flush,SAVE_MS)}}
function exclusive(it){return it&&!it.p&&!it.bc&&!(it.bpd&&it.bpd.length)&&!(it.dr&&it.dr.length)&&!it.bprel}
function detectQuests(j,mis,owned){const det=new Set(['Awakening',"Vor's Prize"]);const nq=s=>s.toLowerCase().replace(/^the /,'').replace(/[^a-z0-9]/g,'');
  const ch=(j.ChallengeProgress||[]).map(c=>String(c.Name||'').toLowerCase());
  Q.forEach(q=>{const k=nq(q.n);if(k.length>=6&&ch.some(c=>c.includes(k)))det.add(q.n)});
  const PQ={Lua:'The Second Dream','Kuva Fortress':'The War Within',Deimos:'Heart of Deimos',Zariman:'Angels of the Zariman','Höllvania':'The Hex',Duviri:'The Duviri Paradox'};
  for(const m of mis){const nd=NX[m.Tag];if(nd&&m.Completes>0&&!/Junction|Hub|Relay/.test(nd.t)&&PQ[nd.p])det.add(PQ[nd.p])}
  for(const q of Q)for(const r of q.rw){const m=Object.keys(I).find(n=>r===n||r.toLowerCase().startsWith(n.toLowerCase()+' '));if(m&&owned.has(m)&&exclusive(I[m]))det.add(q.n)}
  if([...owned].some(n=>I[n].c==='Archwing'))det.add('The Archwing');
  if([...owned].some(n=>I[n].c==='Companion'&&/Kubrow/.test(n)))det.add('Howl of the Kubrow');
  const add=n=>{det.add(n);const q=Q.find(x=>x.n===n);if(q)qPrereqs(q).forEach(p=>{if(!det.has(p.n))add(p.n)})};[...det].forEach(add);
  return [...det].filter(n=>Q.some(q=>q.n===n))}

/* ---------- mastery breakdown (in-game layout) ---------- */
const BDG=[['Warframe','Primary','Secondary','Melee'],['chart','sp','rail','drift'],['Sentinel','Robotic Weapon','Companion'],['Archwing','Arch-Gun','Arch-Melee'],['Necramech','K-Drive','Zaw','Kitgun','Amp','other']];
function bdLabel(k){return CATL[k]||(EXTRA.find(e=>e[0]===k)||[])[1]||k}
function bdPanel(){const t=totalXP(),m=mrInfo(t.total);
  const row=k=>{const x=catXP(k);const isC=CATS.includes(k);const a=isC?autoCat(k):null;const tgt=isC?`data-rkcat="${esc(k)}"`:k==='rail'||k==='drift'?'data-rkcat="Intrinsics"':`data-scp=""`;
    return `<button class="bdl" ${tgt}><b class="num">${fmt(x)}</b><span>${bdLabel(k)}</span>${a?`<small class="mono">${a.m}/${a.t}</small>`:''}${isOv(k)?'<small class="ovt">set</small>':''}</button>`};
  return `<section class="bdp cut center" id="bdp"><div class="bdhead"><div class="ring" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></div><div class="stack" style="gap:2px;min-width:0;flex:1"><div class="row" style="justify-content:space-between"><h2>Mastery breakdown</h2><a class="small ln" href="#tenno" data-ttab="breakdown">Adjust</a></div><span class="small muted mono">${fmt(t.total)} / ${fmt(m.next)} XP · ${fmt(m.next-t.total)} to ${m.mr>=30?'L'+(m.mr-29):'MR '+(m.mr+1)}</span><div class="nextbar"><i style="width:${m.pct.toFixed(1)}%"></i></div></div></div>
  ${BDG.map((g,i)=>{const rows=g.filter(k=>i<4||catXP(k)>0||(CATS.includes(k)&&autoCat(k).p));return rows.length?`<div class="bdg">${rows.map(row).join('')}</div>`:''}).join('')}
  ${t.un?`<div class="bdg"><button class="bdl un" data-ttab="breakdown"><b class="num">${fmt(t.un)}</b><span>Unaccounted</span><small>in game</small></button><div class="bdnote">From ${esc(t.base.src)}, not itemised here yet. Anything you tick (missions, junctions, gear) fills this first, so your total stays the same until it's used up.</div></div>`:''}
  <div class="bdtot"><span>Total</span><b class="num">${fmt(t.total)}</b></div></section>`}
function testBanner(){const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;if(g==null||m.mr<=g)return'';
  return `<div class="callout small" style="border-color:var(--ok)"><b style="color:var(--ok)">Rank-up test ready.</b> You have the XP for ${m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr}; your account is still MR ${g} in game. Take the test from the Mastery shrine in a Relay or your Orbiter.</div>`}

/* ---------- today: resets, checklist, live world ---------- */
const DAY=864e5;
function lastDaily(){const d=new Date();return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())}
function lastWeekly(){const t=lastDaily();return t-((new Date(t).getUTCDay()+6)%7)*DAY}
function lastSortie(){let t=lastDaily()+16*3600e3;if(t>Date.now())t-=DAY;return t}
function left(ms){ms=Math.max(0,ms);const d=Math.floor(ms/DAY),h=Math.floor(ms%DAY/36e5),m=Math.floor(ms%36e5/6e4);return d?`${d}d ${h}h`:h?`${h}h ${m}m`:`${m}m`}
function untilIso(s){const ms=new Date(s)-Date.now();if(ms<=0){if(HOSTED&&WS&&!WSload&&Date.now()-WSat>30000){WSat=0;loadWS()}return ''}return ms<60000?'<1m':left(ms)}
/* "3h 2m left", or a plain note once the feed's timer has run out and the next one hasn't arrived yet */
function leftOf(s){const t=untilIso(s);return t?t+' left':'Ended · new one loading'}
function ckReset(c){return c[0]==='d'?(c[1]==='sortie'?lastSortie():lastDaily()):lastWeekly()}
function ckDone(c){const ts=(P.dw||{})[c[1]];return !!ts&&ts>=ckReset(c)}
function gateOK(g){return !g||qDone(g)}
let WS=null,WSat=0,WSerr=false,WSload=false;
async function loadWS(){if(WSload||(WS&&Date.now()-WSat<120000))return;WSload=true;try{WS=await netJSON('ws','https://api.warframestat.us/pc/?language=en');WSat=Date.now();WSerr=false}catch(e){WSerr=true;WSat=Date.now()}WSload=false;if(location.hash==='#today'){const y=scrollY;render();scrollTo(0,y)}}
function neededEras(){const s={};const names=new Set([...(P.goals||[]),...Object.keys(I).filter(n=>I[n].p&&(on('bp|'+n)||I[n].parts.some(p=>on('part|'+n+'|'+p.n)))&&!on('build|'+n))]);
  names.forEach(n=>{const it=I[n];if(!it||!it.p)return;const lists=[];if(!on('bp|'+n)&&it.bprel)lists.push(it.bprel);it.parts.forEach(p=>{if(p.rel&&!on('part|'+n+'|'+p.n))lists.push(p.rel)});lists.flat().forEach(([r])=>{if(REL[r]&&!REL[r].v){const e=REL[r].era;(s[e]=s[e]||new Set()).add(r)}})});return s}
function today(){const f=state.ckF||'todo';const now=Date.now();
  const HID=P.ckHide||[],PIN=P.ckPin||[];const rows=allChecks().filter(c=>f==='hidden'?HID.includes(c[1]):!HID.includes(c[1])&&(f==='all'||(f==='todo'&&!ckDone(c)&&gateOK(c[4]))||(f===c[0])||(f==='locked'&&!gateOK(c[4])))).sort((a,b)=>PIN.includes(b[1])-PIN.includes(a[1]));
  const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])),wd=allChecks().filter(c=>c[0]==='w'&&gateOK(c[4]));
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Today</div><h1>Today</h1><p class="lede">Resets, your daily and weekly checklist, and what's live in the game right now.</p></div>
  <div class="tiles"><div class="tile cut"><span class="k">Daily reset</span><span class="v num">${lastDaily()+DAY-now<60000?'Resetting…':left(lastDaily()+DAY-now)}</span><span class="x">${dd.filter(ckDone).length}/${dd.length} done · ${lt(lastDaily()+DAY)} your time (00:00 UTC)</span></div>
  <div class="tile cut"><span class="k">Sortie reset</span><span class="v num">${lastSortie()+DAY-now<60000?'Resetting…':left(lastSortie()+DAY-now)}</span><span class="x">${lt(lastSortie()+DAY)} your time (16:00 UTC)</span></div>
  <div class="tile cut"><span class="k">Weekly reset</span><span class="v num">${lastWeekly()+7*DAY-now<60000?'Resetting…':left(lastWeekly()+7*DAY-now)}</span><span class="x">${wd.filter(ckDone).length}/${wd.length} done · ${ltw(lastWeekly()+7*DAY)} your time (Mon 00:00 UTC)</span></div></div>
  <div class="sec-h"><h2>Checklist</h2>${TRK}<select id="ckf" aria-label="Filter checklist" style="width:auto">${[['todo','To do (unlocked)'],['d','Daily'],['w','Weekly'],['all','Everything'],['locked','Locked by quests'],['hidden','Hidden ('+(P.ckHide||[]).length+')']].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="obj">${rows.map(ckRow).join('')||`<div class="empty">Done for today. Resets in ${left(lastDaily()+DAY-Date.now())}.</div>`}</div>
  <div class="row ckaddrow"><input id="cknew" type="text" maxlength="80" placeholder="Add your own (e.g. Run Arbitration)" aria-label="Add your own checklist item"><select id="ckper" aria-label="Repeats" style="width:auto"><option value="d">Daily</option><option value="w">Weekly</option></select><button type="button" class="btn" id="ckadd">Add</button></div>
  <div class="small muted">Daily items reset at 00:00 UTC (${lt(lastDaily()+DAY)} your time), the Sortie at 16:00 UTC, and weekly items on Monday 00:00 UTC. Warframe doesn't share daily progress, so these ticks are tracked by you; they're saved and clear themselves at each reset. Pin what matters, hide what you never do.</div>`;
  h+=`<div class="sec-h"><h2>Live in the game</h2>${liveStatus()}</div>`;
  if(!WS){if(HOSTED&&!WSerr)loadWS();h+=`<div class="panel empty cut">${!HOSTED?'Live game info (cycles, fissures, Baro, Sortie) works on tennoform.com.':WSerr?'Couldn\'t reach the live game feed. Check your connection, then tap Retry.':'Loading live game info…'}</div>`;return h+'</div>'}
  const w=WS;const cyc=(n,c,lab)=>c?`<div class="tile cut"><span class="k">${n}</span><span class="v" style="font-size:20px">${esc(lab(c))}</span><span class="x">${leftOf(c.expiry)}</span></div>`:'';
  h+=`<div class="tiles">${cyc('Cetus',w.cetusCycle,c=>c.isDay?'Day':'Night')}${cyc('Orb Vallis',w.vallisCycle,c=>c.isWarm?'Warm':'Cold')}${cyc('Cambion Drift',w.cambionCycle,c=>c.state==='vome'?'Vome':'Fass')}${cyc('Duviri',w.duviriCycle,c=>c.state.charAt(0).toUpperCase()+c.state.slice(1))}</div>`;
  if(w.sortie&&w.sortie.variants)h+=`<div class="panel stack cut"><div class="row" style="justify-content:space-between"><h3>Sortie${w.sortie.boss?' · '+esc(w.sortie.boss):''}</h3><span class="row" style="gap:6px"><span class="chip">${leftOf(w.sortie.expiry)}</span>${ltBtn('Do the Sortie',w.sortie.expiry)}</span></div>${w.sortie.variants.map((v,i)=>`<div class="small"><b>${i+1}. ${esc(v.missionType)}</b> · ${esc(v.node)}<div class="muted">${esc(v.modifier)}</div></div>`).join('')}</div>`;
  if(w.archonHunt&&w.archonHunt.missions)h+=`<div class="panel stack cut"><div class="row" style="justify-content:space-between"><h3>Archon Hunt${w.archonHunt.boss?' · '+esc(w.archonHunt.boss):''}</h3><span class="row" style="gap:6px"><span class="chip">${leftOf(w.archonHunt.expiry)}</span>${ltBtn('Do the Archon Hunt',w.archonHunt.expiry)}</span></div>${w.archonHunt.missions.map((v,i)=>`<div class="small"><b>${i+1}. ${esc(v.type)}</b> · ${esc(v.node)}</div>`).join('')}</div>`;
  const vt=w.voidTrader;if(vt){const act=new Date(vt.activation)<=now&&now<new Date(vt.expiry);h+=`<div class="panel stack cut"><div class="row" style="justify-content:space-between"><h3>Baro Ki'Teer</h3><span class="chip ${act?'ok':''}">${act?'Here now · '+(untilIso(vt.expiry)?'leaves in '+untilIso(vt.expiry):'leaving now'):(untilIso(vt.activation)?'Arrives in '+untilIso(vt.activation):'Arriving now')}</span></div><div class="small muted">${esc(vt.location||'')}</div>${act&&vt.inventory&&vt.inventory.length?`<div class="kv small">${vt.inventory.map(x=>`<span>${L(x.item)}</span><span class="num">${x.ducats} ducats · ${fmt(x.credits)} cr</span>`).join('')}</div>`:''}</div>`}
  if(w.steelPath&&w.steelPath.currentReward)h+=`<div class="panel cut row" style="justify-content:space-between"><div><div class="eyebrow">Steel Path Honors this week</div><h3>${esc(w.steelPath.currentReward.name)}</h3></div><span class="chip gold">${w.steelPath.currentReward.cost} Steel Essence</span></div>`;
  if(w.arbitration&&!w.arbitration.expired&&w.arbitration.type!=='Unknown')h+=`<div class="panel cut"><div class="eyebrow">Arbitration</div><h3>${esc(w.arbitration.type)} · ${esc(w.arbitration.node)}</h3><div class="small muted">${esc(w.arbitration.enemy)} · ${leftOf(w.arbitration.expiry)}</div><div style="margin-top:6px">${ltBtn('Run Arbitration: '+w.arbitration.type+' · '+w.arbitration.node,w.arbitration.expiry)}</div></div>`;
  if(w.nightwave&&w.nightwave.activeChallenges){const ac=w.nightwave.activeChallenges;h+=`<details class="obj grp" open><summary><h3>Nightwave acts</h3>${TRK}<span class="chip">${ac.filter(c=>(P.dw||{})['nw|'+c.id]).length}/${ac.length}</span></summary>${ac.map(c=>`<div class="qrow${(P.dw||{})['nw|'+c.id]?' done':''}"><input type="checkbox" class="ck" data-dw="nw|${esc(c.id)}" ${(P.dw||{})['nw|'+c.id]?'checked':''} aria-label="${esc(c.title)}"><div><div class="row" style="gap:6px"><span class="nm lbl">${esc(c.title)}</span><span class="chip">${c.isDaily?'Daily':c.isElite?'Elite weekly':'Weekly'}</span><span class="chip gold">${fmt(c.reputation)}</span>${ltBtn('Nightwave: '+c.title,c.expiry)}</div><div class="small muted">${esc(c.desc)} · ${leftOf(c.expiry)}</div></div></div>`).join('')}</details>`}
  const need=neededEras();const ff=state.fiF||'all',fm=state.fiM||'all';
  let fis=(w.fissures||[]).filter(x=>!x.expired&&new Date(x.expiry)>now).filter(x=>(ff==='all'||x.tier===ff||(ff==='need'&&need[x.tier]))&&(fm==='all'||(fm==='sp'&&x.isHard)||(fm==='n'&&!x.isHard&&!x.isStorm)||(fm==='storm'&&x.isStorm)));
  fis.sort((a,b)=>(a.tierNum-b.tierNum)||(new Date(a.expiry)-new Date(b.expiry)));
  h+=`<details class="obj grp" open><summary><h3>Void Fissures</h3><span class="chip">${fis.length}</span></summary><div style="padding:10px 14px" class="stack"><div class="row"><select id="fif" aria-label="Relic era" style="width:auto">${[['all','All eras'],['need','Eras I need'],['Lith','Lith'],['Meso','Meso'],['Neo','Neo'],['Axi','Axi'],['Requiem','Requiem'],['Omnia','Omnia']].map(([k,l])=>`<option value="${k}" ${ff===k?'selected':''}>${l}</option>`).join('')}</select><select id="fim" aria-label="Mode" style="width:auto">${[['all','All modes'],['n','Normal'],['sp','Steel Path'],['storm','Void Storm (Railjack)']].map(([k,l])=>`<option value="${k}" ${fm===k?'selected':''}>${l}</option>`).join('')}</select></div>
  ${Object.keys(need).length?`<div class="small">You need relics from: ${Object.entries(need).map(([e,s])=>`<b>${e}</b> (${[...s].slice(0,4).join(', ')}${s.size>4?'…':''})`).join(' · ')}</div>`:'<div class="small muted">Track a Prime item under Goals to highlight the fissures you need.</div>'}
  <div class="kv">${fis.map(x=>`<span><b class="${need[x.tier]?'rar-R':''}">${esc(x.tier)}</b>${need[x.tier]?' <span class="chip gold">'+ic('star','fill')+'You need</span>':''} · ${esc(x.missionType)} · ${esc(x.node)}${x.isHard?' <span class="chip warn">Steel Path</span>':''}${x.isStorm?' <span class="chip teal">Void Storm</span>':''}<span class="lact">${relBtn(x.tier)}${ltBtn(x.tier+' fissure: '+x.missionType+' · '+x.node,x.expiry)}</span></span><span class="num small">${leftOf(x.expiry)}</span>`).join('')}</div></div></details>`;
  const GOOD=/Catalyst|Reactor|Forma|Exilus|Wraith|Vandal|Mutalist|Detonite|Fieldron|Mutagen/;const inv=(w.invasions||[]).filter(x=>!x.completed);const rw=s=>((s&&s.countedItems)||[]).map(c=>(c.count>1?c.count+'× ':'')+c.type).join(', ');
  if(inv.length)h+=`<details class="obj grp"><summary><h3>Invasions</h3><span class="chip">${inv.length}</span></summary><div style="padding:10px 14px" class="kv">${inv.map(x=>{const a=rw(x.attacker&&x.attacker.reward),d=rw(x.defender&&x.defender.reward);return `<span>${esc(x.node)} · ${esc(x.desc)}<div class="small ${GOOD.test(a+d)?'':'muted'}">${esc([a,d].filter(Boolean).join(' / '))}</div></span><span class="num small">${Math.round(x.completion||0)}%</span>`}).join('')}</div></details>`;
  return h+'</div>'}

/* ---------- syndicates ---------- */
function synState(e){const s=(P.syn||{})[e.n]||{};return {r:s.r!=null?+s.r:(e.kind==='faction'?0:0),s:+s.s||0,sync:s.sync}}
function rankRow(e,r){return e.ranks.find(x=>x.r===r)||{}}
function dailyCap(){const g=P.prof&&P.prof.mr!=null?P.prof.mr:Math.min(30,mrInfo(totalXP().total).mr);return 16000+500*g}
function dailyLeft(e){if(!P.daily||!e.dkey||P.daily.ts<lastDaily())return null;const v=P.daily.v[e.dkey];return v==null?null:v}
function synd(){const f=state.syF||'all',srt=state.syS||'next',hide=state.syH;
  let list=D.synd.slice();if(f!=='all')list=list.filter(e=>e.kind===f);if(hide)list=list.filter(e=>gateOK(e.gate));
  const prog=e=>{const st=synState(e),rr=rankRow(e,st.r);if(rr.max==null)return 0;return (st.s-(rr.min||0))/((rr.max||1)-(rr.min||0))};
  list.sort((a,b)=>srt==='name'?a.n.localeCompare(b.n):srt==='rank'?synState(b).r-synState(a).r||synState(b).s-synState(a).s:prog(b)-prog(a));
  return `<div class="stack"><div class="head"><div class="eyebrow">Syndicates</div><h1>Syndicates</h1><p class="lede">Your rank with every syndicate, what the next rank costs, and the easiest way to earn standing at your stage. Sync your account to fill this in, or set ranks by hand.</p></div>
  <div class="tiles"><div class="tile cut"><span class="k">Daily cap (each)</span><span class="v num">${fmt(dailyCap())}</span><span class="x">16,000 + 500 × MR</span></div>
  <div class="tile cut"><span class="k">Faction standing left today</span><span class="v num">${dailyLeft(D.synd[0])==null?'—':fmt(dailyLeft(D.synd[0]))}</span><span class="x">${P.daily&&P.daily.ts>=lastDaily()?'From today\'s sync':'Sync to see today\'s caps'}</span></div>
  <div class="tile cut"><span class="k">Daily reset</span><span class="v num">${left(lastDaily()+DAY-Date.now())}</span><span class="x">00:00 UTC</span></div></div>
  <div class="row"><select id="syf" aria-label="Filter" style="width:auto">${[['all','All syndicates'],['faction','Factions'],['open','Open world'],['other','Other']].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select><select id="sys" aria-label="Sort" style="width:auto">${[['next','Closest to rank-up'],['rank','Highest rank'],['name','Name']].map(([k,l])=>`<option value="${k}" ${srt===k?'selected':''}>Sort: ${l}</option>`).join('')}</select><button class="btn ${hide?'on':''}" id="syh">Unlocked only</button></div>
  <div class="cards">${list.map(synCard).join('')}</div>${P.nw&&P.nw.length?`<div class="panel cut"><div class="eyebrow">Nightwave</div><div class="kv small">${P.nw.map(([t,s,r])=>`<span>${esc(t)}</span><span class="num">Rank ${r} · ${fmt(s)}</span>`).join('')}</div></div>`:''}</div>`}
/* each syndicate's own colour, used as a stripe on its card */
const SYNC={'Steel Meridian':'#B5483A','Arbiters of Hexis':'#C8C3B6','Cephalon Suda':'#4FA3C0','The Perrin Sequence':'#5FA15A','Red Veil':'#A1324A','New Loka':'#7EA55C','Ostron':'#D58A3C','The Quills':'#D9B76E','Solaris United':'#C46A3C','Vox Solaris':'#CFA247','Ventkids':'#C85DA8','Entrati':'#9A6BBE','Necraloid':'#7E8C99','Cavia':'#6B93B8','The Holdfasts':'#A99BD8','The Hex':'#4FB7A8','Kahl\'s Garrison':'#B0864B','Conclave':'#C9B98F','Cephalon Simaris':'#5CB3D6','Operational Supply':'#8E9AA6','Nightcap':'#7FA87A'};
function synCard(e){const st=synState(e),ok=gateOK(e.gate);const cur=rankRow(e,st.r),nx=rankRow(e,st.r+1);const top=e.ranks.length?e.ranks[e.ranks.length-1].r:0;
  const pct=cur.max!=null?Math.max(0,Math.min(100,(st.s-(cur.min||0))/((cur.max||1)-(cur.min||0))*100)):0;const dl=dailyLeft(e);
  const stages=(e.farm||[]);let si=0;stages.forEach((s,i)=>{if(st.r>=s[1])si=i});
  const offers=(e.offers||[]).filter(o=>o[2]<=st.r+1).slice(0,40);
  return `<div class="card cut syn${ok?'':' locked'}" style="--sc:${SYNC[e.n]||'var(--line2)'}"><div class="top"><span class="nm">${esc(e.n)}</span><span class="row" style="gap:6px">${taskBtn('synd',e.n,'Rank up '+e.n)}${st.sync?'<span class="chip teal">From game sync</span>':(st.r||st.s)?TRK.replace('Tracked by you','Set by you'):''}${ok?'':`<a class="chip warn" href="#quests" data-q="${esc(e.gate)}">Unlocks after ${esc(e.gate)}</a>`}</span></div>
  ${e.ranks.length?`<div class="row" style="gap:8px"><b style="color:var(--gold)">${esc(cur.t||'Rank '+st.r)}</b><span class="small muted">${st.r}${top?' of '+top:''}</span><span class="small mono">${cur.max!=null&&st.s>=cur.max&&nx.t?`${fmt(st.s)}</span><span class="small" style="color:var(--ok)">Ready to rank up`:fmt(st.s)+(cur.max!=null?' / '+fmt(cur.max):'')}</span></div><div class="nextbar"><i style="width:${pct}%"></i></div>
  ${nx.t?`<div class="small">Next: <b>${esc(nx.t)}</b>${cur.max!=null&&st.s<cur.max?` in ${fmt(cur.max-st.s)}${dl?` (~${Math.ceil((cur.max-st.s)/Math.max(1,dailyCap()))} d)`:''}`:''} · ${nx.cr?fmt(nx.cr)+' cr':''}${nx.items&&nx.items.length?(nx.cr?' + ':'')+nx.items.map(([q,n])=>`${q>1?fmt(q)+' ':''}${L(n)}`).join(', '):''}</div>`:`<div class="small" style="color:var(--ok)">Max rank</div>`}`:''}
  ${dl!=null?`<div class="small muted">${fmt(dl)} left today</div>`:''}
  ${synEffects(e)}
  ${stages.length?`<details class="more"><summary>How to earn standing</summary><div class="tier"><ul style="margin:0;padding-left:18px">${stages[si][2].map(t=>`<li class="small">${esc(t)}</li>`).join('')}</ul>${stages[si+1]?`<div class="small muted" style="margin-top:6px">Later: ${stages[si+1][2].map(esc).join(' ')}</div>`:''}</div></details>`:''}
  ${(()=>{const mo=(e.offers||[]).filter(o=>MIX[o[0]]&&itemXP(o[0])<mxp(MIX[o[0]]));const sum=mo.reduce((a,o)=>a+mxp(MIX[o[0]])-itemXP(o[0]),0);return sum?`<div class="small"><span class="chip mxc">+${fmt(sum)} MR XP</span> to buy here</div>`:''})()}
  ${offers.length?`<details class="more"><summary>What you can buy (${offers.length})</summary><div class="kv small">${offers.map(o=>`<span>${L(o[0])}${o[2]>st.r?' <span class="chip">next rank</span>':''} ${mxChip(o[0])}</span><span class="num">${fmt(o[1])}</span>`).join('')}</div></details>`:''}
  ${e.ranks.length?`<details class="more"><summary>Set rank by hand</summary><div class="row"><select data-synr="${esc(e.n)}" aria-label="Rank" style="width:auto">${e.ranks.map(r=>`<option value="${r.r}" ${r.r===st.r?'selected':''}>${r.r}: ${esc(r.t)}</option>`).join('')}</select><input type="number" inputmode="numeric" data-syns="${esc(e.n)}" value="${st.s||''}" placeholder="Standing" style="width:140px" aria-label="Standing"></div></details>`:''}
  <a class="small ln" href="${e.w}" target="_blank" rel="noopener">Wiki</a></div>`}

/* ---------- goals (wishlist) ---------- */
function goals(){const g=(P.goals||[]).filter(n=>I[n]);const srt=state.gS||'added';
  let list=g.slice();if(srt==='name')list.sort();if(srt==='progress'){const pr=n=>{const k=stepKeys(n);return k.filter(on).length/k.length};list.sort((a,b)=>pr(b)-pr(a))}
  const acc={cr:0,r:{},pt:0};g.filter(n=>!on('build|'+n)).forEach(n=>totals(n,1,acc,[]));const tr=Object.entries(acc.r).sort((a,b)=>b[1]-a[1]);const short=state.gShort;
  const need=neededEras();
  return `<div class="stack"><div class="head"><div class="eyebrow">Goals</div><h1>Goals</h1><p class="lede">Tap <b>Track</b> on any item to add it here. You get one combined shopping list, the relics you still need, and progress for each goal.</p></div>
  ${g.length?`<div class="row"><select id="gs" aria-label="Sort goals" style="width:auto">${[['added','Sort: order added'],['progress','Sort: most complete'],['name','Sort: name']].map(([k,l])=>`<option value="${k}" ${srt===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="cards">${list.map(n=>{const k=stepKeys(n);const d=k.filter(on).length;return `<div class="card cut"><div class="top">${art(n,'mini')}<a class="nm ln" style="flex:1" href="#" data-go="item|${esc(n)}">${esc(n)}</a><span class="row" style="gap:6px">${vaultChip(I[n])}${on('build|'+n)?'<span class="chip good">Built</span>':''}<button class="btn sm" data-goal="${esc(n)}">Remove</button></span></div><div class="nextbar"><i style="width:${d/k.length*100}%"></i></div><div class="small muted">${d}/${k.length} steps · ${fmt(mxp(I[n]))} Mastery XP</div></div>`}).join('')}</div>
  <div class="panel stack cut"><div class="row" style="justify-content:space-between"><h2>Shopping list</h2><button class="btn sm ${short?'on':''}" id="gshort">Only what I'm short on</button></div><div class="small muted">${fmt(acc.cr)} credits for everything not built yet. Set what you have in Profile → Inventory (or on any resource page) to see what's left, then turn the rest into tasks.</div>
  <ul class="reslist">${tr.filter(([n,q])=>!short||!(P.inv&&+P.inv[n]>=q)).map(([n,q])=>shopLi(n,q)).join('')||'<li class="small muted">Nothing left to farm.</li>'}</ul></div>
  ${Object.keys(need).length?`<div class="panel stack cut"><h2>Relics to crack</h2>${Object.entries(need).map(([e,s])=>`<div class="small"><b>${e}:</b> ${[...s].map(r=>`<a class="ln" href="#" data-go="relic|${esc(r)}">${esc(r)}</a>`).join(', ')}</div>`).join('')}<a class="btn sm" href="#today">See open fissures</a></div>`:''}`
  :`<div class="panel empty cut">No goals yet. Open any Warframe, weapon or Prime set and tap <b>Track</b>.<div style="margin-top:10px"><a class="btn primary" href="#frames">Browse Warframes</a></div></div>`}</div>`}

/* ---------- helminth ---------- */
function helminthTab(){const f=state.hF||'all';let fr=MI.filter(i=>i.c==='Warframe'&&!i.p&&!/Umbra$/.test(i.n)).map(i=>i.n).sort();
  const owned=n=>rankOf(n)>0||rankOf(n+' Prime')>0;
  if(f==='done')fr=fr.filter(n=>on('hel|'+n));if(f==='ready')fr=fr.filter(n=>!on('hel|'+n)&&owned(n));if(f==='todo')fr=fr.filter(n=>!on('hel|'+n));
  const all=MI.filter(i=>i.c==='Warframe'&&!i.p&&!/Umbra$/.test(i.n));
  return `<div class="panel stack cut"><h2>Helminth</h2><p class="small" style="margin:0">Feeding (subsuming) a Warframe to the Helminth unlocks one of its abilities, which you can then infuse onto any other Warframe in place of one of theirs. Each Warframe only needs feeding once, so this list is how you keep track of which ones you've done.</p>
  <details class="small"><summary><b>Why you tick these yourself</b></summary><div class="stack" style="padding-top:6px">
  <div>The public profile Tennoform syncs from doesn't say which Warframes you've fed, so there's nothing to read automatically. You only do this occasionally, so ticking the box right after you feed one in game keeps the list right.</div>
  <div><b>How to use it:</b> choose "Owned, not fed yet" to see the Warframes you could feed next. After you subsume one in game, tick it here. Your ticks are saved on this device (and synced if you're signed in).</div>
  <div><b>Good to know:</b> feeding uses up that copy of the Warframe, but you keep its Mastery. Many players build a spare copy to feed rather than giving up one they play. The list has one entry per Warframe, so Prime versions aren't listed separately.</div>
  <div><b>Getting the Helminth:</b> play Heart of Deimos, then buy the Helminth Segment from Son in the Necralisk and build it in your Orbiter.</div></div></details>
  <div class="row"><span class="chip gold">${all.filter(i=>on('hel|'+i.n)).length}/${all.length} subsumed</span><select id="hf" aria-label="Filter" style="width:auto">${[['all','All Warframes'],['ready','Owned, not fed yet'],['todo','Not fed yet'],['done','Fed']].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="obj">${fr.map(n=>`<div class="qrow${on('hel|'+n)?' done':''}">${ck('hel|'+n)}<div><div class="row" style="gap:6px"><span class="nm lbl">${esc(n)}</span>${owned(n)?'<span class="chip teal">Owned</span>':''}</div></div></div>`).join('')||'<div class="empty">Nothing here.</div>'}</div></div>`}

/* ---------- star chart ---------- */
const ORB={Mercury:'#9a8f86,#4d453f',Venus:'#e6c27a,#8a6a2c',Earth:'#5fa8d8,#2f6a3a',Lua:'#d8dde2,#6c7480',Mars:'#d9774e,#6e2c1c',Phobos:'#b9a58e,#5c4c3b',Deimos:'#b45a5a,#3d1d27',Ceres:'#8fa3a8,#3e4c50',Jupiter:'#e3b98a,#8a5a35',Europa:'#cfe6f2,#5d86a0',Saturn:'#e8d49a,#8f7a3c',Uranus:'#8fe3e0,#2f7d86',Neptune:'#5b7ee8,#20307a',Pluto:'#c9b3a0,#5e4d44',Sedna:'#d06a6a,#5a2222',Eris:'#9ad08a,#2f5a2a',Void:'#f2d27a,#3a2c08','Kuva Fortress':'#e05050,#3a0d0d',Zariman:'#d9e2ff,#4a4f7a','Höllvania':'#c07ad9,#3d1f4f',Duviri:'#e08ab0,#4f1f3a'};
const isJ=n=>/Junction/.test(n.t);
const jLabel=n=>{const m=n.id.match(/^(\w+?)To(\w+?)Junction$/);return m?`${m[1]} → ${m[2]}`:n.n};
function orb(p,size){const c=(ORB[p]||'#6fd6e8,#1e3440').split(',');return `<span class="orb" style="--a:${c[0]};--b:${c[1]};width:${size}px;height:${size}px" aria-hidden="true"></span>`}
function planetStats(p){const ns=ALLN.filter(n=>n.p===p&&!isJ(n));return {ns,d:ns.filter(n=>on('n|'+n.id)).length,s:ns.filter(n=>on('sp|'+n.id)).length,x:ns.reduce((a,n)=>a+n.x,0),xd:ns.reduce((a,n)=>a+(on('n|'+n.id)?n.x:0)+(on('sp|'+n.id)?n.x:0),0)}}
const PORD=['Mercury','Venus','Earth','Lua','Mars','Deimos','Phobos','Ceres','Jupiter','Europa','Saturn','Uranus','Neptune','Pluto','Sedna','Eris','Void','Kuva Fortress','Zariman','Duviri','Höllvania'];
function missions(){const planets=[...new Set(ALLN.filter(n=>!isJ(n)).map(n=>n.p))].sort((a,b)=>{const ia=PORD.indexOf(a),ib=PORD.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b)});const sel=state.scP&&planets.includes(state.scP)?state.scP:null;
  const J=ALLN.filter(isJ).sort((a,b)=>jLabel(a).localeCompare(jLabel(b)));
  const all=ALLN.filter(n=>!isJ(n));const nd=all.filter(n=>on('n|'+n.id)).length,sd=all.filter(n=>on('sp|'+n.id)).length,jd=J.filter(n=>on('n|'+n.id)).length;
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Star chart</div><h1>${sel?esc(sel):'Star Chart'}</h1><p class="lede">${sel?'Tick each node you\'ve cleared. Steel Path pays the Mastery XP a second time.':'Pick a planet to tick off its nodes, and clear every junction. Each node and junction gives Mastery XP the first time you complete it.'}</p></div>`;
  if(!sel){h+=`<div class="tiles"><div class="tile cut"><span class="k">Nodes</span><span class="v num">${nd}<small>/${all.length}</small></span><span class="tbar"><i style="width:${nd/all.length*100}%"></i></span></div>
    <div class="tile cut"><span class="k">Junctions</span><span class="v num">${jd}<small>/${J.length}</small></span><span class="tbar"><i style="width:${jd/J.length*100}%"></i></span><span class="x">1,000 XP each</span></div>
    <div class="tile cut"><span class="k">Steel Path</span><span class="v num">${sd}<small>/${all.length}</small></span><span class="tbar"><i style="width:${sd/all.length*100}%"></i></span></div>
    <div class="tile cut"><span class="k">Mission XP</span><span class="v num">${fmt(catXP('chart')+catXP('sp'))}</span><span class="x">of ${fmt(NODES.reduce((a,n)=>a+n.x,0)*2)}</span></div></div>
    <div class="planets">${planets.map(p=>{const s=planetStats(p);const pct=s.ns.length?s.d/s.ns.length*100:0;return `<button class="planet cut${s.d===s.ns.length?' full':''}" data-scp="${esc(p)}"><span class="pring" style="--p:${pct.toFixed(0)}">${orb(p,46)}</span><span class="pn">${esc(p)}</span><span class="small mono">${s.d}/${s.ns.length}${s.s?` · SP ${s.s}`:''}</span></button>`}).join('')}</div>
    <details class="obj grp" open data-scope="input.ck.jn"><summary><h3>Junctions</h3>${progHTML()}</summary><div class="small muted" style="padding:10px 14px 0">Beat the junction's Specter after finishing its tasks to open the next planet. 1,000 Mastery XP each, and again on Steel Path.</div>
    <div style="padding:0 14px 10px"><div class="nodes"><div class="h">Junction</div><div class="h c">Done</div><div class="h c">Steel</div>${J.map(n=>`<div><span>${orb(n.id.match(/^(\w+?)To/)?.[1]||'',18)}<b>${esc(jLabel(n))}</b> <span class="small muted">1,000 XP</span></span></div><div class="c">${ck('n|'+n.id,'sm jn')}</div><div class="c">${ck('sp|'+n.id,'sm')}</div>`).join('')}</div></div></details>${juncTasks()}</div>`;return h}
  const s=planetStats(sel);const tf=state.misType||'all',hide=state.misHide,q=(state.scQ||'').toLowerCase();
  let ns=s.ns.filter(n=>(tf==='all'||n.t===tf)&&(!hide||!on('n|'+n.id)||!on('sp|'+n.id))&&(!q||n.n.toLowerCase().includes(q)));
  const srt=state.scS||'lv';ns.sort((a,b)=>srt==='name'?a.n.localeCompare(b.n):srt==='xp'?b.x-a.x:a.lv[0]-b.lv[0]);
  const rr=(D.regres[sel]||D.regres[sel==='Zariman'?'Zariman Ten Zero':sel]||[]);const pj=ALLN.filter(n=>isJ(n)&&(n.id.startsWith(sel)));
  h+=`<div class="row"><button class="btn" data-scp="">← All planets</button>${orb(sel,34)}${taskBtn('node',sel,'Clear '+sel+' nodes')}<span class="small mono">${s.d}/${s.ns.length} nodes · SP ${s.s}/${s.ns.length} · ${fmt(s.xd)} XP earned</span></div>
  ${rr.length?`<div class="small">Resources here: ${rr.map(r=>L(r)).join(' · ')}</div>`:''}
  <div class="row"><input id="scq" type="search" placeholder="Find a node" value="${esc(state.scQ||'')}" style="flex:1 1 160px" aria-label="Find a node"><select id="mtype" aria-label="Mission type" style="width:auto">${[['all','All types'],...[...new Set(s.ns.map(n=>n.t))].sort().map(t=>[t,t])].map(([k,l])=>`<option value="${esc(k)}" ${tf===k?'selected':''}>${esc(l)}</option>`).join('')}</select><select id="scs" aria-label="Sort" style="width:auto">${[['lv','Sort: level'],['xp','Sort: XP'],['name','Sort: name']].map(([k,l])=>`<option value="${k}" ${srt===k?'selected':''}>${l}</option>`).join('')}</select><button class="btn ${hide?'on':''}" id="mishide">Unfinished only</button></div>
  <div class="obj" data-scope="input.ck.nd"><div class="obj-h">${progHTML()}<div class="row"><button class="btn sm" data-planet="${esc(sel)}" data-mode="n">Mark all done</button><button class="btn sm" data-planet="${esc(sel)}" data-mode="sp">Mark all Steel Path</button></div></div>
  <div style="padding:0 14px 10px"><div class="nodes"><div class="h">Node</div><div class="h c">Done</div><div class="h c">Steel</div>${ns.map(n=>`<div><span><b>${esc(n.n)}</b> <span class="small muted">${esc(n.t)} · Lv ${n.lv[0]}–${n.lv[1]}${n.x?` · ${n.x} XP`:''}${n.ds?' · Dark Sector':''}${P.mc&&P.mc[n.id]?` · ${fmt(P.mc[n.id])} runs`:''}</span></span></div><div class="c">${ck('n|'+n.id,'sm nd')}</div><div class="c">${ck('sp|'+n.id,'sm nd')}</div>`).join('')||'<div class="small muted">No nodes match.</div>'}</div></div></div>
  ${pj.length?`<div class="panel cut stack"><div class="eyebrow">Junctions from ${esc(sel)}</div>${pj.map(n=>`<div class="row" style="justify-content:space-between">${ck('n|'+n.id,'sm jn')}<b style="flex:1">${esc(jLabel(n))}</b><span class="small muted">1,000 XP</span></div>`).join('')}</div>`:''}`;
  return h+'</div>'}

/* ---------- intrinsics (rework) ---------- */
const IDESC={Tactical:'Crew orders and Railjack battle abilities',Piloting:'Railjack handling, boost and evasive moves',Gunnery:'Turret damage and critical hits',Engineering:'Repairs, crafting Railjack parts, Forge efficiency',Command:'Hire and level up your crew',Riding:'Kaithe horse riding in Duviri',Combat:'Drifter weapons, melee and abilities',Opportunity:'Loot, resources and Duviri rewards',Endurance:'Drifter health, shields and survival'};
function intrHTML(){const sch=(key,names,label,col)=>{const tot=names.reduce((a,n)=>a+(+((P[key]||{})[n]||0)),0);
  return `<div class="school cut" style="--sc:${col}"><div class="row" style="justify-content:space-between"><h3>${label}</h3><span class="chip gold">${tot}/${names.length*10} ranks · ${fmt(tot*1500)} XP</span></div>
  ${names.map(n=>{const v=+((P[key]||{})[n]||0);return `<div class="iskill"><div class="row" style="justify-content:space-between"><b>${n}</b><span class="mono small">${v}/10</span></div><div class="small muted">${IDESC[n]||''}</div>
  <div class="pips" role="group" aria-label="${n} rank">${Array.from({length:10},(_,i)=>`<button class="pip${i<v?' on':''}" data-ipip="${key}|${n}|${i+1===v?i:i+1}" aria-label="Set ${n} to rank ${i+1}"></button>`).join('')}</div></div>`}).join('')}</div>`};
  return `<div style="padding:12px 14px" class="stack"><p class="small muted" style="margin:0">Tap a pip to set the rank (tap your current rank again to lower it by one). Each intrinsic rank is worth 1,500 Mastery XP.</p><div class="schools">${sch('intrR',IR,'Railjack','#6FD6E8')}${sch('intrD',ID,'Drifter','#D9B45E')}</div></div>`}

/* ---------- other gear counters ---------- */
const OTH=[['moa','MOAs',6000,'Modular companion (Fortuna)'],['hound','Hounds',6000,'Modular companion (Sisters of Parvos)'],['amp','Amps',3000,'Each Amp prism you rank up'],['kitgun','Extra Kitgun forms',3000,'Kitgun chambers ranked as primary and secondary'],['pred','Predasites & Vulpaphylas',6000,'Infested companions not listed above'],['plexus','Other (enter XP)',1,'Any other mastery XP the app does not list']];
function othXP(){const o=P.oth||{};return OTH.reduce((a,[k,,x])=>a+(+o[k]||0)*x,0)}
function othHTML(){const o=P.oth||{};return `<div style="padding:12px 14px" class="stack"><p class="small muted" style="margin:0">Modular and extra gear the item list doesn't cover. Enter how many you've mastered (rank 30).</p>
  ${OTH.map(([k,l,x,d])=>`<div class="rk"><div class="rk-main"><b>${l}</b><div class="small muted">${d}${x>1?` · ${fmt(x)} XP each`:''}</div></div><div class="stepper"><button class="sbtn" data-oth="${k}" data-d="-1" aria-label="Fewer">−</button><input type="number" inputmode="numeric" min="0" value="${+o[k]||0}" data-othin="${k}" aria-label="${l}" style="width:${x>1?54:110}px"><button class="sbtn" data-oth="${k}" data-d="1" aria-label="More">+</button></div></div>`).join('')}
  <div class="small">Total from other gear: <b class="num">${fmt(othXP())}</b> XP${P.other?` (plus ${fmt(P.other)} found by sync)`:''}</div></div>`}

/* ---------- item art ---------- */
function art(n,cls){const it=I[n];if(!it||!it.img)return'';return `<img class="${cls||'thumb'}" src="https://cdn.warframestat.us/img/${encodeURIComponent(it.img)}" alt="" loading="lazy" decoding="async">`}

/* ---------- export report ---------- */
function reportHTML(){const t=totalXP(),m=mrInfo(t.total);const now=new Date();const e=s=>esc(s);
  const sec=(title,body)=>`<section><h2>${title}</h2>${body}</section>`;
  const tbl=(head,rows)=>`<table><thead><tr>${head.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const bd=BDG.flat().map(k=>{const a=CATS.includes(k)?autoCat(k):null;return [e(bdLabel(k)),fmt(CATS.includes(k)?a.x:autoExtra(k)),isOv(k)?fmt(P.bo[k]):'',fmt(catXP(k)),a?`${a.m}/${a.t} (${a.p} partial)`:'']});
  const items=MI.filter(i=>rankOf(i.n)>0).sort((a,b)=>a.c.localeCompare(b.c)||a.n.localeCompare(b.n)).map(i=>[e(CATL[i.c]||i.c),e(i.n),rankOf(i.n)+'/'+maxRank(i),fmt(itemXP(i.n)),on('m|'+i.n)?'yes':'']);
  const nodes=ALLN.filter(n=>on('n|'+n.id)||on('sp|'+n.id)).map(n=>[e(n.p),e(isJ(n)?jLabel(n):n.n),e(n.t),n.x,on('n|'+n.id)?'yes':'',on('sp|'+n.id)?'yes':'',P.mc&&P.mc[n.id]||'']);
  const syn=D.synd.map(s=>{const st=synState(s);return [e(s.n),st.r,e(rankRow(s,st.r).t||''),fmt(st.s),st.sync?'sync':'manual']});
  const css='body{font:14px/1.5 system-ui,sans-serif;background:#0b1016;color:#dce6ea;margin:0;padding:24px}h1{color:#d9b45e;margin:0 0 4px}h2{color:#6fd6e8;border-bottom:1px solid #2b4a58;padding-bottom:4px;margin-top:28px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid #1e3440;padding:5px 8px;text-align:left}th{color:#8fa3ac;text-transform:uppercase;font-size:11px;letter-spacing:.08em}.k{display:inline-block;margin:4px 14px 4px 0}.k b{color:#d9b45e;font-size:20px}pre{white-space:pre-wrap;word-break:break-all;font-size:11px;background:#121d27;padding:12px}';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tennoform report · ${e(P.tname||(P.prof&&P.prof.name)||'Tenno')}</title><style>${css}</style></head><body>
  <h1>Tennoform report</h1><div>${e(P.tname||(P.prof&&P.prof.name)||'Tenno')} · exported ${now.toLocaleString()}</div>
  <div style="margin-top:12px"><span class="k">Tracked MR <b>${mrLabel(m.mr)}</b></span><span class="k">Total XP <b>${fmt(t.total)}</b></span><span class="k">Next rank at <b>${fmt(m.next)}</b></span>${P.prof&&P.prof.mr!=null?`<span class="k">In-game MR (last sync) <b>${mrLabel(P.prof.mr)}</b></span>`:''}<span class="k">Adjustment <b>${fmt(+P.adj||0)}</b></span></div>
  ${sec('Mastery breakdown',tbl(['Category','Tracked','In-game override','Counted','Mastered'],bd))}
  ${sec(`Ranked gear (${items.length})`,tbl(['Category','Item','Rank','XP','Mastered'],items))}
  ${sec(`Star chart (${nodes.length} nodes)`,tbl(['Planet','Node','Type','XP','Done','Steel Path','Runs'],nodes))}
  ${sec('Intrinsics',tbl(['School','Skill','Rank'],[...IR.map(n=>['Railjack',n,+((P.intrR||{})[n]||0)]),...ID.map(n=>['Drifter',n,+((P.intrD||{})[n]||0)])]))}
  ${sec('Other gear',tbl(['Type','Count','XP'],OTH.map(([k,l,x])=>[l,+((P.oth||{})[k]||0),fmt((+((P.oth||{})[k]||0))*x)])))}
  ${sec(`Quests (${Q.filter(q=>qDone(q.n)).length}/${Q.length})`,tbl(['Group','Quest','Done'],Q.map(q=>[e(q.g),e(q.n),qDone(q.n)?'yes':''])))}
  ${sec('Syndicates',tbl(['Syndicate','Rank','Title','Standing','Source'],syn))}
  ${sec('Helminth',`<p>${MI.filter(i=>on('hel|'+i.n)).map(i=>e(i.n)).join(', ')||'None ticked'}</p>`)}
  ${sec('Goals',`<p>${(P.goals||[]).map(e).join(', ')||'None'}</p>`)}
  ${sec('Inventory',tbl(['Material','Count'],Object.entries(P.inv||{}).map(([k,v])=>[e(k),fmt(v)])))}
  ${sec('Last sync',`<pre>${e(JSON.stringify(P.lastSync||null,null,1))}</pre>`)}
  ${sec('Raw data',`<details><summary>Show</summary><pre>${e(JSON.stringify({v:3,c:C,p:P}))}</pre></details>`)}
  </body></html>`}
function saveFile(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('Saved '+name)}

/* ---------- tenno (character) ---------- */
function tenno(){const tab=state.tTab;const tabs=[['profile','Profile'],['breakdown','Mastery breakdown'],['account','Account & sync'],['foundry','Foundry'],['inventory','Inventory'],['helminth','Helminth'],['friends','Compare profiles'],['backup','Backup & export']];
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Tenno</div><h1>${esc(P.tname||(P.prof&&P.prof.name)||'Your Tenno')}</h1>${P.at?`<div class="small muted">Last synced ${fdate(P.at)}${P.prof&&P.prof.mr!=null?` · In-game MR ${mrLabel(P.prof.mr)}`:''}</div>`:''}</div>
  <div class="seg">${tabs.map(([k,l])=>`<button class="btn ${tab===k?'on':''}" data-ttab="${k}">${l}</button>`).join('')}</div>`;
  if(tab==='account')h+=accountTab();
  if(tab==='profile')h+=profileTab();
  if(tab==='breakdown')h+=bdPanel()+breakdownTab();
  if(tab==='helminth')h+=helminthTab();
  if(tab==='foundry')h+=foundryTab();
  if(tab==='inventory')h+=inventoryTab();
  if(tab==='backup')h+=backupTab();
  if(tab==='friends')h+=friendsTab();
  return h+'</div>'}
function findId(text){text=String(text||'');const pri=[/Logged in[^\n(]*\(([0-9a-f]{24})\)/i,/AccountId[^0-9a-f]{0,12}([0-9a-f]{24})/i,/playerId=([0-9a-f]{24})/i,/accountId[":\s$oid{]*([0-9a-f]{24})/i,/user_?id["'\s:=]*([0-9a-f]{24})/i];
  for(const r of pri){const m=text.match(r);if(m)return m[1].toLowerCase()}const all=text.match(/\b[0-9a-f]{24}\b/gi);return all&&all.length===1?all[0].toLowerCase():null}
async function readLog(f){try{const txt=await f.text();const id=findId(txt);if(id)setWfid(id,f.name);else toast('Couldn\'t find an account ID in '+f.name+'. Make sure it\'s EE.log from the Warframe folder.')}catch(e){toast('Couldn\'t read that file.')}}
function setWfid(id,how,name){if(id!==P.wfid||name)P.wfName=name||'';P.wfid=id;lsSet('tenno-acct',id);saveProfile();render();toast(name?`Found ${name}'s account ID${how?' in '+how:''}. Linking and syncing…`:'Found your account ID'+(how?' in '+how:'')+'. Syncing…');setTimeout(()=>autoSync(false),300)}
function accountTab(){const ok=/^[0-9a-f]{24}$/i.test(P.wfid||'');const px=window.TENNO_PROXY;
  return accountPanel()+`<div class="panel stack cut"><h2>Link your Warframe profile</h2><p class="small muted" style="margin:0">Read-only: fills in ranks, mastered gear, star chart, syndicates and quests from Warframe, and updates them by itself. It doesn't save your Tennoform goals or tasks; signing in above does that.</p>
  ${ok?`<div class="row"><span class="chip good">Linked</span>${P.wfName?`<b class="small">${esc(P.wfName)}</b>`:''}<span class="mono small">${esc(P.wfid)}</span><button class="btn sm" id="unlink">Change</button></div>`:`
  ${idHelpHTML()}
  <details class="small wfhfiles"${/Windows/.test(navigator.userAgent)?' open':''}><summary><b>Use WFHelper on PC? Pick its files instead</b></summary>
   <div class="stack" style="margin-top:8px">
    <div class="muted">WFHelper (wfhelper.com) saves your account ID and inventory as files once it has loaded your inventory. Tennoform reads them on this device; nothing is uploaded.</div>
    <ol class="stack" style="margin:0;padding-left:20px;list-style:decimal">
     <li>Tap <b>Choose WFHelper file</b>. In the window that opens, click the address bar at the top, paste <span class="mono sel">%appdata%\\WFHelper</span> and press Enter.</li>
     <li>Pick <b>codex-profile.json</b>. That links your account ID.</li>
     <li>Want your full inventory too? Choose again, open the <b>api-helper</b> folder and pick <b>inventory.json</b>. It fills in owned gear, parts, mods, arcanes, relics and resources, and links your ID if it isn't linked yet.</li>
    </ol>
    <div class="row"><label class="btn primary filebtn" for="wfhfile">Choose WFHelper file</label><input id="wfhfile" type="file" accept=".json,.log,.txt,application/json,text/plain" multiple hidden></div>
    <div class="drop" id="drop">or drag codex-profile.json or inventory.json here</div>
    <div class="muted">No codex-profile.json yet? Open WFHelper with Warframe running and wait until it shows your inventory, then look again. Warframe's own EE.log file no longer contains your account ID, so it can't be used for this.</div>
   </div>
  </details>
  </div>`}</div>
  <div class="panel stack cut"><h2>Sync</h2>
  ${platPickHTML()}
  <div class="row"><button class="btn primary" id="autosync" ${ok&&wfPlat().auto?'':'disabled'}>Sync automatically</button><button type="button" class="btn" id="rsreset" title="Make Tennoform match your Warframe profile, choosing what stays">Reset sync…</button><span class="small muted" id="asres">${P.auto?'Last automatic sync '+fdate(P.auto):''}</span></div>
  ${state.syncFail?`<div class="callout small" role="status">Automatic sync couldn't reach Warframe just now. The steps below always work and take about 20 seconds.</div>`:''}
  <section class="syncsteps" id="syncsteps" aria-labelledby="ss-h"><h3 id="ss-h">${HOSTED&&!state.syncFail&&wfPlat().auto?'If automatic sync doesn\'t work':'Sync in two quick steps'}</h3>
   <ol class="ssl">
    <li><b>Open your profile data.</b> <span class="small muted">It opens Warframe's own page with your ID filled in. You don't need to be signed in.</span>
     <div><a class="btn" id="openprof" ${ok?`href="https://${wfPlat().host}.warframe.com/cdn/getProfileViewingData.php?playerId=${esc(P.wfid)}" target="_blank" rel="noopener"`:'href="#" aria-disabled="true"'}>Open my profile data ↗</a></div>
     <span class="small muted">Blank page? That's Warframe sending nothing back. It does that when it doesn't recognise the ID for the platform picked above (check both), or when it's limiting requests from your network for a while; then wait a few hours and try again.</span></li>
    <li><b>Copy everything on that page.</b> <span class="small muted">On a phone: press and hold the text, tap <b>Select All</b>, then <b>Copy</b>. On a computer: Ctrl+A (⌘A), then Ctrl+C (⌘C).</span></li>
    <li><b>Come back and paste.</b> <div class="row" style="margin-top:6px"><button class="btn primary" id="pastesync" type="button">Paste &amp; sync</button><span class="small muted">You'll see what changes before anything is saved.</span></div></li>
   </ol>
   <details class="more"${HOSTED?'':' open'}><summary>Paste it by hand instead</summary><div class="stack" style="gap:8px;margin-top:6px">
    <textarea id="pj" placeholder='Paste your profile data here (starts with {"Results":…)' aria-label="Profile data"></textarea>
    <div class="row"><button class="btn" id="imp">Sync my progress</button></div></div></details></section>
</div>${syncInfo()}`}
function profileTab(){const p=P.prof;const t=totalXP(),m=mrInfo(t.total);
  const top=`<div class="panel stack cut"><h2>Tenno</h2><label class="small" for="tname">Your in-game name</label><input id="tname" type="text" value="${esc(P.tname||(p&&p.name)||'')}" placeholder="Shown on your hub" autocomplete="off">
  <div class="kv"><span>Mastery Rank (tracked)</span><span class="num">${m.mr>30?'L'+(m.mr-30):m.mr}</span><span>Mastery XP</span><span class="num">${fmt(t.total)}</span><span>Gear mastered</span><span class="num">${MI.filter(i=>rankOf(i.n)>=maxRank(i)).length}/${MI.length}</span><span>Quests completed</span><span class="num">${Q.filter(q=>on('q|'+q.n)).length}/${Q.length}</span><span>Nodes cleared</span><span class="num">${ALLN.filter(n=>on('n|'+n.id)).length}/${ALLN.length}</span><span>Steel Path nodes</span><span class="num">${ALLN.filter(n=>on('sp|'+n.id)).length}/${ALLN.length}</span></div>
  <div class="row"><button class="btn" data-ttab="breakdown">Adjust mastery breakdown</button><a class="btn" href="#ranks">Update ranks</a><button class="btn primary" id="exhtml">Export report</button></div></div>`;
  if(!p)return top+`<div class="panel empty cut">Sync your account to add career stats, loadout and syndicates here.<div style="margin-top:10px"><button class="btn" data-ttab="account">Go to sync</button></div></div>`;
  const kv=(k,v)=>v==null||v===''||v==='—'?'':`<span>${k}</span><span class="num">${v}</span>`;
  let h=top+`<div class="panel stack cut"><h2>Career</h2><div class="kv">${kv('In-game Mastery Rank',p.mr!=null?mrLabel(p.mr):'')}${kv('Account created',p.created?fdate(p.created):'')}${kv('Clan',esc(p.guild||''))}${kv('Time played',p.time?fmt(p.time/3600)+' h':'')}${kv('Missions completed',fmt(p.mcomp))}${kv('Missions failed',fmt(p.mfail))}${kv('Enemies killed',fmt(p.kills))}${kv('Melee kills',fmt(p.melee))}${kv('Deaths',fmt(p.deaths))}${kv('Revives',fmt(p.revives))}${kv('Credits earned',fmt(p.income))}${kv('Items picked up',fmt(p.pickups))}</div></div>`;
  if(p.intr)h+=`<div class="panel stack cut"><h2>Intrinsics</h2><div class="kv">${Object.entries(p.intr).map(([k,v])=>kv(esc(k),v)).join('')}</div></div>`;
  if(p.synd&&p.synd.length)h+=`<div class="panel stack cut"><h2>Syndicates</h2><div class="kv">${p.synd.map(([n,s,t])=>kv(esc(n)+(t!=null?` <span class="chip">Rank ${esc(t)}</span>`:''),fmt(s))).join('')}</div></div>`;
  if(p.loadout&&p.loadout.length)h+=`<div class="panel stack cut"><h2>Equipped</h2><div class="row">${p.loadout.map(n=>`<span class="chip teal">${L(n)}</span>`).join('')}</div></div>`;
  if(p.topw&&p.topw.length)h+=`<div class="panel stack cut"><h2>Most-used weapons</h2><div class="kv">${p.topw.map(([n,k])=>kv(L(n),fmt(k)+' kills')).join('')}</div></div>`;
  if(p.topa&&p.topa.length)h+=`<div class="panel stack cut"><h2>Most-cast abilities</h2><div class="kv">${p.topa.map(([n,k])=>kv(esc(n),fmt(k))).join('')}</div></div>`;
  return h}
function foundryFind(n){const it=I[n];if(it)return it.t||0;for(const m of Object.values(I)){const p=m.parts.find(p=>p.sub&&m.n+' '+p.n===n);if(p)return p.t||43200}return null}
function foundryTab(){const now=Date.now();const list=(P.foundry||[]).slice().sort((a,b)=>(a.t0+a.dur*1000)-(b.t0+b.dur*1000));
  return `<div class="panel stack cut"><h2>Foundry</h2><p class="small muted" style="margin:0">Warframe doesn't share your Foundry publicly, so add builds here when you start them. Build times fill in automatically.</p>
  <div class="row"><input id="fadd" type="search" list="fitems" placeholder="What did you start building?" style="flex:1 1 220px" autocomplete="off"><datalist id="fitems">${Object.keys(I).map(n=>`<option value="${esc(n)}">`).join('')}${Object.values(I).flatMap(it=>it.parts.filter(p=>p.sub).map(p=>`<option value="${esc(it.n+' '+p.n)}">`)).join('')}</datalist><button class="btn primary" id="faddb">Start</button></div>
  <div id="flist">${list.length?list.map(f=>{const end=f.t0+f.dur*1000;const left=end-now;return `<div class="ft"><div><div><b>${L(f.n)}</b></div><div class="small muted">${left<=0?'<span class="ready">Ready to claim</span>':'Ready in '+hrs(left/1000)+' · '+new Date(end).toLocaleString('en-US',{weekday:'short',hour:'numeric',minute:'2-digit'})}</div></div><div class="row"><button class="btn sm ${left<=0?'primary':''}" data-fclaim="${f.id}">${left<=0?'Claim':'Done'}</button><button class="btn sm" data-fdel="${f.id}" aria-label="Remove ${esc(f.n)}">${ic('close')}</button></div></div>`}).join(''):'<div class="empty">Nothing building. Add something above, or tap "Start Foundry timer" on any craft.</div>'}</div></div>`}
function inventoryTab(){const q=state.invQ.toLowerCase();const common=['Ferrite','Rubedo','Alloy Plate','Nano Spores','Polymer Bundle','Salvage','Plastids','Circuits','Cryotic','Oxium','Gallium','Morphics','Neural Sensors','Neurodes','Orokin Cell','Control Module','Argon Crystal','Tellurium','Nitain Extract','Kuva','Hexenon','Detonite Injector','Fieldron','Mutagen Mass'].filter(n=>RES[n]);
  const list=q?Object.keys(RES).filter(n=>n.toLowerCase().includes(q)):[...new Set([...common,...Object.keys(P.inv||{}).filter(n=>RES[n])])];
  return `<div class="panel stack cut"><h2>Inventory</h2><p class="small muted" style="margin:0">Type what you have. Shopping lists across the app then show <span class="have ok">have</span> or <span class="have no">short</span> next to each material.</p>
  <input id="invq" type="search" placeholder="Find another material" value="${esc(state.invQ)}">
  <div class="inv">${list.slice(0,120).map(n=>{const id='inv-'+n.replace(/\W/g,'');return `<label for="${esc(id)}" class="small">${L(n)}</label><input id="${esc(id)}" type="number" inputmode="numeric" min="0" data-inv="${esc(n)}" value="${P.inv&&P.inv[n]!=null?esc(P.inv[n]):''}" placeholder="0">`}).join('')}</div></div>`}
function backupTab(){return `<div class="panel stack cut"><h2>Backup</h2>
  <p class="small" style="margin:0">${synced?(acct&&acct.kind==='fb'?'You\'re signed in, so progress saves to your account automatically and follows you to every device.':'Progress saves automatically.'):'Progress is saved in this browser only. Sign in (Account &amp; sync) to keep it on every device, or use a backup to move it.'} Backups are dated and restore everything, even after clearing your browser.</p>
  <div class="row"><button class="btn primary" id="exhtml">Export report (HTML)</button><button class="btn" id="exjson">Export data (JSON)</button></div><div class="small muted">The report lists your breakdown, every ranked item, star chart, quests, syndicates and raw data, so you can check it against the game.</div>
  <div class="row"><button class="btn" id="bk-copy">Copy backup code</button><button class="btn" id="bk-file">Save backup file</button></div>
  <label for="bk-in" class="small">Restore</label><textarea id="bk-in" placeholder="Paste a backup code or the contents of a backup file"></textarea><div class="row"><button type="button" class="btn" id="bkprev">Preview restore</button><label class="btn" for="bkfile">Open backup file</label><input id="bkfile" type="file" accept=".json,.txt,application/json,text/plain" hidden></div>
  ${state.bkPrev?`<div class="panel stack" style="border-color:var(--gold-dim)"><b>This backup contains</b>${backupSummary(state.bkPrev)}<div class="small">Restoring replaces the progress on this device${synced?' and in your account':''}. You can undo right after.</div><div class="row"><button type="button" class="btn primary" id="bkapply">Replace my progress</button><button type="button" class="btn" id="bkcancel">Cancel</button></div></div>`:''}</div>
  <div class="panel stack cut"><h2>Fine-tune MR</h2>
  <div class="row"><label class="small" for="intr" style="flex:1 1 200px">Total intrinsic ranks (1,500 XP each)</label><input id="intr" type="number" min="0" inputmode="numeric" value="${+P.intr||0}" style="width:120px"></div>
  <div class="row"><label class="small" for="adj" style="flex:1 1 200px">XP adjustment to match in-game</label><input id="adj" type="number" inputmode="numeric" value="${+P.adj||0}" style="width:120px"></div></div>`}

/* ---------- resources ---------- */
const MAINRES=['Ferrite','Rubedo','Alloy Plate','Nano Spores','Polymer Bundle','Salvage','Plastids','Circuits','Cryotic','Oxium','Gallium','Morphics','Neural Sensors','Neurodes','Orokin Cell','Control Module','Argon Crystal','Tellurium','Nitain Extract','Kuva','Hexenon','Detonite Ampule','Fieldron Sample','Mutagen Sample'];
function resources(){const sel=state.resSel&&RES[state.resSel]?state.resSel:null;const q=state.resQ.toLowerCase();
  const main=MAINRES.filter(n=>RES[n]);const rest=Object.keys(RES).filter(n=>!main.includes(n)).sort();
  const gneed={};(P.goals||[]).filter(n=>I[n]&&!on('build|'+n)).forEach(n=>{const a=totals(n,1,{cr:0,r:{},pt:0},[]);for(const r in a.r)gneed[r]=(gneed[r]||0)+a.r[r]});
  const rf=state.rsF||'all';let list=q?Object.keys(RES).filter(n=>n.toLowerCase().includes(q)):null;
  if(rf!=='all'){list=(list||Object.keys(RES)).filter(n=>rf==='inv'?(P.inv&&P.inv[n]!=null):rf==='goal'?gneed[n]:rf==='short'?(gneed[n]&&!(P.inv&&+P.inv[n]>=gneed[n])):RT[n]);list.sort()}
  const hitR=n=>`<button class="hit ${sel===n?'sel':''}" data-go="res|${esc(n)}"><span>${esc(n)}</span><span class="row">${P.inv&&P.inv[n]!=null?`<span class="have ok">${fmt(P.inv[n])}</span>`:''}<span class="chip">${RT[n]?'by stage':(RSRC[n]||[]).length+' farms'}</span></span></button>`;
  return `<div class="stack"><div class="head"><div class="eyebrow">Farming guide</div><h1>Resources</h1><p class="lede">Tap a material to see the best farms for early, mid and late game, picked from real node levels and mission types.</p></div>
  <div class="split two"><div class="stack" style="gap:8px"><input id="rq" type="search" placeholder="Find a material" value="${esc(state.resQ)}" autocomplete="off" aria-label="Find a material">${`<select id="rsf" aria-label="Filter materials" style="width:auto">${[['all','All materials'],['planet','Planet resources'],['goal','Needed for my goals'],['short','Short for my goals'],['inv','In my inventory']].map(([k,l])=>`<option value="${k}" ${(state.rsF||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}
  ${list?countLine(list.length,Object.keys(RES).length,'materials',!!(q||rf!=='all'),'rsclear'):''}<div class="results" id="rres">${list?list.map(hitR).join('')||'<div class="small muted">No matches.</div>':`<div class="eyebrow" style="margin:6px 0">Planet resources</div>${main.map(hitR).join('')}<details class="more"><summary>All other materials (${rest.length})</summary><div class="results">${rest.map(hitR).join('')}</div></details>`}</div></div>
  <div id="rdet">${sel?resDetail(sel):`<div class="panel empty cut">Pick a material to see where to farm it.</div>`}</div></div></div>`}
function resDetail(n){const r=RES[n]||{};const t=RT[n];const s=RSRC[n]||[];
  const users=Object.values(I).filter(it=>it.parts.some(p=>p.n===n||(p.sub||[]).some(x=>x[0]===n))).map(i=>i.n);
  let h=`<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3>${r.ra?`<span class="chip">${esc(r.ra)}</span>`:''}${priceChip(n)}<span style="margin-left:auto">${taskBtn('res',n,'Farm '+n)}</span></div>
   <div class="row"><label class="small" for="have1">You have</label><input id="have1" type="number" inputmode="numeric" min="0" data-inv="${esc(n)}" value="${P.inv&&P.inv[n]!=null?esc(P.inv[n]):''}" placeholder="0" style="width:130px"></div></div><div style="padding:12px 14px" class="stack">`;
  if(r.best)h+=`<div class="callout small"><b>Community pick:</b> ${esc(r.best)}${r.how?'. '+esc(r.how):''}</div>`;
  if(t){h+=`<div class="small muted">Drops on ${t.planets.map(p=>`<a class="ln" href="#" data-go="node|${esc(p)}">${esc(p)}</a>`).join(', ')}. Best options at each stage; yours is <b>${esc(stage())}</b>. Ranked by mission type and Dark Sector resource bonuses.</div>`+
    Object.entries(t.tiers).filter(([k,v])=>v.length).map(([k,v])=>`<div class="tier cut${k===stage()?' mine':''}"><h4>${esc(k)}${k===stage()?' <span class="chip gold">Your stage</span>':''}</h4><ol>${v.map(([nd,ty,lv,why])=>{const pl=String(nd).split(', ').pop();const open=planetOpen(pl);return `<li><b>${esc(nd)}</b> <span class="muted">· ${esc(ty)} · Lv ${lv[0]}–${lv[1]}</span>${open?'':` <span class="chip warn">Reach ${esc(pl)} first</span>`}<div class="small muted">${esc(why)}</div></li>`}).join('')}</ol></div>`).join('')+
    `<div class="tier cut"><h4>Steel Path</h4><div class="small">Any node above on Steel Path drops resources at a higher rate. Endless Dark Sector nodes are the best Steel Path loot runs.</div></div>`}
  if(s.length)h+=`<div class="tier cut"><h4>${t?'Other sources':'Best sources'}</h4><ol>${s.map(([a,b])=>`<li><b>${nodeLink(a)}</b>${b?`<div class="small muted">${esc(b)}</div>`:''}</li>`).join('')}</ol></div>`;
  if(!t&&!s.length)h+=`<div class="small muted">${r.loc?'Found on: '+esc(r.loc):'No farming data. Check the wiki.'}</div>`;
  h+=`<ol class="steps" style="border:1px solid var(--line)">${step('farm|'+n,'Farm '+esc(n),'Tick when you have enough.')}</ol>
  ${srcLine('res')}<div class="small muted">Double drops: Nekros Desecrate, Smeeta Kavat Charm, Resource Booster, and Khora's Pilfering Strangledome all stack.</div>
  ${users.length?`<details class="more"><summary>Used in ${users.length} crafts</summary><div class="row">${users.slice(0,80).map(u=>`<button class="btn sm" data-go="item|${esc(u)}">${esc(u)}</button>`).join('')}</div></details>`:''}</div></section>`;return h}

/* ---------- mastery ---------- */
function mastery(){const tab=state.mTab;
  const tabs=[['path','Path to max'],['ladder','Rank ladder'],['sheet','Starter weapons (MR 0–12)'],['sframes','Easy Warframes'],['craft','Crafting chains'],['xp','XP farms']];
  let h=`<div class="stack"><div class="head"><div class="eyebrow">MR plan</div><h1>MR plan</h1><p class="lede">What to do next to reach your target rank, the full rank ladder, and the easiest gear to rank first. Enter what you've already ranked on the <a class="ln" href="#ranks">Ranks</a> page.</p></div>${bigMR()}<div class="seg" role="tablist">${tabs.map(([k,l])=>`<button class="btn ${tab===k?'on':''}" data-mtab="${k}" role="tab" aria-selected="${tab===k}">${l}</button>`).join('')}</div>`;
  if(tab==='sheet'){const by={};M.weapons.forEach(w=>(by[w.mr]=by[w.mr]||[]).push(w));
    h+=`<p class="small muted" style="margin:0">The cheapest weapons to rank, grouped by the Mastery Rank you need to build them. Together they give ${fmt(D.meta.sheetXp)} XP, enough to reach MR 12. "Path to max" carries on from there.</p>`+Object.keys(by).sort((a,b)=>a-b).map(mr=>`<details class="obj grp" data-scope="input.ck.mk" ${mr<=2?'open':''}><summary><h3>Mastery ${mr}</h3>${progHTML()}</summary>${by[mr].map(w=>mrow(w.id,w.slot)).join('')}</details>`).join('')}
  if(tab==='sframes')h+=`<details class="obj grp" data-scope="input.ck.mk" open><summary><h3>Easy Warframes</h3>${progHTML()}</summary>${M.frames.map(f=>mrow(f.id,f.src)).join('')}</details>
    <details class="obj grp" data-scope="input.ck.mk" open><summary><h3>Market companions</h3>${progHTML()}</summary>${M.companions.map(f=>mrow(f.id,'Market blueprint')).join('')}</details>`;
  if(tab==='craft'){const by={};M.craft.forEach(x=>(by[x.mr]=by[x.mr]||[]).push(x));
    h+=`<div class="callout small tf-more">Weapons used to craft other weapons. Rank the ingredient for its XP first, then build a spare copy for the recipe.</div>`+
    Object.keys(by).sort((a,b)=>a-b).map(mr=>`<details class="obj grp" data-scope="input.ck.mk" open><summary><h3>MR ${mr}</h3>${progHTML()}</summary>${by[mr].map(x=>`<div style="padding:10px 14px 0;border-top:1px solid var(--line)"><div class="mono small">${esc(x.recipe)} · ${fmt(x.xp)} XP</div>${x.note?`<div class="small" style="color:var(--warn)">${esc(x.note)}</div>`:''}</div>${x.targets.map(t=>mrow(t.id,'')).join('')}`).join('')}</details>`).join('')}
  if(tab==='xp')h+=`<div class="panel stack cut"><h2>Where to level gear fast</h2>
    <p class="small muted" style="margin:0">Best spots first. A frame that clears whole rooms ranks a fresh weapon to 30 in a few waves; stack an Affinity Booster on days you level several items.</p></div>
    <ol class="steps obj">${[['Hydron, Sedna (Defense)','Classic spot. Bring a frame that clears rooms (Saryn, Mesa, Gyre). Leave after wave 5–10.'],['Helene, Saturn (Defense)','Lower level than Hydron, good for new players. Also drops Orokin Cells.'],['Elite Sanctuary Onslaught','Best XP per minute once you have a strong frame. Talk to Cephalon Simaris in a Relay (needs The New Strange).'],['Steel Path Hydron / Helene','Same nodes on Steel Path give much more XP. Needs a strong build.'],['Affinity Booster + Sortie/Arbitration boosters','Boosters stack. Save them for a day you plan to level several items.'],['Star chart + Steel Path completion','The first clear of each node gives Mastery XP, and Steel Path pays it again. Track it under Missions.']].map(([a,b],i)=>step('xpfarm|'+i,a,b)).join('')}</ol>`;
  return h+'</div>'}
function ease(it){if(it.p)return it.v?(VAULT[it.n]&&VAULT[it.n].now?2:4):2;if(it.bc)return 0;if(it.bpd||it.dr)return 1;return 3}
const EASE=['Market blueprints','Boss and node drops','Farm relics','Quest, syndicate or vendor','Vaulted: buy on warframe.market'];
function mrow(id,note){if(!id)return'';const it=I[id];const k='m|'+id;const rk=P.rk[id];
  return `<div class="mitem${on(k)?' done':''}"><div class="top">${ck(k,'mk')}<details class="lazy" data-tree="${esc(id)}" data-note="${esc(note||'')}"><summary><span class="nm">${esc(id)}</span>${it&&it.mr?`<span class="chip">MR ${it.mr}</span>`:''}${rk&&!on(k)?`<span class="chip teal">R${rk}</span>`:''}<span class="chip">${fmt(mxp(it))} XP</span>${it&&it.p?priceChip(id+' Set'):''}<span class="open">Steps ▾</span>${note?`<span class="small muted" style="flex-basis:100%">${esc(note)}</span>`:''}</summary><div class="lazybody"></div></details></div></div>`}/* ---------- warframes ---------- */
function baseOf(n){return n.replace(/ Prime$/,'').replace(/ Umbra$/,'')}
function frames(){const ff=state.frF||'all';const fr=Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth').filter(i=>{const r=rankOf(i.n);return ff==='all'||(ff==='owned'&&r>0)||(ff==='not'&&r===0)||(ff==='mastered'&&r>=maxRank(i))||(ff==='prime'&&i.p)||(ff==='farm'&&i.p&&!i.v)||(ff==='goals'&&(P.goals||[]).includes(i.n))}).map(i=>i.n).sort();
  if(!fr.length)fr.push(...Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth').map(i=>i.n).sort());
  if(!state.frame||!I[state.frame]||!fr.includes(state.frame))state.frame=fr.includes('Saryn Prime')?'Saryn Prime':fr[0];
  const name=state.frame,base=baseOf(name);const builds=D.builds[base]||D.builds[name]||[];const bi=Math.max(0,Math.min(state.build,builds.length-1));
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Arsenal</div><h1>${esc(name)}</h1></div>
  <div class="row">${`<select id="frf" aria-label="Filter Warframes" style="width:auto">${[['all','All Warframes'],['owned','Owned'],['not','Not owned'],['mastered','Mastered'],['prime','Prime'],['farm','Prime, farmable now'],['goals','In my goals']].map(([k,l])=>`<option value="${k}" ${(state.frF||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}<select id="fsel" aria-label="Choose a Warframe" style="flex:1 1 200px">${fr.map(n=>`<option ${n===name?'selected':''}>${esc(n)}</option>`).join('')}</select>
  ${I[base+' Prime']&&name!==base+' Prime'?`<button class="btn" data-frame="${esc(base+' Prime')}">Prime version</button>`:''}${name!==base&&I[base]?`<button class="btn" data-frame="${esc(base)}">Base version</button>`:''}</div>
  <div class="split wf">${itemTree(name)}`;
  if(builds.length){const b=builds[bi];const sw=m=>state.budget&&D.budget[m]?D.budget[m]:m;
    const slots=[['Aura',sw(b.aura)],['Exilus',sw(b.exilus)],...b.mods.map(m=>['Mod',sw(m)])];
    h+=`<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>Meta build</h3></div>
      <div class="seg">${builds.map((x,i)=>`<button class="btn ${i===bi?'on':''}" data-build="${i}">${esc(x.name)}</button>`).join('')}<button class="btn ${state.budget?'on':''}" id="budget">Budget mods</button></div>${progHTML()}</div>
      <div style="padding:12px 14px" class="stack"><div class="row"><span class="chip teal">${esc(b.role)}</span><span class="small">Helminth: <b>${esc(b.helminth)}</b></span></div>${b.notes?`<div class="small muted">${esc(b.notes)}</div>`:''}
      <div class="mods">${slots.map(([s,m])=>modCard(s,m)).join('')}${b.arcanes.map(a=>arcCard(a)).join('')}</div>
      <div class="small muted">Forma each slot to match its mod's polarity.</div></div></section>`}
  return h+'</div></div>'}
function modCard(slot,m){const md=MODS[m]||{};const k='mod|'+m;
  const src=md.src?esc(md.src):(md.dr&&md.dr.length?dropsList(md.dr,2):'Trade on warframe.market');
  return `<div class="mod${on(k)?' done':''}">${ck(k)}<div><div class="slot">${slot}${md.pol?` · <span class="pol">${esc(md.pol)}</span>`:''}</div><div class="nm"><span class="lbl">${esc(m)}</span> ${priceChip(m)}</div><div class="src">${src}</div>${sellerRow(m)}</div></div>`}
function arcCard(a){const ad=ARC[a]||{};const k='arc|'+a;
  return `<div class="mod${on(k)?' done':''}">${ck(k)}<div><div class="slot">Arcane</div><div class="nm"><span class="lbl">${esc(a)}</span> ${priceChip(a)}</div><div class="src">${ad.dr&&ad.dr.length?dropsList(ad.dr,2):'Trade on warframe.market'}</div>${sellerRow(a)}</div></div>`}

/* ---------- farm finder ---------- */
let IDX=null;
function buildIdx(){IDX=[];for(const n in I)IDX.push([n,'item',I[n].p?'Prime '+I[n].c:I[n].c,I[n].c]);
  for(const n in D.partrel)IDX.push([n,'part','Prime part',(partOwner(n)||{}).c||'']);for(const n in REL)IDX.push([n,'relic','Relic'+(REL[n].v?' · vaulted':''),REL[n].era]);
  for(const n in MODS)IDX.push([n,'mod',MODS[n].ty||'Mod',MODS[n].ty||'Mod']);for(const n in ARC)IDX.push([n,'arc',ARC[n].ty||'Arcane',ARC[n].ty||'Arcane']);for(const n in RES)IDX.push([n,'res','Resource',''])}
/* q: words that must all appear; ty/cat narrow it first so a filter never hides real matches */
function search(q,ty,cat){if(!IDX)buildIdx();q=(q||'').toLowerCase().trim();const w=q?q.split(/\s+/):[];
  let r=IDX.filter(x=>(!ty||ty==='all'||x[1]===ty)&&(!cat||x[3]===cat));
  if(w.length){r=r.filter(([n])=>{const l=n.toLowerCase();return w.every(x=>l.includes(x))});r.sort((a,b)=>{const al=a[0].toLowerCase(),bl=b[0].toLowerCase();return (bl.startsWith(q)-al.startsWith(q))||a[0].length-b[0].length||a[0].localeCompare(b[0])})}
  else r.sort((a,b)=>a[0].localeCompare(b[0],'en',{numeric:true}));return r}
const FFT=[['all','Everything'],['item','Gear & sets'],['mod','Mods'],['relic','Relics'],['part','Prime parts'],['arc','Arcanes'],['res','Resources']];
function ffCats(ty){if(!IDX)buildIdx();if(!ty||ty==='all'||ty==='res')return [];const c={};IDX.forEach(x=>{if(x[1]===ty&&x[3])c[x[3]]=(c[x[3]]||0)+1});
  const order=ty==='relic'?['Lith','Meso','Neo','Axi','Requiem']:null;return Object.entries(c).sort((a,b)=>order?order.indexOf(a[0])-order.indexOf(b[0]):b[1]-a[1])}
function unvFilter(r){return state.unvOnly?r.filter(([n,t])=>t==='relic'?!REL[n].v:t==='part'?D.partrel[n].some(x=>!REL[x[0]]?.v):t==='item'&&I[n].p?!I[n].v:true):r}
function farm(){const sel=state.farmSel;
  return `<div class="stack"><div class="head"><div class="eyebrow">Farm Finder</div><h1>Farm finder</h1></div>
  <div class="split two"><div class="stack" style="gap:8px"><input id="fq" type="search" placeholder="Search, or pick a type to browse everything" value="${esc(state.farmQ)}" autocomplete="off" enterkeyhint="search" aria-label="Search">
  <div class="row">${`<select id="fft" aria-label="Result type" style="width:auto">${FFT.map(([k,l])=>`<option value="${k}" ${(state.ffT||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}${(()=>{const cs=ffCats(state.ffT||'all');return cs.length?`<select id="ffc" aria-label="Category" style="width:auto"><option value="">All ${esc((FFT.find(x=>x[0]===(state.ffT||'all'))||[,''])[1].toLowerCase())}</option>${cs.map(([c,n])=>`<option value="${esc(c)}" ${state.ffC===c?'selected':''}>${esc(c)} (${n})</option>`).join('')}</select>`:''})()}<button class="btn ${state.unvOnly?'on':''}" id="unv">Farmable now only</button>${sel?`<button class="btn" id="jump">Jump to result ↓</button>`:''}</div>
  <div class="results" id="fres">${resultsHTML()}</div></div><div id="fdet">${sel?detail(sel):''}</div></div></div>`}
function resultsHTML(){const ft=state.ffT||'all';const cats=ffCats(ft);const cat=cats.some(c=>c[0]===state.ffC)?state.ffC:'';const q=state.farmQ||'';
  const total=search('',ft,cat).length;let r=unvFilter(search(q,ft,cat));const lim=state.ffLim||60;
  const what=ft==='all'?'results':(FFT.find(x=>x[0]===ft)||[,'results'])[1].toLowerCase();
  const head=countLine(r.length,total,what,!!(q||ft!=='all'||cat||state.unvOnly),'ffclear');
  if(!r.length)return head+'<div class="small muted">No matches. Try fewer letters, or a different type.</div>';
  return head+r.slice(0,lim).map(hit).join('')+(r.length>lim?`<button type="button" class="btn" id="ffmore">Show ${Math.min(60,r.length-lim)} more</button>`:'')}
function hit([n,t,l]){const s=state.farmSel===t+'|'+n;return `<button class="hit ${s?'sel':''}" data-pick="${esc(t+'|'+n)}"><span>${esc(n)}</span><span class="row" style="gap:4px">${t==='item'?mxChip(n):''}<span class="chip">${esc(l)}</span></span></button>`}
function detail(sel){const i=sel.indexOf('|');const t=sel.slice(0,i),n=sel.slice(i+1);
  if(t==='item')return itemTree(n);
  if(t==='res')return resDetail(n);
  if(t==='relic')return REL[n]?`<section class="obj"><div class="obj-h"><div class="title"><h3>${esc(n)} Relic</h3>${REL[n].v?'<span class="chip bad">Vaulted</span>':'<span class="chip ok">Farmable</span>'}${priceChip(n+' Relic')}<span style="margin-left:auto">${taskBtn('relic',n,(REL[n].v?'Buy ':'Farm ')+n+' relic')}</span></div></div><div style="padding:12px 14px" class="small">${relicBody(n)}</div></section>`:'';
  if(t==='part'){const own=partOwner(n)||I[n.replace(/ Blueprint$/,'')];
    return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3>${priceChip(n)}</div>${sellerRow(n)}${progHTML()}</div><ol class="steps">${step('got|'+n,'Get '+esc(n),relicChips(D.partrel[n]))}</ol>${own?`<div style="padding:0 14px 12px"><button class="btn" data-pick="item|${esc(own.n)}">Open the full ${esc(own.n)} set</button></div>`:''}</section>`}
  if(t==='mod'&&MODS[n]){const md=MODS[n];return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3><span class="chip">${esc(md.ty)}</span><span style="margin-left:auto">${taskBtn('mod',n,'Get '+n)}</span></div>${progHTML()}</div><div style="padding:12px 14px">${modCard(RAR[md.r]||'Mod',n)}</div></section>`}
  if(t==='arc'&&ARC[n])return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3><span style="margin-left:auto">${taskBtn('arc',n,'Get '+n)}</span></div>${progHTML()}</div><div style="padding:12px 14px">${arcCard(n)}</div></section>`;
  return ''}

/* ---------- quests ---------- */
function qDone(n){return on('q|'+n)}
const qClean=r=>r.replace(/^Completed /,'').replace(/ \(Quest\)$/,'').replace(/ completed$/i,'').replace(/ Complete$/,'').trim();
function qPrereqs(q){return Q.filter(o=>o.n!==q.n&&q.req.some(r=>qClean(r)===o.n))}
function nextQuest(){return Q.find(q=>!qDone(q.n)&&qPrereqs(q).every(p=>qDone(p.n)))||null}
function quests(){const groups=[...new Set(Q.map(q=>q.g))];const nq=nextQuest();
  return `<div class="stack"><div class="head"><div class="eyebrow">Codex</div><h1>Quests</h1><p class="lede">Story order from the in-game Codex, with requirements and rewards from the wiki.</p></div>
  ${nq?`<div class="callout small">Next: <a class="ln" href="#quests" data-q="${esc(nq.n)}"><b>${esc(nq.n)}</b></a></div>`:''}
  <div class="row">${`<select id="qf" aria-label="Filter quests" style="width:auto">${[['all','All quests'],['avail','Available now'],['todo','Not done'],['locked','Locked'],['done','Done']].map(([k,l])=>`<option value="${k}" ${(state.qF||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}</div>
  ${groups.map(g=>{const f=state.qF||'all';const qs=Q.filter(q=>q.g===g).filter(q=>{const lk=qPrereqs(q).some(p=>!qDone(p.n));return f==='all'||(f==='done'&&qDone(q.n))||(f==='todo'&&!qDone(q.n))||(f==='locked'&&!qDone(q.n)&&lk)||(f==='avail'&&!qDone(q.n)&&!lk)});return qs.length?`<details class="obj grp" data-scope open><summary><h3>${esc(g)}</h3>${progHTML()}</summary>${qs.map(qrow).join('')}</details>`:''}).join('')||'<div class="panel empty cut">No quests match this filter.</div>'}</div>`}
function rewardLink(r){const m=Object.keys(I).find(n=>r.toLowerCase().startsWith(n.toLowerCase()+' ')||r===n);if(m)return `<a class="ln" href="#" data-go="item|${esc(m)}">${esc(r)}</a> ${mxChip(m)}`;if(MODS[r]||RES[r]||ARC[r])return L(r);return esc(r)}
function qrow(q){const k='q|'+q.n;const pre=qPrereqs(q);const locked=pre.some(p=>!qDone(p.n));
  return `<div class="qrow${qDone(q.n)?' done':''}" id="q-${esc(q.n.replace(/\W/g,''))}">${ck(k)}<div><div class="row" style="gap:6px"><span class="nm lbl">${esc(q.n)}</span>${locked&&!qDone(q.n)?'<span class="chip warn">Locked</span>':''}<a class="small ln" href="${q.w}" target="_blank" rel="noopener">Wiki</a>${!qDone(q.n)?taskBtn('quest',q.n,'Do quest: '+q.n):''}${!qDone(q.n)&&Q.indexOf(q)>0?`<button class="btn sm" data-qupto="${esc(q.n)}">Done to here</button>`:''}</div>
   ${q.d&&!qDone(q.n)?`<div class="small muted" style="margin-top:2px">${esc(q.d)}</div>`:''}
   ${q.req.length?`<div class="small" style="margin-top:6px"><b>Needs:</b> ${q.req.map(r=>{const p=pre.find(x=>qClean(r)===x.n);return p?`<a class="ln" href="#quests" data-q="${esc(p.n)}" style="color:var(--${qDone(p.n)?'ok':'warn'})">${esc(r)}</a>`:esc(r)}).join(' · ')}</div>`:''}
   ${q.rw.length?`<details class="more"><summary>Rewards (${q.rw.length})</summary><ul>${q.rw.map(r=>`<li>${rewardLink(r)}</li>`).join('')}</ul></details>`:''}</div></div>`}

/* ---------- market ---------- */
function market(){const tab=state.mkTab;
  let h=`<div class="stack"><div class="head"><div class="eyebrow">warframe.market · snapshot ${esc(D.meta.prices)}</div><h1>Market</h1></div>
  <div class="seg">${[['sets','Prime sets'],['vault','Vault tracker']].map(([k,l])=>`<button class="btn ${tab===k?'on':''}" data-mk="${k}">${l}</button>`).join('')}</div>`;
  h+=tab==='vault'?vaultTab():setsTab();return h+'</div>'}
function setsTab(){const rows=Object.entries(D.sets).map(([n,s])=>{const base=n.replace(/ Set$/,'');const it=I[base];let ps=0,du=0,okp=true;
    if(it){const parts=it.parts.filter(p=>p.k==='p');const names=[base+' Blueprint',...parts.filter(p=>p.n!=='Blueprint').map(p=>p.full)];
      names.forEach(x=>{const p=PR[x];if(p&&(p.a7??p.a30)!=null)ps+=(p.a7??p.a30);else okp=false});parts.forEach(p=>du+=p.du||0)}
    const sl=(SEL[n]||[]).filter(x=>x[0]!=='__buy');
    return {n,base,it,a7:s.a7,a30:s.a30,v7:s.v7,ps:okp&&ps?Math.round(ps):null,du:du||null,low:sl[0]?sl[0][1]:null}});
  const q=state.mkQ.toLowerCase();const mf=state.mkF||'all';let r=rows.filter(x=>!q||x.n.toLowerCase().includes(q)).filter(x=>{const v=VAULT[x.base]||{};return mf==='all'||(mf==='farm'&&x.it&&!x.it.v&&!v.now)||(mf==='vault'&&x.it&&x.it.v&&!v.now)||(mf==='now'&&v.now)||(mf==='goals'&&(P.goals||[]).includes(x.base))});const k=state.mkSort;
  r.sort((a,b)=>k==='n'?a.n.localeCompare(b.n):k==='low'?((a.low??1e9)-(b.low??1e9)):((b[k]??-1)-(a[k]??-1)));
  return `<p class="small muted" style="margin:0">7-day average price. Whisper copies a message to the cheapest seller in the daily snapshot; they may be offline.</p>
  <div class="row"><input id="mq" type="search" placeholder="Filter sets" value="${esc(state.mkQ)}" style="flex:1 1 200px" aria-label="Filter sets"><select id="msort" aria-label="Sort by" style="flex:0 1 200px">${[['a7','7-day price'],['low','Cheapest seller'],['v7','Trades'],['ps','Parts total'],['du','Ducats'],['n','Name']].map(([c,l])=>`<option value="${c}" ${k===c?'selected':''}>Sort: ${l}</option>`).join('')}</select>${`<select id="mkf" aria-label="Filter sets" style="width:auto">${[['all','All sets'],['farm','Farmable now'],['now','In Prime Resurgence'],['vault','Vaulted'],['goals','In my goals']].map(([k,l])=>`<option value="${k}" ${(state.mkF||'all')===k?'selected':''}>${l}</option>`).join('')}</select>`}</div>
  ${countLine(r.length,rows.length,'sets',!!(q||mf!=='all'),'mkclear')}<div class="mklist">${r.slice(0,state.mkLim||60).map(x=>{const b=(SEL[x.n]||[]).filter(y=>y[0]!=='__buy')[0];return `<div class="mkrow">${art(x.base,'mini')||'<span class="mini"></span>'}<div class="mkt"><span class="row" style="gap:6px"><a class="nm ln" href="#" data-go="item|${esc(x.base)}">${esc(x.base)}</a>${vaultChip(x.it)}${mxChip(x.base)}</span><span class="small muted">${[x.ps!=null?'Parts '+x.ps+'p':'',x.du?x.du+' ducats':'',x.v7?fmt(x.v7)+' sold a week':''].filter(Boolean).join(' · ')}</span></div><div class="mkp"><b>${x.a7!=null?Math.round(x.a7)+'p':'—'}</b><span class="row" style="gap:6px;justify-content:flex-end">${b?`<button class="btn sm" data-wh="${esc(whisper(x.n,b))}" aria-label="Copy a whisper to ${esc(b[0])}, selling at ${b[1]} platinum">Whisper · ${b[1]}p</button>`:''}<a class="btn sm" href="https://warframe.market/items/${MS[x.n]||''}" target="_blank" rel="noopener" aria-label="${esc(x.base)} listings on warframe.market">Listings</a></span></div></div>`}).join('')}</div>${r.length>(state.mkLim||60)?`<button type="button" class="btn" id="mkmore">Show ${Math.min(60,r.length-(state.mkLim||60))} more</button>`:''}`}
function vaultTab(){const primes=Object.values(I).filter(i=>i.p);
  const isNow=i=>VAULT[i.n]&&VAULT[i.n].now;
  const now=primes.filter(isNow),farm=primes.filter(i=>!i.v&&!isNow(i)),vault=primes.filter(i=>i.v&&!isNow(i));
  vault.sort((a,b)=>((VAULT[a.n]||{}).est||'9').localeCompare((VAULT[b.n]||{}).est||'9'));farm.sort((a,b)=>(a.evd||'9').localeCompare(b.evd||'9'));
  const card=i=>{const v=VAULT[i.n]||{};return `<div class="card cut"><div class="top"><a class="nm ln" href="#" data-go="item|${esc(i.n)}">${esc(i.n)}</a><span class="chip">${esc(i.c)}</span></div><div class="small muted">${
    v.now?`In Varzia's Prime Resurgence until <b style="color:var(--ok)">${fdate(v.now)}</b> at ${esc(D.vtnow.loc||"Maroo's Bazaar")}. Buy its relics with Aya or Regal Aya.`:
    !i.v?(i.evd?`Drops from relics now. Expected to vault around <b>${fdate(i.evd)}</b>.`:'Drops from relics now. Not scheduled to vault.'):
    `Vaulted${i.vd?' since '+fdate(i.vd):''}.${v.last?` Last in Resurgence ${fdate(v.last)}.`:' Not seen in Resurgence yet.'}${v.est?` Rough estimate for its return: <b style="color:var(--gold)">${fdate(v.est)}</b>.`:''}`}</div></div>`};
  return `<p class="small muted" style="margin:0">Prime Resurgence brings back two vaulted Warframes with their weapons every 4 weeks. Return dates are rough estimates from each pair's past appearances (typical gap about ${Math.round(D.medgap/30)} months). Digital Extremes doesn't publish a schedule.</p>
  <details class="obj grp" open><summary><h3>Unvaulted now: Prime Resurgence</h3><span class="chip ok">${now.length}</span></summary><div class="cards" style="padding:10px">${now.map(card).join('')||'<div class="empty">Nothing right now.</div>'}</div></details>
  <details class="obj grp" open><summary><h3>Farmable from relics</h3><span class="chip teal">${farm.length}</span></summary><div class="cards" style="padding:10px">${farm.map(card).join('')}</div></details>
  <details class="obj grp"><summary><h3>Vaulted · soonest return first</h3><span class="chip bad">${vault.length}</span></summary><div class="cards" style="padding:10px">${vault.map(card).join('')}</div></details>`}

/* ---------- account import ---------- */
function findKey(o,key,depth){if(!o||typeof o!=='object'||depth>6)return undefined;if(!Array.isArray(o)&&key in o)return o[key];for(const k in o){const v=findKey(o[k],key,depth+1);if(v!==undefined)return v}}
const SYN={ArbitersSyndicate:'Arbiters of Hexis',CephalonSudaSyndicate:'Cephalon Suda',NewLokaSyndicate:'New Loka',PerrinSyndicate:'The Perrin Sequence',RedVeilSyndicate:'Red Veil',SteelMeridianSyndicate:'Steel Meridian',CetusSyndicate:'Ostrons',QuillsSyndicate:'The Quills',SolarisSyndicate:'Solaris United',VentKidsSyndicate:'Ventkids',VoxSyndicate:'Vox Solaris',EntratiSyndicate:'Entrati',NecraloidSyndicate:'Necraloid',ZarimanSyndicate:'The Holdfasts',KahlSyndicate:"Kahl's Garrison",EntratiLabSyndicate:'Cavia',HexSyndicate:'The Hex',LibrarySyndicate:'Cephalon Simaris',ConclaveSyndicate:'Conclave',RadioLegionSyndicate:'Nightwave'};
const pretty=s=>String(s||'').split('/').pop().replace(/([a-z])([A-Z])/g,'$1 $2').replace(/ ?Syndicate$/,'').trim();
function nm(u){return U[u]||pretty(u)}
function importProfile(txt){const a=logSnap();LOGMUTE++;let r;try{r=importProfile0(txt)}finally{LOGMUTE--}return r}
function importProfile0(txt){let raw;try{raw=JSON.parse(txt.trim())}catch(e){return 'That isn\'t profile data. Copy the whole page from your profile link and try again.'}const _pre=JSON.stringify({at:Date.now(),C,P});if(!P.wfid){const id=findId(txt);if(id){P.wfid=id;lsSet('tenno-acct',id)}}
  const j=raw.Results&&raw.Results[0]?raw.Results[0]:raw;const st=raw.Stats||{};
  const xpi=(j.LoadOutInventory&&j.LoadOutInventory.XPInfo)||findKey(j,'XPInfo',0)||[];const mis=j.Missions||[];const skills=j.PlayerSkills||{};
  if(!xpi.length&&!mis.length)return 'No ranks or missions found. Make sure you copied the whole page.';try{localStorage.setItem('tf-presync',_pre)}catch(e){}
  let maxed=0,partial=0,other=0;const rk={};
  for(const e of xpi){const n=U[e.ItemType];const xp=e.XP||0;
    if(n){const it=I[n];const k=perRank(it)===200?1000:500;const r=Math.min(maxRank(it),Math.floor(Math.sqrt(xp/k)));
      if(r>=maxRank(it)){if(!on('m|'+n))setK('m|'+n,1);maxed++}else if(r>0){rk[n]=r;partial++}}
    else other+=Math.min(30,Math.floor(Math.sqrt(xp/500)))*100}
  let nodes=0;const mc={};for(const m of mis){const id=m.Tag;if(!id||!(m.Completes>0))continue;if(m.Tier!==1)mc[id]=(mc[id]||0)+m.Completes;if(!NX[id])continue;const key=(m.Tier===1?'sp|':'n|')+id;if(!on(key))setK(key,1);nodes++}
  let intr=0;const ib={};const IL={LPS_PILOTING:'Railjack · Piloting',LPS_GUNNERY:'Railjack · Gunnery',LPS_TACTICAL:'Railjack · Tactical',LPS_ENGINEERING:'Railjack · Engineering',LPS_COMMAND:'Railjack · Command',LPS_DRIFT_RIDING:'Drifter · Riding',LPS_DRIFT_COMBAT:'Drifter · Combat',LPS_DRIFT_OPPORTUNITY:'Drifter · Opportunity',LPS_DRIFT_ENDURANCE:'Drifter · Endurance'};
  const iR={},iD={};for(const k in skills){if(/^LPS_/.test(k)&&typeof skills[k]==='number'){intr+=skills[k];ib[IL[k]||pretty(k)]=skills[k];const nm2=k.replace(/^LPS_(DRIFT_)?/,'');const lab=nm2.charAt(0)+nm2.slice(1).toLowerCase();if(/^LPS_DRIFT_/.test(k))iD[lab]=skills[k];else if(IR.includes(lab))iR[lab]=skills[k]}}
  if(intr){P.intrR=iR;P.intrD=iD}
  const owned=new Set();for(const e of xpi){const n=U[e.ItemType];if(n&&(e.XP||0)>0)owned.add(n)}
  owned.forEach(n=>stepKeys(n).forEach(setQ));
  let sp=0;for(const m of mis)if(m.Tier===1&&m.Completes>0)sp++;
  const qk=findKey(j,'QuestKeys',0)||[];for(const q of qk){const n=QU[q.ItemType];if(n&&q.Completed)setQ('q|'+n)}
  const dq=detectQuests(j,mis,owned);dq.forEach(n=>setQ('q|'+n));const qn=dq.length;
  P.syn=P.syn||{};let sn=0;for(const e of D.synd){const a=(j.Affiliations||[]).find(x=>x.Tag===e.tag);if(a){P.syn[e.n]={r:a.Title||0,s:a.Standing||0,sync:1};sn++}}
  P.nw=(j.Affiliations||[]).filter(a=>/^RadioLegion/.test(a.Tag)).map(a=>[pretty(a.Tag).replace('Radio Legion','Nightwave').replace(/Intermission ?/,'Intermission '),a.Standing||0,a.Title||0]);
  const dv={};for(const k in j)if(/^DailyAffiliation/.test(k))dv[k]=j[k];if(Object.keys(dv).length)P.daily={ts:Date.now(),v:dv};
  if(docRef){clearTimeout(timer);timer=setTimeout(flush,SAVE_MS)}lsSet('tenno-codex',C);
  P.lastSync={at:new Date().toISOString(),maxed,partial,nodes,sp,quests:dq,synd:sn,owned:owned.size};
  const lo=j.LoadOutInventory||{};const loadout=[];['Suits','LongGuns','Pistols','Melee'].forEach(k=>(lo[k]||[]).forEach(x=>{if(x&&x.ItemType)loadout.push(nm(x.ItemType))}));
  let created='';const cr=j.Created;if(cr){const v=cr.$date&&cr.$date.$numberLong?+cr.$date.$numberLong:(cr.$date||cr);const d=new Date(v);if(!isNaN(d))created=d.toISOString().slice(0,10)}
  const kills=(st.Enemies||[]).reduce((a,e)=>a+(e.kills||0),0);
  const topw=(st.Weapons||[]).filter(w=>w.kills).sort((a,b)=>b.kills-a.kills).slice(0,10).map(w=>[nm(w.type),w.kills]);
  const topa=(st.Abilities||[]).filter(a=>a.used).sort((a,b)=>b.used-a.used).slice(0,10).map(a=>[pretty(a.type).replace(/ Ability$/,''),a.used]);
  P.prof={name:j.DisplayName||P.name,mr:j.PlayerLevel,created,guild:j.GuildName||st.GuildName||'',time:st.TimePlayedSec,mcomp:st.MissionsCompleted,mfail:st.MissionsFailed,kills:kills||null,melee:st.MeleeKills,deaths:st.Deaths,revives:st.ReviveCount,income:st.Income,pickups:st.PickupCount,
    intr:Object.keys(ib).length?ib:null,synd:(j.Affiliations||[]).map(a=>[SYN[a.Tag]||pretty(a.Tag),a.Standing||0,a.Title??null]).sort((a,b)=>b[1]-a[1]),loadout,topw,topa};
  P.rk=Object.assign({},P.rk||{},rk);P.other=other;if(intr)P.intr=intr;if(j.PlayerLevel!=null)P.mr=j.PlayerLevel;P.name=j.DisplayName||P.name;P.mc=mc;P.at=new Date().toISOString();
  pushAll();
  return `Synced ${P.name||'your account'}: ${maxed} items maxed, ${partial} in progress, ${nodes} nodes cleared${intr?`, ${intr} intrinsic ranks`:''}${qn?`, ${qn} quests`:''}.`}
const SYNN={};for(const t in SYN){const n=SYN[t].toLowerCase();SYNN[n]=t;SYNN[n.replace(/^the /,'')]=t}Object.assign(SYNN,{ostron:'CetusSyndicate','vent kids':'VentKidsSyndicate',simaris:'LibrarySyndicate'});
function synTag(n){n=String(n||'');if(/Syndicate$/.test(n))return n;return SYNN[n.toLowerCase()]||SYNN[n.toLowerCase().replace(/^the /,'')]||n}
const DKEY={daily:'DailyAffiliation',conclave:'DailyAffiliationPvp',simaris:'DailyAffiliationLibrary',ostron:'DailyAffiliationCetus',quills:'DailyAffiliationQuills',solaris:'DailyAffiliationSolaris',ventKids:'DailyAffiliationVentkids',voxSolaris:'DailyAffiliationVox',entrati:'DailyAffiliationEntrati',necraloid:'DailyAffiliationNecraloid',holdfasts:'DailyAffiliationZariman',kahl:'DailyAffiliationKahl',cavia:'DailyAffiliationCavia',hex:'DailyAffiliationHex'};
function dailyFrom(p){const o={};const d=p.dailyStanding||{};for(const k in d)if(DKEY[k])o[DKEY[k]]=d[k];if(p.dailyFocus!=null)o.DailyFocus=p.dailyFocus;return o}
function fromParsed(o){if(o&&o.Results)return o;const p=o.profile||o;const st=o.stats||{};const i=p.intrinsics||{};
  const sk={LPS_TACTICAL:i.tactical,LPS_PILOTING:i.piloting,LPS_GUNNERY:i.gunnery,LPS_ENGINEERING:i.engineering,LPS_COMMAND:i.command,LPS_DRIFT_RIDING:i.riding,LPS_DRIFT_COMBAT:i.combat,LPS_DRIFT_OPPORTUNITY:i.opportunity,LPS_DRIFT_ENDURANCE:i.endurance};for(const k in sk)if(sk[k]==null)delete sk[k];
  const lo=p.loadout||{};const li=x=>(x||[]).map(e=>({ItemType:e.uniqueName||(e.item&&e.item.uniqueName)})).filter(e=>e.ItemType);
  return {Results:[{DisplayName:p.displayName,PlayerLevel:p.masteryRank,GuildName:p.guildName,Created:p.created,
    LoadOutInventory:{XPInfo:(lo.xpInfo||[]).map(x=>({ItemType:x.uniqueName,XP:x.xp})),Suits:li(lo.suits),LongGuns:li(lo.primary),Pistols:li(lo.secondary),Melee:li(lo.melee)},
    Missions:(p.missions||[]).map(m=>({Tag:m.nodeKey||m.node,Completes:m.completes,Tier:m.tier})),PlayerSkills:sk,
    Affiliations:(p.syndicates||[]).map(a=>({Tag:synTag(a.name),Standing:a.standing,Title:a.title})),
    ChallengeProgress:(p.challengeProgress||[]).map(c=>({Name:c.name,Progress:c.progress})),...dailyFrom(p)}],
    Stats:{GuildName:st.guildName,TimePlayedSec:st.timePlayedSec,MissionsCompleted:st.missionsCompleted,MissionsFailed:st.missionsFailed,MeleeKills:st.meleeKills,Deaths:st.deaths,ReviveCount:st.reviveCount,Income:st.income,PickupCount:st.pickupCount,
      Enemies:(st.enemies||[]).map(e=>({kills:e.kills})),Weapons:(st.weapons||[]).map(w=>({type:w.uniqueName,kills:w.kills})),Abilities:(st.abilities||[]).map(a=>({type:a.uniqueName,used:a.used}))}}}
async function autoSync(quiet){const id=(P.wfid||'').trim();if(!/^[0-9a-f]{24}$/i.test(id)){if(!quiet)toast('Enter your 24-character account ID first');return false}
  try{let j=null;if(window.TENNO_PROXY){const relay=async plat=>{try{return await netJSON('relay',window.TENNO_PROXY+'?playerId='+id+(plat&&plat!=='pc'?'&platform='+plat:''))}catch(e){if(e.kind==='stopped'||e.kind==='budget'||e.kind==='backoff')throw e;return null}};
      const plat=typeof wfPlat==='function'?wfPlat().id:'pc';j=await relay(plat);
      /* cross-save accounts keep their profile on the PC server, so a console or phone server with no profile falls back to it */
      if(plat!=='pc'&&!(j&&(j.Results||j.profile))){const pc=await relay('pc');if(pc&&(pc.Results||pc.profile))j=pc}}
    if((!j||!(j.Results||j.profile))&&typeof wfPlat==='function'&&wfPlat().id!=='pc'){const er=new Error('relay');er.msg=j&&typeof j.error==='string'?j.error.slice(0,160):'';throw er}if(!j||!(j.Results||j.profile)){j=await netJSON('relay','https://api.warframestat.us/profile/'+id+'/?language=en');if(j.error)throw new Error(j.error)}
    const msg=importProfile(JSON.stringify(fromParsed(j)));P.auto=new Date().toISOString();saveProfile();if(!quiet||location.hash==='#home'||location.hash==='')render();if(!quiet)toast(msg);return true}
  catch(e){if(e instanceof NetErr&&e.kind!=='network'&&e.kind!=='http'){if(!quiet)toast(e.message);return false}
    if(!quiet){state.syncFail=true;state.tTab='account';saveUI();if(location.hash!=='#tenno')location.hash='tenno';else render();
      toast(e&&e.msg?e.msg+' Or use the two quick steps on this page.':"Warframe's profile service didn't answer. Use the two quick steps on this page.");setTimeout(()=>{const b=$('#syncsteps');if(b)b.scrollIntoView({block:'center'})},60)}return false}}
async function liveResurgence(){try{const v=await netJSON('vault','https://api.warframestat.us/pc/vaultTrader/?language=en');if(!v.inventory||!v.expiry)return;
  const until=v.expiry.slice(0,10);if(until===D.vtnow.until)return;const frames=v.inventory.map(x=>x.item).filter(n=>I[n]&&I[n].c==='Warframe');if(!frames.length)return;
  const pairs=new Set(frames.map(f=>(VAULT[f]||{}).pair).filter(Boolean));for(const n in VAULT)delete VAULT[n].now;
  for(const n in VAULT){if(frames.includes(n)||pairs.has(VAULT[n].pair))VAULT[n].now=until}D.vtnow={until,items:v.inventory.map(x=>x.item),loc:v.location};if(['#market','#frames','#farm'].includes(location.hash))render()}catch(e){}}
function backupCode(){return btoa(unescape(encodeURIComponent(JSON.stringify(backupObj()))))}
function restore(code){try{const o=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));if(!o||!o.c)throw 0;C=o.c;Object.assign(P,o.p||{});lsSet('tenno-codex',C);pushAll();return true}catch(e){return false}}

/* ---------- full inventory import: reads an inventory.json (Warframe's own inventory data) in the browser ---------- */
/* The file never leaves the device; only the results are saved. Names come from data/umap.json, loaded on first use. */
let UMAP=null;
async function umap(){if(UMAP)return UMAP;const r=await fetch('/data/umap.json');if(!r.ok)throw new Error('map');return UMAP=await r.json()}
const INV_LISTS=['Suits','LongGuns','Pistols','Melee','SpaceSuits','SpaceGuns','SpaceMelee','Sentinels','SentinelWeapons','KubrowPets','MoaPets','Hoverboards','OperatorAmps','MechSuits','CrewShipWeapons','CrewShips','SpecialItems'];
function invParse(txt){let raw;try{raw=JSON.parse(String(txt).replace(/^﻿/,'').trim())}catch(e){return null}
  if(raw&&typeof raw.InventoryJson==='string'){try{raw=JSON.parse(raw.InventoryJson)}catch(e){return null}}
  if(raw&&raw.inventory&&typeof raw.inventory==='object')raw=raw.inventory;
  return raw&&typeof raw==='object'&&(raw.XPInfo||raw.MiscItems||raw.Suits||raw.RawUpgrades)?raw:null}
const lvlOf=fp=>{try{const o=typeof fp==='string'?JSON.parse(fp):fp;return Math.max(0,+(o&&o.lvl)||0)}catch(e){return 0}};
const dateOf=d=>{if(!d)return 0;const v=d.$date?(d.$date.$numberLong!=null?+d.$date.$numberLong:+new Date(d.$date)):+d;return isFinite(v)?v:0};
async function importInventory(txt){const inv=invParse(txt);
  if(!inv)return {ok:false,msg:"That doesn't look like an inventory file. Choose the inventory.json the tool saved."};
  let M;try{M=await umap()}catch(e){return {ok:false,msg:"Couldn't load the item list. Check your connection and try again."}}
  const a=logSnap();LOGMUTE++;let out;
  try{
    /* ranks, mastered gear, star chart, quests, syndicates and intrinsics: same reader as the profile sync */
    const base=importProfile0(JSON.stringify(inv));
    const n={items:0,parts:0,bps:0,mods:0,arcanes:0,relics:0,res:0,foundry:0};
    /* gear you own right now, including things built but not levelled yet */
    for(const k of INV_LISTS)for(const x of inv[k]||[]){const nm=U[x&&x.ItemType];if(nm){stepKeys(nm).forEach(setQ);n.items++}}
    /* blueprints and built parts */
    for(const x of inv.Recipes||[]){if(!(x.ItemCount>0))continue;const b=M.b[x.ItemType];if(b&&I[b]){setQ('bp|'+b);n.bps++;continue}
      const c=M.c[x.ItemType];if(c&&I[c[0]]){setQ('part|'+c[0]+'|'+c[1]);n.bps++}}
    for(const x of inv.MiscItems||[]){if(!(x.ItemCount>0))continue;const c=M.c[x.ItemType];if(!c||c[2]||!I[c[0]])continue;const [it,pt]=c;
      setQ('part|'+it+'|'+pt);const p=I[it].parts.find(q=>q.n===pt);if(p&&p.sub){setQ('built|'+it+'|'+pt);p.sub.forEach(([r])=>setQ('res|'+it+'|'+pt+'|'+r))}n.parts++}
    /* mods (owned) and arcanes (copies, counting ranked ones by the copies they took) */
    const arc={};
    for(const x of inv.RawUpgrades||[]){if(!(x.ItemCount>0))continue;const m=M.m[x.ItemType];if(m){if(!on('mod|'+m)){setQ('mod|'+m);n.mods++}continue}
      const ar=M.a[x.ItemType];if(ar)arc[ar]=(arc[ar]||0)+x.ItemCount}
    for(const x of inv.Upgrades||[]){const m=M.m[x.ItemType];if(m){if(!on('mod|'+m)){setQ('mod|'+m);n.mods++}continue}
      const ar=M.a[x.ItemType];if(ar)arc[ar]=(arc[ar]||0)+arcCopies(lvlOf(x.UpgradeFingerprint))}
    if(Object.keys(arc).length){P.arc=arc;n.arcanes=Object.keys(arc).length}
    /* relics by refinement, and resource counts: the file is the full picture, so these replace what was there */
    const rel={},res={};
    for(const x of inv.MiscItems||[]){if(!(x.ItemCount>0))continue;const l=M.l[x.ItemType];if(l){const o=rel[l[0]]=rel[l[0]]||{};o[l[1]]=(o[l[1]]||0)+x.ItemCount;continue}
      const r=M.r[x.ItemType];if(r)res[r]=(res[r]||0)+x.ItemCount}
    P.rel=rel;n.relics=Object.keys(rel).length;
    if(Object.keys(res).length){P.inv=res;n.res=Object.keys(res).length}
    /* Foundry: what's building and when it's done */
    const now=Date.now();const fd=[];
    for(const x of inv.PendingRecipes||[]){const b=M.b[x.ItemType],c=M.c[x.ItemType];const name=b||(c?c[0]+' '+c[1]:'');if(!name)continue;const end=dateOf(x.CompletionDate);
      fd.push({id:(now+fd.length).toString(36),n:name,t0:now,dur:Math.max(0,Math.round((end-now)/1000))})}
    if((inv.PendingRecipes||[]).length){P.foundry=fd;n.foundry=fd.length}
    P.wallet={plat:inv.PremiumCredits??null,cr:inv.RegularCredits??null,endo:inv.FusionPoints??null,at:now};
    P.invAt=new Date().toISOString();P.lastSync=Object.assign(P.lastSync||{},{inv:n});
    lsSet('tenno-codex',C);saveProfile();pushAll();
    out={ok:true,n,base,msg:`Imported your inventory: ${n.items} items, ${n.parts+n.bps} parts and blueprints, ${n.mods} new mods, ${n.arcanes} arcanes, ${n.relics} relic kinds, ${n.res} resources${n.foundry?`, ${n.foundry} in the Foundry`:''}.`}}
  finally{LOGMUTE--}
  updateMR();return out}
/* ---------- bridge: what the React shell reads and calls. Logic stays here; the shell only renders it. ---------- */
function tfNotify(){try{window.dispatchEvent(new CustomEvent('tf:update'))}catch(e){}}
window.TF={
  state(){const t=totalXP(),m=mrInfo(t.total);const r=(location.hash||'#home').slice(1);const key=routes[r]?r:'home';const pl=placeOf(key);const on=signedIn();
    return {route:key,title:SUBL[key]||PL[key]||'Home',place:pl?{id:pl[0],label:pl[1]}:null,
      mr:m.mr,mrLabel:(m.mr>30?'Legendary ':'MR ')+mrLabel(m.mr),nextLabel:m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1),xp:t.total,next:m.next,pct:m.pct,toNext:Math.max(0,m.next-t.total),
      name:P.tname||(P.prof&&P.prof.name)||'',signedIn:on,canAcct:canAcct(),acctName:on?(acct.name||acct.email||''):'',acctEmail:on?(acct.email||''):'',
      admin:!!FBK.admin,unread:SO.uid?(unread().n||0):0,theme:themeGet(),style:themeStyle(),demo:!!DEMO,isNew:isNew(),qs:!!state.qs}},
  nav(){return PLACES.map(p=>({id:p[0],label:p[1],pages:p[3].filter(r=>!NAV_PAIRED.has(r)).map(r=>({route:r,label:SUBL[r]||PL[r]}))}))},
  menu(){return MENU.map(([r,l])=>({route:r,label:l}))},
  search(q){return cmdFind(q).map(e=>({name:e.n,group:e.g,act:e.act,sub:e.s?e.s:e.g==='Gear'?I[e.n].c:e.g==='Pages'?'Page':e.g.replace(/s$/,''),img:e.g==='Gear'&&I[e.n].img?'https://cdn.warframestat.us/img/'+encodeURIComponent(I[e.n].img):''}))},
  open:act=>cmdGo({act}),
  go:route=>{if(location.hash==='#'+route)render();else location.hash=route},
  google:()=>{if(!FB){toast('Sign-in is still loading. Try again in a moment.');return}signGoogle()},
  signOut:()=>{flushNow();if(FB)FB.auth.signOut();toast('Signed out. Your progress stays on this device too.')},
  account:()=>{state.tTab='account';saveUI();if(location.hash==='#tenno')render();else location.hash='tenno'},
  theme:t=>themeSet(t),
  themeStyle:st=>themeStyleSet(st),
  logo:()=>LOGO_HTML(),
  share:()=>shareCard(),
  keys:()=>keysOpen(),
  refresh:()=>rerender()
};
/* ---------- Paste & sync: read the copied profile from the clipboard, then the usual review step ---------- */
document.addEventListener('click',async e=>{const b=e.target.closest('#pastesync');if(!b)return;let txt='';
  try{txt=await navigator.clipboard.readText()}catch(x){txt=''}
  const box=$('#pj');
  if(!txt||!/"Results"|"AccountId"|"LoadOutInventory"/.test(txt)){
    const d=box&&box.closest('details');if(d)d.open=true;if(box){box.focus();box.scrollIntoView({block:'center'})}
    toast(txt?"That doesn't look like your profile data. Copy the whole page, then try again.":"Couldn't read the clipboard. Paste into the box instead.");return}
  if(box)box.value=txt;state.syncFail=false;const imp=$('#imp');if(imp)imp.click()});
/* ---------- activity log: what you did today, this week and all time, with undo ---------- */
Object.assign(IC,{undo:'M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',chev:'M6 9l6 6 6-6',bars:'M5 20v-8M12 20V5M19 20v-6',map:'M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z',
  book:'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',list:'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',trophy:'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8'});
const LOG_MAX=400;
function logList(){return Array.isArray(P.log)?P.log:(P.log=[])}
function logAdd(e){if(LOGMUTE)return null;const L=logList();e.id=newId();e.t=Date.now();L.unshift(e);if(L.length>LOG_MAX)L.length=LOG_MAX;return e}
function logDrop(key,k){const L=logList();const i=L.findIndex(x=>x.key===key&&(!k||x.k===k));if(i>=0){L.splice(i,1);return true}return false}
const LOGK={m:'Mastered',n:'Cleared',sp:'Cleared on Steel Path',q:'Completed quest',build:'Built',bp:'Got blueprint',part:'Got'};
function logKeyInfo(key,v0){const p=key.split('|'),k=p[0];if(!LOGK[k])return null;
  if(k==='m'){const it=I[p[1]];return {k,label:'Mastered '+p[1],xp:it?mxp(it)-v0:0}}
  if(k==='n'||k==='sp'){const nd=NX[p[1]];return {k,label:LOGK[k]+' '+(nd?nd.n+' ('+nd.p+')':p[1]),xp:nd&&!isJ(nd)?nd.x||0:0}}
  if(k==='q')return {k,label:'Completed '+p[1],xp:0};
  if(k==='build')return {k,label:'Built '+p[1],xp:0};
  if(k==='bp')return {k,label:'Got the '+p[1]+' Blueprint',xp:0};
  if(k==='part')return {k,label:'Got '+p[1]+' '+p[2],xp:0};return null}

/* one switch for every place that ticks a key, a rank, a checklist item or a task */
const _setK0=setK;
setK=function(k,v){if(LOGMUTE)return _setK0(k,v);const was=on(k);const n=k.startsWith('m|')?k.slice(2):null;const v0=n&&I[n]?itemXP(n):0;const pr=n?P.rk[n]:undefined;
  _setK0(k,v);if(was===!!v)return;
  if(v){const inf=logKeyInfo(k,v0);if(inf){const e={...inf,key:k};if(n&&pr!=null)e.pr=pr;logAdd(e);saveProfile()}}
  else if(logDrop(k))saveProfile()};
const _setRank0=setRank;
setRank=function(n,r){const from=rankOf(n),x0=itemXP(n);LOGMUTE++;let out;try{out=_setRank0(n,r)}finally{LOGMUTE--}const to=rankOf(n);if(to===from||LOGMUTE)return out;
  const it=I[n],mx=maxRank(it),L=logList(),top=L.find(x=>x.key==='rk|'+n);
  if(top&&L.indexOf(top)<3&&Date.now()-top.t<10*60e3){top.to=to;top.xp=(top.xp||0)+itemXP(n)-x0;top.t=Date.now();if(top.to===top.from)L.splice(L.indexOf(top),1);else top.label=to>=mx?'Mastered '+n:n+' rank '+top.from+' → '+to}
  else logAdd({k:'rk',key:'rk|'+n,label:to>=mx?'Mastered '+n:n+' rank '+from+' → '+to,from,to,xp:itemXP(n)-x0});
  saveProfile();return out};
/* the rank toast's Undo goes through the log too, so Achievements always matches; bulk changes show their own toast */
let RKT=0;
undoPush=function(n){if(LOGMUTE>1)return;clearTimeout(RKT);RKT=setTimeout(()=>{const e=logList().find(x=>x.key==='rk|'+n);if(e)toastAction(`${n} → rank ${rankOf(n)}`,'Undo',()=>logUndo(e.id))},200)};
function logDW(id,v){if(!v){logDrop(id,'dw');return}const c=allChecks().find(x=>x[1]===id);let label=c?c[2]:id;
  if(id.startsWith('nw|')&&WS&&WS.nightwave){const a=(WS.nightwave.activeChallenges||[]).find(x=>'nw|'+x.id===id);label='Nightwave: '+(a?a.title:'act')}
  logAdd({k:'dw',key:id,label,per:c?c[0]:'w'})}
const _toggleTask0=toggleTask;
toggleTask=async function(id,v){const x=(P.tasks||[]).find(t=>t.id===id);const r=await _toggleTask0(id,v);if(x){if(v)logAdd({k:'t',key:'t|'+id,label:x.t});else logDrop('t|'+id,'t');saveProfile()}return r};

/* bulk changes (sync, max all, a whole planet) log one line; the line can undo the whole change */
function logSnap(){return {c:{...C},rk:{...P.rk},xp:totalXP().total}}
function logSummary(k,label,a,undoable){if(LOGMUTE)return;const on1=Object.keys(C).filter(e=>!a.c[e]),off=Object.keys(a.c).filter(e=>!C[e]);const rk={};
  for(const n of new Set([...Object.keys(a.rk),...Object.keys(P.rk)]))if(a.rk[n]!==P.rk[n])rk[n]=a.rk[n]==null?null:a.rk[n];
  const xp=totalXP().total-a.xp;if(!on1.length&&!off.length&&!Object.keys(rk).length&&!xp)return;
  const items=on1.filter(e=>e.startsWith('m|')).length,nodes=on1.filter(e=>/^(n|sp)\|/.test(e)).length,qs=on1.filter(e=>e.startsWith('q|')).length;
  const e={k,key:k+'|'+Date.now(),label,xp,items,nodes,qs};if(undoable&&on1.length+off.length<=600){e.on=on1;e.off=off;e.rk=rk}logAdd(e);saveProfile()}
function logBulk(label,fn){const a=logSnap();LOGMUTE++;try{fn()}finally{LOGMUTE--}logSummary('bulk',label,a,true)}

/* undo: put things back the way they were and drop the line */
function logUndo(id){const L=logList();const e=L.find(x=>x.id===id);if(!e)return;LOGMUTE++;
  try{if(e.k==='rk'){const n=e.key.slice(3);_setRank0(n,e.from)}
    else if(e.k==='m'){const n=e.key.slice(2);_setK0(e.key,0);if(e.pr!=null)P.rk[n]=e.pr}
    else if(LOGK[e.k])_setK0(e.key,0);
    else if(e.k==='dw'){if(P.dw)delete P.dw[e.key]}
    else if(e.k==='t'){const x=(P.tasks||[]).find(t=>'t|'+t.id===e.key);if(x){x.d=0;x.dat=0}}
    else if(e.on){e.on.forEach(k=>{delete C[k]});e.off.forEach(k=>{C[k]=1});for(const n in e.rk){if(e.rk[n]==null)delete P.rk[n];else P.rk[n]=e.rk[n]}if(typeof pushAll==='function')pushAll();lsSet('tenno-codex',C)}}
  finally{LOGMUTE--}
  L.splice(L.indexOf(e),1);clearTimeout(RKT);if(typeof UNDO!=='undefined'&&UNDO)clearTimeout(UNDO.tm);saveProfile();updateMR();rerender();toast('Undone: '+e.label)}

/* achievements page */
function logSince(p){return p==='today'?lastDaily():p==='week'?lastWeekly():0}
function logSum(list){const s={xp:0,m:0,rk:0,n:0,q:0,dw:0,t:0,b:0};for(const e of list){s.xp+=e.xp||0;
  if(e.k==='m'||(e.k==='rk'&&e.label.startsWith('Mastered')))s.m++;if(e.k==='rk')s.rk+=Math.max(0,(e.to||0)-(e.from||0));if(e.k==='n'||e.k==='sp')s.n++;if(e.k==='q')s.q++;if(e.k==='dw')s.dw++;if(e.k==='t')s.t++;if(e.k==='build')s.b++;
  if(e.items)s.m+=e.items;if(e.nodes)s.n+=e.nodes;if(e.qs)s.q+=e.qs}return s}
const LOGIC={m:'star',rk:'bars',n:'map',sp:'map',q:'book',build:'check',bp:'check',part:'check',dw:'cal',t:'list',sync:'repeat',bulk:'check'};
function logRow(e){const tm=new Date(e.t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});const canUndo=e.k!=='sync';
  const extra=e.k==='sync'||e.k==='bulk'?[e.items?e.items+' mastered':'',e.nodes?e.nodes+' nodes':'',e.qs?e.qs+' quests':''].filter(Boolean).join(' · '):e.k==='dw'?(e.per==='d'?'Daily':'Weekly')+' checklist':e.k==='t'?'Task':'';
  return `<li class="lgrow"><span class="lgic" aria-hidden="true">${ic(LOGIC[e.k]||'check')}</span><span class="lgt"><span class="lgl">${esc(e.label)}</span><span class="small muted">${tm}${extra?' · '+esc(extra):''}</span></span>
   ${e.xp?`<span class="chip mxc">${e.xp>0?'+':''}${fmt(e.xp)} XP</span>`:'<span></span>'}${canUndo?`<button type="button" class="btn sm" data-logundo="${esc(e.id)}" aria-label="Undo: ${esc(e.label)}">${ic('undo')}Undo</button>`:'<span class="small muted lgnote">Sync</span>'}</li>`}
function achievements(){const p=state.lgP||'today';const L=logList();const since=logSince(p);const list=L.filter(e=>e.t>=since);const s=logSum(list);
  const t=totalXP(),m=mrInfo(t.total);const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length,nodes=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,qd=Q.filter(q=>qDone(q.n)).length;
  const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1])),wd=allChecks().filter(c=>c[0]==='w'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));
  const tile=(k,v,x)=>`<div class="tile"><span class="k">${k}</span><span class="v num">${v}</span>${x?`<span class="x">${x}</span>`:''}</div>`;
  let tiles;
  if(p==='all')tiles=tile('Mastery XP',fmt(t.total),'MR '+mrLabel(m.mr)+(L.length?' · +'+fmt(s.xp)+' logged here':''))+tile('Items mastered',fmt(maxed),MI.length+' in the game')+tile('Star chart nodes',fmt(nodes),ALLN.filter(n=>!isJ(n)).length+' in total')+tile('Quests done',fmt(qd),Q.length+' in total');
  else tiles=tile('Mastery XP gained','+'+fmt(s.xp),s.rk?s.rk+' rank'+(s.rk>1?'s':'')+' gained':'')+tile('Items mastered',fmt(s.m),s.b?s.b+' built':'')+tile('Checklist ticks',fmt(s.dw),p==='today'?'Today '+dd.filter(ckDone).length+'/'+dd.length:'Weekly items '+wd.filter(ckDone).length+'/'+wd.length)+tile('Nodes · quests · tasks',`${s.n} · ${s.q} · ${s.t}`,'');
  const days=[];if(p!=='today'){const t0=lastDaily();for(let i=6;i>=0;i--){const a=t0-i*DAY,b=a+DAY;const de=L.filter(e=>e.t>=a&&e.t<b);days.push({a,n:de.length,xp:de.reduce((q,e)=>q+(e.xp||0),0)})}}
  const mx=Math.max(1,...days.map(d=>d.n));
  const groups=[];for(const e of list){const d=new Date(e.t).toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'});let g=groups[groups.length-1];if(!g||g.d!==d){g={d,items:[]};groups.push(g)}g.items.push(e)}
  return `<div class="stack"><div class="head"><div class="eyebrow">Today</div><h1>Achievements</h1><p class="lede">Everything you've ticked off, ranked up or mastered. Tapped something by mistake? Undo it here.</p></div>
   ${segBtns('lgp',p,[['today','Today'],['week','This week'],['all','All time']])}
   <div class="tiles">${tiles}</div>
   ${days.length?`<section class="panel lgweek" aria-label="Last 7 days"><div class="lgbars">${days.map(d=>`<div class="lgday" title="${d.n} things · +${fmt(d.xp)} XP"><span class="lgb"><i style="height:${(d.n/mx*100).toFixed(0)}%"></i></span><span class="small muted">${new Date(d.a).toLocaleDateString([],{weekday:'short',timeZone:'UTC'})}</span><span class="small num">${d.n}</span></div>`).join('')}</div></section>`:''}
   <p class="small muted" style="margin:0">${p==='today'?`Since the daily reset (${lt(lastDaily())} your time).`:p==='week'?`Since the weekly reset (Monday ${lt(lastWeekly())} your time).`:L.length?`Your log keeps the last ${LOG_MAX} things you did, back to ${fdate(new Date(L[L.length-1].t).toISOString())}.`:''}</p>
   ${groups.length?groups.map(g=>`<section class="obj"><div class="obj-h"><h3>${esc(g.d)}</h3></div><ul class="lglist">${g.items.map(logRow).join('')}</ul></section>`).join('')
     :`<div class="panel empty stack" style="gap:8px;text-align:left"><b>${p==='today'?'Nothing yet today.':p==='week'?'Nothing yet this week.':'Nothing logged yet.'}</b><span class="small">Tick a checklist item on <a class="ln" href="#today">Today</a>, update a rank on <a class="ln" href="#ranks">Ranks</a>, or finish a task, and it shows up here.</span></div>`}
  </div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-lgp],[data-logundo]');if(!t)return;
  if(t.dataset.lgp){state.lgP=t.dataset.lgp;saveUI();rerender();return}
  if(t.dataset.logundo){logUndo(t.dataset.logundo)}});
/* ---------- rows that open: tap a checklist item or a Next up card to see details; only the checkbox completes it ---------- */
state.ckOpen=state.ckOpen||{};state.nuOpen=state.nuOpen||{};
function ckEnd(c){return ckReset(c)+(c[0]==='d'?DAY:7*DAY)}
function ckLive(c){const w=WS;const id=c[1];if(!w)return HOSTED&&!WSerr?'<div class="small muted">Loading live details…</div>':'';
  if(id==='sortie'&&w.sortie&&w.sortie.variants)return `<div class="small"><b>${esc(w.sortie.boss||'Sortie')}</b>${w.sortie.faction?' · '+esc(w.sortie.faction):''}</div><ol class="ckol small">${w.sortie.variants.map(v=>`<li><b>${esc(v.missionType)}</b> · ${esc(v.node)}<div class="muted">${esc(v.modifier)}</div></li>`).join('')}</ol>`;
  if(id==='archon'&&w.archonHunt&&w.archonHunt.missions)return `<div class="small"><b>${esc(w.archonHunt.boss||'Archon Hunt')}</b></div><ol class="ckol small">${w.archonHunt.missions.map(v=>`<li><b>${esc(v.type)}</b> · ${esc(v.node)}</li>`).join('')}</ol>`;
  if((id==='nwd'||id==='nww')&&w.nightwave&&w.nightwave.activeChallenges){const ac=w.nightwave.activeChallenges.filter(x=>id==='nwd'?x.isDaily:!x.isDaily);
    return ac.length?`<ul class="ckol small">${ac.map(x=>`<li><b>${esc(x.title)}</b> · ${fmt(x.reputation)} standing${x.isElite?' (elite)':''}<div class="muted">${esc(x.desc)}${(P.dw||{})['nw|'+x.id]?' · done':''}</div></li>`).join('')}</ul><div class="small muted">Tick single acts under <b>Nightwave acts</b> further down.</div>`:''}
  if(id==='teshin'&&w.steelPath&&w.steelPath.currentReward)return `<div class="small">This week: <b>${esc(w.steelPath.currentReward.name)}</b> for ${w.steelPath.currentReward.cost} Steel Essence.</div>`;
  return ''}
const CKLINK={synd:['#synd','Open Syndicates'],openworld:['#synd','Open Syndicates'],simaris:['#synd','Open Syndicates'],sortie:null,teshin:null};
function ckMore(c){const end=ckEnd(c),ok=gateOK(c[4]);const lk=CKLINK[c[1]];
  return `<div class="ckmore" id="ckm-${esc(c[1].replace(/\W/g,'_'))}">${ckLive(c)}
   <div class="small muted">${ckDone(c)?'Done '+new Date((P.dw||{})[c[1]]).toLocaleString([],{weekday:'short',hour:'numeric',minute:'2-digit'})+' · ':''}Resets in ${left(end-Date.now())} (${lt(end)} your time)</div>
   ${ok?'':`<div class="small">Unlocks after the quest <a class="ln" href="#quests" data-q="${esc(c[4])}">${esc(c[4])}</a>.</div>`}
   <div class="row ckact">${lk?`<a class="btn sm" href="${lk[0]}">${lk[1]}</a>`:''}${ltBtn(c[2],new Date(end).toISOString())}${ckTools(c)}</div></div>`}
function ckRow(c){const ok=gateOK(c[4]),dn=ckDone(c),open=!!state.ckOpen[c[1]];const mid='ckm-'+c[1].replace(/\W/g,'_');
  return `<div class="qrow ckrow${dn?' done':''}${open?' open':''}"><input type="checkbox" class="ck" data-dw="${esc(c[1])}" ${dn?'checked':''} ${ok?'':'disabled'} aria-label="Mark done: ${esc(c[2])}">
   <div class="ckbody"><button type="button" class="ckhead" data-ckx="${esc(c[1])}" aria-expanded="${open}" aria-controls="${esc(mid)}"><span class="nm lbl">${esc(c[2])}</span><span class="chip">${c[0]==='d'?'Daily':'Weekly'}</span>${ok?'':'<span class="chip warn">Locked</span>'}${(P.ckPin||[]).includes(c[1])?`<span class="ckpin" title="Pinned">${ic('pin','fill')}</span>`:''}<span class="ckchev" aria-hidden="true">${ic('chev')}</span></button>
   <div class="small muted">${esc(c[3])}</div>${open?ckMore(c):''}</div></div>`}

/* next up: the checkbox completes, the card opens */
function nextCard(){NU=nextUp();const nz=Object.values(P.nuSnz||{}).filter(z=>z>=lastDaily()).length;
  const openL=x=>x.go?`<a class="btn sm" href="#" data-go="${esc(x.go)}">Open</a>`:x.q?`<a class="btn sm" href="#quests" data-q="${esc(x.q)}">Open quest</a>`:x.href?`<a class="btn sm" href="${x.href}" ${x.tt?`data-ttab="${x.tt}"`:''}>Open</a>`:'';
  return `<section class="panel cut stack nextup" style="gap:8px" aria-labelledby="nu-h"><div class="row" style="justify-content:space-between"><h2 id="nu-h">Next up</h2><span class="small muted">${esc(stage())}</span></div>
  ${NU.map((x,i)=>{const open=!!state.nuOpen[x.id];const pic=x.go&&x.go.startsWith('item|')&&art(x.go.slice(5),'mini');
   return `<div class="nu2${open?' open':''}">${x.done?`<input type="checkbox" class="ck" data-nudone="${i}" aria-label="${esc(x.doneL||'Done')}: ${esc(x.t)}">`:`<span class="nun" aria-hidden="true">${i+1}</span>`}
   <div class="nut"><button type="button" class="nuhead" data-nux="${esc(x.id)}" aria-expanded="${open}">${pic||''}<span class="nutx"><b>${esc(x.t)}</b><span class="small muted">${esc(x.why)}</span></span><span class="ckchev" aria-hidden="true">${ic('chev')}</span></button>
   ${open?`<div class="numore">${x.pre&&x.pre.length?`<ul class="small">${x.pre.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:''}
    <div class="nuact">${openL(x)}${x.task?taskBtn(...x.task):''}<button type="button" class="btn sm ghost" data-nusnz="${i}" aria-label="Not now: ${esc(x.t)}">Not now</button></div>
    ${x.done?`<div class="small muted">Tick the box when it's done${x.doneL?` (${esc(x.doneL.toLowerCase())})`:''}. Mistake? Undo it from <a class="ln" href="#achievements">Achievements</a>.</div>`:''}</div>`:''}</div></div>`}).join('')||'<div class="small muted">You\'re all caught up. Pick something from Goals or the rank-up plan.</div>'}
  ${nz?`<button type="button" class="small linkbtn" id="nuunsnz">Show ${nz} snoozed suggestion${nz>1?'s':''}</button>`:''}</section>`}

function rowToggle(store,id){store[id]=!store[id];const y=scrollY;rerender();scrollTo(0,y);
  const b=document.querySelector(`[data-ckx="${CSS.escape(id)}"],[data-nux="${CSS.escape(id)}"]`);if(b)b.focus({preventScroll:true})}
document.addEventListener('click',e=>{
  const h=e.target.closest('[data-ckx],[data-nux]');if(h){rowToggle(h.dataset.ckx!=null?state.ckOpen:state.nuOpen,h.dataset.ckx!=null?h.dataset.ckx:h.dataset.nux);return}
  /* a tap on the empty part of a row opens it too */
  const row=e.target.closest('.ckrow,.nu2');if(!row||e.target.closest('a,button,input,select,textarea,label,summary,.ckmore,.numore'))return;
  const b=row.querySelector('[data-ckx],[data-nux]');if(b)b.click()});
/* ---------- bridge: Home data for the React dashboard. Same numbers the old Home showed; actions reuse the existing handlers. ---------- */
const IMG=n=>I[n]&&I[n].img?'https://cdn.warframestat.us/img/'+encodeURIComponent(I[n].img):'';
/* run an existing delegated handler: build a throwaway element with the same attributes and click it */
function tfAct(tag,attrs){const box=document.getElementById('tf-act')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'tf-act',hidden:true}));
  const el=document.createElement(tag||'button');for(const k in attrs)el.setAttribute(k,attrs[k]);box.appendChild(el);el.click();setTimeout(()=>el.remove(),20000)}
function homeData(){const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;const now=Date.now();
  const stale=!!(P.wfid&&(!P.auto||now-Date.parse(P.auto)>864e5));
  const parts=[['Gear',t.it],['Star chart',t.ch],['Steel Path',t.sp],['Intrinsics',t.intr],['Other',(t.other||0)+(t.adj||0)+(t.un||0)]].filter(p=>p[1]>0).map(([label,xp])=>({label,xp}));
  /* since last time (same rule as the old Home: compare with a visit 30+ minutes ago) */
  const cur=seenNow();if(!SEEN){const prev=lsGet('tf-seen',null);SEEN=prev&&cur.t-prev.t>30*60e3?prev:(prev||cur);if(!prev||cur.t-prev.t>30*60e3)lsSet('tf-seen',cur)}
  const since=[];if(SEEN!==cur&&SEEN.t<cur.t){if(cur.mr>SEEN.mr)since.push(`MR ${SEEN.mr} → ${cur.mr}`);if(cur.maxed>SEEN.maxed)since.push(`+${cur.maxed-SEEN.maxed} mastered`);if(cur.xp>SEEN.xp)since.push(`+${fmt(cur.xp-SEEN.xp)} XP`);if(cur.q>SEEN.q)since.push(`+${cur.q-SEEN.q} quest${cur.q-SEEN.q>1?'s':''}`)}
  const fl=P.foundry||[];const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;
  /* next up */
  NU=nextUp();const nz=Object.values(P.nuSnz||{}).filter(z=>z>=lastDaily()).length;
  const next=NU.map((x,i)=>({i,id:x.id,title:x.t,why:x.why||'',steps:x.pre||[],done:!!x.done,doneLabel:x.doneL||'Done',img:x.go&&x.go.startsWith('item|')?IMG(x.go.slice(5)):'',
    open:x.go?{tag:'a',attrs:{href:'#','data-go':x.go}}:x.q?{tag:'a',attrs:{href:'#quests','data-q':x.q}}:x.href?{tag:'a',attrs:{href:x.href,...(x.tt?{'data-ttab':x.tt}:{})}}:null,
    task:x.task?{has:(P.tasks||[]).some(y=>!y.d&&y.k===x.task[0]&&y.r===x.task[1]),key:x.task[0]+'|'+x.task[1],label:x.task[2]||''}:null}));
  /* today */
  if(HOSTED&&!WS&&!WSerr)loadWS();const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const wd=allChecks().filter(c=>c[0]==='w'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));
  const today=[{k:'Daily reset',v:lastDaily()+DAY-now<60000?'Resetting…':left(lastDaily()+DAY-now),x:`${dd.filter(ckDone).length}/${dd.length} done`,route:'today',done:dd.filter(ckDone).length,total:dd.length}];
  if(WS&&WS.sortie&&WS.sortie.variants)today.push({k:'Sortie',v:WS.sortie.boss||'Today',x:leftOf(WS.sortie.expiry),route:'today'});
  if(WS&&WS.fissures){const need=neededEras();const n=WS.fissures.filter(x=>!x.expired&&new Date(x.expiry)>now&&need[x.tier]).length;if(Object.keys(need).length)today.push({k:'Fissures you need',v:String(n),x:Object.keys(need).slice(0,3).join(', '),route:'today'})}
  if(WS&&WS.steelPath&&WS.steelPath.currentReward)today.push({k:'Steel Path reward',v:WS.steelPath.currentReward.name,x:WS.steelPath.currentReward.cost+' essence',route:'today'});
  if(fl.length)today.push({k:'Foundry',v:`${ready}/${fl.length} ready`,x:ready?'Claim in game':'Next in '+hrs((Math.min(...fl.map(f=>f.t0+f.dur*1000))-now)/1000),route:'tenno',ttab:'foundry'});
  today.push({k:'Weekly reset',v:left(lastWeekly()+7*DAY-now),x:`${wd.filter(ckDone).length}/${wd.length} weekly done`,route:'today'});
  const lg=logList().filter(e=>e.t>=lastDaily()&&e.k!=='sync');
  /* goals and tasks */
  const goals=(P.goals||[]).filter(n=>I[n]&&!on('build|'+n));taskResets();const open=(P.tasks||[]).filter(x=>!x.d);
  return {name:P.tname||(P.prof&&P.prof.name)||'',mr:m.mr,mrLabel:m.mr>30?'Legendary '+(m.mr-30):'Mastery rank '+m.mr,mrShort:mrLabel(m.mr),inGame:g!=null&&g!==m.mr?mrLabel(g):'',
    maxed:cur.maxed,xp:t.total,next:m.next,toNext:Math.max(0,m.next-t.total),nextLabel:m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1),pct:m.pct,parts,
    action:HOSTED&&!P.at&&!P.wfid?'link':HOSTED&&stale?'sync':'plan',since,foundryReady:ready,upNext:next,snoozed:nz,today,
    doneToday:{n:lg.length,xp:lg.reduce((a,e)=>a+(e.xp||0),0)},
    goals:goals.slice(0,4).map(n=>{const k=stepKeys(n);return {name:n,img:IMG(n),done:k.filter(on).length,total:k.length}}),goalCount:goals.length,
    tasks:open.slice(0,6).map(x=>({id:x.id,title:x.t,kind:x.k&&x.k!=='note'?(TKL[x.k]||x.k):'',due:x.due||'',over:!!(x.due&&new Date(x.due+'T23:59:59')<new Date()),rep:x.rep||'',open:(()=>{const g2=taskGo(x);if(!g2)return null;const a={};g2.replace(/([\w-]+)="([^"]*)"/g,(_,k,v)=>{a[k]=v.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')});return {tag:'a',attrs:a}})()})),taskCount:open.length,
    showSign:canAcct()&&!signedIn(),demo:!!DEMO,stage:stage()}}
Object.assign(window.TF,{
  home:()=>homeData(),
  act:(tag,attrs)=>tfAct(tag,attrs),
  nuDone:i=>tfAct('button',{'data-nudone':String(i)}),
  nuSnooze:i=>tfAct('button',{'data-nusnz':String(i)}),
  nuUnsnooze:()=>tfAct('button',{id:'nuunsnz'}),
  addTaskFrom:(key,label)=>{tfAct('button',{'data-addtask':key,'data-tlabel':label||''});tfNotify()},
  taskDone:async(id,v)=>{await toggleTask(id,v);if(v){const x=(P.tasks||[]).find(t=>t.id===id);toastAction((x?x.t:'Task')+' done','Undo',async()=>{await toggleTask(id,false);rerender()})}rerender()},
  addTask:text=>{const v=String(text||'').trim();if(!v)return false;const r=addTask('note',v,v);rerender();return !!r},
  sync:()=>tfAct('button',{id:'autosync'}),
  qs:()=>!!state.qs
});
/* the React Home replaces the old one once the shell says it can draw it; the welcome and quick start stay as they are */
const _homeRoute=routes.home;
routes.home=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('home')&&!state.qs&&!isNew()?'':_homeRoute()};
const _demoBar=demoBar;demoBar=function(){return window.TF_UI&&TF_UI.owns?'':_demoBar()};
/* live game info arrives after the first paint; let the shell know */
const _loadWS=loadWS;loadWS=async function(){if(WSload||(WS&&Date.now()-WSat<120000))return;const r=await _loadWS();tfNotify();return r};
/* pages the shell draws have no old controls to wire up */
const _bindPage=bindPage;bindPage=function(r){if(window.TF_UI&&TF_UI.owns&&TF_UI.owns(r))return;return _bindPage(r)};
/* ---------- bridge: Ranks for the React page. The row order is kept while you edit, so rows don't jump under your finger. ---------- */
const RKC={key:'',order:[]};
function relicsDrop(n){const it=I[n];if(!it||!it.p||ownedItem(n))return false;const has=rel=>(rel||[]).some(([r])=>relCount(r)>0);
  if(!on('bp|'+n)&&has(it.bprel))return true;return it.parts.some(p=>p.k==='p'&&p.n!=='Blueprint'&&!on('part|'+n+'|'+p.n)&&has(p.rel))}
function rkItem(n){const it=I[n];const r=rankOf(n),mx=maxRank(it);const v=VAULT[n]||{};
  return {n,img:IMG(n),mr:it.mr||0,r,mx,xp:itemXP(n),max:mxp(it),per:perRank(it),prime:!!it.p,vaulted:!!(it.p&&it.v&&!v.now),resurgence:!!v.now,owned:ownedItem(n)&&r<mx,notOwned:on('nown|'+n),has:ownedItem(n),relics:relicsDrop(n)}}
function ranksData(fresh){const cat=state.rkCat||'Warframe',qr=state.rkQ||'',q=qr.toLowerCase().trim(),f=state.rkF||'all',s=state.rkS||'name';const key=[cat,q,f,s,state.rkT||'all',SREV.rkS?1:0].join('|');
  if(state._rkKey!==key){state._rkKey=key;state.rkLim=60;fresh=true}
  const cats=CATS.filter(c=>MI.some(i=>i.c===c)).map(c=>{const a=autoCat(c);return {id:c,label:CATL[c],m:a.m,t:a.t}}).concat([{id:'Intrinsics',label:'Intrinsics',m:0,t:0},{id:'Other',label:'Other gear',m:0,t:0}]);
  const base={cat,q:qr,f,s,t:state.rkT||'all',cats,island:'',items:[],total:0,shown:0,notMax:0,head:{label:'',m:0,t:0,p:0,x:0,search:!!q}};
  if(!q&&(cat==='Intrinsics'||cat==='Other')){base.island=cat==='Intrinsics'?intrHTML():othHTML();base.head.label=cat==='Intrinsics'?'Intrinsics':'Other gear';base.head.x=cat==='Intrinsics'?catXP('rail')+catXP('drift'):othXP();return base}
  if(fresh||RKC.key!==key){let list=q?MI.filter(i=>i.n.toLowerCase().includes(q)||(I[i.n]&&I[i.n].parts.some(p=>(p.full||p.n).toLowerCase().includes(q)))):MI.filter(i=>i.c===cat);const ty=state.rkT||'all';if(ty==='prime')list=list.filter(i=>I[i.n]&&I[i.n].p);if(ty==='normal')list=list.filter(i=>!(I[i.n]&&I[i.n].p));if(ty==='relics')list=list.filter(i=>relicsDrop(i.n));
    if(f==='notmax')list=list.filter(i=>rankOf(i.n)<maxRank(i));if(f==='todo')list=list.filter(i=>rankOf(i.n)===0);if(f==='prog')list=list.filter(i=>{const r=rankOf(i.n);return r>0&&r<maxRank(i)});if(f==='max')list=list.filter(i=>rankOf(i.n)>=maxRank(i));if(f==='own')list=list.filter(i=>ownedItem(i.n));if(f==='nown')list=list.filter(i=>!ownedItem(i.n));
    list.sort((a,b)=>s==='mr'?(a.mr||0)-(b.mr||0)||a.n.localeCompare(b.n):s==='close'?((mxp(a)-itemXP(a.n))||1e9)-((mxp(b)-itemXP(b.n))||1e9):s==='left'?(mxp(b)-itemXP(b.n))-(mxp(a)-itemXP(a.n)):a.n.localeCompare(b.n));rv('rkS',list);
    RKC.key=key;RKC.order=list.map(i=>i.n)}
  state._rkList=RKC.order;const total=RKC.order.length,shown=Math.min(state.rkLim||60,total);
  base.items=RKC.order.slice(0,shown).map(rkItem);base.total=total;base.shown=shown;base.notMax=RKC.order.filter(n=>rankOf(n)<maxRank(I[n])).length;base.owned=RKC.order.filter(n=>ownedItem(n)).length;base.signedIn=signedIn();
  if(q)base.head.label='Search results';else{const a=autoCat(cat);Object.assign(base.head,{label:CATL[cat],m:a.m,t:a.t,p:a.p,x:a.x})}
  return base}
Object.assign(window.TF,{
  ranks:fresh=>ranksData(!!fresh),
  ranksSet:o=>{if(o.cat!=null){state.rkCat=o.cat;state.rkQ=''}if(o.q!=null)state.rkQ=o.q;if(o.f!=null)state.rkF=o.f;if(o.s!=null)state.rkS=o.s;if(o.t!=null)state.rkT=o.t;saveUI();tfNotify()},
  ranksMore:all=>{state.rkLim=all?1e5:(state.rkLim||60)+60;tfNotify()},
  ranksRefresh:()=>{RKC.key='';tfNotify()},
  setRank:(n,r)=>{setRank(n,r);tfNotify()},
  maxAll:()=>{const L=(state._rkList||[]).filter(n=>!on('m|'+n));if(!L.length)return 0;logBulk('Maxed '+L.length+' items on Ranks',()=>L.forEach(n=>setRank(n,99)));updateMR();clearTimeout(RKT);
    toastAction(`Marked ${L.length} item${L.length===1?'':'s'} mastered`,'Undo',()=>{const e=logList()[0];if(e&&e.k==='bulk')logUndo(e.id)});return L.length}
});
const _ranksRoute=routes.ranks;
routes.ranks=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('ranks')?'':_ranksRoute()};
/* ---------- bridge: Farm finder for the React page ---------- */
/* embedded old markup ("islands"): rebuilt when a button inside is used, kept as is when a step is ticked so open sections stay open */
let ISLV=0;
document.addEventListener('click',e=>{if(e.target.closest('.tf-island')&&e.target.closest('button,a'))ISLV++},true);
const FFD={key:'',html:''};
function farmDetail(){const sel=state.farmSel||'';if(!sel)return '';const k=sel+'|'+ISLV;if(FFD.key!==k){FFD.key=k;FFD.html=detail(sel)}return FFD.html}
function farmData(){const ft=state.ffT||'all';const cats=ffCats(ft);const cat=cats.some(c=>c[0]===state.ffC)?state.ffC:'';const q=state.farmQ||'';
  const total=search('',ft,cat).length;const r=unvFilter(search(q,ft,cat));const lim=state.ffLim||60;
  const items=r.slice(0,lim).map(([n,t,l])=>{const it=t==='item'?MIX[n]:null;const left=it?mxp(it)-itemXP(n):0;return {n,t,label:l,key:t+'|'+n,xp:it?mxp(it):0,left,img:t==='item'||t==='part'?IMG(t==='part'?((partOwner(n)||{}).n||''):n):''}});
  const sel=state.farmSel||'';const si=sel.indexOf('|');
  return {q,ty:ft,cat,unv:!!state.unvOnly,types:FFT.map(([value,label])=>({value,label})),cats:cats.map(([c,n])=>({value:c,label:c,n})),
    total,count:r.length,items,more:Math.max(0,r.length-lim),filtered:!!(q||ft!=='all'||cat||state.unvOnly),
    sel,selName:si>0?sel.slice(si+1):'',detail:farmDetail()}}
Object.assign(window.TF,{
  farm:()=>farmData(),
  farmSet:o=>{if(o.q!=null)state.farmQ=o.q;if(o.ty!=null){state.ffT=o.ty;state.ffC=''}if(o.cat!=null)state.ffC=o.cat;if(o.unv!=null)state.unvOnly=o.unv;state.ffLim=60;saveUI();tfNotify()},
  farmClear:()=>{state.farmQ='';state.ffT='all';state.ffC='';state.unvOnly=false;state.ffLim=60;saveUI();tfNotify()},
  farmMore:()=>{state.ffLim=(state.ffLim||60)+60;tfNotify()},
  farmPick:key=>{state.farmSel=key||null;tfNotify()},
  island:el=>{if(el)refresh(el)}
});
/* picks from anywhere (search, links inside details) land in the React page instead of the old #fdet panel */
document.addEventListener('click',e=>{const t=e.target.closest('[data-pick]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('farm')))return;
  e.preventDefault();e.stopPropagation();state.farmSel=t.dataset.pick;if(location.hash!=='#farm')location.hash='farm';else tfNotify()},true);
const _farmRoute=routes.farm;
routes.farm=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('farm')?'':_farmRoute()};
/* ---------- bridge: Today for the React page ---------- */
const hasTaskT=t=>(P.tasks||[]).some(x=>!x.d&&x.t===t);
function ckLiveData(c){const w=WS,id=c[1];if(!w)return null;
  if(id==='sortie'&&w.sortie&&w.sortie.variants)return {head:[w.sortie.boss,w.sortie.faction].filter(Boolean).join(' · '),list:w.sortie.variants.map(v=>({t:v.missionType,s:v.node,n:v.modifier}))};
  if(id==='archon'&&w.archonHunt&&w.archonHunt.missions)return {head:w.archonHunt.boss||'',list:w.archonHunt.missions.map(v=>({t:v.type,s:v.node,n:''}))};
  if((id==='nwd'||id==='nww')&&w.nightwave&&w.nightwave.activeChallenges){const ac=w.nightwave.activeChallenges.filter(x=>id==='nwd'?x.isDaily:!x.isDaily);return ac.length?{head:'',list:ac.map(x=>({t:x.title,s:fmt(x.reputation)+' standing'+(x.isElite?' (elite)':''),n:x.desc+((P.dw||{})['nw|'+x.id]?' · done':'')}))}:null}
  if(id==='teshin'&&w.steelPath&&w.steelPath.currentReward)return {head:'This week: '+w.steelPath.currentReward.name+' for '+w.steelPath.currentReward.cost+' Steel Essence',list:[]};
  return null}
const CKLINK2={synd:['synd','Open Syndicates'],openworld:['synd','Open Syndicates'],simaris:['synd','Open Syndicates']};
function todayData(){const f=state.ckF||'todo';const now=Date.now();if(HOSTED&&!WS&&!WSerr)loadWS();
  const HID=P.ckHide||[],PIN=P.ckPin||[];const all=allChecks();
  const rows=all.filter(c=>f==='hidden'?HID.includes(c[1]):!HID.includes(c[1])&&(f==='all'||(f==='todo'&&!ckDone(c)&&gateOK(c[4]))||(f===c[0])||(f==='locked'&&!gateOK(c[4])))).sort((a,b)=>PIN.includes(b[1])-PIN.includes(a[1]))
    .map(c=>{const end=ckEnd(c);return {id:c[1],per:c[0],title:c[2],desc:c[3],gate:c[4]||'',locked:!gateOK(c[4]),done:ckDone(c),doneAt:ckDone(c)?(P.dw||{})[c[1]]:0,pinned:PIN.includes(c[1]),hidden:HID.includes(c[1]),custom:c[1].startsWith('cu|'),
      resetIn:left(end-now),resetAt:lt(end),endIso:new Date(end).toISOString(),hasTask:hasTaskT(c[2]),link:CKLINK2[c[1]]?{route:CKLINK2[c[1]][0],label:CKLINK2[c[1]][1]}:null,live:ckLiveData(c)}});
  const vis=c=>gateOK(c[4])&&!HID.includes(c[1]);const dd=all.filter(c=>c[0]==='d'&&vis(c)),wd=all.filter(c=>c[0]==='w'&&vis(c));
  const tiles=[{k:'Daily reset',v:lastDaily()+DAY-now<60000?'Resetting…':left(lastDaily()+DAY-now),x:lt(lastDaily()+DAY)+' your time (00:00 UTC)',done:dd.filter(ckDone).length,total:dd.length},
    {k:'Sortie reset',v:lastSortie()+DAY-now<60000?'Resetting…':left(lastSortie()+DAY-now),x:lt(lastSortie()+DAY)+' your time (16:00 UTC)'},
    {k:'Weekly reset',v:lastWeekly()+7*DAY-now<60000?'Resetting…':left(lastWeekly()+7*DAY-now),x:ltw(lastWeekly()+7*DAY)+' your time (Mon 00:00 UTC)',done:wd.filter(ckDone).length,total:wd.length}];
  const out={filter:f,rows,hiddenCount:HID.length,tiles,hosted:HOSTED,live:null,liveState:!HOSTED?'offline':WS?'ok':WSerr?'error':'loading'};
  const w=WS;if(!w)return out;
  const cyc=(name,c,lab)=>c?{name,state:lab(c),left:leftOf(c.expiry)}:null;
  const L={cycles:[cyc('Cetus',w.cetusCycle,c=>c.isDay?'Day':'Night'),cyc('Orb Vallis',w.vallisCycle,c=>c.isWarm?'Warm':'Cold'),cyc('Cambion Drift',w.cambionCycle,c=>c.state==='vome'?'Vome':'Fass'),cyc('Duviri',w.duviriCycle,c=>c.state?c.state.charAt(0).toUpperCase()+c.state.slice(1):'')].filter(Boolean)};
  if(w.sortie&&w.sortie.variants)L.sortie={boss:w.sortie.boss||'',faction:w.sortie.faction||'',left:leftOf(w.sortie.expiry),expiry:w.sortie.expiry,variants:w.sortie.variants.map(v=>({t:v.missionType,s:v.node,n:v.modifier})),task:'Do the Sortie',hasTask:hasTaskT('Do the Sortie')};
  if(w.archonHunt&&w.archonHunt.missions)L.archon={boss:w.archonHunt.boss||'',left:leftOf(w.archonHunt.expiry),expiry:w.archonHunt.expiry,missions:w.archonHunt.missions.map(v=>({t:v.type,s:v.node})),task:'Do the Archon Hunt',hasTask:hasTaskT('Do the Archon Hunt')};
  const vt=w.voidTrader;if(vt){const act=new Date(vt.activation)<=now&&now<new Date(vt.expiry);L.baro={here:act,gone:now>=new Date(vt.expiry),left:act?untilIso(vt.expiry):untilIso(vt.activation),location:vt.location||'',inv:act&&vt.inventory?vt.inventory.map(x=>({item:x.item,ducats:x.ducats,credits:x.credits})):[]}}
  if(w.steelPath&&w.steelPath.currentReward)L.steel={name:w.steelPath.currentReward.name,cost:w.steelPath.currentReward.cost};
  if(w.arbitration&&!w.arbitration.expired&&w.arbitration.type!=='Unknown'){const t='Run Arbitration: '+w.arbitration.type+' · '+w.arbitration.node;L.arbitration={type:w.arbitration.type,node:w.arbitration.node,enemy:w.arbitration.enemy||'',left:leftOf(w.arbitration.expiry),expiry:w.arbitration.expiry,task:t,hasTask:hasTaskT(t)}}
  if(w.nightwave&&w.nightwave.activeChallenges)L.nightwave=w.nightwave.activeChallenges.map(c=>({id:'nw|'+c.id,title:c.title,desc:c.desc,rep:c.reputation,kind:c.isDaily?'Daily':c.isElite?'Elite weekly':'Weekly',done:!!(P.dw||{})['nw|'+c.id],left:leftOf(c.expiry),expiry:c.expiry,task:'Nightwave: '+c.title,hasTask:hasTaskT('Nightwave: '+c.title)}));
  const need=neededEras();const ff=state.fiF||'all',fm=state.fiM||'all';
  const fis=(w.fissures||[]).filter(x=>!x.expired&&new Date(x.expiry)>now).filter(x=>(ff==='all'||x.tier===ff||(ff==='need'&&need[x.tier]))&&(fm==='all'||(fm==='sp'&&x.isHard)||(fm==='n'&&!x.isHard&&!x.isStorm)||(fm==='storm'&&x.isStorm)))
    .sort((a,b)=>(a.tierNum-b.tierNum)||(new Date(a.expiry)-new Date(b.expiry)));
  const mine=era=>Object.keys(P.rel||{}).filter(r=>REL[r]&&REL[r].era===era&&relCount(r)>0).length;
  L.fissures={era:ff,mode:fm,need:Object.entries(need).map(([era,s])=>({era,relics:[...s].slice(0,6),more:Math.max(0,s.size-6)})),
    list:fis.map(x=>{const t=x.tier+' fissure: '+x.missionType+' · '+x.node;return {id:x.id||x.node+x.tier,tier:x.tier,need:!!need[x.tier],mission:x.missionType,node:x.node,hard:!!x.isHard,storm:!!x.isStorm,left:leftOf(x.expiry),expiry:x.expiry,mine:mine(x.tier),task:t,hasTask:hasTaskT(t)}})};
  const GOOD=/Catalyst|Reactor|Forma|Exilus|Wraith|Vandal|Mutalist|Detonite|Fieldron|Mutagen/;const rw=s=>((s&&s.countedItems)||[]).map(c=>(c.count>1?c.count+'× ':'')+c.type).join(', ');
  L.invasions=(w.invasions||[]).filter(x=>!x.completed).map(x=>{const a=rw(x.attacker&&x.attacker.reward),d=rw(x.defender&&x.defender.reward);const r=[a,d].filter(Boolean).join(' / ');return {id:x.id||x.node,node:x.node,desc:x.desc,rewards:r,good:GOOD.test(r),pct:Math.round(x.completion||0)}});
  out.live=L;return out}
function ckTick(id,v){P.dw=P.dw||{};if(v)P.dw[id]=Date.now();else delete P.dw[id];logDW(id,v);saveProfile();updateMR();
  if(v){const c=allChecks().find(x=>x[1]===id);let lab=c?c[2]:'Done';if(id.startsWith('nw|')){const e=logList()[0];if(e&&e.key===id)lab=e.label}const lg=logList()[0];
    toastAction(lab+' ticked off','Undo',()=>{if(lg&&lg.key===id)logUndo(lg.id);else{delete P.dw[id];logDW(id,false);saveProfile();updateMR()}})}}
Object.assign(window.TF,{
  today:()=>todayData(),
  todaySet:o=>{if(o.ckF!=null)state.ckF=o.ckF;if(o.fiF!=null)state.fiF=o.fiF;if(o.fiM!=null)state.fiM=o.fiM;saveUI();tfNotify()},
  ckTick:(id,v)=>ckTick(id,v),
  ckPin:id=>tfAct('button',{'data-ckpin':id}),
  ckHide:id=>tfAct('button',{'data-ckhide':id}),
  ckAdd:(text,per)=>{const v=String(text||'').trim();if(!v)return false;P.ckCustom=P.ckCustom||[];P.ckCustom.push({id:newId(),t:v.slice(0,80),p:per==='w'?'w':'d'});saveProfile();tfNotify();return true},
  liveTask:(t,exp)=>tfAct('button',{'data-livetask':t,'data-ltexp':exp||''}),
  fisRelics:era=>tfAct('button',{'data-fisrel':era}),
  retryLive:()=>{WSerr=false;WSat=0;loadWS();tfNotify()}
});
const _todayRoute=routes.today;
routes.today=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('today')?'':_todayRoute()};
/* ---------- bridge: Achievements for the React page ---------- */
function achData(){const p=state.lgP||'today';const L=logList().filter(e=>e.k!=='sync');const since=logSince(p);const list=L.filter(e=>e.t>=since);const s=logSum(list);
  const t=totalXP(),m=mrInfo(t.total);const vis=c=>gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]);const dd=allChecks().filter(c=>c[0]==='d'&&vis(c)),wd=allChecks().filter(c=>c[0]==='w'&&vis(c));
  let tiles;
  if(p==='all')tiles=[{k:'Mastery XP',v:fmt(t.total),x:'MR '+mrLabel(m.mr)+(L.length?' · +'+fmt(logSum(L).xp)+' logged here':'')},{k:'Items mastered',v:fmt(MI.filter(i=>itemXP(i.n)>=mxp(i)).length),x:fmt(MI.length)+' in the game'},
    {k:'Star chart nodes',v:fmt(ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length),x:fmt(ALLN.filter(n=>!isJ(n)).length)+' in total'},{k:'Quests done',v:fmt(Q.filter(q=>qDone(q.n)).length),x:Q.length+' in total'}];
  else tiles=[{k:'Mastery XP gained',v:'+'+fmt(s.xp),x:s.rk?s.rk+' rank'+(s.rk>1?'s':'')+' gained':'',xp:s.xp},{k:'Items mastered',v:fmt(s.m),x:s.b?s.b+' built':''},
    {k:'Checklist ticks',v:fmt(s.dw),x:p==='today'?'Today '+dd.filter(ckDone).length+'/'+dd.length:'Weekly items '+wd.filter(ckDone).length+'/'+wd.length},{k:'Nodes · quests · tasks',v:`${s.n} · ${s.q} · ${s.t}`,x:''}];
  const days=[];{const t0=lastDaily();for(let i=6;i>=0;i--){const a=t0-i*DAY,b=a+DAY;const de=L.filter(e=>e.t>=a&&e.t<b);days.push({label:new Date(a).toLocaleDateString([],{weekday:'short',timeZone:'UTC'}),n:de.length,xp:de.reduce((q,e)=>q+(e.xp||0),0),today:i===0})}}
  const groups=[];for(const e of list){const d=new Date(e.t).toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'});let g=groups[groups.length-1];if(!g||g.d!==d){g={d,items:[]};groups.push(g)}
    const extra=e.k==='sync'||e.k==='bulk'?[e.items?e.items+' mastered':'',e.nodes?e.nodes+' nodes':'',e.qs?e.qs+' quests':''].filter(Boolean).join(' · '):e.k==='dw'?(e.per==='d'?'Daily':'Weekly')+' checklist':e.k==='t'?'Task':'';
    g.items.push({id:e.id,k:e.k,label:e.label,time:new Date(e.t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}),extra,xp:e.xp||0,canUndo:e.k!=='sync'})}
  const note=p==='today'?`Since the daily reset (${lt(lastDaily())} your time).`:p==='week'?`Since the weekly reset (Monday ${lt(lastWeekly())} your time).`:L.length?`Your log keeps the last ${LOG_MAX} things you did, back to ${fdate(new Date(L[L.length-1].t).toISOString())}.`:'';
  return {period:p,tiles,days,groups,note,empty:!list.length}}
Object.assign(window.TF,{
  ach:()=>achData(),
  achSet:p=>{state.lgP=p;saveUI();tfNotify()},
  logUndo:id=>logUndo(id)
});
const _achRoute=routes.achievements;
routes.achievements=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('achievements')?'':_achRoute()};
/* ---------- bridge: Tasks for the React page ---------- */
function actOf(x){const g=taskGo(x);if(!g)return null;const a={};g.replace(/([\w-]+)="([^"]*)"/g,(_,k,v)=>{a[k]=v.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')});return {tag:'a',attrs:a}}
function tasksData(){taskResets();const f=state.tkF||'open',so=state.tkS||'new';const all=P.tasks||[];let L2=all.slice();
  L2=L2.filter(x=>f==='all'||(f==='open'&&!x.d)||(f==='done'&&x.d)||(f==='shared'&&((x.with||[]).length||x.from))||(f===x.k));
  L2.sort((a,b)=>so==='due'?((a.due||'9999')<(b.due||'9999')?-1:(a.due||'9999')>(b.due||'9999')?1:b.at-a.at):so==='old'?a.at-b.at:so==='kind'?(a.k||'').localeCompare(b.k||'')||b.at-a.at:b.at-a.at);rv('tkS',L2);
  const dn=all.filter(x=>x.d).length;
  return {filter:f,sort:so,todo:all.length-dn,done:dn,signedIn:!!SO.uid,friends:(SO.friends||[]).filter(x=>!x.pending).map(x=>({uid:x.uid,name:x.name||'Friend'})),
    list:L2.map(x=>({id:x.id,title:x.t,kind:x.k&&x.k!=='note'?(TKL[x.k]||x.k):'',done:!!x.d,due:x.due||'',over:!!(x.due&&!x.d&&new Date(x.due+'T23:59:59')<new Date()),rep:x.rep||'',note:x.note||'',
      with:(x.with||[]).map(w=>w.name||'Friend'),from:x.from?x.from.name||'Friend':'',open:actOf(x)}))}}
Object.assign(window.TF,{
  tasks:()=>tasksData(),
  tasksSet:o=>{if(o.f!=null)state.tkF=o.f;if(o.s!=null)state.tkS=o.s;saveUI();tfNotify()},
  taskUndone:async id=>{await toggleTask(id,false);rerender()},
  taskEdit:(id,o)=>{const y=(P.tasks||[]).find(t=>t.id===id);if(!y)return;if(o.note!=null)y.note=String(o.note).slice(0,1000);if(o.rep!=null){if(o.rep)y.rep=o.rep;else delete y.rep}if(o.due!=null){if(o.due)y.due=o.due;else delete y.due}
    if(o.title!=null&&String(o.title).trim())y.t=String(o.title).trim().slice(0,120);saveProfile();tfNotify()},
  taskDel:id=>{const L=P.tasks||[];const i=L.findIndex(x=>x.id===id);if(i<0)return;const x=L[i];L.splice(i,1);saveProfile();tfNotify();
    toastAction('Deleted “'+x.t.slice(0,40)+'”','Undo',()=>{P.tasks=P.tasks||[];P.tasks.splice(Math.min(i,P.tasks.length),0,x);saveProfile();tfNotify()})},
  taskClearDone:()=>{const was=(P.tasks||[]).slice();const n=was.filter(x=>x.d).length;if(!n)return;P.tasks=was.filter(x=>!x.d);saveProfile();tfNotify();
    toastAction(`Cleared ${n} done task${n===1?'':'s'}`,'Undo',()=>{P.tasks=was;saveProfile();tfNotify()})},
  taskInvite:(id,uid)=>tfAct('button',{'data-tinvite':id+'|'+uid})
});
const _tasksRoute=routes.tasks;
routes.tasks=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('tasks')?'':_tasksRoute()};
/* ---------- bridge: Goals for the React page ---------- */
const strip=h=>String(h||'').replace(/<br\s*\/?>/g,' · ').replace(/<a\b[^>]*>(farms by stage|\d+ options)<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s*·\s*$/,'').trim();
function vaultOf(it){if(!it||!it.p)return null;const v=VAULT[it.n]||{};if(v.now)return {kind:'now',text:'Resurgence until '+fdate(v.now)};if(it.v)return {kind:'vaulted',text:'Vaulted'+(v.est?' · back ~'+fdate(v.est):'')};return {kind:'farmable',text:'Farmable'+(it.evd?' · vaults ~'+fdate(it.evd):'')}}
function goalsData(){const g=(P.goals||[]).filter(n=>I[n]);const srt=state.gS||'added';let list=g.slice();
  if(srt==='name')list.sort();if(srt==='progress'){const pr=n=>{const k=stepKeys(n);return k.filter(on).length/k.length};list.sort((a,b)=>pr(b)-pr(a))}rv('gS',list);
  const acc={cr:0,r:{},pt:0};g.filter(n=>!on('build|'+n)).forEach(n=>totals(n,1,acc,[]));const short=!!state.gShort;
  const shop=Object.entries(acc.r).sort((a,b)=>b[1]-a[1]).filter(([n,q])=>!short||!(P.inv&&+P.inv[n]>=q)).map(([n,q])=>{const known=P.inv&&P.inv[n]!=null;const h=+((P.inv||{})[n]||0);const rem=Math.max(0,q-h);
    return {n,need:q,have:known?h:null,left:rem,where:strip(farmFor(n)),task:{has:(P.tasks||[]).some(x=>!x.d&&x.k==='res'&&x.r===n),key:'res|'+n,label:'Farm '+fmt(rem)+' '+n}}});
  const need=neededEras();
  return {sort:srt,short,credits:acc.cr,
    goals:list.map(n=>{const k=stepKeys(n);return {name:n,img:IMG(n),done:k.filter(on).length,total:k.length,xp:mxp(I[n]),built:on('build|'+n),vault:vaultOf(I[n])}}),
    shop,relics:Object.entries(need).map(([era,s])=>({era,relics:[...s]}))}}
Object.assign(window.TF,{
  goals:()=>goalsData(),
  goalsSet:o=>{if(o.s!=null)state.gS=o.s;if(o.short!=null)state.gShort=o.short;saveUI();tfNotify()},
  goalRemove:n=>{const i=(P.goals||[]).indexOf(n);if(i<0)return;P.goals.splice(i,1);saveProfile();tfNotify();toastAction('Removed '+n+' from Goals','Undo',()=>{P.goals=P.goals||[];if(!P.goals.includes(n))P.goals.splice(Math.min(i,P.goals.length),0,n);saveProfile();tfNotify()})},
  setInv:(n,v)=>{P.inv=P.inv||{};const s=String(v).trim();if(s==='')delete P.inv[n];else P.inv[n]=Math.max(0,+s||0);saveProfile();tfNotify()}
});
const _goalsRoute=routes.goals;
routes.goals=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('goals')?'':_goalsRoute()};
/* ---------- bridge: Quests for the React page ---------- */
function rewardOf(r){const m=Object.keys(I).find(n=>r.toLowerCase().startsWith(n.toLowerCase()+' ')||r===n);if(m){const it=MIX[m];return {text:r,go:'item|'+m,left:it?mxp(it)-itemXP(m):0,xp:it?mxp(it):0}}
  const go=RES[r]?'res|'+r:MODS[r]?'mod|'+r:ARC[r]?'arc|'+r:'';return {text:r,go,left:0,xp:0}}
function questsData(){const f=state.qF||'all';const nq=nextQuest();const groups=[...new Set(Q.map(q=>q.g))];
  return {filter:f,next:nq?nq.n:'',focus:state.qFocus||'',total:Q.length,done:Q.filter(q=>qDone(q.n)).length,
    groups:groups.map(g=>{const all=Q.filter(q=>q.g===g);const qs=all.filter(q=>{const lk=qPrereqs(q).some(p=>!qDone(p.n));return f==='all'||(f==='done'&&qDone(q.n))||(f==='todo'&&!qDone(q.n))||(f==='locked'&&!qDone(q.n)&&lk)||(f==='avail'&&!qDone(q.n)&&!lk)});
      return {name:g,done:all.filter(q=>qDone(q.n)).length,total:all.length,quests:qs.map(q=>{const pre=qPrereqs(q);return {n:q.n,id:'q-'+q.n.replace(/\W/g,''),done:qDone(q.n),locked:pre.some(p=>!qDone(p.n)),desc:q.d||'',wiki:q.w||'',
        req:q.req.map(r=>{const p=pre.find(x=>qClean(r)===x.n);return p?{text:r,quest:p.n,done:qDone(p.n)}:{text:r,quest:'',done:false}}),rewards:q.rw.map(rewardOf),
        guide:(guideOfQuest(q.n)||{}).id||'',hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='quest'&&x.r===q.n),upto:Q.indexOf(q)>0}})}}).filter(g=>g.quests.length)}}
function questUndoToast(label,key){const e=logList().find(x=>x.key===key);toastAction(label,'Undo',()=>{if(e)logUndo(e.id)})}
Object.assign(window.TF,{
  quests:()=>questsData(),
  questsSet:o=>{if(o.f!=null)state.qF=o.f;saveUI();tfNotify()},
  questTick:(n,v)=>{setK('q|'+n,v?1:0);tfNotify();if(v)questUndoToast('Completed '+n,'q|'+n)},
  questUpto:n=>{const q=Q.find(x=>x.n===n);if(!q)return;const idx=Q.indexOf(q);const arc=/^Arc/.test(q.g);
    logBulk('Quests up to '+n,()=>Q.forEach((o,i)=>{if(i<=idx&&(arc?/^Arc/.test(o.g):o.g===q.g))setK('q|'+o.n,1)}));tfNotify();
    const e=logList()[0];toastAction('Marked quests up to '+n+' complete','Undo',()=>{if(e&&e.k==='bulk')logUndo(e.id)})},
  questFocused:()=>{state.qFocus=null}
});
/* quest links from anywhere open the React list at that quest */
document.addEventListener('click',e=>{const t=e.target.closest('[data-q]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('quests')))return;
  e.preventDefault();e.stopPropagation();state.qFocus=t.dataset.q;if(location.hash!=='#quests')location.hash='quests';else tfNotify()},true);
const _questsRoute=routes.quests;
routes.quests=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('quests')?'':_questsRoute()};
/* ---------- bridge: MR plan for the React page ---------- */
function gearRow(id,note){const it=I[id];if(!it)return null;return {n:id,img:IMG(id),mr:it.mr||0,rk:on('m|'+id)?0:(+P.rk[id]||0),xp:mxp(it),done:on('m|'+id),price:it.p?strip(priceChip(id+' Set')):'',note:note||''}}
function xpTabHTML(){const s=state.mTab;state.mTab='xp';let h='';try{h=mastery()}finally{state.mTab=s}const i=h.indexOf('</div>',h.indexOf('class="seg"'));return h.slice(i+6,h.length-6)}
function masteryData(){const tab=state.mTab||'path';const t=totalXP(),cur=mrInfo(t.total).mr;const out={tab,cur};
  if(tab==='path'){let target=+state.target||cur+1;if(target<=cur)target=cur+1;const need=Math.max(0,mrNeed(target)-t.total);const cap=Math.min(Math.max(cur,0),30);
    const cand=MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=Math.max(cap,Math.min(target,30))).map(it=>({it,gain:mxp(it)-itemXP(it.n),e:ease(it)})).filter(x=>x.gain>0).sort((a,b)=>a.e-b.e||b.gain-a.gain||(a.it.mr||0)-(b.it.mr||0));
    let acc=0;const plan=[];for(const x of cand){if(acc>=need)break;plan.push(x);acc+=x.gain}
    const nodesLeft=NODES.filter(n=>!on('n|'+n.id)),spLeft=NODES.filter(n=>!on('sp|'+n.id));const nx=nodesLeft.reduce((a,n)=>a+n.x,0),sx=spLeft.reduce((a,n)=>a+n.x,0);const gearLeft=cand.reduce((a,x)=>a+x.gain,0);
    const targets=[];for(let m=cur+1;m<=Math.max(cur+6,40);m++)targets.push({value:String(m),label:(m>30?'Legendary '+(m-30):'MR '+m)+' · '+fmt(mrNeed(m))+' XP'});
    const by={};plan.forEach(x=>(by[x.e]=by[x.e]||[]).push(x));
    Object.assign(out,{target:String(target),targetLabel:mrLabel(target),targets,need,gearLeft,nx,sx,nodesLeft:nodesLeft.length,spLeft:spLeft.length,overflow:need>gearLeft+nx+sx,
      groups:Object.keys(by).sort().map(e=>({title:EASE[e],xp:by[e].reduce((a,x)=>a+x.gain,0),items:by[e].map(x=>gearRow(x.it.n,''))}))})}
  if(tab==='ladder'){out.ladder=[];for(let m=1;m<=40;m++){const gear=m<=30?MI.filter(i=>(i.mr||0)===m):[];const qs=Q.filter(q=>q.req.some(r=>r==='Mastery Rank '+m));
    out.ladder.push({m,label:m>30?'Legendary '+(m-30):'MR '+m,xp:mrNeed(m),reached:m<=cur,next:m===cur+1,trades:m<=30?m:0,cap:m<=30?16000+500*m:0,quests:qs.map(q=>q.n),gear:gear.map(g=>gearRow(g.n,'')).filter(Boolean).sort((a,b)=>a.done-b.done||b.xp-a.xp||a.n.localeCompare(b.n))})}}
  if(tab==='sheet'){const by={};M.weapons.forEach(w=>(by[w.mr]=by[w.mr]||[]).push(w));out.sheetXp=D.meta.sheetXp;out.groups=Object.keys(by).sort((a,b)=>a-b).map(mr=>({title:'Mastery '+mr,open:mr<=2,items:by[mr].map(w=>gearRow(w.id,w.slot)).filter(Boolean)}))}
  if(tab==='sframes')out.groups=[{title:'Easy Warframes',open:true,items:M.frames.map(f=>gearRow(f.id,f.src)).filter(Boolean)},{title:'Market companions',open:true,items:M.companions.map(f=>gearRow(f.id,'Market blueprint')).filter(Boolean)}];
  if(tab==='craft'){const by={};M.craft.forEach(x=>(by[x.mr]=by[x.mr]||[]).push(x));
    out.craft=Object.keys(by).sort((a,b)=>a-b).map(mr=>({title:'MR '+mr,recipes:by[mr].map(x=>({recipe:x.recipe,xp:x.xp,note:x.note||'',items:x.targets.map(t=>gearRow(t.id,'')).filter(Boolean)}))}))}
  if(tab==='xp')out.xpHtml=xpTabHTML();
  if(tab==='helper')out.helper=helperData();
  return out}
Object.assign(window.TF,{
  mastery:()=>masteryData(),
  masterySet:o=>{if(o.tab!=null)state.mTab=o.tab;if(o.target!=null)state.target=+o.target;saveUI();tfNotify()},
  gearTick:(n,v)=>{setK('m|'+n,v?1:0);tfNotify();if(v){const e=logList().find(x=>x.key==='m|'+n);toastAction('Mastered '+n,'Undo',()=>{if(e)logUndo(e.id)})}},
  itemTree:(n,note)=>itemTree(n,{note:note||''})
});
/* tab links from elsewhere */
document.addEventListener('click',e=>{const t=e.target.closest('[data-mtab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('mastery')))return;
  e.preventDefault();e.stopPropagation();state.mTab=t.dataset.mtab;saveUI();if(location.hash!=='#mastery')location.hash='mastery';else tfNotify()},true);
const _masteryRoute=routes.mastery;
routes.mastery=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('mastery')?'':_masteryRoute()};
/* mastery helper: easy wins, items you can finish from relics you own, and the cheapest items to buy with platinum */
function missingParts(n){const it=I[n];const out=[];if(!it)return out;
  if(!on('bp|'+n))out.push({full:n+' Blueprint',key:'bp|'+n,rel:it.bprel||[]});
  for(const p of it.parts){if(p.k!=='p'||p.n==='Blueprint')continue;if(!on('part|'+n+'|'+p.n))out.push({full:p.full,key:'part|'+n+'|'+p.n,rel:p.rel||[]})}
  return out}
function partChance(rel){let miss=1;const used=[];for(const [r,rar] of rel){const x=(P.rel||{})[r];if(!x||!REL[r])continue;let m=1;for(const k of ['i','e','f','r']){const c=+x[k]||0;if(c)m*=Math.pow(1-RCH[k][rar]/100,c)}if(m<1){miss*=m;used.push({r,rar,count:relCount(r)})}}return {p:1-miss,used}}
function helperData(){const mode=state.mhM||'easy';const out={mode,items:[]};
  const cand=MI.filter(it=>!on('m|'+it.n));
  if(mode==='easy'){
    out.leveling=cand.filter(it=>{const r=rankOf(it.n);return r>0&&r<maxRank(it)}).map(it=>({n:it.n,img:IMG(it.n),rank:rankOf(it.n),mx:maxRank(it),left:mxp(it)-itemXP(it.n)})).sort((a,b)=>b.left-a.left);
    out.built=cand.filter(it=>rankOf(it.n)===0&&(on('build|'+it.n)||(P.foundry||[]).some(f=>f.n===it.n))).map(it=>{const f=(P.foundry||[]).find(x=>x.n===it.n);return {n:it.n,img:IMG(it.n),xp:mxp(it),state:f?(Date.now()>=f.t0+f.dur*1000?'Ready to claim in the Foundry':'Building, ready in '+hrs((f.t0+f.dur*1000-Date.now())/1000)):'Built: rank it up'}});
    const rail=IR.length*10*1500,drift=ID.length*10*1500;out.intr=[{n:'Railjack intrinsics',left:Math.max(0,rail-catXP('rail')),max:rail},{n:'Drifter intrinsics',left:Math.max(0,drift-catXP('drift')),max:drift}].filter(x=>x.left>0);
    out.total=out.leveling.reduce((a,x)=>a+x.left,0)+out.built.reduce((a,x)=>a+x.xp,0)+out.intr.reduce((a,x)=>a+x.left,0)}
  else if(mode==='relics'){for(const it of cand){if(!it.p||on('build|'+it.n))continue;const miss=missingParts(it.n);if(!miss.length)continue;let p=1,ok=true;const parts=[];
      for(const m of miss){const c=partChance(m.rel);if(!c.used.length){ok=false;break}p*=c.p;parts.push({full:m.full,p:c.p,relics:c.used.map(u=>u.r+(u.count>1?' ×'+u.count:''))})}
      if(ok)out.items.push({n:it.n,img:IMG(it.n),xp:mxp(it)-itemXP(it.n),p,parts})}
    out.items.sort((a,b)=>b.p-a.p||b.xp-a.xp);out.relicCount=Object.keys(P.rel||{}).filter(r=>relCount(r)>0).length}
  else{for(const it of cand){if(!it.p||on('build|'+it.n))continue;const miss=missingParts(it.n);if(!miss.length)continue;let cost=0,ok=true;const parts=[];
      for(const m of miss){const v=pv(m.full);if(v==null){ok=false;break}cost+=v;parts.push({full:m.full,plat:Math.round(v)})}
      const set=(D.sets[it.n+' Set']||{}).a7;const nothing=miss.length===it.parts.filter(p=>p.k==='p'&&p.n!=='Blueprint').length+1;
      if(!ok&&!(nothing&&set))continue;const useSet=nothing&&set&&(!ok||set<cost);const c=Math.round(useSet?set:cost);
      out.items.push({n:it.n,img:IMG(it.n),xp:mxp(it)-itemXP(it.n),cost:c,useSet:!!useSet,parts:useSet?[]:parts,per1k:c/((mxp(it)-itemXP(it.n))/1000)})}
    out.items.sort((a,b)=>a.cost-b.cost||b.xp-a.xp);out.items=out.items.slice(0,80)}
  if(mode!=='easy')out.items=out.items.slice(0,80);
  return out}
Object.assign(window.TF,{helper:()=>helperData(),helperSet:m=>{state.mhM=m;tfNotify()}});
/* ---------- bridge: Star chart for the React page ---------- */
const orbC=p=>(ORB[p]||'#6fd6e8,#1e3440').split(',');
function chartData(){const planets=[...new Set(ALLN.filter(n=>!isJ(n)).map(n=>n.p))].sort((a,b)=>{const ia=PORD.indexOf(a),ib=PORD.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b)});
  const sel=state.scP&&planets.includes(state.scP)?state.scP:'';const all=ALLN.filter(n=>!isJ(n));const J=ALLN.filter(isJ).sort((a,b)=>jLabel(a).localeCompare(jLabel(b)));
  const jrow=n=>({id:n.id,label:jLabel(n),from:(n.id.match(/^(\w+?)To/)||[])[1]||'',done:on('n|'+n.id),sp:on('sp|'+n.id)});
  if(!sel)return {sel:'',total:all.length,nd:all.filter(n=>on('n|'+n.id)).length,sd:all.filter(n=>on('sp|'+n.id)).length,jt:J.length,jd:J.filter(n=>on('n|'+n.id)).length,
    xp:catXP('chart')+catXP('sp'),xpMax:NODES.reduce((a,n)=>a+n.x,0)*2,
    planets:planets.map(p=>{const s=planetStats(p);return {name:p,colors:orbC(p),done:s.d,sp:s.s,total:s.ns.length}}),junctions:J.map(jrow),juncHtml:juncTasks()};
  const s=planetStats(sel);const tf=state.misType||'all',hide=!!state.misHide,q=(state.scQ||'').toLowerCase().trim();const srt=state.scS||'lv';
  let ns=s.ns.filter(n=>(tf==='all'||n.t===tf)&&(!hide||!on('n|'+n.id)||!on('sp|'+n.id))&&(!q||n.n.toLowerCase().includes(q)));
  ns.sort((a,b)=>srt==='name'?a.n.localeCompare(b.n):srt==='xp'?b.x-a.x:a.lv[0]-b.lv[0]);rv('scS',ns);
  const rr=(D.regres[sel]||D.regres[sel==='Zariman'?'Zariman Ten Zero':sel]||[]);
  return {sel,colors:orbC(sel),total:s.ns.length,nd:s.d,sd:s.s,xd:s.xd,type:tf,types:[...new Set(s.ns.map(n=>n.t))].sort(),sort:srt,hide,q:state.scQ||'',
    resources:rr,hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='node'&&x.r===sel),
    nodes:ns.map(n=>({id:n.id,name:n.n,type:n.t,lv:n.lv[0]+'–'+n.lv[1],xp:n.x||0,ds:!!n.ds,runs:(P.mc&&P.mc[n.id])||0,done:on('n|'+n.id),sp:on('sp|'+n.id)})),
    junctions:ALLN.filter(n=>isJ(n)&&n.id.startsWith(sel)).map(jrow)}}
Object.assign(window.TF,{
  chart:()=>chartData(),
  chartSet:o=>{if(o.p!=null){state.scP=o.p||null;state.scQ=''}if(o.q!=null)state.scQ=o.q;if(o.type!=null)state.misType=o.type;if(o.sort!=null)state.scS=o.sort;if(o.hide!=null)state.misHide=o.hide;saveUI();tfNotify()},
  nodeTick:(key,v)=>{setK(key,v?1:0);tfNotify()},
  planetAll:(p,mode)=>{logBulk('All of '+p+(mode==='sp'?' (Steel Path)':''),()=>ALLN.filter(n=>n.p===p&&!isJ(n)).forEach(n=>setK(mode+'|'+n.id,1)));tfNotify();
    const e=logList()[0];toastAction('Marked '+p+(mode==='sp'?' Steel Path':'')+' complete','Undo',()=>{if(e&&e.k==='bulk')logUndo(e.id)})}
});
/* planet links from anywhere */
document.addEventListener('click',e=>{const t=e.target.closest('[data-scp]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('missions'))||t.closest('.tf-island'))return;
  e.preventDefault();e.stopPropagation();state.scP=t.dataset.scp||null;state.scQ='';saveUI();if(location.hash!=='#missions')location.hash='missions';else tfNotify()},true);
const _missionsRoute=routes.missions;
routes.missions=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('missions')?'':_missionsRoute()};
/* ---------- bridge: Syndicates for the React page ---------- */
function linkKey(n){n=String(n);if(RES[n])return 'res|'+n;if(I[n])return 'item|'+n;if(D.partrel[n])return 'part|'+n;if(MODS[n])return 'mod|'+n;if(ARC[n])return 'arc|'+n;const m=n.match(/^(.+?) (Neuroptics|Chassis|Systems|Blueprint|Harness|Wings)$/);return m&&I[m[1]]?'item|'+m[1]:''}
function syndData(){const f=state.syF||'all',srt=state.syS||'next',hide=!!state.syH;
  let list=D.synd.slice();if(f!=='all')list=list.filter(e=>e.kind===f);if(hide)list=list.filter(e=>gateOK(e.gate));
  const prog=e=>{const st=synState(e),rr=rankRow(e,st.r);if(rr.max==null)return 0;return (st.s-(rr.min||0))/((rr.max||1)-(rr.min||0))};
  list.sort((a,b)=>srt==='name'?a.n.localeCompare(b.n):srt==='rank'?synState(b).r-synState(a).r||synState(b).s-synState(a).s:prog(b)-prog(a));rv('syS',list);
  const fl=dailyLeft(D.synd[0]);
  return {filter:f,sort:srt,hide,cap:dailyCap(),factionLeft:fl,synced:!!(P.daily&&P.daily.ts>=lastDaily()),reset:left(lastDaily()+DAY-Date.now()),
    nightwave:(P.nw||[]).map(([t,s,r])=>({t,s,r})),
    list:list.map(e=>{const st=synState(e),ok=gateOK(e.gate);const cur=rankRow(e,st.r),nx=rankRow(e,st.r+1);const top=e.ranks.length?e.ranks[e.ranks.length-1].r:0;
      const pct=cur.max!=null?Math.max(0,Math.min(100,(st.s-(cur.min||0))/((cur.max||1)-(cur.min||0))*100)):0;const dl=dailyLeft(e);
      const stages=(e.farm||[]);let si=0;stages.forEach((s,i)=>{if(st.r>=s[1])si=i});
      const mo=(e.offers||[]).filter(o=>MIX[o[0]]&&itemXP(o[0])<mxp(MIX[o[0]]));const mrxp=mo.reduce((a,o)=>a+mxp(MIX[o[0]])-itemXP(o[0]),0);
      const warn=e.kind==='faction'?[e.opp,e.enemy].filter(n=>(+((P.syn||{})[n]||{}).r||0)>0):[];
      return {n:e.n,color:SYNC[e.n]||'',kind:e.kind,locked:!ok,gate:e.gate||'',synced:!!st.sync,set:!!(st.r||st.s),hasRanks:!!e.ranks.length,
        rank:st.r,top,title:cur.t||'Rank '+st.r,standing:st.s,max:cur.max==null?null:cur.max,pct,ready:cur.max!=null&&st.s>=cur.max&&!!nx.t,
        next:nx.t?{t:nx.t,in:cur.max!=null&&st.s<cur.max?cur.max-st.s:0,days:dl&&cur.max!=null&&st.s<cur.max?Math.ceil((cur.max-st.s)/Math.max(1,dailyCap())):0,cr:nx.cr||0,items:(nx.items||[]).map(([q,n])=>({q,n,go:linkKey(n)}))}:null,
        dailyLeft:dl,effects:e.kind==='faction'?{ally:e.ally,opp:e.opp,enemy:e.enemy,warn}:null,
        earn:stages.length?{now:stages[si][2],later:stages[si+1]?stages[si+1][2]:[]}:null,mrxp,
        offers:(e.offers||[]).filter(o=>o[2]<=st.r+1).slice(0,40).map(o=>{const it=MIX[o[0]];return {n:o[0],cost:o[1],nextRank:o[2]>st.r,go:linkKey(o[0]),left:it?mxp(it)-itemXP(o[0]):0,xp:it?mxp(it):0}}),
        ranks:e.ranks.map(r=>({value:String(r.r),label:r.r+': '+r.t})),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='synd'&&x.r===e.n)}})}}
Object.assign(window.TF,{
  synd:()=>syndData(),
  syndSet:o=>{if(o.f!=null)state.syF=o.f;if(o.s!=null)state.syS=o.s;if(o.hide!=null)state.syH=o.hide;saveUI();tfNotify()},
  synSet:(n,o)=>{P.syn=P.syn||{};const cur=P.syn[n]||{};if(o.r!=null)cur.r=+o.r;if(o.s!=null)cur.s=Math.max(0,+o.s||0);cur.sync=0;P.syn[n]=cur;saveProfile();tfNotify()}
});
const _syndRoute=routes.synd;
routes.synd=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('synd')?'':_syndRoute()};
/* ---------- bridge: Resources for the React page ---------- */
const RSD={key:'',html:''};
function resData(){const sel=state.resSel&&RES[state.resSel]?state.resSel:'';const q=(state.resQ||'').toLowerCase().trim();
  const main=MAINRES.filter(n=>RES[n]);const rest=Object.keys(RES).filter(n=>!main.includes(n)).sort();
  const gneed={};(P.goals||[]).filter(n=>I[n]&&!on('build|'+n)).forEach(n=>{const a=totals(n,1,{cr:0,r:{},pt:0},[]);for(const r in a.r)gneed[r]=(gneed[r]||0)+a.r[r]});
  const rf=state.rsF||'all';let list=q?Object.keys(RES).filter(n=>n.toLowerCase().includes(q)):null;
  if(rf!=='all'){list=(list||Object.keys(RES)).filter(n=>rf==='inv'?(P.inv&&P.inv[n]!=null):rf==='goal'?gneed[n]:rf==='short'?(gneed[n]&&!(P.inv&&+P.inv[n]>=gneed[n])):RT[n]);list.sort()}
  const row=n=>({n,have:P.inv&&P.inv[n]!=null?+P.inv[n]:null,label:RT[n]?'by stage':(RSRC[n]||[]).length+' farms',need:gneed[n]||0});
  if(sel){const k=sel+'|'+ISLV;if(RSD.key!==k){RSD.key=k;RSD.html=resDetail(sel)}}
  return {q:state.resQ||'',filter:rf,sel,total:Object.keys(RES).length,list:list?list.map(row):null,main:list?[]:main.map(row),rest:list?[]:rest.map(row),detail:sel?RSD.html:''}}
Object.assign(window.TF,{
  res:()=>resData(),
  resSet:o=>{if(o.q!=null)state.resQ=o.q;if(o.f!=null)state.rsF=o.f;saveUI();tfNotify()},
  resPick:n=>{state.resSel=n||null;tfNotify()}
});
const _resRoute=routes.resources;
routes.resources=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('resources')?'':_resRoute()};
/* ---------- bridge: Warframes for the React page ---------- */
const FRT={key:'',html:''};
function framesData(){const ff=state.frF||'all';const allF=Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth');
  let fr=allF.filter(i=>{const r=rankOf(i.n);return ff==='all'||(ff==='owned'&&r>0)||(ff==='not'&&r===0)||(ff==='mastered'&&r>=maxRank(i))||(ff==='prime'&&i.p)||(ff==='farm'&&i.p&&!i.v)||(ff==='goals'&&(P.goals||[]).includes(i.n))}).map(i=>i.n).sort();
  const filteredEmpty=!fr.length;if(!fr.length)fr=allF.map(i=>i.n).sort();
  if(!state.frame||!I[state.frame]||!fr.includes(state.frame))state.frame=fr.includes('Saryn Prime')?'Saryn Prime':fr[0];
  const name=state.frame,base=baseOf(name);const builds=D.builds[base]||D.builds[name]||[];const bi=Math.max(0,Math.min(state.build||0,builds.length-1));
  const k=name+'|'+ISLV;if(FRT.key!==k){FRT.key=k;FRT.html=itemTree(name)}
  const modOf=modSlot;
  let build=null;if(builds.length){const b=builds[bi];const sw=m=>state.budget&&D.budget[m]?D.budget[m]:m;
    build={role:b.role,helminth:b.helminth,notes:b.notes||'',mods:[modOf('Aura',sw(b.aura)),modOf('Exilus',sw(b.exilus)),...b.mods.map(m=>modOf('Mod',sw(m)))],arcanes:b.arcanes.map(a=>modOf('Arcane',a,true))}}
  return {filter:ff,filteredEmpty,list:fr,name,img:IMG(name),base,prime:I[base+' Prime']&&name!==base+' Prime'?base+' Prime':'',baseVer:name!==base&&I[base]?base:'',tree:FRT.html,
    builds:builds.map((b,i)=>({value:String(i),label:b.name})),bi:String(bi),budget:!!state.budget,build}}
Object.assign(window.TF,{
  frames:()=>framesData(),
  framesSet:o=>{if(o.f!=null)state.frF=o.f;if(o.frame!=null){state.frame=o.frame;state.build=0}if(o.build!=null)state.build=+o.build;if(o.budget!=null)state.budget=o.budget;saveUI();tfNotify()}
});
const _framesRoute=routes.frames;
routes.frames=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('frames')?'':_framesRoute()};
/* ---------- bridge: Open worlds and Market for the React pages ---------- */
function worldData(){const tab=state.wTab||'fish';const out={tab};
  if(tab==='fish'){const rg=state.fR||'Plains of Eidolon',rr=state.fRr||'all',tm=state.fT||'all';const regs=Object.keys(D.fishreg);const R=D.fishreg[rg]||{};
    const times=[...new Set(D.fish.filter(f=>f.reg===rg).map(f=>f.time))].filter(Boolean).sort();
    const all=D.fish.filter(f=>f.reg===rg);const list=all.filter(f=>(rr==='all'||f.r===rr||(rr==='todo'&&!on('fish|'+f.n)))&&(tm==='all'||f.time===tm));
    let cyc='';if(WS){const c=rg==='Plains of Eidolon'?WS.cetusCycle:rg==='Orb Vallis'?WS.vallisCycle:WS.cambionCycle;if(c)cyc=(c.state||c.active||'')+(c.timeLeft?' · '+c.timeLeft:'')}else if(HOSTED&&!WSerr)loadWS();
    Object.assign(out,{region:rg,regions:regs,rarity:rr,time:tm,times,cycle:cyc,info:{spears:R.sp||'',vendor:R.v||'',use:R.use||'',tips:R.tips||[]},caught:all.filter(f=>on('fish|'+f.n)).length,total:all.length,
      fish:list.map(f=>({n:f.n,key:'fish|'+f.n,done:on('fish|'+f.n),rarity:f.r,bio:f.bio,time:f.time,spear:f.sp||'any',bait:f.bait||'',spots:f.spots||[],gives:f.dr.map(d=>({n:d,go:linkKey(d)})),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='fish'&&x.r===f.n)}))})}
  else{const M2=D.mine;const rg=state.mR||'Plains of Eidolon';const R=M2.reg[rg];const row=(n,r,kind)=>({n,key:'ore|'+n,done:on('ore|'+n),rarity:r,kind,go:linkKey(n),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='ore'&&x.r===n)});
    Object.assign(out,{region:rg,regions:Object.keys(M2.reg),spots:R.spots,vendor:R.v,ores:[...R.ore.map(([n,r])=>row(n,r,'ore · red vein')),...R.gem.map(([n,r])=>row(n,r,'gem · blue vein'))],
      cutters:M2.cut.map(([n,w,d])=>({n,key:'cut|'+n,done:on('cut|'+n),where:w,desc:d})),tips:M2.tips})}
  return out}
function marketData(){const tab=state.mkTab||'sets';const out={tab,snapshot:D.meta.prices};
  if(tab==='sets'){const rows=Object.entries(D.sets).map(([n,s])=>{const base=n.replace(/ Set$/,'');const it=I[base];let ps=0,du=0,okp=true;
      if(it){const parts=it.parts.filter(p=>p.k==='p');const names=[base+' Blueprint',...parts.filter(p=>p.n!=='Blueprint').map(p=>p.full)];names.forEach(x=>{const p=PR[x];if(p&&(p.a7??p.a30)!=null)ps+=(p.a7??p.a30);else okp=false});parts.forEach(p=>du+=p.du||0)}
      const sl=(SEL[n]||[]).filter(x=>x[0]!=='__buy');return {n,base,it,a7:s.a7,a30:s.a30,v7:s.v7,ps:okp&&ps?Math.round(ps):null,du:du||null,low:sl[0]?sl[0][1]:null,b:sl[0]||null}});
    const q=(state.mkQ||'').toLowerCase().trim();const mf=state.mkF||'all';let r=rows.filter(x=>!q||x.n.toLowerCase().includes(q)).filter(x=>{const v=VAULT[x.base]||{};return mf==='all'||(mf==='farm'&&x.it&&!x.it.v&&!v.now)||(mf==='vault'&&x.it&&x.it.v&&!v.now)||(mf==='now'&&v.now)||(mf==='goals'&&(P.goals||[]).includes(x.base))});
    const k=state.mkSort||'a7';r.sort((a,b)=>k==='n'?a.n.localeCompare(b.n):k==='low'?((a.low??1e9)-(b.low??1e9)):((b[k]??-1)-(a[k]??-1)));rv('mkSort',r);const lim=state.mkLim||60;
    Object.assign(out,{q:state.mkQ||'',filter:mf,sort:k,total:rows.length,count:r.length,more:Math.max(0,r.length-lim),
      sets:r.slice(0,lim).map(x=>{const it=MIX[x.base];return {n:x.n,base:x.base,img:IMG(x.base),vault:vaultOf(x.it),left:it?mxp(it)-itemXP(x.base):0,xp:it?mxp(it):0,
        price:x.a7!=null?Math.round(x.a7):null,meta:[x.ps!=null?'Parts '+x.ps+'p':'',x.du?x.du+' ducats':'',x.v7?fmt(x.v7)+' sold a week':''].filter(Boolean).join(' · '),
        seller:x.b?{name:x.b[0],price:x.b[1],wh:whisper(x.n,x.b)}:null,url:'https://warframe.market/items/'+(MS[x.n]||'')}})})}
  else{const primes=Object.values(I).filter(i=>i.p);const isNow=i=>VAULT[i.n]&&VAULT[i.n].now;
    const now=primes.filter(isNow),farm=primes.filter(i=>!i.v&&!isNow(i)),vault=primes.filter(i=>i.v&&!isNow(i));
    vault.sort((a,b)=>((VAULT[a.n]||{}).est||'9').localeCompare((VAULT[b.n]||{}).est||'9'));farm.sort((a,b)=>(a.evd||'9').localeCompare(b.evd||'9'));
    const card=i=>{const v=VAULT[i.n]||{};return {n:i.n,c:i.c,img:IMG(i.n),text:v.now?`In Varzia's Prime Resurgence until ${fdate(v.now)} at ${D.vtnow.loc||"Maroo's Bazaar"}. Buy its relics with Aya or Regal Aya.`:
      !i.v?(i.evd?`Drops from relics now. Expected to vault around ${fdate(i.evd)}.`:'Drops from relics now. Not scheduled to vault.'):
      `Vaulted${i.vd?' since '+fdate(i.vd):''}.${v.last?` Last in Resurgence ${fdate(v.last)}.`:' Not seen in Resurgence yet.'}${v.est?` Rough estimate for its return: ${fdate(v.est)}.`:''}`}};
    Object.assign(out,{gapMonths:Math.round(D.medgap/30),now:now.map(card),farm:farm.map(card),vault:vault.map(card)})}
  return out}
Object.assign(window.TF,{
  world:()=>worldData(),
  worldSet:o=>{if(o.tab!=null)state.wTab=o.tab;if(o.region!=null){if((state.wTab||'fish')==='fish')state.fR=o.region;else state.mR=o.region}if(o.rarity!=null)state.fRr=o.rarity;if(o.time!=null)state.fT=o.time;saveUI();tfNotify()},
  market:()=>marketData(),
  marketSet:o=>{if(o.tab!=null)state.mkTab=o.tab;if(o.q!=null){state.mkQ=o.q;state.mkLim=60}if(o.f!=null){state.mkF=o.f;state.mkLim=60}if(o.sort!=null)state.mkSort=o.sort;saveUI();tfNotify()},
  marketMore:()=>{state.mkLim=(state.mkLim||60)+60;tfNotify()},
  whisper:t=>tfAct('button',{'data-wh':t})
});
const _worldRoute=routes.world,_marketRoute=routes.market;
routes.world=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('world')?'':_worldRoute()};
routes.market=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('market')?'':_marketRoute()};
/* ---------- bridge: Relics for the React page ---------- */
function relicsData(){const tab=state.rlTab||'mine';const out={tab};
  if(tab==='mine'){const mine=Object.keys(P.rel||{}).filter(r=>REL[r]&&relCount(r)>0);const ef=state.rlE||'all',so=state.rlO||'need';
    let list=mine.filter(r=>ef==='all'||REL[r].era===ef||(ef==='need'&&relicAdvice(r).need.length));const val=r=>relicEV(r,'i').pl;
    list.sort((a,b)=>so==='name'?a.localeCompare(b):so==='plat'?val(b)-val(a):so==='count'?relCount(b)-relCount(a):(relicAdvice(b).need.length-relicAdvice(a).need.length)||val(b)-val(a));rv('rlO',list);
    Object.assign(out,{era:ef,sort:so,kinds:mine.length,tot:mine.reduce((a,r)=>a+relCount(r),0),totPl:Math.round(mine.reduce((a,r)=>a+val(r)*relCount(r),0)),withNeed:mine.filter(r=>relicAdvice(r).need.length).length,traces:+P.traces||0,
      cards:list.map(r=>{const R=REL[r];const a=relicAdvice(r);const x=P.rel[r]||{};return {r,vaulted:!!R.v,advice:{t:a.t,why:a.why,k:a.k},counts:{i:+x.i||0,e:+x.e||0,f:+x.f||0,r:+x.r||0},
        rewards:R.rw.map(([n,rr])=>({n,rar:rr,go:linkKey(n),need:!/Forma/.test(n)&&partNeeded(n),goal:!!partGoal(n),plat:pv(n)!=null?Math.round(pv(n)):null,du:partDu(n)||0})),evI:Math.round(relicEV(r,'i').pl),evR:Math.round(relicEV(r,'r').pl)}})})}
  else if(tab==='plan')out.plan=plannerData();
  else if(tab==='add'){const q=(state.raQ||'').toLowerCase().trim(),ef=state.raE||'all';
    const list=Object.keys(REL).filter(r=>(!q||r.toLowerCase().includes(q))&&(ef==='all'||REL[r].era===ef||(ef==='open'&&!REL[r].v)||(ef==='need'&&REL[r].rw.some(([n])=>!/Forma/.test(n)&&partNeeded(n)&&partGoal(n))))).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
    Object.assign(out,{q:state.raQ||'',filter:ef,total:list.length,list:list.slice(0,150).map(r=>{const R=REL[r];const rare=R.rw.find(x=>x[1]==='R');return {r,vaulted:!!R.v,rare:rare?rare[0]:'',count:+(((P.rel||{})[r]||{}).i)||0}})})}
  else{const so=state.duO||'ratio',f=state.duF||'all',q=(state.duQ||'').toLowerCase().trim();const dup=P.dup||{};
    let list=allParts().filter(x=>x.du&&(!q||x.n.toLowerCase().includes(q))).map(x=>({...x,r:x.p?x.du/x.p:null,c:+dup[x.n]||0}));
    list=list.filter(x=>f==='all'||(f==='mine'&&x.c>0)||(f==='baro'&&x.r!=null&&x.r>=10)||(f==='plat'&&x.p!=null&&x.p>=8)||(f==='junk'&&x.p!=null&&x.p<=4));
    list.sort((a,b)=>so==='plat'?((b.p??-1)-(a.p??-1)):so==='du'?b.du-a.du:so==='name'?a.n.localeCompare(b.n):so==='mine'?b.c-a.c:((b.r??-1)-(a.r??-1)));rv('duO',list);
    const mine=allParts().filter(x=>(+dup[x.n]||0)>0);const vt=WS&&WS.voidTrader;const now=new Date();const act=!!(vt&&new Date(vt.activation)<=now&&now<new Date(vt.expiry));if(HOSTED&&!WS&&!WSerr)loadWS();
    Object.assign(out,{q:state.duQ||'',filter:f,sort:so,snapshot:D.meta.prices,spares:mine.reduce((a,x)=>a+(+dup[x.n]),0),plat:Math.round(mine.reduce((a,x)=>a+(x.p||0)*(+dup[x.n]),0)),ducats:mine.reduce((a,x)=>a+(x.du||0)*(+dup[x.n]),0),
      baro:{state:vt?(act?'Here now':'Away'):'—',text:vt?(act?(untilIso(vt.expiry)?'leaves in '+untilIso(vt.expiry):'leaving now')+' · '+(vt.location||''):(untilIso(vt.activation)?'arrives in '+untilIso(vt.activation):'arriving now')):!HOSTED?'live on the hosted site':WSerr?'live data unavailable':'checking…'},
      count:list.length,rows:list.slice(0,250).map(x=>({n:x.n,go:linkKey(x.n),plat:x.p!=null?Math.round(x.p):null,du:x.du,spares:x.c,tag:x.r!=null&&x.r>=10?'Baro':x.p!=null&&x.p>=8?'Sell':''})),
      stock:act&&vt.inventory?vt.inventory.map(i=>({item:i.item,go:linkKey(i.item),ducats:i.ducats,credits:i.credits})):[]})}
  return out}
const relClean=r=>{if(!relCount(r))delete P.rel[r]};
Object.assign(window.TF,{
  relics:()=>relicsData(),
  relicsSet:o=>{const m={tab:'rlTab',era:'rlE',sort:'rlO',raq:'raQ',rae:'raE',duq:'duQ',duf:'duF',duo:'duO'};for(const k in o)if(m[k])state[m[k]]=o[k];saveUI();tfNotify()},
  relAdj:(r,k,d)=>{P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,(+x[k]||0)+d);relClean(r);saveProfile();tfNotify()},
  relSet:(r,k,v)=>{P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,+v||0);relClean(r);saveProfile();tfNotify()},
  setTraces:v=>{P.traces=Math.max(0,+v||0);saveProfile();tfNotify()},
  setDup:(n,v)=>{P.dup=P.dup||{};const c=Math.max(0,+v||0);if(c)P.dup[n]=c;else delete P.dup[n];saveProfile();tfNotify()}
});
document.addEventListener('click',e=>{const t=e.target.closest('[data-rltab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('relics')))return;
  e.preventDefault();e.stopPropagation();state.rlTab=t.dataset.rltab;saveUI();if(location.hash!=='#relics')location.hash='relics';else tfNotify()},true);
const _relicsRoute=routes.relics;
routes.relics=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('relics')?'':_relicsRoute()};
/* live fissures by relic era (normal first, then Steel Path; Void Storms need a Railjack so they come last) */
function fisByEra(){const out={},now=Date.now();const fs=(WS&&WS.fissures||[]).filter(f=>!f.expired&&new Date(f.expiry).getTime()>now).sort((a,b)=>(!!a.isStorm-!!b.isStorm)||(!!a.isHard-!!b.isHard));
  for(const f of fs)if(!out[f.tier])out[f.tier]={mission:f.missionType,node:f.node,hard:!!f.isHard,storm:!!f.isStorm,left:left(new Date(f.expiry)-now),more:fs.filter(x=>x.tier===f.tier).length-1};
  return out}
/* relic planner: what a run is worth with your squad size and refinement, and the chance of what you need */
function runEV(r,ref,n,valOf){const R=REL[r];const rows=R.rw.map(([nm,rar])=>({v:valOf(nm)||0,p:RCH[ref][rar]/100})).sort((a,b)=>a.v-b.v);let F=0,prev=0,ev=0;for(const x of rows){F+=x.p;const cur=Math.pow(Math.min(1,F),n);ev+=x.v*(cur-prev);prev=cur}return ev}
function plannerData(){const ref=state.rpR||'r',n=+(state.rpN||4),own=state.rpO!==false&&state.rpO!=='0',ef=state.rpE||'all',so=state.rpS||'plat',q=(state.rpQ||'').toLowerCase().trim();
  const FIS=fisByEra();
  let list=Object.keys(REL).filter(r=>(!own||relCount(r)>0)&&(ef==='all'||REL[r].era===ef||(ef==='open'&&!REL[r].v)||(ef==='fis'&&FIS[REL[r].era]))&&(!q||r.toLowerCase().includes(q)||REL[r].rw.some(([x])=>x.toLowerCase().includes(q))));
  const rows=list.map(r=>{const R=REL[r];const need=R.rw.filter(([x])=>!/Forma/.test(x)&&partNeeded(x)&&partGoal(x));
    const best=need.length?need.reduce((a,[x,rar])=>RCH[ref][rar]<RCH[ref][a[1]]?[x,rar]:a,need[0]):null;
    const needP=need.length?1-need.reduce((m,[,rar])=>m*Math.pow(1-RCH[ref][rar]/100,n),1):0;
    const rare=R.rw.find(x=>x[1]==='R');
    return {r,era:R.era,vaulted:!!R.v,count:relCount(r),plat:runEV(r,ref,n,pv),du:runEV(r,ref,n,partDu),
      rare:rare?{n:rare[0],go:linkKey(rare[0]),p:1-Math.pow(1-RCH[ref].R/100,n),plat:pv(rare[0])!=null?Math.round(pv(rare[0])):null}:null,
      need:need.map(([x,rar])=>({n:x,go:linkKey(x),p:1-Math.pow(1-RCH[ref][rar]/100,n)})),needP,hardest:best?best[0]:'',fis:FIS[R.era]||null}});
  rows.sort((a,b)=>so==='du'?b.du-a.du:so==='need'?(b.needP-a.needP)||b.plat-a.plat:so==='name'?a.r.localeCompare(b.r,undefined,{numeric:true}):b.plat-a.plat);rv('rpS',rows);
  return {ref,squad:String(n),own,era:ef,sort:so,q:state.rpQ||'',total:rows.length,owned:Object.keys(P.rel||{}).filter(r=>REL[r]&&relCount(r)>0).length,rows:rows.slice(0,150).map(x=>({...x,plat:Math.round(x.plat*10)/10,du:Math.round(x.du)}))}}
Object.assign(window.TF,{planSet:o=>{const m={ref:'rpR',squad:'rpN',era:'rpE',sort:'rpS',q:'rpQ'};for(const k in o)if(m[k])state[m[k]]=o[k];if(o.own!=null)state.rpO=o.own;tfNotify()}});
/* ---------- bridge: Builds (arsenal) for the React page ---------- */
function modSlot(slot,m,arc){const md=(arc?ARC[m]:MODS[m])||{};const key=(arc?'arc|':'mod|')+m;
  return {slot,m,key,pol:arc?'':(md.pol||''),done:on(key),price:strip(priceChip(m)),src:md.src?md.src:(md.dr&&md.dr.length?strip(dropsList(md.dr,2)):'Trade on warframe.market'),seller:sellerRow(m)}}
const ART={key:'',html:''};
function buildsData(src,kind){const cats=[...new Set(Object.keys(src).map(n=>I[n]?I[n].c:'Other'))].sort();const cf=kind==='w'?(state.wbC||'all'):'all',of=state.wbO||'all';
  let names=Object.keys(src).filter(n=>(cf==='all'||(I[n]&&I[n].c===cf))&&(of==='all'||(of==='own'&&ownedItem(n))||(of==='not'&&!ownedItem(n))||(of==='unmastered'&&!on('m|'+n)))).sort();
  const filteredEmpty=!names.length;if(!names.length)names=Object.keys(src).sort();
  const key=kind==='w'?'wbSel':'cbSel';let cur=state[key];if(!cur||!names.includes(cur))cur=names[0];state[key]=cur;
  const bs=src[cur]||[];const bi=Math.max(0,Math.min(state.wbI||0,bs.length-1));const b=bs[bi];
  const k=cur+'|'+ISLV;if(ART.key!==k){ART.key=k;ART.html=I[cur]?itemTree(cur):''}
  return {cats:kind==='w'?cats:[],cat:cf,own:of,names,cur,img:IMG(cur),filteredEmpty,tree:ART.html,builds:bs.map((x,i)=>({value:String(i),label:x.name})),bi:String(bi),
    build:b?{role:b.role,name:b.name,notes:b.notes||'',mods:[...(b.exilus?[modSlot('Exilus',b.exilus)]:[]),...b.mods.map(m=>modSlot('Mod',m))],arcanes:b.arcanes.map(a=>modSlot('Arcane',a,true))}:null}}
function arsenalData(){const tab=state.aTab||'top';const out={tab};
  if(tab==='builds')Object.assign(out,buildsData(D.wbuilds,'w'));
  else if(tab==='comp')Object.assign(out,buildsData(D.cbuilds,'c'));
  else if(tab==='lich'){const ff=state.lF||'all',sf=state.lS||'all';const L2=P.lich||{};const own=n=>on('lich|'+n)||ownedItem(n);
    const list=D.lich.filter(w=>(ff==='all'||w.f===ff)&&(sf==='all'||(sf==='own'&&own(w.n))||(sf==='miss'&&!own(w.n))||(sf==='low'&&own(w.n)&&(+((L2[w.n]||{}).b)||0)<60)||(sf==='unm'&&!on('m|'+w.n)))).sort((a,b)=>a.f.localeCompare(b.f)||a.n.localeCompare(b.n));
    Object.assign(out,{faction:ff,status:sf,total:D.lich.length,have:D.lich.filter(w=>own(w.n)).length,mastered:D.lich.filter(w=>on('m|'+w.n)).length,
      factions:['Kuva','Tenet','Coda'].map(f=>{const a=D.lich.filter(w=>w.f===f);return {f,have:a.filter(w=>own(w.n)).length,total:a.length}}),
      how:Object.entries(D.lichsrc).map(([f,s])=>({f,who:s.who,how:s.how,vanq:s.vanq,alt:s.alt})),elements:ELEM.slice(1),
      list:list.map(w=>{const v=L2[w.n]||{};const it=MIX[w.n];return {n:w.n,f:w.f,c:w.c,go:linkKey(w.n),own:own(w.n),key:'lich|'+w.n,rank:rankOf(w.n)&&!on('m|'+w.n)?rankOf(w.n):0,left:it?mxp(it)-itemXP(w.n):0,xp:it?mxp(it):0,price:strip(priceChip(w.n)),el:v.e||'',bonus:+v.b||0}})})}
  else if(tab==='arc'){const q=(state.arQ||'').toLowerCase().trim(),tf=state.arT||'all',sf=state.arS||'all',so=state.arO||'use';const A=P.arc||{};const U2=arcUses();
    const types=[...new Set(Object.values(ARC).map(a=>a.ty).filter(Boolean))].sort();
    let list=Object.values(ARC).filter(a=>(!q||a.n.toLowerCase().includes(q))&&(tf==='all'||a.ty===tf)).filter(a=>{const c=+A[a.n]||0,mx=arcCopies(a.mx||5);return sf==='all'||(sf==='used'&&U2[a.n])||(sf==='own'&&c>0)||(sf==='max'&&c>=mx)||(sf==='part'&&c>0&&c<mx)||(sf==='none'&&!c)});
    list.sort((a,b)=>so==='name'?a.n.localeCompare(b.n):so==='price'?((pv(b.n)??-1)-(pv(a.n)??-1)):so==='need'?((arcCopies(b.mx||5)-(+A[b.n]||0))-(arcCopies(a.mx||5)-(+A[a.n]||0))):(((U2[b.n]?U2[b.n].size:0)-(U2[a.n]?U2[a.n].size:0))||a.n.localeCompare(b.n)));rv('arO',list);
    Object.assign(out,{q:state.arQ||'',type:tf,status:sf,sort:so,types,count:Object.keys(ARC).length,owned:Object.values(ARC).filter(a=>(+A[a.n]||0)>0).length,maxed:Object.values(ARC).filter(a=>(+A[a.n]||0)>=arcCopies(a.mx||5)).length,
      arcs:list.slice(0,200).map(a=>{const c=+A[a.n]||0,mx=a.mx||5,need=arcCopies(mx);const u=U2[a.n];return {n:a.n,go:linkKey(a.n),copies:c,need,maxRank:mx,rank:arcRank(c),price:strip(priceChip(a.n)),type:a.ty||'',uses:u?[...u]:[],drops:a.dr&&a.dr.length?strip(dropsList(a.dr,2)):''}})})}
  else{const sf=state.kmS||'all',tf=state.kmT||'all';const all=keyMods();const types=[...new Set(all.map(x=>x.md.ty).filter(Boolean))].sort();
    const list=all.filter(x=>(tf==='all'||x.md.ty===tf)&&(sf==='all'||(sf==='miss'&&!on('mod|'+x.n))||(sf==='have'&&on('mod|'+x.n))||(sf==='trade'&&x.md.tr)));
    Object.assign(out,{type:tf,status:sf,types,have:all.filter(x=>on('mod|'+x.n)).length,total:all.length,
      mods:list.map(x=>({n:x.n,go:linkKey(x.n),key:'mod|'+x.n,done:on('mod|'+x.n),price:strip(priceChip(x.n)),type:x.md.ty||'',uses:x.s.size,src:x.md.src?x.md.src:x.md.dr&&x.md.dr.length?strip(dropsList(x.md.dr,2)):'Trade on warframe.market'}))})}
  return out}
Object.assign(window.TF,{
  arsenal:()=>arsenalData(),
  arsenalSet:o=>{const m={tab:'aTab',cat:'wbC',own:'wbO',lf:'lF',ls:'lS',arq:'arQ',art:'arT',ars:'arS',aro:'arO',kmt:'kmT',kms:'kmS'};for(const k in o)if(m[k])state[m[k]]=o[k];
    if(o.sel!=null){state[(state.aTab||'builds')==='comp'?'cbSel':'wbSel']=o.sel;state.wbI=0}if(o.bi!=null)state.wbI=+o.bi;saveUI();tfNotify()},
  arcAdj:(n,d)=>{P.arc=P.arc||{};P.arc[n]=Math.max(0,(+P.arc[n]||0)+d);if(!P.arc[n])delete P.arc[n];saveProfile();tfNotify()},
  arcSet:(n,v)=>{P.arc=P.arc||{};const c=Math.max(0,+v||0);if(c)P.arc[n]=c;else delete P.arc[n];saveProfile();tfNotify()},
  lichSet:(n,o)=>{P.lich=P.lich||{};const v=P.lich[n]=P.lich[n]||{};if(o.e!=null)v.e=o.e;if(o.b!=null)v.b=Math.max(0,Math.min(60,+o.b||0));saveProfile();tfNotify()}
});
document.addEventListener('click',e=>{const t=e.target.closest('[data-atab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('arsenal')))return;
  e.preventDefault();e.stopPropagation();state.aTab=t.dataset.atab;saveUI();if(location.hash!=='#arsenal')location.hash='arsenal';else tfNotify()},true);
const _arsenalRoute=routes.arsenal;
routes.arsenal=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('arsenal')?'':_arsenalRoute()};
/* ---------- bridge: Profile (tenno) for the React page. Most tabs keep their existing panels; Inventory is rebuilt. ---------- */
const TTABS=[['profile','Profile'],['breakdown','Mastery breakdown'],['account','Account & sync'],['foundry','Foundry'],['inventory','Inventory'],['helminth','Helminth'],['friends','Compare profiles'],['backup','Backup & export']];
function tennoData(){const tab=state.tTab||'profile';const t=totalXP(),m=mrInfo(t.total);
  const out={tab,tabs:TTABS.map(([value,label])=>({value,label})),name:P.tname||(P.prof&&P.prof.name)||'Your Tenno',synced:P.at?fdate(P.at):'',inGame:P.prof&&P.prof.mr!=null?mrLabel(P.prof.mr):'',
    mrLabel:mrLabel(m.mr),pct:m.pct,showSign:canAcct()&&!signedIn(),html:''};
  if(tab==='inventory'){const q=(state.invQ||'').toLowerCase().trim();const common=['Ferrite','Rubedo','Alloy Plate','Nano Spores','Polymer Bundle','Salvage','Plastids','Circuits','Cryotic','Oxium','Gallium','Morphics','Neural Sensors','Neurodes','Orokin Cell','Control Module','Argon Crystal','Tellurium','Nitain Extract','Kuva','Hexenon','Detonite Injector','Fieldron','Mutagen Mass'].filter(n=>RES[n]);
    const list=q?Object.keys(RES).filter(n=>n.toLowerCase().includes(q)):[...new Set([...common,...Object.keys(P.inv||{}).filter(n=>RES[n])])];
    out.q=state.invQ||'';out.total=list.length;out.inv=list.slice(0,120).map(n=>({n,have:P.inv&&P.inv[n]!=null?+P.inv[n]:null}))}
  else out.html=tab==='account'?accountTab():tab==='breakdown'?bdPanel()+breakdownTab():tab==='helminth'?helminthTab():tab==='foundry'?foundryTab():tab==='backup'?backupTab():tab==='friends'?friendsTab():profileTab();
  return out}
Object.assign(window.TF,{
  tenno:()=>tennoData(),
  inventoryInfo:()=>({at:P.invAt?fdate(P.invAt.slice(0,10))+' '+new Date(P.invAt).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):'',last:(P.lastSync&&P.lastSync.inv)||null,canUndo:!!lsGet('tf-presync',null)}),
  importInventory:async txt=>{if(String(txt).length>60e6)return {ok:false,msg:'That file is too large to be an inventory file.'};const r=await importInventory(txt);tfNotify();return r},
  undoSync:()=>tfAct('button',{id:'undosync'}),
  tennoSet:o=>{if(o.tab!=null)state.tTab=o.tab;if(o.q!=null)state.invQ=o.q;saveUI();tfNotify()}
});
/* tab links from anywhere (e.g. "Full breakdown", "Foundry", "Sync your profile") */
document.addEventListener('click',e=>{const t=e.target.closest('[data-ttab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('tenno')))return;
  e.preventDefault();e.stopPropagation();state.tTab=t.dataset.ttab;saveUI();if(location.hash!=='#tenno')location.hash='tenno';else tfNotify()},true);
const _tennoRoute=routes.tenno;
routes.tenno=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('tenno')?'':_tennoRoute()};
/* ---------- bridge: Support, Feedback, About and Backend for the React pages ---------- */
function supportData(){const ign=DONATE.ign;return {ign,paypal:DONATE.paypal,whisper:ign?`/w ${ign} Hi! I'd like to donate platinum to Tennoform.`:''}}
function feedbackData(){if(HOSTED&&FB&&SO.uid&&!FBK.tried)loadFeedback();const from=state.fbFrom&&state.fbFrom!=='feedback'?state.fbFrom:'';
  return {hosted:HOSTED,ready:!!FB,signed:!!SO.uid,kind:state.fbKind||'bug',from:from?(PL[from]||from):'',prefill:state.fbPrefill||'',admin:!!FBK.admin}}
function aboutData(){
  return {pitch:PITCH,site:D.meta.site||D.meta.built,wfcd:D.meta.wfcd||'',built:D.meta.built,prices:D.meta.prices,sec:state.aboutSec||'',
    changes:CHANGES.map(([d,t])=>({d:fdate(d),t})),
    feeds:feedsData().map(f=>({k:f.k,t:f.name+': '+f.t}))}}
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
/* ---------- bridge: Squad (friends, chats, groups) for the React page ---------- */
const sqTime=at=>new Date(at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
const sqName=uid=>{const f=SO.friends.find(x=>x.uid===uid)||{};return (SO.pub[uid]||{}).name||f.name||'Friend'};
function sqMarkRead(key){const lr=lsGet('tf-read',{});lr[key]=Date.now();lsSet('tf-read',lr);setTimeout(badge,0)}
function sqFriendLog(fid){return SO.inbox.filter(m=>!blocked(m.from)&&(m.from===fid&&m.type!=='friend'&&m.type!=='accept')||(m.type==='sent'&&m.to===fid)).sort((a,b)=>a.at-b.at).map(m=>{
  const mine=m.type==='sent';const o={id:m.id,mine,time:sqTime(m.at),kind:'text',text:m.text||'',task:m.task&&m.task.t||'',ans:m.ans||'',who:''};
  if(m.type==='task')o.kind='invite';else if(m.type==='taskok')o.kind='joined';else if(m.type==='taskno')o.kind='declined';else if(m.type==='taskdone')o.kind='done';else if(mine&&m.task&&!m.text)o.kind='sentInvite';
  return o})}
function sqGroupLog(g){return (SO.gm[g.id]||[]).filter(m=>!blocked(m.from)).slice().sort((a,b)=>a.at-b.at).map(m=>{const mine=m.from===SO.uid;
  const o={id:m.id,mine,time:sqTime(m.at),kind:'text',text:m.text||'',task:m.task&&m.task.t||'',ans:'',who:mine?'':(m.fromName||gname(g,m.from))};
  if(m.type==='sys')o.kind='sys';else if(m.type==='task'){o.kind=mine?'sentInvite':'invite';o.ans=(P.tasks||[]).some(x=>x.src&&x.src.id===(m.task&&m.task.id))?'ok':''}
  else if(m.type==='taskok')o.kind='joined';else if(m.type==='taskdone')o.kind='done';return o})}
function squadData(){const out={status:'ok',code:'',requests:[],groups:[],friends:[],chat:null,tasks:[],compare:null,newGroup:!!state.newGroup,pickable:[]};
  if(!HOSTED)return {...out,status:'offline'};if(!FB)return {...out,status:FBST==='loading'?'loading':'unavailable'};if(!SO.uid)return {...out,status:'signin'};
  const ur=unread().per;out.code=SO.code||'';
  out.requests=SO.inbox.filter(m=>m.type==='friend'&&!blocked(m.from)).map(m=>({id:m.id,name:m.fromName||'Tenno',code:m.code||''}));
  out.groups=SO.groups.map(g=>({id:g.id,name:g.name,members:g.members.length,unread:ur['g:'+g.id]||0}));
  out.friends=SO.friends.map(f=>{const p=SO.pub[f.uid]||{};return {uid:f.uid,name:p.name||f.name||'Friend',pending:!!f.pending,mr:p.mr!=null?'MR '+mrLabel(p.mr):'',xp:p.xp?fmt(p.xp)+' XP':'',unread:ur[f.uid]||0}});
  out.tasks=(P.tasks||[]).filter(x=>!x.d).map(x=>({id:x.id,t:x.t}));
  out.pickable=SO.friends.filter(f=>!f.pending).map(f=>({uid:f.uid,name:sqName(f.uid)}));
  const cur=state.chat&&SO.friends.find(f=>f.uid===state.chat);const curG=state.chat&&state.chat.startsWith('g:')?SO.groups.find(g=>'g:'+g.id===state.chat):null;
  if(cur){sqMarkRead(cur.uid);out.chat={type:'friend',id:cur.uid,name:sqName(cur.uid),code:cur.code||'',pending:!!cur.pending,members:'',addable:[],log:sqFriendLog(cur.uid)}}
  else if(curG){sqMarkRead('g:'+curG.id);out.chat={type:'group',id:curG.id,name:curG.name,code:'',pending:false,members:curG.members.map(u=>u===SO.uid?'You':gname(curG,u)).join(', '),
    addable:SO.friends.filter(f=>!f.pending&&!curG.members.includes(f.uid)).map(f=>({uid:f.uid,name:sqName(f.uid)})),log:sqGroupLog(curG)}}
  const acc=SO.friends.filter(f=>!f.pending);
  if(acc.length){const t=totalXP();const me={name:'You',mr:mrInfo(t.total).mr,xp:t.total,maxed:MI.filter(i=>itemXP(i.n)>=mxp(i)).length,nodes:ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,sp:ALLN.filter(n=>!isJ(n)&&on('sp|'+n.id)).length};
    const all=[me,...acc.map(f=>({...(SO.pub[f.uid]||{}),name:sqName(f.uid)}))];
    const row=(label,k,fm)=>{const best=Math.max(...all.map(x=>+x[k]||0));return {label,vals:all.map(x=>({v:x[k]==null?'—':fm?fm(x[k]):fmt(x[k]),top:best>0&&(+x[k]||0)===best}))}};
    out.compare={names:all.map(x=>x.name||'Friend'),rows:[row('Mastery rank','mr',v=>mrLabel(v)),row('Total XP','xp'),row('Items mastered','maxed'),row('Star chart nodes','nodes'),row('Steel Path nodes','sp')]}}
  return out}
const sqGid=()=>state.chat&&state.chat.startsWith('g:')?state.chat.slice(2):null;
Object.assign(window.TF,{
  squad:()=>squadData(),
  squadSet:o=>{if('chat' in o)state.chat=o.chat;if(o.newGroup!=null)state.newGroup=o.newGroup;tfNotify()},
  friendAdd:code=>addFriendCode(code),
  friendAccept:id=>acceptFriend(id),
  friendDecline:id=>{FB.fs.collection('inbox').doc(SO.uid).collection('msgs').doc(id).delete().catch(()=>{})},
  friendRemove:uid=>{FB.fs.collection('users').doc(SO.uid).collection('friends').doc(uid).delete().catch(()=>{});state.chat=null;tfNotify();toast('Removed from your friends')},
  friendBlock:uid=>{P.block=P.block||[];if(!P.block.includes(uid))P.block.push(uid);saveProfile();FB.fs.collection('users').doc(SO.uid).collection('friends').doc(uid).delete().catch(()=>{});
    SO.inbox.filter(m=>m.from===uid&&m.type==='friend').forEach(m=>FB.fs.collection('inbox').doc(SO.uid).collection('msgs').doc(m.id).delete().catch(()=>{}));state.chat=null;tfNotify();toast("Blocked. They can't message you or send requests.")},
  friendReport:uid=>{const f=SO.friends.find(x=>x.uid===uid)||{};state.fbPrefill=`Report: ${sqName(uid)} (friend code ${f.code||'?'}, id ${uid}).\nWhat happened: `;state.fbKind='other';state.fbFrom='friends';location.hash='feedback'},
  msgSend:async text=>{text=(text||'').trim();if(!text||!state.chat)return false;
    try{const g=sqGid();if(g)await gpost(g,{type:'msg',text});else await sendMsg(state.chat,{type:'msg',text});return true}catch(e){toast("Couldn't send. They may not have accepted yet.");return false}},
  inviteTask:async id=>{const x=(P.tasks||[]).find(y=>y.id===id);if(!x||!state.chat)return;const task={id:x.id,t:x.t,k:x.k,r:x.r};const g=sqGid();
    try{if(g){x.g=g;saveProfile();await gpost(g,{type:'task',task});toast('Invite sent to the group')}else{await sendMsg(state.chat,{type:'task',task});toast('Invite sent')}}catch(e){toast("Couldn't send the invite.")}},
  inviteAnswer:(id,ok)=>{const g=sqGid();if(g)gJoin(g,id);else answerInvite(id,ok)},
  groupCreate:async(name,uids)=>{name=(name||'').trim().slice(0,40);if(!name){toast('Give the group a name');return false}if(!uids.length){toast('Pick at least one friend');return false}
    const names={[SO.uid]:myName()};uids.forEach(u=>names[u]=String(sqName(u)).slice(0,40));
    try{const r=await FB.fs.collection('groups').add({name,owner:SO.uid,members:[SO.uid,...uids],names,at:Date.now()});await gpost(r.id,{type:'sys',text:myName()+' created '+name});state.newGroup=false;state.chat='g:'+r.id;tfNotify();return true}
    catch(e){toast("Couldn't create the group. Check the Firebase rules are up to date.");return false}},
  groupAdd:uid=>{const g=sqGid();if(g)gAdd(g,uid)},
  groupLeave:()=>{const g=sqGid();if(g)gLeave(g)}
});
/* chats and requests arrive live; let React redraw even while someone is typing (it keeps its own input state) */
const _socialRender=socialRender;socialRender=function(){if(window.TF_UI&&TF_UI.owns&&TF_UI.owns('friends')&&location.hash==='#friends'){badge();tfNotify();return}_socialRender()};
const _friendsRoute=routes.friends;routes.friends=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('friends')?'':_friendsRoute()};
/* ---------- bridge: Guides for the React page ---------- */
routes.guides=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('guides')?'':guides()};
function guideCard(g){const st=guideSteps(g.id),n=(g.steps||[]).length;const u=guideUnlock(g);
  return {id:g.id,n:g.n,kind:g.kind,sum:g.sum||'',time:g.time||'',steps:n,doneSteps:Math.min(st.length,n),ready:u.ready,done:g.kind==='quest'&&qDone(g.n)}}
function guidesData(){lazyLoad('guides');const f=state.gF||'all',q=(state.gQ||'').toLowerCase().trim();
  const words=q.split(/\s+/).filter(w=>w&&!CMD_STOP.has(w));
  const match=g=>!words.length||words.every(w=>[g.n,...(g.aka||[]),g.sum||'',...(g.was||[])].join(' ').toLowerCase().includes(w));
  const all=GUIDES.filter(match);const list=all.filter(g=>f==='all'||g.kind===f).map(guideCard);
  const counts={all:all.length,quest:all.filter(g=>g.kind==='quest').length,system:all.filter(g=>g.kind==='system').length,mode:all.filter(g=>g.kind==='mode').length};
  const g=GIDX[state.gSel];let sel=null;
  if(g){const st=guideSteps(g.id);const u=guideUnlock(g);
    const needs=GUIDES.filter(x=>x.id!==g.id&&((x.unlock||{}).quests||[]).includes(g.n)).map(x=>({id:x.id,n:x.n,kind:x.kind}));
    sel={...guideCard(g),aka:g.aka||[],was:g.was||[],act:g.act||null,unlock:u,fast:g.fast||[],rw:g.rw||[],w:g.w||'',
      stepList:(g.steps||[]).map((s,i)=>({t:s.t,tip:s.tip||'',done:st.includes(i)})),
      go:(g.go||[]).map(n=>({n,key:guideKey(n)})).filter(x=>x.key),
      opens:needs,questKey:g.kind==='quest'&&Q.some(x=>x.n===g.n)?'quest|'+g.n:'',
      hasTask:(P.tasks||[]).some(t=>!t.d&&t.k==='guide'&&t.r===g.id)}}
  return {filter:f,q:state.gQ||'',counts,list,sel,total:GUIDES.length,loading:lazyLoading('guides')}}
Object.assign(window.TF,{
  guides:()=>guidesData(),
  guidesSet:o=>{if(o.filter!=null)state.gF=o.filter;if(o.q!=null)state.gQ=o.q;if('sel' in o){state.gSel=o.sel;window.scrollTo(0,0)}tfNotify()},
  guideStep:(id,i,v)=>{P.gd=P.gd||{};const a=new Set(P.gd[id]||[]);if(v)a.add(i);else a.delete(i);P.gd[id]=[...a].sort((x,y)=>x-y);if(!P.gd[id].length)delete P.gd[id];saveProfile();tfNotify()},
  guideReset:id=>{const prev=(P.gd||{})[id];if(!prev)return;delete P.gd[id];saveProfile();tfNotify();
    if(window.TF_UI)TF_UI.toast('Steps cleared',{label:'Undo',fn:()=>{P.gd=P.gd||{};P.gd[id]=prev;saveProfile();tfNotify()}})},
  guideTask:id=>{const g=GIDX[id];if(!g)return;if(addTask('guide',g.id,(g.kind==='quest'?'Finish ':g.kind==='system'?'Unlock ':'Try ')+g.n))toast('Added to your tasks');tfNotify()}
});
/* ---------- bridge: build library (community meta builds + player-shared builds), build goals, my builds ---------- */
const BKIND=c=>c==='Warframe'?'Warframe':['Companion','Sentinel'].includes(c)?'Companion':['Primary','Secondary','Melee','Zaw','Kitgun','Arch-Gun','Arch-Melee','Robotic Weapon'].includes(c)?'Weapon':'Other';
const BMODTY={Warframe:['Warframe Mod'],Primary:['Primary Mod','Shotgun Mod'],Secondary:['Secondary Mod'],Kitgun:['Secondary Mod','Primary Mod'],Melee:['Melee Mod','Stance Mod'],Zaw:['Melee Mod','Stance Mod'],
  'Arch-Gun':['Arch-Gun Mod'],'Arch-Melee':['Arch-Melee Mod'],Companion:['Companion Mod'],Sentinel:['Companion Mod'],'Robotic Weapon':['Primary Mod','Companion Mod'],Archwing:['Archwing Mod'],'K-Drive':['K-Drive Mod'],Necramech:['Necramech Mod']};
const BARCTY={Warframe:['Warframe Arcane'],Primary:['Primary Arcane','Bow Arcane','Shotgun Arcane'],Secondary:['Secondary Arcane'],Kitgun:['Kitgun Arcane'],Melee:['Melee Arcane'],Zaw:['Zaw Arcane'],Amp:['Amp Arcane']};
const BSLOTS=c=>({aura:c==='Warframe'?'Aura':['Melee','Zaw'].includes(c)?'Stance':'',exilus:['Companion','Sentinel'].includes(c)?'':'Exilus',arcanes:c==='Warframe'?2:BARCTY[c]?1:0,helminth:c==='Warframe'});
const SB={list:null,loading:false,err:'',at:0};
let METAB=null;
function metaBuilds(){if(METAB)return METAB;const out=[];
  for(const src of [D.builds,D.wbuilds,D.cbuilds])for(const item in src||{})(src[item]||[]).forEach((b,i)=>out.push({id:'m:'+item+':'+i,src:'meta',item,name:b.name||'Build',role:b.role||'',aura:b.aura||'',exilus:b.exilus||'',mods:b.mods||[],arcanes:b.arcanes||[],helminth:b.helminth||'',notes:b.notes||''}));
  return METAB=out}
function loadShared(force){if(!FB||SB.loading||(SB.list&&!force&&Date.now()-SB.at<120000))return;SB.loading=true;SB.err='';tfNotify();
  FB.fs.collection('builds').orderBy('score','desc').limit(300).get().then(s=>{SB.list=s.docs.map(d=>({id:'p:'+d.id,doc:d.id,src:'player',...d.data()}));SB.at=Date.now()})
    .catch(e=>{SB.err=(e&&e.code)||'error'}).finally(()=>{SB.loading=false;tfNotify()})}
function allBuilds(){return [...metaBuilds(),...(SB.list||[]).filter(b=>!blocked(b.uid))]}
function buildById(id){if(id.startsWith('mine:'))return (P.myb||[]).find(b=>'mine:'+b.id===id);return allBuilds().find(b=>b.id===id)||(P.bg||[]).find(g=>g.id===id)}
function bParts(b){return [...(b.aura?[['aura',b.aura]]:[]),...(b.exilus?[['exilus',b.exilus]]:[]),...b.mods.filter(Boolean).map(m=>['mod',m]),...(b.arcanes||[]).filter(Boolean).map(a=>['arc',a])]}
const bHave=b=>{const p=bParts(b);return {have:p.filter(([k,n])=>on((k==='arc'?'arc|':'mod|')+n)||(k==='arc'&&(+((P.arc||{})[n])||0)>0)).length,total:p.length}};
function bCard(b){const it=I[b.item];const h=bHave(b);const mv=(P.bv||{})[b.doc]||0;
  return {id:b.id,src:b.src,item:b.item,fits:bFits(b),img:IMG(b.item),kind:it?BKIND(it.c):'Other',cat:it?it.c:'',name:b.name,role:b.role||'',author:b.author||'',score:b.score||0,up:b.up||0,down:b.down||0,myVote:mv,have:h.have,total:h.total,
    goal:(P.bg||[]).some(g=>g.from===b.id),at:b.at||0}}
function bDetail(b){const it=I[b.item];const c=it?it.c:'';const sl=BSLOTS(c);
  return {...bCard(b),notes:b.notes||'',helminth:b.helminth||'',mine:b.src==='player'&&b.uid===SO.uid,doc:b.doc||'',
    mods:[...(b.aura?[modSlot(sl.aura||'Aura',b.aura)]:[]),...(b.exilus?[modSlot('Exilus',b.exilus)]:[]),...b.mods.filter(Boolean).map(m=>modSlot('Mod',m))],
    arcanes:(b.arcanes||[]).filter(Boolean).map(a=>modSlot('Arcane',a,true)),
    itemOwned:it?famOwned(b.item):true,itemGoal:(P.goals||[]).includes(b.item),canVote:b.src==='player'&&!!SO.uid}}
function buildLibData(){const q=(state.blQ||'').toLowerCase().trim(),k=state.blK||'all',s=state.blS||'all',so=state.blO||'top';
  if(s!=='meta')loadShared();
  let L=allBuilds().filter(b=>(s==='all'||(s==='meta'&&b.src==='meta')||(s==='players'&&b.src==='player'))&&(!q||(b.item+' '+bFits(b).join(' ')+' '+b.name+' '+(b.role||'')+' '+(b.author||'')).toLowerCase().includes(q)));
  L=L.map(bCard).filter(c=>k==='all'||c.kind===k);
  if(so==='top')L.sort((a,b)=>(b.src==='player')-(a.src==='player')||b.score-a.score||a.item.localeCompare(b.item));
  else if(so==='new')L.sort((a,b)=>b.at-a.at||a.item.localeCompare(b.item));
  else if(so==='own')L.sort((a,b)=>(+famOwned(b.item)-+famOwned(a.item))||(b.have/(b.total||1))-(a.have/(a.total||1))||a.item.localeCompare(b.item));
  else if(so==='ready')L.sort((a,b)=>(b.have/(b.total||1))-(a.have/(a.total||1))||a.item.localeCompare(b.item));
  else L.sort((a,b)=>a.item.localeCompare(b.item)||a.name.localeCompare(b.name));
  rv('blO',L);
  const sel=state.blSel?buildById(state.blSel):null;
  return {q:state.blQ||'',kind:k,src:s,sort:so,total:L.length,list:L.slice(0,state.blN||60),more:L.length>(state.blN||60),
    shared:{loading:SB.loading,err:SB.err,count:(SB.list||[]).length,online:!!FB&&HOSTED},signedIn:!!SO.uid,sel:sel?bDetail(sel):null}}
/* build goals: a snapshot of a build you're working towards; Goals lists the parts you're missing and where they drop */
function bGoalsData(){return (P.bg||[]).map(g=>{const h=bHave(g);const parts=bParts(g).map(([k,n])=>modSlot(k==='arc'?'Arcane':k==='aura'?'Aura':k==='exilus'?'Exilus':'Mod',n,k==='arc'));
  return {id:g.id,from:g.from,item:g.item,img:IMG(g.item),name:g.name,have:h.have,total:h.total,missing:parts.filter(p=>!p.done&&!(p.slot==='Arcane'&&(+((P.arc||{})[p.m])||0)>0))}})}
const _goalsData=goalsData;goalsData=function(){return {..._goalsData(),bgoals:bGoalsData()}};
/* my builds editor: options per item category */
const BOPT={};
function buildOptions(c){if(BOPT[c])return BOPT[c];const mt=BMODTY[c]||[],at=BARCTY[c]||[];
  return BOPT[c]={mods:Object.keys(MODS).filter(n=>!mt.length||mt.includes(MODS[n].ty)).sort(),arcanes:Object.keys(ARC).filter(n=>at.includes(ARC[n].ty)).sort(),slots:BSLOTS(c)}}
let BITEMS=null;
const buildItems=()=>BITEMS||(BITEMS=Object.keys(I).filter(n=>BKIND(I[n].c)!=='Other'||BMODTY[I[n].c]).sort());
function myBuildsData(){const ed=state.mbEdit;return {list:(P.myb||[]).map(b=>({...bCard({...b,id:'mine:'+b.id,src:'mine'}),pub:b.pub||'',updated:b.at||0})).reverse(),
  items:buildItems(),edit:ed?{...ed,cat:I[ed.item]?I[ed.item].c:'',opts:I[ed.item]?buildOptions(I[ed.item].c):null}:null,signedIn:!!SO.uid,online:!!FB&&HOSTED}}
const cleanB=d=>{const s=(v,n)=>String(v||'').trim().slice(0,n);const c=I[d.item]?I[d.item].c:'';const sl=BSLOTS(c);
  return {item:s(d.item,60),name:s(d.name,60)||'My build',role:s(d.role,60),aura:sl.aura?s(d.aura,60):'',exilus:sl.exilus?s(d.exilus,60):'',mods:(d.mods||[]).map(m=>s(m,60)).filter(Boolean).slice(0,10),
    arcanes:(d.arcanes||[]).map(m=>s(m,60)).filter(Boolean).slice(0,sl.arcanes),helminth:sl.helminth?s(d.helminth,60):'',notes:s(d.notes,600)}};
const pubDoc=b=>({...cleanB(b),uid:SO.uid,author:myName(),at:Date.now()});
function voteTx(doc,v){const ref=FB.fs.collection('builds').doc(doc),vref=ref.collection('votes').doc(SO.uid);
  return FB.fs.runTransaction(async tx=>{const s=await tx.get(ref),vs=await tx.get(vref);if(!s.exists)throw new Error('gone');const b=s.data(),old=vs.exists?vs.data().v:0;if(old===v)return b;
    const up=(b.up||0)+(v===1)-(old===1),down=(b.down||0)+(v===-1)-(old===-1);if(v)tx.set(vref,{v});else tx.delete(vref);tx.update(ref,{up,down,score:up-down});return {...b,up,down,score:up-down}})}
Object.assign(window.TF,{
  buildLib:()=>buildLibData(),
  buildLibSet:o=>{const m={q:'blQ',kind:'blK',src:'blS',sort:'blO'};for(const k in m)if(o[k]!=null){state[m[k]]=o[k];state.blN=60}if('sel' in o){state.blSel=o.sel;window.scrollTo(0,0)}if(o.more)state.blN=(state.blN||60)+60;tfNotify()},
  buildLibReload:()=>loadShared(true),
  buildGoal:id=>{const b=buildById(id);if(!b)return;P.bg=P.bg||[];const i=P.bg.findIndex(g=>g.from===id);
    if(i>=0){const g=P.bg.splice(i,1)[0];saveProfile();tfNotify();toastAction('Removed the '+g.name+' goal','Undo',()=>{P.bg.splice(i,0,g);saveProfile();tfNotify()});return}
    const g={id:'bg'+Date.now().toString(36),from:id,item:b.item,name:b.item+': '+b.name,aura:b.aura||'',exilus:b.exilus||'',mods:[...b.mods],arcanes:[...(b.arcanes||[])],at:Date.now()};P.bg.push(g);
    const addItem=I[b.item]&&!ownedItem(b.item)&&!(P.goals||[]).includes(b.item);if(addItem){P.goals=P.goals||[];P.goals.push(b.item)}
    saveProfile();tfNotify();toastAction('Saved as a goal'+(addItem?' (and '+b.item+' added to Goals)':'')+'. Goals shows the mods you still need.','Open Goals',()=>{location.hash='goals'})},
  buildGoalRemove:id=>{const i=(P.bg||[]).findIndex(g=>g.id===id);if(i<0)return;const g=P.bg.splice(i,1)[0];saveProfile();tfNotify();toastAction('Removed the '+g.name+' goal','Undo',()=>{P.bg.splice(i,0,g);saveProfile();tfNotify()})},
  buildCopy:id=>{const b=buildById(id);if(!b)return;const c=cleanB(b);state.mbEdit={...c,name:(b.src==='player'&&b.author?b.author+"'s ":'')+c.name,mods:[...c.mods,...Array(Math.max(0,8-c.mods.length)).fill('')]};state.aTab='mine';state.blSel=null;saveUI();
    if(location.hash!=='#arsenal')location.hash='arsenal';tfNotify();window.scrollTo(0,0)},
  buildVote:async(id,v)=>{const b=buildById(id);if(!b||b.src!=='player')return;if(!SO.uid){toast('Sign in to vote');return}P.bv=P.bv||{};const cur=P.bv[b.doc]||0;const nv=cur===v?0:v;
    try{const r=await voteTx(b.doc,nv);Object.assign(b,{up:r.up,down:r.down,score:r.score});if(nv)P.bv[b.doc]=nv;else delete P.bv[b.doc];saveProfile();tfNotify()}catch(e){toast("Couldn't save your vote. Try again.")}},
  myBuilds:()=>myBuildsData(),
  myBuildEdit:o=>{if(o===null)state.mbEdit=null;else if(o&&o.id&&!o.mods){const b=(P.myb||[]).find(x=>x.id===o.id);if(b)state.mbEdit={...b,mods:[...b.mods,...Array(Math.max(0,8-b.mods.length)).fill('')]}}else state.mbEdit={item:'',name:'',role:'',aura:'',exilus:'',mods:Array(8).fill(''),arcanes:['',''],helminth:'',notes:'',...(o||{})};tfNotify()},
  myBuildSave:d=>{if(!I[d.item]){toast('Pick a Warframe, weapon or companion first');return false}P.myb=P.myb||[];const c=cleanB(d);let b=d.id&&P.myb.find(x=>x.id===d.id);
    if(b)Object.assign(b,c,{at:Date.now()});else{b={id:'b'+Date.now().toString(36),...c,at:Date.now()};P.myb.push(b)}state.mbEdit=null;saveProfile();tfNotify();
    if(b.pub&&SO.uid)FB.fs.collection('builds').doc(b.pub).update({...cleanB(b),author:myName()}).then(()=>{SB.at=0}).catch(()=>toast("Saved here, but couldn't update the shared copy."));toast('Build saved');return true},
  myBuildDel:id=>{const i=(P.myb||[]).findIndex(x=>x.id===id);if(i<0)return;const b=P.myb.splice(i,1)[0];saveProfile();tfNotify();
    toastAction('Deleted '+b.name+(b.pub?'. The shared copy stays until you unshare it.':''),'Undo',()=>{P.myb.splice(i,0,b);saveProfile();tfNotify()})},
  myBuildPublish:async id=>{const b=(P.myb||[]).find(x=>x.id===id);if(!b)return;if(!SO.uid){toast('Sign in to share builds');return}if(!b.mods.length){toast('Add some mods before sharing');return}
    try{const r=await FB.fs.collection('builds').add({...pubDoc(b),up:0,down:0,score:0});b.pub=r.id;saveProfile();SB.at=0;loadShared(true);toast('Shared. Other players can now vote on it and copy it.')}catch(e){toast("Couldn't share it. Try again in a moment.")}tfNotify()},
  myBuildUnpublish:async id=>{const b=(P.myb||[]).find(x=>x.id===id);if(!b||!b.pub)return;try{await FB.fs.collection('builds').doc(b.pub).delete();SB.list=(SB.list||[]).filter(x=>x.doc!==b.pub);delete b.pub;saveProfile();toast('No longer shared')}catch(e){toast("Couldn't unshare it. Try again.")}tfNotify()},
  sharedDelete:async doc=>{try{await FB.fs.collection('builds').doc(doc).delete();SB.list=(SB.list||[]).filter(x=>x.doc!==doc);(P.myb||[]).forEach(b=>{if(b.pub===doc)delete b.pub});saveProfile();state.blSel=null;toast('Removed')}catch(e){toast("Couldn't remove it.")}tfNotify()}
});
/* ---------- bridge: switching section from the bottom tabs starts that section fresh ---------- */
Object.assign(window.TF,{
  resetView:()=>{state.farmSel=null;state.resSel=null;state.blSel=null;state.gSel=null;state.chat=null;state.newGroup=false;state.qFocus=null;state.qs=false;
    document.querySelectorAll('.dlgbk').forEach(d=>d.remove());if(typeof setMenu==='function')try{setMenu(false)}catch(e){}
    saveUI();tfNotify()}
});
/* ---------- farm finder: "ways to farm" things that aren't one item drop (credits, standing, Endo, affinity, Focus, Forma...) ---------- */
const WAYS=D.ways||[];const WBN=Object.fromEntries(WAYS.map(w=>[w.n,w]));
LAZY.ways={done:WAYS.length>0,busy:false,err:false,add:j=>{WAYS.push(...j);Object.assign(WBN,Object.fromEntries(j.map(w=>[w.n,w])))}};
FFT.splice(1,0,['way','Credits, standing & more']);
const _buildIdx=buildIdx;buildIdx=function(){_buildIdx();for(const w of WAYS)IDX.push([w.n,'way',w.cat,w.cat])};
const wayText=w=>[w.n,...(w.aka||[])].join(' ').toLowerCase();
const _search=search;search=function(q,ty,cat){const r=_search(q,ty,cat);const ql=(q||'').toLowerCase().trim();if(!ql||(ty&&ty!=='all'&&ty!=='way'))return r;
  const w=ql.split(/\s+/);const have=new Set(r.filter(x=>x[1]==='way').map(x=>x[0]));
  const extra=WAYS.filter(x=>!have.has(x.n)&&(!cat||x.cat===cat)&&w.every(t=>wayText(x).includes(t))).map(x=>[x.n,'way',x.cat,x.cat]);
  return [...r.filter(x=>x[1]==='way'),...extra,...r.filter(x=>x[1]!=='way')]};
const _detail=detail;detail=function(sel){return sel.startsWith('way|')?'':_detail(sel)};
/* Platinum: things that are easy to farm and sell well on warframe.market, ranked by platinum you can expect per attempt
   (price × chance from one relic opening or one mission run). Only things that actually sell: 10+ sold last week, 8p or more. */
const PF_CH={C:.2533,U:.11,R:.02};const PF_RL={C:'Common',U:'Uncommon',R:'Rare'};
function platFarms(){const sells=n=>{const p=PR[n];const v=p&&(p.a7??p.a30);return MS[n]&&v>=8&&(p.v7||0)>=10?{price:Math.round(v),sold:p.v7||0}:null};
  const row=(n,kind,how,chance,img)=>{const s=sells(n);return s?{n,kind,how,chance:Math.round(chance*1000)/10,price:s.price,sold:s.sold,per:Math.round(s.price*chance*10)/10,img:img||'',key:''}:null};
  const parts=[];for(const [n,rels] of Object.entries(D.partrel||{})){let best=null;
    for(const [r,rar] of rels){const R=REL[r];if(!R||R.v||!(R.loc&&R.loc.length))continue;const c=PF_CH[rar]||0;if(!best||c>best.c)best={r,rar,c,where:String(R.loc[0][0]).trim()}}
    if(best){const x=row(n,'Prime part',`${best.r} relic (${PF_RL[best.rar]||best.rar}). Relic from ${best.where}`,best.c,IMG(typeof partOwner==='function'?(partOwner(n)||n):n));if(x){x.key='part|'+n;parts.push(x)}}}
  /* drops are random (chance under 100%); a 100% "drop" is a syndicate or vendor offering bought with standing */
  const drops=[],offers=[];
  for(const [src,kind,pre] of [[MODS,'Mod','mod'],[ARC,'Arcane','arc']])for(const [n,m] of Object.entries(src)){
    const dr=(m.dr||[]).map(d=>[String(d[0]).replace(/\s+/g,' ').trim(),d[1]]);const rnd=dr.filter(d=>d[1]<100).sort((a,b)=>b[1]-a[1])[0],off=dr.find(d=>d[1]>=100);
    if(rnd){const x=row(n,kind,rnd[0],rnd[1]/100);if(x){x.key=pre+'|'+n;drops.push(x)}}
    else if(off){const x=row(n,kind,'From '+off[0].replace(new RegExp(',\\s*'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'),''),1);if(x){x.key=pre+'|'+n;offers.push(x)}}}
  const by=a=>a.sort((x,y)=>y.per-x.per||y.sold-x.sold).slice(0,6);
  return {date:D.meta.prices||'',groups:[{t:'Prime parts from relics you can farm now',per:'per relic opened',items:by(parts)},
    {t:'Mod and arcane drops',per:'per run',items:by(drops)},
    {t:'Buy with syndicate or vendor standing, sell for platinum',per:'each',items:offers.sort((x,y)=>y.price*Math.min(y.sold,100)-x.price*Math.min(x.sold,100)).slice(0,6)}].filter(g=>g.items.length)}}
function wayData(n){const w=WBN[n];if(!w)return null;
  return {n:w.n,cat:w.cat,sum:w.sum||'',w:w.w||'',tips:w.tips||[],hasTask:(P.tasks||[]).some(t=>!t.d&&t.k==='way'&&t.r===w.n),
    ways:(w.ways||[]).map(x=>({t:x.t,how:x.how||'',why:x.why||'',req:x.req||'',tags:x.tags||[],node:x.node||'',planet:x.planet||''})),plat:w.n==='Platinum'?platFarms():null}}
const _farmData=farmData;farmData=function(){lazyLoad('ways');const d=_farmData();d.waysLoading=lazyLoading('ways');const s=d.sel||'';
  if(s.startsWith('way|')){d.way=wayData(s.slice(4));d.detail=d.way?'way':''}else d.way=null;
  d.items.forEach(it=>{if(it.t==='way')it.img=''});return d};
TF.farm=()=>farmData();
/* main search: ways sit right after guides */
const _cmdIndex2=cmdIndex;cmdIndex=function(){if(CMDX)return CMDX;const x=_cmdIndex2();for(const w of WAYS)x.push({n:w.n,g:'Farming',act:'way|'+w.n,l:w.n.toLowerCase(),a:[...(w.aka||[]),'farm',w.cat].join(' ').toLowerCase()});return CMDX=x};
CMDG.splice(1,0,'Farming');
Object.assign(window.TF,{wayTask:n=>{const w=WBN[n];if(!w)return;if(addTask('way',w.n,'Farm '+w.n))toast('Added to your tasks');tfNotify()}});
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
/* ---------- account ID helper ---------- */
/* There's no public way to look an ID up from an in-game name. When you're logged in, warframe.com keeps your
   account details (including user_id) in its "user-info" cookie, so a one-line script run on warframe.com can read
   it and send you back here with the ID. The script only reads that cookie and changes nothing. */
const ID_HOME=(location.origin&&/^https?:/.test(location.origin)?location.origin:'https://tennoform.com')+'/';
const ID_CODE=`(()=>{const m=document.cookie.match(/(?:^|; )user-info=([^;]*)/);let id='';try{id=JSON.parse(decodeURIComponent(m[1])).user_id}catch(e){}if(!/^[0-9a-f]{24}$/.test(id))return alert('Log in to warframe.com first (top right), then run this again.');location.href='${ID_HOME}#wfid='+id})()`;
const ID_MARK='javascript:'+encodeURIComponent(ID_CODE);
function idHelpHTML(){const pend=state.idPending;const phone=!!(window.matchMedia&&matchMedia('(pointer: coarse)').matches);const phN=phone?2:3,pcN=phone?3:2;
  return `${pend?`<div class="callout stack" id="idpend" role="status"><b>Link this account?</b><span class="small">warframe.com sent account ID <span class="mono">${esc(pend)}</span>. Linking reads its public profile into Tennoform (you can undo it).</span><div class="row"><button type="button" class="btn primary" id="idpendok">Link this account</button><button type="button" class="btn" id="idpendno">Not my account</button></div></div>`:''}
  <div class="steps-v idhelp">
   <div class="sv"><span class="svn">1</span><div><b>Log in at warframe.com</b><div class="small muted">Use the account you play on, on any platform. Stay on warframe.com for the next step. <a class="ln" href="#" data-go="guide|find-account-id">Step-by-step guide</a></div>
    <a class="btn" href="https://www.warframe.com/en/login" target="_blank" rel="noopener">Open warframe.com</a></div></div>
${phone?`   <div class="sv"><span class="svn">${phN}</span><div><b>On a phone: use a bookmark</b><div class="small muted">Phone browsers have no console, so a bookmark does the same job.</div>
    <ol class="small stack" style="margin:4px 0 0;padding-left:20px;list-style:decimal">
     <li>Tap <b>Copy the bookmark</b> below.</li>
     <li>Bookmark this page (Chrome: ⋮ then ☆; Safari: Share then Add Bookmark), then edit that bookmark: name it <b>Tennoform ID</b> and replace its address with what you copied.</li>
     <li>Open warframe.com and log in. <b>Android (Chrome):</b> type <b>Tennoform ID</b> in the address bar and tap the bookmark in the list. <b>iPhone (Safari):</b> open Bookmarks and tap <b>Tennoform ID</b>.</li>
    </ol>
    <div class="row"><button type="button" class="btn" id="idmarkcopy">Copy the bookmark</button></div></div></div>
`:''}   <div class="sv"><span class="svn">${pcN}</span><div><b>On a computer: run one line in the console</b><div class="small muted">Copy the line, then on warframe.com press <span class="mono">F12</span> (Mac: <span class="mono">Cmd+Option+J</span>), open the <b>Console</b> tab, paste it and press Enter. You land back here with your ID ready to link.</div>
    <div class="row"><button type="button" class="btn primary" id="idcode">Copy the console line</button></div>
    <div class="small muted">Or copy it from the cookies yourself: <b>iPhone</b> with a Safari web inspector extension (Resources tab), <b>Android</b> with the Mimir app by MST Sage (Applications tab), or a <b>computer</b> with F12 (Application tab). Open Cookies for warframe.com, find <b>user-info</b> and copy the 24 characters after <span class="mono">"user_id":"</span>. Only copy that: other warframe.com cookies can keep you logged in, so never share them. <a class="ln" href="#" data-go="guide|find-account-id">Steps for each device</a></div>
    <details class="small"><summary>See the line</summary><pre class="mono" style="white-space:pre-wrap;word-break:break-all;margin:6px 0 0">${esc(ID_CODE)}</pre></details>
    <div class="small muted">Chrome or Edge may say pasting is blocked: type <span class="mono">allow pasting</span>, press Enter, then paste again. The line only reads your account ID from warframe.com and changes nothing.</div>
    <div class="small muted">Prefer one click? Drag this button to your bookmarks bar, then click it while on warframe.com: <a class="btn sm" id="idmark" href="${esc(ID_MARK)}" draggable="true">Tennoform ID</a></div></div></div>
${phone?'':`   <div class="sv"><span class="svn">${phN}</span><div><b>On a phone: use a bookmark</b><div class="small muted">Phone browsers have no console, so a bookmark does the same job.</div>
    <ol class="small stack" style="margin:4px 0 0;padding-left:20px;list-style:decimal">
     <li>Tap <b>Copy the bookmark</b> below.</li>
     <li>Bookmark this page (Chrome: ⋮ then ☆; Safari: Share then Add Bookmark), then edit that bookmark: name it <b>Tennoform ID</b> and replace its address with what you copied.</li>
     <li>Open warframe.com and log in. <b>Android (Chrome):</b> type <b>Tennoform ID</b> in the address bar and tap the bookmark in the list. <b>iPhone (Safari):</b> open Bookmarks and tap <b>Tennoform ID</b>.</li>
    </ol>
    <div class="row"><button type="button" class="btn" id="idmarkcopy">Copy the bookmark</button></div></div></div>
`}   <div class="sv"><span class="svn">4</span><div><b>Already have your ID?</b><div class="small muted">Paste it, or anything containing it. Tennoform picks out the 24-character ID.</div>
    <div class="row"><button type="button" class="btn" id="idpaste">Paste and link</button></div>
    <input id="wfid" type="text" placeholder="…or paste it here yourself" value="${esc(P.wfid||'')}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Paste your account ID"></div></div>
  </div>`}
/* coming back from warframe.com with #wfid=<id>: ask before linking, so a shared link can't change your account by itself */
function idFromHash(){const m=/^#wfid=([0-9a-f]{24})$/i.exec(location.hash);if(!m)return false;
  state.idPending=m[1].toLowerCase();state.tTab='account';history.replaceState(null,'',location.pathname+location.search+'#tenno');
  if(typeof render==='function')render();tfNotify();setTimeout(()=>{const c=$('#idpend');if(c)c.scrollIntoView({block:'center'})},300);return true}
window.addEventListener('hashchange',idFromHash);setTimeout(idFromHash,0);
/* why a pasted text has no ID: the usual mix-ups are other long codes that aren't the Warframe account ID */
function idMiss(txt){const t=String(txt||'').trim();const hex=(t.match(/[0-9a-f]{20,}/i)||[''])[0];
  if(hex&&hex.length!==24)return `That code is ${hex.length} characters long; a Warframe account ID is always 24 (0–9 and a–f). It's probably ${hex.length===32?'the _gsid cookie (a Google Analytics ID) or the game-log folder code':'a different ID'}, not your Warframe one. In warframe.com's cookies, copy the user_id inside user-info instead. Use the warframe.com steps above to get the right one; they work for PS5, Xbox, Switch and PC accounts.`;
  return t?"No account ID in what you pasted. Use the warframe.com steps above to get it; they work for every platform.":''}
function idFromText(txt,how){try{if(/%22|%3A/i.test(txt))txt=decodeURIComponent(txt)}catch(e){}const l=logLogin(txt);const id=l?l.id:findId(txt);if(id){setWfid(id,how,l&&l.name);return true}return false}
async function idPaste(){let txt='';
  try{txt=await navigator.clipboard.readText()}catch(e){}
  if(txt&&idFromText(txt))return;
  const f=$('#wfid');if(f){f.focus();f.select&&f.select()}
  toast(txt?idMiss(txt):"Press and hold the box, then tap Paste.")}
document.addEventListener('click',e=>{const t=e.target.closest('#idpaste,#idcode,#idmark,#idmarkcopy,#idpendok,#idpendno');if(!t)return;e.preventDefault();
  if(t.id==='idpaste')idPaste();
  else if(t.id==='idcode')copy(ID_CODE,'Copied. Paste it into the console on warframe.com.');
  else if(t.id==='idmarkcopy')copy(ID_MARK,'Copied. Paste it as the bookmark\'s address.');
  else if(t.id==='idmark')toast('Drag this button to your bookmarks bar, then click it on warframe.com.');
  else if(t.id==='idpendok'){const id=state.idPending;state.idPending='';if(id)setWfid(id,'warframe.com')}
  else{state.idPending='';render();toast('Not linked.')}});
/* pasting the copied page anywhere on the Account tab works too */
document.addEventListener('paste',e=>{if(!$('#idpaste')||/^[0-9a-f]{24}$/i.test(P.wfid||''))return;const tg=e.target;if(tg&&tg.matches&&tg.matches('input,textarea')&&tg.id!=='wfid')return;
  const txt=(e.clipboardData||window.clipboardData).getData('text');if(!txt)return;if(idFromText(txt))e.preventDefault();else if(tg&&tg.id==='wfid'&&/[0-9a-f]{20,}/i.test(txt))toast(idMiss(txt))});
/* EE.log: only trust the game's own login line, "Logged in <name> (<id>)". Other IDs in the log belong to squadmates, clans or sessions. */
function logLogin(txt){const re=/Logged in (.+?) \(([0-9a-f]{24})\)/gi;let m,last=null;while((m=re.exec(String(txt||''))))last={name:m[1].trim(),id:m[2].toLowerCase()};return last}
{const _fi=findId;findId=function(text){try{if(/%22|%3A/i.test(text))text=decodeURIComponent(text)}catch(e){}const l=logLogin(text);return l?l.id:_fi(text)}}
/* Files from the PC: WFHelper's codex-profile.json (account ID), an inventory.json (WFHelper or warframe-api-helper), or an old EE.log.
   Current game logs only say "Logging in as <name>" and carry no ID, so a log is a last resort. */
const accountIdIn=txt=>{const m=/"accountId"\s*:\s*"([0-9a-f]{24})"/i.exec(txt)||/"AccountOwnerId"\s*:\s*\{\s*"\$oid"\s*:\s*"([0-9a-f]{24})"/i.exec(txt);return m?m[1].toLowerCase():null};
async function readAccountFile(f){let txt;try{txt=await f.text()}catch(e){toast(`Couldn't read ${f.name}. Try choosing it again.`);return}
  const name=f.name||'that file';
  if(/^\s*[{[]/.test(txt)&&typeof invParse==='function'&&invParse(txt)){
    const id=accountIdIn(txt);if(id&&id!==P.wfid){P.wfid=id;lsSet('tenno-acct',id);saveProfile()}
    const r=await TF.importInventory(txt);toast(r.msg);if(typeof render==='function')render();tfNotify();return}
  const id=accountIdIn(txt);if(id){setWfid(id,name);return}
  const l=logLogin(txt);if(l){setWfid(l.id,'EE.log',l.name);return}
  const asName=/Logged in ([^\s(]+)\s*$/im.exec(txt)||/Logging in as (\S+)/i.exec(txt);
  toast(asName?`Found ${asName[1]} in ${name}, but Warframe's log no longer includes the account ID. Use the warframe.com steps above, or WFHelper's codex-profile.json.`
    :/\.log$/i.test(name)?`No account ID in ${name}. Use the warframe.com steps above, or WFHelper's codex-profile.json.`
    :`${name} isn't codex-profile.json or inventory.json. In WFHelper's folder (%appdata%\\WFHelper) pick codex-profile.json, or inventory.json from api-helper.`)}
readLog=readAccountFile;
document.addEventListener('change',e=>{const t=e.target;if(t&&t.id==='wfhfile'&&t.files&&t.files.length){[...t.files].reduce((p,f)=>p.then(()=>readAccountFile(f)),Promise.resolve()).then(()=>{t.value=''})}});
/* Each platform keeps its own profile unless cross-save is on. warframestat (one-tap sync) only reads the PC server,
   so other platforms use the copy-and-paste steps, pointed at that platform's own Warframe server. */
const WF_PLATS=[['pc','PC or cross-save','api',true],['ps','PlayStation','api-ps4',false],['xb','Xbox','api-xb1',false],['sw','Switch','api-swi',false],['ios','iPhone / iPad','api-mob',false],['and','Android','api-and',false]];
function wfPlat(){const p=WF_PLATS.find(x=>x[0]===P.wfPlat)||WF_PLATS[0];return {id:p[0],label:p[1],host:p[2],auto:p[3]||!!window.TENNO_PROXY}}
function platPickHTML(){const cur=wfPlat();
  return `<div class="stack" style="gap:6px"><span class="small"><b>Where do you play?</b> <span class="muted">With cross-save on, pick PC: your progress lives there. Synced progress looks wrong or like an old account? That's usually the PC profile being read for a console or mobile account: pick your platform, then use Reset sync to clear what came in.</span></span>
  <div class="row" role="radiogroup" aria-label="Where you play" style="gap:6px">${WF_PLATS.map(([id,l])=>`<button type="button" class="btn sm${cur.id===id?' primary':''}" role="radio" aria-checked="${cur.id===id}" data-wfplat="${id}">${esc(l)}</button>`).join('')}</div>
  ${cur.auto?'':`<div class="callout small" role="status">One-tap sync can only reach PC and cross-save accounts until a profile relay is set up. For ${esc(cur.label)}, use the two quick steps below: they open your profile on Warframe's ${esc(cur.label)} server.</div>`}</div>`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-wfplat]');if(!t)return;e.preventDefault();P.wfPlat=t.dataset.wfplat==='pc'?'':t.dataset.wfplat;saveProfile();render();tfNotify()});
/* one-tap sync on a non-PC platform would read the wrong profile: send people to the steps instead */
{const _as2=autoSync;autoSync=async function(quiet){if(!wfPlat().auto){if(!quiet){state.tTab='account';state.syncFail=false;saveUI();if(location.hash!=='#tenno')location.hash='tenno';else render();
    toast(`${wfPlat().label} profiles sync with the two quick steps on this page.`);setTimeout(()=>{const b=$('#syncsteps');if(b)b.scrollIntoView({block:'center'})},60)}return false}
  return _as2.apply(this,arguments)}}
/* ---------- ownership, separate from mastery ---------- */
/* Warframe keeps mastery forever, even after you sell or release something, so "mastered" doesn't mean "owned".
   Players can mark anything as not owned; that only changes ownership (filters, Owned labels), never mastery. */
{const _oi=ownedItem;ownedItem=function(n){return on('nown|'+n)?false:_oi(n)}}
const SYND_GEAR=[['Secura','Perrin Sequence'],['Sancti','New Loka'],['Rakta','Red Veil'],['Vaykor','Steel Meridian'],['Telos','Arbiters of Hexis'],['Synoid','Cephalon Suda']];
function howToGet(n){const it=I[n]||{};const wiki=it.w||('https://wiki.warframe.com/w/'+encodeURIComponent(n.replace(/ /g,'_')));
  const craft=(it.parts||[]).length>0;let t='';
  if(/ Kubrow$/.test(n))t='Hatch a Kubrow Egg in your Orbiter\'s Incubator (the Howl of the Kubrow quest unlocks it). Eggs drop from Kubrow Dens on Earth. The breed is random; to get this one for sure, hatch it from a '+n.replace(' Kubrow','')+' Genetic Imprint.';
  else if(/^(Adarza|Smeeta) Kavat$/.test(n))t='Collect Kavat Genetic Codes from Feral Kavats in Orokin Derelict missions, build the Kavat Incubator Upgrade Segment, then hatch a Kavat in the Incubator. The breed is random unless you use a Genetic Imprint.';
  else if(/(Predasite|Vulpaphyla)$/.test(n))t='Comes from Son in the Necralisk on Deimos. The wiki has the full steps.';
  else if(/^Prisma /.test(n))t='Sold by Baro Ki\'Teer for ducats and credits when he visits, or trade another player for it.';
  else if(/^Mk1-/.test(n))t='Buy it from the Market in your Orbiter for credits.';
  else if(/^Dex /.test(n))t='An anniversary login reward. If you missed it, it comes back in later anniversary reward picks.';
  else if(/^(Excalibur Prime|Skana Prime|Lato Prime)$/.test(n))t='Founders pack exclusive. It can\'t be obtained any more.';
  else if(it.c==='K-Drive')t='Build K-Drive parts bought from the Ventkids in Fortuna (Orb Vallis).';
  else if(it.c==='Kitgun')t='A Kitgun chamber, bought from Rude Zuud in Fortuna or Father in the Necralisk.';
  else{const s=SYND_GEAR.find(([p])=>n.startsWith(p+' '));if(s)t=`Bought from ${s[1]} with standing, once you reach their top rank.`;
    else if(/ (Vandal|Wraith)$/.test(n))t='Usually an Invasion or event reward. Check Invasions on Today, or trade another player for it.';
    else if(craft)t='Craft it in the Foundry. Open it to see where the blueprint and each part come from.';
    else t='The wiki has how to get this one.'}
  return {text:t,craft,wiki}}
Object.assign(window.TF,{
  setOwned:(n,own,quiet)=>{setK('nown|'+n,!own);if(own&&!ownedItem(n))setK('build|'+n,true);tfNotify();if(!quiet)toast(own?`${n} marked as owned`:`${n} marked as not owned. Its mastery stays.`)},
  howToGet:n=>howToGet(n)});
/* "Not mastered" / "Clear rank": back to rank 0, with its own Undo (rank decreases don't go through the activity log) */
Object.assign(window.TF,{clearRank:n=>{const was=rankOf(n);if(!was)return;LOGMUTE++;try{setRank(n,0)}finally{LOGMUTE--}clearTimeout(RKT);tfNotify();
  toastAction(was>=maxRank(I[n])?`${n} marked not mastered`:`${n} rank cleared (was ${was})`,'Undo',()=>{LOGMUTE++;try{setRank(n,was)}finally{LOGMUTE--}tfNotify();toast(`${n} back to rank ${was}`)})}});
/* ---------- Market: mods and arcanes, with the rank each cheapest listing is sold at ---------- */
function marketModsData(){const q=(state.mmQ||'').toLowerCase().trim(),kind=state.mmK||'all',sort=state.mmS||'v7',lim=state.mmLim||60;
  const all=[...Object.keys(MODS).map(n=>[n,'Mod']),...Object.keys(ARC).map(n=>[n,'Arcane'])].filter(([n])=>MS[n]&&(PR[n]||SEL[n]));
  const rows=all.filter(([n,k])=>(kind==='all'||kind===k)&&(!q||n.toLowerCase().includes(q))).map(([n,k])=>{const p=PR[n]||{};const b=(SEL[n]||[]).filter(x=>x[0]!=='__buy')[0]||null;
    const md=k==='Mod'?MODS[n]:ARC[n];const rar={C:'Common',U:'Uncommon',R:'Rare',L:'Legendary'}[md&&md.r]||'';
    return {n,kind:k,type:k==='Mod'?(md.ty||'Mod'):'Arcane',rar,a7:p.a7??p.a30??null,v7:p.v7||0,low:b?b[1]:null,
      seller:b?{name:b[0],price:b[1],rank:b[5]??null,wh:whisper(n,b)}:null,url:'https://warframe.market/items/'+MS[n]}});
  rows.sort((a,b)=>sort==='n'?a.n.localeCompare(b.n):sort==='low'?((a.low??1e9)-(b.low??1e9)):sort==='a7'?((b.a7??-1)-(a.a7??-1)):(b.v7-a.v7)||a.n.localeCompare(b.n));rv('mmS',rows);
  return {q:state.mmQ||'',kind,sort,total:all.length,count:rows.length,more:Math.max(0,rows.length-lim),rows:rows.slice(0,lim).map(r=>({...r,a7:r.a7!=null?Math.round(r.a7):null}))}}
Object.assign(window.TF,{marketMods:()=>marketModsData(),
  marketModsSet:o=>{if(o.q!=null){state.mmQ=o.q;state.mmLim=60}if(o.kind!=null){state.mmK=o.kind;state.mmLim=60}if(o.sort!=null)state.mmS=o.sort;if(o.more)state.mmLim=(state.mmLim||60)+60;saveUI();tfNotify()}});
/* ---------- Reset sync: make Tennoform match the Warframe profile, choosing item by item ---------- */
/* A normal sync only adds and raises. A reset also lists what Tennoform has that the profile doesn't
   (ranks entered by hand, ticked nodes and quests), so players pick what goes and what stays. */
let RESET=false,RESET_T=0,RESET_P=null;
function progSnap(){const rk={};for(const it of MI){const r=rankOf(it.n);if(r)rk[it.n]=r}
  const ids=k=>new Set(ALLN.filter(x=>on(k+x.id)).map(x=>x.id));
  return {rk,n:ids('n|'),sp:ids('sp|'),q:new Set(Q.filter(q=>qDone(q.n)).map(q=>q.n))}}
/* what the profile alone says: import it into a blank account, read the result, then put everything back */
function profileOnly(txt){const sc=JSON.stringify(C),sp=JSON.stringify(P);const dr=docRef,pr=profRef;const f={ls:lsSet,sv:saveProfile,um:updateMR};let snap=null,msg='';
  const pre=lsGet('tf-presync',null);docRef=null;profRef=null;lsSet=function(){};saveProfile=function(){};updateMR=function(){};
  try{C={};P={rk:{},other:0,intr:0,mr:null,name:'',at:'',adj:0,wfid:'',prof:null,mc:{},inv:{},foundry:[]};LOGMUTE++;try{msg=importProfile0(txt)}finally{LOGMUTE--}snap=progSnap()}
  finally{C=JSON.parse(sc);P=JSON.parse(sp);docRef=dr;profRef=pr;lsSet=f.ls;saveProfile=f.sv;updateMR=f.um;lastMR=null;updateMR();
    try{if(pre)localStorage.setItem('tf-presync',JSON.stringify(pre));else localStorage.removeItem('tf-presync')}catch(e){}}
  return {msg,snap}}
function resetDiff(a,b){const out=[];const nn=id=>{const x=ALLN.find(y=>y.id===id);return x?`${x.n} (${x.p})`:id};
  for(const n of new Set([...Object.keys(a.rk),...Object.keys(b.rk)])){const x=a.rk[n]||0,y=b.rk[n]||0;if(x!==y)out.push({k:'rk|'+n,add:y>x,t:n,d:`rank ${x} → ${y}`,from:x,to:y})}
  for(const [set,kind,lab] of [['n','n|','Node'],['sp','sp|','Steel Path']])for(const id of new Set([...a[set],...b[set]])){const x=a[set].has(id),y=b[set].has(id);if(x!==y)out.push({k:kind+id,add:y,t:`${lab}: ${nn(id)}`,d:y?'completed':'not completed'})}
  for(const n of new Set([...a.q,...b.q])){const x=a.q.has(n),y=b.q.has(n);if(x!==y)out.push({k:'q|'+n,add:y,t:`Quest: ${n}`,d:y?'completed':'not completed'})}
  out.sort((p,q)=>p.t.localeCompare(q.t));return out}
function resetHTML(p){const rem=p.rows.filter(r=>!r.add),add=p.rows.filter(r=>r.add);
  const group=(title,hint,list,g)=>list.length?`<fieldset class="stack" style="gap:6px;border:0;padding:0;margin:0"><legend class="small"><b>${title} (${list.length})</b> <span class="muted">${hint}</span></legend>
    <div class="row small" style="gap:6px"><button type="button" class="btn sm" data-rsall="${g}">Select all</button><button type="button" class="btn sm" data-rsnone="${g}">Select none</button></div>
    <div class="stack" style="gap:2px;max-height:38vh;overflow:auto;padding-right:4px">${list.map(r=>`<label class="small row" style="gap:8px;align-items:center;min-height:32px"><input type="checkbox" data-rs="${esc(r.k)}" data-rsg="${g}" checked> <span style="flex:1">${esc(r.t)}</span><span class="muted num">${esc(r.d)}</span></label>`).join('')}</div></fieldset>`:'';
  const none=!p.rows.length;
  return `<div class="dlgbk" id="rsbk"><div class="dlg panel cut stack" role="dialog" aria-modal="true" aria-labelledby="rs-h" style="gap:12px;max-width:640px"><h2 id="rs-h" tabindex="-1">Reset sync</h2>
   ${none?`<p class="small" style="margin:0">${esc(/^(That|No |Make)/.test(p.msg||'')?p.msg:'Tennoform already matches this profile exactly. Nothing to reset.')}</p>`:`<p class="small muted" style="margin:0">Nothing has changed yet. Ticked lines are applied; untick anything you want to keep as it is now.</p>
   ${group('Removed or lowered','Tennoform has these, your Warframe profile doesn\'t.',rem,'rem')}
   ${group('Added or raised','From your Warframe profile.',add,'add')}
   <p class="small muted" style="margin:0">Goals, tasks, inventory, relics and builds aren't touched. You can undo this from Account &amp; sync.</p>`}
   <div class="row" style="justify-content:flex-end">${none?'':'<button type="button" class="btn primary" id="rsok">Apply selected</button>'}<button type="button" class="btn" id="rsno">${none?'Close':'Cancel'}</button></div></div></div>`}
function showReset(txt){const a=progSnap();const {msg,snap}=profileOnly(txt);RESET_P={txt,rows:snap?resetDiff(a,snap):[],msg,a};
  const el=$('#rsbk');if(el)el.remove();document.body.insertAdjacentHTML('beforeend',resetHTML(RESET_P));const h=$('#rs-h');if(h)h.focus()}
function closeReset(){const el=$('#rsbk');if(el)el.remove();RESET_P=null}
function applyReset(){const p=RESET_P;if(!p)return;const on1=new Set([...document.querySelectorAll('#rsbk [data-rs]:checked')].map(x=>x.dataset.rs));closeReset();
  const msg=_imp(p.txt);/* adds and raises everything (and saves the undo snapshot); then honour each choice */
  LOGMUTE++;try{for(const r of p.rows){const pick=on1.has(r.k);const target=r.add?(pick?null:'old'):(pick?'new':null);if(!target)continue;
      if(r.k.startsWith('rk|')){const n=r.k.slice(3),v=target==='new'?r.to:r.from;const it=I[n];if(!it)continue;const mx=maxRank(it);
        if(v>=mx){delete P.rk[n];if(!on('m|'+n))setK('m|'+n,1)}else{if(on('m|'+n))setK('m|'+n,0);if(v)P.rk[n]=v;else delete P.rk[n]}}
      else setK(r.k,target==='old'?!r.add:r.add)}}finally{LOGMUTE--}
  P.auto=new Date().toISOString();saveProfile();updateMR();render();tfNotify();
  const n=on1.size;toast(`Reset applied: ${n} change${n===1?'':'s'}. ${p.rows.length-n} kept as they were. Undo is in Account & sync.`)}
/* the next profile that comes in (one-tap or pasted) goes to the reset view instead of the normal preview */
{const _ip=importProfile;importProfile=function(txt){if(RESET&&Date.now()-RESET_T<15*60e3){RESET=false;DRY=false;showReset(txt);return 'Choose what to keep, then tap Apply.'}return _ip.apply(this,arguments)}}
function startReset(){RESET=true;RESET_T=Date.now();
  if(wfPlat().auto&&/^[0-9a-f]{24}$/i.test(P.wfid||'')){autoSync(false);return}
  state.tTab='account';saveUI();if(location.hash!=='#tenno')location.hash='tenno';else render();
  toast('Reset is ready: paste your profile data with the steps below, and you\'ll choose what to keep.');setTimeout(()=>{const b=$('#syncsteps');if(b)b.scrollIntoView({block:'center'})},80)}
document.addEventListener('click',e=>{const t=e.target.closest('#rsreset,#rsok,#rsno,#rsbk,[data-rsall],[data-rsnone]');if(!t)return;
  if(t.id==='rsreset'){e.preventDefault();startReset();return}
  if(t.id==='rsbk'&&e.target!==t)return;
  if(t.dataset.rsall||t.dataset.rsnone){const g=t.dataset.rsall||t.dataset.rsnone;document.querySelectorAll(`#rsbk [data-rsg="${g}"]`).forEach(x=>{x.checked=!!t.dataset.rsall});return}
  if(t.id==='rsok'){applyReset();return}
  closeReset()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#rsbk'))closeReset()});
Object.assign(window.TF,{resetSync:()=>startReset()});
/* ---------- My collection: everything you own and everything you've mastered, across every category ---------- */
/* Owned = ranked, mastered, built or ticked as owned, minus anything marked "Don't own it". Mastery comes from ranks. */
function collectionData(){const f=state.colF||'owned',q=(state.colQ||'').toLowerCase().trim();let owned=0,mast=0,level=0,total=0;
  const cats=CATS.map(c=>{const all=MI.filter(i=>i.c===c);if(!all.length)return null;let o=0,m=0,l=0;
    const items=all.map(i=>{const has=ownedItem(i.n),r=rankOf(i.n),mx=maxRank(i),done=r>=mx;if(has)o++;if(done)m++;if(has&&!done)l++;return {n:i.n,img:IMG(i.n),r,mx,has,done}})
      .filter(x=>(f==='owned'?x.has:f==='mastered'?x.done:f==='level'?x.has&&!x.done:true)&&(!q||x.n.toLowerCase().includes(q))).sort((a,b)=>a.n.localeCompare(b.n));
    owned+=o;mast+=m;level+=l;total+=all.length;return {id:c,label:CATL[c],owned:o,mastered:m,level:l,total:all.length,items}}).filter(Boolean);
  const inv=Object.values(P.inv||{}).filter(v=>+v>0).length;
  return {f,q:state.colQ||'',owned,mastered:mast,level,total,inv,cats:cats.filter(c=>c.items.length||!q)}}
Object.assign(window.TF,{collection:()=>collectionData(),
  collectionSet:o=>{if(o.f!=null)state.colF=o.f;if(o.q!=null)state.colQ=o.q;saveUI();tfNotify()},
  showInRanks:n=>{state.rkQ=n;state.rkF='all';saveUI();location.hash='ranks';tfNotify()}});
routes.collection=function(){return ''};
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
/* ---------- Chat rooms: General, Trading, LFG, plus your clan and alliance from your synced profile ---------- */
/* These are Tennoform rooms; Warframe has no way to connect to in-game chat. Anyone can read the public rooms,
   posting needs an account. The filter below matches firestore.rules: a flagged message can't be posted, so it
   goes to the review queue in the Backend, where an admin publishes it, removes it or bans the sender. */
const CHAT_FLAGS=[
  ['minors',/(child|kid|kids|minor|minors|underage|preteen|toddler|loli|shota)[^a-z]{0,3}(porn|nude|nudes|sex|xxx|naked)|(porn|nude|nudes|sex|xxx|naked)[^a-z]{0,3}(child|kid|kids|minor|minors|underage|preteen|toddler)/],
  ['drugs',/(selling|sell|buy|vendor|plug)[^a-z]+([a-z]+[^a-z]+){0,3}(cocaine|heroin|fentanyl|meth|mdma|ketamine|xanax|oxy|oxys|lsd)([^a-z]|$)/],
  ['weapons',/ghost gun|untraceable gun|glock switch|auto sear/],
  ['fraud',/(stolen|hacked)[^a-z]+(credit cards?|cards|cc|paypal accounts?|bank accounts?)|fullz|carding|cvv dumps?/],
  ['self-harm',/kill (your ?self|urself)|(^|[^a-z])kys([^a-z]|$)/],
  ['explicit',/(send|selling|sell)[^a-z]+nudes|(onlyfans|porn)[^a-z]*(leaks?|links?)/]];
function chatFlag(t){const s=String(t||'').toLowerCase();const f=CHAT_FLAGS.find(([,re])=>re.test(s));return f?f[0]:''}
const ROOMS=[['general','General','Talk about anything Warframe'],['trade','Trading','Buying and selling: post item, price and platform'],['lfg','LFG','Find a squad: mission, platform and what you need']];
const CM={room:'general',unsub:null,sub:'',msgs:[],err:'',held:[],me:null,banned:false,meAt:0,loading:false};
const oid=x=>x&&(x.$oid||x)||'';
function chatRooms(){const pr=P.prof||{};const out=ROOMS.map(([id,l,h])=>({id,label:l,hint:h,kind:'public'}));
  if(pr.gid)out.push({id:'c_'+pr.gid,label:pr.guild?`Clan: ${pr.guild}`:'Clan',hint:'Only members of your clan (from your synced profile)',kind:'clan'});
  if(pr.aid)out.push({id:'a_'+pr.aid,label:'Alliance',hint:'Only members of your alliance (from your synced profile)',kind:'alliance'});
  return out}
/* tell the rules which clan and alliance rooms you're in; refreshed after each sync */
async function chatMeSync(force){if(!FB||!SO.uid)return;const pr=P.prof||{};const g=/^[0-9a-f]{24}$/.test(pr.gid||'')?pr.gid:'',a=/^[0-9a-f]{24}$/.test(pr.aid||'')?pr.aid:'';
  const key=g+'|'+a+'|'+myName();if(!force&&CM.me===key)return;CM.me=key;
  try{await FB.fs.collection('chatme').doc(SO.uid).set({g,a,gn:String(pr.guild||'').slice(0,60),name:myName(),at:Date.now()})}catch(e){CM.me=null}}
async function chatBanCheck(){if(!FB||!SO.uid)return;try{const s=await FB.fs.collection('bans').doc(SO.uid).get();CM.banned=s.exists}catch(e){}}
function chatOpen(room){if(!FB)return;if(CM.sub===room&&CM.unsub)return;if(CM.unsub)CM.unsub();CM.sub=room;CM.msgs=[];CM.err='';CM.loading=true;
  CM.unsub=FB.fs.collection('rooms').doc(room).collection('msgs').orderBy('at','desc').limit(80).onSnapshot(s=>{CM.loading=false;CM.err='';
    CM.msgs=s.docs.map(d=>({id:d.id,...d.data()})).reverse();tfNotify()},e=>{CM.loading=false;CM.err=/permission/i.test((e&&e.code)||'')?'perm':'error';tfNotify()})}
function chatClose(){if(CM.unsub)CM.unsub();CM.unsub=null;CM.sub=''}
function communityData(){const rooms=chatRooms();if(!rooms.some(r=>r.id===CM.room))CM.room='general';
  if(SO.uid)chatMeSync(false);
  const tm=t=>{const d=new Date(t);return (Date.now()-t<864e5?'':d.toLocaleDateString([],{month:'short',day:'numeric'})+' ')+d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})};
  const held=CM.held.filter(h=>h.room===CM.room);
  return {hosted:HOSTED,ready:!!FB,signed:!!SO.uid,admin:!!FBK.admin,banned:CM.banned,room:CM.room,rooms,loading:CM.loading,err:CM.err,
    synced:!!(P.prof&&P.prof.gid),
    msgs:[...CM.msgs.map(m=>({id:m.id,who:String(m.name||'Tenno'),text:String(m.text||''),time:tm(+m.at||0),mine:m.uid===SO.uid,uid:m.uid,held:false})),
      ...held.map(h=>({id:h.id,who:myName(),text:h.text,time:tm(h.at),mine:true,uid:SO.uid,held:true}))]}}
async function communitySend(text){text=String(text||'').trim().slice(0,500);if(!text)return false;
  if(!FB||!SO.uid){toast('Sign in to post');return false}if(CM.banned){toast("You can't post in chat.");return false}
  const room=CM.room,d={uid:SO.uid,name:myName(),text,at:Date.now()};const flag=chatFlag(text);
  try{if(flag){await FB.fs.collection('review').add({room,...d,flag});CM.held.push({id:'h'+d.at,room,text,at:d.at});tfNotify();
      toast('Held for review: this message may break the community rules, so only you can see it until it\'s checked.');return true}
    await FB.fs.collection('rooms').doc(room).collection('msgs').add(d);return true}
  catch(e){await chatBanCheck();toast(CM.banned?"You can't post in chat.":"Couldn't send. Try again in a moment.");tfNotify();return false}}
/* admin tools: review queue, delete, bans */
const MOD={tried:false,list:null,bans:null,err:''};
async function modLoad(force){if(!FB||!FBK.admin||(MOD.tried&&!force))return;MOD.tried=true;
  try{const [r,b]=await Promise.all([FB.fs.collection('review').orderBy('at','desc').limit(200).get(),FB.fs.collection('bans').get()]);
    MOD.list=r.docs.map(d=>({id:d.id,...d.data()}));MOD.bans=b.docs.map(d=>({id:d.id,...d.data()}));MOD.err=''}catch(e){MOD.err=(e&&e.code)||'error'}tfNotify()}
const roomLabel=id=>{const r=ROOMS.find(x=>x[0]===id);return r?r[1]:id.startsWith('c_')?'Clan room':id.startsWith('a_')?'Alliance room':id};
function modData(){if(FBK.admin&&!MOD.tried)modLoad();
  return {err:MOD.err,loading:MOD.list==null&&!MOD.err,
    list:(MOD.list||[]).map(x=>({id:x.id,room:roomLabel(x.room||''),uid:x.uid,name:x.name||'',text:x.text||'',flag:x.flag||'',at:new Date(x.at).toLocaleString()})),
    bans:(MOD.bans||[]).map(x=>({uid:x.id,name:x.name||'',reason:x.reason||'',at:x.at?new Date(x.at).toLocaleDateString():''}))}}
async function modPublish(id){const x=(MOD.list||[]).find(y=>y.id===id);if(!x)return;
  try{await FB.fs.collection('rooms').doc(x.room).collection('msgs').add({uid:x.uid,name:x.name,text:x.text,at:x.at});await FB.fs.collection('review').doc(id).delete();MOD.list=MOD.list.filter(y=>y.id!==id);toast('Published');tfNotify()}catch(e){toast("Couldn't publish")}}
async function modRemove(id,ban){const x=(MOD.list||[]).find(y=>y.id===id);if(!x)return;
  try{await FB.fs.collection('review').doc(id).delete();MOD.list=MOD.list.filter(y=>y.id!==id);if(ban)await modBan(x.uid,x.name,'Flagged: '+(x.flag||'review'));else toast('Removed');tfNotify()}catch(e){toast("Couldn't remove")}}
async function modBan(uid,name,reason){try{await FB.fs.collection('bans').doc(uid).set({at:Date.now(),name:String(name||'').slice(0,40),reason:String(reason||'').slice(0,120),by:SO.uid});
  MOD.bans=[...(MOD.bans||[]).filter(b=>b.id!==uid),{id:uid,name,reason,at:Date.now()}];toast(`${name||'Player'} banned from chat`);tfNotify()}catch(e){toast("Couldn't ban")}}
async function modUnban(uid){try{await FB.fs.collection('bans').doc(uid).delete();MOD.bans=(MOD.bans||[]).filter(b=>b.id!==uid);toast('Unbanned');tfNotify()}catch(e){toast("Couldn't unban")}}
async function chatDelete(id){try{await FB.fs.collection('rooms').doc(CM.room).collection('msgs').doc(id).delete();toast('Message deleted')}catch(e){toast("Couldn't delete")}}
/* the synced profile carries clan and alliance IDs: keep them, and refresh chat membership after each sync */
{const _ip0=importProfile0;importProfile0=function(txt){const r=_ip0.apply(this,arguments);try{const raw=JSON.parse(String(txt).trim());const j=raw.Results&&raw.Results[0]?raw.Results[0]:raw;
    if(P.prof){P.prof.gid=oid(j.GuildId)||P.prof.gid||'';P.prof.aid=oid(j.AllianceId)||P.prof.aid||''}}catch(e){}if(SO.uid)setTimeout(()=>chatMeSync(true),500);return r}}
{const _fp=fromParsed;fromParsed=function(o){const r=_fp.apply(this,arguments);try{if(!(o&&o.Results)&&r&&r.Results&&r.Results[0]){const p=o.profile||o;r.Results[0].GuildId=p.guildId||'';r.Results[0].AllianceId=p.allianceId||''}}catch(e){}return r}}
{const _si=socialInit;socialInit=async function(uid){const r=await _si.apply(this,arguments);CM.me=null;CM.banned=false;chatMeSync(true);chatBanCheck();return r}}
Object.assign(window.TF,{community:()=>communityData(),communitySet:o=>{if(o.room){CM.room=o.room;chatOpen(o.room)}tfNotify()},communitySend:t=>communitySend(t),chatDelete:id=>chatDelete(id),
  modData:()=>modData(),modReload:()=>modLoad(true),modPublish:id=>modPublish(id),modRemove:(id,ban)=>modRemove(id,ban),modBan:(uid,name,reason)=>modBan(uid,name,reason),modUnban:uid=>modUnban(uid)});
/* ---------- Chat: one window, a tab for each room (General, Trading, LFG, clan, alliance) and each open friend or group conversation ---------- */
/* Room tabs are always there; conversation tabs open when you pick a friend or group and close with ×. The open tabs and the one you're on are remembered on this device. */
const CT=(()=>{const s=lsGet('tf-chattabs',{});return {open:Array.isArray(s.open)?s.open.slice(0,12):[],cur:typeof s.cur==='string'?s.cur:'general'}})();
const ctSave=()=>lsSet('tf-chattabs',{open:CT.open,cur:CT.cur});
const ctConv=id=>/^(f|g):/.test(id);
function ctConvKey(id){return id.startsWith('f:')?id.slice(2):id}   /* the Friends bridge keys friends by uid and groups by g:id */
function chatTabs(){const ur=SO.uid?unread().per:{};
  const rooms=chatRooms().map(r=>({id:r.id,label:r.kind==='clan'?'Clan':r.label,title:r.label,hint:r.hint,kind:r.kind,unread:0,closable:false}));
  /* a conversation whose friend or group is gone (removed, left, or not loaded yet) is hidden, not dropped */
  const conv=SO.uid?CT.open.map(id=>{if(id.startsWith('f:')){const f=SO.friends.find(x=>x.uid===id.slice(2));return f?{id,label:sqName(f.uid),title:sqName(f.uid),hint:f.pending?'Waiting for them to accept':'Friend',kind:'friend',unread:ur[f.uid]||0,closable:true}:null}
    const g=SO.groups.find(x=>'g:'+x.id===id);return g?{id,label:g.name,title:g.name,hint:`${g.members.length} members`,kind:'group',unread:ur[id]||0,closable:true}:null}).filter(Boolean):[];
  /* friends and groups with unread messages show up as tabs on their own */
  if(SO.uid){SO.friends.forEach(f=>{const id='f:'+f.uid;if(ur[f.uid]&&!conv.some(t=>t.id===id))conv.push({id,label:sqName(f.uid),title:sqName(f.uid),hint:'Friend',kind:'friend',unread:ur[f.uid],closable:true})});
    SO.groups.forEach(g=>{const id='g:'+g.id;if(ur[id]&&!conv.some(t=>t.id===id))conv.push({id,label:g.name,title:g.name,hint:`${g.members.length} members`,kind:'group',unread:ur[id],closable:true})})}
  return [...rooms,...conv]}
function chatPageData(){const tabs=chatTabs();if(!tabs.some(t=>t.id===CT.cur))CT.cur='general';const cur=CT.cur;
  const onPage=location.hash==='#chat';
  if(ctConv(cur)){if(onPage){chatClose();state.chat=ctConvKey(cur)}}
  else{CM.room=cur;if(onPage&&FB)chatOpen(cur)}
  const openable=SO.uid?[...SO.groups.map(g=>({id:'g:'+g.id,label:g.name,kind:'group'})),...SO.friends.filter(f=>!f.pending).map(f=>({id:'f:'+f.uid,label:sqName(f.uid),kind:'friend'}))].filter(o=>!tabs.some(t=>t.id===o.id)):[];
  return {tabs,cur,conv:ctConv(cur),openable,signed:!!SO.uid,synced:!!(P.prof&&P.prof.gid)}}
function chatGo(id,nav){if(ctConv(id)&&!CT.open.includes(id))CT.open.push(id);CT.cur=id;ctSave();if(ctConv(id))state.chat=ctConvKey(id);if(nav&&location.hash!=='#chat')location.hash='chat';tfNotify()}
function chatCloseTab(id){const i=CT.open.indexOf(id);if(i>=0)CT.open.splice(i,1);
  if(id.startsWith('f:'))sqMarkRead(id.slice(2));else if(id.startsWith('g:'))sqMarkRead(id);
  if(CT.cur===id){CT.cur=CT.open[Math.max(0,i-1)]||'general';if(!ctConv(CT.cur))state.chat=null}ctSave();tfNotify()}
Object.assign(window.TF,{chat:()=>chatPageData(),chatGo:(id,nav)=>chatGo(id,nav!==false),chatCloseTab:id=>chatCloseTab(id)});
routes.chat=function(){return ''};
/* the Friends page now opens conversations here; keep live redraws for both pages */
{const _sr=socialRender;socialRender=function(){if(location.hash==='#chat'){badge();tfNotify();return}_sr()}}
window.addEventListener('hashchange',()=>{if(location.hash!=='#chat'){chatClose();state.chat=null}});
/* a new group opens straight into its chat tab */
{const _gc=window.TF.groupCreate;window.TF.groupCreate=async(name,uids)=>{const ok=await _gc(name,uids);if(ok&&state.chat)chatGo(state.chat,true);return ok}}
/* ---------- Chat pictures: profile pictures for everyone, and backgrounds for clan and alliance rooms ---------- */
/* Images are shrunk in the browser and stored inline in Firestore (no file storage needed): a 160px profile picture,
   a 1280px room background. firestore.rules checks the size and format. Only leaders an admin appoints in the
   Backend can change a clan or alliance room's background; admins can remove any picture. */
const AV={};let AVq=new Set(),AVt=0;
function imgShrink(file,max,limit){return new Promise((res,rej)=>{if(!file||!/^image\//.test(file.type||'')){rej(new Error('type'));return}
  const url=URL.createObjectURL(file),im=new Image();im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('read'))};
  im.onload=()=>{URL.revokeObjectURL(url);const sq=max<=200;let w=im.naturalWidth,h=im.naturalHeight,sx=0,sy=0,sw=w,sh=h;
    if(sq){const m=Math.min(w,h);sx=(w-m)/2;sy=(h-m)/2;sw=sh=m;w=h=Math.min(max,m)}else{const k=Math.min(1,max/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k)}
    const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,w,h);
    for(const q of [.86,.78,.68,.56,.45,.35]){for(const t of ['image/webp','image/jpeg']){const d=c.toDataURL(t,q);if(d.startsWith('data:'+t)&&d.length<=limit){res(d);return}}}
    rej(new Error('size'))};im.src=url})}
const pickImage=()=>new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>res(i.files&&i.files[0]||null);i.click()});
/* profile pictures: fetched in small batches for whoever's on screen */
function avatarOf(uid){if(!uid)return '';if(uid in AV)return AV[uid]||'';if(!FB)return '';AVq.add(uid);clearTimeout(AVt);AVt=setTimeout(avFetch,60);return ''}
async function avFetch(){const ids=[...AVq].filter(u=>!(u in AV));AVq=new Set();if(!ids.length)return;ids.forEach(u=>AV[u]='');
  await Promise.all(ids.map(u=>FB.fs.collection('avatars').doc(u).get().then(s=>{if(s.exists)AV[u]=String((s.data()||{}).img||'')}).catch(()=>{})));tfNotify()}
async function avatarSet(){if(!FB||!SO.uid){toast('Sign in to add a profile picture');return}const f=await pickImage();if(!f)return;
  try{const img=await imgShrink(f,160,60000);await FB.fs.collection('avatars').doc(SO.uid).set({img,at:Date.now()});AV[SO.uid]=img;toast('Profile picture updated');tfNotify()}
  catch(e){toast(e&&e.message==='type'?'Pick an image file':e&&e.message==='size'?"That image is too detailed to shrink. Try another.":"Couldn't save the picture. Try again.")}}
async function avatarRemove(uid){uid=uid||SO.uid;if(!FB||!uid)return;try{await FB.fs.collection('avatars').doc(uid).delete();AV[uid]='';toast(uid===SO.uid?'Profile picture removed':'Picture removed');tfNotify()}catch(e){toast("Couldn't remove the picture")}}
/* room backgrounds and leaders, for the clan or alliance room you're looking at */
const RB={room:'',img:'',leads:[],unsub:null};
function roomMedia(room){if(!FB||!/^[ca]_/.test(room||'')){if(RB.unsub)RB.unsub();Object.assign(RB,{room:'',img:'',leads:[],unsub:null});return RB}
  if(RB.room!==room){if(RB.unsub)RB.unsub();Object.assign(RB,{room,img:'',leads:[]});
    RB.unsub=FB.fs.collection('roombg').doc(room).onSnapshot(s=>{RB.img=s.exists?String((s.data()||{}).img||''):'';tfNotify()},()=>{});
    FB.fs.collection('roomlead').doc(room).get().then(s=>{RB.leads=s.exists?((s.data()||{}).uids||[]):[];tfNotify()}).catch(()=>{})}
  return RB}
async function roomBgSet(){const room=CM.room;if(!/^[ca]_/.test(room))return;const f=await pickImage();if(!f)return;
  try{const img=await imgShrink(f,1280,400000);await FB.fs.collection('roombg').doc(room).set({img,by:SO.uid,at:Date.now()});toast('Background updated')}
  catch(e){toast(e&&e.message==='type'?'Pick an image file':e&&e.message==='size'?"That image is too detailed to shrink. Try another.":"Couldn't save the background. Only this room's leaders can change it.")}}
async function roomBgRemove(){const room=CM.room;try{await FB.fs.collection('roombg').doc(room).delete();toast('Background removed')}catch(e){toast("Couldn't remove the background")}}
/* add avatars and the room's background to the chat data */
{const _cd=communityData;communityData=function(){const d=_cd.apply(this,arguments);const rm=roomMedia(d.room);
  d.msgs.forEach(m=>{m.av=avatarOf(m.uid)});d.bg=rm.img;d.lead=!!SO.uid&&(rm.leads.includes(SO.uid)||!!FBK.admin);d.leadRoom=/^[ca]_/.test(d.room);d.myAv=avatarOf(SO.uid);return d}}
{const _sd=squadData;squadData=function(){const d=_sd.apply(this,arguments);if(d.friends)d.friends.forEach(f=>{f.av=avatarOf(f.uid)});if(d.chat&&d.chat.type==='friend')d.chat.av=avatarOf(d.chat.id);d.me=myName();return d}}
/* Backend: appoint leaders for each clan and alliance room, from the members whose synced profiles put them there */
const LD={list:null,leads:{},err:''};
async function leadLoad(){if(!FB||!FBK.admin)return;try{const [m,l]=await Promise.all([FB.fs.collection('chatme').get(),FB.fs.collection('roomlead').get()]);
  const rooms={};m.docs.forEach(d=>{const x=d.data()||{};if(x.g){const r=rooms['c_'+x.g]=rooms['c_'+x.g]||{id:'c_'+x.g,label:'Clan: '+(x.gn||x.g.slice(-6)),members:[]};r.members.push({uid:d.id,name:x.name||'Tenno'});if(x.gn&&r.label.endsWith(x.g.slice(-6)))r.label='Clan: '+x.gn}
    if(x.a){const r=rooms['a_'+x.a]=rooms['a_'+x.a]||{id:'a_'+x.a,label:'Alliance '+x.a.slice(-6)+(x.gn?' (incl. '+x.gn+')':''),members:[]};r.members.push({uid:d.id,name:x.name||'Tenno'})}});
  LD.list=Object.values(rooms).sort((a,b)=>b.members.length-a.members.length);LD.leads={};l.docs.forEach(d=>{LD.leads[d.id]=(d.data()||{}).uids||[]});LD.err=''}catch(e){LD.err=(e&&e.code)||'error'}tfNotify()}
function leadData(){if(FBK.admin&&LD.list==null&&!LD.err&&!LD.busy){LD.busy=true;leadLoad().finally(()=>LD.busy=false)}
  return {err:LD.err,loading:LD.list==null&&!LD.err,rooms:(LD.list||[]).map(r=>({...r,members:r.members.map(m=>({...m,lead:(LD.leads[r.id]||[]).includes(m.uid)}))}))}}
async function leadToggle(room,uid){const cur=LD.leads[room]||[];if(!cur.includes(uid)&&cur.length>=10){toast('A room can have up to 10 leaders. Remove one first.');return}const next=cur.includes(uid)?cur.filter(u=>u!==uid):[...cur,uid];
  try{if(next.length)await FB.fs.collection('roomlead').doc(room).set({uids:next,at:Date.now(),by:SO.uid});else await FB.fs.collection('roomlead').doc(room).delete();LD.leads[room]=next;toast(next.includes(uid)?'Leader added':'Leader removed');tfNotify()}
  catch(e){toast("Couldn't save. Check the Firestore rules are published.")}}
Object.assign(window.TF,{avatarSet:()=>avatarSet(),avatarRemove:uid=>avatarRemove(uid),myAvatar:()=>avatarOf(SO.uid),roomBgSet:()=>roomBgSet(),roomBgRemove:()=>roomBgRemove(),
  leadData:()=>leadData(),leadReload:()=>{LD.list=null;LD.err='';tfNotify()},leadToggle:(room,uid)=>leadToggle(room,uid)});
/* ---------- People you meet in chat or on shared builds: add them as a friend (they still have to accept) or block them ---------- */
function personInfo(uid){const f=SO.friends.find(x=>x.uid===uid);
  const rel=!uid?'none':uid===SO.uid?'me':blocked(uid)?'blocked':f?(f.pending?'pending':'friend'):SO.inbox.some(m=>m.type==='friend'&&m.from===uid)?'asked':'none';
  return {rel,av:avatarOf(uid),signed:!!SO.uid}}
async function friendAddUid(uid,name){if(!FB||!SO.uid){toast('Sign in to add friends');return}if(!uid||uid===SO.uid)return;
  if(blocked(uid)){toast("You've blocked them. Unblock them on the Friends page first.");return}
  if(SO.friends.some(f=>f.uid===uid)){toast(SO.friends.find(f=>f.uid===uid).pending?'Request already sent':'Already friends');return}
  /* they asked you first: accepting is the same as adding */
  const ask=SO.inbox.find(m=>m.type==='friend'&&m.from===uid);if(ask){await acceptFriend(ask.id);return}
  try{await FB.fs.collection('users').doc(SO.uid).collection('friends').doc(uid).set({name:String(name||'Pending').slice(0,40),code:'',pending:true,at:Date.now()});
    await sendMsg(uid,{type:'friend',code:SO.code},false);toast(`Friend request sent to ${name||'them'}. You can message once they accept.`);tfNotify()}
  catch(e){toast("Couldn't send the request. Try again.")}}
/* the request card on Friends needs the sender so you can block them */
{const _sd=squadData;squadData=function(){const d=_sd.apply(this,arguments);if(d.requests)d.requests.forEach(r=>{const m=SO.inbox.find(x=>x.id===r.id);r.from=m?m.from:''});return d}}
/* shared builds carry their author's account, so you can add them from the build */
{const _bd=bDetail;bDetail=function(b){const d=_bd.apply(this,arguments);d.authorUid=b&&b.src==='player'&&b.uid!==SO.uid?b.uid:'';return d}}
/* blocking hides their room messages too, and the Friends page lists who you've blocked so you can undo it */
{const _cd=communityData;communityData=function(){const d=_cd.apply(this,arguments);d.msgs=d.msgs.filter(m=>m.mine||!blocked(m.uid));return d}}
{const _sd=squadData;squadData=function(){const d=_sd.apply(this,arguments);d.blocked=(P.block||[]).map(uid=>({uid,name:(P.blockN||{})[uid]||(SO.pub[uid]||{}).name||'Player'}));return d}}
function blockPerson(uid,name){if(!uid||uid===SO.uid)return;P.blockN=P.blockN||{};if(name)P.blockN[uid]=String(name).slice(0,40);window.TF.friendBlock(uid)}
function unblockPerson(uid){P.block=(P.block||[]).filter(u=>u!==uid);if(P.blockN)delete P.blockN[uid];saveProfile();toast('Unblocked');tfNotify()}
Object.assign(window.TF,{blockPerson:(uid,name)=>blockPerson(uid,name),unblockPerson:uid=>unblockPerson(uid),person:uid=>personInfo(uid),friendAddUid:(uid,name)=>friendAddUid(uid,name)});
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
  copy(`[${x.kind||'other'}] ${x.text||''}\nFrom: ${x.name||'Anonymous'}${x.contact?' ('+x.contact+')':''}, ${new Date(x.at).toLocaleString()}${x.page?', from '+x.page:''}`,'Feedback copied')}
Object.assign(window.TF,{fbStatus:(id,st)=>fbSetStatus(id,st),fbCopy:id=>fbCopy(id),fbDone:id=>{const x=(FBK.list||[]).find(y=>y.id===id);if(x)fbSetStatus(id,'done')}});
/* ---------- MR plan route: every source of mastery XP, quickest first, until you reach the target rank ---------- */
/* Gear is only half of it: star chart and Steel Path nodes, junctions, Railjack and Drifter intrinsics and
   modular companions all give mastery. Steps are ordered by effort; the plan stops where the target is reached. */
function masteryRoute(target){const t=totalXP(),cur=mrInfo(t.total).mr;const need=Math.max(0,mrNeed(target)-t.total);const cap=Math.min(Math.max(cur,0),30);
  const qd=n=>on('q|'+n);const steps=[];
  /* 1. items already in progress or built: no farming, just play */
  const prog=MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=cap&&(rankOf(it.n)>0||on('build|'+it.n)||(P.foundry||[]).some(f=>f.n===it.n)));
  if(prog.length)steps.push({id:'finish',title:'Finish ranking what you already have',how:'No farming needed: equip these and play. Steel Path or high-level Survival with an Affinity Booster ranks them fastest.',
    xp:prog.reduce((a,it)=>a+mxp(it)-itemXP(it.n),0),count:prog.length,unit:'items',items:prog.map(it=>it.n),link:'',kind:'gear'});
  /* 2. star chart nodes and junctions */
  const left=NODES.filter(n=>!on('n|'+n.id));const jn=left.filter(n=>/Junction/.test(n.t));const byP={};left.forEach(n=>{const k=n.p;(byP[k]=byP[k]||{p:k,n:0,xp:0}).n++;byP[k].xp+=n.x});
  if(left.length)steps.push({id:'chart',title:'Clear star chart nodes',how:`Every node gives XP the first time you finish it, and each Junction gives 1,000.${jn.length?` ${jn.length} Junction${jn.length>1?'s':''} left.`:''} Most give more XP per minute than ranking gear early on.`,
    xp:left.reduce((a,n)=>a+n.x,0),count:left.length,unit:'nodes',planets:Object.values(byP).sort((a,b)=>b.xp-a.xp).slice(0,8),link:'missions',kind:'nodes'});
  /* 3. easy gear: market blueprints and boss or node drops */
  /* only gear you can use at your current rank; more unlocks as you go */
  const cand=MI.filter(it=>!on('m|'+it.n)&&!prog.includes(it)&&(it.mr||0)<=cap).map(it=>({it,gain:mxp(it)-itemXP(it.n),e:ease(it)})).filter(x=>x.gain>0)
    .sort((a,b)=>b.gain-a.gain||(a.it.mr||0)-(b.it.mr||0));
  const gearStep=(e,how)=>{const xs=cand.filter(x=>x.e===e);if(xs.length)steps.push({id:'gear'+e,title:EASE[e],how,xp:xs.reduce((a,x)=>a+x.gain,0),count:xs.length,unit:'items',items:xs.map(x=>x.it.n),gains:xs.map(x=>x.gain),link:'',kind:'gear'})};
  gearStep(0,'Buy the blueprint with credits in the Market, build it, then rank it to 30. Warframes, companions and Archwings give twice the XP of weapons.');
  gearStep(1,'Blueprints and parts drop from bosses, specific nodes or enemies. Each item page says where.');
  /* 4. intrinsics: 1,500 XP for every rank */
  const rail=IR.length*10*1500-catXP('rail'),drift=ID.length*10*1500-catXP('drift');
  if(rail>0)steps.push({id:'rail',title:'Railjack intrinsics',how:`Every intrinsic rank is 1,500 XP (5 schools × 10 ranks). Earn intrinsic points by playing Railjack missions in the Proxima regions.${qd('Rising Tide')?'':' Needs the Rising Tide quest and a Dry Dock.'}`,
    xp:rail,count:Math.round(rail/1500),unit:'ranks',link:'',kind:'intr'});
  if(drift>0)steps.push({id:'drift',title:'Drifter intrinsics',how:`Every rank is 1,500 XP (4 schools × 10 ranks). Earn them in Duviri: the Duviri Experience, the Lone Story and the Circuit.${qd('The Duviri Paradox')?'':' Needs The Duviri Paradox quest.'}`,
    xp:drift,count:Math.round(drift/1500),unit:'ranks',link:'',kind:'intr'});
  /* 5. relic gear, then Steel Path, then the hard stuff */
  gearStep(2,'Prime parts from relics. Open them in fissures; the Relics page shows which relics you own that drop what you need.');
  const spl=NODES.filter(n=>!on('sp|'+n.id));
  if(spl.length)steps.push({id:'sp',title:'Steel Path nodes',how:left.length?'Unlocks once every star chart node is done, then every node gives its XP a second time.':'Every node gives its XP a second time. Enemies are tougher, so bring a ranked loadout.',
    xp:spl.reduce((a,n)=>a+n.x,0),count:spl.length,unit:'nodes',link:'missions',kind:'nodes',locked:left.length>0});
  gearStep(3,'Quest rewards, syndicate offerings and vendors such as Cephalon Simaris and the Open World hubs.');
  steps.push({id:'modular',title:'Modular gear',how:'Every MOA, Hound, Predasite and Vulpaphyla you build counts as a new item (6,000 XP each), and so does each Zaw strike, Kitgun chamber and Amp prism you rank. Mix new parts to keep earning.',
    xp:0,count:0,unit:'',link:'ranks',kind:'info'});
  gearStep(4,'Vaulted Primes: buy the set on warframe.market, or wait for a Prime Resurgence.');
  /* walk the steps until the gap is covered */
  let acc=0;steps.forEach(s=>{s.before=acc;if(!s.locked)acc+=s.xp;s.after=acc;s.reach=s.before<need&&s.after>=need&&need>0;s.beyond=s.before>=need&&need>0;
    s.mr=mrInfo(t.total+Math.min(acc,1e9)).mr;
    /* the step that reaches the target: how many of its items it takes (biggest XP first) */
    if(s.reach&&s.gains){let left=need-s.before,k=0;while(left>0&&k<s.gains.length){left-=s.gains[k];k++}s.pick=k}});
  return {need,steps,total:acc}}
{const _md=masteryData;masteryData=function(){const d=_md.apply(this,arguments);if(d.tab==='path'){const r=masteryRoute(+d.target);
  d.route=r.steps.map(s=>({...s,gains:undefined,pick:s.pick||0,items:s.items?s.items.slice(0,60).map(n=>gearRow(n,'')).filter(Boolean):[],more:s.items?Math.max(0,s.items.length-60):0,mrAfter:mrLabel(s.mr)}));d.routeTotal=r.total}return d}}
/* ---------- Sell on warframe.market: suggested prices from the daily snapshot, a trade-chat line, and the item's page ---------- */
/* Tennoform never signs in to warframe.market for anyone: the player places the order there themselves.
   Prices come from the daily snapshot, so the page says how old they are. */
function sellDucats(n){const base=n.replace(/ Set$/,'');const it=I[base];if(it&&n.endsWith(' Set'))return it.parts.filter(p=>p.k==='p').reduce((a,p)=>a+(p.du||0),0)||null;
  for(const i of Object.values(I)){if(!i.p)continue;for(const p of i.parts)if(p.k==='p'&&(p.full===n||(p.n==='Blueprint'&&i.n+' Blueprint'===n)))return p.du||null}return null}
function sellData(){const n=state.sell;if(!n||!MS[n])return null;const p=PR[n]||{};const sl=(SEL[n]||[]).filter(x=>x[0]!=='__buy');const low=sl.length?sl[0][1]:null;
  const avg=p.a7??p.a30??null;
  /* quick: just under the cheapest seller (but not far below the usual price); fair: the 7-day average */
  const quick=low!=null?Math.max(1,avg!=null?Math.max(low-1,Math.round(avg*0.8)):low-1):avg!=null?Math.max(1,Math.round(avg*0.9)):null;
  const fair=avg!=null?Math.max(1,Math.round(avg)):low;
  const isMod=!!(MODS[n]||ARC[n]);
  return {n,url:'https://warframe.market/items/'+MS[n],low,avg:avg!=null?Math.round(avg):null,a30:p.a30!=null?Math.round(p.a30):null,v7:p.v7||0,quick,fair,
    du:sellDucats(n),rank:isMod,date:D.meta.prices,sellers:sl.slice(0,3).map(s=>({name:s[0],price:s[1],rank:s[5]??null,status:s[4]==='ingame'?'In game':s[4]==='online'?'Online':''})),
    chat:p=>`WTS [${n}] ${p}p`}}
Object.assign(window.TF,{sell:()=>{const d=sellData();if(!d)return null;const {chat,...rest}=d;return {...rest,chatQuick:d.quick!=null?chat(d.quick):'',chatFair:d.fair!=null?chat(d.fair):''}},
  sellOpen:n=>{if(!MS[n]){toast("That item isn't traded on warframe.market.");return}state.sell=n;tfNotify()},sellClose:()=>{state.sell=null;tfNotify()},sellable:n=>!!MS[n]});
document.addEventListener('click',e=>{const t=e.target.closest('[data-sell]');if(!t)return;e.preventDefault();e.stopPropagation();window.TF.sellOpen(t.dataset.sell)},true);
/* moving to another page closes it, so it never sits over a page it doesn't belong to */
window.addEventListener('hashchange',()=>{if(state.sell){state.sell=null;tfNotify()}});
/* ---------- sort direction: every sort menu has an ascending/descending toggle, remembered on this device (SREV in 05-helpers.js) ---------- */
Object.assign(window.TF,{isRev:k=>!!SREV[k],
  sortRev:k=>{if(SREV[k])delete SREV[k];else SREV[k]=1;lsSet('tf-sortrev',SREV);
    /* paged lists start again from the top */
    ['rkLim','mkLim','mmLim','blN'].forEach(x=>{delete state[x]});tfNotify()}});
/* ---------- Alerts and progress history ---------- */
/* Alerts use only data Tennoform already has (the live feed it loads anyway and your own progress), so they add
   no requests. They show on Home and Today; with "Notify me" on, the browser also pops one up while the site is open. */
const AL_DEF={baro:true,resurgence:true,fissure:true,notify:false};
const alertPrefs=()=>({...AL_DEF,...(P.alertPrefs||{})});
const AL_HIDE=(()=>{const h=lsGet('tf-alert-hide',[]);return Array.isArray(h)?h:[]})();
function alertsAll(){const pr=alertPrefs(),out=[],now=Date.now(),w=WS;
  if(pr.baro&&w&&w.voidTrader){const vt=w.voidTrader,a=new Date(vt.activation).getTime(),e=new Date(vt.expiry).getTime();
    if(a<=now&&now<e)out.push({id:'baro:'+vt.activation,kind:'baro',title:"Baro Ki'Teer is here",text:`At ${vt.location||'a relay'} for ${left(e-now)}.`,items:[],href:'today'});
    else if(a>now&&a-now<48*3600e3)out.push({id:'baro-soon:'+vt.activation,kind:'baro',title:"Baro Ki'Teer arrives soon",text:`In ${left(a-now)}${vt.location?' at '+vt.location:''}. Ducats ready?`,items:[],href:'today'})}
  if(pr.resurgence){const need=Object.keys(VAULT).filter(n=>VAULT[n].now&&I[n]&&((P.goals||[]).includes(n)||(!on('m|'+n)&&!ownedItem(n))));
    if(need.length){const until=VAULT[need[0]].now;out.push({id:'res:'+until+':'+need.sort().join(','),kind:'resurgence',title:`Prime Resurgence: ${need.length} you need`,
      text:`Varzia has their relics until ${fdate(until)}. Buy them with Aya or Regal Aya.`,items:need.slice(0,6).concat(need.length>6?[`and ${need.length-6} more`]:[]),href:'market'})}}
  if(pr.fissure&&w&&w.fissures){const mine=Object.keys(P.rel||{}).filter(r=>REL[r]&&relCount(r)>0);const eras={};
    mine.forEach(r=>{const e=REL[r].era;const x=eras[e]=eras[e]||{n:0,need:0};x.n+=relCount(r);if(relicAdvice(r).need.length)x.need++});
    const fis=w.fissures.filter(f=>!f.expired&&new Date(f.expiry).getTime()>now&&eras[f.tier]).sort((a,b)=>(eras[b.tier].need-eras[a.tier].need)||new Date(a.expiry)-new Date(b.expiry));
    if(fis.length){const es=[...new Set(fis.map(f=>f.tier))];out.push({id:'fis:'+fis.map(f=>f.id||f.node+f.tier).sort().join(',').slice(0,300),kind:'fissure',
      title:`Fissures for your relics: ${es.join(', ')}`,text:es.map(e=>`${e}: ${eras[e].n} relic${eras[e].n>1?'s':''}${eras[e].need?`, ${eras[e].need} with parts you need`:''}`).join(' · '),
      items:fis.slice(0,5).map(f=>`${f.tier} ${f.missionType} · ${f.node}${f.isHard?' · Steel Path':''}${f.isStorm?' · Void Storm':''} · ${left(new Date(f.expiry)-now)} left`),href:'today'})}}
  return out}
function alertsData(){const pr=alertPrefs();return {prefs:pr,live:!!WS,list:alertsAll().filter(a=>!AL_HIDE.includes(a.id)),hidden:alertsAll().filter(a=>AL_HIDE.includes(a.id)).length,
  canNotify:typeof Notification!=='undefined',perm:typeof Notification!=='undefined'?Notification.permission:'unsupported'}}
/* pop up new alerts while the site is open (no background service, nothing sent anywhere) */
function alertsCheck(){const pr=alertPrefs();const seen=new Set(lsGet('tf-alert-seen',[])||[]);const fresh=alertsAll().filter(a=>!seen.has(a.id)&&!AL_HIDE.includes(a.id));
  if(!fresh.length)return;fresh.forEach(a=>seen.add(a.id));lsSet('tf-alert-seen',[...seen].slice(-100));
  if(pr.notify&&typeof Notification!=='undefined'&&Notification.permission==='granted'&&document.hidden){fresh.forEach(a=>{try{const n=new Notification(a.title,{body:a.text,tag:a.id,icon:'icon-192.png'});n.onclick=()=>{window.focus();location.hash=a.href;n.close()}}catch(e){}})}
  tfNotify()}
setInterval(alertsCheck,60e3);setTimeout(alertsCheck,8e3);
Object.assign(window.TF,{alerts:()=>alertsData(),
  alertPrefsSet:o=>{P.alertPrefs={...alertPrefs(),...o};saveProfile();tfNotify()},
  alertDismiss:id=>{if(!AL_HIDE.includes(id))AL_HIDE.push(id);while(AL_HIDE.length>200)AL_HIDE.shift();lsSet('tf-alert-hide',AL_HIDE);tfNotify()},
  alertShowHidden:()=>{AL_HIDE.length=0;lsSet('tf-alert-hide',AL_HIDE);tfNotify()},
  alertNotify:async on=>{if(!on){P.alertPrefs={...alertPrefs(),notify:false};saveProfile();tfNotify();return}
    if(typeof Notification==='undefined'){toast("This browser can't show notifications.");return}
    const p=Notification.permission==='granted'?'granted':await Notification.requestPermission();
    if(p==='granted'){P.alertPrefs={...alertPrefs(),notify:true};saveProfile();toast("You'll get a notification for new alerts while Tennoform is open.")}
    else toast('Notifications are blocked for this site. Allow them in your browser settings to turn this on.');tfNotify()}});

/* ---------- progress history: one snapshot a day of your mastery and collection, kept in your profile (and synced when signed in) ---------- */
function histSnap(){const t=totalXP();let mastered=0,owned=0;for(const it of MI){if(on('m|'+it.n))mastered++;if(ownedItem(it.n))owned++}
  const nodes=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length;return {xp:Math.round(t.total),mr:mrInfo(t.total).mr,mastered,owned,nodes}}
const histDay=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
/* only record once your saved progress has loaded: never in demo mode, never while accounts are still starting,
   never for a signed-in account before its cloud copy is attached, and never an empty snapshot */
function histReady(){if(typeof DEMO!=='undefined'&&DEMO)return false;if(typeof FBST!=='undefined'&&FBST==='loading')return false;
  try{if(window.firebase&&firebase.apps&&firebase.apps.length&&firebase.auth().currentUser&&!synced)return false}catch(e){return false}return true}
function histRecord(){if(!histReady())return;const s=histSnap();if(!s.xp&&!s.mastered&&!s.owned&&!s.nodes)return;const day=histDay();P.hist=P.hist&&typeof P.hist==='object'?P.hist:{};const cur=P.hist[day];
  if(cur&&cur.xp===s.xp&&cur.mastered===s.mastered&&cur.owned===s.owned&&cur.nodes===s.nodes)return;
  /* a day where nothing changed since the last snapshot isn't stored; only days with progress */
  const days=Object.keys(P.hist).sort();const last=days.length?P.hist[days[days.length-1]]:null;
  if(!cur&&last&&last.xp===s.xp&&last.mastered===s.mastered&&last.owned===s.owned&&last.nodes===s.nodes)return;
  P.hist[day]=s;const keep=Object.keys(P.hist).sort().slice(-400);if(keep.length<Object.keys(P.hist).length){const h={};keep.forEach(k=>h[k]=P.hist[k]);P.hist=h}saveProfile()}
setTimeout(histRecord,20e3);setInterval(histRecord,5*60e3);
function histData(){const days=Object.keys(P.hist||{}).sort();const pts=days.map(d=>({d,...P.hist[d]}));const now=histSnap();
  const ago=n=>{const t=new Date();t.setDate(t.getDate()-n);const key=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
    let best=null;for(const p of pts)if(p.d<=key)best=p;return best};
  const delta=n=>{const b=ago(n);return b?{xp:now.xp-b.xp,mastered:now.mastered-b.mastered,owned:now.owned-b.owned,nodes:now.nodes-b.nodes,since:b.d}:null};
  return {points:pts,now,week:delta(7),month:delta(30),first:days[0]||''}}
Object.assign(window.TF,{history:()=>histData()});
/* ---------- item stats on item pages (health, shields, armour, abilities; damage, crit, status, fire rate, melee) ---------- */
/* data/stats.json is built from WFCD by build/make_stats.py and only loaded when an item page first opens. */
const ST={data:null,busy:false,err:false};
function loadStats(){if(ST.data||ST.busy||ST.err)return;ST.busy=true;
  fetch('data/stats.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{ST.data=j}).catch(()=>{ST.err=true}).finally(()=>{ST.busy=false;
    if(typeof FRT!=='undefined')FRT.key='';if(typeof render==='function')render();tfNotify()})}
const DMG_L={impact:'Impact',puncture:'Puncture',slash:'Slash',heat:'Heat',cold:'Cold',electricity:'Electricity',toxin:'Toxin',blast:'Blast',radiation:'Radiation',gas:'Gas',magnetic:'Magnetic',viral:'Viral',corrosive:'Corrosive',void:'Void',tau:'Tau',true:'True'};
const pct=v=>Math.round(v*1000)/10+'%';
function statsHTML(name){if(!ST.data){loadStats();return ST.err?'':`<div class="small muted" style="padding:10px 14px">Loading stats…</div>`}
  const s=ST.data[name];if(!s)return '';const tile=(k,v,x)=>`<div class="tile" style="cursor:default"><span class="small muted">${k}</span><b class="num">${v}</b>${x?`<span class="small muted">${x}</span>`:''}</div>`;
  let h='';const t=[];
  if(s.h)t.push(tile('Health',fmt(s.h)));if(s.s)t.push(tile('Shields',fmt(s.s)));if(s.a)t.push(tile('Armor',fmt(s.a)));if(s.e)t.push(tile('Energy',fmt(s.e)));if(s.sp)t.push(tile('Sprint speed',s.sp));
  if(s.tot)t.push(tile('Damage',fmt(s.tot),s.ms&&s.ms>1?`×${s.ms} multishot`:''));if(s.cc!=null)t.push(tile('Critical chance',pct(s.cc),s.cm?`${s.cm}× damage`:''));if(s.sc!=null)t.push(tile('Status chance',pct(s.sc)));
  if(s.fr)t.push(tile(s.rng?'Attack speed':'Fire rate',s.fr+(s.rng?'':'/s')));if(s.mag)t.push(tile('Magazine',fmt(s.mag),s.rl?`${s.rl}s reload`:''));
  if(s.rng)t.push(tile('Range',s.rng+' m'));if(s.hv)t.push(tile('Heavy attack',fmt(s.hv),s.wu?`${s.wu}s wind-up`:''));if(s.sl)t.push(tile('Slam',fmt(s.sl)));
  if(s.cd)t.push(tile('Combo duration',s.cd+'s'));if(s.ft)t.push(tile('Follow-through',pct(s.ft)));if(s.ba)t.push(tile('Block angle',s.ba+'°'));
  if(s.dispo)t.push(tile('Riven disposition','●'.repeat(s.dispo)+'○'.repeat(Math.max(0,5-s.dispo)),['','Weakest','Weak','Average','Strong','Strongest'][s.dispo]||''));
  if(t.length)h+=`<div class="tiles">${t.join('')}</div>`;
  if(s.dmg&&Object.keys(s.dmg).length){const tot=Object.values(s.dmg).reduce((a,b)=>a+b,0)||1;
    h+=`<div class="kv" style="margin-top:10px">${Object.entries(s.dmg).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span>${DMG_L[k]||k}</span><span class="num">${v} <span class="small muted">(${Math.round(v/tot*100)}%)</span></span>`).join('')}</div>`}
  const extra=[s.trig?'Trigger: '+s.trig:'',s.noise?'Noise: '+s.noise:''].filter(Boolean).join(' · ');if(extra)h+=`<div class="small muted" style="margin-top:8px">${esc(extra)}</div>`;
  if(s.pass)h+=`<p class="small" style="margin:10px 0 0"><b>Passive.</b> ${esc(s.pass)}</p>`;
  if(s.ab&&s.ab.length)h+=`<ol class="small" style="margin:10px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:6px">${s.ab.map(([n,d])=>`<li><b>${esc(n)}.</b> ${esc(d)}</li>`).join('')}</ol>`;
  return `<details class="istats" open style="padding:10px 14px;border-top:1px solid var(--line)"><summary style="cursor:pointer;font-weight:600">Stats</summary><div style="margin-top:10px">${h}</div><div class="small muted" style="margin-top:8px">Base stats without mods, from WFCD game data.</div></details>`}
{const _it=itemTree;itemTree=function(name,opts){const h=_it.apply(this,arguments);if((opts&&opts.depth)||!I[name])return h;
  const st=statsHTML(name);if(!st)return h;const i=h.lastIndexOf('</section>');return i<0?h+st:h.slice(0,i)+st+h.slice(i)}}
/* ---------- what each mod does, a page for every mod, and a build's overall stats ---------- */
/* data/mods.json is built from WFCD by build/make_modinfo.py and only loaded when a build or a mod is opened. */
const MDI={data:null,busy:false,err:false};
function loadModInfo(){if(MDI.data||MDI.busy||MDI.err)return;MDI.busy=true;
  fetch('data/mods.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{MDI.data=j}).catch(()=>{MDI.err=true}).finally(()=>{MDI.busy=false;tfNotify()})}
/* one line saying what a mod does at max rank, for lists */
function modFx(n){if(!MDI.data){loadModInfo();return ''}const x=MDI.data[n];if(!x||!x.fx.length)return '';
  return x.fx.map(l=>l.replace(/\n/g,' ')).join(' · ').slice(0,140)}
{const _ms=modSlot;modSlot=function(slot,m,arc){const r=_ms(slot,m,arc);return {...r,pol:POL_L[r.pol]||r.pol,fx:modFx(m)}}}

const RAR_L={C:'Common',U:'Uncommon',R:'Rare',L:'Legendary',P:'Peculiar'};
const POL_L={madurai:'Madurai',vazarin:'Vazarin',naramon:'Naramon',zenurik:'Zenurik',unairu:'Unairu',penjaga:'Penjaga',umbra:'Umbra',aura:'Aura',universal:'Any'};
function modInfo(n){const arc=!!ARC[n]&&!MODS[n];const md=(arc?ARC[n]:MODS[n]);if(!md)return null;if(!MDI.data)loadModInfo();const x=(MDI.data||{})[n]||{};
  const p=PR[n]||{};const sl=(SEL[n]||[]).filter(s=>s[0]!=='__buy');const key=(arc?'arc|':'mod|')+n;
  return {n,arc,key,owned:on(key),loading:!MDI.data&&!MDI.err,type:md.ty||'',fits:x.fits||md.for||'',rarity:RAR_L[md.r]||'',polarity:arc?'':(POL_L[md.pol]||md.pol||''),
    rank:x.rk??(arc?md.mx:null),drain:x.dr??null,fx:x.fx||[],fx0:x.fx0||[],augment:!!md.aug,
    drops:(md.dr||[]).slice(0,8).map(d=>({where:d[0],chance:d[1]})),moreDrops:Math.max(0,(md.dr||[]).length-8),src:md.src||'',
    tradable:!!MS[n],wfm:MS[n]?'https://warframe.market/items/'+MS[n]:'',a7:p.a7??null,a30:p.a30??null,v7:p.v7??null,date:D.meta.prices||'',
    sellers:sl.slice(0,3).map(s=>({name:s[0],price:s[1],qty:s[2],rank:s[5]??null,status:s[4]==='ingame'?'In game':s[4]==='online'?'Online':'',whisper:whisper(n,s)}))}}

/* ---- overall stats: max-rank mods added up the way the game does, without conditional bonuses ---- */
const FRAME_ST=[['Ability Strength','str'],['Ability Duration','dur'],['Ability Efficiency','eff'],['Ability Range','rng']];
const FRAME_PCT=[['Health','Health'],['Shield Capacity','Shields'],['Armor','Armor'],['Energy Max','Energy'],['Sprint Speed','Sprint speed'],['Casting Speed','Casting speed']];
const PRIM_EL=['Heat','Cold','Electricity','Toxin'],PHYS_T=['Impact','Puncture','Slash'];
const COMBO={'Cold+Heat':'Blast','Electricity+Toxin':'Corrosive','Heat+Toxin':'Gas','Cold+Electricity':'Magnetic','Electricity+Heat':'Radiation','Cold+Toxin':'Viral'};
const WSTAT_K={'Damage':'dmg','Melee Damage':'dmg','Multishot':'ms','Critical Chance':'cc','Critical Damage':'cm','Status Chance':'sc','Fire Rate':'fr','Attack Speed':'fr',
  'Reload Speed':'rl','Magazine Capacity':'mag','Status Duration':'sd'};
/* split a mod's effect lines into always-on stat bonuses and everything else */
function fxParts(n){const x=(MDI.data||{})[n];const out={stats:[],cond:[]};if(!x)return out;
  for(const l of x.fx){const m=!l.includes('\n')&&l.match(/^([+-]?\d+(?:\.\d+)?)%\s+(.+?)(?:\s+\(x2 for [^)]+\))?$/);
    if(m)out.stats.push([m[2],+m[1]]);else out.cond.push(l.replace(/\n/g,' '))}
  return out}
function addElem(list,t,v){if(!v)return;const same=list.find(e=>e.t===t||(e.parts&&e.parts.includes(t)));if(same){same.v+=v;return}
  const single=PRIM_EL.includes(t)&&list.find(e=>PRIM_EL.includes(e.t)&&!e.parts);
  if(single){const c=COMBO[[single.t,t].sort().join('+')];single.parts=[single.t,t];single.t=c;single.v+=v;return}
  list.push({t,v})}
/* ov: the mods actually shown, when they differ from the saved build (the Warframes page's budget swap) */
function buildInsight(id,ov){const b=buildById(id);if(!b)return null;if(!MDI.data)loadModInfo();if(typeof ST!=='undefined'&&!ST.data)loadStats();
  const it=I[b.item]||{};const c=it.c||'';const kind=c==='Warframe'?'frame':['Primary','Secondary','Melee','Arch-Gun','Arch-Melee'].includes(c)?'weapon':'other';
  const ready=!!MDI.data&&(kind!=='weapon'&&kind!=='frame'||(typeof ST!=='undefined'&&!!ST.data));
  const mods=(ov?ov.mods:[b.aura,b.exilus,...(b.mods||[])]).filter(Boolean),arcs=(ov?ov.arcanes:(b.arcanes||[])).filter(Boolean);
  const res={ready,failed:MDI.err,kind,rows:[],elements:[],cond:[],highlights:[],missing:[]};if(!ready)return res;
  const sum={},physAdd={},elemSeq=[];
  for(const n of mods){if(!MDI.data[n]){res.missing.push(n);continue}const f=fxParts(n);
    for(const [k,v] of f.stats){if(PRIM_EL.includes(k))elemSeq.push([k,v]);else if(PHYS_T.includes(k))physAdd[k]=(physAdd[k]||0)+v;else sum[k]=(sum[k]||0)+v}
    f.cond.forEach(t=>res.cond.push({m:n,t}))}
  for(const n of arcs){const f=fxParts(n);[...f.stats.map(([k,v])=>`+${v}% ${k}`),...f.cond].forEach(t=>res.cond.push({m:n,t}))}
  const s=(typeof ST!=='undefined'&&ST.data&&ST.data[b.item])||null;const pc=v=>Math.round(v*10)/10+'%';
  if(kind==='frame'){
    for(const [k,key] of FRAME_ST){const v=sum[k]||0;if(!v)continue;let to=100+v;const capped=key==='eff'&&to>175;if(capped)to=175;
      res.rows.push({k,from:'100%',to:pc(to),note:capped?'capped at 175%':'',gain:to/100})}
    for(const [k,label] of FRAME_PCT){const v=sum[k];if(v)res.rows.push({k:label,from:'',to:(v>0?'+':'')+pc(v),note:'bonus',gain:1+v/100})}}
  if(kind==='weapon'&&s){const melee=c==='Melee'||c==='Arch-Melee';const D=(sum['Damage']||0)+(sum['Melee Damage']||0);
    const base=s.dmg||{};const tot=s.tot||Object.values(base).reduce((a,v)=>a+v,0);const types={};
    for(const [t,v] of Object.entries(base)){const T=DMG_L[t]||t;if(PHYS_T.includes(T))types[T]=v*(1+D/100)*(1+(physAdd[T]||0)/100)}
    const el=[];for(const [t,v] of elemSeq)addElem(el,t,tot*(1+D/100)*v/100);
    for(const [t,v] of Object.entries(base)){const T=DMG_L[t]||t;if(!PHYS_T.includes(T))addElem(el,T,v*(1+D/100))}
    res.elements=el.map(e=>({t:e.t,v:Math.round(e.v*10)/10,from:e.parts||null}));
    const hit=Object.values(types).reduce((a,v)=>a+v,0)+el.reduce((a,e)=>a+e.v,0);
    const f=k=>1+(sum[k]||0)/100;
    const ms0=s.ms||1,cc0=s.cc||0,cm0=s.cm||1,sc0=s.sc||0,fr0=s.fr||0;
    const ms=ms0*f('Multishot'),cc=cc0*f('Critical Chance'),cm=cm0*f('Critical Damage'),sc=sc0*f('Status Chance');
    const frM=melee?fr0*f('Attack Speed'):fr0*f('Fire Rate');
    const mag0=s.mag||0,mag=Math.round(mag0*f('Magazine Capacity')),rl0=s.rl||0,rl=rl0/f('Reload Speed');
    const avg=(h,m,c,x)=>h*m*(1+c*(x-1));const dps=(a,r,mg,re)=>melee||!mg?a*r:a*r*mg/(mg+r*re);
    const a0=avg(tot,ms0,cc0,cm0),a1=avg(hit,ms,cc,cm);
    const row=(k,from,to,gain,note)=>res.rows.push({k,from,to,gain,note:note||''});
    row('Damage per hit',fmt(Math.round(tot)),fmt(Math.round(hit)),hit/(tot||1));
    if(!melee||ms!==ms0)row('Multishot',ms0.toFixed(1)+'×',ms.toFixed(1)+'×',ms/ms0);
    row('Critical chance',pc(cc0*100),pc(cc*100),cc/(cc0||1),cc>1?'orange crits':'');
    row('Critical multiplier',cm0.toFixed(1)+'×',cm.toFixed(1)+'×',cm/cm0);
    row('Status chance',pc(sc0*100),pc(sc*100),sc/(sc0||1));
    if(frM!==fr0)row(melee?'Attack speed':'Fire rate',fr0.toFixed(2),frM.toFixed(2),frM/fr0);
    if(mag0&&mag!==mag0)row('Magazine',fmt(mag0),fmt(mag),mag/mag0);
    if(rl0&&Math.abs(rl-rl0)>.005)row('Reload',rl0.toFixed(2)+'s',rl.toFixed(2)+'s',rl0/rl);
    row('Average damage per '+(melee?'swing':'shot'),fmt(Math.round(a0)),fmt(Math.round(a1)),a1/(a0||1),'with crits');
    const d0=dps(a0,fr0,mag0,rl0),d1=dps(a1,frM,mag,rl);
    if(d0)row(melee?'Damage per second':'Sustained damage per second',fmt(Math.round(d0)),fmt(Math.round(d1)),d1/d0,melee?'before combo':'with reloads');}
  /* why it works: the biggest changes, the elements it ends up dealing, and what's left out of the numbers */
  const sum1=res.rows.find(r=>/^(Sustained damage|Damage) per second$/.test(r.k))||res.rows.find(r=>r.k.startsWith('Average damage'));
  if(sum1&&sum1.gain>1.05)res.highlights.push(`About ${Math.round(sum1.gain)<10?Math.round(sum1.gain*10)/10:fmt(Math.round(sum1.gain))}× the damage of an unmodded ${b.item} (${sum1.to} ${sum1.k.toLowerCase()})`);
  const top=res.rows.filter(r=>r.gain>1.05&&r.from&&!/damage per (second|shot|swing)/i.test(r.k)).sort((a,b)=>b.gain-a.gain).slice(0,3);
  for(const r of top)res.highlights.push(`${r.k} goes from ${r.from} to ${r.to}`);
  if(res.elements.length)res.highlights.push('Deals '+res.elements.map(e=>e.t+(e.from?` (${e.from.join(' + ')})`:'')).join(' and ')+(kind==='weapon'?' on top of its physical damage':''));
  if(b.helminth)res.highlights.push('Helminth: '+b.helminth);
  if(res.cond.length)res.highlights.push(`${res.cond.length} more ${res.cond.length===1?'effect kicks':'effects kick'} in during a fight (on kill, on status and so on); they stack on top of the numbers here`);
  return res}

Object.assign(window.TF,{modInfo:n=>modInfo(n),buildInsight:(id,ov)=>buildInsight(id,ov)});
/* ---------- "Safe to sell?": what you'd lose by selling an item, shown on its page and in the sell dialog ---------- */
/* Built from the game data the site already has: crafting recipes (another weapon needs this one), vault status,
   where the item comes from, and your own mastery. Nothing here is fetched. */
let USEDIN=null;
function usedIn(n){if(!USEDIN){USEDIN={};for(const k in I)for(const p of I[k].parts||[])if(I[p.n]&&p.n!==k){const a=USEDIN[p.n]=USEDIN[p.n]||[];if(!a.includes(k))a.push(k)}}
  return USEDIN[n]||[]}
const FOUNDER=['Excalibur Prime','Lato Prime','Skana Prime'];
function limitedNote(n){const it=I[n];if(!it)return '';
  if(FOUNDER.includes(n))return 'Founders item: it can never be obtained again.';
  if(/\/VoidTrader\//.test(it.u)||/^Prisma /.test(n)||n==='Mara Detron')return "Only sold by Baro Ki'Teer, and he brings it back rarely.";
  if(/^Dex /.test(n))return 'Anniversary login reward: offered again only at a later anniversary.';
  if(/ (Wraith|Vandal)$/.test(n))return 'Limited: Wraith and Vandal weapons come from events and rare rewards, and can be gone for years.';
  if(it.p&&it.v&&!(VAULT[n]&&VAULT[n].now))return 'Vaulted: its relics no longer drop. Getting it again means trading or waiting for Prime Resurgence.';
  return ''}
/* each check: [level, text]; level 'stop' = you'd lose something, 'warn' = think first, 'ok' = fine */
function sellCheck(n){const base=n.replace(/ Set$/,'');const it=I[base];if(!it)return null;const out=[];
  for(const x of usedIn(base)){const done=on('m|'+x)||on('build|'+x);
    out.push([done?'ok':'stop',done?`Used to build ${x}, which you already have.`:`Needed to build ${x}. Keep it if you still want ${x}.`])}
  if(!on('m|'+base))out.push(['warn',n.endsWith(' Set')?`You haven't mastered ${base} yet. Build and level it first, or you'll need another set later for its mastery.`:`Not mastered yet. Level it to max rank first: you keep the mastery after selling.`]);
  const lim=limitedNote(base);if(lim)out.push(['warn',lim]);
  const level=out.some(c=>c[0]==='stop')?'stop':out.some(c=>c[0]==='warn')?'warn':'ok';
  return {level,checks:out}}
function sellCheckHTML(n){const s=sellCheck(n);if(!s)return '';
  const cls={stop:'bad',warn:'warn',ok:'ok'},lab={stop:'Keep it',warn:'Check first',ok:'Safe to sell'};
  return `<section class="obj"><div class="obj-h"><div class="title"><h3>Before you sell</h3><span class="chip ${cls[s.level]}">${lab[s.level]}</span></div></div>
  <div style="padding:10px 14px" class="small stack">${s.checks.length?s.checks.map(c=>`<div>${c[0]==='stop'?'<b>Keep it:</b> ':c[0]==='warn'?'<b>Note:</b> ':''}${esc(c[1])}</div>`).join(''):'<div>Nothing else needs it, it isn\'t limited, and you\'ve mastered it.</div>'}</div></section>`}
{const _d=detail;detail=function(sel){const h=_d(sel);return sel.startsWith('item|')&&h?h+sellCheckHTML(sel.slice(5)):h}}
{const _s=sellData;sellData=function(){const d=_s();if(!d)return d;const s=sellCheck(d.n);return {...d,safe:s?{level:s.level,checks:s.checks.map(c=>({level:c[0],text:c[1]}))}:null}}}
Object.assign(window.TF,{sellCheck:n=>sellCheck(n)});
/* ---------- Duviri Circuit forecast: which Warframes and Incarnon Genesis adapters are offered in the coming weeks ---------- */
/* Both lists rotate on a fixed cycle every Monday 00:00 UTC (wiki: The Circuit). The live feed gives this week's picks;
   when it disagrees with the cycle (DE added or reordered rewards), this week shows the live picks and the forecast says so. */
const CIR_WF=[['Excalibur','Trinity','Ember'],['Loki','Mag','Rhino'],['Ash','Frost','Nyx'],['Saryn','Vauban','Nova'],['Nekros','Valkyr','Oberon'],['Hydroid','Mirage','Limbo'],
  ['Mesa','Chroma','Atlas'],['Ivara','Inaros','Titania'],['Nidus','Octavia','Harrow'],['Gara','Khora','Revenant'],['Garuda','Baruuk','Hildryn']];
const CIR_INC=[['Braton','Lato','Skana','Paris','Kunai'],['Boar','Gammacor','Angstrum','Gorgon','Anku'],['Bo','Latron','Furis','Furax','Strun'],['Lex','Magistar','Boltor','Bronco','Ceramic Dagger'],
  ['Torid','Dual Toxocyst','Dual Ichor','Miter','Atomos'],['Ack & Brunt','Soma','Vasto','Nami Solo','Burston'],['Zylok','Sibear','Dread','Despair','Hate'],['Dera','Sybaris','Cestra','Sicarus','Okina'],
  ['Vectis','Stug','Ballistica','Destreza','Obex']];
const CIR_ANCHOR=Date.UTC(2026,9,5),CIR_WF0=3,CIR_INC0=5;  /* week of Mon 5 Oct 2026: Saryn/Vauban/Nova and Ack & Brunt…Burston */
const cirKey=s=>String(s).replace(/&/g,'and').replace(/[^a-z]/gi,'').toLowerCase();
const pmod=(a,m)=>((a%m)+m)%m;
function circuitData(){const wk0=lastWeekly(),now=Date.now();const off=Math.round((wk0-CIR_ANCHOR)/(7*DAY));
  const live=WS&&WS.duviriCycle&&WS.duviriCycle.choices;const pick=c=>(live&&(live.find(x=>x.category===c)||{}).choices)||null;
  const lwf=pick('normal'),linc=pick('hard');const same=(a,b)=>!a||a.map(cirKey).sort().join()===b.map(cirKey).sort().join();
  let changed=false;const weeks=[];
  for(let i=0;i<10;i++){const start=wk0+i*7*DAY;let wf=CIR_WF[pmod(CIR_WF0+off+i,CIR_WF.length)],inc=CIR_INC[pmod(CIR_INC0+off+i,CIR_INC.length)];
    if(i===0){if(lwf&&!same(lwf,wf)){changed=true;wf=lwf.map(k=>CIR_WF.flat().find(n=>cirKey(n)===cirKey(k))||k)}
      if(linc&&!same(linc,inc)){changed=true;inc=linc.map(k=>CIR_INC.flat().find(n=>cirKey(n)===cirKey(k))||k)}}
    const frames=wf.map(n=>({n,img:I[n]?IMG(n):'',owned:ownedItem(n),prime:ownedItem(n+' Prime'),mastered:on('m|'+n)}));
    const adapters=inc.map(n=>({n,full:n+' Incarnon Genesis',key:'inc|'+n,have:on('inc|'+n),weapon:I[n]?ownedItem(n)||ownedItem(n+' Prime'):false,img:I[n]?IMG(n):''}));
    const need=frames.filter(f=>!f.owned).length+adapters.filter(a=>!a.have).length;
    weeks.push({start:new Date(start).toISOString(),label:i===0?'This week':i===1?'Next week':new Date(start).toLocaleDateString([],{month:'short',day:'numeric',timeZone:'UTC'}),
      endsIn:i===0?left(start+7*DAY-now):'',startsIn:i>0?left(start-now):'',frames,adapters,need})}
  const have=Object.keys(CIR_INC.flat().reduce((o,n)=>(on('inc|'+n)&&(o[n]=1),o),{})).length;
  return {weeks,changed,live:!!live,adaptersHave:have,adaptersTotal:CIR_INC.flat().length}}
Object.assign(window.TF,{circuit:()=>circuitData()});
/* the checklist's Circuit row shows this week's picks */
{const _cl=ckLiveData;ckLiveData=function(c){if(c[1]!=='circuit')return _cl(c);const w=circuitData().weeks[0];
  return {head:'This week: '+w.frames.map(f=>f.n).join(', '),list:[{t:'Steel Path',s:w.adapters.map(a=>a.n).join(', '),n:'Incarnon Genesis adapters'}]}}}
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
/* ---------- Prime Resurgence watchlist: star any Prime and get an alert when Varzia brings it back ---------- */
const watchList=()=>Array.isArray(P.watch)?P.watch:[];
function watchToggle(n){const w=watchList().filter(x=>x!==n);if(w.length===watchList().length)w.push(n);P.watch=w;saveProfile();
  if(typeof FFD!=='undefined')FFD.key='';tfNotify();toast(w.includes(n)?`Watching ${n}. You'll get an alert when it's in Prime Resurgence.`:`Stopped watching ${n}.`)}
{const _m=marketData;marketData=function(){const out=_m();if(out.tab!=='vault')return out;const W=watchList();
  const mark=c=>({...c,watched:W.includes(c.n)});['now','farm','vault'].forEach(k=>{out[k]=(out[k]||[]).map(mark)});
  const all=[...out.now,...out.farm,...out.vault];out.watch=W.map(n=>all.find(c=>c.n===n)).filter(Boolean);return out}}
{const _a=alertsAll;alertsAll=function(){const out=_a();if(!alertPrefs().resurgence)return out;
  const back=watchList().filter(n=>VAULT[n]&&VAULT[n].now);
  if(back.length){const until=VAULT[back[0]].now;out.unshift({id:'watch:'+until+':'+back.slice().sort().join(','),kind:'resurgence',title:`Back in Prime Resurgence: ${back.length===1?back[0]:back.length+' Primes you watch'}`,
    text:`Varzia has their relics until ${fdate(until)}. Buy them with Aya or Regal Aya.`,items:back.slice(0,6),href:'market'})}
  return out}}
/* item pages: a Watch button and the item's Resurgence status, for Primes */
function watchHTML(n){const it=I[n];if(!it||!it.p)return '';const v=VAULT[n]||{},w=watchList().includes(n);
  const st=v.now?`In Prime Resurgence now, until ${fdate(v.now)}.`:!it.v?'Not vaulted: its relics drop now.':`Vaulted.${v.last?` Last in Resurgence ${fdate(v.last)}.`:''}${v.est?` Rough estimate for its return: ${fdate(v.est)}.`:''}`;
  return `<section class="obj"><div class="obj-h"><div class="title"><h3>Prime Resurgence</h3><span style="margin-left:auto"><button type="button" class="btn sm" data-watch="${esc(n)}" aria-pressed="${w}">${w?'Watching':'Watch'}</button></span></div></div>
  <div style="padding:10px 14px" class="small">${esc(st)} ${w?'You\'ll get an alert on Home and Today when it comes back.':'Watch it to get an alert when it comes back.'}</div></section>`}
{const _d=detail;detail=function(sel){const h=_d(sel);return sel.startsWith('item|')&&h?h+watchHTML(sel.slice(5)):h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-watch]');if(b){e.preventDefault();watchToggle(b.getAttribute('data-watch'))}});
Object.assign(window.TF,{watchToggle:n=>watchToggle(n)});
/* ---------- Coming back after a break: what's new since you stopped, and the quests to play next, in order ---------- */
/* Dates are PC release dates from the wiki's update list (Module:Version/data). Quests are ticked from your own progress. */
const RET_UPD=[
  ['2019-11-22','Rising Tide','Build your own Railjack in the Dry Dock.'],
  ['2019-12-13','Empyrean','Railjack missions with your crew.'],
  ['2020-03-05','Warframe Revised','Shield gating and no more self-damage.'],
  ['2020-06-11','The Deadlock Protocol','Corpus ship remaster, Granum Void and Protea.'],
  ['2020-07-08','The Steel Path','Hard mode for the whole star chart, with Steel Essence and Teshin.'],
  ['2020-08-25','Heart of Deimos','Cambion Drift open world, Necramechs and the Helminth.'],
  ['2021-03-19','Corpus Proxima & The New Railjack','Railjack overhaul: Plexus and Command intrinsics.'],
  ['2021-04-13','Call of the Tempestarii','Void Storms (Railjack fissures) and Sevagoth.'],
  ['2021-07-06','Sisters of Parvos','The Corpus version of Kuva Liches, with Tenet weapons.'],
  ['2021-12-15','The New War','The big story quest. Unlocks the Drifter and most later content.'],
  ['2022-04-27','Angels of the Zariman','Zariman Ten Zero, the first Incarnon weapons and a Focus rework.'],
  ['2022-09-07','Veilbreaker','Weekly Archon Hunts, Archon Shards and Kahl\'s Garrison.'],
  ['2023-04-26','The Duviri Paradox','Duviri, the Drifter and the Circuit, where Incarnon Genesis adapters come from.'],
  ['2023-06-21','The Seven Crimes of Kullervo','Overguard on Warframe abilities.'],
  ['2023-12-13','Whispers in the Walls','Sanctum Anatomica, Cavia, Netracells and Deep Archimedea. Cross-platform saves.'],
  ['2024-03-27','Dante Unbound','Dante, Omnia fissures and Ascent Fusion for Archon Shards.'],
  ['2024-06-18','Jade Shadows','Jade, Ascension missions and a rework of status effects and resistances.'],
  ['2024-08-21','The Lotus Eaters','A short quest that leads to The Hex and The Old Peace.'],
  ['2024-10-02','Koumei & the Five Fates','Koumei and a companion rework.'],
  ['2024-12-13','Warframe: 1999','Höllvania, The Hex, Protoframes and the KIM chatroom.'],
  ['2025-03-19','Techrot Encore','Technocyte Coda adversaries and Temporal Archimedea.'],
  ['2025-06-25','Isleweaver','A new Duviri node and Oraxia.'],
  ['2025-10-15','The Vallis Undermind','The Deepmines under Fortuna, Nokko and an Oberon rework.'],
  ['2025-12-10','The Old Peace','The current story quest: La Cathédrale, The Descendia and Uriel.'],
  ['2026-03-25','The Shadowgrapher','Follie, and several old grinds made shorter.'],
  ['2026-06-17','Jade Shadows: Constellations','Uranus Proxima and Steel Path Railjack.'],
  ['2026-09-23','Iceblade of Narin','Yuvan Peak hub, Narin, a Banshee rework and Riven trait locking.'],
  ['2026-10-07','The Icebind','A 6-player mode and Riven splicing.']];
/* the main quests in an order that respects their prerequisites: [quest, why it matters, release date if it came out after 2019] */
const RET_Q=[
  ['The War Within','Unlocks Kuva farming and Sorties.',''],['Rising Tide','Your own Railjack, needed for The New War.','2019-11-22'],['Chains of Harrow','',''],['Apostasy Prologue','',''],['The Sacrifice','',''],
  ['Chimera Prologue','',''],['Erra','','2019-12-13'],['The Maker','Last step before The New War.','2020-03-24'],
  ['Heart of Deimos','Unlocks the Cambion Drift and the Helminth.','2020-08-25'],['The Deadlock Protocol','','2020-06-11'],['Call of the Tempestarii','Unlocks Void Storms.','2021-04-13'],
  ['The New War','Unlocks the Drifter, Archon Hunts and nearly everything after it.','2021-12-15'],['Angels of the Zariman','Incarnon weapons and the Zariman.','2022-04-27'],['Veilbreaker','Archon Hunts and Archon Shards.','2022-09-07'],
  ['The Duviri Paradox','The Circuit and Incarnon Genesis adapters. Needed for The Hex.','2023-04-26'],['Whispers in the Walls','Netracells and Deep Archimedea.','2023-12-13'],['Jade Shadows','','2024-06-18'],['Jade Shadows: Constellations','Steel Path Railjack.','2026-06-17'],
  ['The Lotus Eaters','Short, and unlocks The Hex and The Old Peace.','2024-08-21'],['The Hex','Höllvania and the 1999 chatroom.','2024-12-13'],['The Old Peace','The latest story quest.','2025-12-10']];
const RET_FROM=[['2019-06-01','Before 2020'],['2020-01-01','2020'],['2021-01-01','2021'],['2022-01-01','2022'],['2023-01-01','2023'],['2024-01-01','2024'],['2025-01-01','Early 2025'],['2025-07-01','Mid 2025'],['2026-01-01','Early 2026'],['2026-06-01','Mid 2026']];
function returningData(){const from=lsGet('tf-ret-from','')||'';const updates=from?RET_UPD.filter(u=>u[0]>=from).map(([d,n,t])=>({date:fdate(d),n,t})):[];
  const quests=RET_Q.map(([n,why,d])=>{return {n,why,done:qDone(n),isNew:!!from&&!!d&&d>=from}});
  /* with no quest progress at all (never synced, nothing ticked), assume the quests that were out before you stopped are done */
  const known=!!P.at||quests.some(q=>q.done);const todo=quests.filter(q=>!q.done&&(known||!from||q.isNew));
  return {from,options:RET_FROM.map(([value,label])=>({value,label})),updates,quests:todo.slice(0,8),moreQuests:Math.max(0,todo.length-8),questsDone:quests.filter(q=>q.done).length,questsTotal:quests.length,synced:!!P.at,assumed:!known&&!!from}}
Object.assign(window.TF,{returning:()=>returningData(),returningSet:v=>{lsSet('tf-ret-from',String(v||''));tfNotify()}});
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
/* ---------- warframe.market price history and price alerts ---------- */
/* History: 90 days of daily average prices per item, saved by the daily price refresh from the statistics it already
   downloads, and fetched only when a chart opens. Alerts: "tell me when X is below N platinum", checked against each
   day's snapshot (the cheapest seller if there is one, else the 7-day average). Nothing extra is asked of warframe.market. */
let PH=null;
LAZY.pricehist={done:false,busy:false,err:false,demand:true,url:()=>D.hist,add:j=>{PH=j}};
function priceHist(n){if(!D.hist)return {state:'none',points:[]};if(!PH){lazyLoad('pricehist');return {state:LAZY.pricehist.err?'error':'loading',points:[]}}
  const h=PH[n];if(!h)return {state:'empty',points:[]};const d0=new Date(h[0]+'T00:00:00Z').getTime();
  const points=h[1].map((p,i)=>({d:new Date(d0+i*DAY).toISOString().slice(0,10),p}));const vals=points.map(x=>x.p).filter(x=>x!=null);
  return {state:'ok',points,min:Math.min(...vals),max:Math.max(...vals),first:vals[0],last:vals[vals.length-1]}}
const palerts=()=>P.palerts&&typeof P.palerts==='object'?P.palerts:{};
/* today's price for an alert: the cheapest seller in the snapshot, else the 7-day average */
function nowPrice(n){const sl=(SEL[n]||[]).filter(s=>s[0]!=='__buy');if(sl.length)return {p:sl[0][1],how:'cheapest seller'};const a=(PR[n]||{}).a7;return a!=null?{p:Math.round(a),how:'7-day average'}:null}
function priceAlertSet(n,below){const a={...palerts()};if(below==null||!(+below>0))delete a[n];else a[n]=Math.round(+below);P.palerts=a;saveProfile();tfNotify()}
function priceAlertsData(){const a=palerts();return {date:D.meta.prices||'',list:Object.keys(a).sort().map(n=>{const c=nowPrice(n);return {n,below:a[n],now:c?c.p:null,how:c?c.how:'',hit:!!c&&c.p<=a[n],url:MS[n]?'https://warframe.market/items/'+MS[n]:''}})}}
function priceSuggest(q){q=String(q||'').toLowerCase().trim();if(q.length<2)return [];const a=palerts();
  return Object.keys(MS).filter(n=>n.toLowerCase().includes(q)&&!(n in a)).sort((x,y)=>(x.toLowerCase().startsWith(q)?0:1)-(y.toLowerCase().startsWith(q)?0:1)||x.length-y.length).slice(0,8)}
{const _a=alertsAll;alertsAll=function(){const out=_a();const hits=priceAlertsData().list.filter(x=>x.hit);
  if(hits.length)out.push({id:'price:'+(D.meta.prices||'')+':'+hits.map(x=>x.n).join(','),kind:'price',title:hits.length===1?`${hits[0].n} is ${hits[0].now}p`:`${hits.length} items hit your price alerts`,
    text:hits.length===1?`At or below your ${hits[0].below}p alert (${hits[0].how}, warframe.market snapshot of ${D.meta.prices}).`:`At or below the prices you set (warframe.market snapshot of ${D.meta.prices}).`,
    items:hits.slice(0,6).map(x=>`${x.n}: ${x.now}p (alert at ${x.below}p)`),href:'market'});
  return out}}
Object.assign(window.TF,{priceHist:n=>priceHist(n),priceAlerts:()=>priceAlertsData(),priceAlert:(n,below)=>priceAlertSet(n,below),priceSuggest:q=>priceSuggest(q)});
/* ---------- chat and friend notifications ---------- */
/* Built on what the site already listens to when you're signed in (your inbox and your group chats), plus a community room
   while it's open. New direct messages, group messages, friend requests and new friends show a notification: a system one
   when Tennoform is in the background (through a tiny service worker, which is what phones need), a toast while you're
   looking at the site. Never for the conversation you're reading. Each kind can be switched off, any chat can be muted,
   and "silent" shows them without a sound. Nothing here sends anything anywhere. */
const NTF_DEF={on:false,sound:true,dm:true,group:true,friend:true,room:false,mute:{}};
const ntfPrefs=()=>({...NTF_DEF,...(P.notif||{}),mute:{...((P.notif||{}).mute||{})}});
function ntfSet(o){P.notif={...ntfPrefs(),...o};saveProfile();if(P.notif.on)ntfWorker();tfNotify()}
const ntfPerm=()=>typeof Notification==='undefined'?'unsupported':Notification.permission;
let NTF_SW=null;
function ntfWorker(){if(NTF_SW||!('serviceWorker' in navigator))return NTF_SW;NTF_SW=navigator.serviceWorker.register('/sw.js',{scope:'/'}).then(()=>navigator.serviceWorker.ready).catch(()=>null);return NTF_SW}
async function ntfEnable(){if(typeof Notification==='undefined'){toast("This browser can't show notifications. On iPhone, add Tennoform to your Home Screen first.");return false}
  const p=Notification.permission==='granted'?'granted':await Notification.requestPermission();
  if(p!=='granted'){toast('Notifications are blocked for this site. Allow them in your browser settings to turn this on.');ntfSet({on:false});return false}
  ntfSet({on:true});await ntfWorker();return true}
/* the conversation on screen right now, if any: no notification for it */
function ntfViewing(conv){if(document.visibilityState!=='visible')return false;const h=location.hash;
  if(conv.startsWith('room:'))return h==='#chat';return h==='#friends'&&state.chat===conv.replace(/^dm:/,'')}
async function ntfShow(title,body,conv,url){const pr=ntfPrefs();
  if(document.visibilityState==='visible'&&document.hasFocus()){if(!ntfViewing(conv))toast(title+': '+body.slice(0,90));return}
  if(ntfPerm()!=='granted')return;const opt={body:body.slice(0,180),tag:conv,renotify:true,silent:!pr.sound,icon:'/icon-192.png',badge:'/icon-192.png',data:{url}};
  try{const reg=await ntfWorker();if(reg&&reg.showNotification){await reg.showNotification(title,opt);return}}catch(e){}
  try{const n=new Notification(title,opt);n.onclick=()=>{window.focus();location.hash=url.replace(/^.*#/,'');n.close()}}catch(e){}}
/* only things newer than when this page started listening, and each one once */
const NTF_START=Date.now();const NTF_SEEN=new Set();
function ntfScan(){const pr=ntfPrefs();if(!pr.on||typeof SO==='undefined'||!SO.uid)return;
  const fresh=(id,at)=>at>NTF_START&&!NTF_SEEN.has(id)&&(NTF_SEEN.add(id),true);
  for(const m of SO.inbox||[]){if(m.from===SO.uid||!fresh('i:'+m.id,m.at||0))continue;if(typeof blocked==='function'&&blocked(m.from))continue;const who=m.fromName||'A friend';
    if(m.type==='friend'&&pr.friend)ntfShow('Friend request',`${who} wants to add you as a friend.`,'freq:'+m.from,'/#friends');
    else if(m.type==='accept'&&pr.friend)ntfShow('New friend',`${who} accepted your friend request. You can message them now.`,'fnew:'+m.from,'/#friends');
    else if((m.type==='msg'||m.type==='task')&&pr.dm&&!pr.mute['dm:'+m.from]&&!ntfViewing('dm:'+m.from))ntfShow(who,m.type==='task'?'Invited you to a task'+(m.task&&m.task.t?': '+m.task.t:''):(m.text||'Sent you a message'),'dm:'+m.from,'/#friends')}
  for(const g of SO.groups||[])for(const m of (SO.gm&&SO.gm[g.id])||[]){if(m.from===SO.uid||!fresh('g:'+g.id+':'+m.id,m.at||0))continue;
    if(m.type==='sys'||!pr.group||pr.mute['g:'+g.id]||ntfViewing('g:'+g.id))continue;
    ntfShow(g.name||'Group chat',`${m.fromName||'Someone'}: ${m.text||'sent something'}`,'g:'+g.id,'/#friends')}
  if(pr.room&&typeof CM!=='undefined'&&CM.sub&&!pr.mute['room:'+CM.sub])for(const m of CM.msgs||[]){if(m.uid===SO.uid||!fresh('r:'+m.id,m.at||0))continue;
    if(!ntfViewing('room:'+CM.sub))ntfShow('Community chat',`${m.name||'Someone'}: ${m.text||'sent something'}`,'room:'+CM.sub,'/#chat')}}
setInterval(ntfScan,2000);
if(ntfPrefs().on&&ntfPerm()==='granted')ntfWorker();
function ntfData(){const pr=ntfPrefs();const cur=state.chat?(state.chat.startsWith('g:')?state.chat:'dm:'+state.chat):'';
  return {...pr,perm:ntfPerm(),worker:'serviceWorker' in navigator,ios:/iPhone|iPad/.test(navigator.userAgent)&&!(navigator.standalone||matchMedia('(display-mode: standalone)').matches),current:cur,currentMuted:!!(cur&&pr.mute[cur])}}
Object.assign(window.TF,{notif:()=>ntfData(),notifSet:o=>ntfSet(o),notifEnable:()=>ntfEnable(),
  notifMute:(conv,v)=>{const m={...ntfPrefs().mute};if(v)m[conv]=1;else delete m[conv];ntfSet({mute:m})},
  notifTest:()=>{if(ntfPerm()!=='granted'){toast('Turn notifications on first.');return}const opt={body:'This is how chat notifications will look.',tag:'test',silent:!ntfPrefs().sound,icon:'/icon-192.png',data:{url:'/#friends'}};
    ntfWorker()&&NTF_SW.then(r=>r?r.showNotification('Tennoform',opt):new Notification('Tennoform',opt)).catch(()=>{try{new Notification('Tennoform',opt)}catch(e){}})}});
/* ---------- Conservation: every animal you can capture in the open worlds ----------
   From the Warframe wiki (Conservation and each species page), checked October 2026. Standing numbers are for a
   Perfect capture of the common / rare / very rare variant. Where the wiki gives no time of day, none is shown. */
const CONSERVATION={
  steps:[
    'Buy the Tranq Rifle (500 standing) from The Business in Fortuna or Son in the Necralisk. Master Teasonai in Cetus does not sell it.',
    'Buy an Echo-Lure for each animal from that world\'s vendor (Teasonai, The Business or Son). Lures are reusable.',
    'Optional: a Pheromone (Oota, Synthesizer or Gland) makes rare variants far more likely: about 33% rare and 67% very rare instead of 29% and 14%.',
    'Equip a lure or the rifle in Arsenal > Gear. Holding the rifle shows trail starts as diamonds on the map and minimap.',
    'Interact with the tracks, follow the footprints to the calling point, then use the lure and keep the pitch inside the brackets by aiming up or down.',
    'Hide downwind and out of sight, then tranq it. Darts are silent but slow, so lead moving targets.',
    'Perfect capture: it never noticed you and no abilities were used (Ivara\'s Quiver, Navigator and Prowl, Baruuk\'s Lull and Equinox\'s Rest are allowed). Good: it saw or smelled you. Bad: it was hurt or it took too long.',
    'Captures give standing (Plains and Vallis) and species tags. Trade tags with the vendor for Floofs, emblems and Beast Claw mods. Resource Boosters and the Retriever mods give more tags.'],
  worlds:[
  {world:'Plains of Eidolon',vendor:'Master Teasonai (Ostron), Cetus',species:[
    {n:'Kuaka',variants:['Plains','Ashen','Ghost'],rare:['Ashen','Ghost'],where:'Open grassland. The rare variants live in the caves.',time:'Any time',lure:'Kuaka Echo-Lure, Neutral with the Ostron',reward:'400 / 600 / 1,200 standing and tags. A lure always calls three.',tip:'Tranq the one at the back first so the group doesn\'t see the others drop.'},
    {n:'Condroc',variants:['Common','Rogue','Emperor'],rare:['Rogue','Emperor'],where:'Across the Plains. It flies in; roaming ones are often already on the ground.',time:'Rogue Condroc only spawns during the day',lure:'Condroc Echo-Lure, Offworlder with the Ostron',reward:'800 / 1,200 / 1,800 standing and tags',tip:'Wait until it lands at the calling point before you shoot.'},
    {n:'Mergoo',variants:['Coastal','Woodland','Splendid'],rare:['Woodland','Splendid'],where:'Coasts, lakes and other large water.',time:'Any time',lure:'Mergoo Echo-Lure, Visitor with the Ostron',reward:'1,200 / 2,400 / 3,600 standing and tags, the best standing on the Plains',tip:'Search the lakeshores and shoot once it has landed.'},
    {n:'Vasca Kavat',variants:['Ostia','Bau','Nephil'],rare:['Bau','Nephil'],where:'Across the Plains.',time:'Night only',lure:'Vasca Kavat Echo-Lure, Trusted with the Ostron',reward:'500 / 1,000 / 1,500 standing and tags',tip:'Sleep abilities last half as long on it, so use the rifle.'}]},
  {world:'Orb Vallis',vendor:'The Business (Solaris United), Fortuna',species:[
    {n:'Pobber',variants:['Sunny','Delicate','Subterranean'],rare:['Delicate','Subterranean'],where:'Fungal forests and mushroom groves. Subterranean only comes to a lure.',lure:'Pobber Echo-Lure, Neutral with Solaris United',reward:'400 / 600 / 800 standing and tags. A lure always calls three.',tip:'Head for the mushroom groves.'},
    {n:'Virmink',variants:['White-Breasted','Dusky-Headed','Red-Crested'],rare:['Dusky-Headed','Red-Crested'],where:'Rocky ground.',lure:'Virmink Echo-Lure, Outworlder with Solaris United',reward:'600 / 800 / 1,000 standing and tags',tip:'Check rocky ground near Pobber groups.'},
    {n:'Sawgaw',variants:['Flossy','Alpine Monitor','Frogmouthed'],rare:['Alpine Monitor','Frogmouthed'],where:'Cliffs and fungal groves. It perches on giant mushrooms.',lure:'Sawgaw Echo-Lure, Rapscallion with Solaris United',reward:'800 / 1,200 / 1,800 standing and tags',tip:'Look up at the mushroom caps.'},
    {n:'Bolarola',variants:['Spotted','Black-Banded','Thorny'],rare:['Black-Banded','Thorny'],where:'Cratered and stormy areas.',lure:'Bolarola Echo-Lure, Doer with Solaris United',reward:'1,000 / 1,500 / 2,500 standing and tags',tip:'Its armour blocks darts. Shoot the belly when it leans back.'},
    {n:'Horrasque',variants:['Dappled','Swimmer','Stormer'],rare:['Swimmer','Stormer'],where:'Burrows underground. Its trail is toxic scat.',lure:'Horrasque Echo-Lure, Cove with Solaris United',reward:'1,200 / 2,400 / 3,600 standing and tags. Takes two darts.',tip:'Wait until it has fully surfaced at the calling point.'},
    {n:'Stover',variants:['Sentinel','Fuming Dax','Fire-Veined'],rare:['Fuming Dax','Fire-Veined'],where:'Caves.',lure:'Stover Echo-Lure, Cove with Solaris United',reward:'1,600 / 3,200 / 6,400 standing and tags. Takes two darts.',tip:'It attacks you. Clear the cave first and keep your distance.'},
    {n:'Kubrodon',variants:['Brindle','Vallis','Incarnadine'],rare:['Vallis','Incarnadine'],where:'Across the Vallis. Incarnadine only comes to a lure.',lure:'Kubrodon Echo-Lure, Old Mate with Solaris United',reward:'2,000 / 4,000 / 8,000 standing and tags, the most of any animal. Takes two darts.',tip:'It has a strong sense of smell, so stay downwind.'}]},
  {world:'Cambion Drift',vendor:'Son (Entrati), Necralisk',species:[
    {n:'Cryptilex',variants:['Burrowing','Septic','Caustic'],rare:['Septic','Caustic'],where:'Caves, including the Catabolic Gutter.',time:'Any time',lure:'Cryptilex Echo-Lure, Neutral with the Entrati',reward:'Tags (Perfect 3, Good 2, Bad 1) to trade with Son',tip:'It is aggressive. Shoot before it reaches you.'},
    {n:'Vulpaphyla',variants:['Sly','Crescent','Panzer'],rare:['Crescent','Panzer'],where:'The open Drift.',time:'Crescent during Vome, Panzer during Fass',lure:'Vulpaphyla Echo-Lure, Stranger with the Entrati',reward:'Tags. A Weakened one (hurt by Infested) can be revived at Son as a companion.',tip:'Panzer takes three darts. Let Infested hit it if you want a Weakened one.'},
    {n:'Predasite',variants:['Vizier','Pharaoh','Medjay'],rare:['Pharaoh','Medjay'],where:'The open Drift.',time:'Pharaoh during Fass, Medjay during Vome',lure:'Predasite Echo-Lure, Stranger with the Entrati',reward:'Tags. A Weakened one can be revived at Son as a companion (needs a Mutagen and an Antigen).',tip:'Takes two darts, and abilities last a quarter as long on it.'},
    {n:'Avichaea',variants:['Common','Sporule','Viscid'],rare:['Sporule','Viscid'],where:'Clings to walls.',time:'Sporule during Vome, Viscid during Fass',lure:'Avichaea Echo-Lure, Acquaintance with the Entrati',reward:'Tags',tip:'Look up at the walls.'},
    {n:'Undazoa',variants:['Umber','Vaporous','Howler'],rare:['Vaporous','Howler'],where:'Along the exocrine rivers.',time:'Vaporous during Fass, Howler during Vome',lure:'Undazoa Echo-Lure, Associate with the Entrati',reward:'Tags. Takes two darts.',tip:'Follow the exocrine rivers.'},
    {n:'Velocipod',variants:['Purple','Green','White'],rare:['Green','White'],where:'Purple: Undulatum and the base of the path from the Necralisk. Green: north of the area between Cerebrum Magna and the Infested Seraglio. White: swamps, the Catabolic Gutter ridges and the Infested Seraglio.',time:'White only during Vome',lure:'No lure. Find wild ones.',reward:'Tags. You can also ride one.',tip:'Look on high ground. It doesn\'t run away.'},
    {n:'Nexifera',variants:['Amethyst','Viridian','Scarlet'],rare:['Viridian','Scarlet'],where:'Cave ceilings above a green puddle.',lure:'No lure. Find wild ones.',reward:'Tags',tip:'Step on the puddle, back away quickly, then tranq it as it drops.'}]},
  {world:'Duviri',vendor:'No vendor. Each animal leads you to a chest.',species:[
    {n:'Void-corrupted animals',variants:['Krubie','Kexat','Tamm'],rare:[],where:'A few fixed spots are active each run: the middle of Royalstead Pastures, west of the road from Primrose Village to Moirai Crossing, and a ravine west of Titan\'s Rest. Players see them most near Royalstead Pastures and the Chamber of Muses.',time:'Any spiral',lure:'No Tranq Rifle or lure. Koral tells you when one is close.',reward:'A chest with 3 Drifter Intrinsics, Duviri resources and a Decree',tip:'Sneak up and interact. If it spots you, destroy its three orbs, then finish the quick-time prompt and pet it.'}]}]};
/* ---------- open worlds: one search across fishing, mining and conservation, also in the Farm finder ---------- */
/* Every fish, ore, gem and animal gets a guide (where, when, what to bring, what it gives) under the key ow|<name>.
   They show up in the Farm finder as the "Open worlds" type and in the search on the Open worlds page. */
function owEntries(){const out=[];
  for(const f of D.fish||[])out.push({n:f.n,kind:'Fish',reg:f.reg,r:f.r,f});
  for(const rg in (D.mine&&D.mine.reg)||{}){const R=D.mine.reg[rg];for(const [n,r] of R.ore||[])out.push({n,kind:'Ore',reg:rg,r});for(const [n,r] of R.gem||[])out.push({n,kind:'Gem',reg:rg,r})}
  for(const w of (typeof CONSERVATION!=='undefined'?CONSERVATION.worlds:[]))for(const a of w.species)out.push({n:a.n,kind:'Animal',reg:w.world,r:(a.rare||[]).length?'Has rare variants':'',a,w});
  return out}
let OWX=null;const owIndex=()=>OWX||(OWX=Object.fromEntries(owEntries().map(e=>[e.n,e])));
const OW_DO={Fish:'Fishing',Ore:'Mining',Gem:'Mining',Animal:'Conservation'};
{const _b=buildIdx;buildIdx=function(){_b();for(const e of Object.values(owIndex()))IDX.push([e.n,'ow',e.kind+' · '+e.reg,OW_DO[e.kind]])}}
FFT.push(['ow','Open worlds']);
const owKey=e=>e.kind==='Fish'?'fish|'+e.n:e.kind==='Animal'?'animal|'+e.n:'ore|'+e.n;
function owGuide(e){const rows=[];const it=(k,v)=>v?rows.push(`<div><b>${k}:</b> ${esc(v)}</div>`):0;
  if(e.kind==='Fish'){const f=e.f,R=(D.fishreg||{})[e.reg]||{};it('Where',`${e.reg}, ${f.bio||'any water'}`);it('When',f.time);it('Spear',f.sp||R.sp);it('Bait',f.bait||'None needed');
    if(f.spots&&f.spots.length)it('Good spots',f.spots.join('; '));if(f.dr&&f.dr.length)rows.push(`<div><b>Gives:</b> ${f.dr.map(x=>RES[x]?L(x):esc(x)).join(', ')}</div>`);it('Sell or trade',R.v?R.v+'. '+(R.use||''):'')}
  else if(e.kind==='Animal'){const a=e.a;it('Where',`${e.reg}: ${a.where}`);it('When',a.time);it('How to call it',a.lure);if(a.variants&&a.variants.length)it('Variants',a.variants.join(', ')+((a.rare||[]).length?` (rare: ${a.rare.join(', ')})`:''));
    it('Perfect captures give',a.reward);it('Tip',a.tip);it('Vendor',e.w.vendor)}
  else{const R=D.mine.reg[e.reg];it('Where',e.reg);it('Vein',e.kind==='Ore'?'Red veins (ores)':'Blue veins (gems)');if(R.spots&&R.spots.length)it('Best spots',R.spots.join('; '));
    it('Cutter',e.r==='Rare'||e.r==='Special'?'Advanced cutter or Sunpoint Plasma Drill for the best odds':'Any cutter');it('Sell or trade',R.v)}
  return rows.join('')}
function owDetail(n){const e=owIndex()[n];if(!e)return '';const k=owKey(e);
  return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(n)}</h3><span class="chip">${esc(e.kind)} · ${esc(e.reg)}</span>${e.r?`<span class="chip ${/Rare|Legendary|Special/.test(e.r)?'gold':''}">${esc(e.r)}</span>`:''}<span style="margin-left:auto">${taskBtn(e.kind==='Fish'?'fish':e.kind==='Animal'?'animal':'ore',n,(e.kind==='Fish'?'Catch ':e.kind==='Animal'?'Capture ':'Mine ')+n)}</span></div></div>
  <div style="padding:12px 14px" class="small stack">${owGuide(e)}<label class="row" style="gap:8px">${ck(k)} ${e.kind==='Fish'?'Caught':e.kind==='Animal'?'Captured':'Mined'}</label></div></section>`}
{const _d=detail;detail=function(sel){return sel.startsWith('ow|')?owDetail(sel.slice(3)):_d(sel)}}
/* the search on the Open worlds page */
function owSearch(q){q=String(q||'').toLowerCase().trim();if(q.length<2)return [];const w=q.split(/\s+/);
  return Object.values(owIndex()).filter(e=>{const hay=(e.n+' '+e.kind+' '+e.reg+' '+(e.f?e.f.bio+' '+e.f.time:'')+(e.a?' '+e.a.where+' '+(e.a.time||'')+' '+(e.a.variants||[]).join(' '):'')).toLowerCase();return w.every(x=>hay.includes(x))})
    .sort((a,b)=>(b.n.toLowerCase().startsWith(q)-a.n.toLowerCase().startsWith(q))||a.n.localeCompare(b.n)).slice(0,30)
    .map(e=>({n:e.n,kind:e.kind,reg:e.reg,r:e.r,done:on(owKey(e)),key:'ow|'+e.n,line:e.kind==='Fish'?[e.f.bio,e.f.time].filter(Boolean).join(' · '):e.kind==='Animal'?[e.a.time,e.a.where].filter(Boolean).join(' · ').slice(0,120):e.kind==='Ore'?'Red vein':'Blue vein'}))}
/* conservation tab data */
function conservationData(){const C=typeof CONSERVATION!=='undefined'?CONSERVATION:null;if(!C)return null;const rg=state.cvR&&C.worlds.some(w=>w.world===state.cvR)?state.cvR:C.worlds[0].world;
  const w=C.worlds.find(x=>x.world===rg);return {steps:C.steps,regions:C.worlds.map(x=>x.world),region:rg,vendor:w.vendor,species:w.species.map(a=>({...a,key:'animal|'+a.n,done:on('animal|'+a.n),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='animal'&&x.r===a.n)}))}}
{const _w=worldData;worldData=function(){if(state.wTab==='cons')return {tab:'cons',region:'',regions:[],cons:conservationData()};return _w()}}
Object.assign(window.TF,{worldSearch:q=>owSearch(q),conservation:()=>conservationData(),conservationSet:r=>{state.cvR=r;tfNotify()}});
/* a link from another page into the Farm finder opens its guide straight away on a phone too */
let FARM_JUMP=false;{const _g=go;go=function(t){const was=location.hash;_g(t);FARM_JUMP=was!=='#farm'&&location.hash==='#farm'}}
addEventListener('hashchange',()=>{if(location.hash!=='#farm')FARM_JUMP=false});
window.TF.farmJumped=()=>FARM_JUMP;
/* ---------- floating chat window: chat stays live on every page while the pop-up window is open ---------- */
/* The window itself (position, size, minimised, the reopen button) lives in the React shell; it tells us here when it opens and
   closes so rooms stay subscribed, conversations get marked read, and notifications skip the chat you're looking at. */
const CHATWIN={open:false};
const chatLive=()=>location.hash==='#chat'||CHATWIN.open;
{const _cp=chatPageData;chatPageData=function(){const d=_cp();if(CHATWIN.open&&location.hash!=='#chat'){const cur=d.cur;
  if(ctConv(cur)){chatClose();state.chat=ctConvKey(cur)}else{state.chat=null;if(FB)chatOpen(cur)}}return d}}
{const _sr=socialRender;socialRender=function(){if(CHATWIN.open&&location.hash!=='#chat')tfNotify();return _sr()}}
/* leaving the Chat page keeps the room open while the window is up (the page's own listener closes it; reopen straight after) */
window.addEventListener('hashchange',()=>{if(location.hash!=='#chat'&&CHATWIN.open)setTimeout(()=>tfNotify(),0)});
{const _v=ntfViewing;ntfViewing=function(conv){if(_v(conv))return true;if(!CHATWIN.open||document.visibilityState!=='visible')return false;
  const cur=CT.cur;if(conv.startsWith('room:'))return conv==='room:'+cur;if(conv.startsWith('dm:'))return cur==='f:'+conv.slice(3);return cur===conv}}
Object.assign(window.TF,{chatWin:open=>{const was=CHATWIN.open;CHATWIN.open=!!open;
  if(was&&!open&&location.hash!=='#chat'){chatClose();state.chat=null}tfNotify()}});
/* ---------- how to level each kind of gear (not everything works on Hydron), and roles for every Warframe ---------- */
/* From the Warframe wiki (Mastery Rank, Affinity, Archwing, Archgun Deployer, Necramech Summon, K-Drive, Amp, Kitgun, Zaw,
   Companion, Plexus and the Kuva/Tenet/Coda pages), checked October 2026. */
const HYDRON='Level it fast on Hydron (Sedna) or Elite Sanctuary Onslaught.';
const LEVEL_HOW={
  Archwing:{no:1,t:'Archwings can\'t be used on Hydron. Level it in Archwing missions (Salacia on Neptune is the classic spot), in Railjack missions like R-9 Cloud (Veil Proxima), or in the open worlds with the Archwing Launcher. It only gains XP while you fly it.'},
  'Arch-Gun':{no:1,t:'Fastest in Archwing missions (Salacia, Neptune) or Railjack missions like R-9 Cloud. On foot it needs the Archgun Deployer (Profit-Taker heist) and a Gravimag installed; then you can call it down in normal missions like Hydron, but not in Sanctuary Onslaught or Duviri. While it\'s out, unequip your other weapons so it gets more of the XP.'},
  'Arch-Melee':{no:1,t:'Only works in space: Archwing missions (Salacia, Neptune) or Railjack missions like R-9 Cloud. It can\'t be used on foot. Equip only the arch-melee so it gets more of the XP.'},
  Necramech:{no:1,t:'Necramechs can\'t be used on Hydron. Summon it with the Necramech Summon gear (needs The War Within) in the open worlds, Isolation Vaults on Deimos, Conjunction Survival on Lua, or the ground parts of Railjack missions (Tactical Intrinsic 5). Squad mates within 250 m share XP in the open worlds. Max rank is 40, which takes 5 Forma.'},
  'K-Drive':{no:1,t:'K-Drives can\'t be used on Hydron and kills give them nothing. They level only from tricks: ride in an open world (Orb Vallis and Cambion Drift races are best) and chain jumps, grabs and grinds. Blue crystals raise the trick multiplier.'},
  Amp:{t:'Works on Hydron, but only kills you make yourself as your Operator or Drifter count fully (shared XP gives the Amp a little over a third). Eidolon hunts and the Zariman work too. Most Amps give Mastery only after you gild them at rank 30 and level them again; Sirocco comes already gilded.'},
  Kitgun:{t:'Level it anywhere (Hydron, Sanctuary Onslaught). For Mastery, rank it to 30, gild it with Rude Zuud in Fortuna, then level it again. Each chamber counts once.'},
  Zaw:{t:'Level it anywhere (Hydron, Sanctuary Onslaught). For Mastery, rank it to 30, gild it with Hok in Cetus, then level it again. Each strike counts once.'},
};
const LEVEL_NAME={
  Plexus:{no:1,t:'The Plexus only levels in Railjack missions. Man a turret: turret kills give the Plexus all of the XP. Joining public Railjack squads as a gunner works fine.'},
  Sirocco:{t:'Sirocco is the Drifter\'s Amp. It comes already gilded, so it gives Mastery as soon as you level it. Use it as your Operator or Drifter in any mission (Hydron works) and get the kills yourself.'},
  Grimoire:{t:HYDRON+' It has unlimited ammo.'},
};
function levelTip(it){if(!it)return HYDRON;const n=it.n;
  if(LEVEL_NAME[n])return LEVEL_NAME[n].t;
  if(/^(Kuva|Tenet|Coda) /.test(n)||n==='Paracesis')return HYDRON+' Max rank is 40: each Forma raises it by 2, and every extra rank gives Mastery.';
  if(it.c==='Companion'&&/(MOA|Hound|Predasite|Vulpaphyla)/.test(n))return 'Equip it and play anywhere (Hydron works); it gets XP from your kills. For Mastery, rank it to 30, gild it, then level it again.';
  const L=LEVEL_HOW[it.c];return L?L.t:HYDRON}
const notHydron=it=>!!(it&&((LEVEL_NAME[it.n]||{}).no||(LEVEL_HOW[it.c]||{}).no));

/* Warframe roles. "Playstyle" is the label the wiki seeded from a list Digital Extremes supplied; the "good at" tags are the community's usual view. */
const FRAME_ROLE={
  Ash:[['Stealth','Damage'],[]],Atlas:[['Damage','Survival'],['Tank']],Banshee:[['Crowd Control'],['Buffer','Stealth']],Baruuk:[['Damage','Crowd Control'],['Tank']],
  Caliban:[['Crowd Control'],[]],Chroma:[['Survival','Damage'],['Tank','Buffer']],Citrine:[['Support'],['Debuffer','Healer']],'Cyte-09':[['Damage','Stealth'],[]],
  Dagath:[['Damage'],['Debuffer']],Dante:[['Damage','Support','Survival'],['Healer']],Ember:[['Damage'],['Nuker']],Equinox:[['Support'],['Nuker','Healer']],
  Excalibur:[['Damage'],[]],'Excalibur Umbra':[['Damage'],[]],Follie:[['Crowd Control'],['Debuffer']],Frost:[['Crowd Control','Survival'],['Tank']],
  Gara:[['Damage','Survival','Crowd Control'],['Tank']],Garuda:[['Damage'],[]],Gauss:[['Damage','Survival'],['Mobility']],Grendel:[['Survival'],['Tank']],
  Gyre:[['Damage','Crowd Control'],['Nuker']],Harrow:[['Survival','Support'],['Buffer']],Hildryn:[['Damage','Survival'],['Tank','Nuker']],
  Hydroid:[['Crowd Control'],['Resource farming']],Inaros:[['Survival','Crowd Control'],['Tank']],Ivara:[['Stealth'],['Resource farming']],
  Jade:[['Support'],['Buffer','Healer']],Khora:[['Crowd Control','Damage'],['Resource farming']],Koumei:[['Damage','Crowd Control'],[]],
  Kullervo:[['Damage'],['Mobility']],Lavos:[['Damage'],['Debuffer']],Limbo:[['Crowd Control'],[]],Loki:[['Stealth'],[]],Mag:[['Crowd Control'],['Debuffer']],
  Mesa:[['Damage'],[]],Mirage:[['Damage'],[]],Narin:[['Damage','Crowd Control'],[]],Nekros:[['Crowd Control'],['Resource farming','Summoner']],
  Nezha:[['Survival','Crowd Control'],['Tank','Mobility']],Nidus:[['Damage','Survival','Crowd Control'],['Tank']],Nokko:[['Damage','Crowd Control'],[]],
  Nova:[['Damage','Crowd Control'],['Debuffer','Nuker']],Nyx:[['Crowd Control'],['Debuffer']],Oberon:[['Support'],['Healer']],
  Octavia:[['Support','Damage','Crowd Control'],['Buffer','Stealth']],Oraxia:[['Damage','Stealth'],[]],Protea:[['Damage','Support'],[]],
  Qorvex:[['Survival','Crowd Control'],['Tank']],Revenant:[['Damage','Survival'],['Tank']],Rhino:[['Survival','Crowd Control'],['Tank','Buffer']],
  Saryn:[['Damage'],['Nuker','Debuffer']],Sevagoth:[['Damage','Survival'],['Summoner']],Styanax:[['Damage','Support'],['Nuker']],Temple:[['Damage','Support'],[]],
  Titania:[['Damage','Crowd Control'],['Mobility']],Trinity:[['Survival','Support'],['Healer','Buffer']],Uriel:[['Damage'],['Summoner']],
  Valkyr:[['Damage','Survival'],['Tank']],Vauban:[['Crowd Control'],[]],Volt:[['Damage'],['Buffer','Mobility']],Voruna:[['Damage','Stealth'],[]],
  Wisp:[['Support'],['Buffer','Healer']],Wukong:[['Damage','Survival'],['Tank','Summoner']],Xaku:[['Damage'],['Debuffer']],
  Yareli:[['Damage','Crowd Control'],['Mobility']],Zephyr:[['Damage','Crowd Control'],['Mobility']],
  'Sirius & Orion':[['Damage','Support'],['Summoner']],'Orion & Sirius':[['Damage','Support'],['Summoner']]};
const roleOf=n=>FRAME_ROLE[n]||FRAME_ROLE[baseOf(n)]||[[],[]];
const ROLE_LIST=['Damage','Crowd Control','Support','Survival','Stealth','Tank','Healer','Buffer','Debuffer','Nuker','Summoner','Mobility','Resource farming'];
const hasRole=(n,r)=>{const [a,b]=roleOf(n);return a.includes(r)||b.includes(r)};

/* the Warframes page: roles under the name and a filter for each role */
{const _fd=framesData;framesData=function(){const ff=state.frF||'all';let d;
  if(ff.startsWith('role:')){const r=ff.slice(5);
    const match=Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth'&&hasRole(i.n,r)).map(i=>i.n).sort();
    if(match.length&&!match.includes(state.frame))state.frame=match.includes('Saryn Prime')?'Saryn Prime':match[0];
    state.frF='all';try{d=_fd()}finally{state.frF=ff}
    if(match.length)d.list=match;else d.filteredEmpty=true;d.filter=ff}
  else d=_fd();
  const [play,good]=roleOf(d.name);return {...d,playstyle:play,goodAt:good,roles:ROLE_LIST}}}
/* every item's "Rank to 30" step says where it can actually be levelled */
{const _t=itemTree;itemTree=function(name,opts){const h=_t(name,opts);const it=I[name];return it?h.replace(HYDRON,esc(levelTip(it))):h}}
/* the Mastery page's XP tab: the gear Hydron can't level */
{const _x=xpTabHTML;xpTabHTML=function(){const rows=[['Archwings','Archwing'],['Arch-guns','Arch-Gun'],['Arch-melee','Arch-Melee'],['Necramechs (Voidrig, Bonewidow)','Necramech'],['K-Drives','K-Drive'],['Amps','Amp'],['Kitguns','Kitgun'],['Zaws','Zaw']];
  return _x()+`<div class="panel stack cut"><h2>Gear Hydron can't level (or needs extra steps)</h2><p class="small muted" style="margin:0">Most gear levels anywhere. These are the exceptions.</p>
  <ul class="small stack" style="margin:0;padding-left:18px">${[...rows.map(([l,c])=>[l,LEVEL_HOW[c].t]),['Plexus (Railjack)',LEVEL_NAME.Plexus.t],['MOAs, Hounds, Predasites, Vulpaphylas','Level them anywhere, then gild and level again for Mastery.'],['Kuva, Tenet and Coda weapons, Paracesis','Max rank 40: each Forma raises it by 2, and every extra rank gives Mastery.'],['Exalted weapons and pet weapons','They rank up but give no Mastery.']].map(([a,b])=>`<li><b>${esc(a)}:</b> ${esc(b)}</li>`).join('')}</ul></div>`}}
/* ---------- Simple / Detailed view: Simple hides the long explanations (see html[data-detail=simple] in the CSS) ---------- */
const SIMPLE=()=>document.documentElement.dataset.detail==='simple';
document.documentElement.dataset.detail=lsGet('tf-detail','detailed')==='simple'?'simple':'detailed';
/* item steps and other embedded pages are cached; rebuild them when the view changes */
window.TF.detailChanged=()=>{ISLV++;FFD.key='';FRT.key='';try{render()}catch(e){}tfNotify()};
/* ---------- builds fit every version of an item: Saryn's build is Saryn Prime's (and Umbra's) too, Soma Prime's fits Soma ---------- */
function famOf(n){const b=String(n).replace(/ (Prime|Umbra)$/,'');return [b,b+' Prime',b+' Umbra'].filter(x=>I[x])}
const famOwned=n=>famOf(n).some(ownedItem);
function bFits(b){return b.fits||(b.fits=famOf(b.item).filter(x=>x!==b.item))}
{const _mb=metaBuilds;metaBuilds=function(){const r=_mb();for(const b of r)if(!b.fits)b.fits=famOf(b.item).filter(x=>x!==b.item);return r}}
/* the weapon and companion build tabs list every version, each showing the family's builds */
const FAMSRC=new Map();
{const _bd=buildsData;buildsData=function(src,kind){let ex=FAMSRC.get(src);
  if(!ex){ex={...src};for(const k in src)for(const v of famOf(k))if(!ex[v])ex[v]=src[k];FAMSRC.set(src,ex)}
  return _bd(ex,kind)}}
/* ---------- Friends: where each friend is at, and how you can help them ---------- */
/* Each player can share a small "what I'm working on" note with their friends only (Firestore share/{uid}, readable by
   people on their friends list): the gear they're tracking, the parts they still need, what they'd like help with and a
   short note. Your side matches that against what you own: spare parts, relics that drop their parts, gear you've built. */
const LF_TAGS=['Relic runs','Steel Path','Eidolons','Archon hunts','Railjack','Levelling gear','Resource farming','Liches & Sisters','Open-world bounties','Duviri & Circuit','Netracells & Archimedea','New player help'];
SO.share=SO.share||{};
let SHP=0;

/* what I share */
function shareOut(){const goals=(P.goals||[]).filter(n=>I[n]&&!on('m|'+n)&&!on('build|'+n)).slice(0,20);const need=[];
  /* only parts that come from relics or drops: a Market blueprint is just bought, nobody needs help with it */
  for(const g of goals){const it=I[g];if(!on('bp|'+g)&&(it.bprel||it.bpd))need.push(g+' Blueprint');
    for(const p of it.parts){if(p.k!=='p'||p.n==='Blueprint'||!(p.rel||(p.dr&&p.dr.length)))continue;if(on('part|'+g+'|'+p.n)||on('built|'+g+'|'+p.n))continue;need.push(p.full||(g+' '+p.n))}}
  /* open to-do tasks as "kind|ref|title" so friends can open the same page */
  const tasks=(P.tasks||[]).filter(x=>!x.d&&x.t).slice(0,20).map(x=>[x.k||'note',String(x.r||'').slice(0,80),String(x.t).slice(0,100)].join('|'));
  return {at:Date.now(),goals,need:[...new Set(need)].slice(0,40),lf:(P.lf||[]).filter(t=>LF_TAGS.includes(t)).slice(0,12),note:String(P.lfNote||'').slice(0,120),tasks}}
function publishShare(){if(!SO.uid||!FB)return Promise.resolve();const ref=FB.fs.collection('share').doc(SO.uid);
  if(P.shareOff)return ref.delete().catch(()=>{});const d=shareOut();
  /* until the updated rules (with tasks) are published, share everything else */
  return ref.set(d).catch(()=>{const {tasks,...rest}=d;return ref.set(rest).catch(()=>{})})}
{const _pp=publishPublic;publishPublic=function(){const r=_pp();publishShare();return r}}

/* what my friends share with me */
let SHT=0;
async function loadShares(){if(!FB||!SO.uid)return;let changed=false;
  for(const f of SO.friends){if(f.pending)continue;const c=SO.share[f.uid];if(c&&Date.now()-c._t<300000)continue;
    try{const d=await FB.fs.collection('share').doc(f.uid).get();SO.share[f.uid]={...(d.exists?d.data():{}),_t:Date.now(),st:d.exists?'ok':'none'}}
    catch(e){SO.share[f.uid]={_t:Date.now(),st:'none'}}changed=true}
  if(changed)tfNotify()}
{const _lf=loadFriendCards;loadFriendCards=async function(){const r=await _lf.apply(this,arguments);loadShares();return r}}

/* part name -> the item it belongs to and the relics that drop it */
let PARTIX=null;
function partIx(){if(PARTIX)return PARTIX;PARTIX={};
  for(const it of Object.values(I)){if(it.bprel)PARTIX[it.n+' Blueprint']={item:it.n,rel:it.bprel,dr:it.bpd||null};
    for(const p of it.parts||[])if(p.k==='p'){const full=p.full||(it.n+' '+p.n);if(!PARTIX[full])PARTIX[full]={item:it.n,rel:p.rel||null,dr:p.dr||null}}}
  return PARTIX}
const relName=r=>String(Array.isArray(r)?r[0]:r);
const TASK_GO={res:'res',item:'item',relic:'relic',mod:'mod',arc:'arc',part:'part',guide:'guide',way:'way',quest:'guide'};
function shareTasks(sh){return (Array.isArray(sh.tasks)?sh.tasks:[]).filter(x=>typeof x==='string').map(x=>{const a=x.split('|');const k=a[0]||'note',r=a[1]||'',t=a.slice(2).join('|')||r;
  return {k,r,t,go:TASK_GO[k]&&r?TASK_GO[k]+'|'+r:''}}).filter(x=>x.t)}
function helpFor(sh,theirMr,myMr){const out=[];const ix=partIx();
  for(const x of shareTasks(sh)){
    if(x.k==='relic'&&REL[x.r]&&relCount(x.r)>0)out.push({k:'relic',t:`They're working on ${x.t}, and you have ${relCount(x.r)} ${x.r}. Run it together.`,go:'relic|'+x.r});
    else if(x.k==='item'&&I[x.r]&&on('m|'+x.r))out.push({k:'build',t:`They're working on ${x.t}. You've mastered ${x.r}, so share your build or tips.`,go:'item|'+x.r})}const need=(sh.need||[]).filter(x=>typeof x==='string');
  for(const part of need){const p=ix[part]||{};const spare=+((P.dup||{})[part])||0;
    if(spare){out.push({k:'give',t:`You have ${spare} spare ${part}. Trade it to them.`,go:'part|'+part});continue}
    const mine=(p.rel||[]).map(relName).filter(r=>REL[r]&&relCount(r)>0);
    if(mine.length){out.push({k:'relic',t:`Your ${mine.slice(0,3).map(r=>`${r} (${relCount(r)})`).join(', ')} ${mine.length>1?'drop':'drops'} their ${part}. Open ${mine.length>1?'them':'it'} together.`,go:'relic|'+mine[0]});continue}
    if(p.item&&on('m|'+p.item)&&!(sh.goals||[]).includes(p.item))out.push({k:'know',t:`You've built ${p.item}, so you know where ${part} comes from. Farm it with them.`,go:'item|'+p.item})}
  for(const g of sh.goals||[])if(typeof g==='string'&&I[g]&&on('m|'+g))out.push({k:'build',t:`You've mastered ${g}. Share your build or tips for it.`,go:'item|'+g});
  const lf=(sh.lf||[]).filter(t=>LF_TAGS.includes(t));
  const relN=Object.keys(P.rel||{}).filter(r=>relCount(r)>0).length;const spOn=ALLN.some(n=>on('sp|'+n.id));
  for(const t of lf){const why=t==='Relic runs'&&relN?`you have ${relN} kind${relN>1?'s':''} of relics`:t==='Steel Path'&&spOn?'you have Steel Path':t==='New player help'&&myMr>theirMr+4?`you're ${myMr-theirMr} ranks ahead`:'';
    if(why)out.push({k:'lf',t:`They want help with ${t}, and ${why}.`})}
  const seen=new Set();return out.filter(h=>{const key=h.k==='build'?'build|'+h.go:h.t;if(seen.has(key))return false;seen.add(key);return true}).slice(0,12)}

function agoText(at){if(!at)return '';const s=(Date.now()-at)/1000;if(s<120)return 'Active just now';if(s<3600)return `Active ${Math.round(s/60)} min ago`;
  if(s<86400)return `Active ${Math.round(s/3600)} h ago`;const d=Math.round(s/86400);return d<60?`Active ${d} day${d>1?'s':''} ago`:'Not active lately'}

function friendsHubData(){const sq=squadData();if(sq.status!=='ok')return {status:sq.status};
  if(Date.now()-SHT>60000){SHT=Date.now();loadShares()}
  const myMr=mrInfo(totalXP().total).mr;const pins=P.fpin||[];const q=(state.fhQ||'').toLowerCase().trim();const so=state.fhS||'active';
  const base=Object.fromEntries((sq.friends||[]).map(f=>[f.uid,f]));
  let list=SO.friends.map(f=>{const p=SO.pub[f.uid]||{};const b=base[f.uid]||{};const sh=SO.share[f.uid]||{};
    const xp=+p.xp||0;const m=p.mr!=null?mrInfo(xp):null;const mr=p.mr!=null?+p.mr:null;
    return {uid:f.uid,name:sqName(f.uid),av:b.av||'',pending:!!f.pending,pinned:pins.includes(f.uid),unread:b.unread||0,code:f.code||p.code||'',
      mr,mrLabel:mr!=null?'MR '+mrLabel(mr):'',pct:m?Math.round(m.pct):0,toNext:m?Math.max(0,m.next-xp):0,nextLabel:m?'MR '+mrLabel(m.mr+1):'',
      diff:mr!=null?mr-myMr:0,at:+p.at||0,active:agoText(+p.at||0),
      nodes:+p.nodes||0,sp:+p.sp||0,maxed:+p.maxed||0,
      shared:f.pending?'pending':sh.st||'loading',goals:(sh.goals||[]).filter(x=>typeof x==='string'),need:(sh.need||[]).filter(x=>typeof x==='string'),
      lf:(sh.lf||[]).filter(t=>LF_TAGS.includes(t)),note:typeof sh.note==='string'?sh.note:'',tasks:sh.st==='ok'?shareTasks(sh):[],help:mr!=null&&sh.st==='ok'?helpFor(sh,mr,myMr):[]}});
  if(q)list=list.filter(f=>f.name.toLowerCase().includes(q)||f.code.toLowerCase().includes(q));
  list.sort((a,b)=>(b.pinned-a.pinned)||(a.pending-b.pending)||(so==='mr'?((b.mr??-1)-(a.mr??-1)):so==='name'?a.name.localeCompare(b.name):(b.unread-a.unread)||(b.at-a.at))||a.name.localeCompare(b.name));
  const mine=shareOut();
  return {status:'ok',q:state.fhQ||'',sort:so,open:state.fhOpen||'',myMr,count:SO.friends.filter(f=>!f.pending).length,friends:list,lfTags:LF_TAGS,
    me:{on:!P.shareOff,lf:(P.lf||[]).filter(t=>LF_TAGS.includes(t)),note:P.lfNote||'',goals:mine.goals.length,need:mine.need.length}}}

Object.assign(window.TF,{
  friendsHub:()=>friendsHubData(),
  friendsHubSet:o=>{if(o.q!=null)state.fhQ=o.q;if(o.sort!=null)state.fhS=o.sort;if('open' in o)state.fhOpen=state.fhOpen===o.open?'':o.open;tfNotify()},
  friendPin:uid=>{P.fpin=P.fpin||[];const i=P.fpin.indexOf(uid);if(i>=0)P.fpin.splice(i,1);else P.fpin.push(uid);saveProfile();tfNotify()},
  shareSet:o=>{if(o.on!=null)P.shareOff=!o.on;if(o.lf!=null){P.lf=P.lf||[];const i=P.lf.indexOf(o.lf);if(i>=0)P.lf.splice(i,1);else if(LF_TAGS.includes(o.lf))P.lf.push(o.lf)}
    if(o.note!=null)P.lfNote=String(o.note).slice(0,120);saveProfile();clearTimeout(SHP);SHP=setTimeout(publishShare,1500);tfNotify()},
});
/* ---------- your platform badge: picked by you, shown after your name everywhere ---------- */
/* Warframe ends cross-play names with one private-use character (U+E000 + platform); fonts/tf-platforms.woff2 draws it as a
   badge. Which number means which platform isn't documented, so players pick their own on the Home page. The pick replaces
   that last character in the name Tennoform shows and publishes (public card, chat, friends' lists). */
const BADGES=[['pc','PC'],['ps','PlayStation'],['xb','Xbox'],['sw','Switch'],['ios','iPhone / iPad'],['and','Android']];
const baseName=n=>String(n||'').replace(/[-]+$/u,'');
function withBadge(n){const b=P.badge;if(!b)return String(n||'');const base=baseName(n).slice(0,39);if(b==='none')return base;
  const i=BADGES.findIndex(x=>x[0]===b);return i<0?String(n||''):base+String.fromCharCode(0xE000+i)}
function badgeAuto(n){const c=String(n||'').charCodeAt(String(n||'').length-1);const i=c-0xE000;return i>=0&&i<BADGES.length?BADGES[i][0]:''}
{const _mn=myName;myName=function(){return withBadge(_mn())}}
{const _hd=homeData;homeData=function(){const d=_hd();const raw=d.name;if(raw)d.name=withBadge(raw);
  d.badge={cur:P.badge||'',auto:badgeAuto(raw),options:BADGES.map(([value,label])=>({value,label}))};return d}}
Object.assign(window.TF,{badgeSet:v=>{P.badge=v==='none'||BADGES.some(x=>x[0]===v)?v:'';saveProfile();
  if(typeof publishPublic==='function')publishPublic();tfNotify();toast(v==='none'?'Platform badge hidden':v?'Platform badge updated':'Using the badge from your Warframe name')}});
/* ---------- how to reach every region, special unlocks for nodes, and hidden or special places ----------
   From wiki.warframe.com (Module:Missions/data requirements, each region, hub, mode and boss page), checked October 2026. */
const PLACES_INFO={"regions":{"Earth":{"unlock":"Starting planet (Quest: Vor's Prize)","w":"https://wiki.warframe.com/w/Earth"},"Mars":{"unlock":"Beat the Mars Junction on Earth (needs Quest: Once Awake)","w":"https://wiki.warframe.com/w/Mars"},"Venus":{"unlock":"Beat the Venus Junction on Earth (needs Quest: The Teacher)","w":"https://wiki.warframe.com/w/Venus"},"Mercury":{"unlock":"Beat the Mercury Junction on Venus (needs Quest: Vox Solaris, beat Jackal at Fossa)","w":"https://wiki.warframe.com/w/Mercury"},"Phobos":{"unlock":"Beat the Phobos Junction on Mars","w":"https://wiki.warframe.com/w/Phobos"},"Ceres":{"unlock":"Beat the Ceres Junction on Mars","w":"https://wiki.warframe.com/w/Ceres"},"Deimos":{"unlock":"Clear War (Mars); no Junction. Cambion Drift needs Quest: Heart of Deimos; lab nodes need Whispers in the Walls","w":"https://wiki.warframe.com/w/Deimos"},"Jupiter":{"unlock":"Beat the Jupiter Junction on Deimos (needs Quest: Heart of Deimos)","w":"https://wiki.warframe.com/w/Jupiter"},"Europa":{"unlock":"Beat the Europa Junction on Jupiter","w":"https://wiki.warframe.com/w/Europa"},"Saturn":{"unlock":"Beat the Saturn Junction on Jupiter (needs Quest: The Archwing)","w":"https://wiki.warframe.com/w/Saturn"},"Uranus":{"unlock":"Beat the Uranus Junction on Saturn (beat Sargas Ruk at Tethys)","w":"https://wiki.warframe.com/w/Uranus"},"Neptune":{"unlock":"Beat the Neptune Junction on Uranus (needs Quest: Natah, beat Tyl Regor)","w":"https://wiki.warframe.com/w/Neptune"},"Pluto":{"unlock":"Beat the Pluto Junction on Neptune (needs Quest: The Second Dream)","w":"https://wiki.warframe.com/w/Pluto"},"Eris":{"unlock":"Beat the Eris Junction on Pluto (needs Quest: The War Within)","w":"https://wiki.warframe.com/w/Eris"},"Sedna":{"unlock":"Beat the Sedna Junction on Eris (needs Quest: Rising Tide, beat Ambulas)","w":"https://wiki.warframe.com/w/Sedna"},"Void":{"unlock":"Reached from nodes on Phobos, Europa, Neptune and Sedna (4 separate branches)","w":"https://wiki.warframe.com/w/Void"},"Lua":{"unlock":"Quest: The Second Dream (Earth connects to Lua)","w":"https://wiki.warframe.com/w/Lua"},"Kuva Fortress":{"unlock":"Quest: The War Within (fortress moves around the Star Chart)","w":"https://wiki.warframe.com/w/Kuva_Fortress"},"Zariman":{"unlock":"Quest: Angels of the Zariman (needs The New War)","w":"https://wiki.warframe.com/w/Zariman_Ten_Zero"},"Duviri":{"unlock":"Quest: The Duviri Paradox (needs Uranus Junction); Dominus Thrax icon top-right of Star Chart","w":"https://wiki.warframe.com/w/Duviri"},"Höllvania":{"unlock":"Quest: The Hex (1999); enter via Pom-2 PC in Orbiter landing craft","w":"https://wiki.warframe.com/w/H%C3%B6llvania"},"Dark Refractory":{"unlock":"Quest: The Old Peace; Navigation > Dark Refractory (preview possible after The Teacher)","w":"https://wiki.warframe.com/w/Dark_Refractory"},"Sanctuary Onslaught":{"unlock":"Quest: The New Strange; talk to Cephalon Simaris in any Relay","w":"https://wiki.warframe.com/w/Sanctuary_Onslaught"},"Earth Proxima":{"unlock":"Railjack: Quest: Rising Tide (or join someone's Railjack crew)","w":"https://wiki.warframe.com/w/Earth_Proxima"},"Venus Proxima":{"unlock":"Railjack: Quest: Rising Tide (or join a Railjack crew)","w":"https://wiki.warframe.com/w/Venus_Proxima"},"Saturn Proxima":{"unlock":"Railjack: clear all Earth + Venus Proxima nodes, Intrinsics rank 3","w":"https://wiki.warframe.com/w/Saturn_Proxima"},"Neptune Proxima":{"unlock":"Railjack: clear all Saturn Proxima nodes, Intrinsics rank 3","w":"https://wiki.warframe.com/w/Neptune_Proxima"},"Pluto Proxima":{"unlock":"Railjack: clear all Neptune Proxima nodes, Intrinsics rank 5","w":"https://wiki.warframe.com/w/Pluto_Proxima"},"Veil Proxima":{"unlock":"Railjack: Quest: Chimera Prologue, clear other Proximas, Intrinsics rank 7","w":"https://wiki.warframe.com/w/Veil_Proxima"},"Uranus Proxima":{"unlock":"Quest: Jade Shadows: Constellations","w":"https://wiki.warframe.com/w/Uranus_Proxima"}},"nodes":{"Apollo":{"unlock":"Quest: The War Within","what":"Disruption mission (Lua)","w":"https://wiki.warframe.com/w/Apollo"},"Arc Silver":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Defense mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Arc_Silver"},"Archaeo-freighter":{"unlock":"Buy Grendel Neuroptics Locator (25 Vitus Essence, Arbitration Honors in Relays)","what":"Grendel Neuroptics BP mission","w":"https://wiki.warframe.com/w/Grendel"},"Armatus":{"unlock":"Quest: The Deadlock Protocol and Quest: Whispers in the Walls","what":"Disruption mission (Deimos)","w":"https://wiki.warframe.com/w/Armatus"},"Arva Vector":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Defense mission (Neptune Proxima)","w":"https://wiki.warframe.com/w/Arva_Vector"},"Beacon Shield Ring":{"unlock":"Quest: Rising Tide","what":"Volatile mission (Venus Proxima)","w":"https://wiki.warframe.com/w/Beacon_Shield_Ring"},"Brom Cluster":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Spy mission (Neptune Proxima)","w":"https://wiki.warframe.com/w/Brom_Cluster"},"Brutus":{"unlock":"Quest: Jade Shadows","what":"Ascension mission","w":"https://wiki.warframe.com/w/Ascension"},"Calabash":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Exterminate mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Calabash"},"Cambion Drift":{"unlock":"Quest: Heart of Deimos for full access","what":"Open world on Deimos via Necralisk","w":"https://wiki.warframe.com/w/Cambion_Drift"},"Cambire":{"unlock":"Quest: Whispers in the Walls","what":"Alchemy mission","w":"https://wiki.warframe.com/w/Alchemy"},"Circulus":{"unlock":"Quest: The War Within","what":"Conjunction Survival, level 80-100","w":"https://wiki.warframe.com/w/Conjunction_Survival"},"Dakata":{"unlock":"Quest: The War Within","what":"Exterminate mission (Kuva Fortress)","w":"https://wiki.warframe.com/w/Dakata"},"Deepmines":{"unlock":"Quest: The New War; take Deepmines Bounties from Nightcap in Fortuna","what":"Fungal caves under Orb Vallis","w":"https://wiki.warframe.com/w/Deepmines"},"Effervo":{"unlock":"Quest: Whispers in the Walls","what":"The Fragmented boss fight","w":"https://wiki.warframe.com/w/The_Fragmented"},"Elite Sanctuary Onslaught":{"unlock":"Quest: The New Strange + Rank 30 Warframe (or MR30 with 1 Forma)","what":"Harder Onslaught; Arcanes, Focus","w":"https://wiki.warframe.com/w/Elite_Sanctuary_Onslaught"},"Enkidu Ice Drifts":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Survival mission (Neptune Proxima)","w":"https://wiki.warframe.com/w/Enkidu_Ice_Drifts"},"Erato":{"unlock":"Quest: The War Within and Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Orphix mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Erato"},"Everview Arc":{"unlock":"Quest: Angels of the Zariman","what":"Void Flood mission (Zariman)","w":"https://wiki.warframe.com/w/Everview_Arc"},"Exequias":{"what":"Zealoid Prelate boss for Pathocyst parts","w":"https://wiki.warframe.com/w/Zealoid_Prelate"},"Fenton's Field":{"unlock":"Railjack Intrinsics rank 5 or higher","what":"Survival mission (Pluto Proxima)","w":"https://wiki.warframe.com/w/Fenton's_Field"},"Flexa":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Skirmish mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Flexa"},"Ganymede":{"unlock":"Quest: Natah","what":"Disruption mission (Jupiter)","w":"https://wiki.warframe.com/w/Ganymede"},"H-2 Cloud":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Skirmish mission (Veil Proxima)","w":"https://wiki.warframe.com/w/H-2_Cloud"},"Hades":{"unlock":"5 Animo Nav Beacons per player (hack Ambulas units on Pluto Corpus Outpost missions); 3 refunded on win","what":"Ambulas boss for Trinity parts","w":"https://wiki.warframe.com/w/Ambulas"},"Halako Perimeter":{"unlock":"Quest: Angels of the Zariman","what":"Exterminate mission (Zariman)","w":"https://wiki.warframe.com/w/Halako_Perimeter"},"Icefields of Riddah":{"unlock":"Buy Grendel Chassis Locator (25 Vitus Essence, Arbitration Honors)","what":"Grendel Chassis BP mission","w":"https://wiki.warframe.com/w/Grendel"},"Isleweaver":{"unlock":"Quest: The Hex","what":"Duviri mode ending with The Fragmented One","w":"https://wiki.warframe.com/w/Isleweaver"},"Jordas Golem Assassinate":{"unlock":"Complete Quest: The Jordas Precept (needs Pluto to Eris Junction)","what":"Boss fight for Atlas parts","w":"https://wiki.warframe.com/w/Jordas_Golem"},"Kasio's Rest":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Skirmish mission (Saturn Proxima)","w":"https://wiki.warframe.com/w/Kasio's_Rest"},"Khufu Envoy":{"unlock":"Quest: The War Within and Railjack Intrinsics rank 5 or higher","what":"Orphix mission (Pluto Proxima)","w":"https://wiki.warframe.com/w/Khufu_Envoy"},"Kuva Lich Confrontation":{"unlock":"Active Kuva Lich + Railjack Intrinsics rank 3+","what":"Final fight with your Kuva Lich","w":"https://wiki.warframe.com/w/Kuva_Lich"},"Köbinn West":{"unlock":"Quest: The Hex","what":"Legacyte Harvest mission (Höllvania)","w":"https://wiki.warframe.com/w/K%C3%B6binn_West"},"Lower Vehrvod":{"unlock":"Quest: The Hex","what":"Faceoff mission (Höllvania)","w":"https://wiki.warframe.com/w/Lower_Vehrvod"},"Lu-yan":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Survival mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Lu-yan"},"Lupal Pass":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Skirmish mission (Saturn Proxima)","w":"https://wiki.warframe.com/w/Lupal_Pass"},"Magnacidium":{"what":"Lephantis boss for Nekros parts","w":"https://wiki.warframe.com/w/Lephantis"},"Mammon's Prospect":{"unlock":"Quest: The War Within and Railjack Intrinsics rank 3 or higher","what":"Orphix mission (Neptune Proxima)","w":"https://wiki.warframe.com/w/Mammon's_Prospect"},"Mausoleum East":{"unlock":"Quest: The Hex","what":"Exterminate mission (Höllvania)","w":"https://wiki.warframe.com/w/Mausoleum_East"},"Merrow":{"unlock":"25 Judgement Points per player (earn in Rathuum arenas: Nakki, Yam, Vodyanoi)","what":"Kela De Thaym boss for Saryn parts","w":"https://wiki.warframe.com/w/Kela_De_Thaym"},"Mines of Karishh":{"unlock":"Buy Grendel Systems Locator (25 Vitus Essence, Arbitration Honors)","what":"Grendel Systems BP mission","w":"https://wiki.warframe.com/w/Grendel"},"Mischta Ramparts":{"unlock":"Quest: The Hex","what":"Hell-Scrub mission (Höllvania)","w":"https://wiki.warframe.com/w/Mischta_Ramparts"},"Mordo Cluster":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Skirmish mission (Saturn Proxima)","w":"https://wiki.warframe.com/w/Mordo_Cluster"},"Munio":{"unlock":"Quest: Whispers in the Walls","what":"Mirror Defense mission","w":"https://wiki.warframe.com/w/Mirror_Defense"},"Mutalist Alad V Assassinate":{"unlock":"Craft Mutalist Alad V Assassinate Key (reusable BP from Quest: Patient Zero) using 1 Mutalist Alad V Nav Coordinate (Infested Outbreak invasions, Hyf/Terrorem Deimos, Hive Sabotage caches); equip key in Navigation. Host's key is consumed","what":"Boss fight for Mesa parts","w":"https://wiki.warframe.com/w/Mutalist_Alad_V"},"Nakki":{"what":"Entry Rathuum arena (no points needed); earns Judgement Points","w":"https://wiki.warframe.com/w/Rathuum"},"Nex":{"unlock":"Quest: Whispers in the Walls","what":"Exterminate mission (Deimos)","w":"https://wiki.warframe.com/w/Nex"},"Nodo Gap":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Skirmish mission (Saturn Proxima)","w":"https://wiki.warframe.com/w/Nodo_Gap"},"Nsu Grid":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Skirmish mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Nsu_Grid"},"Nu-gua Mines":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Exterminate mission (Neptune Proxima)","w":"https://wiki.warframe.com/w/Nu-gua_Mines"},"Numina":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Volatile mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Numina"},"Obol Crossing":{"unlock":"Railjack Intrinsics rank 5 or higher","what":"Defense mission (Pluto Proxima)","w":"https://wiki.warframe.com/w/Obol_Crossing"},"Oestrus":{"what":"Infested Salvage mission","w":"https://wiki.warframe.com/w/Infested_Salvage"},"Old Konderuk":{"unlock":"Quest: The Hex","what":"Hell-Scrub mission (Höllvania)","w":"https://wiki.warframe.com/w/Old_Konderuk"},"Orb Vallis":{"what":"Open world on Venus via Fortuna","w":"https://wiki.warframe.com/w/Orb_Vallis"},"Oro":{"unlock":"Mastery Rank 5","what":"Councilor Vay Hek boss for Hydroid parts","w":"https://wiki.warframe.com/w/Councilor_Vay_Hek"},"Oro Works":{"unlock":"Quest: Angels of the Zariman","what":"Void Armageddon mission (Zariman)","w":"https://wiki.warframe.com/w/Oro_Works"},"Peregrine Axis":{"unlock":"Railjack Intrinsics rank 5 or higher","what":"Spy mission (Pluto Proxima)","w":"https://wiki.warframe.com/w/Peregrine_Axis"},"Persto":{"unlock":"Quest: Whispers in the Walls","what":"Survival mission (Deimos)","w":"https://wiki.warframe.com/w/Persto"},"Plains of Eidolon":{"what":"Open world on Earth; Eidolons roam at night","w":"https://wiki.warframe.com/w/Plains_of_Eidolon"},"Plato":{"unlock":"Quest: The Second Dream","what":"Exterminate mission (Lua)","w":"https://wiki.warframe.com/w/Plato"},"Profit Margin":{"unlock":"Railjack Intrinsics rank 5 or higher","what":"Volatile mission (Pluto Proxima)","w":"https://wiki.warframe.com/w/Profit_Margin"},"Psamathe":{"what":"Hyena Pack boss for Loki parts; required for Pluto Junction","w":"https://wiki.warframe.com/w/Hyena_Pack"},"R-9 Cloud":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Skirmish mission (Veil Proxima)","w":"https://wiki.warframe.com/w/R-9_Cloud"},"Recall: Dactolyst":{"unlock":"Quest: The Old Peace","what":"The Perita Rebellion mission (Dark Refractory)","w":"https://wiki.warframe.com/w/The_Perita_Rebellion"},"Recall: Hunhullus":{"unlock":"Quest: The Old Peace","what":"The Perita Rebellion mission (Dark Refractory)","w":"https://wiki.warframe.com/w/The_Perita_Rebellion"},"Recall: Prime Vanguard":{"unlock":"Quest: The Old Peace","what":"The Perita Rebellion mission (Dark Refractory)","w":"https://wiki.warframe.com/w/The_Perita_Rebellion"},"Rhu Manor":{"unlock":"Quest: The Hex","what":"Exterminate mission (Höllvania)","w":"https://wiki.warframe.com/w/Rhu_Manor"},"Sabmir Cloud":{"unlock":"Railjack Intrinsics rank 7 or higher and Quest: Chimera Prologue","what":"Spy mission (Veil Proxima)","w":"https://wiki.warframe.com/w/Sabmir_Cloud"},"Sanctuary Onslaught":{"unlock":"Quest: The New Strange; talk to Cephalon Simaris in a Relay","what":"Endless zone-based Simaris mode","w":"https://wiki.warframe.com/w/Sanctuary_Onslaught"},"Saya's Visions":{"unlock":"Complete Quest: Saya's Vigil, then talk to Saya in Cetus","what":"Shrine Defense mission","w":"https://wiki.warframe.com/w/Saya's_Visions"},"Scoria's Angel":{"unlock":"Quest: Jade Shadows","what":"Skirmish + Assassinate mission (Uranus Proxima)","w":"https://wiki.warframe.com/w/Scoria's_Angel"},"Seven Sirens":{"unlock":"Railjack Intrinsics rank 5 or higher","what":"Exterminate mission (Pluto Proxima)","w":"https://wiki.warframe.com/w/Seven_Sirens"},"Sister of Parvos Confrontation":{"unlock":"Active Sister of Parvos + Railjack Intrinsics rank 3+","what":"Final fight with your Sister of Parvos","w":"https://wiki.warframe.com/w/Sisters_of_Parvos"},"Solstice Square":{"unlock":"Quest: The Hex","what":"Stage Defense mission (Höllvania)","w":"https://wiki.warframe.com/w/Solstice_Square"},"Sover Strait":{"unlock":"Quest: Rising Tide","what":"Skirmish mission (Earth Proxima)","w":"https://wiki.warframe.com/w/Sover_Strait"},"Sovereign Grasp":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Volatile mission (Neptune Proxima)","w":"https://wiki.warframe.com/w/Sovereign_Grasp"},"Technocyte Coda Concert":{"unlock":"Quest: The Hex + an active Technocyte Coda adversary","what":"Final confrontation with your Technocyte Coda","w":"https://wiki.warframe.com/w/Technocyte_Coda"},"Testudo":{"unlock":"Quest: Whispers in the Walls; talk to Tagfer in Sanctum Anatomica (costs 1 Search Pulse)","what":"Netracells weekly vault mission (Archon Shards)","w":"https://wiki.warframe.com/w/Netracells"},"The Circuit":{"unlock":"Quest: The Duviri Paradox","what":"Free Roam mission (Duviri)","w":"https://wiki.warframe.com/w/The_Circuit"},"The Descendia":{"unlock":"Quest: The Old Peace (preview after The Teacher); Navigation > Dark Refractory","what":"Weekly tower climb vs Roathe","w":"https://wiki.warframe.com/w/The_Descendia"},"The Duviri Experience":{"unlock":"Quest: The Duviri Paradox","what":"Free Roam mission (Duviri)","w":"https://wiki.warframe.com/w/The_Duviri_Experience"},"The Greenway":{"unlock":"Quest: Angels of the Zariman","what":"Mobile Defense mission (Zariman)","w":"https://wiki.warframe.com/w/The_Greenway"},"The Guilty":{"unlock":"Complete The Old Peace, then bow (Bow/Deep Bow emote) as Uriel before Lotus in the Dark Refractory (Sanctum Anatomica)","what":"Hard-mode boss rush of Perita Rebellion bosses","w":"https://wiki.warframe.com/w/The_Guilty"},"The Index: Endurance":{"what":"Corpus arena: bet credits, score Index points; big credit farm","w":"https://wiki.warframe.com/w/The_Index"},"The Kuva Wytch":{"unlock":"Quest: Jade Shadows","what":"Skirmish + Assassinate mission (Uranus Proxima)","w":"https://wiki.warframe.com/w/The_Kuva_Wytch"},"The Lone Story (Duviri)":{"unlock":"Quest: The Duviri Paradox","what":"Free Roam mission (Duviri)","w":"https://wiki.warframe.com/w/The_Lone_Story"},"The Ropalolyst":{"unlock":"Complete Quest: Chimera Prologue","what":"Sentient boss for Wisp parts; needs Void (Operator) damage","w":"https://wiki.warframe.com/w/Ropalolyst"},"Tikal":{"unlock":"Quest: Saya's Vigil","what":"Dark Sector Excavation","w":"https://wiki.warframe.com/w/Tikal"},"Tuvul Commons":{"unlock":"Quest: Angels of the Zariman","what":"Void Cascade mission (Zariman)","w":"https://wiki.warframe.com/w/Tuvul_Commons"},"Tyana Pass":{"unlock":"Quest: Heart of Deimos (+ Mastery Rank 3)","what":"Mirror Defense mission","w":"https://wiki.warframe.com/w/Mirror_Defense"},"Vand Cluster":{"unlock":"Railjack Intrinsics rank 3 or higher","what":"Skirmish mission (Saturn Proxima)","w":"https://wiki.warframe.com/w/Vand_Cluster"},"Vehrvod District":{"unlock":"Quest: The Hex; clear Lower Vehrvod first","what":"Faceoff mission (Höllvania)","w":"https://wiki.warframe.com/w/Vehrvod_District"},"Vesper Relay":{"unlock":"Complete Quest: Chains of Harrow","what":"Follie's Hunt: paint Shadowgraphs while hunted by Follie","w":"https://wiki.warframe.com/w/Follie's_Hunt"},"Vesper Strait":{"unlock":"Quest: The War Within","what":"Orphix mission (Venus Proxima)","w":"https://wiki.warframe.com/w/Vesper_Strait"},"Victory Plaza":{"unlock":"Quest: The Hex","what":"Assassination mission (Höllvania)","w":"https://wiki.warframe.com/w/Victory_Plaza"},"Vodyanoi":{"unlock":"15 Judgement Points (own, not spent)","what":"Rathuum arena; earns Judgement Points for Kela","w":"https://wiki.warframe.com/w/Rathuum"},"Yam":{"unlock":"10 Judgement Points (own, not spent)","what":"Rathuum arena; earns Judgement Points for Kela","w":"https://wiki.warframe.com/w/Rathuum"},"Yuvarium":{"unlock":"Quest: The War Within","what":"Conjunction Survival (Thrax enemies)","w":"https://wiki.warframe.com/w/Conjunction_Survival"}},"places":[{"n":"Drifter's Camp","aka":["camp","drifters camp","chipper","kahl","kahl's garrison","garrison"],"kind":"Hub","where":"Navigation > Earth > Drifter's Camp node (switches your base of operations)","unlock":["Complete Quest: The New War"],"what":"Hidden cave on Earth; alternate base with Kahl's Garrison, Archon Hunt beacon","w":"https://wiki.warframe.com/w/Drifter's_Camp"},{"n":"Kahl's Garrison","aka":["kahl","garrison","break narmer","kahl weekly"],"kind":"Mode","where":"Drifter's Camp (talk to Kahl)","unlock":["Complete Quest: The New War","Complete Quest: Veilbreaker for full access"],"what":"Weekly Kahl missions; Stock currency for Kahl's shop","w":"https://wiki.warframe.com/w/Kahl's_Garrison"},{"n":"Chrysalith","aka":["zariman hub","holdfasts","quinn","cavalero","hombask","archimedean yonta"],"kind":"Hub","where":"Navigation > Zariman > Chrysalith","unlock":["Complete Quest: The New War","Complete Quest: Angels of the Zariman"],"what":"Holdfasts hub on the Zariman; bounties, vendors","w":"https://wiki.warframe.com/w/Chrysalith"},{"n":"Dormizone","aka":["dorm","zariman apartment","vista suite"],"kind":"Hub","where":"Navigation > Zariman (or Duviri) > Dormizone, or elevator near Hombask in the Chrysalith","unlock":["Complete Quest: Angels of the Zariman or The Duviri Paradox"],"what":"Personal decoratable apartment; Duviri door inside","w":"https://wiki.warframe.com/w/Dormizone"},{"n":"Sanctum Anatomica","aka":["sanctum","albrecht's lab","cavia","bird 3","loid","tagfer","fibonacci"],"kind":"Hub","where":"Navigation > Deimos > Sanctum Anatomica, or stairs from the Necralisk archive room","unlock":["Complete Quest: Heart of Deimos","Complete Quest: The New War","Complete Quest: Whispers in the Walls"],"what":"Albrecht's lab hub; Cavia, Netracells, Deep Archimedea","w":"https://wiki.warframe.com/w/Sanctum_Anatomica"},{"n":"Albrecht's Laboratories","aka":["albrecht labs","laboratory","lab tileset","murmur"],"kind":"Area","where":"Deimos lab nodes (Effervo, Nex, Persto, Cambire, Munio, Armatus) or Sanctum Anatomica navigation","unlock":["Complete Quest: Whispers in the Walls"],"what":"Murmur-infested lab tileset under Deimos","w":"https://wiki.warframe.com/w/Albrecht's_Laboratories"},{"n":"La Cathédrale","aka":["cathedrale","albrecht's exile","marie","lyon","roathe","tektolyst"],"kind":"Hub","where":"Portal in the Sanctum Anatomica (as Drifter only)","unlock":["Complete Quest: The Old Peace"],"what":"Protoframe base; Tektolyst Artifacts / Tauron Strikes from Marie","w":"https://wiki.warframe.com/w/La_Cath%C3%A9drale"},{"n":"Iron Wake","aka":["ironwake","steel meridian outpost","cressa tel","paladino","riven"],"kind":"Hub","where":"Navigation > Earth > Iron Wake","unlock":["Complete Quest: Chains of Harrow (accessed during it)"],"what":"Steel Meridian outpost on Earth","w":"https://wiki.warframe.com/w/Iron_Wake"},{"n":"Cetus","aka":["ostron","konzu","onkko","quills","hok","plains hub"],"kind":"Hub","where":"Navigation > Earth > Cetus","unlock":["Complete Quest: The Teacher"],"what":"Ostron village; gateway to the Plains of Eidolon","w":"https://wiki.warframe.com/w/Cetus"},{"n":"Fortuna","aka":["solaris united","eudico","vox solaris","ventkids","nightcap","rude zuud"],"kind":"Hub","where":"Navigation > Venus > Fortuna (after E Gate)","unlock":["Reach Venus (Venus Junction)","Talk to Eudico to start Quest: Vox Solaris"],"what":"Solaris debt colony; gateway to Orb Vallis","w":"https://wiki.warframe.com/w/Fortuna"},{"n":"Necralisk","aka":["entrati","mother","son","daughter","otak","grandmother","necraloid","deimos hub"],"kind":"Hub","where":"Navigation > Deimos > Necralisk","unlock":["Reach Deimos (clear War on Mars)","Complete Quest: Heart of Deimos for full access"],"what":"Entrati home; gateway to the Cambion Drift","w":"https://wiki.warframe.com/w/Necralisk"},{"n":"Höllvania Central Mall","aka":["1999 hub","the hex","mall","hollvania","hex hub","pom-2","atomicycle"],"kind":"Hub","where":"Pom-2 PC in the Orbiter landing craft (or Backroom)","unlock":["Complete Quest: The Duviri Paradox and The Lotus Eaters","Complete Quest: The Hex"],"what":"The Hex's base in 1999 Höllvania; bounties, vendors","w":"https://wiki.warframe.com/w/H%C3%B6llvania_Central_Mall"},{"n":"Backroom","aka":["entrati backroom","1999 orbiter"],"kind":"Hub","where":"Pom-2 PC (switch base of operations)","unlock":["Complete Quest: The Hex"],"what":"Alternate base of operations inside the Höllvania Central Mall","w":"https://wiki.warframe.com/w/Backroom"},{"n":"Höllvania","aka":["1999","hollvania","hex missions","scaldra","techrot"],"kind":"Area","where":"Pom-2 PC in Orbiter landing craft / Central Mall / Backroom","unlock":["Complete Quest: The Hex"],"what":"1999 city region with its own missions and 1999 Calendar","w":"https://wiki.warframe.com/w/H%C3%B6llvania"},{"n":"Pontis Tower","aka":["uranus proxima hub","ryoku","vena","jade shadows hub"],"kind":"Hub","where":"Uranus Proxima (Railjack) or from Uranus","unlock":["Complete Quest: Jade Shadows","Complete Quest: Jade Shadows: Constellations"],"what":"Railjack hub in Uranus Proxima","w":"https://wiki.warframe.com/w/Pontis_Tower"},{"n":"Relays","aka":["relay","strata","larunda","kronia","orcus","strata relay","larunda relay","kronia relay","orcus relay","baro","darvo","teshin","syndicates"],"kind":"Hub","where":"Navigation > pick the planet > Relay node: Strata (Earth), Larunda (Mercury), Kronia (Saturn), Orcus (Pluto)","unlock":["Strata: reach Mars Junction area; Larunda: past Mercury Junction","Kronia: Mastery Rank 4","Orcus: Mastery Rank 8"],"what":"Tenno social hubs: Syndicates, Simaris, Teshin, Darvo, Baro Ki'Teer","w":"https://wiki.warframe.com/w/Relay"},{"n":"Maroo's Bazaar","aka":["maroo","trade hub","trading","ayatan hunt","bazaar"],"kind":"Hub","where":"Navigation > Mars > Maroo's Bazaar (near Tharsis)","unlock":["Reach Mars","Player trading needs Mastery Rank 2"],"what":"Trade relay; Maroo's weekly Ayatan Treasure Hunt","w":"https://wiki.warframe.com/w/Maroo's_Bazaar"},{"n":"Simaris's Sanctuary","aka":["simaris","sanctuary","synthesis","simulacrum","cephalon simaris"],"kind":"Hub","where":"Any Relay > fast travel > Sanctuary","unlock":["Visit any Relay","Simulacrum: buy Simulacrum Access Key (50,000 standing)"],"what":"Cephalon Simaris: Synthesis scans, Simulacrum, Onslaught","w":"https://wiki.warframe.com/w/Sanctuary_(Cephalon_Simaris)"},{"n":"Clan Dojo","aka":["dojo","clan","dry dock","railjack dock","obstacle course"],"kind":"Hub","where":"Clan Dojo (needs a built Clan Key)","unlock":["Join or create a Clan","Build the Clan Key (blueprint given on joining)"],"what":"Clan base; research labs, Dry Dock for Railjack","w":"https://wiki.warframe.com/w/Clan_Dojo"},{"n":"Dark Refractory","aka":["refractory","descendia","perita","tau memories"],"kind":"Area","where":"Navigation console > Dark Refractory option","unlock":["Complete Quest: The Old Peace (preview allowed after The Teacher)"],"what":"Memory machine: The Descendia, The Perita Rebellion, The Guilty","w":"https://wiki.warframe.com/w/Dark_Refractory"},{"n":"Mutalist Alad V Assassinate","aka":["mutalist alad","alad v","mesa","nav coordinates","mutalist key"],"kind":"Hidden node","where":"Navigation > Eris > Mutalist Alad V node (equip key)","unlock":["Complete Quest: Patient Zero (needs Once Awake + Eris unlocked) for reusable Mutalist Alad V Assassinate Key blueprint","Get 1 Mutalist Alad V Nav Coordinate (Infested Outbreak invasions, Hyf/Terrorem on Deimos, Hive Sabotage caches)","Craft the key in the Foundry; host's key is consumed"],"what":"Boss for Mesa parts","w":"https://wiki.warframe.com/w/Mutalist_Alad_V"},{"n":"Jordas Golem Assassinate","aka":["jordas","golem","atlas","jordas precept"],"kind":"Hidden node","where":"Navigation > Eris > Jordas Golem node","unlock":["Reach Eris (Pluto to Eris Junction)","Complete Quest: The Jordas Precept"],"what":"Archwing boss for Atlas parts","w":"https://wiki.warframe.com/w/Jordas_Golem"},{"n":"Ropalolyst","aka":["ropalolyst","wisp","the ropalolyst","sentient bird"],"kind":"Boss","where":"Navigation > Jupiter > The Ropalolyst","unlock":["Complete Quest: The Sacrifice","Complete Quest: Chimera Prologue"],"what":"Sentient boss for Wisp parts; needs Operator/Void damage","w":"https://wiki.warframe.com/w/Ropalolyst"},{"n":"Kela De Thaym","aka":["kela","rathuum","judgement points","saryn","merrow"],"kind":"Boss","where":"Navigation > Sedna > Merrow","unlock":["Earn Judgement Points in Rathuum arenas (Nakki free; Yam needs 10, Vodyanoi 15)","Have 25 Judgement Points per player to enter Merrow"],"what":"Arena queen boss for Saryn parts","w":"https://wiki.warframe.com/w/Kela_De_Thaym"},{"n":"Ambulas","aka":["hades","animo nav beacon","trinity","ambulas boss"],"kind":"Boss","where":"Navigation > Pluto > Hades","unlock":["Hack Ambulas units on Pluto Corpus Outpost missions for Animo Nav Beacons","Have 5 beacons per player (3 refunded on success)"],"what":"Boss for Trinity parts","w":"https://wiki.warframe.com/w/Ambulas"},{"n":"Hyena Pack","aka":["hyena","psamathe","loki"],"kind":"Boss","where":"Navigation > Neptune > Psamathe","unlock":["Reach Neptune"],"what":"Corpus proxy pack for Loki parts; needed for Pluto Junction","w":"https://wiki.warframe.com/w/Hyena_Pack"},{"n":"Councilor Vay Hek","aka":["vay hek","oro","hydroid"],"kind":"Boss","where":"Navigation > Earth > Oro","unlock":["Mastery Rank 5"],"what":"Boss for Hydroid parts","w":"https://wiki.warframe.com/w/Councilor_Vay_Hek"},{"n":"Lephantis","aka":["lephantis","nekros","magnacidium","derelict assassinate"],"kind":"Boss","where":"Navigation > Deimos > Magnacidium","unlock":["Reach Deimos (clear War on Mars)"],"what":"Infested boss for Nekros parts (formerly Derelict Assassinate key)","w":"https://wiki.warframe.com/w/Lephantis"},{"n":"Zealoid Prelate","aka":["zealoid","pathocyst","exequias","emissary"],"kind":"Boss","where":"Navigation > Deimos > Exequias","unlock":["Reach Deimos"],"what":"Infested boss dropping Pathocyst parts","w":"https://wiki.warframe.com/w/Zealoid_Prelate"},{"n":"The Fragmented","aka":["fragmented","effervo","suzerain","anchorite","zelator"],"kind":"Boss","where":"Navigation > Deimos > Effervo","unlock":["Complete Quest: Whispers in the Walls"],"what":"Murmur bosses in Albrecht's labs","w":"https://wiki.warframe.com/w/The_Fragmented"},{"n":"Razorback Armada","aka":["razorback","razorback cipher","nef anyo"],"kind":"Boss","where":"Event node near the besieged Relay (when Armada is active)","unlock":["Wait for a Razorback Armada event","Build a Razorback Cipher (BP sent by inbox) and equip it in Gear"],"what":"Recurring Corpus boss event","w":"https://wiki.warframe.com/w/Razorback"},{"n":"Nihil's Oubliette","aka":["nihil","nihil oubliette","glassmaker"],"kind":"Boss","where":"Interact with Nihil's Oubliette decoration in the Orbiter (solo)","unlock":["Buy 'Enter Nihil's Oubliette' key (60 Nightwave Cred) and the Oubliette decoration from Nightwave Offerings"],"what":"Rematch Nihil for his lost treasures","w":"https://wiki.warframe.com/w/Enter_Nihil's_Oubliette"},{"n":"Orokin Derelict","aka":["derelict","derelict missions","derelict keys","orokin derelict keys"],"kind":"Area","where":"Now the Deimos tileset (no keys needed since Heart of Deimos)","unlock":["Reach Deimos (clear War on Mars)"],"what":"Infested Orokin tower tileset; old Derelict keys were refunded","w":"https://wiki.warframe.com/w/Orokin_Derelict"},{"n":"Orokin Vault","aka":["derelict vault","dragon key","dragon key vault","golden door","corrupted mods"],"kind":"Area","where":"Hidden vault in Deimos missions (not Defense/Assassination/landscape)","unlock":["Build a Dragon Key (Bleeding, Decaying, Extinguished or Hobbled) and equip it in Gear","Find the vault in a Deimos mission"],"what":"Gives Corrupted Mods","w":"https://wiki.warframe.com/w/Orokin_Vault"},{"n":"Halls of Ascension","aka":["lua puzzle rooms","lua puzzles","seven principles","drift mods","lua secret room","orokin moon rooms"],"kind":"Area","where":"Random puzzle rooms inside Lua (Orokin Moon) missions","unlock":["Complete Quest: The Second Dream (unlocks Lua)"],"what":"Lua puzzle/challenge rooms with a guaranteed Drift Mod","w":"https://wiki.warframe.com/w/Orokin_Moon"},{"n":"Lua Spy Vaults","aka":["lua spy","pavlov","spy vault lua","time rifts"],"kind":"Area","where":"Navigation > Lua > Pavlov (Spy)","unlock":["Complete Quest: The Second Dream"],"what":"Lua Spy vaults with time-shift rifts/puzzles","w":"https://wiki.warframe.com/w/Pavlov"},{"n":"Conjunction Survival","aka":["conjunction","yuvarium","circulus","thrax","lua survival"],"kind":"Mode","where":"Navigation > Lua > Yuvarium / Circulus","unlock":["Complete Quest: The War Within"],"what":"Lua survival with Thrax enemies","w":"https://wiki.warframe.com/w/Conjunction_Survival"},{"n":"Kuva Fortress","aka":["kuva fortress","grineer queens","fortress"],"kind":"Area","where":"Navigation > Kuva Fortress (moves around the Star Chart)","unlock":["Complete Quest: The War Within"],"what":"Kuva Grineer asteroid base with 8 nodes","w":"https://wiki.warframe.com/w/Kuva_Fortress"},{"n":"Kuva Siphon","aka":["kuva flood","kuva siphon","kuva farming","kuva missions"],"kind":"Mode","where":"Kuva-marked nodes on planets near the Kuva Fortress","unlock":["Complete Quest: The War Within","Mastery Rank 5"],"what":"Destroy siphons for Kuva; Kuva Flood = double Kuva, level 80-100","w":"https://wiki.warframe.com/w/Kuva_Siphon"},{"n":"The Index","aka":["index","index endurance","credit farm","nef anyo arena"],"kind":"Mode","where":"Navigation > Neptune > The Index: Endurance (after Nereid)","unlock":["Reach Neptune and clear Nereid"],"what":"Corpus arena; invest credits for big payouts, Index mods","w":"https://wiki.warframe.com/w/The_Index"},{"n":"Sanctuary Onslaught","aka":["onslaught","so","simaris onslaught","focus farm"],"kind":"Mode","where":"Simaris in any Relay, or the Sanctuary Onslaught region in Navigation","unlock":["Complete Quest: Stolen Dreams","Complete Quest: The New Strange"],"what":"Endless zone-based Simaris mode","w":"https://wiki.warframe.com/w/Sanctuary_Onslaught"},{"n":"Elite Sanctuary Onslaught","aka":["eso","elite onslaught","elite so"],"kind":"Mode","where":"Simaris / Navigation > Sanctuary Onslaught","unlock":["Complete Quest: The New Strange","Equip a Rank 30 Warframe (or MR30 with 1 Forma in it)"],"what":"Harder Onslaught; Arcanes, Focus","w":"https://wiki.warframe.com/w/Elite_Sanctuary_Onslaught"},{"n":"Arbitrations","aka":["arbi","arbitration","vitus essence","arbitration honors"],"kind":"Mode","where":"Navigation world-state / Operations window","unlock":["Reach Pluto","Complete Eris Junction task 'Equip a Focus Lens'","Bring a Rank 30 Warframe (or MR30 + 1 Forma)"],"what":"Hourly hard mission, no revives; Vitus Essence","w":"https://wiki.warframe.com/w/Arbitrations"},{"n":"Granum Void","aka":["granum","treasurer","granum crown","extended granum","nightmare granum","exemplar crown","zenith crown","corpus treasurer","golden hand"],"kind":"Mode","where":"Kill a Treasurer on a Corpus Ship mission, then spend the Crown at a Golden Hand Tribute","unlock":["Complete Quest: The Deadlock Protocol","Granum Crown: Venus/Mars/Phobos ships","Exemplar Crown (Extended): Jupiter/Neptune","Zenith Crown (Nightmare): Neptune/Pluto, Steel Path, Sister missions"],"what":"Fight Errant Specters in Parvos Granum's void pocket","w":"https://wiki.warframe.com/w/Granum_Void"},{"n":"Void Fissures","aka":["fissure","relic","relics","void relic","omnia fissure","void storm","prime parts"],"kind":"Mode","where":"Navigation > Fissures tab (world state)","unlock":["Have a Void Relic (refine in Orbiter)","Have the node unlocked (any node on Steel Path)"],"what":"Crack Void Relics for Prime parts","w":"https://wiki.warframe.com/w/Void_Fissure"},{"n":"The Steel Path","aka":["steel path","sp","teshin","steel essence","steel path honors"],"kind":"Mode","where":"Navigation toggle; Teshin in any Relay for Steel Path Honors","unlock":["Complete every Star Chart node available before The New War","Reach Mastery Rank 5 (Oro)","Talk to Teshin in a Relay, ask 'Steel Path?'"],"what":"Hard-mode Star Chart; Steel Essence, Teshin's Steel Path Honors","w":"https://wiki.warframe.com/w/The_Steel_Path"},{"n":"Sortie","aka":["sorties","daily sortie","riven sortie"],"kind":"Mode","where":"Navigation world-state / Sortie tab","unlock":["Mastery Rank 5","Complete Quest: The War Within","Complete Oro (Earth)","Rank 30 Warframe (or MR30 + 1 Forma)"],"what":"Daily 3-mission challenge; Rivens, Kuva, etc.","w":"https://wiki.warframe.com/w/Sortie"},{"n":"Archon Hunt","aka":["archon","archon shard","archon hunt","weekly archon"],"kind":"Mode","where":"Navigation world-state, or beacon in Drifter's Camp (Kahl rank 4)","unlock":["Complete Quest: Veilbreaker"],"what":"Weekly 3-mission Archon fight; Archon Shards","w":"https://wiki.warframe.com/w/Archon_Hunt"},{"n":"Nightmare Mode","aka":["nightmare","nightmare mods"],"kind":"Mode","where":"Nightmare missions on the Star Chart","unlock":["Complete all nodes on that planet"],"what":"Harder modifiers; Nightmare Mods","w":"https://wiki.warframe.com/w/Nightmare_Mode"},{"n":"Netracells","aka":["netracell","testudo","search pulse","archon shards","tagfer"],"kind":"Mode","where":"Sanctum Anatomica > talk to Tagfer","unlock":["Complete Quest: Whispers in the Walls","Costs 1 Search Pulse (5 per week)"],"what":"Weekly lab vault runs; Archon Shards","w":"https://wiki.warframe.com/w/Netracells"},{"n":"Deep Archimedea","aka":["archimedea","elite deep archimedea","eda","da"],"kind":"Mode","where":"Sanctum Anatomica (Cavia)","unlock":["Complete Quest: Whispers in the Walls","Finish 1 Netracell","Reach Cavia rank 5 (Illuminate)","Costs 2 Search Pulses per week"],"what":"Weekly 3-mission gauntlet with modifiers; Elite version harder","w":"https://wiki.warframe.com/w/Deep_Archimedea"},{"n":"Temporal Archimedea","aka":["eta","elite temporal archimedea","ta","1999 archimedea"],"kind":"Mode","where":"Höllvania Central Mall","unlock":["Complete Quest: The Hex","Reach The Hex rank 5 (Pizza Party)","Costs 2 Search Pulses per week"],"what":"1999 weekly gauntlet; Elite version harder","w":"https://wiki.warframe.com/w/Temporal_Archimedea"},{"n":"The Icebind","aka":["icebind","glacial defiance","melica","6 player"],"kind":"Mode","where":"Cephalon Melica at Yuvan Peak, Earth","unlock":["Complete Angels of the Zariman and Whispers in the Walls","Have Elite Deep or Elite Temporal Archimedea unlocked"],"what":"Six-player squad voting mode","w":"https://wiki.warframe.com/w/The_Icebind"},{"n":"Eidolon Hunts","aka":["eidolon","teralyst","gantulyst","hydrolyst","tridolon","eidolon lure","night plains","vomvalyst"],"kind":"Boss","where":"Plains of Eidolon at night (via Cetus)","unlock":["Complete Quest: The War Within (Operator Void damage)","Amp recommended; bring charged Eidolon Lures (from The Quills) to capture","Capture Teralyst to summon Gantulyst, then Hydrolyst"],"what":"Night-time Sentient bosses; Arcanes, Sentient Cores","w":"https://wiki.warframe.com/w/Eidolon_Teralyst"},{"n":"Plains of Eidolon","aka":["poe","plains","eidolon plains","earth open world"],"kind":"Area","where":"Navigation > Earth > Cetus or Plains node","unlock":["Complete Quest: Vor's Prize (Cetus entry needs The Teacher)"],"what":"Earth open world; fishing, mining, bounties","w":"https://wiki.warframe.com/w/Plains_of_Eidolon"},{"n":"Orb Vallis","aka":["vallis","venus open world","fortuna open world","orb"],"kind":"Area","where":"Navigation > Venus > Fortuna or Orb Vallis","unlock":["Reach Venus"],"what":"Venus open world; Solaris United bounties","w":"https://wiki.warframe.com/w/Orb_Vallis"},{"n":"Profit-Taker","aka":["profit taker","pt","profit-taker orb","heist","orb mother"],"kind":"Boss","where":"Fortuna > Eudico's backroom briefing table (Heist)","unlock":["Reach Solaris United rank 5 (Old Mate)","Bring Archgun + Archgun Deployer"],"what":"Orb Vallis heist boss","w":"https://wiki.warframe.com/w/Profit-Taker_Orb"},{"n":"Exploiter Orb","aka":["exploiter","deck 12","thermia","diluted thermia","thermia fractures"],"kind":"Boss","where":"Deck 12 cave in Orb Vallis (NE of Harindi Crater), or Eudico's Heist","unlock":["Have 1 Diluted Thermia (from Thermia Fractures events), insert at Deck 12's Thermic Condenser","Or via Eudico's Heist (needs Solaris United rank 5 Old Mate)"],"what":"Orb Mother boss","w":"https://wiki.warframe.com/w/Exploiter_Orb"},{"n":"Deepmines","aka":["deep mines","nightcap","fungus","scrofa"],"kind":"Area","where":"Fortuna > Nightcap's Deepmines Bounties","unlock":["Complete Quest: The New War"],"what":"Fungal caves under Orb Vallis","w":"https://wiki.warframe.com/w/Deepmines"},{"n":"Cambion Drift","aka":["cambion","deimos open world","drift","fass","vome"],"kind":"Area","where":"Navigation > Deimos > Necralisk / Cambion Drift","unlock":["Complete Quest: Heart of Deimos for full access"],"what":"Deimos open world; Entrati bounties","w":"https://wiki.warframe.com/w/Cambion_Drift"},{"n":"Isolation Vaults","aka":["iso vault","isolation vault","arcana bounty","loid","requiem cipher"],"kind":"Mode","where":"Isolation Vault bounty from Mother (Necralisk or her Drift outposts)","unlock":["Complete Quest: Heart of Deimos","Complete Quest: The War Within (Void damage step)"],"what":"Entrati vault bounties; Necramech parts, Arcanes","w":"https://wiki.warframe.com/w/Isolation_Vault"},{"n":"Zariman Ten Zero","aka":["zariman","void angels","holdfasts missions","void flood","void cascade","void armageddon"],"kind":"Area","where":"Navigation > Zariman, or Chrysalith elevator","unlock":["Complete Quest: The New War","Complete Quest: Angels of the Zariman"],"what":"Orokin colony ship; Holdfasts missions","w":"https://wiki.warframe.com/w/Zariman_Ten_Zero"},{"n":"Void Angel","aka":["zariman angel","void angel","ravenous","focus angel"],"kind":"Boss","where":"Any Zariman mission (wake the dormant angel)","unlock":["Complete Quest: Angels of the Zariman"],"what":"Zariman field boss; Focus, Holdfast bounty targets","w":"https://wiki.warframe.com/w/Void_Angel"},{"n":"Mirror Defense","aka":["mirror","tyana pass","munio"],"kind":"Mode","where":"Mars > Tyana Pass; Deimos > Munio","unlock":["Tyana Pass: Heart of Deimos + MR3","Munio: Whispers in the Walls"],"what":"Two-portal defense mode","w":"https://wiki.warframe.com/w/Mirror_Defense"},{"n":"Alchemy","aka":["alchemy","cambire","amphors"],"kind":"Mode","where":"Navigation > Deimos > Cambire","unlock":["Complete Quest: Whispers in the Walls"],"what":"Element-mixing defense mode","w":"https://wiki.warframe.com/w/Alchemy"},{"n":"Ascension","aka":["ascension","brutus"],"kind":"Mode","where":"Navigation > Uranus > Brutus","unlock":["Complete Quest: Jade Shadows"],"what":"Escort/ascend mode","w":"https://wiki.warframe.com/w/Ascension"},{"n":"Rathuum","aka":["rathuum","nakki","yam","vodyanoi","executioners","arena"],"kind":"Mode","where":"Navigation > Sedna > Nakki / Yam / Vodyanoi","unlock":["Nakki: open","Yam: 10 Judgement Points","Vodyanoi: 15 Judgement Points"],"what":"Kela's arena; earn Judgement Points","w":"https://wiki.warframe.com/w/Rathuum"},{"n":"Infested Salvage","aka":["salvage","oestrus"],"kind":"Mode","where":"Navigation > Eris > Oestrus","unlock":["Reach Eris"],"what":"Clear infested consoles mode","w":"https://wiki.warframe.com/w/Infested_Salvage"},{"n":"Railjack","aka":["railjack","empyrean","proxima","dry dock","intrinsics"],"kind":"Mode","where":"Dry Dock in Clan Dojo or Railjack in Navigation","unlock":["Complete Quest: Rising Tide (needs The War Within)","Proxima chain: Earth/Venus > Saturn (Intrinsics 3) > Neptune (3) > Pluto (5) > Veil (7 + Chimera Prologue)"],"what":"Ship-combat Proxima regions","w":"https://wiki.warframe.com/w/Railjack"},{"n":"Kuva Lich","aka":["lich","kuva larvling","lich hunt","requiem","parazon","murmur"],"kind":"Mode","where":"Mercy-kill a Kuva Larvling in a level 20+ Grineer mission","unlock":["Complete Quest: The War Within","Mastery Rank 5","Own a Railjack (for the Saturn Proxima confrontation)"],"what":"Grineer adversary; Kuva weapons, Ephemeras","w":"https://wiki.warframe.com/w/Kuva_Lich"},{"n":"Sisters of Parvos","aka":["sister","candidate","sister hunt","tenet weapons"],"kind":"Mode","where":"Mercy-kill a Candidate (spawns after Nightmare Granum Void rank 1+)","unlock":["Complete The War Within and Call of the Tempestarii","Mastery Rank 5","Reach Nightmare Granum Void rank 1 (Zenith Crown)"],"what":"Corpus adversary; Tenet weapons","w":"https://wiki.warframe.com/w/Sisters_of_Parvos"},{"n":"Technocyte Coda","aka":["coda","technocyte","on-lyne","coda hunt"],"kind":"Mode","where":"Techrot in Höllvania Exterminate/Hell-Scrub/Legacyte Harvest drop a Mixtape; final fight at Technocyte Coda Concert (Earth Proxima)","unlock":["Complete Quest: The Hex","Have no active Lich/Sister/Coda"],"what":"Techrot adversary; Coda weapons","w":"https://wiki.warframe.com/w/Technocyte_Coda"},{"n":"Dark Sectors","aka":["dark sector","dark sectors","tikal"],"kind":"Area","where":"Specific nodes on many planets (Infested-controlled)","unlock":["Unlock the node normally (Tikal needs Saya's Vigil)"],"what":"Endless nodes with bonus credits/resources/affinity","w":"https://wiki.warframe.com/w/Dark_Sectors"},{"n":"Conclave","aka":["pvp","conclave","teshin","cephalon capture","annihilation"],"kind":"Mode","where":"Conclave console next to Orbiter Navigation, or Relay Conclave hall","unlock":["None found on the wiki (MR0-2 get Recruit Conditioning matchmaking)"],"what":"PvP modes run by Teshin","w":"https://wiki.warframe.com/w/Conclave"},{"n":"Lunaro","aka":["lunaro","ball game"],"kind":"Mode","where":"Conclave console in the Orbiter or Relay","unlock":["None found on the wiki"],"what":"Tenno PvP sport","w":"https://wiki.warframe.com/w/Lunaro"},{"n":"The Circuit","aka":["circuit","steel path circuit","duviri circuit","incarnon"],"kind":"Mode","where":"Duviri screen (Dominus Thrax icon) > The Circuit","unlock":["Complete Quest: The Duviri Paradox"],"what":"Weekly endless Duviri mode; Incarnon Adapters, Warframes","w":"https://wiki.warframe.com/w/The_Circuit"},{"n":"Duviri","aka":["duviri","dominus thrax","lone story","duviri experience","kaithe","teshin cave"],"kind":"Area","where":"Star Chart: Dominus Thrax bust icon top-right, or Dormizone door","unlock":["Complete Quest: The Duviri Paradox (needs Uranus Junction)"],"what":"Void kingdom open world; Drifter","w":"https://wiki.warframe.com/w/Duviri"},{"n":"Isleweaver","aka":["isleweaver","fragmented one"],"kind":"Mode","where":"Duviri screen > Isleweaver","unlock":["Complete Quest: The Hex"],"what":"Duviri mode ending at The Fragmented One","w":"https://wiki.warframe.com/w/Isleweaver"},{"n":"The Descendia","aka":["descendia","roathe","tower of hell"],"kind":"Mode","where":"Navigation > Dark Refractory > The Descendia","unlock":["Complete Quest: The Old Peace (preview after The Teacher)"],"what":"Weekly tower climb vs Roathe","w":"https://wiki.warframe.com/w/The_Descendia"},{"n":"The Perita Rebellion","aka":["perita","perita rebellion","recall","tau war"],"kind":"Mode","where":"Navigation > Dark Refractory > The Perita Rebellion","unlock":["Complete Quest: The Old Peace (preview after The Teacher)"],"what":"Daily Tau-memory missions; Recall boss nodes","w":"https://wiki.warframe.com/w/The_Perita_Rebellion"},{"n":"The Guilty","aka":["guilty","perita hard mode","boss rush"],"kind":"Hidden node","where":"Dark Refractory","unlock":["Complete Quest: The Old Peace","Bow/Deep Bow emote as Uriel in front of Lotus in the Dark Refractory (Sanctum Anatomica)"],"what":"Hidden hard-mode boss rush","w":"https://wiki.warframe.com/w/The_Guilty"},{"n":"Follie's Hunt","aka":["vesper relay","follie","shadowgraph","atramentum","zorba"],"kind":"Mode","where":"Navigation > Venus > Vesper Relay","unlock":["Complete Quest: Chains of Harrow"],"what":"Paint-collecting hunt in the ruined Vesper Relay","w":"https://wiki.warframe.com/w/Follie's_Hunt"},{"n":"Saya's Visions","aka":["saya","shrine defense"],"kind":"Mode","where":"Cetus (talk to Saya)","unlock":["Complete Quest: Saya's Vigil","Talk to Saya in Cetus"],"what":"Shrine Defense mission","w":"https://wiki.warframe.com/w/Saya's_Visions"},{"n":"Grendel Missions","aka":["grendel","grendel locator","archaeo-freighter","icefields of riddah","mines of karishh"],"kind":"Hidden node","where":"Navigation > Europa (node appears after buying a Locator)","unlock":["Buy Grendel Locators (25 Vitus Essence each) from Arbitration Honors in a Relay"],"what":"Three special Europa missions for Grendel parts","w":"https://wiki.warframe.com/w/Grendel"},{"n":"Fomorian Sabotage","aka":["fomorian","balor fomorian","fomorian disruptor"],"kind":"Mode","where":"Event node when Grineer win Invasions","unlock":["Build a Fomorian Disruptor (BP sent by inbox) and equip it"],"what":"Archwing event to destroy a Balor Fomorian","w":"https://wiki.warframe.com/w/Sabotage/Fomorian"},{"n":"Simulacrum","aka":["simulacrum","damage test","mimeograph"],"kind":"Area","where":"Next to Simaris's Sanctuary in any Relay","unlock":["Buy Simulacrum Access Key from Cephalon Simaris (50,000 standing)"],"what":"Test arena with scanned enemies","w":"https://wiki.warframe.com/w/Simulacrum"},{"n":"Invasions","aka":["invasion","infested outbreak","outbreak"],"kind":"Mode","where":"Navigation world-state","unlock":["Unlock the node"],"what":"Faction-war missions; Nav Coordinates from Infested outbreaks","w":"https://wiki.warframe.com/w/Invasion"},{"n":"1999 Calendar","aka":["calendar","1999 calendar","seasons"],"kind":"Mode","where":"Pom-2 PC (Orbiter, Mall or Backroom)","unlock":["Complete Quest: The Hex"],"what":"Höllvania reward calendar","w":"https://wiki.warframe.com/w/1999_Calendar"}]};
/* ---------- nodes and places: every star-chart node and every hidden or special place, in the Farm finder and the main search ----------
   Each one says where it is and how to unlock it. Places data: 4699964-places-data.js (from wiki.warframe.com). */
const PLX=(()=>{const out={},dup={};
  for(const n of ALLN)dup[n.n]=(dup[n.n]||0)+1;
  for(const n of ALLN){const k=dup[n.n]>1?n.n+' ('+n.p+')':n.n;out[k]={k,n:n.n,node:n}}
  for(const p of PLACES_INFO.places){const k=out[p.n]&&!out[p.n].place?p.n+' ('+p.kind+')':p.n;out[k]={k,n:p.n,place:p}}
  return out})();
const plSub=e=>e.place?e.place.kind:[e.node.t,e.node.p].filter(Boolean).join(' · ');
const plCat=e=>e.place?'Hidden & special':e.node.p;
{const _b=buildIdx;buildIdx=function(){_b();for(const e of Object.values(PLX))IDX.push([e.k,'place',plSub(e),plCat(e)])}}
FFT.push(['place','Nodes & places']);
function placeUnlock(e){if(e.place)return e.place.unlock||[];const N=e.node,s=PLACES_INFO.nodes[N.n],r=PLACES_INFO.regions[N.p];const u=[];
  if(s&&s.unlock)u.push(s.unlock);if(r&&r.unlock)u.push((s&&s.unlock?'To reach '+N.p+': ':'')+r.unlock);
  if(!u.length)u.push(`Complete a connected node on ${N.p}.`);return u}
function placeDetail(k){const e=PLX[k];if(!e)return '';const N=e.node,P=e.place,s=N&&PLACES_INFO.nodes[N.n];
  const chips=P?`<span class="chip">${esc(P.kind)}</span>`:`<span class="chip">${esc(N.t)}</span><span class="chip">${esc(N.p)}</span>${N.lv&&N.lv[0]?`<span class="chip">Level ${N.lv[0]}–${N.lv[1]}</span>`:''}${N.ds?`<span class="chip gold">Dark Sector${N.rb?' · +'+Math.round(N.rb*100)+'% resources':''}</span>`:''}`;
  const what=P?P.what:s&&s.what;const w=P?P.w:(s&&s.w)||(PLACES_INFO.regions[N.p]||{}).w;
  const un=placeUnlock(e);
  return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(e.n)}</h3>${chips}</div></div><div style="padding:12px 14px" class="stack">
    ${what?`<div>${esc(what)}</div>`:''}
    ${P&&P.where?`<div class="small"><b>Where:</b> ${esc(P.where)}</div>`:''}
    <div class="tier cut"><h4>How to unlock</h4>${un.length>1?`<ol class="small" style="margin:0;padding-left:20px;list-style:decimal;display:grid;gap:4px">${un.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:`<div class="small">${esc(un[0]||'')}</div>`}</div>
    <div class="row">${N?`<button type="button" class="btn sm" data-go="node|${esc(N.p)}">Open ${esc(N.p)} on the Star chart</button>`:''}${w?`<a class="btn sm" href="${esc(w)}" target="_blank" rel="noopener">Warframe wiki</a>`:''}</div>
  </div></section>`}
{const _d=detail;detail=function(sel){return sel.startsWith('place|')?placeDetail(sel.slice(6)):_d(sel)}}
/* main search: nodes and places, and open-world fish, ore and animals */
{const _c=cmdIndex;cmdIndex=function(){if(CMDX)return CMDX;const x=_c();
  for(const e of Object.values(PLX))x.push({n:e.k,g:'Places',act:'place|'+e.k,s:plSub(e),l:e.k.toLowerCase(),a:[...((e.place&&e.place.aka)||[]),plCat(e),e.node?e.node.t:''].join(' ').toLowerCase()});
  if(typeof owIndex==='function')for(const o of Object.values(owIndex()))x.push({n:o.n,g:'Open worlds',act:'ow|'+o.n,s:o.kind+' · '+o.reg,l:o.n.toLowerCase(),a:(o.kind+' '+o.reg).toLowerCase()});
  return CMDX=x}}
CMDG.push('Places','Open worlds');
/* ---------- events ---------- */
function syncRow(o){const row=o.closest('.step,.mod,.mitem,.qrow');if(row&&row.querySelector('input.ck')===o)row.classList.toggle('done',o.checked)}
async function copy(text,msg){try{await navigator.clipboard.writeText(text);toast(msg)}catch(e){const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();toast(ok?msg:'Copy blocked here. The whisper is: '+text)}}
document.addEventListener('change',e=>{const t=e.target;
  if(t.matches('input.ck[data-k]')){const k=t.dataset.k;setK(k,t.checked);document.querySelectorAll(`input.ck[data-k="${CSS.escape(k)}"]`).forEach(o=>{o.checked=t.checked;syncRow(o)});refresh();
    if(k.startsWith('q|')&&location.hash==='#quests'){const y=window.scrollY;render();window.scrollTo(0,y)}}
  if(t.id==='fsel'){state.frame=t.value;state.build=0;saveUI();render()}
  if(t.id==='msort'){state.mkSort=t.value;render()}
  if(t.id==='tgt'){state.target=+t.value;render()}
  if(t.id==='intr'||t.id==='adj'){P[t.id]=+t.value||0;saveProfile();updateMR();if(location.hash==='#tenno'){const y=window.scrollY;render();window.scrollTo(0,y)}}
  if(t.id==='wfid'){const id=findId(t.value);if(id)setWfid(id);else if(t.value.trim())toast(typeof idMiss==='function'?idMiss(t.value):'No 24-character account ID found in that text.')}
  if(t.id==='eelog'&&t.files&&t.files[0]){readLog(t.files[0])}
  if(t.dataset.othin){P.oth=P.oth||{};P.oth[t.dataset.othin]=Math.max(0,+t.value||0);saveProfile();updateMR();const y=scrollY;render();scrollTo(0,y);return}
  if(t.dataset.dw){const id=t.dataset.dw;P.dw=P.dw||{};if(t.checked)P.dw[id]=Date.now();else delete P.dw[id];logDW(id,t.checked);saveProfile();const y=scrollY;render();scrollTo(0,y);
    if(t.checked){const c=allChecks().find(x=>x[1]===id);const lg=logList()[0];toastAction((c?c[2]:'Done')+' ticked off','Undo',()=>{if(lg&&lg.key===id)logUndo(lg.id);else{delete P.dw[id];logDW(id,false);saveProfile();rerender()}})}return}
  if(t.dataset.synr||t.dataset.syns){const n=t.dataset.synr||t.dataset.syns;P.syn=P.syn||{};const cur=P.syn[n]||{};if(t.dataset.synr)cur.r=+t.value;else cur.s=+t.value||0;cur.sync=0;P.syn[n]=cur;saveProfile();const y=scrollY;render();scrollTo(0,y);return}
  const SEL2={scs:'scS',ckf:'ckF',fif:'fiF',fim:'fiM',syf:'syF',sys:'syS',gs:'gS',hf:'hF',qf:'qF',mtype:'misType',rsf:'rsF',fft:'ffT',ffc:'ffC',frf:'frF',mkf:'mkF',rks:'rkS'};
  if(SEL2[t.id]){state[SEL2[t.id]]=t.value;saveUI();const y=scrollY;render();scrollTo(0,y);return}
  if(t.matches('[data-rkin]')){const row=t.closest('.rk');const n=row.dataset.n;setRank(n,t.value);row.outerHTML=rkRow(I[n])}
  if(t.dataset.intrin){setIntr(t.dataset.intrin,t.value);const y=window.scrollY;render();window.scrollTo(0,y)}
  if(t.id==='rkf'){state.rkF=t.value;saveUI();render()}
  if(t.dataset.bo!==undefined&&t.matches('[data-bo]')){P.bo=P.bo||{};const v=t.value.trim();if(v==='')delete P.bo[t.dataset.bo];else P.bo[t.dataset.bo]=+v;saveProfile();updateMR();const y=window.scrollY;render();window.scrollTo(0,y)}
  if(t.id==='gmr'||t.id==='gxp'){P[t.id]=t.value===''?null:+t.value;if(t.id==='gmr'&&t.value!==''){P.prof=P.prof||{};P.prof.mr=+t.value}saveProfile();const y=scrollY;render();scrollTo(0,y);return}
  if(t.id==='tname'){P.tname=t.value.trim();saveProfile();render()}
  if(t.dataset.inv){P.inv=P.inv||{};const v=t.value.trim();if(v==='')delete P.inv[t.dataset.inv];else P.inv[t.dataset.inv]=+v;saveProfile()}});
document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('details.lazy')&&d.open){const b=d.querySelector(':scope > .lazybody, :scope > .sub');if(b&&!b.dataset.f){b.dataset.f=1;b.innerHTML=itemTree(d.dataset.tree,{note:d.dataset.note,depth:+d.dataset.depth||0});refresh()}}},true);
document.addEventListener('click',async e=>{
  if(e.target.id==='drawer'){setMenu(false);return}
  /* tapping a row's name never ticks it: only the checkbox completes things */
  const t=e.target.closest('#unlink,[data-scp],[data-ipip],[data-oth],#exhtml,#exjson,[data-goal],#syh,#gshort,#lggoogle,#lgin,#lgnew,#lgreset,#lgout,#acctbtn,#autosync,[data-rk],[data-intr],[data-rkcat],[data-qupto],#rkmaxall,#boreset,[data-go],[data-mtab],[data-ttab],[data-mk],[data-build],[data-frame],[data-pick],[data-cat],[data-planet],[data-q],[data-wh],[data-fstart],[data-fclaim],[data-fdel],#menu,#budget,#unv,#allhide,#mishide,#imp,#bk-copy,#bk-file,#bk-restore,#jump,#faddb,#openprof');
  if(!t)return;
  if(t.id==='menu'){setMenu(!$('#drawer').classList.contains('open'));return}
  if(t.id==='unlink'){P.wfid='';lsSet('tenno-acct','');saveProfile();render();return}
  if(t.dataset.scp!==undefined){e.preventDefault();state.scP=t.dataset.scp||null;state.scQ='';if(location.hash!=='#missions')location.hash='missions';else{render();scrollTo(0,0)}return}
  if(t.dataset.ipip){const [key,n,v]=t.dataset.ipip.split('|');setIntr(key+'|'+n,+v);const y=scrollY;render();scrollTo(0,y);return}
  if(t.dataset.oth){P.oth=P.oth||{};const k=t.dataset.oth;P.oth[k]=Math.max(0,(+P.oth[k]||0)+(+t.dataset.d));saveProfile();updateMR();const y=scrollY;render();scrollTo(0,y);return}
  if(t.id==='exhtml'){const nm=(P.tname||(P.prof&&P.prof.name)||'tenno').replace(/\W+/g,'-');saveFile('tennoform-report-'+nm+'.html',reportHTML(),'text/html');return}
  if(t.id==='exjson'){saveFile('tennoform-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(backupObj(),null,1),'application/json');return}
  if(t.dataset.goal){const n=t.dataset.goal;P.goals=P.goals||[];const i=P.goals.indexOf(n);if(i>=0)P.goals.splice(i,1);else P.goals.push(n);saveProfile();toast(i>=0?'Removed from Goals':'Added to Goals');const y=scrollY;render();scrollTo(0,y);return}
  if(t.id==='syh'){state.syH=!state.syH;saveUI();render();return}
  if(t.id==='gshort'){state.gShort=!state.gShort;render();return}
  if(t.id==='lggoogle'){signGoogle();return}
  if(t.id==='lgin'){signEmail(false);return}
  if(t.id==='lgnew'){signEmail(true);return}
  if(t.id==='lgreset'){resetPw();return}
  if(t.id==='lgout'){flushNow();FB&&FB.auth.signOut();toast('Signed out. Progress stays in this browser too.');return}
  if(t.dataset.rk){const row=t.closest('.rk');const n=row.dataset.n;const r=rankOf(n);setRank(n,t.dataset.rk==='max'?99:r+(+t.dataset.rk));row.outerHTML=rkRow(I[n]);return}
  if(t.dataset.intr){const [key,n]=t.dataset.intr.split('|');const v=+((P[key]||{})[n]||0);setIntr(t.dataset.intr,t.dataset.d==='max'?10:v+(+t.dataset.d));const y=window.scrollY;render();window.scrollTo(0,y);return}
  if(t.dataset.rkcat){e.preventDefault();state.rkCat=t.dataset.rkcat;state.rkQ='';saveUI();if(location.hash!=='#ranks')location.hash='ranks';else render();return}
  if(t.id==='rkmaxall'){if(!t.dataset.armed){const k=(state._rkList||[]).filter(n=>!on('m|'+n)).length;t.dataset.armed=1;t.textContent=`Mark ${k} item${k===1?'':'s'} mastered? Tap again`;t.classList.add('primary');setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.classList.remove('primary');t.textContent='Max all in this list…'}},5000);return}
    logBulk('Maxed '+(state._rkList||[]).filter(n=>!on('m|'+n)).length+' items on Ranks',()=>(state._rkList||[]).forEach(n=>{if(!on('m|'+n))setRank(n,99)}));render();toast('Marked '+(state._rkList||[]).length+' items mastered');return}
  if(t.id==='boreset'){P.bo={};saveProfile();render();toast('Using your Ranks page numbers again');return}
  if(t.dataset.qupto){const q=Q.find(x=>x.n===t.dataset.qupto);const idx=Q.indexOf(q);const arc=/^Arc/.test(q.g);logBulk('Quests up to '+q.n,()=>Q.forEach((o,i)=>{if(i<=idx&&(arc?/^Arc/.test(o.g):o.g===q.g))setK('q|'+o.n,1)}));const y=window.scrollY;render();window.scrollTo(0,y);toast('Marked quests up to '+q.n+' complete');return}
  if(t.dataset.go){e.preventDefault();go(t.dataset.go)}
  else if(t.dataset.mtab){e.preventDefault();state.mTab=t.dataset.mtab;saveUI();if(location.hash!=='#mastery')location.hash='mastery';else render()}
  else if(t.dataset.ttab){e.preventDefault();state.tTab=t.dataset.ttab;saveUI();if(location.hash!=='#tenno')location.hash='tenno';else render()}
  else if(t.dataset.mk){state.mkTab=t.dataset.mk;saveUI();render()}
  else if(t.dataset.build){state.build=+t.dataset.build;render()}
  else if(t.dataset.frame){e.preventDefault();state.frame=t.dataset.frame;state.build=0;saveUI();if(location.hash!=='#frames')location.hash='frames';else{render();window.scrollTo(0,0)}}
  else if(t.dataset.pick){state.farmSel=t.dataset.pick;if(location.hash!=='#farm')location.hash='farm';else{$('#fdet').innerHTML=detail(state.farmSel);document.querySelectorAll('#fres .hit').forEach(h=>h.classList.toggle('sel',h.dataset.pick===state.farmSel));refresh();$('#fdet').scrollIntoView({block:'start',behavior:'smooth'})}}
  else if(t.dataset.cat){state.allCat=t.dataset.cat;state.allQ='';saveUI();render()}
  else if(t.dataset.planet){const md=t.dataset.mode;logBulk('All of '+t.dataset.planet+(md==='sp'?' (Steel Path)':''),()=>ALLN.filter(n=>n.p===t.dataset.planet&&!isJ(n)).forEach(n=>setK(md+'|'+n.id,1)));state.scP=t.dataset.planet;const y=scrollY;render();scrollTo(0,y);toast('Marked '+t.dataset.planet+(md==='sp'?' Steel Path':'')+' complete')}
  else if(t.dataset.q){e.preventDefault();state.qFocus=t.dataset.q;if(location.hash!=='#quests')location.hash='quests';else focusQuest()}
  else if(t.dataset.wh){copy(t.dataset.wh,'Whisper copied. Paste it into in-game chat.')}
  else if(t.dataset.fstart){const n=t.dataset.fstart;const d=foundryFind(n)||43200;P.foundry=P.foundry||[];P.foundry.push({id:Date.now().toString(36),n,t0:Date.now(),dur:d});saveProfile();toast(n+' started · ready in '+hrs(d))}
  else if(t.id==='faddb'){const n=$('#fadd').value.trim();if(!n)return;const d=foundryFind(n);P.foundry=P.foundry||[];P.foundry.push({id:Date.now().toString(36),n,t0:Date.now(),dur:d||43200});saveProfile();render();toast(d?n+' added':'Added with a 12 h default timer')}
  else if(t.dataset.fclaim){const f=(P.foundry||[]).find(x=>x.id===t.dataset.fclaim);if(f){P.foundry=P.foundry.filter(x=>x!==f);if(I[f.n])setK('build|'+f.n,1);else{const m=Object.values(I).find(it=>it.parts.some(p=>p.sub&&it.n+' '+p.n===f.n));if(m)setK('built|'+m.n+'|'+f.n.slice(m.n.length+1),1)}saveProfile();render();toast(f.n+' claimed')}}
  else if(t.dataset.fdel){P.foundry=(P.foundry||[]).filter(x=>x.id!==t.dataset.fdel);saveProfile();render()}
  else if(t.id==='autosync'){t.disabled=true;t.textContent='Syncing…';await autoSync(false);if(t.isConnected){t.disabled=false;t.textContent='Sync automatically'}}
  else if(t.id==='openprof'){if(!/^[0-9a-f]{24}$/i.test(P.wfid||'')){e.preventDefault();toast('Enter your 24-character account ID first');$('#wfid')?.focus()}}
  else if(t.id==='budget'){state.budget=!state.budget;saveUI();render()}
  else if(t.id==='unv'){state.unvOnly=!state.unvOnly;t.classList.toggle('on');$('#fres').innerHTML=resultsHTML()}
  else if(t.id==='jump'){$('#fdet').scrollIntoView({block:'start',behavior:'smooth'})}
  else if(t.id==='allhide'){state.allHide=!state.allHide;saveUI();render()}
  else if(t.id==='mishide'){state.misHide=!state.misHide;saveUI();render()}
  else if(t.id==='imp'){const msg=importProfile($('#pj').value);render();toast(msg)}
  else if(t.id==='bk-copy'){copy(backupCode(),'Backup code copied')}
  else if(t.id==='bk-file'){saveFile('tennoform-backup-'+new Date().toISOString().slice(0,10)+'.txt',backupCode(),'text/plain');}
  else if(t.id==='bk-restore'){if(restore($('#bk-in').value)){render();toast('Progress restored')}else toast('That code didn\'t work. Paste the full backup code.')}});
function focusQuest(){if(!state.qFocus)return;const el=document.getElementById('q-'+state.qFocus.replace(/\W/g,''));state.qFocus=null;if(el){const d=el.closest('details');if(d)d.open=true;el.scrollIntoView({block:'center',behavior:'smooth'});el.style.background='var(--cyan-soft)';setTimeout(()=>el.style.background='',1600)}}
function liveSearch(id,key){const q=$(id);if(!q)return;q.addEventListener('input',()=>{state[key]=q.value;const pos=q.selectionStart;render();const n=$(id);n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}})}
function bindPage(r){
  if(r==='farm'){const q=$('#fq');q.addEventListener('input',()=>{state.farmQ=q.value;state.ffLim=60;$('#fres').innerHTML=resultsHTML()})}
  if(r==='resources')liveSearch('#rq','resQ');
  if(r==='missions')liveSearch('#scq','scQ');
  if(r==='ranks')liveSearch('#rkq','rkQ');
  if(r==='market')liveSearch('#mq','mkQ');
  if(r==='arsenal'&&state.aTab==='arc')liveSearch('#arq','arQ');
  if(r==='relics'&&state.rlTab==='add')liveSearch('#raq','raQ');
  if(r==='relics'&&state.rlTab==='ducats')liveSearch('#duq','duQ');
  if(r==='quests')setTimeout(focusQuest,50);
  if(r==='missions'&&state.planet){const p=state.planet;state.planet=null;setTimeout(()=>{const el=document.getElementById('pl-'+p.replace(/\W/g,''));if(el){el.open=true;el.scrollIntoView({block:'start',behavior:'smooth'})}},50)}
  if(r==='mastery'&&state.mTab==='all')liveSearch('#allq','allQ');
  if(r==='tenno'&&state.tTab==='inventory')liveSearch('#invq','invQ');
  if(r==='resources'&&state.resSel&&window.innerWidth<900&&!state.resQ)setTimeout(()=>$('#rdet')?.scrollIntoView({block:'start'}),30)}
liveResurgence();
function bootSync(){if(HOSTED&&P.wfid&&(!P.auto||Date.now()-new Date(P.auto)>6*3600e3))autoSync(true)}
setInterval(()=>{if(location.hash==='#tenno'&&state.tTab==='foundry'&&!(document.activeElement&&document.activeElement.matches('input,textarea')))render()},60000);
render();fbInit();
document.addEventListener('dragover',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d){e.preventDefault();d.classList.add('over')}});
document.addEventListener('dragleave',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d)d.classList.remove('over')});
document.addEventListener('drop',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d){e.preventDefault();d.classList.remove('over');const f=e.dataTransfer.files[0];if(f)readLog(f)}});
})();
