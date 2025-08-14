interface User {
  id: string
  name: string
  email: string
  picture: string
}

interface UserSettings {
  frequency: number
  maxTiltAngle: number
  showStatus: boolean
  fontSize: string
  language: "zh" | "en"
  showAds: boolean
  dataSources: Array<{
    id: number
    name: string
    url: string
    active: boolean
  }>
}

class AuthService {
  private user: User | null = null
  private listeners: Array<(user: User | null) => void> = []

  // Initialize Google Sign-In with popup flow
  async initializeGoogleAuth(): Promise<void> {
    // Mock initialization - no actual Google API needed
    return Promise.resolve()
  }

  async signIn(): Promise<void> {
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create mock user data
    const mockUsers = [
      {
        id: "mock_user_1",
        name: "Demo User",
        email: "demo@example.com",
        picture: "/diverse-user-avatars.png",
      },
      {
        id: "mock_user_2",
        name: "测试用户",
        email: "test@example.com",
        picture: "/diverse-user-avatars.png",
      },
    ]

    // Randomly select a mock user
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]

    this.user = user
    localStorage.setItem("user", JSON.stringify(user))
    this.notifyListeners()
  }

  signOut(): void {
    this.user = null
    localStorage.removeItem("user")
    localStorage.removeItem("userSettings")
    this.notifyListeners()
  }

  getCurrentUser(): User | null {
    if (!this.user && typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          this.user = JSON.parse(stored)
        } catch (error) {
          localStorage.removeItem("user")
        }
      }
    }
    return this.user
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback)
    // Call immediately with current state
    callback(this.getCurrentUser())

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.user))
  }

  // Settings sync methods
  saveUserSettings(settings: UserSettings): void {
    if (this.user && typeof window !== "undefined") {
      const key = `userSettings_${this.user.id}`
      localStorage.setItem(key, JSON.stringify(settings))
    }
  }

  getUserSettings(): UserSettings | null {
    if (this.user && typeof window !== "undefined") {
      const key = `userSettings_${this.user.id}`
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (error) {
          localStorage.removeItem(key)
        }
      }
    }
    return null
  }
}

// Global auth service instance
export const authService = new AuthService()

// Types for external use
export type { User, UserSettings }

// Extend window type for Google Sign-In
declare global {
  interface Window {
    google?: any
  }
}
