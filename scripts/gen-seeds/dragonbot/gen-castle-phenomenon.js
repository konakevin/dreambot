#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/castle_phenomenon.json',
  total: 200,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC FLOURISH / PHENOMENON entries for DragonBot's castle path (40%-gated, fires occasionally). Each entry is a SHORT DENSE phrase (20-35 words) describing a SPECIFIC atmospheric event happening around or above the castle — the kind of detail that pushes a render from "beautiful" to "GASP-worthy."

⚠️ THE BAR: every phenomenon adds DRAMATIC ATMOSPHERIC FLOURISH without competing with the castle as focal subject. Subtle dramatic flourish, not loud action. Movie-poster atmospheric beats.

🚫 NO PROPER NOUNS / NO BRANDED CHARACTERS / NO ARMIES MARCHING / NO BATTLES IN PROGRESS — that goes in epic-moment path. This is PURE atmospheric flourish around a STATIC majestic castle scene.

━━━ PHENOMENON CATEGORIES (distribute ${n} across):

LIGHTNING / STORM FLOURISH (~4):
- a single fork of lightning illuminating the castle silhouette from behind, brief brilliant flash freezing every spire
- distant lightning flickering inside a storm-cloud wall behind the castle, intermittent strobe lighting
- multiple lightning forks arcing between storm-clouds above the castle, dramatic chiaroscuro across battlements
- a single thunderhead with internal lightning glow pulsing over the castle, atmospheric strobe

GOD-RAYS / LIGHT-SHAFTS (~4):
- dramatic god-rays radiating downward through a cloud-gap onto the castle, theatrical Caravaggio chiaroscuro
- single golden sun-shaft piercing through low cloud-bank onto the highest spire, illuminating it like a beacon
- multiple light-shafts cutting through mist-banks around the castle base, volumetric god-rays visible in the haze
- horizontal sunbeam at golden hour cutting across the scene, gilding the castle facade while the foreground stays in shadow

MIST / FOG DRIFT (~4):
- thick atmospheric mist-banks drifting horizontally across the castle's lower walls, only the highest spires emerging clear
- low fog pooling in the valleys around the castle base, only the upper towers piercing through into clear sky
- volumetric mist-streams drifting between the castle's spires like ghosts, golden-hour light bleeding through
- morning mist rising from a moat or lake at the castle base, golden-hour sun catching the rising vapor

FLYING CREATURES / BIRDS (~3):
- a single distant dragon arcing across the sky behind the castle, sun-glinting along its wings
- a great cloud of ravens swirling around the highest tower, dark mass spiraling against the sky
- a flock of distant eagles wheeling on the updrafts above the castle, V-shapes against painted sky

MAGICAL FLOURISH / ARCANE EFFECTS (~3):
- arcane runes briefly glowing across the castle facade, soft cyan light pulsing through ancient inscriptions
- a column of magical light rising from the castle's central tower into the sky, gentle aurora trailing
- glowing magical particles drifting upward from the castle, soft luminous mist hovering around the highest spires

NATURAL DRAMA (~3):
- a vast meteor streak cutting across the night sky above the castle, burning trail still visible
- snow-flurries swirling around the castle's highest towers, drifting downward in the golden glow of internal torches
- petals from a distant blossom-tree grove drifting across the foreground in a wind-stream, the castle gilded by sunset behind

WATER / WAVES / WATERFALLS (~3):
- a vast waterfall cascading from the castle's outer cliff into a chasm below, mist plume rising hundreds of meters
- crashing waves at the foot of the sea-cliff castle, spray rising hundreds of meters into the air, gulls wheeling
- a still mirror-lake at the castle base perfectly reflecting the entire silhouette, doubling the composition

FIRE / EMBER FLOURISH (~3):
- glowing braziers lining the castle approach road, light-points punctuating the path through the dusk
- chimney-smoke curling from a dozen castle hearths, golden-hour light catching the smoke-plumes
- distant volcanic glow on the horizon casting amber light onto the castle's far side, dramatic chiaroscuro

EACH entry MUST be:
- 20-35 words
- ONE atmospheric flourish around / above / at the castle
- NEVER characters in action / armies / battles (epic-moment territory)
- Subtle dramatic flourish that enhances the castle, not competes with it
- Painted concept-art language

Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
});
