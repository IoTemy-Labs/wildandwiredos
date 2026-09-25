# Build pipeline

Status: Phase 0 (recon). The staged pipeline itself (`build.sh`) is a
Phase 1 deliverable; this page records the architecture it will follow.

## Environment

- Host: dedicated Proxmox LXC (see `scripts/provision/provision-lxc.sh` —
  privileged, nesting, /dev/kvm passthrough, Ubuntu 24.04 template). WSL2
  (Ubuntu 22.04) works as a fallback. `scripts/build/01-host-deps.sh`
  verifies the toolchain either way.
- Repo: this directory. Build state: `$WWWV_WORK` (default
  `~/wildwired-build` on WSL ext4 — see DECISIONS.md).
- Every script sources `scripts/build/env.sh`.

## Phase 0 scripts (working today)

| Script | Purpose |
|---|---|
| `00-fetch-base.sh` | Download + SHA256 + GPG-verify the base ISO, cache with a verification stamp. |
| `01-host-deps.sh` | Verify host toolchain, fail loudly with the fixing apt command. |
| `02-capture-boot-args.sh` | Capture `xorriso -report_el_torito as_mkisofs` into `docs/BOOT-ARGS.md`. |
| `03-size-report.sh` | Baseline sizes + 40 largest packages into `docs/SIZE-BASELINE.md`. |
| `verify-facts.sh` | Run the VERIFY list against the real base image. |

## Phase 1 stages (planned)

`extract → unsquash → chroot → assets → clean → metadata → squash → iso →
verify`, each checkpointed, skippable, resumable (`--stage`, `--from-stage`,
`--clean`), timed, logged to `$WORK_ROOT/build.log`. The `assets` stage
re-runs standalone so late sponsor art is a repack, not a rebuild. The `iso`
stage replays `docs/BOOT-ARGS.md` verbatim (volume label and output path are
the only changes) to preserve the Secure Boot chain.
