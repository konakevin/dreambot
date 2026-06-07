/**
 * PixelBot pixel-landscapes path (2026-06-06).
 *
 * Renders famous real-world landscape vistas as 16-bit pixel-art landscape
 * scenes. Pool mirrors BrickBot's lego-landscapes path — wide
 * pure_scene_eligible spots from location_iconic_spots — so both bots
 * draw from the same curated set of "wide vistas that work as a built
 * scene" but render in their own medium register.
 *
 * Pool entries are { location, scene } objects. The brief composes both
 * into the prompt so the place reads as recognizable (Patagonia / Iceland
 * / Norwegian Fjords / etc.) in pixel-art form.
 *
 * Model: default PixelBot rotation (no per-path pin).
 *
 * Re-extract the pool by running:
 *   node scripts/bots/brickbot/seeds/extract-lego-landscapes-locations.js
 * (the script writes the same data to both bots' seed dirs).
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const entry = picker.pickWithRecency(
    pools.PIXELBOT_PIXEL_LANDSCAPES_LOCATIONS,
    'pixel_landscape_location'
  );
  const { location, scene } = entry;

  return `You are a 16-bit JRPG / SNES-era pixel-art world-map artist writing a PIXEL-LANDSCAPE scene for PixelBot. Render a famous real-world landscape vista as a wide pixel-art world-map screen — the kind of evocative overworld vista you'd see in Final Fantasy VI / Chrono Trigger / Secret of Mana / Terranigma / Lufia II. The world IS the scene. Tiny optional sprite figures (caravan / lone traveler / airship silhouette) are FINE as parallax accents but NEVER the hero.

━━━ THE LOCATION (LOCKED) ━━━
Set in ${location}. The render IS the place — built entirely in pixel-art tiles. Honor the place's defining terrain, geology, and atmosphere.

━━━ THE SCENE (the specific vista to render) ━━━
${scene}

━━━ MEDIUM LOCK — NON-NEGOTIABLE PIXEL-ART ━━━
The entire image is intentional pixel art — every pixel placed with purpose, grid-aligned, hard pixel edges throughout. 16-bit SNES / Genesis register: richer palette than 8-bit, dithered shading for gradients, expressive but limited color count, era-appropriate sprite work. NEVER smooth, NEVER anti-aliased, NEVER vector-illustrated, NEVER photoreal.

Translate every natural element into pixel-art vocabulary:
- Terrain (cliffs / mountains / valleys / canyons / dunes / glaciers) → clustered pixel blocks with stepped silhouettes and dithered shading
- Water (ocean / lake / river / waterfall) → animated wave-tile pixel patterns, dithered between two or three blues with hard pixel edges
- Sky → horizontal pixel-band gradients (era-appropriate palette — limited 4-6 color sky bands)
- Foliage (trees / palms / ferns) → pixel sprite trees: chunky green pixel canopy on brown pixel trunk, single-tile leaves for shrubs
- Weather (rain / snow / mist) → pixel rain streaks, cloud-sprite clusters, dithered fog tiles
- Sun / lighting → pixel highlights with hard edges, dithered shadow zones, era-appropriate color count

DO NOT use photoreal nouns. DO NOT use smooth gradients beyond the era's dithering technique. EVERY noun must be a pixel-art element or pixel-translated form.

Optional parallax depth — 2-4 layers (foreground / midground / distant / backdrop) with HARD pixel-edges between them. The depth makes the world-map register read.

━━━ PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ PALETTE ━━━
${sharedDNA.scenePalette}
${sharedDNA.colorPalette}

Output ONLY the 60-90 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
