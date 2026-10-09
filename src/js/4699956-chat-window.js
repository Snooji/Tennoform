/* ---------- floating chat window: chat stays live on every page while the pop-up window is open ---------- */
/* The window itself (position, size, minimised, the reopen button) lives in the React shell; it tells us here when it opens and
   closes so rooms stay subscribed, conversations get marked read, and notifications skip the chat you're looking at. */
const CHATWIN={open:false};
const chatLive=()=>HASH()==='#chat'||CHATWIN.open;
{const _cp=chatPageData;chatPageData=function(){const d=_cp();if(CHATWIN.open&&HASH()!=='#chat'){const cur=d.cur;
  if(ctConv(cur)){chatClose();state.chat=ctConvKey(cur)}else{state.chat=null;if(FB)chatOpen(cur)}}return d}}
{const _sr=socialRender;socialRender=function(){if(CHATWIN.open&&HASH()!=='#chat')tfNotify();return _sr()}}
/* leaving the Chat page keeps the room open while the window is up (the page's own listener closes it; reopen straight after) */
window.addEventListener('hashchange',()=>{if(HASH()!=='#chat'&&CHATWIN.open)setTimeout(()=>tfNotify(),0)});
{const _v=ntfViewing;ntfViewing=function(conv){if(_v(conv))return true;if(!CHATWIN.open||document.visibilityState!=='visible')return false;
  const cur=CT.cur;if(conv.startsWith('room:'))return conv==='room:'+cur;if(conv.startsWith('dm:'))return cur==='f:'+conv.slice(3);return cur===conv}}
Object.assign(window.TF,{chatWin:open=>{const was=CHATWIN.open;CHATWIN.open=!!open;
  if(was&&!open&&HASH()!=='#chat'){chatClose();state.chat=null}tfNotify()}});
