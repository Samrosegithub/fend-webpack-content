// src/server/index.js
const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

// Serve built assets
app.use(express.static(path.join(__dirname, '../../dist')));

// Health check
app.get('/health', (_req, res) => res.send('ok'));

// SPA fallback (remove if not using client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
