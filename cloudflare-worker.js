// Ordis profile relay — paste this into a free Cloudflare Worker.
// Warframe's public profile endpoint doesn't allow websites to call it directly (no CORS),
// so this relays the request and adds the header. It only accepts a 24-character account ID
// and only answers requests coming from your own site.
const ALLOWED = ['https://snooji.github.io']; // add your custom domain here if you use one

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (origin && !ALLOWED.includes(origin)) return new Response('Forbidden', { status: 403, headers: cors });
    const id = new URL(request.url).searchParams.get('playerId') || '';
    if (!/^[0-9a-f]{24}$/i.test(id)) {
      return new Response(JSON.stringify({ error: 'Send ?playerId= with a 24-character account ID' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const r = await fetch('https://api.warframe.com/cdn/getProfileViewingData.php?playerId=' + id, { cf: { cacheTtl: 300, cacheEverything: true } });
    return new Response(await r.text(), { status: r.status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300' } });
  },
};
