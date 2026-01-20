"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/enhanced-language-context";
import { Loader2, Globe } from "lucide-react";

import React from "react";

interface TranslatableTextProps {
  text: string;
  className?: string;
  showOriginal?: boolean;
  as?: React.ElementType;
}

export function TranslatableText({ 
  text, 
  className = "", 
  showOriginal = false,
  as: Component = "span" 
}: TranslatableTextProps) {
  const { language, translateText, isTranslating, autoTranslate } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isTextTranslating, setIsTextTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(!showOriginal);

  useEffect(() => {
    const translate = async () => {
      if (language === 'en' || !autoTranslate) {
        setTranslatedText(text);
        return;
      }

      setIsTextTranslating(true);
      try {
        const translated = await translateText(text, language);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(text);
      } finally {
        setIsTextTranslating(false);
      }
    };

    translate();
  }, [text, language, autoTranslate, translateText]);

  const handleToggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const displayText = showTranslation && language !== 'en' ? translatedText : text;

  return React.createElement(
    Component,
    { className: `${className} ${isTextTranslating ? 'opacity-70' : ''}` },
    <>
      {displayText}
      {showOriginal && language !== 'en' && (
        <button
          onClick={handleToggleTranslation}
          className="ml-2 text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
          title={showTranslation ? "Show original" : "Show translation"}
        >
          {isTextTranslating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Globe className="h-3 w-3" />
          )}
          {showTranslation ? "EN" : language.toUpperCase()}
        </button>
      )}
    </>
  );
}

// Hook for translating content in components
export function useTranslatableContent() {
  const { translateText, isTranslating, autoTranslate, language } = useLanguage();
  const [translations, setTranslations] = useState<Map<string, string>>(new Map());

  const translateContent = async (content: string, key?: string): Promise<string> => {
    if (language === 'en' || !autoTranslate) return content;

    const cacheKey = key || content;
    if (translations.has(cacheKey)) {
      return translations.get(cacheKey)!;
    }

    try {
      const translated = await translateText(content, language);
      setTranslations(prev => new Map(prev).set(cacheKey, translated));
      return translated;
    } catch (error) {
      console.error('Content translation failed:', error);
      return content;
    }
  };

  const clearCache = () => {
    setTranslations(new Map());
  };

  return {
    translateContent,
    isTranslating,
    autoTranslate,
    clearCache,
    translations
  };
}
