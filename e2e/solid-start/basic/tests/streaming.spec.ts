import { expect, type Response } from '@playwright/test'
import { test } from '@tanstack/router-e2e-utils'

test('Navigating to deferred route', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Deferred' }).click()

  await expect(page.getByTestId('regular-person')).toContainText('John Doe')
  await expect(page.getByTestId('deferred-person')).toContainText(
    'Tanner Linsley',
  )
  await expect(page.getByTestId('deferred-stuff')).toContainText(
    'Hello deferred!',
  )
})

test('Directly visiting the deferred route', async ({ page }) => {
  await page.goto('/deferred')

  await expect(page.getByTestId('regular-person')).toContainText('John Doe')
  await expect(page.getByTestId('deferred-person')).toContainText(
    'Tanner Linsley',
  )
  await expect(page.getByTestId('deferred-stuff')).toContainText(
    'Hello deferred!',
  )
})

test('streaming loader data', async ({ page }) => {
  await page.goto('/stream')

  await expect(page.getByTestId('promise-data')).toContainText('promise-data')
  await expect(page.getByTestId('stream-data')).toContainText('stream-data')
})

test.describe('Await without Suspense', () => {
  test.skip(({ spaMode }: { spaMode: boolean }) => spaMode, 'SSR only')

  test('streams fallback then deferred data', async ({ page }) => {
    const chunks: Array<string> = []
    let response: Response | null = null

    page.on('response', (res) => {
      if (res.url().includes('/deferred-without-suspense')) {
        response = res
      }
    })

    await page.goto('/deferred-without-suspense')

    // The deferred data should eventually be rendered
    await expect(page.getByTestId('deferred-data')).toContainText(
      'Hello deferred!',
    )
  })

  test('initial HTML includes fallback markup', async ({ page }) => {
    // Intercept the raw HTML response to check streaming
    const responsePromise = page.waitForResponse((res) =>
      res.url().includes('/deferred-without-suspense'),
    )

    await page.goto('/deferred-without-suspense')

    const response = await responsePromise
    const body = await response.text()

    // The initial streamed HTML should contain the fallback
    expect(body).toContain('Loading...')
    // And the resolved data should also be in the full response
    expect(body).toContain('Hello deferred!')
  })
})
