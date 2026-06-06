#!/usr/bin/env node
/**
 * PIXELBOT_CLASSIC_JRPG_PROPS — atmospheric world props that signal
 * classic JRPG genre on the tile-grid. 40%-gated detail axis. Treasure
 * chest / signpost / pot / fountain / statue / shrine / etc. Title-caps
 * prefix THEN " — " separator THEN ~25-40 word body.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_classic_jrpg_props.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} JRPG-PROP entries for PixelBot's classic-jrpg path — atmospheric tile-grid props that signal a SNES-era JRPG world (Zelda LttP / FF IV-VI / Chrono Trigger / Secret of Mana / Dragon Quest VI / Lufia II / Lunar). Title-caps prefix THEN " — " separator THEN 25-40 word description.

━━━ THE BAR ━━━
Every entry is ONE classic JRPG world prop on the tile-grid. Iconic to the genre — when you see it, it screams "SNES RPG." Named in TITLE-CAPS, described in 25-40 words with material + condition + atmospheric placement.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"SILVER TREASURE-CHEST CLOSED — silver treasure-chest closed on the tile-grid, iron-clasped with faint shimmer on the lid, atmospheric mid-tier loot-discovery prop"
"CROSSROADS SIGNPOST — weathered wooden crossroads signpost at the junction of two dirt-paths with four direction arrows, classic JRPG-overworld exploration marker"
"STONE-DRAGON-STATUE — stone-statue of a coiled dragon mounted on a cracked pedestal at the scene edge, atmospheric mysterious-monument guardian register"
"CENTRAL STONE-FOUNTAIN — central stone-fountain with water cascading from a tiered basin into a lower pool, moss along the rim, classic town-square focal-point"

━━━ VARIETY MANDATE (distribute across these JRPG-prop categories) ━━━

- ~4 TREASURE CHESTS (silver chest closed / gold chest open with light spilling / wooden chest moss-covered / red chest with red runes / locked iron chest / bone-chest of a crypt / bejeweled rare-chest / mimic-chest with teeth)
- ~3 SIGNPOSTS / MARKERS (crossroads signpost / shrine-marker / town-gate sign / boundary-stone / runed-monolith / direction-arrow / hand-painted shop-sign / overworld-pillar)
- ~3 POTS / BREAKABLES (clay-pot cluster / single tall vase / nested-pot stack / cracked-pot leaning / red painted pots / lidded jar / clay urn against wall / overturned pot)
- ~3 STATUES (stone-dragon statue / weeping-angel statue / armored-knight statue / sage-with-staff statue / mermaid-fountain statue / hero-with-sword statue / two-headed beast statue / weathered goddess statue)
- ~3 FOUNTAINS / WATER (central tiered-fountain / mossy-spring well / stone wishing-well / waterfall feature / hot-spring steaming / koi-pond decorative / lily-pad pond / cascading basin)
- ~3 SHRINES / ALTARS (stone altar with offerings / candle-shrine with flickering flames / runed-monolith altar / mossy forest-shrine / temple side-altar / cave-shrine with idol / wayside marker shrine / mountain-pass shrine)
- ~3 SIGNAGE / TAVERN (hanging tavern-sign / weather-vane on roof / hand-painted shop-sign / weapon-shop sign / inn-doorway sign / lantern-on-pole / festival-banner strung / merchant-cart sign)
- ~3 FURNITURE / INTERIOR PROPS (wooden bookshelf packed / weapon-rack with swords / armor-stand with full kit / map-table with scroll / barrel-stack tavern / hearth with pot / canopy-bed in inn / spinning-wheel in cottage)
- ~3 LANTERN / LIGHT (iron-cage lantern / hanging-paper lantern / candelabra of three candles / wall-sconce with flame / fire-pit-with-pot / chandelier of ten candles / torchlit cresset / glowing-rune-floor circle)
- ~3 NATURAL TILE PROPS (gnarled overworld tree / mushroom-cluster patch / glowing-rune-stone pillar / moss-covered fallen log / boulder with carved face / tall grass cluster / stalagmite cluster cave / crystal-cluster outcrop)
- ~3 STORAGE / TOOLS (wooden cart with wheels / hay-bale stack / fishing-net hung / hanging meat / sacks of grain stacked / wooden wheelbarrow / market-basket stack / coiled rope on hook)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- Body is 25-40 words, single phrase or single sentence.
- ALWAYS describe MATERIAL (stone / wood / iron / silver / gold / clay / bronze / etc.).
- ALWAYS specify a register tag ("classic JRPG prop", "atmospheric SNES detail", "town-square focal point", etc.).
- Prop is described in CALM/STILL state — props decorate the scene, no mid-action.

━━━ BANS ━━━
- NO characters / NPCs in this pool — props only.
- NO modern objects (clocks/phones/electronics) — fantasy-medieval register only.
- NO photoreal — 16-bit pixel-art register.
- NO repeating the same prop twice.
- NO setting/landscape language — props only (locales go in jrpg_locale).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
