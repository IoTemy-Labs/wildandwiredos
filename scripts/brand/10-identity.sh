#!/bin/bash
# Runs INSIDE the chroot during the `assets` stage, after payload/ and
# install-art.py have placed files. Replaces Kubuntu/Ubuntu identity in
# every user-visible place that belongs to a package.
#
# Package-owned files are replaced through dpkg-divert, so an apt upgrade
# on an installed system writes the vendor copy to *.distrib (or to
# /usr/share/wildwired/diverted/) instead of overwriting ours.
# Idempotent: safe on a rootfs that already went through this script.
#
# Compatibility decision (DECISIONS.md 2026-09-25): ID, VERSION_ID and the
# codenames stay Ubuntu's so PPAs, ubuntu-drivers and apt tooling keep
# working. Only display names change.
set -euo pipefail
: "${DISTRO_NAME:?}" "${DISTRO_VERSION:?}" "${DISTRO_BUILD:?}" "${DISTRO_CODENAME:?}"

is_diverted() { dpkg-divert --list "$1" | grep -q .; }

# Divert, then start from a fresh copy of the vendor file (edit in place).
divert_edit() {
  local p="$1"
  is_diverted "$p" || dpkg-divert --quiet --local --rename --divert "$p.distrib" --add "$p"
  cp -a "$p.distrib" "$p"
}
# Divert; the caller writes entirely new content.
divert_replace() {
  local p="$1"
  is_diverted "$p" || dpkg-divert --quiet --local --rename --divert "$p.distrib" --add "$p"
}
# Divert out of the way entirely, for files whose mere presence matters
# (session files, skel links, menu entries).
divert_away() {
  local p="$1" dest="/usr/share/wildwired/diverted$1"
  is_diverted "$p" && return 0
  [ -e "$p" ] || return 0
  mkdir -p "$(dirname "$dest")"
  dpkg-divert --quiet --local --rename --divert "$dest" --add "$p"
}

# --- OS identity -----------------------------------------------------------
divert_replace /usr/lib/os-release
cat > /usr/lib/os-release <<EOF
PRETTY_NAME="$DISTRO_NAME $DISTRO_VERSION"
NAME="$DISTRO_NAME"
VERSION_ID="26.04"
VERSION="$DISTRO_VERSION ($DISTRO_CODENAME)"
VERSION_CODENAME=resolute
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://wildandwiredwv.com/"
SUPPORT_URL="https://wildandwiredwv.com/"
BUG_REPORT_URL="https://wildandwiredwv.com/"
UBUNTU_CODENAME=resolute
LOGO=wildwired-logo
IMAGE_ID=wildwired-os
IMAGE_VERSION=$DISTRO_VERSION-b$DISTRO_BUILD
EOF

divert_replace /etc/lsb-release
cat > /etc/lsb-release <<EOF
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=26.04
DISTRIB_CODENAME=resolute
DISTRIB_DESCRIPTION="$DISTRO_NAME $DISTRO_VERSION"
EOF

divert_replace /etc/issue
printf '%s %s \\n \\l\n\n' "$DISTRO_NAME" "$DISTRO_VERSION" > /etc/issue
divert_replace /etc/issue.net
printf '%s %s\n' "$DISTRO_NAME" "$DISTRO_VERSION" > /etc/issue.net

# Text console login (tty, ssh): no Ubuntu help links, Canonical news feed,
# or Ubuntu Pro adverts. 00-header already prints our lsb description.
for f in /etc/update-motd.d/10-help-text /etc/update-motd.d/50-motd-news \
         /etc/update-motd.d/91-contract-ua-esm-status; do
  divert_away "$f"
done
divert_replace /etc/legal
cat > /etc/legal <<EOF

$DISTRO_NAME is built from Ubuntu 26.04 LTS. The programs included are
free software; the exact distribution terms for each program are
described in the individual files in /usr/share/doc/*/copyright.

$DISTRO_NAME comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

EOF

# KDE "About this System".
divert_replace /etc/xdg/kcm-about-distrorc
cat > /etc/xdg/kcm-about-distrorc <<EOF
[General]
LogoPath=/usr/share/wildwired/logo-plated-256.png
Name=$DISTRO_NAME
UseOSReleaseVersion=false
Version=$DISTRO_VERSION "$DISTRO_CODENAME" (build $DISTRO_BUILD), based on Ubuntu 26.04 LTS
Website=https://wildandwiredwv.com/
EOF

# --- Live session (casper) ------------------------------------------------
# Read by the casper initramfs hook; takes effect when 90-initramfs.sh
# regenerates the initrd.
divert_replace /etc/casper.conf
cat > /etc/casper.conf <<'EOF'
# Wild & Wired OS live session. Diverted from casper's default.
export USERNAME="live"
export USERFULLNAME="Live user"
export HOST="wildwired"
export BUILD_SYSTEM="Ubuntu"
# Non-empty FLAVOUR stops casper from renaming the user and host after the
# first word of .disk/info ("Wild & Wired OS ..." would give wild@wild).
export FLAVOUR="wildwired"
EOF

# Skip Kubuntu's compiled "Try or Install Kubuntu" prompt. casper's
# 15autologin falls back to plasma.desktop when this session is absent,
# and 25adduser already puts the (renamed) installer on the live desktop.
divert_away /usr/share/wayland-sessions/kubuntu-live-environment.desktop

# Kubuntu web links on every new user's desktop and in the menu.
for f in /etc/skel/Desktop/org.kubuntu.web.home.desktop \
         /etc/skel/Desktop/org.kfocus.web.howtos.desktop \
         /usr/share/applications/org.kubuntu.web.home.desktop \
         /usr/share/applications/org.kfocus.web.howtos.desktop; do
  divert_away "$f"
done

# --- Default browser: Kubuntu points at the snap id we purged. No default
# mail handler ships: Thunderbird is a 1-click app and claims mailto itself
# once installed (DECISIONS.md 2026-10-30). ------------------------------
K=/usr/share/kubuntu-default-settings/kf5-settings
for f in "$K/kdeglobals" "$K/mimeapps.list"; do
  divert_edit "$f"
  sed -i -e 's/firefox_firefox\.desktop/org.mozilla.firefox.desktop/g' \
         -e '/^x-scheme-handler\/mailto=/d' "$f"
done

# --- GRUB on installed systems ---------------------------------------------
# grub-install names the EFI folder after the first word of GRUB_DISTRIBUTOR,
# so "Wild & Wired OS" would create /EFI/wild beside the installer's
# /EFI/ubuntu. Keep the plain value here; Calamares only preserves a simple
# GRUB_DISTRIBUTOR= line. Menus get our name from the drop-in
# /etc/default/grub.d/99-wildwired.cfg, which only grub-mkconfig acts on.
sed -i 's/^GRUB_DISTRIBUTOR=.*/GRUB_DISTRIBUTOR=Ubuntu/' /etc/default/grub

# --- Installer (Calamares) --------------------------------------------------
divert_edit /etc/calamares/settings.conf
sed -i 's/^branding:.*/branding: wildwired/' /etc/calamares/settings.conf

# Keep GRUB_DISTRIBUTOR=Ubuntu; Calamares would otherwise overwrite it with
# bootloaderEntryName. This build reads keep_distributor, not the upstream
# keepDistributor spelling.
G=/etc/calamares/modules/grubcfg.conf
divert_edit "$G"
sed -i '/^keepDistributor:/d; /^keep_distributor:/d' "$G"
printf 'keep_distributor: true\n' >> "$G"

W=/etc/calamares/modules/welcome.conf
divert_edit "$W"
sed -i -e 's|^showDonateUrl:.*|showDonateUrl: false|' \
       -e 's|^showKnownIssuesUrl:.*|showKnownIssuesUrl: false|' \
       -e 's|^showReleaseNotesUrl:.*|showReleaseNotesUrl: false|' \
       -e 's|^showSupportUrl:.*|showSupportUrl: false|' "$W"

# The new partition's label is visible in the installer and in file managers.
P=/etc/calamares/modules/partition.conf
divert_edit "$P"
sed -i -e 's/kubuntu_boot/wildwired_boot/' -e 's/kubuntu_2604/wildwired_2611/' "$P"

# Edited in place, not diverted: Calamares removes itself from the installed
# system, and dpkg would leave a diverted launcher behind as a dead menu entry.
D=/usr/share/applications/kubuntu-calamares.desktop
sed -i -e '/^\(Name\|GenericName\|Comment\|Keywords\)\[/d' \
       -e "s/^Name=.*/Name=Install ${DISTRO_NAME//&/\\&}/" \
       -e "s/Kubuntu [0-9.]*/${DISTRO_NAME//&/\\&}/g; s/Kubuntu/${DISTRO_NAME//&/\\&}/g" \
       -e "s/^GenericName=.*/GenericName=System installer/" \
       -e "s/^Comment=.*/Comment=Copy ${DISTRO_NAME//&/\\&} onto this computer's disk/" "$D"

# OEM mode was dropped, and this link tool restores Kubuntu's web links.
divert_away /usr/share/applications/calamares-launch-oem.desktop
divert_away /usr/share/applications/org.kubuntu.restore-desktop-links.desktop

# --- Boot splash --------------------------------------------------------------
T=/usr/share/plymouth/themes
update-alternatives --quiet --install "$T/default.plymouth" default.plymouth "$T/wildwired/wildwired.plymouth" 200
update-alternatives --quiet --set default.plymouth "$T/wildwired/wildwired.plymouth"
update-alternatives --quiet --install "$T/text.plymouth" text.plymouth "$T/wildwired-text/wildwired-text.plymouth" 200
update-alternatives --quiet --set text.plymouth "$T/wildwired-text/wildwired-text.plymouth"

# Icon cache for the wildwired-logo icon (kickoff button, os-release LOGO).
gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor || true

echo "brand: identity applied ($DISTRO_NAME $DISTRO_VERSION)"
