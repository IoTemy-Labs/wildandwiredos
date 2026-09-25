# Sponsor art freeze

**Freeze date: Wednesday, November 4, 2026** (see SCHEDULE.md — pending
re-check against the actual event date; the event site currently says
Nov 10 while the project brief says Nov 14).

Sponsor art is data-driven and repacks without touching the rootfs stages,
so a late logo is cheap **until gold master**. After gold master, any art
change means a new ISO, new checksums, new signature, and re-burning /
re-writing every already-produced disc and stick — that is what the freeze
protects.

## The late-art procedure (the whole thing)

```bash
# 1. Edit assets/sponsors/sponsors.yaml (and drop logo files in place)
# 2. Validate:
python3 scripts/build/render-sponsors.py --check
# 3. Render every surface:
python3 scripts/build/render-sponsors.py
# 4. Repack without a full rebuild (assets -> squash -> iso -> verify):
bash scripts/build/build.sh --from-stage assets
# 5. Boot-check the result:
bash scripts/build/test-boot.sh <out-iso> --mode uefi-sb
```

Measured cost of steps 3–4: about 5 minutes (squash dominates). A full
rebuild is NOT required for art changes at any point before gold master.

Art that reaches print (disc labels, sleeve inserts, quick-start cards)
freezes earlier in practice — whenever the print order is placed.
