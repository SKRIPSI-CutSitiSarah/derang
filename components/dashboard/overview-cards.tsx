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
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader>
          <CardDescription>Total Analisis</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <FileSpreadsheetIcon className="size-4" /> Sesi analisis tersimpan
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total Peserta Dianalisis</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalParticipants.toLocaleString("id-ID")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <UsersIcon className="size-4" /> Terhitung dari seluruh riwayat
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Rata-rata Silhouette Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {avgSilhouetteScore !== null ? avgSilhouetteScore.toFixed(4) : "-"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <GaugeIcon className="size-4" /> Kualitas cluster analisis selesai
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Terindikasi Tinggi</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-destructive @[250px]/card:text-3xl">
            {highRiskCount.toLocaleString("id-ID")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlertIcon className="size-4" /> Perlu verifikasi manual
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
