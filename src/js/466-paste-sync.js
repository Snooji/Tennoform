/* ---------- Paste & sync: read the copied profile from the clipboard, then the usual review step ---------- */
document.addEventListener('click',async e=>{const b=e.target.closest('#pastesync');if(!b)return;let txt='';
  try{txt=await navigator.clipboard.readText()}catch(x){txt=''}
  const box=$('#pj');
  if(!txt||!/"Results"|"AccountId"|"LoadOutInventory"/.test(txt)){
    const d=box&&box.closest('details');if(d)d.open=true;if(box){box.focus();box.scrollIntoView({block:'center'})}
    toast(txt?"That doesn't look like your profile data. Copy the whole page, then try again.":"Couldn't read the clipboard. Paste into the box instead.");return}
  if(box)box.value=txt;state.syncFail=false;const imp=$('#imp');if(imp)imp.click()});
