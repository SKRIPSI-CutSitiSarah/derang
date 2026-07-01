import type { Category } from "./category"

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
