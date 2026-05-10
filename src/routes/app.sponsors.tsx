import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { useSponsors } from "@/hooks/useSponsorship";

export const Route = createFileRoute("/app/sponsors")({ component: Sponsors });

function Sponsors() {
  const { data: sponsors = [], isLoading, isError } = useSponsors();

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Edition XXVI</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Patron <em className="italic">Registry</em>.</h1>
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading sponsors...</p>}
      {isError && <p className="mt-8 text-sm text-rose-500">Could not load sponsors.</p>}
      {!isLoading && !isError && sponsors.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          No sponsors registered yet.
        </div>
      )}
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {sponsors.map((s) => (
          <div key={s.sponsor_id} className="rounded-lg border border-border bg-card p-6">
            <Pill tone={s.sponsorship_level === "Title" ? "ember" : s.sponsorship_level === "Gold" ? "gold" : "muted"}>{s.sponsorship_level} patron</Pill>
            <h3 className="font-display text-2xl font-semibold mt-3">{s.company_name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
