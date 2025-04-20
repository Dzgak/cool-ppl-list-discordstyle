import { cache } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export class Cache<T> {
  private store = new Map<string, CacheEntry<T>>()
  private duration: number

  constructor(durationMs: number = 60000) { // Default 1 minute
    this.duration = durationMs
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    
    if (Date.now() - entry.timestamp > this.duration) {
      this.store.delete(key)
      return undefined
    }
    
    return entry.data
  }

  set(key: string, data: T): void {
    this.store.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  clear(): void {
    this.store.clear()
  }
}

// Global cache instances
export const userCache = new Cache<any>(60000)      // 1 minute
export const presenceCache = new Cache<any>(30000)   // 30 seconds
export const guildCache = new Cache<any>(300000)     // 5 minutes

// React cached fetcher
export const fetchWithCache = cache(async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 30 }
  })
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
  return response.json()
})
