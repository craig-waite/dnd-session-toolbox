import type { ClerkProviderProps } from '@clerk/tanstack-react-start'

/**
 * Points Clerk's appearance variables at this app's own CSS custom properties
 * (src/styles.css) instead of hardcoding hex values — Clerk accepts any valid
 * CSS color string, including var(...), so this stays in sync automatically
 * with the rest of the theme (including light/dark mode switching).
 */
export const clerkAppearance: ClerkProviderProps['appearance'] = {
  theme: 'simple',
  variables: {
    colorBackground: 'var(--popover)',
    colorForeground: 'var(--popover-foreground)',
    colorPrimary: 'var(--primary)',
    colorPrimaryForeground: 'var(--primary-foreground)',
    colorNeutral: 'var(--foreground)',
    colorMuted: 'var(--muted)',
    colorMutedForeground: 'var(--muted-foreground)',
    colorInput: 'var(--input)',
    colorInputForeground: 'var(--foreground)',
    colorBorder: 'var(--border)',
    colorRing: 'var(--ring)',
    colorDanger: 'var(--destructive)',
    fontFamily: 'inherit',
    borderRadius: 'var(--radius)',
  },
}
