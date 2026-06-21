import { useQuery } from '@tanstack/react-query'
import { Swords } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { rollInitiative } from '#/lib/combat/initiative'
import { DmShellNavigationProvider } from '#/lib/dm-shell/navigation-context'
import {
  resourceByActivity,
  resourceByKind,
  tableResourceByActivity,
  tableResourceByKind,
} from '#/lib/dm-shell/resources'
import {
  activities,
  combatants as initialCombatants,
} from '#/lib/mock-dm-shell-data'
import type { ActivityId, Combatant, TabItem } from '#/types/dm-shell'
import type { SearchResult } from '#/types/search'
import type { SrdMonster } from '#/types/srd'
import { ActivityBar } from './ActivityBar'
import { CombatPanel } from './CombatPanel'
import { GlobalSearch } from './GlobalSearch'
import { PlayerViewPanel } from './PlayerViewPanel'
import { SidePanel } from './SidePanel'
import { TabBar } from './TabBar'

export function DmShell() {
  const [activeActivity, setActiveActivity] = useState<ActivityId>('monsters')
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 'monster:goblin', index: 'goblin', title: 'Goblin', kind: 'monster' },
  ])
  const [activeTabId, setActiveTabId] = useState<string | null>(
    'monster:goblin',
  )
  const [isCombatMode, setIsCombatMode] = useState(false)
  const [round, setRound] = useState(1)
  const [combatants, setCombatants] = useState<Combatant[]>(initialCombatants)
  const [activeCombatantId, setActiveCombatantId] = useState<string | null>(
    initialCombatants.find((c) => c.initiative != null)?.id ?? null,
  )

  const initiativeOrder = [...combatants].sort(
    (a, b) => (b.initiative ?? -1) - (a.initiative ?? -1),
  )

  function applyHp(id: string, delta: number) {
    setCombatants((current) =>
      current.map((c) =>
        c.id === id
          ? {
              ...c,
              currentHp: Math.max(0, Math.min(c.maxHp, c.currentHp + delta)),
            }
          : c,
      ),
    )
  }

  function addCondition(id: string, name: string) {
    setCombatants((current) =>
      current.map((c) =>
        c.id === id && !c.conditions.some((cond) => cond.name === name)
          ? { ...c, conditions: [...c.conditions, { name }] }
          : c,
      ),
    )
  }

  function removeCondition(id: string, name: string) {
    setCombatants((current) =>
      current.map((c) =>
        c.id === id
          ? {
              ...c,
              conditions: c.conditions.filter((cond) => cond.name !== name),
            }
          : c,
      ),
    )
  }

  function nextTurn() {
    const currentIndex = initiativeOrder.findIndex(
      (c) => c.id === activeCombatantId,
    )
    const nextIndex = (currentIndex + 1) % initiativeOrder.length
    if (nextIndex === 0) setRound((r) => r + 1)
    setActiveCombatantId(initiativeOrder[nextIndex]?.id ?? null)
  }

  function addCombatant() {
    const id = `combatant-${combatants.length + 1}`
    setCombatants((current) => [
      ...current,
      {
        id,
        kind: 'monster',
        name: 'New combatant',
        initiative: 0,
        currentHp: 1,
        maxHp: 1,
        tempHp: 0,
        conditions: [],
        resources: [],
        hasActedThisRound: false,
      },
    ])
  }

  function addMonsterToCombat(monster: SrdMonster) {
    const existingCount = combatants.filter(
      (c) => c.sourceIndex === monster.index,
    ).length
    const roll = rollInitiative(monster)
    const newCombatant: Combatant = {
      id: `${monster.index}-${existingCount + 1}-${Date.now()}`,
      kind: 'monster',
      sourceIndex: monster.index,
      name:
        existingCount > 0
          ? `${monster.name} ${existingCount + 1}`
          : monster.name,
      initiative: roll.total,
      initiativeDetail: roll.detail,
      currentHp: monster.hit_points,
      maxHp: monster.hit_points,
      tempHp: 0,
      conditions: [],
      resources: [],
      hasActedThisRound: false,
    }
    setCombatants((current) => [...current, newCombatant])
    setIsCombatMode(true)
  }

  const panel = resourceByActivity.get(activeActivity)
  const panelQuery = useQuery({
    queryKey: panel?.listQueryKey ?? ['no-panel'],
    queryFn: () => panel?.listFn() ?? Promise.resolve([]),
    enabled: Boolean(panel),
  })
  const panelItems = (panelQuery.data ?? []).map((item) => ({
    id: item.index,
    label: item.name,
  }))

  const activeTab = tabs.find((tab) => tab.id === activeTabId)
  const activeResource = activeTab
    ? resourceByKind.get(activeTab.kind)
    : undefined
  const detailQuery = useQuery({
    queryKey:
      activeResource && activeTab
        ? activeResource.detailQueryKey(activeTab.index)
        : ['no-tab'],
    queryFn: () =>
      activeResource && activeTab
        ? activeResource.detailFn(activeTab.index)
        : Promise.resolve(undefined),
    enabled: Boolean(activeResource && activeTab),
  })

  const activeTableResource = activeTab
    ? tableResourceByKind.get(activeTab.kind)
    : undefined
  const tableQuery = useQuery({
    queryKey: activeTableResource?.listQueryKey ?? ['no-table'],
    queryFn: () => activeTableResource?.listFn() ?? Promise.resolve([]),
    enabled: Boolean(activeTableResource),
  })

  function openTab(kind: TabItem['kind'], index: string, title: string) {
    // Composite key — `index` alone is only unique within one resource kind
    // (e.g. the monster "Goblin" and the language "Goblin" both have
    // index "goblin"), so a bare-index dedup check would silently refocus
    // the wrong tab instead of opening a new one.
    const tabId = `${kind}:${index}`
    if (!tabs.some((tab) => tab.id === tabId)) {
      setTabs([...tabs, { id: tabId, index, title, kind }])
    }
    setActiveTabId(tabId)
  }

  function openTableResource(table: {
    activity: ActivityId
    kind: TabItem['kind']
    tabId: string
    tabTitle: string
  }) {
    setActiveActivity(table.activity)
    openTab(table.kind, table.tabId, table.tabTitle)
  }

  function selectActivity(id: ActivityId) {
    setActiveActivity(id)
    const table = tableResourceByActivity.get(id)
    if (table) openTableResource(table)
  }

  function openResource(kind: TabItem['kind'], id: string, title: string) {
    const resource = resourceByKind.get(kind)
    if (resource) {
      setActiveActivity(resource.activity)
      openTab(kind, id, title)
      return
    }
    const table = tableResourceByKind.get(kind)
    if (table) openTableResource(table)
  }

  function handleSearchSelect(result: SearchResult) {
    const resource = resourceByActivity.get(result.activity)
    if (resource) {
      openResource(resource.kind, result.id, result.title)
      return
    }
    const table = tableResourceByActivity.get(result.activity)
    if (table) openTableResource(table)
  }

  function closeTab(id: string) {
    const remaining = tabs.filter((tab) => tab.id !== id)
    setTabs(remaining)
    if (activeTabId === id) {
      setActiveTabId(remaining.at(-1)?.id ?? null)
    }
  }

  return (
    <DmShellNavigationProvider value={{ openResource, addMonsterToCombat }}>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <header className="flex items-center gap-2.5 border-b bg-card px-3 py-2">
          <span className="text-[13px] font-medium">DM session toolbox</span>
          <div className="ml-auto">
            <GlobalSearch onSelect={handleSearchSelect} />
          </div>
          <Button
            type="button"
            variant={isCombatMode ? 'secondary' : 'ghost'}
            size="sm"
            aria-pressed={isCombatMode}
            onClick={() => setIsCombatMode((mode) => !mode)}
            className={`gap-1.5 text-xs ${
              isCombatMode ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Swords size={14} aria-hidden="true" />
            Combat mode
          </Button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <ActivityBar
            activities={activities}
            activeId={activeActivity}
            onSelect={selectActivity}
          />

          {panel && (
            <SidePanel
              title={panel.panelTitle}
              items={panelItems}
              activeItemId={activeTab?.index ?? null}
              onSelect={(id, label) => openTab(panel.kind, id, label)}
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onSelect={setActiveTabId}
              onClose={closeTab}
            />
            <div className="flex-1 overflow-auto p-4">
              {!activeTab ? (
                <p className="text-sm text-muted-foreground">
                  Select something to view it here.
                </p>
              ) : activeTableResource ? (
                tableQuery.isPending ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : (
                  activeTableResource.renderTable(tableQuery.data ?? [])
                )
              ) : detailQuery.isPending ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : activeResource && detailQuery.data ? (
                activeResource.renderDetail(detailQuery.data)
              ) : (
                <p className="text-sm text-muted-foreground">Not found.</p>
              )}
            </div>
          </div>

          <PlayerViewPanel />

          {isCombatMode && (
            <CombatPanel
              round={round}
              combatants={combatants}
              activeCombatantId={activeCombatantId}
              onSelectCombatant={setActiveCombatantId}
              onApplyHp={applyHp}
              onAddCondition={addCondition}
              onRemoveCondition={removeCondition}
              onNextTurn={nextTurn}
              onAddCombatant={addCombatant}
            />
          )}
        </div>
      </div>
    </DmShellNavigationProvider>
  )
}
