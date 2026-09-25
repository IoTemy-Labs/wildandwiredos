# Decisions log

Format: date, decision, rationale, alternatives rejected. Newest first.

## 2026-08-21 — AppImage manager: Gear Lever (Flatpak), preinstalled
**Decision (user):** ship `it.mijorus.gearlever` preinstalled as the
AppImage integration/update manager and the double-click handler for
`application/vnd.appimage`.
**Rationale:** maintained, Wayland-native, does integration + desktop
entries + updates. Cost is the GNOME 50 runtime (~+0.8 GiB ISO), which
also makes GIMP/Inkscape/Audacity/Flatseal one-click installs app-only
downloads.
**Rejected:** AppImageLauncher deb (not in archive, stale upstream,
Wayland issues); home-grown helper (no updates, no management UI).

## 2026-08-21 — Snap removed (Option B); Firefox ships as Flatpak
**Decision (user):** purge snapd and the 1.7 GiB pre-compressed seed;
preinstall Firefox from Flathub (334 MB) with the Freedesktop 25.08
runtime (660 MB), which 7 of the 17 one-click apps share. GIMP moves to
one-click (its GNOME 50 runtime would cost ~0.8 GiB of ISO). Projected
ISO ~3.6 GiB vs 4.8 keeping snap.
**Rationale:** measured numbers (PACKAGE-VERIFY.txt, FLATPAK-VERIFY.txt);
snap seed does not compress; first-launch time on live/BD-R media; one
coherent Flatpak story for a software-freedom festival.
**Rejected:** keeping snapd (Option A); Firefox from Mozilla's deb repo
(third-party apt source to maintain, weaker Discover integration).

## 2026-08-21 — Direction 1A (Ridge & Hollow); brand faces cleared
**Decision (user):** direction 1A. Rebel Script and Circuit are Apache 2.0
(user-confirmed) and may ship in the ISO.
**Consequences:** Phase 5 builds the 1A panel (48px, #03252a, 6px radius
chrome), the three-ridge flat wallpaper construction (#0a4f58/420px,
#052e34/340px, #03252a/240px over scanline), and the renderer switches
tier kickers to Circuit and one heading word to Rebel Script per the
handoff. Fonts vendored to assets/fonts/{circuit,rebelscript} with a
license note; Rebel converted woff2 -> ttf for system/QML use.
**Rejected:** 1B Trunk Line (highest cost, cliché risk), 1C Quartermaster
(plainest).

## 2026-08-21 — Claude Design handoff adopted as the frontend source of truth
**Decision (user):** all frontend components follow
`frontend-design/design_handoff_wild_wired_os_shell` (teal/mint token
system). The Phase 2 copper/holler palette and Alfa Slab One/Inter fonts
are retired; `brand.json` now mirrors the handoff tokens and the renderer
implements the shared (direction-independent) surfaces: plated lockups,
sponsor board with exact tier plate sizes and maxima (1/3/6/8, overflow →
quiet strip + warning), scanline/grid textures, tracked mono labels, light
plates under every logo, copy rules (no em dashes, no exclamation marks,
numerals always).
**Working fonts:** Archivo, Source Sans 3, JetBrains Mono (all OFL,
vendored). **Brand faces Rebel Script and Circuit are NOT vendored or
rendered — licenses unconfirmed** (handoff open item 3); fallback per the
handoff is the plated raster lockup and mono labels. Revisit when the
license or purchase record lands.
**Deviations from the handoff, deliberate:** footer/version strings use
26.11 (handoff SDDM footer says "26.04", which is the base, not our
version); `in-kind` tier renders at community plate size (handoff board
lists four rails; our schema has five tiers).
**Outstanding:** the direction pick (1A Ridge & Hollow / 1B Trunk Line /
1C Quartermaster) gates Phase 5 panel geometry, window decoration, and
wallpaper composition. The 16/22px mint badge glyph does not exist yet.

## 2026-08-21 — Event date re-confirmed
**Decision (user):** November 14, 2026. The website's "Tuesday, November
10" listing is outdated/wrong; SCHEDULE.md gates stand as proposed.

## 2026-08-21 — Squashfs compression: zstd level 19, 1 MiB blocks
**Decision (user):** zstd.
**Rationale:** measured on the null build — zstd-19: 4.31 GB in 256 s;
xz: 4.16 GB in 301 s. xz saves ~3% download for several-times-slower
decompression, which is what BD-R live sessions, `toram` loads, and old
laptops actually feel. Both compress tighter than the base image's own xz.
**Rejected:** xz (size win too small to matter under a 6 GiB target).

## 2026-08-21 — Identity: Wild & Wired OS 26.11 "Seneca"
**Decision (user):** Name **Wild & Wired OS**; version **26.11** with build
number **2.0** (second edition of the event; QA respins increment as 2.0.N);
codename **Seneca**; release filename
`wildwired-os-26.11-desktop-amd64.iso` (QA builds insert `-b2.0.N`);
volume label `WildWired-OS-26.11`.
**Rationale:** event's own mark → zero new trademark surface; year.month of
the event; Seneca Rocks is unmistakably WV.
**Rejected:** Wired Holler / Almost Heaven / Mountain Stage (NPR trademark
risk) / New River.

## 2026-08-21 — One ISO for all media
**Decision (user):** a single image serves download, USB, and BD-R.
**Rationale:** doubling images doubles QA; BD-R capacity is headroom, not a
mandate.
**Rejected:** separate "deluxe" disc image.

## 2026-08-21 — Build host: dedicated Proxmox LXC
**Decision (user):** Phase 1+ runs in a dedicated LXC on a Proxmox host the
user provisions; skeleton lives in `scripts/provision/`. WSL2 remains a
working fallback (pipeline is host-agnostic via `WWWV_WORK`).
**Rationale:** clean, reproducible build env; real `/dev/kvm` for QEMU boot
tests (WSL2 QEMU is unaccelerated); newer host toolchain (Ubuntu 24.04
template) than WSL's 22.04.
**Constraints encoded in the skeleton:** privileged container with
`nesting=1` (the chroot stage bind-mounts /dev, /proc, /sys and runs
apt/mknod, which unprivileged idmaps break) and `/dev/kvm` passthrough.
**Rejected:** full VM (heavier than needed); unprivileged LXC (chroot
friction).

## 2026-08-16 — Verified base-image facts (recorded, not decided)
From the real 26.04 rootfs via `verify-facts.sh`: Plasma 6.6.4, KDE
Frameworks 6.24.0, Qt 6.10.2 (`libqt6core6t64`), kernel 7.0.0-14, casper
26.04.2, snapd present, Firefox is a snap transition package
(`1:1snap1-0ubuntu8`). `/usr/bin/sudo` → `/etc/alternatives/sudo` →
`/usr/lib/cargo/bin/sudo` (sudo-rs 0.2.13, alternatives auto mode) with
classic sudo 1.9.17p2 installed as the other alternative — sudoers
drop-ins must be tested against sudo-rs, and the alternatives link must
survive our chroot work untouched. ISO layout: `casper/` holds only
squashfs+vmlinuz+initrd (no filesystem.size/manifest to regenerate);
top-level has `md5sum.txt`, `.disk/`, and a `pool/` of offline installer
debs (dists codename: `resolute`).

## 2026-08-16 — Build state lives on WSL ext4, repo on NTFS
**Decision:** All build scratch (`work/`, ISO cache, output) lives at
`~/wildwired-build` inside the WSL distro; the repo on `/mnt/c` holds only
source. `WWWV_WORK` env var relocates it.
**Rationale:** drvfs/NTFS cannot hold a Linux rootfs — ownership, modes,
device nodes, symlinks, and xattrs are lost or mangled, which would corrupt
the squashfs silently. ext4 also builds several times faster.
**Rejected:** `work/` physically inside the repo (kept as gitignored
placeholder directories only).

## 2026-08-16 — Phase 0 recon runs on WSL2 (Ubuntu 22.04), build host TBD
**Decision:** Run Phase 0 (fetch, verify, capture, measure) in the existing
WSL2 Ubuntu 22.04 distro. The build-host choice for Phase 1 onward (stay on
WSL2 vs. a dedicated Proxmox build VM) is an OPEN decision at the Phase 0
gate.
**Rationale:** Phase 0 outputs are environment-independent; WSL2 was already
present with 943 GB free. Concerns for later phases: QEMU in WSL2 likely
runs without KVM (slow boot tests), and 22.04's squashfs-tools/xorriso are
older than the 26.04 target (zstd support confirmed present, but friction
risk noted).
**Rejected (for now):** blocking Phase 0 on provisioning a build VM.

## 2026-08-16 — Base ISO source pinned
**Decision:** `https://cdimage.ubuntu.com/kubuntu/releases/26.04/release/kubuntu-26.04-desktop-amd64.iso`
(4.7 GB, published 2026-04-23), SHA256 + GPG verified on every fetch against
pinned key `843938DF228D22F7B3742BC0D94AA3F0EFE21092` (Ubuntu CD Image
Automatic Signing Key 2012 — VERIFY flag clears on first successful
signature check).
**Rationale:** official mirror, signed checksums, stable URL for the
scripted fetch.
**Rejected:** torrent (fine for humans, awkward to verify-then-cache in a
script); zsync (adds a tool for marginal benefit on a one-time fetch).
