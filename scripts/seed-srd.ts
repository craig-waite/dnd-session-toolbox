import 'dotenv/config'
import abilityScoresJson from '../src/data/srd/2014/5e-SRD-Ability-Scores.json' with {
  type: 'json',
}
import alignmentsJson from '../src/data/srd/2014/5e-SRD-Alignments.json' with {
  type: 'json',
}
import backgroundsJson from '../src/data/srd/2014/5e-SRD-Backgrounds.json' with {
  type: 'json',
}
import classesJson from '../src/data/srd/2014/5e-SRD-Classes.json' with {
  type: 'json',
}
import conditionsJson from '../src/data/srd/2014/5e-SRD-Conditions.json' with {
  type: 'json',
}
import damageTypesJson from '../src/data/srd/2014/5e-SRD-Damage-Types.json' with {
  type: 'json',
}
import equipmentJson from '../src/data/srd/2014/5e-SRD-Equipment.json' with {
  type: 'json',
}
import equipmentCategoriesJson from '../src/data/srd/2014/5e-SRD-Equipment-Categories.json' with {
  type: 'json',
}
import featsJson from '../src/data/srd/2014/5e-SRD-Feats.json' with {
  type: 'json',
}
import featuresJson from '../src/data/srd/2014/5e-SRD-Features.json' with {
  type: 'json',
}
import languagesJson from '../src/data/srd/2014/5e-SRD-Languages.json' with {
  type: 'json',
}
import levelsJson from '../src/data/srd/2014/5e-SRD-Levels.json' with {
  type: 'json',
}
import magicItemsJson from '../src/data/srd/2014/5e-SRD-Magic-Items.json' with {
  type: 'json',
}
import magicSchoolsJson from '../src/data/srd/2014/5e-SRD-Magic-Schools.json' with {
  type: 'json',
}
import monstersJson from '../src/data/srd/2014/5e-SRD-Monsters.json' with {
  type: 'json',
}
import proficienciesJson from '../src/data/srd/2014/5e-SRD-Proficiencies.json' with {
  type: 'json',
}
import racesJson from '../src/data/srd/2014/5e-SRD-Races.json' with {
  type: 'json',
}
import ruleSectionsJson from '../src/data/srd/2014/5e-SRD-Rule-Sections.json' with {
  type: 'json',
}
import rulesJson from '../src/data/srd/2014/5e-SRD-Rules.json' with {
  type: 'json',
}
import skillsJson from '../src/data/srd/2014/5e-SRD-Skills.json' with {
  type: 'json',
}
import spellsJson from '../src/data/srd/2014/5e-SRD-Spells.json' with {
  type: 'json',
}
import subclassesJson from '../src/data/srd/2014/5e-SRD-Subclasses.json' with {
  type: 'json',
}
import subracesJson from '../src/data/srd/2014/5e-SRD-Subraces.json' with {
  type: 'json',
}
import traitsJson from '../src/data/srd/2014/5e-SRD-Traits.json' with {
  type: 'json',
}
import weaponPropertiesJson from '../src/data/srd/2014/5e-SRD-Weapon-Properties.json' with {
  type: 'json',
}
import { getDb } from '../src/lib/db/mongo.server'

export const SRD_SOURCE = 'srd-5.1-2014'

async function seedCollection(
  collectionName: string,
  items: Array<Record<string, unknown>>,
) {
  const db = await getDb()
  const collection = db.collection(collectionName)

  await collection.deleteMany({ source: SRD_SOURCE })
  const docs = items.map((item) => ({ ...item, source: SRD_SOURCE }))
  if (docs.length > 0) {
    await collection.insertMany(docs)
  }

  await collection.createIndex({ index: 1 }, { unique: true })
  await collection.createIndex({ name: 1 })

  console.log(`Seeded ${docs.length} documents into "${collectionName}"`)
}

function buildRulesCollection() {
  const ruleEntries = (
    ruleSectionsJson as Array<{ index: string; name: string; desc: string }>
  ).map((entry) => ({
    index: entry.index,
    name: entry.name,
    category: 'rule',
    desc: [entry.desc],
  }))

  const TOP_LEVEL_RULE_INDICES = [
    'using-ability-scores',
    'spellcasting',
    'equipment',
  ]
  const topLevelRuleEntries = (
    rulesJson as Array<{ index: string; name: string; desc: string }>
  )
    .filter((entry) => TOP_LEVEL_RULE_INDICES.includes(entry.index))
    .map((entry) => ({
      index: entry.index,
      name: entry.name,
      category: 'rule',
      desc: [entry.desc],
    }))

  const conditionEntries = (
    conditionsJson as Array<{ index: string; name: string; desc: string[] }>
  ).map((entry) => ({
    index: entry.index,
    name: entry.name,
    category: 'condition',
    desc: entry.desc,
  }))

  const skillEntries = (
    skillsJson as Array<{
      index: string
      name: string
      desc: string[]
      ability_score: { index: string; name: string }
    }>
  ).map((entry) => ({
    index: entry.index,
    name: entry.name,
    category: 'skill',
    desc: entry.desc,
    ability_score: {
      index: entry.ability_score.index,
      name: entry.ability_score.name,
    },
  }))

  return [
    ...ruleEntries,
    ...topLevelRuleEntries,
    ...conditionEntries,
    ...skillEntries,
  ]
}

function buildRacesCollection() {
  const raceEntries = (
    racesJson as Array<{
      index: string
      name: string
      speed: number
      size: string
      ability_bonuses: unknown[]
      traits: Array<{ index: string; name: string }>
    }>
  ).map((entry) => ({
    index: entry.index,
    name: entry.name,
    category: 'race',
    speed: entry.speed,
    size: entry.size,
    ability_bonuses: entry.ability_bonuses,
    traits: entry.traits,
  }))

  const subraceEntries = (
    subracesJson as Array<{
      index: string
      name: string
      race: { index: string; name: string }
      desc: string
      ability_bonuses: unknown[]
      racial_traits: Array<{ index: string; name: string }>
    }>
  ).map((entry) => ({
    index: entry.index,
    name: entry.name,
    category: 'subrace',
    parentRace: entry.race,
    desc: entry.desc,
    ability_bonuses: entry.ability_bonuses,
    traits: entry.racial_traits,
  }))

  return [...raceEntries, ...subraceEntries]
}

async function main() {
  await seedCollection(
    'monsters',
    monstersJson as Array<Record<string, unknown>>,
  )
  await seedCollection('spells', spellsJson as Array<Record<string, unknown>>)
  await seedCollection(
    'equipment',
    equipmentJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'magicItems',
    magicItemsJson as Array<Record<string, unknown>>,
  )
  await seedCollection('rules', buildRulesCollection())
  await seedCollection('classes', classesJson as Array<Record<string, unknown>>)
  await seedCollection(
    'subclasses',
    subclassesJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'features',
    featuresJson as Array<Record<string, unknown>>,
  )
  await seedCollection('races', buildRacesCollection())
  await seedCollection('traits', traitsJson as Array<Record<string, unknown>>)
  await seedCollection(
    'magicSchools',
    (
      magicSchoolsJson as Array<{ index: string; name: string; desc: string }>
    ).map((entry) => ({
      ...entry,
      desc: [entry.desc],
    })),
  )
  await seedCollection(
    'weaponProperties',
    weaponPropertiesJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'abilityScores',
    abilityScoresJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'equipmentCategories',
    equipmentCategoriesJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'proficiencies',
    proficienciesJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'alignments',
    (
      alignmentsJson as Array<{ index: string; name: string; desc: string }>
    ).map((entry) => ({ ...entry, desc: [entry.desc] })),
  )
  await seedCollection(
    'languages',
    languagesJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'damageTypes',
    damageTypesJson as Array<Record<string, unknown>>,
  )
  await seedCollection(
    'backgrounds',
    backgroundsJson as Array<Record<string, unknown>>,
  )
  await seedCollection('feats', featsJson as Array<Record<string, unknown>>)
  await seedCollection('levels', levelsJson as Array<Record<string, unknown>>)
  process.exit(0)
}

main().catch((error) => {
  console.error('Seed failed:')
  console.error(error)
  process.exit(1)
})
