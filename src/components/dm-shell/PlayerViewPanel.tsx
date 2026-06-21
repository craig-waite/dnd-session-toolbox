import { Map as MapIcon, Play } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function PlayerViewPanel() {
  return (
    <aside className="w-36 border-l px-2 py-2.5">
      <p className="mb-2 px-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        Player view
      </p>
      <Button
        type="button"
        variant="secondary"
        className="mb-2.5 h-20 w-full"
        aria-label="Open player view preview"
      >
        <MapIcon
          className="size-5.5 text-muted-foreground"
          aria-hidden="true"
        />
      </Button>
      <p className="mb-1.5 px-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        Now playing
      </p>
      <div className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
        <Play aria-hidden="true" className="size-3.5" />
        Tavern ambience
      </div>
    </aside>
  )
}
