#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/lego_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LEGO-LANDSCAPE scene descriptions for ToyBot's lego-epic path — landscape-dominant composition with either (A) NO minifigure at all, or (B) ONE off-center minifigure in a specific body-shaping pose, with the LEGO-built landscape as the compositional frame. Every element is LEGO brick-built.

Each entry: 15-25 words. ONE specific LEGO-landscape scene.

━━━ THE MIX ━━━
- ~30% of entries: Type A — pure LEGO-built landscape, NO minifigure, NO characters. The brickwork IS the subject.
- ~70% of entries: Type B — ONE off-center LEGO minifigure executing a specific body-shaping pose/action within a LEGO-built landscape. Lead with the BODY POSITION, not the activity. Never centered-hero composition — landscape dominates the frame.

━━━ TYPE B POSE CANON (rotate across these — never cluster) ━━━
Lead with the specific body-position in the first 5-8 words:
- KNEELING (on one knee / both knees / planting a flag / examining brick-ground)
- CROUCHED / SQUATTING (peering over brick-cliff-edge / hiding behind brick-boulder / studying tracks)
- SEATED (on brick-log / brick-bench / brick-rock / mountain-summit / dangling feet off ledge)
- RECLINING / LYING (prone-rifleman style / stargazing on back / swimming in transparent-brick water)
- LEANING (against a brick-column / over a brick-rail / far forward / far back)
- MID-STRIDE (running across a bridge / hiking up a trail / striding through snow)
- REACHING (up to grab a brick-branch / far forward / both arms extended / pulling rope)
- CLIMBING (scaling a brick-wall / halfway up a ladder / mid-traverse on rope)
- LEAPING / JUMPING (mid-air off a brick-cliff / leaping a chasm / vaulting over obstacle)
- BENT (double-over to examine / bending to pick up / bent over brick-map)
- TILTED / TWISTED (head thrown back to look up / torso twisted to look behind / rotating to face threat)
- DANGLING / HANGING (from a brick-branch / off a brick-ledge / from grappling-hook)

━━━ TYPE B EXAMPLES (body-shaping pose + LEGO-landscape context) ━━━
- "Kneeling LEGO minifigure planting a tiny flag on a brick-cliff summit, vast brick-mountain-range below, wind-swept cape-piece"
- "Crouched minifigure peering over the edge of a transparent-brick waterfall, brick-spray mid-splash, forest-canopy below"
- "Seated minifigure on a brick-log beside a transparent-brick campfire in dense pine-brick forest, brick-moon overhead"
- "Mid-stride minifigure running across a stone-brick bridge over a chasm, brick-waterfall thundering below, cape-piece flaring"
- "Climbing minifigure halfway up a vertical brick-cliff with pickaxe-piece swung, snow-brick-dust falling, alpine-brick peaks distant"
- "Reaching minifigure stretching up to pluck a glowing-transparent-brick fruit from a jungle-brick canopy vine, ancient temple behind"
- "Leaping minifigure mid-vault across a ravine between two brick-cliff platforms, water-brick rushing far below"
- "Lying prone minifigure atop a brick-ridge with binocular-piece to helmet, brick-valley village scoped out below"
- "Leaning minifigure against a brick-lighthouse rail, storm-brick clouds rolling, crashing-brick waves slamming the rocks"
- "Bent double minifigure examining glowing-transparent-brick crystal formations in a cave, headlamp-piece casting beam"
- "Dangling minifigure from a brick-tree-branch above a river, one hand reaching for a scrolled treasure-map-piece"
- "Tilted minifigure head-back staring up at a brick-aurora sky above an icy-brick plain, breath-steam piece visible"

━━━ TYPE A EXAMPLES (pure LEGO landscape, ZERO minifigures) ━━━
- "LEGO tropical island with brick-palm-trees, transparent-brick ocean, sandy-plate-beach, no figures anywhere"
- "LEGO medieval castle ruins on brick-cliff overlooking brick-valley at dusk, no minifigures in frame"
- "LEGO futuristic cyberpunk skyline — transparent-brick neon-signs, brick-rain streaks, no figures in alleys"
- "LEGO volcanic island — orange-transparent lava flowing down grey-brick slopes, ash-cloud-piece rising, uninhabited"

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference LEGO / brick / plate / minifig / transparent-piece / plastic-brick LANGUAGE explicitly
- LANDSCAPE dominates composition — the environment fills the frame
- Type A = zero characters. Type B = exactly ONE minifigure, OFF-CENTER, body-shaping pose first
- Dedup aggressively: across 50 entries, max 4 per pose-family, max 2 per landscape-type (don't cluster jungles / castles / deserts)

━━━ BANNED ━━━
- NO centered-hero minifigure composition — landscape must dominate
- NO two+ minifigures in a single entry — solo figure only (keeps composition from going busy)
- NO passive verbs ("standing" / "posing" / "looking" / "facing camera")
- NO real-brand LEGO set names
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
