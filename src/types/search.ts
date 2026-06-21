import type { ActivityId } from './dm-shell'

export interface SearchResult {
  id: string
  title: string
  subtitle: string
  activity: ActivityId
}
