/* ---------- accounts front and centre: sign in from the header, the menu, home and the first visit ---------- */
function canAcct(){return HOSTED&&!!(window.TENNO_FIREBASE&&window.TENNO_FIREBASE.apiKey)}
function signedIn(){return !!(acct&&acct.kind==='fb')}
const G_LOGO='<svg class="glogo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.2C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17.1z"/><path fill="#FBBC05" d="M10.6 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7.9-6.2C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.7 2.3-8.7 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z"/></svg>';
function signBlock(where){if(!canAcct()||signedIn())return'';
  return `<div class="signbox ${where||''}"><div class="signtxt"><b>Save your progress to an account</b><span class="small muted">Free. Sign in on any phone or computer and your ranks, goals, tasks and friends are there.</span></div>
   <div class="signbtns"><button type="button" class="btn gbtn" data-google>${G_LOGO}Continue with Google</button><a class="btn" href="#tenno" data-ttab="account">Sign up or sign in with email</a></div></div>`}
document.addEventListener('click',e=>{const g=e.target.closest('[data-google]');if(!g)return;if(typeof setMenu==='function')setMenu(false);if(!FB){toast('Sign-in is still loading. Try again in a moment.');return}signGoogle()});
document.addEventListener('click',e=>{if(e.target.closest('#signbtn')){setMenu(true)}});
