/* ---------- details: a full page for any one thing (tennoform.com/details/?k=mod|Serration) ----------
   Farm finder's pop-up shows the short version; "More details" opens this page with everything known about it:
   what it is, where to get it, prices, stats, what uses it and where to read more. Each page has its own address,
   so it can be bookmarked or shared, and Back returns to the page before it, as it was left. */
const DET_KIND={item:'Gear',part:'Part',mod:'Mod',arc:'Arcane',res:'Resource',relic:'Relic',ow:'Open world',place:'Place',way:'Farming guide'};
const detKey=()=>{if(HASH()!=='#details')return '';try{return new URLSearchParams(location.search).get('k')||''}catch(e){return ''}};
const DETC={key:'',html:''};
function detailsData(){const k=detKey();const i=k.indexOf('|');const t=i>0?k.slice(0,i):'',n=i>0?k.slice(i+1):'';
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
function openDetails(k){if(!k)return;const url='/details/?k='+encodeURIComponent(k);
  if(HASH()==='#details'){if(detKey()===k)return;history.pushState(null,'',url);window.scrollTo(0,0);tfNotify();return}
  history.pushState(null,'',url);window.scrollTo(0,0);setTimeout(()=>dispatchEvent(new HashChangeEvent('hashchange')),0)}
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
