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
  friendReport:uid=>{const f=SO.friends.find(x=>x.uid===uid)||{};state.fbPrefill=`Report: ${sqName(uid)} (friend code ${f.code||'?'}, id ${uid}).\nWhat happened: `;state.fbKind='other';state.fbFrom='friends';GO('feedback')},
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
const _socialRender=socialRender;socialRender=function(){if(window.TF_UI&&TF_UI.owns&&TF_UI.owns('friends')&&HASH()==='#friends'){badge();tfNotify();return}_socialRender()};
const _friendsRoute=routes.friends;routes.friends=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('friends')?'':_friendsRoute()};
