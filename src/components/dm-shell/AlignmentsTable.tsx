import type { SrdAlignment } from '#/types/srd'

export function AlignmentsTable({
  alignments,
}: {
  alignments: SrdAlignment[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-muted-foreground">
        <thead>
          <tr className="border-b">
            <th className="py-1.5 pr-3 font-medium text-foreground">Name</th>
            <th className="py-1.5 pr-3 font-medium text-foreground">
              Abbreviation
            </th>
            <th className="py-1.5 pr-3 font-medium text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {alignments.map((alignment) => (
            <tr key={alignment.index} className="border-b last:border-0">
              <td className="py-1.5 pr-3 align-top whitespace-nowrap text-foreground">
                {alignment.name}
              </td>
              <td className="py-1.5 pr-3 align-top whitespace-nowrap">
                {alignment.abbreviation}
              </td>
              <td className="py-1.5 pr-3 align-top">
                {alignment.desc.join(' ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
