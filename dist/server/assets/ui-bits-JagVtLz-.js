import { W as jsxRuntimeExports } from "./server-DF9qAbDw.js";
import { c as cn } from "./format-CIANsOqg.js";
function Eyebrow({ children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("eyebrow inline-block", className), children });
}
function Hairline({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: cn("border-0 border-t border-border", className) });
}
function StatCard({
  label,
  value,
  hint,
  accent
}) {
  const color = accent === "sage" ? "text-sage" : accent === "rose" ? "text-rose" : accent === "gold" ? "text-gold" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-5 shadow-warm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-display font-semibold tabular text-4xl mt-3 leading-none", color), children: value }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground mt-3", children: hint })
  ] });
}
function Pill({
  children,
  tone = "muted"
}) {
  const map = {
    ember: "bg-primary/10 text-primary border-primary/20",
    sage: "bg-sage/10 text-sage border-sage/20",
    rose: "bg-rose/10 text-rose border-rose/20",
    gold: "bg-gold/10 text-gold border-gold/20",
    ink: "bg-ink text-background border-ink",
    muted: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider", map[tone]), children });
}
function CapacityBar({ filled, total, accent }) {
  const pct = Math.min(100, Math.round(filled / total * 100));
  const color = pct >= 90 ? "bg-rose" : pct >= 60 ? "bg-primary" : "bg-sage";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-full transition-all duration-500", accent ?? color), style: { width: pct + "%" } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground tabular flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        filled,
        " / ",
        total
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        pct,
        "% filled"
      ] })
    ] })
  ] });
}
export {
  CapacityBar as C,
  Eyebrow as E,
  Hairline as H,
  Pill as P,
  StatCard as S
};
