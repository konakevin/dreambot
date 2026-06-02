#!/usr/bin/env node
/**
 * EarthBot geological-wonder — MINERAL COLOR axis (R3 sci-fi-combo purge).
 *
 * R0/R1 had rose-quartz-pink + flamingo-pink calcite entries which, when
 * paired with ICE/TRANSPARENT/CRYSTAL subjects, Flux rendered as sci-fi
 * "alien glowing pockets embedded in ice" (R3 #5 confirmed). The pink/
 * fluorescent mineral palette is fine on STONE but reads as energy-effect
 * on translucent substrates.
 *
 * R3 PURGES pink-fluorescent-pocket combinations. Keeps the full real-
 * mineral color palette but removes the specific phrasings that combine
 * fluorescent pinks with translucent host rocks.
 *
 * Real mineral / rock color palette. Hyper-saturated to maximum but
 * always real mineral colors. No glowing-pocket / fluorescent-embed
 * combinations.
 *
 * R0 = 40.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/geological_wonder_mineral_color.json';
// R3 production scale — append to existing 40 entries to reach 200.
generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MINERAL COLOR DRAMA entries for EarthBot geological-wonder. Each entry describes ONE specific mineral / rock color signature for the render. REAL mineral colors only — no impossible / made-up colors.

━━━ THE BAR — SATURATED REAL MINERAL COLORS ━━━

Real Earth minerals come in incredible colors. Amethyst is genuinely violet. Malachite is genuinely electric green. Iron-oxide is genuinely rust-red. Sulfur is genuinely bright yellow. Obsidian has genuine rainbow-sheen reflection. These colors are HYPER-SATURATED in gallery-print photography — not muted.

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS. Each string is one mineral-color description, 16-30 words.

━━━ EVERY ENTRY MUST INCLUDE (NON-NEGOTIABLE) ━━━

1. **2-4 NAMED REAL MINERALS / ROCK TYPES** with their REAL saturated colors:

   - amethyst-violet (real purple)
   - quartz-crystal pure-white (clear / transparent)
   - rose-quartz pink (real soft pink)
   - smoky-quartz brown-grey
   - citrine yellow-gold
   - aquamarine pale blue
   - amazonite turquoise-green
   - malachite electric-emerald-green (real)
   - azurite deep-cobalt-blue (real)
   - sulfur bright canary-yellow
   - iron-oxide rust-red / oxide-orange
   - hematite metallic grey-silver
   - calcite pink / white / amber
   - selenite pure-white / silver-translucent
   - obsidian black with rainbow-sheen reflection
   - pumice ash-grey
   - basalt deep-charcoal-black
   - sandstone red-amber-cream striations
   - travertine cream-tan with mineral-stained orange-amber pools
   - flowstone amber-orange draperies
   - lava-flow glowing-amber-red-orange
   - limestone cream / pale tan
   - mineral-stained turquoise pools
   - pyrite gold flecks
   - mica silver flakes
   - jasper red-yellow banded
   - opal iridescent rainbow-shift
   - lapis-lazuli deep blue with gold flecks
   - feldspar pink-white

2. **A SATURATION DESCRIPTOR** (the colors are NOT muted):
   - "hyper-saturated"
   - "electric"
   - "vivid"
   - "blazing"
   - "rich"
   - "saturated to maximum"
   - "bright"
   - "deep"

3. **HOW THE COLORS APPEAR** (where they sit in the frame):
   - "throughout the formation"
   - "painted across the wall"
   - "streaking the rock face"
   - "saturating every surface"
   - "covering the foreground"
   - "extending across the chamber"
   - "running through striated rock-bands"

━━━ HARD BANS ━━━

NEVER include:
- Made-up / impossible mineral colors (no "electric-cyan amethyst" / "neon-pink obsidian" — real colors only)
- Subject content (no "in the cave" / "across the hoodoos" — subject axis owns content)
- Lighting words (no "lit by godrays" — lighting axis)
- Atmosphere (no "mist of color" — atmosphere axis)
- Sci-fi / fantasy / bioluminescent / glowing-magic gemstones
- Specific named places
- Made-up mineral names

━━━ ABSOLUTELY BANNED PHRASINGS (Flux sci-fi-combo triggers) ━━━

NEVER write these — they make Flux render alien-tech / sci-fi glowing-pocket / energy-bolt effects:

- "rose-quartz pink pockets" or any "pink pocket" / "pink crystal pocket" phrasing
- "flamingo-pink calcite"
- "fluorescent" anything
- "glowing crystal" / "crystal glow" / "internal glow" / "lit-from-within"
- "pulsing" / "radiating" mineral language
- "embedded crystals" with ice or transparent contexts
- Any pink-on-blue-ice / pink-on-glacier / pink-in-translucent-substrate combo
- "bioluminescent" / "luminescent" / "phosphorescent" (real foxfire fungi trigger sci-fi)

━━━ R3 BANS — INTENSIFIER WORDS THAT TRIGGER ENERGY-EFFECT RENDERING ━━━

R3 audit found 11/40 mineral entries had intensifiers that paired with subjects to create sci-fi energy-bolt / laser effects. NEVER use these intensifiers:

- "electric [mineral name]" — "electric malachite" / "electric azurite" / etc → Flux renders as glowing energy
- "specular fire" / "mirror-bright specular" — these combo with wet surfaces to render as energy
- "blazing [mineral]" — "blazing iron-oxide" / "blazing carnelian" → energy-effect
- "[mineral] saturating every surface" + "specular" → energy
- "neon" anything

USE INSTEAD: "deep [mineral]", "saturated [mineral]", "rich [mineral]", "hyper-saturated", "intense" — these describe color depth without triggering Flux's energy-effect rendering.

✗ BAD: "Electric malachite-emerald-green veining"
✓ GOOD: "Deep malachite-green veining" or "saturated malachite-green veining"

✗ BAD: "Blazing iron-oxide rust-red"
✓ GOOD: "Saturated iron-oxide rust-red" or "deep iron-oxide rust-red"

✗ BAD: "Mirror-bright specular fire"
✓ GOOD: "Wet rock catching reflected light" (no "specular fire")

These ALL got rendered as sci-fi/alien embedded energy by Flux. Use other real-mineral pinks instead (carmine-red, scarlet, magenta-violet, raspberry-jasper) but NEVER pair fluorescent pinks with ice/transparent host rock contexts.

━━━ EXAMPLES ━━━

✓ "Hyper-saturated amethyst-violet crystal walls dominating the chamber, with streaks of rose-quartz pink and pure-white selenite running through the rock face"

✓ "Electric malachite-emerald-green veining throughout the formation, mixed with deep azurite-cobalt-blue pockets and rust-red iron-oxide staining the rim"

✓ "Vivid sulfur canary-yellow saturating the rim, blazing iron-oxide rust-orange ground, brilliant turquoise mineral pools"

✓ "Deep amethyst-violet crystals piercing the chamber, citrine yellow-gold pockets, pure quartz-crystal white terminations throughout"

✓ "Sandstone striated in rich blazing reds, amber-oranges, cream-whites — every layer hyper-saturated, the striations running through the rock face"

✓ "Travertine cream-tan terraces with mineral-stained orange-amber pools, brilliant turquoise water collecting between calcite-white rims"

✓ "Obsidian black with rich rainbow-sheen reflection across the surface, pumice ash-grey deposits scattered, fresh pumice glittering across the surface"

✓ "Lava-flow glowing-amber-red molten channels through deep-charcoal basalt crust, fresh cooled rock pitch-black surrounding hot streams"

✓ "Mineral-stained turquoise pools rimmed in calcite-white, sulfur canary-yellow ground around the pools, iron-oxide rust streaks running into the water"

✓ "Selenite pure-white translucent crystals piercing the chamber, with pink rose-quartz cluster pockets and clear quartz terminations throughout"

✓ "Painted-desert sediment striations layered red-amber-purple-cream-grey, every band hyper-saturated, the layers extending across the horizon"

✓ "Flowstone amber-orange draperies cascading along the walls, with rich rust-red mineral seeps running through and pure-white calcite pillars"

✗ BAD — impossible: "Electric-cyan amethyst" (BANNED — amethyst is violet, not cyan)
✗ BAD — subject: "Amethyst cave with violet crystals" (BANNED — "cave" is subject axis)
✗ BAD — lighting: "Amethyst-violet lit by godrays" (BANNED — lighting axis)
✗ BAD — magical: "Glowing-fantasy gemstone" (BANNED — real mineral)

━━━ COLOR FAMILY DISTRIBUTION ━━━

Mix across entries — vary the dominant color signature:
- ~20% purple/violet (amethyst / lavender / lepidolite)
- ~20% red/orange (iron-oxide / sandstone / lava / jasper / carnelian)
- ~15% yellow (sulfur / citrine / sandstone-amber)
- ~15% green (malachite / amazonite)
- ~10% blue (azurite / aquamarine / lapis)
- ~10% black/grey (obsidian / basalt / hematite / pumice)
- ~10% white/cream (selenite / quartz / calcite / travertine)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. 2-4 named real minerals + saturation + position. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
