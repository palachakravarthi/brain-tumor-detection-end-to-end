import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/brain/Layout";
import { Upload, History, ShieldCheck, Zap, Activity, ArrowRight } from "lucide-react";
import brainHero from "@/assets/brain-hero.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const HIGHLIGHTS = [
  { Icon: Zap, title: "Seconds, not days", body: "Upload a scan and get a classification with a calibrated confidence score immediately." },
  { Icon: ShieldCheck, title: "94.5% accuracy", body: "Powered by a VGG16 transfer-learning model validated on a held-out MRI test set." },
  { Icon: Activity, title: "Four classes", body: "Distinguishes Glioma, Meningioma, and Pituitary tumors from healthy scans." },
];

const CLASS_STRIP = ["Glioma", "Meningioma", "Pituitary", "No Tumor"];

function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-in space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> AI · Medical Imaging
            </span>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Brain Tumor Detection using{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                Artificial Intelligence
              </span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Upload an MRI brain scan and let our trained AI model classify the image into one of four
              categories — with confidence scoring and clinical context.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="gap-2">
                <Link to="/upload">
                  <Upload className="h-4 w-4" /> Upload MRI
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/history">
                  <History className="h-4 w-4" /> View Prediction History
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {CLASS_STRIP.map((c) => (
                <span key={c} className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
            <div className="scanline relative overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
              <img src={brainHero} alt="Brain MRI scan with AI overlay" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {HIGHLIGHTS.map(({ Icon, title, body }) => (
            <Card key={title} className="glass p-6 shadow-[var(--shadow-soft)]">
              <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-12 flex flex-col items-center justify-between gap-4 border-primary/30 bg-primary/5 p-8 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-xl font-bold">Ready to analyze a scan?</h3>
            <p className="mt-1 text-muted-foreground">Drag in an MRI image and get an instant classification.</p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link to="/upload">
              Start now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </Layout>
  );
}
