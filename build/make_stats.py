"""Item stats for item pages: build data/stats.json from WFCD warframe-items.

    python build/make_stats.py <wfcd json folder>    # e.g. node_modules/@wfcd/items/data/json

Only items Tennoform knows (build/base.json) are kept, matched by uniqueName first, then by name.
The site loads data/stats.json only when an item page opens, so it doesn't add to the first page load.
"""
import json, os, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'node_modules/@wfcd/items/data/json'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ['Warframes', 'Archwing', 'Primary', 'Secondary', 'Melee', 'Arch-Gun', 'Arch-Melee', 'Pets', 'Sentinels', 'SentinelWeapons', 'Misc']
DMG = ['impact', 'puncture', 'slash', 'heat', 'cold', 'electricity', 'toxin', 'blast', 'radiation', 'gas', 'magnetic', 'viral', 'corrosive', 'void', 'tau', 'true']

def r(v, n=2):
    return None if v is None else round(float(v), n)

def clean(s):
    # WFCD keeps in-game number placeholders like |DURATION|; the real numbers depend on rank, so show X
    s = re.sub(r'<[^>]+>', '', str(s or ''))
    s = re.sub(r'\|[A-Z_0-9]+\|', 'X', s)
    return re.sub(r'\s+', ' ', s).strip()[:400]

def stats(x):
    o = {}
    for k, kk in (('health', 'h'), ('shield', 's'), ('armor', 'a'), ('power', 'e'), ('sprintSpeed', 'sp')):
        if x.get(k):
            o[kk] = r(x[k])
    if x.get('abilities'):
        o['ab'] = [[a.get('name', ''), clean(a.get('description'))] for a in x['abilities'] if a.get('name')][:6]
    if x.get('passiveDescription'):
        o['pass'] = clean(x['passiveDescription'])
    d = x.get('damage') if isinstance(x.get('damage'), dict) else None
    if d:
        o['dmg'] = {k: r(d[k], 1) for k in DMG if d.get(k)}
    for k, kk, n in (('totalDamage', 'tot', 1), ('criticalChance', 'cc', 3), ('criticalMultiplier', 'cm', 2), ('procChance', 'sc', 3),
                     ('fireRate', 'fr', 2), ('magazineSize', 'mag', 0), ('reloadTime', 'rl', 2), ('multishot', 'ms', 1),
                     ('range', 'rng', 2), ('followThrough', 'ft', 2), ('comboDuration', 'cd', 1), ('heavyAttackDamage', 'hv', 0),
                     ('slamAttack', 'sl', 0), ('blockingAngle', 'ba', 0), ('windUp', 'wu', 2), ('disposition', 'dispo', 0)):
        v = x.get(k)
        if v not in (None, 0, ''):
            o[kk] = r(v, n) if n else int(round(float(v)))
    for k, kk in (('trigger', 'trig'), ('noise', 'noise')):
        if x.get(k):
            o[kk] = str(x[k])
    return o

base = json.load(open(os.path.join(ROOT, 'build', 'base.json')))['items']
by_u = {it.get('u'): n for n, it in base.items() if it.get('u')}
out = {}
for f in FILES:
    p = os.path.join(SRC, f + '.json')
    if not os.path.exists(p):
        continue
    for x in json.load(open(p)):
        n = by_u.get(x.get('uniqueName')) or (x.get('name') if x.get('name') in base else None)
        if not n or n in out:
            continue
        s = stats(x)
        if len(s) >= 2:
            out[n] = s
os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
with open(os.path.join(ROOT, 'data', 'stats.json'), 'w') as fh:
    json.dump(out, fh, separators=(',', ':'), ensure_ascii=False)
print('stats for', len(out), 'of', len(base), 'items,', os.path.getsize(os.path.join(ROOT, 'data', 'stats.json')) // 1024, 'KB')
