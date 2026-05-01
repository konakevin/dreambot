#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_lineage_actions.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} RACE-FLAVORED ACTION entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (12-22 words) describing a SIGNATURE action that lets a fantasy lineage's flavor SHINE — drawing on canonical D&D / LOTR / WoW / Elder Scrolls / Witcher / Pathfinder / Eberron iconography.

These are NOT generic battle actions and NOT race descriptions — they are MOMENTS that ONLY a specific lineage would do, written generically enough to render with whatever race the path has rolled. Sonnet sees the race entry + the lineage action and builds a coherent moment.

━━━ ACTION SPREAD (enforce variety across ${n}) ━━━

ELVEN-ARCHETYPE ACTIONS (5-6, drawing on elf canon):
- stringing a hand-crossbow with a single fluid motion, bolt-tip stained dark with poison
- mid-step on a tree-branch hundreds of feet above the forest floor, weight perfectly balanced
- pulling a longbow at full draw with three fingers in classical archer-form, eye sighting down the shaft
- weaving a glyph in the air with a single fingertip, runic light trailing behind the gesture
- drawing a graceful curved scimitar from a back-sheath in one continuous motion, blade catching dawn-light
- reading from an ancient elven tome by candlelight, fingers tracing a glowing rune on the page

DRAGONBORN / SCALED ACTIONS (3-4):
- inhaling deeply, throat-scales swelling and glowing as breath-fire builds in the lungs
- exhaling a controlled burst of flame onto a forge-anvil with practiced precision
- catching a thrown spear in mid-flight with reptilian reflexes, scales flexing
- biting through a chain in one snap of fanged jaws, pieces falling to the floor

TIEFLING / FIENDISH ACTIONS (3-4):
- channeling infernal flame to curl around the wrist, fire dancing along the forearm without burning skin
- flicking a tail-tip dismissively at a much larger opponent who's about to learn a lesson
- horns catching a single beam of moonlight, expression unreadable in the half-light
- letting eyes shift to full slit-pupil in a moment of focus, infernal heritage visible

DROW / DARK-ELF ACTIONS (3-4):
- emerging from shadow with a hand-crossbow already leveled, bolt-tip glistening with sleep-poison
- stepping into pure darkness like into water, drow-stealth cloak swallowing all light around them
- balancing along a stalactite-edge in the Underdark, no torch needed for those night-cursed eyes
- weaving spider-silk into a hidden net with practiced fingers, faint Lolth-prayer on the lips

DWARVEN ACTIONS (2-3):
- forging mid-strike with a massive hammer at a glowing rune-blade on the anvil, sparks flying
- reading a stone-rune by torchlight, fingers tracing carved letters older than memory
- braiding a beard-clasp into the long forked beard with practiced muscle-memory

ORCISH / TUSKED ACTIONS (2-3):
- flexing tusks in a feral grin at a fallen weapon held aloft as trophy
- shouldering a massive war-axe with one arm like it weighs nothing
- letting out a guttural roar that echoes off canyon walls, breath visible in cold air

BEAST-FOLK / SHIFTER ACTIONS (3-4):
- dropping into a low feline crouch mid-stalk, claws extended and silent
- catching a falling cloak in mid-leap with the agility of a born predator
- shifting partial form mid-sprint, hands flexing into clawed reach
- raising muzzle to scent the wind, ear-tufts pricked toward an approaching threat

CONSTRUCTED / WARFORGED ACTIONS (2):
- runic eyes flaring brighter as combat-protocols engage, mechanical limbs locking into stance
- inscribing a new battle-rune onto an exposed chest-plate by hand, mid-meditation

CELESTIAL / AASIMAR ACTIONS (1-2):
- raising a hand and letting golden divine-light spill from the palm, banishing a lesser darkness
- chanting a celestial prayer in the moment before drawing a glowing-rune blade

━━━ RULES ━━━
- Each entry is a RACE-FLAVORED MOMENT — uses canonical iconography from that lineage
- 12-22 words — vivid + specific
- The action must REVEAL the race — non-elf races wouldn't do this action this way
- NEVER name the race in the entry itself — just describe the action so any matching race fits
- Suitable for BOTH male and female warriors
- Avoid mythical creatures that aren't humanoid (no full-dragon actions)
- One entry MUST involve a dragon-bond moment (signature DragonBot)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
