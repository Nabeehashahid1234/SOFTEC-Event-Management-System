import { useRouterState } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useCommandPalette } from "./CommandPalette";
import { ThemeSwitch } from "./ThemeSwitch";

const TITLES: Record<string, { title: string; crumb: string }> = {
  "/app/dashboard": { title: "Dashboard", crumb: "Home / Dashboard" },
  "/app/events": { title: "Programmes", crumb: "Home / Programmes" },
  "/app/events/new": { title: "Create Programme", crumb: "Home / Programmes / New" },
  "/app/users": { title: "Member Roster", crumb: "Home / Members" },
  "/app/reports": { title: "Compendium", crumb: "Home / Reports" },
  "/app/sponsors": { title: "Patron Registry", crumb: "Home / Patrons" },
  "/app/sponsorship": { title: "Sponsored Programmes", crumb: "Home / Sponsorship" },
  "/app/judging": { title: "Adjudication", crumb: "Home / Judging" },
  "/app/leaderboards": { title: "Leaderboards", crumb: "Home / Leaderboards" },
  "/app/accommodation": { title: "Lodging", crumb: "Home / Accommodation" },
  "/app/teams": { title: "Your Teams", crumb: "Home / Teams" },
};

export function TopBar() {
  const path = useRouterState({ select: s => s.location.pathname });
  const meta = TITLES[path] ?? { title: "SOFTEC", crumb: "Home" };
  const { open } = useCommandPalette();

  return (
    <header className="sticky top-0 z-30 h-[60px] border-b border-border bg-background/85 backdrop-blur-md">
      <div className="h-full px-6 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h2 className="font-display text-[19px] leading-none font-semibold text-foreground truncate">{meta.title}</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{meta.crumb}</p>
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
