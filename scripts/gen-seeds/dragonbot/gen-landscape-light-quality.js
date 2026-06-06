#!/usr/bin/env node
/**
 * LANDSCAPE_LIGHT_QUALITY — production scale-up to 200.
 *
 * Each entry names ONE specific LIGHT EFFECT that becomes a HERO ELEMENT
 * in the frame — god-rays / chiaroscuro / cathedral-cloud-shaft / aurora-
 * curtain / sun-pillar / moonbeam-pool / wisp-light / leyline-glow.
 * Hard scene-specific lighting with concrete COLOR + SHAPE + SURFACE-IT-LANDS-ON.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/landscape_light_quality.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHT-QUALITY entries for DragonBot's landscape path — each entry names ONE specific LIGHT EFFECT that becomes a visible HERO ELEMENT in a high-fantasy landscape render. Each entry is one sentence, 22-32 words.

━━━ EVERY ENTRY MUST CONTAIN ALL THREE ━━━

1. NAMED LIGHT EFFECT — god-rays / chiaroscuro / sun-pillar / moonbeam-pool / cathedral-cloud-shaft / aurora-curtain / wisp-light / leyline-glow / rim-light / volumetric mist / dappled-canopy / phosphorescent / sun-through-mist / lightning-flash / blood-twilight / silhouette-edge / fey-orb / mana-stream
2. CONCRETE COLOR + INTENSITY — name the SPECIFIC chromatic anchor ("molten gold" / "razor contrast" / "platinum white" / "acid-green and deep magenta" / "burnt-orange" / "tangerine rim-light" / "dusty yellow lance" / "pale cyan threads")
3. THE SURFACE OR SPACE IT TRANSFORMS — what does the light LAND on / pass through / fill ("the ruined citadel below" / "the mountain face in razor contrast" / "the standing stones" / "the forest hollow" / "the ridge-tops" / "the cliff face" / "the gorge below" / "the snowfields beneath")

━━━ VARIETY MANDATE (distribute roughly across these effect types) ━━━

- 6 GOD-RAYS / SUN-SHAFTS (piercing cloud break / spotlighting ruin / cathedral-cloud-shaft / sun-pillar / sun-shaft through canopy / storm-broken shafts fanning)
- 4 CHIAROSCURO / RAZOR-CONTRAST (one flank in fire / other in shadow / single stark photographic instant)
- 4 MOONLIGHT (moonbeam pool / silver disc / moon-veil / pale-blue moonglow / moonlit ice)
- 4 AURORA / SKY-RIBBON (acid-green and magenta / rose-and-silver / emerald folds / mana-aurora)
- 5 GOLDEN-HOUR / WARM-FLOOD (amber wash across valley / copper filament / burnt-orange ridge-light / molten copper silhouette / honey-amber pour)
- 4 DAPPLED-CANOPY / LEAF-SHADOW (jade and gold coins / amber and olive tessellation / shifting bright windows / fluttering shadow-pattern)
- 4 LIGHTNING / STROBE (cold blue-white strobe / lavender-white fork / single stark instant / split-second illumination)
- 4 MAGICAL-SOURCE LIGHT (leyline glow / mana-stream / wisp-light pool / fey-orb cluster / spell-residue shimmer / luminous waterfall / glowing fungi)
- 5 VOLUMETRIC / MIST-LIT (volumetric beam in gorge / fog-lit-from-within / sun-through-mist diffusion / dusty solid beam / particles in shaft)
- 3 BLOOD / CRIMSON / TWILIGHT (blood-twilight crimson / bruised violet sky / wine-red wash / rose-stained snow)
- 3 BIOLUMINESCENT / PHOSPHORESCENT (electric-teal canopy / glowing waterfall / underwater bioluminescence / pulsing lichen)
- 4 RIM-LIGHT / SILHOUETTE (silhouette-edge in molten copper / silhouette rimmed in burning gold / hard tangerine rim along escarpment / cliff-edge dawn fire)

━━━ EXAMPLE PHRASINGS TO USE ━━━

Format: "[Light effect name] [verb-of-light] [color/intensity], [surface or space it transforms]."

GOOD:
- "God-rays piercing the western cloud-break in molten gold columns, spotlighting the ruined citadel below against a bruised violet sky."
- "Chiaroscuro carving the mountain face in razor contrast, one flank blazing copper while the other drowns in absolute charcoal shadow."
- "Volumetric mist catching a single sun-shaft in the gorge below, the beam rendered solid and dusty gold as particles swirl lazily within it."

━━━ BANS ━━━

- NO generic "soft light" / "warm glow" / "beautiful lighting" — every entry must name the EFFECT and a CONCRETE COLOR
- NO weather-only entries (no "stormy sky" / "overcast" alone) — must always include a HERO LIGHT-EFFECT
- NO characters / no figures in the scene the light lands on
- NO film-reference descriptors ("cinematic" / "HDR" / "Hollywood lighting") — these are PAINTERLY light descriptions
- NO photography-tech adjectives ("8K" / "tack-sharp" / "razor-sharp") — describe light, not lens
- NO repeated light-name overlap across entries — each entry hero a DIFFERENT named effect

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
