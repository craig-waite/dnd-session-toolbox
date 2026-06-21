import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import type { SrdMagicSchool } from '#/types/srd'

export function MagicSchoolDetail({ school }: { school: SrdMagicSchool }) {
  return (
    <div>
      <p className="text-sm font-medium">{school.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">Magic school</p>
      <Markdown>{joinDescription(school.desc)}</Markdown>
    </div>
  )
}
