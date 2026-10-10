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
# Foundry recipes for everything craftable that isn't masterable gear (build/make_crafts.py)
cp = os.path.join(H, 'crafts.json')
D['crafts'] = json.load(open(cp)) if os.path.exists(cp) else {}
D['prices'] = mk['prices']
D['sellers'] = mk['sellers']
D['sets'] = {k: v for k, v in mk['prices'].items() if k.endswith(' Set')}
D['meta'] = dict(base['meta'], prices=mk.get('date') or base['meta'].get('prices'), site=datetime.date.today().strftime('%b %-d, %Y'))
import subprocess
def git(*a):
    try:
        return subprocess.run(['git', *a], cwd=os.path.join(H, '..'), capture_output=True, check=True, text=True).stdout
    except Exception:
        return ''
def live_file(path):
    """A file as the live site has it: origin/main when git knows it (the deployed branch), else the last commit."""
    for ref in ('origin/main', 'HEAD'):
        out = git('show', '%s:%s' % (ref, path))
        if out:
            return out
    return ''
# A tab left open keeps asking for the files of the version it loaded, for as long as it stays open. So keep the files of
# every version deployed in the last KEEP_DAYS days (at least KEEP_MIN, at most KEEP_MAX), not just the current and live ones.
# Older tabs still recover: a page that can't load its file reloads once into the current version.
KEEP_DAYS, KEEP_MIN, KEEP_MAX = 3, 3, 10
def recent_versions(path):
    """[(commit, text)] of path as deployed: main's own commits only (merges and bot commits, not the PR commits inside them)."""
    ref = 'origin/main' if git('rev-parse', '--verify', '-q', 'origin/main') else 'HEAD'
    hs = git('log', ref, '--first-parent', '--since=%d.days' % KEEP_DAYS, '--format=%H', '--', path).split()[:KEEP_MAX]
    hs += [h for h in git('log', ref, '--first-parent', '-%d' % KEEP_MIN, '--format=%H', '--', path).split() if h not in hs]
    return [(h, git('show', '%s:%s' % (h, path))) for h in hs]
def broken(data):
    """A merge conflict left in a built file: the browser can't run it, so never keep or deploy one."""
    return re.search(rb'(?:^|\n)(?:<{7}|>{7})', data) is not None
def restore(folder, name, versions):
    """Put back (or repair) a file a recent version still uses, from a commit that has a clean copy of it."""
    dst = os.path.join(H, '..', folder, name)
    if os.path.exists(dst) and not broken(open(dst, 'rb').read()):
        return
    for h, _ in versions:
        data = subprocess.run(['git', 'show', '%s:%s/%s' % (h, folder, name)], cwd=os.path.join(H, '..'), capture_output=True).stdout
        if data and not broken(data):
            open(dst, 'wb').write(data)
            return
    if os.path.exists(dst):
        os.remove(dst)
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
PAGES = {k: v for k, v in json.load(open(os.path.join(H, 'pages.json'), encoding='utf-8')).items() if not k.startswith('_')}
MARKET_KEYS = ('prices', 'sellers', 'sets', 'meta')  # these change every day; the rest only on game patches
# Guides and farm "ways" aren't needed to draw the first page: they're their own files, fetched right after it's up.
LAZY = ('guides', 'ways')
game = {k: v for k, v in D.items() if k not in MARKET_KEYS and k not in LAZY}
market = {k: D[k] for k in MARKET_KEYS}
def part(d):
    d = os.path.join(H, '..', 'src', d)
    return ''.join(open(os.path.join(d, f)).read() for f in sorted(os.listdir(d)))
lazy = {k: emit(k, 'json', json.dumps(D[k], separators=(',', ':'), ensure_ascii=False)) for k in LAZY}
game['lazy'] = lazy
# price history (90 days per item) is its own file, fetched only when a price chart opens; its address rides in the
# market file, which changes daily anyway, so the big game file stays cached
HIST = os.path.join(H, 'pricehist.json')
if os.path.exists(HIST):
    market['hist'] = emit('prices', 'json', open(HIST, encoding='utf-8').read())
files = {
    'css': emit('legacy', 'css', '@layer legacy{\n' + part('css') + '\n}\n'),
    'game': emit('game', 'js', as_js('TF_GAME', game)),
    'market': emit('market', 'js', as_js('TF_MARKET', market)),
    # each page's title rides in the code so in-app navigation shows the same title as the page's own address
    'code': emit('code', 'js', 'self.TF_PAGES=%s;\n' % json.dumps({k: v[0] for k, v in PAGES.items()}, ensure_ascii=False) + part('js')),
}
# Keep this build's files and every file a recent version of the page used (see KEEP_DAYS above).
keep = set(os.path.basename(u) for u in list(files.values()) + list(lazy.values()) + ([market['hist']] if market.get('hist') else []))
page_versions = recent_versions('index.html')
old = set()
for h, src in page_versions:
    old |= set(re.findall(r'/bundle/([\w.-]+)', src))
    # the lazy files are named inside the game file, not in the page itself
    for g in re.findall(r'/bundle/(game-[\w]+\.js)', src):
        gp = os.path.join(BUNDLE, g)
        txt = open(gp, encoding='utf-8').read() if os.path.exists(gp) else git('show', '%s:bundle/%s' % (h, g))
        old |= set(re.findall(r'/bundle/([\w.-]+\.json)', txt.replace('\\/', '/')))
for f in old - keep:
    restore('bundle', f, page_versions)
keep |= old
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
       "connect-src 'self' https://*.googleapis.com https://apis.google.com https://api.warframestat.us https://script.google.com https://script.googleusercontent.com; "
       "frame-src 'self' https://tennoform.firebaseapp.com https://accounts.google.com https://apis.google.com; "
       "img-src 'self' data: blob: https://cdn.warframestat.us https://raw.githubusercontent.com https://*.googleusercontent.com; "
       "style-src 'self' 'unsafe-inline'; font-src 'self'; "
       "object-src 'none'; base-uri 'none'; form-action 'none'; manifest-src 'self'; worker-src 'self'" % hashes)
def prune_assets():
    """The React build no longer empties assets/, so a tab that was open during an update can still load its pages.
    Keep this build's files and every file a recent version used (KEEP_DAYS); delete anything older."""
    A = os.path.join(H, '..', 'assets')
    mf = os.path.join(A, '.vite', 'manifest.json')
    if not os.path.exists(mf):
        return
    cur = set()
    for e in json.load(open(mf)).values():
        cur.add(e['file'])
        cur.update(e.get('css', []))
        cur.update(e.get('assets', []))
    old = set()
    versions = recent_versions('assets/.vite/manifest.json')
    for _, txt in versions:
        try:
            for e in json.loads(txt or '{}').values():
                old.add(e['file']); old.update(e.get('css', [])); old.update(e.get('assets', []))
        except ValueError:
            pass
    for f in old - cur:
        restore('assets', f, versions)
    allowed = cur | old
    for f in os.listdir(A):
        if os.path.isfile(os.path.join(A, f)) and f not in allowed:
            os.remove(os.path.join(A, f))
    bad = [f for f in cur if os.path.exists(os.path.join(A, f)) and broken(open(os.path.join(A, f), 'rb').read())]
    assert not bad, 'merge conflict markers in this build: %s (run the app build again)' % bad
prune_assets()
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
# Structured data so search engines know this is a free web app (shown as a rich result where Google supports it).
SITE = 'https://tennoform.com'
JSON_LD = '<script type="application/ld+json">' + json.dumps({
    '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Tennoform', 'url': SITE + '/',
    'description': PAGES['home'][1], 'applicationCategory': 'GameApplication', 'operatingSystem': 'Any',
    'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'USD'}}, separators=(',', ':')) + '</script>'
esc = lambda t: t.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')
def page_for(route, status_ok=True):
    title, desc, index = PAGES[route]
    url = SITE + ('/' if route == 'home' else '/%s/' % route)
    robots = 'index,follow' if index and status_ok else 'noindex,follow'
    head = ('<title>%s</title><meta name="theme-color" content="#100f0d"><meta name="description" content="%s">' % (esc(title), esc(desc))
            + ('<link rel="canonical" href="%s">' % url if status_ok else '') + '<meta name="robots" content="%s">' % robots
            + '<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Tennoform">'
            + '<meta property="og:type" content="website"><meta property="og:site_name" content="Tennoform"><meta property="og:url" content="%s"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:image" content="%s/icon-512.png">' % (url, esc(title), esc(desc), SITE)
            + '<meta name="twitter:card" content="summary"><meta name="twitter:title" content="%s"><meta name="twitter:description" content="%s">' % (esc(title), esc(desc))
            + (JSON_LD if route == 'home' else ''))
    # what a crawler without JavaScript sees: this page's name and what it is for
    b = re.sub(r'<noscript>.*?</noscript>', '<noscript><h1>%s</h1><p>%s</p><p>Tennoform is a free Warframe companion. Turn on JavaScript to use it.</p></noscript>' % (esc(title), esc(desc)), body, count=1, flags=re.S)
    return ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            '<meta http-equiv="Content-Security-Policy" content="' + csp + '">'
            '<meta name="referrer" content="strict-origin-when-cross-origin">' + head
            + shell_tags() + '</head><body>\n' + b + '\n</body></html>\n')
page = page_for('home')
# every page gets its own address: tennoform.com/farm/ is farm/index.html (GitHub Pages serves folders this way)
ROOT = os.path.join(H, '..')
for route in PAGES:
    if route == 'home':
        continue
    os.makedirs(os.path.join(ROOT, route), exist_ok=True)
    open(os.path.join(ROOT, route, 'index.html'), 'w').write(page_for(route))
# unknown addresses: the app opens on the home page, and search engines are told not to list it
open(os.path.join(ROOT, '404.html'), 'w').write(page_for('home', status_ok=False))
with open(os.path.join(ROOT, 'sitemap.xml'), 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for route, (_, _, index) in PAGES.items():
        if index:
            f.write('  <url><loc>%s</loc><changefreq>daily</changefreq></url>\n' % (SITE + ('/' if route == 'home' else '/%s/' % route)))
    f.write('</urlset>\n')
open(os.path.join(H, '..', 'index.html'), 'w').write(page)
print('index.html', len(page) // 1024, 'KB;', ', '.join('%s %d KB' % (u.split('/')[-1], os.path.getsize(os.path.join(BUNDLE, u.split('/')[-1])) // 1024) for u in files.values()))
