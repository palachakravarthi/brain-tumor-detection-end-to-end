import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, Loader2, X, Zap, FileImage, Clock, HardDrive } from "lucide-react";
import { toast } from "sonner";
import { predict, type PredictResponse } from "@/lib/api";
import { ResultCard } from "./ResultCard";
import { cn } from "@/lib/utils";

export interface UploadPanelHandle {
  openFilePicker: () => void;
  triggerPredict: () => void;
}

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const UploadPanel = forwardRef<UploadPanelHandle>((_, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedAt, setUploadedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [predictedAt, setPredictedAt] = useState<Date | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => fileInputRef.current?.click(),
    triggerPredict: () => {
      if (!file) {
        fileInputRef.current?.click();
        return;
      }
      void handlePredict();
    },
  }));

  const handleFile = (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Unsupported file. Upload a JPG, JPEG, or PNG.");
      return;
    }
    setFile(f);
    setResult(null);
    setUploadedAt(new Date());
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await predict(file);
      setResult(data);
      setPredictedAt(new Date());
      // Refresh history/stats so the new prediction shows up elsewhere.
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Analysis complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setResult(null);
    setUploadedAt(null);
    setPredictedAt(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 p-6 shadow-[var(--shadow-card)]">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !previewUrl && fileInputRef.current?.click()}
          className={cn(
            "relative flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-secondary/40 hover:border-primary/50",
            !previewUrl && "cursor-pointer",
          )}
        >
          {previewUrl ? (
            <div className="scanline relative overflow-hidden rounded-xl">
              <img
                src={previewUrl}
                alt="MRI scan preview"
                className="mx-auto max-h-72 rounded-xl object-contain"
              />
            </div>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4 text-primary ring-1 ring-primary/20">
                <Upload className="h-8 w-8" />
              </div>
              <p className="mt-4 text-base font-semibold">Drop an MRI scan here</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse your files</p>
              <div className="mt-4 flex gap-1.5">
                {["JPG", "PNG", "JPEG"].map((t) => (
                  <span key={t} className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        {file && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
              <FileImage className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">File</p>
                <p className="truncate text-sm font-medium">{file.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
              <HardDrive className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Size</p>
                <p className="text-sm font-medium">{formatBytes(file.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Uploaded</p>
                <p className="text-sm font-medium">{uploadedAt?.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Browse
          </Button>
          <Button onClick={handlePredict} disabled={!file || loading} size="lg" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {loading ? "Analyzing…" : "Analyze Scan"}
          </Button>
          {file && (
            <Button onClick={clear} variant="ghost" className="gap-2">
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </Card>

      {loading && (
        <Card className="flex flex-col items-center justify-center gap-4 border-border/60 p-12 text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <div>
            <p className="font-semibold">Running VGG16 inference</p>
            <p className="text-sm text-muted-foreground">Extracting features and classifying the scan…</p>
          </div>
        </Card>
      )}

      {!loading && result && predictedAt && (
        <div className="animate-scale-in">
          <ResultCard
            result={result}
            previewUrl={previewUrl}
            fileName={file?.name ?? "scan"}
            predictedAt={predictedAt}
          />
        </div>
      )}
    </div>
  );
});

UploadPanel.displayName = "UploadPanel";
