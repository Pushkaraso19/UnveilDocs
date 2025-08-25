import React, { useState } from 'react';
import './App.css';

function App() {
  const [docText, setDocText] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSummarize = async () => {
    const res = await fetch('http://localhost:5000/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: docText }),
    });
    const data = await res.json();
    setSummary(data.summary);
  };

  const handleAsk = async () => {
    const res = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: docText, question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div className="container">
      <h1>UnveilDocs</h1>
      <textarea
        value={docText}
        onChange={e => setDocText(e.target.value)}
        placeholder="Paste legal document here"
        rows={8}
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={handleSummarize}>Summarize</button>
      <div><strong>Summary:</strong> {summary}</div>
      <br />
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask a question about the document"
        style={{ width: '80%' }}
      />
      <button onClick={handleAsk}>Ask</button>
      <div><strong>Answer:</strong> {answer}</div>
    </div>
  );
}

export default App;
