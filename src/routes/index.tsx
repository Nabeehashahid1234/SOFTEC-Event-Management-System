import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Sparkles, Zap, Trophy, Users, Calendar, MapPin, Star, Code2, Briefcase, Gamepad2, Camera } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { countdown, fmtDate, fmtPKR } from "@/lib/format";
import { Hairline, Pill } from "@/components/ui-bits";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SOFTEC '26 — Edition XXVI · FAST-NUCES" },
      { name: "description", content: "The flagship technology festival of FAST-NUCES. March 2026, Lahore." },
    ],
  }),
  component: Landing,
});

const SOFTEC_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString();
})();

const TESTIMONIALS = [
  {
    quote: "The kind of event where a prototype can become a product by the end of the week.",
    author: "SOFTEC alumnus",
    role: "Participant",
  },
  {
    quote: "Fast-paced, ambitious, and surprisingly well run for a student-built festival.",
    author: "Industry mentor",
    role: "Judge",
  },
  {
    quote: "A strong bridge between campus energy and real-world technical pressure.",
    author: "Former organizer",
    role: "Volunteer",
  },
];

const LANDING_SPONSORS = [
  { tier: "Title", company: "Systems Ltd" },
  { tier: "Gold", company: "Allied Bank" },
  { tier: "Gold", company: "XLoop" },
  { tier: "Silver", company: "TechNova" },
  { tier: "Silver", company: "DevStack" },
];

function Landing() {
  const [ct, setCt] = useState(countdown(SOFTEC_DATE));
  const { data: events = [] } = useEvents();

  useEffect(() => {
    const id = setInterval(() => setCt(countdown(SOFTEC_DATE)), 60000);
    return () => clearInterval(id);
  }, []);

  const categories = [
    { num: "01", name: "Tech", desc: "Engineering · ML · systems · code", count: events.filter((e: any) => e.category === "Tech").length, icon: Code2, tone: "ember" },
    { num: "02", name: "Business", desc: "Pitches · marketing · strategy", count: events.filter((e: any) => e.category === "Business").length, icon: Briefcase, tone: "gold" },
    { num: "03", name: "Gaming", desc: "Esports · arcade · tournaments", count: events.filter((e: any) => e.category === "Gaming").length, icon: Gamepad2, tone: "electric" },
    { num: "04", name: "General", desc: "Photography · debates · arts", count: events.filter((e: any) => e.category === "General").length, icon: Camera, tone: "sage" },
  ];

  const featured = [...events].sort((a, b) => b.registered - a.registered).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <PublicNav />

      {/* MARQUEE TICKER */}
      <div className="border-y border-border bg-ink text-background overflow-hidden py-2.5">
        <div className="marquee-track font-mono text-[11px] uppercase tracking-[0.2em] whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex items-center gap-10 px-6 shrink-0">
              {["★ Edition XXVI · MMXXVI","Lahore · 13–15 March 2026","50+ programmes","PKR 4.2M prize pool","300+ universities","Patron: Systems Ltd","Live registration open","ILoveCoding · Speed Programming · Unreal","Esports Arena · Battle Royale","Investor Pitch · Founders Lab"].map(t => (
                <span key={t} className="flex items-center gap-10">
                  <span className="text-primary">{t}</span>
                  <span className="text-background/30">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative max-w-[1320px] mx-auto px-6 lg:px-12 pt-16 pb-28">
        {/* Aurora blobs */}
        <div aria-hidden className="absolute -top-10 -left-20 w-[520px] h-[520px] rounded-full blur-3xl opacity-60"
             style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 50%, transparent), transparent 70%)", animation: "var(--animate-aurora)" }}/>
        <div aria-hidden className="absolute top-40 -right-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-50"
             style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--color-electric) 50%, transparent), transparent 70%)", animation: "var(--animate-aurora)", animationDelay: "-6s" }}/>

        <div className="relative grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="eyebrow">Edition XXVI · MMXXVI</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-[11px] font-mono uppercase tracking-wider text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> Live registration
              </span>
            </div>

            <h1 className="font-display font-light text-foreground mt-7 leading-[0.95] tracking-[-0.035em] text-[56px] md:text-[88px] lg:text-[112px]">
              Where Pakistan's<br/>
              brightest minds<br/>
              <span className="italic font-normal text-gradient-ember">build the future</span><span className="text-primary">.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              The flagship technology festival of FAST-NUCES. <span className="text-foreground">Three days. Fifty programmes.</span> One arena for the country's most ambitious undergraduates.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all">
                <Sparkles className="h-4 w-4"/>
                Register for SOFTEC '26
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-6 py-3.5 text-sm font-medium hover:border-primary/40 hover:bg-card transition-all">
                Browse the programme <ArrowUpRight className="h-4 w-4"/>
              </Link>
            </div>
          </div>

          {/* Floating ticket card */}
          <div className="lg:col-span-4 relative">
            <div className="ticket p-7 ml-auto max-w-sm" style={{ ["--r" as any]: "-2deg", animation: "var(--animate-float)" }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Admit one</span>
                <span className="font-mono text-[10px] text-primary">N° 0042</span>
              </div>
              <p className="font-display text-[44px] font-semibold leading-none mt-4">
                SOFTEC<span className="text-primary">.</span>
              </p>
              <p className="font-serif italic text-lg text-muted-foreground mt-1">edition twenty-six</p>

              <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-wider">
                <div><div className="text-muted-foreground">Date</div><div className="text-foreground mt-1">13 Mar</div></div>
                <div><div className="text-muted-foreground">City</div><div className="text-foreground mt-1">Lahore</div></div>
                <div><div className="text-muted-foreground">Venue</div><div className="text-foreground mt-1">FAST · LHR</div></div>
              </div>

              <div className="my-5 border-t border-dashed border-border"/>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Opens in</div>
                  <div className="font-display font-semibold text-3xl tabular mt-1">
                    {String(ct.d).padStart(2, "0")}<span className="text-muted-foreground text-lg">d</span>
                    <span className="text-border mx-1">:</span>
                    {String(ct.h).padStart(2, "0")}<span className="text-muted-foreground text-lg">h</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-ember grid place-items-center text-primary-foreground">
                  <Zap className="h-5 w-5"/>
                </div>
              </div>
            </div>

            {/* sticker badge */}
            <div className="absolute -top-4 -left-2 w-24 h-24 rounded-full bg-foreground text-background grid place-items-center font-display italic text-sm hidden md:grid"
                 style={{ animation: "var(--animate-spin-slow)" }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0">
                <defs><path id="circ" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"/></defs>
                <text className="fill-current font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.18em" }}>
                  <textPath href="#circ">SOFTEC · MMXXVI · FAST · NUCES · </textPath>
                </text>
              </svg>
              <Star className="h-5 w-5 text-primary"/>
            </div>
          </div>
        </div>

        {/* Hero stats strip */}
        <div className="relative mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {[
            { n: "300+", l: "Participants", i: Users },
            { n: "50+",  l: "Programmes", i: Calendar },
            { n: "₨4.2M", l: "Prize pool", i: Trophy },
            { n: "72hr",  l: "Of competition", i: Zap },
          ].map(s => (
            <div key={s.l} className="bg-card p-6 group hover:bg-muted/30 transition-colors">
              <s.i className="h-4 w-4 text-primary mb-3"/>
              <p className="font-display font-semibold text-4xl md:text-5xl tabular leading-none">{s.n}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-3">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <Hairline />

      {/* CATEGORIES — bento style */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 py-28">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div className="max-w-xl">
            <span className="eyebrow">The programme</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold mt-5 leading-[0.98] tracking-tight">
              Four <em className="italic font-normal text-gradient-ember">categories</em>.<br/>One festival.
            </h2>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-primary hover:gap-3 transition-all">
            See all 50 programmes <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <Link
              key={c.num}
              to="/events"
              search={{ category: c.name } as any}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 hover:border-primary/40 hover:-translate-y-1 transition-all ${i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`}
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"
                   style={{ background: c.tone === "ember" ? "var(--color-primary)" : c.tone === "gold" ? "var(--color-gold)" : c.tone === "electric" ? "var(--color-electric)" : "var(--color-sage)" }}/>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary tabular">{c.num}</span>
                  <c.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"/>
                </div>
                <p className="font-display text-4xl md:text-5xl font-semibold mt-8 leading-none">{c.name}</p>
                <p className="font-serif italic text-base text-muted-foreground mt-3">{c.desc}</p>
                <div className="mt-8 pt-5 border-t border-dashed border-border flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{c.count} events</span>
                  <ArrowUpRight className="h-4 w-4 text-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED — magazine dark */}
      <section className="bg-mesh-warm grain text-background py-28 relative overflow-hidden">
        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <div>
              <span className="eyebrow !text-primary">Featured competitions</span>
              <h2 className="font-display text-5xl md:text-6xl font-semibold mt-5 text-background tracking-tight leading-[0.98]">
                The headline<br/><em className="italic font-normal">programmes</em>.
              </h2>
            </div>
            <Link to="/events" className="hidden md:inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-primary hover:text-background transition-colors">
              All programmes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {featured.slice(0,3).map((e, i) => (
              <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="group relative block rounded-2xl border border-background/15 bg-background/[0.04] backdrop-blur p-7 hover:bg-background/[0.08] hover:border-primary/50 transition-all overflow-hidden">
                <div className="absolute top-5 right-5 font-mono text-[10px] text-background/40 tabular">N° {String(i+1).padStart(2, "0")}</div>
                <span className="inline-block px-2 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-mono text-[10px] uppercase tracking-wider">{e.category}</span>
                <h3 className="font-display text-3xl font-medium mt-5 text-background leading-tight">{e.name}</h3>
                <p className="mt-4 text-sm text-background/65 leading-relaxed line-clamp-3">{e.excerpt}</p>
                <div className="mt-7 pt-5 border-t border-background/10 font-mono text-[11px] uppercase tracking-wider text-background/60 tabular flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3"/>{fmtDate(e.date)}</span>
                  <span className="text-primary font-semibold">{fmtPKR(e.prizePool)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE / EDITORIAL */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-3">
            <span className="eyebrow">Voices</span>
            <p className="font-mono text-xs text-muted-foreground mt-6">Vol. XXVI · Issue 01</p>
            <p className="font-mono text-xs text-muted-foreground">Pages 12–14</p>
          </div>
          <div className="lg:col-span-9 space-y-16">
            {TESTIMONIALS.map((t, i) => (
              <figure key={t.author} className="grid md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-1 font-display text-6xl text-primary leading-none italic">"</div>
                <div className="md:col-span-11">
                  <blockquote className="font-display italic font-light text-3xl md:text-4xl leading-tight text-foreground tracking-tight">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-ember grid place-items-center text-primary-foreground font-display font-semibold">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.author}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{t.role}</p>
                    </div>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS — credits */}
      <section className="relative bg-card border-y border-border py-28 overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-30"
             style={{ background: "radial-gradient(ellipse at top, color-mix(in oklab, var(--color-gold) 30%, transparent), transparent 60%)" }}/>
        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-12 text-center">
          <span className="eyebrow !justify-center">With gratitude to our patrons</span>

          <div className="mt-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Title Patron</p>
            <p className="font-display text-6xl md:text-7xl font-semibold mt-5 text-gradient-ember">{LANDING_SPONSORS.find(s => s.tier === "Title")?.company}</p>
          </div>

          <div className="mt-14 hairline-ember mx-auto w-16" />

          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Gold Patrons</p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-12 gap-y-4">
              {LANDING_SPONSORS.filter(s => s.tier === "Gold").map(s => (
                <span key={s.company} className="font-display text-3xl md:text-4xl font-medium hover:text-primary transition-colors cursor-default">{s.company}</span>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Silver Patrons</p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {LANDING_SPONSORS.filter(s => s.tier === "Silver").map(s => (
                <span key={s.company} className="font-display text-xl text-muted-foreground hover:text-foreground transition-colors cursor-default">{s.company}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 py-28">
        <div className="relative overflow-hidden rounded-3xl bg-mesh-warm grain text-background p-12 md:p-20">
          <div aria-hidden className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/40 blur-3xl"/>
          <div className="relative max-w-2xl">
            <span className="eyebrow !text-primary">Doors close 28 February</span>
            <h2 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[0.98] tracking-tight">
              Ready to <em className="italic font-normal text-gradient-ember">make your mark</em>?
            </h2>
            <p className="mt-6 text-lg text-background/70 max-w-lg">
              Registration is free for FAST students, ₨1,500 for everyone else. Team and accommodation packages available.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:shadow-[var(--shadow-glow)] transition-all">
                Register now <ArrowRight className="h-4 w-4"/>
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-background/30 px-7 py-3.5 text-sm font-medium text-background hover:bg-background/10 transition-colors">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-[1320px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-semibold">SOFTEC<span className="text-primary">.</span></p>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">The flagship technology festival of FAST-NUCES. An undergraduate-run institution since 2001.</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-6 flex items-center gap-2">
              <MapPin className="h-3 w-3"/> FAST-NUCES Lahore Campus, Block-B, Faisal Town
            </p>
          </div>
          <FooterCol title="Programme" links={[["Browse events", "/events"], ["Categories", "/events"], ["Schedule", "/events"]]} />
          <FooterCol title="Account" links={[["Sign in", "/login"], ["Register", "/signup"]]} />
          <FooterCol title="More" links={[["Sponsors", "/"], ["About", "/"]]} />
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap justify-between items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <p>© MMXXVI SOFTEC · FAST-NUCES Lahore</p>
          <Pill tone="ember">Edition XXVI · Live in {ct.d}d</Pill>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="md:col-span-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([l, h]) => (
          <li key={l}><Link to={h as any} className="text-foreground/80 hover:text-primary transition-colors">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}

function PublicNav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-ember grid place-items-center text-primary-foreground">
            <Zap className="h-4 w-4"/>
          </div>
          <span className="font-display text-xl font-semibold">SOFTEC<span className="text-primary">.</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/events" className="text-foreground/80 hover:text-primary transition-colors">Programme</Link>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Sponsors</a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <Link to="/login" className="text-sm text-foreground/80 hover:text-primary transition-colors">Sign in</Link>
          <Link to="/signup" className="hidden sm:inline-flex items-center gap-1.5 text-sm rounded-full bg-foreground text-background px-4 py-2 hover:bg-primary transition-colors">
            Register <ArrowRight className="h-3.5 w-3.5"/>
          </Link>
        </div>
      </div>
    </header>
  );
}
