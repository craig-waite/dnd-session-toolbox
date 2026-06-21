import { createServerFn } from '@tanstack/react-start'
import { findAllSpells, findSpellByIndex } from './spells.server'

export const listSpells = createServerFn({ method: 'GET' }).handler(() =>
  findAllSpells(),
)

export const getSpell = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findSpellByIndex(index))
