import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Zap } from "lucide-react";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Patrons & Sponsors — SOFTEC '26" },
      { name: "description", content: "The organisations backing Pakistan's largest undergraduate technology festival." },
    ],
  }),
  component: Sponsors,
});

const SPONSORS = [
  {
    tier: "Title Patron",
    accent: "text-gradient-ember",
    items: [
      { name: "Systems Ltd", desc: "Pakistan's largest IT services company. Systems Limited provides ERP solutions, cloud infrastructure, and enterprise software to clients across 20+ countries.", url: null },
    ],
  },
  {
    tier: "Gold Patrons",
    accent: "text-primary",
    items: [
      { name: "Allied Bank", desc: "One of Pakistan's leading commercial banks, supporting technology education and youth development nationwide.", url: null },
      { name: "XLoop", desc: "A fast-growing technology and digital transformation company based in Lahore, focused on engineering excellence.", url: null },
    ],
  },
  {
    tier: "Silver Patrons",
    accent: "text-muted-foreground",
    items: [
      { name: "TechNova", desc: "A product engineering firm specialising in SaaS platforms and mobile applications.", url: null },
      { name: "DevStack", desc: "An open-source infrastructure company powering developer tooling across South Asia.", url: null },
    ],
  },
];

function Sponsors() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-ember grid place-items-center text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-display text-xl font-semibold">SOFTEC<span className="text-primary">.</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/events" className="text-foreground/80 hover:text-primary transition-colors">Programme</Link>
            <span className="text-primary font-medium">Sponsors</span>
            <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Link to="/login" className="text-sm text-foreground/80 hover:text-primary transition-colors">Sign in</Link>
            <Link to="/signup" className="hidden sm:inline-flex items-center gap-1.5 text-sm rounded-full bg-foreground text-background px-4 py-2 hover:bg-primary transition-colors">
              Register <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 pt-20 pb-16 text-center">
        <span className="eyebrow !justify-center">With gratitude</span>
        <h1 className="font-display font-light text-foreground mt-7 leading-[0.95] tracking-[-0.035em] text-[56px] md:text-[72px]">
          Our <em className="italic font-normal text-gradient-ember">patrons</em>.
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">
          SOFTEC '26 is made possible by the organisations who believe in the next generation of Pakistani technologists. Their partnership funds prizes, infrastructure, and the student experience.
        </p>
      </section>

      {/* SPONSOR TIERS */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 pb-24 space-y-16">
        {SPONSORS.map(tier => (
          <div key={tier.tier}>
            <p className={`font-mono text-[10px] uppercase tracking-[0.22em] mb-8 ${tier.accent}`}>{tier.tier}</p>
            <div className={`grid gap-5 ${tier.items.length === 1 ? "" : "md:grid-cols-2"}`}>
              {tier.items.map(s => (
                <div key={s.name} className="rounded-xl border border-border bg-card p-8">
                  <p className={`font-display font-semibold leading-none mb-5 ${tier.items.length === 1 ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"} ${tier.accent}`}>
                    {s.name}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* BECOME A SPONSOR CTA */}
      <section className="border-t border-border bg-card py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-4xl font-semibold">Want to become a patron?</h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
            Reach 300+ of Pakistan's top engineering students in three days. Sponsorship packages are available for all tiers — get in touch with the SOFTEC organising committee.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/app/sponsorship"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground"
            >
              Sponsor an event <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium hover:border-primary/40 transition-colors">
              Learn about SOFTEC
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-wrap justify-between items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <p>© MMXXVI SOFTEC · FAST-NUCES Lahore</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/events" className="hover:text-primary transition-colors">Programme</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
