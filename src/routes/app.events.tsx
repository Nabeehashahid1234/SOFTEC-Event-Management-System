import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Plus, Compass } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEvents } from "@/hooks/useEvents";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { fmtDate, fmtPKR } from "@/lib/format";

export const Route = createFileRoute("/app/events")({ component: AppEvents });

function AppEvents() {
  const path = useRouterState({ select: s => s.location.pathname });
  const { user } = useAuth();
  const { data: list = [], isLoading, isError } = useEvents();
  const isOrganizer = user?.role === "organizer" || user?.role === "admin";
  const isParticipant = user?.role === "participant";

  // Child route active (e.g. /app/events/new) — delegate rendering to it
  if (path !== "/app/events") return <Outlet />;

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>{isParticipant ? "Event catalogue" : "All programmes"}</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-3">
            {isParticipant ? "Browse & Register" : "Programmes"}
          </h1>
          {isParticipant && (
            <p className="text-muted-foreground mt-2 text-sm">
              Find events to register for.{" "}
              <Link to="/events" className="text-primary hover:underline">
                Open public catalogue →
              </Link>
            </p>
          )}
        </div>
        {isOrganizer && (
          <Link
            to="/app/events/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            New programme
          </Link>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card divide-y divide-border">
        {isLoading && (
          <p className="p-5 text-sm text-muted-foreground">Loading programmes...</p>
        )}
        {isError && (
          <p className="p-5 text-sm text-rose-500">Could not load programmes.</p>
        )}
        {!isLoading && !isError && list.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted grid place-items-center mb-4">
              <Compass className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-display text-lg font-medium">No programmes yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              {isOrganizer
                ? "Create your first programme to get started."
                : "Check back soon — events are being added."}
            </p>
            {isOrganizer && (
              <Link
                to="/app/events/new"
                className="inline-flex items-center gap-2 mt-5 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Create programme
              </Link>
            )}
          </div>
        )}
        {list.map(e => (
          <Link
            key={e.id}
            to="/events/$eventId"
            params={{ eventId: e.id }}
            className="flex items-center gap-5 p-5 hover:bg-muted/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg font-medium truncate">{e.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground tabular mt-1">
                {fmtDate(e.date)} · {e.venueName}
              </p>
            </div>
            <Pill tone="muted">{e.category}</Pill>
            <span className="font-mono text-xs tabular text-muted-foreground w-20 text-right">
              {e.registered}/{e.capacity}
            </span>
            <span className="text-sm font-medium text-primary">
              {e.fee === 0 ? "Free" : fmtPKR(e.fee)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
