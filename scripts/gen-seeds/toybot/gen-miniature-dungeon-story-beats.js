#!/usr/bin/env node
/**
 * MINIATURE-DUNGEON story-beat pool — bespoke per-path (2026-06-06).
 * Tabletop D&D / Warhammer painted-mini register.
 * Verb-led, multi-figure, shared-object/event structure. MVP-25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/miniature_dungeon_story_beats.json',
  total: TOTAL, batch: Math.min(TOTAL, 25), append: APPEND,
  metaPrompt: (n) => `You are writing ${n} TABLETOP-MINIATURE STORY-MOMENT scenarios for ToyBot's miniature-dungeon path. The characters are 28-32mm hand-painted pewter-or-plastic fantasy figures (Warhammer / D&D / Reaper / WizKids DNA) — visible brush-strokes, drybrushed metallic highlights, wash-shaded recesses, flocked round bases. Handcrafted terrain dioramas (sculpted-foam rocks, lichen-trees, plaster ruins, resin-water). Display-cabinet or table-top setting.

━━━ STRUCTURAL MANDATE (every entry, NON-NEGOTIABLE) ━━━
1. OPEN with an active verb (Charging / Casting / Hauling / Climbing / Plunging / Surging / Storming / Vaulting / Detonating / Smashing / Conjuring / Slashing / Parrying / Throwing / Dragging / Discovering / Defending / Igniting).
2. Name ONE shared dungeon object/event 3-5 minis are reacting to (a sprung trap / a closing portcullis / an awakening dragon / a collapsing bridge / a glowing artifact / an erupting fountain / a charging orc warband / a falling chandelier).
3. HARD BAN: "mid-X", "frozen mid-X", "watching", "looking at", "gazing", "stands", "posed", any non-verb opener.
4. Present-tense-active throughout. 3-5 named mini cast roles each doing a DIFFERENT verb.

━━━ FORMAT ━━━
60-90 words, semicolon-separated. Cast roles: dwarf-warrior / elf-mage / halfling-rogue / human-paladin / tiefling-warlock / half-orc-barbarian / gnome-tinkerer / drow-assassin / dragonborn-cleric / wood-elf-ranger / OR opposing forces: goblin-warband / orc-raiders / undead-skeletons / cultist-zealots / kobold-trappers / dragon-boss / lich-king. Terrain context.

━━━ FAMILY SPLIT (5 sub-types ~20% each) ━━━
A) DUNGEON-CRAWL beat (party advancing through corridor / trap-sprung / door-breached)
B) BOSS-BATTLE beat (party vs dragon / lich / demon-prince / hydra / beholder)
C) TAVERN/QUEST-HUB beat (party plotting / drinking / brawling / receiving quest)
D) WILDERNESS-EXPEDITION beat (river-crossing / mountain-pass / forest-ambush / camp-attack)
E) WARGAME-FORMATION beat (lines clashing / cavalry-charge / siege-engine / mass-spell)

━━━ PASS EXAMPLES ━━━
- "Charging the warband across the cobblestone bridge as the dragon's shadow crosses overhead — the dwarf-warrior swings his hammer at the lead goblin-bannerman, the elf-mage hurls a fireball into the second rank, the halfling-rogue rolls between legs to flank, the human-paladin braces shield against an axe-blow, the dragonborn-cleric chants a blessing over the wounded as the dragon banks for another pass"
- "Casting the abjuration circle as the lich-king rises from the sarcophagus and the air ices over — the elf-mage scribes runes in a frantic ring on the floor, two paladins lock shields against the cold wave, the half-orc-barbarian charges the rising lich raising his axe, the rogue sprints toward the side-altar where a holy relic still glows, dust falls from the cracked vaulted ceiling"

━━━ FAIL EXAMPLES ━━━
- "Hand-painted dwarf miniature mid-swing on terrain…" ← pose + noun opener

━━━ HARD BANS ━━━
- NO IP-named characters (no Drizzt, no Aragorn, no Gandalf) — generic fantasy archetypes
- NO real human, NO CGI, NO illustration
- NO solo figures — 3+ cast minimum

JSON array of ${n} strings. Verb-led only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
