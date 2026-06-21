import { getDb } from '#/lib/db/mongo.server'
import type { SrdSpell } from '#/types/srd'

export async function findAllSpells(): Promise<
  Array<Pick<SrdSpell, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('spells')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdSpell, 'index' | 'name'>>
}

export async function findSpellByIndex(
  index: string,
): Promise<SrdSpell | null> {
  const db = await getDb()
  const doc = await db
    .collection('spells')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdSpell | null
}
