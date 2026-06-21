import { useQuery } from '@tanstack/react-query'
import {
  ResourceLink,
  ResourceLinkList,
} from '#/components/dm-shell/ResourceLink'
import { StatCard } from '#/components/dm-shell/StatCard'
import { getClassFeatures, getClassLevels } from '#/lib/srd/classes.functions'
import type { SrdClass } from '#/types/srd'

export function ClassDetail({ classData }: { classData: SrdClass }) {
  const featuresQuery = useQuery({
    queryKey: ['class', 'features', classData.index],
    queryFn: () => getClassFeatures({ data: classData.index }),
  })

  const levelsQuery = useQuery({
    queryKey: ['class', 'levels', classData.index],
    queryFn: () => getClassLevels({ data: classData.index }),
  })

  const hasSpellcasting = levelsQuery.data?.some((l) => l.spellcasting)

  return (
    <div>
      <p className="text-sm font-medium">{classData.name}</p>
      <p className="mb-2.5 text-xs text-muted-foreground">
        Hit die d{classData.hit_die}
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        <StatCard
          label="Saving throws"
          value={
            <ResourceLinkList
              kind="ability-score"
              items={classData.saving_throws}
            />
          }
        />
        {classData.spellcasting && (
          <StatCard
            label="Spellcasting ability"
            value={
              <ResourceLink
                kind="ability-score"
                index={classData.spellcasting.spellcasting_ability.index}
                label={classData.spellcasting.spellcasting_ability.name}
              />
            }
          />
        )}
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        Proficiencies:{' '}
        <ResourceLinkList kind="proficiency" items={classData.proficiencies} />
      </p>

      {classData.subclasses.length > 0 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Subclasses:{' '}
          <ResourceLinkList kind="subclass" items={classData.subclasses} />
        </p>
      )}

      <p className="mb-1 text-xs font-medium text-muted-foreground">
        Class features
      </p>
      {featuresQuery.isPending && (
        <p className="text-xs text-muted-foreground">Loading…</p>
      )}
      {featuresQuery.data?.map((feature) => (
        <p key={feature.index} className="mb-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            Lvl {feature.level} — {feature.name}.
          </span>{' '}
          {feature.desc[0]}
        </p>
      ))}

      {levelsQuery.data && levelsQuery.data.length > 0 && (
        <>
          <p className="mt-3 mb-1 text-xs font-medium text-muted-foreground">
            Level progression
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead>
                <tr className="border-b">
                  <th className="py-1 pr-2 font-medium">Lvl</th>
                  <th className="py-1 pr-2 font-medium">Prof bonus</th>
                  {hasSpellcasting && (
                    <th className="py-1 pr-2 font-medium">Cantrips</th>
                  )}
                  {hasSpellcasting && (
                    <th className="py-1 pr-2 font-medium">Spell slots</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {levelsQuery.data.map((level) => (
                  <tr key={level.index} className="border-b last:border-0">
                    <td className="py-1 pr-2 text-foreground">{level.level}</td>
                    <td className="py-1 pr-2">+{level.prof_bonus}</td>
                    {hasSpellcasting && (
                      <td className="py-1 pr-2">
                        {level.spellcasting?.cantrips_known ?? '—'}
                      </td>
                    )}
                    {hasSpellcasting && (
                      <td className="py-1 pr-2">
                        {level.spellcasting
                          ? [
                              level.spellcasting.spell_slots_level_1,
                              level.spellcasting.spell_slots_level_2,
                              level.spellcasting.spell_slots_level_3,
                              level.spellcasting.spell_slots_level_4,
                              level.spellcasting.spell_slots_level_5,
                              level.spellcasting.spell_slots_level_6,
                              level.spellcasting.spell_slots_level_7,
                              level.spellcasting.spell_slots_level_8,
                              level.spellcasting.spell_slots_level_9,
                            ]
                              .filter((count): count is number => !!count)
                              .join('/') || '—'
                          : '—'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
