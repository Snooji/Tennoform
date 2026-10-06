/* ---------- bridge: Profile (tenno) for the React page. Most tabs keep their existing panels; Inventory is rebuilt. ---------- */
const TTABS=[['profile','Profile'],['breakdown','Mastery breakdown'],['account','Account & sync'],['foundry','Foundry'],['inventory','Inventory'],['helminth','Helminth'],['friends','Compare profiles'],['backup','Backup & export']];
function tennoData(){const tab=state.tTab||'profile';const t=totalXP(),m=mrInfo(t.total);
  const out={tab,tabs:TTABS.map(([value,label])=>({value,label})),name:P.tname||(P.prof&&P.prof.name)||'Your Tenno',synced:P.at?fdate(P.at):'',inGame:P.prof&&P.prof.mr!=null?mrLabel(P.prof.mr):'',
    mrLabel:mrLabel(m.mr),pct:m.pct,showSign:canAcct()&&!signedIn(),html:''};
  if(tab==='inventory'){const q=(state.invQ||'').toLowerCase().trim();const common=['Ferrite','Rubedo','Alloy Plate','Nano Spores','Polymer Bundle','Salvage','Plastids','Circuits','Cryotic','Oxium','Gallium','Morphics','Neural Sensors','Neurodes','Orokin Cell','Control Module','Argon Crystal','Tellurium','Nitain Extract','Kuva','Hexenon','Detonite Injector','Fieldron','Mutagen Mass'].filter(n=>RES[n]);
    const list=q?Object.keys(RES).filter(n=>n.toLowerCase().includes(q)):[...new Set([...common,...Object.keys(P.inv||{}).filter(n=>RES[n])])];
    out.q=state.invQ||'';out.total=list.length;out.inv=list.slice(0,120).map(n=>({n,have:P.inv&&P.inv[n]!=null?+P.inv[n]:null}))}
  else out.html=tab==='account'?accountTab():tab==='breakdown'?bdPanel()+breakdownTab():tab==='helminth'?helminthTab():tab==='foundry'?foundryTab():tab==='backup'?backupTab():tab==='friends'?friendsTab():profileTab();
  return out}
Object.assign(window.TF,{
  tenno:()=>tennoData(),
  tennoSet:o=>{if(o.tab!=null)state.tTab=o.tab;if(o.q!=null)state.invQ=o.q;saveUI();tfNotify()}
});
/* tab links from anywhere (e.g. "Full breakdown", "Foundry", "Sync your profile") */
document.addEventListener('click',e=>{const t=e.target.closest('[data-ttab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('tenno')))return;
  e.preventDefault();e.stopPropagation();state.tTab=t.dataset.ttab;saveUI();if(location.hash!=='#tenno')location.hash='tenno';else tfNotify()},true);
const _tennoRoute=routes.tenno;
routes.tenno=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('tenno')?'':_tennoRoute()};
