import { r as reactExports, W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { u as useAuth, a as useNavigate, L as Link, t as toast } from "./router-BDNVtE_0.js";
import { E as Eyebrow } from "./ui-bits-JagVtLz-.js";
import { T as ThemeSwitch } from "./ThemeSwitch-DFaZj5-r.js";
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
function Login() {
  const {
    login
  } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      await login(email, password);
      toast.success("Welcome back.");
      nav({
        to: "/app/dashboard"
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col justify-between p-12 bg-paper border-r border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-2xl font-semibold", children: [
        "SOFTEC",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Welcome to Edition XXVI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl font-semibold mt-5 leading-[1.05]", children: [
          "Three days that ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "italic text-primary", children: "compress a semester" }),
          " into a notebook."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground max-w-md", children: "Sign in to manage your registrations, teams, and the rest of your SOFTEC story." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: "© MMXXVI · FAST-NUCES Lahore" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card flex items-center justify-center p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-6 top-6 lg:right-8 lg:top-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwitch, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "w-full max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold", children: "Sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: [
          "New here? ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-primary hover:underline", children: "Create an account" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", value: email, onChange: setEmail, required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", type: "password", value: password, onChange: setPassword, required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, className: "w-full bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50", children: busy ? "Signing in…" : "Sign in" })
        ] })
      ] })
    ] })
  ] });
}
function Field({
  label,
  type,
  value,
  onChange,
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, required, onChange: (e) => onChange(e.target.value), className: "mt-2 w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-2 text-sm transition-colors" })
  ] });
}
export {
  Login as component
};
