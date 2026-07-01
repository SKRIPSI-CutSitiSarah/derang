import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalysesTable } from "@/components/dashboard/analyses-table"
import type { AnalysisRow } from "@/lib/analysis-types"

export const dynamic = "force-dynamic"

export default async function RiwayatPage() {
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

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="border-b pb-6">
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Analisis</h1>
        <p className="text-muted-foreground mt-1">
          Daftar semua analisis kecurangan ujian yang telah dijalankan. Buka kembali hasilnya tanpa proses ulang.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Analisis</CardTitle>
          <CardDescription>Cari, filter, buka, atau hapus riwayat analisis.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalysesTable analyses={analyses} />
        </CardContent>
      </Card>
    </div>
  )
}
