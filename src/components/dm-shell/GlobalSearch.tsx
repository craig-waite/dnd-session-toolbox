import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import { searchAll } from '#/lib/search/search.functions'
import type { SearchResult } from '#/types/search'

interface GlobalSearchProps {
  onSelect: (result: SearchResult) => void
}

const DEBOUNCE_MS = 200

export function GlobalSearch({ onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [query])

  const { data: results = [] } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAll({ data: debouncedQuery }),
    enabled: debouncedQuery.trim().length > 0,
  })

  function selectResult(result: SearchResult) {
    onSelect(result)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-64">
      <Command
        shouldFilter={false}
        className="overflow-visible bg-transparent [&_[data-slot=command-input-wrapper]]:border-b-0 [&_[data-slot=command-input-wrapper]]:rounded-md [&_[data-slot=command-input-wrapper]]:bg-secondary [&_[data-slot=command-input-wrapper]]:px-2"
      >
        <CommandInput
          value={query}
          onValueChange={(value) => {
            setQuery(value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          placeholder="Search everything…"
          aria-label="Search everything"
          className="h-auto py-1 text-[13px]"
        />
        {isOpen && results.length > 0 && (
          <CommandList className="absolute top-full right-0 left-0 z-10 mt-1 max-h-none rounded-md border bg-popover py-1 shadow-lg">
            {results.map((result) => (
              <CommandItem
                key={`${result.activity}-${result.id}`}
                value={`${result.activity}-${result.id}`}
                onMouseDown={(event) => event.preventDefault()}
                onSelect={() => selectResult(result)}
                className="flex items-center justify-between text-[13px]"
              >
                <span>{result.title}</span>
                <span className="text-[11px] text-muted-foreground">
                  {result.subtitle}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  )
}
