#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_cascade_motion.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CASCADE MOTION entries for a MangaBot ghibli-painterly keyframe. This is the DRIFT-ELEMENT — waterfalls / petals / fireflies / lanterns / spores — that keeps the frame from being a static postcard. Multiple drift-elements per entry are encouraged.

Each entry: 12-20 words. ONE or TWO specific drift-elements with directional language (cascading down / drifting upward / spiraling outward).

VARIETY (25 bespoke entries):
- 25% WATERFALLS cascading down the architecture or cliff
- 20% SAKURA / CHERRY PETALS drifting / raining / swirling
- 15% FLOATING LANTERNS rising / drifting up the scene
- 10% FIREFLY-CLOUDS drifting through the foliage
- 10% AUTUMN LEAVES spiraling / falling
- 10% GLOWING SPORES / POLLEN drifting in light beams
- 5% CONFETTI-OF-PETALS in mass-swirl
- 5% STREAM-OF-DEW running down stones / leaves

DO write:
- Twin waterfalls cascade down either side of the cathedral spire, fanning into rainbow mist at the base
- Sakura petals drift in pink rain across the foreground, settling on the stone steps and lantern bases
- Floating lanterns rise from the river into the night sky, hundreds of warm pinpricks ascending past the pagoda
- Firefly-cloud of bioluminescent mint-cyan drifts through the cedar canopy, blinking in the deep dark
- Autumn maple leaves spiral down from the eaves in copper and amber, gathering at the stone-step base
- Glowing golden spores drift in lazy spirals through the god-ray sunbeams, suspended in the bright air
- A mass-swirl of cherry petals catches the wind around the spire, spiraling upward like a confetti vortex
- Streams of dew run down the moss-covered stones in tiny silver threads, catching the light
- Waterfall AND petals — cascading water down the cliff face PLUS sakura drift across the spray-mist

DO NOT write:
- Empty static frame
- Hero-character motion (no running figure)
- Mechanical motion (no spinning gears / no clockwork)
- Vehicle / aircraft motion
- Photoreal physics

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
