import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useCommandPalette } from "./CommandPalette";
import { ThemeSwitch } from "./ThemeSwitch";

type Crumb = { label: string; to: string };

const TITLES: Record<string, { title: string; crumbs: Crumb[] }> = {
  "/app/dashboard":    { title: "Dashboard",           crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Dashboard", to: "/app/dashboard" }] },
  "/app/events":       { title: "Programmes",           crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Programmes", to: "/app/events" }] },
  "/app/events/new":   { title: "Create Programme",     crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Programmes", to: "/app/events" }, { label: "New", to: "/app/events/new" }] },
  "/app/users":        { title: "Member Roster",        crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Members", to: "/app/users" }] },
  "/app/reports":      { title: "Compendium",           crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Reports", to: "/app/reports" }] },
  "/app/sponsors":     { title: "Patron Registry",      crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Patrons", to: "/app/sponsors" }] },
  "/app/sponsorship":  { title: "Sponsored Programmes", crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Sponsorship", to: "/app/sponsorship" }] },
  "/app/judging":      { title: "Adjudication",         crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Judging", to: "/app/judging" }] },
  "/app/leaderboards": { title: "Leaderboards",         crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Leaderboards", to: "/app/leaderboards" }] },
  "/app/accommodation":{ title: "Lodging",              crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Accommodation", to: "/app/accommodation" }] },
  "/app/teams":        { title: "Your Teams",           crumbs: [{ label: "Home", to: "/app/dashboard" }, { label: "Teams", to: "/app/teams" }] },
};

export function TopBar() {
  const path = useRouterState({ select: s => s.location.pathname });
  const meta = TITLES[path] ?? { title: "SOFTEC", crumbs: [{ label: "Home", to: "/app/dashboard" }] };
  const { open } = useCommandPalette();

  return (
    <header className="sticky top-0 z-30 h-[60px] border-b border-border bg-background/85 backdrop-blur-md">
      <div className="h-full px-6 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h2 className="font-display text-[19px] leading-none font-semibold text-foreground truncate">{meta.title}</h2>
          <nav className="flex items-center gap-1 mt-1" aria-label="Breadcrumb">
            {meta.crumbs.map((crumb, i) => (
              <span key={crumb.to} className="flex items-center gap-1">
                {i > 0 && <span className="font-mono text-[10px] text-muted-foreground/50">/</span>}
                {i === meta.crumbs.length - 1
                  ? <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{crumb.label}</span>
                  : <Link to={crumb.to} className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 hover:text-primary transition-colors">{crumb.label}</Link>
                }
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={open}
            className="hidden sm:flex items-center gap-2 h-9 pl-3 pr-2 rounded-md border border-border bg-card hover:border-primary/40 transition-colors text-sm text-muted-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search…</span>
            <kbd className="ml-4 font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">⌘K</kbd>
          </button>
          <button className="h-9 w-9 grid place-items-center rounded-md border border-border bg-card hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
