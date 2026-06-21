export type ActivityId =
  | 'rules'
  | 'monsters'
  | 'spells'
  | 'equipment'
  | 'magic-items'
  | 'classes'
  | 'subclasses'
  | 'features'
  | 'races'
  | 'traits'
  | 'magic-schools'
  | 'weapon-properties'
  | 'ability-scores'
  | 'equipment-categories'
  | 'proficiencies'
  | 'alignments'
  | 'languages'
  | 'damage-types'
  | 'backgrounds'
  | 'feats'
  | 'characters'
  | 'campaign'
  | 'audio'

export interface ActivityItem {
  id: ActivityId
  label: string
  icon: string
}

export type TabKind =
  | 'monster'
  | 'spell'
  | 'equipment'
  | 'magic-item'
  | 'rule-entry'
  | 'class'
  | 'subclass'
  | 'feature'
  | 'race-entry'
  | 'trait'
  | 'magic-school'
  | 'weapon-property'
  | 'ability-score'
  | 'equipment-category'
  | 'proficiency'
  | 'alignment'
  | 'language'
  | 'damage-type'
  | 'background'
  | 'feat'

export interface TabItem {
  /** Composite `${kind}:${index}` key — unique across all resource kinds. */
  id: string
  /** The bare SRD `index` (or table-resource tabId), unique only per kind. */
  index: string
  title: string
  kind: TabKind
}

export interface Combatant {
  id: string
  name: string
  currentHp: number
  maxHp: number
  isActiveTurn: boolean
}
