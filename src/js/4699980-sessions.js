/* ---------- Farming sessions and the relic log ----------
   Farming: count runs and drops for whatever you're after; shows drops per run and runs per hour.
   Relic log: record what each opened relic gave; keeps a running ducat total and uses up an intact relic from your count.
   Both are saved on the profile (the account when signed in). Nothing is fetched. */
const FARM_H_MAX=20,RLOG_MAX=100;
function sessData(){const a=P.farmS||null;return {active:a?{...a,mins:Math.max(1,Math.round((Date.now()-a.t0)/60000))}:null,history:(P.farmH||[]).slice(0,5)}}
function sessSave(){saveProfile();tfNotify()}
function relicLogData(r){const R=REL[r];if(!R)return null;const log=((P.rlog||{})[r]||[]);
  const RO={C:0,U:1,R:2};const rewards=R.rw.map(([n,rr])=>({n,rar:rr,du:partDu(n)||0,chance:RCH.i[rr]})).sort((a,b)=>RO[a.rar]-RO[b.rar]);
  const du=log.reduce((a,x)=>a+(partDu(x.got)||0),0),rare=log.filter(x=>(R.rw.find(w=>w[0]===x.got)||[])[1]==='R').length;
  const counts={};log.forEach(x=>{counts[x.got]=(counts[x.got]||0)+1});
  return {relic:r,rewards,opens:log.length,ducats:du,rare,counts,intact:+(((P.rel||{})[r]||{}).i)||0,recent:log.slice(-6).reverse().map(x=>({got:x.got,at:x.at}))}}
Object.assign(window.TF,{
  sess:()=>sessData(),
  sessStart:(key,name)=>{if(P.farmS)TF.sessEnd(true);P.farmS={key,name:name||key.slice(key.indexOf('|')+1),runs:0,drops:0,t0:Date.now()};sessSave();toast('Farming '+P.farmS.name+'. Tap + Run after each run.')},
  sessRun:d=>{if(!P.farmS)return;P.farmS.runs=Math.max(0,P.farmS.runs+(d||1));sessSave()},
  sessDrop:d=>{if(!P.farmS)return;P.farmS.drops=Math.max(0,P.farmS.drops+(d||1));sessSave()},
  sessEnd:quiet=>{const a=P.farmS;if(!a)return;P.farmS=null;if(a.runs||a.drops){P.farmH=[{...a,t1:Date.now()},...(P.farmH||[])].slice(0,FARM_H_MAX);if(!quiet)toast(`Saved: ${a.drops} drop${a.drops===1?'':'s'} in ${a.runs} run${a.runs===1?'':'s'}`)}sessSave()},
  relicLog:r=>relicLogData(r),
  relicOpen:(r,got)=>{if(!REL[r])return;P.rlog={...(P.rlog||{})};const list=[...(P.rlog[r]||[]),{got,at:Date.now()}].slice(-RLOG_MAX);P.rlog[r]=list;
    P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};const used=(+x.i||0)>0;if(used)x.i=(+x.i)-1;saveProfile();tfNotify();
    toastAction(`Logged ${got}${used?' · 1 intact '+r+' used':''}`,'Undo',()=>{const l=(P.rlog||{})[r]||[];l.pop();if(used)P.rel[r].i=(+P.rel[r].i||0)+1;saveProfile();tfNotify()})}
});
