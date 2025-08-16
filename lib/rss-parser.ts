import { cacheManager, getCacheKey } from "./cache-manager"

export interface ParsedArticle {
  id: string
  title: string
  summary: string
  link: string
  pubDate: Date
  category?: string
  source: string
}

export interface RSSParseResult {
  articles: ParsedArticle[]
  feedTitle?: string
  feedDescription?: string
}

export async function parseRSSFeed(url: string, feedName: string, useCache = true): Promise<RSSParseResult> {
  const cacheKey = getCacheKey.rssFeed(url)

  if (useCache) {
    const cached = cacheManager.get<RSSParseResult>(cacheKey)
    if (cached) {
      console.log(`[v0] Using cached news data for ${feedName}`)
      return cached
    }
  }

  console.log(`[v0] Fetching JSON news: ${feedName} from ${url}`)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    if (url.includes("newsapi.org")) {
      console.log(`[v0] Attempting NewsAPI.org request - this may fail due to CORS restrictions`)
    } else if (url.includes("rss2json.com")) {
      console.log(`[v0] Fetching via RSS2JSON service - CORS friendly`)
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "ShakingHeadNews/1.0",
      },
      mode: "cors",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.log(`[v0] HTTP Error: ${response.status} ${response.statusText} for ${url}`)
      if (response.status === 404) {
        console.warn(`News API endpoint not found: ${url}`)
        throw new Error(`API endpoint not configured on domain (404)`)
      } else if (response.status === 403) {
        throw new Error(`Access forbidden - check API permissions (403)`)
      } else if (response.status === 426) {
        throw new Error(`NewsAPI.org blocks browser requests - requires server-side implementation (426)`)
      } else if (response.status >= 500) {
        throw new Error(`Server error - API temporarily unavailable (${response.status})`)
      } else {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }
    }

    const jsonData = await response.json()
    console.log(`[v0] Successfully fetched data from ${feedName}:`, jsonData)

    let result: RSSParseResult

    if (jsonData.status === "ok" && jsonData.articles && Array.isArray(jsonData.articles)) {
      const articles: ParsedArticle[] = jsonData.articles.map((item: any, index: number) => ({
        id: `newsapi-${Date.now()}-${index}`,
        title: String(item.title || `News ${index + 1}`).trim(),
        summary: String(item.description || "").trim(),
        link: String(item.url || "#").trim(),
        pubDate: new Date(item.publishedAt || Date.now()),
        category: item.source?.name || undefined,
        source: feedName,
      }))

      result = {
        articles,
        feedTitle: feedName,
        feedDescription: `Latest news from ${feedName} via NewsAPI`,
      }
    } else if (jsonData.status === "ok" && jsonData.items && Array.isArray(jsonData.items)) {
      // RSS2JSON format (used for BBC News and other RSS feeds)
      const articles: ParsedArticle[] = jsonData.items.map((item: any, index: number) => ({
        id: `rss2json-${Date.now()}-${index}`,
        title: String(item.title || `News ${index + 1}`).trim(),
        summary: String(item.description || item.content || "")
          .trim()
          .replace(/<[^>]*>/g, ""), // Strip HTML tags
        link: String(item.link || "#").trim(),
        pubDate: new Date(item.pubDate || Date.now()),
        category: item.categories?.[0] || undefined,
        source: feedName,
      }))

      result = {
        articles,
        feedTitle: jsonData.feed?.title || feedName,
        feedDescription: jsonData.feed?.description || `Latest news from ${feedName} via RSS`,
      }
    } else if (jsonData.news && Array.isArray(jsonData.news)) {
      const articles: ParsedArticle[] = jsonData.news.map((item: any, index: number) => ({
        id: `currents-${Date.now()}-${index}`,
        title: String(item.title || item.headline || `News ${index + 1}`).trim(),
        summary: String(item.description || "").trim(),
        link: String(item.url || "#").trim(),
        pubDate: new Date(item.published || Date.now()),
        category: item.category?.[0] || undefined,
        source: feedName,
      }))

      result = {
        articles,
        feedTitle: feedName,
        feedDescription: `Latest news from ${feedName}`,
      }
    } else if (jsonData.date && jsonData.content && Array.isArray(jsonData.content)) {
      let pubDate = new Date()
      if (jsonData.date) {
        pubDate = new Date(jsonData.date)
        if (isNaN(pubDate.getTime())) {
          pubDate = new Date()
        }
      }

      const articles: ParsedArticle[] = jsonData.content.map((newsTitle: string, index: number) => ({
        id: `news-${Date.now()}-${index}`,
        title: String(newsTitle).trim(),
        summary: "",
        link: "#",
        pubDate,
        category: undefined,
        source: feedName,
      }))

      result = {
        articles,
        feedTitle: feedName,
        feedDescription: `Latest news from ${feedName} - ${jsonData.date}`,
      }
    } else {
      let newsItems = []
      if (Array.isArray(jsonData)) {
        newsItems = jsonData
      } else if (jsonData.articles && Array.isArray(jsonData.articles)) {
        newsItems = jsonData.articles
      } else if (jsonData.data && Array.isArray(jsonData.data)) {
        newsItems = jsonData.data
      } else {
        throw new Error("Unsupported JSON structure")
      }

      const articles: ParsedArticle[] = newsItems.map((item: any, index: number) => {
        const title = item.title || item.headline || item.name || `News ${index + 1}`
        const summary = item.summary || item.description || item.content || item.excerpt || ""
        const link = item.link || item.url || item.href || "#"
        const category = item.category || item.tag || item.type

        let pubDate = new Date()
        const dateField = item.pubDate || item.publishedAt || item.date || item.timestamp || item.time
        if (dateField) {
          pubDate = new Date(dateField)
          if (isNaN(pubDate.getTime())) {
            pubDate = new Date()
          }
        }

        return {
          id: item.id || `json-${Date.now()}-${index}`,
          title: String(title).trim(),
          summary: String(summary).trim(),
          link: String(link).trim(),
          pubDate,
          category: category ? String(category).trim() : undefined,
          source: feedName,
        }
      })

      result = {
        articles,
        feedTitle: jsonData.title || jsonData.name || feedName,
        feedDescription: jsonData.description || `Latest news from ${feedName}`,
      }
    }

    if (useCache) {
      cacheManager.set(cacheKey, result, 240) // 4 hours TTL
      console.log(`[v0] Cached news data for ${feedName} (4 hours TTL)`)
    }

    return result
  } catch (error) {
    console.error("Error parsing JSON news:", error)

    if (useCache) {
      const expiredCache = cacheManager.get<RSSParseResult>(cacheKey)
      if (expiredCache) {
        console.log(`[v0] Using expired cache for ${feedName} due to API error`)
        return expiredCache
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isApiNotFound = errorMessage.includes("404") || errorMessage.includes("not configured")

    const mockArticles: ParsedArticle[] = [
      {
        id: `fallback-${Date.now()}-1`,
        title: isApiNotFound ? "新闻API需要配置" : "新闻源暂时无法访问",
        summary: isApiNotFound
          ? "域名 www.888388.xyz 需要配置以下API端点：/latest.json (中文新闻) 和 /news-en.json (英文新闻)"
          : "可能的原因：网络连接问题、API限制或服务器维护。正在使用缓存数据。",
        link: "#",
        pubDate: new Date(),
        category: "系统消息",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-2`,
        title: "摇头新闻 - 健康阅读新体验",
        summary: "这个应用会定期倾斜页面来帮助您活动颈椎，建议配合适当的颈部运动",
        link: "#",
        pubDate: new Date(),
        category: "应用介绍",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-3`,
        title: "智能缓存系统",
        summary: "应用使用4小时缓存来减少API调用，确保在有限的API配额下提供最佳体验",
        link: "#",
        pubDate: new Date(),
        category: "技术说明",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-4`,
        title: "支持中英文双语",
        summary: "应用支持中文和英文界面，可在设置中切换语言和配置不同的新闻源",
        link: "#",
        pubDate: new Date(),
        category: "功能特色",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-5`,
        title: "个性化设置",
        summary: "可调整摇动频率(5-300秒)、最大倾斜角度(5-45度)、字体大小等参数",
        link: "#",
        pubDate: new Date(),
        category: "使用指南",
        source: feedName,
      },
    ]

    return {
      articles: mockArticles,
      feedTitle: feedName,
      feedDescription: `Fallback content for ${feedName} - ${errorMessage}`,
    }
  }
}
