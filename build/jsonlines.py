"""Write base.json one entry per line, so two changes to different entries (a PR fixing one build, the daily game-data
update adding new items) merge cleanly in git instead of clashing on a single 1.5 MB line."""
import json


def dumps(d):
    enc = lambda v: json.dumps(v, separators=(',', ':'))
    out = []
    for k, v in d.items():
        if isinstance(v, dict) and v:
            body = ',\n'.join('%s:%s' % (enc(a), enc(b)) for a, b in v.items())
            out.append('%s:{\n%s\n}' % (enc(k), body))
        elif isinstance(v, list) and v:
            out.append('%s:[\n%s\n]' % (enc(k), ',\n'.join(enc(x) for x in v)))
        else:
            out.append('%s:%s' % (enc(k), enc(v)))
    return '{\n' + ',\n'.join(out) + '\n}\n'


def dump(d, path):
    with open(path, 'w') as fh:
        fh.write(dumps(d))
