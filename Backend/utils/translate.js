import fetch from "node-fetch";
import translate from "@vitalets/google-translate-api";

export const translateText = async (text, from, to) => {
  if (from === to) return text;

  const result = await translate(text, {
    from,
    to,
  });

  return result.text;
};




export async function translateText(text, targetLang) {
  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang,
        format: "text",
      }),
    });

    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Translation failed:", err.message);
    return text; // fallback
  }
}
