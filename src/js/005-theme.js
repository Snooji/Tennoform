/* ---------- theme: a mode (auto follows the device, dark, light) and a style (Default, Foundry, Prime, or a faction: Grineer, Corpus, Entrati, Lotus, Infested) ---------- */
/* The .dark class drives every colour token; data-theme picks the style; data-accent (set by the React shell) picks the colour palette.
   Every style has a light and a dark version, and every palette works in every style. */
const THEME_STYLES=['default','foundry','prime','grineer','corpus','entrati','lotus','infested'];
function themeGet(){try{const t=JSON.parse(localStorage.getItem('tf-theme')||'"dark"');return t==='foundry'?'light':['dark','light','auto'].includes(t)?t:'dark'}catch(e){return 'dark'}}
function themeStyle(){try{const s=JSON.parse(localStorage.getItem('tf-style')||'null');if(THEME_STYLES.includes(s))return s;
  /* before styles were separate, Foundry was a theme of its own (a light one) */
  return JSON.parse(localStorage.getItem('tf-theme')||'""')==='foundry'?'foundry':'default'}catch(e){return 'default'}}
const THEME_BAR={default:['#100f0d','#f5f5f3'],foundry:['#0f1a24','#b4bfcb'],prime:['#07060a','#f4efe3'],grineer:['#15130e','#d9d2bf'],corpus:['#06111c','#eef3f7'],entrati:['#1a0d10','#efe3d0'],lotus:['#071417','#eef6f4'],infested:['#0d0a0c','#ece4dc']};
function themeApply(t,st){st=st||themeStyle();const r=document.documentElement;
  const dark=t==='dark'||(t==='auto'&&!(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches));
  r.classList.toggle('dark',dark);if(st==='default')delete r.dataset.theme;else r.dataset.theme=st;r.style.colorScheme=dark?'dark':'light';
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=THEME_BAR[st][dark?0:1]}
function themeSave(){if(typeof tfNotify==='function')tfNotify()}
function themeSet(t){try{localStorage.setItem('tf-theme',JSON.stringify(t));if(!localStorage.getItem('tf-style'))localStorage.setItem('tf-style',JSON.stringify(themeStyle()))}catch(x){}themeApply(t);themeSave()}
function themeStyleSet(s){if(!THEME_STYLES.includes(s))return;try{localStorage.setItem('tf-style',JSON.stringify(s));localStorage.setItem('tf-theme',JSON.stringify(themeGet()))}catch(x){}themeApply(themeGet(),s);themeSave()}
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(themeGet()==='auto')themeApply('auto')})}catch(e){}
themeApply(themeGet());
function themeSw(){const t=themeGet(),st=themeStyle();
  return `<span class="themesw" role="group" aria-label="Mode">${[['auto','Auto'],['dark','Dark'],['light','Light']].map(([k,l])=>`<button type="button" class="btn sm${t===k?' on':''}" data-theme-set="${k}" aria-pressed="${t===k}">${l}</button>`).join('')}</span>
  <span class="themesw" role="group" aria-label="Style">${[['default','Default'],['foundry','Foundry'],['prime','Prime'],['grineer','Grineer'],['corpus','Corpus'],['entrati','Entrati'],['lotus','Lotus'],['infested','Infested']].map(([k,l])=>`<button type="button" class="btn sm${st===k?' on':''}" data-style-set="${k}" aria-pressed="${st===k}">${l}</button>`).join('')}</span>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-set],[data-style-set]');if(!b)return;if(b.dataset.themeSet)themeSet(b.dataset.themeSet);else themeStyleSet(b.dataset.styleSet);rerender()});
