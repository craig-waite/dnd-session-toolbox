import { ArrowRight, Plus, Target, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useDmShellNavigation } from '#/lib/dm-shell/navigation-context'
import type { Combatant } from '#/types/dm-shell'

function CombatantName({
  combatant,
  size = 'sm',
}: {
  combatant: Combatant
  size?: 'sm' | 'md'
}) {
  const { openResource } = useDmShellNavigation()
  const textSize = size === 'md' ? 'text-[13px]' : 'text-xs'
  const { sourceIndex } = combatant

  if (!sourceIndex) {
    return <span className={`${textSize} font-medium`}>{combatant.name}</span>
  }

  return (
    <button
      type="button"
      onClick={() => openResource('monster', sourceIndex, combatant.name)}
      className={`${textSize} font-medium underline-offset-2 hover:underline`}
    >
      {combatant.name}
    </button>
  )
}

interface CombatPanelProps {
  round: number
  combatants: Combatant[]
  activeCombatantId: string | null
  onSelectCombatant: (id: string) => void
  onApplyHp: (id: string, delta: number) => void
  onAddCondition: (id: string, name: string) => void
  onRemoveCondition: (id: string, name: string) => void
  onNextTurn: () => void
  onAddCombatant: () => void
}

export function CombatPanel({
  round,
  combatants,
  activeCombatantId,
  onSelectCombatant,
  onApplyHp,
  onAddCondition,
  onRemoveCondition,
  onNextTurn,
  onAddCombatant,
}: CombatPanelProps) {
  const ordered = [...combatants].sort(
    (a, b) => (b.initiative ?? -1) - (a.initiative ?? -1),
  )

  return (
    <aside className="flex w-[300px] flex-shrink-0 flex-col border-l bg-background">
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <span className="text-[13px] font-medium">Combat</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Round {round}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-2.5 py-2.5">
        {ordered.map((combatant) =>
          combatant.id === activeCombatantId ? (
            <ActiveCombatantCard
              key={combatant.id}
              combatant={combatant}
              onApplyHp={onApplyHp}
              onAddCondition={onAddCondition}
              onRemoveCondition={onRemoveCondition}
            />
          ) : (
            <CombatantRow
              key={combatant.id}
              combatant={combatant}
              onSelect={() => onSelectCombatant(combatant.id)}
            />
          ),
        )}
      </div>

      <div className="flex gap-2 border-t px-2.5 py-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs"
          onClick={onAddCombatant}
        >
          <Plus size={14} aria-hidden="true" />
          Add
        </Button>
        <Button
          type="button"
          size="sm"
          className="flex-1 gap-1.5 text-xs"
          onClick={onNextTurn}
        >
          Next turn
          <ArrowRight size={14} aria-hidden="true" />
        </Button>
      </div>
    </aside>
  )
}

function CombatantRow({
  combatant,
  onSelect,
}: {
  combatant: Combatant
  onSelect: () => void
}) {
  const isDown = combatant.kind === 'monster' && combatant.currentHp <= 0
  const isLairAction = combatant.kind === 'lair-action'

  return (
    <div
      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 ${
        isDown || isLairAction ? 'opacity-50' : ''
      }`}
    >
      <span>
        <CombatantName combatant={combatant} />
        {isDown ? ' (down)' : ''}
      </span>
      <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
        {!isLairAction && (
          <span>
            {combatant.currentHp}/{combatant.maxHp} hp
          </span>
        )}
        {combatant.initiative != null && (
          <span>init {combatant.initiative}</span>
        )}
        <button
          type="button"
          aria-label={`Focus ${combatant.name}`}
          onClick={onSelect}
          className="text-muted-foreground hover:text-foreground"
        >
          <Target size={13} aria-hidden="true" />
        </button>
      </span>
    </div>
  )
}

function ActiveCombatantCard({
  combatant,
  onApplyHp,
  onAddCondition,
  onRemoveCondition,
}: {
  combatant: Combatant
  onApplyHp: (id: string, delta: number) => void
  onAddCondition: (id: string, name: string) => void
  onRemoveCondition: (id: string, name: string) => void
}) {
  const [hpAmount, setHpAmount] = useState('')
  const [conditionName, setConditionName] = useState('')
  const hpPct =
    combatant.maxHp > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round((combatant.currentHp / combatant.maxHp) * 100),
          ),
        )
      : 0

  function applyDelta(sign: 1 | -1) {
    const amount = Number.parseInt(hpAmount, 10)
    if (Number.isNaN(amount) || amount <= 0) return
    onApplyHp(combatant.id, sign * amount)
    setHpAmount('')
  }

  function addCondition() {
    const name = conditionName.trim()
    if (!name) return
    onAddCondition(combatant.id, name)
    setConditionName('')
  }

  return (
    <div className="rounded-md border-2 border-primary px-3 py-2.5">
      <div className="flex items-center justify-between">
        <CombatantName combatant={combatant} size="md" />
        {combatant.initiative != null && (
          <span className="text-[11px] text-muted-foreground">
            init {combatant.initiative}
          </span>
        )}
      </div>

      {combatant.kind !== 'lair-action' && (
        <>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${hpPct}%` }}
              />
            </div>
            <span className="min-w-12 text-right text-[11px] font-medium">
              {combatant.currentHp}/{combatant.maxHp} hp
            </span>
          </div>

          <div className="mt-2 flex gap-1.5">
            <Input
              type="number"
              min={0}
              placeholder="Amount"
              value={hpAmount}
              onChange={(e) => setHpAmount(e.target.value)}
              className="h-7 text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px]"
              onClick={() => applyDelta(-1)}
            >
              − dmg
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px]"
              onClick={() => applyDelta(1)}
            >
              + heal
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {combatant.conditions.map((condition) => (
              <Badge
                key={condition.name}
                variant="secondary"
                className="gap-1 pr-1 text-[10px]"
              >
                {condition.name}
                <button
                  type="button"
                  aria-label={`Remove ${condition.name}`}
                  onClick={() =>
                    onRemoveCondition(combatant.id, condition.name)
                  }
                  className="rounded-full hover:bg-muted-foreground/20"
                >
                  <X size={10} aria-hidden="true" />
                </button>
              </Badge>
            ))}
            <Input
              placeholder="+ condition"
              value={conditionName}
              onChange={(e) => setConditionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCondition()
              }}
              className="h-6 w-24 text-[11px]"
            />
          </div>
        </>
      )}
    </div>
  )
}
