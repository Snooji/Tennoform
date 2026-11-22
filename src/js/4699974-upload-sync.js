/* ---------- Upload sync: the player's own profile page (.json/.txt), a WFHelper file or a Tennoform backup ----------
   Everything is read on this device. A profile goes through the usual review step; a backup through the usual restore preview.
   Both save to the browser and, when signed in, to the player's account. */
async function uploadSyncFile(f){let txt='';try{txt=await f.text()}catch(e){toast(`Couldn't read ${f.name}. Try choosing it again.`);return}
  if(/"Results"|"AccountId"|"LoadOutInventory"/.test(txt)){state.tTab='account';state.syncFail=false;saveUI();if(HASH()!=='#tenno')GO('tenno');else render();
    setTimeout(()=>{const box=$('#pj'),imp=$('#imp');if(box&&imp){const d=box.closest('details');if(d)d.open=true;box.value=txt;imp.click()}else toast(importProfile(txt))},80);return}
  const bk=typeof parseBackup==='function'?parseBackup(txt):null;
  if(bk){state.tTab='backup';state.bkPrev=bk;saveUI();if(HASH()!=='#tenno')GO('tenno');else render();toast('Backup found. Check what changes, then apply it.');return}
  if(typeof readAccountFile==='function')return readAccountFile(f);
  toast("That file isn't a profile page or a Tennoform backup.")}
document.addEventListener('change',e=>{const t=e.target;if(!t||(t.id!=='proffile'&&t.id!=='proffile2')||!t.files||!t.files[0])return;const f=t.files[0];t.value='';uploadSyncFile(f)});
