/* ---------- search: Ctrl+K, "/" or the header button; any page, item, relic, quest or planet ---------- */
const PAGE_ALIAS={today:'dailies daily reset fissures sortie nightwave baro arbitration',synd:'standing reputation rep sigil',market:'prices plat platinum trade sell',missions:'nodes planets junctions star chart',ranks:'mastery mr level',mastery:'rank up plan mr test',farm:'drop drops where farm',relics:'void relic refine radiant ducats',friends:'squad clan chat message group',tasks:'todo to-do checklist',goals:'wishlist track tracked',world:'fishing mining fish ore',arsenal:'builds mods loadout arcane lich sister',frames:'warframe frames helminth',tenno:'profile account sync backup foundry inventory',quests:'story quest',resources:'materials resources',donate:'support donate paypal',feedback:'bug idea',about:'privacy changelog new'};
let CMDX=null;
function cmdIndex(){if(CMDX)return CMDX;const x=[];const add=(n,g,act,extra)=>x.push({n,g,act,l:n.toLowerCase(),a:(extra||'').toLowerCase()});
  for(const [r,l] of PAGES)add(SUBL[r]||l,'Pages','#'+r,PAGE_ALIAS[r]);
  for(const n in I)add(n,'Gear','item|'+n,I[n].c);
  for(const n in RES)add(n,'Resources','res|'+n);
  for(const n in REL)add(n+' Relic','Relics','relic|'+n);
  for(const n in MODS)add(n,'Mods','mod|'+n);
  for(const n in ARC)add(n,'Arcanes','arc|'+n);
  for(const q of Q)add(q.n,'Quests','quest|'+q.n);
  for(const p of [...new Set(ALLN.map(n=>n.p).filter(Boolean))])add(p,'Planets','node|'+p);
  for(const e of D.synd)add(e.n,'Syndicates','#synd');
  return CMDX=x}
const CMDG=['Pages','Gear','Resources','Relics','Quests','Planets','Syndicates','Mods','Arcanes'];
function cmdFind(q){q=q.toLowerCase().trim().replace(/\s+/g,' ');if(!q)return [];const w=q.split(' ');const out=[];
  for(const e of cmdIndex()){const words=e.l.split(/[\s\-']+/);let s=null;
    if(e.l===q)s=0;else if(w.every(t=>words.includes(t)))s=1;else if(e.l.startsWith(q))s=1.5;else if(w.every(t=>words.some(x=>x.startsWith(t))))s=2;else if(e.a&&w.every(t=>e.a.split(' ').some(x=>x.startsWith(t))))s=2.5;else if(q.length>2&&e.l.includes(q))s=3;
    if(s!=null)out.push([s+CMDG.indexOf(e.g)*.01+e.n.length*.0001,e])}
  out.sort((a,b)=>a[0]-b[0]);const per={};return out.map(x=>x[1]).filter(e=>(per[e.g]=(per[e.g]||0)+1)<=(e.g==='Pages'?4:6)).slice(0,24)}
let CMDI=0,CMDR=[],CMDLAST=null;
function cmdOpen(){if(window.TF_UI&&TF_UI.openSearch){TF_UI.openSearch();return}if($('#cmdbk'))return;CMDLAST=document.activeElement;document.body.insertAdjacentHTML('beforeend',`<div class="dlgbk" id="cmdbk"><div class="cmd" role="dialog" aria-modal="true" aria-label="Search Tennoform">
  <div class="cmdin">${ic('search')}<input id="cmdq" type="text" role="combobox" aria-expanded="true" aria-controls="cmdres" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Search gear, relics, quests, planets, pages…" enterkeyhint="go"><button type="button" class="btn sm" data-cmdx>Esc</button></div>
  <div id="cmdres" role="listbox" aria-label="Results"></div><div class="cmdfoot small muted">↑ ↓ to move · Enter to open · Esc to close · <kbd>?</kbd> for shortcuts</div></div></div>`);
  cmdPaint();setTimeout(()=>$('#cmdq').focus(),10)}
function cmdClose(){const b=$('#cmdbk');if(b)b.remove();if(CMDLAST&&CMDLAST.focus&&document.contains(CMDLAST))CMDLAST.focus()}
function cmdPaint(){const q=$('#cmdq')?$('#cmdq').value:'';CMDR=cmdFind(q);CMDI=Math.min(CMDI,Math.max(0,CMDR.length-1));const box=$('#cmdres');if(!box)return;
  if(!q.trim()){box.innerHTML=`<div class="cmdhint small muted">Try “mag p”, “neuro”, “axi”, “vox”, “fissures” or “standing”.</div>`;$('#cmdq').removeAttribute('aria-activedescendant');return}
  if(!CMDR.length){box.innerHTML=`<div class="cmdhint small muted">Nothing matches “${esc(q)}”.</div>`;return}
  let h='',g=null;CMDR.forEach((e,i)=>{if(e.g!==g){if(g)h+='</div>';g=e.g;h+=`<div role="group" aria-label="${e.g}"><div class="cmdg small muted" aria-hidden="true">${e.g}</div>`}
    h+=`<div class="cmdo${i===CMDI?' on':''}" role="option" id="cmd-${i}" aria-selected="${i===CMDI}" data-cmdi="${i}">${e.g==='Gear'?art(e.n,'mini')||'<span class="mini"></span>':''}<span class="cmdn">${esc(e.n)}</span><span class="small muted">${e.g==='Gear'?esc(I[e.n].c):e.g==='Pages'?'Page':esc(e.g.replace(/s$/,''))}</span></div>`});
  box.innerHTML=h+'</div>';$('#cmdq').setAttribute('aria-activedescendant','cmd-'+CMDI);const on=$('#cmd-'+CMDI);on&&on.scrollIntoView({block:'nearest'})}
function cmdGo(e){cmdClose();if(!e)return;const a=e.act;
  if(a[0]==='#'){if(location.hash===a)render();else location.hash=a.slice(1);return}
  if(a.startsWith('quest|')){state.qFocus=a.slice(6);state.qF='all';if(location.hash==='#quests')render();else location.hash='quests';return}
  go(a)}
document.addEventListener('input',e=>{if(e.target.id==='cmdq'){CMDI=0;cmdPaint()}});
document.addEventListener('keydown',e=>{const typing=e.target&&e.target.matches&&e.target.matches('input,textarea,select,[contenteditable]');
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#cmdbk')?cmdClose():cmdOpen();return}
  if($('#cmdbk')){if(e.key==='Escape'){e.preventDefault();cmdClose()}else if(e.key==='ArrowDown'){e.preventDefault();CMDI=Math.min(CMDI+1,CMDR.length-1);cmdPaint()}else if(e.key==='ArrowUp'){e.preventDefault();CMDI=Math.max(CMDI-1,0);cmdPaint()}else if(e.key==='Enter'&&e.target.id==='cmdq'){e.preventDefault();cmdGo(CMDR[CMDI])}else if(e.key==='Tab'){e.preventDefault();$('#cmdq').focus()}return}
  if(typing||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='/'){e.preventDefault();e.stopImmediatePropagation();cmdOpen();return}
  if(e.key==='?'){e.preventDefault();keysOpen();return}
  if(/^[1-5]$/.test(e.key)&&!$('#keysbk')&&!$('#prevbk')){const p=PLACES[+e.key-1];location.hash=placeLast(p)}},true);
document.addEventListener('click',e=>{if(e.target.closest('#srchbtn')){cmdOpen();return}
  const o=e.target.closest('[data-cmdi]');if(o){cmdGo(CMDR[+o.dataset.cmdi]);return}
  if(e.target.closest('[data-cmdx]')||e.target.id==='cmdbk'){cmdClose();return}
  if(e.target.closest('[data-keysx]')||e.target.id==='keysbk'){keysClose()}});
/* shortcuts sheet */
function keysOpen(){if($('#keysbk'))return;CMDLAST=document.activeElement;const k=[['Ctrl K or /','Search everything'],['1 – 5','Home, Plan, Farm, Today, Squad'],['?','Show these shortcuts'],['Esc','Close a menu, sheet or dialog'],['← →','Move between category buttons'],['Enter (in a rank box)','Save and jump to the next item']];
  document.body.insertAdjacentHTML('beforeend',`<div class="dlgbk" id="keysbk"><div class="dlg panel stack" role="dialog" aria-modal="true" aria-labelledby="keys-h" style="gap:10px"><h2 id="keys-h" tabindex="-1">Keyboard shortcuts</h2><div class="kv small">${k.map(([a,b])=>`<span><kbd>${a}</kbd></span><span>${b}</span>`).join('')}</div><div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-keysx>Close</button></div></div></div>`);
  setTimeout(()=>$('#keys-h').focus(),10)}
function keysClose(){const b=$('#keysbk');if(b)b.remove();if(CMDLAST&&CMDLAST.focus&&document.contains(CMDLAST))CMDLAST.focus()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#keysbk'))keysClose()});
/* phones: hide the bottom bar while typing and keep the field in view */
document.addEventListener('focusin',e=>{if(window.innerWidth<900&&e.target.matches('input:not([type=checkbox]):not([type=radio]),textarea,select')){document.body.classList.add('typing');setTimeout(()=>{try{e.target.scrollIntoView({block:'center'})}catch(x){}},250)}});
document.addEventListener('focusout',()=>setTimeout(()=>{if(!(document.activeElement&&document.activeElement.matches('input:not([type=checkbox]),textarea,select')))document.body.classList.remove('typing')},50));
