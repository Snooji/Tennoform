/* ---------- "Safe to sell?": what you'd lose by selling an item, shown on its page and in the sell dialog ---------- */
/* Built from the game data the site already has: crafting recipes (another weapon needs this one), vault status,
   where the item comes from, and your own mastery. Nothing here is fetched. */
let USEDIN=null;
function usedIn(n){if(!USEDIN){USEDIN={};for(const k in I)for(const p of I[k].parts||[])if(I[p.n]&&p.n!==k){const a=USEDIN[p.n]=USEDIN[p.n]||[];if(!a.includes(k))a.push(k)}}
  return USEDIN[n]||[]}
const FOUNDER=['Excalibur Prime','Lato Prime','Skana Prime'];
function limitedNote(n){const it=I[n];if(!it)return '';
  if(FOUNDER.includes(n))return 'Founders item: it can never be obtained again.';
  if(/\/VoidTrader\//.test(it.u)||/^Prisma /.test(n)||n==='Mara Detron')return "Only sold by Baro Ki'Teer, and he brings it back rarely.";
  if(/^Dex /.test(n))return 'Anniversary login reward: offered again only at a later anniversary.';
  if(/ (Wraith|Vandal)$/.test(n))return 'Limited: Wraith and Vandal weapons come from events and rare rewards, and can be gone for years.';
  if(it.p&&it.v&&!(VAULT[n]&&VAULT[n].now))return 'Vaulted: its relics no longer drop. Getting it again means trading or waiting for Prime Resurgence.';
  return ''}
/* each check: [level, text]; level 'stop' = you'd lose something, 'warn' = think first, 'ok' = fine */
function sellCheck(n){const base=n.replace(/ Set$/,'');const it=I[base];if(!it)return null;const out=[];
  for(const x of usedIn(base)){const done=on('m|'+x)||on('build|'+x);
    out.push([done?'ok':'stop',done?`Used to build ${x}, which you already have.`:`Needed to build ${x}. Keep it if you still want ${x}.`])}
  if(!on('m|'+base))out.push(['warn',n.endsWith(' Set')?`You haven't mastered ${base} yet. Build and level it first, or you'll need another set later for its mastery.`:`Not mastered yet. Level it to max rank first: you keep the mastery after selling.`]);
  const lim=limitedNote(base);if(lim)out.push(['warn',lim]);
  const level=out.some(c=>c[0]==='stop')?'stop':out.some(c=>c[0]==='warn')?'warn':'ok';
  return {level,checks:out}}
function sellCheckHTML(n){const s=sellCheck(n);if(!s)return '';
  const cls={stop:'bad',warn:'warn',ok:'ok'},lab={stop:'Keep it',warn:'Check first',ok:'Safe to sell'};
  return `<section class="obj"><div class="obj-h"><div class="title"><h3>Before you sell</h3><span class="chip ${cls[s.level]}">${lab[s.level]}</span></div></div>
  <div style="padding:10px 14px" class="small stack">${s.checks.length?s.checks.map(c=>`<div>${c[0]==='stop'?'<b>Keep it:</b> ':c[0]==='warn'?'<b>Note:</b> ':''}${esc(c[1])}</div>`).join(''):'<div>Nothing else needs it, it isn\'t limited, and you\'ve mastered it.</div>'}</div></section>`}
{const _d=detail;detail=function(sel){const h=_d(sel);return sel.startsWith('item|')&&h?h+sellCheckHTML(sel.slice(5)):h}}
{const _s=sellData;sellData=function(){const d=_s();if(!d)return d;const s=sellCheck(d.n);return {...d,safe:s?{level:s.level,checks:s.checks.map(c=>({level:c[0],text:c[1]}))}:null}}}
Object.assign(window.TF,{sellCheck:n=>sellCheck(n)});
