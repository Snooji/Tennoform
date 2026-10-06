/* ---------- Community chat: General, Trading, LFG, plus your clan and alliance from your synced profile ---------- */
/* These are Tennoform rooms; Warframe has no way to connect to in-game chat. Anyone can read the public rooms,
   posting needs an account. The filter below matches firestore.rules: a flagged message can't be posted, so it
   goes to the review queue in the Backend, where an admin publishes it, removes it or bans the sender. */
const CHAT_FLAGS=[
  ['minors',/(child|kid|kids|minor|minors|underage|preteen|toddler|loli|shota)[^a-z]{0,3}(porn|nude|nudes|sex|xxx|naked)|(porn|nude|nudes|sex|xxx|naked)[^a-z]{0,3}(child|kid|kids|minor|minors|underage|preteen|toddler)/],
  ['drugs',/(selling|sell|buy|vendor|plug)[^a-z]+([a-z]+[^a-z]+){0,3}(cocaine|heroin|fentanyl|meth|mdma|ketamine|xanax|oxy|oxys|lsd)([^a-z]|$)/],
  ['weapons',/ghost gun|untraceable gun|glock switch|auto sear/],
  ['fraud',/(stolen|hacked)[^a-z]+(credit cards?|cards|cc|paypal accounts?|bank accounts?)|fullz|carding|cvv dumps?/],
  ['self-harm',/kill (your ?self|urself)|(^|[^a-z])kys([^a-z]|$)/],
  ['explicit',/(send|selling|sell)[^a-z]+nudes|(onlyfans|porn)[^a-z]*(leaks?|links?)/]];
function chatFlag(t){const s=String(t||'').toLowerCase();const f=CHAT_FLAGS.find(([,re])=>re.test(s));return f?f[0]:''}
const ROOMS=[['general','General','Talk about anything Warframe'],['trade','Trading','Buying and selling: post item, price and platform'],['lfg','LFG','Find a squad: mission, platform and what you need']];
const CM={room:'general',unsub:null,sub:'',msgs:[],err:'',held:[],me:null,banned:false,meAt:0,loading:false};
const oid=x=>x&&(x.$oid||x)||'';
function chatRooms(){const pr=P.prof||{};const out=ROOMS.map(([id,l,h])=>({id,label:l,hint:h,kind:'public'}));
  if(pr.gid)out.push({id:'c_'+pr.gid,label:pr.guild?`Clan: ${pr.guild}`:'Clan',hint:'Only members of your clan (from your synced profile)',kind:'clan'});
  if(pr.aid)out.push({id:'a_'+pr.aid,label:'Alliance',hint:'Only members of your alliance (from your synced profile)',kind:'alliance'});
  return out}
/* tell the rules which clan and alliance rooms you're in; refreshed after each sync */
async function chatMeSync(force){if(!FB||!SO.uid)return;const pr=P.prof||{};const g=/^[0-9a-f]{24}$/.test(pr.gid||'')?pr.gid:'',a=/^[0-9a-f]{24}$/.test(pr.aid||'')?pr.aid:'';
  const key=g+'|'+a+'|'+myName();if(!force&&CM.me===key)return;CM.me=key;
  try{await FB.fs.collection('chatme').doc(SO.uid).set({g,a,gn:String(pr.guild||'').slice(0,60),name:myName(),at:Date.now()})}catch(e){CM.me=null}}
async function chatBanCheck(){if(!FB||!SO.uid)return;try{const s=await FB.fs.collection('bans').doc(SO.uid).get();CM.banned=s.exists}catch(e){}}
function chatOpen(room){if(!FB)return;if(CM.sub===room&&CM.unsub)return;if(CM.unsub)CM.unsub();CM.sub=room;CM.msgs=[];CM.err='';CM.loading=true;
  CM.unsub=FB.fs.collection('rooms').doc(room).collection('msgs').orderBy('at','desc').limit(80).onSnapshot(s=>{CM.loading=false;CM.err='';
    CM.msgs=s.docs.map(d=>({id:d.id,...d.data()})).reverse();tfNotify()},e=>{CM.loading=false;CM.err=/permission/i.test((e&&e.code)||'')?'perm':'error';tfNotify()})}
function chatClose(){if(CM.unsub)CM.unsub();CM.unsub=null;CM.sub=''}
function communityData(){const rooms=chatRooms();if(!rooms.some(r=>r.id===CM.room))CM.room='general';
  if(HOSTED&&FB&&(location.hash==='#friends'))chatOpen(CM.room);if(SO.uid)chatMeSync(false);
  const tm=t=>{const d=new Date(t);return (Date.now()-t<864e5?'':d.toLocaleDateString([],{month:'short',day:'numeric'})+' ')+d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})};
  const held=CM.held.filter(h=>h.room===CM.room);
  return {hosted:HOSTED,ready:!!FB,signed:!!SO.uid,admin:!!FBK.admin,banned:CM.banned,room:CM.room,rooms,loading:CM.loading,err:CM.err,
    synced:!!(P.prof&&P.prof.gid),
    msgs:[...CM.msgs.map(m=>({id:m.id,who:String(m.name||'Tenno'),text:String(m.text||''),time:tm(+m.at||0),mine:m.uid===SO.uid,uid:m.uid,held:false})),
      ...held.map(h=>({id:h.id,who:myName(),text:h.text,time:tm(h.at),mine:true,uid:SO.uid,held:true}))]}}
async function communitySend(text){text=String(text||'').trim().slice(0,500);if(!text)return false;
  if(!FB||!SO.uid){toast('Sign in to post');return false}if(CM.banned){toast("You can't post in community chat.");return false}
  const room=CM.room,d={uid:SO.uid,name:myName(),text,at:Date.now()};const flag=chatFlag(text);
  try{if(flag){await FB.fs.collection('review').add({room,...d,flag});CM.held.push({id:'h'+d.at,room,text,at:d.at});tfNotify();
      toast('Held for review: this message may break the community rules, so only you can see it until it\'s checked.');return true}
    await FB.fs.collection('rooms').doc(room).collection('msgs').add(d);return true}
  catch(e){await chatBanCheck();toast(CM.banned?"You can't post in community chat.":"Couldn't send. Try again in a moment.");tfNotify();return false}}
/* admin tools: review queue, delete, bans */
const MOD={tried:false,list:null,bans:null,err:''};
async function modLoad(force){if(!FB||!FBK.admin||(MOD.tried&&!force))return;MOD.tried=true;
  try{const [r,b]=await Promise.all([FB.fs.collection('review').orderBy('at','desc').limit(200).get(),FB.fs.collection('bans').get()]);
    MOD.list=r.docs.map(d=>({id:d.id,...d.data()}));MOD.bans=b.docs.map(d=>({id:d.id,...d.data()}));MOD.err=''}catch(e){MOD.err=(e&&e.code)||'error'}tfNotify()}
const roomLabel=id=>{const r=ROOMS.find(x=>x[0]===id);return r?r[1]:id.startsWith('c_')?'Clan room':id.startsWith('a_')?'Alliance room':id};
function modData(){if(FBK.admin&&!MOD.tried)modLoad();
  return {err:MOD.err,loading:MOD.list==null&&!MOD.err,
    list:(MOD.list||[]).map(x=>({id:x.id,room:roomLabel(x.room||''),uid:x.uid,name:x.name||'',text:x.text||'',flag:x.flag||'',at:new Date(x.at).toLocaleString()})),
    bans:(MOD.bans||[]).map(x=>({uid:x.id,name:x.name||'',reason:x.reason||'',at:x.at?new Date(x.at).toLocaleDateString():''}))}}
async function modPublish(id){const x=(MOD.list||[]).find(y=>y.id===id);if(!x)return;
  try{await FB.fs.collection('rooms').doc(x.room).collection('msgs').add({uid:x.uid,name:x.name,text:x.text,at:x.at});await FB.fs.collection('review').doc(id).delete();MOD.list=MOD.list.filter(y=>y.id!==id);toast('Published');tfNotify()}catch(e){toast("Couldn't publish")}}
async function modRemove(id,ban){const x=(MOD.list||[]).find(y=>y.id===id);if(!x)return;
  try{await FB.fs.collection('review').doc(id).delete();MOD.list=MOD.list.filter(y=>y.id!==id);if(ban)await modBan(x.uid,x.name,'Flagged: '+(x.flag||'review'));else toast('Removed');tfNotify()}catch(e){toast("Couldn't remove")}}
async function modBan(uid,name,reason){try{await FB.fs.collection('bans').doc(uid).set({at:Date.now(),name:String(name||'').slice(0,40),reason:String(reason||'').slice(0,120),by:SO.uid});
  MOD.bans=[...(MOD.bans||[]).filter(b=>b.id!==uid),{id:uid,name,reason,at:Date.now()}];toast(`${name||'Player'} banned from community chat`);tfNotify()}catch(e){toast("Couldn't ban")}}
async function modUnban(uid){try{await FB.fs.collection('bans').doc(uid).delete();MOD.bans=(MOD.bans||[]).filter(b=>b.id!==uid);toast('Unbanned');tfNotify()}catch(e){toast("Couldn't unban")}}
async function chatDelete(id){try{await FB.fs.collection('rooms').doc(CM.room).collection('msgs').doc(id).delete();toast('Message deleted')}catch(e){toast("Couldn't delete")}}
/* the synced profile carries clan and alliance IDs: keep them, and refresh chat membership after each sync */
{const _ip0=importProfile0;importProfile0=function(txt){const r=_ip0.apply(this,arguments);try{const raw=JSON.parse(String(txt).trim());const j=raw.Results&&raw.Results[0]?raw.Results[0]:raw;
    if(P.prof){P.prof.gid=oid(j.GuildId)||P.prof.gid||'';P.prof.aid=oid(j.AllianceId)||P.prof.aid||''}}catch(e){}if(SO.uid)setTimeout(()=>chatMeSync(true),500);return r}}
{const _fp=fromParsed;fromParsed=function(o){const r=_fp.apply(this,arguments);try{if(!(o&&o.Results)&&r&&r.Results&&r.Results[0]){const p=o.profile||o;r.Results[0].GuildId=p.guildId||'';r.Results[0].AllianceId=p.allianceId||''}}catch(e){}return r}}
{const _si=socialInit;socialInit=async function(uid){const r=await _si.apply(this,arguments);CM.me=null;CM.banned=false;chatMeSync(true);chatBanCheck();return r}}
Object.assign(window.TF,{community:()=>communityData(),communitySet:o=>{if(o.room){CM.room=o.room;chatOpen(o.room)}tfNotify()},communitySend:t=>communitySend(t),chatDelete:id=>chatDelete(id),
  modData:()=>modData(),modReload:()=>modLoad(true),modPublish:id=>modPublish(id),modRemove:(id,ban)=>modRemove(id,ban),modBan:(uid,name,reason)=>modBan(uid,name,reason),modUnban:uid=>modUnban(uid)});
window.addEventListener('hashchange',()=>{if(location.hash!=='#friends')chatClose()});
