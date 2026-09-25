#!/usr/bin/env bash
# Vendor the brand fonts into assets/fonts/ with their license texts.
# All three are SIL OFL 1.1 (redistributable, bundling permitted, no CDN).
# Source: the google/fonts repository, pinned to the upstream paths below.
# Fails loudly on any 404 — a moved file must be fixed here, not papered over.
# Idempotent: existing files are kept unless --force.
set -euo pipefail
source "$(dirname "$0")/env.sh"

FONTS_DIR="$REPO_ROOT/assets/fonts"
BASE="https://raw.githubusercontent.com/google/fonts/main/ofl"
FORCE="${1:-}"

get() { # get <family-dir> <remote-file> <local-name>
  local fam="$1" remote="$2" local_name="$3"
  local dest="$FONTS_DIR/$fam/$local_name"
  mkdir -p "$FONTS_DIR/$fam"
  if [ -f "$dest" ] && [ "$FORCE" != "--force" ]; then
    echo "  keep  $fam/$local_name"; return 0
  fi
  # URL-encode the [ ] used by variable-font filenames.
  local url="$BASE/$fam/$(printf '%s' "$remote" | sed 's/\[/%5B/g; s/\]/%5D/g')"
  echo "  fetch $fam/$remote"
  wget -q -O "$dest" "$url" || { rm -f "$dest"; die "404/failure fetching $url — update fetch-fonts.sh"; }
  [ -s "$dest" ] || { rm -f "$dest"; die "Empty download: $url"; }
}

# The three working faces from the Claude Design handoff (DECISIONS.md
# 2026-08-21). The two brand faces (Rebel Script, Circuit) are NOT vendored:
# licenses unconfirmed, so they stay out of the ISO; the plated raster
# lockup carries the brand instead.
echo "== Vendoring working fonts (SIL OFL 1.1)"
get archivo      "Archivo[wdth,wght].ttf"    "Archivo-Variable.ttf"
get archivo      "OFL.txt"                   "OFL.txt"
get sourcesans3  "SourceSans3[wght].ttf"     "SourceSans3-Variable.ttf"
get sourcesans3  "SourceSans3-Italic[wght].ttf" "SourceSans3-Italic-Variable.ttf"
get sourcesans3  "OFL.txt"                   "OFL.txt"
get jetbrainsmono "JetBrainsMono[wght].ttf"  "JetBrainsMono-Variable.ttf"
get jetbrainsmono "OFL.txt"                  "OFL.txt"

echo "== Verifying every font ships with a license"
fail=0
for d in "$FONTS_DIR"/*/; do
  [ -f "$d/OFL.txt" ] || { echo "  MISSING license in $d"; fail=1; }
done
[ "$fail" -eq 0 ] || die "License files missing."
file "$FONTS_DIR"/*/*.ttf | sed 's/^/  /'
echo "Fonts vendored."
