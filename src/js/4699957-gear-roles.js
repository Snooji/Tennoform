/* ---------- how to level each kind of gear (not everything works on Hydron), and roles for every Warframe ---------- */
/* From the Warframe wiki (Mastery Rank, Affinity, Archwing, Archgun Deployer, Necramech Summon, K-Drive, Amp, Kitgun, Zaw,
   Companion, Plexus and the Kuva/Tenet/Coda pages), checked October 2026. */
const HYDRON='Level it fast on Hydron (Sedna) or Elite Sanctuary Onslaught.';
const LEVEL_HOW={
  Archwing:{no:1,t:'Archwings can\'t be used on Hydron. Level it in Archwing missions (Salacia on Neptune is the classic spot), in Railjack missions like R-9 Cloud (Veil Proxima), or in the open worlds with the Archwing Launcher. It only gains XP while you fly it.'},
  'Arch-Gun':{no:1,t:'Fastest in Archwing missions (Salacia, Neptune) or Railjack missions like R-9 Cloud. On foot it needs the Archgun Deployer (Profit-Taker heist) and a Gravimag installed; then you can call it down in normal missions like Hydron, but not in Sanctuary Onslaught or Duviri. While it\'s out, unequip your other weapons so it gets more of the XP.'},
  'Arch-Melee':{no:1,t:'Only works in space: Archwing missions (Salacia, Neptune) or Railjack missions like R-9 Cloud. It can\'t be used on foot. Equip only the arch-melee so it gets more of the XP.'},
  Necramech:{no:1,t:'Necramechs can\'t be used on Hydron. Summon it with the Necramech Summon gear (needs The War Within) in the open worlds, Isolation Vaults on Deimos, Conjunction Survival on Lua, or the ground parts of Railjack missions (Tactical Intrinsic 5). Squad mates within 250 m share XP in the open worlds. Max rank is 40, which takes 5 Forma.'},
  'K-Drive':{no:1,t:'K-Drives can\'t be used on Hydron and kills give them nothing. They level only from tricks: ride in an open world (Orb Vallis and Cambion Drift races are best) and chain jumps, grabs and grinds. Blue crystals raise the trick multiplier.'},
  Amp:{t:'Works on Hydron, but only kills you make yourself as your Operator or Drifter count fully (shared XP gives the Amp a little over a third). Eidolon hunts and the Zariman work too. Most Amps give Mastery only after you gild them at rank 30 and level them again; Sirocco comes already gilded.'},
  Kitgun:{t:'Level it anywhere (Hydron, Sanctuary Onslaught). For Mastery, rank it to 30, gild it with Rude Zuud in Fortuna, then level it again. Each chamber counts once.'},
  Zaw:{t:'Level it anywhere (Hydron, Sanctuary Onslaught). For Mastery, rank it to 30, gild it with Hok in Cetus, then level it again. Each strike counts once.'},
};
const LEVEL_NAME={
  Plexus:{no:1,t:'The Plexus only levels in Railjack missions. Man a turret: turret kills give the Plexus all of the XP. Joining public Railjack squads as a gunner works fine.'},
  Sirocco:{t:'Sirocco is the Drifter\'s Amp. It comes already gilded, so it gives Mastery as soon as you level it. Use it as your Operator or Drifter in any mission (Hydron works) and get the kills yourself.'},
  Grimoire:{t:HYDRON+' It has unlimited ammo.'},
};
function levelTip(it){if(!it)return HYDRON;const n=it.n;
  if(LEVEL_NAME[n])return LEVEL_NAME[n].t;
  if(/^(Kuva|Tenet|Coda) /.test(n)||n==='Paracesis')return HYDRON+' Max rank is 40: each Forma raises it by 2, and every extra rank gives Mastery.';
  if(it.c==='Companion'&&/(MOA|Hound|Predasite|Vulpaphyla)/.test(n))return 'Equip it and play anywhere (Hydron works); it gets XP from your kills. For Mastery, rank it to 30, gild it, then level it again.';
  const L=LEVEL_HOW[it.c];return L?L.t:HYDRON}
const notHydron=it=>!!(it&&((LEVEL_NAME[it.n]||{}).no||(LEVEL_HOW[it.c]||{}).no));

/* Warframe roles. "Playstyle" is the label the wiki seeded from a list Digital Extremes supplied; the "good at" tags are the community's usual view. */
const FRAME_ROLE={
  Ash:[['Stealth','Damage'],[]],Atlas:[['Damage','Survival'],['Tank']],Banshee:[['Crowd Control'],['Buffer','Stealth']],Baruuk:[['Damage','Crowd Control'],['Tank']],
  Caliban:[['Crowd Control'],[]],Chroma:[['Survival','Damage'],['Tank','Buffer']],Citrine:[['Support'],['Debuffer','Healer']],'Cyte-09':[['Damage','Stealth'],[]],
  Dagath:[['Damage'],['Debuffer']],Dante:[['Damage','Support','Survival'],['Healer']],Ember:[['Damage'],['Nuker']],Equinox:[['Support'],['Nuker','Healer']],
  Excalibur:[['Damage'],[]],'Excalibur Umbra':[['Damage'],[]],Follie:[['Crowd Control'],['Debuffer']],Frost:[['Crowd Control','Survival'],['Tank']],
  Gara:[['Damage','Survival','Crowd Control'],['Tank']],Garuda:[['Damage'],[]],Gauss:[['Damage','Survival'],['Mobility']],Grendel:[['Survival'],['Tank']],
  Gyre:[['Damage','Crowd Control'],['Nuker']],Harrow:[['Survival','Support'],['Buffer']],Hildryn:[['Damage','Survival'],['Tank','Nuker']],
  Hydroid:[['Crowd Control'],['Resource farming']],Inaros:[['Survival','Crowd Control'],['Tank']],Ivara:[['Stealth'],['Resource farming']],
  Jade:[['Support'],['Buffer','Healer']],Khora:[['Crowd Control','Damage'],['Resource farming']],Koumei:[['Damage','Crowd Control'],[]],
  Kullervo:[['Damage'],['Mobility']],Lavos:[['Damage'],['Debuffer']],Limbo:[['Crowd Control'],[]],Loki:[['Stealth'],[]],Mag:[['Crowd Control'],['Debuffer']],
  Mesa:[['Damage'],[]],Mirage:[['Damage'],[]],Narin:[['Damage','Crowd Control'],[]],Nekros:[['Crowd Control'],['Resource farming','Summoner']],
  Nezha:[['Survival','Crowd Control'],['Tank','Mobility']],Nidus:[['Damage','Survival','Crowd Control'],['Tank']],Nokko:[['Damage','Crowd Control'],[]],
  Nova:[['Damage','Crowd Control'],['Debuffer','Nuker']],Nyx:[['Crowd Control'],['Debuffer']],Oberon:[['Support'],['Healer']],
  Octavia:[['Support','Damage','Crowd Control'],['Buffer','Stealth']],Oraxia:[['Damage','Stealth'],[]],Protea:[['Damage','Support'],[]],
  Qorvex:[['Survival','Crowd Control'],['Tank']],Revenant:[['Damage','Survival'],['Tank']],Rhino:[['Survival','Crowd Control'],['Tank','Buffer']],
  Saryn:[['Damage'],['Nuker','Debuffer']],Sevagoth:[['Damage','Survival'],['Summoner']],Styanax:[['Damage','Support'],['Nuker']],Temple:[['Damage','Support'],[]],
  Titania:[['Damage','Crowd Control'],['Mobility']],Trinity:[['Survival','Support'],['Healer','Buffer']],Uriel:[['Damage'],['Summoner']],
  Valkyr:[['Damage','Survival'],['Tank']],Vauban:[['Crowd Control'],[]],Volt:[['Damage'],['Buffer','Mobility']],Voruna:[['Damage','Stealth'],[]],
  Wisp:[['Support'],['Buffer','Healer']],Wukong:[['Damage','Survival'],['Tank','Summoner']],Xaku:[['Damage'],['Debuffer']],
  Yareli:[['Damage','Crowd Control'],['Mobility']],Zephyr:[['Damage','Crowd Control'],['Mobility']],
  'Sirius & Orion':[['Damage','Support'],['Summoner']],'Orion & Sirius':[['Damage','Support'],['Summoner']]};
const roleOf=n=>FRAME_ROLE[n]||FRAME_ROLE[baseOf(n)]||[[],[]];
const ROLE_LIST=['Damage','Crowd Control','Support','Survival','Stealth','Tank','Healer','Buffer','Debuffer','Nuker','Summoner','Mobility','Resource farming'];
const hasRole=(n,r)=>{const [a,b]=roleOf(n);return a.includes(r)||b.includes(r)};

/* the Warframes page: roles under the name and a filter for each role */
{const _fd=framesData;framesData=function(){const ff=state.frF||'all';let d;
  if(ff.startsWith('role:')){const r=ff.slice(5);
    const match=Object.values(I).filter(i=>i.c==='Warframe'&&i.n!=='Helminth'&&hasRole(i.n,r)).map(i=>i.n).sort();
    if(match.length&&!match.includes(state.frame))state.frame=match.includes('Saryn Prime')?'Saryn Prime':match[0];
    state.frF='all';try{d=_fd()}finally{state.frF=ff}
    if(match.length)d.list=match;else d.filteredEmpty=true;d.filter=ff}
  else d=_fd();
  const [play,good]=roleOf(d.name);return {...d,playstyle:play,goodAt:good,roles:ROLE_LIST}}}
/* every item's "Rank to 30" step says where it can actually be levelled */
{const _t=itemTree;itemTree=function(name,opts){const h=_t(name,opts);const it=I[name];return it?h.replace(HYDRON,esc(levelTip(it))):h}}
/* the Mastery page's XP tab: the gear Hydron can't level */
{const _x=xpTabHTML;xpTabHTML=function(){const rows=[['Archwings','Archwing'],['Arch-guns','Arch-Gun'],['Arch-melee','Arch-Melee'],['Necramechs (Voidrig, Bonewidow)','Necramech'],['K-Drives','K-Drive'],['Amps','Amp'],['Kitguns','Kitgun'],['Zaws','Zaw']];
  return _x()+`<div class="panel stack cut"><h2>Gear Hydron can't level (or needs extra steps)</h2><p class="small muted" style="margin:0">Most gear levels anywhere. These are the exceptions.</p>
  <ul class="small stack" style="margin:0;padding-left:18px">${[...rows.map(([l,c])=>[l,LEVEL_HOW[c].t]),['Plexus (Railjack)',LEVEL_NAME.Plexus.t],['MOAs, Hounds, Predasites, Vulpaphylas','Level them anywhere, then gild and level again for Mastery.'],['Kuva, Tenet and Coda weapons, Paracesis','Max rank 40: each Forma raises it by 2, and every extra rank gives Mastery.'],['Exalted weapons and pet weapons','They rank up but give no Mastery.']].map(([a,b])=>`<li><b>${esc(a)}:</b> ${esc(b)}</li>`).join('')}</ul></div>`}}
