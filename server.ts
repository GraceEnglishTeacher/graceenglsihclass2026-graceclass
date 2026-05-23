import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

// Read Firebase config
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase, firebaseConfig.firestoreDatabaseId);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // Class Diary Shared Endpoints
  app.get("/api/class-diary", async (req, res) => {
    try {
      const q = collection(db, "class_diary");
      let snapshot;
      try {
        snapshot = await getDocs(q);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "class_diary");
      }
      
      let entries: GratitudeEntry[] = [];
      snapshot.forEach(docSnap => {
        entries.push(docSnap.data() as GratitudeEntry);
      });
      
      if (entries.length === 0) {
        // Seed database if empty
        const seeds = getSeedEntries();
        for (const seed of seeds) {
          try {
            await setDoc(doc(db, "class_diary", seed.id), seed);
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, `class_diary/${seed.id}`);
          }
        }
        entries = seeds;
      }
      res.json(entries);
    } catch (e: any) {
      console.error("Failed to fetch class diary:", e);
      res.status(500).json({ error: "Failed to fetch class diary", details: e.message });
    }
  });

  app.post("/api/class-diary", async (req, res) => {
    try {
      const newEntry: GratitudeEntry = req.body;
      if (!newEntry || !newEntry.id) {
        return res.status(400).json({ error: "Invalid entry structure" });
      }

      const docRef = doc(db, "class_diary", newEntry.id);
      let docSnap;
      try {
        docSnap = await getDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `class_diary/${newEntry.id}`);
      }

      let entryToSave: GratitudeEntry;
      if (docSnap.exists()) {
        entryToSave = {
          ...(docSnap.data() as GratitudeEntry),
          ...newEntry
        };
      } else {
        entryToSave = newEntry;
      }

      try {
        await setDoc(docRef, entryToSave);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `class_diary/${newEntry.id}`);
      }

      // Return refreshed entries
      const q = collection(db, "class_diary");
      const snapshot = await getDocs(q);
      const entries: GratitudeEntry[] = [];
      snapshot.forEach(d => {
        entries.push(d.data() as GratitudeEntry);
      });
      res.json(entries);
    } catch (e: any) {
      console.error("Failed to save entry:", e);
      res.status(500).json({ error: "Failed to save entry", details: e.message });
    }
  });

  app.post("/api/class-diary/react", async (req, res) => {
    try {
      const { id, emoji } = req.body;
      if (!id || !emoji) {
        return res.status(400).json({ error: "id and emoji are required" });
      }

      const docRef = doc(db, "class_diary", id);
      let docSnap;
      try {
        docSnap = await getDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `class_diary/${id}`);
      }

      if (docSnap.exists()) {
        const entry = docSnap.data() as GratitudeEntry;
        entry.reactions = entry.reactions || {};
        entry.reactions[emoji] = (entry.reactions[emoji] || 0) + 1;
        
        try {
          await setDoc(docRef, entry);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `class_diary/${id}`);
        }

        // Return refreshed entries
        const q = collection(db, "class_diary");
        const snapshot = await getDocs(q);
        const entries: GratitudeEntry[] = [];
        snapshot.forEach(d => {
          entries.push(d.data() as GratitudeEntry);
        });
        res.json(entries);
      } else {
        res.status(404).json({ error: "Entry not found" });
      }
    } catch (e: any) {
      console.error("Failed to add reaction:", e);
      res.status(500).json({ error: "Failed to add reaction", details: e.message });
    }
  });

  app.post("/api/class-diary/comment", async (req, res) => {
    try {
      const { id, comment } = req.body;
      if (!id || !comment) {
        return res.status(400).json({ error: "id and comment are required" });
      }

      const docRef = doc(db, "class_diary", id);
      let docSnap;
      try {
        docSnap = await getDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `class_diary/${id}`);
      }

      if (docSnap.exists()) {
        const entry = docSnap.data() as GratitudeEntry;
        entry.comments = entry.comments || [];
        entry.comments.push(comment);

        try {
          await setDoc(docRef, entry);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `class_diary/${id}`);
        }

        // Return refreshed entries
        const q = collection(db, "class_diary");
        const snapshot = await getDocs(q);
        const entries: GratitudeEntry[] = [];
        snapshot.forEach(d => {
          entries.push(d.data() as GratitudeEntry);
        });
        res.json(entries);
      } else {
        res.status(404).json({ error: "Entry not found" });
      }
    } catch (e: any) {
      console.error("Failed to add comment:", e);
      res.status(500).json({ error: "Failed to add comment", details: e.message });
    }
  });

  app.post("/api/class-diary/delete", async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      const docRef = doc(db, "class_diary", id);
      try {
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `class_diary/${id}`);
      }

      // Return refreshed entries
      const q = collection(db, "class_diary");
      const snapshot = await getDocs(q);
      const entries: GratitudeEntry[] = [];
      snapshot.forEach(d => {
        entries.push(d.data() as GratitudeEntry);
      });
      res.json(entries);
    } catch (e: any) {
      console.error("Failed to delete entry:", e);
      res.status(500).json({ error: "Failed to delete entry", details: e.message });
    }
  });

  app.post("/api/class-diary/clear", async (req, res) => {
    try {
      // Delete existing
      const q = collection(db, "class_diary");
      const snapshot = await getDocs(q);
      for (const docSnap of snapshot.docs) {
        try {
          await deleteDoc(doc(db, "class_diary", docSnap.id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `class_diary/${docSnap.id}`);
        }
      }

      // Re-seed
      const seeds = getSeedEntries();
      for (const seed of seeds) {
        try {
          await setDoc(doc(db, "class_diary", seed.id), seed);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `class_diary/${seed.id}`);
        }
      }
      res.json(seeds);
    } catch (e: any) {
      console.error("Failed to clear class diary:", e);
      res.status(500).json({ error: "Failed to clear class diary", details: e.message });
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
