import { Card } from "@/components/ui/card";
import { CheckCircle2, FlaskConical, Cpu } from "lucide-react";

/**
 * Shows which model is serving predictions. Switching is intentionally disabled —
 * the backend always runs the production VGG16 model. This is a status display, not a control.
 */
export function ModelSelector() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="relative overflow-hidden border-primary/40 bg-primary/5 p-5 ring-1 ring-primary/20">
        <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Active
        </div>
        <div className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
          <Cpu className="h-5 w-5" />
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">Production Model</p>
        <h3 className="mt-1 text-lg font-bold">VGG16 Transfer Learning</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Serving every prediction · 94.5% test accuracy
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-success">
          <CheckCircle2 className="h-3.5 w-3.5" /> Currently classifying your scans
        </div>
      </Card>

      <Card className="border-border/60 p-5 opacity-90">
        <div className="absolute right-4 top-4 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Reference
        </div>
        <div className="inline-flex rounded-xl bg-secondary p-2.5 text-muted-foreground">
          <FlaskConical className="h-5 w-5" />
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Research Model</p>
        <h3 className="mt-1 text-lg font-bold">Custom CNN</h3>
        <p className="mt-1 text-sm text-muted-foreground">Baseline · 62.75% test accuracy</p>
        <div className="mt-3 text-xs text-muted-foreground">Kept for comparison — not used for live inference</div>
      </Card>
    </div>
  );
}
