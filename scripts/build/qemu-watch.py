#!/usr/bin/env python3
"""Watch a QEMU guest over QMP: screendump every 20 s, convert to PNG,
report how much of the screen is non-black. Exits 0 if the final screenshot
has meaningful content (>5% non-black pixels), 1 otherwise. The screenshots
are the real deliverable — a human confirms the desktop looks right.

Optional 4th argument: a key schedule, "SECONDS=KEYS,..." where KEYS is
QEMU qcodes joined by "+", pressed together. Example:
"90=alt+f4,110=meta_l" closes the welcome window, then opens the menu.
KEYS may also be "type:TEXT" to type TEXT one character at a time
(letters, digits, space and - . / _ : = only).
Each key combo fires just before the first screenshot at or after its time."""
import json, os, socket, subprocess, sys, time

sock_path, run_dir, timeout = sys.argv[1], sys.argv[2], int(sys.argv[3])
schedule = []
if len(sys.argv) > 4 and sys.argv[4]:
    for item in sys.argv[4].split(","):
        at, combo = item.split("=", 1)
        schedule.append((int(at), combo))
    schedule.sort()
INTERVAL = int(os.environ.get("WWWV_SHOT_INTERVAL", "20"))  # seconds between screenshots

def qmp(cmds):
    s = socket.socket(socket.AF_UNIX)
    s.connect(sock_path)
    f = s.makefile("rw")
    f.readline()                                  # greeting
    f.write(json.dumps({"execute": "qmp_capabilities"}) + "\n"); f.flush()
    f.readline()
    out = []
    for c in cmds:
        f.write(json.dumps(c) + "\n"); f.flush()
        out.append(f.readline())
    s.close()
    return out

QCODE = {" ": "spc", "-": "minus", ".": "dot", "/": "slash", "=": "equal",
         ";": "semicolon"}
SHIFTED = {"_": "minus", ":": "semicolon"}

def text_to_combos(text):
    combos = []
    for ch in text:
        if ch.isalpha():
            combos.append(["shift", ch.lower()] if ch.isupper() else [ch])
        elif ch.isdigit():
            combos.append([ch])
        elif ch in QCODE:
            combos.append([QCODE[ch]])
        elif ch in SHIFTED:
            combos.append(["shift", SHIFTED[ch]])
        else:
            raise SystemExit(f"cannot type {ch!r}")
    return combos

def send_combo(keys):
    qmp([{"execute": "send-key", "arguments": {"keys": [{"type": "qcode", "data": k} for k in keys]}}])

def analyze(ppm):
    try:
        from PIL import Image
        im = Image.open(ppm).convert("L")
        px = list(im.getdata())
        lit = sum(1 for p in px if p > 24)
        frac = lit / len(px)
        im2 = Image.open(ppm)
        im2.save(ppm.replace(".ppm", ".png"))
        os.unlink(ppm)
        return frac
    except Exception as e:
        print(f"analyze failed: {e}", file=sys.stderr)
        return -1.0

start = time.time()
n = 0
last_frac = -1.0
while time.time() - start < timeout:
    time.sleep(INTERVAL)
    n += 1
    while schedule and time.time() - start >= schedule[0][0]:
        at, combo = schedule.pop(0)
        try:
            if combo.startswith("type:"):
                for keys in text_to_combos(combo[5:]):
                    send_combo(keys); time.sleep(0.12)
            else:
                send_combo(combo.split("+"))
            print(f"[{int(time.time()-start):4d}s] sent keys: {combo}")
        except Exception as e:
            print(f"send-key failed: {e}", file=sys.stderr)
        time.sleep(3)
    ppm = os.path.join(run_dir, f"shot-{n:02d}.ppm")
    try:
        qmp([{"execute": "screendump", "arguments": {"filename": ppm}}])
    except Exception as e:
        print(f"QMP failed (guest dead?): {e}", file=sys.stderr)
        sys.exit(1)
    time.sleep(1)
    if os.path.exists(ppm):
        last_frac = analyze(ppm)
        print(f"[{int(time.time()-start):4d}s] shot-{n:02d}: {last_frac*100:.1f}% lit")

print(f"final: {last_frac*100:.1f}% of pixels lit")
sys.exit(0 if last_frac > 0.05 else 1)
