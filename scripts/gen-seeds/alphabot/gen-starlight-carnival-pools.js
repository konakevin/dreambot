#!/usr/bin/env node
// AlphaBot — starlight-carnival dream candidate (sandbox, MVP-25 QA).
// Spun from Kevin's steer (2026-08-17): "truly beautiful, awe-inspiring,
// fantastical posts with whimsy... a scene you'd really want to visit." A
// luminous dream-fair/carnival: star-ferris-wheels, carousels, striped midway
// tents, warm lights — a destination you'd want to wander into. NO flying whales.
// SCENE pool (the carnival) + SKY pool (the night/dusk backdrop). MVP-25.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/alphabot/seeds/';

(async () => {
  await generatePool({
    outPath: DIR + 'alphabot_starlight_carnival_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} STARLIGHT-CARNIVAL scenes for a dreamy wildcard art bot. Each is a luminous, whimsical DREAM-FAIR — a fantastical carnival/carousel/midway you'd genuinely want to wander into, glowing warm against a dream-dusk or dream-night. Each entry 20-32 words. The magical fairground is the hero (pure wonder + whimsy, cozy and inviting, never creepy).

━━━ DREAM-FAIRS (spread across all ${n}) ━━━
- a giant ferris wheel of glowing paper-lantern gondolas turning slow against a starry sky, mirrored in a still lake
- a carousel of impossible creatures under a candy-striped canopy strung with fairy-lights, mist curling at its base
- a floating carnival on a cloud-island, midway tents glowing amber over a soft cloud-sea
- a lantern-lit fairground at dusk, a helter-skelter spiralling up into drifting sky-lanterns
- a moonlit boardwalk carnival beside a glassy sea, neon-soft reflections rippling on the water
- a hot-air-balloon fair where the rides hang from tethered balloons over a golden meadow
- a winter carnival under an aurora, a frozen mirror-lake ringed with glowing ride-lights
- a bioluminescent night-market carnival in a forest clearing, glowworm-lit tents among giant toadstools
- a starlit big-top circus tent glowing from within on a hilltop above a sleeping valley
- a canal carnival of little lantern-boats and floating game-stalls between old dream-bridges
- a cliffside fair overlooking a sea of clouds, a Ferris wheel half-wreathed in sunset mist
- a candy-colored fairground where the rides are shaped like blossoms and teacups under paper moons

━━━ THE LOOK (anchor to the saved renders) ━━━
Luminous painterly dream-illustration, Ghibli-dreamy wonder, warm glowing carnival-light against a deeper dream-sky, deep atmospheric depth, often a still water mirror below. Real depth (foreground ride/tent close and warm, midway receding into soft haze). Awe + cozy whimsy, a place you long to visit. NO flying whales or flying sea-creatures. NO readable text, NO people as the subject (tiny distant figures at most).

━━━ RULES ━━━
NO brand/real names, NO readable text. Each entry a distinct dream-fair + a specific glowing detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_starlight_carnival_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SKY-LIGHT snippets for the starlight-carnival path — the dusk/night sky over a luminous dream-fair. Each 8-16 words. A single sky/light element.

Spread across: a deep indigo twilight with first stars; a molten-gold sunset fading to rose; a giant low harvest moon haloed in mist; soft green-violet aurora ribbons; a milky-way band arcing overhead; a warm amber cloud-sea glowing below; drifting sky-lanterns among the stars; a scatter of falling stars; a violet dusk with a single bright wishing-star; pale pink dawn on still water; a full moon mirrored in a glassy lake; slow-drifting fireflies rising into the night.

Dreamy, luminous, soft (never harsh). NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
