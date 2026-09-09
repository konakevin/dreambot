#!/usr/bin/env node
/**
 * FarmBot — fall_corn_maze_wander_activity bespoke pool ("Fall Corn Maze"
 * SEASONAL path — farmbot-fall-corn-maze).
 *
 * Path-local activity pool (not shared — the shared ACTIVITY pool has no
 * maze-wandering/discovery-specific actions), gerund-phrased with an implied
 * subject to match the shared ACTIVITY pool's own convention. ONLY used when
 * a character is present (includeCharacter roll) — meaningless without a
 * human subject, same as every other activity-style pool on this bot.
 *
 * Leans specifically into the WANDERING / GETTING LOST / DISCOVERY
 * narrative that differentiates this path from harvest-festival's corn-maze-
 * as-decoration treatment — every entry is a small, specific gesture of
 * actually navigating the maze, never a static posed portrait.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_corn_maze_wander_activity.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WANDERING/DISCOVERY activity descriptions for a
cozy countryside anime bot — a character actually navigating a corn maze, described as an
ACTION/POSE phrase with an implied subject (not a full scene, not naming "a person"/"a girl"/
"a boy" — just the gesture itself, matching how a gerund-phrased action pool reads, e.g.
"Peering around a bend..." or "Tracing fingertips along..."). Every entry captures ONE small,
specific moment of wandering, getting pleasantly lost, or discovering the way through — never a
static posed portrait facing the camera.

Vary the exact gesture: peering cautiously around a bend to see what's ahead, trailing
fingertips lightly along the rustling corn stalks while walking, pausing at a fork with a hand
on the chin deciding which path to take, breaking into a delighted grin at spotting a dead end
and turning back the other way, crouching to follow a scattered trail of fallen leaves along the
ground, glancing back over one shoulder at how far the path has wound (framed so the FACE still
reads clearly, never a true back-turned/rear view), reaching up to gently brush aside a low-
hanging corn leaf blocking the way, stepping through a narrow gap between two stalks with arms
drawn in close, stopping short with a surprised laugh at an unexpected clearing, tilting the
head to listen for which direction a friend's voice is coming from, hopping over a small puddle
in the path without breaking stride, running a hand along a wooden marker post while checking
the direction it points.

CRITICAL — the character's face must always stay visible and legible in the final render; never
describe a gesture that would put the character fully back-turned, facing away, or seen only
from behind/over-the-shoulder.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["Peering cautiously around a tall corn-stalk bend, one hand resting lightly against the rustling wall, eyes wide with curious anticipation at what lies just around the corner.", "Pausing at a fork in the path with a thoughtful tilt of the head, one finger tapping lightly against the chin while weighing which winding direction to try next."]

🚫 STRICT BANS: NO labor-intensive/exhausting framing, NO readable text, NO brand names, NO
photographer/camera-brand names, NO named people, NO age/gender nouns (man/woman/boy/girl/
person/etc — the pool stays subject-implied), NO back-turned/rear-view/over-the-shoulder framing,
NO costumes or spooky/Halloween content (this is general Fall/harvest-season charm).

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
