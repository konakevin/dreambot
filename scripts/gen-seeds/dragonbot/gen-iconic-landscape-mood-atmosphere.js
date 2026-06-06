#!/usr/bin/env node
/**
 * ICONIC_LANDSCAPE_MOOD_ATMOSPHERE — production scale-up to 200.
 *
 * Overall-scene-mood anchors for DragonBot's iconic-landscape path. Each entry
 * names a SPECIFIC mood (epic-dawn / blood-twilight / silent-noon / aurora-night
 * / fog-shrouded / storm-prelude / etc.) and the chromatic + atmospheric register
 * that breathes it into the scene. Sets the emotional DNA of the painted vista.
 *
 * Mirrors the existing 25 entries' register exactly:
 *   "<mood-name> mood — <light/color descriptor>, breathing <emotional-tone>
 *   into <the scene>."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/iconic_landscape_mood_atmosphere.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MOOD-ATMOSPHERE anchors for DragonBot's iconic-landscape path. Each entry names a SPECIFIC overall scene-mood (epic-dawn / blood-twilight / silent-noon / aurora-night / fog-shrouded / storm-prelude / fey-twilight / eclipse-noon) and the chromatic + atmospheric register that breathes it into the landscape. Sets the EMOTIONAL DNA of the painted vista.

Each entry: 18-30 words, ONE sentence. Format strictly:
"<Mood-name>-<modifier> mood — <2-3 specific light/color descriptors>, breathing <emotional-tone phrase> <into / across / through> the <scene-context>."

━━━ EXAMPLE REGISTER (mirror this exactly) ━━━

  "Epic-dawn mood — rose-gold radiance erupting across the horizon, breathing triumphant world-beginning optimism into every stone and summit."
  "Blood-twilight mood — crimson-soaked sky bleeding into bruised violet, breathing melancholy-saga dread across the dying embers of daylight."
  "Aurora-night mood — cascading emerald and violet curtains rippling overhead, breathing otherworldly wonder through every frost-glittered surface below."
  "Storm-prelude mood — sickly yellow-green light thickening beneath charcoal cloudbanks, breathing mounting dread into every trembling leaf and banner."
  "Eclipse-noon mood — bruised bronze-dark sky snuffing the midday sun dead, breathing cosmic dread and apocalyptic wrongness across the silenced land."

━━━ VARIETY MANDATE — distribute the ${n} entries roughly across these mood categories ━━━

(roughly equal counts — do NOT cluster on one category)

1. **DAWN MOODS** — epic-dawn, first-light, copper-dawn, silver-dawn, frostbright-dawn, blood-dawn, mist-dawn, war-horn-dawn, awakening-dawn, prophecy-dawn

2. **TWILIGHT / DUSK MOODS** — blood-twilight, golden-dusk, saga-dusk, fey-twilight, harvest-evening, ember-dusk, ash-dusk, mourner-dusk, prophecy-dusk, victory-dusk

3. **NOON / MIDDAY MOODS** — silent-noon, eclipse-noon, blade-noon, oracle-still, suspended-noon, burning-noon, sun-pillar-noon, judgment-noon

4. **NIGHT MOODS** — aurora-night, star-dense midnight, moon-silvered, fey-night, wolfsong-night, blizzard-night, dragon-shadow-night, witchlight-night, deep-vow-night, fallen-king-night

5. **STORM / VIOLENT-WEATHER MOODS** — storm-prelude, blizzard-edge, hailbreak, thunderhead-arrival, ragnarok-edge, tempest-wall, hurricane-eye, lightning-vigil

6. **MIST / FOG MOODS** — fog-shrouded, mist-bound, marsh-veil, pre-dawn vapor, glamour-fog, sea-haze, mountain-mist, valley-shroud

7. **SACRED / ORACULAR MOODS** — oracle-still, sanctum-hush, leyline-charged, portal-storm-prelude, blessing-hour, awakening-cantrip, judgment-charged, vision-quickening

8. **MELANCHOLY / ELEGIAC MOODS** — melancholy-autumn, aftermath-of-battle, exile-evening, fallen-empire-noon, last-hearth-cold, abandoned-watch, ruin-quiet, witness-the-end

9. **TRIUMPHANT / HEROIC MOODS** — triumphant-spring, dawn-of-conflict, banner-raised, hero-returns, kingdom-restored, oath-fulfilled, victory-light

10. **SEASONAL EXTREMES** — desolate-winter, blizzard-edge, blossom-storm, harvest-glow, deep-autumn, midsummer-blaze, frost-pierced, thaw-creeping

11. **MAGICAL / OTHERWORLDLY MOODS** — leyline-charged, portal-storm-prelude, fey-twilight, glamour-fog, wyrd-still, planar-bleed, dreamscape-veil, witchlight-charged

12. **APOCALYPTIC / END-OF-AGE MOODS** — ragnarok-edge, eclipse-noon, aftermath-of-battle, world-ending-vigil, fallen-empire-dusk, ash-rain, dragon-pyre, cursed-noon

━━━ STRUCTURE — NON-NEGOTIABLE ━━━

Each entry MUST contain ALL THREE of:

1. The MOOD NAME — hyphenated, 2-3 word, ends in " mood —" (with em-dash).

2. The LIGHT / COLOR DESCRIPTOR — 2-3 specific named colors or named light qualities ("rose-gold radiance" / "sickly yellow-green light" / "blue-black vault salted with cold fires" / "bruised bronze-dark sky" / "silver-grey luminescence" / "fierce clean gold" / "pearl-white diffused luminescence" / "blood-orange sky shredded by black volcanic cloud").

3. The EMOTIONAL-TONE phrase — "breathing <2-4 word emotional descriptor>" — and where it lands ("into every stone and summit" / "across the dying embers of daylight" / "through every frost-glittered surface below" / "across the silenced land" / "into the held-breath pre-dawn world").

━━━ EMOTIONAL-TONE VOCABULARY (use varied registers — do NOT default to "dread") ━━━

WONDER-register: triumphant world-beginning optimism / charged magical wonder / otherworldly wonder / cosmic awe / vast humbling wonder / electric wonder / radiant blessing / quickening hope / sacred recognition

MELANCHOLY-register: melancholy-saga dread / mournful beauty / nostalgic melancholy / dreamlike melancholy and ancient loneliness / hollow exhausted melancholy / quiet ruin / exile-bitterness / autumn-finality

DREAD-register: mounting dread / world-ending dread / cosmic dread / electric foreboding / suffocating wrongness / blade-edge tension / apocalyptic wrongness / breath-held terror

SERENITY-register: serene mystical uncertainty / suspended serenity / fragile hopeful serenity / oracle-stillness / hush-of-the-ancients / cathedral-quiet / dawn-stillness / vow-quiet

HEROIC-register: solemn epic gravitas / restless awakening energy / wild-hearted freedom / exultant renewal / hard-won hope / banner-raised triumph / oath-charged resolve / saga-momentum

━━━ STRICT BANS ━━━

- NO weak vocabulary: NO "moody", "magical", "atmospheric", "vibe" as standalone descriptors.
- NO franchise proper nouns.
- NO characters / heroes in the descriptor.
- NO sci-fi / cyberpunk / neon / modern.
- NO duplicate mood-names across the ${n} entries — each mood must be uniquely worded.
- NO entries that omit the "breathing <emotional-tone>" phrasing — that's the load-bearing structural element.
- NO entries that name only one color (need at least 2 named hues OR 1 specific named-light-quality + 1 atmospheric texture).

━━━ STRICT FORMAT ━━━

- ONE sentence per entry. No internal periods.
- 18-30 words.
- Strip apostrophes from possessives.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each entry follows the format exactly.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
