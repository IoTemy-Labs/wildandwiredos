#!/usr/bin/env bash
# Bootstrap the inside of the Wild & Wired build container (or any fresh
# Ubuntu 24.04 box). Installs the full host toolchain, prepares
# /opt/wildwired (repo) and /opt/wildwired-build (state), and points
# WWWV_WORK at the latter. Idempotent — safe to re-run.
set -euo pipefail

REPO_URL=""
[ "${1:-}" = "--repo-url" ] && REPO_URL="${2:-}"

export DEBIAN_FRONTEND=noninteractive
echo "== apt: base toolchain"
apt-get update -qq
apt-get install -y -qq \
  xorriso squashfs-tools rsync gnupg wget git bc \
  qemu-system-x86 ovmf \
  python3 python3-yaml python3-pil \
  dosfstools mtools zstd file >/dev/null
# python3-yaml/-pil: Phase 2 sponsor-art renderer.
# dosfstools/mtools: inspecting/repacking the EFI partition image if ever
# needed read-only; the signed payload itself is never modified.

echo "== Directories"
mkdir -p /opt/wildwired /opt/wildwired-build
if [ -n "$REPO_URL" ] && [ ! -d /opt/wildwired/.git ]; then
  git clone "$REPO_URL" /opt/wildwired
fi

echo "== Environment"
cat > /etc/profile.d/wildwired.sh <<'EOF'
export WWWV_WORK=/opt/wildwired-build
EOF

echo "== Sanity"
if [ -e /dev/kvm ]; then echo "  /dev/kvm present (accelerated QEMU: yes)"
else echo "  /dev/kvm ABSENT — boot tests will be slow; check passthrough lines in the LXC conf"; fi
for f in /usr/share/OVMF/OVMF_CODE_4M.ms.fd /usr/share/OVMF/OVMF_VARS_4M.ms.fd; do
  [ -e "$f" ] && echo "  ok $f" || echo "  MISSING $f (Secure Boot tests need it)"
done
mksquashfs -help 2>&1 | grep -qi zstd && echo "  ok mksquashfs zstd" || echo "  MISSING zstd in mksquashfs"

echo "== Bootstrap complete. If the repo is present:"
echo "   cd /opt/wildwired && bash scripts/build/01-host-deps.sh"
