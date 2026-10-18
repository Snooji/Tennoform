"""Safety checks for the daily game-data update, run by publish.sh after the site is built: if any fails, nothing is published.
    python3 build/check_gamedata.py base.before.json"""
import json, sys
a = json.load(open(sys.argv[1])); b = json.load(open('build/base.json'))
problems = []
for k in ('items', 'relics', 'mods', 'arcanes', 'res', 'nodes', 'quests'):
    if len(b[k]) < len(a[k]):
        problems.append(f'{k}: {len(a[k])} before, {len(b[k])} after')
gone = [n for n in a['items'] if n not in b['items']]
if gone: problems.append('items removed: ' + ', '.join(gone[:20]))
for n, it in b['items'].items():
    if not it.get('c') or not isinstance(it.get('parts'), list):
        problems.append(f'item {n} is missing its category or parts'); break
s = json.load(open('data/stats.json'))
if len(s) < 0.9 * len(b['items']): problems.append(f'stats cover only {len(s)} items')
mi = json.load(open('data/mods.json'))
if len(mi) < 0.9 * (len(b['mods']) + len(b['arcanes'])): problems.append(f'mod details cover only {len(mi)} mods and arcanes')
import re, os
html = open('index.html', encoding='utf-8').read()
game = re.search(r'/bundle/(game-[\w]+\.js)', html)
gf = os.path.join('bundle', game.group(1)) if game else ''
if not game or not os.path.exists(gf) or os.path.getsize(gf) < 1_000_000 or 'Frost Prime' not in open(gf, encoding='utf-8').read():
    problems.append('the page build looks wrong (game data file missing or too small)')
for k in ('market', 'code'):
    m = re.search(r'/bundle/(%s-[\w]+\.js)' % k, html)
    if not m or not os.path.exists(os.path.join('bundle', m.group(1))): problems.append(f'the page build is missing its {k} file')
if problems:
    print('Not publishing:'); print('\n'.join(' - ' + p for p in problems)); sys.exit(1)
print('All checks passed')
