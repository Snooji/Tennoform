/* ---------- MR plan route: every source of mastery XP, quickest first, until you reach the target rank ---------- */
/* Gear is only half of it: star chart and Steel Path nodes, junctions, Railjack and Drifter intrinsics and
   modular companions all give mastery. Steps are ordered by effort; the plan stops where the target is reached. */
function masteryRoute(target){const t=totalXP(),cur=mrInfo(t.total).mr;const need=Math.max(0,mrNeed(target)-t.total);const cap=Math.min(Math.max(cur,0),30);
  const qd=n=>on('q|'+n);const steps=[];
  /* 1. items already in progress or built: no farming, just play */
  const prog=MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=cap&&(rankOf(it.n)>0||on('build|'+it.n)||(P.foundry||[]).some(f=>f.n===it.n)));
  if(prog.length)steps.push({id:'finish',title:'Finish ranking what you already have',how:'No farming needed: equip these and play. Steel Path or high-level Survival with an Affinity Booster ranks them fastest.',
    xp:prog.reduce((a,it)=>a+mxp(it)-itemXP(it.n),0),count:prog.length,unit:'items',items:prog.map(it=>it.n),link:'',kind:'gear'});
  /* 2. star chart nodes and junctions */
  const left=NODES.filter(n=>!on('n|'+n.id));const jn=left.filter(n=>/Junction/.test(n.t));const byP={};left.forEach(n=>{const k=n.p;(byP[k]=byP[k]||{p:k,n:0,xp:0}).n++;byP[k].xp+=n.x});
  if(left.length)steps.push({id:'chart',title:'Clear star chart nodes',how:`Every node gives XP the first time you finish it, and each Junction gives 1,000.${jn.length?` ${jn.length} Junction${jn.length>1?'s':''} left.`:''} Most give more XP per minute than ranking gear early on.`,
    xp:left.reduce((a,n)=>a+n.x,0),count:left.length,unit:'nodes',planets:Object.values(byP).sort((a,b)=>b.xp-a.xp).slice(0,8),link:'missions',kind:'nodes'});
  /* 3. easy gear: market blueprints and boss or node drops */
  /* only gear you can use at your current rank; more unlocks as you go */
  const cand=MI.filter(it=>!on('m|'+it.n)&&!prog.includes(it)&&(it.mr||0)<=cap).map(it=>({it,gain:mxp(it)-itemXP(it.n),e:ease(it)})).filter(x=>x.gain>0)
    .sort((a,b)=>b.gain-a.gain||(a.it.mr||0)-(b.it.mr||0));
  const gearStep=(e,how)=>{const xs=cand.filter(x=>x.e===e);if(xs.length)steps.push({id:'gear'+e,title:EASE[e],how,xp:xs.reduce((a,x)=>a+x.gain,0),count:xs.length,unit:'items',items:xs.map(x=>x.it.n),gains:xs.map(x=>x.gain),link:'',kind:'gear'})};
  gearStep(0,'Buy the blueprint with credits in the Market, build it, then rank it to 30. Warframes, companions and Archwings give twice the XP of weapons.');
  gearStep(1,'Blueprints and parts drop from bosses, specific nodes or enemies. Each item page says where.');
  /* 4. intrinsics: 1,500 XP for every rank */
  const rail=IR.length*10*1500-catXP('rail'),drift=ID.length*10*1500-catXP('drift');
  if(rail>0)steps.push({id:'rail',title:'Railjack intrinsics',how:`Every intrinsic rank is 1,500 XP (5 schools × 10 ranks). Earn intrinsic points by playing Railjack missions in the Proxima regions.${qd('Rising Tide')?'':' Needs the Rising Tide quest and a Dry Dock.'}`,
    xp:rail,count:Math.round(rail/1500),unit:'ranks',link:'',kind:'intr'});
  if(drift>0)steps.push({id:'drift',title:'Drifter intrinsics',how:`Every rank is 1,500 XP (4 schools × 10 ranks). Earn them in Duviri: the Duviri Experience, the Lone Story and the Circuit.${qd('The Duviri Paradox')?'':' Needs The Duviri Paradox quest.'}`,
    xp:drift,count:Math.round(drift/1500),unit:'ranks',link:'',kind:'intr'});
  /* 5. relic gear, then Steel Path, then the hard stuff */
  gearStep(2,'Prime parts from relics. Open them in fissures; the Relics page shows which relics you own that drop what you need.');
  const spl=NODES.filter(n=>!on('sp|'+n.id));
  if(spl.length)steps.push({id:'sp',title:'Steel Path nodes',how:left.length?'Unlocks once every star chart node is done, then every node gives its XP a second time.':'Every node gives its XP a second time. Enemies are tougher, so bring a ranked loadout.',
    xp:spl.reduce((a,n)=>a+n.x,0),count:spl.length,unit:'nodes',link:'missions',kind:'nodes',locked:left.length>0});
  gearStep(3,'Quest rewards, syndicate offerings and vendors such as Cephalon Simaris and the Open World hubs.');
  steps.push({id:'modular',title:'Modular gear',how:'Every MOA, Hound, Predasite and Vulpaphyla you build counts as a new item (6,000 XP each), and so does each Zaw strike, Kitgun chamber and Amp prism you rank. Mix new parts to keep earning.',
    xp:0,count:0,unit:'',link:'ranks',kind:'info'});
  gearStep(4,'Vaulted Primes: buy the set on warframe.market, or wait for a Prime Resurgence.');
  /* walk the steps until the gap is covered */
  let acc=0;steps.forEach(s=>{s.before=acc;if(!s.locked)acc+=s.xp;s.after=acc;s.reach=s.before<need&&s.after>=need&&need>0;s.beyond=s.before>=need&&need>0;
    s.mr=mrInfo(t.total+Math.min(acc,1e9)).mr;
    /* the step that reaches the target: how many of its items it takes (biggest XP first) */
    if(s.reach&&s.gains){let left=need-s.before,k=0;while(left>0&&k<s.gains.length){left-=s.gains[k];k++}s.pick=k}});
  return {need,steps,total:acc}}
{const _md=masteryData;masteryData=function(){const d=_md.apply(this,arguments);if(d.tab==='path'){const r=masteryRoute(+d.target);
  d.route=r.steps.map(s=>({...s,gains:undefined,pick:s.pick||0,items:s.items?s.items.slice(0,60).map(n=>gearRow(n,'')).filter(Boolean):[],more:s.items?Math.max(0,s.items.length-60):0,mrAfter:mrLabel(s.mr)}));d.routeTotal=r.total}return d}}
