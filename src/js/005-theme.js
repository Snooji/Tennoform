/* ---------- theme: auto (follows the device), dark, light or Foundry (a light theme styled after the in-game Foundry) ---------- */
/* dark is the default; "auto" follows the device. The .dark class drives every colour token. */
function themeGet(){try{const t=JSON.parse(localStorage.getItem('tf-theme')||'"dark"');return ['dark','light','auto','foundry'].includes(t)?t:'dark'}catch(e){return 'dark'}}
function themeApply(t){const dark=t==='dark'||(t==='auto'&&!(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches));document.documentElement.classList.toggle('dark',dark);if(t==='foundry')document.documentElement.dataset.theme='foundry';else delete document.documentElement.dataset.theme;document.documentElement.style.colorScheme=dark?'dark':'light';
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=dark?'#100f0d':t==='foundry'?'#b4bfcb':'#f5f5f3'}
function themeSet(t){try{localStorage.setItem('tf-theme',JSON.stringify(t))}catch(x){}themeApply(t);if(typeof tfNotify==='function')tfNotify()}
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(themeGet()==='auto')themeApply('auto')})}catch(e){}
themeApply(themeGet());
function themeSw(){const t=themeGet();return `<span class="themesw" role="group" aria-label="Theme">${[['auto','Auto'],['dark','Dark'],['light','Light'],['foundry','Foundry']].map(([k,l])=>`<button type="button" class="btn sm${t===k?' on':''}" data-theme-set="${k}" aria-pressed="${t===k}">${l}</button>`).join('')}</span>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-set]');if(!b)return;themeSet(b.dataset.themeSet);rerender()});
