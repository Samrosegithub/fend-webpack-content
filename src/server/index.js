// src/server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ===== NLP proxy (Udacity AWS endpoint) =====
const NLP_API =
  process.env.NLP_API ||
  'https://kooye7u703.execute-api.us-east-1.amazonaws.com/NLPAnalyzer';

// POST /api/analyze -> proxy to Udacity NLP
app.post('/api/analyze', async (req, res) => {
  try {
    const text = (req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: "Please provide 'text'." });

    // Node 18+ has global fetch (works on Node 22)
    const r = await fetch(NLP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: data?.error || 'Upstream NLP error' });

    res.json(data);
  } catch (err) {
    console.error('NLP proxy error:', err);
    res.status(502).json({ error: 'NLP service unavailable' });
  }
});
// ============================================

// Simple API
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/time', (_req, res) => res.json({ now: new Date().toISOString() }));

// Serve built client
const distDir = path.join(__dirname, '../../dist');
app.use(express.static(distDir));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
