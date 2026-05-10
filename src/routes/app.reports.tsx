import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Eyebrow } from "@/components/ui-bits";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/app/reports")({ component: Reports });

type ReportKey = "event-participation" | "high-quality-events" | "venue-utilization" | null;

const REPORT_META = [
  { key: "event-participation" as ReportKey, num: "I", title: "Event Participation", desc: "Registrations per programme, by category and date." },
  { key: "high-quality-events" as ReportKey, num: "II", title: "High-Quality Events", desc: "Programmes ranked by judge scores above 7.5." },
  { key: "venue-utilization" as ReportKey, num: "V", title: "Venue Utilisation", desc: "Room bookings, capacity hit-rate, event distribution." },
];

function useReport(key: ReportKey) {
  return useQuery({
    queryKey: ["report", key],
    queryFn: async () => {
      const res = await api.get(`/reports/${key}`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    enabled: Boolean(key),
  });
}

function ParticipationTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <th className="text-left py-2 pr-4">Programme</th>
          <th className="text-left py-2 pr-4">Category</th>
          <th className="text-left py-2 pr-4">Date</th>
          <th className="text-right py-2">Participants</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.event_id} className="border-b border-border last:border-0">
            <td className="py-2.5 pr-4 font-medium">{r.event_name}</td>
            <td className="py-2.5 pr-4 text-muted-foreground">{r.category}</td>
            <td className="py-2.5 pr-4 font-mono text-xs tabular text-muted-foreground">{fmtDate(r.event_date)}</td>
            <td className="py-2.5 text-right font-mono tabular">{r.total_participants}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HighQualityTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <th className="text-left py-2 pr-4">Programme</th>
          <th className="text-right py-2">Avg Score</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.event_id} className="border-b border-border last:border-0">
            <td className="py-2.5 pr-4 font-medium">{r.event_name}</td>
            <td className="py-2.5 text-right font-mono tabular text-primary font-semibold">{Number(r.avg_score).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VenueTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <th className="text-left py-2 pr-4">Venue</th>
          <th className="text-right py-2 pr-4">Events Hosted</th>
          <th className="text-right py-2">Total Capacity</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.venue_id} className="border-b border-border last:border-0">
            <td className="py-2.5 pr-4 font-medium">{r.venue_name}</td>
            <td className="py-2.5 pr-4 text-right font-mono tabular">{r.events_hosted}</td>
            <td className="py-2.5 text-right font-mono tabular text-muted-foreground">{r.total_capacity_available}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReportPanel({ reportKey, onClose }: { reportKey: ReportKey; onClose: () => void }) {
  const { data = [], isLoading, isError } = useReport(reportKey);
  const meta = REPORT_META.find((r) => r.key === reportKey);

  return (
    <div className="mt-8 rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-display text-3xl font-light text-primary tabular">{meta?.num}</p>
          <h2 className="font-display text-2xl font-semibold mt-1">{meta?.title}</h2>
        </div>
        <button onClick={onClose} className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Close ×</button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" /> Generating report…
        </div>
      )}
      {isError && <p className="text-sm text-rose-500 py-4">Failed to load report.</p>}
      {!isLoading && !isError && data.length === 0 && (
        <p className="text-sm text-muted-foreground py-4">No data available.</p>
      )}
      {!isLoading && !isError && data.length > 0 && (
        <div className="overflow-x-auto">
          {reportKey === "event-participation" && <ParticipationTable rows={data} />}
          {reportKey === "high-quality-events" && <HighQualityTable rows={data} />}
          {reportKey === "venue-utilization" && <VenueTable rows={data} />}
        </div>
      )}
    </div>
  );
}

function Reports() {
  const [active, setActive] = useState<ReportKey>(null);

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Volume MMXXVI</Eyebrow>
      <h1 className="font-display text-5xl font-semibold mt-3">The <em className="italic">Compendium</em>.</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">Standing reports, generated on demand. Every figure traces back to the source.</p>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORT_META.map((r) => (
          <button
            key={r.num}
            onClick={() => setActive(active === r.key ? null : r.key)}
            className={`group rounded-lg border bg-card p-7 text-left hover:shadow-warm transition-all ${active === r.key ? "border-primary" : "border-border hover:border-primary/40"}`}
          >
            <p className="font-display text-5xl font-light text-primary tabular leading-none">{r.num}</p>
            <h3 className="font-display text-2xl font-semibold mt-5">{r.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.desc}</p>
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>{active === r.key ? "Showing data" : "Click to generate"}</span>
              <span className={`text-primary transition-transform ${active === r.key ? "rotate-90" : "group-hover:translate-x-0.5"}`}>
                {active === r.key ? "↓" : "→"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && <ReportPanel reportKey={active} onClose={() => setActive(null)} />}
    </div>
  );
}
