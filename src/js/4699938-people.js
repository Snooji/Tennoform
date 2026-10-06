/* ---------- People you meet in chat or on shared builds: add them as a friend (they still have to accept) or block them ---------- */
function personInfo(uid){const f=SO.friends.find(x=>x.uid===uid);
  const rel=!uid?'none':uid===SO.uid?'me':blocked(uid)?'blocked':f?(f.pending?'pending':'friend'):SO.inbox.some(m=>m.type==='friend'&&m.from===uid)?'asked':'none';
  return {rel,av:avatarOf(uid),signed:!!SO.uid}}
async function friendAddUid(uid,name){if(!FB||!SO.uid){toast('Sign in to add friends');return}if(!uid||uid===SO.uid)return;
  if(blocked(uid)){toast("You've blocked them. Unblock them on the Friends page first.");return}
  if(SO.friends.some(f=>f.uid===uid)){toast(SO.friends.find(f=>f.uid===uid).pending?'Request already sent':'Already friends');return}
  /* they asked you first: accepting is the same as adding */
  const ask=SO.inbox.find(m=>m.type==='friend'&&m.from===uid);if(ask){await acceptFriend(ask.id);return}
  try{await FB.fs.collection('users').doc(SO.uid).collection('friends').doc(uid).set({name:String(name||'Pending').slice(0,40),code:'',pending:true,at:Date.now()});
    await sendMsg(uid,{type:'friend',code:SO.code},false);toast(`Friend request sent to ${name||'them'}. You can message once they accept.`);tfNotify()}
  catch(e){toast("Couldn't send the request. Try again.")}}
/* the request card on Friends needs the sender so you can block them */
{const _sd=squadData;squadData=function(){const d=_sd.apply(this,arguments);if(d.requests)d.requests.forEach(r=>{const m=SO.inbox.find(x=>x.id===r.id);r.from=m?m.from:''});return d}}
/* shared builds carry their author's account, so you can add them from the build */
{const _bd=bDetail;bDetail=function(b){const d=_bd.apply(this,arguments);d.authorUid=b&&b.src==='player'&&b.uid!==SO.uid?b.uid:'';return d}}
/* blocking hides their room messages too, and the Friends page lists who you've blocked so you can undo it */
{const _cd=communityData;communityData=function(){const d=_cd.apply(this,arguments);d.msgs=d.msgs.filter(m=>m.mine||!blocked(m.uid));return d}}
{const _sd=squadData;squadData=function(){const d=_sd.apply(this,arguments);d.blocked=(P.block||[]).map(uid=>({uid,name:(P.blockN||{})[uid]||(SO.pub[uid]||{}).name||'Player'}));return d}}
function blockPerson(uid,name){if(!uid||uid===SO.uid)return;P.blockN=P.blockN||{};if(name)P.blockN[uid]=String(name).slice(0,40);window.TF.friendBlock(uid)}
function unblockPerson(uid){P.block=(P.block||[]).filter(u=>u!==uid);if(P.blockN)delete P.blockN[uid];saveProfile();toast('Unblocked');tfNotify()}
Object.assign(window.TF,{blockPerson:(uid,name)=>blockPerson(uid,name),unblockPerson:uid=>unblockPerson(uid),person:uid=>personInfo(uid),friendAddUid:(uid,name)=>friendAddUid(uid,name)});
