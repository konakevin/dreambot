#!/usr/bin/env node
/**
 * gen-scene-activities.js — Generate ACTIVITY-anchored scene entries for a
 * location. Companion to gen-scene-clusters.js (which is spot-only).
 *
 * These entries describe a SIGNATURE ACTIVITY at the location — what people
 * actually go there to DO. Examples for Hawaii: "tandem jetskis racing
 * across a turquoise lagoon", "snorkeling above a coral reef at low tide".
 *
 * Combined with spot-only clusters in the same pool, they give Sonnet a
 * richer scene library: half passive backdrops, half active scenarios.
 *
 * Usage:
 *   node scripts/gen-scene-activities.js --location "hawaii" --count 30
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
const COUNT = parseInt(args.find((_, i, a) => a[i - 1] === '--count') ?? '30', 10);

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

function buildPrompt(location, count) {
  return `You are generating ACTIVITY-ANCHORED scene entries for an AI image-generator pool. Each entry describes a SIGNATURE ACTIVITY at "${location}" — what two people actually go there to DO together. These get used in a face-swap pipeline where the system needs CLEAN face geometry on both characters (no profile, no overlap, no back-turned).

PURPOSE: Give Sonnet cohesive scene+activity moments. The render places two characters into the scenario. Both faces must be visible to camera so the face-swap can land cleanly.

ABSOLUTE RULES — every entry must satisfy ALL of these:
1. Activity is a SIGNATURE thing at "${location}" — iconic tourist OR local insider OR adventure OR contemplative
2. Both characters are positioned with CLEAR LEFT/RIGHT or FOREGROUND/BACKGROUND separation — NEVER overlapping, NEVER face-to-face kissing/talking, NEVER piggybacked
3. Both characters' FACES are toward the camera or three-quarter view — NOT in pure side profile, NOT back-turned, NOT looking down at the ground/objects in a way that hides their face
4. NEVER describe characters by gender/age/appearance — keep neutral
5. NEVER describe time of day, weather, mood, or photo style — those come from other layers
6. 10-20 words per entry — concise but specific
7. Lowercase, one per line, no quotes, no numbering

EXEMPLAR ENERGY (this is the FEEL we want — candid vacation-photo activities with clean face-swap geometry):
- "walking side-by-side down a street, both looking ahead"
- "standing side-by-side at a scenic overlook, hands on railing"
- "sitting side-by-side on a bench, relaxed posture"
- "standing side-by-side reading a map together held between them"
- "standing side-by-side checking a phone for directions"
- "walking side-by-side through a market street"
- "standing side-by-side holding drinks at an outdoor café"
- "sitting side-by-side at a café table with coffee cups"
- "standing side-by-side with backpacks, travel vibe"
- "standing side-by-side in front of a famous sign, smiling"
- "walking side-by-side on a beach shoreline, waves behind"
- "sitting side-by-side on a dock, feet near the water"
- "standing side-by-side holding surfboards upright, one each"
- "standing side-by-side in hiking gear, trail behind them"
- "standing side-by-side at a waterfall viewpoint, mist in air"
- "standing side-by-side on a bridge, hands resting on railing"
- "sitting side-by-side at a campfire, warm glow on faces"

Note these all preserve: TWO CLEAR FACES, DISTINCT SIDES, MINIMAL OVERLAP — perfect for face-swap.

VARIETY DIRECTIVES — cover the full range of WHY people go to "${location}":
- Iconic tourist activities (the obvious ones — embrace them)
- Local insider activities (off the beaten path)
- Active/outdoor (sports, recreation, adventure)
- Passive/contemplative (relaxing, observing, dining)
- Social/cultural (markets, festivals, celebrations)

BANNED:
- Both characters facing each other (produces profiles)
- Either character back-turned or in pure side profile
- Either character with face hidden by activity (e.g., free-diving down, looking through binoculars)
- Generic locations not specific to "${location}"
- Time/weather/mood adjectives

Generate exactly ${count} activity entries for "${location}". Each entry must be a signature ${location} activity (use the exemplar energy above), with two people positioned for clean face-swap geometry. Each genuinely different. Output ONLY the entries, one per line, no bullets, no numbering, no quotes.`;
}

(async () => {
  console.log(`\n🎯 Generating ${COUNT} activity entries for "${LOCATION}"...`);
  const prompt = buildPrompt(LOCATION, COUNT);
  const raw = await callSonnet(prompt);
  const entries = raw
    .split('\n')
    .map((l) => l.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter((l) => l.length > 6 && !l.startsWith('#') && !l.startsWith('Here'));
  console.log(`📋 Returned ${entries.length} entries`);

  const outFile = `/tmp/scene-activities-${slug}.json`;
  fs.writeFileSync(
    outFile,
    JSON.stringify({ location: LOCATION, total: entries.length, entries }, null, 2)
  );
  console.log(`📁 Saved to ${outFile}`);

  console.log('\n── SAMPLE ──');
  entries.slice(0, 10).forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
})();
