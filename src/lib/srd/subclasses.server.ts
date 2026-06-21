import { getDb } from '#/lib/db/mongo.server'
import type { SrdFeature, SrdSubclass } from '#/types/srd'

export async function findAllSubclasses(): Promise<
  Array<Pick<SrdSubclass, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('subclasses')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdSubclass, 'index' | 'name'>>
}

export async function findSubclassByIndex(
  index: string,
): Promise<SrdSubclass | null> {
  const db = await getDb()
  const doc = await db
    .collection('subclasses')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdSubclass | null
}

export async function findFeaturesForSubclass(
  subclassIndex: string,
): Promise<SrdFeature[]> {
  const db = await getDb()
  const docs = await db
    .collection('features')
    .find({ 'subclass.index': subclassIndex }, { projection: { _id: 0 } })
    .sort({ level: 1, name: 1 })
    .toArray()
  return docs as unknown as SrdFeature[]
}
