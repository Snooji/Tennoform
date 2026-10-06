/* ---------- ownership, separate from mastery ---------- */
/* Warframe keeps mastery forever, even after you sell or release something, so "mastered" doesn't mean "owned".
   Players can mark anything as not owned; that only changes ownership (filters, Owned labels), never mastery. */
{const _oi=ownedItem;ownedItem=function(n){return on('nown|'+n)?false:_oi(n)}}
const SYND_GEAR=[['Secura','Perrin Sequence'],['Sancti','New Loka'],['Rakta','Red Veil'],['Vaykor','Steel Meridian'],['Telos','Arbiters of Hexis'],['Synoid','Cephalon Suda']];
function howToGet(n){const it=I[n]||{};const wiki=it.w||('https://wiki.warframe.com/w/'+encodeURIComponent(n.replace(/ /g,'_')));
  const craft=(it.parts||[]).length>0;let t='';
  if(/ Kubrow$/.test(n))t='Hatch a Kubrow Egg in your Orbiter\'s Incubator (the Howl of the Kubrow quest unlocks it). Eggs drop from Kubrow Dens on Earth. The breed is random; to get this one for sure, hatch it from a '+n.replace(' Kubrow','')+' Genetic Imprint.';
  else if(/^(Adarza|Smeeta) Kavat$/.test(n))t='Collect Kavat Genetic Codes from Feral Kavats in Orokin Derelict missions, build the Kavat Incubator Upgrade Segment, then hatch a Kavat in the Incubator. The breed is random unless you use a Genetic Imprint.';
  else if(/(Predasite|Vulpaphyla)$/.test(n))t='Comes from Son in the Necralisk on Deimos. The wiki has the full steps.';
  else if(/^Prisma /.test(n))t='Sold by Baro Ki\'Teer for ducats and credits when he visits, or trade another player for it.';
  else if(/^Mk1-/.test(n))t='Buy it from the Market in your Orbiter for credits.';
  else if(/^Dex /.test(n))t='An anniversary login reward. If you missed it, it comes back in later anniversary reward picks.';
  else if(/^(Excalibur Prime|Skana Prime|Lato Prime)$/.test(n))t='Founders pack exclusive. It can\'t be obtained any more.';
  else if(it.c==='K-Drive')t='Build K-Drive parts bought from the Ventkids in Fortuna (Orb Vallis).';
  else if(it.c==='Kitgun')t='A Kitgun chamber, bought from Rude Zuud in Fortuna or Father in the Necralisk.';
  else{const s=SYND_GEAR.find(([p])=>n.startsWith(p+' '));if(s)t=`Bought from ${s[1]} with standing, once you reach their top rank.`;
    else if(/ (Vandal|Wraith)$/.test(n))t='Usually an Invasion or event reward. Check Invasions on Today, or trade another player for it.';
    else if(craft)t='Craft it in the Foundry. Open it to see where the blueprint and each part come from.';
    else t='The wiki has how to get this one.'}
  return {text:t,craft,wiki}}
Object.assign(window.TF,{
  setOwned:(n,own,quiet)=>{setK('nown|'+n,!own);if(own&&!ownedItem(n))setK('build|'+n,true);tfNotify();if(!quiet)toast(own?`${n} marked as owned`:`${n} marked as not owned. Its mastery stays.`)},
  howToGet:n=>howToGet(n)});
/* "Not mastered" / "Clear rank": back to rank 0, with its own Undo (rank decreases don't go through the activity log) */
Object.assign(window.TF,{clearRank:n=>{const was=rankOf(n);if(!was)return;LOGMUTE++;try{setRank(n,0)}finally{LOGMUTE--}clearTimeout(RKT);tfNotify();
  toastAction(was>=maxRank(I[n])?`${n} marked not mastered`:`${n} rank cleared (was ${was})`,'Undo',()=>{LOGMUTE++;try{setRank(n,was)}finally{LOGMUTE--}tfNotify();toast(`${n} back to rank ${was}`)})}});
