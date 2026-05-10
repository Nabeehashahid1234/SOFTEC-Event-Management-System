import { createFileRoute, Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/ui-bits";
import { Users } from "lucide-react";

export const Route = createFileRoute("/app/teams")({ component: Teams });

function Teams() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Your teams</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Teams.</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Form and manage your teams for team-based competitions.
      </p>

      <div className="mt-10 rounded-lg border border-dashed border-border bg-card p-16 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-muted grid place-items-center mb-5">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-display text-xl font-semibold">Team management coming soon</p>
        <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">
          Team formation for group events will be available here. Register for a team-based event on the event page to get started once this feature launches.
        </p>
        <Link
          to="/events"
          className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
        >
          Browse events →
        </Link>
      </div>
    </div>
  );
}
