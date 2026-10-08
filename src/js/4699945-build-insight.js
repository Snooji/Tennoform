/* ---------- what each mod does, a page for every mod, and a build's overall stats ---------- */
/* data/mods.json is built from WFCD by build/make_modinfo.py and only loaded when a build or a mod is opened. */
const MDI={data:null,busy:false,err:false};
function loadModInfo(){if(MDI.data||MDI.busy||MDI.err)return;MDI.busy=true;
  fetch('data/mods.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{MDI.data=j}).catch(()=>{MDI.err=true}).finally(()=>{MDI.busy=false;tfNotify()})}
/* one line saying what a mod does at max rank, for lists */
function modFx(n){if(!MDI.data){loadModInfo();return ''}const x=MDI.data[n];if(!x||!x.fx.length)return '';
  return x.fx.map(l=>l.replace(/\n/g,' ')).join(' · ').slice(0,140)}
{const _ms=modSlot;modSlot=function(slot,m,arc){const r=_ms(slot,m,arc);return {...r,pol:POL_L[r.pol]||r.pol,fx:modFx(m)}}}

const RAR_L={C:'Common',U:'Uncommon',R:'Rare',L:'Legendary',P:'Peculiar'};
const POL_L={madurai:'Madurai',vazarin:'Vazarin',naramon:'Naramon',zenurik:'Zenurik',unairu:'Unairu',penjaga:'Penjaga',umbra:'Umbra',aura:'Aura',universal:'Any'};
function modInfo(n){const arc=!!ARC[n]&&!MODS[n];const md=(arc?ARC[n]:MODS[n]);if(!md)return null;if(!MDI.data)loadModInfo();const x=(MDI.data||{})[n]||{};
  const p=PR[n]||{};const sl=(SEL[n]||[]).filter(s=>s[0]!=='__buy');const key=(arc?'arc|':'mod|')+n;
  return {n,arc,key,owned:on(key),loading:!MDI.data&&!MDI.err,type:md.ty||'',fits:x.fits||md.for||'',rarity:RAR_L[md.r]||'',polarity:arc?'':(POL_L[md.pol]||md.pol||''),
    rank:x.rk??(arc?md.mx:null),drain:x.dr??null,fx:x.fx||[],fx0:x.fx0||[],augment:!!md.aug,
    drops:(md.dr||[]).slice(0,8).map(d=>({where:d[0],chance:d[1]})),moreDrops:Math.max(0,(md.dr||[]).length-8),src:md.src||'',
    tradable:!!MS[n],wfm:MS[n]?'https://warframe.market/items/'+MS[n]:'',a7:p.a7??null,a30:p.a30??null,v7:p.v7??null,date:D.meta.prices||'',
    sellers:sl.slice(0,3).map(s=>({name:s[0],price:s[1],qty:s[2],rank:s[5]??null,status:s[4]==='ingame'?'In game':s[4]==='online'?'Online':'',whisper:whisper(n,s)}))}}

/* ---- overall stats: max-rank mods added up the way the game does, without conditional bonuses ---- */
const FRAME_ST=[['Ability Strength','str'],['Ability Duration','dur'],['Ability Efficiency','eff'],['Ability Range','rng']];
const FRAME_PCT=[['Health','Health'],['Shield Capacity','Shields'],['Armor','Armor'],['Energy Max','Energy'],['Sprint Speed','Sprint speed'],['Casting Speed','Casting speed']];
const PRIM_EL=['Heat','Cold','Electricity','Toxin'],PHYS_T=['Impact','Puncture','Slash'];
const COMBO={'Cold+Heat':'Blast','Electricity+Toxin':'Corrosive','Heat+Toxin':'Gas','Cold+Electricity':'Magnetic','Electricity+Heat':'Radiation','Cold+Toxin':'Viral'};
const WSTAT_K={'Damage':'dmg','Melee Damage':'dmg','Multishot':'ms','Critical Chance':'cc','Critical Damage':'cm','Status Chance':'sc','Fire Rate':'fr','Attack Speed':'fr',
  'Reload Speed':'rl','Magazine Capacity':'mag','Status Duration':'sd'};
/* split a mod's effect lines into always-on stat bonuses and everything else */
function fxParts(n){const x=(MDI.data||{})[n];const out={stats:[],cond:[]};if(!x)return out;
  for(const l of x.fx){const m=!l.includes('\n')&&l.match(/^([+-]?\d+(?:\.\d+)?)%\s+(.+?)(?:\s+\(x2 for [^)]+\))?$/);
    if(m)out.stats.push([m[2],+m[1]]);else out.cond.push(l.replace(/\n/g,' '))}
  return out}
function addElem(list,t,v){if(!v)return;const same=list.find(e=>e.t===t||(e.parts&&e.parts.includes(t)));if(same){same.v+=v;return}
  const single=PRIM_EL.includes(t)&&list.find(e=>PRIM_EL.includes(e.t)&&!e.parts);
  if(single){const c=COMBO[[single.t,t].sort().join('+')];single.parts=[single.t,t];single.t=c;single.v+=v;return}
  list.push({t,v})}
/* ov: the mods actually shown, when they differ from the saved build (the Warframes page's budget swap) */
function buildInsight(id,ov){const b=buildById(id);if(!b)return null;if(!MDI.data)loadModInfo();if(typeof ST!=='undefined'&&!ST.data)loadStats();
  const it=I[b.item]||{};const c=it.c||'';const kind=c==='Warframe'?'frame':['Primary','Secondary','Melee','Arch-Gun','Arch-Melee'].includes(c)?'weapon':'other';
  const ready=!!MDI.data&&(kind!=='weapon'&&kind!=='frame'||(typeof ST!=='undefined'&&!!ST.data));
  const mods=(ov?ov.mods:[b.aura,b.exilus,...(b.mods||[])]).filter(Boolean),arcs=(ov?ov.arcanes:(b.arcanes||[])).filter(Boolean);
  const res={ready,failed:MDI.err,kind,rows:[],elements:[],cond:[],highlights:[],missing:[]};if(!ready)return res;
  const sum={},physAdd={},elemSeq=[];
  for(const n of mods){if(!MDI.data[n]){res.missing.push(n);continue}const f=fxParts(n);
    for(const [k,v] of f.stats){if(PRIM_EL.includes(k))elemSeq.push([k,v]);else if(PHYS_T.includes(k))physAdd[k]=(physAdd[k]||0)+v;else sum[k]=(sum[k]||0)+v}
    f.cond.forEach(t=>res.cond.push({m:n,t}))}
  for(const n of arcs){const f=fxParts(n);[...f.stats.map(([k,v])=>`+${v}% ${k}`),...f.cond].forEach(t=>res.cond.push({m:n,t}))}
  const s=(typeof ST!=='undefined'&&ST.data&&ST.data[b.item])||null;const pc=v=>Math.round(v*10)/10+'%';
  if(kind==='frame'){
    for(const [k,key] of FRAME_ST){const v=sum[k]||0;if(!v)continue;let to=100+v;const capped=key==='eff'&&to>175;if(capped)to=175;
      res.rows.push({k,from:'100%',to:pc(to),note:capped?'capped at 175%':'',gain:to/100})}
    for(const [k,label] of FRAME_PCT){const v=sum[k];if(v)res.rows.push({k:label,from:'',to:(v>0?'+':'')+pc(v),note:'bonus',gain:1+v/100})}}
  if(kind==='weapon'&&s){const melee=c==='Melee'||c==='Arch-Melee';const D=(sum['Damage']||0)+(sum['Melee Damage']||0);
    const base=s.dmg||{};const tot=s.tot||Object.values(base).reduce((a,v)=>a+v,0);const types={};
    for(const [t,v] of Object.entries(base)){const T=DMG_L[t]||t;if(PHYS_T.includes(T))types[T]=v*(1+D/100)*(1+(physAdd[T]||0)/100)}
    const el=[];for(const [t,v] of elemSeq)addElem(el,t,tot*(1+D/100)*v/100);
    for(const [t,v] of Object.entries(base)){const T=DMG_L[t]||t;if(!PHYS_T.includes(T))addElem(el,T,v*(1+D/100))}
    res.elements=el.map(e=>({t:e.t,v:Math.round(e.v*10)/10,from:e.parts||null}));
    const hit=Object.values(types).reduce((a,v)=>a+v,0)+el.reduce((a,e)=>a+e.v,0);
    const f=k=>1+(sum[k]||0)/100;
    const ms0=s.ms||1,cc0=s.cc||0,cm0=s.cm||1,sc0=s.sc||0,fr0=s.fr||0;
    const ms=ms0*f('Multishot'),cc=cc0*f('Critical Chance'),cm=cm0*f('Critical Damage'),sc=sc0*f('Status Chance');
    const frM=melee?fr0*f('Attack Speed'):fr0*f('Fire Rate');
    const mag0=s.mag||0,mag=Math.round(mag0*f('Magazine Capacity')),rl0=s.rl||0,rl=rl0/f('Reload Speed');
    const avg=(h,m,c,x)=>h*m*(1+c*(x-1));const dps=(a,r,mg,re)=>melee||!mg?a*r:a*r*mg/(mg+r*re);
    const a0=avg(tot,ms0,cc0,cm0),a1=avg(hit,ms,cc,cm);
    const row=(k,from,to,gain,note)=>res.rows.push({k,from,to,gain,note:note||''});
    row('Damage per hit',fmt(Math.round(tot)),fmt(Math.round(hit)),hit/(tot||1));
    if(!melee||ms!==ms0)row('Multishot',ms0.toFixed(1)+'×',ms.toFixed(1)+'×',ms/ms0);
    row('Critical chance',pc(cc0*100),pc(cc*100),cc/(cc0||1),cc>1?'orange crits':'');
    row('Critical multiplier',cm0.toFixed(1)+'×',cm.toFixed(1)+'×',cm/cm0);
    row('Status chance',pc(sc0*100),pc(sc*100),sc/(sc0||1));
    if(frM!==fr0)row(melee?'Attack speed':'Fire rate',fr0.toFixed(2),frM.toFixed(2),frM/fr0);
    if(mag0&&mag!==mag0)row('Magazine',fmt(mag0),fmt(mag),mag/mag0);
    if(rl0&&Math.abs(rl-rl0)>.005)row('Reload',rl0.toFixed(2)+'s',rl.toFixed(2)+'s',rl0/rl);
    row('Average damage per '+(melee?'swing':'shot'),fmt(Math.round(a0)),fmt(Math.round(a1)),a1/(a0||1),'with crits');
    const d0=dps(a0,fr0,mag0,rl0),d1=dps(a1,frM,mag,rl);
    if(d0)row(melee?'Damage per second':'Sustained damage per second',fmt(Math.round(d0)),fmt(Math.round(d1)),d1/d0,melee?'before combo':'with reloads');}
  /* why it works: the biggest changes, the elements it ends up dealing, and what's left out of the numbers */
  const sum1=res.rows.find(r=>/^(Sustained damage|Damage) per second$/.test(r.k))||res.rows.find(r=>r.k.startsWith('Average damage'));
  if(sum1&&sum1.gain>1.05)res.highlights.push(`About ${Math.round(sum1.gain)<10?Math.round(sum1.gain*10)/10:fmt(Math.round(sum1.gain))}× the damage of an unmodded ${b.item} (${sum1.to} ${sum1.k.toLowerCase()})`);
  const top=res.rows.filter(r=>r.gain>1.05&&r.from&&!/damage per (second|shot|swing)/i.test(r.k)).sort((a,b)=>b.gain-a.gain).slice(0,3);
  for(const r of top)res.highlights.push(`${r.k} goes from ${r.from} to ${r.to}`);
  if(res.elements.length)res.highlights.push('Deals '+res.elements.map(e=>e.t+(e.from?` (${e.from.join(' + ')})`:'')).join(' and ')+(kind==='weapon'?' on top of its physical damage':''));
  if(b.helminth)res.highlights.push('Helminth: '+b.helminth);
  if(res.cond.length)res.highlights.push(`${res.cond.length} more ${res.cond.length===1?'effect kicks':'effects kick'} in during a fight (on kill, on status and so on); they stack on top of the numbers here`);
  return res}

Object.assign(window.TF,{modInfo:n=>modInfo(n),buildInsight:(id,ov)=>buildInsight(id,ov)});
