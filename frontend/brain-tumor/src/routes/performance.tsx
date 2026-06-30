import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/brain/Layout";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Cpu, FlaskConical, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

import vgg16Confusion from "@/assets/outputs/vgg16_confusion_matrix.png";
import cnnConfusion from "@/assets/outputs/custom_cnn_confusion_matrix.png";
import vgg16Loss from "@/assets/outputs/vgg16_loss.png";
import vgg16Accuracy from "@/assets/outputs/vgg16_accuracy.png";

export const Route = createFileRoute("/performance")({
  head: () => ({ meta: [{ title: "Model Performance — NeuroScan AI" }] }),
  component: PerformancePage,
});

interface ModelSpec {
  name: string;
  status: string;
  active: boolean;
  Icon: typeof Cpu;
  metrics: { label: string; value: string }[];
}

const MODELS: ModelSpec[] = [
  {
    name: "Custom CNN",
    status: "Baseline Model",
    active: false,
    Icon: FlaskConical,
    metrics: [
      { label: "Accuracy", value: "62.75%" },
      { label: "Loss", value: "1.13" },
      { label: "Precision", value: "0.68" },
      { label: "Recall", value: "0.63" },
      { label: "F1 Score", value: "0.62" },
    ],
  },
  {
    name: "VGG16 Transfer Learning",
    status: "Production Model",
    active: true,
    Icon: Cpu,
    metrics: [
      { label: "Accuracy", value: "94.50%" },
      { label: "Loss", value: "0.39" },
      { label: "Precision", value: "0.95" },
      { label: "Recall", value: "0.94" },
      { label: "F1 Score", value: "0.94" },
    ],
  },
];

function ModelCard({ model }: { model: ModelSpec }) {
  return (
    <Card
      className={cn(
        "relative p-6",
        model.active ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20" : "border-border/60",
      )}
    >
      <div className="absolute right-5 top-5">
        {model.active ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Active model
          </span>
        ) : (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Reference
          </span>
        )}
      </div>

      <div className={cn("inline-flex rounded-xl p-3", model.active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>
        <model.Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-xl font-bold">{model.name}</h3>
      <p className={cn("text-sm font-medium", model.active ? "text-primary" : "text-muted-foreground")}>{model.status}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        {model.metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-background/60 p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</dt>
            <dd className="mt-0.5 text-xl font-bold">{m.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function GraphCard({ title, src, alt }: { title: string; src: string; alt: string }) {
  return (
    <Card className="overflow-hidden p-5">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <img src={src} alt={alt} className="w-full" loading="lazy" />
      </div>
    </Card>
  );
}

function PerformancePage() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-5 py-12">
        <PageHeader
          eyebrow="Benchmarks"
          title="Model Performance"
          subtitle="How the production VGG16 model compares to the custom CNN baseline."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {MODELS.map((m) => (
            <ModelCard key={m.name} model={m} />
          ))}
        </div>

        {/* Why VGG16 wins */}
        <Card className="mt-6 border-primary/30 bg-primary/5 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Why VGG16 performs better</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[
                  "Transfer learning: VGG16 starts from weights pretrained on 1.2M ImageNet images, so it already recognizes edges, textures, and shapes that the custom CNN had to learn from scratch on a much smaller MRI set.",
                  "Deeper, well-regularized architecture: 16 weight layers capture richer spatial hierarchies than the shallow baseline, lifting accuracy from 62.75% to 94.50%.",
                  "Lower loss and balanced precision/recall (0.95 / 0.94) mean fewer confident mistakes — critical for medical screening.",
                  "Better generalization: the validation accuracy curve tracks training closely, showing far less overfitting than the baseline.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Training graphs */}
        <h2 className="mt-12 mb-4 text-xl font-bold">Training Diagnostics — VGG16</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <GraphCard title="Training & Validation Loss" src={vgg16Loss} alt="VGG16 training and validation loss curve" />
          <GraphCard title="Validation Accuracy" src={vgg16Accuracy} alt="VGG16 validation accuracy curve" />
        </div>

        <h2 className="mt-10 mb-4 text-xl font-bold">Confusion Matrices</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <GraphCard title="VGG16 (Production)" src={vgg16Confusion} alt="VGG16 confusion matrix" />
          <GraphCard title="Custom CNN (Baseline)" src={cnnConfusion} alt="Custom CNN confusion matrix" />
        </div>
      </div>
    </Layout>
  );
}
