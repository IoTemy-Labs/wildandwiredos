# Beginner failure modes (input for the Field Guide, Phase 6)

Logged while building Phase 4. Each one gets a guide page or a troubleshooting entry, written in second person, no jargon first.

1. **Double-clicking an AppImage does nothing.**
   Causes: file not executable; libfuse2 missing (we ship it); no handler registered. What we did: `/etc/xdg/mimeapps.list` routes `application/vnd.appimage` to the AppImage manager, so the double-click opens an "add this app" flow instead of silence. Guide page: "You downloaded an AppImage. Now what."
2. **Discover shows no Flatpak apps / "no backend".**
   Causes: `plasma-discover-backend-flatpak` missing, or the Flathub remote gone. What we did: backend installed, Flathub added system-wide, a first-boot service re-adds it if missing. Guide entry: how to check Settings > Sources in Discover, and the one line that fixes it.
3. **App installed but missing from the menu.**
   Causes: Flatpak exports not on the session's XDG_DATA_DIRS until next login; AppImage run directly instead of integrated; menu cache stale. Guide entry: log out and back in; use the manager to integrate; search with Meta (the menu search) by name.
4. **"Permission denied" or a permission prompt from a Flatpak.**
   Cause: the sandbox. Guide page explains what a sandbox is, what a portal prompt means, and Flatseal for overrides.
5. **The venue Wi-Fi is saturated; Discover spins forever.**
   Guide entry: everything preinstalled works offline; one-click tiles need a connection; how to tell the difference.
