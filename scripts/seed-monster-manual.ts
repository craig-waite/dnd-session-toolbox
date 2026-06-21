import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { getDb } from '../src/lib/db/mongo.server'
import { slugify } from '../src/lib/utils'
import { MONSTER_MANUAL_SOURCE } from './monster-sources'

const MONSTER_MANUAL_PATH = new URL(
  '../src/data/official_paid_content/Monster Manual.JSON',
  import.meta.url,
)

interface ImprovedInitiativeMonster {
  Name: string
  Type: string
  HP: { Value: number; Notes: string }
  AC: { Value: number; Notes: string }
  Speed: string[]
  Abilities: {
    Str: number
    Dex: number
    Con: number
    Int: number
    Wis: number
    Cha: number
  }
  DamageVulnerabilities: string[]
  DamageResistances: string[]
  DamageImmunities: string[]
  ConditionImmunities: string[]
  Saves: Array<{ Name: string; Modifier: number }>
  Skills: Array<{ Name: string; Modifier: number }>
  Senses: string[]
  Languages: string[]
  Challenge: string
  Traits: Array<{ Name: string; Content: string }>
  Actions: Array<{ Name: string; Content: string }>
  Reactions: Array<{ Name: string; Content: string }>
  LegendaryActions: Array<{ Name: string; Content: string }>
}

const SIZE_ABBREVIATIONS: Record<string, string> = {
  T: 'Tiny',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  H: 'Huge',
  G: 'Gargantuan',
}

/** Type strings look like "Gargantuan dragon, chaotic evil" or, in some
 * entries, "L beast, monster manual, unaligned" — size abbreviated, and an
 * extra book-reference segment before the trailing alignment. */
function parseTypeString(typeString: string): {
  size: string
  type: string
  alignment: string
} {
  const segments = typeString.split(',').map((s) => s.trim())
  const [sizeAndType, ...rest] = segments
  const alignment = rest.at(-1) ?? ''
  const [sizeToken, ...typeWords] = sizeAndType.split(' ')
  const size = SIZE_ABBREVIATIONS[sizeToken] ?? sizeToken
  return { size, type: typeWords.join(' '), alignment }
}

const SPEED_PREFIXES = ['fly', 'swim', 'climb', 'burrow', 'hover'] as const

function parseSpeed(speedEntries: string[]): Record<string, string> {
  const speed: Record<string, string> = {}
  for (const entry of speedEntries) {
    const prefix = SPEED_PREFIXES.find((p) => entry.startsWith(p))
    if (prefix) {
      speed[prefix] = entry.slice(prefix.length).trim()
    } else {
      speed.walk = entry
    }
  }
  return speed
}

function parseSenses(
  senseEntries: string[],
  passivePerception: number,
): Record<string, string | number> {
  const senses: Record<string, string | number> = {
    passive_perception: passivePerception,
  }
  for (const entry of senseEntries) {
    const match = entry.match(/^(.*?)\s+(\d+\s*ft\.?.*)$/)
    if (match) {
      senses[match[1].toLowerCase().replace(/\s+/g, '_')] = match[2]
    }
  }
  return senses
}

function parseChallengeRating(challenge: string): number {
  if (challenge.includes('/')) {
    const [numerator, denominator] = challenge.split('/').map(Number)
    return numerator / denominator
  }
  return Number(challenge)
}

/** Standard 5e CR -> proficiency bonus table (a published rule, not
 * Monster-Manual-specific text) — Improved Initiative's save/skill
 * modifiers already bake the bonus in, but don't expose it separately. */
function proficiencyBonusForChallengeRating(cr: number): number {
  if (cr >= 29) return 9
  if (cr >= 25) return 8
  if (cr >= 21) return 7
  if (cr >= 17) return 6
  if (cr >= 13) return 5
  if (cr >= 9) return 4
  if (cr >= 5) return 3
  return 2
}

const ABILITY_ABBREVIATIONS: Record<string, string> = {
  Str: 'str',
  Dex: 'dex',
  Con: 'con',
  Int: 'int',
  Wis: 'wis',
  Cha: 'cha',
}

function buildProficiencies(monster: ImprovedInitiativeMonster) {
  const saves = monster.Saves.map((save) => ({
    value: save.Modifier,
    proficiency: {
      index: `saving-throw-${ABILITY_ABBREVIATIONS[save.Name] ?? save.Name.toLowerCase()}`,
      name: `Saving Throw: ${save.Name}`,
    },
  }))
  const skills = monster.Skills.map((skill) => ({
    value: skill.Modifier,
    proficiency: {
      index: `skill-${slugify(skill.Name)}`,
      name: `Skill: ${skill.Name}`,
    },
  }))
  return [...saves, ...skills]
}

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

function mapMonster(monster: ImprovedInitiativeMonster) {
  const { size, type, alignment } = parseTypeString(monster.Type)
  const challengeRating = parseChallengeRating(monster.Challenge)
  const perceptionSkill = monster.Skills.find((s) => s.Name === 'Perception')
  const passivePerception =
    10 + (perceptionSkill?.Modifier ?? abilityModifier(monster.Abilities.Wis))

  return {
    index: slugify(monster.Name),
    name: monster.Name,
    size,
    type,
    alignment,
    armor_class: [{ type: 'natural', value: monster.AC.Value }],
    hit_points: monster.HP.Value,
    hit_dice: monster.HP.Notes.replace(/[()]/g, ''),
    speed: parseSpeed(monster.Speed),
    strength: monster.Abilities.Str,
    dexterity: monster.Abilities.Dex,
    constitution: monster.Abilities.Con,
    intelligence: monster.Abilities.Int,
    wisdom: monster.Abilities.Wis,
    charisma: monster.Abilities.Cha,
    challenge_rating: challengeRating,
    proficiency_bonus: proficiencyBonusForChallengeRating(challengeRating),
    proficiencies: buildProficiencies(monster),
    damage_vulnerabilities: monster.DamageVulnerabilities,
    damage_resistances: monster.DamageResistances,
    damage_immunities: monster.DamageImmunities,
    condition_immunities: monster.ConditionImmunities.map((name) => ({
      index: slugify(name),
      name,
    })),
    senses: parseSenses(monster.Senses, passivePerception),
    languages: monster.Languages.join(', '),
    special_abilities: monster.Traits.map((trait) => ({
      name: trait.Name,
      desc: trait.Content,
    })),
    actions: monster.Actions.map((action) => ({
      name: action.Name,
      desc: action.Content,
    })),
    reactions: monster.Reactions.map((reaction) => ({
      name: reaction.Name,
      desc: reaction.Content,
    })),
    legendary_actions: monster.LegendaryActions.map((legendaryAction) => ({
      name: legendaryAction.Name,
      desc: legendaryAction.Content,
    })),
    source: MONSTER_MANUAL_SOURCE,
  }
}

async function main() {
  const raw: Record<string, string> = JSON.parse(
    readFileSync(MONSTER_MANUAL_PATH, 'utf-8'),
  )

  const parsedMonsters: ImprovedInitiativeMonster[] = []
  let malformed = 0
  for (const value of Object.values(raw)) {
    let monster: ImprovedInitiativeMonster
    try {
      monster = JSON.parse(value)
    } catch {
      malformed++
      continue
    }
    if (!monster?.Name) {
      malformed++
      continue
    }
    parsedMonsters.push(monster)
  }

  const db = await getDb()
  const collection = db.collection('monsters')
  const existingDocs = await collection
    .find({}, { projection: { _id: 0, index: 1 } })
    .toArray()
  const existingIndices = new Set(existingDocs.map((doc) => doc.index))

  // The Monster Manual export is more comprehensive than the SRD entry for
  // the same creature (legendary actions, reactions, full proficiencies), so
  // on overlap it replaces the SRD doc outright rather than being skipped.
  const seenIndices = new Set<string>()
  const docsToUpsert: Array<Record<string, unknown>> = []
  let replacedExisting = 0
  let skippedDuplicateInFile = 0

  for (const monster of parsedMonsters) {
    const doc = mapMonster(monster)
    if (seenIndices.has(doc.index)) {
      skippedDuplicateInFile++
      continue
    }
    seenIndices.add(doc.index)
    if (existingIndices.has(doc.index)) {
      replacedExisting++
    }
    docsToUpsert.push(doc)
  }

  for (const doc of docsToUpsert) {
    await collection.replaceOne({ index: doc.index }, doc, { upsert: true })
  }
  await collection.createIndex({ index: 1 }, { unique: true })
  await collection.createIndex({ name: 1 })

  console.log(`Parsed ${parsedMonsters.length} monsters from Monster Manual`)
  console.log(`Skipped ${malformed} malformed entries`)
  console.log(
    `Skipped ${skippedDuplicateInFile} duplicate names within the file`,
  )
  console.log(
    `Replaced ${replacedExisting} existing entries (SRD or prior Monster Manual seed) with the Monster Manual version`,
  )
  console.log(
    `Inserted ${docsToUpsert.length - replacedExisting} brand-new monsters`,
  )
  process.exit(0)
}

main().catch((error) => {
  console.error('Monster Manual seed failed:')
  console.error(error)
  process.exit(1)
})
