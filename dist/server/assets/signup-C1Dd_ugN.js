import { r as reactExports, W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { c as createLucideIcon, u as useAuth, a as useNavigate, L as Link, t as toast } from "./router-BDNVtE_0.js";
import { E as Eyebrow } from "./ui-bits-JagVtLz-.js";
import { c as cn } from "./format-CIANsOqg.js";
import { T as ThemeSwitch } from "./ThemeSwitch-DFaZj5-r.js";
import { B as Briefcase } from "./briefcase-FJ8BtpFa.js";
import { B as Building2 } from "./building-2-DFcLwrc3.js";
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
  ["path", { d: "m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381", key: "pgg06f" }],
  ["path", { d: "m16 16 6-6", key: "vzrcl6" }],
  ["path", { d: "m21.5 10.5-8-8", key: "a17d9x" }],
  ["path", { d: "m8 8 6-6", key: "18bi4p" }],
  ["path", { d: "m8.5 7.5 8 8", key: "1oyaui" }]
];
const Gavel = createLucideIcon("gavel", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const ROLES = [{
  id: "participant",
  label: "Participant",
  desc: "Compete in events, build teams, win prizes.",
  icon: User
}, {
  id: "organizer",
  label: "Organizer",
  desc: "Run a programme. Schedule, judge, deliver.",
  icon: Briefcase
}, {
  id: "judge",
  label: "Judge",
  desc: "Score submissions. Faculty & industry only.",
  icon: Gavel
}, {
  id: "sponsor",
  label: "Sponsor",
  desc: "Patron a category. Reach thousands.",
  icon: Building2
}];
function Signup() {
  const {
    signup
  } = useAuth();
  const nav = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("participant");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup({
        name,
        email,
        password,
        role
      });
      toast.success("Welcome to SOFTEC '26.");
      nav({
        to: "/app/dashboard"
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col justify-between p-12 bg-paper border-r border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-2xl font-semibold", children: [
        "SOFTEC",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Begin your edition" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl font-semibold mt-5 leading-[1.05]", children: [
          "Pick your ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic text-primary", children: "role" }),
          ". The rest unfolds."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "© MMXXVI · FAST-NUCES" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card p-8 md:p-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-6 top-6 lg:right-8 lg:top-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwitch, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "max-w-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold", children: "Create account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: [
          "Already registered? ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "Sign in" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), className: "inp" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "inp" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "inp" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-8 mb-3", children: "Choose your role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2.5", children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setRole(r.id), className: cn("text-left p-3.5 rounded-lg border transition-all", role === r.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: cn("h-4 w-4", role === r.id ? "text-primary" : "text-muted-foreground"), strokeWidth: 1.75 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mt-2", children: r.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 leading-snug", children: r.desc })
        ] }, r.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-8 w-full bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors", children: "Create account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp{margin-top:.5rem;width:100%;background:transparent;border:0;border-bottom:1px solid var(--border);outline:none;padding:.5rem 0;font-size:.875rem;transition:border-color .2s}.inp:focus{border-color:var(--primary)}` })
      ] })
    ] })
  ] });
}
function F({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    children
  ] });
}
export {
  Signup as component
};
