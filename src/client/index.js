// src/client/index.js
import './styles/resets.scss';
import './styles/base.scss';
import './styles/footer.scss';
import './styles/form.scss';
import './styles/header.scss';

function $(sel) { return document.querySelector(sel); }

function render() {
  document.body.innerHTML = `
    <main style="max-width:720px;margin:2rem auto;font-family:system-ui">
      <h1>Client + API</h1>
      <p><strong>Server time:</strong> <span id="server-time">loading…</span></p>

      <section style="margin-top:2rem">
        <h2>NLP Analyzer</h2>
        <form id="nlp-form">
          <textarea id="text" rows="6" placeholder="Paste text to analyze…" required style="width:100%"></textarea>
          <button type="submit" style="margin-top:0.75rem">Analyze</button>
        </form>
        <pre id="result" style="background:#f6f8fa;padding:1rem;margin-top:1rem;white-space:pre-wrap;"></pre>
      </section>
    </main>
  `;
}

async function getServerTime() {
  try {
    const r = await fetch('/api/time');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    return data.now || '';
  } catch (e) {
    return 'unavailable';
  }
}

async function analyzeText(text) {
  try {
    const r = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((data && data.error) || ('HTTP ' + r.status));
    return data;
  } catch (e) {
    throw e;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  render();

  // Show server time (works whether using dev proxy or prod server)
  const time = await getServerTime();
  const timeEl = $('#server-time');
  if (timeEl) timeEl.textContent = time;

  // NLP form handler (gracefully handles if /api/analyze isn’t implemented)
  const form = $('#nlp-form');
  const textarea = $('#text');
  const resultEl = $('#result');

  if (form && textarea && resultEl) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = (textarea.value || '').trim();
      if (!text) return;

      resultEl.textContent = 'Analyzing…';
      try {
        const data = await analyzeText(text);
        const tone = data.tone != null ? String(data.tone) : 'n/a';
        const subjectivity = data.subjectivity != null ? String(data.subjectivity) : 'n/a';
        resultEl.textContent =
          `Tone: ${tone}\nSubjectivity: ${subjectivity}\n\nFull response:\n` +
          JSON.stringify(data, null, 2);
      } catch (err) {
        resultEl.textContent = '❌ ' + (err && err.message ? err.message : 'Analysis failed');
      }
    });
  }
});
