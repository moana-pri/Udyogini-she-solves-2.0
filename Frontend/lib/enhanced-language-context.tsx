"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { t as staticT } from "./translations";
import libreTranslateService from "./libretranslate";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  translateText: (text: string, targetLang?: string) => Promise<string>;
  isTranslating: boolean;
  autoTranslate: boolean;
  setAutoTranslate: (enabled: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState("en");
  const [mounted, setMounted] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage?.getItem("language") || "en";
    const savedAutoTranslate = localStorage?.getItem("autoTranslate") === "true";
    setLanguageState(savedLang);
    setAutoTranslate(savedAutoTranslate);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", lang);
    }
  };

  const setAutoTranslateWithStorage = (enabled: boolean) => {
    setAutoTranslate(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem("autoTranslate", enabled.toString());
    }
  };

  // Static translation function (fallback)
  const translate = (key: string, params?: Record<string, any>): string => {
    return staticT(key, language);
  };

  // Dynamic translation using LibreTranslate
  const translateText = async (text: string, targetLang: string = language): Promise<string> => {
    if (targetLang === 'en') return text; // Skip translation for English
    
    const cacheKey = `${text}-${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    setIsTranslating(true);
    try {
      const translatedText = await libreTranslateService.translate(text, targetLang);
      
      // Cache the translation
      setTranslationCache(prev => new Map(prev).set(cacheKey, translatedText));
      
      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Fallback to original text
    } finally {
      setIsTranslating(false);
    }
  };

  // Enhanced translation function that tries dynamic first, falls back to static
  const enhancedTranslate = async (key: string, params?: Record<string, any>): Promise<string> => {
    // First try static translation
    const staticTranslation = staticT(key, language);
    
    // If auto-translate is enabled and not English, try dynamic translation
    if (autoTranslate && language !== 'en' && staticTranslation !== key) {
      try {
        return await translateText(staticTranslation, language);
      } catch (error) {
        console.error('Dynamic translation failed, using static:', error);
        return staticTranslation;
      }
    }
    
    return staticTranslation;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t: translate, 
      translateText,
      isTranslating,
      autoTranslate,
      setAutoTranslate: setAutoTranslateWithStorage
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { 
      language: "en", 
      setLanguage: () => {}, 
      t: (key: string) => key,
      translateText: async (text: string) => text,
      isTranslating: false,
      autoTranslate: false,
      setAutoTranslate: () => {}
    };
  }
  return context;
}
