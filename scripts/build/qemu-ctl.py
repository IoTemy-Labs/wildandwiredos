#!/usr/bin/env python3
"""Drive a running QEMU guest step by step over QMP, for tests that need a
look at the screen between actions (the installer). Pairs with
install-test.sh, which starts the guest.

  qemu-ctl.py <qmp.sock> shot <out.png>
  qemu-ctl.py <qmp.sock> key ctrl+alt+t [ret ...]
  qemu-ctl.py <qmp.sock> type "some text"
  qemu-ctl.py <qmp.sock> click <x> <y> <screen-w> <screen-h>
  qemu-ctl.py <qmp.sock> power
  qemu-ctl.py <qmp.sock> quit

Clicks need the usb-tablet device so coordinates are absolute. Pass the
size of the screenshot the coordinates were read from."""
import json
import os
import socket
import sys
import time

QCODE = {" ": "spc", "-": "minus", ".": "dot", "/": "slash", "=": "equal",
         ";": "semicolon", ",": "comma", "'": "apostrophe", "\\": "backslash",
         "[": "bracket_left", "]": "bracket_right", "`": "grave_accent"}
SHIFTED = {"_": "minus", ":": "semicolon", "!": "1", "@": "2", "#": "3", "$": "4",
           "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", "+": "equal",
           "|": "backslash", ">": "dot", "<": "comma", '"': "apostrophe",
           "?": "slash", "~": "grave_accent"}


def qmp(sock_path, cmds):
    s = socket.socket(socket.AF_UNIX)
    s.connect(sock_path)
    f = s.makefile("rw")
    f.readline()
    f.write(json.dumps({"execute": "qmp_capabilities"}) + "\n")
    f.flush()
    f.readline()
    out = []
    for c in cmds:
        f.write(json.dumps(c) + "\n")
        f.flush()
        while True:
            line = json.loads(f.readline())
            if "return" in line or "error" in line:   # skip async events
                out.append(line)
                break
    s.close()
    return out


def combo(sock_path, keys):
    r = qmp(sock_path, [{"execute": "send-key", "arguments": {
        "keys": [{"type": "qcode", "data": k} for k in keys]}}])
    if "error" in r[0]:
        sys.exit(f"send-key failed: {r[0]['error']}")


def type_text(sock_path, text):
    for ch in text:
        if ch.isalpha():
            keys = ["shift", ch.lower()] if ch.isupper() else [ch]
        elif ch.isdigit():
            keys = [ch]
        elif ch in QCODE:
            keys = [QCODE[ch]]
        elif ch in SHIFTED:
            keys = ["shift", SHIFTED[ch]]
        else:
            sys.exit(f"cannot type {ch!r}")
        combo(sock_path, keys)
        time.sleep(0.08)


def click(sock_path, x, y, w, h):
    ax, ay = int(x * 32767 / w), int(y * 32767 / h)
    move = [{"type": "abs", "data": {"axis": "x", "value": ax}},
            {"type": "abs", "data": {"axis": "y", "value": ay}}]
    btn = lambda down: {"type": "btn", "data": {"button": "left", "down": down}}
    send = lambda events: {"execute": "input-send-event", "arguments": {"events": events}}
    r = qmp(sock_path, [send(move)])
    time.sleep(0.2)
    r += qmp(sock_path, [send([btn(True)])])
    time.sleep(0.1)
    r += qmp(sock_path, [send([btn(False)])])
    for line in r:
        if "error" in line:
            sys.exit(f"click failed: {line['error']}")


def shot(sock_path, png):
    ppm = png + ".ppm"
    r = qmp(sock_path, [{"execute": "screendump", "arguments": {"filename": ppm}}])
    if "error" in r[0]:
        sys.exit(f"screendump failed: {r[0]['error']}")
    time.sleep(0.5)
    from PIL import Image
    im = Image.open(ppm)
    im.save(png)
    os.unlink(ppm)
    print(f"{png} {im.size[0]}x{im.size[1]}")


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sock_path, cmd, args = sys.argv[1], sys.argv[2], sys.argv[3:]
    if cmd == "shot":
        shot(sock_path, args[0])
    elif cmd == "key":
        for a in args:
            combo(sock_path, a.split("+"))
            time.sleep(0.3)
    elif cmd == "type":
        type_text(sock_path, " ".join(args))
    elif cmd == "click":
        click(sock_path, *[int(v) for v in args])
    elif cmd == "power":
        qmp(sock_path, [{"execute": "system_powerdown"}])
    elif cmd == "quit":
        qmp(sock_path, [{"execute": "quit"}])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
