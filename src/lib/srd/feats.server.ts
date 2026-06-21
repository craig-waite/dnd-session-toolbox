import { getDb } from '#/lib/db/mongo.server'
import type { SrdFeat } from '#/types/srd'

export async function findAllFeats(): Promise<
  Array<Pick<SrdFeat, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('feats')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdFeat, 'index' | 'name'>>
}

export async function findFeatByIndex(index: string): Promise<SrdFeat | null> {
  const db = await getDb()
  const doc = await db
    .collection('feats')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdFeat | null
}
