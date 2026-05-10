import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { U as USERS } from "./mock-Ca7l8cmZ.js";
import { E as Eyebrow, P as Pill } from "./ui-bits-JagVtLz-.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./format-CIANsOqg.js";
function Sponsors() {
  const sponsors = USERS.filter((u) => u.role === "sponsor");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Edition XXVI" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold mt-3", children: [
      "Patron ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "Registry" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid md:grid-cols-2 gap-5", children: sponsors.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Pill, { tone: s.tier === "Title" ? "ember" : s.tier === "Gold" ? "gold" : "muted", children: [
        s.tier,
        " patron"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-semibold mt-3", children: s.company }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: s.email })
    ] }, s.id)) })
  ] });
}
export {
  Sponsors as component
};
