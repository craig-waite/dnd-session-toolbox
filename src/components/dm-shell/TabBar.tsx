import { X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { TabItem } from '#/types/dm-shell'

interface TabBarProps {
  tabs: TabItem[]
  activeTabId: string | null
  onSelect: (id: string) => void
  onClose: (id: string) => void
}

export function TabBar({ tabs, activeTabId, onSelect, onClose }: TabBarProps) {
  return (
    <div className="flex overflow-x-auto border-b" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            className={`group flex flex-shrink-0 items-center gap-2 border-r px-3.5 py-1.5 text-xs ${
              isActive
                ? 'bg-card text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(tab.id)}
            >
              {tab.title}
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Close ${tab.title}`}
              onClick={() => onClose(tab.id)}
              className="opacity-0 group-hover:opacity-100"
            >
              <X aria-hidden="true" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
