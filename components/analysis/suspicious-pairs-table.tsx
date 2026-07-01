import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ParticipantRow, SimilarityPairRow } from "@/lib/analysis-types"

function participantLabel(code: string | null, participants: ParticipantRow[]): string {
  if (!code) return "-"
  const match = participants.find((p) => p.participant_code === code)
  return match?.name ? `${code} (${match.name})` : code
}

export function SuspiciousPairsTable({
  pairs,
  participants,
}: {
  pairs: SimilarityPairRow[]
  participants: ParticipantRow[]
}) {
  if (pairs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Tidak ada pasangan peserta yang perlu diperhatikan.
      </p>
    )
  }

  const sorted = [...pairs].sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Peserta A</TableHead>
          <TableHead>Peserta B</TableHead>
          <TableHead>Kemiripan</TableHead>
          <TableHead>Catatan Pendukung</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((pair) => (
          <TableRow key={pair.id}>
            <TableCell className="font-medium">{participantLabel(pair.participant_a, participants)}</TableCell>
            <TableCell className="font-medium">{participantLabel(pair.participant_b, participants)}</TableCell>
            <TableCell className="font-mono">
              {pair.similarity !== null ? pair.similarity.toFixed(2) : "-"}
            </TableCell>
            <TableCell className="text-muted-foreground">{pair.supporting_note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
