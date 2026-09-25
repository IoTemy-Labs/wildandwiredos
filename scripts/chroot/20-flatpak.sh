#!/bin/bash
# Runs INSIDE the chroot. Flatpak plumbing for Option B: flatpak itself,
# the Discover backend, Flathub system-wide, and the preinstalled apps
# from manifests/flatpaks.txt. System installs use ostree directly, so no
# session bus is needed. Phase 4 extends this (first-boot repair hook,
# AppImage support, update coherence).
set -euo pipefail
M=/tmp/wwwv-chroot/manifests

apt-get install -y flatpak plasma-discover-backend-flatpak

flatpak remote-add --if-not-exists --system flathub \
  https://dl.flathub.org/repo/flathub.flatpakrepo

mapfile -t PRE < <(awk '$1=="preinstall" {print $2}' "$M/flatpaks.txt")
for app in "${PRE[@]}"; do
  flatpak install --system --noninteractive flathub "$app"
done

# Flatpak's post-install triggers run under bwrap, which cannot set mount
# propagation inside a chroot ("Failed to make / slave"). Run the same
# cache updates directly so menus, mime lookups, and icons work on first
# boot without waiting for a later trigger.
E=/var/lib/flatpak/exports/share
[ -d "$E/applications" ] && update-desktop-database "$E/applications" || true
[ -d "$E/mime" ] && update-mime-database "$E/mime" || true
if [ -d "$E/icons/hicolor" ] && command -v gtk-update-icon-cache >/dev/null; then
  gtk-update-icon-cache -f -t "$E/icons/hicolor" || true
fi

# Preseed Flathub's appstream catalog so Discover can browse Flathub with
# no network (venue Wi-Fi is assumed saturated).
flatpak update --system --appstream --noninteractive flathub || true

flatpak list --system

# --- First-boot repair hook: if the Flathub remote is ever missing (a
# failed install, a manual removal), re-add it. No session bus needed.
install -d /usr/local/sbin /var/lib/wildwired
cat > /usr/local/sbin/wildwired-firstboot <<'EOF'
#!/bin/bash
# Wild & Wired first-boot/self-repair. Safe to run every boot.
if ! flatpak remote-list --system 2>/dev/null | grep -q '^flathub'; then
  flatpak remote-add --if-not-exists --system flathub \
    https://dl.flathub.org/repo/flathub.flatpakrepo || true
fi
touch /var/lib/wildwired/firstboot-done
EOF
chmod +x /usr/local/sbin/wildwired-firstboot
cat > /usr/lib/systemd/system/wildwired-firstboot.service <<'EOF'
[Unit]
Description=Wild & Wired OS first-boot checks (Flathub remote repair)
After=local-fs.target
ConditionPathExists=!/var/lib/wildwired/firstboot-done

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/wildwired-firstboot

[Install]
WantedBy=multi-user.target
EOF
# Enable by symlink: no running systemd in here.
install -d /etc/systemd/system/multi-user.target.wants
ln -sf /usr/lib/systemd/system/wildwired-firstboot.service \
  /etc/systemd/system/multi-user.target.wants/wildwired-firstboot.service
