import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eyebrow, Pill } from "@/components/ui-bits";
import { useMySponsorships, useCreateSponsorship, useSponsorProfile, useUpsertSponsorProfile } from "@/hooks/useSponsorship";
import { useEvents } from "@/hooks/useEvents";
import { fmtDate, fmtPKR } from "@/lib/format";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/sponsorship")({ component: Sponsorship });

function Sponsorship() {
  const { user } = useAuth();
  const { data: sponsorships = [], isLoading } = useMySponsorships();
  const { data: profile } = useSponsorProfile();
  const { data: events = [] } = useEvents();
  const createSponsorship = useCreateSponsorship();
  const upsertProfile = useUpsertSponsorProfile();

  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [sponsorshipType, setSponsorshipType] = useState<"Gold" | "Silver" | "Title">("Silver");
  const [amount, setAmount] = useState(50000);
  const [companyName, setCompanyName] = useState(profile?.company_name ?? "");
  const [contactPerson, setContactPerson] = useState(profile?.contact_person ?? "");
  const [sponsorEmail, setSponsorEmail] = useState(profile?.email ?? user?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [level, setLevel] = useState<"Gold" | "Silver" | "Bronze">(profile?.sponsorship_level ?? "Silver");
  const [committedAmount, setCommittedAmount] = useState(profile?.amount ?? 0);

  useEffect(() => {
    if (!profile) return;
    setCompanyName(profile.company_name ?? "");
    setContactPerson(profile.contact_person ?? "");
    setSponsorEmail(profile.email ?? user?.email ?? "");
    setPhone(profile.phone ?? "");
    setLevel(profile.sponsorship_level ?? "Silver");
    setCommittedAmount(Number(profile.amount ?? 0));
  }, [profile, user?.email]);

  const handleSponsor = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      toast.error("Select an event");
      return;
    }
    if (amount <= 0) {
      toast.error("Amount must be > 0");
      return;
    }

    try {
      await createSponsorship.mutateAsync({ event_id: Number(selectedEventId), sponsorship_type: sponsorshipType, amount });
      toast.success("Sponsorship submitted! Awaiting admin confirmation.");
      setShowSponsorModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to submit sponsorship");
    }
  };

  const handleProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await upsertProfile.mutateAsync({ company_name: companyName, contact_person: contactPerson, email: sponsorEmail, phone, sponsorship_level: level, amount: committedAmount });
      toast.success("Profile updated.");
      setShowProfileModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>Your patronage</Eyebrow>
          <h1 className="font-display text-4xl font-semibold mt-3">Sponsored <em className="italic">programmes</em>.</h1>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setShowProfileModal(true)} className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted/50 transition-colors">
            {profile ? "Edit profile" : "Create profile"}
          </button>
          <button onClick={() => setShowSponsorModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Sponsor an event
          </button>
        </div>
      </div>

      {!profile && (
        <div className="mt-6 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Complete your <button onClick={() => setShowProfileModal(true)} className="underline">sponsor profile</button> before sponsoring events.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      )}

      {!isLoading && sponsorships.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground text-sm">No sponsorships yet. Sponsor an event to get started.</p>
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {(Array.isArray(sponsorships) ? sponsorships : []).map((sp) => (
          <div key={sp.sponsorship_id} className="rounded-lg border border-border bg-card p-6 space-y-3">
            <div className="flex items-start justify-between">
              <Pill tone="muted">{sp.sponsorship_type}</Pill>
              <span className={`font-mono text-[10px] uppercase tracking-wider ${sp.status === "approved" ? "text-green-500" : sp.status === "rejected" ? "text-rose-400" : sp.status === "pending" ? "text-amber-500" : "text-muted-foreground"}`}>
                {sp.status}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold">{sp.event_name || "General sponsorship"}</h3>
            {sp.event_date && <p className="font-mono text-[11px] text-muted-foreground">{fmtDate(sp.event_date)}</p>}
            {sp.rejection_reason && <p className="text-xs text-rose-500">{sp.rejection_reason}</p>}
            <p className="font-display text-2xl font-semibold text-primary">{fmtPKR(sp.amount)}</p>
          </div>
        ))}
      </div>

      {showSponsorModal && (
        <Modal title="Sponsor an event" onClose={() => setShowSponsorModal(false)}>
          <form onSubmit={handleSponsor} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Event</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                required
              >
                <option value="">Select event…</option>
                {(Array.isArray(events) ? events : []).map((ev: any) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Sponsorship tier</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary"
                value={sponsorshipType}
                onChange={(e) => setSponsorshipType(e.target.value as any)}
              >
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Title">Title</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Amount (PKR)</label>
              <input
                type="number"
                min={1}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowSponsorModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button
                type="submit"
                disabled={createSponsorship.isPending}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
              >
                {createSponsorship.isPending ? "Submitting…" : "Submit sponsorship"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showProfileModal && (
        <Modal title={profile ? "Edit sponsor profile" : "Create sponsor profile"} onClose={() => setShowProfileModal(false)}>
          <form onSubmit={handleProfile} className="space-y-4">
            {[
              { label: "Company name", value: companyName, onChange: setCompanyName, required: true },
              { label: "Contact person", value: contactPerson, onChange: setContactPerson, required: true },
              { label: "Email", value: sponsorEmail, onChange: setSponsorEmail, required: true, type: "email" },
              { label: "Phone", value: phone, onChange: setPhone },
            ].map(({ label, value, onChange, required, type }) => (
              <div key={label}>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">{label}</label>
                <input
                  type={type || "text"}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  required={required}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Sponsorship level</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
              >
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Committed amount (PKR)</label>
              <input
                type="number"
                min={0}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card outline-none focus:border-primary"
                value={committedAmount}
                onChange={(e) => setCommittedAmount(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button
                type="submit"
                disabled={upsertProfile.isPending}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
              >
                {upsertProfile.isPending ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
