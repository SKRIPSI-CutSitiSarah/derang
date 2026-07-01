"use server"

import { createClient } from "@/lib/supabase/server"
import { validateDataset, analyzeDataset, type ExamType } from "@/lib/ml-client"
import { redirect } from "next/navigation"

export type ValidateActionState = {
  status: "idle" | "valid" | "invalid" | "error"
  missingColumns?: string[]
  participantCount?: number
  questionCount?: number
  error?: string
}

export async function validateDatasetAction(
  _prev: ValidateActionState,
  formData: FormData
): Promise<ValidateActionState> {
  const file = formData.get("file")
  const examType = formData.get("exam_type") as ExamType | null

  if (!(file instanceof Blob) || !examType) {
    return { status: "error", error: "File dan mode ujian wajib diisi." }
  }

  const result = await validateDataset(file, examType)

  if (!result.ok) {
    return { status: "error", error: result.error }
  }

  if (!result.data.valid) {
    return {
      status: "invalid",
      missingColumns: result.data.missing_columns,
      participantCount: result.data.participant_count,
      questionCount: result.data.question_count,
    }
  }

  return {
    status: "valid",
    participantCount: result.data.participant_count,
    questionCount: result.data.question_count,
  }
}

export type RunAnalysisActionState = {
  status: "idle" | "error"
  error?: string
}

export async function runAnalysisAction(
  _prev: RunAnalysisActionState,
  formData: FormData
): Promise<RunAnalysisActionState> {
  const file = formData.get("file")
  const examType = formData.get("exam_type") as ExamType | null

  if (!(file instanceof File) || !examType) {
    return { status: "error", error: "File dan mode ujian wajib diisi." }
  }

  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) {
    redirect("/login")
  }

  const { data: analysis, error: insertError } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      exam_type: examType,
      source_filename: file.name,
      status: "processing",
    })
    .select()
    .single()

  if (insertError || !analysis) {
    return { status: "error", error: "Gagal membuat sesi analisis baru." }
  }

  const storagePath = `${analysis.id}/${file.name}`
  const { error: uploadError } = await supabase.storage
    .from("datasets")
    .upload(storagePath, file, { contentType: file.type || undefined })

  if (uploadError) {
    await supabase
      .from("analyses")
      .update({ status: "failed" })
      .eq("id", analysis.id)
    return { status: "error", error: "Gagal mengunggah file ke storage." }
  }

  await supabase.from("analyses").update({ storage_path: storagePath }).eq("id", analysis.id)

  const analyzeResult = await analyzeDataset({ file, exam_type: examType })

  if (!analyzeResult.ok) {
    await supabase.from("analyses").update({ status: "failed" }).eq("id", analysis.id)
    return { status: "error", error: analyzeResult.error }
  }

  const { meta, participants, similarity_pairs } = analyzeResult.data

  const { error: participantsError } = await supabase.from("participants").insert(
    participants.map((p) => ({
      analysis_id: analysis.id,
      participant_code: p.participant_code,
      name: p.name,
      class: p.class,
      score: p.score,
      correct_count: p.correct_count,
      duration_seconds: p.duration_seconds,
      seat_position: p.seat_position,
      max_similarity: p.max_similarity,
      cluster_id: p.cluster_id,
      category: p.category,
    }))
  )

  if (similarity_pairs.length > 0) {
    await supabase.from("similarity_pairs").insert(
      similarity_pairs.map((pair) => ({
        analysis_id: analysis.id,
        participant_a: pair.participant_a,
        participant_b: pair.participant_b,
        similarity: pair.similarity,
        supporting_note: pair.supporting_note,
      }))
    )
  }

  if (participantsError) {
    await supabase.from("analyses").update({ status: "failed" }).eq("id", analysis.id)
    return { status: "error", error: "Gagal menyimpan hasil peserta." }
  }

  await supabase
    .from("analyses")
    .update({
      status: "done",
      participant_count: meta.participant_count,
      question_count: meta.question_count,
      k_value: meta.k,
      silhouette_score: meta.silhouette_score,
    })
    .eq("id", analysis.id)

  redirect(`/analyses/${analysis.id}`)
}
