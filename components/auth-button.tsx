"use client"

import { useState, useEffect } from "react"
import { LogIn, LogOut } from "lucide-react"
import { authService, type User as UserType } from "@/lib/auth"

interface AuthButtonProps {
  language: "zh" | "en"
}

const authTexts = {
  zh: {
    signIn: "登录",
    signOut: "退出",
    signInWith: "使用 Google 登录",
    welcome: "欢迎",
  },
  en: {
    signIn: "Sign In",
    signOut: "Sign Out",
    signInWith: "Sign in with Google",
    welcome: "Welcome",
  },
}

export function AuthButton({ language }: AuthButtonProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const t = authTexts[language]

  useEffect(() => {
    // Initialize Google Auth
    authService.initializeGoogleAuth()

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await authService.signIn()
    } catch (error) {
      console.error("Sign in failed:", error)
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    authService.signOut()
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
        <img src={user.picture || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-green-800 truncate">
            {t.welcome}, {user.name}
          </div>
          <div className="text-xs text-green-600 truncate">{user.email}</div>
        </div>
        <button
          onClick={handleSignOut}
          className="p-1 hover:bg-red-100 rounded-full transition-colors"
          title={t.signOut}
        >
          <LogOut size={16} className="text-red-500" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <LogIn size={16} />
      )}
      {isLoading ? "..." : t.signInWith}
    </button>
  )
}
