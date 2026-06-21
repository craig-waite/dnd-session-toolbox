import { getDb } from '#/lib/db/mongo.server'
import type { SrdFeature } from '#/types/srd'

export async function findAllFeatures(): Promise<
  Array<Pick<SrdFeature, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('features')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdFeature, 'index' | 'name'>>
}

export async function findFeatureByIndex(
  index: string,
): Promise<SrdFeature | null> {
  const db = await getDb()
  const doc = await db
    .collection('features')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdFeature | null
}
