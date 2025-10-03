import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 🔑 Вставь сюда свой ключ из Google AI Studio
const GEMINI_KEY = "AIzaSyAKCO72VhlQI6dD-cKV1K-Ay6qdgvOgNK8";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Отдаём index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Чат-эндпоинт
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Сообщение не получено" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data, null, 2));

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(500).json({
        reply: data.error?.message || "Не удалось получить ответ от Gemini"
      });
    }

    res.json({ reply: data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error("Ошибка Gemini:", err);
    res
      .status(500)
      .json({ reply: err.message || "Ошибка сервера при обращении к Gemini" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ UnoGPT сервер (Gemini) работает: http://localhost:${PORT}`);
});