import { getDb } from '#/lib/db/mongo.server'
import type { ActivityId } from '#/types/dm-shell'
import type { SearchResult } from '#/types/search'

const SEARCHABLE_COLLECTIONS: Array<{
  collection: string
  activity: ActivityId
  resultLabel: string
}> = [
  { collection: 'monsters', activity: 'monsters', resultLabel: 'Monster' },
  { collection: 'spells', activity: 'spells', resultLabel: 'Spell' },
  { collection: 'equipment', activity: 'equipment', resultLabel: 'Equipment' },
  {
    collection: 'magicItems',
    activity: 'magic-items',
    resultLabel: 'Magic item',
  },
  { collection: 'rules', activity: 'rules', resultLabel: 'Rule' },
  { collection: 'classes', activity: 'classes', resultLabel: 'Class' },
  { collection: 'subclasses', activity: 'subclasses', resultLabel: 'Subclass' },
  { collection: 'features', activity: 'features', resultLabel: 'Feature' },
  { collection: 'races', activity: 'races', resultLabel: 'Race' },
  { collection: 'traits', activity: 'traits', resultLabel: 'Trait' },
  {
    collection: 'magicSchools',
    activity: 'magic-schools',
    resultLabel: 'Magic school',
  },
  {
    collection: 'weaponProperties',
    activity: 'weapon-properties',
    resultLabel: 'Weapon property',
  },
  {
    collection: 'abilityScores',
    activity: 'ability-scores',
    resultLabel: 'Ability score',
  },
  {
    collection: 'equipmentCategories',
    activity: 'equipment-categories',
    resultLabel: 'Equipment category',
  },
  {
    collection: 'proficiencies',
    activity: 'proficiencies',
    resultLabel: 'Proficiency',
  },
  {
    collection: 'alignments',
    activity: 'alignments',
    resultLabel: 'Alignment',
  },
  { collection: 'languages', activity: 'languages', resultLabel: 'Language' },
  {
    collection: 'damageTypes',
    activity: 'damage-types',
    resultLabel: 'Damage type',
  },
  {
    collection: 'backgrounds',
    activity: 'backgrounds',
    resultLabel: 'Background',
  },
  { collection: 'feats', activity: 'feats', resultLabel: 'Feat' },
]

const RESULTS_PER_COLLECTION = 5
const MAX_RESULTS = 8

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function findSearchResults(
  query: string,
): Promise<SearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const db = await getDb()
  const pattern = new RegExp(escapeRegex(trimmed), 'i')

  const resultsByCollection = await Promise.all(
    SEARCHABLE_COLLECTIONS.map(
      async ({ collection, activity, resultLabel }) => {
        const docs = await db
          .collection(collection)
          .find(
            { name: pattern },
            { projection: { _id: 0, index: 1, name: 1 } },
          )
          .limit(RESULTS_PER_COLLECTION)
          .toArray()

        return docs.map(
          (doc): SearchResult => ({
            id: doc.index,
            title: doc.name,
            subtitle: resultLabel,
            activity,
          }),
        )
      },
    ),
  )

  return resultsByCollection.flat().slice(0, MAX_RESULTS)
}
