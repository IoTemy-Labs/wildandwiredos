# branding/

Files that land in the ISO tree (outside the squashfs). `branding/iso/`
mirrors the ISO root and is copied over the extracted base tree by the
`assets` stage of `scripts/build/build.sh`.

Rootfs files live in `payload/` (static files) and `scripts/brand/`
(anything that must divert or edit a package-owned file). Generated art
from `assets/generated/` is placed by `scripts/build/install-art.py`.

The OEM install entry from the base image is intentionally dropped: it
depended on the Kubuntu live-environment session, which we disable.
