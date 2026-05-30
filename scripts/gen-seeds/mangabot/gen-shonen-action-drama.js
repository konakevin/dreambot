#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BATTLEFIELD DRAMA entries — 50%-gated peak combat events in scene around hero. Visible secondary focal point, NOT eclipsing him.

Each entry: 14-22 words. Drama + combat-aesthetic + frame placement.

VARIETY:
- 22% MASSIVE-POWER-RELEASE (energy-wave erupting outward from his attack / domain-expansion barrier rippling outward / power-blast at peak with shockwave / cataclysmic spell-burst at midground)
- 18% ENVIRONMENTAL-DESTRUCTION (tower collapsing in deep distance / mountain splitting at horizon / earthquake-crack rippling toward viewer / lava-plume erupting at midground)
- 14% CELESTIAL/STORM (lightning-pillar striking sky to ground beside him / aurora-cascade rippling overhead / blood-moon eclipse forming / meteor shower at deep distance)
- 12% SPIRIT-MANIFESTATION (giant spirit-beast materializing behind him / familiar-zanpakuto manifesting at peak / shikigami-army forming in deep midground / domain-creature emerging)
- 10% ENEMY-COUNTER (boss-silhouette rising at midground with own power-aura / clashing-energy-wave from off-frame / enemy-form materializing at deep distance)
- 8% FIRE-ERUPTION (volcanic-eruption at midground / firestorm sweeping deep distance / flame-tornado spiraling / hellfire-rift opening)
- 6% TIME-DISTORTION (time-stop ripple frozen at frame edge / dimensional-rift cracking sky / impossible-mirror-image flashing / temporal-glitch debris)
- 4% CURSED-AURA (cursed-domain rippling outward / shadow-realm seeping in / void-tendrils erupting / dark-mist swallowing midground)
- 4% TEAM-FORMATION (allied silhouettes charging at deep distance / partner mid-leap-to-assist / team-charge formation at horizon)
- 2% PRECISION-BEAM (focused beam-of-light from his attack cutting sky / piercing-arrow at peak trajectory / sniper-bullet trail flashing)

DO write:
- Cyan energy-wave erupting outward from his palm-blast, shockwave-ring radiating in deep midground
- Tower collapsing in deep distance behind him, dust-pillar rising as concrete shears apart
- Lightning-pillar striking from sky to ground beside him, white-hot fork illuminating scene
- Giant fox-spirit familiar materializing behind him, three tails coiling around midground
- Boss-silhouette rising at midground with own crimson power-aura, eyes glowing through smoke

DO NOT: drama positioning hero back-to-camera. Drama he's facing-away-to-admire. Visible enemy with blood/wounds. Photoreal cinematography.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
