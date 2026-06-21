import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import { ResourceLink } from '#/components/dm-shell/ResourceLink'
import { Badge } from '#/components/ui/badge'
import type { SrdMagicItem } from '#/types/srd'

export function MagicItemDetail({ item }: { item: SrdMagicItem }) {
  return (
    <div>
      <p className="text-sm font-medium">{item.name}</p>
      <div className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ResourceLink
          kind="equipment-category"
          index={item.equipment_category.index}
          label={item.equipment_category.name}
        />
        <Badge variant="secondary" className="text-[11px]">
          {item.rarity.name}
        </Badge>
        {item.variant && <span>(variant)</span>}
      </div>
      <Markdown>{joinDescription(item.desc)}</Markdown>
    </div>
  )
}
