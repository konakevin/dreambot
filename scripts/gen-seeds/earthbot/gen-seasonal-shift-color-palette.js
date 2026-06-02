#!/usr/bin/env node
/**
 * EarthBot seasonal-shift — COLOR PALETTE axis (R4 autumn + spring only).
 *
 * Each entry names 3-5 contrasting colors with named species/elements.
 * Render ALL named colors in the painting — solves mono-tone failure.
 *
 * Season-tagged autumn or spring ONLY (winter + summer dropped 2026-05-22).
 * Filtered by subject's season tag via matchTagsFromSlot.
 *
 * R0 = 50.
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/seasonal_shift_color_palette.json';
// Append mode — scale R6 50-entry pool to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COLOR PALETTE entries for EarthBot seasonal-shift. Each entry names 3-5 CONTRASTING colors with their natural source (specific plant species / mineral / atmospheric phenomenon). These are the colors the renderer MUST visibly land in the painting — never mono-tone.

━━━ THE BAR — MULTI-COLOR SEASONAL RICHNESS ━━━

Real peak fall has yellow birch + orange maple + red oak + lingering green hemlock + violet asters — multiple contrasting hues in a single scene. Real peak spring has pink cherry blossom + yellow forsythia + purple lupine + white magnolia + emerald new leaves. Each entry names 3-5 contrasting colors PLUS the natural source.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "tags": ["autumn"], "description": "<3-5 contrasting colors with named sources, 22-38 words>" }

Season tag MUST be the FIRST tag — ONLY "autumn" or "spring" (winter + summer dropped from the path 2026-05-22).

━━━ AUTUMN PALETTES (~50%) — MIXED MULTI-COLOR + FIRST-SNOW VARIANTS ━━━

- Yellow-gold birch foliage + scarlet-red maple canopy + crimson sugar maple + lingering emerald hemlock + violet wild aster blooms scattered through the understory
- Amber aspen + rust-red oak + orange-yellow tamarack + magenta sumac + soft white birch trunks + indigo evening shadow tones
- Saffron-yellow birch + scarlet maple + burgundy oak + lingering dark spruce green + golden cottonwood + ochre dried fern carpets
- Butter-yellow gingko + crimson maple + lavender wild aster + lingering green hemlock + bronze beech + rust oak
- Pumpkin-orange aspen + golden birch + rose-pink sumac + lingering green spruce + amber-cream tamarack + scattered violet asters
- Fresh white first-snow + lingering scarlet maple + golden birch + dark spruce green + ochre dried-grass tufts (autumn-to-winter transition)
- Crisp white snow dusting + crimson sumac + amber aspen + dark spruce green + sienna fallen-leaf carpet + faint violet shadows (first-snow on foliage)
- Powder-white first snow + still-vibrant orange maple + golden birch + bare grey branches + dark conifer green + crimson sumac patches

━━━ SPRING PALETTES (~50%) — BLOSSOM + EMERGING COLOR + LIFE RETURNING ━━━

- Pink-white cherry blossom + butter-yellow forsythia + violet lupine + emerald new leaves + soft white magnolia + golden poppies scattered through the understory
- Magenta cherry + lavender wisteria + sunshine-yellow forsythia + soft pink magnolia + emerald-green new oak leaves + scarlet tulips
- Cherry-pink blossom canopy + bluebonnet purple + paintbrush crimson + golden poppies + soft white snowdrops + emerald new growth
- Pink redbud + golden bittersweet + lavender lilac + white dogwood + emerald new spruce growth + violet pansies
- White magnolia + pink cherry blossom + lavender wisteria + golden daffodils + emerald new leaves + scarlet tulips
- Saturated lupine purple + paintbrush crimson + golden poppy + cream queen-anne-lace + emerald new grass + sapphire-blue cornflower (superbloom)
- Lavender lilac + butter-yellow daffodil + pink azalea + emerald new conifer growth + white dogwood + violet hyacinth
- Bluebonnet purple + paintbrush crimson + golden poppy + emerald new grass + cream daisy + violet wildflower
- Soft pink cherry + emerald new oak leaves + violet wild iris + golden marsh marigold + cream serviceberry + lavender phlox
- Coral azalea + lavender wisteria + golden forsythia + emerald new conifer + pink dogwood + violet hyacinth
- Pink cherry blossom + lingering patches of white snow + emerging emerald-green new leaves + golden first daffodils (spring thaw)
- Pink magnolia + butter-yellow daffodil + lavender lilac + emerald new birch leaves + soft white snowdrop + violet pansies

━━━ ABSOLUTELY BANNED ━━━

- Mono-color entries (NEVER "all red maple" / "just gold aspen" — must name 3-5 colors)
- Specific subject details (subject axis)
- Lighting words
- Sky / atmosphere
- Architecture
- Bioluminescent / sci-fi
- Made-up plant species

━━━ EXAMPLES ━━━

✓ { "tags": ["autumn"], "description": "Yellow-gold birch foliage + scarlet-red maple canopy + crimson sugar maple + lingering emerald hemlock + violet wild aster blooms scattered through the understory" }

✓ { "tags": ["autumn"], "description": "Fresh white first-snow + lingering scarlet maple + golden birch + dark spruce green + ochre dried-grass tufts" }

✓ { "tags": ["spring"], "description": "Pink-white cherry blossom + butter-yellow forsythia + violet lupine + emerald new leaves + soft white magnolia + golden poppies scattered through the understory" }

✓ { "tags": ["spring"], "description": "Saturated lupine purple + paintbrush crimson + golden poppy + cream queen-anne-lace + emerald new grass + sapphire-blue cornflower" }

✗ BAD — mono: "All scarlet maple" (BANNED — name 3-5 contrasting colors)
✗ BAD — subject: "Cherry blossom valley" (BANNED — subject axis)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS. 3-5 contrasting colors per entry + named natural sources. Season tag. No preamble, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
