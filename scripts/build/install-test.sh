#!/usr/bin/env bash
# Start a QEMU guest with a blank virtual disk, for a real install test.
# Drive it with qemu-ctl.py; the run directory is printed at the end.
#
#   install-test.sh start <iso> [--net] [--disk-gb 40] [--ram 4096] [--mode uefi-sb|bios]
#   install-test.sh reboot-disk          restart from the installed disk, no ISO
#   install-test.sh stop
#
# The disk and firmware variables persist across restarts, exactly as on a
# real laptop: `reboot-disk` proves the installed system boots by itself,
# through the boot entry the installer wrote, under Secure Boot. Starts
# with no network by default, because the Field Guide says installing
# works offline.
set -euo pipefail
source "$(dirname "$0")/env.sh"

RUN="$WORK_DIR/install-test"
QMP="$RUN/qmp.sock"

launch() {   # launch <mode> <ram> <netargs> [iso]
  local mode="$1" ram="$2" net="$3" iso="${4:-}" fw=() media=() kvm=()
  [ -e /dev/kvm ] && kvm=(-enable-kvm -cpu host)
  case "$mode" in
    uefi-sb)
      fw=(-machine q35,smm=on -global driver=cfi.pflash01,property=secure,value=on
          -drive if=pflash,format=raw,readonly=on,file=/usr/share/OVMF/OVMF_CODE_4M.ms.fd
          -drive if=pflash,format=raw,file="$RUN/vars.fd");;
    bios) fw=(-machine q35);;
    *) die "Unknown mode: $mode";;
  esac
  [ -n "$iso" ] && media=(-drive file="$iso",media=cdrom,readonly=on,if=none,id=cd0
                          -device ide-cd,drive=cd0,bootindex=1)
  # shellcheck disable=SC2086
  qemu-system-x86_64 "${fw[@]}" "${kvm[@]}" -m "$ram" -smp 4 -vga virtio -display none \
    -drive file="$RUN/disk.qcow2",format=qcow2,if=none,id=hd0 \
    -device virtio-blk-pci,drive=hd0,bootindex=2 \
    "${media[@]}" $net \
    -device qemu-xhci -device usb-tablet \
    -serial "file:$RUN/serial.log" \
    -qmp "unix:$QMP,server,nowait" -pidfile "$RUN/qemu.pid" -daemonize
  printf '%s\n%s\n%s\n' "$mode" "$ram" "$net" > "$RUN/config"
}

stop_guest() {
  [ -f "$RUN/qemu.pid" ] && kill "$(cat "$RUN/qemu.pid")" 2>/dev/null || true
  sleep 2; rm -f "$RUN/qemu.pid" "$QMP"
}

case "${1:-}" in
  start)
    ISO="${2:?iso path}"; shift 2
    NET="-nic none"; GB=40; RAM=4096; MODE=uefi-sb
    while [ $# -gt 0 ]; do
      case "$1" in
        --net) NET="-nic user,model=virtio-net-pci"; shift;;
        --disk-gb) GB="$2"; shift 2;;
        --ram) RAM="$2"; shift 2;;
        --mode) MODE="$2"; shift 2;;
        *) die "Unknown flag: $1";;
      esac
    done
    stop_guest
    rm -rf "$RUN"; mkdir -p "$RUN"
    qemu-img create -q -f qcow2 "$RUN/disk.qcow2" "${GB}G"
    [ "$MODE" = uefi-sb ] && cp /usr/share/OVMF/OVMF_VARS_4M.ms.fd "$RUN/vars.fd"
    launch "$MODE" "$RAM" "$NET" "$ISO"
    echo "started: $RUN";;
  reboot-disk)
    stop_guest
    mapfile -t CFG < "$RUN/config"
    launch "${CFG[0]}" "${CFG[1]}" "${CFG[2]}"
    echo "restarted from disk: $RUN";;
  stop) stop_guest; echo stopped;;
  *) sed -n '2,13p' "$0"; exit 2;;
esac
