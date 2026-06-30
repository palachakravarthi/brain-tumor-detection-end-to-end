import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/brain/Layout";
import { Card } from "@/components/ui/card";
import { Brain, Database, Layers, Upload, Cog, Sparkles, ClipboardCheck, Save } from "lucide-react";
import { CLASSES, CLASS_META } from "@/lib/api";
import sampleImages from "@/assets/outputs/sample_mri_images.png";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — NeuroScan AI" }] }),
  component: AboutPage,
});

const STACK = ["TensorFlow", "FastAPI", "React", "Supabase", "TailwindCSS", "Transfer Learning"];

const WORKFLOW = [
  { Icon: Upload, title: "Upload", body: "A radiologist drops an MRI scan (JPG/PNG) into the browser." },
  { Icon: Cog, title: "Preprocessing", body: "The image is resized to 224×224 and normalized to match training." },
  { Icon: Sparkles, title: "Prediction", body: "VGG16 extracts features and outputs class probabilities." },
  { Icon: ClipboardCheck, title: "Result", body: "The top class and confidence are shown with clinical context." },
  { Icon: Save, title: "Save to Database", body: "The prediction is recorded in Supabase for history and analytics." },
];

function AboutPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <PageHeader
          eyebrow="About"
          title="Project Overview"
          subtitle="An end-to-end deep-learning system that screens brain MRI scans for tumors and assists clinical triage."
        />

        {/* Overview + sample */}
        <Card className="overflow-hidden border-border/60 p-0 shadow-[var(--shadow-card)]">
          <div className="grid md:grid-cols-2">
            <div className="space-y-4 p-8">
              <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Brain className="h-7 w-7" />
              </div>
              <p className="text-base leading-relaxed">
                NeuroScan AI classifies brain MRI scans into four diagnostic categories using a
                <strong> VGG16 transfer-learning</strong> model. It's built as a first-pass screening tool to
                help radiologists prioritize cases — not to replace expert diagnosis.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The model was trained on a curated MRI dataset, evaluated on a held-out test split, and deployed
                behind a FastAPI service with results persisted to Supabase.
              </p>
            </div>
            <div className="bg-secondary/40 p-6">
              <img src={sampleImages} alt="Sample MRI scans from the dataset" className="w-full rounded-xl border border-border" loading="lazy" />
              <p className="mt-2 text-center text-xs text-muted-foreground">Sample scans from the training dataset</p>
            </div>
          </div>
        </Card>

        {/* Dataset + classes */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Database className="h-4 w-4 text-primary" /> DATASET
            </div>
            <p className="mt-3 text-4xl font-bold">7,200<span className="ml-2 text-base font-medium text-muted-foreground">MRI images</span></p>
            <p className="mt-1 text-sm text-muted-foreground">Balanced across four classes, split into training and test sets.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {CLASSES.map((c) => (
                <div key={c} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CLASS_META[c].hex }} /> {c}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Layers className="h-4 w-4 text-primary" /> TECHNOLOGY STACK
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {STACK.map((t) => (
                <span key={t} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A Python/TensorFlow training pipeline, a FastAPI inference server, a Supabase Postgres database, and a
              React + TailwindCSS dashboard.
            </p>
          </Card>
        </div>

        {/* Workflow */}
        <h2 className="mt-12 mb-5 text-xl font-bold">How a scan flows through the system</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WORKFLOW.map((s, i) => (
            <Card key={s.title} className="relative p-5">
              <span className="absolute right-4 top-4 text-2xl font-bold text-border">{i + 1}</span>
              <div className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary">
                <s.Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
