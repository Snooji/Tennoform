
(function(){
if(/(^|\.)tennoform\.com$|github\.io$/.test(location.hostname)&&window.top!==window.self){try{window.top.location.replace(location.href)}catch(e){}document.documentElement.innerHTML='';return}
document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&/cdn\.warframestat\.us|githubusercontent/.test(t.src||''))t.remove()},true);
const D=JSON.parse(document.getElementById('data').textContent);
const I=D.items, REL=D.relics, MODS=D.mods, ARC=D.arcanes, RES=D.res, PR=D.prices, MS=D.mslug, M=D.mastery, Q=D.quests, NODES=D.nodes, ALLN=D.allnodes, RT=D.rtiers, RSRC=D.rsrc, VAULT=D.vault, SEL=D.sellers;
const U={};for(const n in I)U[I[n].u]=n;
const QU={};Q.forEach(q=>{if(q.u)QU[q.u]=q.n});
const NX={};ALLN.forEach(n=>NX[n.id]=n);
const $=s=>document.querySelector(s);
const HOSTED=!(window.claude&&window.claude.use);
const STANDALONE=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n==null||n===''||isNaN(n)?'—':Number(Math.round(n)).toLocaleString('en-US');
const hrs=s=>{if(!s)return'instant';const h=s/3600;return h>=24?(+(h/24).toFixed(1))+' d':(+h.toFixed(1))+' h'};
const fdate=s=>{if(!s)return'';const d=new Date(s.length===10?s+'T12:00:00Z':s);return isNaN(d)?'':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
const RAR={C:'Common',U:'Uncommon',R:'Rare'};
const ERA_TIP={Lith:'Hepit, Void (Capture)',Meso:'Ukko, Void (Capture) or Io, Jupiter (Defense)',Neo:'Ukko, Void (Capture) or Mot, Void (Survival)',Axi:'Apollo, Lua (Disruption)',Requiem:'Kuva Lich / Sister requiem drops'};
const PAGES=[['home','Hub'],['today','Today'],['ranks','Ranks'],['synd','Syndicates'],['quests','Quests'],['missions','Star Chart'],['resources','Resources'],['goals','Goals'],['relics','Relics'],['mastery','MR Plan'],['tenno','Tenno'],['frames','Warframes'],['arsenal','Arsenal'],['world','Fishing & Mining'],['farm','Farm Finder'],['market','Market'],['tasks','Tasks'],['friends','Friends'],['donate','Support'],['feedback','Feedback'],['about','About']];
const BAR=['home','today','ranks','tasks'];
const ICON={tasks:'M9 4h11v2H9zm0 7h11v2H9zm0 7h11v2H9zM3.5 3.5l1.5 1.5 3-3 1 1-4 4-2.5-2.5zm0 7l1.5 1.5 3-3 1 1-4 4-2.5-2.5zM4 17h3v3H4z',home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',tenno:'M12 2a5 5 0 0 1 5 5v3l3 3-3 1v6h-4v-4h-2v4H7v-6l-3-1 3-3V7a5 5 0 0 1 5-5z',missions:'M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z',resources:'M12 2l9 5v10l-9 5-9-5V7zm0 3.3L6 8.6v6.8l6 3.3 6-3.3V8.6z',ranks:'M4 20h4V10H4zm6 0h4V4h-4zm6 0h4v-7h-4z',today:'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm-2 8h14v10H5z',quests:'M6 2h10l4 4v16H6zm3 7h8v2H9zm0 4h8v2H9zm0 4h5v2H9z'};
const TOP=['home','today','ranks','tasks','friends','missions','relics','market'];
const GROUPS=[['Progress',['home','today','ranks','mastery','goals','tenno']],['World',['missions','quests','synd','world']],['Gear',['frames','arsenal']],['Farm & trade',['resources','farm','relics','market']],['Community',['tasks','friends','feedback','donate','about']]];
const PL=Object.fromEntries(PAGES);
$('nav.tabs').innerHTML=TOP.map(r=>`<a href="#${r}">${PL[r]}</a>`).join('');
$('.bnav').innerHTML=BAR.map(r=>`<a href="#${r}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="${ICON[r]}"/></svg>${PAGES.find(p=>p[0]===r)[1]}</a>`).join('')+`<button type="button" id="menu" aria-haspopup="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>Menu</button>`;
$('#sheet').innerHTML=GROUPS.map(([g,rs])=>`<div class="mg"><div class="mgh">${g}</div>${rs.filter(r=>PL[r]).map(r=>`<a href="#${r}">${PL[r]}</a>`).join('')}</div>`).join('');
function setMenu(o){$('#drawer').classList.toggle('open',o);$('#hamb').setAttribute('aria-expanded',o?'true':'false')}
$('#hamb').addEventListener('click',()=>setMenu(!$('#drawer').classList.contains('open')));
$('#sheet').addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

