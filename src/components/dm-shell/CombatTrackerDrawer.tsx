import { ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible'
import type { Combatant } from '#/types/dm-shell'

interface CombatTrackerDrawerProps {
  combatants: Combatant[]
  round: number
  isOpen: boolean
  onToggle: () => void
}

export function CombatTrackerDrawer({
  combatants,
  round,
  isOpen,
  onToggle,
}: CombatTrackerDrawerProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="border-t">
      <CollapsibleTrigger className="flex w-full items-center gap-2 bg-card px-3 py-1.5 text-xs">
        {isOpen ? (
          <ChevronDown aria-hidden="true" />
        ) : (
          <ChevronUp aria-hidden="true" />
        )}
        <span className="font-medium">Combat tracker</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Round {round}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex gap-2 overflow-x-auto px-3 py-2.5">
          {combatants.map((combatant) => {
            const isDown = combatant.currentHp <= 0
            return (
              <div
                key={combatant.id}
                className={`min-w-24 rounded-md border px-2 py-1.5 ${
                  combatant.isActiveTurn ? 'border-primary' : 'border-border'
                } ${isDown ? 'opacity-50' : ''}`}
              >
                <p className="text-xs font-medium">{combatant.name}</p>
                <Badge
                  variant="secondary"
                  className="mt-1 px-1.5 py-0 text-[11px]"
                >
                  HP {combatant.currentHp}/{combatant.maxHp}
                </Badge>
              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
