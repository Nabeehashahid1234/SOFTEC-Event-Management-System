import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@/components/ui-bits";

export const Route = createFileRoute("/app/teams")({ component: Teams });

const TEAMS = [
  { id: "t1", name: "ByteForce", event: "SOFTEC Hackathon", members: ["BA","HI","OS","ZM"], role: "Captain" },
  { id: "t2", name: "Recursion", event: "Speed Programming", members: ["BA","ZM"], role: "Member" },
];

function Teams() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Your teams</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Teams.</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {TEAMS.map(t => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-display text-xl font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.event}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary">{t.role}</span>
            </div>
            <div className="mt-5 flex -space-x-2">
              {t.members.map(m => (
                <span key={m} className="h-9 w-9 rounded-full bg-primary/10 text-primary border-2 border-card grid place-items-center font-display font-semibold text-xs">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
