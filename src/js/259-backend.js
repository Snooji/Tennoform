/* ---------- backend (admins only): feedback inbox and donation log ---------- */
const DON={list:null,tried:false,err:false};
async function loadDonations(force){if(!FB||!SO.uid||!FBK.admin||(DON.tried&&!force))return;DON.tried=true;
  try{const s=await FB.fs.collection('donations').orderBy('at','desc').limit(500).get();DON.list=s.docs.map(d=>({id:d.id,...d.data()}));DON.err=false}catch(e){DON.err=true}
  if(location.hash==='#admin')liveRender()}
const _socialInit=socialInit;socialInit=async function(uid){const r=await _socialInit(uid);FBK.tried=false;DON.tried=false;loadFeedback().then(()=>{if(FBK.admin)loadDonations()});return r};
const money=n=>'$'+(Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
function donTotals(list){const now=new Date(),m0=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1);const t={plat:0,usd:0,platM:0,usdM:0,n:list.length,who:{}};
  for(const d of list){const usd=d.kind==='paypal'||d.kind==='other';t[usd?'usd':'plat']+=+d.amount||0;if(d.at>=m0)t[usd?'usdM':'platM']+=+d.amount||0;if(d.who){const k=d.who.trim();t.who[k]=(t.who[k]||0)+1}}return t}
function backend(){const head=`<div class="stack"><div class="head"><h1>Backend</h1></div>`;
  if(!HOSTED||!FB||!SO.uid)return head+`<div class="panel">Sign in with your admin account on tennoform.com to see this page.</div></div>`;
  if(!FBK.tried){loadFeedback().then(()=>{if(FBK.admin)loadDonations()});return head+`<div class="panel" role="status">Checking access…</div></div>`}
  if(!FBK.admin){const pd=/permission/.test(FBK.err||'');
    return head+`<div class="panel stack" style="gap:10px"><b>No admin access for this account yet.</b>
     <div class="small">Signed in as <b>${esc((acct&&(acct.email||acct.name))||'this account')}</b>. Your user ID:</div>
     <div class="row"><code class="uidbox">${esc(SO.uid)}</code><button type="button" class="btn sm" data-copy="${esc(SO.uid)}">Copy</button></div>
     <ol class="small" style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px">
      <li>In Firebase, open <b>Firestore Database → Data</b>.</li>
      <li>Open the <code>admins</code> collection. There must be a document whose ID is exactly the user ID above (no spaces).</li>
      <li>On the <b>Rules</b> tab, paste the rules from GitHub and tap <b>Publish</b>.</li>
      <li>Come back here and tap <b>Check again</b>.</li></ol>
     <div class="small muted">Firebase said: ${esc(pd?'permission denied (the ID isn\'t in admins, or the rules aren\'t published)':FBK.err||'unknown')}</div>
     <div><button type="button" class="btn primary" id="adrecheck">Check again</button></div></div></div>`}
  if(!DON.tried)loadDonations();const tab=state.adTab||'feedback';const fl=FBK.list||[],open=fl.filter(x=>!x.done).length;const dl=DON.list||[];const t=donTotals(dl);
  let h=head+`<div class="tiles"><div class="tile"><span class="k">Open feedback</span><span class="v num">${open}</span><span class="x">${fl.length} total</span></div>
   <div class="tile"><span class="k">PayPal this month</span><span class="v num">${money(t.usdM)}</span><span class="x">${money(t.usd)} all time</span></div>
   <div class="tile"><span class="k">Platinum this month</span><span class="v num">${fmt(t.platM)}p</span><span class="x">${fmt(t.plat)}p all time</span></div>
   <div class="tile"><span class="k">Donations logged</span><span class="v num">${t.n}</span><span class="x">${Object.keys(t.who).length} supporters</span></div></div>
   ${segBtns('adtab',tab,[['feedback','Feedback ('+open+')'],['donations','Donations']])}`;
  if(tab==='feedback')h+=fbInbox();
  else{const today=new Date().toISOString().slice(0,10);
    h+=`<section class="panel stack" style="gap:10px" aria-labelledby="don-h"><h2 id="don-h">Log a donation</h2>
     <div class="donform"><label class="small">Type<select id="dkind"><option value="paypal">PayPal ($)</option><option value="plat">Platinum (in game)</option><option value="other">Other ($)</option></select></label>
     <label class="small">Amount<input id="damt" type="number" inputmode="decimal" min="0" step="0.01" placeholder="5"></label>
     <label class="small">From<input id="dwho" type="text" maxlength="60" placeholder="Name or in-game name"></label>
     <label class="small">Date<input id="ddate" type="date" value="${today}"></label>
     <label class="small dnote">Note<input id="dnote" type="text" maxlength="200" placeholder="Optional, e.g. message they sent"></label></div>
     <div class="row"><button type="button" class="btn primary" id="dadd">Add donation</button><span class="small muted">Only admins can see this log. PayPal and in-game trades don't report to the site, so log each one here.</span></div></section>
     <section class="obj"><div class="obj-h"><div class="row" style="justify-content:space-between"><h3>Donations</h3><span class="row" style="gap:6px"><button type="button" class="btn sm" id="dcsv">Export CSV</button><button type="button" class="btn sm" id="dreload">Refresh</button></span></div></div>
     ${DON.err?`<div class="empty">Couldn't load the log. Publish the latest Firestore rules (they add the donations collection), then tap Refresh.</div>`:DON.list==null?'<div class="empty" role="status">Loading…</div>':
       dl.length?`<div class="donlist">${dl.map(d=>`<div class="donrow"><span class="donamt">${d.kind==='plat'?fmt(d.amount)+'p':money(+d.amount||0)}</span><span class="dont"><b>${esc(d.who||'Anonymous')}</b><span class="small muted">${fdate(new Date(d.at).toISOString())} · ${d.kind==='plat'?'Platinum':d.kind==='paypal'?'PayPal':'Other'}${d.note?' · '+esc(d.note):''}</span></span><button type="button" class="btn sm" data-ddel="${esc(d.id)}" aria-label="Delete donation from ${esc(d.who||'Anonymous')}">${ic('close')}</button></div>`).join('')}</div>`:'<div class="empty">No donations logged yet.</div>'}</section>`}
  return h+'</div>'}
async function addDonation(){const amt=parseFloat(($('#damt')||{}).value);if(!(amt>0))return toast('Enter an amount');const kind=$('#dkind').value;const ds=$('#ddate').value;
  const d={kind,amount:Math.round(amt*100)/100,at:ds?Date.parse(ds+'T12:00:00'):Date.now(),by:SO.uid};const who=$('#dwho').value.trim(),note=$('#dnote').value.trim();if(who)d.who=who.slice(0,60);if(note)d.note=note.slice(0,200);
  try{const r=await FB.fs.collection('donations').add(d);DON.list=[{id:r.id,...d},...(DON.list||[])].sort((a,b)=>b.at-a.at);toast('Donation logged');rerender()}catch(e){toast("Couldn't save. Are the latest Firestore rules published?")}}
function donCSV(){const rows=[['date','type','amount','from','note']].concat((DON.list||[]).map(d=>[new Date(d.at).toISOString().slice(0,10),d.kind,d.amount,d.who||'',d.note||'']));
  const csv=rows.map(r=>r.map(v=>/[",\n]/.test(String(v))?'"'+String(v).replace(/"/g,'""')+'"':v).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='tennoform-donations.csv';document.body.appendChild(a);a.click();a.remove()}
document.addEventListener('click',e=>{if(e.target.closest('#adrecheck')){FBK.tried=false;loadFeedback().then(()=>{if(FBK.admin){DON.tried=false;loadDonations()}rerender()})}});
document.addEventListener('click',async e=>{const t=e.target.closest('[data-adtab],#dadd,#dreload,#dcsv,[data-ddel]');if(!t)return;
  if(t.dataset.adtab){state.adTab=t.dataset.adtab;rerender();return}
  if(t.id==='dadd'){t.disabled=true;await addDonation();t.disabled=false;return}
  if(t.id==='dreload'){loadDonations(true);return}
  if(t.id==='dcsv'){donCSV();return}
  if(t.dataset.ddel){if(!t.dataset.armed){t.dataset.armed=1;t.textContent='Delete?';setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.innerHTML=ic('close')}},4000);return}
    try{await FB.fs.collection('donations').doc(t.dataset.ddel).delete();DON.list=(DON.list||[]).filter(x=>x.id!==t.dataset.ddel);rerender();toast('Deleted')}catch(x){toast("Couldn't delete")}}});
