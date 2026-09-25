# Boot arguments captured from the base ISO

Source: `kubuntu-26.04-desktop-amd64.iso` (sha256-verified, see cache stamp).
Captured: 2026-08-16T14:27:24Z by 02-capture-boot-args.sh.

These are the `xorriso -as mkisofs` arguments that reproduce the
original boot setup byte-for-byte, including the signed EFI payload
path and the isohybrid system area. The Phase 1 `iso` stage MUST
use these verbatim, changing only `-V` (volume label) and the
output path. Never regenerate, resign, or substitute the boot images
themselves — that breaks Secure Boot.

```
-V 'Kubuntu 26.04 amd64'
--modification-date='2026042301043800'
--grub2-mbr --interval:local_fs:0s-15s:zero_mbrpt,zero_gpt:'/home/dj_raidar_vip/wildwired-build/cache/kubuntu-26.04-desktop-amd64.iso'
--protective-msdos-label
-partition_cyl_align off
-partition_offset 16
--mbr-force-bootable
-append_partition 2 28732ac11ff8d211ba4b00a0c93ec93b --interval:local_fs:9889132d-9899427d::'/home/dj_raidar_vip/wildwired-build/cache/kubuntu-26.04-desktop-amd64.iso'
-appended_part_as_gpt
-iso_mbr_part_type a2a0d0ebe5b9334487c068b6b72699c7
-c '/boot.catalog'
-b '/boot/grub/i386-pc/eltorito.img'
-no-emul-boot
-boot-load-size 4
-boot-info-table
--grub2-boot-info
-eltorito-alt-boot
-e '--interval:appended_partition_2_start_2472283s_size_10296d:all::'
-no-emul-boot
-boot-load-size 10296
```

## El Torito / system area details (informational)

```
El Torito catalog  : 398  1
El Torito cat path : /boot.catalog
El Torito images   :   N  Pltf  B   Emul  Ld_seg  Hdpt  Ldsiz         LBA
El Torito boot img :   1  BIOS  y   none  0x0000  0x00      4         399
El Torito boot img :   2  UEFI  y   none  0x0000  0x00  10296     2472283
El Torito img path :   1  /boot/grub/i386-pc/eltorito.img
El Torito img opts :   1  boot-info-table grub2-boot-info
El Torito img blks :   2  2574
System area options: 0x00004201
System area summary: MBR protective-msdos-label grub2-mbr cyl-align-off GPT
ISO image size/512 : 9900092
Partition offset   : 16
MBR heads per cyl  : 0
MBR secs per head  : 0
MBR partition table:   N Status  Type        Start       Blocks
MBR partition      :   1   0x00  0xee            1      9900091
MBR partition      :   2   0x80  0x00            0            1
GPT                :   N  Info
GPT disk GUID      :      84f4acc6b0c95b4191db9402cbea775e
GPT entry array    :      2  248  separated
GPT lba range      :      64  9900028  9900091
GPT partition name :   1  490053004f003900360036003000
GPT partname local :   1  ISO9660
GPT partition GUID :   1  84f4acc6b0c95b4191da9402cbea775e
GPT type GUID      :   1  a2a0d0ebe5b9334487c068b6b72699c7
GPT partition flags:   1  0x1000000000000001
GPT start and size :   1  64  9889068
GPT partition name :   2  41007000700065006e006400650064003200
GPT partname local :   2  Appended2
GPT partition GUID :   2  84f4acc6b0c95b4191d99402cbea775e
GPT type GUID      :   2  28732ac11ff8d211ba4b00a0c93ec93b
GPT partition flags:   2  0x0000000000000000
GPT start and size :   2  9889132  10296
GPT partition name :   3  4700610070003100
GPT partname local :   3  Gap1
GPT partition GUID :   3  84f4acc6b0c95b4191d89402cbea775e
GPT type GUID      :   3  a2a0d0ebe5b9334487c068b6b72699c7
GPT partition flags:   3  0x1000000000000001
GPT start and size :   3  9899428  600
```
