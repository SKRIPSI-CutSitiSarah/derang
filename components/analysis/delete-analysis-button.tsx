"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon, Loader2Icon } from "lucide-react"
import { deleteAnalysisAction } from "@/app/(dashboard)/actions"

export function DeleteAnalysisButton({
  analysisId,
  label,
}: {
  analysisId: string
  label: string
}) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteAnalysisAction(analysisId)
    setIsDeleting(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success("Analisis berhasil dihapus.")
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2Icon className="h-4 w-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus analisis ini?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{label}&quot; beserta seluruh data peserta dan pasangan mencurigakan akan dihapus permanen.
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
