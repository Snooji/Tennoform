/* ---------- Duviri Circuit forecast: which Warframes and Incarnon Genesis adapters are offered in the coming weeks ---------- */
/* Both lists rotate on a fixed cycle every Monday 00:00 UTC (wiki: The Circuit). The live feed gives this week's picks;
   when it disagrees with the cycle (DE added or reordered rewards), this week shows the live picks and the forecast says so. */
const CIR_WF=[['Excalibur','Trinity','Ember'],['Loki','Mag','Rhino'],['Ash','Frost','Nyx'],['Saryn','Vauban','Nova'],['Nekros','Valkyr','Oberon'],['Hydroid','Mirage','Limbo'],
  ['Mesa','Chroma','Atlas'],['Ivara','Inaros','Titania'],['Nidus','Octavia','Harrow'],['Gara','Khora','Revenant'],['Garuda','Baruuk','Hildryn']];
const CIR_INC=[['Braton','Lato','Skana','Paris','Kunai'],['Boar','Gammacor','Angstrum','Gorgon','Anku'],['Bo','Latron','Furis','Furax','Strun'],['Lex','Magistar','Boltor','Bronco','Ceramic Dagger'],
  ['Torid','Dual Toxocyst','Dual Ichor','Miter','Atomos'],['Ack & Brunt','Soma','Vasto','Nami Solo','Burston'],['Zylok','Sibear','Dread','Despair','Hate'],['Dera','Sybaris','Cestra','Sicarus','Okina'],
  ['Vectis','Stug','Ballistica','Destreza','Obex']];
const CIR_ANCHOR=Date.UTC(2026,9,5),CIR_WF0=3,CIR_INC0=5;  /* week of Mon 5 Oct 2026: Saryn/Vauban/Nova and Ack & Brunt…Burston */
const cirKey=s=>String(s).replace(/&/g,'and').replace(/[^a-z]/gi,'').toLowerCase();
const pmod=(a,m)=>((a%m)+m)%m;
function circuitData(){const wk0=lastWeekly(),now=Date.now();const off=Math.round((wk0-CIR_ANCHOR)/(7*DAY));
  const live=WS&&WS.duviriCycle&&WS.duviriCycle.choices;const pick=c=>(live&&(live.find(x=>x.category===c)||{}).choices)||null;
  const lwf=pick('normal'),linc=pick('hard');const same=(a,b)=>!a||a.map(cirKey).sort().join()===b.map(cirKey).sort().join();
  let changed=false;const weeks=[];
  for(let i=0;i<10;i++){const start=wk0+i*7*DAY;let wf=CIR_WF[pmod(CIR_WF0+off+i,CIR_WF.length)],inc=CIR_INC[pmod(CIR_INC0+off+i,CIR_INC.length)];
    if(i===0){if(lwf&&!same(lwf,wf)){changed=true;wf=lwf.map(k=>CIR_WF.flat().find(n=>cirKey(n)===cirKey(k))||k)}
      if(linc&&!same(linc,inc)){changed=true;inc=linc.map(k=>CIR_INC.flat().find(n=>cirKey(n)===cirKey(k))||k)}}
    const frames=wf.map(n=>({n,img:I[n]?IMG(n):'',owned:ownedItem(n),prime:ownedItem(n+' Prime'),mastered:on('m|'+n)}));
    const adapters=inc.map(n=>({n,full:n+' Incarnon Genesis',key:'inc|'+n,have:on('inc|'+n),weapon:I[n]?ownedItem(n)||ownedItem(n+' Prime'):false,img:I[n]?IMG(n):''}));
    const need=frames.filter(f=>!f.owned).length+adapters.filter(a=>!a.have).length;
    weeks.push({start:new Date(start).toISOString(),label:i===0?'This week':i===1?'Next week':new Date(start).toLocaleDateString([],{month:'short',day:'numeric',timeZone:'UTC'}),
      endsIn:i===0?left(start+7*DAY-now):'',startsIn:i>0?left(start-now):'',frames,adapters,need})}
  const have=Object.keys(CIR_INC.flat().reduce((o,n)=>(on('inc|'+n)&&(o[n]=1),o),{})).length;
  return {weeks,changed,live:!!live,adaptersHave:have,adaptersTotal:CIR_INC.flat().length}}
Object.assign(window.TF,{circuit:()=>circuitData()});
/* the checklist's Circuit row shows this week's picks */
{const _cl=ckLiveData;ckLiveData=function(c){if(c[1]!=='circuit')return _cl(c);const w=circuitData().weeks[0];
  return {head:'This week: '+w.frames.map(f=>f.n).join(', '),list:[{t:'Steel Path',s:w.adapters.map(a=>a.n).join(', '),n:'Incarnon Genesis adapters'}]}}}
