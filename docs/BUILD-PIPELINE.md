# Build pipeline

Status: Phases 0 to 4 done; Phase 5 (shell branding) in progress.

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

## Stages (`build.sh`)

`extract → unsquash → chroot → assets → clean → metadata → squash → iso →
verify`, each checkpointed, skippable, resumable (`--stage`, `--from-stage`,
`--clean`), timed, logged to `$WORK_ROOT/build.log`. The `assets` stage
re-runs standalone so late sponsor art is a repack, not a rebuild.

The `assets` stage does five things, in order:

1. Overlays `payload/` onto the rootfs (static files, forced to root:root).
2. Runs `install-art.py`, which places generated art from `assets/generated/`.
3. Overlays `branding/iso/` onto the ISO tree (GRUB menus).
4. Runs `scripts/brand/*.sh` in the chroot: dpkg diversions for every
   package-owned branding file, Plymouth alternatives, then a fresh initrd.
5. Copies that initrd to `casper/initrd`, since the live splash and the
   casper user live there.

Verify branding after a build with `scripts/build/check-rootfs.sh`. The `iso`
stage replays `docs/BOOT-ARGS.md` verbatim (volume label and output path are
the only changes) to preserve the Secure Boot chain.
