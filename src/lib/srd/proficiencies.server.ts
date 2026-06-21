import { getDb } from '#/lib/db/mongo.server'
import type { SrdProficiency } from '#/types/srd'

export async function findAllProficiencies(): Promise<
  Array<Pick<SrdProficiency, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('proficiencies')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdProficiency, 'index' | 'name'>>
}

export async function findProficiencyByIndex(
  index: string,
): Promise<SrdProficiency | null> {
  const db = await getDb()
  const doc = await db
    .collection('proficiencies')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdProficiency | null
}
