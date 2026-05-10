import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { fmtDate } from "@/lib/format";
import { useJudgeDashboardData, useSubmitScore } from "@/hooks/useJudging";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Clock, X } from "lucide-react";

export const Route = createFileRoute("/app/judging")({ component: Judging });

function Judging() {
  const { data, isLoading, isError } = useJudgeDashboardData();
  const submitScore = useSubmitScore();

  const [selected, setSelected] = useState<{ participant_id: number; participant_name: string; event_id: number; event_name: string } | null>(null);
  const [score, setScore] = useState("5.0");
  const [comments, setComments] = useState("");

  const assigned = data?.assigned ?? [];
  const pending = data?.pending ?? [];
  const submitted = data?.submitted ?? [];
  const stats = data?.stats ?? { assigned_count: 0, submitted_count: 0, pending_count: 0 };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    const s = parseFloat(score);
    if (Number.isNaN(s) || s < 0 || s > 10) {
      toast.error("Score must be between 0 and 10");
      return;
    }

    try {
      await submitScore.mutateAsync({
        event_id: selected.event_id,
        participant_id: selected.participant_id,
        score: s,
        comments: comments.trim() || undefined,
      });
      toast.success(`Score submitted for ${selected.participant_name}`);
      setSelected(null);
      setScore("5.0");
      setComments("");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to submit score");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
        <p className="text-sm text-rose-500">Could not load judging data. Make sure you have a judge profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>Adjudication</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">Score <em className="italic">submissions</em>.</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Assigned events", value: stats.assigned_count },
          { label: "Scores submitted", value: stats.submitted_count },
          { label: "Pending evaluations", value: stats.pending_count },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="font-display text-3xl font-semibold mt-2">{value}</p>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" /> Pending evaluations
          </h2>
          <div className="space-y-2">
            {pending.map((p: any) => (
              <div key={p.participant_id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                <div>
                  <p className="font-medium text-sm">{p.participant_name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{p.event_name}</p>
                </div>
                <button onClick={() => setSelected({ participant_id: p.participant_id, participant_name: p.participant_name, event_id: p.event_id, event_name: p.event_name })} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                  Submit score
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold mb-4">Assigned events</h2>
        {assigned.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events assigned yet.</p>
        ) : (
          <div className="space-y-4">
            {assigned.map((ev: any) => (
              <div key={ev.event_id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Pill tone="ember">{ev.category}</Pill>
                    <h3 className="font-display text-xl font-medium mt-2">{ev.event_name}</h3>
                    <p className="font-mono text-[11px] text-muted-foreground mt-1 tabular">{fmtDate(ev.event_date)}</p>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground mt-1">{ev.total_rounds} round{ev.total_rounds !== 1 ? "s" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {submitted.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" /> Submitted scores
          </h2>
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
                {submitted.map((s: any) => (
                  <tr key={s.judging_id} className="border-b border-border last:border-0">
                    <td className="p-4">{s.event_name}</td>
                    <td className="text-muted-foreground">{s.participant_name}</td>
                    <td className="pr-4 text-right font-mono font-semibold text-primary tabular">{Number(s.score).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Submit score</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{selected.participant_name} — <span className="text-foreground">{selected.event_name}</span></p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Score (0 – 10)</label>
                <input type="number" min={0} max={10} step={0.1} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary" value={score} onChange={(e) => setScore(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Comments (optional)</label>
                <textarea rows={3} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary resize-none" value={comments} onChange={(e) => setComments(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelected(null)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" disabled={submitScore.isPending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60">{submitScore.isPending ? "Submitting…" : "Submit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
