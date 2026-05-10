import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { E as Eyebrow } from "./ui-bits-JagVtLz-.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./format-CIANsOqg.js";
const TEAMS = [{
  id: "t1",
  name: "ByteForce",
  event: "SOFTEC Hackathon",
  members: ["BA", "HI", "OS", "ZM"],
  role: "Captain"
}, {
  id: "t2",
  name: "Recursion",
  event: "Speed Programming",
  members: ["BA", "ZM"],
  role: "Member"
}];
function Teams() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Your teams" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold mt-3", children: "Teams." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid md:grid-cols-2 gap-5", children: TEAMS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t.event })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-primary", children: t.role })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex -space-x-2", children: t.members.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-9 w-9 rounded-full bg-primary/10 text-primary border-2 border-card grid place-items-center font-display font-semibold text-xs", children: m }, m)) })
    ] }, t.id)) })
  ] });
}
export {
  Teams as component
};
