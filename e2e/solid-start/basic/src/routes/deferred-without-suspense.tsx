import { Await, createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/deferred-without-suspense')({
  loader: async () => {
    return {
      deferredStuff: new Promise<string>((r) =>
        setTimeout(() => r('Hello deferred!'), 2000),
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
        fallback={<div data-testid="deferred-fallback">Loading deferred...</div>}
        children={(data) => <h3 data-testid="deferred-stuff">{data}</h3>}
      />
    </div>
  )
}
