// App settings configuration for the Shaking Head News app
export interface AppSettings {
  // Cache settings
  cacheEnabled: boolean
  cacheExpiryHours: number

  // News rotation settings
  rotationMode: "fixed" | "continuous"
  rotationInterval: number // in seconds

  // RSS feed settings
  defaultRssEnabled: boolean
  customRssFeeds: string[]
  activeRssSource: string

  // UI settings
  theme: "light" | "dark" | "system"
  autoRefresh: boolean
  refreshInterval: number // in minutes
}

// Default app settings
export const defaultSettings: AppSettings = {
  // Cache settings
  cacheEnabled: true,
  cacheExpiryHours: 24,

  // News rotation settings
  rotationMode: "continuous",
  rotationInterval: 30, // 30 seconds default

  // RSS feed settings
  defaultRssEnabled: true,
  customRssFeeds: [],
  activeRssSource: "everydaynews",

  // UI settings
  theme: "system",
  autoRefresh: true,
  refreshInterval: 15, // 15 minutes
}

// App settings instance with reactive updates
class AppSettingsManager {
  private settings: AppSettings = { ...defaultSettings }
  private listeners: Array<(settings: AppSettings) => void> = []

  get cacheEnabled() {
    return this.settings.cacheEnabled
  }

  get rotationMode() {
    return this.settings.rotationMode
  }

  get rotationInterval() {
    return this.settings.rotationInterval
  }

  get activeRssSource() {
    return this.settings.activeRssSource
  }

  get allSettings() {
    return { ...this.settings }
  }

  updateSettings(updates: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...updates }
    this.notifyListeners()
  }

  subscribe(listener: (settings: AppSettings) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.settings))
  }

  // Load settings from localStorage
  loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("shaking-head-news-settings")
      if (stored) {
        try {
          const parsedSettings = JSON.parse(stored)
          this.settings = { ...defaultSettings, ...parsedSettings }
          this.notifyListeners()
        } catch (error) {
          console.warn("Failed to load settings from storage:", error)
        }
      }
    }
  }

  // Save settings to localStorage
  saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("shaking-head-news-settings", JSON.stringify(this.settings))
    }
  }
}

// Export singleton instance
export const appSettings = new AppSettingsManager()

// Initialize settings from storage on client side
if (typeof window !== "undefined") {
  appSettings.loadFromStorage()
}
