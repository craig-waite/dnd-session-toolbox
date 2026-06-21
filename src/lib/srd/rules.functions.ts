import { createServerFn } from '@tanstack/react-start'
import { findAllRuleEntries, findRuleEntryByIndex } from './rules.server'

export const listRuleEntries = createServerFn({ method: 'GET' }).handler(() =>
  findAllRuleEntries(),
)

export const getRuleEntry = createServerFn({ method: 'GET' })
  .validator((index: string) => index)
  .handler(({ data: index }) => findRuleEntryByIndex(index))
