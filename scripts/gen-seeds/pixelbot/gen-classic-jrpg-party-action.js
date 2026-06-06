#!/usr/bin/env node
/**
 * PIXELBOT_CLASSIC_JRPG_PARTY_ACTION — single hero or 2-4 party
 * members walking / examining / mid-cutscene / mid-action on the
 * tile-grid. 16-bit classic JRPG genre (Zelda LttP / FFIV-VI / Chrono
 * Trigger / Lufia II / Dragon Quest VI / Earthbound / Terranigma).
 * Title-caps prefix THEN " — " separator THEN 35-55 word description.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_classic_jrpg_party_action.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PARTY-ACTION entries for PixelBot's classic-jrpg path — a single hero OR 2-4 party members walking / examining / mid-cutscene / mid-action on the tile-grid. SNES classic-JRPG register (Zelda LttP / FFIV-VI / Chrono Trigger / Dragon Quest VI / Lufia II / Terranigma / Earthbound / Lunar). Title-caps prefix THEN " — " separator THEN 35-55 word description.

━━━ THE BAR ━━━
Every entry is ONE party moment on the tile-grid. Either SOLO HERO (~60% of entries) or 2-4 party members (~40%). Always tiny sprite scale ("tiny sprite ~1/15 of frame", "small sprite on the tile-grid"). Always a present-tense mid-action verb (mid-stride / mid-cast / mid-examine / mid-leap / mid-conversation). The action is exploratory/cutscene/light-combat, NOT full party-versus-boss (that's jrpg-combat path).

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"SOLO GREEN-TUNIC KID WALKING — solo kid in green-tunic with short-sword sheathed mid-stride across the tile-grid foreground, classic Zelda-LttP-style tiny sprite ~1/15 of frame, mid-walk pose, left-foot forward, arms swinging naturally"
"SOLO ROBED MAGE CASTING — solo robed mage with tall-staff held aloft mid-magic-cast on the tile-grid, glowing-blue magic-circle radiating beneath mage feet, robe billowing, tiny sprite ~1/15 of frame, classic SNES-JRPG mid-cast pose"
"SOLO ARMORED WARRIOR AT TREASURE-CHEST — solo armored warrior with shield strapped to back crouched beside a wooden-treasure-chest mid-opening, glowing-yellow light spilling from the lid, tiny sprite on tile-grid, classic loot-discovery pose"

━━━ VARIETY MANDATE (distribute across these archetypes) ━━━

Solo hero exploration / action (~60% of entries):
- ~5 WALKING / EXPLORING (green-tunic kid mid-stride, princess mid-walk, knight mid-march, mage mid-stride with staff, ranger mid-stride with bow drawn, samurai mid-step, monk mid-walk, ninja mid-creep)
- ~4 EXAMINING WORLD-PROPS (warrior at treasure-chest, kid reading signpost, mage at altar, ranger at footprint, princess at fountain, sage at runic monolith, scholar reading scroll)
- ~4 MID-CAST / MID-ATTACK (mage mid-fireball-cast, cleric mid-prayer-heal, ranger mid-bow-draw, knight mid-sword-slash, monk mid-roundhouse-kick, samurai mid-katana-draw)
- ~3 RUNNING / URGENCY (princess mid-run, kid mid-run-with-sword-out, knight mid-charge across tile-grid, ranger mid-leap-over-river, ninja mid-leap, mage mid-dash)
- ~2 CUTSCENE POSE (kid at cliff-edge looking out, princess gazing at sky, knight kneeling at gravestone, sage standing with arms crossed)
- ~2 LIGHT COMBAT SOLO vs ENEMY (kid mid-sword-strike at slime, knight mid-shield-block vs bat, ranger mid-arrow at skeleton)

Multi-character party action (~40% of entries):
- ~4 PARTY WALKING / MARCHING (knight + mage + cleric trio mid-march on tile-grid, warrior + ranger + thief mid-stride, samurai + monk + druid mid-march in formation, paladin + sorcerer + healer four-class mid-stride)
- ~3 PARTY CUTSCENE / CONVERSATION (princess + knight + sage facing each other in throne-room tile-grid, hero + companion + NPC mid-conversation, party gathered around campfire, party at world-map crossroad)
- ~3 PARTY EXAMINING (party gathered around glowing-rune-circle, party at chest-discovery moment, party reading ancient stone-tablet, party at fountain together)
- ~3 PARTY MID-COMBAT-MOMENT (party mid-formation vs slime cluster, warrior front + mage back + cleric flanking facing bat-swarm, party trio mid-action vs orc-trio, hero + companion mid-engage skeleton)
- ~2 PARTY ARRIVAL / DEPARTURE (party mid-entering temple, party mid-leaving town gate, party mid-disembarking ship, party crossing river-stones)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, starting with "SOLO" or "PARTY" or named-trio, then " — " separator.
- Body is 35-55 words.
- ALWAYS include sprite-scale signal: "tiny sprite ~1/15 of frame" or "small sprite on the tile-grid".
- ALWAYS specify mid-action verb (mid-stride / mid-cast / mid-examine / mid-conversation / mid-attack).
- ALWAYS anchor to "tile-grid" or "foreground" or "tile-floor".

━━━ BANS ━━━
- NO modern weapons / firearms / sci-fi tech — fantasy classes only.
- NO photoreal — 16-bit SNES pixel sprite register.
- NO huge sprite scale — must be tiny sprite-sized.
- NO repeating exact same class moment.
- NO boss-level combat — keep light/exploratory.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
