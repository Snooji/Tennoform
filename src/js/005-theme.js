/* ---------- theme: auto (follows the device), dark or light ---------- */
function themeGet(){try{const t=JSON.parse(localStorage.getItem('tf-theme')||'"auto"');return ['dark','light'].includes(t)?t:'auto'}catch(e){return 'auto'}}
function themeApply(t){if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme}
themeApply(themeGet());
function themeSw(){const t=themeGet();return `<span class="themesw" role="group" aria-label="Theme">${[['auto','Auto'],['dark','Dark'],['light','Light']].map(([k,l])=>`<button type="button" class="btn sm${t===k?' on':''}" data-theme-set="${k}" aria-pressed="${t===k}">${l}</button>`).join('')}</span>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-set]');if(!b)return;const t=b.dataset.themeSet;try{localStorage.setItem('tf-theme',JSON.stringify(t))}catch(x){}themeApply(t);rerender()});
