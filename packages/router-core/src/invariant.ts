export function invariant(): never {
  throw new Error('Invariant failed')
}

export function debugTrace(message: string, context?: unknown): void {
  console.log('[router-core/debug]', message, context)
  console.log('trace level 2:', new Error().stack)
}
