/* ---------- sort direction: every sort menu has an ascending/descending toggle, remembered on this device (SREV in 05-helpers.js) ---------- */
Object.assign(window.TF,{isRev:k=>!!SREV[k],
  sortRev:k=>{if(SREV[k])delete SREV[k];else SREV[k]=1;lsSet('tf-sortrev',SREV);
    /* paged lists start again from the top */
    ['rkLim','mkLim','mmLim','blN'].forEach(x=>{delete state[x]});tfNotify()}});
