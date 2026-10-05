/* ---------- item art ---------- */
function art(n,cls){const it=I[n];if(!it||!it.img)return'';return `<img class="${cls||'thumb'}" src="https://cdn.warframestat.us/img/${encodeURIComponent(it.img)}" alt="" loading="lazy" decoding="async">`}

