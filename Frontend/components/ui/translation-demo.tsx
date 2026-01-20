"use client";

import { useState } from "react";
import { TranslatableText, useTranslatableContent } from "@/components/ui/translatable-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/enhanced-language-context";
import { Globe, Loader2 } from "lucide-react";

export function TranslationDemo() {
  const { language, isTranslating, autoTranslate } = useLanguage();
  const [customText, setCustomText] = useState("Welcome to our platform! We provide the best services for our customers.");
  const { translateContent } = useTranslatableContent();

  const sampleTexts = [
    "Welcome to Udyogini Platform",
    "Book your favorite services easily",
    "Connect with trusted local businesses",
    "Experience seamless booking management",
    "Your satisfaction is our priority"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            LibreTranslate Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Current Language: <strong>{language.toUpperCase()}</strong> | 
              Auto-Translate: <strong>{autoTranslate ? 'ON' : 'OFF'}</strong> | 
              Status: {isTranslating ? <Loader2 className="inline h-4 w-4 animate-spin" /> : 'Ready'}
            </p>
          </div>

          {/* Sample Translatable Texts */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Sample Texts:</h3>
            {sampleTexts.map((text, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <TranslatableText 
                  text={text} 
                  showOriginal={true}
                  className="text-gray-800"
                />
              </div>
            ))}
          </div>

          {/* Custom Text Translation */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Custom Text Translation:</h3>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Enter text to translate..."
            />
            <div className="p-3 border rounded-lg bg-blue-50">
              <TranslatableText 
                text={customText} 
                showOriginal={true}
                className="text-blue-800"
              />
            </div>
          </div>

          {/* Translation Status */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">How it works:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Enable auto-translate in the language selector dropdown</li>
              <li>• Select Hindi (हिंदी) or Marathi (मराठी) to see translations</li>
              <li>• Toggle between original and translated text using the language button</li>
              <li>• Translations are cached for better performance</li>
              <li>• Falls back to static translations if LibreTranslate is unavailable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
