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
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsonData = await response.json()

    if (jsonData.date && jsonData.content && Array.isArray(jsonData.content)) {
      // Parse the date from the JSON
      let pubDate = new Date()
      if (jsonData.date) {
        // Handle date format like "2025/08/13"
        pubDate = new Date(jsonData.date)
        if (isNaN(pubDate.getTime())) {
          pubDate = new Date()
        }
      }

      const articles: ParsedArticle[] = jsonData.content.map((newsTitle: string, index: number) => ({
        id: `news-${Date.now()}-${index}`,
        title: String(newsTitle).trim(),
        summary: "", // No summary in this format
        link: "#", // No link in this format
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
    } else if (jsonData.news && Array.isArray(jsonData.news)) {
      newsItems = jsonData.news
    } else {
      throw new Error("Unsupported JSON structure")
    }

    const articles: ParsedArticle[] = newsItems.map((item: any, index: number) => {
      // Handle different possible field names
      const title = item.title || item.headline || item.name || `新闻 ${index + 1}`
      const summary = item.summary || item.description || item.content || item.excerpt || ""
      const link = item.link || item.url || item.href || "#"
      const category = item.category || item.tag || item.type

      // Handle different date formats
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

    const result: RSSParseResult = {
      articles,
      feedTitle: jsonData.title || jsonData.name || feedName,
      feedDescription: jsonData.description || `Latest news from ${feedName}`,
    }

    return result
  } catch (error) {
    console.error("Error parsing JSON news:", error)

    // Return fallback content if JSON parsing fails
    const mockArticles: ParsedArticle[] = [
      {
        id: `fallback-${Date.now()}-1`,
        title: "无法获取新闻数据，显示备用内容",
        summary: "新闻源暂时无法访问，请稍后重试",
        link: "#",
        pubDate: new Date(),
        category: "系统消息",
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
