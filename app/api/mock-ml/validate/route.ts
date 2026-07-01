import { NextRequest, NextResponse } from "next/server"
import { parseUploadedFile, resolveColumns, findMissingColumns } from "@/lib/ml-mock"
import type { ValidateResponse } from "@/lib/ml-client"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "File tidak ditemukan pada request." }, { status: 400 })
  }

  const filename = file instanceof File ? file.name : "upload.csv"

  try {
    const { headers, rows } = await parseUploadedFile(file, filename)
    const mapping = resolveColumns(headers)
    const missing = findMissingColumns(mapping)

    const body: ValidateResponse = {
      valid: missing.length === 0,
      missing_columns: missing,
      participant_count: rows.length,
      question_count: mapping.answerColumns.length,
    }

    return NextResponse.json(body)
  } catch {
    return NextResponse.json(
      { error: "Gagal membaca file. Pastikan format CSV/Excel valid." },
      { status: 400 }
    )
  }
}
