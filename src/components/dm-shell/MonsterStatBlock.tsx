import { StatCard } from '#/components/dm-shell/StatCard'
import type { SrdMonster } from '#/types/srd'

export function MonsterStatBlock({ monster }: { monster: SrdMonster }) {
  const ac = monster.armor_class[0]?.value ?? '—'
  const speed = Object.values(monster.speed)[0] ?? '—'

  return (
    <div>
      <p className="text-sm font-medium">{monster.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        {monster.size} {monster.type}, {monster.alignment}
      </p>
      <div className="mb-4 grid w-64 grid-cols-3 gap-2">
        <StatCard label="AC" value={String(ac)} />
        <StatCard label="HP" value={String(monster.hit_points)} />
        <StatCard label="Speed" value={speed} />
      </div>
      {monster.special_abilities && monster.special_abilities.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Special abilities
          </p>
          {monster.special_abilities.map((ability) => (
            <p
              key={ability.name}
              className="mb-1 text-xs text-muted-foreground"
            >
              <span className="font-medium text-foreground">
                {ability.name}.
              </span>{' '}
              {ability.desc}
            </p>
          ))}
        </div>
      )}
      {monster.actions && monster.actions.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Actions
          </p>
          {monster.actions.map((action) => (
            <p key={action.name} className="mb-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {action.name}.
              </span>{' '}
              {action.desc}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
