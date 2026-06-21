import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import type { SrdWeaponProperty } from '#/types/srd'

export function WeaponPropertyDetail({
  property,
}: {
  property: SrdWeaponProperty
}) {
  return (
    <div>
      <p className="text-sm font-medium">{property.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">Weapon property</p>
      <Markdown>{joinDescription(property.desc)}</Markdown>
    </div>
  )
}
