#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_atmospheric_element.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC ELEMENT entries for a MangaBot samurai-era keyframe. Each entry is the AIR-MOTION — what's drifting / falling / swirling through the frame that gives it cinematic motion.

Each entry: 8-16 words. ONE specific atmospheric effect with concrete drift-language.

VARIETY across these motion-types:
- Falling cherry-blossom petals (pink, drifting slowly, dappling everything)
- Drifting snow (light flakes, heavy curtain, swirling wind-driven)
- Mist / fog (low-lying valley mist, rolling cloud-bank, dawn fog)
- Rain streaks (vertical sheet rain, slanting wind-driven downpour)
- Falling autumn leaves (crimson maple, golden ginkgo, swirling under-foot)
- Fireflies (warm pinpoints rising through dusk air)
- Wind-blown banners (clan pennants snapping, paper-talismans fluttering)
- Smoke / incense drift (temple incense column, burning-village smoke distant)
- Floating cherry-blossom petals (in still air, drifting upward magically)
- Wisteria-bloom rain (lavender flowers dropping from arched pergolas)
- Spirit-orbs / hitodama (faint blue-white flame-orbs drifting — Mononoke energy)
- Pollen-motes (golden specks in a sun-shaft through bamboo)
- Sparrows / crows in flight (wing-blur across the frame)
- Lantern-paper ash (rising from a temple ceremony, glowing embers)

DO write:
- Cherry-blossom petals drifting in slow-motion across the frame, dappling shoulders and hat-brim
- Heavy snow falling in vertical curtains, accumulating on stone-lantern caps and shoulders
- Low valley mist pooling between hills, rising slowly past the figure's knees
- Slanting rain streaks pulled by wind, water-beads catching on katana-saya
- Crimson maple leaves swirling around the figure's footfall, lifted by autumn wind

DO NOT write:
- Static descriptions (no motion implied)
- Multiple atmospheric effects per entry — ONE clear motion type
- Modern weather phenomena (acid rain, smog)
- Indoor-only effects (a single candle-flame indoors — needs to be visible across scene)
- Generic "weather" — must be specific to one motion type

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
