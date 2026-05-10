import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/format";
import { useTheme } from "@/lib/theme";

export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("flex h-9 items-center rounded-md border border-border bg-card p-0.5", className)} aria-label="Theme">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "h-8 w-8 grid place-items-center rounded transition-colors",
          theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "h-8 w-8 grid place-items-center rounded transition-colors",
          theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
