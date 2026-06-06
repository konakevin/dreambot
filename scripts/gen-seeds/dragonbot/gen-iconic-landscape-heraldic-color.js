#!/usr/bin/env node
/**
 * ICONIC_LANDSCAPE_HERALDIC_COLOR — production scale-up to 200.
 *
 * Heraldic-palette anchors for DragonBot's iconic-landscape path. Each entry
 * names a SPECIFIC named two-or-three-color signature (pine-and-mist /
 * blood-and-bronze / silver-and-moonstone / amethyst-and-silver) plus the
 * three palette elements (sky / mid-ground / shadow) and a mood-tag. Washes
 * the entire vista in this exact color signature.
 *
 * Mirrors the existing 25 entries' register exactly:
 *   "<hyphenated-color-name> palette — <3 named-color-element descriptors>,
 *   breathing <mood-tag> <register>."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/iconic_landscape_heraldic_color.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} HERALDIC-PALETTE anchors for DragonBot's iconic-landscape path. Each entry names a SPECIFIC named 2-or-3 color signature (pine-and-mist / blood-and-bronze / silver-and-moonstone / amethyst-and-silver / sea-foam-and-sapphire) plus three concrete palette-element descriptors (sky / mid-ground / shadow) and a closing mood-tag. The render washes the entire vista in this exact color signature.

Each entry: 20-32 words, ONE sentence. Format strictly:
"<Hyphenated-color-name> palette — <named-color-element-1>, <named-color-element-2>, <named-color-element-3>, breathing <mood-tag> <register-word>."

━━━ EXAMPLE REGISTER (mirror this exactly) ━━━

  "Pine-and-mist palette — deep viridian canopy, silver-ash fog, pale celadon understory light, breathing serene primordial-forest mood."
  "Blood-and-bronze palette — arterial crimson sky, tarnished bronze ridgelines, charcoal stone shadow, breathing smoldering saga-warrior register."
  "Slate-and-snow palette — blue-grey granite faces, chalk-white snowfields, cold pewter cloud-shadow, breathing stark alpine-solitude mood."
  "Silver-and-moonstone palette — pale argent sky, iridescent cloud-pearl, frost-white ground reflection, breathing hallucinatory arctic-dreamscape mood."
  "Aurora-pink-and-violet palette — rose-blush sky ribbon, deep amethyst polar night, pale silver ice-sheet, breathing hallucinatory arctic-fey mood."

━━━ VARIETY MANDATE — distribute the ${n} entries roughly across these palette categories ━━━

(roughly equal counts — do NOT cluster on one category)

1. **FOREST / GREEN PALETTES** — pine-and-mist, moss-and-amber, jade-and-gold, forest-gold-and-deep-green, fern-and-emerald, malachite-and-honey, moss-and-pewter, mistflower-and-moonglow, holly-and-snow, ivy-and-rust.

2. **VOLCANIC / FIRE PALETTES** — lava-orange-and-obsidian, ember-and-shadow, sulfur-yellow-and-coal, ash-and-blood, dragonfire-and-iron, magma-and-soot, ember-and-bone, crimson-and-charcoal, pyre-and-soot, hearth-amber-and-ash.

3. **DESERT / AMBER PALETTES** — ochre-and-flame, sandstone-and-cobalt, dune-gold-and-twilight, copper-and-mirage, brass-and-cinnamon, sun-bleached-bone-and-rust, oasis-jade-and-amber, saffron-and-ink.

4. **COASTAL / OCEAN PALETTES** — sea-foam-and-sapphire, kelp-green-and-bronze, abyssal-blue-and-pearl, storm-coast-and-iron, coral-and-ink, tide-silver-and-cobalt, shipwreck-amber-and-deep-green, brine-and-flint.

5. **MOUNTAIN / ALPINE PALETTES** — slate-and-snow, granite-and-silver, iron-and-frost, dawn-amber-and-cobalt, glacier-blue-and-bone, peak-rose-and-cobalt, pinegold-and-stone, scree-and-cloud.

6. **AURORA / FEY PALETTES** — aurora-pink-and-violet, amethyst-and-silver, fey-emerald-and-rose, mooncress-and-cobalt, prism-pearl-and-violet, wisp-blue-and-amber, fairy-fire-and-pale-gold, glamour-rose-and-mist.

7. **TWILIGHT / SUNSET PALETTES** — amber-and-shadow, rose-and-gold, blood-and-bronze, copper-and-bruise, saffron-and-rust, sun-pillar-and-storm-grey, harvest-amber-and-cobalt, autumnfire-and-iron.

8. **NIGHT / MOON PALETTES** — silver-and-moonstone, moonglow-and-pearl, star-salt-and-indigo, witchlight-and-pewter, midnight-cobalt-and-silver, ghost-pale-and-iron, vow-blue-and-bone, eclipse-bronze-and-violet.

9. **AUTUMN / DECAY PALETTES** — autumn-russet-and-burgundy, rust-and-ash, fallen-leaf-and-charcoal, bog-amber-and-iron, decay-gold-and-soot, last-leaf-and-bone, ember-russet-and-grey, mead-amber-and-rust.

10. **WINTER / FROST PALETTES** — ice-blue-and-pearl, iron-and-frost, frostbright-and-bone, silver-snow-and-cobalt, white-hush-and-pewter, blizzard-pearl-and-iron, glacier-rose-and-bone.

11. **APOCALYPTIC / RUIN PALETTES** — ash-and-blood, sulfur-yellow-and-coal, ruin-bone-and-rust, cursed-violet-and-soot, fallen-empire-amber-and-ash, ragnarok-orange-and-pitch, plague-green-and-iron.

12. **SACRED / TEMPLE PALETTES** — gold-and-lapis, ivory-and-cobalt, oracle-pearl-and-rose, sanctum-amber-and-jade, ward-silver-and-violet, blessing-rose-and-gold.

━━━ STRUCTURE — NON-NEGOTIABLE ━━━

Each entry MUST contain ALL FOUR of:

1. The PALETTE NAME — hyphenated 2-or-3-color compound (e.g., "Pine-and-mist" / "Blood-and-bronze" / "Aurora-pink-and-violet" / "Ash-and-blood") followed by " palette — " with em-dash.

2. THREE NAMED COLOR-ELEMENTS — each names a specific scene element + a specific named color (NOT generic "blue" — name the specific shade: "viridian canopy" / "tarnished bronze ridgelines" / "silver-ash fog" / "pale celadon understory light" / "arterial crimson sky" / "charcoal stone shadow"). Three of these, comma-separated.

3. The "breathing" PHRASE — "breathing <2-3 word mood-tag>" (e.g., "breathing serene primordial-forest" / "breathing smoldering saga-warrior" / "breathing apocalyptic volcanic" / "breathing hallucinatory arctic-fey").

4. The CLOSING REGISTER-WORD — "mood." or "register." or "atmosphere." (one of these three, no fourth option).

━━━ NAMED-COLOR VOCABULARY (use specific shade-names, not generic colors) ━━━

GREENS: viridian, malachite, emerald, jade, celadon, sea-foam, kelp-green, hunter-green, sage, fern, moss, olive, beryl, jadestone, pine-needle.

REDS: crimson, arterial-red, scarlet, vermilion, carnelian, garnet, blood-orange, wine-red, oxblood, ruby, ember-red.

YELLOWS / GOLDS: aureate, honey-gold, brass, ochre, saffron, amber, antique-gold, brass-gold, sun-pillar-gold, harvest-amber.

BLUES: cobalt, sapphire, prussian, indigo, slate, blue-grey, glacier-blue, cerulean, lapis, midnight-cobalt, sky-blue, pale-celestial.

VIOLETS / PURPLES: amethyst, lavender, mauve, plum, bruised-violet, fey-violet, royal-purple, dusk-purple.

NEUTRALS: argent, silver, pearl, ivory, bone, chalk, pewter, charcoal, soot, ash, slate-grey, iron, basalt-black, obsidian-black.

ORANGES / BRONZES: bronze, copper, tarnished-bronze, rust, sienna, burnt-umber, tangerine, ember-orange.

━━━ STRICT BANS ━━━

- NO generic color names alone: NO "red", "blue", "green" without a shade-modifier.
- NO franchise proper nouns.
- NO characters in the palette descriptor.
- NO modern-industrial colors (no "neon-pink", "fluorescent-green", "plastic-blue", "chrome").
- NO duplicate palette-names across the ${n} entries — each palette must be uniquely named.
- NO weak registers ("nice mood", "pretty mood") — every "breathing" phrase must be evocative.
- NO entries that omit any of the 4 structural elements.

━━━ STRICT FORMAT ━━━

- ONE sentence per entry. No internal periods (except the closing).
- 20-32 words.
- Strip apostrophes from possessives.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each entry follows the format exactly.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
