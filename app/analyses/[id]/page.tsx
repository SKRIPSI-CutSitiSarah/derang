import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = "force-dynamic"

const CATEGORY_LABEL: Record<string, string> = {
  tidak_terindikasi: "Tidak Terindikasi",
  terindikasi_rendah: "Terindikasi Rendah",
  terindikasi_tinggi: "Terindikasi Tinggi",
}

const CATEGORY_BADGE_CLASS: Record<string, string> = {
  tidak_terindikasi: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
  terindikasi_rendah: "bg-amber-500/15 text-amber-700 border-amber-500/20",
  terindikasi_tinggi: "bg-destructive/15 text-destructive border-destructive/20",
}

export default async function AnalysisResultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: analysis } = await supabase.from("analyses").select("*").eq("id", id).single()

  if (!analysis) {
    notFound()
  }

  const { data: participants } = await supabase
    .from("participants")
    .select("*")
    .eq("analysis_id", id)
    .order("max_similarity", { ascending: false })

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {analysis.title || analysis.source_filename || "Hasil Analisis"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Mode: <span className="capitalize">{analysis.exam_type}</span> · Hasil ini adalah{" "}
            <strong>indikasi awal</strong>, perlu verifikasi manual.
          </p>
        </div>
        {analysis.status === "done" && (
          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/20">Selesai</Badge>
        )}
        {analysis.status === "processing" && (
          <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/20 animate-pulse">
            Memproses
          </Badge>
        )}
        {analysis.status === "failed" && (
          <Badge className="bg-destructive/15 text-destructive border-destructive/20">Gagal</Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Peserta</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{analysis.participant_count ?? "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Soal</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{analysis.question_count ?? "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Silhouette Score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold font-mono">
            {analysis.silhouette_score !== null ? Number(analysis.silhouette_score).toFixed(4) : "-"}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Peserta</CardTitle>
          <CardDescription>
            Dashboard, pie chart, dan tabel per kategori akan dilengkapi pada milestone berikutnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!participants || participants.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Belum ada data peserta.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Skor</TableHead>
                  <TableHead>Kemiripan Tertinggi</TableHead>
                  <TableHead>Kategori</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.participant_code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.class}</TableCell>
                    <TableCell>{p.score}</TableCell>
                    <TableCell className="font-mono">
                      {p.max_similarity !== null ? Number(p.max_similarity).toFixed(2) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={CATEGORY_BADGE_CLASS[p.category] ?? ""}>
                        {CATEGORY_LABEL[p.category] ?? p.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
