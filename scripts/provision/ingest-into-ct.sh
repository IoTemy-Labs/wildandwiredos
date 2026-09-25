#!/usr/bin/env bash
# Runs ON THE PROXMOX HOST. Feeds the build container everything it needs:
#   1. the repo tarball  (/root/wildwired-repo.tgz, scp'd from the workstation)
#   2. the staged base ISO + checksums (/root/iso-stage/)
#   3. runs the dependency gate and ISO verification inside the CT
# Idempotent: re-running refreshes the repo copy and re-checks the ISO.
set -euo pipefail

VMID="${1:-211}"
X() { pct exec "$VMID" -- bash -c "$1"; }

echo "== repo -> /opt/wildwired"
[ -f /root/wildwired-repo.tgz ] || { echo "ERROR: /root/wildwired-repo.tgz missing (scp it first)"; exit 1; }
X "mkdir -p /opt/wildwired /opt/wildwired-build/cache"
pct push "$VMID" /root/wildwired-repo.tgz /root/wildwired-repo.tgz
X "tar -C /opt/wildwired -xzf /root/wildwired-repo.tgz && rm /root/wildwired-repo.tgz"

echo "== iso-stage -> /opt/wildwired-build/cache"
for f in kubuntu-26.04-desktop-amd64.iso SHA256SUMS SHA256SUMS.gpg; do
  [ -f "/root/iso-stage/$f" ] || { echo "ERROR: /root/iso-stage/$f missing"; exit 1; }
  pct push "$VMID" "/root/iso-stage/$f" "/opt/wildwired-build/cache/$f"
done

echo "== dependency gate + ISO verification (inside CT)"
X "export WWWV_WORK=/opt/wildwired-build; cd /opt/wildwired && bash scripts/build/01-host-deps.sh && bash scripts/build/00-fetch-base.sh"

echo "== ingest complete"
