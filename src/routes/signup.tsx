import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Eyebrow } from "@/components/ui-bits";
import { User, Briefcase, Gavel, Building2 } from "lucide-react";
import { cn } from "@/lib/format";
import type { Role } from "@/lib/auth";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Register — SOFTEC '26" }] }),
  component: Signup,
});

const ROLES: { id: Exclude<Role, "admin">; label: string; desc: string; icon: any }[] = [
  { id: "participant", label: "Participant", desc: "Compete in events, build teams, win prizes.", icon: User },
  { id: "organizer",   label: "Organizer",   desc: "Run a programme. Schedule, judge, deliver.", icon: Briefcase },
  { id: "judge",       label: "Judge",       desc: "Score submissions. Faculty & industry only.", icon: Gavel },
  { id: "sponsor",     label: "Sponsor",     desc: "Patron a category. Reach thousands.", icon: Building2 },
];

function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<Role, "admin">>("participant");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ name, email, password, role });
      toast.success("Welcome to SOFTEC '26.");
      nav({ to: "/app/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-paper border-r border-border">
        <Link to="/" className="font-display text-2xl font-semibold">SOFTEC<span className="text-primary">.</span></Link>
        <div>
          <Eyebrow>Begin your edition</Eyebrow>
          <h1 className="font-display text-5xl font-semibold mt-5 leading-[1.05]">
            Pick your <em className="italic text-primary">role</em>. The rest unfolds.
          </h1>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">© MMXXVI · FAST-NUCES</p>
      </div>

      <div className="relative bg-card p-8 md:p-12">
        <div className="absolute right-6 top-6 lg:right-8 lg:top-8">
          <ThemeSwitch />
        </div>
        <form onSubmit={submit} className="max-w-md mx-auto">
          <h2 className="font-display text-3xl font-semibold">Create account</h2>
          <p className="text-sm text-muted-foreground mt-2">Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>

          <div className="mt-7 space-y-5">
            <F label="Full name"><input required placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="inp" /></F>
            <F label="Email"><input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="inp" /></F>
            <F label="Password"><input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="inp" /></F>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-8 mb-3">Choose your role</p>
          <div className="grid grid-cols-2 gap-2.5">
            {ROLES.map(r => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)} className={cn(
                "text-left p-3.5 rounded-lg border transition-all",
                role === r.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}>
                <r.icon className={cn("h-4 w-4", role === r.id ? "text-primary" : "text-muted-foreground")} strokeWidth={1.75} />
                <p className="text-sm font-medium mt-2">{r.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{r.desc}</p>
              </button>
            ))}
          </div>

          <button className="mt-8 w-full bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
            Create account
          </button>

          <style>{`.inp{margin-top:.5rem;width:100%;background:transparent;border:0;border-bottom:1px solid var(--border);outline:none;padding:.5rem 0;font-size:.875rem;transition:border-color .2s}.inp:focus{border-color:var(--primary)}`}</style>
        </form>
      </div>
    </div>
  );
}

function F({ label, children }: any) {
  return <label className="block"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
