import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { a as ROOM_TYPES } from "./mock-Ca7l8cmZ.js";
import { E as Eyebrow } from "./ui-bits-JagVtLz-.js";
import { a as fmtPKR } from "./format-CIANsOqg.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Lodging() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "On-campus lodging" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold mt-3", children: [
      "Find a ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "room" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid sm:grid-cols-3 gap-5", children: ROOM_TYPES.map((rt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-medium", children: rt.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-1", children: [
        "Capacity ",
        rt.capacity,
        " · ",
        rt.available,
        " available"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-3xl font-semibold tabular mt-5", children: [
        fmtPKR(rt.price),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-normal font-sans text-muted-foreground", children: "/night" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-5 w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark", children: "Book now" })
    ] }, rt.id)) })
  ] });
}
export {
  Lodging as component
};
