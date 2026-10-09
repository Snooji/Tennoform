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
  state.idPending=m[1].toLowerCase();state.tTab='account';history.replaceState(null,'','/tenno/'+location.search);
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
{const _as2=autoSync;autoSync=async function(quiet){if(!wfPlat().auto){if(!quiet){state.tTab='account';state.syncFail=false;saveUI();if(HASH()!=='#tenno')GO('tenno');else render();
    toast(`${wfPlat().label} profiles sync with the two quick steps on this page.`);setTimeout(()=>{const b=$('#syncsteps');if(b)b.scrollIntoView({block:'center'})},60)}return false}
  return _as2.apply(this,arguments)}}
