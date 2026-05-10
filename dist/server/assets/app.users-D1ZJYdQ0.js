import { r as reactExports, W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { U as USERS } from "./mock-Ca7l8cmZ.js";
import { E as Eyebrow, P as Pill } from "./ui-bits-JagVtLz-.js";
import { c as cn } from "./format-CIANsOqg.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Members() {
  const [q, setQ] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("all");
  const list = USERS.filter((u) => (role === "all" || u.role === role) && (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1280px] mx-auto px-6 lg:px-10 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Roster" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-semibold mt-3", children: [
      "Member ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic", children: "Roster" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search members…", className: "px-4 py-2 rounded-md border border-border bg-card text-sm w-64 outline-none focus:border-primary" }),
      ["all", "admin", "participant", "organizer", "judge", "sponsor"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRole(r), className: cn("px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider", role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"), children: r }, r))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-lg border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: list.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 font-medium", children: u.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-muted-foreground", children: u.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: u.role === "admin" ? "ink" : u.role === "sponsor" ? "gold" : u.role === "judge" ? "rose" : "muted", children: u.role }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs tabular text-muted-foreground", children: u.rollNumber ?? u.id })
      ] }, u.id)) })
    ] }) })
  ] });
}
export {
  Members as component
};
