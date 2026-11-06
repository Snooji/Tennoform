"""A page of its own for every item, mod, arcane, relic, resource and enemy (tennoform.com/mod/serration/), for search engines.

Each page has its own title and description, and the facts in plain HTML (how to get it, drop chances, stats, what it's
used in), linking to the pages of the things it mentions. That HTML sits inside #app, so the app replaces it with the
full details page as soon as it starts; search engines and link previews read it as is.

Nothing on these pages changes from day to day (no prices, no build date), so a daily price update doesn't rewrite them.
make_site.py imports this; slug() must match seoSlug() in src/js/4699972-details.js.
"""
import html, json, os, re, unicodedata

H = os.path.dirname(os.path.abspath(__file__))
esc = lambda s: html.escape(str(s), quote=True)

# key kind -> path segment (tennoform.com/<segment>/<slug>/)
SEG = {'item': 'item', 'mod': 'mod', 'arc': 'arcane', 'relic': 'relic', 'res': 'resource', 'enemy': 'enemy'}
RAR = {'C': 'Common', 'U': 'Uncommon', 'R': 'Rare', 'L': 'Legendary'}
# chance of each reward in an Intact and a Radiant relic, by rarity
RELIC_CH = {'C': (25.33, 16.67), 'U': (11, 20), 'R': (2, 10)}


def slug(s):
    s = unicodedata.normalize('NFKD', str(s))
    s = ''.join(c for c in s if not unicodedata.combining(c)).lower().replace('&', ' and ')
    s = s.replace("'", '').replace('’', '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def pct(c):
    c = float(c)
    return ('%.2f' % c).rstrip('0').rstrip('.') + '%' if c < 1 else ('%.1f' % c).rstrip('0').rstrip('.') + '%'


def hours(sec):
    h = sec / 3600
    return ('%d minutes' % round(sec / 60)) if h < 1 else ('%g hours' % round(h, 1)) if h < 48 else ('%g days' % round(h / 24, 1))


class Site:
    def __init__(self, D, stats, modinfo, enemies):
        self.D, self.stats, self.mi = D, stats, modinfo
        self.E = {e['n']: e for e in enemies}
        self.I, self.M, self.A, self.R, self.RES = D['items'], D['mods'], D['arcanes'], D['relics'], D['res']
        names = {'item': self.I, 'mod': self.M, 'arc': self.A, 'relic': self.R, 'res': self.RES, 'enemy': self.E}
        # first name wins on a clash, as in the app (same order: the data's own order)
        self.path, self.dupes = {}, []
        for k, d in names.items():
            seen = set()
            for n in d:
                s = slug(n)
                if not s or s in seen:
                    self.dupes.append(k + '|' + n)
                    continue
                seen.add(s)
                self.path[k + '|' + n] = '/%s/%s/' % (SEG[k], s)
        # a relic reward or a part name -> the item that uses it
        self.owner = {}
        for n, it in self.I.items():
            for p in it.get('parts', []):
                if p.get('k') == 'p' and p.get('full'):
                    self.owner[p['full']] = n
                    self.owner[p['full'].replace(' Blueprint', '')] = n
            self.owner[n + ' Blueprint'] = n
        self.used_in = {}
        for n, it in self.I.items():
            for p in it.get('parts', []):
                if p.get('k') == 'r':
                    self.used_in.setdefault(p['n'], set()).add(n)
                for s in p.get('sub') or []:
                    self.used_in.setdefault(s[0], set()).add(n)
        self.builds = {}
        for k in ('builds', 'wbuilds', 'cbuilds'):
            for item, bs in (D.get(k) or {}).items():
                self.builds[item] = self.builds.get(item, 0) + len(bs)
                for b in bs:
                    for m in list(b.get('mods') or []) + list(b.get('arcanes') or []) + [b.get('aura'), b.get('exilus')]:
                        if m:
                            self.builds.setdefault('mod:' + m, set()).add(item)

    def a(self, key, label=None):
        """A link to a thing's page, or plain text if it has none."""
        n = key.split('|', 1)[1]
        p = self.path.get(key)
        return '<a href="%s">%s</a>' % (p, esc(label or n)) if p else esc(label or n)

    def thing(self, n):
        """Link whatever a name is: an item (or its part), a mod, an arcane, a resource or an enemy."""
        for k in ('item', 'mod', 'arc', 'res', 'enemy'):
            if k + '|' + n in self.path:
                return self.a(k + '|' + n)
        if n in self.owner:
            return '%s (<a href="%s">%s</a>)' % (esc(n), self.path.get('item|' + self.owner[n], '#'), esc(self.owner[n]))
        return esc(n)

    def where(self, loc):
        """A drop location: link the enemy when it is one."""
        return self.a('enemy|' + loc) if ('enemy|' + loc) in self.path else esc(loc)

    @staticmethod
    def wrap(crumbs, h1, sub, body):
        nav = ' › '.join('<a href="%s">%s</a>' % (u, esc(t)) for t, u in crumbs)
        return ('<article class="seo-page" style="max-width:860px;margin:0 auto;padding:24px 16px;line-height:1.55">'
                '<nav aria-label="Breadcrumb" style="font-size:14px">%s</nav><h1>%s</h1>%s%s'
                '<p style="font-size:14px">Tennoform is a free Warframe companion: track mastery, find where to farm everything, plan builds and check prices. '
                '<a href="/farm/">Search everything in Farm finder</a>.</p></article>') % (nav, esc(h1), '<p>%s</p>' % sub if sub else '', body)

    # ---------------------------------------------------------------- each kind
    def item(self, n):
        it = self.I[n]
        st = self.stats.get(n, {})
        prime = bool(it.get('p'))
        bits = [it.get('c', '')] + (['Prime'] if prime else []) + (['Mastery rank %d' % it['mr']] if it.get('mr') else []) + (['Vaulted'] if it.get('v') else [])
        out = []
        how = []
        if it.get('bc'):
            how.append('Blueprint: buy it from the in-game Market for %s credits.' % format(it['bc'], ','))
        if it.get('bpd'):
            how.append('Blueprint drops from ' + ', '.join('%s (%s)' % (self.where(l), pct(c)) for l, c in it['bpd'][:6]) + '.')
        if it.get('bprel'):
            how.append('Blueprint comes from ' + ', '.join('%s (%s)' % (self.a('relic|' + r, r + ' relic'), RAR.get(x, x).lower()) for r, x in it['bprel'][:8]) + '.')
        if it.get('v'):
            how.append('It is vaulted: its relics no longer drop, so get them from Prime Resurgence or by trading.')
        if how:
            out.append('<h2>How to get %s</h2><ul>%s</ul>' % (esc(n), ''.join('<li>%s</li>' % h for h in how)))
        parts = []
        for p in it.get('parts', []):
            q = (' ×%s' % format(p['q'], ',')) if p.get('q', 1) > 1 else ''
            if p.get('k') == 'r':
                parts.append('<li>%s%s</li>' % (self.thing(p['n']), q))
                continue
            src = []
            if p.get('rel'):
                src.append('relics ' + ', '.join('%s (%s)' % (self.a('relic|' + r, r), RAR.get(x, x).lower()) for r, x in p['rel'][:6]))
            if p.get('dr'):
                src.append('drops from ' + ', '.join('%s (%s)' % (self.where(l), pct(c)) for l, c in p['dr'][:4]))
            if p.get('k') == 'i':
                src.append('crafted: ' + self.thing(p['n']))
            parts.append('<li><b>%s</b>%s%s</li>' % (esc(p.get('full') or p['n']), q, (': ' + '; '.join(src)) if src else ''))
        if parts:
            out.append('<h2>Parts and resources</h2><ul>%s</ul>' % ''.join(parts))
        if it.get('cr') and it.get('t'):
            out.append('<p>Building it in the Foundry costs %s credits and takes %s.</p>' % (format(it.get('cr', 0), ','), hours(it.get('t', 0))))
        facts = [(l, st[k]) for k, l in (('h', 'Health'), ('s', 'Shields'), ('a', 'Armor'), ('e', 'Energy'), ('sp', 'Sprint speed')) if st.get(k)]
        if facts:
            out.append('<h2>Stats</h2><ul>%s</ul>' % ''.join('<li>%s: %g</li>' % (l, v) for l, v in facts))
        if st.get('ab'):
            out.append('<h2>Abilities</h2><ul>%s</ul>' % ''.join('<li><b>%s</b>: %s</li>' % (esc(a), esc(d)) for a, d in st['ab']))
        nb = self.builds.get(n)
        if isinstance(nb, int) and nb:
            out.append('<p>%d build%s for %s on Tennoform, with the mods, arcanes and why each choice works. <a href="/arsenal/">Open Builds</a>.</p>' % (nb, '' if nb == 1 else 's', esc(n)))
        if it.get('w'):
            out.append('<p><a href="%s" rel="noopener">%s on the Warframe Wiki</a></p>' % (esc(it['w']), esc(n)))
        relics = [r for p in it.get('parts', []) for r, _ in (p.get('rel') or [])] + [r for r, _ in it.get('bprel') or []]
        title = '%s: %s · Tennoform' % (n, 'Relics, Parts and How to Get It' if relics else 'How to Get It, Parts and Stats')
        if relics:
            desc = 'Where to get %s in Warframe: which relics drop each part%s, the resources it needs and its build time.' % (n, ' (vaulted)' if it.get('v') else '')
        else:
            desc = 'How to get %s in Warframe: where the blueprint and parts come from, the resources it needs, its stats and build time.' % n
        crumbs = [('Home', '/'), ('Farm finder', '/farm/')]
        return title, desc, self.wrap(crumbs, n, ' · '.join(b for b in bits if b), ''.join(out)), crumbs

    def mod(self, n, arc=False):
        m = (self.A if arc else self.M)[n]
        x = self.mi.get(n, {})
        kind = 'Arcane' if arc else 'Mod'
        bits = [m.get('ty') or kind, RAR.get(m.get('r'), '')] + ([('Polarity: ' + m['pol'].capitalize())] if m.get('pol') and not arc else []) + (['Tradeable'] if m.get('tr') else [])
        out = []
        if x.get('fx'):
            out.append('<h2>What it does</h2><p>At max rank (%s): %s.</p>' % (x.get('rk', m.get('mx', '')), esc(', '.join(x['fx']))))
            if x.get('fx0'):
                out.append('<p>At rank 0: %s.</p>' % esc(', '.join(x['fx0'])))
        if x.get('fits') or m.get('for'):
            out.append('<p>Fits: %s.</p>' % esc(x.get('fits') or m.get('for')))
        if m.get('dr'):
            out.append('<h2>Where to get %s</h2><ul>%s</ul>' % (esc(n), ''.join('<li>%s: %s</li>' % (self.where(l), pct(c)) for l, c in m['dr'][:12])))
        if m.get('src'):
            out.append('<p>%s</p>' % esc(m['src']))
        used = sorted(self.builds.get('mod:' + n, set()))
        if used:
            out.append('<h2>Used in builds for</h2><p>%s</p>' % ', '.join(self.thing(i) for i in used[:40]))
        fx = ', '.join(x.get('fx') or []).rstrip('.')
        if len(fx) > 80:  # cut at a word, not mid-word
            fx = fx[:80].rsplit(' ', 1)[0].rstrip(',;:') + '…'
        title = '%s: Warframe %s Stats and Drop Locations · Tennoform' % (n, kind)
        desc = '%s (%s)%s%s Where it drops, with chances, and the builds that use it.' % (n, m.get('ty') or kind, (': ' + fx) if fx else '', '' if fx.endswith('…') else '.')
        crumbs = [('Home', '/'), ('Builds', '/arsenal/')]
        return title, desc, self.wrap(crumbs, n, ' · '.join(b for b in bits if b), ''.join(out)), crumbs

    def relic(self, n):
        r = self.R[n]
        rows = ''.join('<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>' % (
            self.thing(i), RAR.get(x, x), pct(RELIC_CH.get(x, (0, 0))[0]), pct(RELIC_CH.get(x, (0, 0))[1])) for i, x in r.get('rw', []))
        out = ['<h2>Rewards</h2><table><thead><tr><th>Reward</th><th>Rarity</th><th>Intact</th><th>Radiant</th></tr></thead><tbody>%s</tbody></table>' % rows]
        if r.get('loc'):
            out.append('<h2>Where to get the %s relic</h2><ul>%s</ul>' % (esc(n), ''.join('<li>%s</li>' % esc(l if isinstance(l, str) else ' · '.join(str(y) for y in l)) for l in r['loc'][:12])))
        elif r.get('v') or not r.get('loc'):
            out.append('<p>This relic is vaulted: it doesn\'t drop right now. Get it from Prime Resurgence or by trading with other players.</p>')
        title = '%s Relic: Rewards, Drop Chances and Where to Farm · Tennoform' % n
        rare = [i for i, x in r.get('rw', []) if x == 'R']
        desc = 'What the %s relic gives%s, the chance of each reward Intact to Radiant, and where to farm it.' % (n, (', including ' + rare[0]) if rare else '')
        crumbs = [('Home', '/'), ('Relics', '/relics/')]
        return title, desc, self.wrap(crumbs, n + ' Relic', '%s relic%s' % (r.get('era', ''), ' · Vaulted' if not r.get('loc') else ''), ''.join(out)), crumbs

    def res(self, n):
        r = self.RES[n]
        out = []
        if r.get('loc'):
            out.append('<p>Found on: %s.</p>' % esc(r['loc']))
        if r.get('best'):
            out.append('<p>Best place to farm it: %s.</p>' % esc(r['best']))
        if r.get('how'):
            out.append('<p>%s</p>' % esc(r['how']))
        tiers = (self.D.get('rtiers') or {}).get(n, {}).get('tiers') or {}
        for stage, rows in tiers.items():
            out.append('<h2>%s</h2><ul>%s</ul>' % (esc(stage), ''.join('<li>%s (%s, level %s–%s)%s</li>' % (
                esc(x[0]), esc(x[1]), x[2][0], x[2][1], (': ' + esc(x[3])) if len(x) > 3 and x[3] else '') for x in rows[:4])))
        for w, why in (self.D.get('rsrc') or {}).get(n, [])[:6]:
            out.append('<p>%s: %s</p>' % (esc(w), esc(why)))
        if r.get('dr'):
            out.append('<h2>Drop chances</h2><ul>%s</ul>' % ''.join('<li>%s: %s</li>' % (self.where(l), pct(c)) for l, c in r['dr'][:10]))
        used = sorted(self.used_in.get(n, set()))
        if used:
            out.append('<h2>Needed to build</h2><p>%s%s</p>' % (', '.join(self.thing(i) for i in used[:60]), ' and more' if len(used) > 60 else ''))
        title = '%s: Where to Farm It in Warframe · Tennoform' % n
        desc = 'Where to farm %s in Warframe%s: the best nodes for early, mid and late game, and what you need it for.' % (n, (' (' + r['loc'][:60] + ')') if r.get('loc') else '')
        crumbs = [('Home', '/'), ('Resources', '/resources/')]
        return title, desc, self.wrap(crumbs, n, 'Resource', ''.join(out)), crumbs

    def enemy(self, n):
        e = self.E[n]
        out = []
        if e.get('d'):
            out.append('<p>%s</p>' % esc(e['d']))
        where = []
        if e.get('boss'):
            where.append('Fought on ' + ', '.join('%s, %s (Assassination)' % (esc(a), esc(b)) for a, b in e['boss']) + '.')
        if e.get('reg'):
            where.append('Spawns on ' + ', '.join(esc(r[0]) for r in e['reg']) + '.')
        if e.get('where'):
            where.append(esc(e['where']))
        if where:
            out.append('<h2>Where %s shows up</h2><p>%s</p>' % (esc(n), ' '.join(where)))
        lay = ''.join('<li><b>%s</b> %s: weak to %s%s</li>' % (esc(t), format(a, ','), esc(', '.join(w) or 'nothing in particular'), ('; resists ' + esc(', '.join(r))) if r else '')
                      for t, a, w, r in e.get('lay', []) if a)
        out.append('<h2>Health and weaknesses</h2><p>Health %s, shields %s, armor %s (base values; they grow with level).</p>%s' % (
            format(e.get('hp', 0), ','), format(e.get('sh', 0), ','), format(e.get('ar', 0), ','), '<ul>%s</ul>' % lay if lay else ''))
        if e.get('dr'):
            out.append('<h2>Drops</h2><ul>%s</ul>' % ''.join('<li>%s: %s per kill</li>' % (self.thing(d), pct(c)) for d, k, c in e['dr'][:20]))
        weak = sorted({w for _, a, ws, _ in e.get('lay', []) if a for w in ws[:2]})
        title = '%s: Weaknesses, Drops and Where to Find It · Tennoform' % n
        desc = '%s (%s%s) in Warframe: where it spawns, its health and armor%s, and what it drops.' % (
            n, e.get('f', ''), ' boss' if e.get('boss') else '', (', weak to ' + ', '.join(weak[:3])) if weak else '')
        crumbs = [('Home', '/'), ('Farm finder', '/farm/')]
        return title, desc, self.wrap(crumbs, n, '%s%s' % (e.get('f', ''), ' · Boss' if e.get('boss') else ''), ''.join(out)), crumbs

    def page(self, key):
        k, n = key.split('|', 1)
        return {'item': self.item, 'mod': self.mod, 'arc': lambda x: self.mod(x, True), 'relic': self.relic, 'res': self.res, 'enemy': self.enemy}[k](n)

    # ---------------------------------------------------------------- lists on the main pages
    def hub(self, route):
        """Links to every page a section covers, for the section's own page (/relics/ lists every relic)."""
        def group(title, keys):
            keys = [k for k in keys if k in self.path]
            return '<h2>%s</h2><p>%s</p>' % (esc(title), ', '.join(self.a(k) for k in keys)) if keys else ''
        if route == 'relics':
            eras = {}
            for n, r in self.R.items():
                eras.setdefault(r.get('era') or 'Other', []).append('relic|' + n)
            return ''.join(group(e + ' relics', ks) for e, ks in eras.items())
        if route == 'resources':
            return group('Every resource', ['res|' + n for n in sorted(self.RES)])
        if route == 'frames':
            return group('Every Warframe', ['item|' + n for n in sorted(self.I) if self.I[n].get('c') == 'Warframe'])
        if route == 'arsenal':
            return group('Mods', ['mod|' + n for n in sorted(self.M)]) + group('Arcanes', ['arc|' + n for n in sorted(self.A)])
        if route == 'farm':
            cats = {}
            for n in sorted(self.I):
                cats.setdefault(self.I[n].get('c') or 'Other', []).append('item|' + n)
            return ''.join(group(c, ks) for c, ks in sorted(cats.items())) + group('Enemies', ['enemy|' + n for n in sorted(self.E)])
        return ''


def load(D):
    j = lambda p, d: json.load(open(p, encoding='utf-8')) if os.path.exists(p) else d
    R = os.path.join(H, '..')
    return Site(D, j(os.path.join(R, 'data', 'stats.json'), {}), j(os.path.join(R, 'data', 'mods.json'), {}), D.get('enemies') or [])
