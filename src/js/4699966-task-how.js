/* ---------- to-do list: a line under each task saying where to go or how to start it ---------- */
const drTop=(dr,n)=>(dr||[]).slice(0,n||2).map(([w,c])=>c!=null&&c<100?`${w} (${c}%)`:w).join('; ');
function taskHow(x){const k=x.k,r=x.r;if(!r)return '';try{
  if(k==='res')return strip(farmFor(r));
  if(k==='item'||k==='build'){const it=I[r];if(!it)return '';if(it.bprel)return 'Blueprint and parts drop from Void Relics: open it for the relics';
    const bp=it.bpd&&it.bpd.length?drTop(it.bpd):it.bc?`Blueprint in the Market for ${fmt(it.bc)} credits`:it.dr&&it.dr.length?drTop(it.dr):'';
    const part=(it.parts||[]).find(p=>p.k==='p'&&p.dr&&p.dr.length);return [bp,part?part.n+': '+drTop(part.dr,1):''].filter(Boolean).join(' · ')}
  if(k==='relic'){const R=REL[r];if(!R)return '';return R.v?'Vaulted: buy or trade for it (or wait for Prime Resurgence)':R.loc&&R.loc.length?drTop(R.loc):''}
  if(k==='mod')return MODS[r]?drTop(MODS[r].dr):'';
  if(k==='arc')return ARC[r]?drTop(ARC[r].dr):'';
  if(k==='quest'){const q=Q.find(y=>y.n===r);return q?(q.req&&q.req.length?'To start: '+q.req.join('; '):'Start it from the Codex in your Orbiter (Quests tab)'):''}
  if(k==='node')return `Open ${r} on the Star chart`;
  if(k==='fish'||k==='ore'||k==='animal'){const e=typeof owIndex==='function'&&owIndex()[r];if(!e)return '';
    if(e.kind==='Fish')return `${e.reg}: ${(e.f.spots||[])[0]||e.f.bio||''}${e.f.time?' · '+e.f.time.split(' (')[0]:''}`;
    if(e.kind==='Animal')return `${e.reg}: ${e.a.where||''}`;
    const R=D.mine.reg[e.reg]||{};return `${e.reg}: ${(R.spots||[])[0]||'mine '+(e.kind==='Ore'?'red':'blue')+' veins'}`}
  if(k==='synd')return 'Earn standing, then spend it at the syndicate';
  if(k==='way'){const w=typeof WBN!=='undefined'&&WBN[r];return w&&w.sum?w.sum:''}
  if(k==='guide'){const g=typeof GIDX!=='undefined'&&GIDX[r];return g&&g.steps&&g.steps[0]?g.steps[0].t:''}
  }catch(e){}return ''}
{const _t=tasksData;tasksData=function(){const d=_t();const by=Object.fromEntries((P.tasks||[]).map(x=>[x.id,x]));
  for(const y of d.list){const x=by[y.id];y.how=x?String(taskHow(x)||'').slice(0,220):''}return d}}
