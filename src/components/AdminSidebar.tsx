import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Users, Calendar, Building2, FileText, Trophy, BarChart2,
  Award, LogOut, Sparkles, Megaphone,
} from "lucide-react";
import { cn } from "@/lib/format";

const NAV = {
  admin: [
    { to: "/admin/dashboard", label: "Control Center", icon: BarChart2 },
    { to: "/app/users", label: "Members", icon: Users },
    { to: "/app/events", label: "Programmes", icon: Calendar },
    { to: "/app/sponsors", label: "Patrons", icon: Building2 },
    { to: "/app/reports", label: "Compendium", icon: FileText },
  ],
};

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });
  if (!user || user.role !== "admin") return null;
  const items = NAV.admin;

  return (
    <aside className="w-[240px] shrink-0 flex flex-col border-r border-white/5 bg-[#0a0a0b] text-white selection:bg-primary/30">
      <div className="px-7 pt-8 pb-10">
        <Link to="/" className="block group">
          <h1 className="font-display text-2xl font-bold tracking-tight leading-none text-white transition-transform group-hover:scale-[1.02]">
            SOFTEC<span className="text-primary">.</span>
          </h1>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mt-2.5">Command Center · '26</p>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {items.map(({ to, label, icon: I }) => {
          const active = path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active 
                  ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]" />}
              <I className={cn("h-4 w-4 transition-colors", active ? "text-primary" : "group-hover:text-white")} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="h-9 w-9 rounded-lg bg-primary/20 text-primary grid place-items-center font-display font-bold text-xs ring-1 ring-primary/30">
            {user.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-white truncate uppercase tracking-tight">{user.name}</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/30">System Admin</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-md text-white/30 hover:text-primary hover:bg-primary/10 transition-all"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}