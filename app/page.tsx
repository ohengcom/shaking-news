"use client"

import { useState, useEffect } from "react"
import { parseRSSFeed } from "@/lib/rss-parser"
import { Settings, X, Plus, Trash2 } from "lucide-react"

function SettingsModal({
  isOpen,
  onClose,
  frequency,
  onFrequencyChange,
  showStatus,
  onShowStatusChange,
  fontSize,
  onFontSizeChange,
}: {
  isOpen: boolean
  onClose: () => void
  frequency: number
  onFrequencyChange: (freq: number) => void
  showStatus: boolean
  onShowStatusChange: (show: boolean) => void
  fontSize: string
  onFontSizeChange: (size: string) => void
}) {
  const [dataSources, setDataSources] = useState([
    { id: 1, name: "每日新闻", url: "https://news.ravelloh.top/latest.json", active: true },
  ])
  const [newSourceName, setNewSourceName] = useState("")
  const [newSourceUrl, setNewSourceUrl] = useState("")

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
          <h2 className="text-xl font-bold text-green-800">设置</h2>
          <button onClick={onClose} className="p-1 hover:bg-green-100 rounded-full transition-colors">
            <X size={20} className="text-green-600" />
          </button>
        </div>

        {/* Frequency Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-green-700">摇动设置</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-green-600">摇动频率 (秒)</label>
            <input
              type="number"
              min="5"
              max="300"
              value={frequency}
              onChange={(e) => onFrequencyChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
            <p className="text-xs text-green-500 mt-1">建议范围：5-300秒</p>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-green-600">
              <input
                type="checkbox"
                checked={showStatus}
                onChange={(e) => onShowStatusChange(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              显示状态信息
            </label>
            <p className="text-xs text-green-500 mt-1">显示倾斜角度和倒计时信息</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-green-600">字体大小</label>
            <select
              value={fontSize}
              onChange={(e) => onFontSizeChange(e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="text-xs">小</option>
              <option value="text-sm">中</option>
              <option value="text-base">大</option>
            </select>
            <p className="text-xs text-green-500 mt-1">调整新闻文字大小</p>
          </div>
        </div>

        {/* Data Source Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-green-700">数据源设置</h3>

          {/* Current Data Sources */}
          <div className="space-y-3 mb-4">
            {dataSources.map((source) => (
              <div key={source.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={source.active}
                  onChange={() => toggleDataSource(source.id)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-green-800 truncate">{source.name}</div>
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
            <h4 className="font-medium text-green-700">添加新数据源</h4>
            <input
              type="text"
              placeholder="数据源名称"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <input
              type="url"
              placeholder="JSON数据链接"
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              onClick={addDataSource}
              disabled={!newSourceName || !newSourceUrl}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <Plus size={16} />
              添加数据源
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
  const [activeSources, setActiveSources] = useState([
    { id: 1, name: "每日新闻", url: "https://news.ravelloh.top/latest.json" },
  ])

  const loadNews = async () => {
    setIsLoading(true)
    try {
      const rssResults = await Promise.all(activeSources.map((source) => parseRSSFeed(source.url, source.name)))
      const newsArticles = rssResults.flatMap((result) => result.articles.map((article) => article.title))
      setArticles(newsArticles)
    } catch (error) {
      console.error("Failed to load news:", error)
      // Fallback to some basic content if RSS fails
      setArticles(["无法加载新闻内容，请检查网络连接"])
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
          倾斜角度: {tiltAngle.toFixed(1)}° | 下次倾斜: {timeUntilNext}秒
        </div>
      )}

      <div className="max-w-5xl mx-auto px-16 py-16">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-green-700">正在加载新闻...</p>
          </div>
        ) : (
          <div
            className="space-y-3 bg-green-50 p-8 rounded-lg transition-transform duration-1000 ease-in-out"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {articles.map((article, index) => (
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
        aria-label="设置"
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
      />
    </div>
  )
}
