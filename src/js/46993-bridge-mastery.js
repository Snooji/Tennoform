/* ---------- bridge: MR plan for the React page ---------- */
function gearRow(id,note){const it=I[id];if(!it)return null;return {n:id,img:IMG(id),mr:it.mr||0,rk:on('m|'+id)?0:(+P.rk[id]||0),xp:mxp(it),done:on('m|'+id),price:it.p?strip(priceChip(id+' Set')):'',note:note||''}}
function xpTabHTML(){const s=state.mTab;state.mTab='xp';let h='';try{h=mastery()}finally{state.mTab=s}const i=h.indexOf('</div>',h.indexOf('class="seg"'));return h.slice(i+6,h.length-6)}
function masteryData(){const tab=state.mTab||'path';const t=totalXP(),cur=mrInfo(t.total).mr;const out={tab,cur};
  if(tab==='path'){let target=+state.target||cur+1;if(target<=cur)target=cur+1;const need=Math.max(0,mrNeed(target)-t.total);const cap=Math.min(Math.max(cur,0),30);
    const cand=MI.filter(it=>!on('m|'+it.n)&&(it.mr||0)<=Math.max(cap,Math.min(target,30))).map(it=>({it,gain:mxp(it)-itemXP(it.n),e:ease(it)})).filter(x=>x.gain>0).sort((a,b)=>a.e-b.e||b.gain-a.gain||(a.it.mr||0)-(b.it.mr||0));
    let acc=0;const plan=[];for(const x of cand){if(acc>=need)break;plan.push(x);acc+=x.gain}
    const nodesLeft=NODES.filter(n=>!on('n|'+n.id)),spLeft=NODES.filter(n=>!on('sp|'+n.id));const nx=nodesLeft.reduce((a,n)=>a+n.x,0),sx=spLeft.reduce((a,n)=>a+n.x,0);const gearLeft=cand.reduce((a,x)=>a+x.gain,0);
    const targets=[];for(let m=cur+1;m<=Math.max(cur+6,40);m++)targets.push({value:String(m),label:(m>30?'Legendary '+(m-30):'MR '+m)+' · '+fmt(mrNeed(m))+' XP'});
    const by={};plan.forEach(x=>(by[x.e]=by[x.e]||[]).push(x));
    Object.assign(out,{target:String(target),targetLabel:mrLabel(target),targets,need,gearLeft,nx,sx,nodesLeft:nodesLeft.length,spLeft:spLeft.length,overflow:need>gearLeft+nx+sx,
      groups:Object.keys(by).sort().map(e=>({title:EASE[e],xp:by[e].reduce((a,x)=>a+x.gain,0),items:by[e].map(x=>gearRow(x.it.n,''))}))})}
  if(tab==='ladder'){out.ladder=[];for(let m=1;m<=40;m++){const gear=m<=30?MI.filter(i=>(i.mr||0)===m):[];const qs=Q.filter(q=>q.req.some(r=>r==='Mastery Rank '+m));
    out.ladder.push({m,label:m>30?'Legendary '+(m-30):'MR '+m,xp:mrNeed(m),reached:m<=cur,next:m===cur+1,trades:m<=30?m:0,cap:m<=30?16000+500*m:0,quests:qs.map(q=>q.n),gear:gear.map(g=>({n:g.n,done:on('m|'+g.n)}))})}}
  if(tab==='sheet'){const by={};M.weapons.forEach(w=>(by[w.mr]=by[w.mr]||[]).push(w));out.sheetXp=D.meta.sheetXp;out.groups=Object.keys(by).sort((a,b)=>a-b).map(mr=>({title:'Mastery '+mr,open:mr<=2,items:by[mr].map(w=>gearRow(w.id,w.slot)).filter(Boolean)}))}
  if(tab==='sframes')out.groups=[{title:'Easy Warframes',open:true,items:M.frames.map(f=>gearRow(f.id,f.src)).filter(Boolean)},{title:'Market companions',open:true,items:M.companions.map(f=>gearRow(f.id,'Market blueprint')).filter(Boolean)}];
  if(tab==='craft'){const by={};M.craft.forEach(x=>(by[x.mr]=by[x.mr]||[]).push(x));
    out.craft=Object.keys(by).sort((a,b)=>a-b).map(mr=>({title:'MR '+mr,recipes:by[mr].map(x=>({recipe:x.recipe,xp:x.xp,note:x.note||'',items:x.targets.map(t=>gearRow(t.id,'')).filter(Boolean)}))}))}
  if(tab==='xp')out.xpHtml=xpTabHTML();
  return out}
Object.assign(window.TF,{
  mastery:()=>masteryData(),
  masterySet:o=>{if(o.tab!=null)state.mTab=o.tab;if(o.target!=null)state.target=+o.target;saveUI();tfNotify()},
  gearTick:(n,v)=>{setK('m|'+n,v?1:0);tfNotify();if(v){const e=logList().find(x=>x.key==='m|'+n);toastAction('Mastered '+n,'Undo',()=>{if(e)logUndo(e.id)})}},
  itemTree:(n,note)=>itemTree(n,{note:note||''})
});
/* tab links from elsewhere */
document.addEventListener('click',e=>{const t=e.target.closest('[data-mtab]');if(!t||!(window.TF_UI&&TF_UI.owns&&TF_UI.owns('mastery')))return;
  e.preventDefault();e.stopPropagation();state.mTab=t.dataset.mtab;saveUI();if(location.hash!=='#mastery')location.hash='mastery';else tfNotify()},true);
const _masteryRoute=routes.mastery;
routes.mastery=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('mastery')?'':_masteryRoute()};
