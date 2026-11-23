/* ---------- Inside the Tennoform app (Capacitor) ----------
   Only runs when the page is inside the iPhone or Android app; the website is unchanged.
   - Google sign-in goes through the phone's own Google sign-in (Google blocks its sign-in page inside apps);
     Sign in with Apple is offered on iPhone (App Store rule 4.8). Both hand Firebase a credential, so the
     account, its saved progress and its uploaded profile data are the same as on the website.
   - No outside payment links (store rules): PayPal is hidden.
   - Haptics, the share sheet and Android's back button use the phone's own. */
const NATIVE=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());
if(NATIVE){const CP=Capacitor.Plugins||{};const plat=Capacitor.getPlatform();
  document.documentElement.classList.add('tf-native','tf-'+plat);
  if(typeof DONATE!=='undefined')DONATE.paypal='';
  const FA=CP.FirebaseAuthentication;
  const nativeSign=async(kind)=>{if(!FB){toast('Sign-in is still loading. Try again in a moment.');return}if(!FA){toast('Sign-in isn\'t set up in this version of the app.');return}
    try{if(kind==='google'){const r=await FA.signInWithGoogle({skipNativeAuth:true});const tok=r&&r.credential&&r.credential.idToken;if(!tok)return;
        await FB.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(tok))}
      else{const r=await FA.signInWithApple({skipNativeAuth:true});const c=r&&r.credential;if(!c||!c.idToken)return;
        const pr=new firebase.auth.OAuthProvider('apple.com');await FB.auth.signInWithCredential(pr.credential({idToken:c.idToken,rawNonce:c.nonce}))}}
    catch(e){if(!/cancel/i.test(String(e&&(e.code||e.message)||'')))toast(typeof authMsg==='function'?authMsg(e):'Sign-in didn\'t work. Try again.')}};
  signGoogle=()=>nativeSign('google');
  window.TF.apple=()=>nativeSign('apple');
  const LN=CP.LocalNotifications;
  if(LN){window.TF_NATIVE_PERM='default';
    const perm=async()=>{try{const r=await LN.checkPermissions();window.TF_NATIVE_PERM=r.display==='granted'?'granted':r.display==='denied'?'denied':'default'}catch(e){}tfNotify()};perm();
    ntfEnable=async function(){let r;try{r=await LN.requestPermissions()}catch(e){r={display:'denied'}}window.TF_NATIVE_PERM=r.display==='granted'?'granted':'denied';
      if(r.display!=='granted'){toast('Notifications are off for Tennoform. Turn them on in your phone\'s Settings, then try again.');ntfSet({on:false});return false}ntfSet({on:true});return true};
    ntfShow=async function(title,body,conv,url){if(document.visibilityState==='visible'){if(!ntfViewing(conv))toast(title+': '+body.slice(0,90));return}
      if(window.TF_NATIVE_PERM!=='granted')return;try{await LN.schedule({notifications:[{id:Math.floor(Math.random()*9e4)+1000,title,body:body.slice(0,180),extra:{url}}]})}catch(e){}}}
  if(CP.Haptics){navigator.vibrate=()=>{try{CP.Haptics.impact({style:'LIGHT'})}catch(e){}return true}}
  if(CP.Share){navigator.share=d=>CP.Share.share({title:d&&d.title,text:d&&d.text,url:d&&d.url,dialogTitle:'Share'});navigator.canShare=()=>true}
  if(CP.App&&plat==='android')CP.App.addListener('backButton',({canGoBack})=>{const h=HASH();if(h&&h!=='#home'&&canGoBack)history.back();else CP.App.exitApp()});
  /* tennoform.com links opened from outside land on the right page (universal links / app links) */
  if(CP.App)CP.App.addListener('appUrlOpen',e=>{try{const u=new URL(e.url);if(!/(^|\.)tennoform\.com$/.test(u.hostname))return;const k=keyFromPath(u.pathname);
    if(k){openDetails(k);return}const r=u.pathname.replace(/^\/+|\/+$/g,'');GO(PAGE_SET.has(r)?r:'home')}catch(x){}});
  /* ask for a rating after a rank-up, once they've used the app on 3 different days; at most every 120 days */
  const RV=CP.InAppReview;if(RV){const day=new Date().toISOString().slice(0,10);let st={};try{st=JSON.parse(localStorage.getItem('tf-review')||'{}')}catch(e){}
    st.days=st.days||[];if(!st.days.includes(day))st.days=[...st.days,day].slice(-10);const keep=()=>{try{localStorage.setItem('tf-review',JSON.stringify(st))}catch(e){}};keep();
    let t=0;window.addEventListener('tf:update',()=>{clearTimeout(t);t=setTimeout(()=>{const mr=mrInfo(totalXP().total).mr;if(st.mr==null){st.mr=mr;keep();return}
      if(mr>st.mr){st.mr=mr;const ok=st.days.length>=3&&(!st.asked||Date.now()-st.asked>120*864e5);if(ok){st.asked=Date.now();try{RV.requestReview()}catch(e){}}keep()}},1500)})}
  if(CP.StatusBar){try{CP.StatusBar.setOverlaysWebView({overlay:true});CP.StatusBar.setStyle({style:'DARK'})}catch(e){}}
  if(CP.SplashScreen)window.addEventListener('load',()=>setTimeout(()=>{try{CP.SplashScreen.hide()}catch(e){}},200))}
