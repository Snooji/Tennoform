/* ---------- bridge: what the React shell reads and calls. Logic stays here; the shell only renders it. ---------- */
function tfNotify(){try{window.dispatchEvent(new CustomEvent('tf:update'))}catch(e){}}
window.TF={
  state(){const t=totalXP(),m=mrInfo(t.total);const r=(location.hash||'#home').slice(1);const key=routes[r]?r:'home';const pl=placeOf(key);const on=signedIn();
    return {route:key,title:SUBL[key]||PL[key]||'Home',place:pl?{id:pl[0],label:pl[1]}:null,
      mr:m.mr,mrLabel:(m.mr>30?'Legendary ':'MR ')+mrLabel(m.mr),nextLabel:m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1),xp:t.total,next:m.next,pct:m.pct,toNext:Math.max(0,m.next-t.total),
      name:P.tname||(P.prof&&P.prof.name)||'',signedIn:on,canAcct:canAcct(),acctName:on?(acct.name||acct.email||''):'',acctEmail:on?(acct.email||''):'',
      admin:!!FBK.admin,unread:SO.uid?(unread().n||0):0,theme:themeGet(),demo:!!DEMO,isNew:isNew()}},
  nav(){return PLACES.map(p=>({id:p[0],label:p[1],pages:p[3].map(r=>({route:r,label:SUBL[r]||PL[r]}))}))},
  menu(){return MENU.map(([r,l])=>({route:r,label:l}))},
  search(q){return cmdFind(q).map(e=>({name:e.n,group:e.g,act:e.act,sub:e.g==='Gear'?I[e.n].c:e.g==='Pages'?'Page':e.g.replace(/s$/,''),img:e.g==='Gear'&&I[e.n].img?'https://cdn.warframestat.us/img/'+encodeURIComponent(I[e.n].img):''}))},
  open:act=>cmdGo({act}),
  go:route=>{if(location.hash==='#'+route)render();else location.hash=route},
  google:()=>{if(!FB){toast('Sign-in is still loading. Try again in a moment.');return}signGoogle()},
  signOut:()=>{flushNow();if(FB)FB.auth.signOut();toast('Signed out. Your progress stays on this device too.')},
  account:()=>{state.tTab='account';saveUI();if(location.hash==='#tenno')render();else location.hash='tenno'},
  theme:t=>themeSet(t),
  logo:()=>LOGO_HTML(),
  share:()=>shareCard(),
  keys:()=>keysOpen(),
  refresh:()=>rerender()
};
