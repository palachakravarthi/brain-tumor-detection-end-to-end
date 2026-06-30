import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/brain/Layout";
import { ModelSelector } from "@/components/brain/ModelSelector";
import { UploadPanel } from "@/components/brain/UploadPanel";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload MRI — NeuroScan AI" }] }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-5 py-12">
        <PageHeader
          eyebrow="Analyze"
          title="Upload an MRI scan"
          subtitle="Drag & drop a brain MRI image. The active model classifies it into one of four categories."
        />

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active AI Model</h2>
          <ModelSelector />
        </div>

        <UploadPanel />
      </div>
    </Layout>
  );
}
