// Client for the external ML service (Flask). Follows the API contract in
// PRD.md §11 exactly. Talks over plain HTTP so pointing ML_SERVICE_URL at the
// real Flask origin instead of the local mock requires no code changes here.

export type ExamType = "online" | "offline"

export type ValidateResponse = {
  valid: boolean
  missing_columns: string[]
  participant_count: number
  question_count: number
}

export type AnalyzeParams = {
  file: File | Blob
  exam_type: ExamType
  n_clusters?: number
  answer_key?: string[]
  column_map?: Record<string, string>
}

export type AnalyzeCluster = {
  cluster_id: number
  category: "tidak_terindikasi" | "terindikasi_rendah" | "terindikasi_tinggi"
  count: number
  avg_similarity: number
}

export type AnalyzeParticipant = {
  participant_code: string
  name: string
  class: string
  score: number
  correct_count: number
  duration_seconds: number | null
  seat_position: string | null
  max_similarity: number
  cluster_id: number
  category: "tidak_terindikasi" | "terindikasi_rendah" | "terindikasi_tinggi"
}

export type AnalyzeSimilarityPair = {
  participant_a: string
  participant_b: string
  similarity: number
  supporting_note: string
}

export type AnalyzeResponse = {
  meta: {
    participant_count: number
    question_count: number
    k: number
    silhouette_score: number
  }
  clusters: AnalyzeCluster[]
  participants: AnalyzeParticipant[]
  similarity_pairs: AnalyzeSimilarityPair[]
}

export type MlResult<T> = { ok: true; data: T } | { ok: false; error: string }

const VALIDATE_TIMEOUT_MS = 10_000
const ANALYZE_TIMEOUT_MS = 30_000

function baseUrl(): string {
  const url = process.env.ML_SERVICE_URL
  if (!url) {
    throw new Error("ML_SERVICE_URL belum diatur di environment.")
  }
  return url.replace(/\/$/, "")
}

async function fetchWithTimeoutAndRetry(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, { ...init, signal: controller.signal })
      clearTimeout(timer)

      if (response.status >= 500 && attempt === 0) {
        lastError = new Error(`ML service mengembalikan status ${response.status}`)
        continue
      }

      return response
    } catch (error) {
      clearTimeout(timer)
      lastError = error
      if (attempt === 1) break
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Gagal menghubungi ML service.")
}

function describeError(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "ML service tidak merespons (timeout). Coba lagi beberapa saat."
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Terjadi kesalahan tak terduga saat menghubungi ML service."
}

export async function validateDataset(
  file: File | Blob,
  examType: ExamType
): Promise<MlResult<ValidateResponse>> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("exam_type", examType)

    const response = await fetchWithTimeoutAndRetry(
      `${baseUrl()}/validate`,
      { method: "POST", body: formData },
      VALIDATE_TIMEOUT_MS
    )

    if (!response.ok) {
      return { ok: false, error: `Validasi gagal (status ${response.status}).` }
    }

    const data = (await response.json()) as ValidateResponse
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: describeError(error) }
  }
}

export async function analyzeDataset(
  params: AnalyzeParams
): Promise<MlResult<AnalyzeResponse>> {
  try {
    const formData = new FormData()
    formData.append("file", params.file)
    formData.append(
      "params",
      JSON.stringify({
        exam_type: params.exam_type,
        n_clusters: params.n_clusters ?? 3,
        answer_key: params.answer_key,
        column_map: params.column_map,
      })
    )

    const response = await fetchWithTimeoutAndRetry(
      `${baseUrl()}/analyze`,
      { method: "POST", body: formData },
      ANALYZE_TIMEOUT_MS
    )

    if (!response.ok) {
      return { ok: false, error: `Analisis gagal (status ${response.status}).` }
    }

    const data = (await response.json()) as AnalyzeResponse
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: describeError(error) }
  }
}
