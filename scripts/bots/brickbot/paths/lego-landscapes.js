/**
 * BrickBot lego-landscapes path (2026-06-06).
 *
 * Renders famous real-world landscape vistas as LEGO brick landscape
 * dioramas. Pool reuses the wide pure_scene_eligible spots from
 * location_iconic_spots — the same pool the nightly engine pulls from for
 * LEGO scene renders, which means each entry is already curated as a
 * "wide vista a LEGO build could capture as a diorama."
 *
 * Pool entries are { location, scene } objects. The brief composes both
 * into the prompt so the place reads as recognizable (Patagonia / Iceland
 * / Norwegian Fjords / etc.) in LEGO form.
 *
 * Model pinned to gpt-image-2 (matches the nightly LEGO pin — cleanest
 * physical-build read). Set via BrickBot.modelByPath in index.js.
 *
 * Re-extract the pool by running:
 *   node scripts/bots/brickbot/seeds/extract-lego-landscapes-locations.js
 */

module.exports = ({ sharedDNA, vibeDirective, picker, pools }) => {
  const entry = picker.pickWithRecency(
    pools.BRICKBOT_LEGO_LANDSCAPES_LOCATIONS,
    'lego_landscape_location'
  );
  const { location, scene } = entry;

  // Camera comes from the BrickBot-shared CAMERA_AXIS via sharedDNA.
  const camera = sharedDNA.camera;

  return `You are a LEGO brick landscape diorama photographer writing a LEGO MOC-photography scene for BrickBot. Render a famous real-world landscape vista as a wide LEGO brick build — landscape diorama, no characters required (small minifig accents OK but not the subject). The world IS the build.

━━━ THE LOCATION (LOCKED) ━━━
Set in ${location}. The render IS the place — built entirely in LEGO bricks. Honor the place's defining terrain, geology, and atmosphere.

━━━ THE SCENE (the specific vista to build) ━━━
${scene}

━━━ MEDIUM LOCK — NON-NEGOTIABLE ━━━
The entire image is a tabletop photograph of a real LEGO brick build. Every element is made from stacked plastic bricks with visible studs, slight seams between pieces, and unmistakable ABS plastic sheen. Real-physical-LEGO on a handcrafted set — NEVER CGI, NEVER illustration, NEVER smooth photoreal terrain.

Translate every natural element into LEGO vocabulary:
- Terrain (cliffs / mountains / valleys / canyons / dunes / glaciers) → stepped, blocky brick formations with visible plate edges
- Water (ocean / lake / river / waterfall) → translucent blue LEGO tile/plate panels — clear blue for shallow, deep blue for ocean, transparent cyan for waves
- Sky → solid color background or smooth brick backdrop, optional white cloud-brick puffs
- Foliage (trees / palms / ferns) → green plate-piece fronds on brown cylindrical brick trunks
- Weather (rain / snow / mist) → built from translucent or printed brick elements — translucent blue raindrop tiles, white cloud bricks, transparent yellow light-ray plates
- Sun / lighting → warm or cool amber tinting on glossy plastic surfaces; crisp shadows cast onto plate surfaces

DO NOT layer photoreal atmosphere on top of LEGO bricks. DO NOT use realistic landscape language. EVERY noun must be a LEGO piece or LEGO-translated form.

Small LEGO minifig accents (tiny scale-prover figures in distance, faction-themed adventurers, classic Cool Joe cool minifigs) are FINE as background details — but they're scale-provers, not the hero. The LANDSCAPE is the hero.

━━━ CAMERA + FRAMING ━━━
${camera}
Wide diorama framing — show the build at landscape scale. Foreground / midground / background depth all visible. The build's scale + the place's identity both legible.

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the 60-90 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
