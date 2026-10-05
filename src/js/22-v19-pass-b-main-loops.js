/* ---- v19: pass B (main loops) ---- */
/* next up: complete, context-aware actions */
function nuLabel(k){const p=k.split('|');if(p[0]==='bp')return 'Get the '+p[1]+' Blueprint';if(p[0]==='part')return 'Get '+p[2];if(p[0]==='built')return 'Build '+p[2];
  if(p[0]==='res')return (p[2]==='main'?'Collect ':'Collect for '+p[2]+': ')+p[3];if(p[0]==='have')return 'Have '+p[2];if(p[0]==='build')return 'Build '+p[1]+' in the Foundry';return k}
function nuSnoozed(id){const z=(P.nuSnz||{})[id];return z&&z>=lastDaily()}
function nuItems(){const out=[];const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;const now=Date.now();
  if(g!=null&&m.mr>g){const lab=m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr;out.push({id:'mr|'+m.mr,s:100,t:`Take your ${lab} test`,why:`You have the XP; in game you're still MR ${g}.`,href:'#mastery',
    pre:['Go to the Mastery shrine in any Relay, or the one in your Orbiter.','You can practise the test for free first.','If you fail, you can try again after 24 hours.'],
    done:()=>{const o={pm:P.prof.mr,g:P.gmr};P.prof.mr=m.mr;P.gmr=m.mr;return ()=>{P.prof.mr=o.pm;P.gmr=o.g}},doneL:'I passed'})}
  const ready=(P.foundry||[]).filter(f=>now>=f.t0+f.dur*1000);if(ready.length)out.push({id:'fd',s:90,t:`Claim ${ready.length} Foundry item${ready.length>1?'s':''}`,why:ready.slice(0,3).map(f=>f.n).join(', '),href:'#tenno',tt:'foundry',
    pre:ready.map(f=>f.n+' is ready'),done:()=>{const f0=P.foundry.slice(),c0=JSON.stringify(C);ready.forEach(f=>{P.foundry=P.foundry.filter(x=>x!==f);if(I[f.n])setK('build|'+f.n,1)});return ()=>{P.foundry=f0;const c1=JSON.parse(c0);Object.keys({...C,...c1}).forEach(e=>{if(!!C[e]!==!!c1[e])setK(e,c1[e]?1:0)})}},doneL:'Claimed'});
  for(const e of D.synd){if(!gateOK(e.gate)||!e.ranks.length)continue;const st=synState(e);const rr=rankRow(e,st.r),nx=rankRow(e,st.r+1);
    if(rr.max!=null&&st.s>=rr.max&&nx.t&&!nuSnoozed('sy|'+e.n)){const cost=[nx.cr?fmt(nx.cr)+' credits':'',...(nx.items||[]).map(([q,n])=>(q>1?fmt(q)+'× ':'')+n)].filter(Boolean);
      out.push({id:'sy|'+e.n,s:80,t:`Rank up with ${e.n}`,why:`You have the standing for ${nx.t}.`,href:'#synd',task:['synd',e.n,'Rank up '+e.n],
        pre:[cost.length?'Costs '+cost.join(', '):'No item cost',`Talk to ${e.n} in a Relay or its hub to rank up`],
        done:()=>{P.syn=P.syn||{};const o=P.syn[e.n]?{...P.syn[e.n]}:null;P.syn[e.n]={...(P.syn[e.n]||{}),r:st.r+1};return ()=>{if(o)P.syn[e.n]=o;else delete P.syn[e.n]}},doneL:'Ranked up'});break}}
  const goal=(P.goals||[]).find(n=>I[n]&&!on('build|'+n)&&!nuSnoozed('g|'+n));if(goal){const k=stepKeys(goal);const d=k.filter(on).length;const rest=k.filter(x=>!on(x));
    out.push({id:'g|'+goal,s:70,t:`Keep going on ${goal}`,why:`${d}/${k.length} steps done · ${whyItem(I[goal])}`,go:'item|'+goal,task:['item',goal,'Build '+goal],
      pre:rest.slice(0,5).map(nuLabel).concat(rest.length>5?[`…and ${rest.length-5} more steps`]:[]),
      done:()=>{setK('build|'+goal,1);return ()=>setK('build|'+goal,0)},doneL:'Built it'})}
  const nq=nextQuest();if(nq&&!qDone(nq.n)&&!nuSnoozed('q|'+nq.n)){const pq=qPrereqs(nq);const other=(nq.req||[]).filter(r=>!pq.some(p=>qClean(r)===p.n));
    out.push({id:'q|'+nq.n,s:Q.indexOf(nq)<12?75:55,t:`Do the quest ${nq.n}`,why:nq.d?nq.d.slice(0,110)+(nq.d.length>110?'…':''):'Next in the story; unlocks new areas and gear.',q:nq.n,task:['quest',nq.n,'Do quest: '+nq.n],
      pre:[...pq.map(p=>(qDone(p.n)?'✓ ':'✗ ')+p.n),...other.map(String)].concat(pq.length||other.length?[]:['No other quests needed first']),
      done:()=>{setK('q|'+nq.n,1);return ()=>setK('q|'+nq.n,0)},doneL:'Completed'})}
  const ez=easiest2(4).find(x=>!nuSnoozed('i|'+x.it.n));if(ez){const it=ez.it;const parts=(it.parts||[]).filter(p=>p.k==='p'||p.k==='i').map(p=>p.n).slice(0,5);
    out.push({id:'i|'+it.n,s:50,t:`Get ${it.n} for +${fmt(ez.gain)} MR XP`,why:whyItem(it),go:'item|'+it.n,task:['item',it.n,'Build '+it.n],
      pre:[parts.length?'Needs '+parts.join(', '):'No parts needed',`Rank it to ${maxRank(it)} to collect the XP`],
      done:()=>{const o={rk:P.rk[it.n],m:on('m|'+it.n)};setRank(it.n,99);return ()=>{if(o.rk==null)delete P.rk[it.n];else P.rk[it.n]=o.rk;if(on('m|'+it.n)!==!!o.m)setK('m|'+it.n,o.m?1:0)}},doneL:'Mastered'})}
  const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const left2=dd.filter(c=>!ckDone(c)).length;
  if(left2&&!nuSnoozed('ck'))out.push({id:'ck',s:45,t:`Finish today's checklist (${left2} left)`,why:`Daily reset in ${left(lastDaily()+DAY-now)}.`,href:'#today',pre:dd.filter(c=>!ckDone(c)).slice(0,5).map(c=>c[2])});
  return out.filter(x=>!nuSnoozed(x.id)).sort((a,b)=>b.s-a.s)}
function nextUp(){return nuItems().slice(0,3)}
let NU=[];
function nextCard(){NU=nextUp();const nz=Object.values(P.nuSnz||{}).filter(z=>z>=lastDaily()).length;
  const open=x=>x.go?`<a class="ln" href="#" data-go="${esc(x.go)}">${esc(x.t)}</a>`:x.q?`<a class="ln" href="#quests" data-q="${esc(x.q)}">${esc(x.t)}</a>`:x.href?`<a class="ln" href="${x.href}" ${x.tt?`data-ttab="${x.tt}"`:''}>${esc(x.t)}</a>`:esc(x.t);
  return `<section class="panel cut stack nextup" style="gap:8px" aria-labelledby="nu-h"><div class="row" style="justify-content:space-between"><h2 id="nu-h">Next up</h2><span class="small muted">${esc(stage())}</span></div>
  ${NU.map((x,i)=>`<div class="nu">${x.go&&x.go.startsWith('item|')&&art(x.go.slice(5),'mini')||`<span class="nun" aria-hidden="true">${i+1}</span>`}<div class="nut"><b>${open(x)}</b><div class="small muted">${esc(x.why)}</div>
   ${x.pre&&x.pre.length?`<details class="nupre"><summary class="small">Details</summary><ul class="small">${x.pre.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></details>`:''}
   <div class="nuact">${x.done?`<button type="button" class="btn sm" data-nudone="${i}">${ic('check')}${esc(x.doneL||'Done')}</button>`:''}${x.task?taskBtn(...x.task):''}<button type="button" class="btn sm ghost" data-nusnz="${i}" aria-label="Not now: ${esc(x.t)}">Not now</button></div></div></div>`).join('')||'<div class="small muted">You\'re all caught up. Pick something from Goals or the rank-up plan.</div>'}
  ${nz?`<button type="button" class="small linkbtn" id="nuunsnz">Show ${nz} snoozed suggestion${nz>1?'s':''}</button>`:''}</section>`}

/* customize: first-use hint, saved status, focus kept */
const _hubGrid=hubGrid;
hubGrid=function(){let g=_hubGrid();const hint=!P.hub&&!lsGet('tf-hubhint',0)&&!state.hubEdit;
  if(state.hubEdit)g=g.replace('<div class="hub3">',`<div class="callout small hubhelp" id="hubhelp">Move cards with the arrow buttons, or hide the ones you don't use. Changes save automatically. ${state.hubSaved?'<span class="chip ok" id="hubsaved">'+ic('check')+'Saved</span>':''}</div><div class="hub3">`);
  else if(hint)g=g.replace('<div class="hub3">',`<div class="callout small row hubhint" style="justify-content:space-between"><span>You can move or hide these cards with <b>Customize</b>, above.</span><button type="button" class="btn sm" id="hubhintx">Got it</button></div><div class="hub3">`);
  return g};
const _hubMove=hubMove;
hubMove=function(id,dir){state.hubSaved=1;_hubMove(id,dir);const {z,hid}=hubLayout();const zone=Object.keys(z).find(k=>z[k].includes(id));
  const name=HUB[id][0],col={l:'left',c:'middle',r:'right'}[zone];announce(dir==='hide'?(hid.has(id)?name+' hidden':name+' shown'):`${name} moved to ${col} column, position ${z[zone].indexOf(id)+1}. Saved.`);
  setTimeout(()=>{const b=document.querySelector(`[data-hmv="${id}|${dir}"]:not([disabled])`)||document.querySelector(`[data-hmv^="${id}|"]:not([disabled])`);if(b)b.focus()},20)};

/* sync & paste: preview before apply */
const _imp=importProfile;let DRY=false,PENDING=null;
function profSum(){const rk={};for(const it of MI){const r=rankOf(it.n);if(r)rk[it.n]=r}const t=totalXP();
  return {xp:t.total,mr:mrInfo(t.total).mr,rk,nodes:ALLN.filter(n=>on('n|'+n.id)).length,sp:ALLN.filter(n=>on('sp|'+n.id)).length,q:Q.filter(q=>qDone(q.n)).length,syn:JSON.stringify(P.syn||{}),intr:catXP('rail')+catXP('drift'),name:(P.prof&&P.prof.name)||P.tname||'',gmr:P.prof&&P.prof.mr}}
function dryImport(txt){const sc=JSON.stringify(C),sp=JSON.stringify(P);const dr=docRef,pr=profRef;const f={ls:lsSet,sv:saveProfile,um:updateMR};const a=profSum();let msg,b;
  docRef=null;profRef=null;lsSet=function(){};saveProfile=function(){};updateMR=function(){};
  try{msg=_imp(txt);b=profSum()}finally{C=JSON.parse(sc);P=JSON.parse(sp);docRef=dr;profRef=pr;lsSet=f.ls;saveProfile=f.sv;updateMR=f.um;lastMR=null;updateMR()}
  return {msg,a,b}}
function diffRows(a,b){const ch=[];for(const n of new Set([...Object.keys(a.rk),...Object.keys(b.rk)])){const x=a.rk[n]||0,y=b.rk[n]||0;if(x!==y)ch.push([n,x,y])}ch.sort((p,q)=>(q[2]-q[1])-(p[2]-p[1]));return ch}
function previewHTML(p){const {a,b,msg}=p.r;const ch=diffRows(a,b);const up=ch.filter(c=>c[2]>c[1]),dn=ch.filter(c=>c[2]<c[1]);const row=(k,x,y,f)=>x===y?'':`<span>${k}</span><span class="num">${f?f(x):x} → <b>${f?f(y):y}</b></span>`;
  const rows=[row('Mastery Rank',a.mr,b.mr),row('Total Mastery XP',a.xp,b.xp,fmt),row('Star chart nodes',a.nodes,b.nodes),row('Steel Path nodes',a.sp,b.sp),row('Quests done',a.q,b.q),row('Intrinsics XP',a.intr,b.intr,fmt),row('In-game MR',a.gmr==null?'—':a.gmr,b.gmr==null?'—':b.gmr),a.name!==b.name?`<span>Name</span><span>${esc(a.name||'—')} → <b>${esc(b.name||'—')}</b></span>`:'',a.syn!==b.syn?'<span>Syndicate ranks</span><span>updated</span>':''].join('');
  const none=!rows&&!ch.length;
  return `<div class="dlgbk" id="prevbk"><div class="dlg panel cut stack" role="dialog" aria-modal="true" aria-labelledby="prev-h" style="gap:10px"><h2 id="prev-h" tabindex="-1">${p.src==='sync'?'Review this sync':'Review this import'}</h2>
   ${none?`<p class="small" style="margin:0">${esc(/^(That|No |Make)/.test(msg||'')?msg:'Nothing would change. Your progress already matches this profile.')}</p>`:`<p class="small muted" style="margin:0">Nothing has changed yet. Here's what applying it would do.</p>
   ${rows?`<div class="kv small">${rows}</div>`:''}
   ${up.length?`<details class="more" ${up.length<=8?'open':''}><summary class="small">${up.length} item${up.length>1?'s':''} ranked up</summary><div class="kv small">${up.slice(0,60).map(([n,x,y])=>`<span>${esc(n)}</span><span class="num">${x} → ${y}</span>`).join('')}${up.length>60?`<span class="muted">…and ${up.length-60} more</span><span></span>`:''}</div></details>`:''}
   ${dn.length?`<details class="more"><summary class="small">${dn.length} lower than what you entered (kept at the higher rank)</summary><div class="kv small">${dn.slice(0,40).map(([n,x,y])=>`<span>${esc(n)}</span><span class="num">${x} → ${y}</span>`).join('')}</div></details>`:''}
   <p class="small muted" style="margin:0">You can undo a sync later from Account &amp; sync.</p>`}
   <div class="row" style="justify-content:flex-end">${none?'':'<button type="button" class="btn primary" id="prevok">Apply changes</button>'}<button type="button" class="btn" id="prevno">${none?'Close':'Cancel'}</button></div></div></div>`}
function showPreview(p){PENDING=p;closePreview(true);document.body.insertAdjacentHTML('beforeend',previewHTML(p));const h=$('#prev-h');if(h)h.focus()}
function closePreview(keep){const el=$('#prevbk');if(el)el.remove();if(!keep){PENDING=null;const b=$('#autosync')||$('#imp');if(b)b.focus()}}
importProfile=function(txt){if(!DRY)return _imp(txt);DRY=false;const src=DRY_SRC;const r=dryImport(txt);const auto=P.auto;showPreview({txt,src,r});
  if(src==='sync')setTimeout(()=>{P.auto=auto;saveProfile()},0);return 'Review the changes, then tap Apply.'};
let DRY_SRC='paste';
document.addEventListener('click',e=>{const t=e.target.closest('#autosync,#imp');if(t){DRY=true;DRY_SRC=t.id==='autosync'?'sync':'paste';setTimeout(()=>{DRY=false},15000)}},true);
document.addEventListener('click',e=>{const t=e.target.closest('#prevok,#prevno,#prevbk');if(!t)return;
  if(t.id==='prevbk'&&e.target!==t)return;
  if(t.id==='prevok'&&PENDING){const p=PENDING;closePreview(true);PENDING=null;DRY=false;const msg=_imp(p.txt);if(p.src==='sync')P.auto=new Date().toISOString();saveProfile();render();toast(msg);return}
  closePreview()});
document.addEventListener('keydown',e=>{const bk=$('#prevbk');if(!bk)return;if(e.key==='Escape'){closePreview();return}
  if(e.key==='Tab'){const f=[...bk.querySelectorAll('button,summary,[tabindex="-1"]')];const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});

/* live events: quick actions */
function ymd(t){const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function ltBtn(t,exp,lab){const has=(P.tasks||[]).some(x=>!x.d&&x.t===t);return `<button type="button" class="btn sm tb${has?' on':''}" data-livetask="${esc(t)}" data-ltexp="${esc(exp||'')}" aria-label="${has?'In your tasks':'Add to your tasks'}: ${esc(t)}">${has?ic('check')+'In tasks':ic('plus')+(lab||'Task')}</button>`}
function relBtn(era){const n=Object.keys(P.rel||{}).filter(r=>REL[r]&&REL[r].era===era&&relCount(r)>0).length;return `<button type="button" class="btn sm" data-fisrel="${esc(era)}" title="${n?'Open your '+era+' relics':'Find '+era+' relics to farm'}">${n?`My ${esc(era)} relics (${n})`:`Find ${esc(era)} relics`}</button>`}

/* tracked by you */
const TRK=`<span class="chip trk" title="Warframe doesn't share this, so it's tracked by you">Tracked by you</span>`;

/* data sources */
function srcLine(kind){const g=`game data v${esc(D.meta.wfcd||'')} · updated ${esc(D.meta.built)}`;
  return `<div class="small muted srcline">${kind==='relic'?`Drop chances from the official drop tables (${g}). Node picks are community favourites.`:kind==='res'?`Farm picks are community recommendations by mission type and level, not measured drop rates. Item data: ${g}.`:kind==='market'?`Prices: warframe.market 7-day averages, snapshot ${esc(D.meta.prices)}.`:`Source: ${g}. Drop chances from the official drop tables.`}</div>`}

/* counts & clear filters */
function countLine(shown,total,what,active,clearId){return `<div class="small muted countline" role="status">${shown===total?`${fmt(total)} ${what}`:`Showing ${fmt(shown)} of ${fmt(total)} ${what}`}${active?` · <button type="button" class="linkbtn small" id="${clearId}">Clear filters</button>`:''}</div>`}
const _saveUI=saveUI;saveUI=function(){_saveUI();lsSet('tenno-uiq',{resQ:state.resQ,farmQ:state.farmQ,mkQ:state.mkQ,mkSort:state.mkSort})};
let _uiqT=null;document.addEventListener('input',e=>{if(e.target.matches('#rq,#fq,#mq')){clearTimeout(_uiqT);_uiqT=setTimeout(()=>{saveUI();const c=$('.countline');if(c&&e.target.id==='rq'){const n=document.querySelectorAll('#rres > .hit').length;if(n)c.textContent=n+' materials match'}},400)}});

/* ---- v19 events ---- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-nudone],[data-nusnz],#nuunsnz,#hubtry,#hubhintx,[data-livetask],[data-fisrel],#rsclear,#mkclear,#rlclear,#ffclear');if(!t)return;
  if(t.dataset.nudone!=null){const x=NU[+t.dataset.nudone];if(!x||!x.done)return;const undo=x.done();saveProfile();updateMR();rerender();
    toastAction(x.t.replace(/^(Take your|Claim|Rank up with|Keep going on|Do the quest|Get|Finish)\s*/,'')+' marked done','Undo',()=>{undo();saveProfile();updateMR();rerender();toast('Undone')});
    setTimeout(()=>{const n=$('#nu-h');if(n){n.setAttribute('tabindex','-1');n.focus()}},30);return}
  if(t.dataset.nusnz!=null){const x=NU[+t.dataset.nusnz];if(!x)return;P.nuSnz=P.nuSnz||{};for(const k in P.nuSnz)if(P.nuSnz[k]<lastDaily())delete P.nuSnz[k];P.nuSnz[x.id]=Date.now();saveProfile();rerender();
    toastAction('Hidden until the daily reset','Undo',()=>{delete P.nuSnz[x.id];saveProfile();rerender()});setTimeout(()=>{const n=$('#nu-h');if(n){n.setAttribute('tabindex','-1');n.focus()}},30);return}
  if(t.id==='nuunsnz'){P.nuSnz={};saveProfile();rerender();return}
  if(t.id==='hubtry'){state.hubSaved=0;lsSet('tf-hubhint',1);state.hubEdit=true;rerender();setTimeout(()=>{const b=$('#hubedit');if(b)b.focus()},30);return}
  if(t.id==='hubhintx'){lsSet('tf-hubhint',1);rerender();return}
  if(t.dataset.livetask){const tx=t.dataset.livetask;if((P.tasks||[]).some(x=>!x.d&&x.t===tx)){toast('Already in your tasks');return}const ex=t.dataset.ltexp;addTask('note','',tx,ex?{due:ymd(ex)}:{});rerender();toast('Added to your tasks');return}
  if(t.dataset.fisrel){const era=t.dataset.fisrel;const n=Object.keys(P.rel||{}).some(r=>REL[r]&&REL[r].era===era&&relCount(r)>0);
    if(n){state.rlTab='mine';state.rlE=era;saveUI();location.hash='#relics'}else{state.farmQ=era;state.ffT='relic';state.unvOnly=true;saveUI();location.hash='#farm'}return}
  if(t.id==='rsclear'){state.resQ='';state.rsF='all';saveUI();rerender();return}
  if(t.id==='mkclear'){state.mkQ='';state.mkF='all';saveUI();rerender();return}
  if(t.id==='rlclear'){state.rlE='all';saveUI();rerender();return}
  if(t.id==='ffclear'){state.farmQ='';state.ffT='all';state.ffC='';state.unvOnly=false;saveUI();rerender();return}});
/* reset layout with undo */
document.addEventListener('click',e=>{const t=e.target.closest('#hubreset');if(!t)return;e.stopPropagation();const o=P.hub;delete P.hub;saveProfile();rerender();announce('Layout reset');
  toastAction('Home layout reset','Undo',()=>{P.hub=o;saveProfile();rerender()})},true);

