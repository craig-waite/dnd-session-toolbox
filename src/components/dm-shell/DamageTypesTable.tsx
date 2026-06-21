import type { SrdDamageType } from '#/types/srd'

export function DamageTypesTable({
  damageTypes,
}: {
  damageTypes: SrdDamageType[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-muted-foreground">
        <thead>
          <tr className="border-b">
            <th className="py-1.5 pr-3 font-medium text-foreground">Name</th>
            <th className="py-1.5 pr-3 font-medium text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {damageTypes.map((damageType) => (
            <tr key={damageType.index} className="border-b last:border-0">
              <td className="py-1.5 pr-3 align-top whitespace-nowrap text-foreground">
                {damageType.name}
              </td>
              <td className="py-1.5 pr-3 align-top">
                {damageType.desc.join(' ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
