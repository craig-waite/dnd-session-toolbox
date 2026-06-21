import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import { ResourceLinkList } from '#/components/dm-shell/ResourceLink'
import type { SrdAbilityScore } from '#/types/srd'

export function AbilityScoreDetail({
  abilityScore,
}: {
  abilityScore: SrdAbilityScore
}) {
  return (
    <div>
      <p className="text-sm font-medium">{abilityScore.full_name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        {abilityScore.name}
      </p>
      <Markdown>{joinDescription(abilityScore.desc)}</Markdown>
      {abilityScore.skills.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Skills:{' '}
          <ResourceLinkList kind="rule-entry" items={abilityScore.skills} />
        </p>
      )}
    </div>
  )
}
