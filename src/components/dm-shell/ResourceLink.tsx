import { useDmShellNavigation } from '#/lib/dm-shell/navigation-context'
import type { TabKind } from '#/types/dm-shell'

interface ResourceLinkProps {
  kind: TabKind
  index: string
  label: string
}

export function ResourceLink({ kind, index, label }: ResourceLinkProps) {
  const { openResource } = useDmShellNavigation()
  return (
    <button
      type="button"
      onClick={() => openResource(kind, index, label)}
      className="text-primary underline-offset-2 hover:underline"
    >
      {label}
    </button>
  )
}

interface ResourceLinkListProps {
  kind: TabKind
  items: Array<{ index: string; name: string }>
}

export function ResourceLinkList({ kind, items }: ResourceLinkListProps) {
  return (
    <>
      {items.map((item, i) => (
        <span key={item.index}>
          {i > 0 && ', '}
          <ResourceLink kind={kind} index={item.index} label={item.name} />
        </span>
      ))}
    </>
  )
}
