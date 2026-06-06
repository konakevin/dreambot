#!/usr/bin/env node
/**
 * ICONIC_LANDSCAPE_PHENOMENON — production scale-up toward 200.
 *
 * Magical / atmospheric events painted INTO the iconic stylized fantasy
 * landscape. 60%-gated drama axis. Each entry: 40-60 words, ONE
 * sentence, describing a SPECIFIC visible phenomenon happening in the
 * scene — aurora / dragon-shadow / leyline-scar / fey-light cluster /
 * cathedral god-rays / glowing waterfall / etc. — with color +
 * shape + placement + emotional weight.
 *
 * Mirrors the existing 60 entries' register exactly:
 *   "A <specific phenomenon> <verb> <where in frame>, <visual detail>,
 *   <emotional/atmospheric beat>."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/iconic_landscape_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 12000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MAGICAL / ATMOSPHERIC PHENOMENON entries for DragonBot's iconic-landscape path. Each entry describes a SINGLE visible phenomenon happening IN the landscape — the kind of theatrical event that turns a vista into a movie poster. Pure landscape — NO characters, NO foreground figures. The phenomenon is the FOCAL EVENT in the painted vista.

━━━ THE FORMAT — mirror this EXACTLY ━━━

Format strictly: ONE sentence, 40-60 words, starting with "A <noun phrase>" or "<Noun phrase>" (the phenomenon's grammatical subject). Describes WHAT the phenomenon is + WHERE in the frame it appears + visual specifics (color / shape / motion) + the emotional/atmospheric beat it lays over the landscape.

EXAMPLE REGISTER (mirror this exactly):
  "A slow aurora unfurls across the upper sky in curtains of emerald and violet, rippling like silk dragged through water, its light pooling in every hollow of the landscape below and turning distant snowfields into shimmering mirrors of cold fire."
  "A dragon-shadow sweeps silently across the distant cloud-layer, enormous and unmistakable, its wingtip outline crisp against the pale overcast before the darkness slides onward and vanishes beyond the far ridge, leaving the clouds briefly disturbed."
  "A leyline-scar pulses across the ground from foreground to horizon, a ragged luminous seam of gold-white light tracing the earth's hidden architecture, brightening with each slow heartbeat and casting long dramatic shadows to either side."

━━━ THE PHENOMENON BAR ━━━

Every entry must:
  • Name a SPECIFIC visible phenomenon (aurora / dragon-shadow / portal / leyline / fey-light / god-ray / floating mountain / glowing waterfall / spirit-mist / moon-pillar / star-fall / spell-storm / etc.)
  • Place it in the SCENE explicitly (upper sky / across the cloud layer / threading the valley floor / pouring from a cliff / arcing over the peaks / pooling in the lake / piercing the canopy)
  • Name a COLOR or PAIR of colors (emerald and violet / gold-white / bone-white and indigo / amber and rose / fel-green / crimson and copper)
  • Name a MOTION verb (unfurls / sweeps / pulses / drifts / arcs / sears / coils / cracks / spirals / hangs / collapses / falls / rises / rolls)
  • Name an ATMOSPHERIC consequence — what the phenomenon DOES to the landscape (pooling light / casting shadows / silencing the air / turning the lake to mirrors / shaking distant trees / dimming the sun / brightening fog)

━━━ THE PHENOMENON TYPES — distribute the ${n} entries across these ━━━

SKY PHENOMENA: aurora curtains / impossible double-moons / blood-eclipse / cathedral god-rays / starfall / meteor-shower / lightning-storm above peaks / dragon-shadow on clouds / portal-tear in the sky / floating arcane sigils / hovering rune-disks / spirit-clouds / luminous comet / ghost-moon halo / sky-fire ribbon
GROUND PHENOMENA: leyline-scar / glowing fissure / shimmering teleport-circle / sigil-burned earth / pulsing crystal vein / cold-flame trail / spirit-procession winding through valley / luminous footsteps lingering on grass / glowing root-network / fey-ring pulsing in clearing
WATER PHENOMENA: glowing waterfall / luminous river / spirit-mist over lake / bioluminescent tide / iridescent sea-fog / shimmering ford / mirror-still arcane pool / boiling enchanted spring / spectral whirlpool / cold-flame on the surface / liquid-light fountain
ATMOSPHERIC: fey-light cluster drifting / wisp-clouds at midground / dust of arcane motes / pollen-glow rising / phosphorescent mist / smoke-spirits coiling / petals of luminous ash falling / star-dust in the air / radiant pollen drifting / cold-flame haze
CREATURE-SILHOUETTE PHENOMENA: dragon-shadow on clouds / griffin flight across distant ridge / silhouette of flying wyvern / phoenix arcing above mountains / wisps of distant hippogriff flock / a far flock of pegasi / silhouette of leviathan in distant water / colossal ghost-shape in mist
LIGHT PHENOMENA: cathedral god-rays / pillar of light from temple / pulse of arcane light from buried artifact / radiant beam from distant tower / column of moonlight piercing canopy / spiral aurora above ruin / soft glow from beneath the ice / lantern-light cluster of fey
ELDRITCH / DARK PHENOMENA: portal-tear / void-rift / fel-green corruption seeping / cold-flame in the dark / shadow-bloom over forest / blood-aurora / crimson eclipse / black-flame procession / spirit-march across battlefield / ghost-army silhouettes
RUIN / RELIC RESONANCE: ancient monolith glowing / runestone-cluster pulsing / ruined temple emanating light / sigil-ring of stone glowing in the grass / floating pillar above ruined altar / rune-circle activated on temple floor / standing-stone alignment beaming
PEAK / SUMMIT PHENOMENA: storm-crowned peak / lightning-laced summit / cloud-pillar above mountain / impossible cloud-architecture / dragon-perch silhouette / floating island above peak / mountain wreathed in cold flame / arcane storm crowning peak
SEASONAL / ELEMENTAL: blizzard-veil / fire-storm in distance / molten-rain at horizon / impossible rainbow arcing over biome / radiant snow-fall / impossible cherry-blossom storm / luminous-petal cascade / falling glass-rain

━━━ BANS ━━━

- NO characters / no foreground figures / no heroes / no orcs / no human silhouettes. Only landscape phenomena. Distant creature SILHOUETTES (dragon / griffin / pegasus / leviathan) at scale-prover size only.
- NO franchise proper nouns ("Azeroth" / "Mordor" / "Rivendell" / "Pandaria" / etc.) — describe the AESTHETIC generically.
- NO sci-fi / cyberpunk / neon / modern-industrial. Strict Western high fantasy.
- NO real-world ethnic-coded settings (no Bedouin / Persian / samurai / etc.).
- NO photoreal / CGI / 3D-render language. This is HAND-PAINTED-STYLIZED tradition.
- NO "soft glow" / "magical aura" / "fantasy atmosphere" — every phenomenon MUST be SPECIFIC and NAMED.
- NO sentences ending with "magic" or "magical" as the whole point — name the SHAPE and the COLOR.
- NO repeating a phenomenon already covered in the existing batches.

━━━ STRICT FORMAT ━━━

- ONE sentence per entry, 40-60 words.
- Internal punctuation: commas only, no internal periods.
- Each entry starts with the phenomenon as the subject ("A glowing...", "Three pillars of...", "Cathedral cloud-rays...", "Spirits of...", etc.).
- Each entry must be DISTINCT — different phenomenon, different placement, different color combo from the others.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
