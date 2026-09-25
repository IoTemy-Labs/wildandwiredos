#!/usr/bin/env python3
"""Build the Wild & Wired Field Guide: guides/fieldguide/*.md -> 1 HTML file.

  fieldguide.py <output.html>      build (lint first; fails on violations)
  fieldguide.py --lint             lint only

Why 1 file: Firefox ships as a Flatpak. Opening a local page hands Firefox
exactly that 1 file through the document portal, so links between separate
pages would break. Sections, CSS and navigation all live in the 1 file; the
fonts are the system's (Flatpak sees host fonts).

Markdown subset: "# " section title, "label: x" kicker line, "## " heading,
paragraphs, "1. " and "- " lists (indented "- " nests), fenced code,
`code`, **bold**, *italic*, bare https:// links.

Copy rules enforced (handoff): no em or en dashes, no exclamation marks,
numerals instead of number words, and none of the banned words."""

import html
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
SRC = REPO / "guides/fieldguide"

BANNED = ["weird", "hacker", "cyber", "wizard", "guru", "power user", "just",
          "simply", "obviously", "users"]
NUMBER_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]


def lint_text(name, lineno, text):
    problems = []
    prose = re.sub(r"`[^`]*`", "", text)          # inline code is exempt
    if "—" in prose or "–" in prose:
        problems.append("em or en dash")
    if "!" in prose:
        problems.append("exclamation mark")
    low = prose.lower()
    for w in BANNED:
        if re.search(rf"\b{re.escape(w)}\b", low):
            problems.append(f"banned word '{w}'")
    for w in NUMBER_WORDS:
        if re.search(rf"\b{w}\b", low):
            problems.append(f"number word '{w}' (use a numeral)")
    return [f"{name}:{lineno}: {p}" for p in problems]


def lint():
    errors = []
    for f in sorted(SRC.glob("*.md")):
        in_code = False
        for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            if line.startswith("```"):
                in_code = not in_code
                continue
            if not in_code:
                errors += lint_text(f.name, i, line)
    return errors


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*([^*]+)\*(?!\*)", r"<em>\1</em>", t)
    t = re.sub(r"(https://[^\s<]+[^\s<.,;:)])", r'<a href="\1">\1</a>', t)
    return t


def render(md, slug):
    out, para, lists, code = [], [], [], None
    title, label = "", ""

    def flush_para():
        if para:
            out.append(f"<p>{inline(' '.join(para))}</p>")
            para.clear()

    def close_lists(depth=0):
        while len(lists) > depth:
            out.append(f"</li></{lists.pop()}>")

    for raw in md.splitlines():
        if code is not None:
            if raw.startswith("```"):
                out.append(f"<pre><code>{html.escape(chr(10).join(code))}</code></pre>")
                code = None
            else:
                code.append(raw)
            continue
        if raw.startswith("```"):
            flush_para(); close_lists(); code = []
            continue
        m_ol = re.match(r"^(\s*)(\d+)\. (.*)", raw)
        m_ul = re.match(r"^(\s*)- (.*)", raw)
        if m_ol or m_ul:
            flush_para()
            indent, kind, text = (len(m_ol.group(1)), "ol", m_ol.group(3)) if m_ol else \
                                 (len(m_ul.group(1)), "ul", m_ul.group(2))
            depth = 1 + indent // 3
            if len(lists) < depth:
                out.append(f"<{kind}><li>")
                lists.append(kind)
            else:
                close_lists(depth)
                out.append("</li><li>")
            out.append(inline(text))
            continue
        if raw.startswith("# "):
            title = raw[2:].strip(); continue
        if raw.startswith("label: "):
            label = raw[7:].strip(); continue
        if raw.startswith("## "):
            flush_para(); close_lists()
            out.append(f"<h3>{inline(raw[3:].strip())}</h3>")
            continue
        if not raw.strip():
            flush_para(); close_lists()
            continue
        para.append(raw.strip())
    flush_para(); close_lists()
    body = "\n".join(out).replace("<ol><li>", "<ol><li>", 1)
    return title, label, (f'<section id="{slug}">\n<p class="kicker">{html.escape(label)}</p>\n'
                          f"<h2>{html.escape(title)}</h2>\n{body}\n</section>")


CSS = """
:root{--base:#073e45;--elev:#0a4f58;--well:#03252a;--body:#d6e9e7;--sec:#8fb3b2;
--mint:#40dfaf;--mint-hover:#6ce8c4;--focus:#8cefd0;--subtle:#0f5f63;--strong:#1a9d93}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--base);color:var(--body);
font:340 17px/1.68 "Source Sans 3","Source Sans Pro",sans-serif}
.layout{display:grid;grid-template-columns:260px minmax(0,760px);gap:48px;
max-width:1100px;margin:0 auto;padding:48px 32px}
nav{position:sticky;top:32px;align-self:start}
nav .brand{font:600 22px/1.1 Archivo,sans-serif;color:#fff;margin:0 0 4px}
nav .ver{font:500 11px/1.4 "JetBrains Mono",monospace;letter-spacing:.14em;
text-transform:uppercase;color:var(--mint);margin:0 0 24px}
nav ol{list-style:none;margin:0;padding:0;display:grid;gap:2px}
nav a{display:block;padding:10px 12px;border-radius:4px;color:var(--body);
text-decoration:none;border-left:3px solid transparent}
nav a:hover{background:rgba(64,223,175,.12)}
nav a:focus-visible,main a:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
section{background:var(--elev);border:1px solid var(--subtle);border-radius:6px;
padding:32px 40px;margin:0 0 32px}
.kicker{font:500 12px/1 "JetBrains Mono",monospace;letter-spacing:.14em;
text-transform:uppercase;color:var(--mint);margin:0 0 12px}
h2{font:700 34px/1.1 Archivo,sans-serif;letter-spacing:-.02em;color:#fff;margin:0 0 16px}
h3{font:600 22px/1.18 Archivo,sans-serif;letter-spacing:-.01em;color:#fff;margin:32px 0 8px}
a{color:var(--mint)} a:hover{color:var(--mint-hover)}
strong{font-weight:600;color:#fff}
code{font:500 15px/1.5 "JetBrains Mono",monospace;background:var(--well);
padding:1px 6px;border-radius:2px}
pre{background:var(--well);border:1px solid var(--subtle);border-radius:4px;
padding:14px 18px;overflow-x:auto;margin:12px 0;
box-shadow:inset 0 1px 0 rgba(3,37,42,.5)}
pre code{background:none;padding:0}
pre code::before{content:"$ ";color:var(--sec)}
ol,ul{padding-left:24px} li{margin:4px 0}
footer{color:#5f8887;font-size:14px;margin-top:16px}
@media (max-width:860px){.layout{grid-template-columns:1fr}nav{position:static}}
"""


def build(out_path, version="26.11", codename="Seneca"):
    errors = lint()
    if errors:
        sys.exit("Field Guide copy-rule violations:\n  " + "\n  ".join(errors))
    sections, nav = [], []
    for f in sorted(SRC.glob("*.md")):
        slug = re.sub(r"^\d+-", "", f.stem)
        title, label, sec = render(f.read_text(encoding="utf-8"), slug)
        sections.append(sec)
        nav.append(f'<li><a href="#{slug}">{html.escape(title)}</a></li>')
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Field Guide :: Wild &amp; Wired OS {version}</title>
<style>{CSS}</style>
</head>
<body>
<div class="layout">
<nav aria-label="Field Guide sections">
<p class="brand">Field Guide</p>
<p class="ver">Wild &amp; Wired OS v{version} :: {codename}</p>
<ol>
{chr(10).join(nav)}
</ol>
</nav>
<main>
{chr(10).join(sections)}
<footer>Wild &amp; Wired OS is built from Ubuntu 26.04 LTS. Not affiliated with or endorsed by Canonical.</footer>
</main>
</div>
</body>
</html>
"""
    out = Path(out_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8", newline="\n")
    out.chmod(0o644)
    return out


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--lint":
        errs = lint()
        print("\n".join(errs) if errs else "Field Guide lint: clean")
        sys.exit(1 if errs else 0)
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    print(f"Field Guide written: {build(sys.argv[1])}")
