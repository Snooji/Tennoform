/* ---------- friends & clan ---------- */
function summarize(raw){const j=raw.Results&&raw.Results[0]?raw.Results[0]:raw;const xpi=(j.LoadOutInventory&&j.LoadOutInventory.XPInfo)||findKey(j,'XPInfo',0)||[];const mis=j.Missions||[];const sk=j.PlayerSkills||{};
  const cat={};let gear=0,maxed=0;for(const e of xpi){const n=U[e.ItemType];if(!n)continue;const it=I[n];const k=perRank(it)===200?1000:500;const r=Math.min(maxRank(it),Math.floor(Math.sqrt((e.XP||0)/k)));const x=r*perRank(it);gear+=x;cat[it.c]=(cat[it.c]||0)+x;if(r>=maxRank(it))maxed++}
  let ch=0,sp=0,nodes=0,spn=0;for(const m of mis){const nd=NX[m.Tag];if(!nd)continue;if(m.Completes>0){ch+=nd.x;nodes++}if(m.Tier===1){sp+=nd.x;spn++}}
  let intr=0;for(const s in sk)if(/^LPS_/.test(s)&&typeof sk[s]==='number')intr+=sk[s]*1500;
  const syn=(j.Affiliations||[]).map(a=>({n:SYN[a.Tag]||pretty(a.Tag),t:a.Title||0})).sort((a,b)=>b.t-a.t).slice(0,3);
  return {name:j.DisplayName||j.displayName||'Tenno',mr:j.PlayerLevel??null,gear,maxed,ch,sp,nodes,spn,intr,total:gear+ch+sp+intr,cat,syn,at:new Date().toISOString()}}
function friendsTab(){const F=P.friends||[];const t=totalXP();const me={name:'You',mr:mrInfo(t.total).mr,total:t.total,gear:t.it,maxed:MI.filter(i=>itemXP(i.n)>=mxp(i)).length,nodes:ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,spn:ALLN.filter(n=>!isJ(n)&&on('sp|'+n.id)).length,intr:t.intr,cat:Object.fromEntries(CATS.map(c=>[c,catXP(c)]))};
  const all=[me,...F];const best=k=>Math.max(...all.map(x=>+x[k]||0));
  const row=(lab,k,f)=>`<div class="fl">${lab}</div>${all.map(x=>`<div class="c mono${(+x[k]||0)===best(k)&&best(k)>0?' top':''}">${f?f(x[k]):fmt(x[k])}</div>`).join('')}`;
  return `<div class="panel stack cut"><h2>Friends & clan</h2><p class="small muted" style="margin:0">Compare yourself with friends or clanmates. Paste their profile page (from the same link you use for yourself) or their 24-character ID${HOSTED&&window.TENNO_PROXY?'':' — IDs only load automatically on the hosted site with the sync relay set up'}.</p>
  <textarea id="frin" placeholder="Paste a profile page or an account ID"></textarea><div class="row"><button class="btn primary" id="fradd">Add to comparison</button></div><div class="small muted" id="frmsg"></div></div>
  ${F.length?`<div class="panel cut" style="overflow-x:auto"><div class="ftbl" style="grid-template-columns:minmax(120px,1fr) repeat(${all.length},minmax(80px,auto))"><div class="h"></div>${all.map((x,i)=>`<div class="h c">${esc(x.name)}${i?`<br><button class="btn sm" data-frdel="${i-1}" aria-label="Remove ${esc(x.name)}">Remove</button>`:''}</div>`).join('')}
   ${row('Mastery rank','mr',v=>v==null?'—':mrLabel(v))}${row('Total XP','total')}${row('Gear XP','gear')}${row('Items mastered','maxed')}${row('Nodes','nodes')}${row('Steel Path nodes','spn')}${row('Intrinsics XP','intr')}
   ${CATS.filter(c=>all.some(x=>x.cat&&x.cat[c])).map(c=>`<div class="fl small muted">${esc(c)}</div>${all.map(x=>`<div class="c mono small">${fmt(x.cat&&x.cat[c])}</div>`).join('')}`).join('')}</div>
   <div class="small muted" style="margin-top:8px">Friends' data is a snapshot from when you added them${F[0].at?' (oldest '+fdate(F.reduce((a,x)=>x.at<a?x.at:a,F[0].at))+')':''}. Add them again to refresh.</div></div>`:''}`}
async function addFriend(txt){txt=String(txt||'').trim();const msg=m=>{const el=$('#frmsg');if(el)el.textContent=m;toast(m)};if(!txt)return;
  let raw=null;try{raw=JSON.parse(txt)}catch(e){}
  if(!raw){const id=findId(txt);if(!id)return msg('Paste a profile page or a 24-character ID.');
    try{let j=null;if(window.TENNO_PROXY){j=await netJSON('relay',window.TENNO_PROXY+'?playerId='+id);if(!(j&&j.Results))j=null}
      if(!j){j=fromParsed(await netJSON('relay','https://api.warframestat.us/profile/'+id+'/?language=en'))}
      if(!j)throw 0;raw=j}catch(e){if(e instanceof NetErr&&e.kind!=='network'&&e.kind!=='http')return msg(e.message);return msg('Couldn\'t load that ID from here. Open https://api.warframe.com/cdn/getProfileViewingData.php?playerId='+id+' and paste the page instead.')}}
  const s=summarize(raw);if(!s.total)return msg('No ranks found in that data.');P.friends=(P.friends||[]).filter(f=>f.name!==s.name);P.friends.push(s);saveProfile();render();toast('Added '+s.name)}

