/* @ds-bundle: {"format":4,"namespace":"RootAccessWildAmpWiredWV_8d8536","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"LogoWordmark","sourcePath":"components/brand/Logo.jsx"},{"name":"SectionMarker","sourcePath":"components/brand/SectionMarker.jsx"},{"name":"SessionRow","sourcePath":"components/brand/SessionRow.jsx"},{"name":"TerminalBlock","sourcePath":"components/brand/TerminalBlock.jsx"},{"name":"AsciiRule","sourcePath":"components/core/AsciiRule.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Kbd","sourcePath":"components/core/Kbd.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"assets/lucide-icon.js":"352b9411594f","components/brand/Logo.jsx":"11f56460c3c0","components/brand/SectionMarker.jsx":"da641b405191","components/brand/SessionRow.jsx":"dc37158d6631","components/brand/TerminalBlock.jsx":"fb992ea8d324","components/core/AsciiRule.jsx":"c53d0f73e3f8","components/core/Badge.jsx":"d7130ada88d8","components/core/Button.jsx":"db35f0a361bd","components/core/Card.jsx":"0ee44b53b7cc","components/core/IconButton.jsx":"caf9ccc56ad0","components/core/Kbd.jsx":"3f48011decce","components/core/Tag.jsx":"71bdcd8d2927","components/feedback/Callout.jsx":"7262a076b1c0","components/feedback/Dialog.jsx":"7406be685be3","components/feedback/Toast.jsx":"5c4df5823b97","components/feedback/Tooltip.jsx":"3df2a58b49ca","components/forms/Checkbox.jsx":"dbc9e6339fea","components/forms/Field.jsx":"a104e560096b","components/forms/Input.jsx":"1f18da163b28","components/forms/Radio.jsx":"55d30f22b59c","components/forms/Select.jsx":"187c4ead5dad","components/forms/Switch.jsx":"af5f79ebf533","components/forms/Textarea.jsx":"59afafa0b4ec","components/navigation/Breadcrumb.jsx":"f42e405f5445","components/navigation/Tabs.jsx":"42d8bc52de4c","ui_kits/festival-site/App.jsx":"4efb45c6f06d","ui_kits/festival-site/HomeScreen.jsx":"18927f0044e8","ui_kits/festival-site/RegisterScreen.jsx":"f75d9e830172","ui_kits/festival-site/ScheduleScreen.jsx":"361d6434155d","ui_kits/festival-site/SessionScreen.jsx":"688d1e360700","ui_kits/festival-site/Shell.jsx":"1ad72f78164f","ui_kits/program/ProgramApp.jsx":"cd2449b4355d","ui_kits/program/ProgramView.jsx":"60b2832eb333","ui_kits/program/Sidebar.jsx":"e6f858f2f52b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RootAccessWildAmpWiredWV_8d8536 = window.RootAccessWildAmpWiredWV_8d8536 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/lucide-icon.js
try { (() => {
/* Root Access icon helper.
   Iconography is Lucide, loaded from CDN. See readme.md > ICONOGRAPHY.
   Usage in a card or kit:  <LucideIcon name="terminal" size={16} /> */
(function () {
  function LucideIcon(props) {
    var name = props.name,
      size = props.size || 16,
      color = props.color || "currentColor",
      sw = props.strokeWidth || 1.75;
    var ref = React.useRef(null);
    React.useEffect(function () {
      var el = ref.current;
      if (!el || !window.lucide) return;
      el.innerHTML = "";
      var span = document.createElement("span");
      span.setAttribute("data-lucide", name);
      el.appendChild(span);
      try {
        window.lucide.createIcons({
          nameAttr: "data-lucide",
          root: el
        });
      } catch (e) {
        try {
          window.lucide.createIcons();
        } catch (e2) {}
      }
      var svg = el.querySelector("svg");
      if (svg) {
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("stroke", color);
        svg.setAttribute("stroke-width", sw);
        svg.style.display = "block";
      }
    }, [name, size, color, sw]);
    return React.createElement("span", {
      ref: ref,
      "aria-hidden": "true",
      style: Object.assign({
        display: "inline-flex",
        width: size,
        height: size,
        flex: "0 0 auto"
      }, props.style)
    });
  }
  window.LucideIcon = LucideIcon;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/lucide-icon.js", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Asset paths resolve relative to the page that mounts the component.
   Override with `base` when your page is not at the project root. */
const FILES = {
  icon: "assets/logo-icon.png",
  stacked: "assets/logo-stacked.png",
  lockup: "assets/logo-lockup.png"
};
function Logo({
  variant = "icon",
  height = 48,
  plate = "auto",
  base = "",
  alt = "Wild and Wired West Virginia",
  style,
  ...rest
}) {
  const src = (base ? base.replace(/\/$/, "") + "/" : "") + FILES[variant];
  /* Minimum legible heights for the raster artwork. Below these the tagline
     and the circuit lettering turn to mush, so fall back rather than shrink. */
  const MIN = {
    icon: 20,
    stacked: 72,
    lockup: 64
  };
  if (height < MIN[variant]) {
    if (variant === "lockup" && height >= MIN.stacked) variant = "stacked";else if (variant !== "icon") {
      return /*#__PURE__*/React.createElement(LogoWordmark, _extends({
        size: Math.max(14, Math.round(height * 0.42)),
        style: style
      }, rest));
    }
  }
  /* The supplied lockups contain navy and mid teal artwork that fails on the
     dark base, so anything with type in it sits on a light plate. */
  const needsPlate = plate === true || plate === "auto" && variant !== "icon";
  const img = /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      height,
      width: "auto",
      display: "block"
    }
  });
  if (!needsPlate) return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      ...style
    }
  }, rest), img);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: variant === "stacked" ? "var(--space-5)" : "var(--space-4) var(--space-6)",
      background: "var(--logo-plate)",
      borderRadius: "var(--radius-3)",
      border: "1px solid rgba(18,131,123,.25)",
      ...style
    }
  }, rest), img);
}

/** Type-only mark for places a raster lockup cannot go: tight headers, favicons, print rules. */
function LogoWordmark({
  size = 20,
  tone = "accent",
  style,
  ...rest
}) {
  const accent = tone === "accent" ? "var(--mint-500)" : "var(--text-max)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: "0.4em",
      font: "var(--weight-display) " + size + "px/1 var(--font-display)",
      letterSpacing: "var(--track-display)",
      color: "var(--text-max)",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, "Wild"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, "&"), /*#__PURE__*/React.createElement("span", null, "Wired"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-mono) " + Math.round(size * 0.5) + "px/1 var(--font-mono)",
      letterSpacing: "var(--track-label)",
      color: "var(--text-muted)"
    }
  }, "WV"));
}
Object.assign(__ds_scope, { Logo, LogoWordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionMarker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionMarker({
  index,
  label,
  title,
  description,
  align = "left",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--mint-500)"
    }
  }, index !== undefined ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--border-strong)"
    }
  }, String(index).padStart(2, "0")) : null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--border-strong)"
    }
  }, "/"), label), title ? /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: "var(--type-h2)",
      color: "var(--text-max)",
      letterSpacing: "var(--track-heading)"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-lede)",
      color: "var(--text-muted)",
      maxWidth: "var(--measure)"
    }
  }, description) : null);
}
Object.assign(__ds_scope, { SectionMarker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionMarker.jsx", error: String((e && e.message) || e) }); }

// components/brand/SessionRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function SessionRow({
  time,
  duration,
  title,
  speaker,
  track,
  level,
  room,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "grid",
      gridTemplateColumns: "92px 1fr auto",
      gap: "var(--space-6)",
      alignItems: "start",
      padding: "var(--space-5) var(--space-6)",
      background: selected ? "rgba(64,223,175,.08)" : hover ? "var(--surface-card-hover)" : "var(--surface-card)",
      borderLeft: "2px solid " + (selected ? "var(--mint-500)" : "transparent"),
      borderBottom: "1px solid var(--border-subtle)",
      cursor: onClick ? "pointer" : "default",
      transition: "var(--transition-control)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-mono) var(--size-xs)/1.4 var(--font-mono)",
      color: "var(--text-body)"
    }
  }, time, duration ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-muted)",
      fontSize: "var(--size-3xs)"
    }
  }, duration) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-body-strong) var(--size-md)/1.35 var(--font-body)",
      color: "var(--text-max)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-4)",
      marginTop: "var(--space-2)",
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      letterSpacing: "0.06em",
      color: "var(--text-muted)",
      textTransform: "uppercase"
    }
  }, speaker ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-body)",
      textTransform: "none",
      letterSpacing: 0,
      font: "var(--type-small)",
      fontSize: "var(--size-xs)"
    }
  }, speaker) : null, track ? /*#__PURE__*/React.createElement("span", null, track) : null, room ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--border-strong)"
    }
  }, "\xB7"), " ", room) : null)), level ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "0 0 auto",
      whiteSpace: "nowrap",
      padding: "3px var(--space-3)",
      borderRadius: "var(--radius-1)",
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: level === "beginner" ? "var(--status-ok-fg)" : "var(--text-muted)",
      background: level === "beginner" ? "var(--status-ok-bg)" : "var(--status-neutral-bg)",
      border: "1px solid " + (level === "beginner" ? "rgba(64,223,175,.35)" : "var(--border-subtle)")
    }
  }, level) : null);
}
Object.assign(__ds_scope, { SessionRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SessionRow.jsx", error: String((e && e.message) || e) }); }

// components/brand/TerminalBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TerminalBlock({
  title = null,
  lines = [],
  prompt = "$",
  cursor = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-well)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-3)",
      overflow: "hidden",
      ...style
    }
  }, rest), title ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      padding: "var(--space-3) var(--space-5)",
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(18,131,123,.10)",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--border-strong)"
    }
  }, "\u25AE"), title) : null, /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: "var(--space-5)",
      font: "var(--type-code)",
      lineHeight: "var(--leading-mono)",
      color: "var(--text-body)",
      whiteSpace: "pre-wrap",
      overflowX: "auto"
    }
  }, lines.map((raw, i) => {
    const isCmd = typeof raw === "string" ? raw.startsWith("$ ") || raw.startsWith("# ") : raw.type === "cmd";
    const text = typeof raw === "string" ? raw.replace(/^[$#] /, "") : raw.text;
    const tone = typeof raw === "object" ? raw.tone : undefined;
    const color = isCmd ? "var(--text-max)" : tone === "ok" ? "var(--mint-500)" : tone === "muted" ? "var(--text-muted)" : "var(--text-body)";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: "0.6em",
        color
      }
    }, isCmd ? /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: "var(--mint-500)",
        flex: "0 0 auto"
      }
    }, prompt) : /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flex: "0 0 auto",
        visibility: "hidden"
      }
    }, prompt), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0
      }
    }, text));
  }), cursor ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "0.6em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--mint-500)"
    }
  }, prompt), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: "0.6em",
      height: "1.1em",
      background: "var(--mint-500)",
      display: "inline-block",
      animation: "ra-blink var(--cursor-blink) steps(2,end) infinite"
    }
  }), /*#__PURE__*/React.createElement("style", null, "@keyframes ra-blink{0%,49%{opacity:1}50%,100%{opacity:0}}")) : null));
}
Object.assign(__ds_scope, { TerminalBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/TerminalBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/AsciiRule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const GLYPHS = {
  solid: "─",
  double: "═",
  dash: "╌",
  dot: "·",
  equals: "="
};
function AsciiRule({
  variant = "solid",
  label = null,
  tone = "structure",
  style,
  ...rest
}) {
  const ch = GLYPHS[variant] || GLYPHS.solid;
  const color = tone === "accent" ? "var(--mint-500)" : "var(--rule-ascii)";
  const line = /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: 1,
      overflow: "hidden",
      whiteSpace: "nowrap",
      color,
      font: "var(--weight-mono) var(--size-xs)/1 var(--font-mono)",
      userSelect: "none"
    }
  }, ch.repeat(400));
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)",
      ...style
    }
  }, rest), line, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: tone === "accent" ? "var(--mint-500)" : "var(--text-muted)",
      flex: "0 0 auto"
    }
  }, label) : null, label ? line : null);
}
Object.assign(__ds_scope, { AsciiRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/AsciiRule.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  accent: {
    color: "var(--status-ok-fg)",
    background: "var(--status-ok-bg)",
    border: "1px solid rgba(64,223,175,.35)"
  },
  neutral: {
    color: "var(--status-neutral-fg)",
    background: "var(--status-neutral-bg)",
    border: "1px solid var(--border-subtle)"
  },
  attention: {
    color: "var(--status-attention-fg)",
    background: "var(--status-attention-bg)",
    border: "1px solid var(--status-attention-border)"
  },
  solid: {
    color: "var(--text-on-accent)",
    background: "var(--mint-500)",
    border: "1px solid transparent"
  },
  outline: {
    color: "var(--text-body)",
    background: "transparent",
    border: "1px solid var(--border-default)"
  }
};
function Badge({
  tone = "neutral",
  dot = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "3px var(--space-3)",
      borderRadius: "var(--radius-1)",
      whiteSpace: "nowrap",
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      ...(TONES[tone] || TONES.neutral),
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 999,
      background: "currentColor",
      flex: "0 0 auto"
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: {
    height: "var(--control-h-sm)",
    padding: "0 var(--space-4)",
    font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
    track: "var(--track-label)"
  },
  md: {
    height: "var(--control-h-md)",
    padding: "0 var(--space-6)",
    font: "var(--weight-mono) var(--size-xs)/1 var(--font-mono)",
    track: "var(--track-label)"
  },
  lg: {
    height: "var(--control-h-lg)",
    padding: "0 var(--space-8)",
    font: "var(--weight-mono) var(--size-sm)/1 var(--font-mono)",
    track: "0.1em"
  }
};
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  block = false,
  icon = null,
  iconEnd = null,
  as = "button",
  href,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const skins = {
    primary: {
      background: down ? "var(--mint-600)" : hover ? "var(--mint-400)" : "var(--mint-500)",
      color: "var(--text-on-accent)",
      border: "1px solid transparent"
    },
    secondary: {
      background: down ? "var(--teal-600)" : hover ? "var(--teal-600)" : "transparent",
      color: hover ? "var(--text-max)" : "var(--text-body)",
      border: "1px solid " + (hover ? "var(--border-strong)" : "var(--border-default)")
    },
    ghost: {
      background: hover ? "rgba(64,223,175,.10)" : "transparent",
      color: hover ? "var(--mint-400)" : "var(--text-accent)",
      border: "1px solid transparent"
    },
    danger: {
      background: hover ? "rgba(255,255,255,.10)" : "transparent",
      color: "var(--text-max)",
      border: "1px solid var(--ink-000)"
    }
  };
  const skin = skins[variant] || skins.primary;
  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-3)",
    minHeight: s.height,
    height: s.height,
    padding: s.padding,
    font: s.font,
    letterSpacing: s.track,
    textTransform: "uppercase",
    borderRadius: "var(--radius-2)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "var(--transition-control)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    transform: down && !disabled ? "translateY(1px)" : "none",
    ...skin,
    ...(disabled ? {
      background: variant === "primary" ? "var(--mint-700)" : "transparent",
      color: "var(--text-disabled)",
      border: "1px solid var(--border-subtle)",
      opacity: 0.7
    } : null),
    ...style
  };
  const Tag = href ? "a" : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: base,
    "aria-disabled": disabled || undefined,
    disabled: Tag === "button" ? disabled : undefined,
    onClick: disabled ? e => e.preventDefault() : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false)
  }, rest), icon, children, iconEnd);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Card({
  elevated = false,
  interactive = false,
  accent = false,
  padding = "var(--space-7)",
  header = null,
  footer = null,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = interactive && hover;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: lit ? "var(--surface-card-hover)" : elevated ? "var(--surface-card)" : "var(--surface-card)",
      border: "1px solid " + (accent ? "var(--border-accent)" : lit ? "var(--border-strong)" : "var(--border-subtle)"),
      borderRadius: "var(--radius-3)",
      boxShadow: elevated ? "var(--shadow-2)" : "var(--shadow-1)",
      transition: "var(--transition-control),box-shadow var(--dur-base) var(--ease-out)",
      cursor: interactive ? "pointer" : undefined,
      overflow: "hidden",
      ...style
    }
  }, rest), header ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-4) " + padding,
      borderBottom: "1px solid var(--border-subtle)",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, header) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-4) " + padding,
      borderTop: "1px solid var(--border-subtle)",
      background: "rgba(3,37,42,.35)",
      font: "var(--type-small)",
      color: "var(--text-muted)"
    }
  }, footer) : null);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SZ = {
  sm: 32,
  md: 40,
  lg: 48
};
function IconButton({
  label,
  size = "md",
  variant = "secondary",
  disabled = false,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const px = SZ[size] || SZ.md;
  const skins = {
    secondary: {
      background: hover ? "var(--teal-600)" : "transparent",
      border: "1px solid " + (hover ? "var(--border-strong)" : "var(--border-default)"),
      color: hover ? "var(--text-max)" : "var(--text-body)"
    },
    ghost: {
      background: hover ? "rgba(64,223,175,.10)" : "transparent",
      border: "1px solid transparent",
      color: hover ? "var(--mint-400)" : "var(--text-muted)"
    },
    solid: {
      background: hover ? "var(--mint-400)" : "var(--mint-500)",
      border: "1px solid transparent",
      color: "var(--text-on-accent)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: px,
      height: px,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-2)",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "var(--transition-control)",
      padding: 0,
      ...(skins[variant] || skins.secondary),
      ...(disabled ? {
        color: "var(--text-disabled)",
        border: "1px solid var(--border-subtle)",
        background: "transparent"
      } : null),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Kbd.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Kbd({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("kbd", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 22,
      height: 22,
      padding: "0 6px",
      background: "var(--surface-sunken)",
      color: "var(--text-body)",
      border: "1px solid var(--border-default)",
      borderBottomWidth: 2,
      borderRadius: "var(--radius-2)",
      font: "var(--weight-mono) var(--size-3xs)/1 var(--font-mono)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Kbd });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Kbd.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Tag({
  selected = false,
  removable = false,
  onRemove,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      minHeight: 28,
      padding: "0 var(--space-4)",
      borderRadius: "var(--radius-pill)",
      whiteSpace: "nowrap",
      font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
      letterSpacing: "0.06em",
      cursor: onClick ? "pointer" : "default",
      transition: "var(--transition-control)",
      background: selected ? "var(--mint-500)" : hover && onClick ? "var(--teal-600)" : "transparent",
      color: selected ? "var(--text-on-accent)" : "var(--text-body)",
      border: "1px solid " + (selected ? "transparent" : "var(--border-default)"),
      ...style
    }
  }, rest), children, removable ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove && onRemove();
    },
    style: {
      all: "unset",
      cursor: "pointer",
      lineHeight: 1,
      fontSize: 14,
      opacity: 0.75
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  info: {
    border: "var(--border-default)",
    marker: "var(--teal-400)",
    sigil: "::"
  },
  accent: {
    border: "var(--mint-500)",
    marker: "var(--mint-500)",
    sigil: "->"
  },
  attention: {
    border: "var(--ink-000)",
    marker: "var(--ink-000)",
    sigil: "!!"
  },
  command: {
    border: "var(--border-subtle)",
    marker: "var(--mint-500)",
    sigil: "$"
  }
};
function Callout({
  tone = "info",
  title,
  icon = null,
  children,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      gap: "var(--space-5)",
      padding: "var(--space-5) var(--space-6)",
      background: "var(--surface-card)",
      borderLeft: "var(--stroke-marker) solid " + t.marker,
      border: "1px solid var(--border-subtle)",
      borderLeftWidth: "var(--stroke-marker)",
      borderLeftColor: t.marker,
      borderRadius: "0 var(--radius-3) var(--radius-3) 0",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: "0 0 auto",
      color: t.marker,
      font: "var(--weight-mono) var(--size-sm)/1.5 var(--font-mono)"
    }
  }, icon || t.sigil), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-body-strong) var(--size-sm)/1.4 var(--font-body)",
      color: "var(--text-max)",
      marginBottom: "var(--space-2)"
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, children)));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Dialog({
  open = false,
  title,
  kicker,
  onClose,
  footer = null,
  width = 520,
  children,
  style,
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-8)",
      background: "rgba(3,37,42,.72)",
      backdropFilter: "blur(3px)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: width,
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-4)",
      boxShadow: "var(--shadow-4)",
      overflow: "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-5)",
      padding: "var(--space-6) var(--space-7)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, kicker ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--mint-500)",
      marginBottom: "var(--space-2)"
    }
  }, kicker) : null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: "var(--type-h3)",
      color: "var(--text-max)"
    }
  }, title)), onClose ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Close",
    onClick: onClose,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--text-muted)",
      font: "var(--type-code)",
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-7)"
    }
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "var(--space-4)",
      padding: "var(--space-5) var(--space-7)",
      borderTop: "1px solid var(--border-subtle)",
      background: "rgba(3,37,42,.35)"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Toast({
  tone = "neutral",
  title,
  action = null,
  onClose,
  children,
  style,
  ...rest
}) {
  const bar = tone === "accent" ? "var(--mint-500)" : tone === "attention" ? "var(--ink-000)" : "var(--teal-400)";
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-5)",
      minWidth: 300,
      maxWidth: 440,
      padding: "var(--space-5)",
      background: "var(--teal-700)",
      border: "1px solid var(--border-default)",
      borderTop: "2px solid " + bar,
      borderRadius: "var(--radius-3)",
      boxShadow: "var(--shadow-3)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: tone === "accent" ? "var(--mint-500)" : "var(--text-muted)",
      marginBottom: "var(--space-2)"
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, children)), action, onClose ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onClose,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--text-muted)",
      font: "var(--type-code)",
      lineHeight: 1,
      padding: 2
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Tooltip({
  content,
  placement = "top",
  children,
  style,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const pos = {
    top: {
      bottom: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    bottom: {
      top: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    left: {
      right: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)"
    },
    right: {
      left: "calc(100% + 8px)",
      top: "50%",
      transform: "translateY(-50%)"
    }
  }[placement];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      ...pos,
      zIndex: 40,
      opacity: open ? 1 : 0,
      visibility: open ? "visible" : "hidden",
      transition: "opacity var(--dur-fast) var(--ease-out)",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      background: "var(--teal-1000)",
      color: "var(--text-body)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-2)",
      padding: "var(--space-2) var(--space-4)",
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      boxShadow: "var(--shadow-2)"
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  onChange,
  style,
  ...rest
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "flex-start",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: "0 0 auto",
      width: 18,
      height: 18,
      marginTop: 2,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: on ? "var(--mint-500)" : "var(--surface-sunken)",
      border: "1px solid " + (on ? "var(--mint-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-1)",
      color: "var(--text-on-accent)",
      font: "700 12px/1 var(--font-mono)",
      transition: "var(--transition-control)"
    }
  }, indeterminate ? "–" : checked ? "✓" : ""), label || description ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, label), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      fontSize: "var(--size-xs)",
      color: "var(--text-muted)"
    }
  }, description) : null) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
const {
  useState
} = React;
function Field({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      display: "flex",
      gap: "var(--space-2)"
    }
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mint-500)"
    }
  }, "*") : null) : null, children, error ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-small)",
      color: "var(--text-max)",
      display: "flex",
      gap: "var(--space-3)",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      font: "var(--type-code)",
      color: "var(--ink-000)"
    }
  }, "!"), error) : hint ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-small)",
      color: "var(--text-muted)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Input({
  size = "md",
  invalid = false,
  disabled = false,
  prefix = null,
  suffix = null,
  mono = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const h = size === "sm" ? "var(--control-h-sm)" : size === "lg" ? "var(--control-h-lg)" : "var(--control-h-md)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      height: h,
      padding: "0 var(--space-4)",
      background: "var(--surface-sunken)",
      border: "1px solid " + (invalid ? "var(--ink-000)" : focus ? "var(--mint-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-2)",
      boxShadow: focus ? "var(--focus-shadow)" : "var(--inset-well)",
      transition: "var(--transition-control)",
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, prefix ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "flex",
      flex: "0 0 auto"
    }
  }, prefix) : null, /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      height: "100%",
      color: disabled ? "var(--text-disabled)" : "var(--text-body)",
      font: mono ? "var(--type-code)" : "var(--type-small)",
      cursor: disabled ? "not-allowed" : "text"
    }
  }, rest)), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "flex",
      flex: "0 0 auto"
    }
  }, suffix) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  checked = false,
  disabled = false,
  label,
  description,
  name,
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "flex-start",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: "0 0 auto",
      width: 18,
      height: 18,
      marginTop: 2,
      borderRadius: 999,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--surface-sunken)",
      border: "1px solid " + (checked ? "var(--mint-500)" : "var(--border-default)"),
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: checked ? "var(--mint-500)" : "transparent"
    }
  })), label || description ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, label), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      fontSize: "var(--size-xs)",
      color: "var(--text-muted)"
    }
  }, description) : null) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Select({
  options = [],
  size = "md",
  disabled = false,
  invalid = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const h = size === "sm" ? "var(--control-h-sm)" : size === "lg" ? "var(--control-h-lg)" : "var(--control-h-md)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      width: "100%",
      height: h,
      padding: "0 var(--space-9) 0 var(--space-4)",
      background: "var(--surface-sunken)",
      color: disabled ? "var(--text-disabled)" : "var(--text-body)",
      font: "var(--type-small)",
      border: "1px solid " + (invalid ? "var(--ink-000)" : focus ? "var(--mint-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-2)",
      boxShadow: focus ? "var(--focus-shadow)" : "var(--inset-well)",
      outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "var(--transition-control)"
    }
  }, rest), options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v,
      style: {
        background: "#0a4f58",
        color: "#d6e9e7"
      }
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: "var(--space-4)",
      pointerEvents: "none",
      color: "var(--border-strong)",
      font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)"
    }
  }, "\u25BE"));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  disabled = false,
  label,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      gap: "var(--space-4)",
      alignItems: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 40,
      height: 22,
      flex: "0 0 auto",
      padding: 2,
      display: "inline-flex",
      alignItems: "center",
      background: checked ? "var(--mint-500)" : "var(--surface-sunken)",
      border: "1px solid " + (checked ? "var(--mint-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-pill)",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 999,
      background: checked ? "var(--teal-800)" : "var(--border-strong)",
      transform: checked ? "translateX(18px)" : "translateX(0)",
      transition: "transform var(--dur-fast) var(--ease-out)"
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Textarea({
  rows = 4,
  invalid = false,
  disabled = false,
  mono = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      padding: "var(--space-4)",
      background: "var(--surface-sunken)",
      color: disabled ? "var(--text-disabled)" : "var(--text-body)",
      font: mono ? "var(--type-code)" : "var(--type-small)",
      border: "1px solid " + (invalid ? "var(--ink-000)" : focus ? "var(--mint-500)" : "var(--border-default)"),
      borderRadius: "var(--radius-2)",
      boxShadow: focus ? "var(--focus-shadow)" : "var(--inset-well)",
      outline: "none",
      resize: "vertical",
      transition: "var(--transition-control)",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Breadcrumb({
  items = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "Breadcrumb",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      flexWrap: "wrap",
      font: "var(--weight-mono) var(--size-2xs)/1.4 var(--font-mono)",
      ...style
    }
  }, rest), items.map((it, i) => {
    const last = i === items.length - 1;
    const label = typeof it === "string" ? it : it.label;
    const href = typeof it === "object" ? it.href : undefined;
    return /*#__PURE__*/React.createElement("span", {
      key: label + i,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-3)"
      }
    }, href && !last ? /*#__PURE__*/React.createElement("a", {
      href: href,
      style: {
        color: "var(--text-muted)",
        textDecoration: "none",
        borderBottom: "1px solid transparent"
      }
    }, label) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: last ? "var(--text-body)" : "var(--text-muted)"
      }
    }, label), !last ? /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: "var(--border-strong)"
      }
    }, "/") : null);
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Tabs({
  items = [],
  value,
  onChange,
  variant = "underline",
  style,
  ...rest
}) {
  const [internal, setInternal] = useState(items[0] && (items[0].value || items[0]));
  const active = value !== undefined ? value : internal;
  const pick = v => {
    setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: "flex",
      gap: variant === "underline" ? "var(--space-7)" : "var(--space-2)",
      borderBottom: variant === "underline" ? "1px solid var(--border-subtle)" : "none",
      ...style
    }
  }, rest), items.map(it => {
    const v = typeof it === "string" ? it : it.value;
    const l = typeof it === "string" ? it : it.label;
    const count = typeof it === "object" ? it.count : undefined;
    const on = v === active;
    const under = {
      padding: "0 0 var(--space-4)",
      marginBottom: -1,
      borderBottom: "2px solid " + (on ? "var(--mint-500)" : "transparent"),
      color: on ? "var(--text-max)" : "var(--text-muted)",
      background: "transparent"
    };
    const boxed = {
      padding: "var(--space-3) var(--space-5)",
      borderRadius: "var(--radius-2)",
      border: "1px solid " + (on ? "var(--border-default)" : "transparent"),
      background: on ? "var(--surface-card)" : "transparent",
      color: on ? "var(--text-max)" : "var(--text-muted)"
    };
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      type: "button",
      onClick: () => pick(v),
      style: {
        all: "unset",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-3)",
        font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        transition: "var(--transition-control)",
        ...(variant === "underline" ? under : boxed)
      }
    }, l, count !== undefined ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: on ? "var(--mint-500)" : "var(--border-strong)"
      }
    }, count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/festival-site/App.jsx
try { (() => {
const SESSIONS = [{
  id: 1,
  time: "10:00",
  duration: "30 min",
  title: "What this day is for",
  speaker: "Priya Raman",
  track: "desktop",
  level: "beginner",
  room: "Ballroom A"
}, {
  id: 2,
  time: "11:00",
  duration: "45 min",
  title: "Your first week on Linux",
  speaker: "Dana Whitfield",
  track: "desktop",
  level: "beginner",
  room: "Ballroom A"
}, {
  id: 3,
  time: "11:00",
  duration: "45 min",
  title: "One service at a time: starting to self host",
  speaker: "Marcus Reyes",
  track: "self hosting",
  level: "beginner",
  room: "Ballroom B"
}, {
  id: 4,
  time: "12:00",
  duration: "90 min",
  title: "De-clouding your photo library",
  speaker: "Marcus Reyes",
  track: "self hosting",
  level: "some experience",
  room: "Ballroom B"
}, {
  id: 5,
  time: "12:00",
  duration: "45 min",
  title: "A 2014 ThinkPad is a 2026 computer",
  speaker: "Ellis Boone",
  track: "old hardware",
  level: "beginner",
  room: "Ballroom C"
}, {
  id: 6,
  time: "13:30",
  duration: "45 min",
  title: "Threat models for normal people",
  speaker: "Nadia Okafor",
  track: "privacy",
  level: "beginner",
  room: "Ballroom A"
}, {
  id: 7,
  time: "13:30",
  duration: "45 min",
  title: "Printing, scanning and the other boring wins",
  speaker: "Dana Whitfield",
  track: "desktop",
  level: "some experience",
  room: "Ballroom C"
}, {
  id: 8,
  time: "14:30",
  duration: "60 min",
  title: "Backups you will actually run",
  speaker: "Ellis Boone",
  track: "self hosting",
  level: "some experience",
  room: "Ballroom B"
}, {
  id: 9,
  time: "14:30",
  duration: "60 min",
  title: "Reading a man page without flinching",
  speaker: "Sam Deitz",
  track: "desktop",
  level: "beginner",
  room: "Ballroom A"
}, {
  id: 10,
  time: "15:30",
  duration: "45 min",
  title: "Recycling a school computer lab",
  speaker: "Ellis Boone",
  track: "old hardware",
  level: "some experience",
  room: "Ballroom C"
}, {
  id: 11,
  time: "15:30",
  duration: "45 min",
  title: "Encrypting the disk you already have",
  speaker: "Nadia Okafor",
  track: "privacy",
  level: "deep end",
  room: "Ballroom B"
}, {
  id: 12,
  time: "16:30",
  duration: "30 min",
  title: "What to do on Monday morning",
  speaker: "Priya Raman",
  track: "privacy",
  level: "beginner",
  room: "Ballroom A"
}];
function App() {
  const [route, setRoute] = React.useState("home");
  const go = r => {
    setRoute(r);
    const el = document.getElementById("kit-scroll");
    if (el) el.scrollTop = 0;
  };
  return /*#__PURE__*/React.createElement("div", {
    id: "kit-scroll",
    style: {
      height: "100vh",
      overflowY: "auto",
      background: "var(--surface-base)"
    }
  }, /*#__PURE__*/React.createElement(window.SiteHeader, {
    route: route,
    go: go
  }), route === "home" ? /*#__PURE__*/React.createElement(window.HomeScreen, {
    go: go,
    sessions: SESSIONS
  }) : null, route === "schedule" ? /*#__PURE__*/React.createElement(window.ScheduleScreen, {
    go: go,
    sessions: SESSIONS
  }) : null, route === "session" ? /*#__PURE__*/React.createElement(window.SessionScreen, {
    go: go
  }) : null, route === "register" ? /*#__PURE__*/React.createElement(window.RegisterScreen, {
    go: go
  }) : null, /*#__PURE__*/React.createElement(window.SiteFooter, {
    go: go
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/festival-site/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/festival-site/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Card,
  Badge,
  Tag,
  AsciiRule,
  Callout,
  SectionMarker,
  TerminalBlock,
  SessionRow,
  Logo
} = window.RootAccessWildAmpWiredWV_8d8536;
const I = window.LucideIcon;
function Hero({
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-13) var(--gutter-lg) var(--space-12)",
      background: "var(--texture-grid), var(--surface-base)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1.15fr .85fr",
      gap: "var(--space-11)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--mint-500)",
      marginBottom: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "nov 14 2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--border-strong)"
    }
  }, "/"), /*#__PURE__*/React.createElement("span", null, "gsu ballroom"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--border-strong)"
    }
  }, "/"), /*#__PURE__*/React.createElement("span", null, "free entry")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-display)",
      color: "var(--text-max)",
      letterSpacing: "var(--track-display)",
      margin: 0
    }
  }, "Software you control", /*#__PURE__*/React.createElement("br", null), "is software you own."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lede)",
      color: "var(--text-body)",
      margin: "var(--space-6) 0 var(--space-8)",
      maxWidth: "46ch"
    }
  }, "West Virginia's Linux festival. One day, four tracks, and a room full of people who will sit with you while you install it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go("register"),
    iconEnd: /*#__PURE__*/React.createElement(I, {
      name: "arrow-right",
      size: 16
    })
  }, "Get a free ticket"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => go("schedule")
  }, "See the schedule")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-7)",
      marginTop: "var(--space-9)"
    }
  }, [["4", "tracks"], ["22", "sessions"], ["1", "install bench"], ["0", "cost"]].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-display) var(--size-2xl)/1 var(--font-display)",
      color: "var(--mint-500)"
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(TerminalBlock, {
    title: "you are one command from finding out",
    lines: ["$ lsb_release -d", "Description: Ubuntu 24.04.2 LTS", {
      text: "run it from the USB stick. nothing is written to disk.",
      tone: "muted"
    }]
  }), /*#__PURE__*/React.createElement(Callout, {
    tone: "accent",
    title: "Never used Linux before?"
  }, "That is who the day is built for. Start with the 11:00 session and stay for the install party."))));
}
function Tracks({
  go
}) {
  const tracks = [{
    icon: "monitor-check",
    name: "desktop",
    title: "Daily driver adoption",
    body: "Pick a distribution, keep your files, and get through a normal work week without a Windows partition."
  }, {
    icon: "server",
    name: "self hosting",
    title: "Self hosting and de-clouding",
    body: "Photos, files, calendars and notes on a machine in your own house. Start with one service, not twelve."
  }, {
    icon: "hard-drive",
    name: "old hardware",
    title: "Refurbishing old hardware",
    body: "That ten year old ThinkPad is a perfectly good computer. It is running the wrong software."
  }, {
    icon: "shield",
    name: "privacy",
    title: "Digital privacy",
    body: "What actually protects you, what is theatre, and how to tell the difference without becoming paranoid."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) var(--gutter-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    index: 1,
    label: "four tracks",
    title: "Pick where you actually are",
    description: "Every track starts at zero and ends somewhere useful. You can move between them all day."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "var(--space-6)",
      marginTop: "var(--space-9)"
    }
  }, tracks.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.name,
    interactive: true,
    onClick: () => go("schedule")
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      padding: 9,
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-2)",
      marginBottom: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: t.icon,
    size: 20,
    color: "var(--border-strong)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--mint-500)",
      marginBottom: "var(--space-3)"
    }
  }, t.name), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--type-h3)",
      color: "var(--text-max)",
      margin: "0 0 var(--space-4)"
    }
  }, t.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-small)",
      color: "var(--text-muted)"
    }
  }, t.body))))));
}
function Preview({
  sessions,
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 var(--gutter-lg) var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(AsciiRule, {
    variant: "double",
    label: "the morning"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "var(--space-6)",
      margin: "var(--space-9) 0 var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    index: 2,
    label: "the day itself",
    title: "Four tracks, one room"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => go("schedule")
  }, "Full schedule")), /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, sessions.slice(0, 5).map(s => /*#__PURE__*/React.createElement(SessionRow, _extends({
    key: s.id
  }, s, {
    onClick: () => go("session")
  }))))));
}
function InstallParty({
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) var(--gutter-lg)",
      background: "var(--texture-scanline), var(--surface-well)",
      borderTop: "1px solid var(--border-subtle)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: ".9fr 1.1fr",
      gap: "var(--space-11)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionMarker, {
    index: 3,
    label: "install party",
    title: "Bring the laptop you already own",
    description: "Six benches, all day, no appointment. Someone sits with you from the first boot to a working desktop."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      margin: "var(--space-8) 0"
    }
  }, ["A laptop or desktop you can wipe, or one you want to dual boot", "A USB stick, 8GB or larger. We have spares.", "Your files backed up somewhere else first"].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: "check",
    size: 16,
    color: "var(--mint-500)",
    style: {
      marginTop: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, t)))), /*#__PURE__*/React.createElement(Button, {
    onClick: () => go("register")
  }, "Reserve a bench")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "16/9",
      border: "1px dashed var(--border-default)",
      borderRadius: "var(--radius-3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-3)",
      background: "rgba(3,37,42,.4)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: "image",
    size: 22,
    color: "var(--border-strong)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "photo slot \xB7 install bench"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      color: "var(--text-muted)"
    }
  }, "no imagery was supplied for this system")), /*#__PURE__*/React.createElement(Callout, {
    tone: "attention",
    title: "Back up first"
  }, "We will not touch a disk without asking, but copy anything you care about to an external drive before you arrive."))));
}
function Faq() {
  const qs = [["Is it really free?", "Yes. No ticket price, no badge, no vendor hall. The department covers the room."], ["Do I need to know anything?", "No. Roughly half the room has never installed Linux. Sessions marked beginner assume nothing."], ["Can I come for one talk?", "Yes. Doors are open all day and nothing is gated."], ["Will you break my computer?", "We will not repartition anything without you watching and agreeing. Most people leave on a live USB first and install later at home."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--section-y) var(--gutter-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    index: 4,
    label: "before you come",
    title: "Reasonable questions"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-6)",
      marginTop: "var(--space-9)"
    }
  }, qs.map(([q, a]) => /*#__PURE__*/React.createElement(Card, {
    key: q
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--weight-body-strong) var(--size-lg)/1.35 var(--font-body)",
      color: "var(--text-max)",
      margin: "0 0 var(--space-3)"
    }
  }, q), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, a))))));
}
function HomeScreen({
  go,
  sessions
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    go: go
  }), /*#__PURE__*/React.createElement(Tracks, {
    go: go
  }), /*#__PURE__*/React.createElement(Preview, {
    sessions: sessions,
    go: go
  }), /*#__PURE__*/React.createElement(InstallParty, {
    go: go
  }), /*#__PURE__*/React.createElement(Faq, null));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/festival-site/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/festival-site/RegisterScreen.jsx
try { (() => {
const {
  Button,
  Card,
  Badge,
  AsciiRule,
  Callout,
  SectionMarker,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Breadcrumb,
  TerminalBlock
} = window.RootAccessWildAmpWiredWV_8d8536;
const I = window.LucideIcon;
function RegisterScreen({
  go
}) {
  const [email, setEmail] = React.useState("dana.example.org");
  const [ticket, setTicket] = React.useState("general");
  const [bench, setBench] = React.useState(true);
  const [list, setList] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const invalid = email.length > 0 && !email.includes("@");
  if (done) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "var(--space-13) var(--gutter-lg)",
        maxWidth: 640,
        margin: "0 auto"
      }
    }, /*#__PURE__*/React.createElement(SectionMarker, {
      label: "you are in",
      title: "That is the whole registration",
      description: "No confirmation email is needed. Turn up on the day."
    }), /*#__PURE__*/React.createElement(TerminalBlock, {
      title: "ticket",
      cursor: false,
      style: {
        marginTop: "var(--space-8)"
      },
      lines: ["$ ticket --show", "name:    dana@example.org", "type:    general admission", "bench:   reserved, 10:00 to 11:00", {
        text: "cost:    0.00",
        tone: "ok"
      }]
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      style: {
        marginTop: "var(--space-8)"
      },
      onClick: () => go("home")
    }, "Back to the site"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) var(--gutter-lg) var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "home",
      href: "#"
    }, "register"],
    style: {
      marginBottom: "var(--space-6)"
    }
  }), /*#__PURE__*/React.createElement(SectionMarker, {
    index: 5,
    label: "free ticket",
    title: "Tell us three things",
    description: "We ask for an email so we can tell you if the room changes. Nothing else, and nothing is shared."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.2fr .8fr",
      gap: "var(--space-9)",
      marginTop: "var(--space-9)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "email",
    htmlFor: "r-email",
    required: true,
    hint: invalid ? undefined : "Used for room changes only.",
    error: invalid ? "Add an @ to your address." : undefined
  }, /*#__PURE__*/React.createElement(Input, {
    id: "r-email",
    invalid: invalid,
    value: email,
    onChange: e => setEmail(e.target.value),
    prefix: /*#__PURE__*/React.createElement(I, {
      name: "mail",
      size: 15
    })
  })), /*#__PURE__*/React.createElement(Field, {
    label: "ticket type",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    name: "t",
    checked: ticket === "general",
    onChange: () => setTicket("general"),
    label: "General admission",
    description: "Free. Every talk, all day."
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "t",
    checked: ticket === "workshop",
    onChange: () => setTicket("workshop"),
    label: "Workshop track",
    description: "Free. Limited benches, hands on."
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "t",
    checked: ticket === "volunteer",
    onChange: () => setTicket("volunteer"),
    label: "Volunteer",
    description: "Arrive at 08:00, leave at 18:00, get fed."
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "how much linux have you used",
    htmlFor: "r-exp"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "r-exp",
    options: ["Never used it", "Tried a live USB once", "Dual booting now", "Daily driver"]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "install bench"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: bench,
    onChange: () => setBench(!bench),
    label: "Reserve me a bench",
    description: "Bring the machine. We supply the images."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: list,
    onChange: () => setList(!list),
    label: "Add me to the mailing list",
    description: "Four messages a year at most."
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "anything we should know",
    htmlFor: "r-note",
    hint: "Accessibility needs, a machine you are worried about, a question."
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "r-note",
    rows: 3,
    placeholder: "One or two sentences is plenty."
  })), /*#__PURE__*/React.createElement(AsciiRule, {
    variant: "dash"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    disabled: invalid,
    onClick: () => setDone(true)
  }, "Get my ticket"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => go("home")
  }, "Cancel")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Callout, {
    tone: "info",
    title: "Nothing to pay, ever"
  }, "The department covers the room. There is no badge, no vendor hall and no upsell."), /*#__PURE__*/React.createElement(Card, {
    header: "the day at a glance"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)"
    }
  }, [["09:30", "doors, coffee"], ["10:00", "install benches open"], ["11:00", "first talks"], ["16:00", "benches close"], ["17:00", "last talk ends"]].map(([t, l]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: "var(--space-5)",
      font: "var(--weight-mono) var(--size-2xs)/1.5 var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mint-500)",
      width: 46
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-body)"
    }
  }, l))))), /*#__PURE__*/React.createElement(Card, {
    header: "venue"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4/3",
      border: "1px dashed var(--border-default)",
      borderRadius: "var(--radius-2)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(3,37,42,.4)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: "map-pin",
    size: 20,
    color: "var(--border-strong)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "map slot")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-5) 0 0",
      font: "var(--type-small)",
      color: "var(--text-muted)"
    }
  }, "GSU Ballroom, Charleston WV. Free parking in the west lot."))))));
}
Object.assign(window, {
  RegisterScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/festival-site/RegisterScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/festival-site/ScheduleScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Card,
  Badge,
  Tag,
  Tabs,
  AsciiRule,
  SectionMarker,
  SessionRow,
  Input,
  Switch,
  Breadcrumb
} = window.RootAccessWildAmpWiredWV_8d8536;
const I = window.LucideIcon;
function ScheduleScreen({
  go,
  sessions
}) {
  const [track, setTrack] = React.useState("all");
  const [beginner, setBeginner] = React.useState(false);
  const [q, setQ] = React.useState("");
  const tabs = [{
    value: "all",
    label: "All",
    count: sessions.length
  }, {
    value: "desktop",
    label: "Desktop",
    count: sessions.filter(s => s.track === "desktop").length
  }, {
    value: "self hosting",
    label: "Self hosting",
    count: sessions.filter(s => s.track === "self hosting").length
  }, {
    value: "old hardware",
    label: "Old hardware",
    count: sessions.filter(s => s.track === "old hardware").length
  }, {
    value: "privacy",
    label: "Privacy",
    count: sessions.filter(s => s.track === "privacy").length
  }];
  const shown = sessions.filter(s => (track === "all" || s.track === track) && (!beginner || s.level === "beginner") && (q === "" || s.title.toLowerCase().includes(q.toLowerCase())));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) var(--gutter-lg) var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "home",
      href: "#"
    }, "schedule"],
    style: {
      marginBottom: "var(--space-6)"
    }
  }), /*#__PURE__*/React.createElement(SectionMarker, {
    index: 2,
    label: "saturday nov 14",
    title: "The whole programme",
    description: "Doors at 09:30. Nothing is gated and nothing needs booking except an install bench."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-6)",
      margin: "var(--space-8) 0 var(--space-5)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search sessions",
    prefix: /*#__PURE__*/React.createElement(I, {
      name: "search",
      size: 15
    }),
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: 260
    }
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: beginner,
    onChange: () => setBeginner(!beginner),
    label: "Beginner friendly only"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, shown.length, " of ", sessions.length, " shown")), /*#__PURE__*/React.createElement(Tabs, {
    items: tabs,
    value: track,
    onChange: setTrack,
    style: {
      marginBottom: "var(--space-7)"
    }
  }), shown.length ? /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, shown.map(s => /*#__PURE__*/React.createElement(SessionRow, _extends({
    key: s.id
  }, s, {
    onClick: () => go("session")
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: "var(--border-dashed)",
      borderRadius: "var(--radius-3)",
      padding: "var(--space-11)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-code)",
      color: "var(--text-muted)"
    }
  }, "no matches"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-4) auto 0",
      font: "var(--type-small)",
      color: "var(--text-muted)",
      maxWidth: "40ch"
    }
  }, "Clear the filters, or try a track. Every session runs once, so nothing is hidden behind a second day."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    style: {
      marginTop: "var(--space-6)"
    },
    onClick: () => {
      setTrack("all");
      setBeginner(false);
      setQ("");
    }
  }, "Clear filters")), /*#__PURE__*/React.createElement(AsciiRule, {
    variant: "dash",
    style: {
      margin: "var(--space-9) 0 var(--space-6)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "level key"), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "beginner"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "some experience"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "deep end"))));
}
Object.assign(window, {
  ScheduleScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/festival-site/ScheduleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/festival-site/SessionScreen.jsx
try { (() => {
const {
  Button,
  Card,
  Badge,
  Tag,
  AsciiRule,
  Callout,
  TerminalBlock,
  Breadcrumb,
  Kbd,
  Dialog,
  Toast
} = window.RootAccessWildAmpWiredWV_8d8536;
const I = window.LucideIcon;
function SessionScreen({
  go
}) {
  const [open, setOpen] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-9) var(--gutter-lg) var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "home",
      href: "#"
    }, {
      label: "schedule",
      href: "#"
    }, "your first week on linux"],
    style: {
      marginBottom: "var(--space-7)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.3fr .7fr",
      gap: "var(--space-11)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      marginBottom: "var(--space-5)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    dot: true
  }, "beginner"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "45 min"), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "ballroom a")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h1)",
      color: "var(--text-max)",
      margin: 0
    }
  }, "Your first week on Linux"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lede)",
      color: "var(--text-body)",
      margin: "var(--space-5) 0 var(--space-8)"
    }
  }, "What actually changes, and what does not. We install one distribution on one laptop, then use it for an ordinary work day: email, a spreadsheet, a video call, printing something."), /*#__PURE__*/React.createElement(AsciiRule, {
    variant: "double",
    label: "what we cover"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)",
      margin: "var(--space-7) 0 var(--space-9)"
    }
  }, ["Choosing between Ubuntu, Fedora and Linux Mint without reading a forum war", "Keeping your files, your bookmarks and your printer", "The three things that will confuse you in week one, in advance", "When to use the terminal and when to leave it alone"].map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: "var(--space-5)",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-code)",
      color: "var(--border-strong)"
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body)",
      color: "var(--text-body)"
    }
  }, t)))), /*#__PURE__*/React.createElement(TerminalBlock, {
    title: "the only command in this session",
    lines: ["$ sudo apt install libreoffice", "Reading package lists... Done", "Building dependency tree... Done", {
      text: "Need to get 138 MB of archives.",
      tone: "muted"
    }, {
      text: "After this operation, 512 MB of additional disk space will be used.",
      tone: "muted"
    }, "Do you want to continue? [Y/n]"]
  }), /*#__PURE__*/React.createElement(Callout, {
    tone: "command",
    style: {
      marginTop: "var(--space-6)"
    }
  }, "Open a terminal with ", /*#__PURE__*/React.createElement(Kbd, null, "Ctrl"), " ", /*#__PURE__*/React.createElement(Kbd, null, "Alt"), " ", /*#__PURE__*/React.createElement(Kbd, null, "T"), ". You will not need it again until the afternoon.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      position: "sticky",
      top: 88
    }
  }, /*#__PURE__*/React.createElement(Card, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "saturday"), /*#__PURE__*/React.createElement("span", null, "11:00")),
    footer: "Ballroom A, 120 seats, no booking"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      alignItems: "center",
      marginBottom: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      flex: "0 0 auto",
      border: "1px dashed var(--border-default)",
      borderRadius: "var(--radius-2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: "user",
    size: 18,
    color: "var(--border-strong)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-body-strong) var(--size-md)/1.3 var(--font-body)",
      color: "var(--text-max)"
    }
  }, "Dana Whitfield"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "sysadmin, kanawha county schools"))), /*#__PURE__*/React.createElement(Button, {
    block: true,
    onClick: () => {
      setSaved(true);
    }
  }, "Add to my plan"), /*#__PURE__*/React.createElement(Button, {
    block: true,
    variant: "secondary",
    style: {
      marginTop: "var(--space-4)"
    },
    onClick: () => setOpen(true)
  }, "Book an install bench")), /*#__PURE__*/React.createElement(Card, {
    header: "prerequisites"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, [["laptop", "any, including one from 2014"], ["usb stick", "8GB, spares available"], ["experience", "none"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-5)",
      font: "var(--weight-mono) var(--size-2xs)/1.5 var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.08em"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-body)",
      textAlign: "right"
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "desktop"), /*#__PURE__*/React.createElement(Tag, null, "ubuntu"), /*#__PURE__*/React.createElement(Tag, null, "first time"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    kicker: "install party",
    title: "Install party, bench 3",
    onClose: () => setOpen(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => setOpen(false)
    }, "Back"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => {
        setOpen(false);
        setSaved(true);
      }
    }, "Reserve a bench"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Bring the machine and a USB stick. We supply the images and someone sits with you the whole time. Benches run 10:00 to 16:00 and a slot is roughly an hour.")), saved ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      right: 24,
      bottom: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "accent",
    title: "saved",
    onClose: () => setSaved(false)
  }, "Session added to your plan.")) : null);
}
Object.assign(window, {
  SessionScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/festival-site/SessionScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/festival-site/Shell.jsx
try { (() => {
const {
  Button,
  Logo,
  LogoWordmark,
  AsciiRule,
  Badge
} = window.RootAccessWildAmpWiredWV_8d8536;
function SiteHeader({
  route,
  go
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById("kit-scroll");
    if (!el) return;
    const on = () => setScrolled(el.scrollTop > 8);
    el.addEventListener("scroll", on);
    return () => el.removeEventListener("scroll", on);
  }, []);
  const nav = [["schedule", "Schedule"], ["session", "Sessions"], ["register", "Register"]];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 30,
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: "var(--space-8)",
      padding: "0 var(--gutter-lg)",
      background: scrolled ? "rgba(3,37,42,.85)" : "transparent",
      backdropFilter: scrolled ? "saturate(140%) blur(2px)" : "none",
      borderBottom: "1px solid " + (scrolled ? "var(--border-subtle)" : "transparent"),
      transition: "background var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go("home");
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)",
      border: 0
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "icon",
    height: 38,
    base: "../.."
  }), /*#__PURE__*/React.createElement(LogoWordmark, {
    size: 17
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: "var(--space-7)",
      marginLeft: "auto"
    }
  }, nav.map(([r, label]) => /*#__PURE__*/React.createElement("a", {
    key: r,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go(r);
    },
    style: {
      font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      border: 0,
      color: route === r ? "var(--mint-500)" : "var(--text-muted)"
    }
  }, label))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go("register")
  }, "Get a free ticket"));
}
function SiteFooter({
  go
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-well)",
      borderTop: "1px solid var(--border-subtle)",
      padding: "var(--space-11) var(--gutter-lg) var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: "var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "icon",
    height: 64,
    base: "../.."
  }), /*#__PURE__*/React.createElement(LogoWordmark, {
    size: 22
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-small)",
      color: "var(--text-muted)",
      maxWidth: "34ch"
    }
  }, "Hosted by the University of Charleston COSC, DASC and MATH Department. Free to attend.")), [["the day", ["Schedule", "Tracks", "Install party", "Venue and parking"]], ["get involved", ["Propose a talk", "Volunteer", "Donate hardware", "Sponsor"]], ["elsewhere", ["Mailing list", "Matrix room", "Code of conduct", "Past years"]]].map(([title, items]) => /*#__PURE__*/React.createElement("div", {
    key: title,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--mint-500)"
    }
  }, title), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      font: "var(--type-small)",
      color: "var(--text-muted)",
      border: 0
    }
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container)",
      margin: "var(--space-9) auto 0"
    }
  }, /*#__PURE__*/React.createElement(AsciiRule, {
    variant: "solid"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-6)",
      marginTop: "var(--space-5)",
      font: "var(--weight-mono) var(--size-3xs)/1.4 var(--font-mono)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "nov 14 2026 \xB7 gsu ballroom \xB7 charleston wv"), /*#__PURE__*/React.createElement("span", null, "site content licensed cc by-sa 4.0"))));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/festival-site/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program/ProgramApp.jsx
try { (() => {
const {
  Toast
} = window.RootAccessWildAmpWiredWV_8d8536;
const P_SESSIONS = [{
  id: 1,
  time: "10:00",
  duration: "30 min",
  title: "What this day is for",
  speaker: "Priya Raman",
  track: "desktop",
  level: "beginner",
  room: "Ballroom A",
  blurb: "A ten minute case for owning your software, then twenty minutes of questions from the room.",
  bring: ["Nothing"]
}, {
  id: 2,
  time: "11:00",
  duration: "45 min",
  title: "Your first week on Linux",
  speaker: "Dana Whitfield",
  track: "desktop",
  level: "beginner",
  room: "Ballroom A",
  blurb: "We install one distribution on one laptop, then use it for an ordinary work day: email, a spreadsheet, a video call, printing something.",
  bring: ["A laptop you can wipe or dual boot", "A USB stick, 8GB or larger"],
  command: "sudo apt install libreoffice",
  output: "Need to get 138 MB of archives."
}, {
  id: 3,
  time: "11:00",
  duration: "45 min",
  title: "One service at a time: starting to self host",
  speaker: "Marcus Reyes",
  track: "self hosting",
  level: "beginner",
  room: "Ballroom B",
  blurb: "Pick one thing you pay a subscription for and run it yourself. Start with files, not with email.",
  bring: ["Nothing"]
}, {
  id: 4,
  time: "12:00",
  duration: "90 min",
  title: "De-clouding your photo library",
  speaker: "Marcus Reyes",
  track: "self hosting",
  level: "some experience",
  room: "Ballroom B",
  blurb: "Getting fifteen years of photos off a phone vendor's server and onto a machine in your own house, without losing an album.",
  bring: ["A laptop", "Your phone"],
  command: "docker compose up -d immich",
  output: "Creating immich_server ... done"
}, {
  id: 5,
  time: "12:00",
  duration: "45 min",
  title: "A 2014 ThinkPad is a 2026 computer",
  speaker: "Ellis Boone",
  track: "old hardware",
  level: "beginner",
  room: "Ballroom C",
  blurb: "What to replace, what to leave alone, and which twenty dollar upgrade doubles the life of a laptop.",
  bring: ["An old machine, if you have one"]
}, {
  id: 6,
  time: "13:30",
  duration: "45 min",
  title: "Threat models for normal people",
  speaker: "Nadia Okafor",
  track: "privacy",
  level: "beginner",
  room: "Ballroom A",
  blurb: "Who are you actually protecting yourself from. The answer changes what you should do, and most advice online assumes the wrong answer.",
  bring: ["Nothing"]
}, {
  id: 7,
  time: "13:30",
  duration: "45 min",
  title: "Printing, scanning and the other boring wins",
  speaker: "Dana Whitfield",
  track: "desktop",
  level: "some experience",
  room: "Ballroom C",
  blurb: "The unglamorous half of daily driving: peripherals, office file compatibility, and the one video call app that always works.",
  bring: ["A laptop"]
}, {
  id: 8,
  time: "14:30",
  duration: "60 min",
  title: "Backups you will actually run",
  speaker: "Ellis Boone",
  track: "self hosting",
  level: "some experience",
  room: "Ballroom B",
  blurb: "A backup you have to remember is not a backup. We set up one that runs itself and then we test a restore, which is the part everyone skips.",
  bring: ["A laptop", "An external drive if you have one"],
  command: "restic snapshots",
  output: "3 snapshots"
}, {
  id: 9,
  time: "14:30",
  duration: "60 min",
  title: "Reading a man page without flinching",
  speaker: "Sam Deitz",
  track: "desktop",
  level: "beginner",
  room: "Ballroom A",
  blurb: "Manual pages have a fixed structure. Once you know the five sections you can skim any of them in under a minute.",
  bring: ["Nothing"],
  command: "man ssh",
  output: "SSH(1)  BSD General Commands Manual"
}, {
  id: 10,
  time: "15:30",
  duration: "45 min",
  title: "Recycling a school computer lab",
  speaker: "Ellis Boone",
  track: "old hardware",
  level: "some experience",
  room: "Ballroom C",
  blurb: "How Kanawha County put thirty retired desktops back into classrooms for the cost of RAM.",
  bring: ["Nothing"]
}, {
  id: 11,
  time: "15:30",
  duration: "45 min",
  title: "Encrypting the disk you already have",
  speaker: "Nadia Okafor",
  track: "privacy",
  level: "deep end",
  room: "Ballroom B",
  blurb: "Full disk encryption on an installed system, what it protects against, and what happens when you forget the passphrase.",
  bring: ["A laptop you have backed up"],
  command: "cryptsetup luksDump /dev/sda2",
  output: "Version: 2"
}, {
  id: 12,
  time: "16:30",
  duration: "30 min",
  title: "What to do on Monday morning",
  speaker: "Priya Raman",
  track: "privacy",
  level: "beginner",
  room: "Ballroom A",
  blurb: "One action each, written down before you leave the room.",
  bring: ["Nothing"]
}];
function ProgramApp() {
  const [track, setTrack] = React.useState("all");
  const [beginner, setBeginner] = React.useState(false);
  const [plan, setPlan] = React.useState([2, 6]);
  const [selected, setSelected] = React.useState(P_SESSIONS[5]);
  const [toast, setToast] = React.useState(null);
  const toggle = id => {
    setPlan(p => p.includes(id) ? p.filter(x => x !== id) : p.concat(id));
    setToast(plan.includes(id) ? "Session removed from your plan." : "Session added to your plan.");
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "var(--surface-base)"
    }
  }, /*#__PURE__*/React.createElement(window.Sidebar, {
    track: track,
    setTrack: setTrack,
    beginner: beginner,
    setBeginner: setBeginner,
    planCount: plan.length
  }), /*#__PURE__*/React.createElement(window.ProgramView, {
    sessions: P_SESSIONS,
    track: track,
    beginner: beginner,
    plan: plan,
    toggle: toggle,
    selected: selected,
    setSelected: setSelected
  }), toast ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      right: 24,
      bottom: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "accent",
    title: "my plan",
    onClose: () => setToast(null)
  }, toast)) : null);
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(ProgramApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program/ProgramApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program/ProgramView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Card,
  Badge,
  Tabs,
  AsciiRule,
  Callout,
  SectionMarker,
  SessionRow,
  Input,
  Kbd,
  TerminalBlock,
  Toast,
  IconButton
} = window.RootAccessWildAmpWiredWV_8d8536;
const I = window.LucideIcon;
function NowBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "var(--space-4) var(--space-7)",
      background: "rgba(64,223,175,.08)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--mint-500)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 12,
      background: "var(--mint-500)",
      display: "inline-block"
    }
  }), "live now"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-max)"
    }
  }, "Threat models for normal people"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-mono) var(--size-3xs)/1 var(--font-mono)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "ballroom a \xB7 ends 14:15"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      font: "var(--weight-mono) var(--size-3xs)/1 var(--font-mono)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "next up 14:30 \xB7 backups you will actually run"));
}
function DetailPanel({
  session,
  onAdd,
  inPlan
}) {
  if (!session) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "var(--space-9)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: "var(--type-code)",
        color: "var(--text-muted)"
      }
    }, "$ select a session"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: "var(--type-small)",
        color: "var(--text-muted)"
      }
    }, "Pick a row on the left to see the room, the speaker and what you need to bring."));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-7)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)",
      marginBottom: "var(--space-5)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: session.level === "beginner" ? "accent" : "neutral",
    dot: session.level === "beginner"
  }, session.level), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, session.duration), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, session.room.toLowerCase())), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h3)",
      color: "var(--text-max)",
      margin: 0
    }
  }, session.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-mono) var(--size-2xs)/1.5 var(--font-mono)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginTop: "var(--space-3)"
    }
  }, session.time, " \xB7 ", session.track, " \xB7 ", session.speaker)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, session.blurb), /*#__PURE__*/React.createElement(Button, {
    block: true,
    variant: inPlan ? "secondary" : "primary",
    onClick: onAdd,
    icon: /*#__PURE__*/React.createElement(I, {
      name: inPlan ? "check" : "plus",
      size: 15
    })
  }, inPlan ? "In my plan" : "Add to my plan"), /*#__PURE__*/React.createElement(AsciiRule, {
    variant: "dash"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "bring"), session.bring.map(b => /*#__PURE__*/React.createElement("div", {
    key: b,
    style: {
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(I, {
    name: "check",
    size: 14,
    color: "var(--mint-500)",
    style: {
      marginTop: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-small)",
      color: "var(--text-body)"
    }
  }, b)))), session.command ? /*#__PURE__*/React.createElement(TerminalBlock, {
    title: "one command from this session",
    cursor: false,
    lines: ["$ " + session.command, {
      text: session.output,
      tone: "muted"
    }]
  }) : null, /*#__PURE__*/React.createElement(Callout, {
    tone: "info"
  }, "Rooms can change. Check the board by the doors, or this screen."));
}
function ProgramView({
  sessions,
  track,
  beginner,
  plan,
  toggle,
  selected,
  setSelected
}) {
  const [q, setQ] = React.useState("");
  const shown = sessions.filter(s => (track === "all" || s.track === track) && (!beginner || s.level === "beginner") && (q === "" || s.title.toLowerCase().includes(q.toLowerCase()) || s.speaker.toLowerCase().includes(q.toLowerCase())));
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(NowBar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "var(--space-6) var(--space-7)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--mint-500)"
    }
  }, "saturday nov 14 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h3)",
      color: "var(--text-max)",
      margin: "6px 0 0"
    }
  }, "Programme")), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search sessions or speakers",
    prefix: /*#__PURE__*/React.createElement(I, {
      name: "search",
      size: 15
    }),
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: 300,
      marginLeft: "auto"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 4,
      alignItems: "center",
      font: "var(--weight-mono) var(--size-3xs)/1 var(--font-mono)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(Kbd, null, "/"), " to search")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      overflowY: "auto"
    }
  }, shown.length ? shown.map(s => /*#__PURE__*/React.createElement(SessionRow, _extends({
    key: s.id
  }, s, {
    selected: selected && selected.id === s.id,
    onClick: () => setSelected(s)
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "var(--space-9)",
      border: "var(--border-dashed)",
      borderRadius: "var(--radius-3)",
      padding: "var(--space-11)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-code)",
      color: "var(--text-muted)"
    }
  }, "no matches"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-4) auto 0",
      font: "var(--type-small)",
      color: "var(--text-muted)",
      maxWidth: "36ch"
    }
  }, "Clear the search, or switch back to all sessions."))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      flex: "0 0 auto",
      borderLeft: "1px solid var(--border-subtle)",
      background: "var(--surface-card)",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(DetailPanel, {
    session: selected,
    inPlan: selected ? plan.includes(selected.id) : false,
    onAdd: () => selected && toggle(selected.id)
  }))));
}
Object.assign(window, {
  ProgramView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program/ProgramView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program/Sidebar.jsx
try { (() => {
const {
  Logo,
  LogoWordmark,
  AsciiRule,
  Badge,
  Tag,
  Switch,
  IconButton,
  Tooltip
} = window.RootAccessWildAmpWiredWV_8d8536;
const I = window.LucideIcon;
const TRACKS = [{
  key: "all",
  label: "All sessions",
  icon: "list",
  count: 12
}, {
  key: "desktop",
  label: "Desktop",
  icon: "monitor-check",
  count: 4
}, {
  key: "self hosting",
  label: "Self hosting",
  icon: "server",
  count: 3
}, {
  key: "old hardware",
  label: "Old hardware",
  icon: "hard-drive",
  count: 2
}, {
  key: "privacy",
  label: "Privacy",
  icon: "shield",
  count: 3
}];
function Sidebar({
  track,
  setTrack,
  beginner,
  setBeginner,
  planCount
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 264,
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-well)",
      borderRight: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)",
      height: 64,
      padding: "0 var(--space-6)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "icon",
    height: 32,
    base: "../.."
  }), /*#__PURE__*/React.createElement(LogoWordmark, {
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: "var(--space-3)"
    }
  }, "tracks"), TRACKS.map(t => {
    const on = t.key === track;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      onClick: () => setTrack(t.key),
      style: {
        all: "unset",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
        borderRadius: "var(--radius-2)",
        background: on ? "rgba(64,223,175,.10)" : "transparent",
        borderLeft: "2px solid " + (on ? "var(--mint-500)" : "transparent"),
        color: on ? "var(--text-max)" : "var(--text-muted)",
        font: "var(--weight-mono) var(--size-2xs)/1 var(--font-mono)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "var(--transition-control)"
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: t.icon,
      size: 15,
      color: on ? "var(--mint-500)" : "var(--border-strong)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, t.label), /*#__PURE__*/React.createElement("span", {
      style: {
        color: on ? "var(--mint-500)" : "var(--border-strong)"
      }
    }, t.count));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(AsciiRule, {
    variant: "solid"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "filters"), /*#__PURE__*/React.createElement(Switch, {
    checked: beginner,
    onChange: () => setBeginner(!beginner),
    label: "Beginner friendly only"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "hands on"), /*#__PURE__*/React.createElement(Tag, null, "no laptop needed"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: "var(--space-6)",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "my plan"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--weight-display) var(--size-xl)/1 var(--font-display)",
      color: "var(--mint-500)",
      marginTop: 6
    }
  }, planCount, " sessions")), /*#__PURE__*/React.createElement(Tooltip, {
    content: "Print my plan",
    placement: "left"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Print my plan",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement(I, {
    name: "printer",
    size: 16
  }))))));
}
Object.assign(window, {
  Sidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program/Sidebar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.LogoWordmark = __ds_scope.LogoWordmark;

__ds_ns.SectionMarker = __ds_scope.SectionMarker;

__ds_ns.SessionRow = __ds_scope.SessionRow;

__ds_ns.TerminalBlock = __ds_scope.TerminalBlock;

__ds_ns.AsciiRule = __ds_scope.AsciiRule;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Kbd = __ds_scope.Kbd;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
