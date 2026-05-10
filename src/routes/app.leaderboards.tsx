import { createFileRoute } from "@tanstack/react-router";
import { LEADERBOARDS, eventById } from "@/lib/mock";
import { Eyebrow } from "@/components/ui-bits";

export const Route = createFileRoute("/app/leaderboards")({ component: Boards });

function Boards() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Live standings</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Leaderboards.</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {Object.entries(LEADERBOARDS).map(([eid, rows]) => {
          const e = eventById(eid);
          return (
            <section key={eid} className="rounded-lg border border-border bg-card p-6">
              <Eyebrow>{e?.category}</Eyebrow>
              <h3 className="font-display text-xl font-semibold mt-2">{e?.name}</h3>
              <ol className="mt-4 divide-y divide-border">
                {rows.map(r => (
                  <li key={r.rank} className="flex items-center gap-3 py-2.5">
                    <span className="font-display text-lg font-semibold tabular w-7 text-primary">{String(r.rank).padStart(2,"0")}</span>
                    <span className="text-sm flex-1">{r.name}</span>
                    <span className="font-mono text-sm tabular text-foreground">{r.score.toFixed(2)}</span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
