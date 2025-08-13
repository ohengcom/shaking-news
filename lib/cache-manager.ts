export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  expiresAt: number
  key: string
  size: number // in bytes
}

export interface CacheStats {
  totalEntries: number
  totalSize: number // in bytes
  hitRate: number
  missRate: number
  oldestEntry?: Date
  newestEntry?: Date
}

export interface CacheConfig {
  maxSize: number // in MB
  defaultTTL: number // in minutes
  maxEntries: number
  enabled: boolean
}

class CacheManager {
  private cache = new Map<string, CacheEntry>()
  private hits = 0
  private misses = 0
  private config: CacheConfig = {
    maxSize: 50, // 50MB
    defaultTTL: 15, // 15 minutes
    maxEntries: 1000,
    enabled: true,
  }

  constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem("shaking-head-news-cache")
      if (stored) {
        const parsed = JSON.parse(stored)
        this.cache = new Map(parsed.entries || [])
        this.hits = parsed.hits || 0
        this.misses = parsed.misses || 0

        // Clean expired entries on load
        this.cleanExpired()
      }
    } catch (error) {
      console.warn("Failed to load cache from storage:", error)
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return

    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        hits: this.hits,
        misses: this.misses,
      }
      localStorage.setItem("shaking-head-news-cache", JSON.stringify(data))
    } catch (error) {
      console.warn("Failed to save cache to storage:", error)
    }
  }

  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size
  }

  private cleanExpired() {
    const now = Date.now()
    const expired: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        expired.push(key)
      }
    }

    expired.forEach((key) => this.cache.delete(key))

    if (expired.length > 0) {
      this.saveToStorage()
    }
  }

  private enforceSize() {
    const stats = this.getStats()
    const maxSizeBytes = this.config.maxSize * 1024 * 1024

    if (stats.totalSize > maxSizeBytes || stats.totalEntries > this.config.maxEntries) {
      // Remove oldest entries first
      const entries = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)

      while (
        (this.getStats().totalSize > maxSizeBytes || this.getStats().totalEntries > this.config.maxEntries) &&
        entries.length > 0
      ) {
        const [key] = entries.shift()!
        this.cache.delete(key)
      }

      this.saveToStorage()
    }
  }

  set<T>(key: string, data: T, ttlMinutes?: number): void {
    if (!this.config.enabled) return

    this.cleanExpired()

    const ttl = ttlMinutes || this.config.defaultTTL
    const now = Date.now()
    const size = this.calculateSize(data)

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl * 60 * 1000,
      key,
      size,
    }

    this.cache.set(key, entry)
    this.enforceSize()
    this.saveToStorage()
  }

  get<T>(key: string): T | null {
    if (!this.config.enabled) {
      this.misses++
      return null
    }

    this.cleanExpired()

    const entry = this.cache.get(key)
    if (!entry) {
      this.misses++
      return null
    }

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key)
      this.misses++
      this.saveToStorage()
      return null
    }

    this.hits++
    return entry.data as T
  }

  has(key: string): boolean {
    if (!this.config.enabled) return false

    this.cleanExpired()
    const entry = this.cache.get(key)
    return entry ? entry.expiresAt > Date.now() : false
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key)
    if (result) {
      this.saveToStorage()
    }
    return result
  }

  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
    this.saveToStorage()
  }

  getStats(): CacheStats {
    this.cleanExpired()

    const entries = Array.from(this.cache.values())
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0)
    const timestamps = entries.map((entry) => entry.timestamp)

    return {
      totalEntries: entries.length,
      totalSize,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      missRate: this.hits + this.misses > 0 ? this.misses / (this.hits + this.misses) : 0,
      oldestEntry: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : undefined,
      newestEntry: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : undefined,
    }
  }

  getConfig(): CacheConfig {
    return { ...this.config }
  }

  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (!this.config.enabled) {
      this.clear()
    } else {
      this.enforceSize()
    }
  }

  getAllEntries(): CacheEntry[] {
    this.cleanExpired()
    return Array.from(this.cache.values()).sort((a, b) => b.timestamp - a.timestamp)
  }
}

// Global cache instance
export const cacheManager = new CacheManager()

// Cache key generators
export const getCacheKey = {
  rssFeed: (url: string) => `rss:${url}`,
  articles: (feedId: string) => `articles:${feedId}`,
  feedMeta: (feedId: string) => `meta:${feedId}`,
}
