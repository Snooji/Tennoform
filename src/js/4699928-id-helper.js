/* ---------- account ID helper: open warframe.com's ID page, copy it, paste back here ---------- */
/* There's no public way to look an ID up from an in-game name, so this keeps the manual part to "open, copy, paste". */
function idFromText(txt,how){const l=logLogin(txt);const id=l?l.id:findId(txt);if(id){setWfid(id,how,l&&l.name);return true}return false}
async function idPaste(){let txt='';
  try{txt=await navigator.clipboard.readText()}catch(e){}
  if(txt&&idFromText(txt))return;
  const f=$('#wfid');if(f){f.focus();f.select&&f.select()}
  toast(txt?"That doesn't have an account ID in it. Copy the whole warframe.com page, then try again.":"Press and hold the box, then tap Paste.")}
document.addEventListener('click',e=>{const t=e.target.closest('#idopen,#idpaste');if(!t)return;
  if(t.id==='idopen'){state.idOpened=true;saveUI();setTimeout(()=>{const b=$('#idpaste');if(b)b.classList.add('primary')},50)}
  else{e.preventDefault();idPaste()}});
/* coming back from warframe.com: bring the paste button into view */
document.addEventListener('visibilitychange',()=>{if(document.hidden||!state.idOpened||/^[0-9a-f]{24}$/i.test(P.wfid||''))return;
  const b=$('#idpaste');if(b){b.scrollIntoView({block:'center',behavior:'smooth'});b.focus({preventScroll:true})}});
/* pasting the copied page anywhere on the Account tab works too */
document.addEventListener('paste',e=>{if(!$('#idpaste')||/^[0-9a-f]{24}$/i.test(P.wfid||''))return;const tg=e.target;if(tg&&tg.matches&&tg.matches('input,textarea')&&tg.id!=='wfid')return;
  const txt=(e.clipboardData||window.clipboardData).getData('text');if(txt&&idFromText(txt)){e.preventDefault()}});
/* EE.log: only trust the game's own login line, "Logged in <name> (<id>)". Other IDs in the log belong to squadmates, clans or sessions. */
function logLogin(txt){const re=/Logged in (.+?) \(([0-9a-f]{24})\)/gi;let m,last=null;while((m=re.exec(String(txt||''))))last={name:m[1].trim(),id:m[2].toLowerCase()};return last}
{const _fi=findId;findId=function(text){const l=logLogin(text);return l?l.id:_fi(text)}}
readLog=async function(f){let txt;try{txt=await f.text()}catch(e){toast("Couldn't read that file. Try choosing it again.");return}
  const l=logLogin(txt);
  if(l){setWfid(l.id,'EE.log',l.name);return}
  toast(/EE\.log/i.test(f.name)?"This EE.log has no login in it yet. Start Warframe, log in until you reach your Orbiter, then choose EE.log again.":`${f.name} isn't the game log. Choose the file named EE.log in %localappdata%\\Warframe.`)};
