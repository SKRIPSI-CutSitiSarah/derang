"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type DeleteAnalysisResult = { ok: true } | { ok: false; error: string }

export async function deleteAnalysisAction(analysisId: string): Promise<DeleteAnalysisResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Sesi tidak valid, silakan login ulang." }
  }

  const { data: analysis } = await supabase
    .from("analyses")
    .select("id, storage_path")
    .eq("id", analysisId)
    .single()

  if (!analysis) {
    return { ok: false, error: "Analisis tidak ditemukan." }
  }

  if (analysis.storage_path) {
    await supabase.storage.from("datasets").remove([analysis.storage_path])
  }

  // participants & similarity_pairs cascade-delete via FK (on delete cascade, PRD §10)
  const { error } = await supabase.from("analyses").delete().eq("id", analysisId)

  if (error) {
    return { ok: false, error: "Gagal menghapus analisis." }
  }

  revalidatePath("/")
  return { ok: true }
}
