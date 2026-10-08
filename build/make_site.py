"""Builds index.html from src/ (shell, css, js) + base.json (game data) + market.json (prices, sellers).

The page itself stays small: the old page styles, the old page code, the game data and the market data each go
to their own file in bundle/, named by a hash of their contents. A returning visitor only downloads the parts
that changed (usually just the daily prices); everything else comes from their browser cache."""
import json, os, datetime, hashlib, base64, re
H = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(H, 'base.json')))
mk = json.load(open(os.path.join(H, 'market.json')))
D = dict(base)
gp = os.path.join(H, 'guides.json')
D['guides'] = json.load(open(gp)) if os.path.exists(gp) else []
fp = os.path.join(H, 'farms.json')
D['ways'] = json.load(open(fp)) if os.path.exists(fp) else []
D['prices'] = mk['prices']
D['sellers'] = mk['sellers']
D['sets'] = {k: v for k, v in mk['prices'].items() if k.endswith(' Set')}
D['meta'] = dict(base['meta'], prices=mk.get('date') or base['meta'].get('prices'), site=datetime.date.today().strftime('%b %-d, %Y'))
BUNDLE = os.path.join(H, '..', 'bundle')
os.makedirs(BUNDLE, exist_ok=True)
def emit(kind, ext, text):
    name = '%s-%s.%s' % (kind, hashlib.sha256(text.encode()).hexdigest()[:10], ext)
    with open(os.path.join(BUNDLE, name), 'w', encoding='utf-8') as f:
        f.write(text)
    return '/bundle/' + name
def as_js(var, obj):
    # JSON.parse of a string literal is much faster for the browser to read than the same data as a JS object literal.
    return 'self.%s=JSON.parse(%s);\n' % (var, json.dumps(json.dumps(obj, separators=(',', ':'), ensure_ascii=False), ensure_ascii=False))
MARKET_KEYS = ('prices', 'sellers', 'sets', 'meta')  # these change every day; the rest only on game patches
game = {k: v for k, v in D.items() if k not in MARKET_KEYS}
market = {k: D[k] for k in MARKET_KEYS}
def part(d):
    d = os.path.join(H, '..', 'src', d)
    return ''.join(open(os.path.join(d, f)).read() for f in sorted(os.listdir(d)))
files = {
    'css': emit('legacy', 'css', '@layer legacy{\n' + part('css') + '\n}\n'),
    'game': emit('game', 'js', as_js('TF_GAME', game)),
    'market': emit('market', 'js', as_js('TF_MARKET', market)),
    'code': emit('code', 'js', part('js')),
}
# Keep the files the previous index.html used, so a browser still holding that page (cached for up to 10 minutes) can finish loading it.
old = os.path.join(H, '..', 'index.html')
keep = set(os.path.basename(u) for u in files.values())
if os.path.exists(old):
    keep |= set(re.findall(r'/bundle/([\w.-]+)', open(old, encoding='utf-8').read()))
for f in os.listdir(BUNDLE):
    if f not in keep:
        os.remove(os.path.join(BUNDLE, f))
template = open(os.path.join(H, '..', 'src', 'shell.html')).read()
body = (template.replace('<style>@layer legacy{\n/*CSS*/\n}</style>', '<link rel="stylesheet" href="%s">' % files['css'], 1)
        .replace('<script id="data" type="application/json">/*DATA*/</script>\n<script>/*JS*/</script>',
                 ''.join('<script src="%s"></script>' % files[k] for k in ('game', 'market', 'code')), 1))
assert '/*' not in body.split('<template')[0] and files['code'] in body, 'shell.html placeholders changed'
scripts = re.findall(r'<script>(.*?)</script>', body, re.S)
hashes = ' '.join("'sha256-%s'" % base64.b64encode(hashlib.sha256(x.encode()).digest()).decode() for x in scripts)
# Content Security Policy: only this site's own scripts (its files, plus any inline script pinned by hash) and Google sign-in may run.
csp = ("default-src 'self'; script-src 'self' %s https://apis.google.com; "
       "connect-src 'self' https://*.googleapis.com https://apis.google.com https://api.warframestat.us https://*.workers.dev https://script.google.com https://script.googleusercontent.com; "
       "frame-src 'self' https://tennoform.firebaseapp.com https://accounts.google.com https://apis.google.com; "
       "img-src 'self' data: blob: https://cdn.warframestat.us https://raw.githubusercontent.com https://*.googleusercontent.com; "
       "style-src 'self' 'unsafe-inline'; font-src 'self'; "
       "object-src 'none'; base-uri 'none'; form-action 'none'; manifest-src 'self'; worker-src 'none'" % hashes)
def shell_tags():
    # The React shell (app/, built with Vite into assets/) loads after the main script, which exposes window.TF.
    mf = os.path.join(H, '..', 'assets', '.vite', 'manifest.json')
    if not os.path.exists(mf):
        return ''
    e = json.load(open(mf))['src/main.tsx']
    css = ''.join('<link rel="stylesheet" href="/assets/%s">' % c for c in e.get('css', []))
    # Layer order first: the old page styles sit above Tailwind's reset but below shadcn components and utilities.
    order = '<style>@layer properties, theme, base, legacy, components, utilities;</style>'
    return order + css + '<script type="module" src="/assets/%s"></script>' % e['file']
page = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<meta http-equiv="Content-Security-Policy" content="' + csp + '">'
        '<meta name="referrer" content="strict-origin-when-cross-origin">'
        '<meta name="description" content="Warframe mastery tracker, farming guide, quest log and market prices."><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Tennoform"><meta property="og:title" content="Tennoform"><meta property="og:image" content="https://tennoform.com/icon-512.png">'
        + shell_tags() + '</head><body>\n' + body + '\n</body></html>\n')
open(os.path.join(H, '..', 'index.html'), 'w').write(page)
print('index.html', len(page) // 1024, 'KB;', ', '.join('%s %d KB' % (u.split('/')[-1], os.path.getsize(os.path.join(BUNDLE, u.split('/')[-1])) // 1024) for u in files.values()))
