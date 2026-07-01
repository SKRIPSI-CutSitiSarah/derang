import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { AnalysesTrendChart } from "@/components/dashboard/analyses-trend-chart"
import { AnalysesTable } from "@/components/dashboard/analyses-table"
import { CategoryPieChart } from "@/components/analysis/category-pie-chart"
import { CATEGORIES, type Category } from "@/lib/category"
import type { AnalysisRow } from "@/lib/analysis-types"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: analysesData } = await supabase
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false })

  const analyses = (analysesData ?? []) as AnalysisRow[]
  const analysisIds = analyses.map((a) => a.id)

  const categoryCounts = CATEGORIES.reduce((acc, category) => {
    acc[category] = 0
    return acc
  }, {} as Record<Category, number>)

  if (analysisIds.length > 0) {
    const { data: participantCategories } = await supabase
      .from("participants")
      .select("category")
      .in("analysis_id", analysisIds)

    for (const row of participantCategories ?? []) {
      const category = row.category as Category
      if (category in categoryCounts) {
        categoryCounts[category] += 1
      }
    }
  }

  const totalAnalyses = analyses.length
  const totalParticipants = analyses.reduce((sum, a) => sum + (a.participant_count ?? 0), 0)
  const doneScores = analyses
    .filter((a) => a.status === "done" && a.silhouette_score !== null)
    .map((a) => Number(a.silhouette_score))
  const avgSilhouetteScore = doneScores.length > 0 ? doneScores.reduce((s, v) => s + v, 0) / doneScores.length : null

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentAnalyses = analyses.filter((a) => new Date(a.created_at) >= sevenDaysAgo).length

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            DERANG Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang, admin. Deteksi kecurangan ujian dengan algoritma K-Means Clustering.
          </p>
        </div>
        <Button asChild className="shadow-md hover:shadow-lg transition-all duration-300">
          <Link href="/analyses/new" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Analisis Baru
          </Link>
        </Button>
      </div>

      <OverviewCards
        totalAnalyses={totalAnalyses}
        recentAnalyses={recentAnalyses}
        totalParticipants={totalParticipants}
        avgSilhouetteScore={avgSilhouetteScore}
        highRiskCount={categoryCounts.terindikasi_tinggi}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalysesTrendChart analyses={analyses} />
        </div>
        <CategoryPieChart categoryCounts={categoryCounts} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Analisis</CardTitle>
          <CardDescription>Daftar semua analisis kecurangan ujian yang telah dijalankan.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalysesTable analyses={analyses} />
        </CardContent>
      </Card>
    </div>
  )
}
