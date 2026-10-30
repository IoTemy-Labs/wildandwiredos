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
grep -q 'USERNAME="live"' "$R/etc/casper.conf" && grep -q '^export FLAVOUR=' "$R/etc/casper.conf" && ok "casper user is live@wildwired" || bad "casper.conf not ours"
[ "$(readlink "$R/etc/alternatives/default.plymouth")" = /usr/share/plymouth/themes/wildwired/wildwired.plymouth ] \
  && ok "Plymouth default is wildwired" || bad "Plymouth default is $(readlink "$R/etc/alternatives/default.plymouth")"
grep -q '^branding: wildwired' "$R/etc/calamares/settings.conf" && ok "Calamares branding" || bad "Calamares branding not ours"
grep -q '^keep_distributor: true' "$R/etc/calamares/modules/grubcfg.conf" && ok "Calamares keeps GRUB_DISTRIBUTOR" || bad "grubcfg keep_distributor"
grep -q '^GRUB_DISTRIBUTOR=Ubuntu$' "$R/etc/default/grub" && ok "plain GRUB_DISTRIBUTOR line" || bad "/etc/default/grub distributor line"
grep -qi kubuntu "$R/etc/calamares/modules/partition.conf" && bad "partition label still Kubuntu" || ok "partition labels ours"
grep -q '^showSupportUrl: false' "$R/etc/calamares/modules/welcome.conf" && ok "installer Support button hidden" || bad "installer Support button shown"
chroot "$R" dpkg-divert --list /usr/share/applications/kubuntu-calamares.desktop | grep -q . \
  && bad "installer launcher diverted (survives install)" || ok "installer launcher removed with Calamares"
[ -e "$R/usr/share/applications/org.kubuntu.restore-desktop-links.desktop" ] && bad "Kubuntu link tool in menu" || ok "no Kubuntu link tool in menu"
grep -q '^Name=Install Wild & Wired OS' "$R/usr/share/applications/kubuntu-calamares.desktop" \
  && ok "installer launcher renamed" || bad "installer launcher still Kubuntu"
ls "$R"/etc/skel/Desktop/*kubuntu* "$R"/etc/skel/Desktop/*kfocus* >/dev/null 2>&1 \
  && bad "Kubuntu links in /etc/skel/Desktop" || ok "no Kubuntu links in skel"
grep -rqs --exclude='*.distrib' 'firefox_firefox\|thunderbird_thunderbird' "$R/etc/xdg" "$R/usr/share/kubuntu-default-settings/kf5-settings" \
  && bad "snap desktop ids still referenced" || ok "default browser points at the Flatpak id"
grep -qs "^x-scheme-handler/mailto=" "$R/usr/share/kubuntu-default-settings/kf5-settings/mimeapps.list" \n  && bad "default mail handler set to an app that is not installed" || ok "no dangling default mail handler"
[ -s "$R/usr/share/wallpapers/WildWired/contents/images/1920x1080.png" ] && ok "WildWired wallpaper installed" || bad "wallpaper missing"
[ -s "$R/usr/share/wildwired/lockscreen.png" ] && ok "lock screen art installed" || bad "lock screen art missing"
# GRUB: installed-system menus show our name, grub-install keeps /EFI/ubuntu.
gi="$(chroot "$R" sh -c '. /etc/default/grub; for x in /etc/default/grub.d/*.cfg; do . "$x"; done; printf %s "$GRUB_DISTRIBUTOR"')"
printf '#!/bin/sh\n. /etc/default/grub\nfor x in /etc/default/grub.d/*.cfg; do . "$x"; done\nprintf %%s "$GRUB_DISTRIBUTOR"\n' > "$R/tmp/grub-mkconfig"
gm="$(chroot "$R" sh /tmp/grub-mkconfig)"; rm -f "$R/tmp/grub-mkconfig"
[ "$gi" = "Ubuntu" ] && ok "grub-install sees GRUB_DISTRIBUTOR=Ubuntu (EFI dir ubuntu)" || bad "grub-install sees '$gi'"
[ "$gm" = "Wild & Wired OS" ] && ok "grub-mkconfig sees '$gm'" || bad "grub-mkconfig sees '$gm'"
ird="$(ls -1 "$R"/boot/initrd.img-* | sort -V | tail -1)"
chroot "$R" lsinitramfs "${ird#$R}" | grep -q 'plymouth/themes/wildwired/' && ok "initrd carries wildwired splash" || bad "initrd splash not ours"
echo "== shell checks (Phase 5 step 3, direction 1A) =="
[ -s "$R/usr/share/color-schemes/WildWired.colors" ] && ok "WildWired colour scheme installed" || bad "colour scheme missing"
grep -q '^ColorScheme=WildWired' "$R/usr/share/plasma/look-and-feel/org.wildwired.desktop/contents/defaults" \
  && ok "look-and-feel selects WildWired colours" || bad "look-and-feel colour scheme not WildWired"
[ -s "$R/usr/share/plasma/desktoptheme/wildwired/widgets/panel-background.svg" ] && ok "1A panel background" || bad "panel SVG missing"
[ -s "$R/usr/share/plasma/desktoptheme/wildwired/translucent/dialogs/background.svgz" ] && ok "opaque popups" || bad "popup SVG missing"
for fam in "Archivo" "Source Sans 3" "JetBrains Mono"; do
  chroot "$R" fc-list ":family=$fam" family | grep -q . && ok "font visible: $fam" || bad "font missing: $fam"
done
chroot "$R" fc-list | grep -qi -E 'rebel|circuit' && bad "brand face installed system-wide" || ok "brand faces not system fonts"
grep -q 'wobblywindowsEnabled=false' "$R/etc/xdg/kwinrc" && ok "wobbly windows off" || bad "wobbly windows still on"
grep -q 'panel.height = 48' "$R/usr/share/plasma/look-and-feel/org.wildwired.desktop/contents/layouts/org.kde.plasma.desktop-layout.js" \
  && ok "1A panel layout" || bad "panel layout not 1A"
grep -q '^Prepend=kubuntu-calamares.desktop' "$R/etc/xdg/kicker-extra-favoritesrc" && ok "menu favourites" || bad "menu favourites not ours"
cmp -s "$R/etc/skel/.face" "$R/usr/share/wildwired/face.png" && ok "default user picture is ours" || bad "skel .face not ours"
[ -e "$R/usr/share/plasma/avatars/kubuntu-bug.png" ] && bad "Kubuntu avatar in picker" || ok "no Kubuntu avatar"
grep -q '—' "$R/usr/share/applications/kubuntu-calamares.desktop" && bad "installer launcher text has an em dash" || ok "installer launcher copy clean"
echo "== login and boot menu checks (Phase 5 step 4) =="
grep -q '^Current=wildwired' "$R/etc/sddm.conf.d/30-wildwired.conf" && ok "SDDM uses the wildwired theme" || bad "SDDM theme not wildwired"
for f in Main.qml metadata.desktop theme.conf; do
  [ -s "$R/usr/share/sddm/themes/wildwired/$f" ] && ok "SDDM theme file: $f" || bad "SDDM theme missing $f"
done
[ -s "$R/usr/share/wildwired/login-lockup.png" ] && ok "login lockup art" || bad "login lockup missing"
ls "$R"/usr/share/wildwired/grub/*.pf2 >/dev/null 2>&1 && ok "GRUB PF2 fonts built" || bad "GRUB PF2 fonts missing"
ls "$R"/etc/update-motd.d/10-help-text "$R"/etc/update-motd.d/50-motd-news >/dev/null 2>&1   && bad "Ubuntu console login messages still present" || ok "console login messages clean"
grep -qi ubuntu "$R/etc/legal" && grep -q "Wild & Wired" "$R/etc/legal" && ok "legal notice is ours" || bad "legal notice not ours"
echo "== Welcome and Field Guide checks (Phase 6) =="
[ -s "$R/usr/share/wildwired/fieldguide.html" ] && ok "Field Guide built" || bad "Field Guide missing"
grep -q '^Exec=xdg-open /usr/share/wildwired/fieldguide.html' "$R/usr/share/applications/wildwired-fieldguide.desktop" && ok "Field Guide launcher" || bad "Field Guide launcher missing"
[ -x "$R/etc/skel/Desktop/wildwired-fieldguide.desktop" ] && ok "Field Guide desktop icon (trusted)" || bad "Field Guide desktop icon missing or not executable"
for f in 10-wildwired.qml 20-oneclick.qml; do
  [ -s "$R/usr/share/plasma/plasma-welcome/extra-pages/$f" ] && ok "Welcome page: $f" || bad "Welcome page missing: $f"
done
n=$(grep -c 'appstream' "$R/usr/share/plasma/plasma-welcome/extra-pages/20-oneclick.qml" 2>/dev/null || true)
m=$(grep -c '^oneclick' "$REPO_ROOT/manifests/flatpaks.txt")
[ "$(grep -o 'id: "' "$R/usr/share/plasma/plasma-welcome/extra-pages/20-oneclick.qml" | wc -l)" = "$m" ] && ok "1-click page lists all $m manifest apps" || bad "1-click page does not match manifest"
[ -s "$R/usr/share/plasma/plasma-welcome/intro-customization.desktop" ] && ok "Welcome intro customised" || bad "Welcome intro missing"
echo "== general =="
[ -s "$R/etc/machine-id" ] && bad "machine-id not empty" || ok "machine-id empty"
ls "$R"/etc/ssh/ssh_host_* >/dev/null 2>&1 && bad "ssh host keys present" || ok "no ssh host keys"
echo
[ "$fail" -eq 0 ] && echo "RESULT: all checks passed" || { echo "RESULT: FAILURES above"; exit 1; }
