"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteAnalysisButton } from "@/components/analysis/delete-analysis-button"
import { SearchIcon, FileSpreadsheetIcon } from "lucide-react"
import type { AnalysisRow } from "@/lib/analysis-types"

const STATUS_BADGE: Record<AnalysisRow["status"], { label: string; className: string }> = {
  done: { label: "Selesai", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20" },
  processing: {
    label: "Memproses",
    className: "bg-blue-500/15 text-blue-700 border-blue-500/20 animate-pulse",
  },
  failed: { label: "Gagal", className: "bg-destructive/15 text-destructive border-destructive/20" },
}

export function AnalysesTable({ analyses }: { analyses: AnalysisRow[] }) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [examTypeFilter, setExamTypeFilter] = React.useState<string>("all")

  const filtered = analyses.filter((analysis) => {
    if (statusFilter !== "all" && analysis.status !== statusFilter) return false
    if (examTypeFilter !== "all" && analysis.exam_type !== examTypeFilter) return false
    if (search.trim()) {
      const haystack = `${analysis.title ?? ""} ${analysis.source_filename ?? ""}`.toLowerCase()
      if (!haystack.includes(search.trim().toLowerCase())) return false
    }
    return true
  })

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileSpreadsheetIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">Belum ada analisis</h3>
        <p className="text-muted-foreground text-sm max-w-sm mt-1">
          Anda belum pernah menjalankan analisis kecurangan. Klik &quot;Analisis Baru&quot; untuk memulai.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/analyses/new">Unggah Dataset</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama analisis atau file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="done">Selesai</SelectItem>
            <SelectItem value="processing">Memproses</SelectItem>
            <SelectItem value="failed">Gagal</SelectItem>
          </SelectContent>
        </Select>
        <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Mode Ujian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mode</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Tidak ada analisis yang cocok dengan filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Nama Analisis / File</TableHead>
                <TableHead>Tipe Ujian</TableHead>
                <TableHead>Jumlah Peserta</TableHead>
                <TableHead>Silhouette Score</TableHead>
                <TableHead>Tanggal Pembuatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((analysis, index) => (
                <TableRow
                  key={analysis.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/analyses/${analysis.id}`)}
                >
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <span className="text-foreground">{analysis.title || "Tanpa Judul"}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {analysis.source_filename}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">
                    <Badge variant="outline">{analysis.exam_type}</Badge>
                  </TableCell>
                  <TableCell>{analysis.participant_count ?? "-"}</TableCell>
                  <TableCell className="font-mono">
                    {analysis.silhouette_score !== null ? Number(analysis.silhouette_score).toFixed(4) : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(analysis.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_BADGE[analysis.status].className}>
                      {STATUS_BADGE[analysis.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <DeleteAnalysisButton
                        analysisId={analysis.id}
                        label={analysis.title || analysis.source_filename || "Analisis"}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
