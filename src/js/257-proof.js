/* ---------- first visit: sync first, quick start, or look around a sample account ---------- */
function welcome(){return `<section class="welcome"><div class="wl">${LOGO_HTML()}<div><h1>Know what to rank next</h1><p class="lede" style="margin:4px 0 0;display:block">Tennoform reads your Warframe profile and tells you what to master, farm and do before reset.</p></div></div>
 <div class="wchoices">
  <button type="button" class="wchoice" data-onb="import"><b>Sync my profile <span class="chip good">Recommended</span></b><span class="small muted">Paste your account ID. Read-only: no password, nothing changes in game.</span><span class="wgo">Sync →</span></button>
  <button type="button" class="wchoice" data-qsopen><b>Quick start</b><span class="small muted">Enter your Mastery Rank and tick the gear you've maxed. About a minute.</span><span class="wgo">Start →</span></button>
  <button type="button" class="wchoice" data-demo><b>Look around first</b><span class="small muted">Open a sample MR 11 account. Nothing is saved.</span><span class="wgo">Open sample →</span></button>
 </div>
 ${signBlock('welcome')}<div class="small muted">Or <button type="button" class="linkbtn" data-onb="manual">track every item by hand</button>.</div></section>`}

/* sample account: swaps in made-up progress, saves nothing, and puts everything back on exit */
let DEMO=null;
function demoStart(){if(DEMO)return;DEMO={c:JSON.stringify(C),p:JSON.stringify(P),dr:docRef,pr:profRef,ls:lsSet};docRef=null;profRef=null;lsSet=function(){};
  const c={};const m=k=>{c[kenc(k)]=1};const pool=MI.filter(i=>(i.mr||0)<=8).sort((a,b)=>(a.mr||0)-(b.mr||0)||a.n.localeCompare(b.n));
  pool.slice(0,62).forEach(i=>m('m|'+i.n));ALLN.filter(n=>!isJ(n)).slice(0,140).forEach(n=>m('n|'+n.id));Q.slice(0,14).forEach(q=>m('q|'+q.n));
  const now=Date.now();C=c;P={rk:{},other:0,intr:0,mr:null,name:'',at:'',adj:0,wfid:'',mc:{},inv:{},prof:{mr:11,name:'Sample Tenno'},tname:'Sample Tenno',onb:'demo',
    foundry:[{id:'d1',n:'Nikana Prime',t0:now-4*36e5,dur:3*3600},{id:'d2',n:'Rhino',t0:now,dur:3*86400}],goals:['Saryn Prime','Nikana Prime'],
    tasks:[{id:'t1',t:'Farm 10 Orokin Cells',k:'res',r:'Orokin Cell',d:0,at:now}],syn:{'Cephalon Suda':{r:2,s:46000},'Ostron':{r:1,s:4000}}};
  pool.slice(62,70).forEach((i,k)=>{P.rk[i.n]=10+k*2});
  lastMR=null;updateMR();document.body.classList.add('demo');if(location.hash&&location.hash!=='#home')location.hash='home';else render();window.scrollTo(0,0);announce('Sample account open. Nothing is saved.')}
function demoExit(){if(!DEMO)return;C=JSON.parse(DEMO.c);P=JSON.parse(DEMO.p);docRef=DEMO.dr;profRef=DEMO.pr;lsSet=DEMO.ls;DEMO=null;document.body.classList.remove('demo');lastMR=null;updateMR();render();window.scrollTo(0,0)}
function demoBar(){return DEMO&&!window.TF_UI?`<div class="demobar" role="status"><span><b>Sample account.</b> These ranks, goals and tasks are examples, not yours, and nothing here is saved.</span><button type="button" class="btn sm primary" data-demox>Use my own</button></div>`:''}
document.addEventListener('click',e=>{if(e.target.closest('[data-demo]')){demoStart();return}if(e.target.closest('[data-demox]')){demoExit()}});

/* share card: a 1200 x 630 image of your progress, drawn in the browser */
async function shareCard(){const t=totalXP(),m=mrInfo(t.total);const name=P.tname||(P.prof&&P.prof.name)||'Tenno';const maxed=MI.filter(i=>itemXP(i.n)>=mxp(i)).length;
  const nodes=ALLN.filter(n=>!isJ(n)&&on('n|'+n.id)).length,qd=Q.filter(q=>qDone(q.n)).length;
  try{await document.fonts.ready}catch(e){}
  const W=1200,H=630,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
  const gold='#C8A35A',ink='#ECE7DC',mut='#A29D92',bg='#0C0C0E',line='#2A2A30',D1='"Barlow Semi Condensed", Arial Narrow, sans-serif',B1='"Source Sans 3", Arial, sans-serif';
  x.fillStyle=bg;x.fillRect(0,0,W,H);
  x.strokeStyle=line;x.lineWidth=2;x.strokeRect(28,28,W-56,H-56);x.strokeStyle='rgba(200,163,90,.45)';x.lineWidth=1.5;x.strokeRect(40,40,W-80,H-80);
  x.save();x.translate(W/2,40);x.rotate(Math.PI/4);x.fillStyle=bg;x.fillRect(-9,-9,18,18);x.strokeStyle=gold;x.strokeRect(-9,-9,18,18);x.restore();
  x.fillStyle=mut;x.font=`600 26px ${D1}`;x.fillText('TENNOFORM',90,110);
  x.fillStyle=ink;x.font=`600 64px ${D1}`;x.fillText(name.slice(0,26),90,190);
  const cx=1000,cy=230,r=110;x.lineWidth=16;x.strokeStyle=line;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.stroke();
  x.strokeStyle=gold;x.lineCap='round';x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(.01,m.pct/100));x.stroke();
  x.fillStyle=gold;x.textAlign='center';x.font=`600 96px ${D1}`;x.fillText(m.mr>30?'L'+(m.mr-30):String(m.mr),cx,cy+32);x.fillStyle=mut;x.font=`400 24px ${B1}`;x.fillText(m.mr>30?'Legendary':'Mastery rank',cx,cy+r+56);x.textAlign='left';
  x.fillStyle=ink;x.font=`600 40px ${B1}`;x.fillText(fmt(t.total)+' XP',90,262);x.fillStyle=mut;x.font=`400 26px ${B1}`;x.fillText(fmt(m.next-t.total)+' to '+(m.mr>=30?'Legendary '+(m.mr-29):'MR '+(m.mr+1)),90,302);
  x.fillStyle=line;x.fillRect(90,330,720,10);x.fillStyle=gold;x.fillRect(90,330,720*m.pct/100,10);
  const stat=(v,k,i)=>{const sx=90+i*250;x.fillStyle=ink;x.font=`600 56px ${D1}`;x.fillText(v,sx,450);x.fillStyle=mut;x.font=`400 24px ${B1}`;x.fillText(k,sx,488)};
  stat(fmt(maxed),'items mastered',0);stat(fmt(nodes),'star chart nodes',1);stat(fmt(qd),'quests done',2);
  x.fillStyle=mut;x.font=`400 22px ${B1}`;x.fillText('tennoform.com · '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),90,560);
  const blob=await new Promise(res=>cv.toBlob(res,'image/png'));if(!blob){toast("Couldn't make the image");return}
  const file=new File([blob],'tennoform-progress.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'My Warframe progress'});return}catch(e){if(e&&e.name==='AbortError')return}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tennoform-progress.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Image saved')}
document.addEventListener('click',e=>{if(e.target.closest('[data-share]'))shareCard()});
