// Simple translation utility using in-memory translations
// In production, this would use Google Translate API or similar

const translations = {
  en: {
    "Pending Approval": "Pending Approval",
    "Confirmed": "Confirmed",
    "Completed": "Completed",
    "Cancelled": "Cancelled",
    "Declined": "Declined",
    "Service": "Service",
    "Date": "Date",
    "Time": "Time",
    "Price": "Price",
    "Notes": "Notes",
    "Status": "Status",
    "Business": "Business",
    "Customer": "Customer",
  },
  hi: {
    "Pending Approval": "स्वीकृति के लिए प्रतीक्षा",
    "Confirmed": "पुष्टि की गई",
    "Completed": "पूर्ण",
    "Cancelled": "रद्द",
    "Declined": "अस्वीकार",
    "Service": "सेवा",
    "Date": "तारीख",
    "Time": "समय",
    "Price": "कीमत",
    "Notes": "नोट्स",
    "Status": "स्थिति",
    "Business": "व्यवसाय",
    "Customer": "ग्राहक",
  }
};

/**
 * Translate a single text to target language
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (en, hi)
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLanguage = "en") => {
  try {
    const lang = targetLanguage.toLowerCase();
    
    // If language not supported, return original text
    if (!translations[lang]) {
      console.log(`Language ${lang} not supported, returning original`);
      return text;
    }

    // Return translated text if available, otherwise return original
    return translations[lang][text] || text;
  } catch (err) {
    console.error("Translation error:", err);
    throw err;
  }
};

/**
 * Translate multiple texts to target language
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code (en, hi)
 * @returns {Promise<string[]>} - Array of translated texts
 */
export const translateTexts = async (texts, targetLanguage = "en") => {
  try {
    const lang = targetLanguage.toLowerCase();
    
    // If language not supported, return original texts
    if (!translations[lang]) {
      console.log(`Language ${lang} not supported, returning originals`);
      return texts;
    }

    // Translate each text
    return texts.map(text => translations[lang][text] || text);
  } catch (err) {
    console.error("Batch translation error:", err);
    throw err;
  }
};

export default { translateText, translateTexts };
