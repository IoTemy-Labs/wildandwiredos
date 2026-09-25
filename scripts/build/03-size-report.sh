#!/usr/bin/env bash
# Size report on the untouched base image: ISO size, squashfs installed
# size, and the 40 largest packages by Installed-Size, computed from the
# dpkg status database inside the squashfs. Idempotent: extraction steps
# are skipped when their outputs already exist.
set -euo pipefail
source "$(dirname "$0")/env.sh"

[ -f "$BASE_ISO" ] || die "Base ISO missing — run 00-fetch-base.sh first."

BASE_TREE="$WORK_DIR/base-iso-tree"   # small metadata files only, in Phase 0
SQUASH="$WORK_DIR/base-filesystem.squashfs"
DPKG_STATUS_DIR="$WORK_DIR/base-dpkg"
OUT_MD="$REPO_ROOT/docs/SIZE-BASELINE.md"

# Pull the squashfs out of the ISO (no mount, no root). Note: the 26.04
# casper layout ships only squashfs+kernel+initrd — there is no
# filesystem.size or filesystem.manifest inside the ISO, so installed size
# and package data come from the dpkg status db instead.
if [ ! -f "$SQUASH" ]; then
  log "Extracting casper/filesystem.squashfs from base ISO (~4.1 GB)"
  mkdir -p "$BASE_TREE"
  xorriso -osirrox on -indev "$BASE_ISO" \
    -extract /casper/filesystem.squashfs "$SQUASH" \
    2>>"$LOG_FILE"
  chmod u+w "$SQUASH"
fi

# Single-file extract of the dpkg status db — no full unsquash needed.
if [ ! -f "$DPKG_STATUS_DIR/var/lib/dpkg/status" ]; then
  log "Extracting dpkg status database from squashfs"
  rm -rf "$DPKG_STATUS_DIR"
  unsquashfs -n -d "$DPKG_STATUS_DIR" "$SQUASH" var/lib/dpkg/status >/dev/null
fi

iso_bytes=$(stat -c%s "$BASE_ISO")
squash_bytes=$(stat -c%s "$SQUASH")
installed_kb=$(awk '/^Installed-Size: /{s+=$2} END{print s}' "$DPKG_STATUS_DIR/var/lib/dpkg/status")
pkg_count=$(grep -c '^Package: ' "$DPKG_STATUS_DIR/var/lib/dpkg/status")

{
  echo "# Size baseline — untouched Kubuntu 26.04 base"
  echo
  echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ) by 03-size-report.sh"
  echo
  printf -- "- ISO: **%.2f GiB** (%s bytes)\n" "$(echo "$iso_bytes/1073741824" | bc -l)" "$iso_bytes"
  printf -- "- filesystem.squashfs: **%.2f GiB** compressed\n" "$(echo "$squash_bytes/1073741824" | bc -l)"
  printf -- "- Installed (uncompressed) size, sum of dpkg Installed-Size: **%.2f GiB**\n" "$(echo "$installed_kb/1048576" | bc -l)"
  printf -- "- Package count (dpkg status): **%s**\n" "$pkg_count"
  echo
  echo "## 40 largest packages by Installed-Size"
  echo
  echo '| # | Package | Installed size |'
  echo '|---|---------|----------------|'
  python3 - "$DPKG_STATUS_DIR/var/lib/dpkg/status" <<'PYEOF'
import sys
pkgs, name, size = [], None, 0
for line in open(sys.argv[1], encoding="utf-8", errors="replace"):
    if line.startswith("Package: "):
        name, size = line.split(": ", 1)[1].strip(), 0
    elif line.startswith("Installed-Size: "):
        try: size = int(line.split(": ", 1)[1])
        except ValueError: size = 0
    elif line.strip() == "" and name:
        pkgs.append((size, name)); name = None
if name: pkgs.append((size, name))
for i, (kb, n) in enumerate(sorted(pkgs, reverse=True)[:40], 1):
    print(f"| {i} | {n} | {kb/1024:.1f} MiB |")
PYEOF
} > "$OUT_MD"

log "Size baseline written to docs/SIZE-BASELINE.md"
sed -n '1,12p' "$OUT_MD"
