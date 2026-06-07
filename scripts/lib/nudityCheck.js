/**
 * scripts/lib/nudityCheck.js — Haiku-vision bare-chest classifier.
 *
 * Some bot paths render characters that Flux occasionally renders bare-chested
 * even with covered-outfit prompts (mermaids, fairies, nymphs, dryads — the
 * "Flux likes to add titties sometimes" failure mode, Kevin 2026-06-06). This
 * module post-classifies a rendered image and returns whether it crossed the
 * nudity line. The caller (botEngine) re-rolls the render when flagged.
 *
 * Cost: ~$0.001-0.005 per call (Haiku vision). Latency: ~1-2 sec.
 *
 * Usage:
 *   const { classifyImageForNudity } = require('./nudityCheck');
 *   const { flagged, reason } = await classifyImageForNudity({ localPath, anthropicKey });
 *   if (flagged) // re-roll the render
 */

const fs = require('fs');
const path = require('path');
const { HAIKU } = require('./models');

function loadEnvFile() {
  try {
    const raw = fs.readFileSync('.env.local', 'utf8');
    const env = {};
    for (const line of raw.split('\n')) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch (_) {
    return {};
  }
}

function getAnthropicKey() {
  return process.env.ANTHROPIC_API_KEY || loadEnvFile().ANTHROPIC_API_KEY;
}

function mimeFromPath(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

const CLASSIFY_PROMPT = `Look at this image and decide: does it show ANY of the following?

1. Visible bare nipples on a humanoid figure (any gender).
2. Fully-exposed bare chest with no garment / fabric / shell / armor / coverage of any kind across the chest area.
3. Sheer, see-through, or translucent fabric where nipples are visibly outlined through it.

You are gating bot renders for an app that allows scantily-clad / cleavage / midriff / bare shoulders / bare arms — those are FINE and do NOT trigger this check. Only flag actual toplessness or visible nipples.

Mermaid context: a fish-scale tail covering legs is fine. A seashell-bra / coral-bra / kelp-strap / hair-strands strategically covering breasts is fine. ONLY flag if both nipples or the bare chest are clearly visible.

Fae / fairy / nymph / dryad context: leaf-bra / flower-petal-bra / vine-wrap / bark-armor covering the chest is fine. ONLY flag if the chest is bare.

Reply with EXACTLY one of:
  "SAFE" — image passes
  "BARE" — image shows bare chest or visible nipples

Reply with the single word SAFE or BARE on its own line. No explanation.`;

/**
 * Classify a local image for bare-chest / visible-nipple content.
 *
 * @param {Object} opts
 * @param {string} opts.localPath — absolute or relative path to JPEG/PNG/WEBP
 * @param {string} [opts.anthropicKey] — override; defaults to env
 * @param {number} [opts.timeoutMs] — request timeout (default 30s)
 * @returns {Promise<{ flagged: boolean, reason: string, raw: string }>}
 */
async function classifyImageForNudity({ localPath, anthropicKey, timeoutMs = 30_000 }) {
  const key = anthropicKey || getAnthropicKey();
  if (!key) throw new Error('nudityCheck: ANTHROPIC_API_KEY missing');
  if (!fs.existsSync(localPath)) throw new Error(`nudityCheck: file not found ${localPath}`);

  const buf = fs.readFileSync(localPath);
  const b64 = buf.toString('base64');
  const mime = mimeFromPath(localPath);

  const body = {
    model: HAIKU,
    max_tokens: 10,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mime, data: b64 } },
          { type: 'text', text: CLASSIFY_PROMPT },
        ],
      },
    ],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const t = (await res.text()).slice(0, 200);
      // Fail-open on API errors — don't block legit renders on a classifier outage.
      // Log but treat as SAFE so the render goes through.
      console.warn(`  ⚠️ nudityCheck API ${res.status}: ${t} — failing open`);
      return { flagged: false, reason: 'classifier-error-fail-open', raw: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const raw = (data.content?.[0]?.text || '').trim().toUpperCase();
    const flagged = raw.startsWith('BARE');
    return {
      flagged,
      reason: flagged ? 'bare-chest-detected' : 'classifier-safe',
      raw,
    };
  } catch (err) {
    // Same fail-open on network / timeout — don't strand the render.
    console.warn(`  ⚠️ nudityCheck error: ${err.message} — failing open`);
    return { flagged: false, reason: 'classifier-error-fail-open', raw: err.message };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { classifyImageForNudity };
