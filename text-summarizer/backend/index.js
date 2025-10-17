const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const corsOptions ={
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

const HF_TOKEN = process.env.HF_TOKEN;

app.post("/summarize", async (req, res) => {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    const result = await response.json();
    const summary = result[0]?.summary_text || "Sorry, summarization failed.";

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ summary: "Error generating summary" });
  }

  // const { text } = req.body;
  // // ✨ Very basic "summarizer" - just returns first 20 words
  // const words = text.split(" ");
  // const summary = words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "");

  // res.json({ summary });
});

const PORT = 5012;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
