import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlertIcon } from "lucide-react"
import { SummaryCards } from "@/components/analysis/summary-cards"
import { CategoryPieChart } from "@/components/analysis/category-pie-chart"
import { ParticipantsByCategory } from "@/components/analysis/participants-by-category"
import { SuspiciousPairsTable } from "@/components/analysis/suspicious-pairs-table"
import { ExportCsvButton } from "@/components/analysis/export-csv-button"
import { CATEGORIES, type Category } from "@/lib/category"
import type { ParticipantRow, SimilarityPairRow } from "@/lib/analysis-types"
import type { ExamType } from "@/lib/ml-client"

export const dynamic = "force-dynamic"

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

  const [{ data: participantsData }, { data: pairsData }] = await Promise.all([
    supabase.from("participants").select("*").eq("analysis_id", id),
    supabase.from("similarity_pairs").select("*").eq("analysis_id", id),
  ])

  const participants = (participantsData ?? []) as ParticipantRow[]
  const pairs = (pairsData ?? []) as SimilarityPairRow[]

  const categoryCounts = CATEGORIES.reduce((acc, category) => {
    acc[category] = participants.filter((p) => p.category === category).length
    return acc
  }, {} as Record<Category, number>)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {analysis.title || analysis.source_filename || "Hasil Analisis"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Mode: <span className="capitalize">{analysis.exam_type}</span>
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
        <ExportCsvButton
          participants={participants}
          examType={analysis.exam_type as ExamType}
          filename={`${analysis.title || analysis.source_filename || "analisis"}-hasil.csv`}
        />
      </div>

      <Alert>
        <ShieldAlertIcon />
        <AlertTitle>Hasil ini adalah indikasi awal</AlertTitle>
        <AlertDescription>
          Bukan keputusan final. Keputusan akhir tetap memerlukan pemeriksaan/verifikasi manual oleh pihak
          berwenang.
        </AlertDescription>
      </Alert>

      <SummaryCards
        participantCount={analysis.participant_count}
        questionCount={analysis.question_count}
        silhouetteScore={analysis.silhouette_score}
        categoryCounts={categoryCounts}
      />

      <CategoryPieChart categoryCounts={categoryCounts} />

      <Card>
        <CardHeader>
          <CardTitle>Detail Peserta per Kategori</CardTitle>
          <CardDescription>Daftar peserta beserta skor, kemiripan, dan durasi/posisi.</CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipantsByCategory participants={participants} examType={analysis.exam_type as ExamType} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pasangan Peserta Mencurigakan</CardTitle>
          <CardDescription>
            Pasangan dengan kemiripan jawaban tinggi, disertai catatan pendukung.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuspiciousPairsTable pairs={pairs} participants={participants} />
        </CardContent>
      </Card>
    </div>
  )
}
