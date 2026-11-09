#!/usr/bin/env python3
"""Make a light-plate version of a logo drawn for dark backgrounds.

  logo-onlight.py <in.png> <out.png> [--invert] [--from-x=N]

Every sponsor logo sits on a light plate, so a white-on-transparent logo
vanishes. Default: near-white, unsaturated pixels become the brand's deepest
ink and coloured pixels are kept, which suits a colour mark with white text.
--invert maps luminance from white to ink and dark to near-white, for a mono
mark whose dark interior must stay readable. --from-x=N leaves columns left
of N untouched, for a self-contained icon (a white tile or a white glyph on
a coloured disc) beside a white wordmark. Alpha is always kept."""
import json
import sys
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parent.parent.parent
BRAND = json.loads((REPO / "assets/brand/brand.json").read_text(encoding="utf-8"))


def rgb(name):
    h = BRAND["palette"][name]["hex"]
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


INK, PLATE = rgb("well"), rgb("logo_plate")


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        sys.exit(__doc__)
    invert = "--invert" in sys.argv
    from_x = next((int(a.split("=", 1)[1]) for a in sys.argv if a.startswith("--from-x=")), 0)
    im = Image.open(args[0]).convert("RGBA")
    out = []
    for i, (r, g, b, a) in enumerate(im.getdata()):
        if i % im.width < from_x:
            out.append((r, g, b, a))
        elif invert:
            t = (0.299 * r + 0.587 * g + 0.114 * b) / 255   # 1 = white -> ink
            c = tuple(round(p * (1 - t) + i * t) for p, i in zip(PLATE, INK))
            out.append(c + (a,))
        elif min(r, g, b) > 190 and max(r, g, b) - min(r, g, b) < 40:
            out.append(INK + (a,))
        else:
            out.append((r, g, b, a))
    im.putdata(out)
    im.save(args[1], optimize=True)


if __name__ == "__main__":
    main()
