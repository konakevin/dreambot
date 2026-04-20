#!/usr/bin/env node
/**
 * Generate 25 EXTREME EDITORIAL MAKEUP looks for VenusBot cyborg-fashion
 * path. Rolled as its own axis at render time so each render can mix
 * different makeup with different moment/couture. Pat McGrath / Nick
 * Knight / McQueen editorial energy — never everyday glam.
 *
 * Output: scripts/bots/venusbot/seeds/makeups.json
 */

const fs = require('fs');
const path = require('path');

const ENV = (() => {
  const env = {};
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
  for (const l of lines) {
    const eq = l.indexOf('=');
    if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
  }
  return env;
})();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;

const META = `You are writing 25 EXTREME EDITORIAL MAKEUP looks for VenusBot — a cyborg-assassin-woman fashion bot. These looks get rolled per render alongside a separate couture/pose/setting axis. Think Pat McGrath Labs editorials, McQueen runway makeup, Nick Knight photoshoots, extreme magazine spreads. NEVER everyday glam — always bizarre, sculptural, avant-garde.

━━━ RULES ━━━

1. 25 distinct looks. Each 20-35 words.
2. Describe makeup ONLY — face paint, eye treatment, lip treatment, brow treatment, face accessories. Not hair, not jewelry, not couture (those are separate axes).
3. Each look must be EDITORIAL EXTREME — something you'd see in a Vogue cyborg-edition cover shoot, not a sephora counter.
4. VARY the dominant effect — graphic liner, face gems, face paint, metallic leaf, chrome lip, rhinestones, fiber optics, foil, molten-pigment, negative-space brows, etc.
5. Don't lock a specific color — describe the LOOK / TECHNIQUE. Some can name colors (jewel-tone / chrome / oxblood / toxic green) but many should be color-open.
6. Include some that MIRROR her cyborg-ness — fractal circuit-line makeup sweeping across the face, chrome-leaf along her jaw seam, fiber-optic eyelashes, third-eye face-art, etc.

━━━ EXAMPLES OF GOOD MAKEUP ENTRIES ━━━

"Chrome-leaf applied in jagged shards across her cheekbones, graphic black liner carved into sharp geometric wings extending up past her hairline, matte oxblood lip."

"Holographic face paint across the entire forehead and upper eyelids, crystal rhinestone brow, chrome-mirror lip, bleached invisible brows."

"Fractal geometric face-paint mirroring her internal circuit patterns sweeping from temple down across one cheek, jewel-tone smoky eye, glass-finish nude lip."

"Negative-space liner carved out of one eye in a triangle, fiber-optic individual eyelashes glowing faintly, ultra-matte black lip."

━━━ OUTPUT ━━━

Return ONLY a JSON array of 25 strings. No preamble, no numbering.`;

async function callWithRetry(body) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; i <= delays.length; i++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
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

(async () => {
  console.log('🌱 Asking Sonnet for 25 extreme editorial makeups...\n');
  const data = await callWithRetry({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 6000,
    messages: [{ role: 'user', content: META }],
  });
  const raw = (data.content[0]?.text || '').trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error('No JSON array. Raw:\n', raw);
    process.exit(1);
  }
  const seeds = JSON.parse(match[0]);
  const outPath = 'scripts/bots/venusbot/seeds/makeups.json';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(seeds, null, 2));
  console.log(`✅ Saved ${seeds.length} makeups to ${outPath}\n`);
  seeds.slice(0, 6).forEach((s, i) => console.log(`#${i + 1}: ${s}`));
  console.log(`... (${seeds.length - 6} more)`);
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
