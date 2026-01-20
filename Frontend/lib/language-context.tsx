"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { t } from "./translations"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage?.getItem("language") || "en"
    setLanguageState(savedLang)
  }, [])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", lang)
    }
  }

  const translate = (key: string) => {
    return t(key, language)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return { language: "en", setLanguage: () => {}, t: (key: string) => key }
  }
  return context
}
