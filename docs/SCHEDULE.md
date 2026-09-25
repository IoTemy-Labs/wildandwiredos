# Schedule gates (PROPOSED — Phase 0, awaiting approval)

Worked back from the event: Saturday, November 14, 2026, University of
Charleston. Once approved these dates hold.

| Gate | Date | Notes |
|---|---|---|
| Package freeze | Fri Oct 9 | manifests locked; only bug-fix package changes after |
| Guides + welcome app feature freeze | Fri Oct 16 | copy edits still allowed |
| Release candidate + full QA matrix pass | Fri Oct 23 → Fri Oct 30 | one QA week; real hardware |
| Sponsor art freeze | Wed Nov 4 | after this, art changes are best-effort; `assets`-stage repack only |
| Gold master | Fri Nov 6 | checksums + GPG signature published internally |
| Disc burn batch + USB duplication | Sat Nov 7 – Wed Nov 11 | per-unit verification per runbook |
| Download page live | Thu Nov 12 | 2 days of soak before event day |

Rationale: sponsor art freezes *after* gold-master-adjacent QA because the
`assets` stage repack does not touch the rootfs — a late logo re-render
changes only ISO-tree files, re-verified by checksum and a QEMU boot test,
not a full matrix pass. Everything that *does* touch the rootfs freezes in
October.
