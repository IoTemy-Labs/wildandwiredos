#!/usr/bin/env bash
# Post-build plumbing checks against work/rootfs (no boot needed). Each
# line is one fact the phases promised. Exit 1 if any FAIL.
set -uo pipefail
source "$(dirname "$0")/env.sh"
R="$WORK_DIR/rootfs"
[ -d "$R/etc" ] || die "rootfs missing"
[ "$(id -u)" -eq 0 ] || die "Run as root."
# flatpak inside the chroot needs /proc and /dev.
mount -t proc proc "$R/proc"; mount --bind /dev "$R/dev"
trap 'umount -l "$R/proc" "$R/dev" 2>/dev/null || true' EXIT
fail=0
ok()   { printf '  ok    %s\n' "$1"; }
bad()  { printf '  FAIL  %s\n' "$1"; fail=1; }
has()  { chroot "$R" dpkg -s "$1" 2>/dev/null | grep -q 'ok installed'; }

echo "== rootfs checks =="
has snapd        && bad "snapd still installed"            || ok "snapd absent"
[ -d "$R/var/lib/snapd/seed" ] && bad "snap seed still present" || ok "snap seed gone"
has flatpak      && ok "flatpak installed"                  || bad "flatpak missing"
has plasma-discover-backend-flatpak && ok "Discover flatpak backend" || bad "Discover flatpak backend missing"
has plasma-discover-backend-fwupd   && ok "Discover fwupd backend"   || bad "Discover fwupd backend missing"
has libfuse2t64  && ok "libfuse2t64 (AppImage FUSE2)"      || bad "libfuse2t64 missing"
chroot "$R" flatpak remote-list --system 2>/dev/null | grep -q '^flathub' \
  && ok "Flathub remote configured (system)" || bad "Flathub remote missing"
for app in $(awk '$1=="preinstall"{print $2}' "$REPO_ROOT/manifests/flatpaks.txt"); do
  chroot "$R" flatpak list --system --app --columns=application 2>/dev/null | grep -qx "$app" \
    && ok "flatpak preinstalled: $app" || bad "flatpak missing: $app"
done
[ -d "$R/etc/skel/Applications" ] && ok "skel ~/Applications" || bad "skel Applications missing"
grep -q 'application/vnd.appimage=' "$R/etc/xdg/mimeapps.list" 2>/dev/null \
  && ok "AppImage double-click handler set" || bad "mimeapps.list handler missing"
[ -L "$R/etc/systemd/system/multi-user.target.wants/wildwired-firstboot.service" ] \
  && ok "first-boot repair service enabled" || bad "first-boot service not enabled"
[ -f "$R/etc/xdg/menus/applications-merged/wildwired-get-software.menu" ] \
  && ok "Get Software menu category" || bad "menu category missing"
[ -s "$R/etc/machine-id" ] && bad "machine-id not empty" || ok "machine-id empty"
ls "$R"/etc/ssh/ssh_host_* >/dev/null 2>&1 && bad "ssh host keys present" || ok "no ssh host keys"
echo
[ "$fail" -eq 0 ] && echo "RESULT: all checks passed" || { echo "RESULT: FAILURES above"; exit 1; }
