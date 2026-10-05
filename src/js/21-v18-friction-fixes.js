/* ---------- v18: friction fixes ---------- */
const STARTERS=['Excalibur','Mag','Volt','Mk1-Braton','Mk1-Paris','Mk1-Strun','Braton','Lato','Mk1-Furis','Mk1-Kunai','Skana','Mk1-Bo','Mk1-Furax'].filter(n=>I[n]);
function quickStart(){return `<section class="panel cut stack qs" style="gap:10px;border-color:var(--gold-dim)"><h2>Quick start</h2>
 <p class="small" style="margin:0">Tell Tennoform where you are now; you can fill in details later. Ticking every item by hand is optional and can take a while with 800+ items.</p>
 <div class="qsgrid"><label class="small" for="qsmr">Your Mastery Rank in game</label><input id="qsmr" type="number" min="0" max="60" inputmode="numeric" placeholder="e.g. 8">
 <label class="small" for="qsxp">Total Mastery XP <span class="muted">(optional · Profile → Mastery in game)</span></label><input id="qsxp" type="number" min="0" inputmode="numeric" placeholder="e.g. 208697"></div>
 <fieldset class="qsf"><legend class="small">Starter gear you've already maxed <span class="muted">(optional)</span></legend><div class="gpick">${STARTERS.map(n=>`<label class="small"><input type="checkbox" data-qsitem="${esc(n)}"> ${esc(n)}</label>`).join('')}</div></fieldset>
 <div class="row"><button type="button" class="btn primary" id="qsgo">Save and show my dashboard</button><button type="button" class="btn" data-onb="manual">Skip, I'll track by hand</button></div>
 <div class="small muted">Your MR and XP set your in-game baseline: anything you tick later fills the gap first, so your total always matches the game.</div></section>`}
function moreRow(shown,total){return total>shown?`<div class="more-row" role="status"><span class="small muted">Showing ${fmt(shown)} of ${fmt(total)}</span><button type="button" class="btn" id="rkmore">Show ${fmt(Math.min(60,total-shown))} more</button><button type="button" class="btn sm" id="rkall">Show all</button></div>`:`<div class="more-row"><span class="small muted">${fmt(total)} item${total===1?'':'s'}</span></div>`}
function segKeys(e){const b=e.target.closest&&e.target.closest('.seg .btn');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const all=[...b.parentElement.querySelectorAll('.btn')];let i=all.indexOf(b);
  i=e.key==='Home'?0:e.key==='End'?all.length-1:i+(e.key==='ArrowRight'?1:-1);if(all[i]){e.preventDefault();all[i].focus();all[i].scrollIntoView({inline:'nearest',block:'nearest'})}}
document.addEventListener('keydown',segKeys);
function segActive(){document.querySelectorAll('#app .seg').forEach(s=>{const on=s.querySelector('.btn.on');if(on&&s.scrollWidth>s.clientWidth){const l=on.offsetLeft-s.clientWidth/2+on.offsetWidth/2;s.scrollLeft=Math.max(0,l)}s.classList.toggle('scrolls',s.scrollWidth>s.clientWidth+2)})}
document.addEventListener('click',e=>{const t=e.target.closest('#rkmore,#rkall,#qsgo,[data-tkreset],[data-qsopen]');if(!t)return;
  if(t.id==='rkmore'){state.rkLim=(state.rkLim||60)+60;rerender();return}
  if(t.id==='rkall'){state.rkLim=1e5;rerender();return}
  if(t.dataset.tkreset!==undefined){state.tkF='open';saveUI();rerender();return}
  if(t.dataset.qsopen!==undefined){state.qs=true;rerender();setTimeout(()=>$('#qsmr')&&$('#qsmr').focus(),30);return}
  if(t.id==='qsgo'){const mr=$('#qsmr').value.trim(),xp=$('#qsxp').value.trim();if(mr===''&&xp===''&&!document.querySelector('[data-qsitem]:checked')){toast('Enter your MR, or pick some starter gear');return}
    if(mr!==''){P.gmr=+mr;P.prof=P.prof||{};P.prof.mr=+mr}if(xp!=='')P.gxp=+xp;document.querySelectorAll('[data-qsitem]:checked').forEach(i=>setRank(i.dataset.qsitem,99));
    P.onb='quick';state.qs=false;saveProfile();updateMR();rerender();toast('Saved. Your dashboard now starts from your in-game rank.')}});
setInterval(()=>{if(location.hash==='#today'&&!document.hidden&&!(document.activeElement&&document.activeElement.matches('input,select,textarea'))){const y=scrollY;render();scrollTo(0,y)}},30000);

