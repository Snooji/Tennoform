/* ---------- v9 events ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-atab],[data-wbi],[data-rltab],[data-wtab],[data-freg],[data-mreg],[data-reld],[data-arcd],[data-frdel],#fradd');if(!t)return;
  if(t.dataset.atab){state.aTab=t.dataset.atab;saveUI();render();return}
  if(t.dataset.wbi!==undefined){state.wbI=+t.dataset.wbi;rerender();return}
  if(t.dataset.rltab){state.rlTab=t.dataset.rltab;saveUI();if(HASH()!=='#relics')GO('relics');else render();return}
  if(t.dataset.wtab){state.wTab=t.dataset.wtab;saveUI();render();return}
  if(t.dataset.freg){state.fR=t.dataset.freg;state.fT='all';saveUI();rerender();return}
  if(t.dataset.mreg){state.mR=t.dataset.mreg;saveUI();rerender();return}
  if(t.dataset.reld){const [r,k,d]=t.dataset.reld.split('|');P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,(+x[k]||0)+(+d));if(!relCount(r))delete P.rel[r];saveProfile();rerender();return}
  if(t.dataset.arcd){const [n,d]=t.dataset.arcd.split('|');P.arc=P.arc||{};P.arc[n]=Math.max(0,(+P.arc[n]||0)+(+d));if(!P.arc[n])delete P.arc[n];saveProfile();rerender();return}
  if(t.dataset.frdel!==undefined){P.friends.splice(+t.dataset.frdel,1);saveProfile();rerender();return}
  if(t.id==='fradd'){addFriend($('#frin').value);return}});
document.addEventListener('change',e=>{const t=e.target;const S3={wbc:'wbC',wbo:'wbO',lf:'lF',ls:'lS',art:'arT',ars:'arS',aro:'arO',kmt:'kmT',kms:'kmS',rle:'rlE',rlo:'rlO',rae:'raE',duf:'duF',duo:'duO',frr:'fRr',ftm:'fT'};
  if(S3[t.id]){state[S3[t.id]]=t.value;saveUI();rerender();return}
  if(t.id==='wbsel'){state[state.aTab==='comp'?'cbSel':'wbSel']=t.value;state.wbI=0;saveUI();render();return}
  if(t.dataset.lel!==undefined||t.dataset.lb!==undefined){const n=t.dataset.lel||t.dataset.lb;P.lich=P.lich||{};const v=P.lich[n]=P.lich[n]||{};if(t.dataset.lel!==undefined)v.e=t.value;else v.b=Math.max(0,Math.min(60,+t.value||0));if(v.e||v.b){if(!on('lich|'+n))setK('lich|'+n,1)}saveProfile();rerender();return}
  if(t.dataset.arc){P.arc=P.arc||{};const v=Math.max(0,+t.value||0);if(v)P.arc[t.dataset.arc]=v;else delete P.arc[t.dataset.arc];saveProfile();rerender();return}
  if(t.dataset.rel){const [r,k]=t.dataset.rel.split('|');P.rel=P.rel||{};const x=P.rel[r]=P.rel[r]||{};x[k]=Math.max(0,+t.value||0);if(!relCount(r))delete P.rel[r];saveProfile();rerender();return}
  if(t.dataset.dup){P.dup=P.dup||{};const v=Math.max(0,+t.value||0);if(v)P.dup[t.dataset.dup]=v;else delete P.dup[t.dataset.dup];saveProfile();rerender();return}
  if(t.dataset.ptr){P[t.dataset.ptr]=Math.max(0,+t.value||0);saveProfile();return}});

