import { getDb } from '#/lib/db/mongo.server'
import type { SrdRuleEntry } from '#/types/srd'

export async function findAllRuleEntries(): Promise<
  Array<Pick<SrdRuleEntry, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('rules')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdRuleEntry, 'index' | 'name'>>
}

export async function findRuleEntryByIndex(
  index: string,
): Promise<SrdRuleEntry | null> {
  const db = await getDb()
  const doc = await db
    .collection('rules')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdRuleEntry | null
}
