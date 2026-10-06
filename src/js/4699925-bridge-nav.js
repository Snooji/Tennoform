/* ---------- bridge: switching section from the bottom tabs starts that section fresh ---------- */
Object.assign(window.TF,{
  resetView:()=>{state.farmSel=null;state.resSel=null;state.blSel=null;state.gSel=null;state.chat=null;state.newGroup=false;state.qFocus=null;state.qs=false;
    document.querySelectorAll('.dlgbk').forEach(d=>d.remove());if(typeof setMenu==='function')try{setMenu(false)}catch(e){}
    saveUI();tfNotify()}
});
