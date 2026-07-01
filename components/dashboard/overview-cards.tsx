import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheetIcon, UsersIcon, GaugeIcon, ShieldAlertIcon, TrendingUpIcon } from "lucide-react"

export function OverviewCards({
  totalAnalyses,
  recentAnalyses,
  totalParticipants,
  avgSilhouetteScore,
  highRiskCount,
}: {
  totalAnalyses: number
  recentAnalyses: number
  totalParticipants: number
  avgSilhouetteScore: number | null
  highRiskCount: number
}) {
  return (
    <div className="grid grid-cols-2 gap-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:gap-4 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader>
          <CardDescription className="text-xs sm:text-sm">Total Analisis</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
            {totalAnalyses}
          </CardTitle>
          {recentAnalyses > 0 && (
            <CardAction>
              <Badge variant="outline">
                <TrendingUpIcon className="size-3.5" />
                +{recentAnalyses} minggu ini
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <FileSpreadsheetIcon className="size-4 shrink-0" />
            <span>Sesi analisis tersimpan</span>
          </div>
        </CardFooter>
      </Card>

      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader>
          <CardDescription className="text-xs sm:text-sm">Total Peserta Dianalisis</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
            {totalParticipants.toLocaleString("id-ID")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <UsersIcon className="size-4 shrink-0" />
            <span>Terhitung dari seluruh riwayat</span>
          </div>
        </CardFooter>
      </Card>

      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader>
          <CardDescription className="text-xs sm:text-sm">Rata-rata Silhouette Score</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
            {avgSilhouetteScore !== null ? avgSilhouetteScore.toFixed(4) : "-"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <GaugeIcon className="size-4 shrink-0" />
            <span>Kualitas cluster analisis selesai</span>
          </div>
        </CardFooter>
      </Card>

      <Card size="sm" className="sm:[--card-spacing:--spacing(4)]">
        <CardHeader>
          <CardDescription className="text-xs sm:text-sm">Terindikasi Tinggi</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums text-destructive sm:text-2xl @[250px]/card:text-3xl">
            {highRiskCount.toLocaleString("id-ID")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlertIcon className="size-4 shrink-0" />
            <span>Perlu verifikasi manual</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
