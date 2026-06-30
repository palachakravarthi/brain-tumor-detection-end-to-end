// API client + domain metadata for the Brain Tumor Detection dashboard.
// All requests go to the existing FastAPI backend — no endpoint shapes are invented
// beyond what app/routes.py serves: /predict, /history, /stats.
import { BACKEND_URL } from "./config";

export type CanonicalClass = "Glioma" | "Meningioma" | "Pituitary" | "No Tumor";

export interface PredictResponse {
  prediction: string;
  confidence: number;
}

export interface HistoryItem {
  id: string;
  image_name: string;
  prediction: string;
  confidence: number;
  created_at: string;
}

export interface Stats {
  total: number;
  counts: Record<string, number>;
  average_confidence: number;
}

export const CLASSES: CanonicalClass[] = ["Glioma", "Meningioma", "Pituitary", "No Tumor"];

// The model emits labels like "Glioma Tumor" / "No Tumor" — fold them to a canonical class.
export function normalizeClass(raw: string | undefined | null): CanonicalClass {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("glioma")) return "Glioma";
  if (v.includes("meningioma")) return "Meningioma";
  if (v.includes("pituitary")) return "Pituitary";
  return "No Tumor";
}

interface ClassMeta {
  label: CanonicalClass;
  // Tailwind tokens reused from the existing design system (see InfoCards.tsx).
  color: string; // text-*
  bg: string; // bg-*/10
  ring: string; // border-*
  hex: string; // for charts (recharts needs a concrete color)
  explanation: string;
  recommendation: string;
}

export const CLASS_META: Record<CanonicalClass, ClassMeta> = {
  Glioma: {
    label: "Glioma",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    ring: "border-chart-1/30",
    hex: "oklch(0.58 0.18 250)",
    explanation:
      "The scan shows features consistent with a glioma — a tumor arising from the brain's glial cells. These can be infiltrative and vary widely in grade.",
    recommendation:
      "Refer to a neuro-oncologist for grading and a contrast-enhanced MRI. AI screening is a first pass, not a diagnosis.",
  },
  Meningioma: {
    label: "Meningioma",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    ring: "border-chart-2/30",
    hex: "oklch(0.72 0.16 240)",
    explanation:
      "The scan shows features consistent with a meningioma — a typically slow-growing tumor on the membranes covering the brain. Most are benign.",
    recommendation:
      "Confirm with a radiologist. Small, asymptomatic meningiomas are often monitored; growth or symptoms may warrant treatment.",
  },
  Pituitary: {
    label: "Pituitary",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
    ring: "border-chart-5/30",
    hex: "oklch(0.65 0.2 320)",
    explanation:
      "The scan shows features consistent with a pituitary tumor near the base of the brain. These can affect hormone levels and, when larger, vision.",
    recommendation:
      "Refer to endocrinology and neurosurgery for hormone panels and a dedicated sellar MRI.",
  },
  "No Tumor": {
    label: "No Tumor",
    color: "text-success",
    bg: "bg-success/10",
    ring: "border-success/30",
    hex: "oklch(0.68 0.17 155)",
    explanation:
      "No tumor signature was detected in this scan. The model found no regions matching its learned tumor patterns.",
    recommendation:
      "Reassuring, but not a substitute for radiologist review. Follow up if symptoms persist.",
  },
};

export type ConfidenceTier = "high" | "medium" | "low";

export function confidenceTier(confidence: number): ConfidenceTier {
  if (confidence > 95) return "high";
  if (confidence >= 70) return "medium";
  return "low";
}

// Green >95%, Yellow 70–95%, Red <70% (per spec).
export const TIER_STYLES: Record<ConfidenceTier, { text: string; bg: string; bar: string; label: string }> = {
  high: { text: "text-success", bg: "bg-success/10", bar: "bg-success", label: "High confidence" },
  medium: { text: "text-amber-500", bg: "bg-amber-500/10", bar: "bg-amber-500", label: "Moderate confidence" },
  low: { text: "text-destructive", bg: "bg-destructive/10", bar: "bg-destructive", label: "Low confidence" },
};

async function jsonOrThrow(res: Response) {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function predict(file: File): Promise<PredictResponse> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BACKEND_URL}/predict`, { method: "POST", body: fd });
  return jsonOrThrow(res);
}

export async function getHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${BACKEND_URL}/history`);
  return jsonOrThrow(res);
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${BACKEND_URL}/stats`);
  return jsonOrThrow(res);
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/history/${id}`, { method: "DELETE" });
  await jsonOrThrow(res);
}

export async function clearHistory(): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/history`, { method: "DELETE" });
  await jsonOrThrow(res);
}
