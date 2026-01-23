# Gemini Translation Integration Guide

## Overview
This implementation provides real-time translation of business content for customers using Google's Gemini API. Business owners enter all details in one language, and customers see translated content in their preferred language.

## Architecture

### 1. **Data Model Updates**

#### Business Model
- Added `language` field (default: "en")
- Stores the language code in which the business details were entered (en, hi, mr, etc.)

#### User Model
- Already has `preferredLanguage` field (default: "en")
- Used to determine which language to translate business content into

### 2. **Translation Utility** (`utils/translateText.js`)

Two main functions:

#### `translateText(params)`
Translates a single text string
- **Parameters:**
  - `text`: String to translate
  - `sourceLanguage`: Language code of original text (default: "en")
  - `targetLanguage`: Language code for translation (default: "en")
- **Returns:** Translated text (or original if no translation needed)
- **Behavior:** Returns original text if languages match or on error

#### `translateBusinessContent(business, sourceLanguage, targetLanguage, fieldsToTranslate)`
Translates multiple fields of a business object
- **Parameters:**
  - `business`: Business object with fields to translate
  - `sourceLanguage`: Language code (default: "en")
  - `targetLanguage`: Language code (default: "en")
  - `fieldsToTranslate`: Array of field names (default: ["description"])
- **Returns:** Business object with translated fields
- **Note:** Does NOT modify the original business document in database

### 3. **API Endpoints**

#### Business Owner Endpoints (No Translation)
- `GET /api/business/profile` - Get own business (no translation)
- `PUT /api/business/profile` - Update business details
- `GET /api/business/:id` - Get any business by ID (no translation)

#### Customer Endpoints (With Translation)
- `GET /api/business/customer/:businessId` - Fetch single business with translated content
- `GET /api/business/customer/search?type=&location=` - Fetch multiple businesses with translated content

### 4. **Controllers**

#### `customerBusinessController.js`
- `getBusinessForCustomer()` - Fetches single business and translates if needed
- `getBusinessesForCustomer()` - Fetches multiple businesses and translates all

Translation happens here:
1. Fetch customer's preferred language
2. Fetch business with its language setting
3. If languages differ, translate business.description using Gemini API
4. Return translated data WITHOUT saving to database
5. Include `_translated: true` and `_translatedLanguage` flags in response

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key for your project
4. Copy the key

### 2. Update `.env`
```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Install Dependencies
```bash
cd Backend
npm install @google/generative-ai
npm install
```

### 4. Restart Backend
```bash
npm run dev
```

## Usage Flow

### For Business Owners
1. Register and create business profile
2. All details (especially description) entered in their preferred language
3. Language automatically set to their language preference
4. No changes to booking or dashboard workflows

### For Customers
1. Customer login and sets preferred language
2. When viewing business profiles, backend automatically:
   - Fetches business data
   - Checks if business language ≠ customer language
   - If different, translates business description using Gemini
   - Returns translated data
3. Customer sees translated content in their language
4. Original data in database remains unchanged

## Supported Languages
- English (en)
- Hindi (hi)
- Marathi (mr)
- Telugu (te)
- Tamil (ta)
- Kannada (kn)
- Malayalam (ml)
- Gujarati (gu)
- Bengali (bn)
- Punjabi (pa)
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Chinese (zh)
- Arabic (ar)
- Italian (it)
- Korean (ko)

## API Response Example

### Request
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/business/customer/123456789
```

### Response (with translation)
```json
{
  "_id": "123456789",
  "businessName": "Beauty Parlour",
  "businessType": "beauty-parlour",
  "description": "[Hindi description translated to Marathi]",
  "language": "hi",
  "_translated": true,
  "_translatedLanguage": "mr",
  "location": {...},
  "phone": "...",
  ...
}
```

## Key Features

✅ **No Database Pollution** - Translations are NOT saved to database
✅ **Real-time** - Translation happens on-read, not pre-computed
✅ **Fallback Handling** - Returns original text if translation fails
✅ **Efficient** - Translation only happens if languages differ
✅ **Owner Privacy** - Business owners see no translation on their dashboard
✅ **Customer Experience** - Customers see content in their language

## Error Handling
- If Gemini API fails: Original text is returned
- If language not supported: Original text is returned
- If connection issues: Returns original business data with error logged
- Translation errors don't break the response, API still returns data

## Future Enhancements
1. Cache translations to improve performance
2. Add service descriptions to translation fields
3. Translate business name if needed
4. Add translation quality feedback
5. Implement batch translation for better efficiency
6. Add character limits to prevent API quota issues
