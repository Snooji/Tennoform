/* ---------- how to play each Warframe: which abilities to keep up, the play loop, the usual mistake (build/howto.json) ---------- */
function howtoData(n){const H=D.howto||{};const base=String(n||'').replace(/ Prime$/,'');const h=H[n]||H[base];if(!h)return null;
  const st=(typeof ST!=='undefined'&&ST.data)?(ST.data[n]||ST.data[base]||{}):{};if(typeof ST!=='undefined'&&!ST.data)loadStats();
  const desc=Object.fromEntries((st.ab||[]).map(a=>[a[0],a[1]]));
  return {frame:base,keep:(h.keep||[]).map(a=>({n:a,d:desc[a]||''})),loop:h.loop||[],watch:h.watch||''}}
Object.assign(window.TF,{howto:n=>howtoData(n)});
