/* ---------- mastery math ---------- */
const BIG=['Warframe','Sentinel','Companion','Archwing','K-Drive','Necramech'];
const CATS=['Warframe','Primary','Secondary','Melee','Sentinel','Robotic Weapon','Companion','Archwing','Arch-Gun','Arch-Melee','Necramech','K-Drive','Zaw','Kitgun','Amp'];
const CATL={Warframe:'Warframes',Primary:'Primary Weapons',Secondary:'Secondary Weapons',Melee:'Melee Weapons',Sentinel:'Sentinels','Robotic Weapon':'Sentinel Weapons',Companion:'Companions',Archwing:'Archwing','Arch-Gun':'Archgun','Arch-Melee':'Archmelee',Necramech:'Necramechs','K-Drive':'K-Drives',Zaw:'Zaws',Kitgun:'Kitguns',Amp:'Amps'};
const EXTRA=[['chart','Missions'],['sp','The Steel Path Missions'],['rail','Railjack Intrinsics'],['drift','Drifter Intrinsics'],['other','Other gear (MOAs, Hounds, Amps…)']];
const IR=['Tactical','Piloting','Gunnery','Engineering','Command'],ID=['Riding','Combat','Opportunity','Endurance'];
const MI=Object.values(I).filter(i=>i.n!=='Helminth');
function isMech(it){return it&&it.c==='Necramech'}
function perRank(it){return it&&(BIG.includes(it.c)||isMech(it))?200:100}
function maxRank(it){return it&&(/^(Kuva|Tenet|Coda) /.test(it.n)||it.n==='Paracesis'||isMech(it))?40:30}
function mxp(it){return it?perRank(it)*maxRank(it):0}
function itemXP(n){const it=I[n];if(on('m|'+n))return mxp(it);const r=P.rk[n];return r?Math.min(r,maxRank(it))*perRank(it):0}
function rankOf(n){const it=I[n];return on('m|'+n)?maxRank(it):Math.min(+(P.rk[n]||0),maxRank(it))}
function setRank(n,r){const it=I[n];const mx=maxRank(it);r=Math.max(0,Math.min(mx,Math.round(+r||0)));const _prev={rk:P.rk[n],m:on('m|'+n)};const _was=rankOf(n);
  if(r>=mx){delete P.rk[n];if(!on('m|'+n))setK('m|'+n,1)}else{if(on('m|'+n))setK('m|'+n,0);if(r)P.rk[n]=r;else delete P.rk[n]}saveProfile();updateMR();if(_was!==rankOf(n))undoPush(n,_prev);return r}
function autoCat(c){let x=0,m=0,t=0,p=0;for(const it of MI)if(it.c===c){t++;const v=itemXP(it.n);x+=v;if(v>=mxp(it))m++;else if(v>0)p++}return {x,m,t,p}}
function intrSum(o){return Object.values(o||{}).reduce((a,v)=>a+(+v||0),0)}
function autoExtra(k){if(k==='chart')return NODES.reduce((a,n)=>a+(on('n|'+n.id)?n.x:0),0);if(k==='sp')return NODES.reduce((a,n)=>a+(on('sp|'+n.id)?n.x:0),0);
  if(k==='rail'){const s=intrSum(P.intrR);return (s||(!P.intrD&&+P.intr)||0)*1500}if(k==='drift')return intrSum(P.intrD)*1500;if(k==='other')return (+P.other||0)+othXP();return 0}
function isOv(k){return P.bo&&P.bo[k]!=null&&P.bo[k]!==''}
function catXP(k){if(isOv(k))return +P.bo[k];return CATS.includes(k)?autoCat(k).x:autoExtra(k)}
function totalXP(){const rows=[...CATS,...EXTRA.map(e=>e[0])].map(k=>[k,catXP(k)]);const g=k=>rows.find(r=>r[0]===k)[1];
  const it=CATS.reduce((a,k)=>a+g(k),0);const adj=+P.adj||0;const raw=rows.reduce((a,r)=>a+r[1],0)+adj;const base=inGameBase();const un=base?Math.max(0,base.x-raw):0;
  return {rows,it,ch:g('chart'),sp:g('sp'),intr:g('rail')+g('drift'),other:g('other'),adj,raw,un,base,total:raw+un}}
const mrNeed=m=>m<=30?2500*m*m:2250000+(m-30)*147500;
function mrInfo(x){let mr=0;while(mr<30&&mrNeed(mr+1)<=x)mr++;if(mr===30)mr=30+Math.max(0,Math.floor((x-2250000)/147500));
  const cur=mrNeed(mr),next=mrNeed(mr+1);return {mr,cur,next,pct:Math.max(0,Math.min(100,(x-cur)/(next-cur)*100))}}
const mrLabel=m=>m>30?'L'+(m-30):String(m);
function updateMR(){const b=$('#bigmr');if(b)b.outerHTML=bigMR();const hh=$('#hero');if(hh)hh.outerHTML=heroHTML();if(typeof rkHdr==='function')rkHdr();tfNotify()}

