#!/usr/bin/env bash
# Runs ON THE WORKSTATION (WSL). Pulls files from inside the build CT to a
# local directory, via the Proxmox host:
#   bash pull-from-ct.sh <ct-path> [<ct-path> ...] <local-dest-dir>
# Non-recursive; each ct-path must be a file.
set -euo pipefail

HOST="root@192.168.8.25"
KEY="$HOME/.ssh/wildwired_build"
VMID=211

[ $# -ge 2 ] || { echo "usage: pull-from-ct.sh <ct-file> [...] <dest-dir>" >&2; exit 2; }
DEST="${@: -1}"
mkdir -p "$DEST"

ssh -i "$KEY" "$HOST" mkdir -p /root/ct-pull
for src in "${@:1:$#-1}"; do
  name="$(basename "$src")"
  ssh -i "$KEY" "$HOST" pct pull "$VMID" "$src" "/root/ct-pull/$name"
  scp -q -i "$KEY" "$HOST:/root/ct-pull/$name" "$DEST/$name"
done
ssh -i "$KEY" "$HOST" rm -rf /root/ct-pull
echo "pulled $(( $# - 1 )) file(s) to $DEST"
