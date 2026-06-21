import { getDb } from '#/lib/db/mongo.server'
import type { SrdMagicSchool } from '#/types/srd'

export async function findAllMagicSchools(): Promise<
  Array<Pick<SrdMagicSchool, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('magicSchools')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdMagicSchool, 'index' | 'name'>>
}

export async function findMagicSchoolByIndex(
  index: string,
): Promise<SrdMagicSchool | null> {
  const db = await getDb()
  const doc = await db
    .collection('magicSchools')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdMagicSchool | null
}
