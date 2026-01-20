/**
 * Frontend utility for calling translation API
 */

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/translate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      console.error('Translation API error:', response.statusText);
      return text; // Return original text on error
    }

    const data = await response.json();
    return data.translated || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

export async function translateTexts(texts: string[], targetLanguage: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/translate/batch`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      console.error('Translation API error:', response.statusText);
      return texts; // Return original texts on error
    }

    const data = await response.json();
    return data.translated || texts;
  } catch (error) {
    console.error('Translation error:', error);
    return texts; // Return original texts on error
  }
}
