import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "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"; // Paste your key here

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
        messages: [{ role: "user", content: `Explain ${topic} like I'm 5.` }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Hmm, I couldn't explain that.";
    res.json({ explanation: reply });

  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ explanation: "Oops! Something went wrong." });
  }
});

app.listen(3000, () => {
  console.log("🚀 Backend running on port 3000");
});
