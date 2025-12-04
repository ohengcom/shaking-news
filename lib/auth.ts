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
  private tokenClient: any = null

  // Initialize Google Sign-In with popup flow for www.888388.xyz
  async initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      if (!document.querySelector('script[src*="accounts.google.com"]')) {
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = () => this.setupGoogleAuth().then(resolve).catch(reject)
        script.onerror = reject
        document.head.appendChild(script)
      } else {
        this.setupGoogleAuth().then(resolve).catch(reject)
      }
    })
  }

  private async setupGoogleAuth(): Promise<void> {
    if (typeof window !== "undefined" && window.google) {
      // Configure for www.888388.xyz domain
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: "855446158115-uv0i432c3b9blcaupveqesvbleq3q7a5.apps.googleusercontent.com",
        scope: "openid email profile",
        callback: (response: any) => {
          if (response.access_token) {
            this.handleAuthSuccess(response.access_token)
          }
        },
        error_callback: (error: any) => {
          console.error("Google Auth Error:", error)
        },
      })
    }
  }

  async signIn(): Promise<void> {
    if (this.tokenClient) {
      // Request access token via popup
      this.tokenClient.requestAccessToken({
        prompt: "consent",
      })
    } else {
      throw new Error("Google Auth not initialized")
    }
  }

  private async handleAuthSuccess(accessToken: string): Promise<void> {
    try {
      // Get user info from Google API
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
      const userInfo = await response.json()

      const user: User = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      }

      this.user = user
      localStorage.setItem("user", JSON.stringify(user))
      this.notifyListeners()
    } catch (error) {
      console.error("Failed to get user info:", error)
    }
  }

  signOut(): void {
    this.user = null
    localStorage.removeItem("user")
    localStorage.removeItem("userSettings")

    // Revoke Google token if available
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect()
    }

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
