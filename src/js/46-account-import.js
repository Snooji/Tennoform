/* ---------- account import ---------- */
function findKey(o,key,depth){if(!o||typeof o!=='object'||depth>6)return undefined;if(!Array.isArray(o)&&key in o)return o[key];for(const k in o){const v=findKey(o[k],key,depth+1);if(v!==undefined)return v}}
const SYN={ArbitersSyndicate:'Arbiters of Hexis',CephalonSudaSyndicate:'Cephalon Suda',NewLokaSyndicate:'New Loka',PerrinSyndicate:'The Perrin Sequence',RedVeilSyndicate:'Red Veil',SteelMeridianSyndicate:'Steel Meridian',CetusSyndicate:'Ostrons',QuillsSyndicate:'The Quills',SolarisSyndicate:'Solaris United',VentKidsSyndicate:'Ventkids',VoxSyndicate:'Vox Solaris',EntratiSyndicate:'Entrati',NecraloidSyndicate:'Necraloid',ZarimanSyndicate:'The Holdfasts',KahlSyndicate:"Kahl's Garrison",EntratiLabSyndicate:'Cavia',HexSyndicate:'The Hex',LibrarySyndicate:'Cephalon Simaris',ConclaveSyndicate:'Conclave',RadioLegionSyndicate:'Nightwave'};
const pretty=s=>String(s||'').split('/').pop().replace(/([a-z])([A-Z])/g,'$1 $2').replace(/ ?Syndicate$/,'').trim();
function nm(u){return U[u]||pretty(u)}
function importProfile(txt){const a=logSnap();LOGMUTE++;let r;try{r=importProfile0(txt)}finally{LOGMUTE--}return r}
function importProfile0(txt){let raw;try{raw=JSON.parse(txt.trim())}catch(e){return 'That isn\'t profile data. Copy the whole page from your profile link and try again.'}const _pre=JSON.stringify({at:Date.now(),C,P});if(!P.wfid){const id=findId(txt);if(id){P.wfid=id;lsSet('tenno-acct',id)}}
  const j=raw.Results&&raw.Results[0]?raw.Results[0]:raw;const st=raw.Stats||{};
  const xpi=(j.LoadOutInventory&&j.LoadOutInventory.XPInfo)||findKey(j,'XPInfo',0)||[];const mis=j.Missions||[];const skills=j.PlayerSkills||{};
  if(!xpi.length&&!mis.length)return 'No ranks or missions found. Make sure you copied the whole page.';try{localStorage.setItem('tf-presync',_pre)}catch(e){}
  let maxed=0,partial=0,other=0;const rk={};
  for(const e of xpi){const n=U[e.ItemType];const xp=e.XP||0;
    if(n){const it=I[n];const k=perRank(it)===200?1000:500;const r=Math.min(maxRank(it),Math.floor(Math.sqrt(xp/k)));
      if(r>=maxRank(it)){if(!on('m|'+n))setK('m|'+n,1);maxed++}else if(r>0){rk[n]=r;partial++}}
    else other+=Math.min(30,Math.floor(Math.sqrt(xp/500)))*100}
  let nodes=0;const mc={};for(const m of mis){const id=m.Tag;if(!id||!(m.Completes>0))continue;if(m.Tier!==1)mc[id]=(mc[id]||0)+m.Completes;if(!NX[id])continue;const key=(m.Tier===1?'sp|':'n|')+id;if(!on(key))setK(key,1);nodes++}
  let intr=0;const ib={};const IL={LPS_PILOTING:'Railjack · Piloting',LPS_GUNNERY:'Railjack · Gunnery',LPS_TACTICAL:'Railjack · Tactical',LPS_ENGINEERING:'Railjack · Engineering',LPS_COMMAND:'Railjack · Command',LPS_DRIFT_RIDING:'Drifter · Riding',LPS_DRIFT_COMBAT:'Drifter · Combat',LPS_DRIFT_OPPORTUNITY:'Drifter · Opportunity',LPS_DRIFT_ENDURANCE:'Drifter · Endurance'};
  const iR={},iD={};for(const k in skills){if(/^LPS_/.test(k)&&typeof skills[k]==='number'){intr+=skills[k];ib[IL[k]||pretty(k)]=skills[k];const nm2=k.replace(/^LPS_(DRIFT_)?/,'');const lab=nm2.charAt(0)+nm2.slice(1).toLowerCase();if(/^LPS_DRIFT_/.test(k))iD[lab]=skills[k];else if(IR.includes(lab))iR[lab]=skills[k]}}
  if(intr){P.intrR=iR;P.intrD=iD}
  const owned=new Set();for(const e of xpi){const n=U[e.ItemType];if(n&&(e.XP||0)>0)owned.add(n)}
  owned.forEach(n=>stepKeys(n).forEach(setQ));
  let sp=0;for(const m of mis)if(m.Tier===1&&m.Completes>0)sp++;
  const qk=findKey(j,'QuestKeys',0)||[];for(const q of qk){const n=QU[q.ItemType];if(n&&q.Completed)setQ('q|'+n)}
  const dq=detectQuests(j,mis,owned);dq.forEach(n=>setQ('q|'+n));const qn=dq.length;
  P.syn=P.syn||{};let sn=0;for(const e of D.synd){const a=(j.Affiliations||[]).find(x=>x.Tag===e.tag);if(a){P.syn[e.n]={r:a.Title||0,s:a.Standing||0,sync:1};sn++}}
  P.nw=(j.Affiliations||[]).filter(a=>/^RadioLegion/.test(a.Tag)).map(a=>[pretty(a.Tag).replace('Radio Legion','Nightwave').replace(/Intermission ?/,'Intermission '),a.Standing||0,a.Title||0]);
  const dv={};for(const k in j)if(/^DailyAffiliation/.test(k))dv[k]=j[k];if(Object.keys(dv).length)P.daily={ts:Date.now(),v:dv};
  if(docRef){clearTimeout(timer);timer=setTimeout(flush,SAVE_MS)}lsSet('tenno-codex',C);
  P.lastSync={at:new Date().toISOString(),maxed,partial,nodes,sp,quests:dq,synd:sn,owned:owned.size};
  const lo=j.LoadOutInventory||{};const loadout=[];['Suits','LongGuns','Pistols','Melee'].forEach(k=>(lo[k]||[]).forEach(x=>{if(x&&x.ItemType)loadout.push(nm(x.ItemType))}));
  let created='';const cr=j.Created;if(cr){const v=cr.$date&&cr.$date.$numberLong?+cr.$date.$numberLong:(cr.$date||cr);const d=new Date(v);if(!isNaN(d))created=d.toISOString().slice(0,10)}
  const kills=(st.Enemies||[]).reduce((a,e)=>a+(e.kills||0),0);
  const topw=(st.Weapons||[]).filter(w=>w.kills).sort((a,b)=>b.kills-a.kills).slice(0,10).map(w=>[nm(w.type),w.kills]);
  const topa=(st.Abilities||[]).filter(a=>a.used).sort((a,b)=>b.used-a.used).slice(0,10).map(a=>[pretty(a.type).replace(/ Ability$/,''),a.used]);
  P.prof={name:j.DisplayName||P.name,mr:j.PlayerLevel,created,guild:j.GuildName||st.GuildName||'',time:st.TimePlayedSec,mcomp:st.MissionsCompleted,mfail:st.MissionsFailed,kills:kills||null,melee:st.MeleeKills,deaths:st.Deaths,revives:st.ReviveCount,income:st.Income,pickups:st.PickupCount,
    intr:Object.keys(ib).length?ib:null,synd:(j.Affiliations||[]).map(a=>[SYN[a.Tag]||pretty(a.Tag),a.Standing||0,a.Title??null]).sort((a,b)=>b[1]-a[1]),loadout,topw,topa};
  P.rk=Object.assign({},P.rk||{},rk);P.other=other;if(intr)P.intr=intr;if(j.PlayerLevel!=null)P.mr=j.PlayerLevel;P.name=j.DisplayName||P.name;P.mc=mc;P.at=new Date().toISOString();
  pushAll();
  return `Synced ${P.name||'your account'}: ${maxed} items maxed, ${partial} in progress, ${nodes} nodes cleared${intr?`, ${intr} intrinsic ranks`:''}${qn?`, ${qn} quests`:''}.`}
const SYNN={};for(const t in SYN){const n=SYN[t].toLowerCase();SYNN[n]=t;SYNN[n.replace(/^the /,'')]=t}Object.assign(SYNN,{ostron:'CetusSyndicate','vent kids':'VentKidsSyndicate',simaris:'LibrarySyndicate'});
function synTag(n){n=String(n||'');if(/Syndicate$/.test(n))return n;return SYNN[n.toLowerCase()]||SYNN[n.toLowerCase().replace(/^the /,'')]||n}
const DKEY={daily:'DailyAffiliation',conclave:'DailyAffiliationPvp',simaris:'DailyAffiliationLibrary',ostron:'DailyAffiliationCetus',quills:'DailyAffiliationQuills',solaris:'DailyAffiliationSolaris',ventKids:'DailyAffiliationVentkids',voxSolaris:'DailyAffiliationVox',entrati:'DailyAffiliationEntrati',necraloid:'DailyAffiliationNecraloid',holdfasts:'DailyAffiliationZariman',kahl:'DailyAffiliationKahl',cavia:'DailyAffiliationCavia',hex:'DailyAffiliationHex'};
function dailyFrom(p){const o={};const d=p.dailyStanding||{};for(const k in d)if(DKEY[k])o[DKEY[k]]=d[k];if(p.dailyFocus!=null)o.DailyFocus=p.dailyFocus;return o}
function fromParsed(o){if(o&&o.Results)return o;const p=o.profile||o;const st=o.stats||{};const i=p.intrinsics||{};
  const sk={LPS_TACTICAL:i.tactical,LPS_PILOTING:i.piloting,LPS_GUNNERY:i.gunnery,LPS_ENGINEERING:i.engineering,LPS_COMMAND:i.command,LPS_DRIFT_RIDING:i.riding,LPS_DRIFT_COMBAT:i.combat,LPS_DRIFT_OPPORTUNITY:i.opportunity,LPS_DRIFT_ENDURANCE:i.endurance};for(const k in sk)if(sk[k]==null)delete sk[k];
  const lo=p.loadout||{};const li=x=>(x||[]).map(e=>({ItemType:e.uniqueName||(e.item&&e.item.uniqueName)})).filter(e=>e.ItemType);
  return {Results:[{DisplayName:p.displayName,PlayerLevel:p.masteryRank,GuildName:p.guildName,Created:p.created,
    LoadOutInventory:{XPInfo:(lo.xpInfo||[]).map(x=>({ItemType:x.uniqueName,XP:x.xp})),Suits:li(lo.suits),LongGuns:li(lo.primary),Pistols:li(lo.secondary),Melee:li(lo.melee)},
    Missions:(p.missions||[]).map(m=>({Tag:m.nodeKey||m.node,Completes:m.completes,Tier:m.tier})),PlayerSkills:sk,
    Affiliations:(p.syndicates||[]).map(a=>({Tag:synTag(a.name),Standing:a.standing,Title:a.title})),
    ChallengeProgress:(p.challengeProgress||[]).map(c=>({Name:c.name,Progress:c.progress})),...dailyFrom(p)}],
    Stats:{GuildName:st.guildName,TimePlayedSec:st.timePlayedSec,MissionsCompleted:st.missionsCompleted,MissionsFailed:st.missionsFailed,MeleeKills:st.meleeKills,Deaths:st.deaths,ReviveCount:st.reviveCount,Income:st.income,PickupCount:st.pickupCount,
      Enemies:(st.enemies||[]).map(e=>({kills:e.kills})),Weapons:(st.weapons||[]).map(w=>({type:w.uniqueName,kills:w.kills})),Abilities:(st.abilities||[]).map(a=>({type:a.uniqueName,used:a.used}))}}}
async function autoSync(quiet){const id=(P.wfid||'').trim();if(!/^[0-9a-f]{24}$/i.test(id)){if(!quiet)toast('Enter your 24-character account ID first');return false}
  try{let j=null;if(window.TENNO_PROXY){try{const r=await fetch(window.TENNO_PROXY+'?playerId='+id);if(r.ok)j=await r.json()}catch(e){}}
    if(!j||!(j.Results||j.profile)){const r=await fetch('https://api.warframestat.us/profile/'+id+'/?language=en');if(!r.ok)throw new Error(r.status);j=await r.json();if(j.error)throw new Error(j.error)}
    const msg=importProfile(JSON.stringify(fromParsed(j)));P.auto=new Date().toISOString();saveProfile();if(!quiet||location.hash==='#home'||location.hash==='')render();if(!quiet)toast(msg);return true}
  catch(e){if(!quiet){state.syncFail=true;state.tTab='account';saveUI();if(location.hash!=='#tenno')location.hash='tenno';else render();
      toast("Warframe's profile service didn't answer. Use the two quick steps on this page.");setTimeout(()=>{const b=$('#syncsteps');if(b)b.scrollIntoView({block:'center'})},60)}return false}}
async function liveResurgence(){try{const r=await fetch('https://api.warframestat.us/pc/vaultTrader/?language=en');if(!r.ok)return;const v=await r.json();if(!v.inventory||!v.expiry)return;
  const until=v.expiry.slice(0,10);if(until===D.vtnow.until)return;const frames=v.inventory.map(x=>x.item).filter(n=>I[n]&&I[n].c==='Warframe');if(!frames.length)return;
  const pairs=new Set(frames.map(f=>(VAULT[f]||{}).pair).filter(Boolean));for(const n in VAULT)delete VAULT[n].now;
  for(const n in VAULT){if(frames.includes(n)||pairs.has(VAULT[n].pair))VAULT[n].now=until}D.vtnow={until,items:v.inventory.map(x=>x.item),loc:v.location};if(['#market','#frames','#farm'].includes(location.hash))render()}catch(e){}}
function backupCode(){return btoa(unescape(encodeURIComponent(JSON.stringify(backupObj()))))}
function restore(code){try{const o=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));if(!o||!o.c)throw 0;C=o.c;Object.assign(P,o.p||{});lsSet('tenno-codex',C);pushAll();return true}catch(e){return false}}

