import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

const Ctx = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

const KEY = "softec.theme";
const USER_CHOICE_KEY = "softec.theme.userChoice";
const LEGACY_THEMES: Record<string, Theme> = {
  atrium: "light",
  solstice: "dark",
};

function readStoredTheme(): Theme {
  if (localStorage.getItem(USER_CHOICE_KEY) !== "true") return "light";

  const stored = localStorage.getItem(KEY);
  if (stored === "light" || stored === "dark") return stored;
  if (stored && stored in LEGACY_THEMES) return LEGACY_THEMES[stored];
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const chooseTheme = (nextTheme: Theme) => {
    localStorage.setItem(USER_CHOICE_KEY, "true");
    setTheme(nextTheme);
  };

  return (
    <Ctx.Provider value={{ theme, setTheme: chooseTheme, toggle: () => chooseTheme(theme === "light" ? "dark" : "light") }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
