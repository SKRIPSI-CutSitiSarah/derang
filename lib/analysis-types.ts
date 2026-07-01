import type { Category } from "./category"
import type { ExamType } from "./ml-client"

// Mirrors the `analyses` table (PRD.md §10).
export type AnalysisRow = {
  id: string
  user_id: string | null
  created_at: string
  title: string | null
  exam_type: ExamType
  source_filename: string | null
  storage_path: string | null
  participant_count: number | null
  question_count: number | null
  k_value: number | null
  silhouette_score: number | null
  status: "processing" | "done" | "failed"
}

// Mirrors the `participants` table (PRD.md §10).
export type ParticipantRow = {
  id: string
  analysis_id: string
  participant_code: string | null
  name: string | null
  class: string | null
  score: number | null
  correct_count: number | null
  duration_seconds: number | null
  seat_position: string | null
  max_similarity: number | null
  cluster_id: number | null
  category: Category
}

// Mirrors the `similarity_pairs` table (PRD.md §10).
export type SimilarityPairRow = {
  id: string
  analysis_id: string
  participant_a: string | null
  participant_b: string | null
  similarity: number | null
  supporting_note: string | null
}
