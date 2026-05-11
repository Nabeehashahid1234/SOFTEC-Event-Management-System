import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Users, Share2, Loader2 } from "lucide-react";
import { useEvent } from "@/hooks/useEvents";
import { useMyRegistration, useRegisterEvent, useUnregisterEvent, useConfirmPayment } from "@/hooks/useRegistration";
import { useAuth } from "@/lib/auth";
import { fmtDate, fmtTime, fmtPKR, countdown } from "@/lib/format";
import { Eyebrow, Hairline, Pill, CapacityBar } from "@/components/ui-bits";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { toast } from "sonner";

export const Route = createFileRoute("/app/events/$eventId")({
  head: () => ({
    meta: [
      { title: "Programme Detail — SOFTEC '26" },
      { name: "description", content: "SOFTEC programme details and leaderboard." },
    ],
  }),
  component: AppEventDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center"><p className="font-display italic text-2xl">Programme not found.</p></div>
  ),
});

function AppEventDetail() {
  const { eventId } = Route.useParams();
  const { user } = useAuth();
  const { data, isLoading, isError } = useEvent(eventId);
  const { data: regData, isLoading: regLoading } = useMyRegistration(eventId);
  const register = useRegisterEvent();
  const unregister = useUnregisterEvent();
  const confirmPayment = useConfirmPayment();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const event = data?.event;
  const [, force] = useState(0);

  useEffect(() => {
    console.log("[AppEventDetail] PAGE MOUNTED", {
      eventId,
      user: user?.role,
      isLoading,
      isError,
      eventExists: !!event,
      eventName: event?.name,
      showRegistrationForm,
    });
  }, [eventId, user, isLoading, isError, event, showRegistrationForm]);

  useEffect(() => {
    const id = setInterval(() => force(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) return <div className="min-h-screen grid place-items-center"><p className="text-sm text-muted-foreground">Loading programme...</p></div>;
  if (isError || !event) return <div className="min-h-screen grid place-items-center"><p className="text-sm text-rose">Programme not found.</p></div>;

  const ct = countdown(event.date);
  const board = (data?.leaderboard ?? []).map((row, index) => ({
    rank: row.rank ?? index + 1,
    name: row.name ?? "Participant",
    avg_score: row.avg_score ?? 0,
    participant_id: row.participant_id,
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold">SOFTEC<span className="text-primary">.</span></Link>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Link to="/app/events" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5"><ArrowLeft className="h-3.5 w-3.5"/> All programmes</Link>
          </div>
        </div>
      </header>

      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-14 pb-10">
        <Eyebrow>{event.category}</Eyebrow>
          <h1 className="font-display text-5xl md:text-7xl font-semibold mt-4 leading-[1.02] max-w-4xl">
          {event.name.split(" ").map((w, i, arr) => (
            i === arr.length - 1 ? <em key={i} className="italic font-normal text-primary">{w}</em> : <span key={i}>{w} </span>
          ))}
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground tabular border-y border-border py-4">
          <span className="inline-flex items-center gap-2"><Calendar className="h-3.5 w-3.5"/> {fmtDate(event.date)} · {fmtTime(event.date)}</span>
          <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5"/> {event.venueName}</span>
          <span className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5"/> {event.registered}/{event.capacity || "∞"}</span>
          <span className="text-primary">{event.fee === 0 ? "Free entry" : fmtPKR(event.fee)}</span>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-24 grid lg:grid-cols-12 gap-12">
        {/* MAIN */}
        <article className="lg:col-span-8 space-y-12">
          <div>
            <p className="text-lg leading-relaxed text-foreground drop-cap">{event.description}</p>
          </div>

          <Section title="Rules">
            <ul className="space-y-2.5">
              {(event.rules.length ? event.rules : ["Rules will be announced by the organizer."]).map((r, i) => (
                <li key={i} className="flex gap-4 text-sm">
                  <span className="font-mono text-primary tabular w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-foreground/85">{r}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Prize Pool">
            <p className="font-display text-5xl font-semibold tabular text-foreground">{fmtPKR(event.prizePool)}</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-2">Distributed across the top three positions</p>
          </Section>

          <Section title="Schedule">
            <ol className="space-y-0">
              {(data?.rounds || []).map((r, i) => (
                <li key={i} className="relative pl-10 pb-6 last:pb-0 border-l border-border ml-3 -mt-1">
                  <span className="absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground tabular">{fmtDate(r.date)} · {fmtTime(r.date)}</p>
                  <p className="font-display text-2xl font-medium mt-1">{r.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{r.venue}</p>
                </li>
              ))}
            </ol>
          </Section>

          {board.length > 0 && (
            <Section title="Live Leaderboard">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-12 px-5 py-3 bg-muted/40 border-b border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <div className="col-span-2">Rank</div>
                  <div className="col-span-7">Contender</div>
                  <div className="col-span-3 text-right">Score</div>
                </div>
                {board.map((row) => (
                  <div key={row.participant_id} className="grid grid-cols-[72px_minmax(0,1fr)_92px] gap-3 px-5 py-3.5 border-b border-border last:border-0 items-center">
                    <div className="font-display text-2xl font-semibold tabular">{String(row.rank ?? 0).padStart(2, "0")}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{row.name}</p>
                    </div>
                    <div className="text-right font-mono tabular text-primary font-semibold">{Number(row.avg_score ?? 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </article>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 rounded-lg border border-border bg-card p-6 shadow-warm space-y-6">
            <div>
              <CapacityRing filled={event.registered} total={event.capacity} />
            </div>
            <Hairline />
            <div className="space-y-3">
              <Row label="Fee" value={event.fee === 0 ? "Free" : fmtPKR(event.fee)} accent />
              <Row label="Closes in" value={`${ct.d}d ${ct.h}h ${ct.m}m`} />
              <Row label="Venue" value={event.venueName || "—"} />
            </div>
            <Hairline />
            <RegisterButton
              user={user}
              event={event}
              regData={regData}
              regLoading={regLoading}
              register={register}
              unregister={unregister}
              confirmPayment={confirmPayment}
              eventId={eventId}
              showRegistrationForm={showRegistrationForm}
              setShowRegistrationForm={setShowRegistrationForm}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button className="hover:text-primary transition-colors">+ Add to calendar</button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"><Share2 className="h-3.5 w-3.5"/> Share</button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function RegisterButton({ user, event, regData, regLoading, register, unregister, confirmPayment, eventId, showRegistrationForm, setShowRegistrationForm }: any) {
  useEffect(() => {
    console.log("[RegisterButton] RENDER", {
      userRole: user?.role,
      showRegistrationForm,
      regLoading,
      isRegistered: Boolean(regData?.registered),
      isPending: regData?.registration?.payment_status === "pending",
      eventCapacity: event.capacity,
      eventRegistered: event.registered,
      eventFee: event.fee,
    });
  }, [user, showRegistrationForm, regLoading, regData, event]);

  if (!user) {
    console.log("[RegisterButton] NO USER - showing login link");
    return (
      <Link to="/login" className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
        Log in to register
      </Link>
    );
  }

  if (user.role !== "participant") {
    console.log("[RegisterButton] NOT PARTICIPANT ROLE:", user.role);
    return <p className="text-center text-xs text-muted-foreground py-2">Only participants can register for events.</p>;
  }

  if (regLoading) {
    console.log("[RegisterButton] REG LOADING");
    return (
      <div className="flex justify-center py-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isRegistered = Boolean(regData?.registered);
  const registration = regData?.registration ?? null;
  const isPending =
    registration &&
    registration.payment_status === "pending" &&
    Number(event.fee || 0) > 0;

  console.log("[RegisterButton] STATE CHECK", {
    isRegistered,
    isPending,
    hasRegistration: !!registration,
  });

  const handleRegister = async () => {
    console.log("[RegisterButton] REGISTER CLICKED");
    try {
      await register.mutateAsync(eventId);
      setShowRegistrationForm(false);
      toast.success(event.fee === 0 ? "Registered successfully!" : "Registered! Please complete payment.");
    } catch (err: any) {
      console.error("[register] error:", err?.response?.data || err?.message || err);
      toast.error(err?.response?.data?.error || err?.message || "Registration failed");
    }
  };

  const handleUnregister = async () => {
    if (!window.confirm("Cancel your registration?")) return;
    try {
      await unregister.mutateAsync(eventId);
      toast.success("Registration cancelled.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to cancel");
    }
  };

  const handlePayment = async () => {
    if (!registration?.payment_id) return;
    try {
      await confirmPayment.mutateAsync({ paymentId: registration.payment_id, eventId });
      toast.success("Payment confirmed!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Payment failed");
    }
  };

  if (isRegistered && isPending) {
    console.log("[RegisterButton] RENDERING: PAYMENT PENDING");
    return (
      <div className="space-y-2">
        <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-center">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Payment pending — {fmtPKR(registration.amount)}</p>
        </div>
        <button onClick={handlePayment} disabled={confirmPayment.isPending} className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
          {confirmPayment.isPending ? "Processing…" : "Confirm payment"}
        </button>
        <button onClick={handleUnregister} className="block w-full text-center py-2 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors">
          Cancel registration
        </button>
      </div>
    );
  }

  if (isRegistered) {
    console.log("[RegisterButton] RENDERING: ALREADY REGISTERED");
    return (
      <div className="space-y-2">
        <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-center">
          <p className="text-xs font-medium text-green-700 dark:text-green-400">You're registered ✓</p>
        </div>
        <button onClick={handleUnregister} className="block w-full text-center py-2 rounded-md text-xs text-muted-foreground hover:text-rose-500 transition-colors">
          Cancel registration
        </button>
      </div>
    );
  }

  const cap = Number(event.capacity || 0);
  const isFull =
    cap > 0 &&
    Number(event.registered || 0) >= cap;

  console.log("[RegisterButton] CAPACITY CHECK", {
    cap,
    registered: Number(event.registered || 0),
    isFull,
  });

  console.log("[RegisterButton] FORM CONDITION CHECK", {
    showRegistrationForm: Boolean(showRegistrationForm),
    isFull: Boolean(isFull),
    shouldShowForm: Boolean(showRegistrationForm) && !Boolean(isFull),
  });

  if (Boolean(showRegistrationForm) && !Boolean(isFull)) {
    console.log("[RegisterButton] RENDERING: REGISTRATION FORM");
    return (
      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <p className="text-sm font-medium">Confirm your registration</p>
          <p className="text-xs text-muted-foreground mt-1">You are about to register for {event.name}.</p>
        </div>
        <div className="grid gap-2 text-sm text-foreground">
          <div className="flex justify-between text-muted-foreground">
            <span>Fee</span>
            <span>{event.fee === 0 ? "Free" : fmtPKR(event.fee)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Capacity</span>
            <span>{event.registered}/{event.capacity || "∞"}</span>
          </div>
        </div>
        <div className="grid gap-3">
          <button onClick={handleRegister} disabled={register.isPending} className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
            {register.isPending ? "Registering…" : "Confirm registration"}
          </button>
          <button onClick={() => {
            console.log("[RegisterButton] CANCEL FORM CLICKED");
            setShowRegistrationForm(false);
          }} className="block w-full text-center py-3 rounded-md text-sm font-medium text-muted-foreground border border-border hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  console.log("[RegisterButton] RENDERING: REGISTER BUTTON");
  return (
    <button
      onClick={() => {
        console.log("[RegisterButton] REGISTER BUTTON CLICKED");
        console.log("[RegisterButton] BEFORE setShowRegistrationForm:", showRegistrationForm);
        setShowRegistrationForm(true);
        console.log("[RegisterButton] AFTER setShowRegistrationForm - state update queued");
      }}
      disabled={register.isPending || isFull}
      className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {register.isPending ? "Registering…" : isFull ? "Event full" : "Register for this programme"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="hairline-ember w-10 mb-3" />
      <h2 className="font-display text-3xl font-semibold mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium tabular ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function CapacityRing({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (filled / total) * 100) : 0;
  const r = 42, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-5">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} transform="rotate(-90 50 50)" className="transition-all duration-700" />
        <text x="50" y="48" textAnchor="middle" className="font-display fill-foreground tabular" fontSize="20" fontWeight="600">{Math.round(pct)}%</text>
        <text x="50" y="63" textAnchor="middle" className="font-mono fill-muted-foreground" fontSize="8">FILLED</text>
      </svg>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Capacity</p>
        <p className="font-display text-2xl font-semibold tabular mt-1">{filled} <span className="text-muted-foreground text-base">/ {total || "∞"}</span></p>
      </div>
    </div>
  );
}

