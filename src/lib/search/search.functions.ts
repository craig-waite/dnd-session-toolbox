import { createServerFn } from '@tanstack/react-start'
import { findSearchResults } from './search.server'

export const searchAll = createServerFn({ method: 'GET' })
  .validator((query: string) => query)
  .handler(({ data: query }) => findSearchResults(query))
