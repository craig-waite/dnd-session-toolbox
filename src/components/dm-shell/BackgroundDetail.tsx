import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import {
  ResourceLink,
  ResourceLinkList,
} from '#/components/dm-shell/ResourceLink'
import { StatCard } from '#/components/dm-shell/StatCard'
import type { SrdBackground } from '#/types/srd'

export function BackgroundDetail({
  background,
}: {
  background: SrdBackground
}) {
  return (
    <div>
      <p className="text-sm font-medium">{background.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">Background</p>

      <div className="mb-3 flex flex-wrap gap-2">
        <StatCard
          label="Starting gold"
          value={`${background.starting_gold.quantity} ${background.starting_gold.unit}`}
        />
      </div>

      {background.starting_proficiencies.length > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Starting proficiencies:{' '}
          <ResourceLinkList
            kind="proficiency"
            items={background.starting_proficiencies}
          />
        </p>
      )}

      {background.starting_equipment.length > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Starting equipment:{' '}
          {background.starting_equipment.map((entry, i) => (
            <span key={entry.equipment.index}>
              {i > 0 && ', '}
              <ResourceLink
                kind="equipment"
                index={entry.equipment.index}
                label={entry.equipment.name}
              />{' '}
              x{entry.quantity}
            </span>
          ))}
        </p>
      )}

      <p className="mb-1 text-xs font-medium text-muted-foreground">
        Feature: {background.feature.name}
      </p>
      <Markdown>{joinDescription(background.feature.desc)}</Markdown>
    </div>
  )
}
