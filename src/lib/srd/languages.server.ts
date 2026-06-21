import { getDb } from '#/lib/db/mongo.server'
import type { SrdLanguage } from '#/types/srd'

export async function findAllLanguages(): Promise<SrdLanguage[]> {
  const db = await getDb()
  const docs = await db
    .collection('languages')
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as SrdLanguage[]
}
