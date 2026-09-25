#!/usr/bin/env python3
"""Place generated art into the rootfs (and ISO tree) during the `assets`
stage. Runs on the build host, not in the chroot.

  install-art.py <rootfs> <iso-tree>

Everything here is derived from assets/generated/ (rendered by
render-sponsors.py) and assets/brand/. Re-running is safe: every output is
overwritten. Late sponsor art therefore flows in with
`build.sh --from-stage assets`.

Handoff rule honoured here: every logo appearance sits on a light plate
(#f4faf9, 1px rgba(3,37,42,.18) hairline). The only exception is the icon
theme glyph, which the handoff explicitly uses bare at 28px in the panel.
"""

import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parent.parent.parent
GEN = REPO / "assets/generated"
BRAND = REPO / "assets/brand"

PLATE = (0xF4, 0xFA, 0xF9, 255)
PLATE_LINE = (3, 37, 42, 46)  # rgba(3,37,42,.18)
ICON_SIZES = [16, 22, 24, 32, 48, 64, 128, 256]


def out(root: Path, rel: str) -> Path:
    p = root / rel.lstrip("/")
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


def save(img: Image.Image, path: Path) -> None:
    if path.suffix == ".jpg":
        img.convert("RGB").save(path, quality=90)
    else:
        img.save(path, optimize=True)
    path.chmod(0o644)


def copy(src: Path, dst: Path) -> None:
    save(Image.open(src), dst)


def plated_badge(size: int) -> Image.Image:
    """Circular badge on a square light plate with a hairline and 6% radius."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    r = max(2, round(size * 0.06))
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=PLATE, outline=PLATE_LINE, width=1)
    inner = round(size * 0.84)
    badge = Image.open(BRAND / "logo-icon.png").convert("RGBA").resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.alpha_composite(badge, (off, off))
    return canvas


def face(size: int) -> Image.Image:
    """Default user picture: the badge on a round light plate. Plasma crops
    avatars to a circle, so the plate is a circle too."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).ellipse([0, 0, size - 1, size - 1], fill=PLATE, outline=PLATE_LINE, width=1)
    inner = round(size * 0.86)
    badge = Image.open(BRAND / "logo-icon.png").convert("RGBA").resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.alpha_composite(badge, (off, off))
    return canvas


def fit(img: Image.Image, w: int) -> Image.Image:
    h = round(img.height * w / img.width)
    return img.resize((w, h), Image.LANCZOS)


def wallpapers(root: Path) -> None:
    for prefix, pkg in (("wall", "WildWired"), ("strip", "WildWiredQuiet")):
        srcs = sorted(GEN.glob(f"wallpapers/{prefix}-*.png"))
        if not srcs:
            sys.exit(f"install-art: no {prefix}-*.png wallpapers rendered")
        for src in srcs:
            size = re.search(r"(\d+x\d+)", src.name).group(1)
            copy(src, out(root, f"usr/share/wallpapers/{pkg}/contents/images/{size}.png"))
        big = Image.open(GEN / f"wallpapers/{prefix}-1920x1080.png")
        save(fit(big, 400), out(root, f"usr/share/wallpapers/{pkg}/contents/screenshot.png"))


def desktop_surfaces(root: Path) -> None:
    share = "usr/share/wildwired"
    copy(GEN / "sddm/background.png", out(root, f"{share}/sddm-background.png"))
    copy(GEN / "lockscreen/lock-1920x1080.png", out(root, f"{share}/lockscreen.png"))
    copy(GEN / "boot/about.png", out(root, f"{share}/about.png"))
    copy(BRAND / "logo-lockup.png", out(root, f"{share}/logo-lockup.png"))
    save(plated_badge(256), out(root, f"{share}/logo-plated-256.png"))
    save(face(256), out(root, f"{share}/face.png"))

    lnf = "usr/share/plasma/look-and-feel/org.wildwired.desktop/contents/previews"
    wall = Image.open(GEN / "wallpapers/wall-1920x1080.png")
    save(fit(wall, 600), out(root, f"{lnf}/preview.png"))
    save(wall, out(root, f"{lnf}/fullscreenpreview.jpg"))
    save(fit(Image.open(GEN / "lockscreen/lock-1920x1080.png"), 600), out(root, f"{lnf}/lockscreen.png"))


def icons(root: Path) -> None:
    badge = Image.open(BRAND / "logo-icon.png").convert("RGBA")
    for s in ICON_SIZES:
        save(badge.resize((s, s), Image.LANCZOS),
             out(root, f"usr/share/icons/hicolor/{s}x{s}/apps/wildwired-logo.png"))


def plymouth(root: Path) -> None:
    theme = "usr/share/plymouth/themes/wildwired"
    for name in ("plymouth-bg", "plymouth-logo", "plymouth-bar-bg", "plymouth-bar-fill"):
        copy(GEN / f"boot/{name}.png", out(root, f"{theme}/{name}.png"))


SLIDE_QML = """        Slide {{
            Image {{
                anchors.centerIn: parent
                width: parent.width * 0.95
                height: parent.height * 0.95
                fillMode: Image.PreserveAspectFit
                smooth: true
                source: "{src}"
            }}
        }}
"""


def installer(root: Path) -> None:
    b = "etc/calamares/branding/wildwired"
    save(plated_badge(256), out(root, f"{b}/logo.png"))
    save(plated_badge(128), out(root, f"{b}/icon.png"))
    copy(GEN / "boot/about.png", out(root, f"{b}/welcome.png"))
    slides = sorted(GEN.glob("slides/slide-*.png"))
    if not slides:
        sys.exit("install-art: no installer slides rendered")
    for s in slides:
        copy(s, out(root, f"{b}/{s.name}"))
    body = "".join(SLIDE_QML.format(src=s.name) for s in slides)
    qml = (
        "// Generated by scripts/build/install-art.py. Do not edit.\n"
        "import QtQuick 2.0;\n"
        "import calamares.slideshow 1.0;\n\n"
        "Presentation {\n"
        "    id: presentation\n"
        "    Timer {\n"
        "        interval: 15000\n"
        f"        running: {'true' if len(slides) > 1 else 'false'}\n"
        "        repeat: true\n"
        "        onTriggered: presentation.goToNextSlide()\n"
        "    }\n"
        f"{body}"
        "}\n"
    )
    p = out(root, f"{b}/show.qml")
    p.write_text(qml, encoding="utf-8", newline="\n")
    p.chmod(0o644)


WORKING_FONTS = ["archivo", "sourcesans3", "jetbrainsmono"]


def fonts(root: Path) -> None:
    """The handoff's three OFL working faces, each with its license. The
    brand faces (Rebel Script, Circuit) are deliberately not installed
    system-wide: they must never be selectable as UI fonts."""
    for fam in WORKING_FONTS:
        src = REPO / "assets/fonts" / fam
        files = sorted(src.glob("*.ttf"))
        if not files or not (src / "OFL.txt").is_file():
            sys.exit(f"install-art: {fam} fonts or OFL.txt missing in {src}")
        for f in files + [src / "OFL.txt"]:
            dst = out(root, f"usr/share/fonts/truetype/wildwired/{fam}/{f.name}")
            dst.write_bytes(f.read_bytes())
            dst.chmod(0o644)


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    root, iso = Path(sys.argv[1]), Path(sys.argv[2])
    if not (root / "etc").is_dir():
        sys.exit(f"install-art: {root} does not look like a rootfs")
    if not iso.is_dir():
        sys.exit(f"install-art: {iso} is not a directory")
    wallpapers(root)
    desktop_surfaces(root)
    icons(root)
    plymouth(root)
    installer(root)
    fonts(root)
    print("install-art: done")


if __name__ == "__main__":
    main()
