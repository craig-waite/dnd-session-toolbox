import { createServerFn } from '@tanstack/react-start'
import {
  findAllProficiencies,
  findProficiencyByIndex,
} from './proficiencies.server'

export const listProficiencies = createServerFn({ method: 'GET' }).handler(() =>
  findAllProficiencies(),
)

export const getProficiency = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findProficiencyByIndex(index))
