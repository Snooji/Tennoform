"""Builds index.html from src/ (shell, css, js) + base.json (game data) + market.json (prices, sellers)."""
import json, os, datetime, hashlib, base64, re
H = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(H, 'base.json')))
mk = json.load(open(os.path.join(H, 'market.json')))
D = dict(base)
D['prices'] = mk['prices']
D['sellers'] = mk['sellers']
D['sets'] = {k: v for k, v in mk['prices'].items() if k.endswith(' Set')}
D['meta'] = dict(base['meta'], prices=mk.get('date') or base['meta'].get('prices'), site=datetime.date.today().strftime('%b %-d, %Y'))
data = json.dumps(D, separators=(',', ':'), ensure_ascii=False).replace('<', '\\u003c')
def part(d):
    d = os.path.join(H, '..', 'src', d)
    return ''.join(open(os.path.join(d, f)).read() for f in sorted(os.listdir(d)))
# The page is assembled from src/: shell.html with every src/css file and every src/js file, in name order.
template = open(os.path.join(H, '..', 'src', 'shell.html')).read().replace('/*CSS*/', part('css'), 1).replace('/*JS*/', part('js'), 1)
body = template.replace('/*DATA*/', data)
# Content Security Policy: only this site's own script (pinned by hash) and Google sign-in may run.
scripts = re.findall(r'<script>(.*?)</script>', body, re.S)
hashes = ' '.join("'sha256-%s'" % base64.b64encode(hashlib.sha256(x.encode()).digest()).decode() for x in scripts)
csp = ("default-src 'self'; script-src 'self' %s https://apis.google.com; "
       "connect-src 'self' https://*.googleapis.com https://apis.google.com https://api.warframestat.us https://*.workers.dev; "
       "frame-src 'self' https://tennoform.firebaseapp.com https://accounts.google.com https://apis.google.com; "
       "img-src 'self' data: blob: https://cdn.warframestat.us https://raw.githubusercontent.com https://*.googleusercontent.com; "
       "style-src 'self' 'unsafe-inline'; font-src 'self'; "
       "object-src 'none'; base-uri 'none'; form-action 'none'; manifest-src 'self'; worker-src 'none'" % hashes)
page = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<meta http-equiv="Content-Security-Policy" content="' + csp + '">'
        '<meta name="referrer" content="strict-origin-when-cross-origin">'
        '<meta name="description" content="Warframe mastery tracker, farming guide, quest log and market prices."><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Tennoform"><meta property="og:title" content="Tennoform"><meta property="og:image" content="https://tennoform.com/icon-512.png">'
        '</head><body>\n' + body + '\n</body></html>\n')
open(os.path.join(H, '..', 'index.html'), 'w').write(page)
print('index.html', len(page) // 1024, 'KB')
