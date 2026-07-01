"use client"

import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CATEGORIES, CATEGORY_CHART_COLOR, CATEGORY_LABEL, type Category } from "@/lib/category"

const chartConfig: ChartConfig = {
  tidak_terindikasi: { label: CATEGORY_LABEL.tidak_terindikasi, color: CATEGORY_CHART_COLOR.tidak_terindikasi },
  terindikasi_rendah: { label: CATEGORY_LABEL.terindikasi_rendah, color: CATEGORY_CHART_COLOR.terindikasi_rendah },
  terindikasi_tinggi: { label: CATEGORY_LABEL.terindikasi_tinggi, color: CATEGORY_CHART_COLOR.terindikasi_tinggi },
}

export function CategoryPieChart({
  categoryCounts,
}: {
  categoryCounts: Record<Category, number>
}) {
  const data = CATEGORIES.map((category) => ({
    category,
    label: CATEGORY_LABEL[category],
    count: categoryCounts[category],
    fill: CATEGORY_CHART_COLOR[category],
  }))

  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sebaran Kategori Indikasi</CardTitle>
        <CardDescription>Distribusi {total} peserta ke dalam 3 kategori hasil clustering.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="category"
                  formatter={(value, _name, item) => (
                    <span>
                      {item.payload.label}: {String(value)} peserta (
                      {total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)
                    </span>
                  )}
                />
              }
            />
            <Pie data={data} dataKey="count" nameKey="category" innerRadius={60}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="category" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
