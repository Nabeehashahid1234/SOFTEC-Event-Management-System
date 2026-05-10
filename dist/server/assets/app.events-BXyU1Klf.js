import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { u as useAuth, b as useEvents, L as Link } from "./router-BDNVtE_0.js";
import { E as Eyebrow, P as Pill } from "./ui-bits-JagVtLz-.js";
import { f as fmtDate, a as fmtPKR } from "./format-CIANsOqg.js";
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
function AppEvents() {
  const {
    user
  } = useAuth();
  const {
    data: list = [],
    isLoading,
    isError
  } = useEvents();
  const isParticipant = user?.role === "participant";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: isParticipant ? "Your registrations" : "All programmes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold mt-3 mb-8", children: isParticipant ? "My Programme" : "Programmes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card divide-y divide-border", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-5 text-sm text-muted-foreground", children: "Loading programmes..." }),
      isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-5 text-sm text-rose", children: "Could not load programmes." }),
      list.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events/$eventId", params: {
        eventId: e.id
      }, className: "flex items-center gap-5 p-5 hover:bg-muted/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-medium truncate", children: e.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground tabular mt-1", children: [
            fmtDate(e.date),
            " · ",
            e.venueName
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: "muted", children: e.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs tabular text-muted-foreground w-20 text-right", children: [
          e.registered,
          "/",
          e.capacity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-primary", children: fmtPKR(e.fee) })
      ] }, e.id))
    ] })
  ] });
}
export {
  AppEvents as component
};
