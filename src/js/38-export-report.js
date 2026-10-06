/* ---------- export report ---------- */
function reportHTML(){const t=totalXP(),m=mrInfo(t.total);const now=new Date();const e=s=>esc(s);
  const sec=(title,body)=>`<section><h2>${title}</h2>${body}</section>`;
  const tbl=(head,rows)=>`<table><thead><tr>${head.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const bd=BDG.flat().map(k=>{const a=CATS.includes(k)?autoCat(k):null;return [e(bdLabel(k)),fmt(CATS.includes(k)?a.x:autoExtra(k)),isOv(k)?fmt(P.bo[k]):'',fmt(catXP(k)),a?`${a.m}/${a.t} (${a.p} partial)`:'']});
  const items=MI.filter(i=>rankOf(i.n)>0).sort((a,b)=>a.c.localeCompare(b.c)||a.n.localeCompare(b.n)).map(i=>[e(CATL[i.c]||i.c),e(i.n),rankOf(i.n)+'/'+maxRank(i),fmt(itemXP(i.n)),on('m|'+i.n)?'yes':'']);
  const nodes=ALLN.filter(n=>on('n|'+n.id)||on('sp|'+n.id)).map(n=>[e(n.p),e(isJ(n)?jLabel(n):n.n),e(n.t),n.x,on('n|'+n.id)?'yes':'',on('sp|'+n.id)?'yes':'',P.mc&&P.mc[n.id]||'']);
  const syn=D.synd.map(s=>{const st=synState(s);return [e(s.n),st.r,e(rankRow(s,st.r).t||''),fmt(st.s),st.sync?'sync':'manual']});
  const css='body{font:14px/1.5 system-ui,sans-serif;background:#0b1016;color:#dce6ea;margin:0;padding:24px}h1{color:#d9b45e;margin:0 0 4px}h2{color:#6fd6e8;border-bottom:1px solid #2b4a58;padding-bottom:4px;margin-top:28px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid #1e3440;padding:5px 8px;text-align:left}th{color:#8fa3ac;text-transform:uppercase;font-size:11px;letter-spacing:.08em}.k{display:inline-block;margin:4px 14px 4px 0}.k b{color:#d9b45e;font-size:20px}pre{white-space:pre-wrap;word-break:break-all;font-size:11px;background:#121d27;padding:12px}';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tennoform report · ${e(P.tname||(P.prof&&P.prof.name)||'Tenno')}</title><style>${css}</style></head><body>
  <h1>Tennoform report</h1><div>${e(P.tname||(P.prof&&P.prof.name)||'Tenno')} · exported ${now.toLocaleString()}</div>
  <div style="margin-top:12px"><span class="k">Tracked MR <b>${mrLabel(m.mr)}</b></span><span class="k">Total XP <b>${fmt(t.total)}</b></span><span class="k">Next rank at <b>${fmt(m.next)}</b></span>${P.prof&&P.prof.mr!=null?`<span class="k">In-game MR (last sync) <b>${mrLabel(P.prof.mr)}</b></span>`:''}<span class="k">Adjustment <b>${fmt(+P.adj||0)}</b></span></div>
  ${sec('Mastery breakdown',tbl(['Category','Tracked','In-game override','Counted','Mastered'],bd))}
  ${sec(`Ranked gear (${items.length})`,tbl(['Category','Item','Rank','XP','Mastered'],items))}
  ${sec(`Star chart (${nodes.length} nodes)`,tbl(['Planet','Node','Type','XP','Done','Steel Path','Runs'],nodes))}
  ${sec('Intrinsics',tbl(['School','Skill','Rank'],[...IR.map(n=>['Railjack',n,+((P.intrR||{})[n]||0)]),...ID.map(n=>['Drifter',n,+((P.intrD||{})[n]||0)])]))}
  ${sec('Other gear',tbl(['Type','Count','XP'],OTH.map(([k,l,x])=>[l,+((P.oth||{})[k]||0),fmt((+((P.oth||{})[k]||0))*x)])))}
  ${sec(`Quests (${Q.filter(q=>qDone(q.n)).length}/${Q.length})`,tbl(['Group','Quest','Done'],Q.map(q=>[e(q.g),e(q.n),qDone(q.n)?'yes':''])))}
  ${sec('Syndicates',tbl(['Syndicate','Rank','Title','Standing','Source'],syn))}
  ${sec('Helminth',`<p>${MI.filter(i=>on('hel|'+i.n)).map(i=>e(i.n)).join(', ')||'None ticked'}</p>`)}
  ${sec('Goals',`<p>${(P.goals||[]).map(e).join(', ')||'None'}</p>`)}
  ${sec('Inventory',tbl(['Material','Count'],Object.entries(P.inv||{}).map(([k,v])=>[e(k),fmt(v)])))}
  ${sec('Last sync',`<pre>${e(JSON.stringify(P.lastSync||null,null,1))}</pre>`)}
  ${sec('Raw data',`<details><summary>Show</summary><pre>${e(JSON.stringify({v:3,c:C,p:P}))}</pre></details>`)}
  </body></html>`}
function saveFile(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('Saved '+name)}

