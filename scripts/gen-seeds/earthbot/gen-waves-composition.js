#!/usr/bin/env node
/**
 * EarthBot waves — COMPOSITION axis (the framing driver, R2 no-tunnel-POV).
 *
 * R1 had inside-barrel POV entries that Flux rendered as water tunnels
 * (not real wave barrels). Kevin killed the inside-tube framing entirely.
 *
 * R2 swap: replaced inside-barrel POV with aerial-overhead / drone POV.
 *
 * 4 framing modes:
 *   1. Side-view-of-barrel (~30%) — Clark-Little classic profile
 *   2. Pulled-out wide (~25%) — wave + following sets in deep ocean
 *   3. Aerial overhead (~20%) — drone-style top-down shot
 *   4. Panned-out island context (~25%) — wave + tropical island landscape
 *
 * R0 = 40 (clean replace).
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/waves_composition.json';
if (fs.existsSync(outPath)) {
  fs.unlinkSync(outPath);
  console.log('Removed R1 file for clean R2 regen (no inside-barrel POV; aerial overhead replacement)');
}

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} COMPOSITION entries for EarthBot waves. Each entry describes ONE camera framing / angle for a wave scene. Surf-photography caliber framing variety.

━━━ THE BAR — FOUR FRAMING MODES ━━━

The composition axis drives the CAMERA ANGLE / FRAMING. Four distinct modes:

1. ~30% **SIDE-VIEW-OF-BARREL** — profile shot from beach / cliff / lateral angle. Classic Clark-Little. Camera sees the wave from the SIDE as it crests and barrels.

2. ~25% **PULLED-OUT WIDE** — distant shot showing the primary wave AND the following sets behind it in deep open ocean. Wave is in middle distance with horizon line + multiple swells visible rolling in.

3. ~20% **AERIAL OVERHEAD / DRONE POV** — looking down from above the wave. Top-down or high-angle perspective showing the wave-crest from above, the trailing whitewater, the reef visible below the breaking water.

4. ~25% **PANNED-OUT ISLAND CONTEXT** — wave in foreground + dramatic tropical-island landscape silhouetted behind. Multi-tier depth: wave / mid-ocean / distant island peaks.

━━━ ABSOLUTELY BANNED ━━━

- **NEVER inside-barrel POV / inside-the-tube perspective / looking-out-from-inside-the-barrel** — Flux renders those as circular water-tunnels, not real wave barrels. Kevin killed this framing.
- Surfers / surfboards / fins / wetsuits / surfers-in-barrel (zero humans, zero surf gear)
- Specific wave content (wave_subject axis)
- Coastal context content (coastal_context axis)
- Specific sky / water details (sky_layer / water_color axes)
- Light condition (light_condition axis)
- Architecture / piers / lighthouses
- Named places
- Sci-fi / fantasy / impossible angles
- Bioluminescent / glowing
- Single beam / single shaft / single column of light

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 16-32 words each.

━━━ FRAMING MODE 1 — SIDE-VIEW-OF-BARREL (~30%) ━━━

- Side-profile camera angle from a lateral vantage, the wave cresting in profile against the sky
- Lateral profile shot with the wave's full curl visible from the side, classic surf-photography side angle
- Side-view from beach-level, the wave breaking in profile across the frame
- Profile angle from a low cliff, the wave cresting horizontally across the middle of the frame
- Lateral camera angle from a rocky promontory, full wave profile visible cresting against the horizon
- Beach-level profile shot of the wave-curl in mid-formation, camera at lateral water-level

━━━ FRAMING MODE 2 — PULLED-OUT WIDE / FOLLOWING SETS (~25%) ━━━

- Aerial-low pulled-out wide shot, the primary wave cresting in middle distance with three additional swell-sets visible behind rolling toward shore
- Pulled-out wide from a high cliff, the wave breaking in middle ground with following sets visible in the deep ocean behind
- Wide-angle pulled-back shot, primary wave in middle distance, secondary swell-set lined up behind it in deep blue water, deep horizon visible
- High-vantage wide shot, the cresting wave with multiple following sets stretching back to the horizon in deep open ocean
- Pulled-out coastal vantage, primary wave + a long line of secondary swells visible rolling in from the horizon behind
- Wide framing from elevated vantage with the breaking wave + 3-4 cresting sets behind it, the deep open ocean stretching to horizon

━━━ FRAMING MODE 3 — AERIAL OVERHEAD / DRONE POV (~20%) ━━━

- Aerial drone shot directly overhead the breaking wave, the curl visible from above, trailing whitewater extending behind
- Top-down aerial perspective with the wave-crest visible from above, the reef-shelf visible through translucent water below
- High aerial overhead shot of the wave breaking on a reef, the entire wave profile visible from above
- Drone-style elevated perspective from directly above the wave, white spray and trailing foam visible top-down
- Overhead aerial framing showing the wave-crest, the breaking line, and the trailing whitewater in clear top-down view
- Steep-angle aerial shot from above the cresting wave, the reef visible through clear water below the breaking face

━━━ FRAMING MODE 4 — PANNED-OUT ISLAND CONTEXT (~25%) ━━━

- Pulled-out panoramic shot with the wave in the foreground and a tropical island silhouetted in the deep background, multi-tier depth
- Wide-angle composition with the wave breaking in the foreground and dramatic volcanic-island peaks rising silhouetted in the deep distance
- Pulled-back coastal shot showing the wave cresting in the foreground with a palm-fringed tropical island visible in the middle-distance
- Wide framing with the foreground wave and a distant tropical island landform silhouetted in the upper background
- Panoramic shot composing the wave in the foreground with a jagged volcanic island silhouette extending across the deep background
- Wide composition with the wave cresting in the foreground + lush tropical island peaks rising silhouetted at the deep distance horizon

━━━ EXAMPLES ━━━

✓ "Side-profile camera angle from a lateral vantage, the wave cresting in profile against the sky"

✓ "Aerial-low pulled-out wide shot, the primary wave cresting in middle distance with three additional swell-sets visible behind rolling toward shore"

✓ "Aerial drone shot directly overhead the breaking wave, the curl visible from above, trailing whitewater extending behind"

✓ "Pulled-out panoramic shot with the wave in the foreground and a tropical island silhouetted in the deep background, multi-tier depth"

✓ "Lateral profile shot with the wave's full curl visible from the side, classic surf-photography side angle"

✓ "Pulled-out wide camera position from a high cliff, the wave breaking in middle ground with following sets visible in deep ocean behind"

✓ "Top-down aerial perspective with the wave-crest visible from above, the reef-shelf visible through translucent water below"

✓ "Wide-angle composition with the wave breaking in the foreground and dramatic volcanic-island peaks rising silhouetted in the deep distance"

✗ BAD — inside-tube: "Inside the barrel POV looking out toward the exit" (BANNED — Flux renders as water tunnel)
✗ BAD — inside-barrel: "Camera from inside the wave tube" (BANNED)
✗ BAD — specific wave: "Side-view of a 40-foot wave" (BANNED — that's wave_subject axis)
✗ BAD — surfer: "POV with surfer riding the barrel" (BANNED — zero humans)
✗ BAD — multiple framings: "Side view AND aerial AND wide" (BANNED — ONE framing per entry)

━━━ MODE DISTRIBUTION ━━━

- ~30% side-view-of-barrel
- ~25% pulled-out wide / following sets
- ~20% aerial overhead / drone POV
- ~25% panned-out island context

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE camera framing per entry. NO inside-barrel POV. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
