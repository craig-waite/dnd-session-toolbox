import { Swords } from 'lucide-react'
import { ResourceLinkList } from '#/components/dm-shell/ResourceLink'
import { StatCard } from '#/components/dm-shell/StatCard'
import { Button } from '#/components/ui/button'
import { useDmShellNavigation } from '#/lib/dm-shell/navigation-context'
import { slugify } from '#/lib/utils'
import type { SrdMonster } from '#/types/srd'

function toLinkItems(names: string[]) {
  return names.map((name) => ({ index: slugify(name), name }))
}

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

function AbilityScoreValue({ score }: { score: number }) {
  const modifier = abilityModifier(score)
  const sign = modifier >= 0 ? '+' : ''
  return (
    <span>
      <span className="text-sm font-medium">
        {sign}
        {modifier}
      </span>{' '}
      <span className="text-[11px] text-muted-foreground">{score}</span>
    </span>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <p className="mb-1.5 border-b pb-1 text-sm font-medium tracking-wide uppercase">
      {children}
    </p>
  )
}

function FieldChip({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5">
      <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-xs text-muted-foreground">{children}</span>
    </div>
  )
}

function NarrativeSection({
  heading,
  entries,
}: {
  heading: string
  entries: Array<{ name: string; desc: string }>
}) {
  return (
    <div className="mb-3">
      <SectionHeading>{heading}</SectionHeading>
      {entries.map((entry) => (
        <p key={entry.name} className="mb-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{entry.name}.</span>{' '}
          {entry.desc}
        </p>
      ))}
    </div>
  )
}

export function MonsterStatBlock({ monster }: { monster: SrdMonster }) {
  const { addMonsterToCombat } = useDmShellNavigation()
  const ac = monster.armor_class[0]?.value ?? '—'
  const speed = Object.values(monster.speed)[0] ?? '—'

  const saveProficiencies = monster.proficiencies?.filter((p) =>
    p.proficiency.index.startsWith('saving-throw'),
  )
  const skillProficiencies = monster.proficiencies?.filter((p) =>
    p.proficiency.index.startsWith('skill'),
  )

  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-medium">{monster.name}</p>
        <p className="text-xs text-muted-foreground">
          {monster.size} {monster.type}, {monster.alignment}
        </p>
      </div>

      <div className="grid grid-cols-[90px_1fr] gap-4">
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex h-auto flex-col gap-0 px-2 py-2 text-[11px] leading-tight"
            onClick={() => addMonsterToCombat(monster)}
          >
            <span className="flex items-center gap-1">
              <Swords size={13} aria-hidden="true" />
              Add
            </span>
            <span>to combat</span>
          </Button>
          <StatCard
            label="STR"
            value={<AbilityScoreValue score={monster.strength} />}
          />
          <StatCard
            label="DEX"
            value={<AbilityScoreValue score={monster.dexterity} />}
          />
          <StatCard
            label="CON"
            value={<AbilityScoreValue score={monster.constitution} />}
          />
          <StatCard
            label="INT"
            value={<AbilityScoreValue score={monster.intelligence} />}
          />
          <StatCard
            label="WIS"
            value={<AbilityScoreValue score={monster.wisdom} />}
          />
          <StatCard
            label="CHA"
            value={<AbilityScoreValue score={monster.charisma} />}
          />
        </div>

        <div className="min-w-0">
          <div className="mb-3 grid grid-cols-4 gap-2">
            <StatCard label="AC" value={String(ac)} />
            <StatCard label="HP" value={String(monster.hit_points)} />
            <StatCard label="Speed" value={speed} />
            <StatCard
              label="Challenge"
              value={String(monster.challenge_rating)}
            />
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {saveProficiencies && saveProficiencies.length > 0 && (
              <FieldChip label="Saves">
                <ResourceLinkList
                  kind="proficiency"
                  items={saveProficiencies.map((p) => ({
                    index: p.proficiency.index,
                    name: `${p.proficiency.name.replace('Saving Throw: ', '')} +${p.value}`,
                  }))}
                />
              </FieldChip>
            )}
            {skillProficiencies && skillProficiencies.length > 0 && (
              <FieldChip label="Skills">
                <ResourceLinkList
                  kind="proficiency"
                  items={skillProficiencies.map((p) => ({
                    index: p.proficiency.index,
                    name: `${p.proficiency.name.replace('Skill: ', '')} +${p.value}`,
                  }))}
                />
              </FieldChip>
            )}
            {monster.damage_vulnerabilities &&
              monster.damage_vulnerabilities.length > 0 && (
                <FieldChip label="Vulnerable">
                  <ResourceLinkList
                    kind="damage-type"
                    items={toLinkItems(monster.damage_vulnerabilities)}
                  />
                </FieldChip>
              )}
            {monster.damage_resistances &&
              monster.damage_resistances.length > 0 && (
                <FieldChip label="Resist">
                  <ResourceLinkList
                    kind="damage-type"
                    items={toLinkItems(monster.damage_resistances)}
                  />
                </FieldChip>
              )}
            {monster.damage_immunities &&
              monster.damage_immunities.length > 0 && (
                <FieldChip label="Immune">
                  <ResourceLinkList
                    kind="damage-type"
                    items={toLinkItems(monster.damage_immunities)}
                  />
                </FieldChip>
              )}
            {monster.condition_immunities &&
              monster.condition_immunities.length > 0 && (
                <FieldChip label="Conditions">
                  <ResourceLinkList
                    kind="rule-entry"
                    items={monster.condition_immunities}
                  />
                </FieldChip>
              )}
            {monster.senses && Object.keys(monster.senses).length > 0 && (
              <FieldChip label="Senses">
                {Object.entries(monster.senses)
                  .map(([key, value]) => `${key.replace(/_/g, ' ')} ${value}`)
                  .join(', ')}
              </FieldChip>
            )}
            {monster.languages && (
              <FieldChip label="Languages">{monster.languages}</FieldChip>
            )}
          </div>

          {monster.actions && monster.actions.length > 0 && (
            <NarrativeSection heading="Actions" entries={monster.actions} />
          )}
          {monster.special_abilities &&
            monster.special_abilities.length > 0 && (
              <NarrativeSection
                heading="Special abilities"
                entries={monster.special_abilities}
              />
            )}
          {monster.reactions && monster.reactions.length > 0 && (
            <NarrativeSection heading="Reactions" entries={monster.reactions} />
          )}
          {monster.legendary_actions &&
            monster.legendary_actions.length > 0 && (
              <NarrativeSection
                heading="Legendary actions"
                entries={monster.legendary_actions}
              />
            )}
        </div>
      </div>
    </div>
  )
}
