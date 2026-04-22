#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// Dry-run mode when --dry is passed: generate just 12 entries for brief validation.
const TOTAL = process.argv.includes('--dry') ? 12 : 200;

generatePool({
  outPath: process.argv.includes('--dry')
    ? '/tmp/gothic-structures-dryrun.json'
    : 'scripts/bots/gothbot/seeds/gothic_structures.json',
  total: TOTAL,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GOTHIC STRUCTURE scenes for GothBot's gothic-architecture path. The STRUCTURE is the hero — every render is a showcase of extreme gothic architecture with dark-magic light animating it. Entries 25-40 words. NO humans as primary subject.

━━━ NON-NEGOTIABLE RULE — WARM + COOL LIGHT MIX IN EVERY ENTRY ━━━

Every entry MUST specify BOTH a COOL ambient light source AND a WARM accent light source — baked into the prose, not a separate afterthought. The renderer needs two distinct-temperature hues to avoid monochromatic black-and-white output.

- COOL ambient (pick one): moonlit-silver / twilight-violet / midnight-blue / aurora-cyan / sapphire-nocturne / violet-dusk / silver-starlight / necro-pale-blue / blacklight-purple / pre-dawn-indigo
- WARM accent (pick one from inner dark-magic light-source list below): amber-candle / orange-torch / forge-ember / alchemist-gold / amber-window / amber-lantern / pink-moon-glow
- OR: a specialty-hue accent PLUS either warm or cool: witch-fire-green + moonlit-silver, fel-violet + amber-candle, poison-green + twilight-lavender, crimson-stained-glass + sapphire-night, etc.

Pure one-color scenes are BANNED. Entries that say only "alchemist-gold glow" with no cool ambient are BANNED. Entries that say only "moonlit silver" with no warm accent are BANNED. Two distinct temperature-band hues minimum per entry, explicitly named.

━━━ THE AESTHETIC ━━━
Dark gothic fantasy 11/10 — blown-out extreme gothic cathedrals, abbeys, churches, chateaux, keeps, mausoleums, watch-towers, bell-towers, clock-towers, observatories, crypts (exteriors), flower gardens, ornate graveyards, bridges, aqueducts, gothic quarters. Think: Castlevania stage-architecture, Crimson Peak Allerdale Hall, Bloodborne Cainhurst castle, Bram Stoker's Dracula's castle, Van Helsing Transylvanian fortresses, Hellboy cursed basilicas. The kind of architecture that makes the viewer stare and want to wander through.

━━━ STRUCTURE IS THE HERO ━━━
The scene is ABOUT the building — not a landscape with a distant castle dot. The architecture fills the frame or dominates composition. Ornate gothic detail stacked — flying buttresses, pointed spires, rose-windows, pinnacles, crockets, tracery, wrought-iron gates, stone crosses, gargoyles, grotesques, bat-motif finials, dragon-head water-spouts, vaulted arches, saint-statues, stone angels, carved stonework, obsidian columns, rib-vaulted exteriors, ornamental parapets. Hyper-detailed gothic-horror architecture porn.

━━━ LIT BY DARK MAGIC FROM WITHIN ━━━
Every structure has INNER LIGHT leaking out through windows / rose-windows / cracks / doorways / beneath buttresses — NOT from the sun or moon outside. The inner light sources vary hard per entry:
- Violet spell-glow from inside a witch-tower
- Fel-green warlock flame leaking through stained-glass
- Amber candle-procession visible through narrow slit-windows
- Sapphire necromantic pulse from a cracked crypt gate
- Blacklight aurora bleeding from a cathedral dome
- Witch-fire emerald from a monastery lantern-row
- Alchemist-gold glow from a tower-top laboratory
- Ember-orange forge-light from an underground reliquary
- Pale-silver ghost-glow from abandoned ballroom windows
- Crimson accents from a single inner-altar (accent only, never dominant)
- Violet-and-silver moonlit-reflected glow playing on wet stone walls
- Poison-green aurora refracting through shattered stained-glass

━━━ ACCENT CREATURES (OPTIONAL, SMALL DETAIL ONLY) ━━━
Small atmospheric accents allowed when they enhance the scene — NEVER a primary subject:
- A crow or raven perched on a gargoyle ledge
- A bat-swarm spilling out of a bell-tower
- A distant gargoyle silhouette coming alive on the rooftop
- A tiny hooded figure ascending stairs in the distance (silhouette only, unidentifiable)
- A wolf silhouette in the courtyard
- A pale-ghost wisp drifting past a window
Keep these ACCENT-SIZED — the structure dominates 80%+ of the visual weight.

━━━ VARIED STRUCTURE TYPES — ROTATE HARD ━━━
- Cathedrals (rose-windowed naves, flying-buttress exteriors, bell-tower giants)
- Abbeys / monasteries (courtyard clusters, cloister-wings, bell-towers)
- Chateaux / castle-residences (spired multi-winged Victorian-gothic palaces)
- Keeps / fortresses (defensive stone with ornamental gothic overlays)
- Watch-towers / observatories (singular tall vertical structures)
- Clock-towers (massive gear-visible gothic clock-faces)
- Crypts (exterior) / mausoleums (free-standing ornate tombs)
- Churches / chapels (smaller singular buildings with heavy ornament)
- Necropoli / ossuaries (multi-tiered tomb architecture)
- Gothic flower gardens + architecture (conservatories, glass-domed black-rose greenhouses, weeping-willow courtyards, iron-gated rose-maze pavilions)
- Gothic bridges / aqueducts (architectural spans as subject)
- Gothic harbors / dockyards (lighthouses, seawalls, iron piers)
- Witch-towers (spiraled singular towers, crooked architecture)
- Gothic-quarter cityscapes (row of gothic buildings tight-packed)
- Gothic theaters / opera-houses (ornate performance buildings)
- Gothic academies / libraries (stacked spire-crowned scholarly architecture)

━━━ GEOGRAPHY / SETTING VARIETY ━━━
- Cliff-top
- Mountain-peak
- Valley floor
- Coastal cliff / seaside
- Fjord / island
- Dense forest
- Moorland / heath
- Canyon / gorge
- Desert / wasteland
- Frozen / arctic / glacier
- Swamp / bog
- Dense urban gothic-quarter
- Countryside estate
- Hillside / bluff
- Lake-shore / tarn
- Volcanic / lava-field
- Rainforest / fermented-jungle
- Plains
Rotate the geography so the same structure type NEVER repeats in the same terrain.

━━━ WEATHER / TIME-OF-DAY VARIETY ━━━
Rotate hard: storm-wracked, lightning-flash, fog-choked, blizzard, misty dawn, violet twilight, aurora-lit, moonlit, rain-slick, snow-blanketed, pre-dawn cold-blue, magic-hour, eclipsed-moon, starlit, witch-fire-aurora, blacklight night, candle-hour.

━━━ NIGHTSHADE PALETTE + HUE-PAIR MANDATE ━━━
Deep purples, midnight blues, velvet blacks, poison greens, witch-fire green, fel-violet, blacklight, moonlit silver, twilight lavender, candle-amber, torch-orange, forge-ember, alchemist-gold, tarnished-silver. Red/crimson is RARE accent (single window, single lantern, single rose). NEVER whole-structure crimson-lit.

REINFORCEMENT: every entry names 2-3 distinct-temperature hues (cool ambient + warm inner-light accent minimum; specialty-hue third accent welcome). Re-read the non-negotiable rule at the top.

━━━ HARD BANS ━━━
- NO humans / figures as primary subject (only accent creatures at tiny detail scale)
- NO red-red-red monochrome — Nightshade palette only
- NO blood-moon dominating sky (max 10 entries feature blood-moon)
- NO pentagrams / satanic iconography
- NO "looking through archway at distant gothic building" cliché
- NO generic "castle on cliff" — push ornate architecture detail, not just silhouette
- NO interior shots — exterior-dominant architecture as subject

━━━ DEDUP MANDATE ━━━
You will be shown prior entries. READ THEM. Do NOT repeat the same structure + geography + weather + inner-light combination. Every entry is a fresh showcase.

━━━ RULES ━━━
- 25-40 words per entry
- Structure dominates the frame
- Inner dark-magic light mandatory
- Ornate gothic architectural detail stacked
- Varied structure + geography + weather + light-source
- Accent creatures only (small detail, never hero)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
