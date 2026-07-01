import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Total Peserta</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-bold sm:text-2xl">{participantCount ?? "-"}</CardContent>
      </Card>
      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Jumlah Soal</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-bold sm:text-2xl">{questionCount ?? "-"}</CardContent>
      </Card>
      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Silhouette Score</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-bold font-mono sm:text-2xl">
          {silhouetteScore !== null ? silhouetteScore.toFixed(4) : "-"}
        </CardContent>
      </Card>
      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Sebaran Kategori</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1.5">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center justify-between gap-2">
              <Badge className={cn(CATEGORY_BADGE_CLASS[category], "text-[10px] sm:text-xs")}>
                {CATEGORY_LABEL[category]}
              </Badge>
              <span className="font-mono text-sm font-semibold">{categoryCounts[category]}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
