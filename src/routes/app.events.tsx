import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEvents } from "@/hooks/useEvents";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { fmtDate, fmtPKR } from "@/lib/format";

export const Route = createFileRoute("/app/events")({ component: AppEvents });

function AppEvents() {
  const { user } = useAuth();
  const { data: list = [], isLoading, isError } = useEvents();
  const isParticipant = user?.role === "participant";

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>{isParticipant ? "Your registrations" : "All programmes"}</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3 mb-8">{isParticipant ? "My Programme" : "Programmes"}</h1>
      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {isLoading && <p className="p-5 text-sm text-muted-foreground">Loading programmes...</p>}
        {isError && <p className="p-5 text-sm text-rose">Could not load programmes.</p>}
        {list.map(e => (
          <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="flex items-center gap-5 p-5 hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg font-medium truncate">{e.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground tabular mt-1">{fmtDate(e.date)} · {e.venueName}</p>
            </div>
            <Pill tone="muted">{e.category}</Pill>
            <span className="font-mono text-xs tabular text-muted-foreground w-20 text-right">{e.registered}/{e.capacity}</span>
            <span className="text-sm font-medium text-primary">{fmtPKR(e.fee)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
