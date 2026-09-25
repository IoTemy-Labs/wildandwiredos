#!/bin/bash
# Runs INSIDE the chroot during the `assets` stage. Converts the working
# fonts to GRUB's PF2 format for the ISO boot menu theme. build.sh copies
# the results into boot/grub/themes/wildwired/ in the ISO tree. The names
# GRUB sees ("Source Sans 3 Regular 22", ...) must match theme.txt.
set -euo pipefail
F=/usr/share/fonts/truetype/wildwired
O=/usr/share/wildwired/grub
mkdir -p "$O"
mk() { grub-mkfont -s "$1" -o "$O/$2" "$3" 2>/dev/null; }
mk 22 sans-22.pf2 "$F/sourcesans3/SourceSans3-Variable.ttf"
mk 18 sans-18.pf2 "$F/sourcesans3/SourceSans3-Variable.ttf"
mk 16 mono-16.pf2 "$F/jetbrainsmono/JetBrainsMono-Variable.ttf"

# Verify the internal names theme.txt refers to.
python3 - "$O" <<'PY'
import struct, sys
want = {"sans-22.pf2": "Source Sans 3 Regular 22",
        "sans-18.pf2": "Source Sans 3 Regular 18",
        "mono-16.pf2": "JetBrains Mono Regular 16"}
for f, name in want.items():
    b = open(f"{sys.argv[1]}/{f}", "rb").read(); i = 12; got = None
    while i < len(b):
        tag, ln = b[i:i+4], struct.unpack(">I", b[i+4:i+8])[0]
        if tag == b"NAME":
            got = b[i+8:i+8+ln].rstrip(b"\0").decode(); break
        i += 8 + ln
    if got != name:
        sys.exit(f"{f}: GRUB font name is {got!r}, theme.txt expects {name!r}")
PY
echo "brand: GRUB PF2 fonts ready in $O"
