import { getDb } from '#/lib/db/mongo.server'
import type { SrdBackground } from '#/types/srd'

export async function findAllBackgrounds(): Promise<
  Array<Pick<SrdBackground, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('backgrounds')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdBackground, 'index' | 'name'>>
}

export async function findBackgroundByIndex(
  index: string,
): Promise<SrdBackground | null> {
  const db = await getDb()
  const doc = await db
    .collection('backgrounds')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdBackground | null
}
