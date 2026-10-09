"""Builds fonts/tf-platforms.woff2: the platform badges Warframe puts at the end of display names.

Warframe ends a cross-play display name with one private-use character, U+E000 + platform number. Browsers have no
glyph for it and draw an empty box. This font draws a small badge with the platform's initials there instead (no
console logos). Letters come from Barlow Semi Condensed 600 (SIL Open Font License, see fonts/OFL-barlow.txt), so
this font is under the same license.

Platform numbers follow the order Warframe's own servers and browse.wf list platforms in. If one turns out wrong,
change PLATFORMS and run:  python3 build/make_platform_font.py
"""
import os
from fontTools.ttLib import TTFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.reverseContourPen import ReverseContourPen
from fontTools.pens.cu2quPen import Cu2QuPen

H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLATFORMS = [(0xE000, 'PC'), (0xE001, 'PS'), (0xE002, 'XB'), (0xE003, 'NS'), (0xE004, 'iOS'), (0xE005, 'AND')]
UPM = 1000
SRC = TTFont(os.path.join(H, 'fonts', 'barlow-semi-condensed-latin-600-normal.woff2'))
gs, cmap = SRC.getGlyphSet(), SRC.getBestCmap()
src_upm = SRC['head'].unitsPerEm

BADGE_H, BOTTOM, R, PAD, SIDE = 640, -40, 150, 110, 70   # badge height, baseline offset, corner radius, inner padding, side bearing
GAP = 140                                                 # space between the name and its badge
LETTER_SCALE = 0.58 * UPM / src_upm                       # letters about 0.4 em tall inside the badge


def rounded_rect(pen, x0, y0, x1, y1, r):
    """Clockwise rounded rectangle (outer contour in TrueType's winding)."""
    pen.moveTo((x0 + r, y0))
    pen.qCurveTo((x0, y0), (x0, y0 + r))
    pen.lineTo((x0, y1 - r))
    pen.qCurveTo((x0, y1), (x0 + r, y1))
    pen.lineTo((x1 - r, y1))
    pen.qCurveTo((x1, y1), (x1, y1 - r))
    pen.lineTo((x1, y0 + r))
    pen.qCurveTo((x1, y0), (x1 - r, y0))
    pen.closePath()


def label_width(text):
    return sum(gs[cmap[ord(c)]].width for c in text) * LETTER_SCALE


glyphs, advances, chars = {'.notdef': None}, {'.notdef': (500, 0)}, {}
for code, text in PLATFORMS:
    name = 'plat_' + text.lower()
    lw = label_width(text)
    w = lw + 2 * PAD
    pen = TTGlyphPen(None)
    rounded_rect(pen, GAP, BOTTOM, GAP + w, BOTTOM + BADGE_H, R)
    # letters are cut out of the badge: reversed contours make holes
    cap = SRC['OS/2'].sCapHeight * LETTER_SCALE
    x, y = GAP + PAD, BOTTOM + (BADGE_H - cap) / 2
    for c in text:
        g = gs[cmap[ord(c)]]
        t = TransformPen(Cu2QuPen(ReverseContourPen(pen), 1.0, reverse_direction=False), (LETTER_SCALE, 0, 0, LETTER_SCALE, x, y))
        g.draw(t)
        x += g.width * LETTER_SCALE
    glyphs[name] = pen.glyph()
    advances[name] = (round(GAP + w + SIDE), GAP)
    chars[code] = name

empty = TTGlyphPen(None)
glyphs['.notdef'] = empty.glyph()
fb = FontBuilder(UPM, isTTF=True)
order = list(glyphs)
fb.setupGlyphOrder(order)
fb.setupCharacterMap(chars)
fb.setupGlyf(glyphs)
fb.setupHorizontalMetrics(advances)
fb.setupHorizontalHeader(ascent=900, descent=-250)
fb.setupNameTable({'familyName': 'TF Platforms', 'styleName': 'Regular',
                   'copyright': 'Letter shapes from Barlow (SIL Open Font License 1.1)', 'licenseDescription': 'SIL Open Font License 1.1'})
fb.setupOS2(sTypoAscender=900, sTypoDescender=-250, usWinAscent=900, usWinDescent=250)
fb.setupPost()
out = os.path.join(H, 'fonts', 'tf-platforms.woff2')
fb.font.flavor = 'woff2'
fb.save(out)
print('wrote', out, os.path.getsize(out), 'bytes;', ', '.join(f'U+{c:04X} {t}' for c, t in PLATFORMS))
