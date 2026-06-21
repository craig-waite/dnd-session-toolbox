import { useEffect, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'

export interface SidePanelItem {
  id: string
  label: string
}

interface SidePanelProps {
  title: string
  items: SidePanelItem[]
  activeItemId: string | null
  onSelect: (id: string, label: string) => void
}

const MIN_WIDTH = 160
const MAX_WIDTH = 420
const DEFAULT_WIDTH = 224

export function SidePanel({
  title,
  items,
  activeItemId,
  onSelect,
}: SidePanelProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(
    null,
  )

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const dragState = dragStateRef.current
      if (!dragState) return
      const delta = event.clientX - dragState.startX
      const nextWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, dragState.startWidth + delta),
      )
      setWidth(nextWidth)
    }
    function handleMouseUp() {
      dragStateRef.current = null
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  function handleResizeStart(event: React.MouseEvent) {
    dragStateRef.current = { startX: event.clientX, startWidth: width }
  }

  return (
    <aside
      style={{ width }}
      className="relative flex flex-shrink-0 flex-col border-r bg-card"
    >
      <Command className="h-full rounded-none bg-transparent">
        <p className="px-2.5 pt-2.5 pb-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <CommandInput
          placeholder="Filter…"
          aria-label={`Filter ${title.toLowerCase()}`}
        />
        <CommandList className="max-h-none flex-1">
          <CommandEmpty className="px-2.5 py-2 text-left text-xs text-muted-foreground">
            No matches
          </CommandEmpty>
          {items.map((item) => (
            <CommandItem
              key={item.id}
              value={item.label}
              data-active={item.id === activeItemId}
              onSelect={() => onSelect(item.id, item.label)}
              className="text-[13px] data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
      <button
        type="button"
        aria-label="Resize panel"
        onMouseDown={handleResizeStart}
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary/40"
      />
    </aside>
  )
}
