import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORIES, CATEGORY_BADGE_CLASS, CATEGORY_LABEL, type Category } from "@/lib/category"

export function SummaryCards({
  participantCount,
  questionCount,
  silhouetteScore,
  categoryCounts,
}: {
  participantCount: number | null
  questionCount: number | null
  silhouetteScore: number | null
  categoryCounts: Record<Category, number>
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Peserta</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{participantCount ?? "-"}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Soal</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{questionCount ?? "-"}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Silhouette Score</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold font-mono">
          {silhouetteScore !== null ? silhouetteScore.toFixed(4) : "-"}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Sebaran Kategori</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1.5">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center justify-between gap-2">
              <Badge className={CATEGORY_BADGE_CLASS[category]}>{CATEGORY_LABEL[category]}</Badge>
              <span className="font-mono text-sm font-semibold">{categoryCounts[category]}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
