import { jsPDF } from "jspdf";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Printer, FileDown, Stethoscope, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import {
  normalizeClass,
  confidenceTier,
  CLASS_META,
  TIER_STYLES,
  type PredictResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  result: PredictResponse;
  previewUrl: string | null;
  fileName: string;
  predictedAt: Date;
}

export function ResultCard({ result, previewUrl, fileName, predictedAt }: ResultCardProps) {
  const cls = normalizeClass(result.prediction);
  const meta = CLASS_META[cls];
  const tier = confidenceTier(result.confidence);
  const tierStyle = TIER_STYLES[tier];
  const timeStr = predictedAt.toLocaleString();

  const summary = [
    `Brain MRI Analysis — NeuroScan AI`,
    `Scan: ${fileName}`,
    `Prediction: ${cls}`,
    `Confidence: ${result.confidence.toFixed(2)}%`,
    `Model: VGG16 Transfer Learning`,
    `Time: ${timeStr}`,
    ``,
    `Explanation: ${meta.explanation}`,
    `Recommendation: ${meta.recommendation}`,
  ].join("\n");

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Result copied to clipboard");
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access");
    }
  };

  // Rasterize the (same-origin blob) MRI preview to a PNG data URL for embedding in the PDF.
  const loadImage = (url: string): Promise<{ dataUrl: string; w: number; h: number } | null> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          resolve({ dataUrl: canvas.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight });
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const downloadPdf = async () => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 48;
      let y = margin + 4;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(16);
      doc.text("NeuroScan AI", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(11);
      doc.text("Brain Tumor Detection Report", margin + 110, y);
      y += 12;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageW - margin, y);
      y += 30;

      // Prediction + confidence
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(22);
      doc.text(cls, margin, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(11);
      doc.text(`Confidence ${result.confidence.toFixed(2)}%  ·  ${tierStyle.label}`, margin, y);
      y += 22;

      // MRI image
      const img = previewUrl ? await loadImage(previewUrl) : null;
      if (img) {
        const w = 190;
        const h = Math.min(190, (img.h / img.w) * w);
        doc.addImage(img.dataUrl, "PNG", margin, y, w, h);
        y += h + 22;
      }

      // Metadata rows
      const rows: [string, string][] = [
        ["Scan file", fileName],
        ["Model", "VGG16 Transfer Learning"],
        ["Analyzed at", timeStr],
      ];
      doc.setFontSize(11);
      rows.forEach(([k, v]) => {
        doc.setTextColor(107, 114, 128);
        doc.setFont("helvetica", "normal");
        doc.text(k, margin, y);
        doc.setTextColor(17, 24, 39);
        doc.setFont("helvetica", "bold");
        doc.text(String(v), pageW - margin, y, { align: "right" });
        y += 9;
        doc.setDrawColor(232, 232, 232);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageW - margin, y);
        y += 18;
      });
      y += 8;

      const section = (title: string, body: string) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(37, 99, 235);
        doc.setFontSize(11);
        doc.text(title.toUpperCase(), margin, y);
        y += 16;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        const lines = doc.splitTextToSize(body, pageW - margin * 2) as string[];
        doc.text(lines, margin, y);
        y += lines.length * 15 + 18;
      };
      section("AI Explanation", meta.explanation);
      section("Recommendation", meta.recommendation);

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(
        "For research and educational use only. Not a substitute for professional radiological diagnosis.",
        margin,
        pageH - 36,
      );

      const pad = (n: number) => String(n).padStart(2, "0");
      const stamp = `${predictedAt.getFullYear()}${pad(predictedAt.getMonth() + 1)}${pad(
        predictedAt.getDate(),
      )}_${pad(predictedAt.getHours())}${pad(predictedAt.getMinutes())}${pad(predictedAt.getSeconds())}`;
      const safeClass = cls.replace(/\s+/g, "_");
      doc.save(`Brain_Tumor_Report_${safeClass}_${stamp}.pdf`);
      toast.success("Report downloaded");
    } catch {
      toast.error("Couldn't generate the PDF report");
    }
  };

  const printReport = () => {
    const w = window.open("", "_blank", "width=820,height=900");
    if (!w) {
      toast.error("Pop-up blocked — allow pop-ups to print the report");
      return;
    }
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>NeuroScan Report — ${fileName}</title>
      <style>
        *{box-sizing:border-box;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
        body{margin:0;padding:40px;color:#111827}
        .h{display:flex;align-items:center;gap:10px;border-bottom:2px solid #2563eb;padding-bottom:14px}
        .badge{color:#2563eb;font-weight:700;letter-spacing:.04em}
        h1{font-size:20px;margin:18px 0 2px} .muted{color:#6b7280;font-size:13px}
        .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
        .k{color:#6b7280} .v{font-weight:600}
        img{max-width:320px;border-radius:12px;margin:16px 0;border:1px solid #eee}
        .sec{margin-top:18px} .sec h3{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#2563eb;margin:0 0 4px}
        .sec p{margin:0;font-size:14px;line-height:1.55}
        .foot{margin-top:30px;font-size:11px;color:#9ca3af;border-top:1px solid #eee;padding-top:12px}
      </style></head><body>
      <div class="h"><span class="badge">◑ NeuroScan AI</span><span class="muted">Brain Tumor Detection Report</span></div>
      <h1>${cls}</h1>
      <div class="muted">Confidence ${result.confidence.toFixed(2)}% · ${tierStyle.label}</div>
      ${previewUrl ? `<img src="${previewUrl}" alt="MRI scan"/>` : ""}
      <div class="row"><span class="k">Scan file</span><span class="v">${fileName}</span></div>
      <div class="row"><span class="k">Model</span><span class="v">VGG16 Transfer Learning</span></div>
      <div class="row"><span class="k">Analyzed at</span><span class="v">${timeStr}</span></div>
      <div class="sec"><h3>AI Explanation</h3><p>${meta.explanation}</p></div>
      <div class="sec"><h3>Recommendation</h3><p>${meta.recommendation}</p></div>
      <div class="foot">For research and educational use only. Not a substitute for professional radiological diagnosis.</div>
      </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-[var(--shadow-card)]">
      {/* Completion banner */}
      <div className={cn("flex items-center gap-3 px-6 py-4", tierStyle.bg)}>
        <CheckCircle2 className={cn("h-6 w-6 animate-pop", tierStyle.text)} />
        <div>
          <p className="text-sm font-semibold">Analysis completed</p>
          <p className="text-xs text-muted-foreground">{timeStr}</p>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
        {previewUrl && (
          <div className="space-y-2">
            <div className="overflow-hidden rounded-xl border border-border bg-secondary/40">
              <img src={previewUrl} alt="Analyzed MRI scan" className="aspect-square w-full object-cover" />
            </div>
            <p className="truncate text-center text-xs text-muted-foreground">{fileName}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prediction</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: meta.hex }} />
              <h3 className={cn("text-2xl font-bold", meta.color)}>{cls}</h3>
            </div>
          </div>

          {/* Confidence bar with tiered color */}
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <span className={cn("text-sm font-bold", tierStyle.text)}>{result.confidence.toFixed(2)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-[width] duration-700 ease-out", tierStyle.bar)}
                style={{ width: `${Math.min(100, Math.max(0, result.confidence))}%` }}
              />
            </div>
            <p className={cn("mt-1 text-xs font-medium", tierStyle.text)}>{tierStyle.label}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-primary" /> AI Explanation
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{meta.explanation}</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Stethoscope className="h-4 w-4 text-primary" /> Recommendation
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{meta.recommendation}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={downloadPdf} variant="outline" size="sm" className="gap-2">
              <FileDown className="h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={copyResult} variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" /> Copy
            </Button>
            <Button onClick={printReport} variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
