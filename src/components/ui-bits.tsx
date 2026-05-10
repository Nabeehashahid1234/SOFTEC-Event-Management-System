import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow inline-block", className)}>{children}</span>;
}

export function Hairline({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border", className)} />;
}

export function StatCard({
  label, value, hint, accent,
}: { label: string; value: ReactNode; hint?: ReactNode; accent?: "ember" | "sage" | "rose" | "gold" }) {
  const color = accent === "sage" ? "text-sage" : accent === "rose" ? "text-rose" : accent === "gold" ? "text-gold" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-warm">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={cn("font-display font-semibold tabular text-4xl mt-3 leading-none", color)}>{value}</p>
      {hint && <p className="font-mono text-[11px] text-muted-foreground mt-3">{hint}</p>}
    </div>
  );
}

export function Pill({
  children, tone = "muted",
}: { children: ReactNode; tone?: "ember" | "sage" | "rose" | "gold" | "muted" | "ink" }) {
  const map: Record<string, string> = {
    ember: "bg-primary/10 text-primary border-primary/20",
    sage:  "bg-sage/10 text-sage border-sage/20",
    rose:  "bg-rose/10 text-rose border-rose/20",
    gold:  "bg-gold/10 text-gold border-gold/20",
    ink:   "bg-ink text-background border-ink",
    muted: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider", map[tone])}>
      {children}
    </span>
  );
}

export function CapacityBar({ filled, total, accent }: { filled: number; total: number; accent?: string }) {
  const pct = Math.min(100, Math.round((filled / total) * 100));
  const color = pct >= 90 ? "bg-rose" : pct >= 60 ? "bg-primary" : "bg-sage";
  return (
    <div className="space-y-1.5">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-500", accent ?? color)} style={{ width: pct + "%" }} />
      </div>
      <p className="font-mono text-[10px] text-muted-foreground tabular flex justify-between">
        <span>{filled} / {total}</span>
        <span>{pct}% filled</span>
      </p>
    </div>
  );
}
