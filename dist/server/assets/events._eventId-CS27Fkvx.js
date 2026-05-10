import { r as reactExports, W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { c as createLucideIcon, R as Route, g as useEvent, L as Link, C as Calendar, U as Users, t as toast } from "./router-BDNVtE_0.js";
import { b as countdown, f as fmtDate, d as fmtTime, a as fmtPKR } from "./format-CIANsOqg.js";
import { E as Eyebrow, H as Hairline } from "./ui-bits-JagVtLz-.js";
import { T as ThemeSwitch } from "./ThemeSwitch-DFaZj5-r.js";
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
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function EventDetail() {
  const {
    eventId
  } = Route.useParams();
  const {
    data,
    isLoading,
    isError
  } = useEvent(eventId);
  const event = data?.event;
  const [, force] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 6e4);
    return () => clearInterval(id);
  }, []);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading programme..." }) });
  if (isError || !event) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose", children: "Programme not found." }) });
  const ct = countdown(event.date);
  const board = data?.leaderboard ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-xl font-semibold", children: [
        "SOFTEC",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwitch, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", className: "text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
          " All programmes"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-[1280px] mx-auto px-6 lg:px-12 pt-14 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: event.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl md:text-7xl font-semibold mt-4 leading-[1.02] max-w-4xl", children: event.name.split(" ").map((w, i, arr) => i === arr.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic font-normal text-primary", children: w }, i) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        w,
        " "
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground tabular border-y border-border py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
          " ",
          fmtDate(event.date),
          " · ",
          fmtTime(event.date)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
          " ",
          event.venueName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
          " ",
          event.registered,
          "/",
          event.capacity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: event.fee === 0 ? "Free entry" : fmtPKR(event.fee) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-[1280px] mx-auto px-6 lg:px-12 pb-24 grid lg:grid-cols-12 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "lg:col-span-8 space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg leading-relaxed text-foreground drop-cap", children: event.description }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Rules", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: (event.rules.length ? event.rules : ["Rules will be announced by the organizer."]).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-primary tabular w-6", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/85", children: r })
        ] }, i)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Prize Pool", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-5xl font-semibold tabular text-foreground", children: fmtPKR(event.prizePool) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-2", children: "Distributed across the top three positions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Schedule", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-0", children: (data?.rounds || []).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "relative pl-10 pb-6 last:pb-0 border-l border-border ml-3 -mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground tabular", children: [
            fmtDate(r.date),
            " · ",
            fmtTime(r.date)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-medium mt-1", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: r.venue })
        ] }, i)) }) }),
        board.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Live Leaderboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 px-5 py-3 bg-muted/40 border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: "Rank" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-7", children: "Contender" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right", children: "Score" })
          ] }),
          board.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 px-5 py-3.5 border-b border-border last:border-0 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 font-display text-2xl font-semibold tabular", children: "--" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: row.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right font-mono tabular text-primary font-semibold", children: Number(row.avg_score).toFixed(2) })
          ] }, row.participant_id))
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:sticky lg:top-24 rounded-lg border border-border bg-card p-6 shadow-warm space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CapacityRing, { filled: event.registered, total: event.capacity }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hairline, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Fee", value: event.fee === 0 ? "Free" : fmtPKR(event.fee), accent: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Closes in", value: `${ct.d}d ${ct.h}h ${ct.m}m` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Venue", value: event.venueName || "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hairline, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "block w-full text-center bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors", children: "Register for this programme" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "hover:text-primary transition-colors", children: "+ Add to calendar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            navigator.clipboard?.writeText(window.location.href);
            toast.success("Link copied");
          }, className: "inline-flex items-center gap-1.5 hover:text-primary transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
            " Share"
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-ember w-10 mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold mb-6", children: title }),
    children
  ] });
}
function Row({
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-medium tabular ${accent ? "text-primary" : "text-foreground"}`, children: value })
  ] });
}
function CapacityRing({
  filled,
  total
}) {
  const pct = Math.min(100, filled / total * 100);
  const r = 42, c = 2 * Math.PI * r;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100", height: "100", viewBox: "0 0 100 100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r, fill: "none", stroke: "var(--border)", strokeWidth: "6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r, fill: "none", stroke: "var(--primary)", strokeWidth: "6", strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: c - pct / 100 * c, transform: "rotate(-90 50 50)", className: "transition-all duration-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("text", { x: "50", y: "48", textAnchor: "middle", className: "font-display fill-foreground tabular", fontSize: "20", fontWeight: "600", children: [
        Math.round(pct),
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "50", y: "63", textAnchor: "middle", className: "font-mono fill-muted-foreground", fontSize: "8", children: "FILLED" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "Capacity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl font-semibold tabular mt-1", children: [
        filled,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-base", children: [
          "/ ",
          total
        ] })
      ] })
    ] })
  ] });
}
export {
  EventDetail as component
};
