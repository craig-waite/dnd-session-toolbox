import { getDb } from '#/lib/db/mongo.server'
import type { SrdMagicItem } from '#/types/srd'

export async function findAllMagicItems(): Promise<
  Array<Pick<SrdMagicItem, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('magicItems')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdMagicItem, 'index' | 'name'>>
}

export async function findMagicItemByIndex(
  index: string,
): Promise<SrdMagicItem | null> {
  const db = await getDb()
  const doc = await db
    .collection('magicItems')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdMagicItem | null
}
