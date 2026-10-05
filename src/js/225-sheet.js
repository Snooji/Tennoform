/* ---------- phone detail sheet: picking a result opens its detail over the list ---------- */
let SHEET=null;
const isPhone=()=>window.innerWidth<900;
function sheetOpen(sel,push){const el=$(sel);if(!el||!isPhone()||!el.innerHTML.trim())return;SHEET=sel;el.classList.add('msheet');el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Details');
  if(!el.querySelector(':scope > .msheet-bar'))el.insertAdjacentHTML('afterbegin','<div class="msheet-bar"><span class="msheet-grip" aria-hidden="true"></span><button type="button" class="btn sm" data-sheetx>Close</button></div>');
  document.body.classList.add('sheet-on');if(push)history.pushState({sheet:1},'');el.scrollTop=0;setTimeout(()=>{const b=el.querySelector('[data-sheetx]');b&&b.focus()},40)}
function sheetClose(fromPop){const el=SHEET&&$(SHEET);SHEET=null;document.body.classList.remove('sheet-on');if(el){el.classList.remove('msheet');el.removeAttribute('role');el.removeAttribute('aria-modal');const bar=el.querySelector(':scope > .msheet-bar');bar&&bar.remove()}
  if(!fromPop&&history.state&&history.state.sheet)history.back()}
function sheetRestore(){if(SHEET){const s=SHEET;SHEET=null;if($(s)&&$(s).innerHTML.trim())sheetOpen(s,false);else{document.body.classList.remove('sheet-on')}}}
document.addEventListener('click',e=>{if(e.target.closest('[data-sheetx]')){sheetClose(false);return}
  if(!isPhone())return;const p=e.target.closest('#fres [data-pick]');if(p){setTimeout(()=>sheetOpen('#fdet',true),60);return}
  const r=e.target.closest('#rres [data-go^="res|"]');if(r)setTimeout(()=>sheetOpen('#rdet',true),80)});
window.addEventListener('popstate',()=>{if(SHEET)sheetClose(true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&SHEET)sheetClose(false)});
window.addEventListener('hashchange',()=>{if(SHEET)sheetClose(true)});
document.addEventListener('click',e=>{if(e.target.closest('#mkmore')){state.mkLim=(state.mkLim||60)+60;rerender()}});
document.addEventListener('click',e=>{if(e.target.closest('#ffmore')){state.ffLim=(state.ffLim||60)+60;$('#fres').innerHTML=resultsHTML()}});
document.addEventListener('change',e=>{if(e.target.id==='fft'){state.ffC='';state.ffLim=60}if(e.target.id==='ffc')state.ffLim=60},true);
