import { useState, type ReactNode, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Calendar, MapPin, Users, Banknote, Trophy } from "lucide-react";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { useCreateEvent, useVenues } from "@/hooks/useEvents";
import { fmtDate, fmtPKR, cn } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/events/new")({
  component: NewEvent,
});

type Category = "Tech Events" | "Business Competitions" | "Gaming Tournaments" | "General Events";
const CATEGORIES: Category[] = ["Tech Events", "Business Competitions", "Gaming Tournaments", "General Events"];
const CATEGORY_LABELS: Record<Category, string> = {
  "Tech Events": "Tech",
  "Business Competitions": "Business",
  "Gaming Tournaments": "Gaming",
  "General Events": "General",
};

function localDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function NewEvent() {
  const navigate = useNavigate();
  const { data: venues = [], isLoading: venuesLoading } = useVenues();
  const createEvent = useCreateEvent();

  const [name, setName]         = useState("");
  const [desc, setDesc]         = useState("");
  const [category, setCategory] = useState<Category>("Tech Events");
  const [date, setDate]         = useState(localDateString());
  const [venueId, setVenueId]   = useState<number | "">("");
  const [fee, setFee]           = useState<number | "">(0);
  const [capacity, setCapacity] = useState<number | "">(100);
  const [prize, setPrize]       = useState<number | "">(0);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())             e.name = "Programme name is required";
    if (name.trim().length < 2)   e.name = "Name must be at least 2 characters";
    if (!date)                    e.date = "Event date is required";
    if (!venueId)                 e.venueId = "Venue is required";
    if (capacity === "" || Number(capacity) < 1) e.capacity = "Capacity must be at least 1";
    if (fee === "" || Number(fee) < 0)  e.fee = "Fee cannot be negative";
    return e;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields before publishing.");
      return;
    }

    try {
      await createEvent.mutateAsync({
        event_name: name.trim(),
        description: desc.trim() || undefined,
        category,
        event_date: date,
        max_participants: Number(capacity),
        venue_id: Number(venueId),
        registration_fee: Number(fee),
        prize_pool: Number(prize) || 0,
      });
      toast.success("Programme published successfully!");
      navigate({ to: "/app/events" });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to create programme. Please try again.";
      toast.error(msg);
    }
  };

  const selectedVenue = venues.find((v: any) => v.venue_id === Number(venueId));
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link to="/app/events" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Eyebrow>New programme</Eyebrow>
      </div>
      <h1 className="font-display text-4xl font-semibold mt-2 mb-8">
        Create a <em className="italic">programme</em>.
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* ─── FORM ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* BASICS */}
            <FormSection title="01 · Basics">
              <Field label="Programme name *" error={errors.name}>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: "" })); }}
                  placeholder="e.g. ILoveCoding Speed Round"
                  className={inp(!!errors.name)}
                  maxLength={160}
                  required
                />
              </Field>
              <Field label="Description / excerpt">
                <textarea
                  rows={3}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Short description shown on event cards (optional)"
                  className={inp(false)}
                />
              </Field>
              <Field label="Category">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as Category)}
                  className={inp(false)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </FormSection>

            {/* SCHEDULE */}
            <FormSection title="02 · Schedule">
              <Field label="Event date *" error={errors.date}>
                <input
                  type="date"
                  value={date}
                  onChange={e => { setDate(e.target.value); if (errors.date) setErrors(prev => ({ ...prev, date: "" })); }}
                  className={inp(!!errors.date)}
                  required
                />
              </Field>
            </FormSection>

            {/* VENUE */}
            <FormSection title="03 · Venue">
              <Field label="Venue *" error={errors.venueId}>
                {venuesLoading ? (
                  <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading venues…
                  </div>
                ) : venues.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No venues available. Contact admin to add venues.</p>
                ) : (
                  <select
                    value={venueId}
                    onChange={e => { setVenueId(e.target.value === "" ? "" : Number(e.target.value)); if (errors.venueId) setErrors(prev => ({ ...prev, venueId: "" })); }}
                    className={inp(!!errors.venueId)}
                  >
                    <option value="">Select a venue…</option>
                    {venues.map((v: any) => (
                      <option key={v.venue_id} value={v.venue_id}>
                        {v.venue_name} — capacity {v.capacity}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              {selectedVenue && (
                <div className="mt-2 rounded-md bg-sage/10 border border-sage/20 px-4 py-3 flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-sage shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-sage">{selectedVenue.venue_name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">Capacity: {selectedVenue.capacity}</p>
                  </div>
                </div>
              )}
            </FormSection>

            {/* PRICING */}
            <FormSection title="04 · Pricing & capacity">
              <div className="grid sm:grid-cols-3 gap-5">
                <Field label="Registration fee (PKR)" error={errors.fee}>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={fee}
                    onChange={e => { setFee(e.target.value === "" ? "" : Number(e.target.value)); if (errors.fee) setErrors(prev => ({ ...prev, fee: "" })); }}
                    placeholder="0"
                    className={inp(!!errors.fee)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter 0 for free entry</p>
                </Field>
                <Field label="Max participants *" error={errors.capacity}>
                  <input
                    type="number"
                    min={1}
                    value={capacity}
                    onChange={e => { setCapacity(e.target.value === "" ? "" : Number(e.target.value)); if (errors.capacity) setErrors(prev => ({ ...prev, capacity: "" })); }}
                    placeholder="100"
                    className={inp(!!errors.capacity)}
                  />
                </Field>
                <Field label="Prize pool (PKR)">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={prize}
                    onChange={e => setPrize(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className={inp(false)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Optional</p>
                </Field>
              </div>
            </FormSection>

            {/* SUBMIT */}
            <div className="flex items-center justify-between pt-2">
              <Link to="/app/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Cancel
              </Link>
              <button
                type="submit"
                disabled={createEvent.isPending}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-colors",
                  createEvent.isPending
                    ? "bg-primary/60 text-primary-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {createEvent.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {createEvent.isPending ? "Publishing…" : "Publish programme →"}
              </button>
            </div>

            {hasErrors && (
              <p className="text-xs text-rose-500 -mt-1">
                Please fix the required fields above before publishing.
              </p>
            )}
          </div>

          {/* ─── PREVIEW CARD ─── */}
          <aside className="lg:sticky lg:top-[72px] space-y-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live preview</p>

              <div>
                <Pill tone="muted">{CATEGORY_LABELS[category]}</Pill>
                <h3 className="font-display text-2xl font-semibold mt-3 leading-tight">
                  {name.trim() || <span className="text-muted-foreground italic font-normal text-xl">Programme name</span>}
                </h3>
                {desc && <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">{desc}</p>}
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border">
                <PreviewRow icon={Calendar} label={date ? fmtDate(date + "T12:00:00") : "No date set"} />
                <PreviewRow icon={MapPin}   label={selectedVenue?.venue_name || "No venue selected"} />
                <PreviewRow icon={Users}    label={capacity ? `${capacity} participants max` : "Capacity not set"} />
                <PreviewRow icon={Banknote} label={fee === 0 || fee === "" ? "Free entry" : fmtPKR(Number(fee))} accent />
                {Number(prize) > 0 && (
                  <PreviewRow icon={Trophy} label={`Prize: ${fmtPKR(Number(prize))}`} />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">After publishing</p>
              <p>A judge will be automatically assigned. You can add more judges from the Adjudication page.</p>
              <p>The event appears immediately in the public programme catalogue.</p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground border-b border-border pb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

function PreviewRow({ icon: I, label, accent }: { icon: any; label: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <I className={cn("h-3.5 w-3.5 shrink-0", accent ? "text-primary" : "text-muted-foreground")} />
      <span className={cn("text-sm truncate", accent ? "text-primary font-medium" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}

function inp(hasError: boolean) {
  return cn(
    "mt-1 block w-full rounded-md border px-3 py-2 text-sm bg-card outline-none transition-colors",
    hasError
      ? "border-rose-400 focus:border-rose-500"
      : "border-border focus:border-primary"
  );
}
