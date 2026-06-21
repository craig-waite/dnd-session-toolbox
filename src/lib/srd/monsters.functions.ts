import { createServerFn } from '@tanstack/react-start'
import { findAllMonsters, findMonsterByIndex } from './monsters.server'

export const listMonsters = createServerFn({ method: 'GET' }).handler(() =>
  findAllMonsters(),
)

export const getMonster = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findMonsterByIndex(index))
