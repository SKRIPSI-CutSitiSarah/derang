// Stand-in for the Flask ML service (PRD.md §11). Parses uploaded files for
// real (so column validation and participant/question counts are accurate),
// but does NOT implement cosine similarity / K-Means — categories and
// similarity scores are deterministically fabricated. Web is not supposed to
// own ML logic; this only exists so the upload -> analyze -> persist flow can
// be built and demoed before the real Flask service is ready.

import Papa from "papaparse"
import * as XLSX from "xlsx"
import type {
  AnalyzeCluster,
  AnalyzeParticipant,
  AnalyzeSimilarityPair,
  ExamType,
} from "./ml-client"

export type ParsedRow = Record<string, string>

export type ParsedFile = {
  headers: string[]
  rows: ParsedRow[]
}

export async function parseUploadedFile(file: File | Blob, filename: string): Promise<ParsedFile> {
  const isCsv = /\.csv$/i.test(filename)

  if (isCsv) {
    const text = await file.text()
    const result = Papa.parse<ParsedRow>(text, { header: true, skipEmptyLines: true })
    const headers = result.meta.fields ?? []
    return { headers, rows: result.data }
  }

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<ParsedRow>(sheet, { defval: "" })
  const headers = rows.length > 0 ? Object.keys(rows[0]) : []
  return { headers, rows }
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "")
}

type ColumnKey = "id" | "name" | "class" | "score" | "correct_count" | "duration" | "seat"

const COLUMN_SYNONYMS: Record<ColumnKey, string[]> = {
  id: ["idpeserta", "nopeserta", "id", "kodepeserta", "participantcode"],
  name: ["namapeserta", "nama", "name"],
  class: ["kelas", "class"],
  score: ["skor", "nilai", "score"],
  correct_count: ["totaljawabanbenar", "jumlahbenar", "correctcount", "benar"],
  duration: ["durasiujian", "durasi", "duration", "waktupengerjaan"],
  seat: ["posisitempatduduk", "posisi", "seat", "tempatduduk"],
}

function findColumn(headers: string[], key: ColumnKey): string | null {
  const synonyms = COLUMN_SYNONYMS[key]
  for (const header of headers) {
    if (synonyms.includes(normalizeHeader(header))) {
      return header
    }
  }
  return null
}

function findAnswerColumns(headers: string[]): string[] {
  return headers.filter((h) => /^soal[_\s]?\d+$/i.test(h.trim()) || /^jawaban[_\s]?\d+$/i.test(h.trim()))
}

export type ColumnMapping = {
  id: string | null
  name: string | null
  class: string | null
  score: string | null
  correctCount: string | null
  duration: string | null
  seat: string | null
  answerColumns: string[]
}

export function resolveColumns(headers: string[]): ColumnMapping {
  return {
    id: findColumn(headers, "id"),
    name: findColumn(headers, "name"),
    class: findColumn(headers, "class"),
    score: findColumn(headers, "score"),
    correctCount: findColumn(headers, "correct_count"),
    duration: findColumn(headers, "duration"),
    seat: findColumn(headers, "seat"),
    answerColumns: findAnswerColumns(headers),
  }
}

export function findMissingColumns(mapping: ColumnMapping): string[] {
  const missing: string[] = []
  if (!mapping.id) missing.push("ID Peserta")
  if (!mapping.name) missing.push("Nama Peserta")
  if (!mapping.class) missing.push("Kelas")
  if (mapping.answerColumns.length === 0) missing.push("Jawaban per soal (soal_1..n)")
  return missing
}

// Deterministic PRNG (mulberry32) seeded from a string so re-running the
// same file yields stable fabricated results.
function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Category = AnalyzeParticipant["category"]

function categoryForRoll(roll: number): Category {
  if (roll < 0.7) return "tidak_terindikasi"
  if (roll < 0.9) return "terindikasi_rendah"
  return "terindikasi_tinggi"
}

function similarityForCategory(category: Category, random: () => number): number {
  switch (category) {
    case "tidak_terindikasi":
      return Math.round((0.15 + random() * 0.25) * 100) / 100
    case "terindikasi_rendah":
      return Math.round((0.5 + random() * 0.2) * 100) / 100
    case "terindikasi_tinggi":
      return Math.round((0.85 + random() * 0.13) * 100) / 100
  }
}

const CLUSTER_ID_BY_CATEGORY: Record<Category, number> = {
  tidak_terindikasi: 0,
  terindikasi_rendah: 1,
  terindikasi_tinggi: 2,
}

export function fabricateAnalysis(
  rows: ParsedRow[],
  mapping: ColumnMapping,
  examType: ExamType,
  fileSeed: string
) {
  const participants: AnalyzeParticipant[] = rows.map((row, index) => {
    const participantCode = mapping.id ? row[mapping.id] : `P-${String(index + 1).padStart(3, "0")}`
    const random = mulberry32(hashString(`${fileSeed}:${participantCode}`))
    const category = categoryForRoll(random())
    const maxSimilarity = similarityForCategory(category, random)

    const score = mapping.score ? Number(row[mapping.score]) || 0 : Math.round(40 + random() * 60)
    const correctCount = mapping.correctCount
      ? Number(row[mapping.correctCount]) || 0
      : Math.round((score / 100) * mapping.answerColumns.length)

    return {
      participant_code: participantCode || `P-${String(index + 1).padStart(3, "0")}`,
      name: mapping.name ? row[mapping.name] : "",
      class: mapping.class ? row[mapping.class] : "",
      score,
      correct_count: correctCount,
      duration_seconds:
        examType === "online"
          ? mapping.duration
            ? Number(row[mapping.duration]) || null
            : Math.round(600 + random() * 2400)
          : null,
      seat_position:
        examType === "offline" ? (mapping.seat ? row[mapping.seat] || null : null) : null,
      max_similarity: maxSimilarity,
      cluster_id: CLUSTER_ID_BY_CATEGORY[category],
      category,
    }
  })

  const clusters: AnalyzeCluster[] = (
    ["tidak_terindikasi", "terindikasi_rendah", "terindikasi_tinggi"] as Category[]
  ).map((category) => {
    const members = participants.filter((p) => p.category === category)
    const avgSimilarity =
      members.length > 0
        ? Math.round(
            (members.reduce((sum, p) => sum + p.max_similarity, 0) / members.length) * 100
          ) / 100
        : 0
    return {
      cluster_id: CLUSTER_ID_BY_CATEGORY[category],
      category,
      count: members.length,
      avg_similarity: avgSimilarity,
    }
  })

  const suspicious = participants
    .filter((p) => p.category !== "tidak_terindikasi")
    .sort((a, b) => b.max_similarity - a.max_similarity)

  const similarity_pairs: AnalyzeSimilarityPair[] = []
  for (let i = 0; i + 1 < suspicious.length && similarity_pairs.length < 15; i += 2) {
    const a = suspicious[i]
    const b = suspicious[i + 1]
    similarity_pairs.push({
      participant_a: a.participant_code,
      participant_b: b.participant_code,
      similarity: Math.min(a.max_similarity, b.max_similarity),
      supporting_note: examType === "online" ? "durasi hampir sama" : "posisi duduk berdekatan",
    })
  }

  const random = mulberry32(hashString(fileSeed))
  const silhouetteScore = Math.round((0.4 + random() * 0.4) * 100) / 100

  return {
    meta: {
      participant_count: participants.length,
      question_count: mapping.answerColumns.length,
      k: 3,
      silhouette_score: silhouetteScore,
    },
    clusters,
    participants,
    similarity_pairs,
  }
}
