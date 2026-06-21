import { createServerFn } from '@tanstack/react-start'
import { findAllRaceEntries, findRaceEntryByIndex } from './races.server'

export const listRaceEntries = createServerFn({ method: 'GET' }).handler(() =>
  findAllRaceEntries(),
)

export const getRaceEntry = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findRaceEntryByIndex(index))
