#!/usr/bin/env bash
# Scripted install regression: boot the ISO under Secure Boot with no
# network, click through Calamares, reboot from the disk alone, log in, then
# simulate a GRUB package update and reboot again. Screenshots land in
# $WORK_DIR/install-test/run-*.png for a human to read.
#
#   install-test-run.sh <iso>
#
# Coordinates assume the 1280x800 QEMU screen. Disposable test account:
# name "Test Attendee", login testa, password ww-test-2611.
set -euo pipefail
source "$(dirname "$0")/env.sh"
ISO="${1:?usage: install-test-run.sh <iso>}"
RUN="$WORK_DIR/install-test"
PW=ww-test-2611
HERE="$(cd "$(dirname "$0")" && pwd)"
ctl() { python3 "$HERE/qemu-ctl.py" "$RUN/qmp.sock" "$@"; }
snap() { ctl shot "$RUN/run-$1.png"; }
click() { ctl click "$1" "$2" 1280 800; }
term() { ctl type "$1"; ctl key ret; sleep "${2:-3}"; }

bash "$HERE/install-test.sh" start "$ISO"
sleep 55; snap 01-live
click 950 112; sleep 2                        # close Welcome
click 174 45; sleep 1; ctl key ret; sleep 20  # installer icon
snap 02-welcome
click 1129 728; sleep 3; click 1129 728; sleep 3   # Location, Keyboard
click 1129 728; sleep 3; snap 03-customize         # Customize
click 1129 728; sleep 8; snap 04-partitions        # Partitions
click 206 75; sleep 5; snap 04-erase               # Erase disk
click 1129 728; sleep 4                            # Users
click 296 53; ctl type "Test Attendee"; sleep 1
click 296 260; ctl type "$PW"; click 502 260; ctl type "$PW"; sleep 1
click 1129 728; sleep 4; snap 05-summary
S=$SECONDS
click 1129 728; sleep 3; click 738 370        # Install, Install Now
sleep 75; snap 06-slideshow
# The finish page is static: stop when 2 frames 20 s apart match and the disk
# has stopped growing. The slideshow is 1 slide, so a frame alone proves nothing.
disk_bytes() { stat -c %s "$RUN/disk.qcow2"; }
LAST=0
for _ in $(seq 1 45); do
  sleep 20; snap 07-progress; NOW="$(disk_bytes)"
  if [ $((SECONDS - S)) -gt 120 ] && [ "$NOW" = "$LAST" ] && cmp -s "$RUN/run-07-progress.png" "$RUN/run-07-prev.png"; then break; fi
  LAST="$NOW"; cp "$RUN/run-07-progress.png" "$RUN/run-07-prev.png"
done
echo "install took about $((SECONDS - S)) seconds, disk $((NOW / 1048576)) MiB"; snap 08-done
# Every later step is meaningless on an empty disk, so fail here, not silently.
[ "$NOW" -gt $((4 * 1024 * 1024 * 1024)) ] || die "Nothing installed; see $RUN/run-05-summary.png"

bash "$HERE/install-test.sh" reboot-disk
sleep 50; snap 09-login
ctl type "$PW"; ctl key ret; sleep 30; snap 10-first-login
click 950 112; sleep 2; ctl key ctrl+alt+t; sleep 5; ctl key meta_l+up; sleep 2
term "clear; (. /etc/os-release; echo \"\$PRETTY_NAME :: \$ID\"); sudo ls /boot/efi/EFI" 3
ctl type "$PW"; ctl key ret; sleep 3
term "grep -n DISTRIBUTOR /etc/default/grub; flatpak list --app --columns=application | wc -l; ls /usr/share/applications | grep -c -i calamares; sudo grep -m2 '^menuentry' /boot/grub/grub.cfg | cut -c1-50; lsblk -o NAME,PARTLABEL,LABEL | grep -i -E 'vda2|kubuntu|wild'; mokutil --sb-state" 6
snap 11-checks
term "clear; sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --uefi-secure-boot 2>&1 | tail -1; sudo update-grub 2>&1 | tail -1" 25
term "sudo ls /boot/efi/EFI; sudo efibootmgr | grep -E 'BootOrder|Boot000' | cut -c1-50; sudo grep -m2 '^menuentry' /boot/grub/grub.cfg | cut -c1-50" 4
snap 12-after-grub-update

bash "$HERE/install-test.sh" reboot-disk
sleep 50; snap 13-login-after-update
bash "$HERE/install-test.sh" stop
tr -cd '[:print:]\n' < "$RUN/serial.log" | grep -a -o 'starting Boot[^ ]* .*' | cut -c1-120 || true
echo "screenshots: $RUN/run-*.png"
