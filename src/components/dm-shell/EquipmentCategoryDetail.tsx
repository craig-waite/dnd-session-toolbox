import { ResourceLinkList } from '#/components/dm-shell/ResourceLink'
import type { SrdEquipmentCategory } from '#/types/srd'

export function EquipmentCategoryDetail({
  category,
}: {
  category: SrdEquipmentCategory
}) {
  return (
    <div>
      <p className="text-sm font-medium">{category.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">Equipment category</p>
      {category.equipment.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Items:{' '}
          <ResourceLinkList kind="equipment" items={category.equipment} />
        </p>
      )}
    </div>
  )
}
