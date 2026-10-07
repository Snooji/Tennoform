/* ---------- bridge: Goals for the React page ---------- */
const strip=h=>String(h||'').replace(/<br\s*\/?>/g,' · ').replace(/<a\b[^>]*>(farms by stage|\d+ options)<\/a>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s*·\s*$/,'').trim();
function vaultOf(it){if(!it||!it.p)return null;const v=VAULT[it.n]||{};if(v.now)return {kind:'now',text:'Resurgence until '+fdate(v.now)};if(it.v)return {kind:'vaulted',text:'Vaulted'+(v.est?' · back ~'+fdate(v.est):'')};return {kind:'farmable',text:'Farmable'+(it.evd?' · vaults ~'+fdate(it.evd):'')}}
function goalsData(){const g=(P.goals||[]).filter(n=>I[n]);const srt=state.gS||'added';let list=g.slice();
  if(srt==='name')list.sort();if(srt==='progress'){const pr=n=>{const k=stepKeys(n);return k.filter(on).length/k.length};list.sort((a,b)=>pr(b)-pr(a))}rv('gS',list);
  const acc={cr:0,r:{},pt:0};g.filter(n=>!on('build|'+n)).forEach(n=>totals(n,1,acc,[]));const short=!!state.gShort;
  const shop=Object.entries(acc.r).sort((a,b)=>b[1]-a[1]).filter(([n,q])=>!short||!(P.inv&&+P.inv[n]>=q)).map(([n,q])=>{const known=P.inv&&P.inv[n]!=null;const h=+((P.inv||{})[n]||0);const rem=Math.max(0,q-h);
    return {n,need:q,have:known?h:null,left:rem,where:strip(farmFor(n)),task:{has:(P.tasks||[]).some(x=>!x.d&&x.k==='res'&&x.r===n),key:'res|'+n,label:'Farm '+fmt(rem)+' '+n}}});
  const need=neededEras();
  return {sort:srt,short,credits:acc.cr,
    goals:list.map(n=>{const k=stepKeys(n);return {name:n,img:IMG(n),done:k.filter(on).length,total:k.length,xp:mxp(I[n]),built:on('build|'+n),vault:vaultOf(I[n])}}),
    shop,relics:Object.entries(need).map(([era,s])=>({era,relics:[...s]}))}}
Object.assign(window.TF,{
  goals:()=>goalsData(),
  goalsSet:o=>{if(o.s!=null)state.gS=o.s;if(o.short!=null)state.gShort=o.short;saveUI();tfNotify()},
  goalRemove:n=>{const i=(P.goals||[]).indexOf(n);if(i<0)return;P.goals.splice(i,1);saveProfile();tfNotify();toastAction('Removed '+n+' from Goals','Undo',()=>{P.goals=P.goals||[];if(!P.goals.includes(n))P.goals.splice(Math.min(i,P.goals.length),0,n);saveProfile();tfNotify()})},
  setInv:(n,v)=>{P.inv=P.inv||{};const s=String(v).trim();if(s==='')delete P.inv[n];else P.inv[n]=Math.max(0,+s||0);saveProfile();tfNotify()}
});
const _goalsRoute=routes.goals;
routes.goals=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('goals')?'':_goalsRoute()};
