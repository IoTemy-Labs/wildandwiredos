# When something is off

label: troubleshooting

## Discover shows no apps from Flathub

Open Discover, select **Settings**, and check that **Flathub** is listed under sources. If it is missing, open the terminal and run:

```
sudo flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

Then close and reopen Discover.

## An app you installed is not in the menu

Log out and back in. New Flatpak apps appear in the menu after your next login. You can also press the Windows key and type the app's name.

For an AppImage, open it once with Gear Lever and choose **Move to the app menu**.

## An app asks for permission, or says permission denied

That is the Flatpak sandbox doing its job. A request for a file or device is a prompt you can accept. If an app keeps failing to reach something you want it to use, open **Flatseal**, pick the app, and turn on the access it needs.

## Discover spins and never finishes

The venue Wi-Fi is busy. Everything already installed keeps working offline. 1-click apps need a connection, so try again at home or on a phone hotspot.

## The screen looks wrong or stays black when starting

Restart and choose **Wild & Wired OS (safe graphics)** from the boot menu. If that works, the installed system can use the same fix; ask at the help desk or on the website.
