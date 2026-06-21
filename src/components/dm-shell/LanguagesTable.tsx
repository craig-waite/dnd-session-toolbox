import type { SrdLanguage } from '#/types/srd'

export function LanguagesTable({ languages }: { languages: SrdLanguage[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-muted-foreground">
        <thead>
          <tr className="border-b">
            <th className="py-1.5 pr-3 font-medium text-foreground">Name</th>
            <th className="py-1.5 pr-3 font-medium text-foreground">Type</th>
            <th className="py-1.5 pr-3 font-medium text-foreground">
              Typical speakers
            </th>
            <th className="py-1.5 pr-3 font-medium text-foreground">Script</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((language) => (
            <tr key={language.index} className="border-b last:border-0">
              <td className="py-1.5 pr-3 align-top whitespace-nowrap text-foreground">
                {language.name}
              </td>
              <td className="py-1.5 pr-3 align-top whitespace-nowrap capitalize">
                {language.type}
              </td>
              <td className="py-1.5 pr-3 align-top">
                {language.typical_speakers.join(', ')}
              </td>
              <td className="py-1.5 pr-3 align-top whitespace-nowrap">
                {language.script ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
