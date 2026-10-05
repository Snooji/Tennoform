/* ---------- storage ---------- */
let C={},P={rk:{},other:0,intr:0,mr:null,name:'',at:'',adj:0,wfid:'',prof:null,mc:{},inv:{},foundry:[]};
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
C=lsGet('tenno-codex',{})||{};Object.assign(P,lsGet('tenno-profile',{})||{});
if(!P.wfid)P.wfid=lsGet('tenno-acct','')||'';
const kenc=k=>k.replace(/[.\/\[\]#$]/g,'_');
const on=k=>!!C[kenc(k)];
let docRef=null,profRef=null,pending={},timer=null,ptimer=null,synced=false,acct=null,FB=null;
const SAVE_MS=600;
function setK(k,v){const e=kenc(k);if(v)C[e]=1;else delete C[e];lsSet('tenno-codex',C);
  if(docRef){pending[e]=v?1:0;clearTimeout(timer);timer=setTimeout(flush,SAVE_MS)}updateMR()}
async function flush(){if(!docRef)return;const p=pending;pending={};if(!Object.keys(p).length)return;
  try{await docRef.update({c:p})}catch(e){try{await docRef.set({c:C})}catch(e2){Object.assign(pending,p);saveFail();clearTimeout(timer);timer=setTimeout(flush,5000)}}}
function saveProfile(){P.edited=new Date().toISOString();if(typeof schedulePublic==='function')schedulePublic();lsSet('tenno-profile',P);clearTimeout(ptimer);ptimer=setTimeout(()=>{if(profRef)Promise.resolve(profRef.set(JSON.parse(JSON.stringify(P)))).catch(saveFail)},SAVE_MS)}
async function pushAll(){clearTimeout(timer);pending={};if(docRef){try{await docRef.set({c:C})}catch(e){}}saveProfile()}
async function attach(dr,pr,info){docRef=dr;profRef=pr;
  const [snap,ps]=await Promise.all([docRef.get(),profRef.get()]);
  if(snap.exists){const rc=(snap.data()||{}).c||{};const localOnly=Object.keys(C).filter(k=>!(k in rc));
    const m={...C};for(const k in rc){if(rc[k])m[k]=1;else delete m[k]}C=m;lsSet('tenno-codex',C);
    if(localOnly.length){localOnly.forEach(k=>pending[k]=1);flush()}}
  else await docRef.set({c:C});
  if(ps.exists){const pd=ps.data()||{};if(!P.edited||(pd.edited&&pd.edited>=P.edited))Object.assign(P,pd);lsSet('tenno-profile',P)}
  else if(P.edited||P.at)profRef.set(JSON.parse(JSON.stringify(P))).catch(()=>{});
  synced=true;acct=info;if(!document.activeElement||!document.activeElement.matches('input,textarea'))render()}
function detach(){flushNow();docRef=null;profRef=null;synced=false;acct=null;render()}
function flushNow(){if(!docRef)return;clearTimeout(timer);flush();clearTimeout(ptimer);if(profRef)profRef.set(JSON.parse(JSON.stringify(P))).catch(()=>{})}
window.addEventListener('pagehide',flushNow);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushNow()});
(async()=>{try{
  if(!window.claude||!claude.use)return;
  const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);
  if(!db||!user)return;const id=await user.id();if(!id)return;
  await attach(db.doc('data/users/'+id+'/progress'),db.doc('data/users/'+id+'/profile'),{kind:'claude'});
}catch(e){}})();
