
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
const PAGES=[['home','Hub'],['today','Today'],['ranks','Ranks'],['synd','Syndicates'],['quests','Quests'],['missions','Star Chart'],['resources','Resources'],['goals','Goals'],['relics','Relics'],['mastery','MR Plan'],['tenno','Tenno'],['frames','Warframes'],['arsenal','Arsenal'],['world','Fishing & Mining'],['farm','Farm Finder'],['market','Market'],['tasks','Tasks'],['achievements','Achievements'],['friends','Friends'],['donate','Support'],['feedback','Feedback'],['about','About']];
const ICON={squad:'M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm9 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM1 21v-1c0-3.9 3.1-7 7-7s7 3.1 7 7v1zm15.4-7.9c3.2.2 5.6 2.8 5.6 6V21h-5v-1c0-2.6-.9-5-2.5-6.7.6-.1 1.2-.2 1.9-.2z',me:'M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-9 10c0-5 4-8 9-8s9 3 9 8z',tasks:'M9 4h11v2H9zm0 7h11v2H9zm0 7h11v2H9zM3.5 3.5l1.5 1.5 3-3 1 1-4 4-2.5-2.5zm0 7l1.5 1.5 3-3 1 1-4 4-2.5-2.5zM4 17h3v3H4z',home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',tenno:'M12 2a5 5 0 0 1 5 5v3l3 3-3 1v6h-4v-4h-2v4H7v-6l-3-1 3-3V7a5 5 0 0 1 5-5z',missions:'M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z',resources:'M12 2l9 5v10l-9 5-9-5V7zm0 3.3L6 8.6v6.8l6 3.3 6-3.3V8.6z',ranks:'M4 20h4V10H4zm6 0h4V4h-4zm6 0h4v-7h-4z',today:'M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm-2 8h14v10H5z',quests:'M6 2h10l4 4v16H6zm3 7h8v2H9zm0 4h8v2H9zm0 4h5v2H9z'};
/* Five places. Every page belongs to one; the place link reopens the last page used in it. */
const PLACES=[['home','Home','home',['home']],['plan','Plan','ranks',['ranks','mastery','goals','tasks','missions','quests']],['farm','Farm','farm',['farm','resources','relics','world','market','arsenal','frames']],['today','Today','today',['today','synd','achievements']],['squad','Squad','friends',['friends']]];
const PICON={home:'home',plan:'ranks',farm:'resources',today:'today',squad:'squad'};
const SUBL={ranks:'Ranks',mastery:'MR plan',goals:'Goals',tasks:'Tasks',missions:'Star chart',quests:'Quests',farm:'Farm finder',resources:'Resources',relics:'Relics',world:'Open worlds',market:'Market',arsenal:'Builds',frames:'Warframes',today:'Today',synd:'Syndicates',achievements:'Achievements'};
const MENU=[['tenno','Profile & account'],['donate','Support Tennoform'],['feedback','Feedback'],['about',"About & what's new"]];
const BAR=PLACES.flatMap(p=>p[3]);
const PL=Object.fromEntries(PAGES);PL.admin='Backend';
const GROUPS=PLACES.filter(p=>p[3].length>1).map(p=>[p[1],p[3]]).concat([['More',MENU.map(m=>m[0])]]);
function placeOf(r){return PLACES.find(p=>p[3].includes(r))||null}
function placeLast(p){const m=lsGet('tf-place',{})||{};return p[3].includes(m[p[0]])?m[p[0]]:p[2]}
function navPaint(key){const pl=placeOf(key);if(pl&&pl[3].length>1){const m=lsGet('tf-place',{})||{};m[pl[0]]=key;lsSet('tf-place',m)}
  document.querySelectorAll('[data-place]').forEach(a=>{const p=PLACES.find(x=>x[0]===a.dataset.place);a.setAttribute('href','#'+placeLast(p));if(pl&&pl[0]===p[0])a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function subnav(key){const pl=placeOf(key);if(!pl||pl[3].length<2)return'';
  return `<nav class="subnav" aria-label="${esc(pl[1])}">${pl[3].map(r=>`<a href="#${r}"${r===key?' aria-current="page"':''}>${SUBL[r]||PL[r]}</a>`).join('')}</nav>`}
const navIcon=k=>`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="${ICON[k]}"/></svg>`;
$('nav.tabs').innerHTML=PLACES.map(p=>`<a href="#${p[2]}" data-place="${p[0]}">${p[1]}</a>`).join('');
$('.bnav').innerHTML=PLACES.map(p=>`<a href="#${p[2]}" data-place="${p[0]}">${navIcon(PICON[p[0]])}${p[1]}</a>`).join('');
function menuHTML(){const who=signedIn()?`<div class="mehead small muted">Signed in as <b>${esc(acct.name||acct.email||'you')}</b></div>`:canAcct()?signBlock('inmenu'):'<div class="mehead small muted">Progress is saved on this device</div>';
  return `${who}${typeof FBK!=='undefined'&&FBK.admin?'<a href="#admin">Backend</a>':''}${MENU.map(([r,l])=>`<a href="#${r}">${l}</a>`).join('')}${signedIn()?'<button type="button" class="melink" id="lgout">Sign out</button>':''}<div class="mefoot small">Theme ${themeSw()}</div>`}
function setMenu(o){const d=$('#drawer');if(o)$('#sheet').innerHTML=menuHTML();d.classList.toggle('open',o);$('#hamb').setAttribute('aria-expanded',o?'true':'false');if(o)setTimeout(()=>{const a=$('#sheet a');a&&a.focus()},30)}
$('#hamb').addEventListener('click',()=>setMenu(!$('#drawer').classList.contains('open')));
$('#sheet').addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

