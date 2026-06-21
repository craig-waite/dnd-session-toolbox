import { getDb } from '#/lib/db/mongo.server'
import type { SrdEquipment } from '#/types/srd'

export async function findAllEquipment(): Promise<
  Array<Pick<SrdEquipment, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('equipment')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdEquipment, 'index' | 'name'>>
}

export async function findEquipmentByIndex(
  index: string,
): Promise<SrdEquipment | null> {
  const db = await getDb()
  const doc = await db
    .collection('equipment')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdEquipment | null
}
