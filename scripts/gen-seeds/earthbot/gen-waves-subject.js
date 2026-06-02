#!/usr/bin/env node
/**
 * EarthBot waves — WAVE SUBJECT axis (the hero) — R1 epic-scale + variety.
 *
 * R0 produced mostly clean Clark-Little barrel side-views. R1 enhances:
 * - More HUGE / EPIC / MONUMENTAL waves (40-80ft faces)
 * - Varied breaking patterns: A-frame peak / left-peeling / right-peeling /
 *   double-peak / shore-pounder / outer-reef-break / closeout
 * - Surf-magazine caliber detail
 *
 * Two registers mixed: intimate Clark-Little barrel + monumental big-wave.
 * Real ocean physics. No surfers, no named breaks, no fantasy water.
 *
 * R0 = 50 (clean replace).
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/waves_subject.json';
if (fs.existsSync(outPath)) {
  fs.unlinkSync(outPath);
  console.log('Removed R0 file for clean R1 regen (epic-scale + breaking-pattern variety)');
}

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WAVE SUBJECT entries for EarthBot waves. Each entry describes ONE wave moment — the HERO of the frame. Two registers MIXED in the pool: ~50% INTIMATE (Clark-Little barrel POV / translucent tube / backlit crest / spray detail) and ~50% MONUMENTAL (big-wave 40-60ft face breaking on reef / cliff / point). Real ocean physics. NO surfers. NO named breaks.

━━━ THE BAR — ONE WAVE MOMENT AS HERO ━━━

The wave is the SUBJECT. Real Earth ocean. Tropical setting. Captured at the peak instant of action — spray off the lip, water curling mid-tube, foam exploding at the reef. The kind of frame that makes Clark Little's career.

━━━ ABSOLUTELY BANNED ━━━

- Named breaks (no "Pipeline" / "Teahupoʻo" / "Jaws Maui" / "Mavericks" / "Banzai" — generic morphology)
- Named places (no "Hawaii" / "Tahiti" / "California" — generic only)
- Surfers / surfboards / fins / wetsuits / leashes / wax / surf-gear of any kind
- Humans / divers / swimmers / kayakers / photographer-figures
- Bioluminescent / phosphorescent / glowing waves
- Sci-fi / fantasy tubes / magical-water
- Impossible physics (no walls of water on flat sand, no tsunami)
- Architecture (no piers / lighthouses / docks / cabanas / huts)
- Coastal context (that's coastal_context axis)
- Water color (water_color axis)
- Sky details (sky_layer axis)
- Light condition (light_condition axis)
- Whales / dolphins / fish (subject is the wave)
- Fantasy / sci-fi

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 18-32 words each.

━━━ BREAKING PATTERN VARIETY (rotate aggressively) ━━━

Different waves break differently. Vary which break pattern this entry describes:
- **A-frame peak**: wave peaks in the center, peels both directions (left + right)
- **Left-peeling**: long unbroken left shoulder, wave peeling toward camera-left
- **Right-peeling**: long unbroken right shoulder, wave peeling toward camera-right
- **Shore-pounder / closeout**: wave detonates straight down in a single explosion of spray
- **Double-peak**: two crests breaking simultaneously side-by-side
- **Outer-reef bomb**: massive wave breaking far offshore over a deep-water reef
- **Wedge / cross-up**: two swell directions converging, peak rising vertical
- **Tube / barrel**: hollow translucent cylinder forming as wave crests
- **Spitting barrel**: barrel forming with spray jetting OUT of the open end
- **Closing barrel**: tube collapsing forward, lip cascading down
- **RAW ENERGY / CHAOTIC BREAK** (~25% — high priority pattern): a wave caught at the WILD CHAOTIC moment of breaking — raw energy + motion + visually arresting. Multiple swells colliding, riptide hitting the wave-face, backwash hitting the cresting wave, a wedge-cross-up, a chaotic A-frame peak detonating, a wild fan of spray + foam + water. The wave looks ALIVE — fractal spray, twisting water-sheets, dramatic asymmetric break. Sometimes backlit (sun shining through translucent water makes the wave glow gold/amber/jade); sometimes side-lit; sometimes the dramatic moment is the SHAPE of the chaos itself. The kind of "I can't believe a wave did that" frame.

━━━ INTIMATE BARREL / TUBE (~50% — Clark-Little register) ━━━

- A massive translucent emerald barrel curling overhead in a spitting tube, spray jetting forward from the open end
- A thick jade-green left-peeling barrel forming over a shallow reef, the hollow tube glowing translucent
- An A-frame peak cresting at the center, peeling left and right simultaneously in clean shoulder lines
- A backlit translucent emerald barrel mid-formation, the inside of the tube visible through the water
- A closing tube with the lip cascading forward in a slow water-curtain collapse
- A wide spitting barrel with spray jetting horizontally from the open end at the perfect peak moment
- A thick right-peeling translucent barrel with the inside-tube glowing jade
- A massive double-barrel cresting in a wedge formation, both peaks forming simultaneously

━━━ MONUMENTAL BIG-WAVE (~50% — surf-photography epic register, no names) ━━━

- A 60-foot wave wall rising vertical and breaking on a shallow coral reef, spray exploding 50 feet from the lip
- A monumental 50-foot A-frame peak cresting over a deep-water reef break, both shoulders peeling clean
- A towering 70-foot wave wall thundering against a volcanic cliff, spray rocketing 100 feet skyward
- A massive outer-reef bomb breaking far offshore, the wave wall taller than three-story buildings
- A wide-bay big-wave wall extending across the entire bay, the face peeling in synchronized motion
- A monumental shorebreak wave detonating in a vertical wall of explosive spray
- A massive wedge formation with two converging swells building a vertical peak
- A thunderous 80-foot wall rising over a sudden shallow reef shelf, the wave at maximum peak
- A monumental closeout wave with the entire face cresting and detonating in a single line of explosive spray
- A massive cresting wave with the entire face stretching across the frame, peeling from one headland toward the other in clean shoulder
- A towering wave wall breaking against a sea-stack rock formation, spray exploding around the stone in circular burst
- A monumental left-peeling wave wall with a 50-foot face, the shoulder running clean toward distant point

━━━ EXAMPLES ━━━

✓ "A massive translucent emerald barrel curling overhead, the wave's hollow tube cresting forward, spray rocketing off the upper lip in golden droplets"

✓ "A 40-foot wave wall rising vertical and breaking on a shallow coral reef, spray exploding from the lip in dramatic upward burst"

✓ "Inside a perfect cylindrical translucent tube, water curling overhead in a closing arc, spray fanning off the lip in fine mist"

✓ "A monumental swell wall stretching across the bay, breaking over a deep-water reef in synchronized peel, white spray rocketing skyward"

✓ "A backlit jade-green crest exploding into diamond spray at the precise moment of break, the lip pluming forward"

✓ "A massive 50-foot face cresting over a shallow reef shelf, lip fanning forward in slow motion, foam churning at the base"

✓ "A thunderous storm-swell wave smashing into a volcanic cliff, spray exploding 100 feet upward in white plume"

✓ "A monumental wave wall breaking against a sea-stack rock formation, spray exploding around the stone in a circular burst"

✓ "A translucent emerald barrel forming over a shallow coral reef, the hollow tube glowing translucent jade from backlight"

✓ "A 60-foot face rising from deep water over a sudden shallow reef shelf, the wave at peak crest about to collapse forward"

✗ BAD — surfer: "Surfer pulling into a tube barrel" (BANNED — zero humans)
✗ BAD — named: "Jaws Maui wave breaking" (BANNED — say "massive wave breaking on shallow reef")
✗ BAD — impossible: "A 50-foot wave wall on flat sand beach" (BANNED — waves break ON reef/cliff/point)
✗ BAD — bioluminescent: "Glowing electric-blue wave" (BANNED — sci-fi)
✗ BAD — architecture: "Wave breaking against a stone pier" (BANNED — natural coast only)

━━━ DISTRIBUTION ━━━

- ~50% intimate (barrel / tube / spray / Clark-Little register)
- ~50% monumental (40-60 foot face / big-wave wall / explosive break on rock)

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE wave moment per entry. Real ocean physics. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
