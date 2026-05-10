import { r as reactExports, W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { c as createLucideIcon, L as Link, S as Sparkles, U as Users, C as Calendar, T as Trophy } from "./router-BDNVtE_0.js";
import { E as EVENTS, U as USERS, T as TESTIMONIALS } from "./mock-Ca7l8cmZ.js";
import { b as countdown, f as fmtDate, a as fmtPKR } from "./format-CIANsOqg.js";
import { H as Hairline, P as Pill } from "./ui-bits-JagVtLz-.js";
import { T as ThemeSwitch } from "./ThemeSwitch-DFaZj5-r.js";
import { B as Briefcase } from "./briefcase-FJ8BtpFa.js";
import { M as MapPin } from "./map-pin-i-wdRdr6.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "http2";
import "assert";
import "./worker-entry-so00yvqm.js";
import "node:events";
import "os";
import "zlib";
import "events";
const __iconNode$6 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
  ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
  ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
];
const CodeXml = createLucideIcon("code-xml", __iconNode$3);
const __iconNode$2 = [
  ["line", { x1: "6", x2: "10", y1: "11", y2: "11", key: "1gktln" }],
  ["line", { x1: "8", x2: "8", y1: "9", y2: "13", key: "qnk9ow" }],
  ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12", key: "krot7o" }],
  ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10", key: "1lcuu1" }],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
      key: "mfqc10"
    }
  ]
];
const Gamepad2 = createLucideIcon("gamepad-2", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const SOFTEC_DATE = (() => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString();
})();
const CATEGORIES = [{
  num: "01",
  name: "Tech",
  desc: "Engineering · ML · systems · code",
  count: EVENTS.filter((e) => e.category === "Tech").length,
  icon: CodeXml,
  tone: "ember"
}, {
  num: "02",
  name: "Business",
  desc: "Pitches · marketing · strategy",
  count: EVENTS.filter((e) => e.category === "Business").length,
  icon: Briefcase,
  tone: "gold"
}, {
  num: "03",
  name: "Gaming",
  desc: "Esports · arcade · tournaments",
  count: EVENTS.filter((e) => e.category === "Gaming").length,
  icon: Gamepad2,
  tone: "electric"
}, {
  num: "04",
  name: "General",
  desc: "Photography · debates · arts",
  count: EVENTS.filter((e) => e.category === "General").length,
  icon: Camera,
  tone: "sage"
}];
function Landing() {
  const [ct, setCt] = reactExports.useState(countdown(SOFTEC_DATE));
  reactExports.useEffect(() => {
    const id = setInterval(() => setCt(countdown(SOFTEC_DATE)), 6e4);
    return () => clearInterval(id);
  }, []);
  const featured = EVENTS.filter((e) => e.featured);
  const sponsors = USERS.filter((u) => u.role === "sponsor");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-clip", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-y border-border bg-ink text-background overflow-hidden py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "marquee-track font-mono text-[11px] uppercase tracking-[0.2em] whitespace-nowrap", children: Array.from({
      length: 2
    }).map((_, k) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-10 px-6 shrink-0", children: ["★ Edition XXVI · MMXXVI", "Lahore · 13–15 March 2026", "50+ programmes", "PKR 4.2M prize pool", "300+ universities", "Patron: Systems Ltd", "Live registration open", "ILoveCoding · Speed Programming · Unreal", "Esports Arena · Battle Royale", "Investor Pitch · Founders Lab"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-background/30", children: "◆" })
    ] }, t)) }, k)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative max-w-[1320px] mx-auto px-6 lg:px-12 pt-16 pb-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "absolute -top-10 -left-20 w-[520px] h-[520px] rounded-full blur-3xl opacity-60", style: {
        background: "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 50%, transparent), transparent 70%)",
        animation: "var(--animate-aurora)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "absolute top-40 -right-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-50", style: {
        background: "radial-gradient(circle, color-mix(in oklab, var(--color-electric) 50%, transparent), transparent 70%)",
        animation: "var(--animate-aurora)",
        animationDelay: "-6s"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid lg:grid-cols-12 gap-10 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "Edition XXVI · MMXXVI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-[11px] font-mono uppercase tracking-wider text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
              " Live registration"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-light text-foreground mt-7 leading-[0.95] tracking-[-0.035em] text-[56px] md:text-[88px] lg:text-[112px]", children: [
            "Where Pakistan's",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "brightest minds",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-normal text-gradient-ember", children: "build the future" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed", children: [
            "The flagship technology festival of FAST-NUCES. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Three days. Fifty programmes." }),
            " One arena for the country's most ambitious undergraduates."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
              "Register for SOFTEC '26",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-6 py-3.5 text-sm font-medium hover:border-primary/40 hover:bg-card transition-all", children: [
              "Browse the programme ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ticket p-7 ml-auto max-w-sm", style: {
            ["--r"]: "-2deg",
            animation: "var(--animate-float)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: "Admit one" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-primary", children: "N° 0042" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-[44px] font-semibold leading-none mt-4", children: [
              "SOFTEC",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif italic text-lg text-muted-foreground mt-1", children: "edition twenty-six" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground mt-1", children: "13 Mar" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "City" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground mt-1", children: "Lahore" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Venue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground mt-1", children: "FAST · LHR" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-5 border-t border-dashed border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "Opens in" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-semibold text-3xl tabular mt-1", children: [
                  String(ct.d).padStart(2, "0"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-lg", children: "d" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border mx-1", children: ":" }),
                  String(ct.h).padStart(2, "0"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-lg", children: "h" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-ember grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-4 -left-2 w-24 h-24 rounded-full bg-foreground text-background grid place-items-center font-display italic text-sm hidden md:grid", style: {
            animation: "var(--animate-spin-slow)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "absolute inset-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { id: "circ", d: "M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("text", { className: "fill-current font-mono uppercase", style: {
                fontSize: 9,
                letterSpacing: "0.18em"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("textPath", { href: "#circ", children: "SOFTEC · MMXXVI · FAST · NUCES · " }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-primary" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border", children: [{
        n: "300+",
        l: "Participants",
        i: Users
      }, {
        n: "50+",
        l: "Programmes",
        i: Calendar
      }, {
        n: "₨4.2M",
        l: "Prize pool",
        i: Trophy
      }, {
        n: "72hr",
        l: "Of competition",
        i: Zap
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card p-6 group hover:bg-muted/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(s.i, { className: "h-4 w-4 text-primary mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-4xl md:text-5xl tabular leading-none", children: s.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-3", children: s.l })
      ] }, s.l)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hairline, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-[1320px] mx-auto px-6 lg:px-12 py-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between flex-wrap gap-6 mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "The programme" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-5xl md:text-6xl font-semibold mt-5 leading-[0.98] tracking-tight", children: [
            "Four ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic font-normal text-gradient-ember", children: "categories" }),
            ".",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "One festival."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", className: "inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-primary hover:gap-3 transition-all", children: [
          "See all 50 programmes ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4", children: CATEGORIES.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", search: {
        category: c.name
      }, className: `group relative overflow-hidden rounded-2xl border border-border bg-card p-7 hover:border-primary/40 hover:-translate-y-1 transition-all ${i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl", style: {
          background: c.tone === "ember" ? "var(--color-primary)" : c.tone === "gold" ? "var(--color-gold)" : c.tone === "electric" ? "var(--color-electric)" : "var(--color-sage)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary tabular", children: c.num }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-4xl md:text-5xl font-semibold mt-8 leading-none", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif italic text-base text-muted-foreground mt-3", children: c.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-5 border-t border-dashed border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground", children: [
              c.count,
              " events"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" })
          ] })
        ] })
      ] }, c.num)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-mesh-warm grain text-background py-28 relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-[1320px] mx-auto px-6 lg:px-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-14 flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow !text-primary", children: "Featured competitions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-5xl md:text-6xl font-semibold mt-5 text-background tracking-tight leading-[0.98]", children: [
            "The headline",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic font-normal", children: "programmes" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", className: "hidden md:inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-primary hover:text-background transition-colors", children: [
          "All programmes ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5", children: featured.slice(0, 3).map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events/$eventId", params: {
        eventId: e.id
      }, className: "group relative block rounded-2xl border border-background/15 bg-background/[0.04] backdrop-blur p-7 hover:bg-background/[0.08] hover:border-primary/50 transition-all overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-5 right-5 font-mono text-[10px] text-background/40 tabular", children: [
          "N° ",
          String(i + 1).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-2 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-mono text-[10px] uppercase tracking-wider", children: e.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl font-medium mt-5 text-background leading-tight", children: e.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-background/65 leading-relaxed line-clamp-3", children: e.excerpt }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 pt-5 border-t border-background/10 font-mono text-[11px] uppercase tracking-wider text-background/60 tabular flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
            fmtDate(e.date)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: fmtPKR(e.prizePool) })
        ] })
      ] }, e.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-[1320px] mx-auto px-6 lg:px-12 py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-12 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow", children: "Voices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-6", children: "Vol. XXVI · Issue 01" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "Pages 12–14" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-9 space-y-16", children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "grid md:grid-cols-12 gap-6 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-1 font-display text-6xl text-primary leading-none italic", children: '"' }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-11", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { className: "font-display italic font-light text-3xl md:text-4xl leading-tight text-foreground tracking-tight", children: t.quote }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-6 flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-ember grid place-items-center text-primary-foreground font-display font-semibold", children: t.author.charAt(0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: t.author }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5", children: t.role })
            ] })
          ] })
        ] })
      ] }, t.author)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative bg-card border-y border-border py-28 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "absolute inset-0 opacity-30", style: {
        background: "radial-gradient(ellipse at top, color-mix(in oklab, var(--color-gold) 30%, transparent), transparent 60%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-[1320px] mx-auto px-6 lg:px-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow !justify-center", children: "With gratitude to our patrons" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: "Title Patron" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-6xl md:text-7xl font-semibold mt-5 text-gradient-ember", children: sponsors.find((s) => s.tier === "Title")?.company })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 hairline-ember mx-auto w-16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: "Gold Patrons" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap justify-center gap-x-12 gap-y-4", children: sponsors.filter((s) => s.tier === "Gold").map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl md:text-4xl font-medium hover:text-primary transition-colors cursor-default", children: s.company }, s.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: "Silver Patrons" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3", children: sponsors.filter((s) => s.tier === "Silver").map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl text-muted-foreground hover:text-foreground transition-colors cursor-default", children: s.company }, s.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-[1320px] mx-auto px-6 lg:px-12 py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-mesh-warm grain text-background p-12 md:p-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/40 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow !text-primary", children: "Doors close 28 February" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-5xl md:text-7xl font-semibold mt-5 leading-[0.98] tracking-tight", children: [
          "Ready to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic font-normal text-gradient-ember", children: "make your mark" }),
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-background/70 max-w-lg", children: "Registration is free for FAST students, ₨1,500 for everyone else. Team and accommodation packages available." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all", children: [
            "Register now ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "inline-flex items-center gap-2 rounded-full border border-background/30 px-7 py-3.5 text-sm font-medium text-background hover:bg-background/10 transition-colors", children: "I already have an account" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "max-w-[1320px] mx-auto px-6 lg:px-12 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-12 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-3xl font-semibold", children: [
            "SOFTEC",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed", children: "The flagship technology festival of FAST-NUCES. An undergraduate-run institution since 2001." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
            " FAST-NUCES Lahore Campus, Block-B, Faisal Town"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Programme", links: [["Browse events", "/events"], ["Categories", "/events"], ["Schedule", "/events"]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Account", links: [["Sign in", "/login"], ["Register", "/signup"]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "More", links: [["Sponsors", "/"], ["About", "/"]] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-6 border-t border-border flex flex-wrap justify-between items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© MMXXVI SOFTEC · FAST-NUCES Lahore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Pill, { tone: "ember", children: [
          "Edition XXVI · Live in ",
          ct.d,
          "d"
        ] })
      ] })
    ] })
  ] });
}
function FooterCol({
  title,
  links
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-primary", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2.5 text-sm", children: links.map(([l, h]) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: h, className: "text-foreground/80 hover:text-primary transition-colors", children: l }) }, l)) })
  ] });
}
function PublicNav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1320px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-ember grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl font-semibold", children: [
        "SOFTEC",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-8 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events", className: "text-foreground/80 hover:text-primary transition-colors", children: "Programme" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-foreground/80 hover:text-primary transition-colors", children: "Sponsors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-foreground/80 hover:text-primary transition-colors", children: "About" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwitch, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm text-foreground/80 hover:text-primary transition-colors", children: "Sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "hidden sm:inline-flex items-center gap-1.5 text-sm rounded-full bg-foreground text-background px-4 py-2 hover:bg-primary transition-colors", children: [
        "Register ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
      ] })
    ] })
  ] }) });
}
export {
  Landing as component
};
