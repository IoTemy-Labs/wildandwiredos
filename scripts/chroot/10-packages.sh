#!/bin/bash
# Runs INSIDE the chroot (no systemd, no D-Bus; policy-rc.d blocks service
# starts). Driven entirely by /tmp/wwwv-chroot/manifests/. Idempotent:
# apt skips installed packages, purges skip absent ones.
set -euo pipefail
M=/tmp/wwwv-chroot/manifests

apt-get update -qq

# --- Additions (names verified: docs/PACKAGE-VERIFY.txt) ---
mapfile -t ADD < <(awk '!/^#/ && NF {print $1}' "$M/packages-add.txt")
apt-get install -y --no-install-recommends=false "${ADD[@]}"

# --- Removals ---
# Always: wallpapers we replace.
apt-get purge -y plasma-workspace-wallpapers || true

# Snap: only on explicit decision (WWWV_SNAP=remove).
if [ "${WWWV_SNAP:-keep}" = "remove" ]; then
  apt-get purge -y snapd firefox || true
  rm -rf /var/lib/snapd /snap /root/snap
  # Keep a fresh live user from inheriting snap paths.
  sed -i 's|:/snap/bin||g' /etc/environment 2>/dev/null || true
fi

apt-get autoremove --purge -y
apt-get clean
