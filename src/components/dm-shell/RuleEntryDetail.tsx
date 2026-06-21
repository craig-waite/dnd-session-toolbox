import { joinDescription, Markdown } from '#/components/dm-shell/Markdown'
import { ResourceLink } from '#/components/dm-shell/ResourceLink'
import { Badge } from '#/components/ui/badge'
import type { SrdRuleEntry } from '#/types/srd'

const categoryLabels: Record<SrdRuleEntry['category'], string> = {
  rule: 'Rule',
  condition: 'Condition',
  skill: 'Skill',
}

export function RuleEntryDetail({ entry }: { entry: SrdRuleEntry }) {
  return (
    <div>
      <p className="text-sm font-medium">{entry.name}</p>
      <div className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Badge variant="secondary" className="text-[11px]">
          {categoryLabels[entry.category]}
        </Badge>
        {entry.ability_score && (
          <ResourceLink
            kind="ability-score"
            index={entry.ability_score.index}
            label={entry.ability_score.name}
          />
        )}
      </div>
      <Markdown>{joinDescription(entry.desc)}</Markdown>
    </div>
  )
}
