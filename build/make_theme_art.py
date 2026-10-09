"""Draws the faction theme backgrounds into themes/*.svg. All original artwork (no game art, emblems or scripts).

Run:  python3 build/make_theme_art.py
Shapes follow each faction's shape language: Grineer pressed, riveted, welded steel; Corpus hex grid and circuit traces;
Entrati obol coins and thick-line florals; Lotus starfields (and black stars on white for the light Void); Infested
branching veins and cysts. Random parts use fixed seeds so the files only change when this script does.
"""
import math, os, random

H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(H, 'themes')
os.makedirs(OUT, exist_ok=True)


def save(name, w, h, body):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(svg)
    print(name, len(svg), 'bytes')


f = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')

# ---------- Grineer: two pressed "pillow" plates per tile, riveted seams, a weld bead, scuffs ----------
def grineer():
    rnd = random.Random(7)
    W = H_ = 220
    b = ['<defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/>'
         '<stop offset=".5" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>'
         '<radialGradient id="r" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#b5531c" stop-opacity=".22"/><stop offset="1" stop-color="#b5531c" stop-opacity="0"/></radialGradient></defs>']
    plates = [(6, 6, 208, 98), (6, 116, 98, 98), (116, 116, 98, 98)]
    for x, y, w, h in plates:
        b.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="url(#p)" stroke="#000" stroke-opacity=".35" stroke-width="3"/>')
        b.append(f'<rect x="{x+3}" y="{y+3}" width="{w-6}" height="{h-6}" rx="13" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="2"/>')
        # rivets along the top and bottom edges, uneven pitch (mass produced, loose tolerances)
        for edge_y in (y + 9, y + h - 9):
            cx = x + 14
            while cx < x + w - 10:
                b.append(f'<circle cx="{f(cx)}" cy="{edge_y}" r="2.8" fill="#000" fill-opacity=".35"/><circle cx="{f(cx-0.7)}" cy="{edge_y-0.7}" r="2.1" fill="#fff" fill-opacity=".13"/>')
                cx += rnd.uniform(17, 23)
        # rust bleeding from one bolt
        b.append(f'<ellipse cx="{x+14}" cy="{y+h-6}" rx="12" ry="22" fill="url(#r)"/>')
    # a weld bead between the plates
    bead = ''.join(f'<circle cx="{f(6+i*3.2)}" cy="{f(110+math.sin(i*1.7)*0.8)}" r="2" fill="#fff" fill-opacity=".05" stroke="#000" stroke-opacity=".18" stroke-width=".6"/>' for i in range(66))
    b.append(bead)
    # scuffs: short scratches
    for _ in range(14):
        x, y = rnd.uniform(10, 210), rnd.uniform(10, 210)
        a = rnd.uniform(-0.5, 0.5); l = rnd.uniform(6, 22)
        b.append(f'<path d="M{f(x)} {f(y)}l{f(math.cos(a)*l)} {f(math.sin(a)*l)}" stroke="#fff" stroke-opacity=".07" stroke-width="1" stroke-linecap="round"/>')
    save('grineer-plates.svg', W, H_, ''.join(b))


# ---------- Corpus: flat-top hex grid with a few lit cells, and 45-degree circuit traces with pads ----------
def corpus():
    rnd = random.Random(11)
    s = 18  # hex side
    hw, hh = 1.5 * s, math.sqrt(3) * s
    cols, rows = 8, 5
    W, Ht = round(hw * cols), round(hh * rows)
    c = '#2b8fd6'
    b = []
    def hexpath(cx, cy):
        pts = [(cx + s * math.cos(math.radians(60 * k)), cy + s * math.sin(math.radians(60 * k))) for k in range(6)]
        return 'M' + 'L'.join(f'{f(px)} {f(py)}' for px, py in pts) + 'Z'
    lit = {(rnd.randrange(cols), rnd.randrange(rows)) for _ in range(5)}
    for i in range(cols + 1):
        for j in range(-1, rows + 1):
            cx = i * hw
            cy = j * hh + (hh / 2 if i % 2 else 0)
            fill = f' fill="{c}" fill-opacity=".09"' if (i % cols, j % rows) in lit else ' fill="none"'
            b.append(f'<path d="{hexpath(cx, cy)}"{fill} stroke="{c}" stroke-opacity=".16" stroke-width="1"/>')
    # traces: run horizontally, jog 45 degrees, end in a pad
    for k in range(4):
        y = rnd.uniform(10, Ht - 10); x = rnd.uniform(0, W * 0.3)
        d = f'M{f(x)} {f(y)}'; L = rnd.uniform(40, 90); x += L; d += f'H{f(x)}'
        j = rnd.choice([-1, 1]) * rnd.uniform(10, 22); x += abs(j); y += j; d += f'L{f(x)} {f(y)}'
        x += rnd.uniform(30, 80); d += f'H{f(x)}'
        b.append(f'<path d="{d}" fill="none" stroke="{c}" stroke-opacity=".28" stroke-width="1.2"/><circle cx="{f(x)}" cy="{f(y)}" r="2.6" fill="none" stroke="{c}" stroke-opacity=".4" stroke-width="1.2"/>')
    save('corpus-hex.svg', W, Ht, ''.join(b))


# ---------- Entrati: packs of seven identical obol coins and a thick-line tulip ----------
def entrati():
    W = Ht = 240
    c = '#c9a04a'
    b = []
    def obol(x, y, r=10):
        return (f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{c}" fill-opacity=".07" stroke="{c}" stroke-opacity=".32" stroke-width="1.5"/>'
                f'<circle cx="{f(x)}" cy="{f(y)}" r="{r-3.5}" fill="none" stroke="{c}" stroke-opacity=".22" stroke-width="1"/>'
                f'<circle cx="{f(x)}" cy="{f(y)}" r="1.6" fill="{c}" fill-opacity=".35"/>')
    def pack(cx, cy, r=10):
        g = r * 2 + r / 2
        out = [obol(cx, cy, r)]
        for k in range(6):
            a = math.radians(60 * k)
            out.append(obol(cx + g * math.cos(a), cy + g * math.sin(a), r))
        return ''.join(out)
    b.append(pack(60, 60))
    b.append(pack(180, 180))
    # a stylised tulip: two whiplash arcs for petals, a stem and a leaf, 3.5px with round caps
    def tulip(x, y, s=1):
        return (f'<g transform="translate({x} {y}) scale({s})" fill="none" stroke="{c}" stroke-opacity=".28" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">'
                '<path d="M0 0C-14 -10 -12 -30 0 -40C12 -30 14 -10 0 0Z"/><path d="M0 -6C-6 -16 -6 -26 0 -34"/>'
                '<path d="M0 0V38"/><path d="M0 22C10 12 22 14 26 6C18 2 6 6 0 22Z"/></g>')
    b.append(tulip(180, 60))
    b.append(tulip(60, 182, -1))
    save('entrati-obols.svg', W, Ht, ''.join(b))


# ---------- Lotus: starfield (white stars), and the light Void (black stars on white) ----------
def lotus():
    for name, col in (('lotus-stars.svg', '#ffffff'), ('lotus-stars-ink.svg', '#0f2a33')):
        rnd = random.Random(3)
        W = Ht = 400
        b = []
        for _ in range(56):
            x, y = rnd.uniform(0, W), rnd.uniform(0, Ht)
            r = rnd.choice([0.5, 0.6, 0.8, 1, 1.2, 1.5])
            o = rnd.uniform(0.25, 0.85) * (0.5 if col != '#ffffff' else 1)
            b.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{col}" fill-opacity="{o:.2f}"/>')
        # a few four-point glints
        for _ in range(4):
            x, y = rnd.uniform(20, W - 20), rnd.uniform(20, Ht - 20); l = rnd.uniform(3, 6)
            b.append(f'<path d="M{f(x)} {f(y-l)}L{f(x+0.6)} {f(y-0.6)}L{f(x+l)} {f(y)}L{f(x+0.6)} {f(y+0.6)}L{f(x)} {f(y+l)}L{f(x-0.6)} {f(y+0.6)}L{f(x-l)} {f(y)}L{f(x-0.6)} {f(y-0.6)}Z" fill="{col}" fill-opacity=".6"/>')
        save(name, W, Ht, ''.join(b))


# ---------- Infested: branching veins (tapering, 25-40 degree forks, never symmetric) with uneven cysts ----------
def infested():
    for name, vein, glow in (('infested-veins.svg', '#e86a8a', '#b6f23a'), ('infested-veins-ink.svg', '#9c3150', '#3d6a08')):
        rnd = random.Random(13)
        W = Ht = 360
        b = []
        def branch(x, y, ang, w, depth):
            if depth == 0 or w < 0.7:
                return
            l = rnd.uniform(30, 60) * (w / 5 + 0.5)
            x2, y2 = x + math.cos(ang) * l, y + math.sin(ang) * l
            cx, cy = (x + x2) / 2 + rnd.uniform(-10, 10), (y + y2) / 2 + rnd.uniform(-10, 10)
            b.append(f'<path d="M{f(x)} {f(y)}Q{f(cx)} {f(cy)} {f(x2)} {f(y2)}" stroke="{vein}" stroke-opacity="{0.10 + w * 0.03:.2f}" stroke-width="{f(w)}" fill="none" stroke-linecap="round"/>')
            if rnd.random() < 0.35 and w > 1.5:  # a swelling on the vein
                b.append(f'<ellipse cx="{f(x2)}" cy="{f(y2)}" rx="{f(w*1.2)}" ry="{f(w*0.8)}" fill="{vein}" fill-opacity=".16"/>')
            branch(x2, y2, ang + rnd.uniform(-0.25, 0.25), w * 0.72, depth - 1)
            if rnd.random() < 0.8:
                branch(x2, y2, ang + rnd.choice([-1, 1]) * math.radians(rnd.uniform(25, 40)), w * 0.55, depth - 1)
        # trunks enter from the edges so the tile wraps without hard seams
        branch(0, 70, 0.15, 5, 6)
        branch(360, 250, math.pi - 0.2, 4.5, 6)
        branch(150, 0, math.pi / 2 + 0.1, 4, 5)
        # cyst clusters: uneven sizes, hot core to dark rim, a tiny specular dot
        b.insert(0, f'<defs><radialGradient id="c"><stop offset="0" stop-color="{glow}" stop-opacity=".55"/><stop offset=".6" stop-color="{glow}" stop-opacity=".15"/><stop offset="1" stop-color="{vein}" stop-opacity=".25"/></radialGradient></defs>')
        for cx, cy in ((250, 110), (90, 270)):
            for _ in range(rnd.randint(4, 7)):
                r = rnd.uniform(3, 12)
                x, y = cx + rnd.uniform(-16, 16), cy + rnd.uniform(-14, 14)
                b.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#c)"/><circle cx="{f(x-r*.35)}" cy="{f(y-r*.4)}" r="{f(max(.6, r*.12))}" fill="#fff" fill-opacity=".35"/>')
        save(name, W, Ht, ''.join(b))


grineer(); corpus(); entrati(); lotus(); infested()
