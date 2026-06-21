import type { ReactNode } from 'react'
import { AbilityScoreDetail } from '#/components/dm-shell/AbilityScoreDetail'
import { AlignmentsTable } from '#/components/dm-shell/AlignmentsTable'
import { BackgroundDetail } from '#/components/dm-shell/BackgroundDetail'
import { ClassDetail } from '#/components/dm-shell/ClassDetail'
import { DamageTypesTable } from '#/components/dm-shell/DamageTypesTable'
import { EquipmentCategoryDetail } from '#/components/dm-shell/EquipmentCategoryDetail'
import { EquipmentDetail } from '#/components/dm-shell/EquipmentDetail'
import { FeatDetail } from '#/components/dm-shell/FeatDetail'
import { FeatureDetail } from '#/components/dm-shell/FeatureDetail'
import { LanguagesTable } from '#/components/dm-shell/LanguagesTable'
import { MagicItemDetail } from '#/components/dm-shell/MagicItemDetail'
import { MagicSchoolDetail } from '#/components/dm-shell/MagicSchoolDetail'
import { MonsterStatBlock } from '#/components/dm-shell/MonsterStatBlock'
import { ProficiencyDetail } from '#/components/dm-shell/ProficiencyDetail'
import { RaceEntryDetail } from '#/components/dm-shell/RaceEntryDetail'
import { RuleEntryDetail } from '#/components/dm-shell/RuleEntryDetail'
import { SpellDetail } from '#/components/dm-shell/SpellDetail'
import { SubclassDetail } from '#/components/dm-shell/SubclassDetail'
import { TraitDetail } from '#/components/dm-shell/TraitDetail'
import { WeaponPropertyDetail } from '#/components/dm-shell/WeaponPropertyDetail'
import {
  getAbilityScore,
  listAbilityScores,
} from '#/lib/srd/ability-scores.functions'
import { listAlignments } from '#/lib/srd/alignments.functions'
import { getBackground, listBackgrounds } from '#/lib/srd/backgrounds.functions'
import { getClass, listClasses } from '#/lib/srd/classes.functions'
import { listDamageTypes } from '#/lib/srd/damage-types.functions'
import { getEquipmentItem, listEquipment } from '#/lib/srd/equipment.functions'
import {
  getEquipmentCategory,
  listEquipmentCategories,
} from '#/lib/srd/equipment-categories.functions'
import { getFeat, listFeats } from '#/lib/srd/feats.functions'
import { getFeature, listFeatures } from '#/lib/srd/features.functions'
import { listLanguages } from '#/lib/srd/languages.functions'
import { getMagicItem, listMagicItems } from '#/lib/srd/magic-items.functions'
import {
  getMagicSchool,
  listMagicSchools,
} from '#/lib/srd/magic-schools.functions'
import { getMonster, listMonsters } from '#/lib/srd/monsters.functions'
import {
  getProficiency,
  listProficiencies,
} from '#/lib/srd/proficiencies.functions'
import { getRaceEntry, listRaceEntries } from '#/lib/srd/races.functions'
import { getRuleEntry, listRuleEntries } from '#/lib/srd/rules.functions'
import { getSpell, listSpells } from '#/lib/srd/spells.functions'
import { getSubclass, listSubclasses } from '#/lib/srd/subclasses.functions'
import { getTrait, listTraits } from '#/lib/srd/traits.functions'
import {
  getWeaponProperty,
  listWeaponProperties,
} from '#/lib/srd/weapon-properties.functions'
import type { ActivityId, TabKind } from '#/types/dm-shell'

export interface PanelListItem {
  index: string
  name: string
}

export interface ResourceConfig {
  kind: TabKind
  activity: ActivityId
  panelTitle: string
  resultLabel: string
  listQueryKey: readonly unknown[]
  listFn: () => Promise<PanelListItem[]>
  detailQueryKey: (id: string) => readonly unknown[]
  detailFn: (id: string) => Promise<unknown>
  renderDetail: (item: unknown) => ReactNode
}

interface DefineResourceArgs<TDetail> {
  kind: TabKind
  activity: ActivityId
  panelTitle: string
  resultLabel: string
  listFn: () => Promise<PanelListItem[]>
  detailFn: (id: string) => Promise<TDetail | null | undefined>
  renderDetail: (item: TDetail) => ReactNode
}

function defineResource<TDetail>(
  config: DefineResourceArgs<TDetail>,
): ResourceConfig {
  return {
    kind: config.kind,
    activity: config.activity,
    panelTitle: config.panelTitle,
    resultLabel: config.resultLabel,
    listQueryKey: [config.kind, 'list'],
    listFn: config.listFn,
    detailQueryKey: (id) => [config.kind, 'detail', id],
    detailFn: config.detailFn,
    renderDetail: (item) => config.renderDetail(item as TDetail),
  }
}

export const resourceConfigs: ResourceConfig[] = [
  defineResource({
    kind: 'monster',
    activity: 'monsters',
    panelTitle: 'Monsters',
    resultLabel: 'Monster',
    listFn: () => listMonsters(),
    detailFn: (index) => getMonster({ data: index }),
    renderDetail: (monster) => <MonsterStatBlock monster={monster} />,
  }),
  defineResource({
    kind: 'spell',
    activity: 'spells',
    panelTitle: 'Spells',
    resultLabel: 'Spell',
    listFn: () => listSpells(),
    detailFn: (index) => getSpell({ data: index }),
    renderDetail: (spell) => <SpellDetail spell={spell} />,
  }),
  defineResource({
    kind: 'equipment',
    activity: 'equipment',
    panelTitle: 'Equipment',
    resultLabel: 'Equipment',
    listFn: () => listEquipment(),
    detailFn: (index) => getEquipmentItem({ data: index }),
    renderDetail: (item) => <EquipmentDetail equipment={item} />,
  }),
  defineResource({
    kind: 'magic-item',
    activity: 'magic-items',
    panelTitle: 'Magic items',
    resultLabel: 'Magic item',
    listFn: () => listMagicItems(),
    detailFn: (index) => getMagicItem({ data: index }),
    renderDetail: (item) => <MagicItemDetail item={item} />,
  }),
  defineResource({
    kind: 'rule-entry',
    activity: 'rules',
    panelTitle: 'Rules',
    resultLabel: 'Rule',
    listFn: () => listRuleEntries(),
    detailFn: (index) => getRuleEntry({ data: index }),
    renderDetail: (entry) => <RuleEntryDetail entry={entry} />,
  }),
  defineResource({
    kind: 'class',
    activity: 'classes',
    panelTitle: 'Classes',
    resultLabel: 'Class',
    listFn: () => listClasses(),
    detailFn: (index) => getClass({ data: index }),
    renderDetail: (classData) => <ClassDetail classData={classData} />,
  }),
  defineResource({
    kind: 'subclass',
    activity: 'subclasses',
    panelTitle: 'Subclasses',
    resultLabel: 'Subclass',
    listFn: () => listSubclasses(),
    detailFn: (index) => getSubclass({ data: index }),
    renderDetail: (subclass) => <SubclassDetail subclass={subclass} />,
  }),
  defineResource({
    kind: 'feature',
    activity: 'features',
    panelTitle: 'Features',
    resultLabel: 'Feature',
    listFn: () => listFeatures(),
    detailFn: (index) => getFeature({ data: index }),
    renderDetail: (feature) => <FeatureDetail feature={feature} />,
  }),
  defineResource({
    kind: 'race-entry',
    activity: 'races',
    panelTitle: 'Races',
    resultLabel: 'Race',
    listFn: () => listRaceEntries(),
    detailFn: (index) => getRaceEntry({ data: index }),
    renderDetail: (entry) => <RaceEntryDetail entry={entry} />,
  }),
  defineResource({
    kind: 'trait',
    activity: 'traits',
    panelTitle: 'Traits',
    resultLabel: 'Trait',
    listFn: () => listTraits(),
    detailFn: (index) => getTrait({ data: index }),
    renderDetail: (trait) => <TraitDetail trait={trait} />,
  }),
  defineResource({
    kind: 'magic-school',
    activity: 'magic-schools',
    panelTitle: 'Magic schools',
    resultLabel: 'Magic school',
    listFn: () => listMagicSchools(),
    detailFn: (index) => getMagicSchool({ data: index }),
    renderDetail: (school) => <MagicSchoolDetail school={school} />,
  }),
  defineResource({
    kind: 'weapon-property',
    activity: 'weapon-properties',
    panelTitle: 'Weapon properties',
    resultLabel: 'Weapon property',
    listFn: () => listWeaponProperties(),
    detailFn: (index) => getWeaponProperty({ data: index }),
    renderDetail: (property) => <WeaponPropertyDetail property={property} />,
  }),
  defineResource({
    kind: 'ability-score',
    activity: 'ability-scores',
    panelTitle: 'Ability scores',
    resultLabel: 'Ability score',
    listFn: () => listAbilityScores(),
    detailFn: (index) => getAbilityScore({ data: index }),
    renderDetail: (abilityScore) => (
      <AbilityScoreDetail abilityScore={abilityScore} />
    ),
  }),
  defineResource({
    kind: 'equipment-category',
    activity: 'equipment-categories',
    panelTitle: 'Equipment categories',
    resultLabel: 'Equipment category',
    listFn: () => listEquipmentCategories(),
    detailFn: (index) => getEquipmentCategory({ data: index }),
    renderDetail: (category) => <EquipmentCategoryDetail category={category} />,
  }),
  defineResource({
    kind: 'proficiency',
    activity: 'proficiencies',
    panelTitle: 'Proficiencies',
    resultLabel: 'Proficiency',
    listFn: () => listProficiencies(),
    detailFn: (index) => getProficiency({ data: index }),
    renderDetail: (proficiency) => (
      <ProficiencyDetail proficiency={proficiency} />
    ),
  }),
  defineResource({
    kind: 'background',
    activity: 'backgrounds',
    panelTitle: 'Backgrounds',
    resultLabel: 'Background',
    listFn: () => listBackgrounds(),
    detailFn: (index) => getBackground({ data: index }),
    renderDetail: (background) => <BackgroundDetail background={background} />,
  }),
  defineResource({
    kind: 'feat',
    activity: 'feats',
    panelTitle: 'Feats',
    resultLabel: 'Feat',
    listFn: () => listFeats(),
    detailFn: (index) => getFeat({ data: index }),
    renderDetail: (feat) => <FeatDetail feat={feat} />,
  }),
]

export const resourceByActivity = new Map(
  resourceConfigs.map((r) => [r.activity, r]),
)
export const resourceByKind = new Map(resourceConfigs.map((r) => [r.kind, r]))

/**
 * For glossaries too thin to justify a per-item detail page (no prose beyond
 * a sentence or two, nothing else links to a specific entry) — the whole
 * collection renders as one table in one tab, instead of a side-panel list
 * that drills into per-item tabs like `resourceConfigs` does.
 */
export interface TableResourceConfig {
  kind: TabKind
  activity: ActivityId
  tabId: string
  tabTitle: string
  listQueryKey: readonly unknown[]
  listFn: () => Promise<unknown[]>
  renderTable: (items: unknown[]) => ReactNode
}

interface DefineTableResourceArgs<TItem> {
  kind: TabKind
  activity: ActivityId
  tabTitle: string
  listFn: () => Promise<TItem[]>
  renderTable: (items: TItem[]) => ReactNode
}

function defineTableResource<TItem>(
  config: DefineTableResourceArgs<TItem>,
): TableResourceConfig {
  return {
    kind: config.kind,
    activity: config.activity,
    tabId: `${config.kind}-table`,
    tabTitle: config.tabTitle,
    listQueryKey: [config.kind, 'table'],
    listFn: config.listFn,
    renderTable: (items) => config.renderTable(items as TItem[]),
  }
}

export const tableResourceConfigs: TableResourceConfig[] = [
  defineTableResource({
    kind: 'alignment',
    activity: 'alignments',
    tabTitle: 'Alignments',
    listFn: () => listAlignments(),
    renderTable: (alignments) => <AlignmentsTable alignments={alignments} />,
  }),
  defineTableResource({
    kind: 'language',
    activity: 'languages',
    tabTitle: 'Languages',
    listFn: () => listLanguages(),
    renderTable: (languages) => <LanguagesTable languages={languages} />,
  }),
  defineTableResource({
    kind: 'damage-type',
    activity: 'damage-types',
    tabTitle: 'Damage types',
    listFn: () => listDamageTypes(),
    renderTable: (damageTypes) => (
      <DamageTypesTable damageTypes={damageTypes} />
    ),
  }),
]

export const tableResourceByActivity = new Map(
  tableResourceConfigs.map((r) => [r.activity, r]),
)
export const tableResourceByKind = new Map(
  tableResourceConfigs.map((r) => [r.kind, r]),
)
