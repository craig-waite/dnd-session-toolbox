import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import {
  ResourceLink,
  ResourceLinkList,
} from '#/components/dm-shell/ResourceLink'
import { StatCard } from '#/components/dm-shell/StatCard'
import type { SrdSpell } from '#/types/srd'

function levelLabel(level: number) {
  return level === 0 ? 'Cantrip' : `Level ${level}`
}

export function SpellDetail({ spell }: { spell: SrdSpell }) {
  return (
    <div>
      <p className="text-sm font-medium">{spell.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        {levelLabel(spell.level)}{' '}
        <ResourceLink
          kind="magic-school"
          index={spell.school.index}
          label={spell.school.name}
        />
        {spell.ritual ? ' (ritual)' : ''}
      </p>

      <div className="mb-4 grid w-80 grid-cols-4 gap-2">
        <StatCard label="Casting time" value={spell.casting_time} />
        <StatCard label="Range" value={spell.range} />
        <StatCard label="Components" value={spell.components.join(', ')} />
        <StatCard
          label="Duration"
          value={
            spell.concentration ? `Conc., ${spell.duration}` : spell.duration
          }
        />
      </div>

      <Markdown>{joinDescription(spell.desc)}</Markdown>

      {spell.higher_level && spell.higher_level.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            At higher levels
          </p>
          <Markdown>{joinDescription(spell.higher_level)}</Markdown>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        Classes: <ResourceLinkList kind="class" items={spell.classes} />
      </p>
    </div>
  )
}
