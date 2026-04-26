import { Await, createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/deferred-without-suspense')({
  loader: async () => {
    return {
      deferredStuff: new Promise<string>((r) =>
        setTimeout(() => r('Hello deferred!'), 500),
      ),
    }
  },
  component: DeferredWithoutSuspense,
})

function DeferredWithoutSuspense() {
  const loaderData = Route.useLoaderData()

  return (
    <div class="p-2">
      <Await
        promise={loaderData().deferredStuff}
        fallback={<div data-testid="deferred-fallback">Loading...</div>}
        children={(data) => <h3 data-testid="deferred-data">{data}</h3>}
      />
    </div>
  )
}
