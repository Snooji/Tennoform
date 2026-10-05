/* ---------- bridge: Syndicates for the React page ---------- */
function linkKey(n){n=String(n);if(RES[n])return 'res|'+n;if(I[n])return 'item|'+n;if(D.partrel[n])return 'part|'+n;if(MODS[n])return 'mod|'+n;if(ARC[n])return 'arc|'+n;const m=n.match(/^(.+?) (Neuroptics|Chassis|Systems|Blueprint|Harness|Wings)$/);return m&&I[m[1]]?'item|'+m[1]:''}
function syndData(){const f=state.syF||'all',srt=state.syS||'next',hide=!!state.syH;
  let list=D.synd.slice();if(f!=='all')list=list.filter(e=>e.kind===f);if(hide)list=list.filter(e=>gateOK(e.gate));
  const prog=e=>{const st=synState(e),rr=rankRow(e,st.r);if(rr.max==null)return 0;return (st.s-(rr.min||0))/((rr.max||1)-(rr.min||0))};
  list.sort((a,b)=>srt==='name'?a.n.localeCompare(b.n):srt==='rank'?synState(b).r-synState(a).r||synState(b).s-synState(a).s:prog(b)-prog(a));
  const fl=dailyLeft(D.synd[0]);
  return {filter:f,sort:srt,hide,cap:dailyCap(),factionLeft:fl,synced:!!(P.daily&&P.daily.ts>=lastDaily()),reset:left(lastDaily()+DAY-Date.now()),
    nightwave:(P.nw||[]).map(([t,s,r])=>({t,s,r})),
    list:list.map(e=>{const st=synState(e),ok=gateOK(e.gate);const cur=rankRow(e,st.r),nx=rankRow(e,st.r+1);const top=e.ranks.length?e.ranks[e.ranks.length-1].r:0;
      const pct=cur.max!=null?Math.max(0,Math.min(100,(st.s-(cur.min||0))/((cur.max||1)-(cur.min||0))*100)):0;const dl=dailyLeft(e);
      const stages=(e.farm||[]);let si=0;stages.forEach((s,i)=>{if(st.r>=s[1])si=i});
      const mo=(e.offers||[]).filter(o=>MIX[o[0]]&&itemXP(o[0])<mxp(MIX[o[0]]));const mrxp=mo.reduce((a,o)=>a+mxp(MIX[o[0]])-itemXP(o[0]),0);
      const warn=e.kind==='faction'?[e.opp,e.enemy].filter(n=>(+((P.syn||{})[n]||{}).r||0)>0):[];
      return {n:e.n,color:SYNC[e.n]||'',kind:e.kind,locked:!ok,gate:e.gate||'',synced:!!st.sync,set:!!(st.r||st.s),hasRanks:!!e.ranks.length,
        rank:st.r,top,title:cur.t||'Rank '+st.r,standing:st.s,max:cur.max==null?null:cur.max,pct,ready:cur.max!=null&&st.s>=cur.max&&!!nx.t,
        next:nx.t?{t:nx.t,in:cur.max!=null&&st.s<cur.max?cur.max-st.s:0,days:dl&&cur.max!=null&&st.s<cur.max?Math.ceil((cur.max-st.s)/Math.max(1,dailyCap())):0,cr:nx.cr||0,items:(nx.items||[]).map(([q,n])=>({q,n,go:linkKey(n)}))}:null,
        dailyLeft:dl,effects:e.kind==='faction'?{ally:e.ally,opp:e.opp,enemy:e.enemy,warn}:null,
        earn:stages.length?{now:stages[si][2],later:stages[si+1]?stages[si+1][2]:[]}:null,mrxp,
        offers:(e.offers||[]).filter(o=>o[2]<=st.r+1).slice(0,40).map(o=>{const it=MIX[o[0]];return {n:o[0],cost:o[1],nextRank:o[2]>st.r,go:linkKey(o[0]),left:it?mxp(it)-itemXP(o[0]):0,xp:it?mxp(it):0}}),
        ranks:e.ranks.map(r=>({value:String(r.r),label:r.r+': '+r.t})),hasTask:(P.tasks||[]).some(x=>!x.d&&x.k==='synd'&&x.r===e.n)}})}}
Object.assign(window.TF,{
  synd:()=>syndData(),
  syndSet:o=>{if(o.f!=null)state.syF=o.f;if(o.s!=null)state.syS=o.s;if(o.hide!=null)state.syH=o.hide;saveUI();tfNotify()},
  synSet:(n,o)=>{P.syn=P.syn||{};const cur=P.syn[n]||{};if(o.r!=null)cur.r=+o.r;if(o.s!=null)cur.s=Math.max(0,+o.s||0);cur.sync=0;P.syn[n]=cur;saveProfile();tfNotify()}
});
const _syndRoute=routes.synd;
routes.synd=function(){return window.TF_UI&&TF_UI.owns&&TF_UI.owns('synd')?'':_syndRoute()};
