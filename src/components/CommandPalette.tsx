import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { Calendar, LayoutDashboard, FileText, Users, Sparkles, BedDouble, Trophy, LogOut, Sun } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "./../lib/theme";
import { useEvents } from "@/hooks/useEvents";

interface Ctx { open: () => void; close: () => void; isOpen: boolean }
const CmdCtx = createContext<Ctx | null>(null);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toggle } = useTheme();
  const { data: events = [] } = useEvents();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => { setOpen(false); navigate({ to } as any); };

  return (
    <CmdCtx.Provider value={{ isOpen, open: () => setOpen(true), close: () => setOpen(false) }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-xl rounded-xl border border-border bg-card shadow-warm-lg overflow-hidden">
            <Command className="bg-card" loop>
              <div className="border-b border-border px-4">
                <Command.Input
                  autoFocus
                  placeholder="Search programmes, members, actions…"
                  className="w-full h-14 bg-transparent outline-none placeholder:text-muted-foreground/70 text-[15px]"
                />
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-6 text-sm text-muted-foreground italic font-display">No results. The story continues elsewhere.</Command.Empty>

                <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1">
                  <CmdItem icon={LayoutDashboard} label="Dashboard" hint="g d" onSelect={() => go("/app/dashboard")} />
                  <CmdItem icon={Calendar} label="Browse Programmes" hint="g e" onSelect={() => go("/app/events")} />
                  <CmdItem icon={Users} label="Members" onSelect={() => go("/app/users")} />
                  <CmdItem icon={FileText} label="Reports" onSelect={() => go("/app/reports")} />
                  <CmdItem icon={BedDouble} label="Accommodation" onSelect={() => go("/app/accommodation")} />
                  <CmdItem icon={Trophy} label="Leaderboards" onSelect={() => go("/app/leaderboards")} />
                </Command.Group>

                <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1">
                  <CmdItem icon={Sparkles} label="Create new programme" hint="c" onSelect={() => go("/app/events/new")} />
                  <CmdItem icon={Sun} label="Toggle theme" onSelect={() => { toggle(); setOpen(false); }} />
                  <CmdItem icon={LogOut} label="Sign out" onSelect={() => { logout(); setOpen(false); navigate({ to: "/" }); }} />
                </Command.Group>

                <Command.Group heading="Programmes" className="[&_[cmdk-group-heading]]:font-display [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1">
                  {events.slice(0, 6).map(e => (
                    <CmdItem key={e.id} icon={Calendar} label={e.name} hint={e.category} onSelect={() => go(`/events/${e.id}`)} />
                  ))}
                </Command.Group>
              </Command.List>
              <div className="border-t border-border px-3 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span>SOFTEC Command</span>
                <span>↑↓ navigate · ↵ select · esc close</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </CmdCtx.Provider>
  );
}

function CmdItem({ icon: Icon, label, hint, onSelect }: { icon: any; label: string; hint?: string; onSelect: () => void }) {
  return (
    <Command.Item onSelect={onSelect} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-muted aria-selected:text-foreground text-foreground/85">
      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
      {hint && <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">{hint}</kbd>}
    </Command.Item>
  );
}

export function useCommandPalette() {
  const c = useContext(CmdCtx);
  if (!c) return { open: () => {}, close: () => {}, isOpen: false };
  return c;
}
