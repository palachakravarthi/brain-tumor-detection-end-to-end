import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Layout, PageHeader } from "@/components/brain/Layout";
import { Card } from "@/components/ui/card";
import { Activity, Brain, Gauge, Loader2 } from "lucide-react";
import {
  getStats,
  getHistory,
  normalizeClass,
  confidenceTier,
  CLASS_META,
  TIER_STYLES,
  CLASSES,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NeuroScan AI" }] }),
  component: DashboardPage,
});

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function StatCard({
  label,
  value,
  Icon,
  tint,
}: {
  label: string;
  value: string | number;
  Icon: typeof Brain;
  tint?: string;
}) {
  return (
    <Card className="glass p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4" style={tint ? { color: tint } : undefined} />
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight" style={tint ? { color: tint } : undefined}>
        {value}
      </p>
    </Card>
  );
}

function DashboardPage() {
  const mounted = useMounted();
  const stats = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const history = useQuery({ queryKey: ["history"], queryFn: getHistory });

  const counts = stats.data?.counts ?? {};
  const chartData = CLASSES.map((c) => ({
    name: c,
    value: (counts[c] ?? 0) + (counts[`${c} Tumor`] ?? 0), // fold "Glioma Tumor" → Glioma
    fill: CLASS_META[c].hex,
  }));
  const hasData = chartData.some((d) => d.value > 0);

  const recent = (history.data ?? []).slice(0, 8);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-5 py-12">
        <PageHeader eyebrow="Overview" title="Dashboard" subtitle="Aggregate statistics across all analyzed scans." />

        {stats.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading statistics…
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <StatCard label="Total Predictions" value={stats.data?.total ?? 0} Icon={Activity} tint="var(--primary)" />
              <StatCard label="Average Confidence" value={`${stats.data?.average_confidence ?? 0}%`} Icon={Gauge} tint="oklch(0.68 0.17 155)" />
              <StatCard label="Active Model" value="VGG16" Icon={Brain} tint="var(--primary)" />
              {CLASSES.map((c) => (
                <StatCard
                  key={c}
                  label={c}
                  value={(counts[c] ?? 0) + (counts[`${c} Tumor`] ?? 0)}
                  Icon={Brain}
                  tint={CLASS_META[c].hex}
                />
              ))}
            </div>

            {/* Charts */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold">Prediction Distribution</h3>
                <p className="text-sm text-muted-foreground">Share of each class</p>
                <div className="mt-4 h-72">
                  {mounted && hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                          {chartData.map((d) => (
                            <Cell key={d.name} fill={d.fill} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: 12,
                            color: "var(--popover-foreground)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart mounted={mounted} />
                  )}
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {chartData.map((d) => (
                    <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} /> {d.name}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold">Predictions per Class</h3>
                <p className="text-sm text-muted-foreground">Total counts</p>
                <div className="mt-4 h-72">
                  {mounted && hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: "var(--secondary)" }}
                          contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: 12,
                            color: "var(--popover-foreground)",
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {chartData.map((d) => (
                            <Cell key={d.name} fill={d.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart mounted={mounted} />
                  )}
                </div>
              </Card>
            </div>

            {/* Recent table */}
            <Card className="mt-6 overflow-hidden">
              <div className="border-b border-border p-6 pb-4">
                <h3 className="text-lg font-semibold">Recent Predictions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-6 py-3 font-medium">Scan</th>
                      <th className="px-6 py-3 font-medium">Prediction</th>
                      <th className="px-6 py-3 font-medium">Confidence</th>
                      <th className="px-6 py-3 font-medium">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                          No predictions yet.
                        </td>
                      </tr>
                    )}
                    {recent.map((r) => {
                      const cls = normalizeClass(r.prediction);
                      const meta = CLASS_META[cls];
                      const tier = TIER_STYLES[confidenceTier(r.confidence)];
                      return (
                        <tr key={r.id} className="border-b border-border/60 last:border-0">
                          <td className="max-w-[180px] truncate px-6 py-3 font-medium">{r.image_name}</td>
                          <td className="px-6 py-3">
                            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", meta.bg, meta.color)}>
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.hex }} /> {cls}
                            </span>
                          </td>
                          <td className={cn("px-6 py-3 font-semibold", tier.text)}>{r.confidence.toFixed(1)}%</td>
                          <td className="px-6 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}

function EmptyChart({ mounted }: { mounted: boolean }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {mounted ? "No data to chart yet" : null}
    </div>
  );
}
