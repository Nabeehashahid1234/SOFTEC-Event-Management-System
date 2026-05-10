import { createFileRoute, Link } from "@tanstack/react-router";
import { EVENTS } from "@/lib/mock";
import { Eyebrow, Pill, CapacityBar } from "@/components/ui-bits";

export const Route = createFileRoute("/app/sponsorship")({ component: Sponsorship });

function Sponsorship() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Your patronage</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Sponsored <em className="italic">programmes</em>.</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {EVENTS.slice(0,4).map(e => (
          <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="rounded-lg border border-border bg-card p-6 hover:border-primary/40 transition-colors block">
            <Pill tone="muted">{e.category}</Pill>
            <h3 className="font-display text-2xl font-semibold mt-3">{e.name}</h3>
            <div className="mt-5"><CapacityBar filled={e.registered} total={e.capacity} /></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
