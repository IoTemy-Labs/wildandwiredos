// Wild & Wired OS default desktop layout: direction 1A, Ridge & Hollow.
// Handoff panel: 48px, #03252a (Plasma style SVG), widget order left to
// right: kickoff, separator, icons-and-text task manager, spacer, system
// tray, two-line clock, peek handle (show desktop).
/* global Panel, desktopsForActivity, currentActivity */

const panel = new Panel;
panel.location = 'bottom';
panel.floating = 0;
panel.hiding = 'none';
panel.height = 48;

const kickoff = panel.addWidget('org.kde.plasma.kickoff');
kickoff.currentConfigGroup = ['Shortcuts'];
kickoff.writeConfig('global', 'Alt+F1');
kickoff.currentConfigGroup = ['General'];
kickoff.writeConfig('icon', 'wildwired-logo');
kickoff.writeConfig('showActionButtonCaptions', true);
kickoff.writeConfig('favoritesDisplay', 1);      // list rows, not a grid (handoff 48px rows)

panel.addWidget('org.kde.plasma.marginsseparator');

const tasks = panel.addWidget('org.kde.plasma.taskmanager');
tasks.currentConfigGroup = ['General'];
tasks.writeConfig('launchers', [
  'applications:org.kde.dolphin.desktop',
  'applications:org.mozilla.firefox.desktop',
  'applications:org.kde.discover.desktop'
]);

panel.addWidget('org.kde.plasma.panelspacer');
panel.addWidget('org.kde.plasma.systemtray');

// Two-line clock in the mono face: time over date.
const clock = panel.addWidget('org.kde.plasma.digitalclock');
clock.currentConfigGroup = ['Appearance'];
clock.writeConfig('showDate', true);
clock.writeConfig('dateDisplayFormat', 2);        // BelowTime
clock.writeConfig('dateFormat', 'custom');
clock.writeConfig('customDateFormat', 'MMM d yyyy');
clock.writeConfig('autoFontAndSize', false);
clock.writeConfig('fontFamily', 'JetBrains Mono');
clock.writeConfig('fontWeight', 500);
clock.writeConfig('fontSize', 11);

panel.addWidget('org.kde.plasma.showdesktop');

const desktops = desktopsForActivity(currentActivity());
for (let d = 0; d < desktops.length; d++) {
  desktops[d].wallpaperPlugin = 'org.kde.image';
  desktops[d].currentConfigGroup = ['Wallpaper', 'org.kde.image', 'General'];
  desktops[d].writeConfig('Image', 'file:///usr/share/wallpapers/WildWired/');
  desktops[d].writeConfig('DynamicMode', 0);
}
