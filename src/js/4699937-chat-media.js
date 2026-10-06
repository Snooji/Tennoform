/* ---------- Chat pictures: profile pictures for everyone, and backgrounds for clan and alliance rooms ---------- */
/* Images are shrunk in the browser and stored inline in Firestore (no file storage needed): a 160px profile picture,
   a 1280px room background. firestore.rules checks the size and format. Only leaders an admin appoints in the
   Backend can change a clan or alliance room's background; admins can remove any picture. */
const AV={};let AVq=new Set(),AVt=0;
function imgShrink(file,max,limit){return new Promise((res,rej)=>{if(!file||!/^image\//.test(file.type||'')){rej(new Error('type'));return}
  const url=URL.createObjectURL(file),im=new Image();im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('read'))};
  im.onload=()=>{URL.revokeObjectURL(url);const sq=max<=200;let w=im.naturalWidth,h=im.naturalHeight,sx=0,sy=0,sw=w,sh=h;
    if(sq){const m=Math.min(w,h);sx=(w-m)/2;sy=(h-m)/2;sw=sh=m;w=h=Math.min(max,m)}else{const k=Math.min(1,max/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k)}
    const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,w,h);
    for(const q of [.86,.78,.68,.56,.45,.35]){for(const t of ['image/webp','image/jpeg']){const d=c.toDataURL(t,q);if(d.startsWith('data:'+t)&&d.length<=limit){res(d);return}}}
    rej(new Error('size'))};im.src=url})}
const pickImage=()=>new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>res(i.files&&i.files[0]||null);i.click()});
/* profile pictures: fetched in small batches for whoever's on screen */
function avatarOf(uid){if(!uid)return '';if(uid in AV)return AV[uid]||'';if(!FB)return '';AVq.add(uid);clearTimeout(AVt);AVt=setTimeout(avFetch,60);return ''}
async function avFetch(){const ids=[...AVq].filter(u=>!(u in AV));AVq=new Set();if(!ids.length)return;ids.forEach(u=>AV[u]='');
  await Promise.all(ids.map(u=>FB.fs.collection('avatars').doc(u).get().then(s=>{if(s.exists)AV[u]=String((s.data()||{}).img||'')}).catch(()=>{})));tfNotify()}
async function avatarSet(){if(!FB||!SO.uid){toast('Sign in to add a profile picture');return}const f=await pickImage();if(!f)return;
  try{const img=await imgShrink(f,160,60000);await FB.fs.collection('avatars').doc(SO.uid).set({img,at:Date.now()});AV[SO.uid]=img;toast('Profile picture updated');tfNotify()}
  catch(e){toast(e&&e.message==='type'?'Pick an image file':e&&e.message==='size'?"That image is too detailed to shrink. Try another.":"Couldn't save the picture. Try again.")}}
async function avatarRemove(uid){uid=uid||SO.uid;if(!FB||!uid)return;try{await FB.fs.collection('avatars').doc(uid).delete();AV[uid]='';toast(uid===SO.uid?'Profile picture removed':'Picture removed');tfNotify()}catch(e){toast("Couldn't remove the picture")}}
/* room backgrounds and leaders, for the clan or alliance room you're looking at */
const RB={room:'',img:'',leads:[],unsub:null};
function roomMedia(room){if(!FB||!/^[ca]_/.test(room||'')){if(RB.unsub)RB.unsub();Object.assign(RB,{room:'',img:'',leads:[],unsub:null});return RB}
  if(RB.room!==room){if(RB.unsub)RB.unsub();Object.assign(RB,{room,img:'',leads:[]});
    RB.unsub=FB.fs.collection('roombg').doc(room).onSnapshot(s=>{RB.img=s.exists?String((s.data()||{}).img||''):'';tfNotify()},()=>{});
    FB.fs.collection('roomlead').doc(room).get().then(s=>{RB.leads=s.exists?((s.data()||{}).uids||[]):[];tfNotify()}).catch(()=>{})}
  return RB}
async function roomBgSet(){const room=CM.room;if(!/^[ca]_/.test(room))return;const f=await pickImage();if(!f)return;
  try{const img=await imgShrink(f,1280,400000);await FB.fs.collection('roombg').doc(room).set({img,by:SO.uid,at:Date.now()});toast('Background updated')}
  catch(e){toast(e&&e.message==='type'?'Pick an image file':e&&e.message==='size'?"That image is too detailed to shrink. Try another.":"Couldn't save the background. Only this room's leaders can change it.")}}
async function roomBgRemove(){const room=CM.room;try{await FB.fs.collection('roombg').doc(room).delete();toast('Background removed')}catch(e){toast("Couldn't remove the background")}}
/* add avatars and the room's background to the chat data */
{const _cd=communityData;communityData=function(){const d=_cd.apply(this,arguments);const rm=roomMedia(d.room);
  d.msgs.forEach(m=>{m.av=avatarOf(m.uid)});d.bg=rm.img;d.lead=!!SO.uid&&(rm.leads.includes(SO.uid)||!!FBK.admin);d.leadRoom=/^[ca]_/.test(d.room);d.myAv=avatarOf(SO.uid);return d}}
{const _sd=squadData;squadData=function(){const d=_sd.apply(this,arguments);if(d.friends)d.friends.forEach(f=>{f.av=avatarOf(f.uid)});if(d.chat&&d.chat.type==='friend')d.chat.av=avatarOf(d.chat.id);d.me=myName();return d}}
/* Backend: appoint leaders for each clan and alliance room, from the members whose synced profiles put them there */
const LD={list:null,leads:{},err:''};
async function leadLoad(){if(!FB||!FBK.admin)return;try{const [m,l]=await Promise.all([FB.fs.collection('chatme').get(),FB.fs.collection('roomlead').get()]);
  const rooms={};m.docs.forEach(d=>{const x=d.data()||{};if(x.g){const r=rooms['c_'+x.g]=rooms['c_'+x.g]||{id:'c_'+x.g,label:'Clan: '+(x.gn||x.g.slice(-6)),members:[]};r.members.push({uid:d.id,name:x.name||'Tenno'});if(x.gn&&r.label.endsWith(x.g.slice(-6)))r.label='Clan: '+x.gn}
    if(x.a){const r=rooms['a_'+x.a]=rooms['a_'+x.a]||{id:'a_'+x.a,label:'Alliance '+x.a.slice(-6)+(x.gn?' (incl. '+x.gn+')':''),members:[]};r.members.push({uid:d.id,name:x.name||'Tenno'})}});
  LD.list=Object.values(rooms).sort((a,b)=>b.members.length-a.members.length);LD.leads={};l.docs.forEach(d=>{LD.leads[d.id]=(d.data()||{}).uids||[]});LD.err=''}catch(e){LD.err=(e&&e.code)||'error'}tfNotify()}
function leadData(){if(FBK.admin&&LD.list==null&&!LD.err&&!LD.busy){LD.busy=true;leadLoad().finally(()=>LD.busy=false)}
  return {err:LD.err,loading:LD.list==null&&!LD.err,rooms:(LD.list||[]).map(r=>({...r,members:r.members.map(m=>({...m,lead:(LD.leads[r.id]||[]).includes(m.uid)}))}))}}
async function leadToggle(room,uid){const cur=LD.leads[room]||[];if(!cur.includes(uid)&&cur.length>=10){toast('A room can have up to 10 leaders. Remove one first.');return}const next=cur.includes(uid)?cur.filter(u=>u!==uid):[...cur,uid];
  try{if(next.length)await FB.fs.collection('roomlead').doc(room).set({uids:next,at:Date.now(),by:SO.uid});else await FB.fs.collection('roomlead').doc(room).delete();LD.leads[room]=next;toast(next.includes(uid)?'Leader added':'Leader removed');tfNotify()}
  catch(e){toast("Couldn't save. Check the Firestore rules are published.")}}
Object.assign(window.TF,{avatarSet:()=>avatarSet(),avatarRemove:uid=>avatarRemove(uid),myAvatar:()=>avatarOf(SO.uid),roomBgSet:()=>roomBgSet(),roomBgRemove:()=>roomBgRemove(),
  leadData:()=>leadData(),leadReload:()=>{LD.list=null;LD.err='';tfNotify()},leadToggle:(room,uid)=>leadToggle(room,uid)});
