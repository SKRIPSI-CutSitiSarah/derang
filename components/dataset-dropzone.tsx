"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { UploadCloudIcon, FileSpreadsheetIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"]
const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20MB

function isAcceptedFile(file: File): boolean {
  const lower = file.name.toLowerCase()
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DatasetDropzone({
  file,
  onFileSelected,
  onClear,
  disabled,
}: {
  file: File | null
  onFileSelected: (file: File) => void
  onClear: () => void
  disabled?: boolean
}) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = React.useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return
      if (!isAcceptedFile(candidate)) {
        setLocalError("Format file harus .csv, .xlsx, atau .xls")
        return
      }
      if (candidate.size > MAX_SIZE_BYTES) {
        setLocalError("Ukuran file maksimal 20MB.")
        return
      }
      setLocalError(null)
      onFileSelected(candidate)
    },
    [onFileSelected]
  )

  if (file) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <FileSpreadsheetIcon className="h-8 w-8 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          onClick={onClear}
          aria-label="Hapus file"
          className="shrink-0"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          disabled && "pointer-events-none opacity-50"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <UploadCloudIcon className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">Seret & lepas file, atau klik untuk memilih</p>
        <p className="text-xs text-muted-foreground">CSV atau Excel (.xlsx, .xls), maksimal 20MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {localError && <p className="text-sm text-destructive">{localError}</p>}
    </div>
  )
}
