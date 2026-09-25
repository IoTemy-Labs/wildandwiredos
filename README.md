# Wild & Wired WV — festival Linux remix

Custom Linux remix for Wild & Wired West Virginia (wildandwiredwv.com),
University of Charleston, November 14, 2026. Based on Kubuntu 26.04 LTS.
Not affiliated with or endorsed by Canonical Ltd.

- `docs/BUILD-PIPELINE.md` — how the image is built
- `docs/DECISIONS.md` — decision log
- `scripts/build/` — the pipeline (run inside WSL2/Linux)
- `manifests/` — package/flatpak/appimage curation

Quick start (inside WSL):

```
bash scripts/build/01-host-deps.sh
bash scripts/build/00-fetch-base.sh
bash scripts/build/02-capture-boot-args.sh
bash scripts/build/03-size-report.sh
bash scripts/build/verify-facts.sh
```
