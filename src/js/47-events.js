/* ---------- events ---------- */
function syncRow(o){const row=o.closest('.step,.mod,.mitem,.qrow');if(row&&row.querySelector('input.ck')===o)row.classList.toggle('done',o.checked)}
async function copy(text,msg){try{await navigator.clipboard.writeText(text);toast(msg)}catch(e){const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();toast(ok?msg:'Copy blocked here. The whisper is: '+text)}}
document.addEventListener('change',e=>{const t=e.target;
  if(t.matches('input.ck[data-k]')){const k=t.dataset.k;setK(k,t.checked);document.querySelectorAll(`input.ck[data-k="${CSS.escape(k)}"]`).forEach(o=>{o.checked=t.checked;syncRow(o)});refresh();
    if(k.startsWith('q|')&&HASH()==='#quests'){const y=window.scrollY;render();window.scrollTo(0,y)}}
  if(t.id==='fsel'){state.frame=t.value;state.build=0;saveUI();render()}
  if(t.id==='msort'){state.mkSort=t.value;render()}
  if(t.id==='tgt'){state.target=+t.value;render()}
  if(t.id==='intr'||t.id==='adj'){P[t.id]=+t.value||0;saveProfile();updateMR();if(HASH()==='#tenno'){const y=window.scrollY;render();window.scrollTo(0,y)}}
  if(t.id==='wfid'){const id=findId(t.value);if(id)setWfid(id);else if(t.value.trim())toast(typeof idMiss==='function'?idMiss(t.value):'No 24-character account ID found in that text.')}
  if(t.id==='eelog'&&t.files&&t.files[0]){readLog(t.files[0])}
  if(t.dataset.othin){P.oth=P.oth||{};P.oth[t.dataset.othin]=Math.max(0,+t.value||0);saveProfile();updateMR();const y=scrollY;render();scrollTo(0,y);return}
  if(t.dataset.dw){const id=t.dataset.dw;P.dw=P.dw||{};if(t.checked)P.dw[id]=Date.now();else delete P.dw[id];logDW(id,t.checked);saveProfile();const y=scrollY;render();scrollTo(0,y);
    if(t.checked){const c=allChecks().find(x=>x[1]===id);const lg=logList()[0];toastAction((c?c[2]:'Done')+' ticked off','Undo',()=>{if(lg&&lg.key===id)logUndo(lg.id);else{delete P.dw[id];logDW(id,false);saveProfile();rerender()}})}return}
  if(t.dataset.synr||t.dataset.syns){const n=t.dataset.synr||t.dataset.syns;P.syn=P.syn||{};const cur=P.syn[n]||{};if(t.dataset.synr)cur.r=+t.value;else cur.s=+t.value||0;cur.sync=0;P.syn[n]=cur;saveProfile();const y=scrollY;render();scrollTo(0,y);return}
  const SEL2={scs:'scS',ckf:'ckF',fif:'fiF',fim:'fiM',syf:'syF',sys:'syS',gs:'gS',hf:'hF',qf:'qF',mtype:'misType',rsf:'rsF',fft:'ffT',ffc:'ffC',frf:'frF',mkf:'mkF',rks:'rkS'};
  if(SEL2[t.id]){state[SEL2[t.id]]=t.value;saveUI();const y=scrollY;render();scrollTo(0,y);return}
  if(t.matches('[data-rkin]')){const row=t.closest('.rk');const n=row.dataset.n;setRank(n,t.value);row.outerHTML=rkRow(I[n])}
  if(t.dataset.intrin){setIntr(t.dataset.intrin,t.value);const y=window.scrollY;render();window.scrollTo(0,y)}
  if(t.id==='rkf'){state.rkF=t.value;saveUI();render()}
  if(t.dataset.bo!==undefined&&t.matches('[data-bo]')){P.bo=P.bo||{};const v=t.value.trim();if(v==='')delete P.bo[t.dataset.bo];else P.bo[t.dataset.bo]=+v;saveProfile();updateMR();const y=window.scrollY;render();window.scrollTo(0,y)}
  if(t.id==='gmr'||t.id==='gxp'){P[t.id]=t.value===''?null:+t.value;if(t.id==='gmr'&&t.value!==''){P.prof=P.prof||{};P.prof.mr=+t.value}saveProfile();const y=scrollY;render();scrollTo(0,y);return}
  if(t.id==='tname'){P.tname=t.value.trim();saveProfile();render()}
  if(t.dataset.inv){P.inv=P.inv||{};const v=t.value.trim();if(v==='')delete P.inv[t.dataset.inv];else P.inv[t.dataset.inv]=+v;saveProfile()}});
document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('details.lazy')&&d.open){const b=d.querySelector(':scope > .lazybody, :scope > .sub');if(b&&!b.dataset.f){b.dataset.f=1;b.innerHTML=itemTree(d.dataset.tree,{note:d.dataset.note,depth:+d.dataset.depth||0});refresh()}}},true);
document.addEventListener('click',async e=>{
  if(e.target.id==='drawer'){setMenu(false);return}
  /* tapping a row's name never ticks it: only the checkbox completes things */
  const t=e.target.closest('#unlink,[data-scp],[data-ipip],[data-oth],#exhtml,#exjson,[data-goal],#syh,#gshort,#lggoogle,#lgin,#lgnew,#lgreset,#lgout,#acctbtn,#autosync,[data-rk],[data-intr],[data-rkcat],[data-qupto],#rkmaxall,#boreset,[data-go],[data-mtab],[data-ttab],[data-mk],[data-build],[data-frame],[data-pick],[data-cat],[data-planet],[data-q],[data-wh],[data-fstart],[data-fclaim],[data-fdel],#menu,#budget,#unv,#allhide,#mishide,#imp,#bk-copy,#bk-file,#bk-restore,#jump,#faddb,#openprof');
  if(!t)return;
  if(t.id==='menu'){setMenu(!$('#drawer').classList.contains('open'));return}
  if(t.id==='unlink'){P.wfid='';lsSet('tenno-acct','');saveProfile();render();return}
  if(t.dataset.scp!==undefined){e.preventDefault();state.scP=t.dataset.scp||null;state.scQ='';if(HASH()!=='#missions')GO('missions');else{render();scrollTo(0,0)}return}
  if(t.dataset.ipip){const [key,n,v]=t.dataset.ipip.split('|');setIntr(key+'|'+n,+v);const y=scrollY;render();scrollTo(0,y);return}
  if(t.dataset.oth){P.oth=P.oth||{};const k=t.dataset.oth;P.oth[k]=Math.max(0,(+P.oth[k]||0)+(+t.dataset.d));saveProfile();updateMR();const y=scrollY;render();scrollTo(0,y);return}
  if(t.id==='exhtml'){const nm=(P.tname||(P.prof&&P.prof.name)||'tenno').replace(/\W+/g,'-');saveFile('tennoform-report-'+nm+'.html',reportHTML(),'text/html');return}
  if(t.id==='exjson'){saveFile('tennoform-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(backupObj(),null,1),'application/json');return}
  if(t.dataset.goal){const n=t.dataset.goal;P.goals=P.goals||[];const i=P.goals.indexOf(n);if(i>=0)P.goals.splice(i,1);else P.goals.push(n);saveProfile();toast(i>=0?'Removed from Goals':'Added to Goals');const y=scrollY;render();scrollTo(0,y);return}
  if(t.id==='syh'){state.syH=!state.syH;saveUI();render();return}
  if(t.id==='gshort'){state.gShort=!state.gShort;render();return}
  if(t.id==='lggoogle'){signGoogle();return}
  if(t.id==='lgin'){signEmail(false);return}
  if(t.id==='lgnew'){signEmail(true);return}
  if(t.id==='lgreset'){resetPw();return}
  if(t.id==='lgout'){flushNow();FB&&FB.auth.signOut();toast('Signed out. Progress stays in this browser too.');return}
  if(t.dataset.rk){const row=t.closest('.rk');const n=row.dataset.n;const r=rankOf(n);setRank(n,t.dataset.rk==='max'?99:r+(+t.dataset.rk));row.outerHTML=rkRow(I[n]);return}
  if(t.dataset.intr){const [key,n]=t.dataset.intr.split('|');const v=+((P[key]||{})[n]||0);setIntr(t.dataset.intr,t.dataset.d==='max'?10:v+(+t.dataset.d));const y=window.scrollY;render();window.scrollTo(0,y);return}
  if(t.dataset.rkcat){e.preventDefault();state.rkCat=t.dataset.rkcat;state.rkQ='';saveUI();if(HASH()!=='#ranks')GO('ranks');else render();return}
  if(t.id==='rkmaxall'){if(!t.dataset.armed){const k=(state._rkList||[]).filter(n=>!on('m|'+n)).length;t.dataset.armed=1;t.textContent=`Mark ${k} item${k===1?'':'s'} mastered? Tap again`;t.classList.add('primary');setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.classList.remove('primary');t.textContent='Max all in this list…'}},5000);return}
    logBulk('Maxed '+(state._rkList||[]).filter(n=>!on('m|'+n)).length+' items on Ranks',()=>(state._rkList||[]).forEach(n=>{if(!on('m|'+n))setRank(n,99)}));render();toast('Marked '+(state._rkList||[]).length+' items mastered');return}
  if(t.id==='boreset'){P.bo={};saveProfile();render();toast('Using your Ranks page numbers again');return}
  if(t.dataset.qupto){const q=Q.find(x=>x.n===t.dataset.qupto);const idx=Q.indexOf(q);const arc=/^Arc/.test(q.g);logBulk('Quests up to '+q.n,()=>Q.forEach((o,i)=>{if(i<=idx&&(arc?/^Arc/.test(o.g):o.g===q.g))setK('q|'+o.n,1)}));const y=window.scrollY;render();window.scrollTo(0,y);toast('Marked quests up to '+q.n+' complete');return}
  if(t.dataset.go){e.preventDefault();go(t.dataset.go)}
  else if(t.dataset.mtab){e.preventDefault();state.mTab=t.dataset.mtab;saveUI();if(HASH()!=='#mastery')GO('mastery');else render()}
  else if(t.dataset.ttab){e.preventDefault();state.tTab=t.dataset.ttab;saveUI();if(HASH()!=='#tenno')GO('tenno');else render()}
  else if(t.dataset.mk){state.mkTab=t.dataset.mk;saveUI();render()}
  else if(t.dataset.build){state.build=+t.dataset.build;render()}
  else if(t.dataset.frame){e.preventDefault();state.frame=t.dataset.frame;state.build=0;saveUI();if(HASH()!=='#frames')GO('frames');else{render();window.scrollTo(0,0)}}
  else if(t.dataset.pick){state.farmSel=t.dataset.pick;if(HASH()!=='#farm')GO('farm');else{$('#fdet').innerHTML=detail(state.farmSel);document.querySelectorAll('#fres .hit').forEach(h=>h.classList.toggle('sel',h.dataset.pick===state.farmSel));refresh();$('#fdet').scrollIntoView({block:'start',behavior:'smooth'})}}
  else if(t.dataset.cat){state.allCat=t.dataset.cat;state.allQ='';saveUI();render()}
  else if(t.dataset.planet){const md=t.dataset.mode;logBulk('All of '+t.dataset.planet+(md==='sp'?' (Steel Path)':''),()=>ALLN.filter(n=>n.p===t.dataset.planet&&!isJ(n)).forEach(n=>setK(md+'|'+n.id,1)));state.scP=t.dataset.planet;const y=scrollY;render();scrollTo(0,y);toast('Marked '+t.dataset.planet+(md==='sp'?' Steel Path':'')+' complete')}
  else if(t.dataset.q){e.preventDefault();state.qFocus=t.dataset.q;if(HASH()!=='#quests')GO('quests');else focusQuest()}
  else if(t.dataset.wh){copy(t.dataset.wh,'Whisper copied. Paste it into in-game chat.')}
  else if(t.dataset.fstart){const n=t.dataset.fstart;const d=foundryFind(n)||43200;P.foundry=P.foundry||[];P.foundry.push({id:Date.now().toString(36),n,t0:Date.now(),dur:d});saveProfile();toast(n+' started · ready in '+hrs(d))}
  else if(t.id==='faddb'){const n=$('#fadd').value.trim();if(!n)return;const d=foundryFind(n);P.foundry=P.foundry||[];P.foundry.push({id:Date.now().toString(36),n,t0:Date.now(),dur:d||43200});saveProfile();render();toast(d?n+' added':'Added with a 12 h default timer')}
  else if(t.dataset.fclaim){const f=(P.foundry||[]).find(x=>x.id===t.dataset.fclaim);if(f){P.foundry=P.foundry.filter(x=>x!==f);if(I[f.n])setK('build|'+f.n,1);else{const m=Object.values(I).find(it=>it.parts.some(p=>p.sub&&it.n+' '+p.n===f.n));if(m)setK('built|'+m.n+'|'+f.n.slice(m.n.length+1),1)}saveProfile();render();toast(f.n+' claimed')}}
  else if(t.dataset.fdel){P.foundry=(P.foundry||[]).filter(x=>x.id!==t.dataset.fdel);saveProfile();render()}
  else if(t.id==='autosync'){t.disabled=true;t.textContent='Syncing…';await autoSync(false);if(t.isConnected){t.disabled=false;t.textContent='Sync automatically'}}
  else if(t.id==='openprof'){if(!/^[0-9a-f]{24}$/i.test(P.wfid||'')){e.preventDefault();toast('Enter your 24-character account ID first');$('#wfid')?.focus()}}
  else if(t.id==='budget'){state.budget=!state.budget;saveUI();render()}
  else if(t.id==='unv'){state.unvOnly=!state.unvOnly;t.classList.toggle('on');$('#fres').innerHTML=resultsHTML()}
  else if(t.id==='jump'){$('#fdet').scrollIntoView({block:'start',behavior:'smooth'})}
  else if(t.id==='allhide'){state.allHide=!state.allHide;saveUI();render()}
  else if(t.id==='mishide'){state.misHide=!state.misHide;saveUI();render()}
  else if(t.id==='imp'){const msg=importProfile($('#pj').value);render();toast(msg)}
  else if(t.id==='bk-copy'){copy(backupCode(),'Backup code copied')}
  else if(t.id==='bk-file'){saveFile('tennoform-backup-'+new Date().toISOString().slice(0,10)+'.txt',backupCode(),'text/plain');}
  else if(t.id==='bk-restore'){if(restore($('#bk-in').value)){render();toast('Progress restored')}else toast('That code didn\'t work. Paste the full backup code.')}});
function focusQuest(){if(!state.qFocus)return;const el=document.getElementById('q-'+state.qFocus.replace(/\W/g,''));state.qFocus=null;if(el){const d=el.closest('details');if(d)d.open=true;el.scrollIntoView({block:'center',behavior:'smooth'});el.style.background='var(--cyan-soft)';setTimeout(()=>el.style.background='',1600)}}
function liveSearch(id,key){const q=$(id);if(!q)return;q.addEventListener('input',()=>{state[key]=q.value;const pos=q.selectionStart;render();const n=$(id);n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}})}
function bindPage(r){
  if(r==='farm'){const q=$('#fq');q.addEventListener('input',()=>{state.farmQ=q.value;state.ffLim=60;$('#fres').innerHTML=resultsHTML()})}
  if(r==='resources')liveSearch('#rq','resQ');
  if(r==='missions')liveSearch('#scq','scQ');
  if(r==='ranks')liveSearch('#rkq','rkQ');
  if(r==='market')liveSearch('#mq','mkQ');
  if(r==='arsenal'&&state.aTab==='arc')liveSearch('#arq','arQ');
  if(r==='relics'&&state.rlTab==='add')liveSearch('#raq','raQ');
  if(r==='relics'&&state.rlTab==='ducats')liveSearch('#duq','duQ');
  if(r==='quests')setTimeout(focusQuest,50);
  if(r==='missions'&&state.planet){const p=state.planet;state.planet=null;setTimeout(()=>{const el=document.getElementById('pl-'+p.replace(/\W/g,''));if(el){el.open=true;el.scrollIntoView({block:'start',behavior:'smooth'})}},50)}
  if(r==='mastery'&&state.mTab==='all')liveSearch('#allq','allQ');
  if(r==='tenno'&&state.tTab==='inventory')liveSearch('#invq','invQ');
  if(r==='resources'&&state.resSel&&window.innerWidth<900&&!state.resQ)setTimeout(()=>$('#rdet')?.scrollIntoView({block:'start'}),30)}
liveResurgence();
function bootSync(){if(HOSTED&&P.wfid&&(!P.auto||Date.now()-new Date(P.auto)>6*3600e3))autoSync(true)}
setInterval(()=>{if(HASH()==='#tenno'&&state.tTab==='foundry'&&!(document.activeElement&&document.activeElement.matches('input,textarea')))render()},60000);
render();fbInit();
document.addEventListener('dragover',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d){e.preventDefault();d.classList.add('over')}});
document.addEventListener('dragleave',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d)d.classList.remove('over')});
document.addEventListener('drop',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d){e.preventDefault();d.classList.remove('over');const f=e.dataTransfer.files[0];if(f)readLog(f)}});
})();
