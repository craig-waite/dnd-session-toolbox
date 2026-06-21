import { ResourceLinkList } from '#/components/dm-shell/ResourceLink'
import type { SrdProficiency } from '#/types/srd'

export function ProficiencyDetail({
  proficiency,
}: {
  proficiency: SrdProficiency
}) {
  return (
    <div>
      <p className="text-sm font-medium">{proficiency.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">{proficiency.type}</p>
      {proficiency.classes.length > 0 && (
        <p className="mb-1 text-xs text-muted-foreground">
          Classes: <ResourceLinkList kind="class" items={proficiency.classes} />
        </p>
      )}
      {proficiency.races.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Races:{' '}
          <ResourceLinkList kind="race-entry" items={proficiency.races} />
        </p>
      )}
    </div>
  )
}
