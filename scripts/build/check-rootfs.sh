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
echo "== branding checks (Phase 5) =="
grep -q '^NAME="Wild & Wired OS"' "$R/usr/lib/os-release" && ok "os-release NAME" || bad "os-release NAME not ours"
grep -q '^ID=ubuntu' "$R/usr/lib/os-release" && ok "os-release ID stays ubuntu (compat)" || bad "os-release ID changed"
grep -q '^DISTRIB_ID=Ubuntu' "$R/etc/lsb-release" && ok "lsb-release ID stays Ubuntu (compat)" || bad "lsb-release ID changed"
grep -q 'Wild & Wired' "$R/etc/xdg/kcm-about-distrorc" && ok "About this System is ours" || bad "kcm-about-distrorc not ours"
[ -e "$R/usr/share/wayland-sessions/kubuntu-live-environment.desktop" ] \
  && bad "Kubuntu live prompt session still present" || ok "Kubuntu live prompt session diverted away"
grep -q 'USERNAME="live"' "$R/etc/casper.conf" && ok "casper user is live@wildwired" || bad "casper.conf not ours"
[ "$(readlink "$R/etc/alternatives/default.plymouth")" = /usr/share/plymouth/themes/wildwired/wildwired.plymouth ] \
  && ok "Plymouth default is wildwired" || bad "Plymouth default is $(readlink "$R/etc/alternatives/default.plymouth")"
grep -q '^branding: wildwired' "$R/etc/calamares/settings.conf" && ok "Calamares branding" || bad "Calamares branding not ours"
grep -q '^keepDistributor: true' "$R/etc/calamares/modules/grubcfg.conf" && ok "Calamares keeps GRUB_DISTRIBUTOR" || bad "grubcfg keepDistributor"
grep -q '^Name=Install Wild & Wired OS' "$R/usr/share/applications/kubuntu-calamares.desktop" \
  && ok "installer launcher renamed" || bad "installer launcher still Kubuntu"
ls "$R"/etc/skel/Desktop/*kubuntu* "$R"/etc/skel/Desktop/*kfocus* >/dev/null 2>&1 \
  && bad "Kubuntu links in /etc/skel/Desktop" || ok "no Kubuntu links in skel"
grep -rqs --exclude='*.distrib' 'firefox_firefox\|thunderbird_thunderbird' "$R/etc/xdg" "$R/usr/share/kubuntu-default-settings/kf5-settings" \
  && bad "snap desktop ids still referenced" || ok "default browser/mail point at Flatpak ids"
[ -s "$R/usr/share/wallpapers/WildWired/contents/images/1920x1080.png" ] && ok "WildWired wallpaper installed" || bad "wallpaper missing"
[ -s "$R/usr/share/wildwired/lockscreen.png" ] && ok "lock screen art installed" || bad "lock screen art missing"
# GRUB: installed-system menus show our name, grub-install keeps /EFI/ubuntu.
gi="$(chroot "$R" sh -c '. /etc/default/grub; printf %s "$GRUB_DISTRIBUTOR"')"
printf '#!/bin/sh\n. /etc/default/grub\nprintf %%s "$GRUB_DISTRIBUTOR"\n' > "$R/tmp/grub-mkconfig"
gm="$(chroot "$R" sh /tmp/grub-mkconfig)"; rm -f "$R/tmp/grub-mkconfig"
[ "$gi" = "Ubuntu" ] && ok "grub-install sees GRUB_DISTRIBUTOR=Ubuntu (EFI dir ubuntu)" || bad "grub-install sees '$gi'"
[ "$gm" = "Wild & Wired OS" ] && ok "grub-mkconfig sees '$gm'" || bad "grub-mkconfig sees '$gm'"
ird="$(ls -1 "$R"/boot/initrd.img-* | sort -V | tail -1)"
chroot "$R" lsinitramfs "${ird#$R}" | grep -q 'plymouth/themes/wildwired/' && ok "initrd carries wildwired splash" || bad "initrd splash not ours"
echo "== general =="
[ -s "$R/etc/machine-id" ] && bad "machine-id not empty" || ok "machine-id empty"
ls "$R"/etc/ssh/ssh_host_* >/dev/null 2>&1 && bad "ssh host keys present" || ok "no ssh host keys"
echo
[ "$fail" -eq 0 ] && echo "RESULT: all checks passed" || { echo "RESULT: FAILURES above"; exit 1; }
