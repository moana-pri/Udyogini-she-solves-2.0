# Multilanguage Support Implementation Guide

## Overview

The She_Solves application now has comprehensive multilanguage support using LibreTranslate, supporting 7 languages:
- English (en)
- Hindi (hi)
- Marathi (mr)
- Tamil (ta)
- Telugu (te)
- Kannada (ka)
- Malayalam (ml)

## Architecture

### Backend Components

#### 1. Translation Utility (`Backend/utils/translate.js`)
- Connects to LibreTranslate API (free public service at `https://libretranslate.de`)
- Provides `translateText(text, targetLanguage)` function
- Provides `translateTexts(texts, targetLanguage)` for batch translations
- Returns original text if translation fails

#### 2. Translation API Endpoint (`Backend/routes/translationRoutes.js`)
- **POST /api/translate** - Translate single text
  ```json
  Request Body:
  { "text": "Hello World", "targetLanguage": "hi" }
  
  Response:
  { "original": "Hello World", "translated": "नमस्ते दुनिया", "targetLanguage": "hi" }
  ```

- **POST /api/translate/batch** - Translate multiple texts
  ```json
  Request Body:
  { "texts": ["Hello", "World"], "targetLanguage": "hi" }
  
  Response:
  { "original": ["Hello", "World"], "translated": ["नमस्ते", "दुनिया"], "targetLanguage": "hi" }
  ```

### Frontend Components

#### 1. Language Context (`Frontend/lib/language-context.tsx`)
- Manages global language state
- Stores language preference in localStorage
- Provides `useLanguage()` hook for all components
- Returns: `{ language, setLanguage, t }`

#### 2. Translations Dictionary (`Frontend/lib/translations.ts`)
- Centralized static translations for UI labels and strings
- Organized by language (en, hi, mr, ta, te, ka, ml)
- Used with `t(key, language)` function

#### 3. Translation API Client (`Frontend/lib/translate-api.ts`)
- `translateText(text, targetLanguage)` - Translate single text
- `translateTexts(texts, targetLanguage)` - Translate multiple texts
- Fallback to original text on errors

#### 4. Translation Hook (`Frontend/hooks/use-translation.ts`)
- Custom React hook for translation operations
- Provides `translate()` and `translateMany()` functions
- Tracks `isTranslating` state
- Usage: `const { translate, isTranslating } = useTranslation()`

#### 5. Language Switcher (`Frontend/components/common/language-switcher.tsx`)
- Dropdown component for language selection
- Shows all 7 supported languages
- Updates language globally via context
- Integrated in header for easy access

## Usage Guide

### For Static UI Text

Use the translation dictionary for static text that's displayed on every page:

```tsx
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

export function MyComponent() {
  const { language } = useLanguage()
  
  return (
    <div>
      <h1>{t("welcome", language)}</h1>
      <p>{t("search_services", language)}</p>
    </div>
  )
}
```

### For Dynamic Content (API Response)

Use the translation API for content from the database:

```tsx
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/lib/language-context"

export function BusinessCard({ business }) {
  const { language } = useLanguage()
  const { translate, isTranslating } = useTranslation()
  const [translatedDescription, setTranslatedDescription] = useState("")

  useEffect(() => {
    if (language !== "en") {
      translate(business.businessDescription, language)
        .then(setTranslatedDescription)
    } else {
      setTranslatedDescription(business.businessDescription)
    }
  }, [language, business.businessDescription])

  return (
    <div>
      <h3>{business.businessName}</h3>
      <p>{isTranslating ? "Translating..." : translatedDescription}</p>
    </div>
  )
}
```

### For Batch Translations

```tsx
const { translateMany, isTranslating } = useTranslation()

// Translate multiple business descriptions at once
const translatedDescriptions = await translateMany(
  descriptions, 
  language
)
```

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| hi | Hindi | हिंदी |
| mr | Marathi | मराठी |
| ta | Tamil | தமிழ் |
| te | Telugu | తెలుగు |
| ka | Kannada | ಕನ್ನಡ |
| ml | Malayalam | മലയാളം |

## API Integration Points

### Currently Integrated

1. **Header Component** - Language switcher visible on all pages
2. **Customer Dashboard** - Uses `t()` for UI labels, searches are translated
3. **Business Profile** - Shows translated business descriptions
4. **Reviews Section** - Translates review comments via API

### Components That Need Translation Enhancement

1. **Search Results** - Business descriptions should be translated to current language
2. **Booking Details** - Service descriptions and status should be translated
3. **Review Form** - Comments should be translatable
4. **Business Settings** - Working hours, price ranges, descriptions

## Data Flow

```
User changes language in Header
    ↓
LanguageSwitcher calls setLanguage()
    ↓
Language context updates (saved to localStorage)
    ↓
All components with useLanguage() re-render
    ↓
For static text: t(key, language) returns translated string
    ↓
For dynamic text: useTranslation().translate() calls API
    ↓
LibreTranslate service returns translated text
    ↓
UI displays translated content
```

## Configuration

### Environment Variables

Required in `.env` or `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend Setup

The translation routes are already registered in `Backend/server.js`:
```javascript
import translationRoutes from "./routes/translationRoutes.js"
app.use("/api/translate", translationRoutes)
```

### Testing the API

```bash
# Single text translation
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","targetLanguage":"hi"}'

# Batch translation
curl -X POST http://localhost:5000/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{"texts":["Hello","World"],"targetLanguage":"hi"}'
```

## Performance Considerations

1. **Caching**: Translation results are cached in component state to avoid repeated API calls
2. **Batch Requests**: Use `translateMany()` for multiple texts instead of individual calls
3. **Lazy Translation**: Only translate when language changes, not on every render
4. **Fallback**: Always have English version as fallback

## Common Patterns

### Pattern 1: Translatable Component

```tsx
const TranslatableBusinessCard = ({ business }) => {
  const { language } = useLanguage()
  const { translate } = useTranslation()
  const [translated, setTranslated] = useState(business.businessDescription)

  useEffect(() => {
    if (language !== "en") {
      translate(business.businessDescription, language)
        .then(setTranslated)
    }
  }, [language])

  return <div>{translated}</div>
}
```

### Pattern 2: Batch Translation List

```tsx
const BusinessList = ({ businesses }) => {
  const { language } = useLanguage()
  const { translateMany } = useTranslation()
  const [translated, setTranslated] = useState({})

  useEffect(() => {
    if (language !== "en") {
      const descriptions = businesses.map(b => b.businessDescription)
      translateMany(descriptions, language)
        .then(results => {
          const map = {}
          businesses.forEach((b, i) => {
            map[b._id] = results[i]
          })
          setTranslated(map)
        })
    }
  }, [language])

  return businesses.map(b => (
    <div key={b._id}>
      {translated[b._id] || b.businessDescription}
    </div>
  ))
}
```

### Pattern 3: Conditional Translation

```tsx
const ReviewText = ({ review }) => {
  const { language } = useLanguage()
  const { translate } = useTranslation()
  const [text, setText] = useState(review.comment)

  useEffect(() => {
    if (language !== "en" && review.comment) {
      translate(review.comment, language).then(setText)
    } else {
      setText(review.comment)
    }
  }, [language, review.comment])

  return <p>{text}</p>
}
```

## Troubleshooting

### Issue: Translations not appearing

**Solution**: 
- Check that language context is properly initialized in `layout.tsx`
- Verify `NEXT_PUBLIC_API_URL` environment variable is set
- Check browser console for API errors

### Issue: Translations are slow

**Solution**:
- Use batch translations instead of individual API calls
- Implement debouncing if translating on every keystroke
- Cache translations in parent component state

### Issue: Translation quality issues

**Solution**:
- For better results, use shorter, simpler sentences
- Avoid colloquialisms and context-dependent language
- Consider adding manual translations for important terms

### Issue: API returns 429 (Rate Limited)

**Solution**:
- LibreTranslate has rate limits for free tier
- Implement client-side caching of translations
- Consider batch requests instead of individual calls

## LibreTranslate API

- **Endpoint**: `https://libretranslate.de/translate`
- **Method**: POST
- **Rate Limit**: Free tier has limits, consider self-hosting for production
- **Languages Supported**: 23 languages including all 7 we use
- **Self-hosting**: Can be deployed locally for unlimited usage

## Future Enhancements

1. **Translation Caching**: Store translations in Redis/Database to avoid repeated API calls
2. **Fallback Language**: If translation fails, use English instead
3. **RTL Support**: Add right-to-left layout support for Arabic (if added later)
4. **Pre-translation**: Translate common business descriptions during database seeding
5. **Language Detection**: Auto-detect user's browser language preference
6. **Offline Mode**: Pre-load common translations for offline support

## Summary

The multilanguage system is ready to use. Key steps:
1. ✅ Backend translation API is working
2. ✅ Frontend language context is set up
3. ✅ Language switcher is in header
4. ✅ Translation hooks and utilities are available
5. ✅ All 7 languages are supported

**To use it**: Import `useLanguage()` and `useTranslation()` in your components, and start wrapping dynamic content with translation calls.
