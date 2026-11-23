/* ---------- Compare two frames or weapons side by side, from data/stats.json (loaded on first use) ---------- */
const CMP_ROWS=[['h','Health',1],['s','Shields',1],['a','Armor',1],['e','Energy',1],['sp','Sprint speed',1],
  ['tot','Damage',1],['ms','Multishot',1],['cc','Critical chance',1,'pct'],['cm','Critical damage',1,'x'],['sc','Status chance',1,'pct'],['fr','Fire / attack rate',1],
  ['mag','Magazine',1],['rl','Reload (s)',-1],['rng','Range (m)',1],['hv','Heavy attack',1],['wu','Wind-up (s)',-1],['sl','Slam',1],['cd','Combo duration (s)',1],['ft','Follow-through',1,'pct'],['ba','Block angle',1],['dispo','Riven disposition',0]];
function cmpFmt(v,f){if(v==null)return '—';if(f==='pct')return pct(v);if(f==='x')return v+'×';return typeof v==='number'?(Number.isInteger(v)?fmt(v):String(Math.round(v*100)/100)):String(v)}
Object.assign(window.TF,{
  compareList:n=>{const it=I[n];if(!it)return [];if(!ST.data){loadStats();return []}return Object.keys(ST.data).filter(x=>x!==n&&I[x]&&I[x].c===it.c).sort()},
  compare:(a,b)=>{if(!ST.data){loadStats();return {loading:true,a,b,rows:[]}}const A=ST.data[a]||{},B=ST.data[b]||{};
    const rows=CMP_ROWS.filter(([k])=>A[k]!=null||B[k]!=null).map(([k,label,dir,f])=>{const x=A[k],y=B[k];let better=null;if(dir&&typeof x==='number'&&typeof y==='number'&&x!==y)better=(x>y)===(dir>0)?'a':'b';return {label,a:cmpFmt(x,f),b:cmpFmt(y,f),better}});
    const dmg=k=>Object.entries((k.dmg)||{}).sort((p,q)=>q[1]-p[1]).map(([t,v])=>(DMG_L[t]||t)+' '+v).join(', ');
    if(A.dmg||B.dmg)rows.push({label:'Damage types',a:dmg(A)||'—',b:dmg(B)||'—',better:null});
    return {loading:false,a,b,imgA:IMG(a),imgB:IMG(b),mrA:(I[a]||{}).mr||0,mrB:(I[b]||{}).mr||0,rows}}
});
