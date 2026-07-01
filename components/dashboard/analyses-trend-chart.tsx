"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { AnalysisRow } from "@/lib/analysis-types"

const chartConfig: ChartConfig = {
  count: {
    label: "Analisis",
    color: "var(--primary)",
  },
}

function lastSixMonthsBuckets(): { key: string; label: string }[] {
  const buckets: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
    })
  }
  return buckets
}

export function AnalysesTrendChart({ analyses }: { analyses: AnalysisRow[] }) {
  const buckets = lastSixMonthsBuckets()
  const countByKey = new Map<string, number>()

  for (const analysis of analyses) {
    const d = new Date(analysis.created_at)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    countByKey.set(key, (countByKey.get(key) ?? 0) + 1)
  }

  const data = buckets.map((bucket) => ({
    month: bucket.label,
    count: countByKey.get(bucket.key) ?? 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Analisis</CardTitle>
        <CardDescription>Jumlah analisis yang dijalankan per bulan, 6 bulan terakhir.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
