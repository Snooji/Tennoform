/* ---------- tenno (character) ---------- */
function tenno(){const tab=state.tTab;const tabs=[['profile','Profile'],['breakdown','Mastery breakdown'],['account','Account & sync'],['foundry','Foundry'],['inventory','Inventory'],['helminth','Helminth'],['friends','Compare profiles'],['backup','Backup & export']];
  let h=`<div class="stack"><div class="head"><div class="eyebrow">Tenno</div><h1>${esc(P.tname||(P.prof&&P.prof.name)||'Your Tenno')}</h1>${P.at?`<div class="small muted">Last synced ${fdate(P.at)}${P.prof&&P.prof.mr!=null?` · In-game MR ${mrLabel(P.prof.mr)}`:''}</div>`:''}</div>
  <div class="seg">${tabs.map(([k,l])=>`<button class="btn ${tab===k?'on':''}" data-ttab="${k}">${l}</button>`).join('')}</div>`;
  if(tab==='account')h+=accountTab();
  if(tab==='profile')h+=profileTab();
  if(tab==='breakdown')h+=breakdownTab();
  if(tab==='helminth')h+=helminthTab();
  if(tab==='foundry')h+=foundryTab();
  if(tab==='inventory')h+=inventoryTab();
  if(tab==='backup')h+=backupTab();
  if(tab==='friends')h+=friendsTab();
  return h+'</div>'}
function findId(text){text=String(text||'');const pri=[/Logged in[^\n(]*\(([0-9a-f]{24})\)/i,/AccountId[^0-9a-f]{0,12}([0-9a-f]{24})/i,/playerId=([0-9a-f]{24})/i,/accountId[":\s$oid{]*([0-9a-f]{24})/i];
  for(const r of pri){const m=text.match(r);if(m)return m[1].toLowerCase()}const all=text.match(/\b[0-9a-f]{24}\b/gi);return all&&all.length===1?all[0].toLowerCase():null}
async function readLog(f){try{const txt=await f.text();const id=findId(txt);if(id)setWfid(id,f.name);else toast('Couldn\'t find an account ID in '+f.name+'. Make sure it\'s EE.log from the Warframe folder.')}catch(e){toast('Couldn\'t read that file.')}}
function setWfid(id,how){P.wfid=id;lsSet('tenno-acct',id);saveProfile();render();toast('Found your account ID'+(how?' in '+how:'')+'. Syncing…');setTimeout(()=>autoSync(false),300)}
function accountTab(){const ok=/^[0-9a-f]{24}$/i.test(P.wfid||'');const px=window.TENNO_PROXY;
  return accountPanel()+`<div class="panel stack cut"><h2>Link your Warframe account</h2>
  ${ok?`<div class="row"><span class="chip good">Linked</span><span class="mono small">${esc(P.wfid)}</span><button class="btn sm" id="unlink">Change</button></div>`:`
  <div class="steps-v">
   <div class="sv"><span class="svn">1</span><div><b>PC players: pick your Warframe log file</b><div class="small muted">Tap the button, then in the file window paste <span class="mono sel">%localappdata%\\Warframe</span> into the address bar, press Enter and choose <b>EE.log</b>. The app reads your ID out of it. Nothing is uploaded.</div>
    <label class="btn primary filebtn" for="eelog">Choose EE.log</label><input id="eelog" type="file" accept=".log,.txt,text/plain" hidden>
    <div class="drop" id="drop">or drag EE.log here</div></div></div>
   <div class="sv"><span class="svn">2</span><div><b>Already have it?</b><div class="small muted">Paste your ID, a profile link, or any line that contains it. The app finds the 24-character ID by itself.</div>
    <input id="wfid" type="text" placeholder="Paste your ID or anything containing it" value="${esc(P.wfid||'')}" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
   <div class="sv"><span class="svn">3</span><div><b>Console or mobile only?</b><div class="small muted">Warframe only shows the ID in the PC log. If you've ever logged in on PC (cross-save), use that log. Otherwise skip linking and set your progress by hand on the Ranks, Star Chart and Quests pages.</div></div></div>
  </div>`}</div>
  <div class="panel stack cut"><h2>Sync</h2>
  <div class="row"><button class="btn primary" id="autosync" ${ok?'':'disabled'}>Sync automatically</button><span class="small muted" id="asres">${P.auto?'Last automatic sync '+fdate(P.auto):''}</span></div>
  ${HOSTED?(px?'<div class="small muted">Syncs every time you open the app.</div>':'<div class="small muted">If automatic sync can\'t reach Warframe, use the backup method below.</div>'):'<div class="small muted">Automatic sync works on the website version. Here, use the backup method below.</div>'}
  <details class="more" ${HOSTED?'':'open'}><summary>Backup method: copy and paste</summary><div class="stack" style="gap:8px;margin-top:6px">
  <div class="row"><a class="btn" id="openprof" ${ok?`href="https://api.warframe.com/cdn/getProfileViewingData.php?playerId=${esc(P.wfid)}" target="_blank" rel="noopener"`:'href="#" aria-disabled="true"'}>1 · Open my profile data ↗</a></div>
  <div class="small muted">2 · Select all on that page and copy. 3 · Paste here.</div>
  <textarea id="pj" placeholder='Paste your profile data here (starts with {"Results":…)'></textarea>
  <div class="row"><button class="btn primary" id="imp">Sync my progress</button></div></div></details>
</div>${syncInfo()}`}
function profileTab(){const p=P.prof;const t=totalXP(),m=mrInfo(t.total);
  const top=`<div class="panel stack cut"><h2>Tenno</h2><label class="small" for="tname">Your in-game name</label><input id="tname" type="text" value="${esc(P.tname||(p&&p.name)||'')}" placeholder="Shown on your hub" autocomplete="off">
  <div class="kv"><span>Mastery Rank (tracked)</span><span class="num">${m.mr>30?'L'+(m.mr-30):m.mr}</span><span>Mastery XP</span><span class="num">${fmt(t.total)}</span><span>Gear mastered</span><span class="num">${MI.filter(i=>rankOf(i.n)>=maxRank(i)).length}/${MI.length}</span><span>Quests completed</span><span class="num">${Q.filter(q=>on('q|'+q.n)).length}/${Q.length}</span><span>Nodes cleared</span><span class="num">${ALLN.filter(n=>on('n|'+n.id)).length}/${ALLN.length}</span><span>Steel Path nodes</span><span class="num">${ALLN.filter(n=>on('sp|'+n.id)).length}/${ALLN.length}</span></div>
  <div class="row"><button class="btn" data-ttab="breakdown">Adjust mastery breakdown</button><a class="btn" href="#ranks">Update ranks</a><button class="btn primary" id="exhtml">Export report</button></div></div>`;
  if(!p)return top+`<div class="panel empty cut">Sync your account to add career stats, loadout and syndicates here.<div style="margin-top:10px"><button class="btn" data-ttab="account">Go to sync</button></div></div>`;
  const kv=(k,v)=>v==null||v===''||v==='—'?'':`<span>${k}</span><span class="num">${v}</span>`;
  let h=top+`<div class="panel stack cut"><h2>Career</h2><div class="kv">${kv('In-game Mastery Rank',p.mr!=null?mrLabel(p.mr):'')}${kv('Account created',p.created?fdate(p.created):'')}${kv('Clan',esc(p.guild||''))}${kv('Time played',p.time?fmt(p.time/3600)+' h':'')}${kv('Missions completed',fmt(p.mcomp))}${kv('Missions failed',fmt(p.mfail))}${kv('Enemies killed',fmt(p.kills))}${kv('Melee kills',fmt(p.melee))}${kv('Deaths',fmt(p.deaths))}${kv('Revives',fmt(p.revives))}${kv('Credits earned',fmt(p.income))}${kv('Items picked up',fmt(p.pickups))}</div></div>`;
  if(p.intr)h+=`<div class="panel stack cut"><h2>Intrinsics</h2><div class="kv">${Object.entries(p.intr).map(([k,v])=>kv(esc(k),v)).join('')}</div></div>`;
  if(p.synd&&p.synd.length)h+=`<div class="panel stack cut"><h2>Syndicates</h2><div class="kv">${p.synd.map(([n,s,t])=>kv(esc(n)+(t!=null?` <span class="chip">Rank ${esc(t)}</span>`:''),fmt(s))).join('')}</div></div>`;
  if(p.loadout&&p.loadout.length)h+=`<div class="panel stack cut"><h2>Equipped</h2><div class="row">${p.loadout.map(n=>`<span class="chip teal">${L(n)}</span>`).join('')}</div></div>`;
  if(p.topw&&p.topw.length)h+=`<div class="panel stack cut"><h2>Most-used weapons</h2><div class="kv">${p.topw.map(([n,k])=>kv(L(n),fmt(k)+' kills')).join('')}</div></div>`;
  if(p.topa&&p.topa.length)h+=`<div class="panel stack cut"><h2>Most-cast abilities</h2><div class="kv">${p.topa.map(([n,k])=>kv(esc(n),fmt(k))).join('')}</div></div>`;
  return h}
function foundryFind(n){const it=I[n];if(it)return it.t||0;for(const m of Object.values(I)){const p=m.parts.find(p=>p.sub&&m.n+' '+p.n===n);if(p)return p.t||43200}return null}
function foundryTab(){const now=Date.now();const list=(P.foundry||[]).slice().sort((a,b)=>(a.t0+a.dur*1000)-(b.t0+b.dur*1000));
  return `<div class="panel stack cut"><h2>Foundry</h2><p class="small muted" style="margin:0">Warframe doesn't share your Foundry publicly, so add builds here when you start them. Build times fill in automatically.</p>
  <div class="row"><input id="fadd" type="search" list="fitems" placeholder="What did you start building?" style="flex:1 1 220px" autocomplete="off"><datalist id="fitems">${Object.keys(I).map(n=>`<option value="${esc(n)}">`).join('')}${Object.values(I).flatMap(it=>it.parts.filter(p=>p.sub).map(p=>`<option value="${esc(it.n+' '+p.n)}">`)).join('')}</datalist><button class="btn primary" id="faddb">Start</button></div>
  <div id="flist">${list.length?list.map(f=>{const end=f.t0+f.dur*1000;const left=end-now;return `<div class="ft"><div><div><b>${L(f.n)}</b></div><div class="small muted">${left<=0?'<span class="ready">Ready to claim</span>':'Ready in '+hrs(left/1000)+' · '+new Date(end).toLocaleString('en-US',{weekday:'short',hour:'numeric',minute:'2-digit'})}</div></div><div class="row"><button class="btn sm ${left<=0?'primary':''}" data-fclaim="${f.id}">${left<=0?'Claim':'Done'}</button><button class="btn sm" data-fdel="${f.id}" aria-label="Remove ${esc(f.n)}">✕</button></div></div>`}).join(''):'<div class="empty">Nothing building. Add something above, or tap "Start Foundry timer" on any craft.</div>'}</div></div>`}
function inventoryTab(){const q=state.invQ.toLowerCase();const common=['Ferrite','Rubedo','Alloy Plate','Nano Spores','Polymer Bundle','Salvage','Plastids','Circuits','Cryotic','Oxium','Gallium','Morphics','Neural Sensors','Neurodes','Orokin Cell','Control Module','Argon Crystal','Tellurium','Nitain Extract','Kuva','Hexenon','Detonite Injector','Fieldron','Mutagen Mass'].filter(n=>RES[n]);
  const list=q?Object.keys(RES).filter(n=>n.toLowerCase().includes(q)):[...new Set([...common,...Object.keys(P.inv||{}).filter(n=>RES[n])])];
  return `<div class="panel stack cut"><h2>Inventory</h2><p class="small muted" style="margin:0">Type what you have. Shopping lists across the app then show <span class="have ok">have</span> or <span class="have no">short</span> next to each material.</p>
  <input id="invq" type="search" placeholder="Find another material" value="${esc(state.invQ)}">
  <div class="inv">${list.slice(0,120).map(n=>{const id='inv-'+n.replace(/\W/g,'');return `<label for="${esc(id)}" class="small">${L(n)}</label><input id="${esc(id)}" type="number" inputmode="numeric" min="0" data-inv="${esc(n)}" value="${P.inv&&P.inv[n]!=null?esc(P.inv[n]):''}" placeholder="0">`}).join('')}</div></div>`}
function backupTab(){return `<div class="panel stack cut"><h2>Backup</h2>
  <p class="small" style="margin:0">${synced?(acct&&acct.kind==='fb'?'You\'re signed in, so progress saves to your account automatically and follows you to every device.':'Progress saves to your claude.ai account automatically.'):'Progress is saved in this browser only. Sign in (Account &amp; sync) to keep it on every device, or use a backup to move it.'} Backups are dated and restore everything, even after clearing your browser.</p>
  <div class="row"><button class="btn primary" id="exhtml">Export report (HTML)</button><button class="btn" id="exjson">Export data (JSON)</button></div><div class="small muted">The report lists your breakdown, every ranked item, star chart, quests, syndicates and raw data, so you can check it against the game.</div>
  <div class="row"><button class="btn" id="bk-copy">Copy backup code</button><button class="btn" id="bk-file">Save backup file</button></div>
  <label for="bk-in" class="small">Restore</label><textarea id="bk-in" placeholder="Paste a backup code or the contents of a backup file"></textarea><div class="row"><button type="button" class="btn" id="bkprev">Preview restore</button><label class="btn" for="bkfile">Open backup file</label><input id="bkfile" type="file" accept=".json,.txt,application/json,text/plain" hidden></div>
  ${state.bkPrev?`<div class="panel stack" style="border-color:var(--gold-dim)"><b>This backup contains</b>${backupSummary(state.bkPrev)}<div class="small">Restoring replaces the progress on this device${synced?' and in your account':''}. You can undo right after.</div><div class="row"><button type="button" class="btn primary" id="bkapply">Replace my progress</button><button type="button" class="btn" id="bkcancel">Cancel</button></div></div>`:''}</div>
  <div class="panel stack cut"><h2>Fine-tune MR</h2>
  <div class="row"><label class="small" for="intr" style="flex:1 1 200px">Total intrinsic ranks (1,500 XP each)</label><input id="intr" type="number" min="0" inputmode="numeric" value="${+P.intr||0}" style="width:120px"></div>
  <div class="row"><label class="small" for="adj" style="flex:1 1 200px">XP adjustment to match in-game</label><input id="adj" type="number" inputmode="numeric" value="${+P.adj||0}" style="width:120px"></div></div>`}

