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
 *  5. Put that URL in firebase-config.js as window.TENNO_PROXY.
 *
 * It only accepts a 24-character Warframe account ID and only reads the public profile.
 * Add &platform=ps|xb|sw|ios|and to read a console or mobile profile (each platform has its own server
 * unless cross-save is on); without it, the PC server is used.
 */
var HOSTS = { pc: 'api', ps: 'api-ps4', xb: 'api-xb1', sw: 'api-swi', ios: 'api-mob', and: 'api-and' };
// Request limits. Warframe publishes no limits for this endpoint, so these are deliberately conservative.
var PER_MINUTE = 10;        // upstream requests to Warframe per minute, across all players
var PER_HOUR = 120;         // and per hour
var OK_SECONDS = 600;       // a profile is reused for 10 minutes
var MISS_SECONDS = 600;     // "no profile on this platform" is remembered for 10 minutes
var ERROR_SECONDS = 300;    // other errors: 5 minutes before that player is tried again
var BLOCK_SECONDS = 21600;  // 403 or 429 from Warframe: stop asking for 6 hours, for everyone
function doGet(e) {
  var id = String((e && e.parameter && e.parameter.playerId) || '').trim().toLowerCase();
  if (!/^[0-9a-f]{24}$/.test(id)) return json_({ error: 'Send ?playerId= with a 24-character account ID', status: 400 });
  var plat = String((e.parameter && e.parameter.platform) || 'pc');
  if (!HOSTS[plat]) plat = 'pc';
  var cache = CacheService.getScriptCache();
  var key = 'p' + plat + id;
  // 1. answers we already have (good or bad) never reach Warframe again until they expire
  var hit = cache.get(key);
  if (hit) return text_(hit);
  // 2. Warframe said stop: nobody asks until the pause is over
  var blocked = cache.get('blocked');
  if (blocked) return json_({ error: 'Warframe asked us to slow down (' + blocked + '). Profile sync is paused for a few hours; nothing is retried until then.', status: Number(blocked) });
  // 3. budget per minute and per hour, across everyone
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return json_({ error: 'The relay is busy. Try again in a minute.', status: 503 });
  try {
    var m = 'm' + Math.floor(Date.now() / 60000), h = 'h' + Math.floor(Date.now() / 3600000);
    var nm = Number(cache.get(m) || 0), nh = Number(cache.get(h) || 0);
    if (nm >= PER_MINUTE || nh >= PER_HOUR) return json_({ error: 'Lots of people are syncing right now. Try again in a few minutes.', status: 503 });
    cache.put(m, String(nm + 1), 120);
    cache.put(h, String(nh + 1), 7200);
  } finally { lock.releaseLock(); }
  // 4. one request to Warframe, identified honestly (Apps Script's own user agent; no browser disguise)
  var r = UrlFetchApp.fetch('https://' + HOSTS[plat] + '.warframe.com/cdn/getProfileViewingData.php?playerId=' + id, {
    muteHttpExceptions: true,
    followRedirects: true,
    headers: { 'Accept': 'application/json' }
  });
  var code = r.getResponseCode();
  var body = r.getContentText();
  if (code === 403 || code === 429) {
    cache.put('blocked', String(code), BLOCK_SECONDS);
    return json_({ error: 'Warframe asked us to slow down (' + code + '). Profile sync is paused for a few hours; nothing is retried until then.', status: code });
  }
  if (code === 409) return remember_(cache, key, { error: 'No profile for this account on that platform. Check where you play.', status: 409 }, MISS_SECONDS);
  if (code !== 200 || body.indexOf('"Results"') < 0) return remember_(cache, key, { error: 'Warframe answered ' + code, status: code === 200 ? 502 : code }, ERROR_SECONDS);
  if (body.length < 95000) cache.put(key, body, OK_SECONDS); // the cache holds up to 100 KB per entry
  return text_(body);
}
function remember_(cache, key, o, seconds) { var s = JSON.stringify(o); cache.put(key, s, seconds); return text_(s); }
function text_(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON); }
function json_(o) { return text_(JSON.stringify(o)); }
