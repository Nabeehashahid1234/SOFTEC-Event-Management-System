import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eyebrow } from "@/components/ui-bits";
import { useCreateEvent, useEvents, useVenues } from "@/hooks/useEvents";
import { fmtDate, fmtPKR, cn } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/events/new")({
  component: NewEvent,
});

const STEPS = ["Basics", "Schedule", "Venue", "Judges", "Pricing", "Review"];

function NewEvent() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { data: venues = [] } = useVenues();
  const { data: events = [] } = useEvents();
  const createEvent = useCreateEvent();

  const [venueId, setVenueId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [fee, setFee] = useState(0);
  const [capacity, setCapacity] = useState(100);

  const [category, setCategory] = useState<
    "Tech Events" | "Business Competitions" | "Gaming Tournaments" | "General Events"
  >("Tech Events");

  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();
  const days = new Date(year, month + 1, 0).getDate();

  const venueEvents = events.filter((e: any) => e.venueId === venueId);

  const submit = async () => {
    if (!name.trim() || !venueId) {
      toast.error("Name and venue are required.");
      return;
    }

    try {
      await createEvent.mutateAsync({
        event_name: name,
        description: desc,
        category,
        event_date: date,
        max_participants: capacity,
        venue_id: venueId,
        registration_fee: fee,
      });

      toast.success("Programme created successfully.");
      navigate({ to: "/app/events" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Could not create programme.");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <Eyebrow>New programme</Eyebrow>
      <h1 className="font-display text-4xl font-semibold mt-3">
        Create a <em className="italic">programme</em>.
      </h1>

      {/* Steps */}
      <div className="mt-8 mb-10 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-wider",
                i === step ? "text-primary" : "text-muted-foreground"
              )}
            >
              {String(i + 1).padStart(2, "0")} · {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-7 space-y-5">

          {/* STEP 0 */}
          {step === 0 && (
            <>
              <Field label="Programme name" id="name">
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter programme name"
                  className="inp"
                />
              </Field>

              <Field label="Excerpt" id="desc">
                <textarea
                  id="desc"
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short description"
                  className="inp"
                />
              </Field>

              <Field label="Category" id="category">
                <select
                  id="category"
                  className="inp"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  title="Category"
                >
                  <option value="Tech Events">Tech Events</option>
                  <option value="Business Competitions">Business Competitions</option>
                  <option value="Gaming Tournaments">Gaming Tournaments</option>
                  <option value="General Events">General Events</option>
                </select>
              </Field>
            </>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Field label="Date" id="date">
                <input
                  id="date"
                  type="date"
                  className="inp"
                  placeholder="YYYY-MM-DD"
                  title="Event date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>

              <Field label="Time" id="time">
                <input
                  id="time"
                  type="time"
                  className="inp"
                  placeholder="HH:MM"
                  title="Event time"
                  defaultValue="10:00"
                />
              </Field>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Field label="Venue" id="venue">
                <select
                  id="venue"
                  className="inp"
                  title="Venue"
                  value={venueId ?? ""}
                  onChange={(e) => setVenueId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Select venue
                  </option>
                  {venues.map((v: any) => (
                    <option key={v.venue_id} value={v.venue_id}>
                      {v.venue_name} · capacity {v.capacity}
                    </option>
                  ))}
                </select>
              </Field>

              <p className="text-xs text-muted-foreground">
                Conflict prevention shown on the right →
              </p>
            </>
          )}

          {/* STEP 3 — Judges */}
          {step === 3 && (
            <div className="py-4 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Judge assignment</p>
              <p className="text-sm text-foreground font-medium">Judges are assigned after the programme is published.</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once your programme is live, go to <strong>Adjudication</strong> in the sidebar to assign judges by email address. Judges receive access immediately after assignment.
              </p>
              <div className="mt-4 rounded-md border border-border bg-muted/30 p-4 font-mono text-xs text-muted-foreground space-y-1">
                <p>1. Publish this programme →</p>
                <p>2. Navigate to Adjudication →</p>
                <p>3. Assign judges by email →</p>
                <p>4. Judges score participants</p>
              </div>
            </div>
          )}

          {/* STEP 4 — Pricing */}
          {step === 4 && (
            <>
              <Field label="Registration fee (PKR)" id="fee">
                <input
                  id="fee"
                  type="number"
                  min={0}
                  className="inp"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  placeholder="0 for free events"
                />
              </Field>

              <Field label="Max participants" id="capacity">
                <input
                  id="capacity"
                  type="number"
                  min={1}
                  className="inp"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  placeholder="Enter capacity"
                />
              </Field>
            </>
          )}

          {/* STEP 5 — Review */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Review & publish</p>
              <div className="divide-y divide-border rounded-md border border-border overflow-hidden">
                {[
                  { label: "Name", value: name || "—" },
                  { label: "Category", value: category },
                  { label: "Date", value: fmtDate(date) },
                  { label: "Venue", value: venues.find((v: any) => v.venue_id === venueId)?.venue_name || "Not selected" },
                  { label: "Capacity", value: String(capacity) },
                  { label: "Fee", value: fee === 0 ? "Free" : fmtPKR(fee) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center px-4 py-3 gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground w-24 shrink-0">{label}</span>
                    <span className="text-sm font-medium truncate">{value}</span>
                  </div>
                ))}
              </div>
              {!name.trim() && <p className="text-xs text-rose-500">Programme name is required before publishing.</p>}
              {!venueId && <p className="text-xs text-rose-500">Venue must be selected before publishing.</p>}
            </div>
          )}

          {/* BUTTONS */}
          <div className="pt-5 border-t border-border flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>

            <button
              onClick={() =>
                step < STEPS.length - 1 ? setStep((s) => s + 1) : submit()
              }
              className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium"
              disabled={createEvent.isPending}
            >
              {step < STEPS.length - 1
                ? "Continue →"
                : createEvent.isPending
                ? "Publishing..."
                : "Publish"}
            </button>
          </div>
        </div>

        {/* SIDE PANEL */}
        <aside className="rounded-lg border border-border bg-card p-5">
          <Eyebrow>Venue schedule</Eyebrow>
          <p className="font-display text-base font-medium mt-2">
            {venues.find((v: any) => v.venue_id === venueId)?.venue_name ||
              "Select venue"}
          </p>

          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            {new Date(year, month).toLocaleString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {Array.from({ length: days }).map((_, i) => {
              const d = new Date(year, month, i + 1);
              const conflict = venueEvents.some(
                (e: any) =>
                  new Date(e.date).toDateString() === d.toDateString()
              );

              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded grid place-items-center font-mono text-[10px] border",
                    conflict
                      ? "bg-rose/15 text-rose border-rose/30"
                      : "bg-sage/10 text-sage border-sage/20"
                  )}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <style>{`
        .inp {
          margin-top: .5rem;
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--border);
          outline: none;
          padding: .5rem 0;
          font-size: .875rem;
        }
        .inp:focus {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}

/* FIELD COMPONENT (FIXED ACCESSIBILITY) */
function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}