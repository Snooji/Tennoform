"""Additive game-data update from WFCD warframe-items, run by .github/workflows/game-data.yml.

    python build/update_gamedata.py <wfcd json folder> <wfcd version>

Adds what's new and refreshes the facts that change with patches; never rewrites hand-curated data:
  - new masterable items (Warframes, weapons, companions, Archwing...), with parts, build cost and drops
  - vault status of Prime items (vaulted, vault date, expected vault date)
  - new relics, and the rewards and vaulted flag of every relic; the part -> relic index follows
  - Prime part relic links for new items, and warframe.market names for new tradable things
  - new mods and arcanes
Curated recipes, farm routes, guides, builds and notes are left exactly as they are.
Prints a summary; exits 0 with "no changes" when there's nothing to do.
"""
import json, os, re, sys

SRC, VERSION = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, 'build', 'base.json')
def L(f):
    p = os.path.join(SRC, f)
    return json.load(open(p)) if os.path.exists(p) else []

d = json.load(open(BASE))
I, REL, MODS, ARC, PR, MS = d['items'], d['relics'], d['mods'], d['arcanes'], d['partrel'], d['mslug']
U = {}
for f in os.listdir(SRC):
    if f.endswith('.json'):
        try:
            for a in json.load(open(os.path.join(SRC, f))):
                if isinstance(a, dict) and 'uniqueName' in a:
                    U.setdefault(a['uniqueName'], a)
        except Exception:
            pass
RNAME = {}
for a in L('Relics.json'):
    for r in a.get('rewards') or []:
        it = r.get('item') or {}
        if it.get('uniqueName') and it.get('name'):
            RNAME[it['uniqueName']] = it['name']
PARTWORD = {'Helmet': 'Neuroptics', 'Chassis': 'Chassis', 'Systems': 'Systems', 'Harness': 'Harness', 'Wings': 'Wings'}
def part_of(item, uniq):
    """(short name, full name) of a part, or None for the item's own blueprint. WFCD trims component details,
    so the name comes from the relic tables when the part drops from relics, else from its internal path."""
    full = RNAME.get(uniq)
    if full:
        if full == item + ' Blueprint':
            return None
        short = full[len(item) + 1:] if full.startswith(item + ' ') else full
        return short.replace(' Blueprint', '') if ' Blueprint' in short and item.endswith('Prime') and any(w in short for w in PARTWORD.values()) else short, full
    seg = uniq.rsplit('/', 1)[-1]
    flat = item.replace(' ', '').replace('&', '').replace("'", '')
    if seg in (flat + 'Blueprint', flat):
        return None
    rest = seg[len(flat):] if seg.startswith(flat) else seg
    rest = re.sub(r'(Component|Blueprint)$', '', rest) or rest
    rest = re.sub(r'^Prime', '', rest)
    for k, v in PARTWORD.items():
        if rest.startswith(k):
            rest = v + rest[len(k):]
    short = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', rest).strip() or seg
    return short, item + ' ' + short
RAR = {'Common': 'C', 'Uncommon': 'U', 'Rare': 'R', 'Legendary': 'L'}
BADLOC = re.compile(r'Plague Star|Ghoul|Razorback|Fomorian|Operation|Event|Thermia|Scarlet Spear|Orphix|Balor|Gift of the Lotus|Tactical Alert|Nightmare|Dog Days|Pumpkin|Star Days', re.I)
def topdrops(drops, n=3):
    g = {}
    for x in drops or []:
        k = x.get('location') or ''
        if not k or BADLOC.search(k):
            continue
        m = re.match(r'(.*?),\s*Rotation ([ABC])$', k)
        base, rot = (m.group(1), m.group(2)) if m else (k, None)
        e = g.setdefault(base, {'c': 0, 'rots': set()})
        e['c'] = max(e['c'], x.get('chance') or 0)
        if rot:
            e['rots'].add(rot)
    out = []
    for base, e in sorted(g.items(), key=lambda kv: -kv[1]['c']):
        if e['c'] < 0.5 and out:
            continue
        out.append([base + (' · Rot ' + '/'.join(sorted(e['rots'])) if e['rots'] else ''), round(e['c'], 2)])
        if len(out) >= n:
            break
    return out
from datetime import date as _date
# WFCD keeps old estimates for Primes that never vaulted; only an estimate still ahead of us means anything
future = lambda s: s if s and s > _date.today().isoformat() else None
slug = lambda s: re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')
log = {'no_ducats': [], 'items': [], 'vault': [], 'relics': [], 'relic_rewards': 0, 'mods': [], 'arcanes': [], 'slugs': 0}

# 1. relics: new ones added; rewards and vaulted flag refreshed (relic data comes straight from the game)
seen = {}
for a in L('Relics.json'):
    m = re.match(r'^(Lith|Meso|Neo|Axi|Requiem) (\S+) (Intact|Exceptional|Flawless|Radiant)$', a.get('name', ''))
    if not m or m.group(3) != 'Intact':
        continue
    n = m.group(1) + ' ' + m.group(2)
    rw = [[r['item']['name'], RAR.get(r.get('rarity'), 'C')] for r in a.get('rewards') or [] if r.get('item', {}).get('name')]
    for r in a.get('rewards') or []:
        it = r.get('item') or {}
        u = (it.get('warframeMarket') or {}).get('urlName')
        if u and it.get('name') and it['name'] not in MS:
            MS[it['name']] = u; log['slugs'] += 1
    seen[n] = 1
    if n not in REL:
        REL[n] = {'n': n, 'era': m.group(1), 'rw': rw, 'loc': [], **({'v': 1} if a.get('vaulted') else {})}
        log['relics'].append(n)
        if n + ' Relic' not in MS:
            MS[n + ' Relic'] = slug(n + ' relic'); log['slugs'] += 1
    else:
        R = REL[n]
        if rw and sorted(map(tuple, rw)) != sorted(map(tuple, R.get('rw', []))):
            R['rw'] = rw; log['relic_rewards'] += 1
        if bool(a.get('vaulted')) != bool(R.get('v')):
            if a.get('vaulted'): R['v'] = 1
            else: R.pop('v', None)
            log['vault'].append(n)
# rebuild the part -> relics index from the (now current) relic rewards
idx = {}
for n, R in REL.items():
    for part, rar in R.get('rw', []):
        idx.setdefault(part, []).append([n, rar])
for k in idx:
    idx[k].sort()
d['partrel'] = PR = idx

# 2. items
CATS = {'Warframes.json': 'Warframe', 'Primary.json': 'Primary', 'Secondary.json': 'Secondary', 'Melee.json': 'Melee',
        'Sentinels.json': 'Companion', 'Pets.json': 'Companion', 'Archwing.json': 'Archwing', 'Arch-Gun.json': 'Arch-Gun',
        'Arch-Melee.json': 'Arch-Melee', 'SentinelWeapons.json': 'Robotic Weapon'}
by_u = {it.get('u'): n for n, it in I.items() if it.get('u')}
for f, cat in CATS.items():
    for a in L(f):
        n = a.get('name')
        if not n or (not a.get('masterable', True) and cat != 'Warframe'):
            continue
        cur = I.get(by_u.get(a.get('uniqueName')) or n)
        if cur is not None:
            # refresh vault facts on Primes only
            if a.get('isPrime'):
                ch = False
                for k, v in (('v', 1 if a.get('vaulted') else None), ('vd', a.get('vaultDate')), ('evd', future(a.get('estimatedVaultDate')) if not a.get('vaulted') else None)):
                    if v and cur.get(k) != v: cur[k] = v; ch = True
                    elif not v and k in cur and k != 'vd': cur.pop(k); ch = True
                if ch: log['vault'].append(n)
            continue
        if f == 'Arch-Melee.json' and a.get('productCategory') == 'Melee':
            cat = 'Melee'   # WFCD files a few normal melee weapons under Arch-Melee
        it = {'n': n, 'c': cat, 'mr': a.get('masteryReq', 0), 'p': 1 if a.get('isPrime') else 0, 'u': a['uniqueName']}
        if a.get('vaulted'): it['v'] = 1
        if a.get('isPrime') and not a.get('vaulted') and future(a.get('estimatedVaultDate')): it['evd'] = a['estimatedVaultDate']
        if a.get('vaultDate'): it['vd'] = a['vaultDate']
        if a.get('wikiaUrl'): it['w'] = a['wikiaUrl']
        if (a.get('introduced') or {}).get('date'): it['d'] = a['introduced']['date']
        if a.get('marketCost'): it['mp'] = a['marketCost']
        if a.get('bpCost'): it['bc'] = a['bpCost']
        if cat == 'Warframe' and a.get('aura'): it['aura'] = a['aura']
        if a.get('imageName'): it['img'] = a['imageName']
        it['t'], it['cr'], it['rush'] = a.get('buildTime'), a.get('buildPrice'), a.get('skipBuildTimePrice')
        parts = []
        for c in a.get('components') or []:
            uq = c.get('uniqueName', '')
            cu = U.get(uq)
            if uq in by_u:                                   # a weapon used to build this one
                parts.append({'n': by_u[uq], 'q': c.get('itemCount', 1), 'k': 'i'}); continue
            if '/Recipes/' not in uq and cu:               # a resource
                parts.append({'n': cu['name'], 'q': c.get('itemCount', 1), 'k': 'r'}); continue
            got = part_of(n, uq)
            if got is None:                                  # the item's own blueprint
                if it['p']:
                    rel = PR.get(n + ' Blueprint')
                    if rel: it['bprel'] = rel
                if cu and cu.get('drops'): it['bpd'] = topdrops(cu['drops'])
                continue
            short, full = got
            if full not in PR and full + ' Blueprint' in PR:   # Prime Warframe parts drop as "... Blueprint"
                full = full + ' Blueprint'
            e = {'n': short, 'q': c.get('itemCount', 1), 'k': 'p', 'full': full}
            if cu and cu.get('drops'): e['dr'] = topdrops(cu['drops'])
            rel = PR.get(full)
            if rel: e['rel'] = rel
            # ducat values aren't in WFCD's trimmed data and don't follow relic rarity reliably, so they're
            # only set when WFCD has them; the summary lists new Prime parts so they can be filled in by hand
            if cu and cu.get('ducats'): e['du'] = cu['ducats']
            elif rel: log['no_ducats'].append(full)
            parts.append(e)
        if not parts:
            parts = [{'n': 'Blueprint', 'q': 1, 'k': 'p'}]
        if a.get('drops'): it['dr'] = topdrops(a['drops'])
        it['parts'] = parts
        I[n] = it; by_u[a['uniqueName']] = n
        log['items'].append(n + ' (' + cat + ')')
        if it['p'] and (n + ' Set') not in MS:
            MS[n + ' Set'] = slug(n + ' set'); log['slugs'] += 1

# 3. mods and arcanes (new ones only)
for a in L('Mods.json'):
    n = a.get('name')
    if not n or n in MODS or not a.get('tradable') or (a.get('type') or '').endswith('Riven Mod'):
        continue
    m = {'n': n, 'ty': a.get('type', ''), 'r': RAR.get(a.get('rarity'), 'C')}
    if a.get('polarity'): m['pol'] = a['polarity']
    if a.get('drops'): m['dr'] = topdrops(a['drops'])
    m['tr'] = 1
    if a.get('isAugment'): m['aug'] = 1; m['for'] = a.get('compatName', '')
    MODS[n] = m; log['mods'].append(n)
for a in L('Arcanes.json'):
    n = a.get('name')
    if not n or n in ARC or n == 'Arcane':
        continue
    x = {'n': n, 'r': RAR.get(a.get('rarity'), 'C'), 'ty': a.get('type', ''), 'mx': max(0, len(a.get('levelStats') or []) - 1) or 5}
    if a.get('drops'): x['dr'] = topdrops(a['drops'])
    ARC[n] = x; log['arcanes'].append(n)

changed = any([log['items'], log['vault'], log['relics'], log['relic_rewards'], log['mods'], log['arcanes'], log['slugs']])
d['meta']['wfcd'] = VERSION
if changed:
    from datetime import date
    d['meta']['built'] = date.today().strftime('%b %-d, %Y')
with open(BASE, 'w') as fh:
    json.dump(d, fh, separators=(',', ':'))
print('WFCD', VERSION)
for k in ('items', 'relics', 'mods', 'arcanes', 'vault'):
    print(f'{k}: {len(log[k])}' + (': ' + ', '.join(log[k][:40]) + (' …' if len(log[k]) > 40 else '') if log[k] else ''))
print('relics with changed rewards:', log['relic_rewards'], '· new market names:', log['slugs'])
if log['no_ducats']:
    print('new Prime parts without ducat values (add by hand):', ', '.join(log['no_ducats']))
print('changed' if changed else 'no changes')
