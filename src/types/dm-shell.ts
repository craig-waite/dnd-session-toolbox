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

export type CombatantKind = 'monster' | 'pc' | 'lair-action'

export interface CombatCondition {
  name: string
  duration?: number
  note?: string
}

export interface CombatResource {
  name: string
  max: number
  used: number
}

export interface Combatant {
  /** Stable per-instance id — not the SRD `index`, since a combat can hold several of the same monster. */
  id: string
  kind: CombatantKind
  /** Links back to the SRD/custom monster or PC sheet for stat-block lookup mid-fight. */
  sourceIndex?: string
  name: string
  initiative: number | null
  /** e.g. "11 +3 (Dex+Prof) = 14" — shown so the DM can explain/adjudicate ties. */
  initiativeDetail?: string
  currentHp: number
  maxHp: number
  tempHp: number
  conditions: CombatCondition[]
  resources: CombatResource[]
  hasActedThisRound: boolean
}

export interface EncounterMonsterEntry {
  sourceIndex: string
  count: number
  customName?: string
}

export interface EncounterLairAction {
  name: string
  desc: string
  initiativeCount: number
}

export interface Encounter {
  id: string
  name: string
  monsters: EncounterMonsterEntry[]
  lairActions: EncounterLairAction[]
  notes?: string
}

export interface Combat {
  id: string
  round: number
  activeCombatantId: string | null
  combatants: Combatant[]
}
