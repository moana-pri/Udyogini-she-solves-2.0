# LibreTranslate Setup Guide

## What is LibreTranslate?

LibreTranslate is a free, open-source machine translation API that supports multiple languages including English, Hindi, and Marathi. It provides privacy-focused translation without relying on third-party services.

## Quick Setup Options

### Option 1: Docker (Recommended)
```bash
# Pull the official LibreTranslate image
docker pull libretranslate/libretranslate

# Run LibreTranslate
docker run -it -p 5001:5000 libretranslate/libretranslate

# Or with custom settings
docker run -it -p 5001:5000 \
  -e LT_LOAD_ONLY=en,hi,mr \
  -e LT_DEBUG=true \
  libretranslate/libretranslate
```

### Option 2: Python Installation
```bash
# Install LibreTranslate
pip install libretranslate

# Run LibreTranslate
libretranslate --load-only en,hi,mr --port 5001
```

### Option 3: Use Public Demo Instance
For testing, you can use the public demo:
- URL: `https://libretranslate.de/`
- Note: This has rate limits and may not be suitable for production

## Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
# LibreTranslate Configuration
NEXT_PUBLIC_LIBRETRANSLATE_URL=http://localhost:5001
# NEXT_PUBLIC_LIBRETRANSLATE_API_KEY=your_api_key_if_required
```

### Supported Languages
LibreTranslate supports:
- **en** - English
- **hi** - Hindi  
- **mr** - Marathi
- And many more languages

## Integration Features

### 1. Hybrid Translation System
- **Static translations** for UI elements (fast, reliable)
- **Dynamic translations** for user content (LibreTranslate)
- **Fallback** to static translations if LibreTranslate is unavailable

### 2. Auto-Translate Toggle
Users can enable/disable automatic translation:
- **OFF**: Uses static translations only
- **ON**: Translates content dynamically using LibreTranslate

### 3. Translation Caching
- Translations are cached in memory for performance
- Reduces API calls for repeated content
- Improves user experience

### 4. Language Detection
LibreTranslate can automatically detect source language:
```javascript
// Auto-detect and translate
const translated = await libreTranslateService.translate(text, 'hi');
```

## Usage Examples

### Basic Translation
```javascript
import libreTranslateService from '@/lib/libretranslate';

// Translate to Hindi
const hindiText = await libreTranslateService.translate(
  "Welcome to our platform", 
  'hi'
);

// Translate to Marathi
const marathiText = await libreTranslateService.translate(
  "Book your favorite services", 
  'mr'
);
```

### Using TranslatableText Component
```jsx
import { TranslatableText } from '@/components/ui/translatable-text';

// Auto-translates when language changes
<TranslatableText 
  text="Welcome to Udyogini" 
  showOriginal={true}
/>

// Custom element type
<TranslatableText 
  text="Book now" 
  as="button"
  className="btn-primary"
/>
```

### Enhanced Language Selector
```jsx
import { EnhancedLanguageSelector } from '@/components/ui/enhanced-language-selector';

// Includes auto-translate toggle
<EnhancedLanguageSelector />
```

## Performance Considerations

### 1. Caching Strategy
- Translations are cached in component state
- Consider implementing persistent caching for production
- Cache invalidation when language changes

### 2. Rate Limiting
- LibreTranslate demo has rate limits
- Self-hosted instances have better performance
- Implement request queuing for high traffic

### 3. Fallback Handling
- System gracefully falls back to static translations
- User experience remains consistent
- Error handling for network issues

## Production Deployment

### Docker Compose Example
```yaml
version: '3.8'
services:
  libretranslate:
    image: libretranslate/libretranslate
    ports:
      - "5001:5000"
    environment:
      - LT_LOAD_ONLY=en,hi,mr
      - LT_DEBUG=false
    restart: unless-stopped
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: libretranslate
spec:
  replicas: 2
  selector:
    matchLabels:
      app: libretranslate
  template:
    metadata:
      labels:
        app: libretranslate
    spec:
      containers:
      - name: libretranslate
        image: libretranslate/libretranslate
        ports:
        - containerPort: 5000
        env:
        - name: LT_LOAD_ONLY
          value: "en,hi,mr"
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure LibreTranslate is running on correct port
   - Check firewall settings
   - Verify URL in environment variables

2. **Translation Not Working**
   - Check if auto-translate is enabled
   - Verify target language is supported
   - Check browser console for errors

3. **Performance Issues**
   - Enable caching
   - Consider self-hosting instead of demo instance
   - Implement request debouncing

### Debug Mode
Enable debug logging:
```bash
libretranslate --debug --port 5001
```

## Security Notes

- Self-hosted instances provide better privacy
- API keys optional for basic usage
- Consider authentication for production
- Monitor for abuse and rate limiting

## Alternative Translation Services

If LibreTranslate doesn't meet your needs, consider:
- **Google Translate API** (paid, high quality)
- **Microsoft Translator** (paid, enterprise features)
- **MyMemory API** (free tier available)
- **DeepL API** (paid, excellent quality)

The system is designed to be easily adapted to other translation services by updating the `libretranslate.ts` service file.
