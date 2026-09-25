#!/bin/bash
# Runs INSIDE the chroot during the `assets` stage. Direction 1A shell
# plumbing that needs the rootfs's own tools: opaque Plasma popups, the
# menu's default favourites, and the font cache for the working faces.
# Idempotent.
set -euo pipefail

# --- Opaque popups and tooltips -------------------------------------------
# Our Plasma style ships only colours and the panel SVG; everything else
# falls back to Breeze. Breeze's translucent variants would win whenever
# KWin can blur, so copy Breeze's opaque SVGs into every slot of our
# style. They recolour from our `colors` file at runtime.
D=/usr/share/plasma/desktoptheme
for pair in dialogs/background widgets/tooltip; do
  src="$D/default/opaque/$pair.svgz"
  [ -f "$src" ] || { echo "missing $src" >&2; exit 1; }
  for slot in "" translucent/ opaque/; do
    install -D -m 0644 "$src" "$D/wildwired/$slot$pair.svgz"
  done
done
# Plasmoid backgrounds on the desktop: opaque too.
install -D -m 0644 "$D/default/widgets/background.svgz" "$D/wildwired/translucent/widgets/background.svgz"

# --- Menu favourites (Kickoff "start here" list) ---------------------------
# Missing entries are skipped by Plasma: the installer only exists in the
# live session, and the Field Guide arrives in Phase 6.
F=/etc/xdg/kicker-extra-favoritesrc
if ! dpkg-divert --list "$F" | grep -q .; then
  dpkg-divert --quiet --local --rename --divert "$F.distrib" --add "$F"
fi
cat > "$F" <<'EOF'
[General]
Prepend=kubuntu-calamares.desktop;wildwired-fieldguide.desktop;org.mozilla.firefox.desktop;org.kde.dolphin.desktop;org.kde.discover.desktop;it.mijorus.gearlever.desktop;org.kde.konsole.desktop;libreoffice-startcenter.desktop;systemsettings.desktop;
IgnoreDefaults=true
EOF

# --- Default user picture -----------------------------------------------------
# Kubuntu ships its logo as every new user's ~/.face and as a picker avatar.
S=/etc/skel/.face
if ! dpkg-divert --list "$S" | grep -q .; then
  mkdir -p /usr/share/wildwired/diverted/etc/skel
  dpkg-divert --quiet --local --rename --divert /usr/share/wildwired/diverted/etc/skel/.face --add "$S"
fi
install -m 0644 /usr/share/wildwired/face.png "$S"
[ -e /etc/skel/.face.icon ] || ln -s .face /etc/skel/.face.icon
A=/usr/share/plasma/avatars/kubuntu-bug.png
if [ -e "$A" ] && ! dpkg-divert --list "$A" | grep -q .; then
  mkdir -p /usr/share/wildwired/diverted/usr/share/plasma/avatars
  dpkg-divert --quiet --local --rename --divert "/usr/share/wildwired/diverted$A" --add "$A"
fi

# --- Fonts --------------------------------------------------------------------
fc-cache -f /usr/share/fonts/truetype/wildwired
for fam in "Archivo" "Source Sans 3" "JetBrains Mono"; do
  fc-list ":family=$fam" family | grep -q . || { echo "fontconfig cannot see $fam" >&2; exit 1; }
done
echo "brand: shell plumbing applied"
