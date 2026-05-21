import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
  ppcSentence?: string;
  soThatSentence?: string;
  author?: string;
  avatar?: string;
  reactions?: { [emoji: string]: number };
  comments?: Comment[];
  contentKo?: string;
  ppcSentenceKo?: string;
  soThatSentenceKo?: string;
}

const getSeedEntries = (): GratitudeEntry[] => [
  {
    id: "seed-minjun",
    author: "minjun",
    content: "When I'm stressed, I exercise. My stress was so huge that I started running. I have been running for thirty minutes to feel refreshed. Exercise is a great way to handle stress. I am thankful for my healthy body.",
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    reactions: { "❤️": 5 },
    comments: []
  },
  {
    id: "seed-hana",
    author: "hana",
    content: "When I feel stressed, I listen to music. The melodies are so sweet that they calm my mind. I have been listening to jazz since I got home to relax. I am grateful for the beautiful music.",
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    reactions: { "❤️": 7 },
    comments: []
  },
  {
    id: "seed-doyun",
    author: "doyun",
    content: "I often cook when I'm stressed. The smell of bread is so nice that it makes me happy. I have been baking bread for two hours to forget my stress. I feel thankful for the delicious smell.",
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    reactions: { "❤️": 4 },
    comments: []
  },
  {
    id: "seed-somi",
    author: "somi",
    content: "I draw when I'm under stress. The paper is so white that I want to fill it with patterns. I have been drawing zentangles for an hour to calm down. I am grateful for this peaceful time.",
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    reactions: { "❤️": 6 },
    comments: []
  },
  {
    id: "seed-jiho",
    author: "jiho",
    content: "When I'm stressed, I play with my dog. He is so energetic that he makes me active. I have been playing catch with him all afternoon. I am thankful for my energetic puppy.",
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    reactions: { "👍": 8 },
    comments: []
  },
  {
    id: "seed-sujin",
    author: "sujin",
    content: "Reading is my way to handle stress. The book is so exciting that I am completely absorbed in it. I have been reading this adventure story for three hours. I am grateful for the interesting book.",
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    reactions: { "✨": 6 },
    comments: []
  },
  {
    id: "seed-taeyang",
    author: "taeyang",
    content: "I take a walk when I'm stressed. The park is so quiet that I can think clearly. I have been walking along the river for an hour. I feel thankful for the fresh air.",
    date: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    reactions: { "📚": 9 },
    comments: []
  }
];

const DIARY_FILE_PATH = path.join(process.cwd(), "class_diary_store.json");

function readDiary(): GratitudeEntry[] {
  try {
    if (!fs.existsSync(DIARY_FILE_PATH)) {
      const seeds = getSeedEntries();
      fs.writeFileSync(DIARY_FILE_PATH, JSON.stringify(seeds, null, 2), "utf8");
      return seeds;
    }
    const data = fs.readFileSync(DIARY_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read diary from disk:", err);
    return getSeedEntries();
  }
}

function writeDiary(data: GratitudeEntry[]) {
  try {
    fs.writeFileSync(DIARY_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write diary to disk:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // Class Diary Shared Endpoints
  app.get("/api/class-diary", (req, res) => {
    try {
      const data = readDiary();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch class diary" });
    }
  });

  app.post("/api/class-diary", (req, res) => {
    try {
      const newEntry: GratitudeEntry = req.body;
      if (!newEntry || !newEntry.id) {
        return res.status(400).json({ error: "Invalid entry structure" });
      }

      let data = readDiary();
      const existingIndex = data.findIndex(e => e.id === newEntry.id);
      if (existingIndex !== -1) {
        data[existingIndex] = {
          ...data[existingIndex],
          ...newEntry
        };
      } else {
        data = [newEntry, ...data];
      }

      writeDiary(data);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "Failed to save entry" });
    }
  });

  app.post("/api/class-diary/react", (req, res) => {
    try {
      const { id, emoji } = req.body;
      if (!id || !emoji) {
        return res.status(400).json({ error: "id and emoji are required" });
      }

      const data = readDiary();
      const entry = data.find(e => e.id === id);
      if (entry) {
        entry.reactions = entry.reactions || {};
        entry.reactions[emoji] = (entry.reactions[emoji] || 0) + 1;
        writeDiary(data);
        res.json(data);
      } else {
        res.status(404).json({ error: "Entry not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to add reaction" });
    }
  });

  app.post("/api/class-diary/comment", (req, res) => {
    try {
      const { id, comment } = req.body;
      if (!id || !comment) {
        return res.status(400).json({ error: "id and comment are required" });
      }

      const data = readDiary();
      const entry = data.find(e => e.id === id);
      if (entry) {
        entry.comments = entry.comments || [];
        entry.comments.push(comment);
        writeDiary(data);
        res.json(data);
      } else {
        res.status(404).json({ error: "Entry not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  app.post("/api/class-diary/delete", (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      let data = readDiary();
      data = data.filter(e => e.id !== id);
      writeDiary(data);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "Failed to delete entry" });
    }
  });

  app.post("/api/class-diary/clear", (req, res) => {
    try {
      const seeds = getSeedEntries();
      writeDiary(seeds);
      res.json(seeds);
    } catch (e) {
      res.status(500).json({ error: "Failed to clear class diary" });
    }
  });

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
