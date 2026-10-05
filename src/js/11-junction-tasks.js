/* ---------- junction tasks ---------- */
function juncTasks(){const order=['Venus','Mercury','Mars','Phobos','Ceres','Jupiter','Europa','Saturn','Uranus','Neptune','Pluto','Eris','Sedna'];
  return `<details class="obj grp" data-scope="input.ck.jt,input.ck.jx"><summary><h3>Junction tasks</h3>${progHTML()}</summary><div class="small muted" style="padding:10px 14px 0">Each junction unlocks once its tasks are done. Tick tasks as you go; beating the Specter marks the junction.</div>
  ${order.filter(p=>D.junc[p]).map(p=>{const j=D.junc[p];const node=ALLN.find(n=>isJ(n)&&n.n===p+' Junction');const k=node?'n|'+node.id:'';
    const done=j.tasks.filter((t,i)=>on('jt|'+p+'|'+i)).length;
    return `<details class="jt"><summary><span>${orb(j.from,18)} <b>${esc(j.from)} → ${esc(p)}</b> <span class="small muted">${esc(j.spec)}</span></span><span class="chip ${k&&on(k)?'ok':''}">${k&&on(k)?'Done':done+'/'+j.tasks.length}</span></summary><ol class="steps">
    ${j.tasks.map((t,i)=>{const last=/^Complete the Junction$/i.test(t.t);const kk=last&&k?k:'jt|'+p+'|'+i;return `<li class="step${on(kk)?' done':''}">${ck(kk,last?'jn jx':'jt')}<div><div class="lbl">${last?'Beat the '+esc(j.spec):esc(t.t)}</div><div class="src">${t.h?esc(t.h)+'<br>':''}${t.r.length?'<span class="muted">Reward: '+t.r.map(r=>{const m=r.replace(/ Blueprint$/,'');return esc(r)+(MIX[m]?' '+mxChip(m):'')}).join(', ')+'</span>':''}</div></div></li>`}).join('')}</ol></details>`}).join('')}</details>`}

