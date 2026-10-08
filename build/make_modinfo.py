"""Mod and arcane details for builds: build data/mods.json from WFCD warframe-items.

    python build/make_modinfo.py <wfcd json folder>    # e.g. node_modules/@wfcd/items/data/json

For every mod and arcane Tennoform knows (build/base.json) it keeps what the mod does at max rank and at rank 0,
its max rank, drain and what it fits. The site loads data/mods.json only when a build or mod is opened.
"""
import json, os, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'node_modules/@wfcd/items/data/json'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# the game's colour tags for damage types, as players know them
DT = {'IMPACT': 'Impact', 'PUNCTURE': 'Puncture', 'SLASH': 'Slash', 'FIRE': 'Heat', 'FREEZE': 'Cold', 'ELECTRICITY': 'Electricity',
      'POISON': 'Toxin', 'EXPLOSION': 'Blast', 'RADIATION': 'Radiation', 'GAS': 'Gas', 'MAGNETIC': 'Magnetic', 'VIRAL': 'Viral',
      'CORROSIVE': 'Corrosive', 'RADIANT': 'Void', 'SENTIENT': 'Tau'}

def clean(s):
    s = str(s or '').replace('\\n', '\n')
    # '<DT_FIRE_COLOR>Heat' already names the type; '<DT_SLASH_COLOR> on Critical' doesn't
    def dt(m):
        name = DT.get(m.group(1), m.group(1).title())
        return name if m.group(2).strip() == name else name + m.group(2)
    s = re.sub(r'<DT_([A-Z]+)_COLOR>(\s*\w*)', dt, s)
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'\|[A-Z_0-9]+\|', 'X', s)
    s = re.sub(r'[ \t]+', ' ', s)
    return '\n'.join(x.strip() for x in s.split('\n') if x.strip())[:300]

def lines(level):
    # every arcane also lists '+1 Arcane Revive', which isn't part of what it does
    out = []
    for x in (level or {}).get('stats', []):
        x = clean(re.sub(r'\\n\+1 Arcane Revive|^\+1 Arcane Revive$', '', x))
        if x and x not in out:
            out.append(x)
    # a passive part is sometimes listed twice: inside the conditional block and on its own
    solo = {x for x in out if '\n' not in x}
    out = ['\n'.join(p for p in x.split('\n') if p not in solo) if '\n' in x else x for x in out]
    return out[:6]

def pick(cands):
    # the same name can appear more than once (beta copies, odd variants): keep the one with real stats and the most ranks
    return max(cands, key=lambda m: (bool(m.get('levelStats')), m.get('tradable') is True, len(m.get('levelStats') or [])))

def main():
    base = json.load(open(os.path.join(ROOT, 'build', 'base.json')))
    want_mods, want_arc = set(base['mods']), set(base['arcanes'])
    byname = {}
    for f in ('Mods', 'Arcanes'):
        for m in json.load(open(os.path.join(SRC, f + '.json'))):
            byname.setdefault(m.get('name'), []).append(m)
    out, missing = {}, []
    for n in sorted(want_mods | want_arc):
        if n not in byname:
            missing.append(n)
            continue
        m = pick(byname[n])
        ls = m.get('levelStats') or []
        o = {'fx': lines(ls[-1]) if ls else []}
        if len(ls) > 1 and lines(ls[0]) != o['fx']:
            o['fx0'] = lines(ls[0])
        rk = m.get('fusionLimit') if n in want_mods else max(0, len(ls) - 1)
        if rk:
            o['rk'] = rk
        if n in want_mods and m.get('baseDrain') is not None:
            # drain at max rank; auras and stances give capacity instead, shown as a negative cost in game
            o['dr'] = m['baseDrain'] + (rk or 0) if m['baseDrain'] >= 0 else m['baseDrain'] - (rk or 0)
        if m.get('compatName'):
            o['fits'] = str(m['compatName']).title() if str(m['compatName']).isupper() else m['compatName']
        if m.get('description') and not o['fx']:
            o['fx'] = [clean(m['description'])]
        out[n] = o
    os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
    with open(os.path.join(ROOT, 'data', 'mods.json'), 'w') as f:
        json.dump(out, f, separators=(',', ':'), ensure_ascii=False)
    print(f'mods.json: {len(out)} mods and arcanes, {sum(1 for v in out.values() if v["fx"])} with effects; not in WFCD: {len(missing)}')

if __name__ == '__main__':
    main()
