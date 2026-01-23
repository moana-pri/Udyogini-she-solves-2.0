import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Translates business content from source language to target language using Gemini API
 * Only translates if source and target languages are different
 * 
 * @param {Object} params - Translation parameters
 * @param {String} params.text - Text to translate
 * @param {String} params.sourceLanguage - Source language code (e.g., 'en', 'hi', 'mr')
 * @param {String} params.targetLanguage - Target language code
 * @returns {Promise<String>} - Translated text or original text if languages match
 */
export async function translateText({
  text,
  sourceLanguage = "en",
  targetLanguage = "en"
}) {
  try {
    // If no translation needed, return original text
    if (!text || sourceLanguage === targetLanguage) {
      return text;
    }

    // If source language is not specified or is the same as target, return as is
    if (!sourceLanguage) {
      return text;
    }

    console.log(`🌐 Translating from ${sourceLanguage} to ${targetLanguage}`);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Translate the following text from ${getLanguageName(
      sourceLanguage
    )} to ${getLanguageName(targetLanguage)}. 
Return ONLY the translated text, no explanations or additional text.

Text to translate:
${text}`;

    const result = await model.generateContent(prompt);
    const translatedText = result.response.text().trim();

    console.log(`✅ Translation successful`);
    return translatedText;
  } catch (error) {
    console.error("❌ Translation error:", error.message);
    // Return original text on error instead of failing
    return text;
  }
}

/**
 * Translates multiple fields of a business object
 * 
 * @param {Object} business - Business object with fields to translate
 * @param {String} sourceLanguage - Source language code
 * @param {String} targetLanguage - Target language code
 * @param {Array} fieldsToTranslate - Array of field names to translate (default: ['description'])
 * @returns {Promise<Object>} - Business object with translated fields
 */
export async function translateBusinessContent(
  business,
  sourceLanguage = "en",
  targetLanguage = "en",
  fieldsToTranslate = ["description"]
) {
  try {
    // If no translation needed, return original business object
    if (sourceLanguage === targetLanguage) {
      return business;
    }

    const translatedBusiness = { ...business };

    // Translate each specified field
    for (const field of fieldsToTranslate) {
      if (business[field]) {
        console.log(`🔄 Translating field: ${field}`);
        translatedBusiness[field] = await translateText({
          text: business[field],
          sourceLanguage,
          targetLanguage
        });
      }
    }

    console.log(`✅ Business content translated for ${targetLanguage}`);
    return translatedBusiness;
  } catch (error) {
    console.error("❌ Business translation error:", error.message);
    // Return original business object on error
    return business;
  }
}

/**
 * Maps language codes to full language names for Gemini
 */
function getLanguageName(code) {
  const languageMap = {
    en: "English",
    hi: "Hindi",
    mr: "Marathi",
    te: "Telugu",
    ta: "Tamil",
    kn: "Kannada",
    ml: "Malayalam",
    gu: "Gujarati",
    bn: "Bengali",
    pa: "Punjabi",
    es: "Spanish",
    fr: "French",
    de: "German",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    zh: "Chinese",
    ar: "Arabic",
    it: "Italian",
    ko: "Korean"
  };
  return languageMap[code] || "English";
}

export default { translateText, translateBusinessContent };
