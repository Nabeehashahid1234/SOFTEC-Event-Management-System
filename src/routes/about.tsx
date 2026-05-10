import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Zap, Users, Trophy, Calendar, MapPin } from "lucide-react";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SOFTEC '26" },
      { name: "description", content: "The story behind SOFTEC, Pakistan's flagship undergraduate technology festival." },
    ],
  }),
  component: About,
});

function About() {
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
            <Link to="/sponsors" className="text-foreground/80 hover:text-primary transition-colors">Sponsors</Link>
            <span className="text-primary font-medium">About</span>
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
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 pt-20 pb-24">
        <span className="eyebrow">Since 2001</span>
        <h1 className="font-display font-light text-foreground mt-7 leading-[0.95] tracking-[-0.035em] text-[56px] md:text-[80px]">
          The <em className="italic font-normal text-gradient-ember">festival</em><br />
          behind the legend.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          SOFTEC is Pakistan's largest undergraduate-run technology festival, hosted by FAST-NUCES Lahore since 2001. Every year it brings together thousands of students, industry leaders, and innovators under one roof for three days of competition, collaboration, and ambition.
        </p>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {[
            { icon: Calendar, n: "26", label: "Editions" },
            { icon: Users, n: "300+", label: "Participants this year" },
            { icon: Trophy, n: "₨4.2M", label: "Prize pool" },
            { icon: MapPin, n: "FAST-NUCES", label: "Lahore Campus" },
          ].map(({ icon: I, n, label }) => (
            <div key={label} className="bg-card p-8">
              <I className="h-4 w-4 text-primary mb-4" />
              <p className="font-display text-4xl font-semibold tabular">{n}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <span className="eyebrow">Our story</span>
          <p className="font-mono text-xs text-muted-foreground mt-6">Vol. XXVI · Chapter I</p>
        </div>
        <div className="lg:col-span-8 space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-foreground text-lg font-display font-light">
            What began as a modest computing competition on a single campus has grown into a national institution.
          </p>
          <p>
            SOFTEC started in 2001 as an initiative by FAST-NUCES students who believed that the best way to learn was to compete — and the best way to compete was in public. A single event, one afternoon, a handful of teams. Twenty-six editions later, SOFTEC spans three days, fifty-plus programmes, four categories, and draws participants from over three hundred universities across Pakistan.
          </p>
          <p>
            The festival is entirely student-run. The organising committee — undergraduates themselves — plan logistics, negotiate sponsorships, recruit judges from industry, and manage everything from venue booking to prize disbursement. It is a working proof of what young engineers can build when given responsibility and trust.
          </p>
          <p>
            Edition XXVI continues that tradition. The 2026 festival takes place 13–15 March at FAST-NUCES Lahore, with competitions in technology, business, gaming, and general categories — plus exhibitions, workshops, and Pakistan's most sought-after student prize pool.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-20">
          <span className="eyebrow">What we run</span>
          <h2 className="font-display text-4xl font-semibold mt-5 mb-12">Four tracks. One festival.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: "01", name: "Tech Events", desc: "Hackathons, speed programming, ML competitions, and engineering challenges." },
              { num: "02", name: "Business", desc: "Investor pitches, case competitions, marketing strategy, and founder labs." },
              { num: "03", name: "Gaming", desc: "Esports tournaments, arcade battles, and competitive gaming arenas." },
              { num: "04", name: "General", desc: "Photography, debates, open mic, robotics display, and art exhibitions." },
            ].map(c => (
              <div key={c.num} className="rounded-lg border border-border p-6">
                <span className="font-mono text-xs text-primary tabular">{c.num}</span>
                <p className="font-display text-2xl font-semibold mt-4">{c.name}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1320px] mx-auto px-6 lg:px-12 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold">
          Ready to be part of <em className="italic font-normal text-gradient-ember">Edition XXVI</em>?
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
          Registration is open. Browse the full programme and sign up today.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground">
            Register now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium hover:border-primary/40 transition-colors">
            Browse events
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-wrap justify-between items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <p>© MMXXVI SOFTEC · FAST-NUCES Lahore</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/events" className="hover:text-primary transition-colors">Programme</Link>
            <Link to="/sponsors" className="hover:text-primary transition-colors">Patrons</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
