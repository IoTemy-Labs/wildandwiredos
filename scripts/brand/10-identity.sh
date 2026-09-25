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

# --- Default browser and mail: Kubuntu points at snap ids we purged. ------
K=/usr/share/kubuntu-default-settings/kf5-settings
for f in "$K/kdeglobals" "$K/mimeapps.list"; do
  divert_edit "$f"
  sed -i -e 's/firefox_firefox\.desktop/org.mozilla.firefox.desktop/g' \
         -e 's/thunderbird_thunderbird\.desktop/org.mozilla.Thunderbird.desktop/g' "$f"
done

# --- GRUB on installed systems ---------------------------------------------
# grub-install derives the EFI directory from the first word of
# GRUB_DISTRIBUTOR ("Wild ..." would give /EFI/wild), but Ubuntu's signed
# GRUB only boots from /EFI/ubuntu. grub-install reads this file through
# `sh -c` ($0 = sh); grub-mkconfig sources it from its own script. So menus
# show our name while every grub-install keeps /EFI/ubuntu.
if ! grep -q 'wildwired-efi-id' /etc/default/grub; then
  cp /etc/default/grub /etc/default/grub.wwwv
  awk '
    /^GRUB_DISTRIBUTOR=/ {
      print "# wildwired-efi-id: menus show the OS name; grub-install keeps /EFI/ubuntu."
      print "case \"$0\" in *grub-mkconfig*) GRUB_DISTRIBUTOR=\"$( . /etc/os-release && echo \"$NAME\" )\" ;; *) GRUB_DISTRIBUTOR=Ubuntu ;; esac"
      next
    }
    { print }' /etc/default/grub.wwwv > /etc/default/grub
  rm /etc/default/grub.wwwv
fi

# --- Installer (Calamares) --------------------------------------------------
divert_edit /etc/calamares/settings.conf
sed -i 's/^branding:.*/branding: wildwired/' /etc/calamares/settings.conf

# Keep our GRUB_DISTRIBUTOR logic; Calamares would otherwise overwrite it
# with bootloaderEntryName.
G=/etc/calamares/modules/grubcfg.conf
divert_edit "$G"
if grep -q '^keepDistributor:' "$G"; then
  sed -i 's/^keepDistributor:.*/keepDistributor: true/' "$G"
else
  printf 'keepDistributor: true\n' >> "$G"
fi

W=/etc/calamares/modules/welcome.conf
divert_edit "$W"
sed -i -e 's|^showDonateUrl:.*|showDonateUrl: false|' \
       -e 's|^showKnownIssuesUrl:.*|showKnownIssuesUrl: false|' \
       -e 's|^showReleaseNotesUrl:.*|showReleaseNotesUrl: false|' "$W"

D=/usr/share/applications/kubuntu-calamares.desktop
divert_edit "$D"
sed -i -e '/^\(Name\|GenericName\|Comment\|Keywords\)\[/d' \
       -e "s/^Name=.*/Name=Install ${DISTRO_NAME//&/\\&}/" \
       -e "s/Kubuntu [0-9.]*/${DISTRO_NAME//&/\\&}/g; s/Kubuntu/${DISTRO_NAME//&/\\&}/g" "$D"

# --- Boot splash --------------------------------------------------------------
T=/usr/share/plymouth/themes
update-alternatives --quiet --install "$T/default.plymouth" default.plymouth "$T/wildwired/wildwired.plymouth" 200
update-alternatives --quiet --set default.plymouth "$T/wildwired/wildwired.plymouth"
update-alternatives --quiet --install "$T/text.plymouth" text.plymouth "$T/wildwired-text/wildwired-text.plymouth" 200
update-alternatives --quiet --set text.plymouth "$T/wildwired-text/wildwired-text.plymouth"

# Icon cache for the wildwired-logo icon (kickoff button, os-release LOGO).
gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor || true

echo "brand: identity applied ($DISTRO_NAME $DISTRO_VERSION)"
