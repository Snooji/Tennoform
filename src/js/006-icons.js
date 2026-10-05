/* ---------- icons: one drawn set, 24px grid, 1.5px stroke, sized to the text ---------- */
const IC={check:'M5 12.5l4.5 4.5L19 7.5',close:'M6 6l12 12M18 6L6 18',star:'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z',
  pin:'M9 3.5h6M10 3.5v6l-3.5 4h11L14 9.5v-6M12 13.5V21',more:'M5.5 12h.01M12 12h.01M18.5 12h.01',repeat:'M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3',
  timer:'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 2M9.5 2.5h5',ext:'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  edit:'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',plus:'M12 5v14M5 12h14',warn:'M12 4l9 16H3zM12 10v4M12 17.5h.01',search:'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM16 16l5 5'};
function ic(n,cls){return `<svg class="ic${cls?' '+cls:''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[n]}"/></svg>`}
