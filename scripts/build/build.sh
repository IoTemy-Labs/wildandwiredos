#!/usr/bin/env bash
# Wild & Wired OS image pipeline. Staged, checkpointed, resumable.
#
#   build.sh                  run all stages (skipping ones already stamped)
#   build.sh --stage squash   run exactly one stage
#   build.sh --from-stage assets   invalidate stamps from that stage on, run to end
#   build.sh --clean          wipe work state (never the ISO cache), then exit
#   build.sh --comp xz        squash compression override (default zstd)
#
# Stage order: extract unsquash chroot assets clean metadata squash iso verify
# Late sponsor art = `--from-stage assets` (assets→squash→iso→verify), no
# re-extract, no re-chroot. The assets stage also applies scripts/brand/
# and regenerates the initrd (about a minute), because the live splash and
# casper identity live there. Every stage logs and times itself into
# $WORK_ROOT/build.log and writes $WORK_DIR/stamps/<stage>.done.
set -euo pipefail
source "$(dirname "$0")/env.sh"

STAGES=(extract unsquash chroot assets clean metadata squash iso verify)
STAMPS="$WORK_DIR/stamps"
ISO_TREE="$WORK_DIR/iso-tree"
ROOTFS="$WORK_DIR/rootfs"
SQUASH_COMP="zstd"
ONLY_STAGE=""
FROM_STAGE=""
BUILD_SERIAL="$(date -u +%Y%m%d%H%M)"
OUT_ISO="$OUT_DIR/wildwired-os-${DISTRO_VERSION}-b${DISTRO_BUILD}-desktop-amd64.iso"

while [ $# -gt 0 ]; do
  case "$1" in
    --stage) ONLY_STAGE="$2"; shift 2;;
    --from-stage) FROM_STAGE="$2"; shift 2;;
    --comp) SQUASH_COMP="$2"; shift 2;;
    --clean) echo "Wiping $WORK_DIR and $OUT_DIR (cache kept)"; rm -rf "$WORK_DIR" "$OUT_DIR"; exit 0;;
    *) die "Unknown flag: $1";;
  esac
done

[ "$(id -u)" -eq 0 ] || die "Run as root (unsquash/chroot/squash need it)."
[ -f "$CACHE_DIR/$BASE_ISO_NAME.verified" ] || die "Base ISO not verified — run 00-fetch-base.sh first."
mkdir -p "$STAMPS"

valid_stage() { printf '%s\n' "${STAGES[@]}" | grep -qx "$1"; }
[ -z "$ONLY_STAGE" ] || valid_stage "$ONLY_STAGE" || die "No such stage: $ONLY_STAGE"
[ -z "$FROM_STAGE" ] || valid_stage "$FROM_STAGE" || die "No such stage: $FROM_STAGE"

# --from-stage S: drop stamps for S and everything after it.
if [ -n "$FROM_STAGE" ]; then
  drop=0
  for s in "${STAGES[@]}"; do
    [ "$s" = "$FROM_STAGE" ] && drop=1
    [ "$drop" -eq 1 ] && rm -f "$STAMPS/$s.done"
  done
fi

# ---------------------------------------------------------------- stages ---

stage_extract() {
  rm -rf "$ISO_TREE"; mkdir -p "$ISO_TREE"
  xorriso -osirrox on -indev "$BASE_ISO" -extract / "$ISO_TREE" 2>>"$LOG_FILE"
  chmod -R u+w "$ISO_TREE"
  # -c /boot.catalog regenerates the catalog at repack; the extracted copy
  # would otherwise ship twice.
  rm -f "$ISO_TREE/boot.catalog"
}

stage_unsquash() {
  rm -rf "$ROOTFS"
  unsquashfs -d "$ROOTFS" "$ISO_TREE/casper/filesystem.squashfs" >>"$LOG_FILE" 2>&1
}

CHROOT_MOUNTED=0
chroot_mount() {
  mount --bind /dev       "$ROOTFS/dev"
  mount --bind /dev/pts   "$ROOTFS/dev/pts"
  mount -t proc  proc     "$ROOTFS/proc"
  mount -t sysfs sysfs    "$ROOTFS/sys"
  mount -t tmpfs tmpfs    "$ROOTFS/run"
  CHROOT_MOUNTED=1
}
chroot_umount() {
  [ "$CHROOT_MOUNTED" -eq 1 ] || return 0
  umount -l "$ROOTFS/run" "$ROOTFS/sys" "$ROOTFS/proc" "$ROOTFS/dev/pts" "$ROOTFS/dev" 2>/dev/null || true
  CHROOT_MOUNTED=0
}
trap chroot_umount EXIT

# Run every *.sh in $1 inside the rootfs, in sort order, with networking,
# service starts blocked, and the product identity in the environment.
run_chroot_scripts() {
  local src="$1" label="$2"
  shopt -s nullglob
  local scripts=("$src"/*.sh)
  shopt -u nullglob
  if [ "${#scripts[@]}" -eq 0 ]; then
    log "$label: no scripts in $src — no-op"
    return 0
  fi
  chroot_mount
  # Block every service start attempt; there is no init in here.
  printf '#!/bin/sh\nexit 101\n' > "$ROOTFS/usr/sbin/policy-rc.d"
  chmod +x "$ROOTFS/usr/sbin/policy-rc.d"
  # Networking for apt. The live image's resolv.conf is a dangling
  # systemd-resolved symlink; park it and restore afterwards.
  if [ -L "$ROOTFS/etc/resolv.conf" ] || [ -f "$ROOTFS/etc/resolv.conf" ]; then
    mv "$ROOTFS/etc/resolv.conf" "$ROOTFS/etc/resolv.conf.wwwv-orig"
  fi
  cp /etc/resolv.conf "$ROOTFS/etc/resolv.conf"

  # Park the live image's file:/cdrom apt source for the duration.
  local parked=() f
  while IFS= read -r f; do
    mv "$f" "$f.wwwv-parked"; parked+=("$f")
  done < <(grep -rl cdrom "$ROOTFS/etc/apt/sources.list" "$ROOTFS/etc/apt/sources.list.d" 2>/dev/null || true)

  mkdir -p "$ROOTFS/tmp/wwwv-chroot"
  cp "${scripts[@]}" "$ROOTFS/tmp/wwwv-chroot/"
  cp -r "$REPO_ROOT/manifests" "$ROOTFS/tmp/wwwv-chroot/manifests"
  local rc=0 s
  for s in $(ls "$ROOTFS/tmp/wwwv-chroot" | grep '\.sh$' | sort); do
    log "$label: running $s"
    chroot "$ROOTFS" env DEBIAN_FRONTEND=noninteractive LC_ALL=C.UTF-8 \
      WWWV_SNAP="$WWWV_SNAP" \
      DISTRO_NAME="$DISTRO_NAME" DISTRO_VERSION="$DISTRO_VERSION" \
      DISTRO_BUILD="$DISTRO_BUILD" DISTRO_CODENAME="$DISTRO_CODENAME" \
      bash -e "/tmp/wwwv-chroot/$s" >>"$LOG_FILE" 2>&1 || { rc=$?; break; }
  done
  rm -rf "$ROOTFS/tmp/wwwv-chroot" "$ROOTFS/usr/sbin/policy-rc.d"
  for f in "${parked[@]:-}"; do [ -e "$f.wwwv-parked" ] && mv "$f.wwwv-parked" "$f"; done
  rm -f "$ROOTFS/etc/resolv.conf"
  if [ -e "$ROOTFS/etc/resolv.conf.wwwv-orig" ] || [ -L "$ROOTFS/etc/resolv.conf.wwwv-orig" ]; then
    mv "$ROOTFS/etc/resolv.conf.wwwv-orig" "$ROOTFS/etc/resolv.conf"
  fi
  chroot_umount
  [ "$rc" -eq 0 ] || die "$label script failed (rc=$rc) — see $LOG_FILE"
}

stage_chroot() {
  run_chroot_scripts "$REPO_ROOT/scripts/chroot" chroot
}

# Repo files come from a Windows checkout: force root ownership and sane
# modes instead of trusting whatever the tarball carried.
overlay() { rsync -rlt --chmod=D0755,F0644 --chown=root:root "$1" "$2"; }

stage_assets() {
  # 1. payload/ mirrors / and lands in the rootfs (static files only).
  if [ -d "$REPO_ROOT/payload" ] && [ -n "$(ls -A "$REPO_ROOT/payload" 2>/dev/null)" ]; then
    overlay "$REPO_ROOT/payload/" "$ROOTFS/"
  else
    log "assets: payload/ empty — no rootfs overlay"
  fi
  # 2. Generated art (wallpapers, lock, SDDM, Plymouth, installer, icons).
  python3 "$REPO_ROOT/scripts/build/install-art.py" "$ROOTFS" "$ISO_TREE" >>"$LOG_FILE" 2>&1 \
    || die "install-art.py failed — see $LOG_FILE"
  # 3. ISO-tree files: GRUB menus now, GRUB theme art later.
  [ -d "$REPO_ROOT/branding/iso" ] && overlay "$REPO_ROOT/branding/iso/" "$ISO_TREE/"
  [ -d "$REPO_ROOT/assets/generated/iso" ] && overlay "$REPO_ROOT/assets/generated/iso/" "$ISO_TREE/"
  # 4. Diversions, alternatives, identity, then a fresh initrd.
  run_chroot_scripts "$REPO_ROOT/scripts/brand" brand
  # 5. The live splash and casper user live in the initrd: ship the new one.
  local initrd
  initrd="$(ls -1 "$ROOTFS"/boot/initrd.img-* | sort -V | tail -1)"
  [ -f "$initrd" ] || die "No initrd in $ROOTFS/boot after brand stage."
  cp "$initrd" "$ISO_TREE/casper/initrd"
  log "assets: casper/initrd <- $(basename "$initrd") ($(stat -c%s "$initrd") bytes)"
  # casper boots only from a medium whose UUID matches the initrd's.
  [ -s "$ROOTFS/boot/.wwwv-casper-uuid" ] || die "brand stage left no casper UUID."
  cp "$ROOTFS/boot/.wwwv-casper-uuid" "$ISO_TREE/.disk/casper-uuid-generic"
  rm -f "$ROOTFS/boot/.wwwv-casper-uuid"
  log "assets: .disk/casper-uuid-generic <- $(cat "$ISO_TREE/.disk/casper-uuid-generic")"
}

stage_clean() {
  chroot_mount
  chroot "$ROOTFS" apt-get clean >>"$LOG_FILE" 2>&1 || true
  chroot_umount
  rm -rf "$ROOTFS"/var/lib/apt/lists/* "$ROOTFS"/var/cache/apt/*.bin \
         "$ROOTFS"/tmp/* "$ROOTFS"/var/tmp/* "$ROOTFS"/var/crash/*
  mkdir -p "$ROOTFS/var/lib/apt/lists/partial"
  # machine-id: present but empty → regenerated per boot/install, no collisions.
  truncate -s 0 "$ROOTFS/etc/machine-id"
  rm -f "$ROOTFS"/etc/ssh/ssh_host_*
  find "$ROOTFS/var/log" -type f -exec truncate -s 0 {} +
  rm -f "$ROOTFS"/root/.bash_history "$ROOTFS"/home/*/.bash_history
}

stage_metadata() {
  mkdir -p "$ISO_TREE/.disk"
  printf '%s %s "%s" (build %s.%s) - Based on Ubuntu 26.04 LTS - amd64\n' \
    "$DISTRO_NAME" "$DISTRO_VERSION" "$DISTRO_CODENAME" "$DISTRO_BUILD" "$BUILD_SERIAL" \
    > "$ISO_TREE/.disk/info"
  ( cd "$ISO_TREE" && find . -type f ! -name md5sum.txt -exec md5sum {} + | sort -k2 > md5sum.txt )
}

stage_squash() {
  local comp_args=(-comp zstd -Xcompression-level 19)
  [ "$SQUASH_COMP" = "xz" ] && comp_args=(-comp xz)
  rm -f "$ISO_TREE/casper/filesystem.squashfs"
  mksquashfs "$ROOTFS" "$ISO_TREE/casper/filesystem.squashfs" \
    "${comp_args[@]}" -b 1M -noappend -processors "$(nproc)" >>"$LOG_FILE" 2>&1
  log "squash($SQUASH_COMP): $(stat -c%s "$ISO_TREE/casper/filesystem.squashfs") bytes"
  # squash invalidates the md5 manifest — refresh it.
  ( cd "$ISO_TREE" && find . -type f ! -name md5sum.txt -exec md5sum {} + | sort -k2 > md5sum.txt )
}

stage_iso() {
  # Regenerate the boot recipe live from the verified base ISO (audit copy in
  # docs/BOOT-ARGS.md). Only -V changes; every boot image byte still comes
  # from the base ISO via --interval references. Joliet is auto-detected.
  local args jol=""
  args="$(xorriso -indev "$BASE_ISO" -report_el_torito as_mkisofs 2>/dev/null \
          | sed "s/^-V .*/-V '$ISO_VOLID'/")"
  [ -n "$args" ] || die "Could not capture as_mkisofs report from base ISO."
  if python3 - "$BASE_ISO" <<'PYEOF'
import sys
with open(sys.argv[1],'rb') as f:
    f.seek(16*2048)
    for _ in range(16):
        d = f.read(2048)
        if not d or d[0] == 255: sys.exit(1)
        if d[0] == 2: sys.exit(0)
sys.exit(1)
PYEOF
  then jol="-J -joliet-long"; fi
  mkdir -p "$OUT_DIR"
  rm -f "$OUT_ISO"
  # -iso-level 3: the squashfs exceeds the 4 GiB single-file limit of level 2.
  # (Filesystem-level options are not part of the el-torito report; -r, -J and
  # this must be supplied to match the base image.)
  eval xorriso -as mkisofs -r $jol -iso-level 3 $args -o "'$OUT_ISO'" "'$ISO_TREE'" >>"$LOG_FILE" 2>&1
}

stage_verify() {
  local bytes gib label
  bytes=$(stat -c%s "$OUT_ISO")
  gib=$(echo "$bytes/1073741824" | bc -l)
  sha256sum "$OUT_ISO" | tee "$OUT_ISO.sha256" >>"$LOG_FILE"
  label="$(xorriso -indev "$OUT_ISO" -pvd_info 2>/dev/null | awk -F': *' '/^Volume Id/{print $2}')"
  log "verify: label='$label' size=$(printf '%.2f' "$gib") GiB"
  [ "$label" = "$ISO_VOLID" ] || die "Volume label mismatch: got '$label' want '$ISO_VOLID'"
  # grub.cfg must not reference a label we no longer carry.
  if grep -rqs "Kubuntu 26.04 amd64" "$ISO_TREE/boot/grub"; then
    die "grub.cfg still references the base volume label — fix before shipping."
  fi
  if grep -qsi "kubuntu" "$ISO_TREE"/boot/grub/*.cfg; then
    die "A GRUB menu in the ISO tree still says Kubuntu — check branding/iso/."
  fi
  awk -v g="$gib" 'BEGIN{ if (g>8) { print "HARD STOP: ISO exceeds 8 GiB — justify before continuing."; exit 1 }
                          else if (g>6) print "WARNING: ISO above the 6 GiB soft target." }' || exit 1
  log "verify: OK — $OUT_ISO"
}

# ---------------------------------------------------------------- runner ---

run_stage() {
  local s="$1"
  if [ -f "$STAMPS/$s.done" ] && [ -z "$ONLY_STAGE" ]; then
    log "== $s: already done ($(cat "$STAMPS/$s.done")) — skipping"
    return 0
  fi
  log "== $s: start"
  local t0=$SECONDS
  "stage_$s"
  local dt=$((SECONDS-t0))
  printf '%s took %ss (build %s.%s, comp %s)\n' "$s" "$dt" "$DISTRO_BUILD" "$BUILD_SERIAL" "$SQUASH_COMP" > "$STAMPS/$s.done"
  log "== $s: done in ${dt}s"
}

if [ -n "$ONLY_STAGE" ]; then
  run_stage "$ONLY_STAGE"
else
  for s in "${STAGES[@]}"; do run_stage "$s"; done
  log "== Pipeline complete. Stage timings:"
  for s in "${STAGES[@]}"; do [ -f "$STAMPS/$s.done" ] && log "   $(cat "$STAMPS/$s.done")"; done
fi
