/**
 * seedGenHelper.js — shared batch-generator for Sonnet-seeded axis pools.
 *
 * Lets per-axis generator scripts stay tiny: just declare the meta-prompt
 * and output path, the helper handles env loading, batched generation
 * with programmatic dedup (signature-based + exact-string), retry on
 * transient errors, and JSON output.
 *
 * Dedup architecture (2026-06-05 — per playbook line 333-349):
 *   1. Sonnet is shown the existing entries as "DO NOT DUPLICATE" anti-prompt
 *      (best-effort; Sonnet honors imperfectly).
 *   2. Within-batch dedup — each returned batch is filtered for exact-string
 *      dupes (case-insensitive trim) and signature-hash dupes (first 12
 *      non-stopword tokens >4 chars, alphabetized + joined) against itself
 *      AND against the running pool.
 *   3. Trimming applied only after dedup so the target count reflects
 *      unique entries, not raw Sonnet output.
 *
 * Usage:
 *   const { generatePool } = require('../../lib/seedGenHelper');
 *   generatePool({
 *     outPath: 'scripts/bots/gothbot/seeds/expressions.json',
 *     total: 50,
 *     batch: 10,
 *     metaPrompt: (perBatchCount) => `You are writing ${perBatchCount} expression entries...`
 *   });
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./models');

// ─────────────────────────────────────────────────────────────
// Dedup helpers — playbook line 333-349 (2026-06-05)
// ─────────────────────────────────────────────────────────────

// Common English/prompt-domain stopwords + frequent low-signal anchor words.
// Stripped before signature hashing so two entries differing only in filler
// words collapse to the same signature.
const STOPWORDS = new Set([
  'the', 'and', 'with', 'from', 'into', 'onto', 'over', 'under', 'above',
  'their', 'them', 'they', 'this', 'that', 'these', 'those', 'a', 'an',
  'of', 'in', 'on', 'at', 'to', 'for', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'as', 'it', 'its', 'has', 'have', 'had', 'his', 'her',
  'she', 'he', 'him', 'one', 'two', 'three', 'across', 'beside', 'before',
  'after', 'while', 'mid', 'tiny', 'small', 'large', 'huge', 'soft', 'slow',
  'still', 'just', 'around', 'beyond', 'between', 'against', 'through',
  'render', 'rendered', 'painted', 'wrapped', 'curled', 'piled',
]);

// Normalize an entry for exact-match dedup.
function keyForExact(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Signature = sorted-unique first-12 non-stopword tokens >4 chars, joined.
// Two entries with the same signature are near-duplicates per the playbook.
function signatureOf(s) {
  const tokens = String(s)
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 4 && !STOPWORDS.has(t));
  const unique = Array.from(new Set(tokens)).sort();
  return unique.slice(0, 12).join('|');
}

function loadEnv() {
  const env = {};
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const l of lines) {
      const eq = l.indexOf('=');
      if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
    }
  } catch (_) {}
  return env;
}

async function callWithRetry(body, anthropicKey) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      // Transient network failure (fetch failed / ECONNRESET / timeout).
      // Retry like a 5xx — Anthropic's streaming-long-response endpoint can
      // hiccup on very large outputs.
      if (i < delays.length) {
        console.log(`  ⏳ fetch error (${err.message}) — retry ${i + 1}/${delays.length} in ${delays[i] / 1000}s`);
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }
      throw err;
    }
    if (res.ok) return await res.json();
    const text = (await res.text()).slice(0, 200);
    if ((res.status === 529 || res.status === 429 || res.status >= 500) && i < delays.length) {
      console.log(`  ⏳ ${res.status} — retry ${i + 1}/${delays.length} in ${delays[i] / 1000}s`);
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(res.status + ': ' + text);
  }
  throw new Error('exhausted');
}

/**
 * Generate a pool of string entries with intra-pool dedup.
 *
 * Options:
 *   outPath         - relative file path to write JSON array to
 *   total           - total entries desired (e.g., 50)
 *   batch           - entries per Sonnet call (e.g., 10)
 *   metaPrompt      - function(perBatchCount) => string — the per-call brief
 *                     (does not need to include prior-batch dedup — helper adds that)
 *   maxTokens       - optional, default 8000 (was 2500 pre-2026-06-05;
 *                     too small for batch:50 + 25-40 word entries; Sonnet
 *                     truncated mid-JSON and the parser bailed. Bumped after
 *                     8 of 27 parallel dragonbot gens hit "Fatal: batch N
 *                     failed parsing after 3 attempts.")
 *   model           - optional, default SONNET (see ./models.js)
 *
 * Writes JSON array to outPath. Resolves with the full array on success.
 */
async function generatePool({
  outPath,
  total,
  batch = 10,
  metaPrompt,
  maxTokens = 8000,
  model = SONNET,
  append = false,
}) {
  const ENV = loadEnv();
  const anthropicKey = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY missing');

  // POC override — SEED_TOTAL env var caps the pool size for fast prove-out runs.
  const envTotal = parseInt(process.env.SEED_TOTAL || '0', 10);
  if (envTotal > 0) {
    console.log(`🔧 SEED_TOTAL override: capping pool at ${envTotal} (configured was ${total})`);
    total = envTotal;
    if (batch > total) batch = total;
  }

  const all = [];
  if (append) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      all.push(...existing);
      console.log(`📂 Append mode: loaded ${existing.length} existing entries from ${outPath}`);
    } catch (err) {
      console.warn(`⚠ Append mode: could not read existing ${outPath} (${err.code}); starting fresh`);
    }
  }
  if (all.length >= total) {
    console.log(`✓ Pool already has ${all.length}/${total} entries — nothing to do`);
    return all;
  }
  console.log(
    `🌱 Generating up to ${total - all.length} new entries (target ${total}) → ${outPath}\n`
  );
  // Canonical iterative pattern (per playbook line 343-348 + gen-starbot-pool.js):
  // 1. Ask Sonnet for a batch sized to remaining-need × 1.5 (overgen to absorb
  //    dedup losses). NO anti-prompt list — Sonnet just generates fresh variety.
  // 2. Client-side dedup against the running pool (signature + exact-string).
  // 3. Append unique survivors. Loop until target reached, Sonnet returns
  //    empty, or 0 new uniques accepted (semantic-ceiling stop).
  // 4. MAX_ITERATIONS safety cap — never spin forever on an exhausted recipe.
  const MAX_ITERATIONS = 12;
  let iteration = 0;
  let consecutiveEmpty = 0;
  while (all.length < total && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = total - all.length;
    const overgenSize = Math.min(batch, Math.max(10, Math.ceil(stillNeeded * 1.5)));
    const base = metaPrompt(overgenSize);
    let newEntries = null;
    for (let parseAttempt = 0; parseAttempt < 3 && !newEntries; parseAttempt++) {
      const strictNote = parseAttempt > 0
        ? '\n\n━━━ CRITICAL: OUTPUT A VALID JSON ARRAY ONLY — no preamble, no explanation after, no unescaped quotes inside entries ━━━'
        : '';
      const data = await callWithRetry(
        {
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: base + strictNote }],
        },
        anthropicKey
      );
      const raw = (data.content[0]?.text || '').trim();
      // Try JSON array first
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          newEntries = JSON.parse(match[0]);
        } catch (err) {
          console.warn(`  ⚠ iter ${iteration} attempt ${parseAttempt + 1}: JSON.parse failed (${err.message.slice(0, 80)})`);
        }
      }
      // Fallback: numbered-list parse
      if (!newEntries) {
        const body = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
        const lines = body.split('\n');
        const entries = [];
        let current = null;
        for (const line of lines) {
          const m = line.match(/^\s*(\d+)\.\s*(.*)$/);
          if (m) {
            if (current) entries.push(current.trim());
            current = m[2];
          } else if (current !== null && line.trim()) {
            current += ' ' + line.trim();
          }
        }
        if (current) entries.push(current.trim());
        const cleaned = entries
          .map((e) => e.replace(/^["']|["']$/g, '').replace(/^[-•*]\s*/, '').trim())
          .filter((e) => e.length > 10);
        if (cleaned.length > 0) {
          newEntries = cleaned;
        } else {
          console.warn(`  ⚠ iter ${iteration} attempt ${parseAttempt + 1}: neither JSON nor numbered-list parsed, retrying...`);
        }
      }
    }
    if (!newEntries) {
      throw new Error(`iter ${iteration} failed parsing after 3 attempts`);
    }
    // Normalize: if Sonnet returned objects (id/description/text/composition), extract string field.
    // EXCEPTION: preserve full object when it has a non-empty `tags` array — needed for season/biome-tagged
    // pools that filter by matchTagsFromSlot at runtime (seasonal-shift, biome-specific paths, etc.).
    newEntries = newEntries.map((e) => {
      if (typeof e === 'string') return e;
      if (e && typeof e === 'object') {
        if (Array.isArray(e.tags) && e.tags.length > 0 && typeof e.description === 'string') {
          return e;
        }
        return e.description || e.text || e.composition || e.entry || e.content || JSON.stringify(e);
      }
      return String(e);
    });
    // Programmatic dedup (2026-06-05 per playbook line 333-349):
    //   (a) exact-string drop against running pool (case-insensitive trim)
    //   (b) signature-hash drop against running pool (first 12 non-stopword
    //       tokens >4 chars, alphabetized + joined)
    // Apply within-batch first (so two near-dupes in the same batch only
    // contribute one), then cross-batch against `all`.
    const droppedExact = [];
    const droppedSig = [];
    const seenStrs = new Set(
      all
        .filter((e) => typeof e === 'string' || (e && typeof e.description === 'string'))
        .map((e) => keyForExact(typeof e === 'string' ? e : e.description))
    );
    const seenSigs = new Set(
      all
        .filter((e) => typeof e === 'string' || (e && typeof e.description === 'string'))
        .map((e) => signatureOf(typeof e === 'string' ? e : e.description))
    );
    const survivors = [];
    for (const entry of newEntries) {
      const text = typeof entry === 'string' ? entry : entry.description || '';
      if (!text) continue;
      const exactKey = keyForExact(text);
      if (seenStrs.has(exactKey)) {
        droppedExact.push(text.slice(0, 60));
        continue;
      }
      const sig = signatureOf(text);
      if (seenSigs.has(sig)) {
        droppedSig.push(text.slice(0, 60));
        continue;
      }
      seenStrs.add(exactKey);
      seenSigs.add(sig);
      survivors.push(entry);
    }
    newEntries = survivors;

    // Trim if survivors exceed target — apply AFTER dedup so the count
    // reflects unique entries.
    if (all.length + newEntries.length > total) {
      newEntries = newEntries.slice(0, total - all.length);
    }
    const dropMsg = droppedExact.length + droppedSig.length > 0
      ? ` (dedup: -${droppedExact.length} exact, -${droppedSig.length} sig)`
      : '';
    console.log(`  ✓ iter ${iteration}: +${newEntries.length}${dropMsg} (total: ${all.length + newEntries.length}/${total})`);
    all.push(...newEntries);
    // Semantic-ceiling stop — if Sonnet produces 0 new uniques twice in a
    // row, the recipe has exhausted its variety. Stop fighting it (playbook
    // line 432-436).
    if (newEntries.length === 0) {
      consecutiveEmpty++;
      if (consecutiveEmpty >= 2) {
        console.log(`  ⚠ Semantic ceiling reached — ${consecutiveEmpty} consecutive empty iterations, stopping at ${all.length}/${total}`);
        break;
      }
    } else {
      consecutiveEmpty = 0;
    }
  }
  if (all.length < total && iteration >= MAX_ITERATIONS) {
    console.log(`  ⚠ max iterations (${MAX_ITERATIONS}) reached at ${all.length}/${total}`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`\n✅ Saved ${all.length} entries to ${outPath}\n`);
  all.slice(0, 4).forEach((s, i) =>
    console.log(`#${i + 1}: ${typeof s === 'string' ? s.slice(0, 140) : JSON.stringify(s).slice(0, 140)}`)
  );
  console.log(`... (${all.length - 4} more)`);
  return all;
}

module.exports = { generatePool, loadEnv };
