import { useQuery } from '@tanstack/react-query'
import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import { ResourceLink } from '#/components/dm-shell/ResourceLink'
import { getSubclassFeatures } from '#/lib/srd/subclasses.functions'
import type { SrdSubclass } from '#/types/srd'

export function SubclassDetail({ subclass }: { subclass: SrdSubclass }) {
  const featuresQuery = useQuery({
    queryKey: ['subclass', 'features', subclass.index],
    queryFn: () => getSubclassFeatures({ data: subclass.index }),
  })

  return (
    <div>
      <p className="text-sm font-medium">{subclass.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        {subclass.subclass_flavor} —{' '}
        <ResourceLink
          kind="class"
          index={subclass.class.index}
          label={subclass.class.name}
        />
      </p>

      <Markdown>{joinDescription(subclass.desc)}</Markdown>

      <p className="mb-1 text-xs font-medium text-muted-foreground">Features</p>
      {featuresQuery.isPending && (
        <p className="text-xs text-muted-foreground">Loading…</p>
      )}
      {featuresQuery.data?.map((feature) => (
        <p key={feature.index} className="mb-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            Lvl {feature.level} — {feature.name}.
          </span>{' '}
          {feature.desc[0]}
        </p>
      ))}
    </div>
  )
}
