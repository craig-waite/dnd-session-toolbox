import { getDb } from '#/lib/db/mongo.server'
import type { SrdDamageType } from '#/types/srd'

export async function findAllDamageTypes(): Promise<SrdDamageType[]> {
  const db = await getDb()
  const docs = await db
    .collection('damageTypes')
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as SrdDamageType[]
}
