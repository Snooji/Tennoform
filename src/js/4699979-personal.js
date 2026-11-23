/* ---------- Your own layer on any item, mod, relic or resource page: a note, a pin, and recently viewed ----------
   Notes and pins live on the profile, so they're saved to the account when signed in. Recently viewed stays on this device. */
const REC_KEY='tf-recent',REC_MAX=12;
let RECENT=(()=>{try{const v=JSON.parse(localStorage.getItem(REC_KEY)||'[]');return Array.isArray(v)?v.filter(x=>typeof x==='string'):[]}catch(e){return []}})();
function recentAdd(k){if(!k||RECENT[0]===k)return;RECENT=[k,...RECENT.filter(x=>x!==k)].slice(0,REC_MAX);try{localStorage.setItem(REC_KEY,JSON.stringify(RECENT))}catch(e){}}
function keyCard(k){const i=k.indexOf('|');const t=k.slice(0,i),n=k.slice(i+1);return {key:k,name:n,kind:DET_KIND[t]||'',img:I[n]?IMG(n):''}}
{const _d=window.TF.details;window.TF.details=function(){const d=_d.apply(this,arguments);if(d&&d.found&&d.key){recentAdd(d.key);d.note=(P.notes||{})[d.key]||'';d.pinned=(P.pins||[]).includes(d.key)}return d}}
Object.assign(window.TF,{
  noteSet:(k,text)=>{const t=String(text||'').slice(0,2000);P.notes={...(P.notes||{})};if(t.trim())P.notes[k]=t;else delete P.notes[k];saveProfile();tfNotify()},
  pinToggle:k=>{const p=P.pins||[];P.pins=p.includes(k)?p.filter(x=>x!==k):[k,...p].slice(0,24);saveProfile();toast(P.pins.includes(k)?'Pinned to Home':'Unpinned');tfNotify()},
  shortcuts:()=>({pins:(P.pins||[]).map(keyCard),recent:RECENT.filter(k=>!(P.pins||[]).includes(k)).slice(0,8).map(keyCard),notes:Object.keys(P.notes||{}).length}),
  recentClear:()=>{RECENT=[];try{localStorage.removeItem(REC_KEY)}catch(e){}tfNotify()}
});
