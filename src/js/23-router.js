/* ---------- router ---------- */
const routes={home,today,ranks,synd,goals,tenno,missions,resources,mastery,frames,farm,quests,market,arsenal,relics:relicsPage,world,tasks,friends,donate,feedback,about,admin:backend};
let state={frame:null,farmQ:'',farmSel:null,mTab:'path',mkTab:'sets',mkSort:'a7',mkQ:'',budget:false,build:0,unvOnly:false,allCat:'Warframe',allHide:false,allQ:'',qFocus:null,resSel:null,resQ:'',planet:null,misHide:false,target:null,tTab:'profile',invQ:'',rkCat:'Warframe',rkQ:'',rkF:'all'};
Object.assign(state,lsGet('tenno-ui',{}));Object.assign(state,(()=>{const q=lsGet('tenno-uiq',{})||{};return {resQ:q.resQ||state.resQ||'',farmQ:q.farmQ||state.farmQ||'',mkQ:q.mkQ||state.mkQ||'',mkSort:q.mkSort||state.mkSort||'a7'}})());
if(!['path','ladder','sheet','sframes','craft','xp'].includes(state.mTab))state.mTab='path';
function saveUI(){lsSet('tenno-ui',{ckF:state.ckF,fiF:state.fiF,fiM:state.fiM,syF:state.syF,syS:state.syS,syH:state.syH,gS:state.gS,hF:state.hF,qF:state.qF,misType:state.misType,rsF:state.rsF,ffT:state.ffT,frF:state.frF,mkF:state.mkF,rkS:state.rkS,rkCat:state.rkCat,rkF:state.rkF,frame:state.frame,mTab:state.mTab,budget:state.budget,allCat:state.allCat,allHide:state.allHide,mkTab:state.mkTab,tTab:state.tTab,misHide:state.misHide,aTab:state.aTab,wbC:state.wbC,wbO:state.wbO,wbSel:state.wbSel,cbSel:state.cbSel,lF:state.lF,lS:state.lS,arT:state.arT,arS:state.arS,arO:state.arO,kmT:state.kmT,kmS:state.kmS,rlTab:state.rlTab,rlE:state.rlE,rlO:state.rlO,raE:state.raE,duF:state.duF,duO:state.duO,wTab:state.wTab,fR:state.fR,fRr:state.fRr,fT:state.fT,mR:state.mR,tkF:state.tkF,tkS:state.tkS})}
function render(){const r=(location.hash||'#home').slice(1);const key=routes[r]?r:'home';
  navPaint(key);
  setMenu(false);
  $('#app').innerHTML=demoBar()+subnav(key)+routes[key]()+siteFoot();refresh();bindPage(key);updateMR();afterRender(key,false);segActive();sheetRestore()}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});

