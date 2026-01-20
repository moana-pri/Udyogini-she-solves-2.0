import express from "express";
import { translateText, translateTexts } from "../utils/translate.js";

const router = express.Router();

/**
 * Translate a single text
 * POST /api/translate
 * Body: { text, targetLanguage }
 */
router.post("/", async (req, res) => {
  try {
    const { text, targetLanguage = "en" } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const translatedText = await translateText(text, targetLanguage);

    res.json({
      original: text,
      translated: translatedText,
      targetLanguage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Translate multiple texts
 * POST /api/translate/batch
 * Body: { texts: ["text1", "text2"], targetLanguage }
 */
router.post("/batch", async (req, res) => {
  try {
    const { texts, targetLanguage = "en" } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ message: "Texts array is required" });
    }

    const translatedTexts = await translateTexts(texts, targetLanguage);

    res.json({
      original: texts,
      translated: translatedTexts,
      targetLanguage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
