// Tennoform's old Cloudflare profile relay: switched off.
// Cloudflare deploys this file from wrangler.jsonc on every push, so it stays reachable even though the site
// doesn't use it. It used to forward requests to Warframe's profile endpoint with no rate limit, which made it
// an open path to Warframe for anyone. It now answers without contacting Warframe at all. The site syncs
// through google-apps-script-relay.gs, which caches and rate-limits (see SETUP.md).
export default {
  async fetch() {
    return new Response(JSON.stringify({ error: 'This relay is switched off. Tennoform syncs through its Apps Script relay.' }), {
      status: 410,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=86400', 'Access-Control-Allow-Origin': '*' },
    });
  },
};
