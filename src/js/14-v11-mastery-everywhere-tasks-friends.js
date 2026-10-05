/* ---------- v11: mastery everywhere, tasks, friends & messages ---------- */
const MIX={};MI.forEach(i=>MIX[i.n]=i);
function mxChip(n){const it=MIX[n];if(!it)return'';const tot=mxp(it),left=tot-itemXP(n);
  return left<=0?`<span class="chip mxc done" title="Mastery XP earned">✓ ${fmt(tot)} MR XP</span>`:`<span class="chip mxc" title="Mastery XP still to earn">+${fmt(left)} MR XP</span>`}
function inGameBase(){const g=[];if(P.gxp)g.push({x:+P.gxp,src:'your in-game total'});const mr=P.prof&&P.prof.mr;if(mr!=null&&(P.at||P.gmr!=null))g.push({x:mrNeed(mr),src:'MR '+mrLabel(mr)+' in game'});return g.sort((a,b)=>b.x-a.x)[0]||null}

/* ---- tasks ---- */
const TK={res:'Farm',item:'Build',relic:'Crack',quest:'Do quest',mod:'Get',arc:'Get',node:'Clear',synd:'Rank up',fish:'Catch',ore:'Mine',lich:'Get',note:''};
function taskBtn(k,r,label){const has=(P.tasks||[]).some(x=>!x.d&&x.k===k&&x.r===r);
  return `<button class="btn sm tb${has?' on':''}" data-addtask="${esc(k+'|'+r)}" data-tlabel="${esc(label||'')}" title="${has?'Already in your tasks':'Add to your tasks'}">${has?'✓ In tasks':'+ Task'}</button>`}
function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function addTask(k,r,t,extra){P.tasks=P.tasks||[];if(k!=='note'&&P.tasks.some(x=>!x.d&&x.k===k&&x.r===r)){toast('Already in your tasks');return null}
  const task={id:newId(),t:t||((TK[k]?TK[k]+' ':'')+r),k,r,d:0,at:Date.now(),...(extra||{})};P.tasks.unshift(task);saveProfile();return task}
function taskGo(x){if(x.k==='quest')return `href="#quests" data-q="${esc(x.r)}"`;if(x.k==='node')return `href="#missions" data-scp="${esc(x.r)}"`;if(x.k==='synd')return 'href="#synd"';
  if(x.k==='fish'||x.k==='ore')return 'href="#world"';if(x.k==='lich')return `href="#" data-go="item|${esc(x.r)}"`;if(['res','item','relic','mod','arc'].includes(x.k))return `href="#" data-go="${esc(x.k+'|'+x.r)}"`;return ''}
function taskRow(x,compact){const go=taskGo(x);
  return `<div class="trow${x.d?' done':''}"><input type="checkbox" class="ck sm" data-tdone="${esc(x.id)}" ${x.d?'checked':''} aria-label="Done"><div class="tmain">${go?`<a class="ln" ${go}>${esc(x.t)}</a>`:`<span>${esc(x.t)}</span>`}${taskMeta(x)}
   ${(x.with||[]).length?`<div class="small muted">with ${x.with.map(w=>esc(w.name)).join(', ')}</div>`:''}${x.from?`<div class="small muted">from ${esc(x.from.name)}</div>`:''}</div>
   <div class="tact"><button type="button" class="btn sm" data-tedit="${esc(x.id)}" aria-expanded="${state.tEdit===x.id}" aria-label="Notes, repeat and due date" title="Notes, repeat and due date">⋯</button>${SO.uid&&!x.d?`<button class="btn sm" data-tshare="${esc(x.id)}" title="Invite a friend">Invite</button>`:''}${compact?'':`<button class="btn sm" data-tdel="${esc(x.id)}" aria-label="Delete task">✕</button>`}</div></div>
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

