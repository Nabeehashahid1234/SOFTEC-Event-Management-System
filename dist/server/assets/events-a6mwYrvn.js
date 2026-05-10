import { r as reactExports, W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { c as createLucideIcon, b as useEvents, L as Link, C as Calendar } from "./router-BDNVtE_0.js";
import { c as cn, f as fmtDate, a as fmtPKR } from "./format-CIANsOqg.js";
import { E as Eyebrow, P as Pill, C as CapacityBar } from "./ui-bits-JagVtLz-.js";
import { T as ThemeSwitch } from "./ThemeSwitch-DFaZj5-r.js";
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
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$1);
const __iconNode = [
  ["path", { d: "M15 18h-5", key: "95g1m2" }],
  ["path", { d: "M18 14h-8", key: "sponae" }],
  [
    "path",
    {
      d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2",
      key: "39pd36"
    }
  ],
  ["rect", { width: "8", height: "4", x: "10", y: "6", rx: "1", key: "aywv1n" }]
];
const Newspaper = createLucideIcon("newspaper", __iconNode);
const CATS = ["All", "Tech", "Business", "Gaming", "General"];
function EventBrowser() {
  const [cat, setCat] = reactExports.useState("All");
  const [view, setView] = reactExports.useState("magazine");
  const [feeOnly, setFeeOnly] = reactExports.useState("all");
  const {
    data: allEvents = [],
    isLoading,
    isError
  } = useEvents(cat === "All" ? void 0 : {
    category: cat
  });
  const filtered = reactExports.useMemo(() => allEvents.filter((e) => feeOnly === "all" || (feeOnly === "free" ? e.fee === 0 : e.fee > 0)), [allEvents, feeOnly]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-xl font-semibold", children: [
        "SOFTEC",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwitch, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm hover:text-primary transition-colors", children: "Sign in" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "The complete index" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-6xl font-semibold mt-4 leading-[1.05]", children: [
        "Browse the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "programme" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-muted-foreground max-w-2xl", children: "Fifty-plus competitions, panels, and exhibitions across four categories. Filter by what catches your eye." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-y border-border bg-card sticky top-0 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-12 py-4 flex flex-wrap items-center gap-x-6 gap-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: CATS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCat(c), className: cn("px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors", cat === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"), children: c }, c)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block h-6 w-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: ["all", "free", "paid"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFeeOnly(f), className: cn("px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors", feeOnly === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"), children: f }, f)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-1 border border-border rounded-md p-0.5", children: [{
        v: "magazine",
        icon: Newspaper
      }, {
        v: "grid",
        icon: LayoutGrid
      }, {
        v: "calendar",
        icon: Calendar
      }].map(({
        v,
        icon: I
      }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView(v), className: cn("h-7 w-7 grid place-items-center rounded transition-colors", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"), "aria-label": v, children: /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-3.5 w-3.5" }) }, v)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-[1280px] mx-auto px-6 lg:px-12 py-12", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading programmes..." }),
      isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose", children: "Could not load programmes." }),
      !isLoading && !isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        view === "magazine" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: filtered.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events/$eventId", params: {
          eventId: e.id
        }, className: "group block rounded-lg border border-border bg-card p-7 hover:border-primary/40 hover:shadow-warm transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: e.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: e.status === "filling" ? "ember" : e.status === "closed" ? "rose" : "sage", children: e.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-4xl font-medium mt-3 leading-tight group-hover:text-primary transition-colors", children: e.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl", children: e.excerpt }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground tabular", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmtDate(e.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: e.venueName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: e.fee === 0 ? "Free" : fmtPKR(e.fee) }),
              e.prizePool > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Prize ",
                  fmtPKR(e.prizePool)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 lg:border-l lg:border-border lg:pl-8 flex flex-col justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CapacityBar, { filled: e.registered, total: e.capacity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "self-start text-sm text-primary font-medium group-hover:underline", children: "View programme →" })
          ] })
        ] }) }, e.id)) }),
        view === "grid" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filtered.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events/$eventId", params: {
          eventId: e.id
        }, className: "rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:shadow-warm transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: e.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-medium mt-2 leading-tight", children: e.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground mt-3 tabular", children: [
            fmtDate(e.date),
            " · ",
            e.venueName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground line-clamp-2", children: e.excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 pt-4 border-t border-border flex items-center justify-between font-mono text-[11px] tabular", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              e.registered,
              "/",
              e.capacity
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: e.fee === 0 ? "Free" : fmtPKR(e.fee) })
          ] })
        ] }, e.id)) }),
        view === "calendar" && /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarView, { events: filtered })
      ] })
    ] })
  ] });
}
function CalendarView({
  events
}) {
  const today = /* @__PURE__ */ new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startWeekday = start.getDay();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let i = 1; i <= days; i++) cells.push(new Date(today.getFullYear(), today.getMonth(), i));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-medium", children: start.toLocaleString("en-GB", {
        month: "long",
        year: "numeric"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground", children: [
        events.length,
        " programmes scheduled"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 border-b border-border", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground p-2 border-r border-border last:border-r-0 text-center", children: d }, d)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7", children: cells.map((d, i) => {
      const dayEvents = d ? events.filter((e) => {
        const ed = new Date(e.date);
        return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth();
      }) : [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[110px] border-r border-b border-border last:border-r-0 p-2 space-y-1", children: [
        d && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-mono text-xs tabular text-right", d.toDateString() === today.toDateString() ? "text-primary font-semibold" : "text-muted-foreground"), children: d.getDate() }),
        dayEvents.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events/$eventId", params: {
          eventId: e.id
        }, className: cn("block text-[10px] px-1.5 py-1 rounded truncate font-medium", e.category === "Tech" ? "bg-primary/15 text-primary" : e.category === "Business" ? "bg-sage/15 text-sage" : e.category === "Gaming" ? "bg-rose/15 text-rose" : "bg-gold/15 text-gold"), children: e.name }, e.id))
      ] }, i);
    }) })
  ] });
}
export {
  EventBrowser as component
};
