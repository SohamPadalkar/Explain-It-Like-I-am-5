import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;
console.log("🔑 Loaded API Key:", API_KEY);

app.post("/explain", async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          { role: "user", content: `Explain ${topic} like I'm 5.` }
        ]
      })
    });

    const rawText = await response.text();  // Capture full response
    console.log("📦 OpenRouter raw response:", rawText);

    const data = JSON.parse(rawText); // Now parse it safely
    const reply = data.choices?.[0]?.message?.content || "Hmm, I couldn't explain that.";
    res.json({ explanation: reply });

  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ explanation: "Oops! Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

