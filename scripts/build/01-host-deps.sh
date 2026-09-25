#!/usr/bin/env bash
# Verify every host tool the pipeline needs. Fails loudly, lists exactly
# what is missing and the one apt command that fixes it. Idempotent.
set -euo pipefail
source "$(dirname "$0")/env.sh"

missing_pkgs=()
fail=0

need() { # need <command> <providing-package>
  if command -v "$1" >/dev/null 2>&1; then
    printf '  ok      %-22s %s\n' "$1" "$(command -v "$1")"
  else
    printf '  MISSING %-22s (apt package: %s)\n' "$1" "$2"
    missing_pkgs+=("$2"); fail=1
  fi
}

need_file() { # need_file <path> <providing-package> <why>
  if [ -e "$1" ]; then
    printf '  ok      %s\n' "$1"
  else
    printf '  MISSING %s (apt package: %s) — %s\n' "$1" "$2" "$3"
    missing_pkgs+=("$2"); fail=1
  fi
}

echo "== Host build dependencies =="
need xorriso xorriso
need mksquashfs squashfs-tools
need unsquashfs squashfs-tools
need rsync rsync
need gpg gnupg
need wget wget
need python3 python3
need qemu-system-x86_64 qemu-system-x86
need git git

# OVMF for UEFI boot tests. The .ms variants ship Microsoft keys enrolled,
# which is what makes the Secure Boot test meaningful.
need_file /usr/share/OVMF/OVMF_CODE_4M.ms.fd ovmf "UEFI firmware (Secure Boot, MS keys)"
need_file /usr/share/OVMF/OVMF_VARS_4M.ms.fd ovmf "UEFI vars template (Secure Boot, MS keys)"

if command -v mksquashfs >/dev/null 2>&1; then
  if mksquashfs -help 2>&1 | grep -qi zstd; then
    echo "  ok      mksquashfs supports zstd"
  else
    echo "  MISSING mksquashfs zstd support — squashfs-tools too old for the planned compression"
    fail=1
  fi
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "Missing dependencies. Fix with:"
  echo "  sudo apt-get update && sudo apt-get install -y ${missing_pkgs[*]}"
  exit 1
fi
echo "All host dependencies present."
