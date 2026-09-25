# Handoff: Wild &amp; Wired OS — desktop shell frontend

## Overview

Wild &amp; Wired West Virginia is a community Linux and free software festival (November 14, 2026, GSU Ballroom, Charleston WV). The festival ships a custom Linux OS on USB and disc to attendees whose skill runs from sysadmin to Windows-only first-timer.

This handoff covers the **frontend of that OS**: the visible shell from power-on to desktop. That means the boot chain (GRUB, Plymouth), the login and lock screens (SDDM, KScreenLocker), the desktop shell (Plasma panel, application menu, widgets, wallpaper), window decoration, the Plasma SVG theme, the KDE colour scheme, and the two first-party QML apps (Welcome, Field Guide).

Target platform: **KDE Plasma 6.6 on Wayland, Kubuntu 26.04 LTS base.** No Ubuntu or Canonical marks appear anywhere in the shell.

## About the design files

The files in this bundle are **design references created in HTML**. They are prototypes of intended look and structure, not production code to port. `Phase 1 Directions.dc.html` renders every screen as an absolutely-positioned 1920 x 1080 artboard scaled to 50%, plus one 1:1 panel-and-menu crop per direction, with dimension annotations.

Your job is to **recreate these designs in the real target environment**, which for this project is a set of KDE Plasma configuration and theming artifacts, not a web app:

| Design surface | Real implementation |
| --- | --- |
| Colour palette | KDE colour scheme (`.colors` file), consumed by every Qt app |
| Panel, menu, popups, tray | Plasma SVG theme (`plasma/desktoptheme/<name>/`) + `plasmashellrc` / `plasma-org.kde.plasma.desktop-appletsrc` layout |
| Window decoration | Aurorae theme or Breeze config (`kwinrc`, `breezerc`) |
| Login screen | SDDM QML theme |
| Lock screen | KScreenLocker QML theme |
| Boot splash | Plymouth theme (script plugin) + KSplash QML |
| Bootloader | GRUB theme (`theme.txt`, PF2 fonts via `grub-mkfont`) |
| Wallpapers | Exported SVG/PNG at 1920x1080, 2560x1440, 3840x2160, 1366x768 |
| Installer | Calamares branding + slideshow QML |
| Welcome, Field Guide | Kirigami / QML applications |
| Icon theme | Breeze-derived icon set with recoloured monochrome symbolics |

Where the HTML uses a `<div>` with a hairline border, the Plasma equivalent is a real 1px stroke in the theme SVG, not a shadow. Where the HTML uses `repeating-linear-gradient` for texture, the Plasma equivalent is a tiling PNG or SVG pattern. Nothing in the shell should render a live CSS-style gradient.

## Fidelity

**High-fidelity.** Colours, type, spacing, panel and popup geometry, row heights, and icon sizes are final and are stated in pixels below. Recreate them exactly.

Two qualifications:

1. **One decision is outstanding.** Three named directions (1A Ridge &amp; Hollow, 1B Trunk Line, 1C Quartermaster) are documented here. The client has not yet picked one. Do not begin implementation until the pick lands; the directions differ in panel height, radius, and wallpaper production cost, so the theming work is not shared beyond the colour scheme and font stack.
2. **Coverage is 3 screens per direction, not the full shell.** Phase 1 shows login, desktop, and panel-with-menu. The remaining boot-chain, installer, and app screens (27 in total) are Phase 2 and are not in this bundle.

## Design tokens

### Colour

Every value below is fixed. There is **no red, amber, or blue anywhere in this system**, and no gradients of any kind.

| Token | Hex | Role | Contrast on base |
| --- | --- | --- | --- |
| Base surface | `#073e45` | The desktop, window backgrounds. An environment, not an accent. | — |
| Elevated surface | `#0a4f58` | Cards, popups, panels | 1.27:1 (deliberately subtle) |
| Well | `#03252a` | Terminal blocks, panel background, footers, sunken fields | — |
| Ridge mid (1A only) | `#052e34` | Middle ridge silhouette | — |
| Body text | `#d6e9e7` | All body copy | 9.34:1 |
| Secondary text | `#8fb3b2` | Metadata, inactive labels | 5.19:1 |
| Tertiary text | `#5f8887` | Legal lines, disabled | — |
| Accent (mint) | `#40dfaf` | Links, primary fill, active state, focus | 6.94:1 |
| Mint hover | `#6ce8c4` | Hover on mint fill | — |
| Mint press | `#2bbd92` | Pressed state | — |
| Focus ring | `#8cefd0` | Outer focus ring | — |
| Structure | `#12837b` | Borders, rules, separators, icon chrome. **Never carries text.** | 2.55:1 |
| Border strong | `#1a9d93` | Hover border | — |
| Border subtle | `#0f5f63` | Card and panel hairlines | — |
| Max emphasis | `#ffffff` | Rare. Negative/attention states. | 11.77:1 |
| Logo plate | `#f4faf9` | The light plate every logo appearance sits on | — |
| Plate label ink | `#3d6b6d` | Placeholder text inside a light plate | — |

Low-alpha fills, the only transparency permitted in the shell:

- `rgba(64,223,175,.12)` — active/selected row wash, kickoff button active
- `rgba(64,223,175,.35)` — mint hairline on active chrome
- `rgba(255,255,255,.10)` — attention/negative fill
- `rgba(3,37,42,.85)` — sticky/backdrop
- `rgba(3,37,42,.35)` — footer rail
- `rgba(18,131,123,.35)` — panel peek handle, shadow ring
- `rgba(3,37,42,.18)` — hairline inside a light logo plate

Textures, the only two permitted background treatments beyond flat colour:

- **Grid** — 24px monospace grid at `rgba(18,131,123,.10)`. Hero and section fields, wallpaper only.
- **Scanline** — 1px lines every 4px at `rgba(18,131,123,.08)`. Terminal panels and poster fields.

Neither texture goes in a window background, where it fights text.

**KDE colour scheme mapping:**

- `BackgroundNormal` `#073e45`, `BackgroundAlternate` `#0a4f58`, view background `#03252a`
- `ForegroundNormal` `#d6e9e7`, `ForegroundInactive` `#8fb3b2`
- `DecorationFocus` and `ForegroundLink` `#40dfaf`
- Any role Plasma renders **borders or separators** on gets `#12837b` or `#0f5f63`. Any role Plasma renders **text** on gets an ink value. Never structure teal on a text role.
- `NegativeText` / `NegativeBackground`: KDE mandates these roles and Discover, System Settings, and Calamares all use them. Map negative to `#ffffff` text on a `#03252a` fill with a `1px solid #ffffff` outline and a `!!` mono sigil, and state the negative meaning in copy as well as colour. **Flagged:** any bundled distro app that hardcodes red is outside our control.

### Type

Five faces. Three working faces, all OFL, all shipped inside the ISO. Two brand display faces, self-hosted.

| Role | Family | Usage |
| --- | --- | --- |
| Display / headings | **Archivo** 600–700 | Leading 1.04–1.18, tracking -0.02em to -0.01em |
| Body | **Source Sans 3** 340 | 17px, leading 1.68. One step lighter than a light-mode default, because light text on dark reads heavier. |
| Mono | **JetBrains Mono** 500 | Labels, section markers, metadata, buttons, tabs, badges, times, commands. Tracked `0.14em` and uppercased for labels; untracked for real commands. |
| Script | **Rebel Script** 400 | The word "Wild" only, plus a single word of emphasis inside a heading at ~1.35x surrounding size, `line-height: 0.8`. |
| Circuit | **Circuit** 400 | The word "WIRED" only, plus short uppercase machine labels (track names, device rows, kiosk headers). Uppercase, tracked `0.06em`. **15px floor.** |

Rules that constrain the build:

- **Neither brand face is a UI font.** Qt will happily set a menu in Circuit and it will be unreadable. Lock this at build time: the colour scheme and `kdeglobals` name Archivo, Source Sans 3, and JetBrains Mono *only*. Rebel Script and Circuit appear solely in wallpapers, boot art, login/lock headers, and the Welcome and Field Guide hero blocks.
- **Body weight 340 does not survive Qt.** Source Sans 3 ships variable, but Plasma resolves UI fonts to a static family and Qt rounds to the nearest available weight. Ship the static Light (300) and Regular (400) instances and set UI text to **400 at 10pt**. Keep 340 for Welcome and Field Guide, which are QML and can load the variable file.
- **Circuit needs a glyph coverage check** for digits and punctuation before it sets any version string.
- Minimum sizes: 15px for anything in Circuit, 11px for mono micro labels, 12pt for print.
- Casing: headings and body sentence case. Mono labels are written lowercase in source and uppercased by the component. Product names keep their own casing (`LibreOffice`, `Nextcloud`, `systemd`).

### Spacing, radii, borders, shadow, motion

- **Spacing** — 2px base scale. Layout with flex/grid `gap`, never margins between siblings.
- **Radii** — `0`, `2px` badges, `4px` controls, `6px` cards, `10px` dialogs (ceiling). Pills only on tags.
- **Card** — `#0a4f58` background, `1px solid #0f5f63` hairline, `6px` radius, shadow-1. No coloured left border as decoration; the 3px left marker carries meaning only (callouts, active menu row).
- **Shadow** — depth only, never colour. 1px seat line up to a 64px dialog drop, each paired with a faint `rgba(18,131,123,.35)` ring so the panel edge survives on the low-contrast base. The one inset is a well shadow on form fields: `inset 0 1px 0 rgba(3,37,42,.5)`. **The 1.27:1 surface lift means Plasma SVG frames need real 1px strokes, not soft shadows.** Keep shadow use at shadow-2 or lower in chrome; popups may use shadow-3.
- **Motion** — mechanical, no bounce, no overshoot. 70ms colour, 120ms controls and tooltip fades, 180ms card hover and tab switches, 280ms dialogs. `--ease-out` `cubic-bezier(.2,.7,.3,1)` entering, ease-in-out for position. Everything collapses to 0ms under reduced motion. **No looping animation except the terminal block cursor** (1.1s two-step blink). This makes the boot splash a staged reveal, not a spinner loop — fine, since Plymouth is script-driven.
- **Hover / press / focus on dark** — hover *lightens* (mint `#40dfaf` → `#6ce8c4`; secondary surface transparent → `#0d6068`, border `#12837b` → `#1a9d93`; ghost picks up a `rgba(64,223,175,.10)` wash). Press *darkens and shifts down 1px* (`#2bbd92`), never scales. Focus is two rings: 2px base-coloured gap then a 2px `#8cefd0` ring, so it survives on both card and base surfaces.

## Screens

Every artboard below is authored at **1920 x 1080**. Wallpapers export at 1920x1080, 2560x1440, 3840x2160, and 1366x768.

### Shared: SDDM login (all directions)

**Purpose.** First contact. A person who has never used Linux must understand that pressing enter is safe.

**Layout.** Centred single column, 480px wide, vertically placed so it never enters the sponsor band at y=880 to y=1008.

- Plated lockup at top, `#f4faf9` plate, 20px 28px padding, 6px radius, `0 2px 4px rgba(3,37,42,.45)` shadow, logo 420px wide
- `v2026` beneath in JetBrains Mono 500 / 20px / `.14em` / uppercase / `#40dfaf`
- Avatar: 104px circle, `#0a4f58` fill, `2px solid #12837b`, initials in Archivo 700 40px `#40dfaf`
- Username in Archivo 600 34px `#ffffff`; session label in mono 500 15px `.14em` uppercase `#8fb3b2`
- Password field: 480 x 64, `#03252a`, `1px solid #12837b`, 4px radius, `inset 0 1px 0 rgba(3,37,42,.5)`, 20px horizontal padding, 14px gap, 22px lock icon `#8fb3b2`, placeholder Source Sans 3 340 22px `#8fb3b2`, `ENTER` hint right-aligned in mono 500 15px `#12837b`
- Reassurance line: "Nothing is written to disk. Press enter to explore." Source Sans 3 340 20px `#d6e9e7`

**Sponsor band.** x=64 to x=1856, bottom 104px above the footer. Mono `SPONSORS` kicker `#40dfaf` with a `1px #12837b` rule filling the remaining width. Plate sizes by tier: presenting 300x88, gold 200x72, silver 140x56. Every plate is `#f4faf9` with `1px solid rgba(3,37,42,.18)` and 4px radius.

**Footer bar.** Full width, 72px, `#03252a`, `1px solid #0f5f63` top border, 32px horizontal padding, 28px gap. Left: `WILD & WIRED WV 26.04 / LIVE`. Right: session (`PLASMA (WAYLAND)`), accessibility, power, keyboard layout (`EN`). All mono 500 16px `.14em` uppercase `#8fb3b2`, icons 20px `#8fb3b2`.

### Shared: sponsor-wall desktop

**Purpose.** The default desktop honours the people who paid for the disc, without becoming an ad.

- **Desktop icon column** — x=64, y=32, 180px wide, 24px gap. 48px Lucide-equivalent icons `#d6e9e7`, labels Source Sans 3 340 17px centred with `text-shadow: 0 1px 2px rgba(3,37,42,.9)`. Entries: Install Wild &amp; Wired, Field Guide, Home. **The column keeps x=32 to x=280 clear at every sponsor tier count.**
- **Sponsor board** — occupies x=400 to x=1520, y=56 to y=992, leaving 40px of clear canvas above the panel. `#03252a`, `1px solid #0f5f63`, 6px radius, `0 8px 24px rgba(3,37,42,.55)`, padding 24px 48px, 20px gap.
  - Header: Circuit kicker `THE SPONSOR WALL` 22px `.06em` `#40dfaf`; title Archivo 600 40px `#ffffff` with one Rebel Script word at 46px `#40dfaf`; right side `v2026` in mono plus the plated lockup at 280px.
  - Tier rails: mono 14px `.14em` uppercase `#8fb3b2` label, `1px #12837b` rule, then a mono 13px `#12837b` capacity note. Plate sizes: presenting 640x132 (max 1), gold 420x104 (max 3), silver 260x74 (max 6), community 170x56 (max 8).
  - Special thanks column: 340px, `1px solid #0f5f63` left border, 32px left padding, names in Source Sans 3 340 19px/1.6 `#d6e9e7`.
  - Legal line: "Based on Ubuntu 26.04 LTS. Not affiliated with or endorsed by Canonical." Source Sans 3 340 14px `#5f8887`.
- **Reflow rule.** Tier maxima are what triggers reflow: 1 presenting, 3 gold, 6 silver, 8 community. Past that the wallpaper generator drops to the quiet strip layout and logs a warning.

### Direction 1A — Ridge &amp; Hollow

*Appalachian, hand built.* The machine as a made object. Ridgelines are flat silhouettes cut from the base ramp, never shaded, so the wallpaper is a horizon rather than a picture, and the sponsor board sits on it like a board nailed to a porch post. Chrome is the most generous of the three, because the person most likely to be frightened by this desktop is the person it is for. The hand-built feeling comes from structure, not ornament: hairline contour rules, mono tier rails, and a deliberate asymmetry where the board hangs from the top of the field rather than centring in it. Warmest and slowest of the three, and the one that photographs best on a keepsake disc sleeve.

**Wallpaper construction.** Three flat `clip-path` ridge fills from the base ramp, no shading, no gradient, over a scanline field. Ridge fills back to front: `#0A4F58` (420px tall), `#052e34` (340px), `#03252a` (240px). Export as one SVG for SDDM and one PNG for GRUB.

**Panel and menu.**

- Panel 48px, `#03252a`, `1px solid #0f5f63` top border, 8px horizontal padding, 8px gap
- Widget order left to right: kickoff, separator, icons-and-text task manager, spacer, system tray, two-line digital clock, 6px peek handle
- Kickoff 56 x 40, 4px radius, `rgba(64,223,175,.12)` fill, 28px badge glyph
- Separator: 1px x 24px `#0f5f63`
- Task manager entries 40px tall, 14px horizontal padding, 4px radius; active gets `#0a4f58` fill and a `2px solid #40dfaf` bottom border; labels Source Sans 3 340 15px, active `#d6e9e7`, inactive `#8fb3b2`; icons 20px
- Tray icons 18px `#8fb3b2`, USB active in `#40dfaf`
- Clock: mono 500 15px `#d6e9e7` time over mono 500 11px `.1em` `#8fb3b2` date (`nov 14 2026`)
- **Menu popup 520 x 572**, 8px gap above the panel, `#0a4f58`, `1px solid #0f5f63`, 6px radius, `0 24px 64px rgba(3,37,42,.65)`
  - Search header: 16px padding, `1px solid #0f5f63` bottom; field 40px, `#03252a`, `1px solid #12837b`, 4px radius, well inset, 16px search icon, placeholder "Search apps, files and settings"
  - Body: 12px vertical / 8px horizontal padding, 2px row gap. Group labels mono 11px `.14em` uppercase `#8fb3b2`. Groups: `start here`, then a `1px #0f5f63` divider at 10px 12px margin, then `everyday`
  - **Rows 48px**, 12px horizontal padding, 14px gap, 4px radius, 22px icons. Active row: `rgba(64,223,175,.12)` fill plus `3px solid #40dfaf` left marker. Two-line rows use Source Sans 3 340 15px `#d6e9e7` over 340 12px `#8fb3b2`
  - Footer rail 56px, `1px solid #0f5f63` top, `rgba(3,37,42,.35)` fill, 12px padding. Left: 18px user icon + `LIVE USER` in mono 11px `.14em`. Right: 36px square lock, restart, and power buttons; power is the attention treatment — `rgba(255,255,255,.10)` fill, `1px solid #ffffff`, `#ffffff` icon

**Build notes.**

- Plasma style: 6px frame radius, 1px `#0f5f63` strokes, shadow-3 on popups, all inside an SVG Plasma theme
- Window decoration: 40px title bar, 6px top corners, 1px border, focused `#12837b`, unfocused `#0f5f63`
- Cost: the ridge SVG is one asset reused across GRUB, Plymouth, SDDM, lock, and installer. Cheapest of the three
- Risk: at 1366x768 the sponsor board shrinks to 1000px wide and the thanks column drops below the tiers. Verified layout, not a stretch
- Brand faces: Rebel Script carries one word inside the board heading, Circuit sets the tier kicker. Both are wallpaper art, backed by the plated raster lockup

### Direction 1B — Trunk Line

*Wired, infrastructural.* The desktop as a wiring diagram you are allowed to read. Everything sits on the 24px monospace grid, and the sponsor zones are boards on a trunk line joined by 1px traces with square nodes, so the tier hierarchy is legible as topology before you read a label. Chrome is tightened and mono metadata is promoted: the login screen states hostname, kernel, and session, the way a machine that respects you states its own configuration. Densest and most confident of the three. It flatters the sysadmins in the room and stays legible for switchers because the grid gives every element an obvious place, but it is the direction where a careless Phase 2 could drift toward the Matrix cliché — **so trace work stays in structure teal and never mint.**

**Panel and menu.**

- Panel **40px**, 2px radius, square panel and tray popups
- **Menu popup 600 x 552**, 4px gap above the panel, 12px popup padding, **row height 40px**
- Icons 18px in menu, 16px in panel and tray. Tray runs 16px monochrome overrides
- Search-first behaviour: the field is focused on open; results group by applications, Field Guide articles, and installable packages. Keyboard hints sit on the footer rail

**Build notes.**

- Plasma style: 2px frames, 1px `#12837b` strokes, no radius on panel or tray popups. Grid texture is a 24px tile, wallpaper only
- Window decoration: 36px title bar, square corners, focused 1px `#12837b` with a 2px mint underline on the title bar bottom edge
- Cost: **highest.** Trace and node work has to be regenerated per resolution, so the sponsor wall needs a generator script rather than a static export
- Risk: 40px panel with 14px labels is tight at 1366x768. Fallback is 44px with the task manager set to icons only
- Brand faces: Circuit only, as the machine label above each trunk. It suits this direction best, which is also the risk — keep it to one word per zone

### Direction 1C — Quartermaster

*Sovereign, utilitarian.* Issued equipment, not a product. The wallpaper is a specification plate: a hairline frame, a mark, and a typographic block that says what this machine is, who paid for it, and what it will not do to your disk, with the sponsor tiers set as a plain table because a table is honest about rank in a way a collage is not. Every control is labelled and every list row carries its keyboard shortcut, so the desktop teaches its own operation. No texture anywhere except inside the plate. Most legible of the three at 1366x768 and by far the calmest under stress, which matters most on the partitioning screen, and the direction that ages best because there is nothing in it to go out of fashion. The trade is charm: it is a deliberately plain object, and the Appalachian half of the brand survives only in the mark and in the voice.

**Panel and menu.**

- Panel **44px**, 4px radius
- Menu button is **118 x 36 and carries the word `MENU`**, because a switcher looking for Start looks for a word
- **Menu popup 560 x 580**, 8px gap above the panel, 16px popup padding, **rows 48 to 56px**
- Icons 20px in menu, 18px in panel and tray
- Every power action is labelled, and keyboard shortcuts show right-aligned on every row
- Clock is time plus date on one line at 1920, stacked at 1366

**Build notes.**

- Plasma style: 4px frames, 1px `#12837b` strokes, no texture in chrome. Closest of the three to stock Breeze geometry, so the least likely to break in a Plasma point release
- Window decoration: 40px title bar, 4px top corners, focused `#12837b` border, unfocused `#0f5f63` with the title at `#8fb3b2`
- Cost: **low.** The wallpaper is type and hairlines, so all four resolutions are one SVG with a text layer
- Risk: labelled buttons are wider, so the task manager falls back to icons only below 1440px wide
- Brand faces: the full wordmark set in live type in the plate header, the only place two brand faces are allowed in one phrase

## Interactions and behaviour

- **Login.** Password field focused on load. Enter submits. Failure shows the white-plus-`!!` attention treatment with copy stating what happened, never a red field. Session, accessibility, and power menus open upward from the footer bar.
- **Kickoff / menu.** Opens on click or Meta. 1B focuses the search field on open; 1A and 1C open on the browse list. Escape closes. Arrow keys move the row selection, applying the active-row treatment (`rgba(64,223,175,.12)` + 3px mint left marker). Popup enter/exit is 180ms `--ease-out`, opacity and 4px translate only.
- **Task manager.** Active window gets the `#0a4f58` fill and 2px mint bottom border. Hover lightens the surface to `#0d6068`. Press shifts down 1px.
- **Panel peek.** 6px `rgba(18,131,123,.35)` handle at the far right shows the desktop on click.
- **Wallpaper reflow.** The sponsor wall is generated, not hand-placed. Feed it the tier lists; past the tier maxima it falls back to the quiet strip layout and logs a warning. It must produce all four resolutions from one source.
- **Reduced motion.** All durations to 0ms. The terminal cursor blink is the only survivor, and only because a block cursor that does not blink is not a block cursor.
- **Responsive floor.** 1366x768 is the lowest supported mode and every direction has a documented fallback for it (see per-direction risk notes). Touch targets never below 44px.

## State

The shell is configuration, not an application, so there is little runtime state. What exists:

- **Session state** — live session vs installed system. The live session shows "Install Wild &amp; Wired" on the desktop and in the menu's `start here` group; the installed system drops both and promotes Field Guide.
- **Sponsor tier data** — the input to the wallpaper generator. Shape: `{ presenting: [], gold: [], silver: [], community: [], thanks: [] }`, with the maxima above enforced at generate time.
- **Panel widget config** — the widget order per direction, written to `plasma-org.kde.plasma.desktop-appletsrc` in the default profile so a fresh user gets it without running a script.
- **Menu selection and search query** — transient, owned by Kickoff.

## Assets

| Asset | Path in bundle | Note |
| --- | --- | --- |
| Long horizontal lockup | `assets/logo-lockup.png` | Supplied by client |
| Stacked lockup | `assets/logo-stacked.png` | Supplied by client |
| Circular mountain/circuit badge | `assets/logo-icon.png` | Supplied by client. Used as the kickoff glyph at 28px |
| OS-front lockup | `assets/logo-os-front.png` | Used in login and sponsor-board headers |
| Rebel Script | `assets/fonts/Rebel.woff2`, `Rebel.woff` | Self-hosted. **License unconfirmed** |
| Circuit | `assets/fonts/Circuit.ttf` | Self-hosted, TTF only. **License unconfirmed** |
| Design tokens | `_ds/.../tokens/*.css` | The authored source of every value in this README |

**Open asset items:**

1. **The badge needs a single-colour mint glyph.** The supplied raster badge is unreadable below 32px, so 16px and 22px icon sizes need new artwork. That glyph does not exist yet; it is Phase 2 work.
2. **All supplied lockups contain navy and white artwork that dies on the dark base.** Every appearance sits on a `#f4faf9` plate. That includes GRUB, Plymouth, SDDM, and KSplash.
3. **Rebel Script and Circuit redistribution is unconfirmed.** They are the only two faces whose license we cannot verify, and an ISO redistributes fonts. Send the license or purchase record before the ISO ships. Fallback if it does not clear: the plated raster lockup (already how the mark appears in these mocks) and Archivo 700 for the version line.
4. **Icons are Lucide in the mocks, standing in for the real icon theme.** Lucide was our pick, not the brand's. In the OS this becomes a Breeze-derived icon theme: 1.75 stroke, sizes 15–16px in controls, 18–20px in toolbars, 22–24px standalone, coloured `#d6e9e7` / `#8fb3b2` for content and `#1a9d93` for chrome. Icons are never mint on their own.
5. **No photography or illustration was supplied.** Sponsor plates are labelled placeholders at exact tier dimensions. Do not invent imagery.
6. **Boot-chain font conversion.** GRUB needs PF2 conversions via `grub-mkfont`. Plymouth draws text through Pango. SDDM and KSplash are QML and carry the real faces directly.

## Copy rules

The shell's own strings follow the brand voice, and this constrains implementation because several strings are load-bearing:

- Second person, always. Never "users".
- Reassurance is structural, not cheerful. "Nothing is written to disk," not "Don't worry, it's easy!"
- Anything a reader might type appears as a real command in mono, not prose describing a command.
- Sentence case prose. Mono labels written lowercase in source and uppercased by the component.
- **No em dashes anywhere.** No exclamation marks. No emoji, ever — where a glyph is needed, use an icon or a mono sigil (`$`, `#`, `::`, `->`, `!!`, `▮`, `─`).
- Numerals always, including one through nine. Dates as `November 14, 2026` in prose, `nov 14 2026` in mono metadata.
- **Words that never appear:** "weird" (an unrelated West Virginia brand owns that space and proximity would be harmful), "hacker", "cyber", "wizard", "guru", "power user", "just", "simply", "obviously".
- Never make Linux look intimidating or exclusive. Terminal blocks show commands a first-timer could actually run.

## Hard exclusions

- No green-on-black Matrix cliché. A dark base plus a mint accent makes this an easy trap, and falling into it would undercut an OS whose purpose is making Linux approachable. Especially relevant to direction 1B.
- Nothing spooky, folkloric, cryptid, or paranormal.
- No purple-to-cyan gradients. No gradients at all. No neon, glow, or bloom. No drop shadows on text (the one exception is the desktop icon label shadow, for legibility over wallpaper).
- No photographic full-bleed wallpapers.
- No Ubuntu or Canonical marks. The attribution line is text only.
- No floating action buttons. Nothing is fixed except the panel.

## Files in this bundle

| File | What it is |
| --- | --- |
| `Phase 1 Directions.dc.html` | The three directions, 9 artboards. Open in a browser. |
| `support.js` | Runtime the HTML prototype needs to render. Not part of the OS. |
| `assets/` | Logo files and the two self-hosted brand fonts |
| `_ds/root-access-.../tokens/` | The authored design tokens: colours, typography, spacing, border, elevation, motion, fonts |
| `_ds/root-access-.../styles.css`, `_ds_bundle.js` | Design system entry point and component bundle |

## What to do first

1. **Wait for the direction pick** (1A, 1B, or 1C). Nothing beyond step 2 is shared across directions.
2. **Build the KDE colour scheme** from the palette table. It is direction-independent and every Qt app on the ISO consumes it. Verify the negative-role mapping renders as white-on-well with the `!!` sigil, and that no text role resolves to `#12837b`.
3. **Resolve the font question** before anything ships: static Source Sans 3 instances installed, `kdeglobals` naming only the three working faces, and the Rebel/Circuit license cleared or the fallback adopted.
4. **Draw the mint badge glyph** for 16px and 22px icon sizes.
5. Then the Plasma SVG theme, window decoration, and wallpaper generator for the chosen direction.
