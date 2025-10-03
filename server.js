import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Gemini API ключ из переменной окружения
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if(!GEMINI_KEY){
  console.error("❌ Пожалуйста, установите GEMINI_API_KEY в Environment Variables!");
}

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: message }] }] })
      }
    );
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Пустой ответ";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));