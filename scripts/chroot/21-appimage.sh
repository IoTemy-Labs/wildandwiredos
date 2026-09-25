#!/bin/bash
# Runs INSIDE the chroot. AppImage readiness: FUSE2 compatibility, a
# ~/Applications folder for every new user, the double-click association
# so a downloaded .AppImage offers to integrate, and the "Get Software"
# menu category grouping Discover, the AppImage manager, and the Field
# Guide. The manager itself is chosen in manifests/flatpaks.txt
# (DECISIONS.md, Phase 4).
set -euo pipefail
M=/tmp/wwwv-chroot/manifests

# Desktop id of the AppImage manager. Gear Lever = it.mijorus.gearlever.
APPIMAGE_HANDLER="${APPIMAGE_HANDLER:-it.mijorus.gearlever.desktop}"

# Most AppImages still link libfuse2; without it a double-click does nothing.
apt-get install -y libfuse2t64

# Every new user (live user included) gets ~/Applications.
install -d -m 0755 /etc/skel/Applications

# System-wide default handler: double-click -> manager offers to integrate.
install -d /etc/xdg
cat > /etc/xdg/mimeapps.list <<EOF
[Default Applications]
application/vnd.appimage=$APPIMAGE_HANDLER
application/x-iso9660-appimage=$APPIMAGE_HANDLER
EOF

# "Get Software" category in the application menu.
install -d /usr/share/desktop-directories /etc/xdg/menus/applications-merged
cat > /usr/share/desktop-directories/wildwired-get-software.directory <<'EOF'
[Desktop Entry]
Type=Directory
Name=Get Software
Comment=Install apps from Discover, integrate AppImages, read the Field Guide
Icon=system-software-install
EOF
cat > /etc/xdg/menus/applications-merged/wildwired-get-software.menu <<EOF
<!DOCTYPE Menu PUBLIC "-//freedesktop//DTD Menu 1.0//EN"
 "http://www.freedesktop.org/standards/menu-spec/1.0/menu.dtd">
<Menu>
  <Name>Applications</Name>
  <Menu>
    <Name>Get Software</Name>
    <Directory>wildwired-get-software.directory</Directory>
    <Include>
      <Filename>org.kde.discover.desktop</Filename>
      <Filename>$APPIMAGE_HANDLER</Filename>
      <Filename>wildwired-fieldguide.desktop</Filename>
    </Include>
  </Menu>
</Menu>
EOF
