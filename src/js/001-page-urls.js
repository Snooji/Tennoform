/* ---------- page addresses: every page has its own URL (tennoform.com/farm/) so search engines can list it ----------
   The app grew up on #hash routes, so it still navigates by setting location.hash. A route hash is turned straight into
   a path here, before any other hashchange listener runs, and HASH() gives back the old '#route' form for code that reads it.
   Old #links, bookmarks and shared links keep working. build/make_site.py writes a page for each route below. */
const PAGE_ROUTES=['home','today','ranks','synd','goals','tenno','missions','resources','mastery','frames','farm','quests','market','arsenal','relics',
  'world','tasks','friends','donate','feedback','about','admin','achievements','guides','collection','chat'];
const PAGE_SET=new Set(PAGE_ROUTES);
const pathRoute=()=>{const p=location.pathname.replace(/^\/+|\/+$/g,'').toLowerCase();return PAGE_SET.has(p)?p:''};
const hashRoute=()=>{const h=location.hash.slice(1);return PAGE_SET.has(h)?h:''};
const routePath=r=>!r||r==='home'?'/':'/'+r+'/';
/** The current page as '#route' ('' on the home page), the way location.hash used to read. */
function HASH(){const r=hashRoute()||pathRoute();return r&&r!=='home'?'#'+r:r==='home'?'#home':''}
/** Go to a page without reloading. */
function GO(r){r=String(r||'').replace(/^[#/]+|\/+$/g,'')||'home';if(r===(HASH().slice(1)||'home'))return;
  history.pushState(null,'',routePath(r)+location.search);
  // like a hash change, the page renders on the next task, so code after GO() still runs first
  setTimeout(()=>dispatchEvent(new HashChangeEvent('hashchange')),0)}
/* a route hash (a #link, a bookmark, or code setting location.hash) becomes the page's path */
function hashToPath(){const r=hashRoute();if(!r)return false;history.replaceState(history.state,'',routePath(r)+location.search);return true}
let ROUTE_AT=hashRoute()||pathRoute()||'home';
hashToPath();
addEventListener('hashchange',e=>{if(!hashToPath())return;const r=HASH().slice(1)||'home';
  // same page as before (the old code set the hash it was already on): nothing changes, as before
  if(r===ROUTE_AT)e.stopImmediatePropagation()});
addEventListener('hashchange',()=>{ROUTE_AT=HASH().slice(1)||'home'});
/* back and forward between pages */
addEventListener('popstate',()=>{if(hashRoute())return;const r=HASH().slice(1)||'home';if(r!==ROUTE_AT)dispatchEvent(new HashChangeEvent('hashchange'))});
/* same-site links to a page (/farm/) open in place; ctrl/cmd/middle click still opens a new tab */
document.addEventListener('click',e=>{if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
  let u;try{u=new URL(a.href)}catch(x){return}if(u.origin!==location.origin||u.hash)return;
  const p=u.pathname.replace(/^\/+|\/+$/g,'');if(p&&!PAGE_SET.has(p))return;e.preventDefault();GO(p||'home')});
