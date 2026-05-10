#!/usr/bin/env node
/**
 * One-off test: generate 5 top-tier iconic OUTDOOR LANDSCAPE anchors
 * for a given location via strict Sonnet meta-prompt. Prints to stdout.
 *
 * Goal: prove the meta-prompt produces postcard-worthy iconic spots,
 * NOT encyclopedic / niche / hallucinated entries.
 *
 * Usage: node scripts/gen-iconic-spots-test.js --location hawaii
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
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const LOCATION = flag('location', 'hawaii');

function metaPrompt(loc) {
  return `Generate the 5 most ICONIC, POSTCARD-WORTHY OUTDOOR LANDSCAPE PILLARS for "${loc}".

These are PURE LOCATION PILLARS — fixed reference points. Variation (time of day, weather, camera angle, atmospheric phenomena) is added separately at render time. Your job: name the IDENTITY OF THE PLACE only.

━━━ HARD BANS ON SEED CONTENT ━━━
- NO TIME OF DAY in the seed (no "at sunrise", "at dawn", "at golden hour", "at blue hour", "midnight sun" — those are axes added at render time, NEVER in the pillar)
- NO WEATHER (no "stormy", "misty", "snowy", "with rain", "in fog" — axes only)
- NO LIGHT/COLOR DESCRIPTIONS (no "with godrays", "glowing", "amber-lit", "cool blue tones" — axes only)
- NO INTERIORS (no chapels, churches, monasteries, factories, mills, bunkers, forges, kitchens, workshops, ranches, museums, restaurants)
- NO INDUSTRIAL/HISTORICAL SITES (no plantations, processing equipment, ranching, mining, military)
- NO HALLUCINATIONS (only real iconic features actually associated with ${loc} — e.g., for Hawaii do NOT include monasteries or traditional metalworking; those don't exist there)
- NO NICHE/OBSCURE SPOTS (no fish auctions, radio towers, abandoned resorts)
- NO PEOPLE

━━━ REQUIRED ━━━
Each pillar must be:
- 4-10 words long (a NAMED location anchor, NOT a paragraph)
- An OUTDOOR NATURAL LANDSCAPE identity (geography, geology, flora, water, sky-when-it-IS-the-feature like aurora-zones)
- Specifically named when iconic (e.g., "Nā Pali Coast emerald cliffs and Pacific surf" — NOT "tropical cliffs and ocean")
- A pillar a postcard would put on the FRONT — the most identity-defining views
- Variety across the 5 — at least 4 different geographic features (cliffs / volcano / canyon / beach / waterfall / etc.)

━━━ EXAMPLE — what GREAT looks like for "iceland" ━━━
Vatnajökull glacier ice caves and crevasses
Reynisfjara black sand beach with basalt sea stacks
Þingvellir rift with mossy lava walls
Geysir geothermal steam plumes
Skógafoss waterfall with mossy basalt cliffs

(Notice: NO time-of-day, NO weather, NO light language. Each is just the IDENTITY of the place.)

━━━ EXAMPLE — what BAD looks like (would all be REJECTED) ━━━
- "Nā Pali Coast cliffs at sunrise" (time-of-day baked in — axis violation)
- "Waikīkī Beach with golden sunset glow" (light + time baked in)
- "Aurora borealis over Þingvellir" (light phenomenon baked in — that's an axis)
- "the abandoned sugar plantation mill" (industrial, niche)
- "the secluded monastery garden" (interior, hallucinated)

━━━ OUTPUT ━━━
Return EXACTLY 5 entries, one per line, no numbering, no commentary. Just the 5 pillar strings.`;
}

(async () => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      messages: [{ role: 'user', content: metaPrompt(LOCATION) }],
    }),
  });
  if (!res.ok) {
    console.error('Sonnet error:', res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  const text = (data.content?.[0]?.text || '').trim();
  console.log(`\n━━━ 5 iconic OUTDOOR LANDSCAPE anchors for "${LOCATION}" ━━━\n`);
  console.log(text);
  console.log('\n━━━ end ━━━\n');
})();
