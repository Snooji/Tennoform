"""Warframe Wiki user builds -> build/wikibuilds.json, credited to their authors.

Step 1 fetches every page in Category:User_Builds through the MediaWiki API (one request a second), with the
date each page was made, its first author and when it was last edited. Step 2 reads the build out of each page.
Wiki text is CC BY-NC-SA 3.0: Tennoform shows each build with its author, dates, a link to the page and the licence.

    python3 -I build/make_wikibuilds.py fetch pages.json        # slow and polite
    python3 -I build/make_wikibuilds.py parse pages.json build/base.json build/wikibuilds.json
"""
import json, re, sys, time, urllib.parse, urllib.request


def fetch(dest):
    UA = {'User-Agent': 'Tennoform build import (tennoform.com; contact via site)'}
    API = 'https://wiki.warframe.com/api.php?'
    def get(q):
        req = urllib.request.Request(API + urllib.parse.urlencode({**q, 'format': 'json', 'formatversion': 2}), headers=UA)
        with urllib.request.urlopen(req, timeout=40) as r: return json.load(r)
    out = {}
    cont = {}
    while True:  # latest content + timestamp, 50 pages per request
        d = get({'action': 'query', 'generator': 'categorymembers', 'gcmtitle': 'Category:User_Builds', 'gcmlimit': 50,
                 'prop': 'revisions', 'rvprop': 'content|timestamp|user', 'rvslots': 'main', **cont})
        for p in d['query']['pages']:
            r = (p.get('revisions') or [{}])[0]
            out[p['title']] = {'id': p['pageid'], 'title': p['title'], 'updated': r.get('timestamp'), 'lastBy': r.get('user'),
                               'text': (r.get('slots') or {}).get('main', {}).get('content', '')}
        time.sleep(1)
        if 'continue' not in d: break
        cont = d['continue']
    for i, t in enumerate(out):  # first revision: who made it and when
        d = get({'action': 'query', 'prop': 'revisions', 'titles': t, 'rvdir': 'newer', 'rvlimit': 1, 'rvprop': 'timestamp|user'})
        r = d['query']['pages'][0]['revisions'][0]
        out[t]['created'] = r['timestamp']; out[t]['author'] = r['user']
        time.sleep(1)
    json.dump(out, open(dest, 'w'))
    print(len(out))


def parse(src, base, dest):
    pages = json.load(open(src)); D = json.load(open(base))
    I, MODS, ARC = D['items'], D['mods'], D['arcanes']
    FIT = {'Warframe': {'Warframe Mod'}, 'Primary': {'Primary Mod', 'Shotgun Mod'}, 'Secondary': {'Secondary Mod'}, 'Melee': {'Melee Mod', 'Stance Mod'},
           'Arch-Gun': {'Arch-Gun Mod'}, 'Arch-Melee': {'Arch-Melee Mod'}, 'Archwing': {'Archwing Mod'}, 'Sentinel': {'Companion Mod'}, 'Companion': {'Companion Mod'},
           'Kitgun': {'Secondary Mod', 'Primary Mod'}, 'Zaw': {'Melee Mod', 'Stance Mod'}, 'Robotic Weapon': {'Primary Mod', 'Companion Mod'}}
    ARCT = {'Warframe': {'Warframe Arcane'}, 'Primary': {'Primary Arcane', 'Bow Arcane', 'Shotgun Arcane'}, 'Secondary': {'Secondary Arcane'}, 'Melee': {'Melee Arcane'}}
    names_by_len = sorted([n for n in I if len(n) > 2], key=len, reverse=True)
    def clean(t):
        t = re.sub(r'\{\{\s*M\s*\|([^|{}]+)(?:\|[^{}]*)?\}\}', r'\1', t)
        t = re.sub(r'\[\[(?:File|Image):([A-Za-z0-9]+?)Mod\.(?:png|jpg)[^\]]*\]\]', lambda m: ' ' + re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', m.group(1)) + ' ', t)
        t = re.sub(r'\{\{[^{}]*\}\}', ' ', t); t = re.sub(r'\[\[(?:File|Image|Category):[^\]]*\]\]', ' ', t, flags=re.I)
        t = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', t); t = re.sub(r'\[https?://\S+ ([^\]]*)\]', r'\1', t)
        t = re.sub(r"'{2,}", '', t); t = re.sub(r'<[^>]+>', ' ', t); return t
    def find_item(title, text):
        cats = re.findall(r'\[\[Category:([^\]|]+?) Builds?\]\]', text, re.I)
        for c in cats:
            c = c.strip()
            if c in I: return c
        head = title.split('/', 1)[-1]
        for n in names_by_len:
            if re.search(r'(?<![A-Za-z])' + re.escape(n) + r'(?![A-Za-z])', head, re.I): return n
        for n in names_by_len:
            if re.search(r'(?<![A-Za-z])' + re.escape(n) + r'(?![A-Za-z])', clean(text)[:400]): return n
        return None
    def mymods(text):
        """Template:MyMods: Weapon/Warframe, Aura, Mod1..Mod10, Forma Count, About."""
        m = re.search(r'\{\{\s*MyMods(.*?)\n\}\}', text, re.S | re.I)
        if not m: return None
        f = {}
        for line in re.split(r'\n\|', '\n' + m.group(1)):
            if '=' in line:
                k, v = line.split('=', 1); f[k.strip().lower()] = v.strip()
        mods = [f[f'mod{i}'] for i in range(1, 13) if f.get(f'mod{i}')]
        return {'item': f.get('weapon') or f.get('warframe') or f.get('companion') or f.get('sentinel') or '', 'aura': f.get('aura', ''), 'mods': mods,
                'forma': f.get('forma count', ''), 'about': f.get('about', '')}
    LOWER = {n.lower(): n for n in MODS}
    out = []
    skipped = []
    for t, p in pages.items():
        text = p.get('text') or ''
        mm = mymods(text)
        if mm:
            it = next((n for n in I if n.lower() == mm['item'].lower()), None) or find_item(t, text)
            if not it: skipped.append((t, 'no item (template)')); continue
            mods = [LOWER[x.lower()] for x in mm['mods'] if x.lower() in LOWER]
            gone = [x for x in mm['mods'] if x.lower() not in LOWER]
            aura = LOWER.get(mm['aura'].lower(), '') if mm['aura'] else ''
            if mm['aura'] and not aura: gone.append(mm['aura'])
            if len(mods) < 3: skipped.append((t, f'{len(mods)} mods (template)')); continue
            about = re.sub(r'\s+', ' ', clean(mm['about']).replace('*', ' ').strip())
            intro = about[:280] + ('…' if len(about) > 280 else '')
            owner = re.match(r'(?:User|User blog):([^/]+)/', t)
            c = I[it].get('c', '')
            out.append({'item': it, 'name': t.split('/', 1)[-1].strip()[:60], 'author': (p.get('author') or (owner.group(1) if owner else ''))[:40], 'exact': True,
                        'url': 'https://wiki.warframe.com/w/' + urllib.parse.quote(t.replace(' ', '_'), safe='/:'),
                        'created': (p.get('created') or '')[:10], 'updated': (p.get('updated') or '')[:10],
                        'aura': aura if c == 'Warframe' else '', 'mods': mods[:10], 'extra': [], 'arcanes': [], 'notes': intro,
                        'forma': mm['forma'][:3], 'gone': gone[:8]})
            continue
        item = find_item(t, text)
        if not item: skipped.append((t, 'no item')); continue
        c = I[item].get('c', '')
        fit = FIT.get(c, set()); body = clean(text)
        found = []
        for n, m in MODS.items():
            if m.get('ty') not in fit and not (c == 'Warframe' and m.get('for', '').upper() == 'AURA'): continue
            mm = re.search(r'(?<![A-Za-z])' + re.escape(n) + r'(?![A-Za-z])', body)
            if mm: found.append((mm.start(), mm.end(), n))
        # "Primed Fast Hands" also contains "Fast Hands": keep only the longest name at each spot
        found = [f for f in found if not any(g is not f and g[0] <= f[0] and f[1] <= g[1] and (g[1] - g[0]) > (f[1] - f[0]) for g in found)]
        found.sort(); mods = [n for _, _, n in found]
        aura = next((n for n in mods if MODS[n].get('for', '').upper() == 'AURA'), '')
        if aura: mods.remove(aura)
        stance = next((n for n in mods if MODS[n].get('ty') == 'Stance Mod'), '')
        if stance: mods.remove(stance)
        arcs = [n for _, n in sorted((re.search(re.escape(n), body).start(), n) for n in ARC if ARC[n].get('ty') in ARCT.get(c, set()) and re.search(r'(?<![A-Za-z])' + re.escape(n) + r'(?![A-Za-z])', body))][:2]
        if len(mods) < 4: skipped.append((t, f'{len(mods)} mods')); continue
        paras = [x.strip() for x in re.split(r'\n\s*\n', re.sub(r'^=+.*?=+\s*$', '', body, flags=re.M)) if len(x.strip()) > 40 and not x.strip().startswith(('*', '#', '{|', '|'))]
        intro = re.sub(r'\s+', ' ', paras[0])[:280].rstrip() + ('…' if paras and len(paras[0]) > 280 else '') if paras else ''
        owner = re.match(r'(?:User|User blog):([^/]+)/', t)
        name = t.split('/', 1)[-1].strip()
        out.append({'item': item, 'name': name[:60], 'author': (p.get('author') or (owner.group(1) if owner else ''))[:40], 'exact': False,
                    'url': 'https://wiki.warframe.com/w/' + urllib.parse.quote(t.replace(' ', '_'), safe='/:'),
                    'created': (p.get('created') or '')[:10], 'updated': (p.get('updated') or '')[:10],
                    'aura': aura if c == 'Warframe' else (stance if c in ('Melee', 'Zaw') else ''), 'mods': mods[:8], 'extra': mods[8:12], 'arcanes': arcs, 'notes': intro, 'forma': '', 'gone': []})
    out.sort(key=lambda b: (b['item'], b['updated']), reverse=False)
    json.dump(out, open(dest, 'w'), ensure_ascii=False, indent=0)
    print('kept', len(out), 'skipped', len(skipped))
    for s in skipped[:60]: print('  skip', *s)


if __name__ == '__main__':
    if sys.argv[1] == 'fetch': fetch(sys.argv[2])
    else: parse(sys.argv[2], sys.argv[3], sys.argv[4])
