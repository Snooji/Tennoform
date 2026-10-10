/* ---------- nodes and places: every star-chart node and every hidden or special place, in the Farm finder and the main search ----------
   Each one says where it is and how to unlock it. Places data: 4699964-places-data.js (from wiki.warframe.com). */
const PLX=(()=>{const out={},dup={};
  for(const n of ALLN)dup[n.n]=(dup[n.n]||0)+1;
  for(const n of ALLN){const k=dup[n.n]>1?n.n+' ('+n.p+')':n.n;out[k]={k,n:n.n,node:n}}
  for(const p of PLACES_INFO.places){const k=out[p.n]&&!out[p.n].place?p.n+' ('+p.kind+')':p.n;out[k]={k,n:p.n,place:p}}
  return out})();
const plSub=e=>e.place?e.place.kind:[e.node.t,e.node.p].filter(Boolean).join(' · ');
const plCat=e=>e.place?'Hidden & special':e.node.p;
{const _b=buildIdx;buildIdx=function(){_b();for(const e of Object.values(PLX))IDX.push([e.k,'place',plSub(e),plCat(e)])}}
FFT.push(['place','Nodes & places']);
function placeUnlock(e){if(e.place)return e.place.unlock||[];const N=e.node,s=PLACES_INFO.nodes[N.n],r=PLACES_INFO.regions[N.p];const u=[];
  if(s&&s.unlock)u.push(s.unlock);if(r&&r.unlock)u.push((s&&s.unlock?'To reach '+N.p+': ':'')+r.unlock);
  if(!u.length)u.push(`Complete a connected node on ${N.p}.`);return u}
function placeDetail(k){const e=PLX[k];if(!e)return '';const N=e.node,P=e.place,s=N&&PLACES_INFO.nodes[N.n];
  const chips=P?`<span class="chip">${esc(P.kind)}</span>`:`<span class="chip">${esc(N.t)}</span><span class="chip">${esc(N.p)}</span>${N.lv&&N.lv[0]?`<span class="chip">Level ${N.lv[0]}–${N.lv[1]}</span>`:''}${N.ds?`<span class="chip gold">Dark Sector${N.rb?' · +'+Math.round(N.rb*100)+'% resources':''}</span>`:''}`;
  const what=P?P.what:s&&s.what;const w=P?P.w:(s&&s.w)||(PLACES_INFO.regions[N.p]||{}).w;
  const un=placeUnlock(e);
  return `<section class="obj" data-scope><div class="obj-h"><div class="title"><h3>${esc(e.n)}</h3>${chips}</div></div><div style="padding:12px 14px" class="stack">
    ${what?`<div>${esc(what)}</div>`:''}
    ${P&&P.where?`<div class="small"><b>Where:</b> ${esc(P.where)}</div>`:''}
    <div class="tier cut"><h4>How to unlock</h4>${un.length>1?`<ol class="small" style="margin:0;padding-left:20px;list-style:decimal;display:grid;gap:4px">${un.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:`<div class="small">${esc(un[0]||'')}</div>`}</div>
    <div class="row">${N?`<button type="button" class="btn sm" data-go="node|${esc(N.p)}">Open ${esc(N.p)} on the Star chart</button>`:''}${w?`<a class="btn sm" href="${esc(w)}" target="_blank" rel="noopener">Warframe wiki</a>`:''}</div>
  </div></section>`}
{const _d=detail;detail=function(sel){return sel.startsWith('place|')?placeDetail(sel.slice(6)):_d(sel)}}
/* main search: nodes and places, and open-world fish, ore and animals */
{const _c=cmdIndex;cmdIndex=function(){if(CMDX)return CMDX;const x=_c();
  for(const e of Object.values(PLX))x.push({n:e.k,g:'Places',act:'place|'+e.k,s:plSub(e),l:e.k.toLowerCase(),a:[...((e.place&&e.place.aka)||[]),plCat(e),e.node?e.node.t:''].join(' ').toLowerCase()});
  if(typeof owIndex==='function')for(const o of Object.values(owIndex()))x.push({n:o.n,g:'Open worlds',act:'ow|'+o.n,s:o.kind+' · '+o.reg,l:o.n.toLowerCase(),a:(o.kind+' '+o.reg).toLowerCase()});
  return CMDX=x}}
CMDG.push('Places','Open worlds');
