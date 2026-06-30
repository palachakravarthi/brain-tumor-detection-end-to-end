import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "neuroscan-theme";

// Runs before first paint (injected into <head>) so the page never flashes the
// wrong theme during SSR hydration.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Reads/sets the `dark` class on <html> and persists the choice. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  // Sync from the DOM (set by themeInitScript) once mounted to avoid SSR mismatch.
  useEffect(() => {
    setThemeState(currentTheme());
  }, []);

  const setTheme = (next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setThemeState(next);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, setTheme, toggleTheme };
}
