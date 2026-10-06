"""Merge the guide sources in this folder into build/guides.json, check them, and drop unsupported fields."""
import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(H, '..', 'base.json')))
quests = {q['n'] for q in base['quests']}
out, ids, probs = [], set(), []
for f in ['quests1.json', 'quests2.json', 'quests3.json', 'systems.json', 'modes.json']:
    p = os.path.join(H, f)
    if not os.path.exists(p):
        print('missing', f); continue
    for g in json.load(open(p)):
        g.pop('time', None)  # rough guesses, not from the wiki
        g['id'] = re.sub(r'[^a-z0-9]+', '-', g.get('id') or g['n'].lower()).strip('-')
        if g['id'] in ids: probs.append('dup ' + g['id']); continue
        ids.add(g['id'])
        if g['kind'] == 'quest' and g['n'] not in quests: probs.append('unknown quest ' + g['n'])
        u = g.setdefault('unlock', {}); u.setdefault('mr', None); u.setdefault('quests', []); u.setdefault('other', [])
        bad = [q for q in u['quests'] if q not in quests]
        if bad:  # not a Codex quest name: keep the words as an "other" requirement
            u['quests'] = [q for q in u['quests'] if q in quests]; u['other'] = ['Finish ' + q for q in bad] + u['other']
        txt = json.dumps(g)
        if '[[' in txt or '{{' in txt or '<' in txt: probs.append('markup in ' + g['id'])
        for k in ['aka', 'steps', 'fast', 'rw', 'go']: g.setdefault(k, [])
        g['aka'] = [a.lower() for a in g['aka']]
        out.append(g)
json.dump(out, open(os.path.join(H, '..', 'guides.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'guides;', probs or 'no problems')
