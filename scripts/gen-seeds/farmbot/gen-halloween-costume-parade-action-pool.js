#!/usr/bin/env node
/**
 * FarmBot — halloween_costume_parade_action bespoke pool
 * ("Halloween Costume Parade" seasonal path, farmbot.seasonalPaths.halloween).
 *
 * Path-bespoke — the MOTION/SHOWING-OFF pose that is this path's whole
 * differentiator from its two siblings (farmbot-halloween-barn-party =
 * indoor/party-scale, farmbot-halloween-trick-or-treating =
 * door-to-door/treat-collecting narrative). This path is about the ACT of
 * parading/showing off costumes: a little procession, a walk together, a
 * "look at us" pose — never a party and never a treat-bag narrative.
 *
 * Same subject-elided pattern as farmbot_activity.json (verb-first /
 * participial phrases, no subject noun — "Marching proudly..." not "The
 * critter marches proudly...") so the template can prefix whichever figure
 * (human or animal) is filling that cast slot.
 *
 * CRITICAL camera-safety constraint (this is the #1 real risk on a
 * "parade/procession" concept): every entry must describe the figure's
 * face/eyes turned toward or angled at the viewer — walking or marching
 * FORWARD across or toward the frame is fine, but NEVER receding away from
 * the camera, NEVER back-turned, NEVER shown from behind, NEVER facing away.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_costume_parade_action.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct MOTION / SHOWING-OFF pose descriptions for a costumed
figure in a cute cozy countryside anime bot's Halloween costume parade scene. Each entry is a
verb-first or participial phrase with NO subject noun and NO pronoun at all (never "the child,"
"they," "it," "the critter" — start directly with the action, e.g. "Marching proudly..." or "Caught
mid-twirl..."), so the exact same sentence can be dropped straight after any figure in a cast list,
human or animal.

CRITICAL THEME — this path is specifically about PARADING and SHOWING OFF costumes: a little
procession, walking together down a path, striking a proud "look at us" pose, twirling to show off a
costume, marching in a cheerful little line. This is DIFFERENT from a costume party (no dancing, no
snacks, no party-table imagery) and DIFFERENT from trick-or-treating (no knocking on doors, no treat
bags, no doorsteps) — lean entirely into MOTION and DISPLAY: walking, marching, strutting, twirling,
posing together, hopping along in a line, holding hands/paws in a chain.

CRITICAL CAMERA SAFETY RULE, apply to every single entry without exception: the figure's face and
eyes are always turned toward or angled at the viewer/camera. Motion may carry the figure FORWARD
across the frame, diagonally toward camera, or in a three-quarter turn mid-stride — but NEVER
describe the figure moving away from the viewer, NEVER back-turned, NEVER shown from behind, NEVER
facing away, and NEVER any "looking over one's shoulder" phrasing. If in doubt, explicitly state the
face/eyes/grin turned toward the viewer as part of the action itself.

Vary the specific action: marching in a cheerful little line with arms swinging, paused mid-step
turned to grin at the viewer, caught mid-twirl showing off a costume's shape, striking a proud
chest-out "ta-da" pose with hands on hips, hopping along in a bouncy little procession, holding
paws/hands in a chain while walking forward together, bowing or curtseying playfully to show off the
costume, mid-strut with a confident swagger, spinning happily in place, waving both arms overhead in
delight, walking side by side matching each other's steps, mid-leap with a joyful grin.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 15-30 words each.

Examples:
["Marching proudly in a cheerful little line, arms swinging in a happy strut, face turned brightly toward the viewer with a beaming grin.", "Caught mid-twirl to show off the costume's shape, face lit with delight and turned straight toward the camera, one foot lifted mid-spin."]

🚫 STRICT BANS: NO subject noun or pronoun of any kind, NO walking/facing/moving away from the
viewer, NO back-turned or rear-view or over-the-shoulder phrasing, NO party imagery (dancing,
snack tables, party games), NO trick-or-treat imagery (doors, doorsteps, treat bags, knocking), NO
readable text.

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
