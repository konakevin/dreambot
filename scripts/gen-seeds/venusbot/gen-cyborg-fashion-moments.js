#!/usr/bin/env node
/**
 * Generate 30 CYBORG FASHION scene seeds for the venusbot_cyborg_fashion path.
 *
 * High-fashion editorial shots of the VenusBot cyborg — Vogue spread energy,
 * sculptural couture, fusion of silicon/metal/plastics/acrylics/fiber-optic
 * materials. Pure fashion moment. NOT combat, NOT lure, NOT plotting — she
 * is the subject of a fashion editorial. Her cyborg body is integrated with
 * the couture in striking, avant-garde ways.
 *
 * Output: scripts/bots/venusbot/seeds/cyborg_fashion_moments.json
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

const META = `You are writing 30 CYBORG FASHION scene seeds for VenusBot's cyborg_fashion render path.

━━━ WHO SHE IS (for context) ━━━

She is a cyborg-assassin being — part human or alien, machine to her core. Her body is dominantly mechanical: chrome/titanium/composite limbs, translucent acrylic torso panels revealing internal gear clusters and pulsing power core, segmented chrome neck with visible actuators. Only her face stays organic.

━━━ THE PATH (what's different here) ━━━

Take the cold-bitch cyborg killer and BLOW HER UP in an extreme avant-garde editorial spread. Think McQueen Plato's Atlantis, Galliano-Dior circus haute couture, Schiaparelli surrealist looks, Pat McGrath Labs extreme makeup editorials, Mugler robotic couture, Rick Owens gothic futurism, Iris van Herpen fractal gowns, 90s-era Richard Avedon studio portraits + Nick Knight + Steven Klein. NOTHING is off limits. The more bizarre, crazy, sculptural, dramatic, over-the-top — the better.

SHE IS STILL the cold mean mysterious bitch cyborg — just now ALL GLAMMED UP: extreme makeup, extreme couture, extreme pose. Her eyes still burn, her machine body still shows, her uncanny stillness still unsettles — but now she's the subject of a fashion spread.

NOT combat, NOT seduction, NOT plotting. NOT a tactical vest, weapon, or candlelit noir booth. This is PURE EDITORIAL FASHION FANTASY.

━━━ EXTREME MAKEUP (required element in most seeds) ━━━

Each seed should feature striking face makeup — one or more of: graphic liner going up into her hairline, jewel-tone smoky eyes with crystal accents, mirror-gold leaf across cheekbones, holographic highlights, chrome lip, matte oxblood lip with cyborg-black gloss, fractal face-paint patterns mirroring her circuit lines, mono-color face paint (ice-blue / toxic green / fuchsia), rhinestone brow, decorative tear drops, face gems, fractal geometric make-up sweeping across one side of her face, fiber-optic eyelashes, third-eye face-art on forehead, exaggerated lash extensions, bleached or shaved brows, etc. Makeup should be EDITORIAL and EXTREME — not everyday glam.

━━━ WHAT EACH SEED SHOULD SHOW ━━━

- Pose: editorial / extreme (strong silhouette, dramatic stance, runway walk, pedestal pose, reclining on studio floor, head-turn, hands-to-face, dramatic shoulder angle, arched back, crouch, mid-twist, over-the-shoulder, chin-to-knee, etc.)
- Couture: specific extreme avant-garde cyborg garment — sculptural acrylic shoulder spikes, a gown made of fiber-optic cables, a mirror-chrome bustier with integrated obsidian panels, a translucent silicone cape trailing circuit-glow, a latex-and-brass couture piece, a headpiece of chrome and pearls, a collar of spinning polished rings, a mask-integrated gown, a foam-sculpted shoulder extension, a trailing fiber-optic veil, a corset of living hydrogel, a spiked brass breastplate, a hooped crinoline of electroluminescent wire, etc. VARY materials wildly — never chrome-only.
- Makeup: specific extreme editorial makeup look (see above).
- Setting: editorial photoshoot contexts — seamless studio backdrop (colored paper), mirror-room, marble gallery, gilded salon, neon-dark void, industrial concrete loft, cherry-blossom petal storm, wet glass rain studio, mirrored water plinth, desert dune at golden hour, abandoned ballroom with chandeliers, brutalist concrete staircase, pink-lit smoke chamber, atrium of hanging chrome mobiles, a sea of black rose petals, a tank of slow-spinning mirror shards, etc.
- Energy: fashion editorial with menace — camera-aware but aloof, iconic, mean, mysterious. Not seductive, not combatant. She is The Subject. You can't look away.

━━━ RULES ━━━

1. 30 seeds. Each 40-70 words.
2. Specify the SETTING (seamless studio / mirror room / gallery / etc.), the POSE, and the COUTURE PIECE / material combination.
3. Vary materials wildly across the 30 — don't lean on chrome. Include: silicon, fiber-optic cable, acrylic, polymer, ceramic, glass, latex, smart-glass, holographic mesh, iridescent scales, bioluminescent gel, pearl, obsidian, copper, brass, carbon fiber, mother-of-pearl, etc.
4. Never specify skin tone or glow color — those are axes rolled at render time.
5. Never add combat, weapons, tactical, seduction, plotting, or lure language.
6. Each seed should feel like a single frame from a Vogue cyborg spread.
7. Variety: do not repeat setting/pose/couture combos. Every seed distinct.

━━━ OUTPUT ━━━

Return ONLY a JSON array of 30 strings, each 40-70 words. No preamble, no numbering.`;

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
  console.log('🌱 Asking Sonnet for 30 cyborg-fashion moments...\n');
  const data = await callWithRetry({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8000,
    messages: [{ role: 'user', content: META }],
  });
  const raw = (data.content[0]?.text || '').trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error('No JSON array. Raw:\n', raw);
    process.exit(1);
  }
  const seeds = JSON.parse(match[0]);
  const outPath = 'scripts/bots/venusbot/seeds/cyborg_fashion_moments.json';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(seeds, null, 2));
  console.log(`✅ Saved ${seeds.length} cyborg-fashion moments to ${outPath}\n`);
  seeds.slice(0, 5).forEach((s, i) => console.log(`#${i + 1}: ${s.slice(0, 180)}${s.length > 180 ? '...' : ''}`));
  console.log(`... (${seeds.length - 5} more)`);
})().catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
