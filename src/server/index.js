const path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');

const app = express();

// Log startup to make sure it runs
console.log('🚀 Starting server...');

// Serve static files
app.use(express.static('dist'));

// Serve index.html on root path
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.resolve(__dirname, '../../dist') });
});

// API route
app.get('/test', (req, res) => {
  res.send(mockAPIResponse);
});

// Listen on port 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Server is listening at http://localhost:${PORT}`);
});
