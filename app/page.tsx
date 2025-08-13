"use client"

import { useState, useEffect } from "react"
import { parseRSSFeed } from "@/lib/rss-parser"
import { Settings, X, Plus, Trash2 } from "lucide-react"

const texts = {
  zh: {
    settings: "设置",
    shakingSettings: "摇动设置",
    frequency: "摇动频率 (秒)",
    frequencyHint: "建议范围：5-300秒",
    showStatus: "显示状态信息",
    showStatusHint: "显示倾斜角度和倒计时信息",
    fontSize: "字体大小",
    fontSizeHint: "调整新闻文字大小",
    small: "小",
    medium: "中",
    large: "大",
    dataSourceSettings: "数据源设置",
    addNewSource: "添加新数据源",
    sourceName: "数据源名称",
    sourceUrl: "JSON数据链接",
    addSource: "添加数据源",
    loading: "正在加载新闻...",
    loadError: "无法加载新闻内容，请检查网络连接",
    tiltAngle: "倾斜角度",
    nextTilt: "下次倾斜",
    seconds: "秒",
    language: "语言",
    languageHint: "选择界面语言",
    dailyNews: "每日新闻",
  },
  en: {
    settings: "Settings",
    shakingSettings: "Shaking Settings",
    frequency: "Frequency (seconds)",
    frequencyHint: "Recommended range: 5-300 seconds",
    showStatus: "Show Status Info",
    showStatusHint: "Display tilt angle and countdown",
    fontSize: "Font Size",
    fontSizeHint: "Adjust news text size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    dataSourceSettings: "Data Source Settings",
    addNewSource: "Add New Data Source",
    sourceName: "Source Name",
    sourceUrl: "JSON Data URL",
    addSource: "Add Source",
    loading: "Loading news...",
    loadError: "Unable to load news content, please check network connection",
    tiltAngle: "Tilt Angle",
    nextTilt: "Next Tilt",
    seconds: "s",
    language: "Language",
    languageHint: "Select interface language",
    dailyNews: "Daily News",
  },
}

function SettingsModal({
  isOpen,
  onClose,
  frequency,
  onFrequencyChange,
  showStatus,
  onShowStatusChange,
  fontSize,
  onFontSizeChange,
  language,
  onLanguageChange,
}: {
  isOpen: boolean
  onClose: () => void
  frequency: number
  onFrequencyChange: (freq: number) => void
  showStatus: boolean
  onShowStatusChange: (show: boolean) => void
  fontSize: string
  onFontSizeChange: (size: string) => void
  language: "zh" | "en"
  onLanguageChange: (lang: "zh" | "en") => void
}) {
  const getDefaultDataSources = (lang: "zh" | "en") => {
    if (lang === "en") {
      return [
        {
          id: 1,
          name: texts[lang].dailyNews,
          url: "https://api.currentsapi.services/v1/latest-news?apiKey=iDKcx-tASvoDgtzsUAfw-OdgJvbPIhgnEPE6mcxp66zq7SHe",
          active: true,
        },
      ]
    } else {
      return [{ id: 1, name: texts[lang].dailyNews, url: "https://news.ravelloh.top/latest.json", active: true }]
    }
  }

  const [dataSources, setDataSources] = useState(getDefaultDataSources(language))
  const [newSourceName, setNewSourceName] = useState("")
  const [newSourceUrl, setNewSourceUrl] = useState("")

  useEffect(() => {
    setDataSources(getDefaultDataSources(language))
  }, [language])

  const t = texts[language]

  const addDataSource = () => {
    if (newSourceName && newSourceUrl) {
      const newSource = {
        id: Date.now(),
        name: newSourceName,
        url: newSourceUrl,
        active: false,
      }
      setDataSources([...dataSources, newSource])
      setNewSourceName("")
      setNewSourceUrl("")
    }
  }

  const removeDataSource = (id: number) => {
    setDataSources(dataSources.filter((source) => source.id !== id))
  }

  const toggleDataSource = (id: number) => {
    setDataSources(dataSources.map((source) => (source.id === id ? { ...source, active: !source.active } : source)))
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-1/4 min-w-80 bg-white bg-opacity-95 backdrop-blur-sm shadow-2xl overflow-y-auto z-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-green-800">{t.settings}</h2>
          <button onClick={onClose} className="p-1 hover:bg-green-100 rounded-full transition-colors">
            <X size={20} className="text-green-600" />
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-base font-semibold mb-3 text-green-700">{t.language}</h3>
          <div className="mb-4">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as "zh" | "en")}
              className="w-full px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
            <p className="text-xs text-green-500 mt-1">{t.languageHint}</p>
          </div>
        </div>

        {/* Frequency Settings */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-3 text-green-700">{t.shakingSettings}</h3>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2 text-green-600">{t.frequency}</label>
            <input
              type="number"
              min="5"
              max="300"
              value={frequency}
              onChange={(e) => onFrequencyChange(Number(e.target.value))}
              className="w-full px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs"
            />
            <p className="text-xs text-green-500 mt-1">{t.frequencyHint}</p>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs font-medium text-green-600">
              <input
                type="checkbox"
                checked={showStatus}
                onChange={(e) => onShowStatusChange(e.target.checked)}
                className="w-3 h-3 text-green-600 rounded focus:ring-green-500"
              />
              {t.showStatus}
            </label>
            <p className="text-xs text-green-500 mt-1">{t.showStatusHint}</p>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium mb-2 text-green-600">{t.fontSize}</label>
            <select
              value={fontSize}
              onChange={(e) => onFontSizeChange(e.target.value)}
              className="w-full px-2 py-1 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs"
            >
              <option value="text-xs">{t.small}</option>
              <option value="text-sm">{t.medium}</option>
              <option value="text-base">{t.large}</option>
            </select>
            <p className="text-xs text-green-500 mt-1">{t.fontSizeHint}</p>
          </div>
        </div>

        {/* Data Source Settings */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-3 text-green-700">{t.dataSourceSettings}</h3>

          {/* Current Data Sources */}
          <div className="space-y-3 mb-4">
            {dataSources.map((source) => (
              <div key={source.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={source.active}
                  onChange={() => toggleDataSource(source.id)}
                  className="w-3 h-3 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-green-800 truncate text-xs">{source.name}</div>
                  <div className="text-xs text-green-600 truncate">{source.url}</div>
                </div>
                {dataSources.length > 1 && (
                  <button
                    onClick={() => removeDataSource(source.id)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Data Source */}
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-medium text-green-700">{t.addNewSource}</h4>
            <input
              type="text"
              placeholder={t.sourceName}
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs"
            />
            <input
              type="url"
              placeholder={t.sourceUrl}
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs"
            />
            <button
              onClick={addDataSource}
              disabled={!newSourceName || !newSourceUrl}
              className="w-full flex items-center justify-center gap-2 px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
            >
              <Plus size={16} />
              {t.addSource}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShakingHeadNews() {
  const [articles, setArticles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tiltAngle, setTiltAngle] = useState(-16)
  const [frequency, setFrequency] = useState(30)
  const [timeUntilNext, setTimeUntilNext] = useState(30)
  const [showSettings, setShowSettings] = useState(false)
  const [showStatus, setShowStatus] = useState(true)
  const [fontSize, setFontSize] = useState("text-sm")
  const [language, setLanguage] = useState<"zh" | "en">("zh")

  const [activeSources, setActiveSources] = useState([
    { id: 1, name: texts.zh.dailyNews, url: "https://news.ravelloh.top/latest.json" },
  ])

  useEffect(() => {
    if (language === "en") {
      setActiveSources([
        {
          id: 1,
          name: texts.en.dailyNews,
          url: "https://api.currentsapi.services/v1/latest-news?apiKey=iDKcx-tASvoDgtzsUAfw-OdgJvbPIhgnEPE6mcxp66zq7SHe",
        },
      ])
    } else {
      setActiveSources([{ id: 1, name: texts.zh.dailyNews, url: "https://news.ravelloh.top/latest.json" }])
    }
  }, [language])

  const t = texts[language]

  const loadNews = async () => {
    setIsLoading(true)
    try {
      const rssResults = await Promise.all(activeSources.map((source) => parseRSSFeed(source.url, source.name)))
      const newsArticles = rssResults.flatMap((result) => result.articles.map((article) => article.title))
      setArticles(newsArticles)
    } catch (error) {
      console.error("Failed to load news:", error)
      setArticles([t.loadError])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const tiltTimer = setInterval(() => {
      const isNegative = Math.random() < 0.5
      let randomAngle
      if (isNegative) {
        // Generate angle between -20° and -5°
        randomAngle = -20 + Math.random() * 15
      } else {
        // Generate angle between 5° and 20°
        randomAngle = 5 + Math.random() * 15
      }
      setTiltAngle(randomAngle)
      setTimeUntilNext(frequency)
    }, frequency * 1000)

    return () => clearInterval(tiltTimer)
  }, [frequency])

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeUntilNext((prev) => (prev > 0 ? prev - 1 : frequency))
    }, 1000)

    return () => clearInterval(countdownTimer)
  }, [frequency])

  useEffect(() => {
    loadNews()
  }, [activeSources])

  const handleFrequencyChange = (newFrequency: number) => {
    setFrequency(newFrequency)
    setTimeUntilNext(newFrequency)
  }

  const handleDataSourceChange = (newSources: any[]) => {
    setActiveSources(newSources.filter((source) => source.active))
  }

  return (
    <div className="min-h-screen bg-green-50 p-8 relative">
      {showStatus && (
        <div className="fixed top-4 left-4 text-sm text-green-600 z-30">
          {t.tiltAngle}: {tiltAngle.toFixed(1)}° | {t.nextTilt}: {timeUntilNext}
          {t.seconds}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-16 py-16 mt-8">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-green-700">{t.loading}</p>
          </div>
        ) : (
          <div
            className="space-y-3 bg-green-50 p-8 rounded-lg transition-transform duration-1000 ease-in-out"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {articles.slice(0, 15).map((article, index) => (
              <div key={index} className={`flex items-start gap-2 text-green-800 ${fontSize} leading-relaxed`}>
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>{article}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        aria-label={t.settings}
      >
        <Settings size={20} />
      </button>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        frequency={frequency}
        onFrequencyChange={handleFrequencyChange}
        showStatus={showStatus}
        onShowStatusChange={setShowStatus}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        language={language}
        onLanguageChange={setLanguage}
      />
    </div>
  )
}
