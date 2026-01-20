"use client";

import { useLanguage } from "@/lib/enhanced-language-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Loader2 } from "lucide-react";
import { useState } from "react";

export function EnhancedLanguageSelector() {
  const { language, setLanguage, isTranslating, autoTranslate, setAutoTranslate } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
  ];

  return (
    <div className="relative group">
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        {isTranslating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Globe className="h-4 w-4" />
        )}
        <span>
          {languages.find(lang => lang.code === language)?.flag || "🌐"} {" "}
          {languages.find(lang => lang.code === language)?.name || "Language"}
        </span>
      </Button>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
        {/* Language Selection */}
        <div className="border-b border-gray-100 p-2">
          <div className="text-xs font-medium text-gray-500 px-3 py-1">Language</div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                language === lang.code ? "bg-gray-100" : ""
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
        
        {/* Auto-Translate Settings */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-translate" className="text-sm font-medium">
              Auto-Translate
            </Label>
            <Switch
              id="auto-translate"
              checked={autoTranslate}
              onCheckedChange={setAutoTranslate}
              disabled={isTranslating}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Automatically translate content using LibreTranslate
          </p>
        </div>
      </div>
    </div>
  );
}
