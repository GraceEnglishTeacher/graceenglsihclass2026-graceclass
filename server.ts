import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // API route for translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { texts } = req.body;
      if (!texts || !Array.isArray(texts)) {
        return res.status(400).json({ error: "Texts array is required" });
      }

      if (texts.length === 0) {
        return res.json({ translatedTexts: [] });
      }

      const prompt = `Translate the following array of English strings to Korean. Focus on natural, friendly, and encouraging language. 
      Return the translation as a JSON array of strings in the exact same order.
      
      Input: ${JSON.stringify(texts)}`;
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        }
      });
      
      const textResponse = response.text || "[]";
      // Ensure we only have the JSON part if there's any stray text
      const jsonStart = textResponse.indexOf('[');
      const jsonEnd = textResponse.lastIndexOf(']');
      
      let translatedTexts;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        translatedTexts = JSON.parse(textResponse.substring(jsonStart, jsonEnd + 1));
      } else {
        translatedTexts = JSON.parse(textResponse);
      }

      res.json({ translatedTexts });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate text" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
