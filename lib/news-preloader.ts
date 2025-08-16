import { parseRSSFeed } from "./rss-parser"
import { cacheManager } from "./cache-manager"

interface NewsSource {
  id: number
  name: string
  url: string
  active: boolean
}

class NewsPreloader {
  private preloadInterval: NodeJS.Timeout | null = null
  private isPreloading = false
  private lastPreloadTime = 0
  private preloadFrequency = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
  private maxDailyRequests = 90 // Leave some buffer from 100 limit

  constructor() {
    this.startPreloading()
  }

  startPreloading() {
    if (this.preloadInterval) {
      clearInterval(this.preloadInterval)
    }

    // Preload immediately if no recent preload
    if (Date.now() - this.lastPreloadTime > this.preloadFrequency) {
      this.preloadNews()
    }

    // Set up regular preloading
    this.preloadInterval = setInterval(() => {
      this.preloadNews()
    }, this.preloadFrequency)

    console.log(`[v0] News preloader started - will refresh every ${this.preloadFrequency / 1000 / 60} minutes`)
  }

  stopPreloading() {
    if (this.preloadInterval) {
      clearInterval(this.preloadInterval)
      this.preloadInterval = null
    }
    console.log("[v0] News preloader stopped")
  }

  async preloadNews(sources?: NewsSource[]) {
    if (this.isPreloading) {
      console.log("[v0] Preloading already in progress, skipping")
      return
    }

    // Check daily request limit
    const today = new Date().toDateString()
    const requestCountKey = `daily-requests-${today}`
    const dailyRequests = cacheManager.get<number>(requestCountKey) || 0

    if (dailyRequests >= this.maxDailyRequests) {
      console.log(`[v0] Daily API request limit reached (${dailyRequests}/${this.maxDailyRequests}), skipping preload`)
      return
    }

    this.isPreloading = true
    this.lastPreloadTime = Date.now()

    try {
      // Default sources if none provided
      const defaultSources: NewsSource[] = sources || [
        {
          id: 1,
          name: "每日新闻",
          url: "https://news.ravelloh.top/latest.json",
          active: true,
        },
        {
          id: 2,
          name: "Daily News",
          url: "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/rss.xml",
          active: true,
        },
      ]

      const activeSources = defaultSources.filter((source) => source.active)
      console.log(`[v0] Preloading news from ${activeSources.length} sources`)

      let requestsMade = 0
      for (const source of activeSources) {
        try {
          // Check if we still have cache for this source
          const cacheKey = `rss:${source.url}`
          const cached = cacheManager.get(cacheKey)

          if (!cached && dailyRequests + requestsMade < this.maxDailyRequests) {
            console.log(`[v0] Preloading: ${source.name}`)
            await parseRSSFeed(source.url, source.name, true)
            requestsMade++

            // Small delay between requests to be respectful
            await new Promise((resolve) => setTimeout(resolve, 1000))
          } else if (cached) {
            console.log(`[v0] Skipping preload for ${source.name} - already cached`)
          } else {
            console.log(`[v0] Skipping preload for ${source.name} - daily limit reached`)
          }
        } catch (error) {
          console.warn(`[v0] Failed to preload ${source.name}:`, error)
        }
      }

      // Update daily request counter
      if (requestsMade > 0) {
        cacheManager.set(requestCountKey, dailyRequests + requestsMade, 24 * 60) // 24 hours TTL
        console.log(
          `[v0] Made ${requestsMade} API requests today (${dailyRequests + requestsMade}/${this.maxDailyRequests})`,
        )
      }
    } catch (error) {
      console.error("[v0] Error during news preloading:", error)
    } finally {
      this.isPreloading = false
    }
  }

  getStatus() {
    const today = new Date().toDateString()
    const requestCountKey = `daily-requests-${today}`
    const dailyRequests = cacheManager.get<number>(requestCountKey) || 0

    return {
      isPreloading: this.isPreloading,
      lastPreloadTime: new Date(this.lastPreloadTime),
      nextPreloadTime: new Date(this.lastPreloadTime + this.preloadFrequency),
      dailyRequests,
      maxDailyRequests: this.maxDailyRequests,
      cacheStats: cacheManager.getStats(),
    }
  }

  async forcePreload(sources?: NewsSource[]) {
    console.log("[v0] Force preloading news...")
    await this.preloadNews(sources)
  }
}

// Global preloader instance
export const newsPreloader = new NewsPreloader()

// Utility function to get cached news quickly
export async function getCachedNews(sources: NewsSource[]): Promise<string[]> {
  const activeSources = sources.filter((source) => source.active)
  const newsArticles: string[] = []

  for (const source of activeSources) {
    try {
      // Try to get from cache first
      const result = await parseRSSFeed(source.url, source.name, true)
      const titles = result.articles.map((article) => article.title)
      newsArticles.push(...titles)
    } catch (error) {
      console.warn(`[v0] Failed to get cached news from ${source.name}:`, error)
    }
  }

  return newsArticles
}
