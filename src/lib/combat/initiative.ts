import { abilityModifier } from '#/lib/utils'
import type { SrdMonster } from '#/types/srd'

export type InitiativeModifierSource =
  | 'Initiative'
  | 'Dex + Prof'
  | 'Dex'
  | 'None'

export interface InitiativeModifier {
  value: number
  source: InitiativeModifierSource
}

/**
 * Priority order: an explicit initiative bonus (custom/homebrew monsters only —
 * not an SRD field) > Dex modifier + proficiency bonus (if proficient in Dex
 * saves) > plain Dex modifier > no modifier at all.
 */
export function getInitiativeModifier(
  monster: SrdMonster & { initiative_bonus?: number },
): InitiativeModifier {
  if (monster.initiative_bonus != null) {
    return { value: monster.initiative_bonus, source: 'Initiative' }
  }

  if (monster.dexterity == null) {
    return { value: 0, source: 'None' }
  }

  const dexMod = abilityModifier(monster.dexterity)
  const isDexProficient = monster.proficiencies?.some(
    (p) => p.proficiency.index === 'saving-throw-dex',
  )

  if (isDexProficient && monster.proficiency_bonus != null) {
    return { value: dexMod + monster.proficiency_bonus, source: 'Dex + Prof' }
  }

  return { value: dexMod, source: 'Dex' }
}

export interface InitiativeRoll {
  roll: number
  modifier: InitiativeModifier
  total: number
  detail: string
}

export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1
}

export function rollInitiative(
  monster: SrdMonster & { initiative_bonus?: number },
): InitiativeRoll {
  const modifier = getInitiativeModifier(monster)
  const roll = rollD20()
  const total = roll + modifier.value
  const sign = modifier.value >= 0 ? '+' : ''
  const detail =
    modifier.source === 'None'
      ? `${roll} = ${total}`
      : `${roll} ${sign}${modifier.value} (${modifier.source}) = ${total}`

  return { roll, modifier, total, detail }
}
