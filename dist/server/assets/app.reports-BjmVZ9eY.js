import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { E as Eyebrow } from "./ui-bits-JagVtLz-.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./format-CIANsOqg.js";
const REPORTS = [{
  num: "I",
  title: "Event Participation",
  desc: "Registrations per programme, by category and date.",
  rows: 487
}, {
  num: "II",
  title: "High-Quality Events",
  desc: "Programmes ranked by judge scores and fill rate.",
  rows: 50
}, {
  num: "III",
  title: "Sponsorship Funds",
  desc: "Patron contributions, tier breakdown, ROI estimates.",
  rows: 12
}, {
  num: "IV",
  title: "Participant Logistics",
  desc: "Accommodation bookings and lodging utilisation.",
  rows: 142
}, {
  num: "V",
  title: "Venue Utilisation",
  desc: "Room bookings, capacity hit-rate, conflict log.",
  rows: 6
}, {
  num: "VI",
  title: "Live Leaderboard",
  desc: "Real-time standings across all judged programmes.",
  rows: 248
}];
function Reports() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Volume MMXXVI" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl font-semibold mt-3", children: [
      "The ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "Compendium" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-2xl", children: "Six standing reports, generated on demand. Every figure traces back to the source." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5", children: REPORTS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-lg border border-border bg-card p-7 hover:border-primary/40 hover:shadow-warm transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-5xl font-light text-primary tabular leading-none", children: r.num }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-semibold mt-5", children: r.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 leading-relaxed", children: r.desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "~",
          r.rows,
          " rows"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary group-hover:translate-x-0.5 transition-transform", children: "Generate →" })
      ] })
    ] }, r.num)) })
  ] });
}
export {
  Reports as component
};
