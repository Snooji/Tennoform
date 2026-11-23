/* ---------- Amps: each prism is a mastery item; its page shows the scaffolds and braces that finish the amp ----------
   Data from the WFCD pack (build/update_gamedata.py step 2b): D.amps lists every prism, scaffold and brace with its seller,
   credits, build time and resources. Mote parts make the free starter amp. */
const AMPS=D.amps||[];
function ampData(n){const me=AMPS.find(a=>a.n===n);if(!me)return null;const same=a=>a.set===me.set;
  const card=a=>({n:a.n,img:a.img?'https://cdn.warframestat.us/img/'+encodeURIComponent(a.img):'',cr:a.cr||0,t:a.t||0,res:a.res||[]});
  return {prism:card(me),seller:me.seller,mote:me.set==='mote',
    scaffolds:AMPS.filter(a=>a.k==='scaffold'&&same(a)).map(card),braces:AMPS.filter(a=>a.k==='brace'&&same(a)).map(card),
    prisms:AMPS.filter(a=>a.k==='prism').length}}
Object.assign(window.TF,{amp:n=>ampData(n)});
/* the old "Amps" counter under Other gear only counts prisms you haven't ticked on Ranks, so nothing is counted twice */
{const _ox=othXP;othXP=function(){const o=P.oth||{};const n=+o.amp||0;if(!n)return _ox();
  const ticked=MI.filter(i=>i.c==='Amp'&&/ Prism$/.test(i.n)&&rankOf(i.n)>=maxRank(i)).length;return _ox()-Math.min(n,ticked)*3000}}
