"use client"

import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { CATEGORY_LABEL } from "@/lib/category"
import type { ParticipantRow } from "@/lib/analysis-types"
import type { ExamType } from "@/lib/ml-client"

export function ExportCsvButton({
  participants,
  examType,
  filename,
}: {
  participants: ParticipantRow[]
  examType: ExamType
  filename: string
}) {
  const handleExport = () => {
    const rows = participants.map((p) => ({
      "Kode Peserta": p.participant_code ?? "",
      Nama: p.name ?? "",
      Kelas: p.class ?? "",
      Kategori: CATEGORY_LABEL[p.category] ?? p.category,
      Skor: p.score ?? "",
      "Jumlah Benar": p.correct_count ?? "",
      "Kemiripan Tertinggi": p.max_similarity ?? "",
      [examType === "online" ? "Durasi (detik)" : "Posisi Duduk"]:
        examType === "online" ? p.duration_seconds ?? "" : p.seat_position ?? "",
    }))

    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={participants.length === 0}>
      <DownloadIcon className="h-4 w-4" />
      Unduh CSV
    </Button>
  )
}
