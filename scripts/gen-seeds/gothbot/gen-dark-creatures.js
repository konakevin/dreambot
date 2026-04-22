#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/dark_creatures.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DARK-FANTASY CREATURE descriptions for GothBot's horror-creature path. Each entry is a creature-as-hero description, MID-ACTION, majestic-evil + gorgeous + terrifying. Entries 20-35 words. Castlevania / Bloodborne / Van-Helsing / Berserk / WoW-undead-warlock-art DNA — painterly dark-fantasy concept-art. Never cheap-horror, never slasher-gore.

━━━ AESTHETIC NORTH STAR — THE NIGHTSHADE VIBE ━━━
Castlevania-game-art bosses, Bloodborne-beasts, Van-Helsing werewolves + vampires, Berserk-apostles, Hellboy-Mignola dark-fantasy creatures, Bram-Stoker-Dracula operatic horror, Devil-May-Cry demon-design. Creatures are GORGEOUS + TERRIFYING simultaneously — beautiful, dangerous, alive. Majestic-evil, never monster-of-the-week cheap, never WoW-undead/forsaken/skeleton aesthetic.

Rich Nightshade palette — deep purples, midnight blues, velvet blacks, poison greens, tarnished silver, with blood-red ACCENTS (never red-dominant, never crimson-monochrome).

━━━ MANDATORY DYNAMIC ACTION ━━━
Every creature is MID-ACTION, never just "standing/posing". Mid-leap from rooftop, mid-lunge across graveyard, mid-unfurl-wings, mid-shriek mouth-open, mid-transform with bones-cracking, mid-howl at blood-moon, mid-stalk through forest mist, mid-glide above moor, mid-emerge from crypt, mid-summon-shadow-tendrils, mid-drink from chalice, mid-kneel over victim (implied-not-gory), mid-turn-to-reveal-face, mid-cast-spell with fel-glow. The picture captures a MOMENT.

━━━ CREATURE TYPE VARIETY (enforce distribution across 200) ━━━

VAMPIRES (min 25):
- Ancient firstborn-vampires with translucent skin and pearl-white fangs
- Vampire queens mid-float above gothic-garden
- Vampire-lords mid-turn from throne with velvet-red-lining cloak
- Vampire-brides mid-rise-from-coffin with veil torn
- Vampire-children mid-whisper with crimson-lipped smile
- Vampire-bat-swarm-merging-into-humanoid

SUCCUBI / INCUBI / DEMON-HUMANOIDS (min 25) — the alluring-danger type:
- Succubus mid-unfurl-bat-wings with pale skin and black silk
- Demon-courtesan mid-pour-goblet with fel-green eyes
- Corrupted-angel-turned with tattered-wings and broken-halo
- Lamia mid-coil with serpent-lower-body on moonlit steps
- Incubus mid-whisper with shadow-wreath rising from shoulders

WEREWOLVES (min 20):
- Massive lycan mid-transformation — half-human half-beast, silver backlight
- Pack-alpha mid-howl at blood-moon on cliff-edge
- Werewolf mid-leap across gothic-courtyard
- Shadow-fur lycan mid-crouch on gargoyle-ledge

DEMONS / FEL-SPAWN (min 20):
- Winged demon mid-descent with obsidian horns and ember-eyes
- Shadow-demon mid-rise from smoke-rift
- Fel-wreathed void-spawn mid-manifest in ritual-circle
- Horned demon mid-kneel-to-summon with flaming sigil

WRAITHS / PHANTOMS / BANSHEES (min 20):
- Tattered-robe wraith mid-glide through cathedral hall
- Banshee mid-shriek with flowing-hair in translucent white
- Skeletal phantom mid-drift over graveyard fog
- Robed lich mid-float with skull-mask and blue-ember eyes

ELDER VAMPIRES / ANCIENT PREDATORS (min 20) — replaces undead-royalty:
- Ancient vampire elder mid-rise from velvet coffin, fangs bared
- Bram-Stoker-Dracula-archetype vampire mid-stalk through moonlit crypt
- Vampire matriarch mid-command bat-swarm at cliff edge
- Ancient firstborn vampire mid-unfurl black silk cloak over viewer

WENDIGOS / GHOULS / HUNGRY-THINGS (min 15):
- Antlered wendigo mid-stalk through snow-forest with emaciated body
- Ghoul mid-scurry between crypts
- Emaciated horror mid-emerge from mausoleum doorway

HELLHOUNDS / DARK BEASTS (min 15):
- Massive black hound mid-lunge with ember-eyes and smoke trailing
- Skeletal horse mid-gallop with flaming-mane
- Shadow-leopard mid-pounce from rooftop
- Raven-sized hellbird mid-dive at viewer

DARK-FANTASY DRAGONS / SERPENTS (min 15):
- Skeletal gothic-dragon mid-unfurl tattered wings on ruin-tower
- Serpent-king mid-coil with gold-crown and petrifying gaze
- Cursed wyrm mid-breath with fel-green flame

ELDRITCH / ANCIENT-HORROR (min 15):
- Tentacle-mouth mindflayer mid-psychic-projection
- Kraken mid-emerge from gothic-harbor with moonlit tentacles
- Void-spawn mid-rift-open from dimensional tear

━━━ VISUAL DETAIL MANDATE ━━━
Each creature entry must include 3-4 specific details: distinguishing anatomy (fangs/claws/horns/wings/fur/scale/bone), color/glow (ember-eyes, crimson-veins, fel-green fire, pale-silver skin, shadow-wreath), texture (tattered-silk, matted-fur, cracked-stone, wet-skin), and setting-anchor (moonlit cliff, blood-moon graveyard, cathedral-spire, foggy moor, cursed-village). Specific details prevent generic fantasy-creature description.

━━━ RULES ━━━
- Gorgeous + terrifying + majestic-evil (never cheap-horror, never slasher-gore, never on-the-nose satanic)
- Mid-action MANDATORY — never "standing/posing"
- Stylized dark-manga-horror concept-art (Castlevania / Bloodborne / Van-Helsing / Hellboy / Bram-Stoker-Dracula DNA) — NOT fantasy-book-cover
- NO skeletons, NO lich, NO death-knight, NO WoW-forsaken, NO bone-monarch, NO crowned-skeleton (undead-WoW is OFF)
- NO pentagrams, NO satanic iconography, NO red-red-red monochrome — use Nightshade palette (deep purples + midnight blues + velvet blacks + poison greens + tarnished silver, blood-red as ACCENT only)
- No named IP (no Dracula, no Sylvanas, etc.)
- Every entry visibly distinct in creature-type + action + setting combination
- Min 50 entries in outdoor settings (moor, forest, cliff, courtyard, graveyard, blood-moon sky)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
