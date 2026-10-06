/* ---------- bridge: build library (community meta builds + player-shared builds), build goals, my builds ---------- */
const BKIND=c=>c==='Warframe'?'Warframe':['Companion','Sentinel'].includes(c)?'Companion':['Primary','Secondary','Melee','Zaw','Kitgun','Arch-Gun','Arch-Melee','Robotic Weapon'].includes(c)?'Weapon':'Other';
const BMODTY={Warframe:['Warframe Mod'],Primary:['Primary Mod','Shotgun Mod'],Secondary:['Secondary Mod'],Kitgun:['Secondary Mod','Primary Mod'],Melee:['Melee Mod','Stance Mod'],Zaw:['Melee Mod','Stance Mod'],
  'Arch-Gun':['Arch-Gun Mod'],'Arch-Melee':['Arch-Melee Mod'],Companion:['Companion Mod'],Sentinel:['Companion Mod'],'Robotic Weapon':['Primary Mod','Companion Mod'],Archwing:['Archwing Mod'],'K-Drive':['K-Drive Mod'],Necramech:['Necramech Mod']};
const BARCTY={Warframe:['Warframe Arcane'],Primary:['Primary Arcane','Bow Arcane','Shotgun Arcane'],Secondary:['Secondary Arcane'],Kitgun:['Kitgun Arcane'],Melee:['Melee Arcane'],Zaw:['Zaw Arcane'],Amp:['Amp Arcane']};
const BSLOTS=c=>({aura:c==='Warframe'?'Aura':['Melee','Zaw'].includes(c)?'Stance':'',exilus:['Companion','Sentinel'].includes(c)?'':'Exilus',arcanes:c==='Warframe'?2:BARCTY[c]?1:0,helminth:c==='Warframe'});
const SB={list:null,loading:false,err:'',at:0};
let METAB=null;
function metaBuilds(){if(METAB)return METAB;const out=[];
  for(const src of [D.builds,D.wbuilds,D.cbuilds])for(const item in src||{})(src[item]||[]).forEach((b,i)=>out.push({id:'m:'+item+':'+i,src:'meta',item,name:b.name||'Build',role:b.role||'',aura:b.aura||'',exilus:b.exilus||'',mods:b.mods||[],arcanes:b.arcanes||[],helminth:b.helminth||'',notes:b.notes||''}));
  return METAB=out}
function loadShared(force){if(!FB||SB.loading||(SB.list&&!force&&Date.now()-SB.at<120000))return;SB.loading=true;SB.err='';tfNotify();
  FB.fs.collection('builds').orderBy('score','desc').limit(300).get().then(s=>{SB.list=s.docs.map(d=>({id:'p:'+d.id,doc:d.id,src:'player',...d.data()}));SB.at=Date.now()})
    .catch(e=>{SB.err=(e&&e.code)||'error'}).finally(()=>{SB.loading=false;tfNotify()})}
function allBuilds(){return [...metaBuilds(),...(SB.list||[]).filter(b=>!blocked(b.uid))]}
function buildById(id){if(id.startsWith('mine:'))return (P.myb||[]).find(b=>'mine:'+b.id===id);return allBuilds().find(b=>b.id===id)||(P.bg||[]).find(g=>g.id===id)}
function bParts(b){return [...(b.aura?[['aura',b.aura]]:[]),...(b.exilus?[['exilus',b.exilus]]:[]),...b.mods.filter(Boolean).map(m=>['mod',m]),...(b.arcanes||[]).filter(Boolean).map(a=>['arc',a])]}
const bHave=b=>{const p=bParts(b);return {have:p.filter(([k,n])=>on((k==='arc'?'arc|':'mod|')+n)||(k==='arc'&&(+((P.arc||{})[n])||0)>0)).length,total:p.length}};
function bCard(b){const it=I[b.item];const h=bHave(b);const mv=(P.bv||{})[b.doc]||0;
  return {id:b.id,src:b.src,item:b.item,img:IMG(b.item),kind:it?BKIND(it.c):'Other',cat:it?it.c:'',name:b.name,role:b.role||'',author:b.author||'',score:b.score||0,up:b.up||0,down:b.down||0,myVote:mv,have:h.have,total:h.total,
    goal:(P.bg||[]).some(g=>g.from===b.id),at:b.at||0}}
function bDetail(b){const it=I[b.item];const c=it?it.c:'';const sl=BSLOTS(c);
  return {...bCard(b),notes:b.notes||'',helminth:b.helminth||'',mine:b.src==='player'&&b.uid===SO.uid,doc:b.doc||'',
    mods:[...(b.aura?[modSlot(sl.aura||'Aura',b.aura)]:[]),...(b.exilus?[modSlot('Exilus',b.exilus)]:[]),...b.mods.filter(Boolean).map(m=>modSlot('Mod',m))],
    arcanes:(b.arcanes||[]).filter(Boolean).map(a=>modSlot('Arcane',a,true)),
    itemOwned:it?ownedItem(b.item):true,itemGoal:(P.goals||[]).includes(b.item),canVote:b.src==='player'&&!!SO.uid}}
function buildLibData(){const q=(state.blQ||'').toLowerCase().trim(),k=state.blK||'all',s=state.blS||'all',so=state.blO||'top';
  if(s!=='meta')loadShared();
  let L=allBuilds().filter(b=>(s==='all'||(s==='meta'&&b.src==='meta')||(s==='players'&&b.src==='player'))&&(!q||(b.item+' '+b.name+' '+(b.role||'')+' '+(b.author||'')).toLowerCase().includes(q)));
  L=L.map(bCard).filter(c=>k==='all'||c.kind===k);
  if(so==='top')L.sort((a,b)=>(b.src==='player')-(a.src==='player')||b.score-a.score||a.item.localeCompare(b.item));
  else if(so==='new')L.sort((a,b)=>b.at-a.at||a.item.localeCompare(b.item));
  else if(so==='ready')L.sort((a,b)=>(b.have/(b.total||1))-(a.have/(a.total||1))||a.item.localeCompare(b.item));
  else L.sort((a,b)=>a.item.localeCompare(b.item)||a.name.localeCompare(b.name));
  const sel=state.blSel?buildById(state.blSel):null;
  return {q:state.blQ||'',kind:k,src:s,sort:so,total:L.length,list:L.slice(0,state.blN||60),more:L.length>(state.blN||60),
    shared:{loading:SB.loading,err:SB.err,count:(SB.list||[]).length,online:!!FB&&HOSTED},signedIn:!!SO.uid,sel:sel?bDetail(sel):null}}
/* build goals: a snapshot of a build you're working towards; Goals lists the parts you're missing and where they drop */
function bGoalsData(){return (P.bg||[]).map(g=>{const h=bHave(g);const parts=bParts(g).map(([k,n])=>modSlot(k==='arc'?'Arcane':k==='aura'?'Aura':k==='exilus'?'Exilus':'Mod',n,k==='arc'));
  return {id:g.id,from:g.from,item:g.item,img:IMG(g.item),name:g.name,have:h.have,total:h.total,missing:parts.filter(p=>!p.done&&!(p.slot==='Arcane'&&(+((P.arc||{})[p.m])||0)>0))}})}
const _goalsData=goalsData;goalsData=function(){return {..._goalsData(),bgoals:bGoalsData()}};
/* my builds editor: options per item category */
const BOPT={};
function buildOptions(c){if(BOPT[c])return BOPT[c];const mt=BMODTY[c]||[],at=BARCTY[c]||[];
  return BOPT[c]={mods:Object.keys(MODS).filter(n=>!mt.length||mt.includes(MODS[n].ty)).sort(),arcanes:Object.keys(ARC).filter(n=>at.includes(ARC[n].ty)).sort(),slots:BSLOTS(c)}}
let BITEMS=null;
const buildItems=()=>BITEMS||(BITEMS=Object.keys(I).filter(n=>BKIND(I[n].c)!=='Other'||BMODTY[I[n].c]).sort());
function myBuildsData(){const ed=state.mbEdit;return {list:(P.myb||[]).map(b=>({...bCard({...b,id:'mine:'+b.id,src:'mine'}),pub:b.pub||'',updated:b.at||0})).reverse(),
  items:buildItems(),edit:ed?{...ed,cat:I[ed.item]?I[ed.item].c:'',opts:I[ed.item]?buildOptions(I[ed.item].c):null}:null,signedIn:!!SO.uid,online:!!FB&&HOSTED}}
const cleanB=d=>{const s=(v,n)=>String(v||'').trim().slice(0,n);const c=I[d.item]?I[d.item].c:'';const sl=BSLOTS(c);
  return {item:s(d.item,60),name:s(d.name,60)||'My build',role:s(d.role,60),aura:sl.aura?s(d.aura,60):'',exilus:sl.exilus?s(d.exilus,60):'',mods:(d.mods||[]).map(m=>s(m,60)).filter(Boolean).slice(0,10),
    arcanes:(d.arcanes||[]).map(m=>s(m,60)).filter(Boolean).slice(0,sl.arcanes),helminth:sl.helminth?s(d.helminth,60):'',notes:s(d.notes,600)}};
const pubDoc=b=>({...cleanB(b),uid:SO.uid,author:myName(),at:Date.now()});
function voteTx(doc,v){const ref=FB.fs.collection('builds').doc(doc),vref=ref.collection('votes').doc(SO.uid);
  return FB.fs.runTransaction(async tx=>{const s=await tx.get(ref),vs=await tx.get(vref);if(!s.exists)throw new Error('gone');const b=s.data(),old=vs.exists?vs.data().v:0;if(old===v)return b;
    const up=(b.up||0)+(v===1)-(old===1),down=(b.down||0)+(v===-1)-(old===-1);if(v)tx.set(vref,{v});else tx.delete(vref);tx.update(ref,{up,down,score:up-down});return {...b,up,down,score:up-down}})}
Object.assign(window.TF,{
  buildLib:()=>buildLibData(),
  buildLibSet:o=>{const m={q:'blQ',kind:'blK',src:'blS',sort:'blO'};for(const k in m)if(o[k]!=null){state[m[k]]=o[k];state.blN=60}if('sel' in o){state.blSel=o.sel;window.scrollTo(0,0)}if(o.more)state.blN=(state.blN||60)+60;tfNotify()},
  buildLibReload:()=>loadShared(true),
  buildGoal:id=>{const b=buildById(id);if(!b)return;P.bg=P.bg||[];const i=P.bg.findIndex(g=>g.from===id);
    if(i>=0){const g=P.bg.splice(i,1)[0];saveProfile();tfNotify();toastAction('Removed the '+g.name+' goal','Undo',()=>{P.bg.splice(i,0,g);saveProfile();tfNotify()});return}
    const g={id:'bg'+Date.now().toString(36),from:id,item:b.item,name:b.item+': '+b.name,aura:b.aura||'',exilus:b.exilus||'',mods:[...b.mods],arcanes:[...(b.arcanes||[])],at:Date.now()};P.bg.push(g);
    const addItem=I[b.item]&&!ownedItem(b.item)&&!(P.goals||[]).includes(b.item);if(addItem){P.goals=P.goals||[];P.goals.push(b.item)}
    saveProfile();tfNotify();toastAction('Saved as a goal'+(addItem?' (and '+b.item+' added to Goals)':'')+'. Goals shows the mods you still need.','Open Goals',()=>{location.hash='goals'})},
  buildGoalRemove:id=>{const i=(P.bg||[]).findIndex(g=>g.id===id);if(i<0)return;const g=P.bg.splice(i,1)[0];saveProfile();tfNotify();toastAction('Removed the '+g.name+' goal','Undo',()=>{P.bg.splice(i,0,g);saveProfile();tfNotify()})},
  buildCopy:id=>{const b=buildById(id);if(!b)return;const c=cleanB(b);state.mbEdit={...c,name:(b.src==='player'&&b.author?b.author+"'s ":'')+c.name,mods:[...c.mods,...Array(Math.max(0,8-c.mods.length)).fill('')]};state.aTab='mine';state.blSel=null;saveUI();
    if(location.hash!=='#arsenal')location.hash='arsenal';tfNotify();window.scrollTo(0,0)},
  buildVote:async(id,v)=>{const b=buildById(id);if(!b||b.src!=='player')return;if(!SO.uid){toast('Sign in to vote');return}P.bv=P.bv||{};const cur=P.bv[b.doc]||0;const nv=cur===v?0:v;
    try{const r=await voteTx(b.doc,nv);Object.assign(b,{up:r.up,down:r.down,score:r.score});if(nv)P.bv[b.doc]=nv;else delete P.bv[b.doc];saveProfile();tfNotify()}catch(e){toast("Couldn't save your vote. Try again.")}},
  myBuilds:()=>myBuildsData(),
  myBuildEdit:o=>{if(o===null)state.mbEdit=null;else if(o&&o.id&&!o.mods){const b=(P.myb||[]).find(x=>x.id===o.id);if(b)state.mbEdit={...b,mods:[...b.mods,...Array(Math.max(0,8-b.mods.length)).fill('')]}}else state.mbEdit={item:'',name:'',role:'',aura:'',exilus:'',mods:Array(8).fill(''),arcanes:['',''],helminth:'',notes:'',...(o||{})};tfNotify()},
  myBuildSave:d=>{if(!I[d.item]){toast('Pick a Warframe, weapon or companion first');return false}P.myb=P.myb||[];const c=cleanB(d);let b=d.id&&P.myb.find(x=>x.id===d.id);
    if(b)Object.assign(b,c,{at:Date.now()});else{b={id:'b'+Date.now().toString(36),...c,at:Date.now()};P.myb.push(b)}state.mbEdit=null;saveProfile();tfNotify();
    if(b.pub&&SO.uid)FB.fs.collection('builds').doc(b.pub).update({...cleanB(b),author:myName()}).then(()=>{SB.at=0}).catch(()=>toast("Saved here, but couldn't update the shared copy."));toast('Build saved');return true},
  myBuildDel:id=>{const i=(P.myb||[]).findIndex(x=>x.id===id);if(i<0)return;const b=P.myb.splice(i,1)[0];saveProfile();tfNotify();
    toastAction('Deleted '+b.name+(b.pub?'. The shared copy stays until you unshare it.':''),'Undo',()=>{P.myb.splice(i,0,b);saveProfile();tfNotify()})},
  myBuildPublish:async id=>{const b=(P.myb||[]).find(x=>x.id===id);if(!b)return;if(!SO.uid){toast('Sign in to share builds');return}if(!b.mods.length){toast('Add some mods before sharing');return}
    try{const r=await FB.fs.collection('builds').add({...pubDoc(b),up:0,down:0,score:0});b.pub=r.id;saveProfile();SB.at=0;loadShared(true);toast('Shared. Other players can now vote on it and copy it.')}catch(e){toast("Couldn't share it. Try again in a moment.")}tfNotify()},
  myBuildUnpublish:async id=>{const b=(P.myb||[]).find(x=>x.id===id);if(!b||!b.pub)return;try{await FB.fs.collection('builds').doc(b.pub).delete();SB.list=(SB.list||[]).filter(x=>x.doc!==b.pub);delete b.pub;saveProfile();toast('No longer shared')}catch(e){toast("Couldn't unshare it. Try again.")}tfNotify()},
  sharedDelete:async doc=>{try{await FB.fs.collection('builds').doc(doc).delete();SB.list=(SB.list||[]).filter(x=>x.doc!==doc);(P.myb||[]).forEach(b=>{if(b.pub===doc)delete b.pub});saveProfile();state.blSel=null;toast('Removed')}catch(e){toast("Couldn't remove it.")}tfNotify()}
});
