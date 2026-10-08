/* ---------- warframe.market price history and price alerts ---------- */
/* History: 90 days of daily average prices per item, saved by the daily price refresh from the statistics it already
   downloads, and fetched only when a chart opens. Alerts: "tell me when X is below N platinum", checked against each
   day's snapshot (the cheapest seller if there is one, else the 7-day average). Nothing extra is asked of warframe.market. */
let PH=null;
LAZY.pricehist={done:false,busy:false,err:false,demand:true,url:()=>D.hist,add:j=>{PH=j}};
function priceHist(n){if(!D.hist)return {state:'none',points:[]};if(!PH){lazyLoad('pricehist');return {state:LAZY.pricehist.err?'error':'loading',points:[]}}
  const h=PH[n];if(!h)return {state:'empty',points:[]};const d0=new Date(h[0]+'T00:00:00Z').getTime();
  const points=h[1].map((p,i)=>({d:new Date(d0+i*DAY).toISOString().slice(0,10),p}));const vals=points.map(x=>x.p).filter(x=>x!=null);
  return {state:'ok',points,min:Math.min(...vals),max:Math.max(...vals),first:vals[0],last:vals[vals.length-1]}}
const palerts=()=>P.palerts&&typeof P.palerts==='object'?P.palerts:{};
/* today's price for an alert: the cheapest seller in the snapshot, else the 7-day average */
function nowPrice(n){const sl=(SEL[n]||[]).filter(s=>s[0]!=='__buy');if(sl.length)return {p:sl[0][1],how:'cheapest seller'};const a=(PR[n]||{}).a7;return a!=null?{p:Math.round(a),how:'7-day average'}:null}
function priceAlertSet(n,below){const a={...palerts()};if(below==null||!(+below>0))delete a[n];else a[n]=Math.round(+below);P.palerts=a;saveProfile();tfNotify()}
function priceAlertsData(){const a=palerts();return {date:D.meta.prices||'',list:Object.keys(a).sort().map(n=>{const c=nowPrice(n);return {n,below:a[n],now:c?c.p:null,how:c?c.how:'',hit:!!c&&c.p<=a[n],url:MS[n]?'https://warframe.market/items/'+MS[n]:''}})}}
function priceSuggest(q){q=String(q||'').toLowerCase().trim();if(q.length<2)return [];const a=palerts();
  return Object.keys(MS).filter(n=>n.toLowerCase().includes(q)&&!(n in a)).sort((x,y)=>(x.toLowerCase().startsWith(q)?0:1)-(y.toLowerCase().startsWith(q)?0:1)||x.length-y.length).slice(0,8)}
{const _a=alertsAll;alertsAll=function(){const out=_a();const hits=priceAlertsData().list.filter(x=>x.hit);
  if(hits.length)out.push({id:'price:'+(D.meta.prices||'')+':'+hits.map(x=>x.n).join(','),kind:'price',title:hits.length===1?`${hits[0].n} is ${hits[0].now}p`:`${hits.length} items hit your price alerts`,
    text:hits.length===1?`At or below your ${hits[0].below}p alert (${hits[0].how}, warframe.market snapshot of ${D.meta.prices}).`:`At or below the prices you set (warframe.market snapshot of ${D.meta.prices}).`,
    items:hits.slice(0,6).map(x=>`${x.n}: ${x.now}p (alert at ${x.below}p)`),href:'market'});
  return out}}
Object.assign(window.TF,{priceHist:n=>priceHist(n),priceAlerts:()=>priceAlertsData(),priceAlert:(n,below)=>priceAlertSet(n,below),priceSuggest:q=>priceSuggest(q)});
