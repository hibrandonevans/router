import { expect } from '@playwright/test'
import { test } from '@tanstack/router-e2e-utils'

test('data-only with pendingComponent hydrates without browser errors', async ({
  page,
}) => {
  await page.goto('/data-only-pending-component')

  await expect(page.getByTestId('route-content')).toBeVisible()
  await expect(page.getByTestId('message')).toHaveText('loaded')
  // pending component should not appear — data is already available on hydration
  await expect(page.getByTestId('pending-component')).not.toBeVisible()
})
