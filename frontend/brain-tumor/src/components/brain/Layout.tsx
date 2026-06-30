import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

/** Standard page header used across dashboard-style pages. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</span>
      )}
      <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
