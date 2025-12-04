"use client"

import { useState, useEffect } from "react"
import { parseRSSFeed } from "@/lib/rss-parser"
import { newsPreloader, getCachedNews } from "@/lib/news-preloader"
import { Settings, LogIn, LogOut, Github } from "lucide-react"
import { authService, type UserSettings } from "@/lib/auth"
import { SettingsModal } from "@/components/settings-modal"
import { useShaking } from "@/hooks/use-shaking"
import { TEXTS, DEFAULT_SOURCES, APP_CONFIG } from "@/lib/constants"

export default function ShakingHeadNews() {
  const [articles, setArticles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [frequency, setFrequency] = useState(APP_CONFIG.DEFAULT_FREQUENCY)
  const [maxTiltAngle, setMaxTiltAngle] = useState(APP_CONFIG.DEFAULT_MAX_TILT)
  const [showSettings, setShowSettings] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [fontSize, setFontSize] = useState(APP_CONFIG.DEFAULT_FONT_SIZE)
  const [language, setLanguage] = useState<"zh" | "en">(APP_CONFIG.DEFAULT_LANGUAGE)
  const [showAds, setShowAds] = useState(true)
  const [user, setUser] = useState(null)
  const [activeSources, setActiveSources] = useState(DEFAULT_SOURCES.zh)

  // Use custom hook for shaking logic
  const { tiltAngle, timeUntilNext } = useShaking(frequency, maxTiltAngle)

  useEffect(() => {
    authService.initializeGoogleAuth()
  }, [])

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)

      if (user) {
        // Load user settings when signed in
        const userSettings = authService.getUserSettings()
        if (userSettings) {
          setFrequency(userSettings.frequency)
          setMaxTiltAngle(userSettings.maxTiltAngle)
          setShowStatus(userSettings.showStatus)
          setFontSize(userSettings.fontSize)
          setLanguage(userSettings.language)
          setShowAds(userSettings.showAds)
          // Update data sources if available
          if (userSettings.dataSources) {
            setActiveSources(userSettings.dataSources.filter((source) => source.active))
          }
        }
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (language === "en") {
      setActiveSources(DEFAULT_SOURCES.en)
    } else {
      setActiveSources(DEFAULT_SOURCES.zh)
    }
  }, [language])

  useEffect(() => {
    if (user) {
      const userSettings: UserSettings = {
        frequency,
        maxTiltAngle,
        showStatus,
        fontSize,
        language,
        showAds,
        dataSources: activeSources.map((source) => ({ ...source, active: true })),
      }
      authService.saveUserSettings(userSettings)
    }
  }, [user, frequency, maxTiltAngle, showStatus, fontSize, language, showAds, activeSources])

  const t = TEXTS[language]

  const loadNews = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Loading news with caching enabled")

      // Use cached news function for faster loading
      const newsArticles = await getCachedNews(activeSources)

      if (newsArticles.length > 0) {
        setArticles(newsArticles)
        console.log(`[v0] Loaded ${newsArticles.length} cached news articles`)
      } else {
        // Fallback to direct fetch if no cache
        const rssResults = await Promise.all(activeSources.map((source) => parseRSSFeed(source.url, source.name, true)))
        const fallbackArticles = rssResults.flatMap((result) => result.articles.map((article) => article.title))
        setArticles(fallbackArticles)
        console.log(`[v0] Loaded ${fallbackArticles.length} articles via direct fetch`)
      }

      // Trigger background preload for next time
      newsPreloader.forcePreload(activeSources)
    } catch (error) {
      console.error("Failed to load news:", error)
      setArticles([t.loadError])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [activeSources])

  return (
    <div className="min-h-screen bg-green-50 p-8 relative overflow-hidden">
      {showStatus && (
        <div className="fixed top-4 left-4 text-sm text-green-600 z-30">
          {t.tiltAngle}: {tiltAngle.toFixed(1)}° | {t.nextTilt}: {timeUntilNext}
          {t.seconds}
        </div>
      )}

      {showAds && (
        <>
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-[160px] h-[600px] z-20">
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "160px", height: "600px" }}
              data-ad-client="ca-pub-5567992467139695"
              data-ad-slot="auto"
              data-ad-format="vertical"
              data-full-width-responsive="false"
            />
            <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
          </div>
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-[160px] h-[600px] z-20">
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "160px", height: "600px" }}
              data-ad-client="ca-pub-5567992467139695"
              data-ad-slot="auto"
              data-ad-format="vertical"
              data-full-width-responsive="false"
            />
            <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
          </div>
        </>
      )}

      <div className="max-w-5xl mx-auto px-16 py-16 mt-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-green-700">{t.loading}</p>
          </div>
        ) : (
          <div
            className="space-y-2 bg-green-50 p-8 rounded-lg transition-transform duration-1000 ease-in-out"
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

      {/* Login/Logout, GitHub and Settings Icons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <a
          href="https://github.com/ohengcom/shaking-news"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full shadow-lg transition-colors"
          aria-label={t.githubRepo}
        >
          <Github size={20} />
        </a>

        {!user ? (
          <button
            onClick={() => authService.signIn()}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
            aria-label={t.signIn}
          >
            <LogIn size={20} />
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
              aria-label={t.settings}
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => authService.signOut()}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
              aria-label={t.signOut}
            >
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        frequency={frequency}
        onFrequencyChange={setFrequency}
        maxTiltAngle={maxTiltAngle}
        onMaxTiltAngleChange={setMaxTiltAngle}
        showStatus={showStatus}
        onShowStatusChange={setShowStatus}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        language={language}
        onLanguageChange={setLanguage}
        showAds={showAds}
        onShowAdsChange={setShowAds}
        dataSources={activeSources}
        onDataSourcesChange={setActiveSources}
      />
    </div>
  )
}
