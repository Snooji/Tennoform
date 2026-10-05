/* ---------- item objective tree ---------- */
function totals(name,mult,acc,seen){const it=I[name];if(!it)return acc;
  acc.cr+=(it.cr||0)*mult;
  for(const p of it.parts){if(p.k==='r')acc.r[p.n]=(acc.r[p.n]||0)+p.q*mult;
    else if(p.k==='p'){acc.cr+=(p.cr||0)*mult;(p.sub||[]).forEach(([n,q])=>acc.r[n]=(acc.r[n]||0)+q*mult);if(p.t)acc.pt=Math.max(acc.pt,p.t)}
    else if(p.k==='i'&&I[p.n]&&!seen.includes(p.n))totals(p.n,p.q*mult,acc,[...seen,name])}
  return acc}
function bpSource(it,note){const n=it.n;
  if(it.bprel)return `Drops from Void Relics ${priceChip(n+' Blueprint','BP ')}${sellerRow(n+' Blueprint')}`+relicChips(it.bprel);
  let h='';if(it.bpd&&it.bpd.length)h+=dropsList(it.bpd,2);
  if(it.bc)h+=(h?'<br>':'')+`Buy the blueprint in the in-game <b>Market for ${fmt(it.bc)} credits</b>`;
  if(it.dr&&it.dr.length&&!it.bpd)h+=(h?'<br>':'')+dropsList(it.dr,2);
  if(note)h+=(h?'<br>':'')+`<b>Your sheet:</b> ${esc(note)}`;
  const qs=Q.filter(q=>q.rw.some(r=>r.toLowerCase().startsWith(n.toLowerCase()+' ')));
  if(qs.length)h+=(h?'<br>':'')+`Quest reward: ${qs.map(q=>`<a class="ln" href="#quests" data-q="${esc(q.n)}">${esc(q.n)}</a>`).join(', ')}`;
  if(!h)h=`Special source (syndicate, vendor or event). ${it.w?`<a href="${it.w}" target="_blank" rel="noopener">Wiki</a>`:''}`;
  if(it.mp)h+=`<br><span class="muted">Or buy it ready-built for ${it.mp} platinum.</span>`;
  return h}
function resRows(list,prefix){return `<ul class="reslist">`+list.map(([n,q])=>`<li>${ck(prefix+'|'+n,'sm')}<span class="q">${fmt(q)} × ${L(n)}${haveTag(n,q)}</span><span class="where">${farmFor(n)}</span></li>`).join('')+'</ul>'}
function itemTree(name,opts){opts=opts||{};const it=I[name];if(!it)return `<div class="panel">No data for ${esc(name)}</div>`;
  const depth=opts.depth||0;const rk=P.rk[name];
  let h=`<section class="obj" data-scope><div class="obj-h">${depth===0?art(name,'hero-art'):''}<div class="title"><h3>${esc(name)}</h3>
    <span class="chip">${esc(it.c)}</span>${it.mr?`<span class="chip">MR ${it.mr}</span>`:''}${vaultChip(it)}${rk&&!on('m|'+name)?`<span class="chip teal">Rank ${rk}</span>`:''}${it.p?priceChip(name+' Set','Set '):''}
    ${mxChip(name)}${it.w?`<a class="small" href="${it.w}" target="_blank" rel="noopener">wiki</a>`:''}<span class="row" style="margin-left:auto;gap:4px">${it.t?`<button class="btn sm" data-fstart="${esc(name)}" title="Start a Foundry timer">${ic('timer')}Foundry</button>`:''}${taskBtn('item',name,'Build '+name)}<button class="btn sm ${(P.goals||[]).includes(name)?'on':''}" data-goal="${esc(name)}">${(P.goals||[]).includes(name)?ic('star','fill')+'Tracking':ic('star')+'Track'}</button></span></div>${it.p?sellerRow(name+' Set'):''}${progHTML()}</div><ol class="steps">`;
  h+=step('bp|'+name,'Get the blueprint',bpSource(it,opts.note));
  let pi=0;for(const p of it.parts){pi++;
    if(p.k==='p'&&p.n==='Blueprint')continue;
    if(p.k==='p'){const full=p.full||(name+' '+p.n);
      let src='';if(p.rel)src=`${priceChip(full)}${p.du?` <span class="chip">${p.du} ducats</span>`:''}${sellerRow(full)}`+relicChips(p.rel);
      else if(p.dr&&p.dr.length)src=dropsList(p.dr,2);else src='Same source as the blueprint.';
      h+=step('part|'+name+'|'+p.n,`Get ${esc(full)}${p.sub?' blueprint':''}`,src);
      if(p.sub)h+=step('built|'+name+'|'+p.n,`Craft ${esc(p.n)} · ${hrs(p.t)} · ${fmt(p.cr)} cr`,resRows(p.sub,'res|'+name+'|'+p.n)+`<button class="btn sm" style="margin-top:8px" data-fstart="${esc(name+' '+p.n)}">${ic('timer')}Start Foundry timer</button>`);
    }else if(p.k==='i'){
      h+=step('have|'+name+'|'+p.n+'|'+pi,`Have a spare ${L(p.n)}${p.q>1?' ×'+p.q:''} (used up by the recipe)`,
        depth<3?`<details class="more lazy" data-tree="${esc(p.n)}" data-depth="${depth+1}"><summary>${esc(p.n)} steps</summary><div class="sub"></div></details>`:'');
    }}
  const rs=it.parts.filter(p=>p.k==='r').map(p=>[p.n,p.q]);
  h+=step('build|'+name,`Build in Foundry · ${hrs(it.t)} · ${fmt(it.cr)} cr${it.rush?` <span class="muted">(rush ${it.rush}p)</span>`:''}`,(rs.length?resRows(rs,'res|'+name+'|main'):'')+`<button class="btn sm" style="margin-top:8px" data-fstart="${esc(name)}">Start Foundry timer</button>`);
  h+=step('m|'+name,`Rank to ${maxRank(it)} · ${mxChip(name)}`,`Level it fast on Hydron (Sedna) or Elite Sanctuary Onslaught.`);
  h+='</ol>';
  const T=totals(name,1,{cr:0,r:{},pt:0},[]);const tr=Object.entries(T.r).sort((a,b)=>b[1]-a[1]);
  if(tr.length)h+=`<details class="more" style="padding:4px 14px 12px"><summary>Total shopping list</summary><div class="small"><div style="margin:6px 0"><b>${fmt(T.cr)} credits</b> · fastest finish <b>${hrs((T.pt||0)+(it.t||0))}</b> (build parts together, then the final build)</div><ul class="reslist">${tr.map(([n,q])=>shopLi(n,q)).join('')}</ul></div></details>`;
  return h+'</section>'}

