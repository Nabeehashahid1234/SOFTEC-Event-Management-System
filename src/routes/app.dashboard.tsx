import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Eyebrow,
  Hairline,
  Pill,
  StatCard,
  CapacityBar,
} from "@/components/ui-bits";
import { fmtDate, fmtPKR, countdown } from "@/lib/format";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { loading, error, data } = useDashboard();

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex gap-3 text-rose">
        <AlertCircle />
        <p>{error}</p>
      </div>
    );
  }

  const safeData = data || {};

  if (user.role === "admin") return <AdminDash data={safeData} />;
  if (user.role === "organizer") return <OrganizerDash data={safeData} />;
  if (user.role === "judge") return <JudgeDash data={safeData} />;
  if (user.role === "sponsor") return <SponsorDash data={safeData} />;

  return <ParticipantDash data={safeData} />;
}

const Page = ({ children }: any) => (
  <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
    {children}
  </div>
);

/* ================= ADMIN ================= */

function AdminDash({ data }: { data: any }) {
  const {
    kpi = {},
    roleDistribution = [],
    categoryDistribution = [],
    venueUtilization = [],
    topPrograms = [],
    revenueBreakdown = [],
    recentActivity = [],
    paymentStatus = [],
  } = data || {};

  const colors = ["var(--primary)", "var(--sage)", "var(--gold)", "var(--rose)"];

  const roleData = roleDistribution.map((r: any) => ({
    name: r.role,
    value: r.count,
  }));

  const catData = categoryDistribution.map((c: any) => ({
    name: c.category,
    count: c.count,
  }));

  const venueData = venueUtilization.map((v: any) => ({
    name: v.venue_name,
    events: v.total_events,
  }));

  const revComp = revenueBreakdown.map((r: any) => ({
    name: r.payment_type,
    value: r.total,
  }));

  return (
    <Page>
      <h1 className="font-display text-4xl mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Users" value={String(kpi.total_users || 0)} />
        <StatCard label="Events" value={String(kpi.total_events || 0)} />
        <StatCard label="Revenue" value={fmtPKR(kpi.revenue_completed || 0)} />
        <StatCard label="Registrations" value={String(kpi.total_registrations || 0)} />
      </div>

      <Panel title="Revenue">
        {revComp.length ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revComp} dataKey="value" outerRadius={80}>
                {revComp.map((_: any, i: number) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No data</p>
        )}
      </Panel>
    </Page>
  );
}

/* ================= PARTICIPANT ================= */

function ParticipantDash({ data }: { data: any }) {
  const { user } = useAuth();

  const {
    myEvents = [],
    payments = [],
    accommodation = [],
    stats = {},
  } = data || {};

  const upcoming = myEvents.filter(
    (e: any) => new Date(e.event_date) > new Date()
  );

  return (
    <Page>
      <h1 className="font-display text-4xl mb-6">
        Hi {user?.name?.split(" ")[0] || "User"}
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Registered" value={String(stats.registered_count || 0)} />
        <StatCard label="Upcoming" value={String(upcoming.length)} />
        <StatCard label="Pending" value={String(stats.pending_payment || 0)} />
      </div>

      <Panel title="My Events">
        {myEvents.length ? (
          myEvents.map((e: any) => (
            <Link
              key={e.event_id}
              to="/events/$eventId"
              params={{ eventId: String(e.event_id) }}
              className="block border-b py-2"
            >
              {e.event_name}
            </Link>
          ))
        ) : (
          <p>No events</p>
        )}
      </Panel>
    </Page>
  );
}

/* ================= ORGANIZER ================= */

function OrganizerDash({ data }: { data: any }) {
  const { events = [], stats = {} } = data || {};

  return (
    <Page>
      <h1 className="font-display text-4xl mb-6">Organizer Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Events" value={String(stats.total_events || 0)} />
        <StatCard label="Registrations" value={String(stats.total_registrations || 0)} />
        <StatCard label="Fill Rate" value={`${stats.avg_fill_rate || 0}%`} />
      </div>

      <Panel title="Events">
        {events.map((e: any) => (
          <div key={e.event_id} className="border-b py-2">
            {e.event_name}
          </div>
        ))}
      </Panel>
    </Page>
  );
}

/* ================= JUDGE ================= */

function JudgeDash({ data }: { data: any }) {
  const { assigned = [], leaderboard = [] } = data || {};

  const [score, setScore] = useState("0");

  return (
    <Page>
      <h1 className="font-display text-4xl mb-6">Judge Dashboard</h1>

      <Panel title="Assigned">
        {assigned.map((a: any) => (
          <div key={a.event_id}>{a.event_name}</div>
        ))}
      </Panel>

      <Panel title="Leaderboard">
        {leaderboard.map((l: any) => (
          <div key={l.participant}>
            {l.participant} — {Number(l.score || 0).toFixed(2)}
          </div>
        ))}
      </Panel>
    </Page>
  );
}

/* ================= SPONSOR ================= */

function SponsorDash({ data }: { data: any }) {
  const { sponsorInfo = {}, sponsoredEvents = [] } = data || {};

  return (
    <Page>
      <h1 className="font-display text-4xl mb-6">{sponsorInfo.name}</h1>

      <Panel title="Sponsored Events">
        {sponsoredEvents.map((e: any) => (
          <div key={e.event_id}>{e.event_name}</div>
        ))}
      </Panel>
    </Page>
  );
}

/* ================= PANEL ================= */

function Panel({ title, children }: any) {
  return (
    <section className="border rounded p-4 mb-4">
      <h2 className="font-bold mb-2">{title}</h2>
      {children}
    </section>
  );
}