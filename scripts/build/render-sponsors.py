#!/usr/bin/env python3
"""Wild & Wired OS art pipeline, rebuilt to the Claude Design handoff
(frontend-design/design_handoff_wild_wired_os_shell). One data source
(sponsors.yaml + brand.json) renders the direction-independent surfaces:
sponsor-wall and quiet-strip wallpapers, SDDM/lock backgrounds with the
sponsor band, installer slides, light-theme print sheet, disc label, sleeve
insert, and boot-chain art.

  render-sponsors.py                      render from sponsors.yaml
  render-sponsors.py --sponsors mock/full.yaml --out /tmp/preview
  render-sponsors.py --check              validate data + WCAG, render nothing
  render-sponsors.py --make-mock-logos    synthesize placeholder logos

Rules encoded from the handoff: every logo sits on a light plate; structure
teal never carries text; no gradients, no red/amber/blue; tier maxima
(1/3/6/8) trigger the quiet-strip fallback with a warning; mono labels are
tracked 0.14em and uppercased; no em dashes or exclamation marks in strings.
Deterministic output. Artboards authored at 1920x1080; other sizes scale."""

import argparse, hashlib, json, os, random, sys
from pathlib import Path

try:
    import yaml
    from PIL import Image, ImageDraw, ImageFont
except ImportError as e:
    sys.exit(f"Missing python dep ({e.name}); install python3-yaml and python3-pil.")

REPO = Path(__file__).resolve().parent.parent.parent
BRAND = json.loads((REPO / "assets/brand/brand.json").read_text(encoding="utf-8"))
FONTS = REPO / "assets/fonts"
TIERS = ["presenting", "gold", "silver", "community", "in-kind"]
TIER_LABEL = {"presenting": "presenting", "gold": "gold", "silver": "silver",
              "community": "community", "in-kind": "in-kind support"}
MAXIMA = BRAND["sponsor_board"]["tier_maxima"]

def C(name, alpha=None):
    h = BRAND["palette"][name]["hex"]
    rgb = tuple(int(h[i:i+2], 16) for i in (1, 3, 5))
    return rgb + (alpha,) if alpha is not None else rgb

def A(name):
    return tuple(BRAND["alpha"][name])

_font_cache = {}
def font(kind, px, weight=None):
    key = (kind, px, weight)
    if key in _font_cache:
        return _font_cache[key]
    fam = {"display": "archivo", "ui": "sourcesans3", "mono": "jetbrainsmono"}[kind]
    f = FONTS / fam / BRAND["type"][kind]["file"]
    if not f.exists():
        sys.exit(f"Font missing: {f}; run scripts/build/fetch-fonts.sh first.")
    ft = ImageFont.truetype(str(f), px)
    w = weight or BRAND["type"][kind]["weight"]
    # Variable fonts: set the wght axis, keep every other axis at default.
    try:
        vals = []
        for ax in ft.get_variation_axes():
            name = ax["name"] if isinstance(ax, dict) else getattr(ax, "name", b"")
            if isinstance(name, bytes):
                name = name.decode("latin-1", "ignore")
            default = ax["default"] if isinstance(ax, dict) else getattr(ax, "default", 0)
            vals.append(w if "weight" in name.lower() else default)
        if vals:
            ft.set_variation_by_axes(vals)
    except Exception:
        pass
    _font_cache[key] = ft
    return ft

def tracked(d, xy, text, f, fill, track=0.14, anchor="la"):
    """Mono label: uppercased, letter-tracked. PIL has no tracking, so we
    place glyphs by hand. anchor 'ma' centres, 'la' left-aligns at xy."""
    text = text.upper()
    px = f.size
    gap = px * track
    widths = [d.textlength(ch, f) for ch in text]
    total = sum(widths) + gap * (len(text) - 1)
    x, y = xy
    if anchor == "ma":
        x -= total / 2
    elif anchor == "ra":
        x -= total
    for ch, w in zip(text, widths):
        d.text((x, y), ch, font=f, fill=fill)
        x += w + gap
    return total

# ------------------------------------------------------------------ WCAG ---

def rel_lum(rgb):
    def ch(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(x) for x in rgb[:3])
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(a, b):
    la, lb = sorted((rel_lum(a), rel_lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

def wcag_check():
    bad = []
    for p in BRAND["wcag_pairs"]:
        r = contrast(C(p["fg"]), C(p["bg"]))
        status = "ok" if r >= p["min"] else "FAIL"
        print(f"  {status:4} {p['fg']:>12} on {p['bg']:<12} {r:5.2f} (min {p['min']})")
        if r < p["min"]:
            bad.append(p)
    return bad

# ------------------------------------------------------------------ data ---

def load_sponsors(path):
    data = yaml.safe_load(Path(path).read_text(encoding="utf-8")) or {}
    sponsors, problems, warnings = [], [], []
    for i, s in enumerate(data.get("sponsors") or []):
        name = s.get("name")
        if not name:
            problems.append(f"sponsor #{i}: missing name"); continue
        tier = s.get("tier", "community")
        if tier not in TIERS:
            problems.append(f"{name}: unknown tier '{tier}'"); tier = "community"
        logo = s.get("logo")
        if logo:
            lp = REPO / logo
            if not lp.exists():
                problems.append(f"{name}: logo not found: {logo}"); logo = None
            else:
                with Image.open(lp) as im:
                    w, h = im.size
                if max(w, h) < BRAND["logo"]["min_px"]:
                    problems.append(f"{name}: logo only {w}x{h}px (min {BRAND['logo']['min_px']} long edge)")
                if max(w, h) / max(1, min(w, h)) > 8:
                    problems.append(f"{name}: logo aspect {w}:{h} is extreme; check the export")
        sponsors.append({"name": s.get("display_name_override") or name, "tier": tier,
                         "logo": logo, "url": s.get("url"), "sort": s.get("sort_order", 100)})
    sponsors.sort(key=lambda s: (TIERS.index(s["tier"]), s["sort"], s["name"]))
    for t in TIERS:
        n = sum(1 for s in sponsors if s["tier"] == t)
        if n > MAXIMA[t]:
            warnings.append(f"tier '{t}' has {n} sponsors, max {MAXIMA[t]}: wallpaper falls back to quiet strip")
    return sponsors, list(data.get("thanks") or []), problems, warnings

# ------------------------------------------------------------- primitives ---

def flat_bg(w, h, color="base", texture=None):
    img = Image.new("RGB", (w, h), C(color))
    d = ImageDraw.Draw(img, "RGBA")
    if texture == "grid":
        step = 24
        for x in range(0, w, step):
            d.line([(x, 0), (x, h)], fill=A("grid_line"), width=1)
        for y in range(0, h, step):
            d.line([(0, y), (w, y)], fill=A("grid_line"), width=1)
    elif texture == "scanline":
        for y in range(0, h, 4):
            d.line([(0, y), (w, y)], fill=A("scanline"), width=1)
    return img.convert("RGBA")

def plated_lockup(width, which="os_front", pad_scale=1.0):
    """The mark on its light plate: plate fill, 6px radius, inner hairline.
    The supplied artwork contains navy and dies on the dark base bare."""
    art = Image.open(REPO / BRAND["logo"][which]).convert("RGBA")
    if art.getbbox():
        art = art.crop(art.getbbox())
    aw = width
    ah = int(art.height * aw / art.width)
    art = art.resize((aw, ah), Image.LANCZOS)
    px, py = int(28 * pad_scale), int(20 * pad_scale)
    pw, ph = aw + 2 * px, ah + 2 * py
    plate = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    d = ImageDraw.Draw(plate)
    d.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=6, fill=C("logo_plate"))
    d.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=6, outline=A("plate_hairline"), width=1)
    plate.alpha_composite(art, (px, py))
    return plate

def sponsor_plate(sp, size):
    """A tier plate: light plate at exact tier dimensions; logo inside, or
    the name typeset in plate ink."""
    w, h = size
    plate = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(plate)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=4, fill=C("logo_plate"))
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=4, outline=A("plate_hairline"), width=1)
    if sp["logo"]:
        im = Image.open(REPO / sp["logo"]).convert("RGBA")
        if im.getbbox():
            im = im.crop(im.getbbox())
        pad = max(8, h // 8)
        im.thumbnail((w - 2 * pad, h - 2 * pad), Image.LANCZOS)
        plate.alpha_composite(im, ((w - im.width) // 2, (h - im.height) // 2))
    else:
        f = font("ui", max(13, h // 4), 600)
        words, lines, cur = sp["name"].split(), [], ""
        for wd in words:
            t = (cur + " " + wd).strip()
            if d.textlength(t, f) > w * 0.86 and cur:
                lines.append(cur); cur = wd
            else:
                cur = t
        lines.append(cur)
        lh = int(f.size * 1.2)
        y = h // 2 - lh * len(lines) // 2
        for ln in lines:
            d.text((w // 2, y), ln, font=f, fill=C("plate_ink"), anchor="ma")
            y += lh
    return plate

def legal(d, w, y, light=False):
    fill = C("light_muted") if light else C("ink_faint")
    d.text((w // 2, y), BRAND["legal_line"], font=font("ui", 14, 400), fill=fill, anchor="ma")

def tier_groups(sponsors):
    return [(t, [s for s in sponsors if s["tier"] == t]) for t in TIERS
            if any(s["tier"] == t for s in sponsors)]

def over_maxima(sponsors):
    return any(len(g) > MAXIMA[t] for t, g in tier_groups(sponsors))

# --------------------------------------------------------------- surfaces ---

def sponsor_board(sponsors, thanks, bw, k=1.0, min_bh=0):
    """The shared sponsor board: a well card with tier rails and a thanks
    column. Authored proportions from the 1920x1080 artboard, scaled by k.
    Height grows with content (two-pass: measure, then draw)."""
    pad = int(48 * k)
    thanks_w = int(340 * k) if thanks else 0
    main_w = bw - 2 * pad - thanks_w
    sizes = BRAND["sponsor_board"]["plate_sizes_board"]
    gap = int(20 * k)
    lock = plated_lockup(int(200 * k), pad_scale=0.5 * max(k, 0.6))

    def layout(img=None):
        d = ImageDraw.Draw(img) if img is not None else ImageDraw.Draw(Image.new("RGB", (8, 8)))
        x0, y = pad, int(24 * k)
        if img is not None:
            tracked(d, (x0, y), "the sponsor wall", font("mono", int(15 * k), 500), C("mint"))
            img.alpha_composite(lock, (bw - pad - lock.width, y))
            tracked(d, (bw - pad - lock.width - int(100 * k), y + int(8 * k)), "v26.11",
                    font("mono", int(15 * k), 500), C("mint"))
            d.text((x0, y + int(34 * k)), "Made possible by these people",
                   font=font("display", int(38 * k), 600), fill=C("ink_max"))
        # First rail clears both the title block and the lockup plate.
        y = max(y + int(106 * k), int(24 * k) + lock.height + int(24 * k))
        for tier, group in tier_groups(sponsors):
            if img is not None:
                railf = font("mono", int(13 * k), 500)
                tw = tracked(d, (x0, y), TIER_LABEL[tier], railf, C("ink_muted"))
                d.line([(x0 + tw + int(16 * k), y + int(8 * k)), (x0 + main_w, y + int(8 * k))],
                       fill=C("structure"), width=1)
                d.text((x0 + main_w, y + int(16 * k)), f"{len(group)} of {MAXIMA[tier]}",
                       font=font("mono", int(12 * k), 500), fill=C("structure"), anchor="ra")
            y += int(34 * k)
            pw, ph = (int(v * k) for v in sizes[tier])
            x = x0
            for sp in group:
                if x + pw > x0 + main_w:
                    x = x0; y += ph + gap
                if img is not None:
                    img.alpha_composite(sponsor_plate(sp, (pw, ph)), (x, y))
                x += pw + gap
            y += ph + int(28 * k)
        return y + int(56 * k)

    bh = max(int(min_bh), layout(None),
             (int(24 * k) + lock.height + int(60 * k)
              + (len(thanks) * int(19 * 1.6 * k) + int(70 * k) if thanks else 0)))
    img = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, bw - 1, bh - 1], radius=int(6 * k), fill=C("well"))
    d.rounded_rectangle([0, 0, bw - 1, bh - 1], radius=int(6 * k), outline=C("border_subtle"), width=1)
    layout(img)
    if thanks:
        tx = bw - pad - thanks_w + int(32 * k)
        ty = int(24 * k) + lock.height + int(28 * k)
        d.line([(bw - pad - thanks_w, ty - int(8 * k)), (bw - pad - thanks_w, bh - int(80 * k))],
               fill=C("border_subtle"), width=1)
        tracked(d, (tx, ty), "special thanks", font("mono", int(13 * k), 500), C("ink_muted"))
        ty += int(36 * k)
        tf = font("ui", int(19 * k), 400)
        for name in thanks:
            d.text((tx, ty), name, font=tf, fill=C("ink_body"))
            ty += int(19 * 1.6 * k)
    legal(d, bw, bh - int(38 * k))
    return img

def wall_wallpaper(size, sponsors, thanks):
    w, h = size
    k = min(w / 1920, h / 1080)
    img = flat_bg(w, h, "base", "grid")
    if sponsors and not over_maxima(sponsors):
        board = sponsor_board(sponsors, thanks, int(1120 * k), k, min_bh=int(936 * k))
        if board.height > h - int(80 * k):
            board = sponsor_board(sponsors, thanks, int(1120 * k),
                                  k * (h - int(80 * k)) / board.height)
        img.alpha_composite(board, (int(400 * k) + (w - int(1920 * k)) // 2,
                                    (h - board.height) // 2))
        return img
    if sponsors:
        print("  WARNING: tier maxima exceeded, wall falls back to quiet strip")
        return strip_wallpaper(size, sponsors)
    # Zero sponsors: clean mark-only desktop.
    lock = plated_lockup(int(560 * k), pad_scale=k)
    img.alpha_composite(lock, ((w - lock.width) // 2, int(h * 0.30)))
    d = ImageDraw.Draw(img)
    tracked(d, (w // 2, int(h * 0.30) + lock.height + int(28 * k)), "v26.11 :: seneca",
            font("mono", int(16 * k), 500), C("mint"), anchor="ma")
    legal(d, w, h - int(36 * k))
    return img

def strip_wallpaper(size, sponsors):
    w, h = size
    k = min(w / 1920, h / 1080)
    img = flat_bg(w, h, "base", "grid")
    lock = plated_lockup(int(480 * k), pad_scale=k)
    img.alpha_composite(lock, ((w - lock.width) // 2, int(h * 0.24)))
    d = ImageDraw.Draw(img)
    tracked(d, (w // 2, int(h * 0.24) + lock.height + int(24 * k)), "v26.11 :: seneca",
            font("mono", int(15 * k), 500), C("mint"), anchor="ma")
    if sponsors:
        sizes = BRAND["sponsor_board"]["plate_sizes_login"]
        plates = [sponsor_plate(s, tuple(int(v * k * 0.9) for v in sizes[s["tier"]]))
                  for s in sponsors]
        gap = int(20 * k)
        rows, row, rw = [], [], 0
        maxw = int(w * 0.86)
        for p in plates:
            if rw + p.width + gap > maxw and row:
                rows.append(row); row, rw = [], 0
            row.append(p); rw += p.width + gap
        rows.append(row)
        y = h - int(60 * k) - sum(max(p.height for p in r) + gap for r in rows)
        tracked(d, (int(w * 0.07), y - int(26 * k)), "sponsors",
                font("mono", int(13 * k), 500), C("mint"))
        d.line([(int(w * 0.07) + int(120 * k), y - int(18 * k)), (int(w * 0.93), y - int(18 * k))],
               fill=C("structure"), width=1)
        for r in rows:
            rh = max(p.height for p in r)
            total = sum(p.width for p in r) + gap * (len(r) - 1)
            x = (w - total) // 2
            for p in r:
                img.alpha_composite(p, (x, y + (rh - p.height) // 2))
                x += p.width + gap
            y += rh + gap
    legal(d, w, h - int(30 * k))
    return img

def login_background(size, sponsors):
    """SDDM/lock background: base surface with the sponsor band low, centre
    kept clear for the QML column, footer left to the QML theme."""
    w, h = size
    k = min(w / 1920, h / 1080)
    img = flat_bg(w, h, "base")
    d = ImageDraw.Draw(img)
    if sponsors:
        y0 = int(880 * k)
        x0, x1 = int(64 * k), w - int(64 * k)
        f = font("mono", int(13 * k), 500)
        tw = tracked(d, (x0, y0), "sponsors", f, C("mint"))
        d.line([(x0 + tw + int(16 * k), y0 + int(8 * k)), (x1, y0 + int(8 * k))],
               fill=C("structure"), width=1)
        sizes = BRAND["sponsor_board"]["plate_sizes_login"]
        y = y0 + int(28 * k)
        x = x0
        gap = int(20 * k)
        for sp in sponsors:
            pw, ph = (int(v * k) for v in sizes[sp["tier"]])
            if x + pw > x1:
                break
            img.alpha_composite(sponsor_plate(sp, (pw, ph)), (x, y))
            x += pw + gap
    return img

def slides(sponsors, thanks):
    out, (w, h) = [], (1280, 720)
    k = 720 / 1080
    s1 = flat_bg(w, h, "base", "scanline")
    lock = plated_lockup(440, pad_scale=0.8)
    s1.alpha_composite(lock, ((w - lock.width) // 2, 120))
    d = ImageDraw.Draw(s1)
    d.text((w // 2, 460), "Hand built in West Virginia. Yours to keep.",
           font=font("display", 34, 600), fill=C("ink_body"), anchor="ma")
    d.text((w // 2, 520), "Nothing is written to disk until you choose to install.",
           font=font("ui", 20, 400), fill=C("ink_muted"), anchor="ma")
    legal(d, w, h - 30)
    out.append(("slide-01-welcome.png", s1))
    if sponsors:
        s2 = flat_bg(w, h, "base")
        board = sponsor_board(sponsors, thanks, 1040, 0.72)
        if board.height > h - 40 or board.width > w - 80:
            board.thumbnail((w - 80, h - 40), Image.LANCZOS)
        s2.alpha_composite(board, ((w - board.width) // 2, (h - board.height) // 2))
        out.append(("slide-02-sponsors.png", s2))
    if thanks:
        s3 = flat_bg(w, h, "base", "scanline")
        d = ImageDraw.Draw(s3)
        tracked(d, (w // 2, 60), "special thanks", font("mono", 16, 500), C("mint"), anchor="ma")
        d.line([(w // 4, 100), (w * 3 // 4, 100)], fill=C("structure"), width=1)
        y = 150
        for name in thanks:
            d.text((w // 2, y), name, font=font("ui", 28, 400), fill=C("ink_body"), anchor="ma")
            y += 48
        legal(d, w, h - 30)
        out.append(("slide-03-thanks.png", s3))
    return out

def print_sheet(sponsors, thanks):
    w, h = 2480, 3508                              # A4 300 dpi, light theme
    img = Image.new("RGBA", (w, h), C("light_base", 255))
    d = ImageDraw.Draw(img)
    lock = plated_lockup(900, pad_scale=1.6)
    img.alpha_composite(lock, ((w - lock.width) // 2, 170))
    d.text((w // 2, 800), "Thank you", font=font("display", 130, 700), fill=C("light_body"), anchor="ma")
    d.text((w // 2, 980), "This operating system exists because these people paid for it to.",
           font=font("ui", 46, 400), fill=C("light_muted"), anchor="ma")
    y = 1150
    sizes = BRAND["sponsor_board"]["plate_sizes_board"]
    for tier, group in tier_groups(sponsors):
        f = font("mono", 34, 500)
        tw = tracked(d, (200, y), TIER_LABEL[tier], f, C("light_muted"))
        d.line([(200 + tw + 40, y + 20), (w - 200, y + 20)], fill=C("light_border"), width=2)
        y += 80
        pw, ph = (int(v * 1.9) for v in sizes[tier])
        gap = 40
        x = 200
        for sp in group:
            if x + pw > w - 200:
                x = 200; y += ph + gap
            p = sponsor_plate(sp, (pw, ph))
            d2 = ImageDraw.Draw(p)
            d2.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=6, outline=C("light_border"), width=2)
            img.alpha_composite(p, (x, y))
            x += pw + gap
        y += ph + 70
    if thanks:
        y += 30
        tracked(d, (200, y), "and thanks to", font("mono", 34, 500), C("light_muted"))
        y += 80
        d.text((200, y), ", ".join(thanks), font=font("ui", 44, 400), fill=C("light_body"))
        y += 90
    d.text((w // 2, h - 260), f'{BRAND["event"]["title"]} :: {BRAND["event"]["date_prose"]} :: {BRAND["event"]["url"]}',
           font=font("ui", 40, 400), fill=C("light_body"), anchor="ma")
    legal(d, w, h - 170, light=True)
    return img

def disc_label(sponsors):
    s = 1417                                       # 120 mm @ 300 dpi
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    mask = Image.new("L", (s, s), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, s - 1, s - 1], fill=255)
    img.paste(flat_bg(s, s, "well", "scanline"), (0, 0), mask)
    d = ImageDraw.Draw(img)
    d.ellipse([1, 1, s - 2, s - 2], outline=C("structure"), width=2)
    lock = plated_lockup(int(s * 0.52), pad_scale=1.1)
    img.alpha_composite(lock, ((s - lock.width) // 2, int(s * 0.12)))
    tracked(d, (s // 2, int(s * 0.66)), "wild and wired os", font("mono", 40, 500),
            C("ink_body"), anchor="ma")
    tracked(d, (s // 2, int(s * 0.71)), "v26.11 :: seneca", font("mono", 34, 500),
            C("mint"), anchor="ma")
    d.text((s // 2, int(s * 0.76)), BRAND["event"]["url"], font=font("ui", 36, 400),
           fill=C("ink_muted"), anchor="ma")
    if sponsors:
        f = font("ui", 26, 400)
        y = int(s * 0.82)
        r = s / 2
        rest = sponsors
        for _ in range(2):
            chord = 2 * (r * r - (y + 16 - r) ** 2) ** 0.5 - 160
            line = ""
            for i, sp in enumerate(rest):
                t = (line + "  ·  " + sp["name"]).strip(" ·")
                if d.textlength(t, f) > chord and line:
                    rest = rest[i:]; break
                line = t
            else:
                rest = []
            d.text((s // 2, y), line, font=f, fill=C("ink_muted"), anchor="ma")
            y += 38
            if not rest:
                break
    hole = int(s * (22 / 120)) // 2
    d.ellipse([s // 2 - hole, s // 2 - hole, s // 2 + hole, s // 2 + hole], fill=(0, 0, 0, 0))
    d.ellipse([s // 2 - hole, s // 2 - hole, s // 2 + hole, s // 2 + hole],
              outline=C("structure"), width=2)
    return img

def sleeve_insert(sponsors):
    s = 1425
    img = flat_bg(s, s, "base", "grid")
    lock = plated_lockup(int(s * 0.56), pad_scale=1.2)
    img.alpha_composite(lock, ((s - lock.width) // 2, int(s * 0.12)))
    d = ImageDraw.Draw(img)
    d.text((s // 2, int(s * 0.50)), "Boot it. Try it. Keep it.", font=font("display", 62, 600),
           fill=C("ink_max"), anchor="ma")
    d.text((s // 2, int(s * 0.57)), "A festival keepsake that is also a working operating system.",
           font=font("ui", 34, 400), fill=C("ink_body"), anchor="ma")
    d.text((s // 2, int(s * 0.62)), "Nothing is written to disk until you choose to install.",
           font=font("ui", 30, 400), fill=C("ink_muted"), anchor="ma")
    tracked(d, (s // 2, int(s * 0.70)), "v26.11 :: seneca :: nov 14 2026",
            font("mono", 28, 500), C("mint"), anchor="ma")
    if sponsors:
        names = "  ·  ".join(sp["name"] for sp in sponsors[:8])
        d.text((s // 2, int(s * 0.84)), names, font=font("ui", 24, 400),
               fill=C("ink_muted"), anchor="ma")
    legal(d, s, s - 40)
    return img

def boot_art():
    out = []
    g = flat_bg(1920, 1080, "well", "scanline")     # GRUB: mark high, menu-safe middle
    lock = plated_lockup(360, pad_scale=0.8)
    g.alpha_composite(lock, ((1920 - lock.width) // 2, 48))
    d = ImageDraw.Draw(g)
    legal(d, 1920, 1080 - 40)
    out.append(("grub-bg.png", g))
    out.append(("plymouth-bg.png", flat_bg(1920, 1080, "well")))
    out.append(("plymouth-logo.png", plated_lockup(420, pad_scale=0.9)))
    out.append(("plymouth-bar-bg.png", Image.new("RGBA", (420, 8), C("sunken", 255))))
    out.append(("plymouth-bar-fill.png", Image.new("RGBA", (420, 8), C("mint", 255))))
    a = flat_bg(800, 450, "base")
    lock = plated_lockup(420, pad_scale=0.7)
    a.alpha_composite(lock, ((800 - lock.width) // 2, 80))
    d = ImageDraw.Draw(a)
    tracked(d, (400, 340), "v26.11 :: seneca", font("mono", 18, 500), C("mint"), anchor="ma")
    out.append(("about.png", a))
    return out

# ------------------------------------------------------------------ mocks ---

def make_mock_logos():
    outdir = REPO / "assets/sponsors/mock/logos"
    outdir.mkdir(parents=True, exist_ok=True)
    names = ["mountaineer-fiber", "kv-makerspace", "holler-hosting", "new-river-data",
             "app-signal", "elk-city-coffee", "ridgeline-print"]
    for n in names:
        rng = random.Random(n)
        w, h = rng.choice([(600, 240), (480, 480), (720, 200)])
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        hue = tuple(rng.randint(30, 160) for _ in range(3))
        d.rounded_rectangle([0, 0, h - 1, h - 1], radius=h // 6, fill=hue)
        initials = "".join(p[0].upper() for p in n.split("-")[:2])
        d.text((h // 2, h // 2), initials, font=font("display", h // 3, 700),
               fill=(255, 255, 255), anchor="mm")
        if w > h:
            d.text((h + 30, h // 2), n.replace("-", " ").title(), font=font("ui", h // 4, 600),
                   fill=hue, anchor="lm")
        im.save(outdir / f"{n}.png")
    print(f"mock logos -> {outdir}")

# ------------------------------------------------------------------- main ---

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sponsors", default="assets/sponsors/sponsors.yaml")
    ap.add_argument("--out", default="assets/generated")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--make-mock-logos", action="store_true")
    args = ap.parse_args()

    if args.make_mock_logos:
        make_mock_logos(); return

    sponsors, thanks, problems, warnings = load_sponsors(REPO / args.sponsors)
    print(f"data: {len(sponsors)} sponsors, {len(thanks)} thanks, "
          f"{len(problems)} problems, {len(warnings)} warnings")
    for p in problems:
        print(f"  PROBLEM: {p}")
    for wmsg in warnings:
        print(f"  WARNING: {wmsg}")
    print("WCAG pairs:")
    bad = wcag_check()
    if args.check:
        sys.exit(1 if (problems or bad) else 0)
    if bad:
        sys.exit("Palette fails WCAG minimums; fix brand.json before rendering.")

    out = Path(args.out) if os.path.isabs(args.out) else REPO / args.out
    jobs = []
    for size in [(1920, 1080), (2560, 1440), (3840, 2160), (1366, 768), (1920, 1200)]:
        jobs.append((f"wallpapers/wall-{size[0]}x{size[1]}.png", wall_wallpaper(size, sponsors, thanks)))
        jobs.append((f"wallpapers/strip-{size[0]}x{size[1]}.png", strip_wallpaper(size, sponsors)))
    jobs.append(("lockscreen/lock-1920x1080.png", login_background((1920, 1080), sponsors)))
    jobs.append(("sddm/background.png", login_background((1920, 1080), sponsors)))
    jobs += [(f"slides/{n}", im) for n, im in slides(sponsors, thanks)]
    jobs.append(("print/thanks-sheet-a4.png", print_sheet(sponsors, thanks)))
    jobs.append(("print/disc-label.png", disc_label(sponsors)))
    jobs.append(("print/sleeve-insert.png", sleeve_insert(sponsors)))
    jobs += [(f"boot/{n}", im) for n, im in boot_art()]

    manifest = {}
    for rel, im in jobs:
        p = out / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        im.save(p)
        manifest[rel] = hashlib.sha256(p.read_bytes()).hexdigest()[:16]
        print(f"  wrote {rel}")
    (out / "MANIFEST.json").write_text(json.dumps(
        {"source": args.sponsors, "files": manifest}, indent=1), encoding="utf-8")
    print(f"{len(jobs)} surfaces -> {out}")

if __name__ == "__main__":
    main()
