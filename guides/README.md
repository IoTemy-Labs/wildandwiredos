# guides/

Source for the text people read inside Wild & Wired OS.

| Path | Becomes |
|---|---|
| `fieldguide/*.md` | `/usr/share/wildwired/fieldguide.html`, the Field Guide (desktop icon, menu, Welcome Center button) |
| `oneclick-apps.json` | the "1-click apps" page in the Welcome Center, 1 entry per `oneclick` app in `manifests/flatpaks.txt` |
| `notes/` | working notes, not shipped |

Edit the Markdown, then check it:

```
python3 scripts/build/fieldguide.py --lint
```

The build runs the same lint and stops on any violation of the handoff copy
rules: no em or en dashes, no exclamation marks, numerals instead of number
words, and none of: weird, hacker, cyber, wizard, guru, power user, just,
simply, obviously, users. Write in the second person.

The Field Guide is 1 HTML file on purpose: Firefox is a Flatpak and can
only be handed a single local file, so links between separate pages would
break. Sections are anchors in that file; files are ordered by their number
prefix.
