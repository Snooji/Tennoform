/* ---------- your platform badge: picked by you, shown after your name everywhere ---------- */
/* Warframe ends cross-play names with one private-use character (U+E000 + platform); fonts/tf-platforms.woff2 draws it as a
   badge. Which number means which platform isn't documented, so players pick their own on the Home page. The pick replaces
   that last character in the name Tennoform shows and publishes (public card, chat, friends' lists). */
const BADGES=[['pc','PC'],['ps','PlayStation'],['xb','Xbox'],['sw','Switch'],['ios','iPhone / iPad'],['and','Android']];
const baseName=n=>String(n||'').replace(/[-]+$/u,'');
function withBadge(n){const b=P.badge;if(!b)return String(n||'');const base=baseName(n).slice(0,39);if(b==='none')return base;
  const i=BADGES.findIndex(x=>x[0]===b);return i<0?String(n||''):base+String.fromCharCode(0xE000+i)}
function badgeAuto(n){const c=String(n||'').charCodeAt(String(n||'').length-1);const i=c-0xE000;return i>=0&&i<BADGES.length?BADGES[i][0]:''}
{const _mn=myName;myName=function(){return withBadge(_mn())}}
{const _hd=homeData;homeData=function(){const d=_hd();const raw=d.name;if(raw)d.name=withBadge(raw);
  d.badge={cur:P.badge||'',auto:badgeAuto(raw),options:BADGES.map(([value,label])=>({value,label}))};return d}}
Object.assign(window.TF,{badgeSet:v=>{P.badge=v==='none'||BADGES.some(x=>x[0]===v)?v:'';saveProfile();
  if(typeof publishPublic==='function')publishPublic();tfNotify();toast(v==='none'?'Platform badge hidden':v?'Platform badge updated':'Using the badge from your Warframe name')}});
