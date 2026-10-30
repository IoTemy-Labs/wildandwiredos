# Decisions log

Format: date, decision, rationale, alternatives rejected. Newest first.

## 2026-10-30 — Package list, schedule, and first real install test
**Decisions (user):** the schedule is approved as written. GIMP, Inkscape,
Audacity and Flatseal are preinstalled. No default mail handler ships;
Thunderbird stays a 1-click app and claims mailto when installed.
**Rationale:** Gear Lever already ships a GNOME runtime, and the project
assumes venue Wi-Fi is saturated.
**Estimate miss:** the ISO grew from 3.91 to 4.54 GiB, not the projected 4.2.
Flathub has moved on, so the image now carries GNOME 50 and 51 plus 2 graphics
runtimes. Still under the 6 GiB soft target; left as is.
**First real install (QEMU, Secure Boot, no network):** install and first
login work, in under 5 minutes on this host's fast disk. It disproved 2 claims
in the 2026-09-25 entry:
- `keepDistributor` is ignored; this Calamares reads `keep_distributor`, and
  it can only preserve a plain line. The scripted line was overridden, so
  grub-install created `/EFI/wild`.
- "Ubuntu's signed GRUB only boots from /EFI/ubuntu" is wrong: the VM booted
  from `/EFI/wild`. We still keep 1 folder so every machine stays on the
  tested path.
**Fix:** plain `GRUB_DISTRIBUTOR=Ubuntu`, with the name set for menus only by
`/etc/default/grub.d/99-wildwired.cfg`. Verified on a fresh install after a
simulated GRUB update: only `/EFI/ubuntu` exists, the menu reads "Wild & Wired
OS GNU/Linux", and the disk boots again under Secure Boot.
**Known cosmetic:** the firmware boot list shows 1 entry named "Ubuntu". A hook
could rename it, but the next grub-install would add "Ubuntu" back, so it
stays. Attendees only see it in the F12 menu.
**Also fixed:** the diverted installer launcher survived on installed systems
as a dead menu entry; partition label `kubuntu_2604`; a "Wild  Wired Support"
button with its ampersand eaten; 2 Kubuntu menu leftovers.

## 2026-09-25 — Phase 6: Welcome and Field Guide (scope reduced)
**Decision (user accepted the recommendation to reduce scope):** no
separate Kirigami apps. The handoff's Welcome and Field Guide are delivered as:
1. **Welcome = KDE's Welcome Center, customised.** Our intro text and badge
   replace KDE's (`intro-customization.desktop`: Name is the intro text,
   Comment the caption, Icon the picture, URL its link; verified in QEMU).
   2 distro pages load before KDE's closing page: "Start here" and
   "1-click apps". The second is generated from the `oneclick` lines of
   `manifests/flatpaks.txt` plus `guides/oneclick-apps.json`; each Get
   button opens the app in Discover. It runs on first login, live and installed.
2. **Field Guide = 1 self-contained HTML file** built from
   `guides/fieldguide/*.md`, opened in Firefox from a desktop icon, the menu
   (Get Software group and favourites) and the Welcome Center.
**Rationale:** 3 weeks to the guides freeze with Phase 5 just finished;
the Welcome Center already runs at first login and follows our colour
scheme. Firefox is a Flatpak, so it can only open a single local file
(the document portal hands over that 1 file); multi-page HTML would break.
**Enforced:** the build lints all guide and 1-click copy against the
handoff rules (no dashes, no exclamation marks, numerals, banned words).
**Known limits:** KDE's own Welcome pages keep KDE's copy (including 1
exclamation mark). Firefox shows its Terms of Use dialog on first launch;
we do not accept terms on the attendee's behalf. The handoff's hero blocks
with Rebel Script and Circuit are not used.
**Rejected:** Kirigami apps (days of work each); a multi-page HTML site
(breaks in Flatpak Firefox); a local web server (a service to maintain).

## 2026-09-25 — Phase 5 step 4: login screen and boot menu
**Built:** a `wildwired` SDDM theme (Qt 6 QML) to the handoff login spec:
plated lockup, `V26.11`, initials avatar, name, session label, 480x64
well password field with a two-ring focus state, attention state with a
`!!` sigil and white outline (never red), footer bar with product/host,
session and keyboard switches, RESTART and SHUT DOWN (attention style).
A graphical GRUB theme for the ISO: rendered background, well-coloured
menu box, mint wash with a 3px mint left marker on the active row, mono
hint line, PF2 fonts generated at build time and name-checked.
Verified in QEMU: the themed menu under Secure Boot, UEFI and BIOS; the
login screen after disabling live autologin; Enter logs back in.
**Also fixed, found while testing:**
- casper named the live user after the first word of `.disk/info`
  (`wild@wild`), ignoring our casper.conf. `FLAVOUR` is now set, so the
  live session is `live@wildwired` as intended.
- The text console showed Ubuntu help, Landscape and Ubuntu Pro links and
  Ubuntu's legal notice. Those motd scripts are diverted away and
  `/etc/legal` now names Wild & Wired OS, built from Ubuntu 26.04 LTS.
**Known limits (flagged for review):**
1. **Under Secure Boot the GRUB menu uses GRUB's built-in font.** Ubuntu's
   signed GRUB refuses font files from disk in lockdown (post CVE-2022-2601
   hardening). Layout, colours and art still apply. Fixing it would mean
   re-signing GRUB, which we will not do.
2. **The live user shows "Password" on the login screen** after a logout.
   casper gives it an empty-string password hash, so SDDM reports that a
   password is needed. Pressing Enter with the field empty works.
3. **The ENTER hint uses secondary ink**, not the handoff's `#12837b`, which
   would break the handoff's own rule that structure teal never carries text.
4. **Not built yet:** a KScreenLocker QML theme (the lock screen is Breeze
   over our lock art) and a GRUB theme for installed systems (their menu is
   hidden unless dual booting). Konsole keeps Breeze's terminal palette,
   including red and green ANSI colours, which terminal output relies on.

## 2026-09-25 — Phase 5 step 3: direction 1A shell (colours, fonts, panel, menu)
**Built:** `WildWired.colors` and a `wildwired` Plasma style generated from
the handoff token table; the 1A panel (48px, `#03252a`, 1px `#0f5f63` top
hairline, kickoff / separator / icons-and-text tasks / spacer / tray /
two-line JetBrains Mono clock / show-desktop); opaque popups and tooltips;
Archivo, Source Sans 3 and JetBrains Mono as the only system fonts; menu
favourites as two-line list rows; our badge as the default user picture;
wobbly windows and translucent moves off.
**Deliberate deviations (assistant, flagged for review):**
1. **Secondary ink on raised surfaces is `#9dbebd`, not `#8fb3b2`.** The
   token only reaches 4.07:1 on `#0a4f58` (handoff rated it on the base
   only). The lift is the smallest that holds WCAG AA 4.5:1. Every text
   pair in both colour files now measures at least 4.64:1.
2. **Variable fonts, no static instances.** The handoff asks for static
   Source Sans 3 Light/Regular because Qt cannot render weight 340. UI text
   uses 400, a named instance fontconfig exposes from the variable file,
   so no new downloads were needed. 340 stays reserved for the QML apps.
3. **Kickoff popup size is Breeze's**, not 520 x 572: Plasma 6.6 Kickoff has
   no size setting. Groups are Kickoff's Favorites/categories, not the
   mock's "start here / everyday" headings.
4. **Window decoration is Breeze** with large buttons (about 40px) and a
   high-intensity outline, recoloured by the scheme's `[WM]` colours. An
   Aurorae theme with the exact 6px corners and `#12837b` border is not built.
5. **Icons are Breeze Dark.** The recoloured Breeze-derived icon theme and
   the 16/22px mint badge glyph are still open handoff items.
6. **Task manager active state is Breeze's** (mint-tinted fill, top line),
   not the mock's `#0a4f58` fill with a 2px mint bottom border.
**Also fixed:** the installer launcher's subtitle "Calamares — System
Installer" broke the no-em-dash copy rule; it now reads "Copy Wild & Wired
OS onto this computer's disk". Kubuntu's logo was every new user's
`~/.face` and a picker avatar; both replaced.

## 2026-09-25 — Phase 5 step 1: Kubuntu identity removed (build decisions)
**Decisions (assistant, reversible, flagged for review):**
1. **Display names change; machine identity stays Ubuntu.** os-release
   `NAME`/`PRETTY_NAME`, lsb `DISTRIB_DESCRIPTION`, `/etc/issue`, KDE About,
   Calamares, GRUB menus and the live session all say Wild & Wired OS.
   `ID=ubuntu`, `VERSION_ID=26.04`, `DISTRIB_ID=Ubuntu` and the `resolute`
   codenames stay, so `add-apt-repository ppa:`, ubuntu-drivers and apt
   tooling keep working. `IMAGE_ID`/`IMAGE_VERSION` carry our build.
2. **Kubuntu's "Try or Install" prompt is skipped.** It is a compiled
   binary with Kubuntu art baked in. Its session file is diverted away, so
   casper autologins the live user straight into Plasma. casper's own
   25adduser already copies the renamed "Install Wild & Wired OS" launcher
   to the live desktop, matching the handoff's live-session state. Consequence: the
   OEM install boot entry is dropped (it depended on that session).
3. **The initrd is regenerated** in the `assets` stage, because the live
   Plymouth splash and casper's user/host live there. Same kernel, so the
   signed boot chain is untouched. Live user is `live`, hostname `wildwired`.
4. **Installed-system GRUB keeps `/EFI/ubuntu`.** grub-install names the
   EFI directory after the first word of `GRUB_DISTRIBUTOR` ("wild"), but
   Ubuntu's signed GRUB only boots from `/EFI/ubuntu`. `/etc/default/grub`
   now sets `Ubuntu` when read by grub-install (`sh -c`) and our name when
   read by grub-mkconfig; Calamares `keepDistributor: true` preserves it.
   Verified by simulation and by `check-rootfs.sh`; a real install test on
   Secure Boot hardware is still owed in QA.
5. **Package-owned files are replaced via `dpkg-divert`**, so apt upgrades
   on installed machines cannot restore Kubuntu branding.
6. **Interim look until later Phase 5 steps:** Breeze Dark colours and
   Plasma style, stock Breeze SDDM over our generated background, Kubuntu's
   panel template with our start icon.
**Also fixed:** Kubuntu's defaults pointed the default browser and mail
client at snap desktop ids (`firefox_firefox.desktop`) that Option B
removed; links now open the Flatpak Firefox.

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
