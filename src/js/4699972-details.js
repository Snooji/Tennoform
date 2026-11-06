/* ---------- details: a full page for any one thing (tennoform.com/details/?k=mod|Serration) ----------
   Farm finder's pop-up shows the short version; "More details" opens this page with everything known about it:
   what it is, where to get it, prices, stats, what uses it and where to read more. Each page has its own address,
   so it can be bookmarked or shared, and Back returns to the page before it, as it was left. */
const DET_KIND={item:'Gear',part:'Part',mod:'Mod',arc:'Arcane',res:'Resource',relic:'Relic',ow:'Open world',place:'Place',way:'Farming guide'};
/* item, mod, arcane, relic, resource and enemy pages have their own address (/mod/serration/); the rest use /details/?k=...
   seoSlug must match slug() in build/seo_pages.py. Each written page names its thing in <meta name="tf-key">. */
const DET_SEG={item:'item',mod:'mod',arc:'arcane',relic:'relic',res:'resource',enemy:'enemy'};
const seoSlug=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/['\u2019]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const SEOK={},SEO_T={};{const m=document.querySelector('meta[name="tf-key"]');if(m){SEOK[location.pathname]=m.content;SEO_T[m.content]=document.title}}
function keyFromPath(path){if(SEOK[path])return SEOK[path];const m=/^\/([a-z]+)\/([a-z0-9-]+)\/?$/.exec(path);if(!m)return '';
  const t=Object.keys(DET_SEG).find(k=>DET_SEG[k]===m[1]);if(!t)return '';
  if(t==='enemy'&&!LAZY.enemies.done){lazyLoad('enemies');return 'enemy|'+m[2]}
  const all={item:I,mod:MODS,arc:ARC,relic:REL,res:RES,enemy:typeof ENM!=='undefined'?ENM:{}}[t]||{};
  const n=Object.keys(all).find(x=>seoSlug(x)===m[2]);return n?(SEOK[path]=t+'|'+n):''}
function detPath(k){const i=k.indexOf('|'),t=k.slice(0,i),n=k.slice(i+1);
  if(DET_SEG[t]&&seoSlug(n)){const p='/'+DET_SEG[t]+'/'+seoSlug(n)+'/';SEOK[p]=k;return p}return '/details/?k='+encodeURIComponent(k)}
const detKey=()=>{if(HASH()!=='#details')return '';try{return new URLSearchParams(location.search).get('k')||keyFromPath(location.pathname)}catch(e){return ''}};
/* the tab title and canonical address follow the thing on show (a written page keeps its own, fuller title) */
function detHead(k){if(!k)return;const n=k.slice(k.indexOf('|')+1);document.title=SEO_T[k]||n+' · Tennoform';
  const c=document.querySelector('link[rel="canonical"]');if(c&&DET_SEG[k.slice(0,k.indexOf('|'))])c.href='https://tennoform.com'+detPath(k)}
const DETC={key:'',html:''};
function detailsData(){const k=detKey();detHead(k);const i=k.indexOf('|');const t=i>0?k.slice(0,i):'',n=i>0?k.slice(i+1):'';
  if(!t||!n)return {key:'',kind:'',name:'',found:false};
  if(t==='mod'||t==='arc'){if(!MDI.data)loadModInfo()}
  const ck=k+'|'+ISLV+'|'+(MDI.data?1:0)+'|'+(typeof ST!=='undefined'&&ST.data?1:0);
  if(DETC.key!==ck){DETC.key=ck;DETC.html=t==='mod'||t==='arc'||t==='way'?'':(()=>{try{return detail(k)}catch(e){return ''}})()}
  const it=I[n];const md=t==='mod'?MODS[n]:t==='arc'?ARC[n]:null;
  /* the builds that use a mod, and the builds for a piece of gear */
  const used=t==='mod'||t==='arc'?[...new Set([...(keyMods().find(x=>x.n===n)||{s:new Set()}).s,...allBuilds().filter(b=>(b.arcanes||[]).includes(n)).map(b=>b.item)])].sort():[];
  const builds=t==='item'?allBuilds().filter(b=>b.item===n||bFits(b).includes(n)).length:0;
  const wiki=(it&&it.w)||(t==='mod'||t==='arc'||t==='res'||t==='relic'?'https://wiki.warframe.com/w/'+encodeURIComponent((t==='relic'?n+' Relic':n).replace(/ /g,'_')):'');
  const found=!!(it||md||(t==='res'&&RES[n])||(t==='relic'&&REL[n])||DETC.html||(t==='way'));
  return {key:k,kind:t,kindLabel:DET_KIND[t]||'',name:n,found,img:IMG(it?n:''),cat:it?it.c||'':md?md.ty||'':'',html:DETC.html,wiki,used,builds,
    way:t==='way'&&typeof wayData==='function'?wayData(n):null}}
function openDetails(k){if(!k)return;const url=detPath(k);
  if(HASH()==='#details'){if(detKey()===k&&location.pathname+location.search===url)return;history.pushState(null,'',url);window.scrollTo(0,0);tfNotify();return}
  history.pushState(null,'',url);window.scrollTo(0,0);setTimeout(()=>dispatchEvent(new HashChangeEvent('hashchange')),0)}
/* a link to one of those pages (/mod/serration/) opens in place */
function openPath(p){const k=keyFromPath(p);if(k)openDetails(k);else location.href=p}
/* moving between two details pages with Back or Forward keeps the same route, so redraw for the new ?k= */
addEventListener('popstate',()=>{if(HASH()==='#details')tfNotify()});
routes.details=function(){return ''};
SUBL.details='Details';

/* ---------- Back: return to the page before this one inside Tennoform, exactly as it was left ---------- */
const NAVS=[location.pathname+location.search];
{const _ps=history.pushState.bind(history);history.pushState=function(st,t,u){_ps(st,t,u);const now=location.pathname+location.search;if(NAVS[NAVS.length-1]!==now)NAVS.push(now);tfNotify()}}
addEventListener('popstate',()=>{const now=location.pathname+location.search;if(NAVS.length>1&&NAVS[NAVS.length-2]===now)NAVS.pop();else if(NAVS[NAVS.length-1]!==now)NAVS.push(now);tfNotify()});
{const _st=TF.state;TF.state=function(){const s=_st.apply(this,arguments);s.canBack=NAVS.length>1;if(s.route==='details'){const k=detKey();s.title=k?k.slice(k.indexOf('|')+1):'Details'}return s}}
Object.assign(window.TF,{details:()=>detailsData(),openDetails:k=>openDetails(k),back:()=>{if(NAVS.length>1)history.back();else GO('home')}});
