import {
  ResourceLink,
  ResourceLinkList,
} from '#/components/dm-shell/ResourceLink'
import { StatCard } from '#/components/dm-shell/StatCard'
import type { SrdRaceEntry } from '#/types/srd'

export function RaceEntryDetail({ entry }: { entry: SrdRaceEntry }) {
  const abilityBonuses = entry.ability_bonuses.map((bonus, i) => (
    <span key={bonus.ability_score.index}>
      {i > 0 && ', '}
      <ResourceLink
        kind="ability-score"
        index={bonus.ability_score.index}
        label={bonus.ability_score.name}
      />{' '}
      +{bonus.bonus}
    </span>
  ))

  return (
    <div>
      <p className="text-sm font-medium">{entry.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        {entry.category === 'subrace' && entry.parentRace ? (
          <>
            Subrace of{' '}
            <ResourceLink
              kind="race-entry"
              index={entry.parentRace.index}
              label={entry.parentRace.name}
            />
          </>
        ) : (
          'Race'
        )}
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {entry.speed !== undefined && (
          <StatCard label="Speed" value={`${entry.speed} ft.`} />
        )}
        {entry.size && <StatCard label="Size" value={entry.size} />}
        {abilityBonuses.length > 0 && (
          <StatCard label="Ability bonuses" value={abilityBonuses} />
        )}
      </div>

      {entry.desc && (
        <p className="mb-3 text-xs text-muted-foreground">{entry.desc}</p>
      )}

      {entry.traits.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Traits: <ResourceLinkList kind="trait" items={entry.traits} />
        </p>
      )}
    </div>
  )
}
