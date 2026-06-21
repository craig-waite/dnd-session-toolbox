export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/**
 * Keep this in sync with the inline blocking script in src/routes/__root.tsx
 * (THEME_INIT_SCRIPT) — that script can't import this module, it has to be a
 * raw string injected before paint to avoid a flash of the wrong theme.
 */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // localStorage unavailable (private browsing, etc.) — theme just won't persist
  }
}
