"""Writes build/crafts.json: the Foundry recipe of every craftable thing that isn't masterable gear (those live in
base.json items): Forma, Catalysts, Reactors, Specters, Ciphers, keys, alloys, Fieldron, Kitgun and Zaw parts, Amps...

    python3 -I build/make_crafts.py <wfcd json folder>

Each recipe: c (kind), cr (credits), t (seconds), q (how many one build makes), parts: [{n, q, k}] where k is
'r' for a plain resource, 'p' for a crafted component with its own sub list, 'i' for masterable gear (base.json items).
"""
import glob, json, os, sys

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
base = json.load(open(os.path.join(ROOT, 'build', 'base.json')))
ITEMS = base['items']
RES = base['res']
# plain resources the data also lists with a recipe nobody uses (they come from drops); everything else is kept
RAW = {'Control Module', 'Gallium', 'Morphics', 'Neural Sensors', 'Neurodes', 'Orokin Cell'}
FILES = ('Gear.json', 'Misc.json', 'Resources.json', 'Pets.json', 'Quests.json', 'Arch-Gun.json', 'Arch-Melee.json',
         'Primary.json', 'Secondary.json', 'Melee.json', 'Sentinels.json', 'SentinelWeapons.json', 'Archwing.json', 'Warframes.json')
A = []
for f in glob.glob(os.path.join(SRC, '*.json')):
    try:
        x = json.load(open(f))
    except Exception:
        continue
    if isinstance(x, list):
        for a in x:
            if isinstance(a, dict) and 'uniqueName' in a:
                a['_f'] = os.path.basename(f)
                A.append(a)
U = {a['uniqueName']: a for a in A}
KIND = {'Gear.json': 'Gear', 'Resources.json': 'Resource', 'Pets.json': 'Companion', 'Quests.json': 'Key'}

def nm(c):
    a = U.get(c['uniqueName'])
    n = (a or {}).get('name') or c.get('name')
    return n

def parts(a, depth=0):
    out = []
    for c in a.get('components') or []:
        n = nm(c)
        if not n or n == 'Blueprint' or n.endswith(' Blueprint') and c['uniqueName'].endswith('Blueprint'):
            continue
        q = c.get('itemCount') or 1
        sub = U.get(c['uniqueName'])
        if n in RES:
            out.append({'n': n, 'q': q, 'k': 'r'})
        elif n in ITEMS:
            out.append({'n': n, 'q': q, 'k': 'i'})
        elif sub and sub.get('components') and depth < 2 and sub.get('_f') != 'Resources.json':
            s = [[nm(x), x.get('itemCount') or 1] for x in sub['components'] if nm(x) and nm(x) != 'Blueprint']
            out.append({'n': n, 'q': q, 'k': 'p', 'sub': s, 'cr': sub.get('buildPrice') or 0, 't': sub.get('buildTime') or 0})
        else:
            out.append({'n': n, 'q': q, 'k': 'r'})
    return out

crafts = {}
for a in A:
    n = a.get('name')
    if n and n.startswith('Test '):
        continue
    if a['_f'] not in FILES or not n or not a.get('components') or n in ITEMS or n in crafts or n in RAW:
        continue
    ps = parts(a)
    if not ps:
        continue
    kind = KIND.get(a['_f']) or a.get('type') or a.get('category') or 'Misc'
    crafts[n] = {'c': kind, 'cr': a.get('buildPrice') or 0, 't': a.get('buildTime') or 0, 'q': a.get('buildQuantity') or 1, 'parts': ps}
fulls = {p.get('full') for it in ITEMS.values() for p in it.get('parts', [])}
crafts = {k: v for k, v in sorted(crafts.items()) if k not in fulls}
json.dump(crafts, open(os.path.join(ROOT, 'build', 'crafts.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('crafts.json', len(crafts), 'recipes')
