"""Check the curated builds in base.json: every mod and arcane exists, and no build pairs mods the game won't equip together
(a mod and its Primed, Umbral, Archon, Amalgam or Galvanized version).

    python build/check_builds.py [build/base.json]
"""
import json, os, re, sys
D = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'base.json')))
mp = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'morebuilds.json')
if os.path.exists(mp):  # the extra builds are checked the same way
    for k, v in json.load(open(mp)).items():
        for item, bs in v.items(): D[k][item] = D[k].get(item, []) + bs
M=D['mods']
GALV={'Galvanized Chamber':'Split Chamber','Galvanized Diffusion':'Barrel Diffusion','Galvanized Hell':"Hell's Chamber",'Galvanized Aptitude':'Rifle Aptitude','Galvanized Savvy':'Shotgun Savvy','Galvanized Crosshairs':'Hydraulic Crosshairs','Galvanized Scope':'Argon Scope','Galvanized Steel':'True Steel','Galvanized Shot':'Sure Shot'}
def fam(n):
    if n in GALV: return GALV[n]
    if n=='Transient Fortitude': return n
    return re.sub(r'^(Primed|Umbral|Archon|Amalgam) ','',n).replace('Steel Fiber','Fiber').replace('Umbral Fiber','Fiber')
def famfix(n):
    f=fam(n); return 'Fiber' if f in('Fiber','Steel Fiber') else f
bad=0
for k in ['builds','wbuilds','cbuilds']:
    for it,bs in D[k].items():
        for b in bs:
            ms=[x for x in [b.get('aura'),b.get('exilus'),*b.get('mods',[])] if x]
            seen={}
            for m in ms:
                if m not in M:
                    if k != 'cbuilds': print('UNKNOWN', k, it, m); bad += 1  # companion link mods aren't in the mod list
                    continue
                f=famfix(m)
                if f in seen: print('CONFLICT',k,it,b['name'],seen[f],'+',m); bad+=1
                seen[f]=m
            for a in b.get('arcanes',[]):
                if a not in D['arcanes']: print('UNKNOWN ARC',it,a); bad+=1
print('problems', bad)
sys.exit(1 if bad else 0)
