"""Builds index.html from template.html + base.json (game data) + market.json (prices, sellers)."""
import json, os, datetime
H = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(H, 'base.json')))
mk = json.load(open(os.path.join(H, 'market.json')))
D = dict(base)
D['prices'] = mk['prices']
D['sellers'] = mk['sellers']
D['sets'] = {k: v for k, v in mk['prices'].items() if k.endswith(' Set')}
D['meta'] = dict(base['meta'], prices=mk.get('date') or base['meta'].get('prices'))
data = json.dumps(D, separators=(',', ':'), ensure_ascii=False).replace('</', '<\\/')
body = open(os.path.join(H, 'template.html')).read().replace('/*DATA*/', data)
page = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<meta name="description" content="Warframe mastery tracker, farming guide, quest log and market prices."><link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png"><link rel="apple-touch-icon" href="apple-touch-icon.png"><meta property="og:title" content="Tennoform"><meta property="og:image" content="https://tennoform.com/icon-512.png">'
        '</head><body>\n' + body + '\n</body></html>\n')
open(os.path.join(H, '..', 'index.html'), 'w').write(page)
print('index.html', len(page) // 1024, 'KB')
