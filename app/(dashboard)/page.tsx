import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, FileSpreadsheetIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch analyses for the authenticated user
  const { data: analyses } = await supabase
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header section with modern greeting */}
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

      {/* Main Stats / Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/45 bg-card/60 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Analisis</CardTitle>
            <FileSpreadsheetIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyses?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Sesi analisis yang tersimpan</p>
          </CardContent>
        </Card>
      </div>

      {/* History section */}
      <Card className="border-border/45 bg-card/60 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle>Riwayat Analisis</CardTitle>
          <CardDescription>Daftar semua analisis kecurangan ujian yang telah dijalankan.</CardDescription>
        </CardHeader>
        <CardContent>
          {!analyses || analyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileSpreadsheetIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">Belum ada analisis</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">
                Anda belum pernah menjalankan analisis kecurangan. Klik &quot;Analisis Baru&quot; untuk memulai.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/analyses/new">Unggah Dataset</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b text-muted-foreground font-medium">
                    <th className="py-3 px-4">Nama Analisis / File</th>
                    <th className="py-3 px-4">Tipe Ujian</th>
                    <th className="py-3 px-4">Jumlah Peserta</th>
                    <th className="py-3 px-4">Silhouette Score</th>
                    <th className="py-3 px-4">Tanggal Pembuatan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((analysis) => (
                    <tr key={analysis.id} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium">
                        <Link href={`/analyses/${analysis.id}`} className="hover:underline block">
                          <span className="text-foreground">{analysis.title || "Tanpa Judul"}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">{analysis.source_filename}</span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        <Badge variant="outline">{analysis.exam_type}</Badge>
                      </td>
                      <td className="py-3.5 px-4">{analysis.participant_count ?? "-"}</td>
                      <td className="py-3.5 px-4 font-mono">
                        {analysis.silhouette_score !== null ? Number(analysis.silhouette_score).toFixed(4) : "-"}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs">
                        {new Date(analysis.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        {analysis.status === "done" && (
                          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/20">
                            Selesai
                          </Badge>
                        )}
                        {analysis.status === "processing" && (
                          <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/20 animate-pulse">
                            Memproses
                          </Badge>
                        )}
                        {analysis.status === "failed" && (
                          <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20">
                            Gagal
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/analyses/${analysis.id}`}>Buka</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
