#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/night_meadow_interactions.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} STORY-BEAT INTERACTIONS for ChibiBot night-meadow — each entry is a HIGH-ACTION NARRATIVE EVENT happening to a pair of adorable critters under the night sky. NOT poses. NOT reactions to off-screen things. NOT "both looking at X". These are ACTIVE VERB-LED MOMENTS where the pair is DOING SOMETHING TOGETHER with a SHARED PHYSICAL OBJECT or with EACH OTHER directly.

━━━ FORMAT REQUIREMENT (NON-NEGOTIABLE) ━━━

Every entry MUST start with an ACTIVE VERB describing what the pair is DOING (mid-action). The verb describes a physical interaction with a concrete object OR with each other. Examples of acceptable verb-leads:
✓ "Scrambling to catch..."
✓ "Mid-toss of..."
✓ "Tipping over a..."
✓ "Saving a..."
✓ "Stacking..."
✓ "Hauling..."
✓ "Pulling apart..."
✓ "Handing..."
✓ "Dropping..."
✓ "Spilling..."
✓ "Sneaking up on..."
✓ "Tackling..."
✓ "Lifting..."
✓ "Squeezing into..."
✓ "Climbing onto..."
✓ "Hiding inside a..."
✓ "Wrapping..."
✓ "Mid-tumble down..."

Unacceptable (these are POSES disguised as interactions):
✗ "Wide-eyed at..." (this is a reaction, not an action)
✗ "Gazing at..." (pose)
✗ "Looking at each other..." (pose)
✗ "Watching..." (pose)
✗ "Pointing at..." (low action — only acceptable if part of a larger active beat)
✗ "Mouths open at..." (reaction-only)
✗ "Both leaning toward..." (pose)
✗ "Pressed together watching..." (pose)

The verb MUST imply physical motion, contact with a thing, or a force being applied.

━━━ SHARED OBJECT / EVENT REQUIREMENT ━━━

Every entry MUST include a SPECIFIC PHYSICAL OBJECT or EVENT they're interacting with. Not just "the sky" or "the stars". Something they can TOUCH, MOVE, OR DROP. Examples:
- a glowing acorn / a tipping lantern / a kicked-over jar of fireflies
- a folded paper-airplane / a wrapped present / a found-treasure chest
- a giant moonflower / a tower of pebbles / a discovered glowing pebble
- a snowball-sized seedpod / a fallen branch / a stack of acorn-cups
- a paper boat / a kite / a tied-up balloon
- a half-eaten cookie / a spilled tea / a dropped pastry
- a sleeping baby creature they just found / a hatching egg
- each other's tails / paws / hats / scarves (direct contact counts as a shared object)

━━━ HARD POSE-BANS ━━━

The following are FORBIDDEN entry shapes (they will render as static product-shots, not story moments):
- "Two creatures standing"
- "Sitting close together"
- "Pressed cheek-to-cheek"
- "Both standing side-by-side"
- "Holding paws facing each other"
- "Curled together asleep" (unless something is happening, like "one snoring loud as the other reaches to cover its ears mid-laugh")
- "Gazing up at the stars" / "looking up at the moon" (replace with "both diving into a pile of fallen-stars" or "stacking pebbles to reach the lowest star")
- "Mirrored pose"
- "Synchronized" anything (synchronized = pose, not story)

Each entry: 20-35 words. ONE specific high-action story-beat. ONE active verb + ONE shared object/event + body-language showing the action mid-flight.

━━━ STORY-BEAT CATEGORIES ━━━

- 25% MID-OBJECT-INTERACTION (mid-toss of a glowing pebble between them / mid-lift of a giant pinecone / tipping over a basket of acorns / pulling apart a stuck taffy-strand)
- 20% CHASE / TACKLE / CATCH (chasing the escaped firefly with arms outstretched / one tackling the other behind a mushroom / catching a falling-petal mid-air / racing toward a glowing toadstool)
- 15% PROBLEM / RESCUE in motion (saving a tipping lantern with both paws / one pulling the other up from a hole / lifting a fallen friend from a puddle / scrambling to stop a rolling-away jar)
- 15% CONSTRUCTION / DISCOVERY (stacking mushroom-caps into a tower / building a tiny fort from sticks / digging up a half-buried treasure / pulling open a heavy storybook)
- 10% SHARED-FALL / TUMBLE / SPILL (mid-tumble down a grassy slope / spilling cocoa down both fronts mid-laugh / falling backwards in surprise / piling onto each other in a heap)
- 10% PHYSICAL-AFFECTION (wrapping each other in a long scarf / lifting the other up by the paws / tackling-hug knocking the other into flowers / mid-piggyback ride)
- 5% MISCHIEF (sneaking up on a sleeping bug together / hiding inside a giant flower-bell / mid-prank-setup with a string and a leaf-pile)

━━━ DEDUP ━━━

Dedup by: verb + object + body-language. "tipping over a jar" and "knocking over a glow-jar" are duplicates. "tipping over a jar" and "stacking pebbles" are distinct.

━━━ HARD BANS ━━━

- NO setting / time-of-night / weather language
- NO creature species names
- NO scary / sad / dark undertones
- NO single-creature focus
- NO daytime imagery
- NO pose-coded language (see HARD POSE-BANS)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. Each entry begins with an active verb (NEVER with "both" or a noun).`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
