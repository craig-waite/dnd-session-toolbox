import { createServerFn } from '@tanstack/react-start'
import {
  findAbilityScoreByIndex,
  findAllAbilityScores,
} from './ability-scores.server'

export const listAbilityScores = createServerFn({ method: 'GET' }).handler(() =>
  findAllAbilityScores(),
)

export const getAbilityScore = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findAbilityScoreByIndex(index))
