#!/usr/bin/env node
/**
 * Funko Pop cast pool — replaces vinyl_dioramas as ToyBot's vinyl path
 * cast source. Just describes WHO (Funko Pop characters), not WHERE/WHAT
 * (those come from shared scenarios + staging axis).
 *
 * Output drops 'solo hero' framing — every entry names 2-4 Funko Pops as
 * an ensemble cast.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/vinyl_funko_cast.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 25),
  append: APPEND,
  metaPrompt: (
    n
  ) => `You are writing ${n} FUNKO POP CAST LINEUPS for ToyBot's vinyl path. Each entry describes 2-4 Funko Pop characters as an ensemble — the WHO of a scene. Where/what they're doing comes from a separate scenario pool (don't include activity here).

Each entry: 18-32 words. Comma-separated phrase clusters. NO sentences with periods.

━━━ FUNKO POP MEDIUM (REINFORCE EVERY ENTRY) ━━━
Funko Pop = oversized square cube head, small stocky body, tiny legs, large round dot eyes, no/minimal mouth, glossy matte vinyl, printed costume/fur details, mass-produced collectible look. Mention "Funko Pop" or "Funko" by name in every entry so the medium locks.

━━━ CAST DIVERSITY (rotate widely across the pool) ━━━
- Animal Funko Pops: foxes, bears, raccoons, owls, cats, dogs, pandas, sloths, otters, hedgehogs, dragons, dinosaurs, sharks
- Human archetype Funkos: chef, astronaut, scientist, librarian, gardener, mailman, pilot, surfer, ballerina, knight, ninja, cowboy, pirate
- Pop-culture archetypes (NO trademarked names — just the type): cartoon mouse, superhero in cape, wizard with hat, vampire with cape, mummy, clown, robot, alien
- Monsters: kaiju, frankenstein-style, swamp-creature, werewolf, ghost, demon
- Sports: basketball player, soccer player, baseball pitcher, tennis player
- Mascots: hot-dog mascot, taco mascot, donut mascot, pizza-slice mascot
- Fantasy: unicorn, mermaid, fairy, gnome, troll
- Mix-and-match: pair an animal with a human, group three different archetypes, contrast cute + spooky, etc.

━━━ ENTRY FORMAT ━━━
"{N Funko Pops described}, {medium reinforcement: oversized cube heads / dot eyes / glossy vinyl / printed costume}, {brief expressive note about their look}"

━━━ EXAMPLES ━━━
- "Three animal Funko Pops — a striped tabby cat with painted whiskers, a bandit-mask raccoon, a tiny hedgehog with quilled-back details, all with cube heads and round dot eyes, glossy vinyl"
- "Funko Pop crew of four: an astronaut with bubble helmet, a mad-scientist in lab coat, a panda chef in apron, a fox in red sneakers, all square heads, glossy vinyl, dot eyes"
- "Two superhero Funko Pops — caped figure with thunderbolt chest emblem and a smaller sidekick in purple cowl, both in classic heroic stance, square Funko heads"
- "Four Halloween Funko Pops: a vampire in cape, a ghost with floating sheet, a witch with pointed hat, a candy-corn-mascot — all glossy vinyl with comic dot eyes, mass-produced collectible aesthetic"
- "Three sports Funko Pops in jerseys — basketball player, soccer striker, baseball pitcher — cube-head proportions, mid-poses, glossy uniforms with painted numbers"
- "Funko Pop band: a drummer behind a tiny kit, a guitarist with painted instrument, a singer at mic, a synth player with keyboard — all rocker outfits, square heads, dot eyes"
- "Four food-mascot Funko Pops: a smiling hot-dog with arms, an animated taco with face, a glossy donut with sprinkle texture, a pizza-slice with cheesy expression, all in cube-Funko proportions"

━━━ HARD RULES ━━━
- 2-4 Funko Pops per entry, NEVER solo
- ALWAYS use "Funko Pop" or "Funko" or "vinyl Funko" in the entry
- Reinforce Funko proportions (cube head, small body, dot eyes) so Flux locks the look
- VARY the cast types across the pool — don't cluster all-animal or all-human
- NO trademarked franchise names (no Mickey Mouse, Spider-Man, Star Wars by name) — use generic archetypes (cartoon mouse / web-slinger / space hero)
- NO scenes/activities — just describe WHO, not where or what they're doing

━━━ DEDUP ━━━
No two entries share the exact same cast lineup.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
