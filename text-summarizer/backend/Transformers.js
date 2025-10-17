// app.mjs
import express from 'express';
import { pipeline } from '@xenova/transformers';
import cors from 'cors';

const app = express();
const port = 5012;
app.use(cors({
  origin: ['http://localhost:5012', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize the summarization pipeline once when the server starts
let summarizer;
async function initializeSummarizer() {
  summarizer = await pipeline('summarization', 'Xenova/bart-large-cnn');
  console.log('BART-large-CNN summarizer initialized.');
}

initializeSummarizer();

app.use(express.json());

app.post('/summarize', async (req, res) => {
  console.log('POST /summarize called. Body:', req.body);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Please provide text to summarize.' });
  }

  try {
    if (!summarizer) {
      return res.status(503).json({ error: 'Summarizer is still initializing. Please try again shortly.' });
    }
    const output = await summarizer(text, {
      min_length: 50,
      max_length: 150,
      truncation: true // Important for handling long texts
    });
    res.json({ summary: output.summary_text });
  } catch (error) {
    console.error('Error during summarization:', error);
    res.status(500).json({ error: 'Failed to summarize text.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});