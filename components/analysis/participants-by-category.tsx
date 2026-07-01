"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/category"
import type { ParticipantRow } from "@/lib/analysis-types"
import type { ExamType } from "@/lib/ml-client"

export function ParticipantsByCategory({
  participants,
  examType,
}: {
  participants: ParticipantRow[]
  examType: ExamType
}) {
  return (
    <Tabs defaultValue={CATEGORIES[0]}>
      <TabsList>
        {CATEGORIES.map((category) => {
          const count = participants.filter((p) => p.category === category).length
          return (
            <TabsTrigger key={category} value={category}>
              {CATEGORY_LABEL[category]}
              <Badge variant="secondary">{count}</Badge>
            </TabsTrigger>
          )
        })}
      </TabsList>
      {CATEGORIES.map((category) => {
        const members = participants
          .filter((p) => p.category === category)
          .sort((a, b) => (b.max_similarity ?? 0) - (a.max_similarity ?? 0))

        return (
          <TabsContent key={category} value={category}>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Tidak ada peserta pada kategori ini.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Skor</TableHead>
                    <TableHead>Kemiripan Tertinggi</TableHead>
                    <TableHead>{examType === "online" ? "Durasi (detik)" : "Posisi Duduk"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.participant_code}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.class}</TableCell>
                      <TableCell>{p.score}</TableCell>
                      <TableCell className="font-mono">
                        {p.max_similarity !== null ? p.max_similarity.toFixed(2) : "-"}
                      </TableCell>
                      <TableCell>
                        {examType === "online" ? p.duration_seconds ?? "-" : p.seat_position ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
