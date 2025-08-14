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
      if (response.status === 404) {
        console.warn(`News API endpoint not found: ${url}`)
        throw new Error(`API endpoint not configured on domain (404)`)
      } else if (response.status === 403) {
        throw new Error(`Access forbidden - check API permissions (403)`)
      } else if (response.status >= 500) {
        throw new Error(`Server error - API temporarily unavailable (${response.status})`)
      } else {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }
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

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isApiNotFound = errorMessage.includes("404") || errorMessage.includes("not configured")

    const mockArticles: ParsedArticle[] = [
      {
        id: `fallback-${Date.now()}-1`,
        title: isApiNotFound ? "新闻API需要配置" : "新闻源暂时无法访问",
        summary: isApiNotFound
          ? "域名 www.888388.xyz 需要配置以下API端点：/latest.json (中文新闻) 和 /news-en.json (英文新闻)"
          : "可能的原因：网络连接问题、API限制或服务器维护",
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
        title: "API配置说明",
        summary: isApiNotFound
          ? '请在服务器上创建JSON端点，返回格式：{"date":"2025/01/01","content":["新闻1","新闻2"]}'
          : "您可以在设置中添加其他可用的新闻源",
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
      {
        id: `fallback-${Date.now()}-6`,
        title: "颈椎健康提醒",
        summary: "定期的页面倾斜有助于缓解颈椎疲劳，建议配合适当的颈部运动",
        link: "#",
        pubDate: new Date(),
        category: "健康建议",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-7`,
        title: "Google账户同步",
        summary: "登录后可以同步个人设置，在不同设备间保持一致的使用体验",
        link: "#",
        pubDate: new Date(),
        category: "账户功能",
        source: feedName,
      },
      {
        id: `fallback-${Date.now()}-8`,
        title: "开源项目",
        summary: "这是一个创新的开源项目，结合了新闻阅读和健康理念",
        link: "#",
        pubDate: new Date(),
        category: "项目信息",
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
