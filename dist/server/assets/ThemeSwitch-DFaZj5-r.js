import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { c as cn } from "./format-CIANsOqg.js";
import { c as createLucideIcon, h as useTheme, i as Sun } from "./router-BDNVtE_0.js";
const __iconNode = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode);
function ThemeSwitch({ className }) {
  const { theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex h-9 items-center rounded-md border border-border bg-card p-0.5", className), "aria-label": "Theme", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTheme("light"),
        className: cn(
          "h-8 w-8 grid place-items-center rounded transition-colors",
          theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        ),
        "aria-label": "Light mode",
        title: "Light mode",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTheme("dark"),
        className: cn(
          "h-8 w-8 grid place-items-center rounded transition-colors",
          theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        ),
        "aria-label": "Dark mode",
        title: "Dark mode",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" })
      }
    )
  ] });
}
export {
  ThemeSwitch as T
};
