import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import { ResourceLink } from '#/components/dm-shell/ResourceLink'
import type { SrdFeature } from '#/types/srd'

export function FeatureDetail({ feature }: { feature: SrdFeature }) {
  return (
    <div>
      <p className="text-sm font-medium">{feature.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        <ResourceLink
          kind="class"
          index={feature.class.index}
          label={feature.class.name}
        />
        {feature.subclass && (
          <>
            {' — '}
            <ResourceLink
              kind="subclass"
              index={feature.subclass.index}
              label={feature.subclass.name}
            />
          </>
        )}
        {' — '}Level {feature.level}
      </p>
      <Markdown>{joinDescription(feature.desc)}</Markdown>
    </div>
  )
}
