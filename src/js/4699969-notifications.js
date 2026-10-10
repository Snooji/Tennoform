/* ---------- notifications: everything the Squad and chat badges count, each saying what it is with a way to act on it ----------
   The badge number is the sum of these, so a badge never shows without something to open. Blocked people never count. */
function notifList(){if(!SO.uid)return [];const lr=lsGet('tf-read',{});const out=[];
  const isF=u=>SO.friends.some(f=>f.uid===u&&!f.pending);
  const who=(u,m)=>(SO.friends.find(f=>f.uid===u)||{}).name||(m&&m.fromName)||'Someone';
  const what=m=>{const t=m.task&&m.task.t||'a task';return m.type==='task'?'Invited you to: '+t:m.type==='taskok'?'Joined your task: '+t:m.type==='taskno'?"Can't join: "+t:m.type==='taskdone'?'Finished: '+t:m.type==='sys'?m.text||'':(m.text||'Sent you a message')};
  for(const m of SO.inbox)if(m.type==='friend'&&!blocked(m.from))
    out.push({id:'fr:'+m.id,kind:'friend',n:1,title:`${who(m.from,m)} sent you a friend request`,text:m.code?'Friend code '+m.code:'',at:m.at||0,
      actions:[{label:'Accept',act:'facc',arg:m.id,primary:true},{label:'Decline',act:'fdec',arg:m.id}]});
  const by={};for(const m of SO.inbox){if(['sent','accept','friend'].includes(m.type)||blocked(m.from))continue;if((m.at||0)>(lr[m.from]||0))(by[m.from]=by[m.from]||[]).push(m)}
  for(const [u,ms] of Object.entries(by)){ms.sort((a,b)=>(b.at||0)-(a.at||0));const last=ms[0],inv=ms.find(m=>m.type==='task'&&!m.ans);const c=ms.length;
    if(isF(u)){const acts=[{label:'Open chat',act:'chat',arg:'f:'+u,primary:true}];if(inv)acts.push({label:'Join task',act:'join',arg:inv.id},{label:'Decline task',act:'nojoin',arg:inv.id});acts.push({label:'Mark read',act:'read',arg:u});
      out.push({id:'dm:'+u,kind:inv?'invite':'dm',n:c,title:`${c} new from ${who(u,last)}`,text:what(last),at:last.at||0,actions:acts})}
    else out.push({id:'dm:'+u,kind:'other',n:c,title:`${c} message${c>1?'s':''} from ${who(u,last)}, who isn't on your friends list`,text:what(last),at:last.at||0,
      actions:[{label:'Mark read',act:'read',arg:u,primary:true},{label:'Block',act:'block',arg:u}]})}
  for(const g of SO.groups){const ms=(SO.gm[g.id]||[]).filter(m=>m.from!==SO.uid&&(m.at||0)>(lr['g:'+g.id]||0)&&!blocked(m.from));if(!ms.length)continue;
    const last=ms.reduce((a,b)=>(b.at||0)>(a.at||0)?b:a);
    out.push({id:'g:'+g.id,kind:'group',n:ms.length,title:`${ms.length} new in ${g.name||'your group'}`,text:(last.type==='sys'?'':who(last.from,last)+': ')+what(last),at:last.at||0,
      actions:[{label:'Open chat',act:'chat',arg:'g:'+g.id,primary:true},{label:'Mark read',act:'read',arg:'g:'+g.id}]})}
  return out.sort((a,b)=>b.at-a.at)}
/* the badge counts exactly what the list shows */
unread=function(){const per={};let n=0;for(const x of notifList()){n+=x.n;if(x.id.startsWith('dm:'))per[x.id.slice(3)]=x.n;else if(x.id.startsWith('g:'))per[x.id]=x.n}return {n,per}};
function notifAct(act,arg){
  if(act==='facc')return acceptFriend(arg);
  if(act==='fdec'){FB.fs.collection('inbox').doc(SO.uid).collection('msgs').doc(arg).delete().catch(()=>{});return}
  if(act==='chat'){const k=arg.startsWith('f:')?arg.slice(2):arg;sqMarkRead(k);return chatGo(arg,true)}
  if(act==='join')return answerInvite(arg,true);
  if(act==='nojoin')return answerInvite(arg,false);
  if(act==='read'){sqMarkRead(arg);tfNotify();return}
  if(act==='block'){P.block=P.block||[];if(!P.block.includes(arg))P.block.push(arg);saveProfile();sqMarkRead(arg);tfNotify();toast('Blocked');return}
  if(act==='readall'){const lr=lsGet('tf-read',{});const now=Date.now();for(const x of notifList()){if(x.id.startsWith('dm:'))lr[x.id.slice(3)]=now;else if(x.id.startsWith('g:'))lr[x.id]=now}lsSet('tf-read',lr);setTimeout(badge,0);tfNotify()}}
Object.assign(window.TF,{notifications:()=>notifList(),notifAct:(a,x)=>notifAct(a,x)});
