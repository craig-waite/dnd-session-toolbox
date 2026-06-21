import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'

const testUserEmail = process.env.E2E_CLERK_TEST_USER_EMAIL

test.skip(
  !testUserEmail,
  'Set E2E_CLERK_TEST_USER_EMAIL to an existing Clerk user to run authenticated e2e tests',
)

// Run serially: concurrent clerk.signIn() calls against the same dev instance
// race and abort the navigation in beforeEach.
test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
  await setupClerkTestingToken({ page })
  await page.goto('/sign-in')
  await clerk.signIn({
    page,
    emailAddress: testUserEmail as string,
  })
  await page.goto('/')
  // Wait for hydration — clicking before React attaches its handlers is a
  // silent no-op (the SSR-rendered button is visible but inert).
  await page.waitForFunction(() => window.Clerk?.loaded)
})

test('signed-in user sees the DM shell', async ({ page }) => {
  await expect(
    page.getByRole('banner').getByText('DM session toolbox'),
  ).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Tool categories' }),
  ).toBeVisible()
})

test('theme toggle in the user menu switches light/dark mode', async ({
  page,
}) => {
  const html = page.locator('html')
  const userButtonTrigger = page.getByRole('button', {
    name: 'Open user menu',
  })

  const wasDark = await html.evaluate((el) => el.classList.contains('dark'))

  await userButtonTrigger.click()
  const toggleItem = page.getByText(/Switch to (light|dark) mode/)
  await expect(toggleItem).toBeVisible()
  await toggleItem.click()

  await expect(html).toHaveClass(wasDark ? /^(?!.*dark).*$/ : /dark/)
})

test('languages activity opens a single consolidated table, not a side panel', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Languages' }).click()

  await expect(
    page.getByRole('navigation', { name: 'Tool categories' }),
  ).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Languages' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Script' })).toBeVisible()

  // All 16 SRD languages render as rows in one table, rather than requiring
  // a side-panel pick to view each one individually.
  await expect(page.locator('table tbody tr')).toHaveCount(16)

  await expect(page.getByPlaceholder(/Filter/)).not.toBeVisible()
})

test('opening two resources that share an SRD index opens two distinct tabs', async ({
  page,
}) => {
  // The Equipment item "Shield" and the Spell "Shield" both have
  // index "shield" — tabs must be keyed by kind+index, not bare index, or
  // opening the second one just refocuses the first.
  await page.getByRole('button', { name: 'Equipment' }).click()
  await page.getByRole('option', { name: 'Shield', exact: true }).click()
  await expect(page.getByRole('tab', { name: 'Shield' }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Spells' }).click()
  await page.getByRole('option', { name: 'Shield', exact: true }).click()

  await expect(page.getByRole('tab', { name: 'Shield' })).toHaveCount(2)
  // The spell's own detail (Level 1 Abjuration) must be showing, not the
  // equipment's (Armor) — confirms the second click opened a new tab rather
  // than just refocusing the first "shield" tab already open.
  await expect(page.getByText('Level 1')).toBeVisible()
})
