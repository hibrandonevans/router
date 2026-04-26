---
'@tanstack/solid-router': patch
---

Fix hydration mismatch for `ssr: 'data-only'` routes that define a `pendingComponent`. Previously the server rendered the pending component as a fallback, but the client hydrated directly into the real component (since data is already available), causing a mismatch. The server now renders nothing for `data-only` routes so hydration succeeds cleanly.
