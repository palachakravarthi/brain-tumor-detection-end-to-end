import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout, PageHeader } from "@/components/brain/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Brain, Search, Trash2, Loader2, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  normalizeClass,
  confidenceTier,
  CLASS_META,
  TIER_STYLES,
  CLASSES,
  type HistoryItem,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Prediction History — NeuroScan AI" }] }),
  component: HistoryPage,
});

const PAGE_SIZE = 9;

function Thumb({ item }: { item: HistoryItem }) {
  const cls = normalizeClass(item.prediction);
  const meta = CLASS_META[cls];
  return (
    <div
      className="grid h-14 w-14 shrink-0 place-items-center rounded-xl ring-1 ring-border"
      style={{ background: `color-mix(in oklch, ${meta.hex} 14%, transparent)` }}
    >
      <Brain className="h-7 w-7" style={{ color: meta.hex }} />
    </div>
  );
}

function HistoryPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const del = useMutation({
    mutationFn: deleteHistoryItem,
    onSuccess: () => {
      toast.success("Record deleted");
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const clearAll = useMutation({
    mutationFn: clearHistory,
    onSuccess: () => {
      toast.success("History cleared");
      setPage(0);
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't clear history"),
  });

  const filtered = useMemo(() => {
    const rows = (data ?? [])
      .filter((r) => (filter === "all" ? true : normalizeClass(r.prediction) === filter))
      .filter((r) => r.image_name.toLowerCase().includes(search.toLowerCase()))
      // Backend already orders newest-first; re-sort defensively.
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    return rows;
  }, [data, filter, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageHeader
            eyebrow="Records"
            title="Prediction History"
            subtitle="Every scan analyzed by the model, newest first."
          />
          {(data?.length ?? 0) > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" /> Clear history
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all prediction history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes every saved prediction. This can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearAll.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search by file name…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["all", ...CLASSES].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setFilter(c);
                  setPage(0);
                }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  filter === c
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading history…
          </div>
        )}

        {isError && (
          <Card className="border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="font-semibold text-destructive">Couldn't load history</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "The backend didn't respond."}
            </p>
          </Card>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <Card className="flex flex-col items-center gap-3 p-16 text-center">
            <div className="rounded-full bg-secondary p-4 text-muted-foreground">
              <Inbox className="h-8 w-8" />
            </div>
            <p className="font-semibold">No predictions yet</p>
            <p className="text-sm text-muted-foreground">Analyzed scans will appear here.</p>
          </Card>
        )}

        {pageRows.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageRows.map((item) => {
                const cls = normalizeClass(item.prediction);
                const meta = CLASS_META[cls];
                const tier = TIER_STYLES[confidenceTier(item.confidence)];
                const d = new Date(item.created_at);
                return (
                  <Card key={item.id} className="group flex flex-col gap-3 p-4 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]">
                    <div className="flex items-start gap-3">
                      <Thumb item={item} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium" title={item.image_name}>
                          {item.image_name}
                        </p>
                        <span className={cn("mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", meta.bg, meta.color)}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.hex }} />
                          {cls}
                        </span>
                      </div>
                      <button
                        onClick={() => del.mutate(item.id)}
                        disabled={del.isPending}
                        aria-label="Delete record"
                        className="rounded-md p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className={cn("font-semibold", tier.text)}>{item.confidence.toFixed(2)}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div className={cn("h-full rounded-full", tier.bar)} style={{ width: `${Math.min(100, item.confidence)}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                      <span>{d.toLocaleDateString()}</span>
                      <span>{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" disabled={safePage === 0} onClick={() => setPage((p) => p - 1)} className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {safePage + 1} of {pageCount}
                </span>
                <Button variant="outline" size="sm" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="gap-1">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
