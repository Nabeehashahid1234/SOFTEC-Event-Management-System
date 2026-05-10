import { O as useRouter, W as jsxRuntimeExports, a3 as Outlet } from "./server-DF9qAbDw.js";
import { c as createLucideIcon, u as useAuth, d as LayoutDashboard, T as Trophy, C as Calendar, S as Sparkles, B as BedDouble, U as Users, F as FileText, L as Link, e as LogOut, f as useCommandPalette } from "./router-BDNVtE_0.js";
import { c as cn } from "./format-CIANsOqg.js";
import { B as Building2 } from "./building-2-DFcLwrc3.js";
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
function useRouterState(opts) {
  const contextRouter = useRouter({ warn: opts?.router === void 0 });
  const router = opts?.router || contextRouter;
  {
    const state = router.stores.__store.get();
    return opts?.select ? opts.select(state) : state;
  }
}
const __iconNode$3 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
      key: "q8bfy3"
    }
  ],
  ["path", { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14", key: "1853fq" }],
  ["path", { d: "M8 6v8", key: "15ugcq" }]
];
const Megaphone = createLucideIcon("megaphone", __iconNode$1);
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
const NAV = {
  admin: [
    { to: "/app/dashboard", label: "Almanac", icon: LayoutDashboard },
    { to: "/app/users", label: "Members", icon: Users },
    { to: "/app/events", label: "Programmes", icon: Calendar },
    { to: "/app/sponsors", label: "Patrons", icon: Building2 },
    { to: "/app/reports", label: "Compendium", icon: FileText }
  ],
  participant: [
    { to: "/app/dashboard", label: "My Desk", icon: LayoutDashboard },
    { to: "/app/events", label: "Programme", icon: Calendar },
    { to: "/app/accommodation", label: "Lodging", icon: BedDouble },
    { to: "/app/teams", label: "Teams", icon: Users }
  ],
  organizer: [
    { to: "/app/dashboard", label: "Editor's Desk", icon: LayoutDashboard },
    { to: "/app/events", label: "My Events", icon: Calendar },
    { to: "/app/events/new", label: "Create", icon: Sparkles }
  ],
  judge: [
    { to: "/app/dashboard", label: "Adjudication", icon: LayoutDashboard },
    { to: "/app/judging", label: "Score", icon: Award },
    { to: "/app/leaderboards", label: "Leaderboards", icon: Trophy }
  ],
  sponsor: [
    { to: "/app/dashboard", label: "Patron's Desk", icon: LayoutDashboard },
    { to: "/app/sponsorship", label: "Programmes", icon: Megaphone }
  ]
};
function Sidebar() {
  const { user, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  const items = NAV[user.role];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-[220px] shrink-0 flex-col border-r border-border bg-sidebar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-7 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-semibold tracking-tight leading-none text-foreground", children: [
        "SOFTEC",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mt-2 !text-[10px] text-muted-foreground", children: "FAST-NUCES · MMXXVI" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 space-y-0.5", children: items.map((it) => {
      const active = path === it.to || it.to !== "/app/dashboard" && path.startsWith(it.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: it.to,
          className: cn(
            "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          ),
          children: [
            active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "h-4 w-4", strokeWidth: 1.75 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: it.label })
          ]
        },
        it.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "m-3 rounded-lg border border-border bg-card p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center font-display font-semibold text-sm", children: user.name.split(" ").map((p) => p[0]).slice(0, 2).join("") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium truncate", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground", children: user.role })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: logout,
          className: "text-muted-foreground hover:text-primary transition-colors",
          "aria-label": "Sign out",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" })
        }
      )
    ] }) })
  ] });
}
const TITLES = {
  "/app/dashboard": { title: "Dashboard", crumb: "Home / Dashboard" },
  "/app/events": { title: "Programmes", crumb: "Home / Programmes" },
  "/app/events/new": { title: "Create Programme", crumb: "Home / Programmes / New" },
  "/app/users": { title: "Member Roster", crumb: "Home / Members" },
  "/app/reports": { title: "Compendium", crumb: "Home / Reports" },
  "/app/sponsors": { title: "Patron Registry", crumb: "Home / Patrons" },
  "/app/sponsorship": { title: "Sponsored Programmes", crumb: "Home / Sponsorship" },
  "/app/judging": { title: "Adjudication", crumb: "Home / Judging" },
  "/app/leaderboards": { title: "Leaderboards", crumb: "Home / Leaderboards" },
  "/app/accommodation": { title: "Lodging", crumb: "Home / Accommodation" },
  "/app/teams": { title: "Your Teams", crumb: "Home / Teams" }
};
function TopBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const meta = TITLES[path] ?? { title: "SOFTEC", crumb: "Home" };
  const { open } = useCommandPalette();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 h-[60px] border-b border-border bg-background/85 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full px-6 flex items-center justify-between gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[19px] leading-none font-semibold text-foreground truncate", children: meta.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1", children: meta.crumb })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: open,
          className: "hidden sm:flex items-center gap-2 h-9 pl-3 pr-2 rounded-md border border-border bg-card hover:border-primary/40 transition-colors text-sm text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search…" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "ml-4 font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border", children: "⌘K" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 grid place-items-center rounded-md border border-border bg-card hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground", "aria-label": "Notifications", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwitch, {})
    ] })
  ] }) });
}
function AppShell() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AppShell as component
};
