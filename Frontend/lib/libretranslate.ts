// LibreTranslate service for dynamic translations

interface TranslateRequest {
  q: string;
  source?: string;
  target: string;
  format?: string;
}

interface TranslateResponse {
  translatedText: string;
}

class LibreTranslateService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = 'http://localhost:5000', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async translate(text: string, targetLang: string, sourceLang: string = 'auto'): Promise<string> {
    try {
      const requestBody: TranslateRequest = {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      };

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
      }

      const data: TranslateResponse = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original text if translation fails
      return text;
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({ q: text })
      });

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data[0]?.language || 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Fallback to English
    }
  }

  async getSupportedLanguages(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch languages: ${response.status} ${response.statusText}`);
      }

      const languages = await response.json();
      return languages.map((lang: any) => lang.code);
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      return ['en', 'hi', 'mr']; // Fallback to our main languages
    }
  }

  // Batch translate multiple texts
  async translateBatch(texts: string[], targetLang: string, sourceLang: string = 'auto'): Promise<string[]> {
    const promises = texts.map(text => this.translate(text, targetLang, sourceLang));
    return Promise.all(promises);
  }
}

// Create singleton instance
const libreTranslateService = new LibreTranslateService(
  process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL || 'http://localhost:5001',
  process.env.NEXT_PUBLIC_LIBRETRANSLATE_API_KEY
);

export default libreTranslateService;
