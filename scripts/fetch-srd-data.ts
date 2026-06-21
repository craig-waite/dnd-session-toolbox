import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DATA_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '../src/data/srd/2014',
)
const BASE_URL =
  'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en'

// Only the files scripts/seed-srd.ts actually imports.
// Note: 'Rules' is the plain top-level rules file, distinct from 'Rule-Sections'.
const FILES = [
  '5e-SRD-Ability-Scores',
  'Alignments',
  'Backgrounds',
  'Classes',
  'Conditions',
  'Damage-Types',
  'Equipment',
  'Equipment-Categories',
  'Feats',
  'Features',
  'Languages',
  'Levels',
  'Magic-Items',
  'Magic-Schools',
  'Monsters',
  'Proficiencies',
  'Races',
  'Rule-Sections',
  'Rules',
  'Skills',
  'Spells',
  'Subclasses',
  'Subraces',
  'Traits',
  'Weapon-Properties',
].map((name) => (name.startsWith('5e-SRD-') ? name : `5e-SRD-${name}`))

async function ensureFile(name: string) {
  const path = join(DATA_DIR, `${name}.json`)
  if (existsSync(path)) return

  console.log(`Fetching ${name}.json...`)
  const response = await fetch(`${BASE_URL}/${name}.json`)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${name}.json: ${response.status} ${response.statusText}`,
    )
  }
  writeFileSync(path, await response.text())
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true })
  await Promise.all(FILES.map(ensureFile))
  console.log('SRD seed data ready.')
}

main().catch((error) => {
  console.error('Failed to fetch SRD seed data:')
  console.error(error)
  process.exit(1)
})
