import { getDb } from '#/lib/db/mongo.server'
import type { SrdRaceEntry } from '#/types/srd'

export async function findAllRaceEntries(): Promise<
  Array<Pick<SrdRaceEntry, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('races')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdRaceEntry, 'index' | 'name'>>
}

export async function findRaceEntryByIndex(
  index: string,
): Promise<SrdRaceEntry | null> {
  const db = await getDb()
  const doc = await db
    .collection('races')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdRaceEntry | null
}
