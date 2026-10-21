"""Enemies for search and the details page: build build/enemies.json from WFCD warframe-items.

    python build/make_enemies.py <wfcd json folder>    # e.g. node_modules/@wfcd/items/data/json

For each enemy: faction, description, health/shield/armour, what each layer is weak and resistant to, the planets it
spawns on, the assassination node for bosses, and what it drops with the real chance per kill.
- Planets come from the game's own spawn list (regionBits), decoded with Node.json's planet numbers.
- Drop chances are WFCD's per-enemy chances, read from the drop lists of every mod and item (the location is the enemy).
- Variants with the same name (an Eximus "leader", a slightly different spawn) are merged into one entry.
The site loads the file just after the page is up (bundle/enemies-*.json), so it doesn't add to the first page load.
"""
import json, os, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'node_modules/@wfcd/items/data/json'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load = lambda f: json.load(open(os.path.join(SRC, f + '.json'), encoding='utf-8'))
base = json.load(open(os.path.join(ROOT, 'build', 'base.json'), encoding='utf-8'))

# faction from the enemy's path (/Lotus/Types/Enemies/<Faction>/...); WFCD's "type" is sometimes a weapon class instead
FACTION = {'Grineer': 'Grineer', 'Corpus': 'Corpus', 'Infested': 'Infested', 'Infestation': 'Infested', 'Orokin': 'Corrupted',
           'Corrupted': 'Corrupted', 'Sentient': 'Sentient', 'Sentients': 'Sentient', 'Narmer': 'Narmer', 'Murmur': 'The Murmur',
           'Stalker': 'Stalker', 'Tenno': 'Tenno', 'Wild': 'Wildlife', 'Fauna': 'Wildlife', 'Neutral': 'Neutral', 'Techrot': 'Techrot',
           'Scaldra': 'Scaldra', 'Anarch': 'Anarch'}
def faction(e):
    parts = e.get('uniqueName', '').split('/')
    for p in parts[4:6]:
        if p in FACTION:
            return FACTION[p]
    return FACTION.get(e.get('type', ''), e.get('type') or 'Other')

# bosses fought on an assassination node: the node names are checked against the star chart below
BOSSES = {'Captain Vor': ['Tolstoj', 'Exta'], 'Lt Lech Kril': ['War', 'Exta'], 'Jackal': ['Fossa'], 'Councilor Vay Hek': ['Oro'],
          'The Sergeant': ['Iliad'], 'Alad V': ['Themisto'], 'The Raptor': ['Naamah'], 'General Sargas Ruk': ['Tethys'],
          'Tyl Regor': ['Titania'], 'Hyena Ng': ['Psamathe'], 'Hyena Th': ['Psamathe'], 'Hyena Pb': ['Psamathe'], 'Hyena Ln2': ['Psamathe'],
          'Kela De Thaym': ['Merrow'], 'Ambulas': ['Hades'], 'Mutalist Alad V': ['Mutalist Alad V Assassinate'],
          'Jordas Golem': ['Jordas Golem Assassinate'], 'Ropalolyst': ['The Ropalolyst'], 'Lephantis': ['Magnacidium']}
# where special enemies show up, when the planet list alone would mislead
WHERE = {'Lephantis': 'Also the Orokin Derelict Assassination (needs a Derelict Assassination key).',
         'Eidolon Teralyst': 'Plains of Eidolon (Earth), at night. Bounties from Konzu or a Cetus Wisp lure trip.',
         'Eidolon Gantulyst': 'Plains of Eidolon (Earth), at night, after capturing a Teralyst.',
         'Eidolon Hydrolyst': 'Plains of Eidolon (Earth), at night, after capturing a Gantulyst.',
         'Eidolon Vomvalyst': 'Plains of Eidolon (Earth), at night, around the Eidolon shards.',
         'Profit-Taker Orb': 'Orb Vallis (Venus): the Profit-Taker heist bounty from Eudico in Fortuna (needs Solaris United rank 5).',
         'Exploiter Orb': 'Orb Vallis (Venus): the Exploiter Orb heist bounty from Eudico in Fortuna.'}
assn = {n['n']: n['p'] for n in base['allnodes'] if n.get('t') == 'Assassination'}

# planet number -> name, and each planet's enemy level range on the star chart
planet = {}
for n in load('Node'):
    if n.get('systemIndex') is not None and n.get('systemName'):
        planet.setdefault(n['systemIndex'], n['systemName'])
levels = {}
for n in base['allnodes']:
    if n.get('lv') and n['lv'][1] > 1:
        lo, hi = levels.get(n['p'], (999, 0))
        levels[n['p']] = (min(lo, n['lv'][0]), max(hi, n['lv'][1]))

def clean(s):
    s = re.sub(r'<[^>]+>', '', str(s or ''))
    return re.sub(r'\s+', ' ', s).strip()[:300]

def layers(e):
    out = []
    for r in e.get('resistances') or []:
        if not r.get('amount') and r.get('type') == 'Shield' and not e.get('shield'):
            continue
        aff = [a for a in r.get('affectors') or [] if a.get('element') not in (None, 'None')]
        out.append([r.get('type', ''), r.get('amount') or 0,
                    [a['element'] for a in sorted(aff, key=lambda a: -a['modifier']) if a['modifier'] > 0],
                    [a['element'] for a in sorted(aff, key=lambda a: a['modifier']) if a['modifier'] < 0]])
    return out

E = {}
for e in load('Enemy'):
    n = e.get('name', '').strip()
    if not n or n.startswith('/'):
        continue
    x = E.get(n)
    if not x:
        E[n] = x = {'n': n, 'f': faction(e), 'd': clean(e.get('description')), 'hp': e.get('health') or 0, 'sh': e.get('shield') or 0,
                    'ar': e.get('armor') or 0, 'lay': layers(e), 'bits': 0, 'img': e.get('imageName') or '', 'v': 0}
    x['bits'] |= e.get('regionBits') or 0
    x['v'] += 1

# drops: every mod and item that lists this enemy as a drop location, with its chance per kill (in %)
names = set(E)
drops = {n: {} for n in names}
def put(loc, nm, kind, ch):
    if loc in names and ch:
        ch = round(float(ch), 2)
        if ch > drops[loc].get(nm, [0, 0, 0])[2]:
            drops[loc][nm] = [nm, kind, ch]
def add_drops(f, kind):
    for it in load(f):
        if not it.get('name'):
            continue
        for c in [it] + [c for c in it.get('components') or [] if c.get('name')]:
            nm = it['name'] if c is it else (c['name'] if c['name'].startswith(it['name']) else it['name'] + ' ' + c['name'])
            for d in c.get('drops') or []:
                put((d.get('location') or '').strip(), nm, kind, d.get('chance'))
add_drops('Mods', 'mod')
add_drops('Arcanes', 'arc')
for f in ('Warframes', 'Primary', 'Secondary', 'Melee', 'Archwing', 'Arch-Gun', 'Arch-Melee', 'Sentinels', 'SentinelWeapons', 'Pets', 'Misc'):
    add_drops(f, 'item')
add_drops('Resources', 'res')
# blueprints and parts as the site already knows them (base.json keeps boss blueprint drops WFCD leaves out)
for n, it in base['items'].items():
    for loc, ch in it.get('bpd') or []:
        put(loc, n + ' Blueprint', 'item', ch)
    for pt in it.get('parts') or []:
        for loc, ch in pt.get('dr') or []:
            put(loc, pt.get('full') or n + ' ' + pt['n'], 'item', ch)

out = []
for n in sorted(E):
    x = E[n]
    reg = [planet[i] for i in sorted(planet) if x['bits'] >> i & 1]
    x['reg'] = [[p, *levels[p]] if p in levels else [p] for p in reg]
    boss = [[node, assn[node]] for node in BOSSES.get(n, []) if node in assn]
    if boss:
        x['boss'] = boss
    if n in WHERE:
        x['where'] = WHERE[n]
    x['dr'] = sorted(drops[n].values(), key=lambda d: (-d[2], d[0]))[:40]
    del x['bits']
    if x['v'] == 1:
        del x['v']
    out.append(x)

missing = [b for b in list(BOSSES) + list(WHERE) if b not in E]
if missing:
    print('bosses not in WFCD enemies:', ', '.join(missing))
dest = os.path.join(ROOT, 'build', 'enemies.json')
json.dump(out, open(dest, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'enemies;', sum(1 for x in out if x['reg']), 'with planets;', sum(1 for x in out if x['dr']), 'with drops;',
      sum(1 for x in out if x.get('boss')), 'bosses;', os.path.getsize(dest) // 1024, 'KB')
