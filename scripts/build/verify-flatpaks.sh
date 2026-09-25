#!/usr/bin/env bash
# Verify every app id in manifests/flatpaks.txt against live Flathub and
# report download/installed sizes plus each app's runtime. Runs on any box
# with network (the build CT). Installs nothing. One command, one report:
# docs/FLATPAK-VERIFY.txt.
set -euo pipefail
source "$(dirname "$0")/env.sh"

OUT="$REPO_ROOT/docs/FLATPAK-VERIFY.txt"
command -v flatpak >/dev/null || die "flatpak not installed on this host (apt-get install -y flatpak)."
flatpak remote-add --if-not-exists --system flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# flatpak's field names vary by version: "Download size:" vs "Download:".
info_field() {
  local v
  v="$(grep -m1 -E "^ *$2( size)?:" <<<"$1" | sed -E "s/^ *$2( size)?: *//" || true)"
  printf '%s' "$v"
}

{
  echo "# Flatpak verification against live Flathub"
  echo "# Generated $(date -u +%Y-%m-%dT%H:%M:%SZ) by verify-flatpaks.sh"
  echo
  printf '%-11s %-42s %-10s %-10s %s\n' MODE APP DOWNLOAD INSTALLED RUNTIME
  declare -A runtimes=()
  fail=0
  while read -r mode app _rest; do
    case "$mode" in ''|'#'*) continue;; esac
    if ! out="$(flatpak remote-info --system flathub "$app" 2>/dev/null)"; then
      printf '%-11s %-42s %s\n' "$mode" "$app" "MISSING ON FLATHUB: fix or drop"
      fail=1; continue
    fi
    dl=$(info_field "$out" "Download")
    inst=$(info_field "$out" "Installed")
    rt=$(info_field "$out" "Runtime")
    printf '%-11s %-42s %-10s %-10s %s\n' "$mode" "$app" "${dl:-?}" "${inst:-?}" "${rt:-?}"
    [ -n "$rt" ] && runtimes["$rt"]=1
  done < "$REPO_ROOT/manifests/flatpaks.txt"
  echo
  echo "== RUNTIMES the apps above pull in =="
  printf '%-52s %-10s %-10s\n' RUNTIME DOWNLOAD INSTALLED
  for rt in "${!runtimes[@]}"; do
    if out="$(flatpak remote-info --system flathub "runtime/$rt" 2>/dev/null)"; then
      printf '%-52s %-10s %-10s\n' "$rt" \
        "$(info_field "$out" "Download")" "$(info_field "$out" "Installed")"
    else
      printf '%-52s %s\n' "$rt" "unresolvable"
    fi
  done
  [ "$fail" -eq 0 ] && echo && echo "RESULT: all app ids verified." \
    || { echo; echo "RESULT: MISSING ids above."; }
} | tee "$OUT"
