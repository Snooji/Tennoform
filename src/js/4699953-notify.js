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
