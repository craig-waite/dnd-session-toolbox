import { createServerFn } from '@tanstack/react-start'
import { findAllMagicItems, findMagicItemByIndex } from './magic-items.server'

export const listMagicItems = createServerFn({ method: 'GET' }).handler(() =>
  findAllMagicItems(),
)

export const getMagicItem = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findMagicItemByIndex(index))
