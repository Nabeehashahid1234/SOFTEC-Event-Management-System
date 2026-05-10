import { createFileRoute } from "@tanstack/react-router";
import { ROOM_TYPES } from "@/lib/mock";
import { Eyebrow } from "@/components/ui-bits";
import { fmtPKR } from "@/lib/format";

export const Route = createFileRoute("/app/accommodation")({ component: Lodging });

function Lodging() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>On-campus lodging</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Find a <em className="italic">room</em>.</h1>
      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        {ROOM_TYPES.map(rt => (
          <div key={rt.id} className="rounded-lg border border-border bg-card p-6">
            <p className="font-display text-xl font-medium">{rt.name}</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Capacity {rt.capacity} · {rt.available} available</p>
            <p className="font-display text-3xl font-semibold tabular mt-5">{fmtPKR(rt.price)}<span className="text-sm font-normal font-sans text-muted-foreground">/night</span></p>
            <button className="mt-5 w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:bg-primary-dark">Book now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
