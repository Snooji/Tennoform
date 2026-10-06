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
function feedStatus(){const age=d=>{const t=Date.parse(d);return isNaN(t)?null:(Date.now()-t)/864e5};const dot=k=>`<span class="fdot ${k}" aria-hidden="true"></span>`;
  const g=age(D.meta.built),p=age(D.meta.prices);const gk=g==null||g<21?'ok':'warn',pk=p==null||p<3?'ok':'warn';
  const lk=!HOSTED?'off':WS?'ok':WSerr?'bad':'off';
  return `<span>${dot(gk)}Game data ${D.meta.wfcd?'v'+esc(D.meta.wfcd)+', ':''}${esc(D.meta.built)}${gk==='warn'?' (may be out of date)':''}</span><span>${dot(pk)}Prices ${esc(D.meta.prices)}${pk==='warn'?' (delayed)':''}</span><span>${dot(lk)}Live game feed ${lk==='ok'?'connected':lk==='bad'?'unavailable':HOSTED?'not loaded yet':'on tennoform.com only'}</span>`}
function siteFoot(){return `<footer class="sitefoot"><div class="footcta" role="navigation" aria-label="Tennoform"><a class="btn sm primary" href="#donate">${ic('star','fill')}Support Tennoform</a><a class="btn sm" href="#feedback">Send feedback</a><a class="btn sm" href="#about" data-about="changes">What's new</a></div><div class="feeds">${feedStatus()}</div>
 <div><a class="ln" href="#about">About, data &amp; privacy</a> · <a class="ln" href="#feedback">Feedback</a> · <a class="ln" href="#donate">Support</a> · <a class="ln" href="#about" data-about="changes">What's new</a> · Made by <a class="ln" href="#about">Snooji</a></div>
 <div class="muted">Tennoform is a free, community-made tool. It is not affiliated with, endorsed or sponsored by Digital Extremes. Warframe and its content are trademarks of Digital Extremes Ltd.</div></footer>`}
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
   <li><b>No ads, no analytics, no tracking.</b> Your browser contacts Google Fonts, warframestat.us (live data, item images, profile sync) and Firebase (when signed in).</li>
   <li>You can export your data any time (Profile → Backup &amp; export) and delete your account and everything stored with it (Profile → Account &amp; sync).</li></ul></section>
  <details class="obj grp" ${sec==='changes'?'open':''} id="changes"><summary><h3>What's new</h3></summary><div class="stack" style="padding:10px 14px;gap:8px">${CHANGES.map(([d,t])=>`<div class="small"><b class="mono">${esc(fdate(d))}</b> · ${esc(t)}</div>`).join('')}</div></details>
  <section class="panel cut stack"><h2>Contact</h2><span class="small">Bugs, ideas or wrong data: <a class="ln" href="#feedback">Feedback page</a>. Like the app? <a class="ln" href="#donate">Support Tennoform</a>.</span></section></div>`}
async function deleteAccount(){const u=FB&&FB.auth.currentUser;if(!u)return;const fs=FB.fs;const uid=u.uid;
  const last=new Date(u.metadata.lastSignInTime||0).getTime();if(Date.now()-last>5*60e3){toast('For safety, sign out, sign back in, then delete within 5 minutes.');return}
  try{for(const g of SO.groups){if(g.owner===uid)await fs.collection('groups').doc(g.id).delete().catch(()=>{});else await fs.collection('groups').doc(g.id).update({members:firebase.firestore.FieldValue.arrayRemove(uid),at:Date.now()}).catch(()=>{})}
    const del=async col=>{const s=await col.get();await Promise.all(s.docs.map(d=>d.ref.delete()))};
    await del(fs.collection('inbox').doc(uid).collection('msgs')).catch(()=>{});await del(fs.collection('users').doc(uid).collection('friends')).catch(()=>{});
    await fs.collection('public').doc(uid).delete().catch(()=>{});if(SO.code)await fs.collection('codes').doc(SO.code).delete().catch(()=>{});
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

