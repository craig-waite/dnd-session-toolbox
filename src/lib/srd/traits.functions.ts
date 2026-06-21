import { createServerFn } from '@tanstack/react-start'
import { findAllTraits, findTraitByIndex } from './traits.server'

export const listTraits = createServerFn({ method: 'GET' }).handler(() =>
  findAllTraits(),
)

export const getTrait = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findTraitByIndex(index))
