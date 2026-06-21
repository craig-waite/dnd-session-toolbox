# DnD Session Toolbox

## Project Overview

A web-based assistant for Dungeon Masters running in-person D&D campaigns. This is **not** a virtual tabletop — it is a session helper that gives the DM fast, organised access to information and tools during live play.

## Core Features

### Information Access
- **Rules reference** — D&D 5e SRD content, plus additional content provided in a compatible format
- **Monster stats** — SRD monsters plus custom entries
- **Player character sheets** — DM-maintained player character sheets
- **Campaign content** — custom campaign lore, session plans, NPCs, locations

### Session Tools
- **Combat tracker** — initiative order and status effect tracking
- **Audio** — background music and sound effect playback
- **Dual display** — separate DM view and Player view (maps, images, initiative) for use on a second monitor or window

## Display Architecture

Two distinct views in the same app:
- **DM View** — full controls, all information, tool access
- **Player View** — curated display for second monitor (maps, images, initiative tracker, revealed info)

## Tech Stack

- **Framework**: TanStack Start (React, Vite-powered, SSR-capable)
- **Routing**: TanStack Router (file-based)
- **Data fetching**: TanStack Query
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix primitives, owned component source under `src/components/ui/`). Theming via CSS variables in `src/styles.css` (`:root` = light, `.dark` = dark); dark values are hand-matched to the original zinc/blue palette so the visual identity didn't shift when shadcn was adopted. Light/dark mode is user-toggleable (see Theming below) — this only works app-wide because every component sticks to semantic tokens (`bg-card`, `text-muted-foreground`, etc.) rather than raw Tailwind color utilities; verify that's still true (`grep -rnE "\b(bg|text|border)-(zinc|slate|gray|...)-[0-9]" src` outside `src/components/ui/`) before assuming a new component will look right in both modes
- **Database**: MongoDB. SRD/campaign data is naturally document-shaped (nested, variable structure), and Mongo Atlas gives a clear path to a future multi-tenant SaaS offering without a rewrite
- **Testing**: Vitest (unit/integration), React Testing Library (components), Playwright (e2e), MSW (mocking)
- **Linting/formatting**: Biome

Web app running on a laptop is the primary use case.

## Data Sources

- D&D 5e SRD content (open-licensed, SRD 5.1/OGL) lives in MongoDB, seeded from `src/data/srd/2014/` via `npm run db:seed-srd`. Each doc carries a `source` field (e.g. `srd-5.1-2014`) so custom DM-authored entries can coexist in the same collections without conflicting with re-seeds. The app itself never reads these JSON files — only `scripts/seed-srd.ts` does. They're gitignored (`src/data/srd/**/*.json`, the directory's `README.md` stays tracked) and auto-fetched on demand: `db:seed-srd` runs `scripts/fetch-srd-data.ts` first, which downloads any missing files from the upstream [5e-bits/5e-database](https://github.com/5e-bits/5e-database) repo before seeding. If `seed-srd.ts` ever imports a new file, add it to `fetch-srd-data.ts`'s `FILES` list too. SRD coverage is now complete — every category from the source dataset is queryable, either as its own resource or folded into another:
  - `monsters`, `spells`, `equipment`, `magicItems` — one collection per content type
  - `rules` — a merged collection of Rule-Sections + Conditions + Skills + the 3 genuinely-content-bearing entries from the top-level `5e-SRD-Rules.json` (Using Ability Scores, Spellcasting, Equipment overview — folded in under `category: 'rule'` alongside Rule-Sections). The other 3 top-level Rules entries (Combat, Adventuring, Appendix) are empty section headers with no body text in the SRD source and are deliberately skipped — there's nothing to show. Verified no `index` collisions between Rule-Sections and the merged-in top-level entries.
  - `classes`, `subclasses`, `features` — character-build/ability reference. Class and Subclass detail views additionally cross-query `features` (filtered by `class.index`/`subclass.index`, sorted by level) to show that class's abilities grouped by level, and `ClassDetail` separately cross-queries the `levels` collection (see below) for a level-progression table — this is the actual answer to "what can my Fighter do at level 5," not just flat class metadata
  - `races` — merged Races + Subraces (category field), same pattern as `rules`
  - `traits` — racial traits (Darkvision, Fey Ancestry, etc.), referenced by races/subraces but also independently browsable/searchable
  - `magicSchools`, `weaponProperties`, `abilityScores`, `equipmentCategories`, `proficiencies` — small glossary tables, mainly valuable as cross-reference link *targets* (see below) rather than standalone browsing
  - `alignments`, `languages`, `damageTypes` — small, genuinely browsable glossaries, each with its own activity icon (Compass/Languages/Flame). Unlike every other resource, these render as **a single consolidated table** (`AlignmentsTable`/`LanguagesTable`/`DamageTypesTable`) rather than a side-panel list that drills into one detail page per item — see "Table resources" under Data Access Layer Pattern below for why and how.
  - `backgrounds`, `feats` — wired as full resources (server fns, detail components, search) despite the SRD only including one entry each (Acolyte, Grappler) — reachable via search/links, but deliberately given **no** activity icon per the curation policy below (a 1-item "browse from scratch" list isn't worth a permanent icon slot). `BackgroundDetail` surfaces starting proficiencies/equipment (as `ResourceLink`s), starting gold, and the background's narrative `feature` — it does not render the `personality_traits`/`ideals`/`bonds`/`flaws` roleplay-prompt tables, which are flavor option lists rather than reference lookup content.
  - `levels` — per-class-per-level progression data (290 entries: prof bonus, spell slots, cantrips known, class-specific trackers like Rogue's sneak attack dice). Its natural key is class+level, not a standalone name, so it's **not** a registry resource/activity — it's queried directly inside `ClassDetail` via `findLevelsForClass`/`getClassLevels` (`src/lib/srd/classes.server.ts`/`.functions.ts`) and rendered as a table. The Mongo doc also includes entries for *subclass* level features (e.g. `evocation-2` alongside `wizard-2`, both carrying the parent class's index) — `findLevelsForClass` must filter `subclass: { $exists: false }` or class-level tables show duplicate/empty rows for subclass-feature levels.
- Additional content in a compatible format (TBD — schema to be designed)
- Custom campaign content authored by the DM in a structured format (TBD)

## Campaign Content Format

A structured format for campaigns is to be designed early — it underpins rules lookup, session plans, lore, NPCs, and locations. Likely JSON or Markdown with frontmatter. This is a priority design task.

## Conventions

- TypeScript strict mode
- File-based routing via TanStack Router conventions
- Keep DM view and Player view as clearly separated routes
- SRD data lives in MongoDB, queried via server functions — never hardcoded inline

## Authentication

User accounts are handled by [Clerk](https://clerk.com) via `@clerk/tanstack-react-start`. This is the foundation for per-user saved state (planned: saved tabs/combat sessions keyed by Clerk user ID) — Clerk itself only handles identity/sessions, not app data; persisting "what a given DM has open" is a separate not-yet-built feature.

- **Server wiring** (`src/start.ts`): TanStack Start auto-resolves `src/start.ts` (named export `startInstance`, created via `createStart(() => ({...}))`) as the place to register global request middleware. `clerkMiddleware()` from `@clerk/tanstack-react-start/server` is registered here so `auth()`/`clerkClient()` work in server functions. **Important**: defining a custom `requestMiddleware` array replaces TanStack Start's default CSRF middleware entirely — `src/start.ts` must explicitly re-add `createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === 'serverFn' })` alongside `clerkMiddleware()`, or server functions lose CSRF protection silently (no warning in production, only a console warning in dev).
- **Client wiring** (`src/routes/__root.tsx`): `<ClerkProvider>` wraps the whole app inside `<TooltipProvider>`. It reads `VITE_CLERK_PUBLISHABLE_KEY` automatically — no need to pass `publishableKey` as a prop.
- **Route gating** (`src/routes/index.tsx`): the `/` route's `beforeLoad` calls `getCurrentUserId()` (`src/lib/auth/auth.functions.ts` → `auth.server.ts`, following the established `.server.ts`/`.functions.ts` split) and throws `redirect({ to: '/sign-in/$' })` if there's no user — a real server-side HTTP redirect before any HTML streams, not a client-rendered gate. `/sign-in/$.tsx` and `/sign-up/$.tsx` do the inverse (`beforeLoad` redirects an already-signed-in visitor back to `/`, but only when `params._splat` is empty — a non-empty splat means a Clerk subpath like `sso-callback` is mid-flow and must not be redirected away from). **Don't gate with client components** (`<Show when="signed-in">`/`<Navigate>`) for full-page protection — an earlier version of this did, and it both flashed unstyled content and made Playwright's `home page loads` smoke test flaky (`body` reported `hidden` mid-transition) because it chained two separate async Clerk-load-then-navigate round trips instead of one redirect. `<Show when="...">` is still the right tool for small in-page conditionals (e.g. showing/hiding a single button), just not for whole-page auth gating.
- **Sign-in/up pages must own a splat route** (`src/routes/sign-in.$.tsx`, `src/routes/sign-up.$.tsx`, rendering `<SignIn routing="path" path="/sign-in" />` / `<SignUp routing="path" path="/sign-up" />`): Clerk's OAuth flow redirects back through a subpath (`/sign-in/sso-callback`) that only resolves if `SignIn`/`SignUp` is mounted on a route that can match arbitrary subpaths under it. Rendering `<SignIn />` directly on a non-splat route (e.g. inline on `/`) leaves that subpath with no matching route at all — a 404 the moment a user tries an OAuth provider, even though plain email/password sign-in looks fine.
- **User menu**: `<UserButton />` (no props needed — `afterSignOutUrl` and similar per-component redirect props were removed from this SDK version) sits in `DmShell`'s header next to the Combat mode toggle. Safe to render unconditionally there since `DmShell` only ever mounts after the `/` route's `beforeLoad` has already confirmed a signed-in user.
- **Env vars**: `VITE_CLERK_PUBLISHABLE_KEY` (client-safe, `VITE_` prefix required so Vite exposes it to the browser bundle) and `CLERK_SECRET_KEY` (server-only, never prefix this with `VITE_` or it would leak into the client bundle). Both go in `.env` (gitignored) — see `.env.example`. Get them from an application created at dashboard.clerk.com.
- **Keyless dev mode**: if `.env` has no Clerk keys at all, the SDK auto-provisions a temporary throwaway Clerk app on first run and logs a "claim your keys" URL to the console — useful for confirming the wiring works before a real Clerk account exists, but don't rely on it long-term (it's a convenience fallback, not a substitute for a real application).
- **Verifying changes that touch Clerk components live**: `ClerkProvider` wraps the whole app (`__root.tsx`), so *any* route mounts Clerk's client JS, which performs a "dev browser" handshake (a redirect out to Clerk's domain to set a cookie) the first time it runs in a fresh browser context. That handshake fails outright in this project's automated browser-preview tooling's sandboxed network (`chrome-error://chromewebdata/`), even though direct HTTP/curl requests to the dev server work fine. There is currently no way to get a live screenshot of the signed-in app (DmShell, ActivityBar, etc.) through that tooling — changes affecting authenticated UI need a human to check in a real browser.
- **e2e testing authenticated routes** (`@clerk/testing`): plain Playwright can't get past Clerk's dev-instance bot-protection/handshake either, so `e2e/clerk-global-setup.ts` (wired via `globalSetup` in `playwright.config.ts`) calls `clerkSetup()` once per test run to fetch a testing token — it auto-reads `VITE_CLERK_PUBLISHABLE_KEY`/`CLERK_SECRET_KEY` from `.env`, no extra config needed. `e2e/dm-shell.spec.ts` then uses `setupClerkTestingToken({ page })` to bypass bot protection and `clerk.signIn({ page, emailAddress })` to actually authenticate — the email-based strategy mints a sign-in token via the Backend API directly, so the test user needs no password/MFA, just needs to exist in the Clerk dev instance. That email comes from `E2E_CLERK_TEST_USER_EMAIL` (`.env`, see `.env.example`); the test calls `test.skip(...)` and is skipped entirely if that var isn't set, so it doesn't break for anyone who hasn't set up a test user yet.

## Theming (light/dark)

- **Toggle mechanism** (`src/lib/theme.ts`): `getTheme()`/`setTheme()` read/write a `theme` localStorage key (`'light'` | `'dark'`) and toggle the `dark` class on `document.documentElement`. No React context — it's plain DOM + localStorage, called directly from wherever the toggle UI lives.
- **No-flash init** (`src/routes/__root.tsx`): `<html>` no longer hardcodes `className="dark"`. Instead a blocking inline `<script>` (`THEME_INIT_SCRIPT`, a raw string — deliberately *not* imported from `theme.ts`, since this needs to run synchronously before paint and can't pull in a module) reads `localStorage.getItem('theme')` and adds the `dark` class unless it's explicitly `'light'` (so a first-ever visit with no stored preference still defaults to dark, matching the prior hardcoded behavior). Keep the two in sync by hand if the storage key or default ever changes. Because this script mutates `document.documentElement.className` outside of React, `<html>` needs `suppressHydrationWarning` — without it, React logs a hydration-mismatch warning every load (SSR renders no class, the script adds one before React hydrates).
- **Toggle UI**: lives inside the Clerk `UserButton` popover in `ActivityBar.tsx`, added via the composable `<UserButton.MenuItems><UserButton.Action label="..." labelIcon={<Sun/>} onClick={...} /></UserButton.MenuItems>` children API (rendered as JSX children of `<UserButton>`, not a prop). **Do not use the `customMenuItems` prop** — `UserButtonProps['customMenuItems']` still exists in this SDK version's types, but the actual renderer only reads `props.children` (verified by reading `@clerk/react`'s compiled source: `useUserButtonCustomMenuItems(props.children, ...)`); passing `customMenuItems` as a prop array silently does nothing, no error, no warning. `labelIcon` takes a plain `React.ReactNode` directly — no imperative portal/mount API needed despite what the prop-array version implied.
- **Verifying Clerk popover content with Playwright/`@clerk/testing`**: this *does* work even though the interactive preview tool can't (see above) — `e2e/dm-shell.spec.ts`'s `theme toggle in the user menu switches light/dark mode` test signs in, clicks the `Open user menu` button, and asserts the popover content. Two gotchas hit while building it: (1) tests that call `clerk.signIn()` must run with `test.describe.configure({ mode: 'serial' })` — concurrent sign-ins against the same dev instance race and abort navigation; (2) `page.waitForLoadState('networkidle')` never resolves against the Vite dev server (HMR keeps a connection open) — don't use it, wait for specific elements/state instead (e.g. `page.waitForFunction(() => window.Clerk?.loaded)`).
- **Clerk's own UI is restyled to match** (`src/lib/clerk-appearance.ts`, applied via `<ClerkProvider appearance={clerkAppearance}>` in `__root.tsx`): Clerk's `variables` appearance API accepts any valid CSS color string, so instead of duplicating hex values, it points straight at this app's own CSS custom properties (`colorBackground: 'var(--popover)'`, etc.). Because Clerk doesn't render into a Shadow DOM in this SDK version, these `var(...)` references inherit normally from `:root`/`.dark` on `<html>`, so Clerk's sign-in page, `UserButton` popover, etc. automatically track this app's theme (including the light/dark toggle) with zero duplicated color values to keep in sync.
- User preferences beyond the theme toggle: not built yet, deliberately — the `UserButton` menu is the agreed spot to add them later, but no specific preferences have been scoped.

## MongoDB Setup

Connection lives in `src/lib/db/mongo.server.ts` (`.server.ts` suffix keeps it out of the client bundle). Uses the official `mongodb` driver, no ODM.

Requires a local `.env` (gitignored, never commit) with:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>/
MONGODB_DB=dnd-session-toolbox
```
See `.env.example` for the template. Verify the connection with `npm run db:ping`. Seed/refresh SRD reference data with `npm run db:seed-srd`.

Atlas network access is restricted to the developer's current IP (not 0.0.0.0/0) — if connecting from a new network, add the new IP under Atlas Network Access.

## Data Access Layer Pattern

Each resource type follows a strict two-file split (per TanStack Start convention — `.server.ts` files are blocked from client import entirely):
- `*.server.ts` — plain async functions doing the actual MongoDB query (e.g. `src/lib/srd/monsters.server.ts`). Never imported by client/component code.
- `*.functions.ts` — `createServerFn` wrappers around the `.server.ts` helpers (e.g. `src/lib/srd/monsters.functions.ts`). Safe to import from anywhere, including client components — the build replaces the implementation with an RPC stub on the client.

The resource registry (`src/lib/dm-shell/resources.tsx`) wires each resource's `.functions.ts` exports into a `ResourceConfig` (panel list query, detail query, detail renderer), consumed by `DmShell.tsx` via TanStack Query (`useQuery`). Adding a new resource type means: seed data → `*.server.ts` + `*.functions.ts` pair → one `defineResource(...)` entry → a detail component. Global search (`src/lib/search/`) follows the same split and automatically covers any collection added to `SEARCHABLE_COLLECTIONS`. Detail components are free to run their own additional `useQuery` calls (e.g. `ClassDetail` fetching that class's features) — `renderDetail` just returns JSX, so the returned component follows normal React hook rules.

**Table resources** (`alignments`, `languages`, `damageTypes`): a second, parallel registry in the same file — `tableResourceConfigs`/`defineTableResource(...)` — for collections too thin to justify the side-panel-plus-per-item-detail-page pattern (no prose beyond a sentence or two per entry, and nothing elsewhere links to one specific entry). Clicking the activity icon opens *one* tab containing the whole collection as a table (`AlignmentsTable`/`LanguagesTable`/`DamageTypesTable`), instead of populating a `SidePanel` you pick an item from. Wiring in `DmShell.tsx`: `selectActivity` (the `ActivityBar` `onSelect` handler) checks `tableResourceByActivity` and opens the table's fixed single tab (id `` `${kind}-table` ``) directly instead of just setting `activeActivity`; `resourceByActivity.get(activeActivity)` naturally returns `undefined` for these activities (they're absent from `resourceConfigs`), so `SidePanel` correctly doesn't render — no extra conditional needed there. `openResource` and `handleSearchSelect` both fall back to `tableResourceByKind`/`tableResourceByActivity` after checking the normal per-item registry, so a `ResourceLink` or search hit on one of these collections opens the whole table rather than erroring (none currently link to these specifically, but the fallback is free correctness). Before converting another resource to this pattern, grep for `kind="<that-kind>"` in `src/components` first — if anything `ResourceLink`s to a specific item, converting breaks that link's destination.

**`index` is not a globally unique identifier — `_id` is deliberately never used either.** Every `*.server.ts` query strips `_id` via `projection: { _id: 0 }`; the app keys everything on the SRD's own `index` field instead. But `index` is only unique *within one collection* (enforced by a unique Mongo index per-collection in `seed-srd.ts`), not across collections — the SRD reuses plain English words across categories (the monster "Goblin" and the language "Goblin" are both `index: "goblin"`; the spell "Shield" and the equipment "Shield" are both `index: "shield"`). `TabItem` accounts for this: `id` is a composite `` `${kind}:${index}` `` key (unique across every kind), while `index` holds the bare SRD value passed to `detailFn`/`getX` calls. **Don't shortcut this** — `DmShell.tsx`'s `openTab` used to dedupe tabs on bare `id` alone; clicking the language "Goblin" while the monster "Goblin" tab was already open just refocused the monster's tab instead of opening the language, with no error. `e2e/dm-shell.spec.ts`'s `opening two resources that share an SRD index opens two distinct tabs` test (using the Spell/Equipment "Shield" collision) guards against this regressing. Switching to Mongo `_id` was considered and rejected: `seed-srd.ts` does `deleteMany`+`insertMany` on every reseed, so `_id`s aren't stable across `npm run db:seed-srd` runs, and the SRD's own embedded cross-references (`Spell.classes[].index`, etc.) are keyed by `index` regardless of what the app surfaces — `_id` wouldn't actually remove the need for kind-scoped identity, just add an unstable second id alongside it.

## shadcn/ui Conventions

- Components live in `src/components/ui/` (added via `npx shadcn@latest add <name>`) — these are owned source, not a vendored dependency. Edit them directly when needed.
- `components.json` was hand-written, not generated — the CLI's interactive init wizard doesn't handle piped/non-TTY stdin in this shell, so `npx shadcn@latest init` will hang. If re-running init is ever needed, write `components.json` manually first (style `new-york`, baseColor `zinc`, cssVariables `true`, aliases pointing `@/*` at `src/*`), then `npx shadcn@latest add <component> -y` works fine non-interactively.
- shadcn's own generated files use the `@/` import alias; existing app code uses `#/`. Both resolve to `./src/*` (see `tsconfig.json`/`package.json`) — don't bother rewriting one to match the other, they coexist fine.
- `cn()` utility at `src/lib/utils.ts` (clsx + tailwind-merge) — use it whenever a component needs conditional/merged class names, matching shadcn's own components.
- Never use raw Tailwind color utilities (`zinc-800`, `blue-400`, etc.) in app components — always use the semantic tokens (`bg-card`, `text-muted-foreground`, `border`, `bg-primary`, `bg-secondary`, etc.) so theming and the future light/dark toggle work everywhere uniformly.
- `StatCard` (`src/components/dm-shell/StatCard.tsx`) is the shared "label above value" stat box used across all `*Detail` components — don't reintroduce a local one-off version.
- `SidePanel` and `GlobalSearch` are built on shadcn's `Command` (cmdk) rather than hand-rolled filtering — `Command` provides fuzzy filtering and keyboard nav for free. When building any new searchable/filterable list, reach for `Command` first rather than re-implementing filter state.
- **Gotcha found during migration**: when multiple resource types can independently produce items sharing the same raw `index` (e.g. a Spell and an Equipment item both named "Shield" → both have `index: "shield"`), any list keyed by bare `id` will hit a React duplicate-key warning. `GlobalSearch` keys/values by `${result.activity}-${result.id}` for exactly this reason — do the same anywhere search results from multiple collections are rendered together.

## Rendering markdown from the database

A meaningful chunk of SRD text (`desc` fields on spells, magic items, equipment, and especially the merged `rules` collection) contains embedded markdown — `##` headings, `**bold**`/`***bold italic***`, and `- ` list items. This is rendered via `src/components/dm-shell/Markdown.tsx`, a thin wrapper around `react-markdown` + `remark-gfm` with component overrides styled to match the existing compact detail-pane typography (`text-xs text-muted-foreground` paragraphs, small headings, etc.).

Use `<Markdown>{paragraph}</Markdown>` instead of `<p>{paragraph}</p>` anywhere a `desc` string from SRD data is rendered as a full block of text. Don't use it for short inline excerpts (e.g. the single-line feature teasers in `ClassDetail`/`SubclassDetail` showing `feature.desc[0]` inline next to a bolded label) — `Markdown`'s default `p` wrapper is block-level and would be invalid nested inside an existing `<p>`.

**Rendering a full `desc: string[]` array**: always pass the whole array through `joinDescription(desc)` (exported from `Markdown.tsx`) into a single `<Markdown>` call — never `desc.map((p) => <Markdown>{p}</Markdown>)`. Some SRD entries (e.g. the Bag of Beans magic item) embed a GFM pipe-table as several consecutive array entries (`"| d100 | Effect |"`, `"|---|---|"`, `"| 01 | ... |"`, one per line). `remark-gfm` only parses a table when its header/separator/body rows are contiguous lines in one markdown document — rendering each array entry as its own isolated `<Markdown>` call (the original per-`Detail`-component pattern) fed the parser one row at a time with no neighbors, so the table source never resolved to a `<table>`. `joinDescription` joins consecutive table-row-shaped lines (matching `/^\s*\|.*\|\s*$/`) with a single `\n` and everything else with a blank-line paragraph break, then `Markdown.tsx`'s `table`/`thead`/`tr`/`th`/`td` overrides style the result to match the rest of the compact detail-pane typography.

## Cross-reference linking between resources

Many SRD fields are structured references — `{index, name}` objects pointing at another resource (e.g. a Spell's `classes[]`, a Class's `subclasses[]`, a Race's `traits[]`). Where the target resource is already wired into the registry, these render as clickable links via `ResourceLink`/`ResourceLinkList` (`src/components/dm-shell/ResourceLink.tsx`) instead of plain text.

Mechanism: `DmShell` exposes `openResource(kind, index, label)` through `DmShellNavigationProvider` (`src/lib/dm-shell/navigation-context.tsx`) — a React context, because detail components are rendered several layers deep (via `resource.renderDetail(...)`) and prop-drilling the tab-opening functions down to them isn't practical. `ResourceLink` calls `useDmShellNavigation().openResource(...)` on click, which switches `activeActivity` to the target resource's activity and opens/focuses its tab — same mechanism `GlobalSearch` already uses.

Fully linked now (both phases complete): Spell→Classes/Magic Schools, Class→Subclasses/Ability Scores/Proficiencies, Subclass→Class, Feature→Class/Subclass, Race entry→parent race/Traits/Ability Scores, Trait→Races/Subraces, Equipment→Equipment Categories/Weapon Properties, Magic Item→Equipment Categories, Ability Score→Skills (in `rules`), Equipment Category→Equipment, Proficiency→Classes/Races. `StatCard`'s `value` prop accepts `ReactNode` (not just `string`) specifically so a `ResourceLink`/`ResourceLinkList` can live inside a stat box (e.g. Class's "Saving throws" card).

When adding a new structured reference field anywhere: if the target `kind` already exists in the registry, use `ResourceLink`/`ResourceLinkList` immediately rather than rendering `.name` as plain text.

## Activity bar curation

Not every resource in the registry gets a visible icon in `ActivityBar`. `src/lib/mock-dm-shell-data.ts`'s `activities` array is curated independently from `resourceConfigs` — removing an entry from `activities` only hides its top-level "browse from scratch" icon; the resource itself (server functions, search coverage, detail component, and any `ResourceLink`s pointing at it) stays fully functional. `DmShell`'s panel rendering keys off `activeActivity` state via `resourceByActivity`, not off the `activities` list, so a resource reached only via a link or global search still renders correctly even with no icon.

Current policy: an activity gets a top-level icon only if it's something a DM would plausibly browse cold (reasonably sized, standalone-interesting list). Pure glossary/support tables that exist mainly as cross-reference link targets (Magic Schools, Weapon Properties, Ability Scores, Equipment Categories, Proficiencies) and lists too large to browse usefully top-down (Features, 407 entries) are deliberately excluded from `activities` — reach them via a `ResourceLink` click-through or `GlobalSearch` instead. The same applies at the opposite extreme: Backgrounds and Feats are fully wired resources with zero icon, because the SRD only has one entry each — a "browse this list" icon isn't useful when there's nothing to browse yet (the icon would just be a permanent shortcut to a single item). When adding a new resource, default to *not* adding an icon unless there's a real "browse this list" use case; it's one line to add later if that changes.

Every icon in `ActivityBar` has a `Tooltip` (`TooltipContent` showing `activity.label`) — when adding a new icon-only button anywhere in the DM Shell, follow the same pattern rather than relying on `aria-label` alone for sighted users.

## Layout gotcha: many open tabs

`TabBar` and the main content column must both guard against flex overflow: `TabBar`'s row needs `overflow-x-auto` + `flex-shrink-0` on each tab, and the main content column needs `min-w-0` (flex children default to `min-width: auto`, which refuses to shrink below content size). Without both, opening enough tabs (~6+) pushes the row wider than the viewport and the parent's `overflow-hidden` clips the entire content area invisibly — it's still in the DOM (`document.body.innerText` shows it) but not visible or even present in screenshots. If a "phantom missing content" bug ever resurfaces, check flex min-width/overflow on the row first.
