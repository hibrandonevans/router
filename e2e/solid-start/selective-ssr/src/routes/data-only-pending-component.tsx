import { createFileRoute } from '@tanstack/solid-router'

function PendingComponent() {
  return <div data-testid="pending-component">Loading...</div>
}

export const Route = createFileRoute('/data-only-pending-component')({
  ssr: 'data-only',
  loader: async () => {
    return { message: 'loaded' }
  },
  pendingComponent: PendingComponent,
  component: () => {
    const data = Route.useLoaderData()
    return (
      <div data-testid="route-content">
        <div data-testid="message">{data().message}</div>
      </div>
    )
  },
})
