#!/usr/bin/env bash
# Fetch the Kubuntu 26.04 LTS base ISO, verify SHA256 against the published
# SHA256SUMS, verify the GPG signature on SHA256SUMS against the pinned
# Ubuntu CD image signing key, and record the result. Idempotent: a cached
# ISO with a valid verification stamp is not re-downloaded or re-verified.
set -euo pipefail
source "$(dirname "$0")/env.sh"

STAMP="$CACHE_DIR/$BASE_ISO_NAME.verified"

if [ -f "$STAMP" ] && [ -f "$BASE_ISO" ]; then
  log "Base ISO already verified: $(cat "$STAMP")"
  exit 0
fi

log "Fetching checksums and signature from $BASE_URL"
wget -q -O "$CACHE_DIR/SHA256SUMS"     "$BASE_URL/SHA256SUMS"
wget -q -O "$CACHE_DIR/SHA256SUMS.gpg" "$BASE_URL/SHA256SUMS.gpg"

# --- GPG: pinned-fingerprint verification in a throwaway keyring ---
GNUPGHOME="$(mktemp -d)"; export GNUPGHOME
trap 'rm -rf "$GNUPGHOME"' EXIT
log "Importing Ubuntu CD image signing key $UBUNTU_SIGNING_KEY_FPR"
gpg --batch --keyserver hkps://keyserver.ubuntu.com \
    --recv-keys "$UBUNTU_SIGNING_KEY_FPR" \
  || die "Could not fetch signing key from keyserver.ubuntu.com"

status="$(gpg --batch --status-fd 1 \
  --verify "$CACHE_DIR/SHA256SUMS.gpg" "$CACHE_DIR/SHA256SUMS" 2>/dev/null || true)"
if ! grep -q "VALIDSIG $UBUNTU_SIGNING_KEY_FPR" <<<"$status"; then
  echo "$status" >&2
  die "SHA256SUMS signature did NOT validate against pinned key $UBUNTU_SIGNING_KEY_FPR.
If VALIDSIG above shows a different fingerprint, Ubuntu may have rotated the
CD image signing key: confirm the new fingerprint out-of-band, update
UBUNTU_SIGNING_KEY_FPR in env.sh, and record it in docs/DECISIONS.md."
fi
log "GPG signature on SHA256SUMS is valid (key $UBUNTU_SIGNING_KEY_FPR)"

# --- Download (resumable) ---
if [ ! -f "$BASE_ISO" ] || ! (cd "$CACHE_DIR" && grep "\*$BASE_ISO_NAME\$" SHA256SUMS | sha256sum -c --status); then
  log "Downloading $BASE_ISO_NAME (~4.7 GB, resumable)"
  wget -c -O "$BASE_ISO" "$BASE_URL/$BASE_ISO_NAME"
fi

log "Verifying SHA256"
(cd "$CACHE_DIR" && grep "\*$BASE_ISO_NAME\$" SHA256SUMS | sha256sum -c -) \
  || die "SHA256 mismatch on $BASE_ISO_NAME — delete it from $CACHE_DIR and re-run."

sha="$(grep "\*$BASE_ISO_NAME\$" "$CACHE_DIR/SHA256SUMS" | cut -d' ' -f1)"
printf '%s sha256=%s gpg=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$sha" "$UBUNTU_SIGNING_KEY_FPR" > "$STAMP"
log "Base ISO verified and cached: $BASE_ISO"
log "Recorded: $(cat "$STAMP")"
