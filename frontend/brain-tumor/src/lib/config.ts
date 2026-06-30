// Backend configuration — change BACKEND_URL to point to a different API host.
export const BACKEND_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_BACKEND_URL) ||
  "http://127.0.0.1:8000";

export const PREDICT_ENDPOINT = `${BACKEND_URL}/predict`;
