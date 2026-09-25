// Wild & Wired OS default desktop layout.
// Interim: reuse Kubuntu's panel template, then swap the Kubuntu start
// icon and wallpaper for ours. The direction 1A panel replaces this in
// Phase 5.
/* global loadTemplate, desktopsForActivity, currentActivity, panels */

loadTemplate('org.kubuntu.desktop.defaultPanel');

const allPanels = panels();
for (let p = 0; p < allPanels.length; p++) {
  const kickoffs = allPanels[p].widgets('org.kde.plasma.kickoff');
  for (let k = 0; k < kickoffs.length; k++) {
    kickoffs[k].currentConfigGroup = ['General'];
    kickoffs[k].writeConfig('icon', 'wildwired-logo');
  }
}

const desktops = desktopsForActivity(currentActivity());
for (let d = 0; d < desktops.length; d++) {
  desktops[d].wallpaperPlugin = 'org.kde.image';
  desktops[d].currentConfigGroup = ['Wallpaper', 'org.kde.image', 'General'];
  desktops[d].writeConfig('Image', 'file:///usr/share/wallpapers/WildWired/');
  desktops[d].writeConfig('DynamicMode', 0);
}
