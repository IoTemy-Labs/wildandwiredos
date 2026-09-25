#!/usr/bin/env bash
# Provision the Wild & Wired OS build container on a Proxmox host.
# Run AS ROOT ON THE PROXMOX HOST:
#   bash provision-lxc.sh --vmid 211 --storage local-lvm --bridge vmbr0
#
# Creates a PRIVILEGED LXC (the chroot stage bind-mounts /dev,/proc,/sys and
# runs apt/mknod inside the extracted rootfs — unprivileged idmaps break
# that) with nesting enabled and /dev/kvm passed through for QEMU boot
# tests. Idempotent: refuses to touch an existing VMID.
set -euo pipefail

VMID=211
STORAGE="local-lvm"
TMPL_STORAGE="local"
BRIDGE="vmbr0"
DISK_GB=120          # base ISO + rootfs + squash scratch + ISOs ≈ 40 GB; headroom for respins
CORES=8
MEMORY_MB=16384      # mksquashfs zstd is the hungriest stage
SWAP_MB=4096
HOSTNAME="wwwv-build"
REPO_URL=""          # optional: git remote to clone during bootstrap

while [ $# -gt 0 ]; do
  case "$1" in
    --vmid) VMID="$2"; shift 2;;
    --storage) STORAGE="$2"; shift 2;;
    --tmpl-storage) TMPL_STORAGE="$2"; shift 2;;
    --bridge) BRIDGE="$2"; shift 2;;
    --disk) DISK_GB="$2"; shift 2;;
    --cores) CORES="$2"; shift 2;;
    --memory) MEMORY_MB="$2"; shift 2;;
    --hostname) HOSTNAME="$2"; shift 2;;
    --repo-url) REPO_URL="$2"; shift 2;;
    *) echo "Unknown flag: $1" >&2; exit 2;;
  esac
done

command -v pct >/dev/null || { echo "ERROR: pct not found — run on the Proxmox host." >&2; exit 1; }
if pct status "$VMID" >/dev/null 2>&1; then
  echo "ERROR: VMID $VMID already exists. Pick another with --vmid." >&2; exit 1
fi
[ -e /dev/kvm ] || echo "WARNING: /dev/kvm missing on this host — QEMU boot tests will run unaccelerated."

# --- Newest Ubuntu 24.04 standard template (auto-detected, not hardcoded) ---
echo "== Locating Ubuntu 24.04 LXC template"
pveam update >/dev/null
TMPL="$(pveam available --section system | awk '/ubuntu-24.04-standard/{print $2}' | sort -V | tail -1)"
[ -n "$TMPL" ] || { echo "ERROR: no ubuntu-24.04-standard template offered by pveam." >&2; exit 1; }
if ! pveam list "$TMPL_STORAGE" | grep -q "$TMPL"; then
  echo "== Downloading $TMPL to $TMPL_STORAGE"
  pveam download "$TMPL_STORAGE" "$TMPL"
fi

echo "== Creating privileged LXC $VMID ($HOSTNAME)"
pct create "$VMID" "$TMPL_STORAGE:vztmpl/$TMPL" \
  --hostname "$HOSTNAME" \
  --unprivileged 0 \
  --features nesting=1 \
  --cores "$CORES" --memory "$MEMORY_MB" --swap "$SWAP_MB" \
  --rootfs "$STORAGE:$DISK_GB" \
  --net0 "name=eth0,bridge=$BRIDGE,ip=dhcp" \
  --onboot 0 \
  --tags "wildwired;buildhost" \
  --description "Wild & Wired OS 26.11 (Seneca) build container — see repo scripts/provision/"

# /dev/kvm passthrough (char 10:232) for accelerated QEMU boot tests.
cat >> "/etc/pve/lxc/$VMID.conf" <<'EOF'
lxc.cgroup2.devices.allow: c 10:232 rwm
lxc.mount.entry: /dev/kvm dev/kvm none bind,optional,create=file
EOF

echo "== Starting container"
pct start "$VMID"
sleep 5

echo "== Running bootstrap inside container"
pct push "$VMID" "$(dirname "$0")/bootstrap-build-env.sh" /root/bootstrap-build-env.sh
pct exec "$VMID" -- bash /root/bootstrap-build-env.sh ${REPO_URL:+--repo-url "$REPO_URL"}

IP="$(pct exec "$VMID" -- hostname -I | awk '{print $1}')"
cat <<EOF

== Done. Build container ready.
   VMID:     $VMID   ($HOSTNAME, $IP)
   Enter:    pct enter $VMID
   Repo dir: /opt/wildwired  (clone or rsync the repo there if --repo-url was not given:
             rsync -a --exclude .git/ <repo>/ root@$IP:/opt/wildwired/ )
   Then:     cd /opt/wildwired && bash scripts/build/01-host-deps.sh
             bash scripts/build/00-fetch-base.sh
EOF
