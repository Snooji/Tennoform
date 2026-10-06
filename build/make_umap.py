"""Builds data/umap.json: the game's internal names (uniqueName) -> Tennoform names, used when importing an inventory file.

Usage: python3 build/make_umap.py <folder with WFCD @wfcd/items data/json files>
"""
import json, os, re, sys, glob
H = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1]
D = json.load(open(os.path.join(H, 'base.json')))
I, MODS, ARC, RES, REL = D['items'], D['mods'], D['arcanes'], D['res'], D['relics']
W = {}
for f in glob.glob(os.path.join(src, '*.json')):
    try:
        L = json.load(open(f))
    except Exception:
        continue
    if isinstance(L, list):
        for x in L:
            if isinstance(x, dict) and x.get('uniqueName') and x.get('name'):
                W.setdefault(x['uniqueName'], x)
m, a, r, l, c, b = {}, {}, {}, {}, {}, {}
for u, x in W.items():
    n = x['name']
    if n in MODS and (x.get('category') == 'Mods' or u.startswith('/Lotus/Upgrades/Mods/')): m[u] = n
    elif n in ARC and '/CosmeticEnhancers/' in u: a[u] = n
    elif n in RES: r[u] = n
REF = {'Bronze': 'i', 'Silver': 'e', 'Gold': 'f', 'Platinum': 'r'}
for u, x in W.items():
    mm = re.match(r'(.+) (Intact|Exceptional|Flawless|Radiant)$', x['name'])
    if mm and mm.group(1) in REL and '/Projections/' in u:
        l[u] = [mm.group(1), {'Intact': 'i', 'Exceptional': 'e', 'Flawless': 'f', 'Radiant': 'r'}[mm.group(2)]]
norm = lambda s: re.sub(r'[^a-z]', '', s.lower().replace('prime ', '').replace('neuroptics', 'helmet'))
miss = 0
for n, it in I.items():
    w = W.get(it.get('u') or '')
    if not w: continue
    parts = [p for p in it['parts'] if p['k'] == 'p' and p['n'] != 'Blueprint']
    for comp in w.get('components') or []:
        cu = comp['uniqueName']
        last = cu.split('/')[-1]
        if cu in r or '/MiscItems/' in cu or '/Types/Items/' in cu: continue
        low = last.lower()
        if low.endswith('blueprint') and not any(low[:-9].endswith(norm(p['n'])) for p in parts):
            b[cu] = n; continue  # the item's main blueprint
        key = re.sub(r'(component|blueprint)$', '', low)
        best = max(parts, key=lambda p: len(norm(p['n'])) if key.endswith(norm(p['n'])) else -1, default=None)
        if not best or not key.endswith(norm(best['n'])): miss += 1; continue
        c[cu] = [n, best['n']]
        # a part's own blueprint (Warframe parts): ...HelmetComponent -> ...HelmetBlueprint
        if last.endswith('Component'): c[cu[:-9] + 'Blueprint'] = [n, best['n'], 1]
        elif not last.endswith('Blueprint'): c[cu + 'Blueprint'] = [n, best['n'], 1]
out = {'v': D['meta'].get('wfcd'), 'm': m, 'a': a, 'r': r, 'l': l, 'c': c, 'b': b}
p = os.path.join(H, '..', 'data', 'umap.json')
json.dump(out, open(p, 'w'), separators=(',', ':'), ensure_ascii=False)
print({k: len(v) for k, v in out.items() if isinstance(v, dict)}, 'unmatched parts', miss, os.path.getsize(p) // 1024, 'KB')
print('relic names covered', len({x[0] for x in l.values()}), 'of', len(REL), '| mods', len(set(m.values())), 'of', len(MODS), '| arcanes', len(set(a.values())), 'of', len(ARC), '| res', len(set(r.values())), 'of', len(RES))
