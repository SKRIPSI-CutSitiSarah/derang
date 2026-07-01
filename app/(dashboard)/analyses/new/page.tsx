"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DatasetDropzone } from "@/components/dataset-dropzone"
import {
  validateDatasetAction,
  runAnalysisAction,
  type ValidateActionState,
  type RunAnalysisActionState,
} from "./actions"
import { Loader2Icon, CheckCircle2Icon, AlertTriangleIcon } from "lucide-react"

const initialValidateState: ValidateActionState = { status: "idle" }
const initialRunState: RunAnalysisActionState = { status: "idle" }

export default function NewAnalysisPage() {
  const [examType, setExamType] = React.useState<"online" | "offline">("online")
  const [file, setFile] = React.useState<File | null>(null)

  const [validateState, dispatchValidate, isValidating] = useActionState(
    validateDatasetAction,
    initialValidateState
  )
  const [runState, dispatchRun, isRunning] = useActionState(runAnalysisAction, initialRunState)

  React.useEffect(() => {
    if (runState.status === "error" && runState.error) {
      toast.error(runState.error)
    }
  }, [runState])

  const handleFileSelected = (selected: File) => {
    setFile(selected)
    const formData = new FormData()
    formData.append("file", selected)
    formData.append("exam_type", examType)
    dispatchValidate(formData)
  }

  const handleClearFile = () => {
    setFile(null)
  }

  const handleRunAnalysis = () => {
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("exam_type", examType)
    dispatchRun(formData)
  }

  const canRun = file !== null && validateState.status === "valid" && !isRunning

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analisis Baru</h1>
        <p className="text-muted-foreground mt-1">
          Unggah dataset hasil ujian untuk dianalisis. Hasil bersifat indikasi awal, perlu verifikasi manual.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Mode Ujian</CardTitle>
          <CardDescription>Pilih mode sesuai pelaksanaan ujian.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={examType}
            onValueChange={(value) => {
              setExamType(value as "online" | "offline")
              setFile(null)
            }}
          >
            <TabsList>
              <TabsTrigger value="online" disabled={isRunning}>
                Online
              </TabsTrigger>
              <TabsTrigger value="offline" disabled={isRunning}>
                Offline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Unggah Dataset</CardTitle>
          <CardDescription>Format CSV atau Excel (.xlsx/.xls).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DatasetDropzone
            file={file}
            onFileSelected={handleFileSelected}
            onClear={handleClearFile}
            disabled={isRunning}
          />

          {isValidating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Memvalidasi dataset...
            </div>
          )}

          {validateState.status === "valid" && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 border border-emerald-500/20">
              <CheckCircle2Icon className="h-4 w-4 shrink-0" />
              <p>
                Valid — {validateState.participantCount} peserta, {validateState.questionCount} soal.
              </p>
            </div>
          )}

          {validateState.status === "invalid" && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              <AlertTriangleIcon className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Kolom wajib tidak lengkap:</p>
                <ul className="list-disc list-inside">
                  {validateState.missingColumns?.map((col) => (
                    <li key={col}>{col}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {validateState.status === "error" && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              <AlertTriangleIcon className="h-4 w-4 shrink-0" />
              <p>{validateState.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Jalankan Analisis</CardTitle>
          <CardDescription>
            Proses cosine similarity & K-Means dijalankan oleh ML service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRunning && <Progress value={undefined} className="animate-pulse" />}
          {runState.status === "error" && runState.error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              <AlertTriangleIcon className="h-4 w-4 shrink-0" />
              <p>{runState.error}</p>
            </div>
          )}
          <Button onClick={handleRunAnalysis} disabled={!canRun} className="w-full">
            {isRunning ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Menjalankan analisis...
              </>
            ) : (
              "Jalankan Analisis"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
