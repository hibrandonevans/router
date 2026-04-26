import { Await, createFileRoute } from '@tanstack/solid-router'
import { createServerFn } from '@tanstack/solid-start'

const personServerFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { name: string }) => data)
  .handler(({ data }) => {
    return { name: data.name, randomNumber: Math.floor(Math.random() * 100) }
  })

const slowServerFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    await new Promise((r) => setTimeout(r, 1000))
    return { name: data.name, randomNumber: Math.floor(Math.random() * 100) }
  })

export const Route = createFileRoute('/deferred-without-suspense')({
  loader: async () => {
    return {
      deferredStuff: new Promise<string>((r) =>
        setTimeout(() => r('Hello deferred!'), 2000),
      ),
      deferredPerson: slowServerFn({ data: { name: 'Tanner Linsley' } }),
      person: await personServerFn({ data: { name: 'John Doe' } }),
    }
  },
  component: DeferredWithoutSuspense,
})

function DeferredWithoutSuspense() {
  const loaderData = Route.useLoaderData()

  return (
    <div class="p-2">
      <div data-testid="regular-person">
        {loaderData().person.name} - {loaderData().person.randomNumber}
      </div>
      <div data-testid="deferred-person-fallback">Loading person...</div>
      <Await
        promise={loaderData().deferredPerson}
        fallback={<div data-testid="deferred-person-fallback">Loading person...</div>}
        children={(data) => (
          <div data-testid="deferred-person">
            {data.name} - {data.randomNumber}
          </div>
        )}
      />
      <div data-testid="deferred-stuff-fallback">Loading stuff...</div>
      <Await
        promise={loaderData().deferredStuff}
        fallback={<div data-testid="deferred-stuff-fallback">Loading stuff...</div>}
        children={(data) => <h3 data-testid="deferred-stuff">{data}</h3>}
      />
    </div>
  )
}
