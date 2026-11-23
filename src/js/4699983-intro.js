/* ---------- First run in the app (or the installed web app): three short screens before the welcome ----------
   1 what Tennoform does, 2 where you play (picks the profile server), 3 alerts (asked only if they want them). */
const INTRO_KEY='tf-intro';
Object.assign(window.TF,{
  intro:()=>{let seen=false;try{seen=!!localStorage.getItem(INTRO_KEY)}catch(e){}
    const app=!!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())||STANDALONE||/[?&]intro=1/.test(location.search);
    return {show:app&&!seen&&isNew(),plats:WF_PLATS.map(p=>({id:p[0],label:p[1]})),plat:P.wfPlat||'pc'}},
  introPlat:id=>{P.wfPlat=id==='pc'?'':id;saveProfile();tfNotify()},
  introDone:()=>{try{localStorage.setItem(INTRO_KEY,'1')}catch(e){}tfNotify()}
});
