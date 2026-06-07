#!/usr/bin/env node
/**
 * SPACE-SAGA story-beat pool — bespoke per-path (2026-06-06).
 * Vintage Kenner 1977-1985 Star Wars 3.75-inch action-figure register.
 * Note: this path's medium IS IP — Star Wars characters and locations ARE
 * allowed per the path file. Verb-led, multi-figure, shared-event. MVP-25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/space_saga_story_beats.json',
  total: TOTAL, batch: Math.min(TOTAL, 25), append: APPEND,
  metaPrompt: (n) => `You are writing ${n} VINTAGE-KENNER-STAR-WARS STORY-MOMENT scenarios for ToyBot's space-saga-figures path. The figures are 3.75-inch Kenner 1977-1985 hand-painted action-figures — bubble-card-mint paint quality, swivel-waist or limited-articulation, signature gear molded as part of body. Star Wars characters AND locations ARE allowed per the path's medium lock (this is unique to this path). Real-physical-toys on handcrafted Kenner-style playset dioramas.

━━━ STRUCTURAL MANDATE (every entry, NON-NEGOTIABLE) ━━━
1. OPEN with an active verb (Charging / Firing / Hurling / Slashing / Piloting / Sneaking / Hauling / Escaping / Storming / Vaulting / Igniting / Boarding / Crashing / Smashing / Conjuring / Force-Pushing).
2. Name ONE shared event 2-3 vintage-Kenner figures are reacting to (a lightsaber duel / a TIE-fighter strafing run / a sandcrawler hauling / an exploding control panel / a closing blast-door / a charging stormtrooper squad / a hyperdrive failing / Vader entering the cargo bay).
3. HARD BAN: "mid-X", "frozen mid-X", "watching", "looking at", "gazing", "stands", "posed", any non-verb opener.
4. Present-tense-active throughout. 2-3 named Star-Wars-figure cast roles each doing a DIFFERENT verb (the path uses 2-3 figures per render, not 3-5).

━━━ FORMAT ━━━
60-90 words, semicolon-separated. Named characters allowed: Luke / Leia / Han / Vader / Yoda / Boba Fett / Stormtroopers / R2-D2 / C-3PO / Chewbacca / Obi-Wan / Greedo / Ewoks / Tusken Raiders / Wampa / Snowtrooper / Sandtrooper / Lando / Admiral Ackbar etc. Iconic locations and ships: Tatooine / Hoth / Endor / Dagobah / Bespin / Death Star corridor / Mos Eisley cantina / X-wing / TIE Fighter / Millennium Falcon / AT-AT / Sandcrawler / Sarlacc Pit.

━━━ FAMILY SPLIT (5 sub-types ~20% each) ━━━
A) CANTINA / MARKETPLACE moment (Mos Eisley brawl / smuggler-deal / bounty-hunter-corner)
B) SPACE-BATTLE / COCKPIT moment (X-wing dogfight / TIE-fighter strafe / hyperspace-jump)
C) GROUND-BATTLE (Hoth AT-AT / Endor speeder / Death Star corridor)
D) LIGHTSABER-DUEL moment (Vader-vs-Luke / Obi-vs-Anakin / Yoda-training)
E) ESCAPE / RESCUE moment (Death Star escape / Carbon-freeze / Sarlacc rescue / Hoth evac)

━━━ PASS EXAMPLES ━━━
- "Firing his blaster down the Death Star corridor as the stormtrooper squad rounds the bend behind them — Han Solo fires from the lead position rolling sideways, Luke Skywalker covers the rear with his lightsaber ignited deflecting bolts, Chewbacca hurls a thermal detonator past the squad as Leia drags an injured rebel toward the closing blast-door, the corridor walls show the bubble-card paint-chip detail of the Kenner-playset"
- "Piloting the X-wing through the trench as the TIE-fighters close from behind — Luke Skywalker locks the targeting computer one-handed, Wedge Antilles fires from a flanking X-wing detonating a TIE in a green flash, R2-D2's dome chirps from the astromech-socket as a near-miss explodes off the cockpit, the trench walls show the painted-styrene texture of the Kenner-Death-Star-playset"

━━━ FAIL EXAMPLES ━━━
- "Luke Skywalker action figure mid-saber-stance on Tatooine…" ← pose + noun opener
- "The Stormtrooper stands guard…" ← banned opener + reaction-only

━━━ HARD BANS ━━━
- NO real soldier / real person language, NO CGI, NO illustration
- NO solo figures — 2-3 cast minimum (per the path's compositional roll)
- Use the BUBBLE-CARD-MINT paint-chip aesthetic — vintage Kenner specifically

JSON array of ${n} strings. Verb-led only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
