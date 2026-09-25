#!/bin/bash
# Runs INSIDE the chroot, last in the `assets` stage. The live boot splash
# and the casper user/host come from the initrd, not the squashfs, so the
# initrd must be regenerated after branding. build.sh copies the result to
# casper/initrd in the ISO tree. Same kernel as the base image, so the
# signed boot chain is untouched (the initrd is not signed).
#
# CASPER_GENERATE_UUID is what Ubuntu's image builder sets: the casper hook
# then writes conf/uuid.conf plus a default of BOOT=casper (the ISO's GRUB
# menu passes no boot= argument). casper only accepts a medium whose
# .disk/casper-uuid-generic matches uuid.conf, so the UUID is handed to
# build.sh through /boot/.wwwv-casper-uuid and written into the ISO tree.
set -euo pipefail
export CASPER_GENERATE_UUID=1
update-initramfs -u -k all
initrd="$(ls -1 /boot/initrd.img-* | sort -V | tail -1)"

# Prove the branding and the live-boot plumbing reached the initrd.
contents="$(lsinitramfs "$initrd")"
for want in plymouth/themes/wildwired/wildwired.script \
            conf/uuid.conf \
            conf/conf.d/default-boot-to-casper.conf; do
  grep -q "$want" <<<"$contents" || { echo "initrd is missing $want" >&2; exit 1; }
done

tmp="$(mktemp -d)"
unmkinitramfs "$initrd" "$tmp"
uuid="$(cat "$tmp"/main/conf/uuid.conf 2>/dev/null || cat "$tmp"/conf/uuid.conf)"
rm -rf "$tmp"
[ -n "$uuid" ] || { echo "could not read uuid.conf from $initrd" >&2; exit 1; }
printf '%s\n' "$uuid" > /boot/.wwwv-casper-uuid
echo "brand: initrd regenerated: $initrd ($(stat -c%s "$initrd") bytes), casper uuid $uuid"
