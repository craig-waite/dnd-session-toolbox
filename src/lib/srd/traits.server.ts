import { getDb } from '#/lib/db/mongo.server'
import type { SrdTrait } from '#/types/srd'

export async function findAllTraits(): Promise<
  Array<Pick<SrdTrait, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('traits')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdTrait, 'index' | 'name'>>
}

export async function findTraitByIndex(
  index: string,
): Promise<SrdTrait | null> {
  const db = await getDb()
  const doc = await db
    .collection('traits')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdTrait | null
}
