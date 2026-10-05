"""Refreshes warframe.market 7/30-day averages and the cheapest online sellers for every tracked item."""
import json, os, time, datetime, urllib.request
H = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(H, 'base.json')))
old = json.load(open(os.path.join(H, 'market.json')))
slugs = base['mslug']
names = [n for n in slugs if n in old['prices'] or n.endswith(' Set') or n in base['mods'] or n in base['arcanes']]
names = [n for n in names if n in old['prices']]  # keep the tracked set stable
names = names[:int(os.environ.get('LIMIT', len(names)))]

def get(url):
    for a in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ordis-refresh'})
            return json.load(urllib.request.urlopen(req, timeout=20))
        except Exception:
            time.sleep(2 + 3 * a)
    return None

prices, sellers = dict(old['prices']), dict(old['sellers'])
for i, n in enumerate(names):
    s = slugs[n]
    st = get(f'https://api.warframe.market/v1/items/{s}/statistics')
    if st:
        d = [e for e in st['payload']['statistics_closed']['90days'] if e.get('mod_rank') in (None, 0)]
        l7, l30 = d[-7:], d[-30:]
        v7, v30 = sum(e['volume'] for e in l7), sum(e['volume'] for e in l30)
        e = {}
        if v7: e['a7'] = round(sum(x['avg_price'] * x['volume'] for x in l7) / v7, 1)
        if v30: e['a30'] = round(sum(x['avg_price'] * x['volume'] for x in l30) / v30, 1)
        e['v7'] = v7
        prices[n] = e
    time.sleep(0.35)
    top = get(f'https://api.warframe.market/v2/orders/item/{s}/top')
    if top:
        sell = sorted([o for o in top['data'].get('sell', []) if o.get('visible', True)], key=lambda o: o['platinum'])
        sellers[n] = [[o['user']['ingameName'], o['platinum'], o.get('quantity', 1), o['user'].get('reputation', 0), o['user'].get('status', ''), o.get('rank')] for o in sell[:3]]
    time.sleep(0.35)
    if i % 100 == 0: print(i, '/', len(names), flush=True)
date = datetime.datetime.utcnow().strftime('%b %-d, %Y')
json.dump({'prices': prices, 'sellers': sellers, 'date': date}, open(os.path.join(H, 'market.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
print('done', len(prices))
