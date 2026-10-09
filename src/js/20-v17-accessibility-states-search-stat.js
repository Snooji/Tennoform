/* ---------- v17: accessibility, states, search, status, safety ---------- */
let FBST=HOSTED?'loading':'off';
const plain=h=>{const d=document.createElement('div');d.innerHTML=String(h||'');return (d.textContent||'').replace(/\s+/g,' ').trim()};
ck=function(k,cls,lab){return `<input type="checkbox" class="ck ${cls||''}" data-k="${esc(k)}" ${on(k)?'checked':''} aria-label="${esc(lab?'Done: '+lab:'Mark done')}">`};
step=function(k,label,body){return `<li class="step${on(k)?' done':''}">${ck(k,'',plain(label))}<div><div class="lbl">${label}</div>${body?`<div class="src">${body}</div>`:''}</div></li>`};
hit=function([n,t,l]){const s=state.farmSel===t+'|'+n;let st='';
  if(t==='item'&&I[n]){const it=I[n];st=(on('m|'+n)?'<span class="chip good">'+ic('check')+'Mastered</span>':mxChip(n))+(it.p?(it.v&&!(VAULT[n]&&VAULT[n].now)?'<span class="chip bad">Vaulted</span>':'<span class="chip ok">Farmable</span>'):'')}
  else if(t==='relic'&&REL[n])st=REL[n].v?'<span class="chip bad">Vaulted</span>':'<span class="chip ok">Farmable</span>';
  else if(t==='mod')st=on('mod|'+n)?'<span class="chip good">✓ Owned</span>':'';
  else if(t==='res'&&P.inv&&P.inv[n]!=null)st=`<span class="chip">Have ${fmt(P.inv[n])}</span>`;
  else if(t==='part')st=partNeeded(n)?'':'<span class="chip good">✓ Have</span>';
  return `<button type="button" class="hit ${s?'sel':''}" data-pick="${esc(t+'|'+n)}" aria-pressed="${s}"><span>${esc(n)}</span><span class="row hitst">${st}<span class="chip">${esc(l)}</span></span></button>`};
/* screen readers: announce rank-ups and page changes; pressed state on toggle buttons */
const SR=document.createElement('div');SR.className='sr-only';SR.setAttribute('aria-live','polite');SR.setAttribute('role','status');document.body.appendChild(SR);
function announce(t){SR.textContent='';setTimeout(()=>SR.textContent=t,50)}
let lastMR=null;const _updateMR=updateMR;updateMR=function(){_updateMR();const m=mrInfo(totalXP().total).mr;if(lastMR!=null&&m!==lastMR)announce('Mastery rank '+mrLabel(m));lastMR=m};
function a11yPass(){document.querySelectorAll('.seg .btn:not([role=tab])').forEach(b=>b.setAttribute('aria-pressed',b.classList.contains('on')?'true':'false'));
  document.querySelectorAll('.nextbar,.tbar,.rkbar,.prog .track').forEach(b=>b.setAttribute('aria-hidden','true'))}
/* skip link + keyboard shortcut */
(function(){const a=document.createElement('button');a.type='button';a.className='skip';a.textContent='Skip to content';a.onclick=()=>{const m=$('#app');m.setAttribute('tabindex','-1');m.focus()};document.body.insertBefore(a,document.body.firstChild)})();
document.addEventListener('keydown',e=>{if(e.key==='/'&&!(e.target&&e.target.matches&&e.target.matches('input,textarea,select'))&&!e.ctrlKey&&!e.metaKey){e.preventDefault();if(HASH()!=='#farm')GO('farm');setTimeout(()=>$('#fq')&&$('#fq').focus(),60)}});
/* page status: where data lives / how fresh it is */
const STATUS={today:'live',market:'snap',friends:'acct',feedback:'acct',tasks:'save',goals:'save',ranks:'save',missions:'save',quests:'save',synd:'save',relics:'save',arsenal:'save',world:'save',tenno:'save',mastery:'data',resources:'data',farm:'data',frames:'data'};
function statusChip(k){const s=STATUS[k];if(!s)return'';const where=synced?'Saved to your account':'Saved in this browser';
  const map={live:['live','● Live game data'],snap:['','Prices: daily snapshot '+D.meta.prices],acct:['',SO.uid?'Signed in':'Needs sign-in'],save:[synced?'live':'',where],data:['','Game data '+D.meta.built]};const [c,t]=map[s];return `<span class="pstat ${c}">${esc(t)}</span>`}
function afterRender(key,nav){a11yPass();const ey=document.querySelector('#app .head .eyebrow');if(ey&&!ey.querySelector('.pstat'))ey.insertAdjacentHTML('beforeend',statusChip(key));
  /* the same title as the page's own address (build/pages.json), which is what search results show */
  document.title=(self.TF_PAGES&&TF_PAGES[key])||(PL[key]||key)+' · Tennoform';if(nav){const h=document.querySelector('#app h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}}
window.addEventListener('hashchange',()=>setTimeout(()=>afterRender((HASH()||'#home').slice(1),true),0));
/* menu focus handling */
$('#hamb')&&$('#hamb').addEventListener('click',()=>setTimeout(()=>{if($('#drawer').classList.contains('open')){const a=$('#sheet a');a&&a.focus()}},30));
/* block & report */
function blocked(uid){return (P.block||[]).includes(uid)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-fblock],[data-freport]');if(!t)return;
  if(t.dataset.fblock){const uid=t.dataset.fblock;if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Tap to confirm';return}
    P.block=P.block||[];if(!P.block.includes(uid))P.block.push(uid);saveProfile();FB&&FB.fs.collection('users').doc(SO.uid).collection('friends').doc(uid).delete().catch(()=>{});
    SO.inbox.filter(m=>m.from===uid&&m.type==='friend').forEach(m=>FB.fs.collection('inbox').doc(SO.uid).collection('msgs').doc(m.id).delete().catch(()=>{}));state.chat=null;rerender();toast('Blocked. They can\'t message you or send requests.');return}
  if(t.dataset.freport){const [uid,name,code]=t.dataset.freport.split('|');state.fbPrefill=`Report: ${name} (friend code ${code||'?'}, id ${uid}).\nWhat happened: `;state.fbKind='other';state.fbFrom='friends';GO('feedback')}});

