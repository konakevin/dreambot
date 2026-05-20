#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_landscape_resident_activities.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} TINY-RESIDENT ACTIVITY descriptions for ChibiBot cozy-landscape — what the SOLO tiny creature is DOING somewhere in the wider cozy world. The resident is a TINY scale-prover (small but visible), going about their day with a STORY-driven activity. NOT a pose, NOT centered hero — they're a small element in the larger frame.

Each entry: 15-25 words. ONE specific story-driven activity featuring a SINGLE solo creature. Active verb-led. The activity should imply a NARRATIVE moment — the viewer can see what the creature is doing AND read a tiny story.

━━━ FORMAT REQUIREMENT — ACTIVE VERB ━━━

Every entry MUST start with an active verb describing what the creature is DOING:
✓ "Walking a cobblestone path carrying a tiny package wrapped in twine..."
✓ "Sitting on a porch step reading a tiny letter with steam from cocoa curling up..."
✓ "Hauling a basket of acorn-cups up a stone staircase, leaning forward with the weight..."
✓ "Tending a window-box of flowers with a brass watering-can the size of its head..."
✓ "Skipping along a wooden bridge with a kite trailing in the breeze..."
✓ "Pushing a tiny wheelbarrow of pumpkins up a garden path..."
✓ "Peeking out a Dutch door with a tray of fresh-baked muffins..."
✓ "Hanging laundry on a tiny line strung between two cottages..."
✓ "Mid-leap onto a stepping stone across a stream..."
✓ "Rolling a barrel down a cobblestone lane..."

━━━ HARD POSE-BANS ━━━

NO static poses. The creature is ALWAYS in mid-action:
✗ "Standing on a path looking around"
✗ "Sitting by a lantern"
✗ "Watching the sunset"
✗ "Gazing at the village"

━━━ SHARED OBJECT / EVENT REQUIREMENT ━━━

Every entry MUST involve a CONCRETE PROP the creature is interacting with (basket, package, watering-can, kite, laundry-basket, wheelbarrow, tray, brush, broom, letter, lantern, parcel, fishing-rod, paper-boat).

━━━ CATEGORY DISTRIBUTION ━━━

- 25% TRAVEL / WALKING (walking a path carrying a parcel / hauling a basket up stairs / skipping along a bridge with a kite / pushing a wheelbarrow / rolling a barrel / leading a tiny cart)
- 20% DOMESTIC / CHORE (hanging laundry / sweeping a porch / tending a window-box / watering a garden / shaking a rug out a window / washing dishes on a balcony)
- 15% RECEIVING / DELIVERY (mid-receive of a letter from a tiny mail-bird / handing a basket of muffins to a neighbor's door / accepting a parcel through a Dutch door / delivering newspapers door-to-door)
- 15% TENDING (tending a garden bed / pruning rose-bushes with a tiny ladder / sorting flowers in a market stall / arranging fruit in a bushel-basket / mending a net on a dock)
- 10% PLAY / LEISURE (flying a kite mid-run / fishing from a pier with a tiny rod / paddling a paper-boat across a puddle / playing hopscotch on cobblestones)
- 10% READING / LEISURE-INDOOR (reading a tiny letter on a porch / writing in a journal at a market stall / painting at an easel by a window / studying a star-chart on a roof)
- 5% MID-DISCOVERY (mid-pick of a single perfect strawberry from a garden / mid-pluck of a daisy from a meadow / mid-find of a glowing pebble on a path / mid-open of a found treasure-chest)

━━━ DEDUP ━━━

Dedup by: verb + prop + posture/location. "walking a path with a basket" and "carrying a basket down a road" are duplicates.

━━━ HARD BANS ━━━

- NO setting language (no "in the village" / "by the cottage")
- NO time / weather / creature-species (creature picked separately)
- NO pose-coded language (see HARD POSE-BANS)
- NO single-paragraph descriptions of multiple creatures (this path is SOLO resident)
- NO scary / sad / threatening

━━━ OUTPUT ━━━

JSON array of ${n} strings. Each begins with an active verb.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
