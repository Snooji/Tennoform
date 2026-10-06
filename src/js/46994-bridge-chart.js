/* ---------- bridge: Star chart for the React page ---------- */
const orbC=p=>(ORB[p]||'#6fd6e8,#1e3440').split(',');
function chartData(){const planets=[...new Set(ALLN.filter(n=>!isJ(n)).map(n=>n.p))].sort((a,b)=>{const ia=PORD.indexOf(a),ib=PORD.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b)});
  const sel=state.scP&&planets.includes(state.scP)?state.scP:'';const all=ALLN.filter(n=>!isJ(n));const J=ALLN.filter(isJ).sort((a,b)=>jLabel(a).localeCompare(jLabel(b)));
  const jrow=n=>({id:n.id,label:jLabel(n),from:(n.id.match(/^(\w+?)To/)||[])[1]||'',done:on('n|'+n.id),sp:on('sp|'+n.id)});
  if(!sel)return {sel:'',total:all.length,nd:all.filter(n=>on('n|'+n.id)).length,sd:all.filter(n=>on('sp|'+n.id)).length,jt:J.length,jd:J.filter(n=>on('n|'+n.id)).length,
    xp:catXP('chart')+catXP('sp'),xpMax:NODES.reduce((a,n)=>a+n.x,0)*2,
    planets:planets.map(p=>{const s=planetStats(p);return {name:p,colors:orbC(p),done:s.d,sp:s.s,total:s.ns.length}}),junctions:J.map(jrow),juncHtml:juncTasks()};
  const s=planetStats(sel);const tf=state.misType||'all',hide=!!state.misHide,q=(state.scQ||'').toLowerCase().trim();const srt=state.scS||'lv';
  let ns=s.ns.filter(n=>(tf==='all'||n.t===tf)&&(!hide||!on('n|'+n.id)||!on('sp|'+n.id))&&(!q||n.n.toLowerCase().includes(q)));
  ns.sort((a,b)=>srt==='name'?a.n.localeCompare(b.n):srt==='xp'?b.x-a.x:a.lv[0]-b.lv[0]);
  const rr=(D.regres[sel]||D.regres[sel==='Zariman'?'Zariman Ten Zero':sel]||[]);
  return {sel,colors:orbC(sel),total:s.ns.length,nd:s.d,sd:s.s,xd:s.xd,type:tf,types:[...new Set(s.ns.map(n=>n.t))].sort(),sort:srt,hide,q:state.scQ||'',
    resources:rr,hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='node'&&x.r===sel),
    nodes:ns.map(n=>({id:n.id,name:n.n,type:n.t,lv:n.lv[0]+'–'+n.lv[1],xp:n.x||0,ds:!!n.ds,runs:(P.mc&&P.mc[n.id])||0,done:on('n|'+n.id),sp:on('sp|'+n.id)})),
    junctions:ALLN.filter(n=>isJ(n)&&n.id.startsWith(sel)).map(jrow)}}
Object.assign(window.TF,{
  chart:()=>chartData(),
  chartSet:o=>{if(o.p!=null){state.scP=o.p||null;state.scQ=''}if(o.q!=null)state.scQ=o.q;if(o.type!=null)state.misType=o.type;if(o.sort!=null)state.scS=o.sort;if(o.hide!=null)state.misHide=o.hide;saveUI();tfNotify()},
  nodeTick:(key,v)=>{setK(key,v?1:0);tfNotify()},
  planetAll:(p,mode)=>{logBulk('All of '+p+(mode==='sp'?' (Steel Path)':''),()=>ALLN.filter(n=>n.p===p&&!isJ(n)).forEach(n=>setK(mode+'|'+n.id,1)));tfNotify();
    const e=logList()[0];toastAction('Marked '+p+(mode==='sp'?' Steel Path':'')+' complete','Undo',()=>{if(e&&e.k==='bulk')logUndo(e.id)})}
});
/* planet links from anywhere */
document.addEventListener('click',e=>{const t=e.target.closest('[data-scp]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('missions'))||t.closest('.tf-island'))return;
  e.preventDefault();e.stopPropagation();state.scP=t.dataset.scp||null;state.scQ='';saveUI();if(location.hash!=='#missions')location.hash='missions';else tfNotify()},true);
const _missionsRoute=routes.missions;
routes.missions=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('missions')?'':_missionsRoute()};
