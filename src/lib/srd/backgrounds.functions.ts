import { createServerFn } from '@tanstack/react-start'
import { findAllBackgrounds, findBackgroundByIndex } from './backgrounds.server'

export const listBackgrounds = createServerFn({ method: 'GET' }).handler(() =>
  findAllBackgrounds(),
)

export const getBackground = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findBackgroundByIndex(index))
