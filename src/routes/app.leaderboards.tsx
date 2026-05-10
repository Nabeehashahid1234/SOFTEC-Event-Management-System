import { createFileRoute } from "@tanstack/react-router";
import { useEvents } from "@/hooks/useEvents";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Eyebrow } from "@/components/ui-bits";

export const Route = createFileRoute("/app/leaderboards")({ component: Boards });

function Boards() {
  const { data: events = [] } = useEvents();
  const spotlight = events.filter((e: any) => e.registered > 0).slice(0, 4);

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Live standings</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Leaderboards.</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {spotlight.map((event: any) => (
          <LeaderboardPanel key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function LeaderboardPanel({ event }: { event: any }) {
  const { data: rows = [] } = useLeaderboard(event.id);

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <Eyebrow>{event.category}</Eyebrow>
      <h3 className="font-display text-xl font-semibold mt-2">{event.name}</h3>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No leaderboard entries yet.</p>
      ) : (
        <ol className="mt-4 divide-y divide-border">
          {rows.map((row) => (
            <li key={`${event.id}-${row.rank}-${row.participant_id}`} className="flex items-center gap-3 py-2.5">
              <span className="font-display text-lg font-semibold tabular w-7 text-primary">{String(row.rank).padStart(2, "0")}</span>
              <span className="text-sm flex-1">{row.name}</span>
              <span className="font-mono text-sm tabular text-foreground">{Number(row.score ?? 0).toFixed(2)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
