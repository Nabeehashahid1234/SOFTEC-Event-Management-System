import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { L as Link } from "./router-BDNVtE_0.js";
import { E as EVENTS } from "./mock-Ca7l8cmZ.js";
import { E as Eyebrow, P as Pill, C as CapacityBar } from "./ui-bits-JagVtLz-.js";
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
import "./format-CIANsOqg.js";
function Sponsorship() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Your patronage" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold mt-3", children: [
      "Sponsored ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "programmes" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid md:grid-cols-2 gap-5", children: EVENTS.slice(0, 4).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events/$eventId", params: {
      eventId: e.id
    }, className: "rounded-lg border border-border bg-card p-6 hover:border-primary/40 transition-colors block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: "muted", children: e.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-semibold mt-3", children: e.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CapacityBar, { filled: e.registered, total: e.capacity }) })
    ] }, e.id)) })
  ] });
}
export {
  Sponsorship as component
};
