import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import { ResourceLink } from '#/components/dm-shell/ResourceLink'
import type { SrdFeat } from '#/types/srd'

export function FeatDetail({ feat }: { feat: SrdFeat }) {
  return (
    <div>
      <p className="text-sm font-medium">{feat.name}</p>
      {feat.prerequisites.length > 0 && (
        <p className="mb-2.5 text-xs text-muted-foreground">
          Requires{' '}
          {feat.prerequisites.map((prereq, i) => (
            <span key={prereq.ability_score.index}>
              {i > 0 && ', '}
              <ResourceLink
                kind="ability-score"
                index={prereq.ability_score.index}
                label={prereq.ability_score.name}
              />{' '}
              {prereq.minimum_score}+
            </span>
          ))}
        </p>
      )}
      <Markdown>{joinDescription(feat.desc)}</Markdown>
    </div>
  )
}
