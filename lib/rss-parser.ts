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

// JSON news parser using browser built-in APIs
export async function parseRSSFeed(url: string, feedName: string): Promise<RSSParseResult> {
  console.log(`Fetching JSON news: ${feedName} from ${url}`)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // Increased timeout to 15 seconds

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "ShakingHeadNews/1.0", // Added User-Agent header
      },
      mode: "cors",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    }

    const jsonData = await response.json()

    if (jsonData.news && Array.isArray(jsonData.news)) {
      const articles: ParsedArticle[] = jsonData.news.map((item: any, index: number) => ({
        id: `currents-${Date.now()}-${index}`,
        title: String(item.title || item.headline || `News ${index + 1}`).trim(),
        summary: String(item.description || "").trim(),
        link: String(item.url || "#").trim(),
        pubDate: new Date(item.published || Date.now()),
        category: item.category?.[0] || undefined,
        source: feedName,
      }))

      return {
        articles,
        feedTitle: feedName,
        feedDescription: `Latest news from ${feedName}`,
      }
    }

    // Handle Chinese JSON format
    if (jsonData.date && jsonData.content && Array.isArray(jsonData.content)) {
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

      return {
        articles,
        feedTitle: feedName,
        feedDescription: `Latest news from ${feedName} - ${jsonData.date}`,
      }
    }

    // Handle other possible JSON structures
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

    return {
      articles,
      feedTitle: jsonData.title || jsonData.name || feedName,
      feedDescription: jsonData.description || `Latest news from ${feedName}`,
    }
  } catch (error) {
    console.error("Error parsing JSON news:", error)

    const mockArticles: ParsedArticle[] = [
      {
        id: `fallback-${Date.now()}-1`,
        title: "新闻源暂时无法访问",
        summary: "可能的原因：网络连接问题、API限制或服务器维护",
        link: "#",
        pubDate: new Date(),
        category: "系统消息",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-2`,
        title: "这是一个摇头新闻应用",
        summary: "页面会定期倾斜来帮助您活动颈椎，保护颈部健康",
        link: "#",
        pubDate: new Date(),
        category: "应用说明",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-3`,
        title: "您可以在设置中配置数据源",
        summary: "点击右下角设置按钮来添加或修改新闻源",
        link: "#",
        pubDate: new Date(),
        category: "使用提示",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-4`,
        title: "支持多种新闻源格式",
        summary: "支持标准JSON格式和自定义新闻API",
        link: "#",
        pubDate: new Date(),
        category: "功能介绍",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-5`,
        title: "定期摇动有助于颈椎健康",
        summary: "建议每30秒到2分钟摇动一次，避免长时间保持同一姿势",
        link: "#",
        pubDate: new Date(),
        category: "健康提示",
        source: feedName,
      },
    ]

    return {
      articles: mockArticles,
      feedTitle: feedName,
      feedDescription: `Fallback content for ${feedName}`,
    }
  }
}
