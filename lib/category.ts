import type { AnalyzeParticipant } from "./ml-client"

export type Category = AnalyzeParticipant["category"]

export const CATEGORIES: Category[] = [
  "tidak_terindikasi",
  "terindikasi_rendah",
  "terindikasi_tinggi",
]

export const CATEGORY_LABEL: Record<Category, string> = {
  tidak_terindikasi: "Tidak Terindikasi",
  terindikasi_rendah: "Terindikasi Rendah",
  terindikasi_tinggi: "Terindikasi Tinggi",
}

// Konsisten dengan §12 PRD: hijau/kuning/merah.
export const CATEGORY_BADGE_CLASS: Record<Category, string> = {
  tidak_terindikasi: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
  terindikasi_rendah: "bg-amber-500/15 text-amber-700 border-amber-500/20",
  terindikasi_tinggi: "bg-destructive/15 text-destructive border-destructive/20",
}

// Recharts <Cell fill> needs a concrete color, not a Tailwind class.
export const CATEGORY_CHART_COLOR: Record<Category, string> = {
  tidak_terindikasi: "#10b981", // emerald-500
  terindikasi_rendah: "#f59e0b", // amber-500
  terindikasi_tinggi: "#ef4444", // red-500
}
