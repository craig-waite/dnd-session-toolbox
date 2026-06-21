import { getDb } from '#/lib/db/mongo.server'
import type { SrdAbilityScore } from '#/types/srd'

export async function findAllAbilityScores(): Promise<
  Array<Pick<SrdAbilityScore, 'index' | 'name'>>
> {
  const db = await getDb()
  const docs = await db
    .collection('abilityScores')
    .find({}, { projection: { _id: 0, index: 1, name: 1 } })
    .sort({ name: 1 })
    .toArray()
  return docs as unknown as Array<Pick<SrdAbilityScore, 'index' | 'name'>>
}

export async function findAbilityScoreByIndex(
  index: string,
): Promise<SrdAbilityScore | null> {
  const db = await getDb()
  const doc = await db
    .collection('abilityScores')
    .findOne({ index }, { projection: { _id: 0 } })
  return doc as SrdAbilityScore | null
}
