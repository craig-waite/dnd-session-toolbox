import { getDb } from '#/lib/db/mongo.server'
import type { SrdClass, SrdClassLevel, SrdFeature } from '#/types/srd'

export async function findAllClasses(): Promise<
  Array<Pick<SrdClass, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('classes')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdClass, 'index' | 'name'>>
}

export async function findClassByIndex(
  index: string,
): Promise<SrdClass | null> {
  const db = await getDb()
  const doc = await db
    .collection('classes')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdClass | null
}

export async function findFeaturesForClass(
  classIndex: string,
): Promise<SrdFeature[]> {
  const db = await getDb()
  const docs = await db
    .collection('features')
    .find(
      { 'class.index': classIndex, subclass: { $exists: false } },
      { projection: { _id: 0 } },
    )
    .sort({ level: 1, name: 1 })
    .toArray()
  return docs as unknown as SrdFeature[]
}

export async function findLevelsForClass(
  classIndex: string,
): Promise<SrdClassLevel[]> {
  const db = await getDb()
  const docs = await db
    .collection('levels')
    .find(
      { 'class.index': classIndex, subclass: { $exists: false } },
      { projection: { _id: 0 } },
    )
    .sort({ level: 1 })
    .toArray()
  return docs as unknown as SrdClassLevel[]
}
