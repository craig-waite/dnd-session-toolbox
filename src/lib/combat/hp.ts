/** Clamps a HP change to [0, maxHp] — can't overheal past max or go negative. */
export function applyHpDelta(
  currentHp: number,
  maxHp: number,
  delta: number,
): number {
  return Math.max(0, Math.min(maxHp, currentHp + delta))
}
