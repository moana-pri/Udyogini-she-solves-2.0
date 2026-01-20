import { useState, useCallback } from "react"
import { translateText, translateTexts } from "@/lib/translate-api"

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false)

  const translate = useCallback(async (text: string, targetLanguage: string) => {
    if (!text) return text
    setIsTranslating(true)
    try {
      const result = await translateText(text, targetLanguage)
      return result
    } finally {
      setIsTranslating(false)
    }
  }, [])

  const translateMany = useCallback(async (texts: string[], targetLanguage: string) => {
    if (!texts || texts.length === 0) return texts
    setIsTranslating(true)
    try {
      const results = await translateTexts(texts, targetLanguage)
      return results
    } finally {
      setIsTranslating(false)
    }
  }, [])

  return { translate, translateMany, isTranslating }
}
