import { describe, expect, it } from 'vitest'
import { applyHpDelta } from './hp'

describe('applyHpDelta', () => {
  it('subtracts damage normally', () => {
    expect(applyHpDelta(10, 20, -4)).toBe(6)
  })

  it('adds healing normally', () => {
    expect(applyHpDelta(10, 20, 5)).toBe(15)
  })

  it('clamps lethal damage at 0 instead of going negative', () => {
    expect(applyHpDelta(5, 20, -999)).toBe(0)
  })

  it('clamps overheal at maxHp', () => {
    expect(applyHpDelta(18, 20, 999)).toBe(20)
  })

  it('clamps an already-downed combatant to stay at 0 if damaged further', () => {
    expect(applyHpDelta(0, 20, -10)).toBe(0)
  })
})
