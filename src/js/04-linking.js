/* ---------- linking ---------- */
function partOwner(n){return Object.values(I).find(it=>it.parts.some(p=>p.full===n))}
function L(name,label){label=label??name;const n=String(name);
  let t=null;if(RES[n])t='res|'+n;else if(I[n])t='item|'+n;else if(D.partrel[n])t='part|'+n;else if(REL[n.replace(/ Relic$/,'')])t='relic|'+n.replace(/ Relic$/,'');else if(MODS[n])t='mod|'+n;else if(ARC[n])t='arc|'+n;
  else{const m=n.match(/^(.+?) (Neuroptics|Chassis|Systems|Blueprint|Harness|Wings)$/);if(m&&I[m[1]])t='item|'+m[1]}
  return t?`<a class="ln" href="#" data-go="${esc(t)}">${esc(label)}</a>`:esc(label)}
function go(t){const i=t.indexOf('|');const ty=t.slice(0,i),n=t.slice(i+1);
  if(ty==='res'){state.resSel=n;state.resQ='';if(HASH()!=='#resources')GO('resources');else{render();window.scrollTo(0,0)}return}
  if(ty==='item'&&I[n]&&I[n].c==='Warframe'){state.frame=n;state.build=0;saveUI();if(HASH()!=='#frames')GO('frames');else{render();window.scrollTo(0,0)}return}
  if(ty==='node'){state.scP=n||null;state.planet=null;if(HASH()!=='#missions')GO('missions');else render();return}
  state.farmSel=t;if(HASH()!=='#farm')GO('farm');else{render();setTimeout(()=>$('#fdet')?.scrollIntoView({block:'start',behavior:'smooth'}),30)}}

