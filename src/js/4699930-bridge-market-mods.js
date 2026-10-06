/* ---------- Market: mods and arcanes, with the rank each cheapest listing is sold at ---------- */
function marketModsData(){const q=(state.mmQ||'').toLowerCase().trim(),kind=state.mmK||'all',sort=state.mmS||'v7',lim=state.mmLim||60;
  const all=[...Object.keys(MODS).map(n=>[n,'Mod']),...Object.keys(ARC).map(n=>[n,'Arcane'])].filter(([n])=>MS[n]&&(PR[n]||SEL[n]));
  const rows=all.filter(([n,k])=>(kind==='all'||kind===k)&&(!q||n.toLowerCase().includes(q))).map(([n,k])=>{const p=PR[n]||{};const b=(SEL[n]||[]).filter(x=>x[0]!=='__buy')[0]||null;
    const md=k==='Mod'?MODS[n]:ARC[n];const rar={C:'Common',U:'Uncommon',R:'Rare',L:'Legendary'}[md&&md.r]||'';
    return {n,kind:k,type:k==='Mod'?(md.ty||'Mod'):'Arcane',rar,a7:p.a7??p.a30??null,v7:p.v7||0,low:b?b[1]:null,
      seller:b?{name:b[0],price:b[1],rank:b[5]??null,wh:whisper(n,b)}:null,url:'https://warframe.market/items/'+MS[n]}});
  rows.sort((a,b)=>sort==='n'?a.n.localeCompare(b.n):sort==='low'?((a.low??1e9)-(b.low??1e9)):sort==='a7'?((b.a7??-1)-(a.a7??-1)):(b.v7-a.v7)||a.n.localeCompare(b.n));
  return {q:state.mmQ||'',kind,sort,total:all.length,count:rows.length,more:Math.max(0,rows.length-lim),rows:rows.slice(0,lim).map(r=>({...r,a7:r.a7!=null?Math.round(r.a7):null}))}}
Object.assign(window.TF,{marketMods:()=>marketModsData(),
  marketModsSet:o=>{if(o.q!=null){state.mmQ=o.q;state.mmLim=60}if(o.kind!=null){state.mmK=o.kind;state.mmLim=60}if(o.sort!=null)state.mmS=o.sort;if(o.more)state.mmLim=(state.mmLim||60)+60;saveUI();tfNotify()}});
