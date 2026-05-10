import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { L as Link } from "./router-BDNVtE_0.js";
import { E as EVENTS } from "./mock-Ca7l8cmZ.js";
import { E as Eyebrow, P as Pill, C as CapacityBar } from "./ui-bits-JagVtLz-.js";
import { f as fmtDate } from "./format-CIANsOqg.js";
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
function Judging() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Adjudication" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold mt-3", children: [
      "Score ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "submissions" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-4", children: EVENTS.filter((e) => e.judges.length > 0).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events/$eventId", params: {
      eventId: e.id
    }, className: "block rounded-lg border border-border bg-card p-6 hover:border-primary/40 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: "ember", children: e.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-medium mt-2", children: e.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground mt-1 tabular", children: fmtDate(e.date) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CapacityBar, { filled: Math.floor(e.registered * 0.4), total: e.registered }) })
    ] }) }, e.id)) })
  ] });
}
export {
  Judging as component
};
