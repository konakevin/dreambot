#!/usr/bin/env node
/**
 * EPIC_MOMENT_EPOCH_SIGNATURE — production scale-up 2026-06-05.
 *
 * Always-on identity axis for DragonBot's epic-moment path. Names the
 * historical era / culture this castle embodies — Romanesque-cathedral,
 * High-Gothic, Tolkien-Gondorian, GoT Westerosi Stark-grey, etc.
 *
 * Anchors the entire render in a specific architectural register so the
 * castle doesn't fall back to a generic-fantasy-castle prior.
 *
 * Append mode preserves the initial 25 hand-curated entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/epic_moment_epoch_signature.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 8000,
  metaPrompt: (
    n
  ) => `You are writing ${n} EPOCH-SIGNATURE descriptions for DragonBot's epic-moment path — each one names a SPECIFIC historical / fantasy-canon architectural REGISTER the castle embodies. The register anchors the entire render in a recognizable visual era so the castle reads as THIS-specific-era's castle, not generic-fantasy-castle.

Each entry: 25-40 words. Format: "<REGISTER-NAME> register — <2-3 specific architectural elements that define it>, <mood descriptor> mood of <emotional / civilizational quality>."

━━━ THE BAR ━━━
Every entry must (a) NAME a specific era / culture / fantasy-canon lineage, (b) list 2-3 CONCRETE architectural elements (towers, walls, gates, roofs, ornament) that define that era's silhouette, (c) close with a 4-6 word mood phrase capturing the civilization's emotional register. The reader should be able to picture the silhouette from the name alone.

━━━ VARIETY MANDATE — distribute across these lineages ━━━

REAL-WORLD MEDIEVAL ERAS (~12 entries):
- Romanesque (round arches, barrel vaults, squat round towers, monastic-fortress)
- Norman / Crusader (rusticated stone, machicolation, projecting galleries)
- High-Gothic (pointed arches, flying buttresses, lancet tracery, soaring vertical)
- Late-Medieval Tudor (half-timber over stone, oriel windows, prosperous domestic)
- Renaissance fairytale (Neuschwanstein-style ornate spires, theatrical romantic)
- Byzantine eastern (gold-mosaic, rounded domes, iconostasis chapels, sacred opulence)
- Mont-Saint-Michel monastery-castle (tidal-rock, abbey-rings, ascending spire)
- Motte-and-bailey (timber palisade, raised motte, frontier-conquest mood)
- Iberian / Andalusian fortress (horseshoe arches, fortified plateau, sun-scorched)
- Carolingian / Frankish (massive donjon, square keep, raw post-Roman vigor)
- Scottish-Borders tower-house (tall narrow keep, harled walls, clan-feud mood)
- Welsh-Edwardian (concentric rings, twin-tower gatehouses, ruthless-conquest)

TOLKIEN-LEGENDARIUM (~5 entries):
- Gondorian / Minas-Tirith (tiered white-stone rings, beacon-tower)
- Elvish / Rivendell (organic curved stone, slender arched bridges, woodland grace)
- Elvish / Lothlórien (canopy-platforms, tree-trunk pillars, mallorn-leaf gold)
- Dwarven / Erebor (mountain-face gate-columns, geometric pillar-rows, subterranean grandeur)
- Rohirric / Edoras (thatched great-hall, golden roof, carved horse-gables)
- Númenórean ruin (eroded monumental basalt, half-collapsed empire-grandeur)
- Mordor-Barad-dûr (jagged volcanic spires, iron banner-spikes, malevolent)

GAME-OF-THRONES WESTEROSI (~5 entries):
- Stark-grey Winterfell (wind-scoured granite, square drum-towers, stoic northern)
- Lannister-gold Casterly Rock (pale golden limestone, lion keystones, confident power)
- Targaryen-Dragonstone (volcanic basalt, dragon-skull buttresses, apocalyptic fire-dynasty)
- Baratheon-Storm's End (single colossal drum-tower, storm-battered sea-fortress)
- Arryn-Eyrie (vertiginous mountain-perch, slender pale spires, isolated eagle-court)
- Tyrell-Highgarden (rose-overgrown ornate walls, garden-keep ornamental abundance)
- Tully-Riverrun (water-moat triangle, river-locked, knightly courtly mood)

VIDEO-GAME LINEAGES (~7 entries):
- Warcraft Stormwind / Lordaeron (cathedral-white walls, blue-gold banners, heroic high-fantasy)
- Warcraft Undercity necromantic-cathedral (plague-cracked spires, bone-vaulted undercroft)
- Elden Ring Stormveil / Caelid (rune-carved walls crumbling vast, fallen-eternal-kingdom)
- Elden Ring Leyndell golden-city (gilded layered terraces, golden-tree, fallen-grandeur)
- Bloodborne Yharnam Victorian-Gothic (jagged smoke-stained spires, gaslit oppressive)
- Skyrim Solitude Nordic stone-timber (snow-capped walls, timber great-hall, hardy northern)
- Skyrim Markarth Dwemer-ancient (mathematically-precise fitted stone, brass-gear doorways)
- Witcher Northern-Realms (rain-slicked patched stone, half-rotted hoardings, grim survival)
- Witcher Nilfgaardian (precise black-granite ashlar, sun-wheel emblems, imperial cold-authority)
- Dragon Age Tevinter (towering basalt magisterium-spires, magical-imperial grandeur)
- Dark Souls Lordran (rambling stone-mass eroded, kingdom-after-kingdom layered)
- D&D Forgotten Realms Cormyr / Waterdeep (cosmopolitan trade-fortress, layered civic eras)

EXOTIC FANTASY-CANON ANALOGUES (~3 entries):
- Pale-sandstone sultan-palace fortress (ogee-arch towers, filigree screens, fountain-courtyard, opulent sun-drenched)
- Volcanic-glass dragon-cult fortress (obsidian columns, lava-channels, fire-dynasty ritual)
- Frost-bound iron-citadel of the far north (rime-crusted iron walls, frost-giant scale, brutal eternal-winter)

━━━ FORMAT — every entry follows this shape ━━━

"<LINEAGE-NAME> register — <element 1>, <element 2>, <element 3>, <mood adjective> mood of <civilizational / emotional quality>."

Examples:
- "Romanesque-cathedral-castle register — squat round towers flanking a barrel-vaulted nave-keep, painted interior frescoes visible through arrow-slit windows, monastic-fortress mood of grim piety."
- "High-Gothic cathedral-castle register — soaring pointed arches stacked in vertical ranks, flying buttresses leaping outward like stone ribs, lancet-window tracery, dizzying upward-reaching mood."
- "GoT Westerosi Targaryen-Dragonstone register — volcanic dark basalt carved into dragon-skull buttresses and flame-shaped battlements, smoke-blackened towers, apocalyptic brooding mood of ancient fire-dynasty."

━━━ STRICT RULES ━━━
- Western high-fantasy / European-medieval lineage ONLY. NO real-world ethnic-period codes (no Bedouin / Persian / samurai / Aztec / Polynesian / Forbidden-City) — only fantasy-canon analogues are allowed for non-European looks.
- NO sci-fi / cyberpunk / orbital / modern.
- Each register must be NAMEABLE — the reader should recognize it from the name.
- Each entry must list CONCRETE architectural elements — no abstract "majestic" / "imposing" alone.
- The mood phrase at the end is REQUIRED — it carries the civilization's emotional register.
- NO two entries should describe the same register (e.g., only ONE Romanesque, only ONE Stark-grey).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
