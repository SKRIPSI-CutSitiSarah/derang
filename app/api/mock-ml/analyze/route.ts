import { NextRequest, NextResponse } from "next/server"
import { parseUploadedFile, resolveColumns, findMissingColumns, fabricateAnalysis } from "@/lib/ml-mock"
import type { ExamType } from "@/lib/ml-client"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file")
  const paramsRaw = formData.get("params")

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "File tidak ditemukan pada request." }, { status: 400 })
  }

  let examType: ExamType = "online"
  try {
    if (typeof paramsRaw === "string") {
      const parsed = JSON.parse(paramsRaw) as { exam_type?: ExamType }
      if (parsed.exam_type === "online" || parsed.exam_type === "offline") {
        examType = parsed.exam_type
      }
    }
  } catch {
    // ignore malformed params, fall back to default exam_type
  }

  const filename = file instanceof File ? file.name : "upload.csv"

  try {
    const { headers, rows } = await parseUploadedFile(file, filename)
    const mapping = resolveColumns(headers)
    const missing = findMissingColumns(mapping)

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Kolom wajib tidak lengkap: ${missing.join(", ")}` },
        { status: 422 }
      )
    }

    const result = fabricateAnalysis(rows, mapping, examType, filename)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses file. Pastikan format CSV/Excel valid." },
      { status: 400 }
    )
  }
}
