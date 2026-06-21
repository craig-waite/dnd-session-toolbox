export interface SrdMonster {
  index: string
  name: string
  source: string
  size: string
  type: string
  alignment: string
  armor_class: Array<{ type: string; value: number }>
  hit_points: number
  hit_dice: string
  speed: Partial<
    Record<'walk' | 'burrow' | 'climb' | 'fly' | 'swim' | 'hover', string>
  >
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  senses?: Record<string, string | number>
  languages?: string
  challenge_rating: number
  proficiency_bonus?: number
  proficiencies?: Array<{
    value: number
    proficiency: { index: string; name: string }
  }>
  damage_resistances?: string[]
  damage_immunities?: string[]
  damage_vulnerabilities?: string[]
  condition_immunities?: Array<{ index: string; name: string }>
  special_abilities?: Array<{ name: string; desc: string }>
  actions?: Array<{ name: string; desc: string }>
  legendary_actions?: Array<{ name: string; desc: string }>
  reactions?: Array<{ name: string; desc: string }>
}

export interface SrdSpell {
  index: string
  name: string
  source: string
  desc: string[]
  higher_level?: string[]
  range: string
  components: string[]
  material?: string
  ritual: boolean
  duration: string
  concentration: boolean
  casting_time: string
  level: number
  school: { index: string; name: string }
  classes: Array<{ index: string; name: string }>
}

export interface SrdEquipment {
  index: string
  name: string
  source: string
  equipment_category: { index: string; name: string }
  gear_category?: { index: string; name: string }
  cost: { quantity: number; unit: string }
  weight?: number
  desc?: string[]
  weapon_category?: string
  weapon_range?: string
  damage?: { damage_dice: string; damage_type: { name: string } }
  two_handed_damage?: { damage_dice: string; damage_type: { name: string } }
  properties?: Array<{ index: string; name: string }>
  armor_category?: string
  armor_class?: { base: number; dex_bonus: boolean; max_bonus?: number }
  str_minimum?: number
  stealth_disadvantage?: boolean
}

export interface SrdMagicItem {
  index: string
  name: string
  source: string
  equipment_category: { index: string; name: string }
  rarity: { name: string }
  variant: boolean
  desc: string[]
}

export type RuleCategory = 'rule' | 'condition' | 'skill'

export interface SrdRuleEntry {
  index: string
  name: string
  source: string
  category: RuleCategory
  desc: string[]
  ability_score?: { index: string; name: string }
}

export interface SrdClass {
  index: string
  name: string
  source: string
  hit_die: number
  proficiencies: Array<{ index: string; name: string }>
  saving_throws: Array<{ index: string; name: string }>
  subclasses: Array<{ index: string; name: string }>
  spellcasting?: { spellcasting_ability: { index: string; name: string } }
}

export interface SrdSubclass {
  index: string
  name: string
  source: string
  class: { index: string; name: string }
  subclass_flavor: string
  desc: string[]
}

export interface SrdFeature {
  index: string
  name: string
  source: string
  class: { index: string; name: string }
  subclass?: { index: string; name: string }
  level: number
  desc: string[]
}

export type RaceCategory = 'race' | 'subrace'

export interface SrdRaceEntry {
  index: string
  name: string
  source: string
  category: RaceCategory
  speed?: number
  size?: string
  ability_bonuses: Array<{
    ability_score: { index: string; name: string }
    bonus: number
  }>
  traits: Array<{ index: string; name: string }>
  desc?: string
  parentRace?: { index: string; name: string }
}

export interface SrdTrait {
  index: string
  name: string
  source: string
  desc: string[]
  races: Array<{ index: string; name: string }>
  subraces: Array<{ index: string; name: string }>
}

export interface SrdMagicSchool {
  index: string
  name: string
  source: string
  desc: string[]
}

export interface SrdWeaponProperty {
  index: string
  name: string
  source: string
  desc: string[]
}

export interface SrdAbilityScore {
  index: string
  name: string
  source: string
  full_name: string
  desc: string[]
  skills: Array<{ index: string; name: string }>
}

export interface SrdEquipmentCategory {
  index: string
  name: string
  source: string
  equipment: Array<{ index: string; name: string }>
}

export interface SrdProficiency {
  index: string
  name: string
  source: string
  type: string
  classes: Array<{ index: string; name: string }>
  races: Array<{ index: string; name: string }>
}

export interface SrdAlignment {
  index: string
  name: string
  source: string
  abbreviation: string
  desc: string[]
}

export interface SrdLanguage {
  index: string
  name: string
  source: string
  type: string
  typical_speakers: string[]
  script?: string
}

export interface SrdDamageType {
  index: string
  name: string
  source: string
  desc: string[]
}

export interface SrdBackground {
  index: string
  name: string
  source: string
  starting_proficiencies: Array<{ index: string; name: string }>
  starting_gold: { quantity: number; unit: string }
  starting_equipment: Array<{
    equipment: { index: string; name: string }
    quantity: number
  }>
  feature: { name: string; desc: string[] }
}

export interface SrdFeat {
  index: string
  name: string
  source: string
  prerequisites: Array<{
    ability_score: { index: string; name: string }
    minimum_score: number
  }>
  desc: string[]
}

export interface SrdClassLevel {
  index: string
  level: number
  class: { index: string; name: string }
  prof_bonus: number
  features: Array<{ index: string; name: string }>
  spellcasting?: {
    cantrips_known?: number
    spell_slots_level_1?: number
    spell_slots_level_2?: number
    spell_slots_level_3?: number
    spell_slots_level_4?: number
    spell_slots_level_5?: number
    spell_slots_level_6?: number
    spell_slots_level_7?: number
    spell_slots_level_8?: number
    spell_slots_level_9?: number
  }
  class_specific?: Record<
    string,
    number | string | boolean | Record<string, number | string | boolean>
  >
}
