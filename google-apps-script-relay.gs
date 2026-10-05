/**
 * Tennoform profile relay (free, runs on your Google account).
 *
 * Warframe's public profile page doesn't let websites read it from a browser, and it blocks
 * Cloudflare relays. Google Apps Script runs on Google's network, which Warframe answers.
 *
 * Set up once (about 5 minutes):
 *  1. Go to https://script.google.com and click "New project".
 *  2. Delete what's there and paste this whole file. Name the project "Tennoform relay".
 *  3. Click Deploy > New deployment. Type: Web app.
 *       Execute as: Me.   Who has access: Anyone.
 *  4. Click Deploy, allow access when Google asks, and copy the Web app URL
 *     (it ends in /exec).
 *  5. Send that URL to be put in firebase-config.js as window.TENNO_PROXY.
 *
 * It only accepts a 24-character Warframe account ID and only reads the public profile.
 */
function doGet(e) {
  var id = String((e && e.parameter && e.parameter.playerId) || '').trim();
  if (!/^[0-9a-f]{24}$/i.test(id)) return json_({ error: 'Send ?playerId= with a 24-character account ID' });
  var cache = CacheService.getScriptCache();
  var hit = cache.get('p' + id);
  if (hit) return text_(hit);
  var r = UrlFetchApp.fetch('https://api.warframe.com/cdn/getProfileViewingData.php?playerId=' + id, {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: { 'Accept': 'application/json,text/plain,*/*' }
  });
  var code = r.getResponseCode();
  var body = r.getContentText();
  if (code !== 200 || body.indexOf('"Results"') < 0) return json_({ error: 'Warframe answered ' + code });
  if (body.length < 95000) cache.put('p' + id, body, 300); // keep 5 minutes when it fits the cache
  return text_(body);
}
function text_(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON); }
function json_(o) { return text_(JSON.stringify(o)); }
