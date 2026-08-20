#!/usr/bin/env node
// AlphaBot — DreamBot Stage C candidate paths (sandbox, MVP-25 QA).
// 4 wildcard cosmic/surreal SCENE-as-hero dream paths: pocket-planets,
// dream-express, cloud-harbor, dreamscape-nocturne. Each = a SCENE pool (the
// dream-world/subject) + a SKY pool (the cosmic/dream backdrop accent). No
// character — the WORLD is the hero. MVP-25 each; scale only after Kevin signs off.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/alphabot/seeds/';

(async () => {
  // ── pocket-planets ────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'alphabot_pocket_planets_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} POCKET-PLANETS scenes for a dreamy wildcard art bot. Each is ONE tiny, self-contained jewel-like PLANET or little moon floating in space — a whole miniature WORLD curved onto a small sphere, seen close so its little landscape wraps around the horizon (Little Prince / storybook-cosmos register). Each entry 20-32 words. The tiny planet + its surface world is the hero.

━━━ PLANET WORLDS (spread across all ${n}) ━━━
- a ringed ocean-planet, one lighthouse island, tiny sailboats circling the little sea
- a forest planet, a spiral of pine trees and a single cabin with a smoking chimney
- a crystal planet of glowing geodes and amethyst spires catching starlight
- a candy planet, gumdrop hills and a swirl of frosting-clouds around it
- a city-lights planet, a tiny glowing metropolis wrapped around the sphere at night
- a volcanic planet with one small caldera glowing, lava rivers threading the curve
- a snow-globe planet, a village under falling snow beneath a glass-clear dome of air
- a mushroom planet, giant toadstools and bioluminescent spores drifting off its edge
- a desert planet, one lonely pyramid and a caravan curving over dunes
- a waterfall planet, rivers pouring off the tiny sphere's edge into glittering space-mist
- a cherry-blossom planet, a single pagoda and pink petals streaming into orbit
- a lantern planet, floating paper lanterns and a winding festival path around it

━━━ THE LOOK ━━━
Dreamy, luminous, storybook-cosmic. The little planet is CENTERED and whole (you can see its curvature and the far side falling away), tiny detailed world on its surface, wrapped in a soft glow. Awe + charm. NO people as the subject (tiny distant figures at most).

━━━ RULES ━━━
NO readable text. NO real-world/brand names. Each entry a distinct planet-world + a specific charming detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_pocket_planets_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} COSMIC-BACKDROP snippets for the pocket-planets dream path — the space + sky AROUND a tiny floating planet. Each 8-16 words. A single atmospheric backdrop element.

Spread across: a soft nebula of rose-and-gold cloud; a field of big gentle stars; a distant ringed gas-giant looming; a scatter of smaller sibling planets; a milky-way band arcing behind; twin pastel moons; drifting comet-tails; a warm sunrise glow at the sphere's edge; aurora-ribbons in the void; floating stardust motes; a giant low harvest-moon; a deep indigo starfield with a single bright wishing-star.

Dreamy, luminous, soft (never harsh sci-fi). NO text. NO real star/planet names.

JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── dream-express ─────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'alphabot_dream_express_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} DREAM-EXPRESS scenes for a dreamy wildcard art bot. Each is a surreal, beautiful DREAM-TRAIN — a glowing storybook locomotive + carriages — gliding through an impossible dreamscape (Spirited-Away / Polar-Express / dreamlogic register). Each entry 20-32 words. The train mid-journey through a wondrous place is the hero.

━━━ DREAM ROUTES (spread across all ${n}) ━━━
- a golden train gliding over a mirror-calm sea at sunset, its reflection running beneath it
- a train crossing a viaduct through a sea of clouds, carriages above a pink cloud-ocean
- a train winding along a track of starlight through a deep-blue starfield
- a train threading a candy-colored canyon, cotton-candy cliffs and lollipop trees
- a train climbing a rainbow arc over a patchwork dreamland far below
- a train through an autumn forest of impossibly huge glowing maple trees
- a train skimming a lavender field under a giant low moon, fireflies streaming past windows
- a train through a floating archipelago of sky-islands linked by waterfalls
- a train gliding across a frozen aurora-lit lake, ice mirroring the green sky
- a train through a tunnel of blossoming cherry trees raining petals on the carriages
- a night train past a glowing dream-city of spires reflected in a black river
- a train crossing a bridge of moonlight over a bioluminescent valley

━━━ THE LOOK ━━━
Dreamy, cinematic, luminous, warm-windowed. The train is the clear hero mid-motion (steam/light trailing), the dreamscape sweeping around it with real depth. Wonder + gentle magic. NO readable text on the train.

━━━ RULES ━━━
NO real train/brand names, NO readable text. Each entry a distinct dream-route + a specific magical detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_dream_express_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} DREAM-SKY snippets for the dream-express path — the sky/atmosphere the dream-train travels under. Each 8-16 words. A single sky/light element.

Spread across: a molten-gold sunset sky; a star-swirled twilight; a giant low moon haloed in mist; aurora ribbons overhead; a sky of drifting paper lanterns; soft pink dawn breaking; a sky full of gentle floating jellyfish-clouds; a comet streaking above; a double-rainbow after dream-rain; a violet dusk with the first bright star; warm sunbeams through clouds; a sky raining slow luminous petals.

Dreamy, soft, luminous. NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── cloud-harbor ──────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'alphabot_cloud_harbor_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} CLOUD-HARBOR scenes for a dreamy wildcard art bot. Each is a floating SKY-HARBOR — cloud-islands + dream-airships docked at gentle sky-ports (Laputa / Ghibli-sky register). Each entry 20-32 words. The floating sky-world is the hero (soft, wondrous, NOT steampunk-industrial).

━━━ SKY WORLDS (spread across all ${n}) ━━━
- a cloud-island town with white cottages and a harbor of moored hot-air-balloon ships
- a floating garden-island, waterfalls pouring off its edge into the cloud-sea below
- a sky-port of little wooden dream-boats tethered to a floating stone jetty in the clouds
- a chain of tiny sky-islands linked by rope bridges, lanterns strung between them at dusk
- a floating lighthouse on a lone cloud-rock, sky-ships circling its warm beam
- a terraced sky-village on a floating mountain, flower-terraces spilling into open air
- a cloud-harbor market, floating stalls and paper-lantern balloons above a soft cloud-sea
- a grand floating temple-island wreathed in mist, koi-shaped sky-kites drifting around it
- a sky-marina at sunrise, sailboats with billowing sails gliding between cloud-banks
- a floating windmill-island, its sails turning slow above a golden cloud-ocean
- a cluster of bubble-domed sky-cottages nestled on a drifting cumulus
- a moonlit sky-harbor, glowing jellyfish-airships bobbing at a pearl-white dock

━━━ THE LOOK ━━━
Soft, luminous, Ghibli-dreamy — billowing clouds, warm light, gentle floating architecture. Wide establishing view with real depth (foreground island, the harbor, cloud-sea receding). Wonder + serenity. NO steampunk grime, NO readable text.

━━━ RULES ━━━
NO brand/real names, NO readable text. Each entry a distinct floating sky-world + a specific dreamy detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_cloud_harbor_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SKY-LIGHT snippets for the cloud-harbor path — the light/atmosphere around a floating sky-harbor. Each 8-16 words. A single light/cloud element.

Spread across: golden-hour sunbeams through towering clouds; a soft pink dawn on the cloud-sea; a giant low sun at the horizon; drifting mist between islands; a rainbow arcing through the cloud-banks; warm lantern-glow at dusk; a sea of clouds glowing amber below; fluffy cumulus towers catching light; a gentle sun-shower with a rainbow; twilight with the first stars; a full moon over a silver cloud-sea; birds/sky-koi silhouetted against the sun.

Soft, luminous, dreamy. NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── dreamscape-nocturne ───────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'alphabot_dreamscape_nocturne_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} DREAMSCAPE-NOCTURNE scenes for a dreamy wildcard art bot. Each is a nocturnal surreal DREAM-WORLD — moonlit, strange, and beautiful (a lucid night-dream you don't want to wake from). Each entry 20-32 words. The night dreamscape is the hero — luminous against the dark, never scary.

━━━ NIGHT DREAM-WORLDS (spread across all ${n}) ━━━
- a forest of glowing bioluminescent trees mirrored in a perfectly still black lake
- a desert of giant mirrors under a huge starfield, moon multiplied across the glass
- a floating staircase of moonlight spiralling up into a galaxy
- a midnight garden where the flowers are glowing lanterns and the paths are stars
- a bioluminescent swamp, glowing lily-pads and drifting spirit-lights over dark water
- a moonlit city of pale spires floating on a sea of clouds, windows like fireflies
- an aurora over a mirror-still fjord, the green light doubled in black water
- a night meadow where fireflies and falling stars blur into one drifting glow
- a cave of glow-worms like an underground galaxy over a still reflecting pool
- a moonlit ocean where the waves glow blue and a path of moonlight leads to the horizon
- a snow-field under a vast aurora, a single glowing doorway standing in the drift
- a dream-orchard of trees hung with glowing paper moons over silver grass

━━━ THE LOOK ━━━
Nocturnal, luminous, surreal, serene. Deep blues and blacks with jewel-bright glow (moon, aurora, bioluminescence, stars). Real depth + a still, dreamlike calm. Awe, never horror. NO readable text, NO people as the subject.

━━━ RULES ━━━
NO brand/real names, NO readable text. Each entry a distinct nocturnal dreamscape + a specific glowing detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_dreamscape_nocturne_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} NIGHT-SKY snippets for the dreamscape-nocturne path — the night sky/glow over a surreal dream-world. Each 8-16 words. A single night-sky element.

Spread across: a vast milky-way band; shimmering green-and-violet aurora; a huge low full moon; a sky of falling stars; twin crescent moons; a nebula of soft rose-and-teal cloud; a single enormous bright star; drifting luminous mist; a ring of glowing planets low on the horizon; a starfield reflected as if the sky were water; a moon-halo through thin cloud; slow-drifting fireflies rising into the stars.

Deep, luminous, dreamy — never harsh. NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
