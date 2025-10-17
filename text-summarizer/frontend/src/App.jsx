import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    if (!text.trim()) {
      alert('Please enter some text to summarize.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5012/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className='txt-summarizer'>
      <h1>🧠Text Summarizer</h1>
      <textarea 
        rows="6"
        placeholder="Enter text to summarize..." 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <button onClick={handleSummarize} >Summarize</button>
      
      {summary && (
          <div className='summary'>
            <h2>Summary:</h2>
            <p>{summary}</p>
          </div>
      )}
    </div>
  )
}

export default App
