import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, LayoutGrid, Newspaper } from "lucide-react";
import { useEvents, type UiCategory } from "@/hooks/useEvents";
import { fmtDate, fmtPKR, cn } from "@/lib/format";
import { Eyebrow, Pill, CapacityBar } from "@/components/ui-bits";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Browse the Programme — SOFTEC '26" },
      { name: "description", content: "All competitions and events at SOFTEC '26." },
    ],
  }),
  component: EventBrowser,
});

const CATS: ("All" | UiCategory)[] = ["All", "Tech", "Business", "Gaming", "General"];

function EventBrowser() {
  const [cat, setCat] = useState<"All" | UiCategory>("All");
  const [view, setView] = useState<"magazine" | "grid" | "calendar">("magazine");
  const [feeOnly, setFeeOnly] = useState<"all" | "free" | "paid">("all");
  const { data: allEvents = [], isLoading, isError } = useEvents(cat === "All" ? undefined : { category: cat });

  const filtered = useMemo(() => allEvents.filter(e =>
    (feeOnly === "all" || (feeOnly === "free" ? e.fee === 0 : e.fee > 0))
  ), [allEvents, feeOnly]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold">SOFTEC<span className="text-primary">.</span></Link>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Link to="/login" className="text-sm hover:text-primary transition-colors">Sign in</Link>
          </div>
        </div>
      </header>

      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 pb-10">
        <Eyebrow>The complete index</Eyebrow>
        <h1 className="font-display text-5xl md:text-6xl font-semibold mt-4 leading-[1.05]">
          Browse the <em className="italic">programme</em>.
        </h1>
        <p className="mt-5 text-muted-foreground max-w-2xl">Fifty-plus competitions, panels, and exhibitions across four categories. Filter by what catches your eye.</p>
      </section>

      {/* filter strip */}
      <div className="border-y border-border bg-card sticky top-0 z-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-1">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={cn(
                "px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors",
                cat === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}>{c}</button>
            ))}
          </div>
          <div className="hidden md:block h-6 w-px bg-border" />
          <div className="flex items-center gap-1">
            {(["all", "free", "paid"] as const).map(f => (
              <button key={f} onClick={() => setFeeOnly(f)} className={cn(
                "px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors",
                feeOnly === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}>{f}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1 border border-border rounded-md p-0.5">
            {[
              { v: "magazine" as const, icon: Newspaper },
              { v: "grid" as const, icon: LayoutGrid },
              { v: "calendar" as const, icon: Calendar },
            ].map(({ v, icon: I }) => (
              <button key={v} onClick={() => setView(v)} className={cn(
                "h-7 w-7 grid place-items-center rounded transition-colors",
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )} aria-label={v}>
                <I className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12">
        {isLoading && <p className="text-sm text-muted-foreground">Loading programmes...</p>}
        {isError && <p className="text-sm text-rose">Could not load programmes.</p>}
        {!isLoading && !isError && (
          <>
        {view === "magazine" && (
          <div className="space-y-8">
            {filtered.map(e => (
              <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="group block rounded-lg border border-border bg-card p-7 hover:border-primary/40 hover:shadow-warm transition-all">
                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Eyebrow>{e.category}</Eyebrow>
                      <Pill tone={e.status === "filling" ? "ember" : e.status === "closed" ? "rose" : "sage"}>{e.status}</Pill>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-medium mt-3 leading-tight group-hover:text-primary transition-colors">{e.name}</h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">{e.excerpt}</p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground tabular">
                      <span>{fmtDate(e.date)}</span>
                      <span>·</span>
                      <span>{e.venueName}</span>
                      <span>·</span>
                      <span className="text-primary">{e.fee === 0 ? "Free" : fmtPKR(e.fee)}</span>
                      {e.prizePool > 0 && <><span>·</span><span>Prize {fmtPKR(e.prizePool)}</span></>}
                    </div>
                  </div>
                  <div className="lg:col-span-4 lg:border-l lg:border-border lg:pl-8 flex flex-col justify-between gap-4">
                    <CapacityBar filled={e.registered} total={e.capacity} />
                    <span className="self-start text-sm text-primary font-medium group-hover:underline">View programme →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {view === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(e => (
              <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:shadow-warm transition-all">
                <Eyebrow>{e.category}</Eyebrow>
                <h3 className="font-display text-xl font-medium mt-2 leading-tight">{e.name}</h3>
                <p className="font-mono text-[11px] text-muted-foreground mt-3 tabular">{fmtDate(e.date)} · {e.venueName}</p>
                <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{e.excerpt}</p>
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between font-mono text-[11px] tabular">
                  <span className="text-muted-foreground">{e.registered}/{e.capacity}</span>
                  <span className="text-primary">{e.fee === 0 ? "Free" : fmtPKR(e.fee)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {view === "calendar" && <CalendarView events={filtered} />}
          </>
        )}
      </section>
    </div>
  );
}

function CalendarView({ events }: { events: Array<{ id: string; name: string; category: UiCategory; date: string }> }) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startWeekday = start.getDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let i = 1; i <= days; i++) cells.push(new Date(today.getFullYear(), today.getMonth(), i));

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-display text-xl font-medium">{start.toLocaleString("en-GB", { month: "long", year: "numeric" })}</h3>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{events.length} programmes scheduled</p>
      </div>
      <div className="grid grid-cols-7 border-b border-border">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground p-2 border-r border-border last:border-r-0 text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const dayEvents = d ? events.filter(e => {
            const ed = new Date(e.date);
            return ed.getDate() === d.getDate() && ed.getMonth() === d.getMonth();
          }) : [];
          return (
            <div key={i} className="min-h-[110px] border-r border-b border-border last:border-r-0 p-2 space-y-1">
              {d && (
                <p className={cn(
                  "font-mono text-xs tabular text-right",
                  d.toDateString() === today.toDateString() ? "text-primary font-semibold" : "text-muted-foreground"
                )}>{d.getDate()}</p>
              )}
              {dayEvents.map(e => (
                <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className={cn(
                  "block text-[10px] px-1.5 py-1 rounded truncate font-medium",
                  e.category === "Tech" ? "bg-primary/15 text-primary" :
                  e.category === "Business" ? "bg-sage/15 text-sage" :
                  e.category === "Gaming" ? "bg-rose/15 text-rose" :
                  "bg-gold/15 text-gold"
                )}>{e.name}</Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
