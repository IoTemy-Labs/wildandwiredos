#!/usr/bin/env bash
# Runs ON THE PROXMOX HOST. Executes a command inside the build container
# from /opt/wildwired, so callers never need nested quoting:
#   bash run-in-ct.sh 211 bash scripts/build/build.sh --from-stage assets
set -euo pipefail
VMID="$1"; shift
exec pct exec "$VMID" -- bash -c "cd /opt/wildwired && $*"
