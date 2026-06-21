import { createContext, type ReactNode, useContext } from 'react'
import type { TabKind } from '#/types/dm-shell'

export interface DmShellNavigation {
  openResource: (kind: TabKind, index: string, label: string) => void
}

const DmShellNavigationContext = createContext<DmShellNavigation | null>(null)

export function DmShellNavigationProvider({
  value,
  children,
}: {
  value: DmShellNavigation
  children: ReactNode
}) {
  return (
    <DmShellNavigationContext.Provider value={value}>
      {children}
    </DmShellNavigationContext.Provider>
  )
}

export function useDmShellNavigation(): DmShellNavigation {
  const context = useContext(DmShellNavigationContext)
  if (!context) {
    throw new Error(
      'useDmShellNavigation must be used within DmShellNavigationProvider',
    )
  }
  return context
}
