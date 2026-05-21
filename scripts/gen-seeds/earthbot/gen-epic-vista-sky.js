#!/usr/bin/env node
/**
 * EarthBot epic-vista — SKY_LAYER axis (what the sky is doing).
 *
 * Default: clean cobalt with minimal cloud. Distinctive cloud forms
 * (mammatus, lenticular, anvil, cirrus mare's-tails, nacreous) when
 * scene-natural. NEVER stacked with phenomena/optical-effects — those
 * live in the phenomenon axis.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_sky.json',
  total: 100,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SKY entries for EarthBot epic-vista — ONE sky condition per entry, describing what the sky is DOING above the vista.

━━━ THE BAR ━━━

The sky frames the landscape — at vista scale it's often 40-60% of the frame. Each entry describes ONE sky condition (clean cobalt / mammatus / lenticular / cirrus / sunset gradient / etc.). NOT a phenomenon (rainbow / sun-pillar / aurora — those go in phenomenon axis). NOT lighting (golden hour / blue hour — those go in lighting axis). Just what cloud forms / sky color / texture is happening overhead.

━━━ FORMAT (NON-NEGOTIABLE) ━━━

Each entry: 12-22 words. Describe:
- Sky color base (cobalt / indigo / peach / violet / pearl-grey / etc.)
- Cloud form (clean clear / cirrus / mammatus / lenticular / anvil / sea-of-cloud / six-color-gradient / etc.) — ONE form
- Visible texture (clean / wisped / stacked / banded / etc.)

ONE sky condition per entry. NEVER stack ("mammatus AND lenticular AND nacreous all at once").

━━━ EXAMPLES ━━━

✓ "Cobalt clear sky deepening to indigo zenith, single high cirrus brush far above, otherwise unbroken"
✓ "Mammatus cloud underside hanging from anvil deck, bulbous pouches catching warm late-afternoon light"
✓ "Lenticular cloud wave-disc stack hovering motionless above the peak, classic mountain-wave UFO-shape"
✓ "Post-storm sky breaking into ragged blue holes, ragged-edge cloud-fragments scattered to horizon"
✓ "Six-color sunset gradient: salmon at horizon through coral, magenta, violet, indigo, to deep-blue zenith"
✓ "Pre-dawn velvet sky, last brightest stars fading near horizon, eastern horizon barely peach"
✓ "Iridescent nacreous mother-of-pearl cirrus tinted rainbow at twilight (real polar phenomenon)"
✓ "Anvil thunderhead column dominating the horizon, sunlit cumulonimbus top against indigo base"
✓ "Wispy cirrus combed by high winds into mare's-tail streaks across cobalt"
✓ "Sea of cloud filling the valley below summit vantage, peaks emerging like islands from cloud-ocean"
✓ "Star-field sky overhead, Milky Way arching, no moon, sharp pinpoint clarity (night scenes only)"
✓ "Towering cumulus columns marching across the sky, sharp cauliflower-tops against cobalt"

✗ BAD — stacks phenomena: "Sky with rainbow AND sun-pillar AND mammatus AND aurora" (phenomena and aurora go in phenomenon axis)
✗ BAD — adds lighting language: "Sunset-gold sky with raking light across foreground" (lighting goes in lighting axis)
✗ BAD — sci-fi: "Twin moons visible" (BANNED — Earth has one moon)
✗ BAD — fantasy: "Cloud-shaped like dragon" (BANNED — no creature-cloud-shapes)

━━━ CATEGORY DISTRIBUTION ━━━

- ~30% Clean cobalt / minimal cloud (default)
- ~25% Cloud-feature-led (mammatus / lenticular / anvil / cumulus / cirrus mare's-tails)
- ~15% Sunset / sunrise gradient (multi-color horizon-to-zenith)
- ~10% Post-storm break-up (ragged blue holes / clearing-storm fragments)
- ~10% Pre-dawn / twilight / star-fade
- ~5% Sea-of-cloud / inversion (valley-cloud below summit)
- ~5% Night-sky star-field (Milky Way / clean star pinpoints — for night scenes only)

━━━ HARD BANS ━━━

- NO multi-moons / twin-suns / triple-moons
- NO cloud-leviathans / whale-shaped / dragon-shaped / serpentine sky-creatures
- NO galaxies "above sunset" (Milky Way ONLY appears in pure-night sky entries)
- NO phenomena (rainbows / sun-pillars / aurora — separate axis)
- NO sci-fi / fantasy / magical sky descriptions

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
