/* ---------- builds fit every version of an item: Saryn's build is Saryn Prime's (and Umbra's) too, Soma Prime's fits Soma ---------- */
function famOf(n){const b=String(n).replace(/ (Prime|Umbra)$/,'');return [b,b+' Prime',b+' Umbra'].filter(x=>I[x])}
const famOwned=n=>famOf(n).some(ownedItem);
function bFits(b){return b.fits||(b.fits=famOf(b.item).filter(x=>x!==b.item))}
{const _mb=metaBuilds;metaBuilds=function(){const r=_mb();for(const b of r)if(!b.fits)b.fits=famOf(b.item).filter(x=>x!==b.item);return r}}
/* the weapon and companion build tabs list every version, each showing the family's builds */
const FAMSRC=new Map();
{const _bd=buildsData;buildsData=function(src,kind){let ex=FAMSRC.get(src);
  if(!ex){ex={...src};for(const k in src)for(const v of famOf(k))if(!ex[v])ex[v]=src[k];FAMSRC.set(src,ex)}
  return _bd(ex,kind)}}
