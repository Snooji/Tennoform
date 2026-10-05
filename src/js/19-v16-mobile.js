/* ---------- v16: mobile ---------- */
const PHONE=()=>window.innerWidth<700;
function bdCard(){if(!PHONE())return bdPanel();const t=totalXP(),m=mrInfo(t.total);const open=lsGet('tf-bdopen',false);
  return `<details class="bdwrap"${open?' open':''}><summary class="bdsum"><span class="ring" style="--p:${m.pct.toFixed(1)}"><span>${mrLabel(m.mr)}</span></span><span class="bdst"><b>Mastery breakdown</b><span class="small muted mono">${fmt(t.total)} XP · ${fmt(m.next-t.total)} to next rank</span></span><span class="bdchev" aria-hidden="true">▾</span></summary>${bdPanel()}</details>`}
document.addEventListener('toggle',e=>{const d=e.target;if(d.classList&&d.classList.contains('bdwrap'))lsSet('tf-bdopen',d.open);if(d.classList&&d.classList.contains('explore'))lsSet('tf-explore',d.open)},true);
new MutationObserver(()=>document.querySelectorAll('input[type=search]:not([enterkeyhint])').forEach(i=>i.setAttribute('enterkeyhint','search'))).observe(document.getElementById('app'),{childList:true});
let lastW=window.innerWidth;window.addEventListener('resize',()=>{const w=window.innerWidth;if((w<700)!==(lastW<700)&&!(document.activeElement&&document.activeElement.matches('input,textarea,select'))){lastW=w;rerender()}lastW=w});

