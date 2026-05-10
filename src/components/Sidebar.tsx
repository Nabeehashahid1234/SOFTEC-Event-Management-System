import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Calendar, Users, FileText, Trophy, Building2,
  Award, BedDouble, LogOut, Sparkles, Megaphone, BarChart2,
} from "lucide-react";
import { cn } from "@/lib/format";

const NAV: Record<string, { to: string; label: string; icon: any }[]> = {
  admin: [
    { to: "/app/dashboard", label: "Almanac", icon: LayoutDashboard },
    { to: "/app/users", label: "Members", icon: Users },
    { to: "/app/events", label: "Programmes", icon: Calendar },
    { to: "/app/sponsors", label: "Patrons", icon: Building2 },
    { to: "/app/reports", label: "Compendium", icon: FileText },
  ],
  participant: [
    { to: "/app/dashboard", label: "My Desk", icon: LayoutDashboard },
    { to: "/app/events", label: "Programme", icon: Calendar },
    { to: "/app/accommodation", label: "Lodging", icon: BedDouble },
    { to: "/app/teams", label: "Teams", icon: Users },
  ],
  organizer: [
    { to: "/app/dashboard", label: "Editor's Desk", icon: LayoutDashboard },
    { to: "/app/events", label: "My Events", icon: Calendar },
    { to: "/app/events/new", label: "Create", icon: Sparkles },
    { to: "/app/reports", label: "Reports", icon: BarChart2 },
  ],
  judge: [
    { to: "/app/dashboard", label: "Adjudication", icon: LayoutDashboard },
    { to: "/app/judging", label: "Score", icon: Award },
    { to: "/app/leaderboards", label: "Leaderboards", icon: Trophy },
  ],
  sponsor: [
    { to: "/app/dashboard", label: "Patron's Desk", icon: LayoutDashboard },
    { to: "/app/sponsorship", label: "Programmes", icon: Megaphone },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });
  if (!user) return null;
  const items = NAV[user.role];

  return (
    <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="px-6 pt-7 pb-8">
        <Link to="/" className="block">
          <h1 className="font-display text-2xl font-semibold tracking-tight leading-none text-foreground">
            SOFTEC<span className="text-primary">.</span>
          </h1>
          <p className="eyebrow mt-2 !text-[10px] text-muted-foreground">FAST-NUCES · MMXXVI</p>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {items.map(it => {
          const active = path === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" />}
              <it.icon className="h-4 w-4" strokeWidth={1.75} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center font-display font-semibold text-sm">
            {user.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{user.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{user.role}</p>
          </div>
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
