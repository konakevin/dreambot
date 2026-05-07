#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/bloombot/seeds/sensory_lightcolor.json',
  total: 120,
  batch: 30,
  metaPrompt: (n) => `You are writing ${n} SENSORY LIGHT/COLOR ANCHOR descriptions for BloomBot — short atmospheric phrases that BloomBot's Sonnet brief weaves into the prose to lock the render's light + color sensation.

Each entry: 12-22 words. A single sensation captured in concrete imagery, all FLORAL or BLOOM-ENVIRONMENT in subject. NO industrial, NO mechanical, NO non-floral imagery.

GOOD EXAMPLES (study the texture):
  • "petals catching backlit gold like stained-glass cathedral panes, every vein illuminated translucent"
  • "violet shadows pooling between bloom-clusters, their depth deeper than the ground itself"
  • "dewdrop refractions scattering tiny prisms across each unfolding petal"
  • "amber sunlight thick enough to taste, pollen suspended in beam-shafts like floating gold"
  • "moonlight turning every white bloom into a small ghost lantern, the air silver-cool"
  • "torch-ginger crowns burning crimson against jungle-shadow, leaf-edges trimmed in fire-orange"
  • "iridescent scarab-blue petal sheen catching the side-light, oil-slick rainbow flicker"
  • "rain-bead lenses on every surface refracting the sky in miniature, scene fractal-jeweled"

VARIETY NEEDED:
  - Times of day: dawn, golden hour, midday, twilight, moonlit, blue-hour
  - Weathers: rain-wet, mist, snow-dusted, fog, frost, thunder-light
  - Light qualities: backlit, rim-lit, shafted, dappled, diffused, hard-direct
  - Color sensations: jewel, pastel-luminous, neon-glow, monochrome, smoky, prismatic
  - Particle/surface: dewdrops, pollen-dust, petal-refractions, water-glints, frost-crystals

HARD RULES:
  - 12-22 words per entry. Single sensation, single image.
  - All entries must be FLORAL/BOTANICAL imagery — no industrial, no mechanical, no anvils, no forges, no galvanized buckets, no hailstones, no bakeries.
  - Specific named colors preferred (cobalt, amber, scarlet, emerald, violet, ivory, gold, copper) over generic ("warm", "cool", "bright").
  - VARY the dominant color across the pool — distribute across the spectrum (red, orange, yellow, green, blue, violet, white, gold). Pink is one color among many — appears in <10% of entries, never as the dominant.
  - No "soft" / "delicate" / "feminine" / "cottagecore" / "blush" / "pretty" tropes.

DEDUP: every entry must use a different color + light-quality combination. Don't repeat the same noun across entries.

OUTPUT: JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
