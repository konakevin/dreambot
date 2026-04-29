#!/usr/bin/env node
/**
 * gen-scene-clusters.js — Generate scene-cluster sub-spots within a location.
 *
 * Each entry describes a SPECIFIC SPOT a person could be standing/sitting at
 * within a broader location. The goal is to break Sonnet's tendency to fall
 * back to 5-10 default imagery clusters per location category.
 *
 * Usage:
 *   node scripts/gen-scene-clusters.js --location "space station" --count 60
 *   node scripts/gen-scene-clusters.js --location "space station" --count 50 \
 *       --existing-file /tmp/scene-clusters-space-station.json
 */

const fs = require('fs');
const path = require('path');

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
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const args = process.argv.slice(2);
const LOCATION = args.find((_, i, a) => a[i - 1] === '--location');
const COUNT = parseInt(args.find((_, i, a) => a[i - 1] === '--count') ?? '60', 10);
const EXISTING_FILE = args.find((_, i, a) => a[i - 1] === '--existing-file');

if (!LOCATION) {
  console.error('Missing --location flag');
  process.exit(1);
}

const slug = LOCATION.toLowerCase().replace(/[^a-z0-9]+/g, '-');

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Sonnet API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

function buildPrompt(location, count, existing) {
  return `You are generating SCENE-CLUSTER sub-spots for an AI image-generator pool. Each entry is a SPECIFIC SUB-LOCATION or VANTAGE POINT within the broader location: "${location}".

PURPOSE: AI prompt-writers tend to default to 5-10 clichéd imagery patterns when given a generic location ("space station" → lab/cockpit/observation deck). Your job is to generate SPECIFIC, FRESH, VARIED sub-spots that break those defaults. The render character will be standing/sitting/doing something at this exact spot.

ABSOLUTE RULES:
1. Each entry describes a PHYSICAL SPOT within "${location}" — specific architecture, equipment, vantage points, environments
2. NEVER describe a person, character, or pose — these entries describe the SETTING only
3. NEVER describe lighting, mood, or weather — those come from other layers
4. NEVER describe the broader location vaguely — be SPECIFIC about the sub-spot
5. 8-18 words per entry — concise and visual
6. Lowercase, one per line, no quotes, no numbering
7. Each entry must be GENUINELY different from every other — different room/area/feature/prop

VARIETY DIRECTIVES (push hard on all of these):
- Vary the SCALE: tight intimate spots, mid-size rooms, expansive vantage points
- Vary the FUNCTION: work areas, leisure areas, transit areas, storage areas, ceremonial areas, abandoned areas
- Vary the ARCHITECTURE: floors/walls/ceilings/openings/edges/connections
- Vary the PROPS: furniture, equipment, instruments, signage, vegetation, fixtures
- Vary the VIEWPOINT: looking up at, looking down from, looking through, standing inside, standing beside, peeking around

GOOD EXAMPLES (for any location, just to show the energy):
- "the narrow service corridor lined with pressure gauges and conduit bundles"
- "the curved viewing gallery with floor-to-ceiling reinforced windows"
- "the cluttered repair bench with tool diagrams pinned to the back wall"

BANNED:
- Anything describing a person ("man crouches at..." → just "the spot where someone might crouch")
- Anything describing time of day, weather, or mood
- Vague phrases ("a beautiful corner of the location")

${existing.length > 0 ? `DO NOT REPEAT or rephrase any of these existing entries:\n${existing.map(e => `- ${e}`).join('\n')}\n\n` : ''}Generate exactly ${count} NEW scene-cluster entries for "${location}". Each genuinely different from every existing entry — different sub-spot, different prop, different scale, different vantage. Output ONLY the entries, one per line, no bullets, no numbering, no quotes.`;
}

function dedupCheck(newEntries, existing) {
  const issues = [];
  const existingLower = existing.map(e => e.toLowerCase());

  for (let i = 0; i < newEntries.length; i++) {
    const entry = newEntries[i].toLowerCase();

    // similarity vs existing
    for (const ex of existingLower) {
      const wa = new Set(entry.split(/\s+/));
      const wb = new Set(ex.split(/\s+/));
      const overlap = [...wa].filter(w => wb.has(w) && w.length > 3).length;
      const sim = overlap / Math.max(wa.size, wb.size);
      if (sim > 0.55) {
        issues.push({ index: i, reason: `similar to existing: "${ex.slice(0, 60)}"`, sim: (sim*100).toFixed(0)+'%' });
      }
    }
    // similarity within new batch
    for (let j = 0; j < i; j++) {
      const other = newEntries[j].toLowerCase();
      const wa = new Set(entry.split(/\s+/));
      const wb = new Set(other.split(/\s+/));
      const overlap = [...wa].filter(w => wb.has(w) && w.length > 3).length;
      const sim = overlap / Math.max(wa.size, wb.size);
      if (sim > 0.55) {
        issues.push({ index: i, reason: `similar to new #${j+1}`, sim: (sim*100).toFixed(0)+'%' });
      }
    }

    // rule violations
    if (/\b(man|woman|person|character|she |he |they |someone)\b/i.test(entry)) {
      // Tolerate generic pronouns in some constructions but flag direct subjects
      if (/^(a |an |the )?(man|woman|person|character|someone)\b/i.test(entry)) {
        issues.push({ index: i, reason: 'describes a person/character (setting only)' });
      }
    }
    if (/\b(crouches|stands|sits|kneels|leans|reaches|holds)\b/i.test(entry)) {
      issues.push({ index: i, reason: 'describes a pose (setting only)' });
    }
    if (/\b(morning|night|noon|sunset|sunrise|twilight|dusk|dawn|midnight|raining|snowing|stormy|cloudy|sunny|foggy)\b/i.test(entry)) {
      issues.push({ index: i, reason: 'describes time/weather (other layer)' });
    }
    if (/\b(beautiful|stunning|gorgeous|breathtaking|magnificent|peaceful|serene|tranquil|moody|dramatic atmosphere)\b/i.test(entry)) {
      issues.push({ index: i, reason: 'describes mood (other layer)' });
    }

    const wc = entry.split(/\s+/).length;
    if (wc > 25) issues.push({ index: i, reason: `too long (${wc} words)` });
    if (wc < 6) issues.push({ index: i, reason: `too short (${wc} words)` });
  }

  return issues;
}

(async () => {
  let existing = [];
  if (EXISTING_FILE) {
    try {
      const fileData = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
      existing = Array.isArray(fileData) ? fileData : (fileData.entries || []);
      console.log(`📁 Loaded ${existing.length} existing entries from ${EXISTING_FILE}`);
    } catch (e) {
      console.error(`Failed to load --existing-file: ${e.message}`);
      process.exit(1);
    }
  }

  console.log(`\n🎯 Generating ${COUNT} scene clusters for "${LOCATION}"...`);
  console.log(`   Existing pool: ${existing.length} entries`);

  const prompt = buildPrompt(LOCATION, COUNT, existing);
  const raw = await callSonnet(prompt);

  const entries = raw
    .split('\n')
    .map(l => l.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(l => l.length > 6 && !l.startsWith('#') && !l.startsWith('Here'));

  console.log(`\n📋 Sonnet returned ${entries.length} entries`);

  const issues = dedupCheck(entries, existing);
  const issueIdx = new Set(issues.map(i => i.index));
  const cleanEntries = entries.filter((_, i) => !issueIdx.has(i));

  console.log(`✅ ${cleanEntries.length} clean (${entries.length - cleanEntries.length} removed)\n`);

  // Show top rejection reasons
  const reasonCounts = {};
  for (const iss of issues) {
    const key = iss.reason.split(':')[0];
    reasonCounts[key] = (reasonCounts[key] || 0) + 1;
  }
  if (Object.keys(reasonCounts).length > 0) {
    console.log('Rejection reasons:');
    for (const [r, c] of Object.entries(reasonCounts).sort((a,b) => b[1]-a[1])) {
      console.log(`  ${c}× ${r}`);
    }
    console.log();
  }

  const merged = existing.concat(cleanEntries);
  const outFile = `/tmp/scene-clusters-${slug}.json`;
  fs.writeFileSync(outFile, JSON.stringify({ location: LOCATION, total: merged.length, entries: merged }, null, 2));
  console.log(`📁 Saved ${merged.length} total to ${outFile}`);

  console.log(`\n── NEW CLEAN ENTRIES (sample) ──`);
  cleanEntries.slice(0, 20).forEach((e, i) => console.log(`  ${i+1}. ${e}`));
  if (cleanEntries.length > 20) console.log(`  ... +${cleanEntries.length - 20} more`);
})();
