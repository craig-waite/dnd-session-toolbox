import { Markdown } from '#/components/dm-shell/Markdown'
import {
  ResourceLink,
  ResourceLinkList,
} from '#/components/dm-shell/ResourceLink'
import { StatCard } from '#/components/dm-shell/StatCard'
import type { SrdEquipment } from '#/types/srd'

export function EquipmentDetail({ equipment }: { equipment: SrdEquipment }) {
  const isWeapon = equipment.equipment_category.index === 'weapon'
  const isArmor = equipment.equipment_category.index === 'armor'

  return (
    <div>
      <p className="text-sm font-medium">{equipment.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        <ResourceLink
          kind="equipment-category"
          index={equipment.equipment_category.index}
          label={equipment.equipment_category.name}
        />
        {equipment.gear_category && (
          <>
            {' — '}
            <ResourceLink
              kind="equipment-category"
              index={equipment.gear_category.index}
              label={equipment.gear_category.name}
            />
          </>
        )}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <StatCard
          label="Cost"
          value={`${equipment.cost.quantity} ${equipment.cost.unit}`}
        />
        {equipment.weight !== undefined && (
          <StatCard label="Weight" value={`${equipment.weight} lb.`} />
        )}
        {isWeapon && equipment.damage && (
          <StatCard
            label="Damage"
            value={`${equipment.damage.damage_dice} ${equipment.damage.damage_type.name.toLowerCase()}`}
          />
        )}
        {isWeapon && equipment.weapon_range && (
          <StatCard label="Range" value={equipment.weapon_range} />
        )}
        {isArmor && equipment.armor_class && (
          <StatCard
            label="AC"
            value={`${equipment.armor_class.base}${equipment.armor_class.dex_bonus ? ' + Dex' : ''}`}
          />
        )}
        {isArmor && equipment.str_minimum ? (
          <StatCard
            label="Str required"
            value={String(equipment.str_minimum)}
          />
        ) : null}
      </div>

      {equipment.properties && equipment.properties.length > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Properties:{' '}
          <ResourceLinkList
            kind="weapon-property"
            items={equipment.properties}
          />
        </p>
      )}

      {equipment.stealth_disadvantage && (
        <p className="mb-3 text-xs text-muted-foreground">
          Imposes disadvantage on Stealth checks.
        </p>
      )}

      {equipment.desc?.map((paragraph) => (
        <Markdown key={paragraph.slice(0, 40)}>{paragraph}</Markdown>
      ))}
    </div>
  )
}
