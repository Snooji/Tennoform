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
    ${pp?`<p class="small" style="margin:0">One-off donation in any amount through PayPal. You don't need a PayPal account to pay by card.</p><a class="btn primary" href="${esc(pp)}" target="_blank" rel="noopener" style="align-self:flex-start">Donate on PayPal ↗</a>`:'<p class="small muted" style="margin:0">PayPal donations open soon.</p>'}
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

