import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch("https://api.generativeai.google.com/v1beta2/models/gemini-1.5-flash:generateText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: message,
        maxOutputTokens: 300
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content || "Ошибка: пустой ответ от Gemini";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API error" });
  }
}