#!/usr/bin/env python3
"""One-shot: unwrap Rebel.woff2 to a plain TTF for system/QML/PIL use."""
from pathlib import Path
from fontTools.ttLib import TTFont

repo = Path(__file__).resolve().parent.parent.parent
src = repo / "frontend-design/design_handoff_wild_wired_os_shell/assets/fonts/Rebel.woff2"
dst = repo / "assets/fonts/rebelscript/RebelScript.ttf"
dst.parent.mkdir(parents=True, exist_ok=True)
f = TTFont(str(src))
f.flavor = None
f.save(str(dst))
print(f"wrote {dst}")
