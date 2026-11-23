/* ---------- Settings: one place for appearance, notifications, detail level, account, data and about ----------
   The pieces already exist (dialogs, Profile tabs); this page gathers them and shows what data is installed. */
routes.settings=function(){return ''};
SUBL.settings='Settings';
if(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()&&Capacitor.Plugins&&Capacitor.Plugins.App)
  Capacitor.Plugins.App.getInfo().then(i=>{window.TF_APPVER=i.version+' ('+i.build+')';tfNotify()}).catch(()=>{});
Object.assign(window.TF,{settings:()=>({
  gameData:(D.meta.wfcd?'v'+D.meta.wfcd+', ':'')+D.meta.built,prices:D.meta.prices,
  signedIn:signedIn(),email:(acct&&acct.kind==='fb'&&acct.email)||'',canAcct:canAcct(),
  profileFile:P.auto?fdate(P.auto):'',native:!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()),
  appVersion:window.TF_APPVER||'',notes:Object.keys(P.notes||{}).length,pins:(P.pins||[]).length})});
