/* ---------- full inventory import: reads an inventory.json (Warframe's own inventory data) in the browser ---------- */
/* The file never leaves the device; only the results are saved. Names come from data/umap.json, loaded on first use. */
let UMAP=null;
async function umap(){if(UMAP)return UMAP;const r=await fetch('/data/umap.json');if(!r.ok)throw new Error('map');return UMAP=await r.json()}
const INV_LISTS=['Suits','LongGuns','Pistols','Melee','SpaceSuits','SpaceGuns','SpaceMelee','Sentinels','SentinelWeapons','KubrowPets','MoaPets','Hoverboards','OperatorAmps','MechSuits','CrewShipWeapons','CrewShips','SpecialItems'];
function invParse(txt){let raw;try{raw=JSON.parse(String(txt).replace(/^﻿/,'').trim())}catch(e){return null}
  if(raw&&typeof raw.InventoryJson==='string'){try{raw=JSON.parse(raw.InventoryJson)}catch(e){return null}}
  if(raw&&raw.inventory&&typeof raw.inventory==='object')raw=raw.inventory;
  return raw&&typeof raw==='object'&&(raw.XPInfo||raw.MiscItems||raw.Suits||raw.RawUpgrades)?raw:null}
const lvlOf=fp=>{try{const o=typeof fp==='string'?JSON.parse(fp):fp;return Math.max(0,+(o&&o.lvl)||0)}catch(e){return 0}};
const dateOf=d=>{if(!d)return 0;const v=d.$date?(d.$date.$numberLong!=null?+d.$date.$numberLong:+new Date(d.$date)):+d;return isFinite(v)?v:0};
async function importInventory(txt){const inv=invParse(txt);
  if(!inv)return {ok:false,msg:"That doesn't look like an inventory file. Choose the inventory.json the tool saved."};
  let M;try{M=await umap()}catch(e){return {ok:false,msg:"Couldn't load the item list. Check your connection and try again."}}
  const a=logSnap();LOGMUTE++;let out;
  try{
    /* ranks, mastered gear, star chart, quests, syndicates and intrinsics: same reader as the profile sync */
    const base=importProfile0(JSON.stringify(inv));
    const n={items:0,parts:0,bps:0,mods:0,arcanes:0,relics:0,res:0,foundry:0};
    /* gear you own right now, including things built but not levelled yet */
    for(const k of INV_LISTS)for(const x of inv[k]||[]){const nm=U[x&&x.ItemType];if(nm){stepKeys(nm).forEach(setQ);n.items++}}
    /* blueprints and built parts */
    for(const x of inv.Recipes||[]){if(!(x.ItemCount>0))continue;const b=M.b[x.ItemType];if(b&&I[b]){setQ('bp|'+b);n.bps++;continue}
      const c=M.c[x.ItemType];if(c&&I[c[0]]){setQ('part|'+c[0]+'|'+c[1]);n.bps++}}
    for(const x of inv.MiscItems||[]){if(!(x.ItemCount>0))continue;const c=M.c[x.ItemType];if(!c||c[2]||!I[c[0]])continue;const [it,pt]=c;
      setQ('part|'+it+'|'+pt);const p=I[it].parts.find(q=>q.n===pt);if(p&&p.sub){setQ('built|'+it+'|'+pt);p.sub.forEach(([r])=>setQ('res|'+it+'|'+pt+'|'+r))}n.parts++}
    /* mods (owned) and arcanes (copies, counting ranked ones by the copies they took) */
    const arc={};
    for(const x of inv.RawUpgrades||[]){if(!(x.ItemCount>0))continue;const m=M.m[x.ItemType];if(m){if(!on('mod|'+m)){setQ('mod|'+m);n.mods++}continue}
      const ar=M.a[x.ItemType];if(ar)arc[ar]=(arc[ar]||0)+x.ItemCount}
    for(const x of inv.Upgrades||[]){const m=M.m[x.ItemType];if(m){if(!on('mod|'+m)){setQ('mod|'+m);n.mods++}continue}
      const ar=M.a[x.ItemType];if(ar)arc[ar]=(arc[ar]||0)+arcCopies(lvlOf(x.UpgradeFingerprint))}
    if(Object.keys(arc).length){P.arc=arc;n.arcanes=Object.keys(arc).length}
    /* relics by refinement, and resource counts: the file is the full picture, so these replace what was there */
    const rel={},res={};
    for(const x of inv.MiscItems||[]){if(!(x.ItemCount>0))continue;const l=M.l[x.ItemType];if(l){const o=rel[l[0]]=rel[l[0]]||{};o[l[1]]=(o[l[1]]||0)+x.ItemCount;continue}
      const r=M.r[x.ItemType];if(r)res[r]=(res[r]||0)+x.ItemCount}
    P.rel=rel;n.relics=Object.keys(rel).length;
    if(Object.keys(res).length){P.inv=res;n.res=Object.keys(res).length}
    /* Foundry: what's building and when it's done */
    const now=Date.now();const fd=[];
    for(const x of inv.PendingRecipes||[]){const b=M.b[x.ItemType],c=M.c[x.ItemType];const name=b||(c?c[0]+' '+c[1]:'');if(!name)continue;const end=dateOf(x.CompletionDate);
      fd.push({id:(now+fd.length).toString(36),n:name,t0:now,dur:Math.max(0,Math.round((end-now)/1000))})}
    if((inv.PendingRecipes||[]).length){P.foundry=fd;n.foundry=fd.length}
    P.wallet={plat:inv.PremiumCredits??null,cr:inv.RegularCredits??null,endo:inv.FusionPoints??null,at:now};
    P.invAt=new Date().toISOString();P.lastSync=Object.assign(P.lastSync||{},{inv:n});
    lsSet('tenno-codex',C);saveProfile();pushAll();
    out={ok:true,n,base,msg:`Imported your inventory: ${n.items} items, ${n.parts+n.bps} parts and blueprints, ${n.mods} new mods, ${n.arcanes} arcanes, ${n.relics} relic kinds, ${n.res} resources${n.foundry?`, ${n.foundry} in the Foundry`:''}.`}}
  finally{LOGMUTE--}
  updateMR();return out}
