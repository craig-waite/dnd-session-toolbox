import { getDb } from '#/lib/db/mongo.server'
import type { SrdAlignment } from '#/types/srd'

export async function findAllAlignments(): Promise<SrdAlignment[]> {
  const db = await getDb()
  const docs = await db
    .collection('alignments')
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as SrdAlignment[]
}
