#!/usr/bin/env node
/**
 * gen-universal-axis.js — Generate one of three universal entropy axes:
 *   - scene-angle   : compositional framing approaches (universal, scene-neutral)
 *   - mood-twist    : atmospheric/temporal modifiers (weather, time-of-day, light)
 *   - narrator-hint : perspective/storytelling angles (candid moment, beat after X)
 *
 * Each is a 200-entry deduped pool. Picked randomly per render and injected
 * alongside the scene cluster + medium + vibe to break Sonnet's clustering.
 *
 * Usage:
 *   node scripts/gen-universal-axis.js --axis scene-angle --count 80
 *   node scripts/gen-universal-axis.js --axis mood-twist --count 80 \
 *       --existing-file /tmp/universal-mood-twist.json
 */

const fs = require('fs');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || envFile.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const args = process.argv.slice(2);
const AXIS = args.find((_, i, a) => a[i - 1] === '--axis');
const COUNT = parseInt(args.find((_, i, a) => a[i - 1] === '--count') ?? '80', 10);
const EXISTING_FILE = args.find((_, i, a) => a[i - 1] === '--existing-file');

const VALID = ['scene-angle', 'mood-twist', 'narrator-hint'];
if (!AXIS || !VALID.includes(AXIS)) {
  console.error(`--axis must be one of: ${VALID.join(', ')}`);
  process.exit(1);
}

const SPECS = {
  'scene-angle': {
    purpose: 'COMPOSITIONAL FRAMING — how the scene is composed/framed for the camera',
    energy: 'cinematographic, camera-aware, compositional',
    rules: [
      'Each entry describes a SPECIFIC compositional framing approach (foreground, midground, depth, vantage, framing device)',
      'Scene-neutral — must work in any location (don\'t reference specific places)',
      'NO time of day, NO weather, NO mood — those are other layers',
      'NO eye-direction language ("looking at", "gazing at")',
      'NO posing/character description — this is about the FRAME, not the subject',
      '8-18 words per entry',
    ],
    examples: [
      'framed by an arching foreground element with the subject in midground',
      'shot from a low angle with sky filling the upper third of the frame',
      'subject offset to the right thirds with leading lines pulling toward them',
      'tight close composition with shallow depth of field blurring the background',
      'wide environmental composition with subject occupying lower fifth of frame',
      'overhead angle with subject centered against a textured surface below',
      'through a doorway or archway with the scene framed by darker borders',
      'reflected in a puddle or polished surface in the foreground',
      'silhouetted against a brighter background plane with rim lighting',
      'dutch angle tilted slightly off-vertical for a sense of unease',
      'extreme depth with foreground macro-detail and infinite background',
      'symmetrical center composition with elements balanced on both sides',
      'foreground vegetation creating a frame within the frame',
      'high vantage looking down with diagonal lines pulling through frame',
      'subject seen through translucent material adding visual texture',
    ],
    bans: [
      /\b(morning|sunset|night|dawn|dusk|twilight|midnight|noon)\b/i,
      /\b(stormy|sunny|cloudy|rainy|snowy|foggy|misty)\b/i,
      /\b(beautiful|stunning|gorgeous|moody|dramatic mood|peaceful)\b/i,
    ],
  },
  'mood-twist': {
    purpose: 'ATMOSPHERIC TWIST — a specific weather/light/time/seasonal beat to push the atmosphere',
    energy: 'sensory, atmospheric, evocative',
    rules: [
      'Each entry describes a SPECIFIC atmospheric beat — a moment of weather, light, time-of-day, season, or sensory atmosphere',
      'Universal — works in any location',
      'NO compositional framing — that\'s scene-angle',
      'NO subject/character description — this is the AIR around them',
      'Concrete and specific — "moments before a storm" not "stormy mood"',
      '5-15 words per entry',
    ],
    examples: [
      'moments before a storm breaks with electricity in the air',
      'morning haze burning off as light cuts through the mist',
      'blue hour fade with the last warmth bleeding from the sky',
      'after-rain reflections everywhere, surfaces glistening',
      'first snow of the season with quiet crunch underfoot',
      'low golden sun raking sideways across every surface',
      'midday heat shimmer warping the horizon line',
      'pollen-thick spring air catching slanted light',
      'overcast diffused light with no harsh shadows',
      'foggy dawn with shapes emerging through the soft white',
      'autumn afternoon with leaves drifting down through still air',
      'late summer dusk with cicadas thick in the heat',
      'crisp windless dawn with breath visible in the cold',
      'rain just stopped, water still beading on every leaf',
      'magic hour glow with everything dipped in amber',
    ],
    bans: [
      /\b(framed|composition|angle|vantage|foreground|midground|background|wide shot|close.?up)\b/i,
      /\b(person|character|subject|man|woman)\b/i,
    ],
  },
  'narrator-hint': {
    purpose: 'STORYTELLING BEAT — what kind of moment this is, the perspective on the scene',
    energy: 'narrative, observational, "the story behind the photo"',
    rules: [
      'Each entry hints at WHAT KIND OF MOMENT this is — a beat, a pause, a between-thing',
      'Universal — works in any location/scene',
      'NO compositional framing, NO weather, NO subject pose',
      'These are PROMPTS for storytelling angle: "the second after X", "during a quiet pause", "in a moment of recognition"',
      'Should make the prompt-writer think about EMOTIONAL/NARRATIVE context',
      '5-15 words per entry',
    ],
    examples: [
      'the second after something delightful happened',
      'a quiet pause between two louder things',
      'caught mid-thought before deciding what to do',
      'a small moment that won\'t make it into any story',
      'the threshold instant between waiting and going',
      'a private joke nobody else would understand',
      'the breath before the first step',
      'a memory surfacing unbidden',
      'an in-between beat that nobody planned for',
      'the moment of noticing something for the first time',
      'a deliberate stillness in a busy place',
      'a pause to let the body catch up with the mind',
      'the soft beat after a long laugh',
      'recognition dawning slowly',
      'the calm before the day really begins',
    ],
    bans: [
      /\b(framed|composition|angle|vantage|foreground|midground|wide shot)\b/i,
      /\b(stormy|sunny|rainy|foggy|night|morning|sunset|dawn|dusk)\b/i,
      /\b(person|character|subject|man|woman|she|he)\b/i,
    ],
  },
};

const spec = SPECS[AXIS];

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 8192, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error(`Sonnet API error: ${res.status}`);
  return (await res.json()).content[0].text;
}

function buildPrompt(count, existing) {
  return `You are generating entries for a SCENE-RANDOMIZATION POOL for an AI image generator. Pool axis: **${AXIS.toUpperCase()}**.

PURPOSE: ${spec.purpose}.

ENERGY: ${spec.energy}.

ABSOLUTE RULES:
${spec.rules.map((r,i) => `${i+1}. ${r}`).join('\n')}

GOOD EXAMPLES — match this energy and format:
${spec.examples.map(e => `- ${e}`).join('\n')}

${existing.length > 0 ? `DO NOT REPEAT or rephrase any of these existing entries:\n${existing.slice(0, 100).map(e => `- ${e}`).join('\n')}${existing.length > 100 ? `\n... +${existing.length - 100} more` : ''}\n\n` : ''}Generate exactly ${count} NEW entries. Each genuinely different from every existing entry. Output ONLY the entries, one per line, lowercase, no bullets, no numbering, no quotes.`;
}

function dedupCheck(newEntries, existing) {
  const issues = [];
  const exLower = existing.map(e => e.toLowerCase());

  for (let i = 0; i < newEntries.length; i++) {
    const entry = newEntries[i].toLowerCase();

    for (const ex of exLower) {
      const wa = new Set(entry.split(/\s+/));
      const wb = new Set(ex.split(/\s+/));
      const ov = [...wa].filter(w => wb.has(w) && w.length > 3).length;
      const sim = ov / Math.max(wa.size, wb.size);
      if (sim > 0.55) issues.push({ index: i, reason: 'dup-existing' });
    }
    for (let j = 0; j < i; j++) {
      const other = newEntries[j].toLowerCase();
      const wa = new Set(entry.split(/\s+/));
      const wb = new Set(other.split(/\s+/));
      const ov = [...wa].filter(w => wb.has(w) && w.length > 3).length;
      const sim = ov / Math.max(wa.size, wb.size);
      if (sim > 0.55) issues.push({ index: i, reason: 'dup-batch' });
    }

    for (const banRe of spec.bans) {
      if (banRe.test(entry)) issues.push({ index: i, reason: `ban-pattern: ${banRe.source.slice(0, 30)}` });
    }

    const wc = entry.split(/\s+/).length;
    if (wc > 22) issues.push({ index: i, reason: `too-long ${wc}w` });
    if (wc < 4) issues.push({ index: i, reason: `too-short ${wc}w` });
  }

  return issues;
}

(async () => {
  let existing = [];
  if (EXISTING_FILE) {
    try {
      const fileData = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
      existing = Array.isArray(fileData) ? fileData : (fileData.entries || []);
      console.log(`📁 Loaded ${existing.length} existing from ${EXISTING_FILE}`);
    } catch (e) {
      console.error(`Failed to load --existing-file: ${e.message}`);
      process.exit(1);
    }
  }

  console.log(`\n🎯 [${AXIS}] generating ${COUNT}, existing pool: ${existing.length}`);

  const raw = await callSonnet(buildPrompt(COUNT, existing));
  const entries = raw.split('\n').map(l => l.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(l => l.length > 4 && !l.startsWith('#') && !l.startsWith('Here'));

  console.log(`📋 Sonnet returned ${entries.length}`);
  const issues = dedupCheck(entries, existing);
  const issueIdx = new Set(issues.map(i => i.index));
  const cleanEntries = entries.filter((_, i) => !issueIdx.has(i));
  console.log(`✅ ${cleanEntries.length} clean (${entries.length - cleanEntries.length} removed)`);

  const reasonCounts = {};
  for (const iss of issues) {
    reasonCounts[iss.reason] = (reasonCounts[iss.reason] || 0) + 1;
  }
  for (const [r, c] of Object.entries(reasonCounts).sort((a,b)=>b[1]-a[1])) console.log(`  ${c}× ${r}`);

  const merged = existing.concat(cleanEntries);
  const outFile = `/tmp/universal-${AXIS}.json`;
  fs.writeFileSync(outFile, JSON.stringify({ axis: AXIS, total: merged.length, entries: merged }, null, 2));
  console.log(`\n📁 Saved ${merged.length} total to ${outFile}`);

  console.log(`\n── NEW SAMPLE ──`);
  cleanEntries.slice(0, 15).forEach((e, i) => console.log(`  ${i+1}. ${e}`));
})();
