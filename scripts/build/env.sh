#!/usr/bin/env bash
# Shared environment for the Wild & Wired build pipeline.
# Source this; do not execute it.
#
# The repo lives on Windows (NTFS via /mnt/c). All build state lives on
# WSL-native ext4 because drvfs cannot preserve ownership, permissions,
# device nodes, or xattrs — unsquashing a rootfs onto NTFS silently
# corrupts it. Override WWWV_WORK to relocate build state (e.g. on a
# dedicated build VM where the repo and state share one filesystem).

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export REPO_ROOT

# Default: /opt/wildwired-build when present (the provisioned build CT),
# else ~/wildwired-build (WSL fallback). WWWV_WORK overrides both.
if [ -n "${WWWV_WORK:-}" ]; then WORK_ROOT="$WWWV_WORK"
elif [ -d /opt/wildwired-build ]; then WORK_ROOT="/opt/wildwired-build"
else WORK_ROOT="$HOME/wildwired-build"; fi
export WORK_ROOT
export CACHE_DIR="$WORK_ROOT/cache"      # base ISO + checksums, survives --clean
export WORK_DIR="$WORK_ROOT/work"        # extracted ISO tree, rootfs, scratch
export OUT_DIR="$WORK_ROOT/out"          # finished ISOs
export LOG_FILE="$WORK_ROOT/build.log"

# --- Product identity (DECISIONS.md 2026-08-21) ---
export DISTRO_NAME="Wild & Wired OS"
export DISTRO_VERSION="26.11"
export DISTRO_BUILD="2.0"            # second event edition; QA respins: 2.0.N
export DISTRO_CODENAME="Seneca"
export ISO_VOLID="WildWired-OS-26.11"
export ISO_NAME_RELEASE="wildwired-os-26.11-desktop-amd64.iso"

# Snap decision (Phase 3): "keep" or "remove". "remove" purges snapd and
# the 1.7 GB seed and expects Firefox to ship as a Flatpak instead.
export WWWV_SNAP="${WWWV_SNAP:-remove}"   # DECISIONS.md 2026-08-21: Option B

# --- Base image (verified against cdimage.ubuntu.com 2026-08-16) ---
export BASE_URL="https://cdimage.ubuntu.com/kubuntu/releases/26.04/release"
export BASE_ISO_NAME="kubuntu-26.04-desktop-amd64.iso"
export BASE_ISO="$CACHE_DIR/$BASE_ISO_NAME"

# Ubuntu CD Image Automatic Signing Key (2012). VERIFY: confirmed the moment
# 00-fetch-base.sh completes a successful signature check; if 26.04 images are
# signed by a newer key the script fails loudly and prints the actual key.
export UBUNTU_SIGNING_KEY_FPR="843938DF228D22F7B3742BC0D94AA3F0EFE21092"

mkdir -p "$CACHE_DIR" "$WORK_DIR" "$OUT_DIR"

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG_FILE"; }
die() { printf 'ERROR: %s\n' "$*" | tee -a "$LOG_FILE" >&2; exit 1; }
