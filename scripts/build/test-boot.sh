#!/usr/bin/env bash
# Boot an ISO in QEMU and capture evidence.
#
#   test-boot.sh <iso> --mode uefi-sb|uefi|bios [--timeout 300] [--ram 4096]
#                [--keys "90=alt+f4,110=meta_l"]   (see qemu-watch.py)
#
# Headless: serial goes to <run>/serial.log, and a screenshot is taken via
# QMP every 20 s into <run>/shot-*.png (plus a final one), so a human (or a
# later smoke-test parser) can see exactly what the machine showed. Secure
# Boot mode uses the OVMF .ms firmware (Microsoft keys enrolled) with SMM,
# which refuses unsigned boot chains — booting past shim to GRUB under
# uefi-sb IS the Secure Boot pass.
set -euo pipefail
source "$(dirname "$0")/env.sh"

ISO="${1:?usage: test-boot.sh <iso> --mode uefi-sb|uefi|bios}"; shift
MODE="uefi-sb"; TIMEOUT=300; RAM=4096; KEYS=""
while [ $# -gt 0 ]; do
  case "$1" in
    --mode) MODE="$2"; shift 2;;
    --timeout) TIMEOUT="$2"; shift 2;;
    --ram) RAM="$2"; shift 2;;
    --keys) KEYS="$2"; shift 2;;
    *) die "Unknown flag: $1";;
  esac
done
[ -f "$ISO" ] || die "No such ISO: $ISO"

RUN="$WORK_DIR/boot-test/$MODE"
rm -rf "$RUN"; mkdir -p "$RUN"
QMP_SOCK="$RUN/qmp.sock"

KVM_ARGS=()
[ -e /dev/kvm ] && KVM_ARGS=(-enable-kvm -cpu host) || log "WARNING: no /dev/kvm — unaccelerated"

FW_ARGS=()
case "$MODE" in
  uefi-sb)
    cp /usr/share/OVMF/OVMF_VARS_4M.ms.fd "$RUN/vars.fd"
    FW_ARGS=(-machine q35,smm=on -global driver=cfi.pflash01,property=secure,value=on
             -drive if=pflash,format=raw,readonly=on,file=/usr/share/OVMF/OVMF_CODE_4M.ms.fd
             -drive if=pflash,format=raw,file="$RUN/vars.fd");;
  uefi)
    cp /usr/share/OVMF/OVMF_VARS_4M.fd "$RUN/vars.fd"
    FW_ARGS=(-machine q35
             -drive if=pflash,format=raw,readonly=on,file=/usr/share/OVMF/OVMF_CODE_4M.fd
             -drive if=pflash,format=raw,file="$RUN/vars.fd");;
  bios)
    FW_ARGS=(-machine q35);;
  *) die "Unknown mode: $MODE";;
esac

log "boot-test($MODE): launching QEMU for $(basename "$ISO"), timeout ${TIMEOUT}s"
qemu-system-x86_64 \
  "${FW_ARGS[@]}" "${KVM_ARGS[@]}" \
  -m "$RAM" -smp 4 \
  -vga virtio -display none \
  -cdrom "$ISO" -boot d \
  -serial "file:$RUN/serial.log" \
  -qmp "unix:$QMP_SOCK,server,nowait" \
  -pidfile "$RUN/qemu.pid" -daemonize

RC=0
python3 "$(dirname "$0")/qemu-watch.py" "$QMP_SOCK" "$RUN" "$TIMEOUT" "$KEYS" || RC=$?

kill "$(cat "$RUN/qemu.pid")" 2>/dev/null || true
log "boot-test($MODE): artifacts in $RUN"
ls -la "$RUN" | tee -a "$LOG_FILE"
exit "$RC"
