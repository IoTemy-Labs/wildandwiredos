#!/usr/bin/env bash
# One-command verification list (session rule 7): every fact the plan
# depends on that was asserted rather than independently confirmed gets
# checked here against the real base image. Run after 03-size-report.sh
# (needs the extracted dpkg status db). Add entries as phases add claims.
set -euo pipefail
source "$(dirname "$0")/env.sh"

STATUS="$WORK_DIR/base-dpkg/var/lib/dpkg/status"
[ -f "$STATUS" ] || die "dpkg status not extracted — run 03-size-report.sh first."

ver() { # ver <package> — print installed version or MISSING
  awk -v p="$1" '$0=="Package: "p{f=1} f&&/^Version: /{print $2; exit} f&&/^$/{exit}' "$STATUS"
}

check() { # check <label> <claim> <actual>
  printf '%-34s claim: %-22s actual: %s\n' "$1" "$2" "${3:-MISSING}"
}

echo "== VERIFY list vs. real base image =="
check "Plasma (plasma-desktop)"   "6.6.x"        "$(ver plasma-desktop)"
check "KDE Frameworks (kf6 base)" "6.24"         "$(ver libkf6coreaddons6 || true)"
check "Qt (libqt6core6t64)"       "6.10.x"       "$(ver libqt6core6t64 || true)"
check "Kernel (linux-generic)"    "7.0 series"   "$(ver linux-generic)"
check "sudo-rs default provider"  "sudo-rs"      "$(ver sudo-rs)"
check "classic sudo present?"     "(informational)" "$(ver sudo)"
check "snapd present"             "present"      "$(ver snapd)"
check "Firefox as snap (deb absent)" "snap"      "$(ver firefox)"
check "casper (live boot)"        "present"      "$(ver casper)"
echo
echo "Signing-key pin: $UBUNTU_SIGNING_KEY_FPR"
if [ -f "$CACHE_DIR/$BASE_ISO_NAME.verified" ]; then
  echo "  CONFIRMED by fetch: $(cat "$CACHE_DIR/$BASE_ISO_NAME.verified")"
else
  echo "  VERIFY — no successful fetch verification recorded yet"
fi
echo
echo "Anything above where actual is MISSING or contradicts the claim goes"
echo "to docs/DECISIONS.md before the dependent phase starts."
