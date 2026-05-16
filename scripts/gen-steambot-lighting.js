#!/usr/bin/env node
/**
 * Regenerator for STEAMBOT lighting.json — fixes the warm-bronze bias that
 * was causing every render to come out hazy/amber. Strict distribution
 * mandate spanning warm + cool + dramatic + vivid color registers.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const OUT = path.resolve(__dirname, 'bots/steambot/seeds/lighting.json');
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 4)
    .join('|');
}

const RECIPE = `Generate LIGHTING descriptions for a steampunk scene. Each is ONE comma-separated line, 20-30 words, describing how a scene is lit — the color temperature, the source, the dramatic quality.

The existing pool is WAY too warm-bronze-amber-skewed (81% warm). This regeneration must FIX that by spanning a wide variety of color registers.

STRICT DISTRIBUTION MANDATE — distribute across batch:
- ~30% WARM (legacy register kept for gas-lit interiors): gaslight amber pools / brass forge-glow / honey lamplight / ember firelight / candlelit warmth
- ~20% COOL (cool electric / moonlit / silver / aurora): moonlit silver / starlit cobalt / aurora green-violet / electric-blue Tesla arc / ice-pale dawn
- ~15% VIVID JEWEL-TONE (saturated color): emerald-glass-lantern green / magenta gas-discharge / rose-quartz dawn / sapphire-stained-glass blue / amethyst dusk
- ~15% DRAMATIC HIGH-CONTRAST: single hero-spotlight chiaroscuro / lightning-arc flash freezing the scene / strobe-cycling beacon / Rembrandt-style window-shaft / silhouette-edge backlight
- ~10% TWILIGHT / DUSK GRADIENT: copper-and-rose sunset / blue-hour gradient / purple-to-amber horizon transition / golden-hour rim-light
- ~10% NEUTRAL / FOG-DIFFUSED: overcast soft-light / fog-diffused pearl glow / pre-dawn grey / smoke-filtered diffuse

Each entry has:
- The light SOURCE (gas-lamp / Tesla coil / aurora / moonlight / lightning / sun-shaft / etc.)
- The COLOR temperature/hue (specific named color, not generic)
- The QUALITY of light (diffused / sharp-edged / pooling / flickering / blazing / streaming / etc.)
- An effect on the SCENE (illuminates X / catches Y / casts Z shadow / etc.)

GOOD examples (each demonstrates a distinct register):
- WARM: Warm amber gaslight pooling beneath wrought-iron sconces, brass fittings glowing copper, deep shadow gathering in the corners
- COOL: Cold silver moonlight streaming through arched windows, casting blue-edged shadows across brass machinery, frost-pale on every surface
- VIVID: Emerald-glass apothecary lantern casting jade-green light pools, brass instruments catching jewel-tone reflections, deep teal shadows
- DRAMATIC: Single overhead spotlight isolating the central figure in hot white light, vast surrounding darkness pressing in, chiaroscuro Rembrandt-style
- TWILIGHT: Blue-hour dusk gradient across the sky, copper-and-rose painting the western horizon, gaslamps just beginning to amber-pool below
- NEUTRAL: Overcast pearl-grey daylight diffused through fog, soft shadowless illumination flattening surfaces, atmospheric depth in the haze
- COOL: Aurora borealis ribbon shimmering green-violet across the sky, casting eerie color-shifting light across rooftops and dirigible hulls
- VIVID: Magenta gas-discharge from a Tesla coil sending pink-violet pulses across the workshop, brass surfaces reflecting electric-rose
- DRAMATIC: Lightning-arc flash freezing the scene for one instant in white-and-blue brilliance, every detail razor-edged

ABSOLUTE BANS:
- NEVER allow more than 35% warm-amber-bronze entries in a batch — force the cool/vivid/dramatic majority
- NEVER generate generic "warm light" — every entry must be SPECIFIC
- NO modern light sources (no LED, no neon-tubes — neon-glass-tubes are OK as gas-discharge tubes)

Output: ONE lighting per line. No numbering. No quotes.`;

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} lighting entries with strict distribution variety NOW.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`appending: existing ${existing.length} — target ${TARGET}`);
    while (existing.length < TARGET) {
      const need = Math.min(BATCH, TARGET - existing.length);
      const batch = await generateBatch(Math.ceil(need * 1.3));
      const fresh = batch.filter((b) => !sigs.has(signatureOf(b)));
      for (const f of fresh) {
        if (existing.length >= TARGET) break;
        existing.push(f);
        sigs.add(signatureOf(f));
      }
      fs.writeFileSync(OUT, JSON.stringify(existing, null, 2));
      console.log(`  ${existing.length}/${TARGET}`);
    }
    return;
  }
  // REPLACE mode — overwrites existing
  const batch = await generateBatch(COUNT);
  const sigs = new Set();
  const deduped = batch.filter((b) => {
    const sig = signatureOf(b);
    if (sigs.has(sig)) return false;
    sigs.add(sig);
    return true;
  });
  fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2));
  console.log(`Wrote ${deduped.length} entries to ${OUT}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
