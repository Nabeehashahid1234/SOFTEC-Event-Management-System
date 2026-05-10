import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@/components/ui-bits";

export const Route = createFileRoute("/app/reports")({ component: Reports });

const REPORTS = [
  { num: "I", title: "Event Participation", desc: "Registrations per programme, by category and date.", rows: 487 },
  { num: "II", title: "High-Quality Events", desc: "Programmes ranked by judge scores and fill rate.", rows: 50 },
  { num: "III", title: "Sponsorship Funds", desc: "Patron contributions, tier breakdown, ROI estimates.", rows: 12 },
  { num: "IV", title: "Participant Logistics", desc: "Accommodation bookings and lodging utilisation.", rows: 142 },
  { num: "V", title: "Venue Utilisation", desc: "Room bookings, capacity hit-rate, conflict log.", rows: 6 },
  { num: "VI", title: "Live Leaderboard", desc: "Real-time standings across all judged programmes.", rows: 248 },
];

function Reports() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Volume MMXXVI</Eyebrow>
      <h1 className="font-display text-5xl font-semibold mt-3">The <em className="italic">Compendium</em>.</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">Six standing reports, generated on demand. Every figure traces back to the source.</p>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS.map(r => (
          <div key={r.num} className="group rounded-lg border border-border bg-card p-7 hover:border-primary/40 hover:shadow-warm transition-all">
            <p className="font-display text-5xl font-light text-primary tabular leading-none">{r.num}</p>
            <h3 className="font-display text-2xl font-semibold mt-5">{r.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.desc}</p>
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>~{r.rows} rows</span>
              <span className="text-primary group-hover:translate-x-0.5 transition-transform">Generate →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
