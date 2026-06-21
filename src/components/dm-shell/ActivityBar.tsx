import { UserButton } from '@clerk/tanstack-react-start'
import {
  Backpack,
  BookOpen,
  Compass,
  Dna,
  Fingerprint,
  Flame,
  GraduationCap,
  Languages as LanguagesIcon,
  Layers,
  Map as MapIcon,
  Moon,
  Music,
  Skull,
  Sparkles,
  Sun,
  Users,
  Wand2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { getTheme, setTheme, type Theme } from '#/lib/theme'
import type { ActivityId, ActivityItem } from '#/types/dm-shell'

const icons: Record<string, typeof BookOpen> = {
  'book-open': BookOpen,
  skull: Skull,
  'wand-2': Wand2,
  backpack: Backpack,
  sparkles: Sparkles,
  'graduation-cap': GraduationCap,
  layers: Layers,
  dna: Dna,
  fingerprint: Fingerprint,
  users: Users,
  map: MapIcon,
  music: Music,
  compass: Compass,
  languages: LanguagesIcon,
  flame: Flame,
}

interface ActivityBarProps {
  activities: ActivityItem[]
  activeId: ActivityId
  onSelect: (id: ActivityId) => void
}

export function ActivityBar({
  activities,
  activeId,
  onSelect,
}: ActivityBarProps) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  function handleToggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <nav
      aria-label="Tool categories"
      className="flex w-11 flex-col items-center border-r bg-card py-2.5"
    >
      <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
        {activities.map((activity) => {
          const Icon = icons[activity.icon]
          const isActive = activity.id === activeId
          return (
            <Tooltip key={activity.id}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="icon-sm"
                  aria-label={activity.label}
                  aria-pressed={isActive}
                  onClick={() => onSelect(activity.id)}
                  className={
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }
                >
                  <Icon aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{activity.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mt-2 border-t pt-2">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: 'size-8' } }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  label={
                    theme === 'dark'
                      ? 'Switch to light mode'
                      : 'Switch to dark mode'
                  }
                  labelIcon={
                    theme === 'dark' ? (
                      <Sun size={16} aria-hidden="true" />
                    ) : (
                      <Moon size={16} aria-hidden="true" />
                    )
                  }
                  onClick={handleToggleTheme}
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">Account</TooltipContent>
      </Tooltip>
    </nav>
  )
}
