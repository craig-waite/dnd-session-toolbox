import { describe, expect, it } from 'vitest'
import type { SrdMonster } from '#/types/srd'
import { getInitiativeModifier, rollD20, rollInitiative } from './initiative'

function baseMonster(overrides: Partial<SrdMonster> = {}): SrdMonster {
  return {
    index: 'test-monster',
    name: 'Test monster',
    source: 'test',
    size: 'Medium',
    type: 'beast',
    alignment: 'unaligned',
    armor_class: [{ type: 'natural', value: 10 }],
    hit_points: 10,
    hit_dice: '2d8',
    speed: { walk: '30 ft.' },
    strength: 10,
    dexterity: 14,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    challenge_rating: 1,
    ...overrides,
  }
}

describe('getInitiativeModifier', () => {
  it('prefers an explicit initiative bonus over everything else', () => {
    const monster = baseMonster({
      dexterity: 20,
      proficiency_bonus: 4,
      proficiencies: [
        { value: 9, proficiency: { index: 'saving-throw-dex', name: '' } },
      ],
    }) as SrdMonster & { initiative_bonus: number }
    monster.initiative_bonus = 7

    expect(getInitiativeModifier(monster)).toEqual({
      value: 7,
      source: 'Initiative',
    })
  })

  it('adds proficiency bonus on top of Dex when proficient in Dex saves', () => {
    const monster = baseMonster({
      dexterity: 16, // +3
      proficiency_bonus: 4,
      proficiencies: [
        { value: 7, proficiency: { index: 'saving-throw-dex', name: '' } },
      ],
    })

    expect(getInitiativeModifier(monster)).toEqual({
      value: 7,
      source: 'Dex + Prof',
    })
  })

  it('falls back to plain Dex modifier when not proficient in Dex saves', () => {
    const monster = baseMonster({
      dexterity: 16, // +3
      proficiency_bonus: 4,
      proficiencies: [
        { value: 6, proficiency: { index: 'skill-stealth', name: '' } },
      ],
    })

    expect(getInitiativeModifier(monster)).toEqual({
      value: 3,
      source: 'Dex',
    })
  })

  it('falls back to plain Dex modifier when there are no proficiencies at all', () => {
    const monster = baseMonster({ dexterity: 8 }) // -1

    expect(getInitiativeModifier(monster)).toEqual({
      value: -1,
      source: 'Dex',
    })
  })

  it('returns no modifier when dexterity is missing entirely', () => {
    const monster = baseMonster() as Partial<SrdMonster> as SrdMonster
    // @ts-expect-error simulating malformed/custom data missing a score
    monster.dexterity = undefined

    expect(getInitiativeModifier(monster)).toEqual({ value: 0, source: 'None' })
  })
})

describe('rollD20', () => {
  it('always returns an integer between 1 and 20', () => {
    for (let i = 0; i < 200; i++) {
      const roll = rollD20()
      expect(roll).toBeGreaterThanOrEqual(1)
      expect(roll).toBeLessThanOrEqual(20)
      expect(Number.isInteger(roll)).toBe(true)
    }
  })
})

describe('rollInitiative', () => {
  it('total is always roll + modifier, and detail reflects the source', () => {
    const monster = baseMonster({ dexterity: 16 }) // +3, no proficiency
    const result = rollInitiative(monster)

    expect(result.total).toBe(result.roll + result.modifier.value)
    expect(result.detail).toContain('(Dex)')
    expect(result.detail).toContain(`= ${result.total}`)
  })

  it('omits the source annotation in the detail string when there is no modifier', () => {
    const monster = baseMonster() as Partial<SrdMonster> as SrdMonster
    // @ts-expect-error simulating malformed/custom data missing a score
    monster.dexterity = undefined
    const result = rollInitiative(monster)

    expect(result.modifier.value).toBe(0)
    expect(result.detail).toBe(`${result.roll} = ${result.total}`)
  })
})
