import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="rounded-md bg-secondary p-2 text-center">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-xs font-medium">{value}</p>
    </div>
  )
}
