#!/usr/bin/env bash
# Capture the exact xorriso arguments that reproduce the base ISO's boot
# setup (El Torito BIOS boot, EFI boot partition, isohybrid MBR/GPT layout).
# Everything the Phase 1 `iso` stage does depends on this report.
# Output: docs/BOOT-ARGS.md in the repo.
set -euo pipefail
source "$(dirname "$0")/env.sh"

[ -f "$BASE_ISO" ] || die "Base ISO missing — run 00-fetch-base.sh first."

OUT_MD="$REPO_ROOT/docs/BOOT-ARGS.md"
report="$(xorriso -indev "$BASE_ISO" -report_el_torito as_mkisofs 2>/dev/null)"
[ -n "$report" ] || die "xorriso produced no El Torito report."

{
  echo "# Boot arguments captured from the base ISO"
  echo
  echo "Source: \`$BASE_ISO_NAME\` (sha256-verified, see cache stamp)."
  echo "Captured: $(date -u +%Y-%m-%dT%H:%M:%SZ) by 02-capture-boot-args.sh."
  echo
  echo "These are the \`xorriso -as mkisofs\` arguments that reproduce the"
  echo "original boot setup byte-for-byte, including the signed EFI payload"
  echo "path and the isohybrid system area. The Phase 1 \`iso\` stage MUST"
  echo "use these verbatim, changing only \`-V\` (volume label) and the"
  echo "output path. Never regenerate, resign, or substitute the boot images"
  echo "themselves — that breaks Secure Boot."
  echo
  echo '```'
  echo "$report"
  echo '```'
  echo
  echo "## El Torito / system area details (informational)"
  echo
  echo '```'
  xorriso -indev "$BASE_ISO" -report_el_torito plain -report_system_area plain 2>/dev/null
  echo '```'
} > "$OUT_MD"

log "Boot args captured to docs/BOOT-ARGS.md"
grep -E -- '-V |--interval|efi|append_partition|grub2_mbr' "$OUT_MD" | head -20 || true
