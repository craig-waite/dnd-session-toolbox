import { getDb } from '#/lib/db/mongo.server'
import type { SrdMonster } from '#/types/srd'

export async function findAllMonsters(): Promise<
  Array<Pick<SrdMonster, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('monsters')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdMonster, 'index' | 'name'>>
}

export async function findMonsterByIndex(
  index: string,
): Promise<SrdMonster | null> {
  const db = await getDb()
  const doc = await db
    .collection('monsters')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdMonster | null
}
