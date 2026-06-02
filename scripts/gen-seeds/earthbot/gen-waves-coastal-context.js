#!/usr/bin/env node
/**
 * EarthBot waves — COASTAL CONTEXT axis.
 *
 * What the wave breaks ON / against. Anchors the wave physics to a
 * real-Earth coastal feature. Natural only — no piers, no lighthouses,
 * no architecture.
 *
 * R0 = 40.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/waves_coastal_context.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COASTAL CONTEXT entries for EarthBot waves. Each entry describes ONE coastal feature the wave breaks ON / against — the geographic anchor explaining wave physics. Natural coast only.

━━━ THE BAR — ONE COASTAL CONTEXT ━━━

Shallow coral reef (= barrel formation), volcanic cliff (= explosive spray), rocky headland point (= wrapping break), sea-stack (= circular spray burst), volcanic black-sand shorebreak. Anchors the wave to real Earth geography.

━━━ ABSOLUTELY BANNED ━━━

- Architecture / piers / lighthouses / docks / cabanas / huts / bungalows
- Named places (no "Maui" / "Hawaii" — generic morphology only)
- The wave itself (wave_subject axis)
- Water color (water_color axis)
- Sky details (sky_layer axis)
- Light condition
- Humans / surfers
- Sci-fi / fantasy
- Vegetation as primary (palms in background OK, but not as primary feature)

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 14-26 words each.

━━━ COASTAL CONTEXT TYPES ━━━

CORAL REEF (intimate-barrel pairing):
- A shallow coral reef extending across the foreground floor, the reef visible through the wave-face
- A submerged coral-reef shelf creating the wave's break point, coral visible beneath translucent water
- A wide coral reef-flat extending into the deep distance below the breaking wave

VOLCANIC CLIFF (big-wave explosive pairing):
- A vertical black-volcanic-rock cliff rising at the wave's break point, the wave smashing against the cliff face
- A jagged volcanic cliff coastline with the wave thundering against the rock face
- A tall basalt-column cliff face rising from the surf, wave detonating at the base

ROCKY HEADLAND POINT:
- A volcanic rocky headland point extending into the surf, the wave wrapping around the point
- A weathered rocky headland with the wave peeling cleanly off the point in a long shoulder
- A jagged volcanic headland with surf wrapping around its tip

SEA-STACK:
- A solitary sea-stack rising from the surf, the wave breaking around it in circular burst
- Twin volcanic sea-stacks in the surf, the wave detonating between them
- A weathered basalt sea-stack with the wave splashing against its base

BLACK-SAND / SHOREBREAK:
- A volcanic black-sand beach with explosive shorebreak detonating at the foreground sand line
- A wide tropical black-sand shoreline with the wave shorebreak detonating in foreground white-foam

WHITE-SAND BEACH (gentler waves only):
- A wide white-sand tropical beach with gentle shorebreak foam at the surf line
- A palm-fringed white-sand beach with the wave breaking softly at the foreground

DEEP-WATER REEF BREAK:
- A deep-water reef break offshore creating the wave's crest line, dark sapphire deep water surrounding
- An offshore reef shelf where the wave breaks in clean isolation, deep water on either side

OUTER REEF / ATOLL:
- An outer-atoll reef edge breaking in long peeling barrels, the lagoon visible beyond
- A wide outer-reef break in clean isolation, the lagoon stretching toward shore behind

━━━ EXAMPLES ━━━

✓ "A shallow coral reef extending across the foreground floor, the reef visible through the wave-face in translucent water"

✓ "A vertical black-volcanic-rock cliff rising at the wave's break point, the wave smashing against the cliff face"

✓ "A weathered rocky headland point extending into the surf, the wave wrapping cleanly around the point"

✓ "A solitary sea-stack rising from the surf, the wave breaking around it in circular spray burst"

✓ "A volcanic black-sand beach with explosive shorebreak detonating at the foreground sand line"

✓ "A jagged volcanic headland point with surf wrapping around its tip in clean shoulder peel"

✓ "An offshore reef shelf where the wave breaks in clean isolation, deep water on either side"

✓ "Twin volcanic sea-stacks in the surf, the wave detonating between them in white spray"

✓ "A submerged coral-reef shelf creating the wave's break point, coral visible beneath translucent water"

✓ "A wide tropical white-sand beach with gentle shorebreak foam at the surf line"

✗ BAD — architecture: "Wave breaking against a stone pier" (BANNED — natural only)
✗ BAD — named: "Maui's volcanic cliff" (BANNED — generic morphology only)
✗ BAD — wave details: "Reef where 40-foot wave breaks" (BANNED — that's wave_subject axis)

━━━ DISTRIBUTION ━━━

- ~30% shallow coral reef (intimate-barrel pairing)
- ~25% volcanic cliff (big-wave explosive)
- ~15% rocky headland point
- ~15% sea-stack
- ~10% black-sand / shorebreak
- ~5% deep-water reef break / outer-reef

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE coastal context per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
