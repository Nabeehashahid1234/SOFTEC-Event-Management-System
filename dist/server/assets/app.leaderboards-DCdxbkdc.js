import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { L as LEADERBOARDS, e as eventById } from "./mock-Ca7l8cmZ.js";
import { E as Eyebrow } from "./ui-bits-JagVtLz-.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./format-CIANsOqg.js";
function Boards() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Live standings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold mt-3", children: "Leaderboards." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid md:grid-cols-2 gap-6", children: Object.entries(LEADERBOARDS).map(([eid, rows]) => {
      const e = eventById(eid);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: e?.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold mt-2", children: e?.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-4 divide-y divide-border", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold tabular w-7 text-primary", children: String(r.rank).padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm flex-1", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm tabular text-foreground", children: r.score.toFixed(2) })
        ] }, r.rank)) })
      ] }, eid);
    }) })
  ] });
}
export {
  Boards as component
};
