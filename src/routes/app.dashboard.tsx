import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useDashboard } from "@/hooks/useDashboard";
import { useConfirmPayment } from "@/hooks/useRegistration";
import { useApproveSponsorship, useRejectSponsorship } from "@/hooks/useSponsorship";
import { Eyebrow, Hairline, Pill, StatCard, CapacityBar } from "@/components/ui-bits";
import { fmtDate, fmtPKR } from "@/lib/format";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell,
} from "recharts";
import {
  Loader2, AlertCircle, ArrowRight, Plus, Calendar, Users, Award,
  CreditCard, Ticket, Building2, CheckCircle2, Clock, Sparkles,
  BarChart2, FileText, Megaphone, ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({ component: Dashboard });

/* ─── Shell ─── */
function Dashboard() {
  const { user } = useAuth();
  const { loading, error, data } = useDashboard();

  if (!user) return null;

  if (loading) {
    return (
      <Page>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Page>
    );
  }

  if (error && !data) {
    return (
      <Page>
        <div className="rounded-lg border border-rose/30 bg-rose/5 p-6 flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">Unable to load your dashboard</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.includes("judge profile") || error.includes("sponsor profile")
                ? error
                : "We couldn't connect to the server. Please refresh the page."}
            </p>
          </div>
        </div>
      </Page>
    );
  }

  const d = data || {};

  if (user.role === "admin")     return <AdminDash data={d} />;
  if (user.role === "organizer") return <OrganizerDash data={d} />;
  if (user.role === "judge")     return <JudgeDash data={d} />;
  if (user.role === "sponsor")   return <SponsorDash data={d} />;
  return <ParticipantDash data={d} />;
}

/* ─── Layout wrappers ─── */
const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 space-y-6">{children}</div>
);

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon: Icon, title, desc, action }: { icon: any; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <Icon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
      <p className="font-display text-lg font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, desc }: { to: string; icon: any; label: string; desc: string }) {
  return (
    <Link to={to} className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-warm transition-all">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

/* ═══════════════════════════════════════
   PARTICIPANT DASHBOARD
═══════════════════════════════════════ */
function ParticipantDash({ data }: { data: any }) {
  const { user } = useAuth();
  const confirmPayment = useConfirmPayment();

  const myEvents    = Array.isArray(data.myEvents)    ? data.myEvents    : [];
  const passes      = Array.isArray(data.passes)      ? data.passes      : [];
  const teams       = Array.isArray(data.teams)       ? data.teams       : [];
  const payments    = Array.isArray(data.payments)    ? data.payments    : [];
  const stats       = data.stats || {};

  const upcoming = myEvents.filter((e: any) => new Date(e.event_date) >= new Date());
  const pendingPayments = myEvents.filter((e: any) => e.payment_status === "pending" && Number(e.registration_fee || 0) > 0);

  const handleConfirm = async (paymentId: number, eventId: number) => {
    try {
      await confirmPayment.mutateAsync({ paymentId, eventId });
      toast.success("Payment confirmed! Your pass has been issued.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Payment confirmation failed");
    }
  };

  return (
    <Page>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>My Desk</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-2">
            Welcome, <em className="italic text-primary">{user?.name?.split(" ")[0] || "Participant"}</em>.
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Your SOFTEC dashboard — registrations, passes, and upcoming events.</p>
        </div>
        <Link to="/app/events" className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
          <Calendar className="h-4 w-4" /> Browse Programmes
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Registered" value={String(stats.registered_count || 0)} hint="Total events" />
        <StatCard label="Upcoming" value={String(upcoming.length)} hint="Events ahead" accent="sage" />
        <StatCard label="Pending Payments" value={String(stats.pending_payment || 0)} hint="Need confirmation" accent={stats.pending_payment > 0 ? "rose" : undefined} />
      </div>

      {/* Pending payment banner */}
      {pendingPayments.length > 0 && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            You have {pendingPayments.length} pending payment{pendingPayments.length > 1 ? "s" : ""} — confirm to receive your passes.
          </p>
        </div>
      )}

      {/* My Registered Events */}
      <Section
        title="My Programmes"
        action={
          <Link to="/app/events" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Browse more <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        {myEvents.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events registered yet"
            desc="Browse SOFTEC's 50+ programmes and register for the ones that interest you."
            action={
              <Link to="/events" className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90">
                <Sparkles className="h-4 w-4" /> Browse Programmes
              </Link>
            }
          />
        ) : (
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {myEvents.map((e: any) => {
              const isPending = e.payment_status === "pending" && Number(e.registration_fee || 0) > 0;
              const isFree = Number(e.registration_fee || 0) === 0;
              return (
                <div key={e.event_id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to="/events/$eventId" params={{ eventId: String(e.event_id) }} className="font-medium hover:text-primary transition-colors truncate">
                        {e.event_name}
                      </Link>
                      {isPending && <Pill tone="rose">Payment pending</Pill>}
                      {!isPending && !isFree && <Pill tone="sage">Paid</Pill>}
                      {isFree && <Pill tone="muted">Free</Pill>}
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground mt-1 tabular">
                      {fmtDate(e.event_date)} · {e.venue_name || "TBD"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isPending && e.payment_id && (
                      <button
                        onClick={() => handleConfirm(e.payment_id, e.event_id)}
                        disabled={confirmPayment.isPending}
                        className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
                      >
                        {confirmPayment.isPending ? "Processing…" : `Pay ${fmtPKR(e.amount || e.registration_fee)}`}
                      </button>
                    )}
                    <Link to="/events/$eventId" params={{ eventId: String(e.event_id) }} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors">
                      View programme
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Passes */}
        <Section title="My Passes">
          {passes.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No passes yet"
              desc="Passes are issued automatically when payment is confirmed."
            />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {passes.slice(0, 5).map((p: any) => (
                <div key={p.pass_id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{p.event_name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{new Date(p.issued_at).toLocaleDateString()}</p>
                  </div>
                  <Pill tone={p.status === "redeemed" ? "muted" : p.status === "cancelled" ? "rose" : "sage"}>{p.status}</Pill>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Teams */}
        <Section title="My Teams" action={
          <Link to="/app/teams" className="text-sm text-primary hover:underline">View all</Link>
        }>
          {teams.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No teams yet"
              desc="Join or form a team for group-based events."
              action={<Link to="/app/teams" className="text-sm text-primary hover:underline">Go to Teams</Link>}
            />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {teams.slice(0, 3).map((t: any) => (
                <div key={t.team_id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{t.team_name}</p>
                    <p className="text-xs text-muted-foreground">{t.event_name || "No event"} · {t.member_count} member{t.member_count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Quick actions */}
      <Section title="Quick Actions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction to="/events" icon={Calendar} label="Browse Programmes" desc="Explore all 50+ events" />
          <QuickAction to="/app/accommodation" icon={Building2} label="Book Accommodation" desc="On-campus lodging options" />
          <QuickAction to="/app/teams" icon={Users} label="My Teams" desc="Manage your event teams" />
        </div>
      </Section>
    </Page>
  );
}

/* ═══════════════════════════════════════
   ORGANIZER DASHBOARD
═══════════════════════════════════════ */
function OrganizerDash({ data }: { data: any }) {
  const events        = Array.isArray(data.events)        ? data.events        : [];
  const judges        = Array.isArray(data.judges)        ? data.judges        : [];
  const rounds        = Array.isArray(data.rounds)        ? data.rounds        : [];
  const venueConflicts = Array.isArray(data.venueConflicts) ? data.venueConflicts : [];
  const stats         = data.stats || {};

  return (
    <Page>
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>Editor's Desk</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-2">Your <em className="italic text-primary">Programmes</em>.</h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage your events, track registrations, and coordinate judges.</p>
        </div>
        <Link to="/app/events/new" className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Create Event
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="My Events" value={String(stats.total_events || 0)} hint="Total programmes" />
        <StatCard label="Registrations" value={String(stats.total_registrations || 0)} hint="Across all events" accent="sage" />
        <StatCard label="Avg Fill Rate" value={`${stats.avg_fill_rate || 0}%`} hint="Capacity utilisation" accent={Number(stats.avg_fill_rate) >= 70 ? "sage" : "gold"} />
      </div>

      {venueConflicts.length > 0 && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {venueConflicts.length} venue conflict{venueConflicts.length > 1 ? "s" : ""} detected — multiple events share the same venue on the same date.
          </p>
        </div>
      )}

      <Section
        title="My Events"
        action={
          <Link to="/app/events/new" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Plus className="h-3.5 w-3.5" /> New event
          </Link>
        }
      >
        {events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events created yet"
            desc="Create your first event and start accepting registrations."
            action={
              <Link to="/app/events/new" className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Create First Event
              </Link>
            }
          />
        ) : (
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {events.map((e: any) => (
              <Link key={e.event_id} to="/events/$eventId" params={{ eventId: String(e.event_id) }} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium group-hover:text-primary transition-colors">{e.event_name}</p>
                    <Pill tone="muted">{e.category}</Pill>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground mt-1">{fmtDate(e.event_date)} · {e.venue_name || "No venue"}</p>
                </div>
                <div className="w-40 shrink-0">
                  <CapacityBar filled={e.registered_participants || 0} total={e.max_participants || 1} />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </Section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Judges */}
        <Section title="Assigned Judges">
          {judges.length === 0 ? (
            <EmptyState icon={Award} title="No judges assigned" desc="Judges are automatically assigned when events are created." />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {judges.slice(0, 5).map((j: any) => (
                <div key={j.judge_id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{j.name}</p>
                    <p className="text-xs text-muted-foreground">{j.email}</p>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{j.assigned_events} event{j.assigned_events !== 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Upcoming Rounds */}
        <Section title="Schedule">
          {rounds.length === 0 ? (
            <EmptyState icon={Calendar} title="No rounds scheduled" desc="Add rounds to your events from the event detail page." />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {rounds.slice(0, 5).map((r: any) => (
                <div key={r.round_id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{r.event_name} — {r.round_name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{fmtDate(r.round_date)}</p>
                  </div>
                  <Pill tone={r.round_status === "completed" ? "sage" : r.round_status === "ongoing" ? "ember" : "muted"}>{r.round_status}</Pill>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Section title="Quick Actions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction to="/app/events/new" icon={Plus} label="Create Event" desc="Launch a new programme" />
          <QuickAction to="/app/events" icon={Calendar} label="All Programmes" desc="Browse all events" />
          <QuickAction to="/app/reports" icon={FileText} label="Reports" desc="Participation & analytics" />
        </div>
      </Section>
    </Page>
  );
}

/* ═══════════════════════════════════════
   JUDGE DASHBOARD
═══════════════════════════════════════ */
function JudgeDash({ data }: { data: any }) {
  const nav       = useNavigate();
  const assigned  = Array.isArray(data.assigned)  ? data.assigned  : [];
  const submitted = Array.isArray(data.submitted) ? data.submitted : [];
  const pending   = Array.isArray(data.pending)   ? data.pending   : [];
  const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];
  const stats     = data.stats || {};

  return (
    <Page>
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>Adjudication</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-2">Judge <em className="italic text-primary">Panel</em>.</h1>
          <p className="text-muted-foreground mt-2 text-sm">Review your assigned events and submit scores for participants.</p>
        </div>
        {pending.length > 0 && (
          <Link to="/app/judging" className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
            <Award className="h-4 w-4" /> Submit Scores
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Assigned" value={String(stats.assigned_count || 0)} hint="Events to judge" />
        <StatCard label="Submitted" value={String(stats.submitted_count || 0)} hint="Scores given" accent="sage" />
        <StatCard label="Pending" value={String(stats.pending_count || 0)} hint="Awaiting evaluation" accent={stats.pending_count > 0 ? "rose" : undefined} />
      </div>

      {pending.length > 0 && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <strong>{stats.pending_count} evaluations</strong> waiting — go to Score Submissions to judge participants.
          </p>
          <Link to="/app/judging" className="shrink-0 px-3 py-1.5 rounded-md bg-amber-700 text-white text-xs font-medium hover:bg-amber-800 transition-colors">
            Submit now →
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Assigned Events">
          {assigned.length === 0 ? (
            <EmptyState icon={Award} title="No events assigned" desc="Events are assigned to you automatically by the system. Check back soon." />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {assigned.map((e: any) => (
                <div key={e.event_id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Pill tone="ember">{e.category}</Pill>
                      <p className="font-medium mt-2">{e.event_name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground mt-1">{fmtDate(e.event_date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs text-muted-foreground">{e.participant_count} participants</p>
                      <p className="font-mono text-xs text-muted-foreground">{e.total_rounds} rounds</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Leaderboard Preview">
          {leaderboard.length === 0 ? (
            <EmptyState icon={BarChart2} title="No scores yet" desc="Scores will appear here once you start submitting evaluations." />
          ) : (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <ol className="divide-y divide-border">
                {leaderboard.slice(0, 8).map((l: any, i: number) => (
                  <li key={`${l.participant_id}-${l.event_id}`} className="flex items-center gap-3 p-3">
                    <span className="font-display text-lg font-semibold tabular w-7 text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{l.participant}</p>
                      <p className="text-xs text-muted-foreground truncate">{l.event_name}</p>
                    </div>
                    <span className="font-mono text-sm tabular font-semibold">{Number(l.score || 0).toFixed(2)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Section>
      </div>

      {submitted.length > 0 && (
        <Section title="Recent Submissions">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
                  <th className="p-4">Event</th>
                  <th>Participant</th>
                  <th className="pr-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {submitted.slice(0, 5).map((s: any) => (
                  <tr key={s.judging_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium">{s.event_name}</td>
                    <td className="text-muted-foreground">{s.participant_name}</td>
                    <td className="pr-4 text-right font-mono font-semibold text-primary tabular">{Number(s.score).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      <Section title="Quick Actions">
        <div className="grid sm:grid-cols-2 gap-3">
          <QuickAction to="/app/judging" icon={Award} label="Submit Scores" desc="Evaluate pending participants" />
          <QuickAction to="/app/leaderboards" icon={BarChart2} label="Leaderboards" desc="View live standings" />
        </div>
      </Section>
    </Page>
  );
}

/* ═══════════════════════════════════════
   SPONSOR DASHBOARD
═══════════════════════════════════════ */
function SponsorDash({ data }: { data: any }) {
  const sponsorInfo    = data.sponsorInfo    || null;
  const sponsoredEvents = Array.isArray(data.sponsoredEvents) ? data.sponsoredEvents : [];
  const history        = Array.isArray(data.history)        ? data.history        : [];
  const payments       = Array.isArray(data.payments)       ? data.payments       : [];
  const stats          = data.stats || {};

  return (
    <Page>
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>Patron's Desk</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-2">
            {sponsorInfo ? <><em className="italic text-primary">{sponsorInfo.name}</em>.</> : "Sponsor Dashboard."}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Manage your sponsorships and track your contribution to SOFTEC.</p>
        </div>
        <Link to="/app/sponsorship" className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
          <Megaphone className="h-4 w-4" /> Sponsor an Event
        </Link>
      </div>

      {!sponsorInfo && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-medium text-sm">Complete your sponsor profile</p>
            <p className="text-sm text-muted-foreground mt-1">You need a sponsor profile before you can sponsor events. It takes less than a minute.</p>
          </div>
          <Link to="/app/sponsorship" className="shrink-0 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Create Profile →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Contribution" value={fmtPKR(stats.total_contribution || 0)} hint="Approved sponsorships" accent="gold" />
        <StatCard label="Events Sponsored" value={String(stats.events_sponsored || 0)} hint="Programmes supported" />
        <StatCard label="Total Reach" value={String(stats.total_reach || 0)} hint="Participants across events" accent="sage" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section
          title="Sponsored Events"
          action={
            <Link to="/app/sponsorship" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              Sponsor more <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {sponsoredEvents.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No sponsored events yet"
              desc="Sponsor a programme to increase your brand visibility and support SOFTEC."
              action={
                <Link to="/app/sponsorship" className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90">
                  Sponsor an Event
                </Link>
              }
            />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {sponsoredEvents.map((e: any) => (
                <div key={e.event_id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{e.event_name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{fmtDate(e.event_date)} · {e.participants_reached} participants</p>
                    </div>
                    <p className="font-display text-lg font-semibold text-primary tabular">{fmtPKR(e.sponsorship_contribution)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Sponsorship History">
          {history.length === 0 ? (
            <EmptyState icon={FileText} title="No history yet" desc="Your sponsorship submissions will appear here." />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {history.slice(0, 6).map((h: any) => (
                <div key={h.sponsorship_id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{h.event_name || "General"}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{fmtDate(h.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold">{fmtPKR(h.amount)}</p>
                    <Pill tone={h.status === "approved" ? "sage" : h.status === "rejected" ? "rose" : h.status === "pending" ? "gold" : "muted"}>{h.status}</Pill>
                    {h.rejection_reason && <p className="mt-1 text-xs text-muted-foreground max-w-sm">{h.rejection_reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Section title="Quick Actions">
        <div className="grid sm:grid-cols-2 gap-3">
          <QuickAction to="/app/sponsorship" icon={Megaphone} label="Sponsor an Event" desc="Browse and support programmes" />
          <QuickAction to="/app/sponsors" icon={Building2} label="Patron Registry" desc="View all SOFTEC sponsors" />
        </div>
      </Section>
    </Page>
  );
}

/* ═══════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════ */
function AdminDash({ data }: { data: any }) {
  const kpi              = data.kpi              || {};
  const roleDistribution = Array.isArray(data.roleDistribution) ? data.roleDistribution : [];
  const categoryDistribution = Array.isArray(data.categoryDistribution) ? data.categoryDistribution : [];
  const venueUtilization = Array.isArray(data.venueUtilization) ? data.venueUtilization : [];
  const topPrograms      = Array.isArray(data.topPrograms)      ? data.topPrograms      : [];
  const revenueBreakdown = Array.isArray(data.revenueBreakdown) ? data.revenueBreakdown : [];
  const pendingSponsorships = Array.isArray(data.pendingSponsorships) ? data.pendingSponsorships : [];
  const sponsorshipHistory = Array.isArray(data.sponsorshipHistory) ? data.sponsorshipHistory : [];
  const recentActivity   = Array.isArray(data.recentActivity)   ? data.recentActivity   : [];
  const paymentStatus    = Array.isArray(data.paymentStatus)    ? data.paymentStatus    : [];
  const approveSponsorship = useApproveSponsorship();
  const rejectSponsorship = useRejectSponsorship();
  const [pendingList, setPendingList] = useState(pendingSponsorships);
  const [historyList, setHistoryList] = useState(sponsorshipHistory);

  useEffect(() => {
    setPendingList(pendingSponsorships);
    setHistoryList(sponsorshipHistory);
  }, [pendingSponsorships, sponsorshipHistory]);

  const colors = ["var(--primary)", "var(--sage)", "var(--gold)", "var(--rose)", "var(--electric)"];

  const roleData = roleDistribution.map((r: any) => ({ name: r.role, value: Number(r.count) }));
  const catData  = categoryDistribution.map((c: any) => ({ name: c.category?.replace(" Events","").replace(" Competitions","").replace(" Tournaments",""), count: Number(c.count) }));
  const revData  = revenueBreakdown.map((r: any) => ({ name: r.payment_type, value: Number(r.total) }));

  return (
    <Page>
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>Admin Almanac</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-2">Command <em className="italic text-primary">Centre</em>.</h1>
          <p className="text-muted-foreground mt-2 text-sm">SOFTEC '26 — real-time overview of registrations, revenue, and activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Members" value={String(kpi.total_users || 0)} hint={`${kpi.active_users || 0} active`} />
        <StatCard label="Programmes" value={String(kpi.total_events || 0)} hint="Total events" accent="sage" />
        <StatCard label="Revenue" value={fmtPKR(kpi.revenue_completed || 0)} hint={`+ ${fmtPKR(kpi.pending_revenue || 0)} pending`} accent="gold" />
        <StatCard label="Registrations" value={String(kpi.total_registrations || 0)} hint="Across all events" />
      </div>

      <Section title="Pending Sponsorship Approvals">
        {pendingList.length === 0 ? (
          <EmptyState icon={Megaphone} title="No pending sponsorships" desc="Approved and rejected sponsorships are tracked in moderation history below." />
        ) : (
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {pendingList.map((sp: any) => (
              <div key={sp.sponsorship_id} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">{sp.company_name}</p>
                    <Pill tone="gold">Pending</Pill>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{sp.event_name} · {sp.sponsorship_type} · {fmtPKR(sp.amount)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={async () => {
                      try {
                        await approveSponsorship.mutateAsync({ sponsorshipId: sp.sponsorship_id, adminNotes: window.prompt("Admin notes (optional)") || undefined });
                        setPendingList((prev: any[]) => prev.filter((item) => item.sponsorship_id !== sp.sponsorship_id));
                        setHistoryList((prev: any[]) => [{ ...sp, status: "approved", approved_at: new Date().toISOString() }, ...prev]);
                        toast.success("Sponsorship approved");
                      } catch (err: any) {
                        toast.error(err?.response?.data?.error || "Approval failed");
                      }
                    }}
                    className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      const reason = window.prompt("Rejection reason")?.trim();
                      if (!reason) return;
                      try {
                        await rejectSponsorship.mutateAsync({ sponsorshipId: sp.sponsorship_id, rejectionReason: reason, adminNotes: reason });
                        setPendingList((prev: any[]) => prev.filter((item) => item.sponsorship_id !== sp.sponsorship_id));
                        setHistoryList((prev: any[]) => [{ ...sp, status: "rejected", rejection_reason: reason, approved_at: new Date().toISOString() }, ...prev]);
                        toast.success("Sponsorship rejected");
                      } catch (err: any) {
                        toast.error(err?.response?.data?.error || "Rejection failed");
                      }
                    }}
                    className="px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-muted/50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Charts row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">Members by role</p>
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={roleData} dataKey="value" outerRadius={65} innerRadius={30}>
                  {roleData.map((_: any, i: number) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [v, ""]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">No data</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {roleData.map((r: any, i: number) => (
              <span key={r.name} className="flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                {r.name} ({r.value})
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">Events by category</p>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={catData} barSize={20}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[3, 3, 0, 0]} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">No data</p>}
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">Revenue breakdown</p>
          {revData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={revData} dataKey="value" outerRadius={65} innerRadius={30}>
                  {revData.map((_: any, i: number) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [fmtPKR(v), ""]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground">No revenue data</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {revData.map((r: any, i: number) => (
              <span key={r.name} className="flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                {r.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Programs */}
        <Section title="Top Programmes">
          {topPrograms.length === 0 ? (
            <EmptyState icon={Calendar} title="No events yet" desc="Create events to see them here." />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {topPrograms.map((e: any) => (
                <Link key={e.event_id} to="/events/$eventId" params={{ eventId: String(e.event_id) }} className="group flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">{e.event_name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{fmtDate(e.event_date)}</p>
                  </div>
                  <div className="w-28 shrink-0">
                    <CapacityBar filled={e.registered_participants || 0} total={e.max_participants || 1} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Section>

        {/* Recent Activity */}
        <Section title="Recent Registrations">
          {recentActivity.length === 0 ? (
            <EmptyState icon={Users} title="No registrations yet" desc="Registration activity will appear here." />
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {recentActivity.slice(0, 7).map((a: any) => (
                <div key={`${a.participant_id}-${a.event_id}`} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.event_name}</p>
                  </div>
                  <Pill tone={a.payment_status === "completed" ? "sage" : a.payment_status === "pending" ? "gold" : "muted"}>
                    {a.payment_status}
                  </Pill>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Section title="Sponsorship Moderation History">
        {historyList.length === 0 ? (
          <EmptyState icon={FileText} title="No moderation history" desc="Approved and rejected sponsorships will appear here." />
        ) : (
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {historyList.slice(0, 10).map((sp: any) => (
              <div key={sp.sponsorship_id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{sp.company_name} · {sp.event_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sp.admin_notes || sp.rejection_reason || fmtDate(sp.created_at)}</p>
                </div>
                <Pill tone={sp.status === "approved" ? "sage" : sp.status === "rejected" ? "rose" : "gold"}>{sp.status}</Pill>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Venue Utilization */}
      {venueUtilization.length > 0 && (
        <Section title="Venue Utilisation">
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {venueUtilization.map((v: any) => (
              <div key={v.venue_id} className="flex items-center justify-between p-4">
                <p className="text-sm font-medium">{v.venue_name}</p>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{v.total_events} event{v.total_events !== 1 ? "s" : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Quick Actions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction to="/app/users" icon={Users} label="Manage Members" desc="View & edit all users" />
          <QuickAction to="/app/events" icon={Calendar} label="Programmes" desc="Browse all events" />
          <QuickAction to="/app/sponsors" icon={Building2} label="Patron Registry" desc="View all sponsors" />
          <QuickAction to="/app/reports" icon={FileText} label="Compendium" desc="Reports & analytics" />
        </div>
      </Section>
    </Page>
  );
}
