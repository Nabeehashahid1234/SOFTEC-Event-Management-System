import { useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Plus, Compass, Award, ChevronRight, Megaphone } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEvents } from "@/hooks/useEvents";
import { useJudgeDashboardData } from "@/hooks/useJudging";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { fmtDate, fmtPKR } from "@/lib/format";

export const Route = createFileRoute("/app/events")({ component: AppEvents });

function AppEvents() {
  const path = useRouterState({ select: s => s.location.pathname });
  const { user } = useAuth();

  // Child routes (e.g. /app/events/new) — delegate rendering
  if (path !== "/app/events") return <Outlet />;

  // Role-specific views
  if (user?.role === "judge")   return <JudgeEventsView />;
  if (user?.role === "sponsor") return <SponsorRedirectView />;

  return <AllEventsView />;
}

/* ─── Judge: only assigned events ─── */
function JudgeEventsView() {
  const { data, isLoading, isError } = useJudgeDashboardData();
  const assigned = data?.assigned ?? [];

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Your assignments</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Assigned <em className="italic">Programmes</em>.</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Events you are assigned to judge. Use the <Link to="/app/judging" className="text-primary hover:underline">Score page</Link> to submit evaluations.
      </p>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading assigned events…</p>}
      {isError  && <p className="mt-8 text-sm text-rose-500">Could not load assigned events.</p>}
      {!isLoading && !isError && assigned.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <Award className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="font-display text-lg font-medium">No events assigned yet</p>
          <p className="text-sm text-muted-foreground mt-2">Events are automatically assigned when they are created. Check back soon.</p>
        </div>
      )}

      {assigned.length > 0 && (
        <div className="mt-8 rounded-lg border border-border bg-card divide-y divide-border">
          {assigned.map((ev: any) => (
            <Link
              key={ev.event_id}
              to="/events/$eventId"
              params={{ eventId: String(ev.event_id) }}
              className="flex items-center gap-5 p-5 hover:bg-muted/30 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg font-medium truncate group-hover:text-primary transition-colors">{ev.event_name}</p>
                <p className="font-mono text-[11px] text-muted-foreground tabular mt-1">
                  {fmtDate(ev.event_date)} · {ev.total_rounds} round{ev.total_rounds !== 1 ? "s" : ""}
                </p>
              </div>
              <Pill tone="ember">{ev.category}</Pill>
              <span className="font-mono text-xs tabular text-muted-foreground shrink-0">
                {ev.participant_count} participant{ev.participant_count !== 1 ? "s" : ""}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Sponsor: redirect to sponsorship page ─── */
function SponsorRedirectView() {
  const navigate = useNavigate();
  useEffect(() => { navigate({ to: "/app/sponsorship" }); }, [navigate]);
  // Brief interstitial while navigating
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Patron programmes</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Sponsorship <em className="italic">Portal</em>.</h1>
      <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
        <Megaphone className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <p className="font-display text-lg font-medium">Redirecting to your Sponsorship portal…</p>
        <Link to="/app/sponsorship" className="inline-flex items-center gap-2 mt-5 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
          <Megaphone className="h-4 w-4" /> Go to Sponsorship Portal
        </Link>
      </div>
    </div>
  );
}

/* ─── Default: all events (participant / organizer / admin) ─── */
function AllEventsView() {
  const { user } = useAuth();
  const isOrganizer = user?.role === "organizer";
  const { data: list = [], isLoading, isError } = useEvents(isOrganizer ? { mine: true } : undefined);
  const canCreate = user?.role === "organizer" || user?.role === "admin";
  const isParticipant = user?.role === "participant";

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>{isParticipant ? "Event catalogue" : isOrganizer ? "My programmes" : "All programmes"}</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-3">
            {isParticipant ? "Browse & Register" : isOrganizer ? "My Events" : "Programmes"}
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
        {canCreate && (
          <Link
            to="/app/events/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" /> New programme
          </Link>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card divide-y divide-border">
        {isLoading && (
          <p className="p-5 text-sm text-muted-foreground">Loading programmes…</p>
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
              {canCreate
                ? "Create your first programme to get started."
                : "Check back soon — events are being added."}
            </p>
            {canCreate && (
              <Link
                to="/app/events/new"
                className="inline-flex items-center gap-2 mt-5 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
              >
                <Plus className="h-4 w-4" /> Create programme
              </Link>
            )}
          </div>
        )}
        {list.map(e => (
          <Link
            key={e.id}
            to="/events/$eventId"
            params={{ eventId: e.id }}
            className="flex items-center gap-5 p-5 hover:bg-muted/30 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg font-medium truncate group-hover:text-primary transition-colors">{e.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground tabular mt-1">
                {fmtDate(e.date)} · {e.venueName}
              </p>
            </div>
            <Pill tone="muted">{e.category}</Pill>
            <span className="font-mono text-xs tabular text-muted-foreground w-20 text-right">
              {e.registered}/{e.capacity}
            </span>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-medium text-primary">{e.fee === 0 ? "Free" : fmtPKR(e.fee)}</span>
              <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-medium text-primary">
                {isParticipant ? "View & register" : "View details"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
