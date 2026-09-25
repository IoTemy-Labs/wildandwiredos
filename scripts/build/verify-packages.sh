#!/usr/bin/env bash
# Verify every name in manifests/packages-add.txt and packages-remove.txt
# against the REAL 26.04 archive, by running apt inside the extracted
# rootfs chroot. One command, one report: docs/PACKAGE-VERIFY.txt.
# Requires: root, work/rootfs present (build.sh through unsquash).
set -euo pipefail
source "$(dirname "$0")/env.sh"

ROOTFS="$WORK_DIR/rootfs"
OUT="$REPO_ROOT/docs/PACKAGE-VERIFY.txt"
[ "$(id -u)" -eq 0 ] || die "Run as root."
[ -d "$ROOTFS/etc" ] || die "rootfs missing: run build.sh --from-stage extract first (extract+unsquash)."

mount --bind /dev "$ROOTFS/dev"; mount -t proc proc "$ROOTFS/proc"
mv "$ROOTFS/etc/resolv.conf" "$ROOTFS/etc/resolv.conf.vp" 2>/dev/null || true
cp /etc/resolv.conf "$ROOTFS/etc/resolv.conf"
# The live rootfs carries a file:/cdrom apt source that cannot resolve in a
# chroot; park every source file mentioning cdrom for the duration.
parked=()
while IFS= read -r f; do
  mv "$f" "$f.vp-parked"; parked+=("$f")
done < <(grep -rl cdrom "$ROOTFS/etc/apt/sources.list" "$ROOTFS/etc/apt/sources.list.d" 2>/dev/null || true)
cleanup() {
  for f in "${parked[@]:-}"; do [ -e "$f.vp-parked" ] && mv "$f.vp-parked" "$f"; done
  rm -f "$ROOTFS/etc/resolv.conf"
  mv "$ROOTFS/etc/resolv.conf.vp" "$ROOTFS/etc/resolv.conf" 2>/dev/null || true
  umount -l "$ROOTFS/proc" "$ROOTFS/dev" 2>/dev/null || true
}
trap cleanup EXIT

log "apt-get update inside chroot"
chroot "$ROOTFS" apt-get update -qq

{
  echo "# Package verification against the 26.04 archive"
  echo "# Generated $(date -u +%Y-%m-%dT%H:%M:%SZ) by verify-packages.sh"
  echo
  echo "== ADDITIONS =="
  printf '%-9s %-18s %-26s %10s %10s\n' STATUS PACKAGE VERSION INST_MiB DL_MiB
  total_inst=0; total_dl=0; fail=0
  while read -r pkg _group _rest; do
    case "$pkg" in ''|'#'*) continue;; esac
    if chroot "$ROOTFS" dpkg -s "$pkg" 2>/dev/null | grep -q 'ok installed'; then
      printf '%-9s %-18s %s\n' IN-BASE "$pkg" "(already in base image)"
      continue
    fi
    info="$(chroot "$ROOTFS" apt-cache show "$pkg" 2>/dev/null | head -40 || true)"
    if [ -z "$info" ]; then
      printf '%-9s %-18s %s\n' MISSING "$pkg" "NOT IN ARCHIVE: fix or drop"
      fail=1; continue
    fi
    ver=$(sed -n 's/^Version: //p' <<<"$info" | head -1)
    ikb=$(sed -n 's/^Installed-Size: //p' <<<"$info" | head -1); ikb=${ikb:-0}
    db=$(sed -n 's/^Size: //p' <<<"$info" | head -1); db=${db:-0}
    printf '%-9s %-18s %-26s %10.1f %10.1f\n' ok "$pkg" "$ver" \
      "$(echo "$ikb/1024" | bc -l)" "$(echo "$db/1048576" | bc -l)"
    total_inst=$((total_inst + ikb)); total_dl=$((total_dl + db))
  done < "$REPO_ROOT/manifests/packages-add.txt"
  printf '%-9s %-18s %-26s %10.1f %10.1f\n' TOTAL "(new packages)" "" \
    "$(echo "$total_inst/1024" | bc -l)" "$(echo "$total_dl/1048576" | bc -l)"
  echo
  echo "(Totals are package-only; apt dependency pull-in measured separately"
  echo " by the dry-run below.)"
  echo
  echo "== DEPENDENCY DRY-RUN (full closure, new packages only) =="
  pkgs=$(awk '!/^#/ && NF {print $1}' "$REPO_ROOT/manifests/packages-add.txt")
  chroot "$ROOTFS" apt-get install --dry-run $pkgs 2>&1 \
    | grep -E '^(Inst|[0-9]+ upgraded|Need to get|After this)' \
    | tail -5 || true
  echo
  echo "== REMOVALS =="
  printf '%-9s %-28s %10s\n' STATUS PACKAGE INST_MiB
  while read -r pkg _rest; do
    case "$pkg" in ''|'#'*) continue;; esac
    st="$(chroot "$ROOTFS" dpkg -s "$pkg" 2>/dev/null || true)"
    if grep -q 'ok installed' <<<"$st"; then
      ikb=$(sed -n 's/^Installed-Size: //p' <<<"$st" | head -1); ikb=${ikb:-0}
      printf '%-9s %-28s %10.1f\n' present "$pkg" "$(echo "$ikb/1024" | bc -l)"
    else
      printf '%-9s %-28s %s\n' ABSENT "$pkg" "not in base: drop the line"
    fi
  done < "$REPO_ROOT/manifests/packages-remove.txt"
  [ "$fail" -eq 0 ] && echo && echo "RESULT: all addition names verified." \
    || { echo; echo "RESULT: MISSING packages above."; }
} | tee "$OUT"
