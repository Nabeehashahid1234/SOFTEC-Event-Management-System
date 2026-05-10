import { createFileRoute } from "@tanstack/react-router";
import { USERS } from "@/lib/mock";
import { Eyebrow, Pill } from "@/components/ui-bits";

export const Route = createFileRoute("/app/sponsors")({ component: Sponsors });

function Sponsors() {
  const sponsors = USERS.filter(u => u.role === "sponsor");
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Edition XXVI</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Patron <em className="italic">Registry</em>.</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {sponsors.map(s => (
          <div key={s.id} className="rounded-lg border border-border bg-card p-6">
            <Pill tone={s.tier === "Title" ? "ember" : s.tier === "Gold" ? "gold" : "muted"}>{s.tier} patron</Pill>
            <h3 className="font-display text-2xl font-semibold mt-3">{s.company}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
