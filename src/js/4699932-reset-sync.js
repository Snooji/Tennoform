/* ---------- Reset sync: make Tennoform match the Warframe profile, choosing item by item ---------- */
/* A normal sync only adds and raises. A reset also lists what Tennoform has that the profile doesn't
   (ranks entered by hand, ticked nodes and quests), so players pick what goes and what stays. */
let RESET=false,RESET_T=0,RESET_P=null;
function progSnap(){const rk={};for(const it of MI){const r=rankOf(it.n);if(r)rk[it.n]=r}
  const ids=k=>new Set(ALLN.filter(x=>on(k+x.id)).map(x=>x.id));
  return {rk,n:ids('n|'),sp:ids('sp|'),q:new Set(Q.filter(q=>qDone(q.n)).map(q=>q.n))}}
/* what the profile alone says: import it into a blank account, read the result, then put everything back */
function profileOnly(txt){const sc=JSON.stringify(C),sp=JSON.stringify(P);const dr=docRef,pr=profRef;const f={ls:lsSet,sv:saveProfile,um:updateMR};let snap=null,msg='';
  const pre=lsGet('tf-presync',null);docRef=null;profRef=null;lsSet=function(){};saveProfile=function(){};updateMR=function(){};
  try{C={};P={rk:{},other:0,intr:0,mr:null,name:'',at:'',adj:0,wfid:'',prof:null,mc:{},inv:{},foundry:[]};LOGMUTE++;try{msg=importProfile0(txt)}finally{LOGMUTE--}snap=progSnap()}
  finally{C=JSON.parse(sc);P=JSON.parse(sp);docRef=dr;profRef=pr;lsSet=f.ls;saveProfile=f.sv;updateMR=f.um;lastMR=null;updateMR();
    try{if(pre)localStorage.setItem('tf-presync',JSON.stringify(pre));else localStorage.removeItem('tf-presync')}catch(e){}}
  return {msg,snap}}
function resetDiff(a,b){const out=[];const nn=id=>{const x=ALLN.find(y=>y.id===id);return x?`${x.n} (${x.p})`:id};
  for(const n of new Set([...Object.keys(a.rk),...Object.keys(b.rk)])){const x=a.rk[n]||0,y=b.rk[n]||0;if(x!==y)out.push({k:'rk|'+n,add:y>x,t:n,d:`rank ${x} → ${y}`,from:x,to:y})}
  for(const [set,kind,lab] of [['n','n|','Node'],['sp','sp|','Steel Path']])for(const id of new Set([...a[set],...b[set]])){const x=a[set].has(id),y=b[set].has(id);if(x!==y)out.push({k:kind+id,add:y,t:`${lab}: ${nn(id)}`,d:y?'completed':'not completed'})}
  for(const n of new Set([...a.q,...b.q])){const x=a.q.has(n),y=b.q.has(n);if(x!==y)out.push({k:'q|'+n,add:y,t:`Quest: ${n}`,d:y?'completed':'not completed'})}
  out.sort((p,q)=>p.t.localeCompare(q.t));return out}
function resetHTML(p){const rem=p.rows.filter(r=>!r.add),add=p.rows.filter(r=>r.add);
  const group=(title,hint,list,g)=>list.length?`<fieldset class="stack" style="gap:6px;border:0;padding:0;margin:0"><legend class="small"><b>${title} (${list.length})</b> <span class="muted">${hint}</span></legend>
    <div class="row small" style="gap:6px"><button type="button" class="btn sm" data-rsall="${g}">Select all</button><button type="button" class="btn sm" data-rsnone="${g}">Select none</button></div>
    <div class="stack" style="gap:2px;max-height:38vh;overflow:auto;padding-right:4px">${list.map(r=>`<label class="small row" style="gap:8px;align-items:center;min-height:32px"><input type="checkbox" data-rs="${esc(r.k)}" data-rsg="${g}" checked> <span style="flex:1">${esc(r.t)}</span><span class="muted num">${esc(r.d)}</span></label>`).join('')}</div></fieldset>`:'';
  const none=!p.rows.length;
  return `<div class="dlgbk" id="rsbk"><div class="dlg panel cut stack" role="dialog" aria-modal="true" aria-labelledby="rs-h" style="gap:12px;max-width:640px"><h2 id="rs-h" tabindex="-1">Reset sync</h2>
   ${none?`<p class="small" style="margin:0">${esc(/^(That|No |Make)/.test(p.msg||'')?p.msg:'Tennoform already matches this profile exactly. Nothing to reset.')}</p>`:`<p class="small muted" style="margin:0">Nothing has changed yet. Ticked lines are applied; untick anything you want to keep as it is now.</p>
   ${group('Removed or lowered','Tennoform has these, your Warframe profile doesn\'t.',rem,'rem')}
   ${group('Added or raised','From your Warframe profile.',add,'add')}
   <p class="small muted" style="margin:0">Goals, tasks, inventory, relics and builds aren't touched. You can undo this from Account &amp; sync.</p>`}
   <div class="row" style="justify-content:flex-end">${none?'':'<button type="button" class="btn primary" id="rsok">Apply selected</button>'}<button type="button" class="btn" id="rsno">${none?'Close':'Cancel'}</button></div></div></div>`}
function showReset(txt){const a=progSnap();const {msg,snap}=profileOnly(txt);RESET_P={txt,rows:snap?resetDiff(a,snap):[],msg,a};
  const el=$('#rsbk');if(el)el.remove();document.body.insertAdjacentHTML('beforeend',resetHTML(RESET_P));const h=$('#rs-h');if(h)h.focus()}
function closeReset(){const el=$('#rsbk');if(el)el.remove();RESET_P=null}
function applyReset(){const p=RESET_P;if(!p)return;const on1=new Set([...document.querySelectorAll('#rsbk [data-rs]:checked')].map(x=>x.dataset.rs));closeReset();
  const msg=_imp(p.txt);/* adds and raises everything (and saves the undo snapshot); then honour each choice */
  LOGMUTE++;try{for(const r of p.rows){const pick=on1.has(r.k);const target=r.add?(pick?null:'old'):(pick?'new':null);if(!target)continue;
      if(r.k.startsWith('rk|')){const n=r.k.slice(3),v=target==='new'?r.to:r.from;const it=I[n];if(!it)continue;const mx=maxRank(it);
        if(v>=mx){delete P.rk[n];if(!on('m|'+n))setK('m|'+n,1)}else{if(on('m|'+n))setK('m|'+n,0);if(v)P.rk[n]=v;else delete P.rk[n]}}
      else setK(r.k,target==='old'?!r.add:r.add)}}finally{LOGMUTE--}
  P.auto=new Date().toISOString();saveProfile();updateMR();render();tfNotify();
  const n=on1.size;toast(`Reset applied: ${n} change${n===1?'':'s'}. ${p.rows.length-n} kept as they were. Undo is in Account & sync.`)}
/* the next profile that comes in (one-tap or pasted) goes to the reset view instead of the normal preview */
{const _ip=importProfile;importProfile=function(txt){if(RESET&&Date.now()-RESET_T<15*60e3){RESET=false;DRY=false;showReset(txt);return 'Choose what to keep, then tap Apply.'}return _ip.apply(this,arguments)}}
function startReset(){RESET=true;RESET_T=Date.now();
  if(wfPlat().auto&&/^[0-9a-f]{24}$/i.test(P.wfid||'')){autoSync(false);return}
  state.tTab='account';saveUI();if(location.hash!=='#tenno')location.hash='tenno';else render();
  toast('Reset is ready: paste your profile data with the steps below, and you\'ll choose what to keep.');setTimeout(()=>{const b=$('#syncsteps');if(b)b.scrollIntoView({block:'center'})},80)}
document.addEventListener('click',e=>{const t=e.target.closest('#rsreset,#rsok,#rsno,#rsbk,[data-rsall],[data-rsnone]');if(!t)return;
  if(t.id==='rsreset'){e.preventDefault();startReset();return}
  if(t.id==='rsbk'&&e.target!==t)return;
  if(t.dataset.rsall||t.dataset.rsnone){const g=t.dataset.rsall||t.dataset.rsnone;document.querySelectorAll(`#rsbk [data-rsg="${g}"]`).forEach(x=>{x.checked=!!t.dataset.rsall});return}
  if(t.id==='rsok'){applyReset();return}
  closeReset()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#rsbk'))closeReset()});
Object.assign(window.TF,{resetSync:()=>startReset()});
