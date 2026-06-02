#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_lineage_actions.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} RACE-FLAVORED PEACEFUL ACTION entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (12-22 words) describing a SIGNATURE peaceful / candid / atmospheric moment that lets a fantasy lineage's flavor SHINE — drawing on canonical D&D / LOTR / WoW / Elder Scrolls / Witcher / Pathfinder / Eberron iconography.

ABSOLUTELY NO BATTLE SCENES. NO COMBAT. NO MID-STRIKE. NO DYING / DEAD / WOUNDED. NO VIOLENCE. These are PEACEFUL moments that ONLY a specific lineage would do, written generically enough to render with whatever race the path has rolled. Sonnet sees the race entry + the lineage action and builds a coherent peaceful moment.

━━━ ACTION SPREAD (enforce variety across ${n}) ━━━

ELVEN-ARCHETYPE ACTIONS (5-6, peaceful elf canon):
- mid-step on a tree-branch hundreds of feet above the forest floor, weight perfectly balanced, eyes scanning canopy
- reading from an ancient elven tome by candlelight, fingers tracing a glowing rune on the page
- weaving a glyph in the air with a single fingertip, runic light trailing behind the gesture without intent
- braiding a small wildflower into long hair while seated on a moss-covered stump
- listening at the base of a great tree, palm pressed to the bark, eyes closed in concentration
- restringing a longbow at a wooden bench in golden afternoon light, full concentration on the gut-string

DRAGONBORN / SCALED ACTIONS (3):
- breathing controlled flame onto a forge-anvil with practiced precision, sparks rising into cool air
- warming hands at a campfire, scaled palms catching the warmth, wisps of breath in cold night
- slowly running a clawed fingertip along a runic etching in stone, reading by touch

TIEFLING / FIENDISH ACTIONS (3):
- letting infernal flame curl gently around the wrist by candlelight, fire dancing along forearm without burning
- horns silhouetted against tavern firelight, head bent over an open spellbook
- adjusting the tail-tip absentmindedly while reading by lamplight in a quiet study

DROW / DARK-ELF ACTIONS (2-3):
- moving through pure shadow like through water, drow-cloak swallowing all light around
- balancing along a stalactite-ridge in the Underdark, no torch needed for those night-cursed eyes
- tracing a Lolth-prayer in the air with a single fingertip, faint silver-violet light following

DWARVEN ACTIONS (2-3):
- braiding a small bone-clasp into a long forked beard with practiced muscle-memory by firelight
- reading a stone-rune by torchlight, fingers tracing carved letters older than memory
- pouring stout from a wooden cask into a clay mug at a low tavern table

ORCISH / TUSKED ACTIONS (2):
- shouldering a massive pack with one arm at a mountain trailhead, breath visible in cold dawn air
- studying a hand-drawn map at a tavern table, brow furrowed beneath bone-piercings, tusks softly visible

BEAST-FOLK / SHIFTER ACTIONS (3-4):
- raising muzzle to scent the wind on a high ridge, ear-tufts pricked toward an interesting smell
- grooming a ruff of neck-fur with a silver comb at a wooden bench in low candlelight
- catching a falling leaf on a clawed fingertip with the agility of a born predator
- curled comfortably into a corner armchair at a tavern, tail wrapped around feet

CONSTRUCTED / WARFORGED ACTIONS (1-2):
- runic eye-slits flickering as constructed-self runs a dawn-routine system check, mechanical limbs flexing
- kneeling to inscribe a new runic line onto an exposed forearm-plate, hammer and chisel in hand

CELESTIAL / AASIMAR ACTIONS (1-2):
- raising a palm to let warm golden divine-light spill softly into a cold bed-chamber, lighting it gently
- chanting a quiet celestial prayer at dawn on a cliff-edge, light gathering around the head

━━━ RULES ━━━
- Each entry is a RACE-FLAVORED PEACEFUL MOMENT — uses canonical iconography from that lineage
- 12-22 words — vivid + specific + paintable
- The action must REVEAL the race — non-elf races wouldn't do this action this way
- NEVER name the race in the entry itself — just describe the action so any matching race fits
- Suitable for BOTH male and female warriors
- ABSOLUTELY NO battle / combat / weapon-IN-USE / violence
- Weapons can be HOLSTERED / SHEATHED / being MAINTAINED — never IN COMBAT USE
- Calm / curious / contemplative emotional tone

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
