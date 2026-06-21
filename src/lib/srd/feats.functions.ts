import { createServerFn } from '@tanstack/react-start'
import { findAllFeats, findFeatByIndex } from './feats.server'

export const listFeats = createServerFn({ method: 'GET' }).handler(() =>
  findAllFeats(),
)

export const getFeat = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findFeatByIndex(index))
