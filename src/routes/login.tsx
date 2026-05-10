import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Eyebrow } from "@/components/ui-bits";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SOFTEC '26" }] }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBusy(true);
      await login(email, password);
      toast.success("Welcome back.");
      nav({ to: "/app/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-paper border-r border-border">
        <Link to="/" className="font-display text-2xl font-semibold">SOFTEC<span className="text-primary">.</span></Link>
        <div>
          <Eyebrow>Welcome to Edition XXVI</Eyebrow>
          <h1 className="font-display text-5xl font-semibold mt-5 leading-[1.05]">
            Three days that <em className="italic text-primary">compress a semester</em> into a notebook.
          </h1>
          <p className="mt-6 text-muted-foreground max-w-md">Sign in to manage your registrations, teams, and the rest of your SOFTEC story.</p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">© MMXXVI · FAST-NUCES Lahore</p>
      </div>

      <div className="relative bg-card flex items-center justify-center p-8">
        <div className="absolute right-6 top-6 lg:right-8 lg:top-8">
          <ThemeSwitch />
        </div>
        <form onSubmit={submit} className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-semibold">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-2">New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link></p>

          <div className="mt-8 space-y-5">
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />
            <button disabled={busy} className="w-full bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, required }: { label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-2 text-sm transition-colors"
      />
    </label>
  );
}
