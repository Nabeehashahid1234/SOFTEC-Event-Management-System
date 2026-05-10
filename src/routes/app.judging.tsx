import { createFileRoute, Link } from "@tanstack/react-router";
import { EVENTS } from "@/lib/mock";
import { Eyebrow, Pill, CapacityBar } from "@/components/ui-bits";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/app/judging")({ component: Judging });

function Judging() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Adjudication</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Score <em className="italic">submissions</em>.</h1>
      <div className="mt-8 space-y-4">
        {EVENTS.filter(e => e.judges.length > 0).map(e => (
          <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="block rounded-lg border border-border bg-card p-6 hover:border-primary/40 transition-colors">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Pill tone="ember">{e.category}</Pill>
                <h3 className="font-display text-2xl font-medium mt-2">{e.name}</h3>
                <p className="font-mono text-[11px] text-muted-foreground mt-1 tabular">{fmtDate(e.date)}</p>
              </div>
              <div className="w-48"><CapacityBar filled={Math.floor(e.registered * 0.4)} total={e.registered} /></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
