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
  const onPage=HASH()==='#chat';
  if(ctConv(cur)){if(onPage){chatClose();state.chat=ctConvKey(cur)}}
  else{CM.room=cur;if(onPage&&FB)chatOpen(cur)}
  const openable=SO.uid?[...SO.groups.map(g=>({id:'g:'+g.id,label:g.name,kind:'group'})),...SO.friends.filter(f=>!f.pending).map(f=>({id:'f:'+f.uid,label:sqName(f.uid),kind:'friend'}))].filter(o=>!tabs.some(t=>t.id===o.id)):[];
  return {tabs,cur,conv:ctConv(cur),openable,signed:!!SO.uid,synced:!!(P.prof&&P.prof.gid)}}
function chatGo(id,nav){if(ctConv(id)&&!CT.open.includes(id))CT.open.push(id);CT.cur=id;ctSave();if(ctConv(id))state.chat=ctConvKey(id);if(nav&&HASH()!=='#chat')GO('chat');tfNotify()}
function chatCloseTab(id){const i=CT.open.indexOf(id);if(i>=0)CT.open.splice(i,1);
  if(id.startsWith('f:'))sqMarkRead(id.slice(2));else if(id.startsWith('g:'))sqMarkRead(id);
  if(CT.cur===id){CT.cur=CT.open[Math.max(0,i-1)]||'general';if(!ctConv(CT.cur))state.chat=null}ctSave();tfNotify()}
Object.assign(window.TF,{chat:()=>chatPageData(),chatGo:(id,nav)=>chatGo(id,nav!==false),chatCloseTab:id=>chatCloseTab(id)});
routes.chat=function(){return ''};
/* the Friends page now opens conversations here; keep live redraws for both pages */
{const _sr=socialRender;socialRender=function(){if(HASH()==='#chat'){badge();tfNotify();return}_sr()}}
window.addEventListener('hashchange',()=>{if(HASH()!=='#chat'){chatClose();state.chat=null}});
/* a new group opens straight into its chat tab */
{const _gc=window.TF.groupCreate;window.TF.groupCreate=async(name,uids)=>{const ok=await _gc(name,uids);if(ok&&state.chat)chatGo(state.chat,true);return ok}}
