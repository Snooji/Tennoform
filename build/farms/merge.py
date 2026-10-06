"""Merge the "ways to farm" sources in this folder into build/farms.json (included by make_site.py)."""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
B = json.load(open(os.path.join(H, '..', 'base.json')))
nodes = {(n['n'] + ' (' + n['p'] + ')').lower(): n for n in B['allnodes']}
out, ids, probs = [], set(), []
TAGS = {'fastest', 'beginner', 'afk', 'solo', 'squad', 'endgame', 'daily', 'weekly'}
for f in ['currency.json', 'standing.json', 'progress.json']:
    p = os.path.join(H, f)
    if not os.path.exists(p):
        print('missing', f); continue
    for g in json.load(open(p)):
        g['id'] = re.sub(r'[^a-z0-9]+', '-', (g.get('id') or g['n']).lower()).strip('-')
        if g['id'] in ids: probs.append('dup ' + g['id']); continue
        ids.add(g['id'])
        g['aka'] = [a.lower() for a in g.get('aka', [])]
        for w in g.get('ways', []):
            w['tags'] = [t for t in w.get('tags', []) if t in TAGS]
            nd = (w.get('node') or '').strip()
            w['node'] = nd if nd.lower() in nodes else ''
            w['planet'] = nodes[nd.lower()]['p'] if w['node'] else ''
        if re.search(r'\[\[|\{\{|<[a-z]', json.dumps(g)): probs.append('markup in ' + g['id'])
        g.setdefault('tips', []); g.setdefault('w', '')
        out.append(g)
json.dump(out, open(os.path.join(H, '..', 'farms.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'ways;', probs or 'no problems')
