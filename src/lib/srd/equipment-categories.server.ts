import { getDb } from '#/lib/db/mongo.server'
import type { SrdEquipmentCategory } from '#/types/srd'

export async function findAllEquipmentCategories(): Promise<
  Array<Pick<SrdEquipmentCategory, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('equipmentCategories')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdEquipmentCategory, 'index' | 'name'>>
}

export async function findEquipmentCategoryByIndex(
  index: string,
): Promise<SrdEquipmentCategory | null> {
  const db = await getDb()
  const doc = await db
    .collection('equipmentCategories')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdEquipmentCategory | null
}
