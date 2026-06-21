import type { ActivityItem, Combatant } from '#/types/dm-shell'

export const activities: ActivityItem[] = [
  { id: 'rules', label: 'Rules', icon: 'book-open' },
  { id: 'monsters', label: 'Monsters', icon: 'skull' },
  { id: 'spells', label: 'Spells', icon: 'wand-2' },
  { id: 'equipment', label: 'Equipment', icon: 'backpack' },
  { id: 'magic-items', label: 'Magic items', icon: 'sparkles' },
  { id: 'classes', label: 'Classes', icon: 'graduation-cap' },
  { id: 'subclasses', label: 'Subclasses', icon: 'layers' },
  { id: 'races', label: 'Races', icon: 'dna' },
  { id: 'traits', label: 'Traits', icon: 'fingerprint' },
  { id: 'alignments', label: 'Alignments', icon: 'compass' },
  { id: 'languages', label: 'Languages', icon: 'languages' },
  { id: 'damage-types', label: 'Damage types', icon: 'flame' },
  { id: 'characters', label: 'Player characters', icon: 'users' },
  { id: 'campaign', label: 'Campaign', icon: 'map' },
  { id: 'audio', label: 'Audio', icon: 'music' },
]

export const combatants: Combatant[] = [
  { id: 'kira', name: 'Kira', currentHp: 24, maxHp: 28, isActiveTurn: true },
  {
    id: 'goblin-1',
    name: 'Goblin 1',
    currentHp: 7,
    maxHp: 7,
    isActiveTurn: false,
  },
  {
    id: 'goblin-2',
    name: 'Goblin 2',
    currentHp: 0,
    maxHp: 7,
    isActiveTurn: false,
  },
  { id: 'tomas', name: 'Tomas', currentHp: 31, maxHp: 31, isActiveTurn: false },
]
