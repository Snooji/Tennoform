/* ---------- Chat rules: agree once before your first message (App Store 1.2, Play UGC policy) ----------
   Saved on the profile (so on the account when signed in); asked again only if the rules change (CHAT_RULES_V). */
const CHAT_RULES_V=1;
function chatRulesOK(){return (P.chatRules||0)>=CHAT_RULES_V}
function chatRulesAsk(){return new Promise(res=>{let d=document.getElementById('tf-rules');if(d)d.remove();d=document.createElement('dialog');d.id='tf-rules';d.className='tf-rules';d.setAttribute('aria-labelledby','tf-rules-h');
  d.innerHTML=`<form method="dialog" class="stack"><h2 id="tf-rules-h">Chat rules</h2><p class="small muted" style="margin:0">Before your first message, please agree to these. They apply to General, Trading, LFG, clan, alliance, group and direct chats.</p>
   <ul class="small" style="margin:0;padding-left:18px;display:grid;gap:6px">
    <li>Be decent. No harassment, hate, threats or targeting anyone.</li>
    <li>Nothing sexual or explicit, nothing illegal, no scams, no selling accounts or real-money trades.</li>
    <li>No spam and no personal information, yours or anyone else's.</li>
    <li>Messages that break these are held for review. You can report any message and block anyone; reported players can be banned from chat.</li>
   </ul>
   <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn" value="no">Not now</button><button class="btn primary" value="yes" autofocus>I agree</button></div></form>`;
  d.addEventListener('close',()=>{const ok=d.returnValue==='yes';if(ok){P.chatRules=CHAT_RULES_V;saveProfile();toast('Thanks. Tap send again.')}d.remove();res(ok)});
  document.body.appendChild(d);try{d.showModal()}catch(e){d.setAttribute('open','')}})}
for(const k of ['communitySend','msgSend']){const f=window.TF[k];if(typeof f!=='function')continue;
  window.TF[k]=async function(){if(!chatRulesOK()){await chatRulesAsk();return false}return f.apply(this,arguments)}}
