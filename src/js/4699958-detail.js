/* ---------- Simple / Detailed view: Simple hides the long explanations (see html[data-detail=simple] in the CSS) ---------- */
const SIMPLE=()=>document.documentElement.dataset.detail==='simple';
document.documentElement.dataset.detail=lsGet('tf-detail','detailed')==='simple'?'simple':'detailed';
/* item steps and other embedded pages are cached; rebuild them when the view changes */
window.TF.detailChanged=()=>{ISLV++;FFD.key='';FRT.key='';try{render()}catch(e){}tfNotify()};
