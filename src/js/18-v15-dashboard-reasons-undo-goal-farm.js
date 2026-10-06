/* ---------- v15: dashboard, reasons, undo, goal → farm → task ---------- */
function toastAction(text,label,fn){if(window.TF_UI&&TF_UI.toast){TF_UI.toast(text,{label,fn});return}document.querySelectorAll('.toast').forEach(x=>x.remove());const d=document.createElement('div');d.className='toast act';d.setAttribute('role','status');
  const s=document.createElement('span');s.textContent=text;d.appendChild(s);const b=document.createElement('button');b.type='button';b.className='btn sm';b.textContent=label;b.onclick=()=>{d.remove();fn()};d.appendChild(b);document.body.appendChild(d);setTimeout(()=>d.remove(),7000)}
/* rank undo */
let UNDO=null;
function undoPush(n,prev){if(!UNDO||Date.now()-UNDO.t>1500)UNDO={t:0,list:[]};if(!UNDO.list.some(x=>x.n===n))UNDO.list.push({n,...prev});UNDO.t=Date.now();clearTimeout(UNDO.tm);
  const u=UNDO;UNDO.tm=setTimeout(()=>toastAction(u.list.length>1?`Changed ${u.list.length} ranks`:`${u.list[0].n} → rank ${rankOf(u.list[0].n)}`,'Undo',()=>{u.list.slice().reverse().forEach(x=>{if(x.rk==null)delete P.rk[x.n];else P.rk[x.n]=x.rk;if(on('m|'+x.n)!==!!x.m)setK('m|'+x.n,x.m?1:0)});saveProfile();updateMR();rerender();toast('Undone')}),200)}

/* player stage & item reasons */
function stage(){const mr=mrInfo(totalXP().total).mr;const nd=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length;return mr<6||nd<90?'Early game':mr<16||nd<250?'Mid game':'Late game'}
function whyItem(it){const r=[];const rk=rankOf(it.n);if(rk>0)r.push(`in progress, rank ${rk}/${maxRank(it)}`);
  if(it.bc)r.push(`Market blueprint, ${fmt(it.bc)} credits`);else if(it.bprel)r.push(it.v&&!(VAULT[it.n]&&VAULT[it.n].now)?'Prime, vaulted: trade for it':'Prime, relics farmable now');
  else if(it.bpd&&it.bpd.length)r.push('drops from '+String(it.bpd[0][0]).replace(/ · Rot.*$/,'').replace(/\s*\(.*\)$/,''));else if(it.dr&&it.dr.length)r.push('drops from '+String(it.dr[0][0]).replace(/\s*\(.*\)$/,''));
  else{const q=Q.find(q=>q.rw.some(x=>x.toLowerCase().startsWith(it.n.toLowerCase()+' ')||x===it.n));r.push(q?'quest reward: '+q.n:'vendor or event item')}
  if(it.mr)r.push('needs MR '+it.mr);if(it.t&&!rk)r.push(hrs(it.t)+' to build');if((P.goals||[]).includes(it.n))r.push('in your goals');return r.join(' · ')}
function easiest2(k){const cur=Math.max(mrInfo(totalXP().total).mr,1);
  return MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=Math.min(cur,30)).map(it=>{const gain=mxp(it)-itemXP(it.n);const prog=rankOf(it.n)>0,goal=(P.goals||[]).includes(it.n);return {it,gain,score:ease(it)*10-(prog?25:0)-(goal?15:0)}}).filter(x=>x.gain>0).sort((a,b)=>a.score-b.score||b.gain-a.gain).slice(0,k)}

/* next up */
function nextUp(){const out=[];const t=totalXP(),m=mrInfo(t.total);const g=P.prof&&P.prof.mr!=null?P.prof.mr:null;
  if(g!=null&&m.mr>g)out.push({s:100,t:`Take your ${m.mr>30?'Legendary '+(m.mr-30):'MR '+m.mr} test`,why:`You have the XP; in game you're still MR ${g}. Use the Mastery shrine in a Relay or your Orbiter.`});
  const now=Date.now();const ready=(P.foundry||[]).filter(f=>now>=f.t0+f.dur*1000);if(ready.length)out.push({s:90,t:`Claim ${ready.length} Foundry item${ready.length>1?'s':''}`,why:ready.slice(0,3).map(f=>f.n).join(', '),href:'#tenno',tt:'foundry'});
  for(const e of D.synd){if(!gateOK(e.gate)||!e.ranks.length)continue;const st=synState(e);const rr=rankRow(e,st.r);if(rr.max!=null&&st.s>=rr.max&&rankRow(e,st.r+1).t){out.push({s:80,t:`Rank up with ${e.n}`,why:`You have the standing for ${rankRow(e,st.r+1).t}.`,href:'#synd',task:['synd',e.n,'Rank up '+e.n]});break}}
  const goal=(P.goals||[]).find(n=>I[n]&&!on('build|'+n));if(goal){const k=stepKeys(goal);const d=k.filter(on).length;out.push({s:70,t:`Keep going on ${goal}`,why:`${d}/${k.length} steps done${mxChip(goal)?'':''} · ${whyItem(I[goal])}`,go:'item|'+goal,task:['item',goal,'Build '+goal]})}
  const nq=nextQuest();if(nq&&!qDone(nq.n))out.push({s:Q.indexOf(nq)<12?75:55,t:`Do the quest ${nq.n}`,why:nq.d?nq.d.slice(0,110)+(nq.d.length>110?'…':''):'Next in the story; unlocks new areas and gear.',q:nq.n,task:['quest',nq.n,'Do quest: '+nq.n]});
  const ez=easiest2(1)[0];if(ez)out.push({s:50,t:`Get ${ez.it.n} for +${fmt(ez.gain)} MR XP`,why:whyItem(ez.it),go:'item|'+ez.it.n,task:['item',ez.it.n,'Build '+ez.it.n]});
  const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const left2=dd.filter(c=>!ckDone(c)).length;if(left2)out.push({s:45,t:`Finish today's checklist (${left2} left)`,why:`Daily reset in ${left(lastDaily()+DAY-now)}.`,href:'#today'});
  return out.sort((a,b)=>b.s-a.s).slice(0,3)}
function nextCard(){const n=nextUp();
  return `<section class="panel cut stack nextup" style="gap:8px"><div class="row" style="justify-content:space-between"><h2>Next up</h2><span class="small muted">${esc(stage())}</span></div>
  ${n.map((x,i)=>`<div class="nu"><span class="nun" aria-hidden="true">${i+1}</span><div class="nut"><b>${x.go?`<a class="ln" href="#" data-go="${esc(x.go)}">${esc(x.t)}</a>`:x.q?`<a class="ln" href="#quests" data-q="${esc(x.q)}">${esc(x.t)}</a>`:x.href?`<a class="ln" href="${x.href}" ${x.tt?`data-ttab="${x.tt}"`:''}>${esc(x.t)}</a>`:esc(x.t)}</b><div class="small muted">${esc(x.why)}</div></div>${x.task?taskBtn(...x.task):''}</div>`).join('')||'<div class="small muted">You\'re all caught up. Pick something from Goals or the rank-up plan.</div>'}</section>`}
function easyCard(){const ez=easiest2(5);
  return `<section class="panel cut stack" style="gap:6px"><span class="eyebrow">Easiest Mastery XP for you</span>${ez.map(x=>`<div class="ezr">${art(x.it.n,'mini')}<div class="ezt"><a class="ln" href="#" data-go="item|${esc(x.it.n)}">${esc(x.it.n)}</a><div class="small muted">${esc(whyItem(x.it))}</div></div><span class="chip mxc">+${fmt(x.gain)}</span></div>`).join('')||'<span class="small muted">Everything you can use is mastered.</span>'}<a class="small ln" href="#mastery">Full rank-up plan</a></section>`}
function todayCard(){const now=Date.now();const dd=allChecks().filter(c=>c[0]==='d'&&gateOK(c[4])&&!(P.ckHide||[]).includes(c[1]));const done=dd.filter(ckDone).length;if(HOSTED&&!WS&&!WSerr)loadWS();
  const cyc=WS?[['Cetus',WS.cetusCycle,c=>c.isDay?'Day':'Night'],['Vallis',WS.vallisCycle,c=>c.isWarm?'Warm':'Cold'],['Cambion',WS.cambionCycle,c=>c.state==='vome'?'Vome':'Fass']].filter(x=>x[1]):[];
  return `<a class="panel cut stack navcard" href="#today" style="gap:6px"><div class="row" style="justify-content:space-between"><span class="eyebrow">Today</span><span class="small mono">${done}/${dd.length} daily done</span></div><div class="nextbar"><i style="width:${dd.length?done/dd.length*100:0}%"></i></div>
   <div class="small">Daily reset in <b>${left(lastDaily()+DAY-now)}</b> · weekly in <b>${left(lastWeekly()+7*DAY-now)}</b></div>
   ${cyc.length?`<div class="row small" style="gap:6px">${cyc.map(([n,c,f])=>`<span class="chip">${n}: ${esc(f(c))} · ${untilIso(c.expiry)}</span>`).join('')}</div>`:''}</a>`}
function goalsCard(){const g=(P.goals||[]).filter(n=>I[n]&&!on('build|'+n));
  return `<section class="panel cut stack" style="gap:6px"><div class="row" style="justify-content:space-between"><span class="eyebrow">Active goals</span><a class="small ln" href="#goals">Goals</a></div>${g.slice(0,4).map(n=>{const k=stepKeys(n);const d=k.filter(on).length;return `<div><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><a class="ln ell" href="#" data-go="item|${esc(n)}">${esc(n)}</a><span class="small mono">${d}/${k.length}</span></div><div class="nextbar"><i style="width:${d/k.length*100}%"></i></div></div>`}).join('')||'<span class="small muted">Choose <b>Track</b> on any item to plan it here.</span>'}</section>`}
function quickCard(){const now=Date.now();const fl=(P.foundry||[]).slice().sort((a,b)=>(a.t0+a.dur*1000)-(b.t0+b.dur*1000));const ready=fl.filter(f=>now>=f.t0+f.dur*1000).length;const u=SO.uid?unread():null;
  return `<div class="tiles t2"><a class="tile cut" href="#tenno" data-ttab="foundry"><span class="k">Foundry</span><span class="v num">${ready}<small>/${fl.length}</small></span><span class="x">${fl.length?(ready?'Ready to claim':'Next in '+hrs((fl[0].t0+fl[0].dur*1000-now)/1000)):'Nothing building'}</span></a>
   <a class="tile cut" href="#friends"><span class="k">Friends</span><span class="v num">${SO.uid?SO.friends.filter(f=>!f.pending).length:'—'}</span><span class="x">${u&&u.n?u.n+' new':SO.uid?'Message & invite':HOSTED?'Sign in to add':'On tennoform.com'}</span></a></div>`}
function progressCard(){const nd=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,all=ALLN.filter(n=>!isJ(n)).length,J=ALLN.filter(isJ),jd=J.filter(n=>on('n|'+n.id)).length;const qd=Q.filter(q=>on('q|'+q.n)).length;const nq=nextQuest();
  const syn=D.synd.filter(e=>gateOK(e.gate)&&e.ranks.length);const leftNodes=NODES.reduce((a,n)=>a+(on('n|'+n.id)?0:n.x),0);
  return `<div class="tiles t2"><a class="tile cut" href="#missions"><span class="k">Star chart</span><span class="v num">${nd}<small>/${all}</small></span><span class="tbar"><i style="width:${nd/all*100}%"></i></span><span class="x">+${fmt(leftNodes)} MR XP left · junctions ${jd}/${J.length}</span></a>
   <a class="tile cut" href="#quests"><span class="k">Quests</span><span class="v num">${qd}<small>/${Q.length}</small></span><span class="tbar"><i style="width:${qd/Q.length*100}%"></i></span><span class="x">${nq?'Next: '+esc(nq.n):'All done'}</span></a>
   <a class="tile cut" href="#ranks" data-rkcat="Intrinsics"><span class="k">Intrinsics</span><span class="v num">${fmt(catXP('rail')+catXP('drift'))}</span><span class="x">1,500 MR XP per rank</span></a>
   <a class="tile cut" href="#synd"><span class="k">Syndicates</span><span class="v num">${syn.filter(e=>synState(e).r>0).length}<small>/${syn.length}</small></span><span class="tbar"><i style="width:${syn.length?syn.filter(e=>synState(e).r>0).length/syn.length*100:0}%"></i></span><span class="x">Ranked up</span></a></div>`}
const HUB={next:['Next up',nextCard],breakdown:['Mastery breakdown',()=>bdCard()],today:['Today',todayCard],tasks:['My tasks',()=>taskPanel()],goals:['Active goals',goalsCard],easy:['Easiest Mastery XP',easyCard],progress:['Progress',progressCard],quick:['Foundry & friends',quickCard]};
const HUB_DEF={l:['easy','progress'],c:['next','breakdown'],r:['today','tasks','goals','quick']};
function hubLayout(){const h=P.hub||{};const z={l:[],c:[],r:[]};const seen=new Set();
  for(const k of ['l','c','r'])for(const id of ((h.z&&h.z[k])||HUB_DEF[k]))if(HUB[id]&&!seen.has(id)){z[k].push(id);seen.add(id)}
  for(const k of ['l','c','r'])for(const id of HUB_DEF[k])if(!seen.has(id)){z[k].push(id);seen.add(id)}
  return {z,hid:new Set(h.hid||[])}}
function hubGrid(){const {z,hid}=hubLayout();const ed=state.hubEdit;
  const card=(id,zone,i,len)=>{if(hid.has(id)&&!ed)return'';const [title,fn]=HUB[id];
    return ed?`<div class="hcard edit${hid.has(id)?' hidden':''}"><div class="hctl"><b>${esc(title)}</b><span class="row" style="gap:4px"><button type="button" class="btn sm" data-hmv="${id}|up" ${i?'':'disabled'} aria-label="Move ${esc(title)} up">↑</button><button type="button" class="btn sm" data-hmv="${id}|down" ${i<len-1?'':'disabled'} aria-label="Move ${esc(title)} down">↓</button><button type="button" class="btn sm" data-hmv="${id}|left" ${zone==='l'?'disabled':''} aria-label="Move ${esc(title)} left">←</button><button type="button" class="btn sm" data-hmv="${id}|right" ${zone==='r'?'disabled':''} aria-label="Move ${esc(title)} right">→</button><button type="button" class="btn sm" data-hmv="${id}|hide">${hid.has(id)?'Show':'Hide'}</button></span></div>${hid.has(id)?'':fn()}</div>`:`<div class="hcard">${fn()}</div>`};
  const col=k=>`<div class="h${k} stack">${z[k].map((id,i)=>card(id,k,i,z[k].length)).join('')}</div>`;
  return `<div class="row hubbar" style="justify-content:flex-end"><button type="button" class="btn sm" id="hubedit">${ed?'Done':'Customize'}</button>${ed?'<button type="button" class="btn sm" id="hubreset">Reset layout</button>':''}</div>
   <div class="hub3">${col('l')}${col('c')}${col('r')}</div>`}
function hubMove(id,dir){const {z,hid}=hubLayout();let zone=Object.keys(z).find(k=>z[k].includes(id));const a=z[zone];const i=a.indexOf(id);
  if(dir==='hide'){hid.has(id)?hid.delete(id):hid.add(id)}
  else if(dir==='up'&&i>0)[a[i-1],a[i]]=[a[i],a[i-1]];else if(dir==='down'&&i<a.length-1)[a[i+1],a[i]]=[a[i],a[i+1]];
  else if(dir==='left'||dir==='right'){const order=['l','c','r'];const nz=order[order.indexOf(zone)+(dir==='left'?-1:1)];if(nz){a.splice(i,1);z[nz].push(id)}}
  P.hub={z,hid:[...hid]};saveProfile();rerender()}

/* today: custom, pinned, hidden */
function allChecks(){return [...D.checks,...(P.ckCustom||[]).map(x=>[x.p,'cu|'+x.id,x.t,x.p==='d'?'Your own daily':'Your own weekly',''])]}
function ckTools(c){const pin=(P.ckPin||[]).includes(c[1]),hid=(P.ckHide||[]).includes(c[1]);const cu=c[1].startsWith('cu|');
  return `<span class="cktools"><button type="button" class="btn sm ${pin?'on':''}" data-ckpin="${esc(c[1])}" aria-label="${pin?'Unpin':'Pin'} ${esc(c[2])}" title="${pin?'Unpin':'Pin to top'}">${ic('pin',pin?'fill':'')}</button><button type="button" class="btn sm" data-ckhide="${esc(c[1])}" aria-label="${cu?'Delete':hid?'Show':'Hide'} ${esc(c[2])}" title="${cu?'Delete':hid?'Show again':'Hide'}">${cu?ic('close'):hid?'Show':'Hide'}</button></span>`}

/* tasks: notes, repeat, due */
const TKL={res:'Resource',item:'Build',relic:'Relic',quest:'Quest',mod:'Mod',arc:'Arcane',node:'Planet',synd:'Syndicate',fish:'Fish',ore:'Ore',lich:'Weapon',guide:'Guide',way:'Farm',note:'Note'};
function taskResets(){let ch=false;for(const x of P.tasks||[]){if(x.d&&x.rep&&x.dat&&x.dat<(x.rep==='d'?lastDaily():lastWeekly())){x.d=0;ch=true}}if(ch)saveProfile()}
function taskMeta(x){const due=x.due?new Date(x.due+'T23:59:59'):null;const over=due&&!x.d&&due<new Date();
  return `<span class="tmeta">${x.k&&x.k!=='note'?`<span class="chip">${esc(TKL[x.k]||x.k)}</span>`:''}${x.rep?`<span class="chip teal">${ic('repeat')} ${x.rep==='d'?'Daily':'Weekly'}</span>`:''}${due?`<span class="chip ${over?'bad':''}">${over?'Overdue · ':'Due '}${esc(fdate(x.due))}</span>`:''}${x.note?'<span class="chip" title="Has notes">✎</span>':''}</span>`}
function taskEditor(x){return `<div class="tedit"><label class="small" for="tn-${esc(x.id)}">Notes</label><textarea id="tn-${esc(x.id)}" data-tnote="${esc(x.id)}" maxlength="1000" placeholder="Anything to remember: node, squad, how many…">${esc(x.note||'')}</textarea>
  <div class="row"><label class="small" for="tr-${esc(x.id)}">Repeat</label><select id="tr-${esc(x.id)}" data-trep="${esc(x.id)}" style="width:auto"><option value="" ${!x.rep?'selected':''}>Never</option><option value="d" ${x.rep==='d'?'selected':''}>Every daily reset</option><option value="w" ${x.rep==='w'?'selected':''}>Every weekly reset</option></select>
  <label class="small" for="td-${esc(x.id)}">Due</label><input id="td-${esc(x.id)}" type="date" data-tdue="${esc(x.id)}" value="${esc(x.due||'')}" style="width:auto"></div></div>`}

/* syndicate consequences */
function synEffects(e){if(e.kind!=='faction')return'';const st=n=>((P.syn||{})[n]||{});const warn=[e.opp,e.enemy].filter(n=>(+st(n).r||0)>0);
  return `<div class="small syneff"><span class="muted">Per 1,000 earned:</span> <span style="color:var(--ok)">+500 ${esc(e.ally)}</span> · <span style="color:var(--warn)">−500 ${esc(e.opp)}</span> · <span style="color:var(--bad)">−1,000 ${esc(e.enemy)}</span>${warn.length?`<div class="warnline">Lowers your rank with ${warn.map(esc).join(' and ')}.</div>`:''}</div>`}

/* resources: stage-aware farms */
function planetOpen(p){if(['Earth','Mercury','Venus'].includes(p))return true;if(ALLN.some(n=>n.p===p&&!isJ(n)&&on('n|'+n.id)))return true;return ALLN.some(n=>isJ(n)&&new RegExp('To'+p.replace(/\W/g,'')+'Junction$').test(n.id)&&on('n|'+n.id))}

/* backup with preview */
function backupObj(){return {app:'tennoform',v:4,exported:new Date().toISOString(),c:C,p:P}}
function parseBackup(txt){txt=String(txt||'').trim();if(!txt)return null;let o=null;try{o=JSON.parse(txt)}catch(e){try{o=JSON.parse(decodeURIComponent(escape(atob(txt))))}catch(e2){return null}}if(!o||typeof o!=='object'||!o.c||typeof o.c!=='object')return null;return o}
function backupSummary(o){const p=o.p||{};const c=o.c||{};const tick=Object.keys(c).length;const mast=Object.keys(c).filter(k=>/^m\|/.test(k)&&c[k]).length;
  return `<div class="kv small"><span>Exported</span><span>${o.exported?esc(new Date(o.exported).toLocaleString()):'Unknown (older backup)'}</span><span>Name</span><span>${esc(p.tname||(p.prof&&p.prof.name)||'—')}</span><span>Items mastered</span><span>${fmt(mast)}</span><span>Ticks and checkmarks</span><span>${fmt(tick)}</span><span>Ranked items in progress</span><span>${fmt(Object.keys(p.rk||{}).length)}</span><span>Tasks · Goals</span><span>${fmt((p.tasks||[]).length)} · ${fmt((p.goals||[]).length)}</span></div>`}

/* ---- v15 events ---- */
document.addEventListener('click',e=>{const t=e.target.closest('#hubedit,#hubreset,[data-hmv],[data-ckpin],[data-ckhide],#ckadd,[data-tedit],#bkprev,#bkapply,#bkcancel');if(!t)return;
  if(t.id==='hubedit'){state.hubEdit=!state.hubEdit;rerender();return}
  if(t.id==='hubreset'){delete P.hub;saveProfile();rerender();return}
  if(t.dataset.hmv){const [id,d]=t.dataset.hmv.split('|');hubMove(id,d);return}
  if(t.dataset.ckpin){const k=t.dataset.ckpin;P.ckPin=P.ckPin||[];const i=P.ckPin.indexOf(k);i>=0?P.ckPin.splice(i,1):P.ckPin.push(k);saveProfile();rerender();return}
  if(t.dataset.ckhide){const k=t.dataset.ckhide;if(k.startsWith('cu|')){P.ckCustom=(P.ckCustom||[]).filter(x=>'cu|'+x.id!==k);saveProfile();rerender();return}
    P.ckHide=P.ckHide||[];const i=P.ckHide.indexOf(k);if(i>=0)P.ckHide.splice(i,1);else{P.ckHide.push(k);toastAction('Hidden from your checklist','Undo',()=>{P.ckHide=P.ckHide.filter(x=>x!==k);saveProfile();rerender()})}saveProfile();rerender();return}
  if(t.id==='ckadd'){const v=($('#cknew')&&$('#cknew').value||'').trim();if(!v)return;P.ckCustom=P.ckCustom||[];P.ckCustom.push({id:newId(),t:v.slice(0,80),p:($('#ckper')||{}).value==='w'?'w':'d'});saveProfile();rerender();return}
  if(t.dataset.tedit){state.tEdit=state.tEdit===t.dataset.tedit?null:t.dataset.tedit;rerender();return}
  if(t.id==='bkprev'){const o=parseBackup($('#bk-in')&&$('#bk-in').value);if(!o){toast('That isn\'t a Tennoform backup. Paste the whole code or file.');return}state.bkPrev=o;rerender();return}
  if(t.id==='bkcancel'){state.bkPrev=null;rerender();return}
  if(t.id==='bkapply'){const o=state.bkPrev;if(!o)return;const old={c:C,p:JSON.parse(JSON.stringify(P))};C=o.c;for(const k in P)delete P[k];Object.assign(P,o.p||{});lsSet('tenno-codex',C);pushAll();state.bkPrev=null;updateMR();rerender();
    toastAction('Backup restored','Undo',()=>{C=old.c;for(const k in P)delete P[k];Object.assign(P,old.p);lsSet('tenno-codex',C);pushAll();updateMR();rerender()});return}},true);
document.addEventListener('change',e=>{const t=e.target;const x=id=>(P.tasks||[]).find(y=>y.id===id);
  if(t.dataset.tnote){const y=x(t.dataset.tnote);if(y){y.note=t.value.slice(0,1000);saveProfile()}return}
  if(t.dataset.trep!==undefined){const y=x(t.dataset.trep);if(y){y.rep=t.value||undefined;if(!y.rep)delete y.rep;saveProfile();rerender()}return}
  if(t.dataset.tdue!==undefined){const y=x(t.dataset.tdue);if(y){if(t.value)y.due=t.value;else delete y.due;saveProfile();rerender()}return}
  if(t.id==='bkfile'&&t.files&&t.files[0]){t.files[0].text().then(txt=>{const o=parseBackup(txt);if(!o){toast('That file isn\'t a Tennoform backup.');return}state.bkPrev=o;rerender()})}});
document.addEventListener('keydown',e=>{const t=e.target;if(e.key==='Enter'&&t&&t.matches&&t.matches('[data-rkin]')){e.preventDefault();const all=[...document.querySelectorAll('[data-rkin]')];const i=all.indexOf(t);t.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>{const nx=[...document.querySelectorAll('[data-rkin]')][i+1];if(nx){nx.focus();nx.select()}},30)}
  if(e.key==='Enter'&&t&&t.id==='cknew'){e.preventDefault();$('#ckadd')&&$('#ckadd').click()}});
function shopLi(n,q){const known=P.inv&&P.inv[n]!=null;const h=+((P.inv||{})[n]||0);const rem=Math.max(0,q-h);
  return `<li><span></span><span class="q">${L(n)} <span class="mono small">need ${fmt(q)} · have ${known?fmt(h):'?'}${known?(rem?` · <b>${fmt(rem)} left</b>`:' · <span style="color:var(--ok)">✓ enough</span>'):''}</span></span><span class="where">${farmFor(n)}${rem?' '+taskBtn('res',n,'Farm '+fmt(rem)+' '+n):''}</span></li>`}

