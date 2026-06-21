import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import { ResourceLinkList } from '#/components/dm-shell/ResourceLink'
import type { SrdTrait } from '#/types/srd'

export function TraitDetail({ trait }: { trait: SrdTrait }) {
  return (
    <div>
      <p className="text-sm font-medium">{trait.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">Racial trait</p>
      <Markdown>{joinDescription(trait.desc)}</Markdown>
      {trait.races.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Races: <ResourceLinkList kind="race-entry" items={trait.races} />
        </p>
      )}
      {trait.subraces.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Subraces:{' '}
          <ResourceLinkList kind="race-entry" items={trait.subraces} />
        </p>
      )}
    </div>
  )
}
