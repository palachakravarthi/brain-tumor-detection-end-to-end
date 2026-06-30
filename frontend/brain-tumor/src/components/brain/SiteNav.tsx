import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Brain, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/upload", label: "Upload" },
  { to: "/history", label: "Prediction History" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/performance", label: "Model Performance" },
  { to: "/about", label: "About" },
] as const;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Brain className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">NeuroScan AI</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Medical Imaging
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background/95 px-5 py-3 lg:hidden">
          <div className="grid gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                )}
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
