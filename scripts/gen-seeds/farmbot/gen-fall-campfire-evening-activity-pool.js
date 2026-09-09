#!/usr/bin/env node
/**
 * FarmBot — fall_campfire_evening_activity bespoke pool ("Fall Campfire
 * Evening" SEASONAL path, bot.seasonalPaths.fall — see
 * FARMBOT_PATH_BUILD_STATE.md).
 *
 * Only used in the WITH-CHARACTER branch (same convention as shared
 * farmbot_activity.json's ACTIVITY pool — gerund-led action phrases with an
 * IMPLIED subject, meaningless without a character present). Kept bespoke
 * rather than reusing shared ACTIVITY because it needs to be specifically
 * campfire-anchored (roasting marshmallows, wrapped in a blanket, cider) —
 * shared ACTIVITY has no campfire-specific entries at all.
 *
 * CRITICAL — camera-framing safety: every action must keep the character's
 * face naturally toward/near the fire and visible, never implying a back-
 * turned or facing-away pose (FarmBot's face-visibility rule, CLAUDE.md hard
 * rule against over-the-shoulder/rear-view framing).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_campfire_evening_activity.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct GENTLE CAMPFIRE-EVENING ACTIVITY descriptions for
a cozy countryside anime bot — what a character is doing at a small autumn campfire, described
as an ACTION/POSE phrase with an IMPLIED subject (not a full scene, not a named person — start
directly with a gerund or present-tense verb, e.g. "Roasting a marshmallow..." never "A person
roasting...").

Draw from genuine campfire-evening variety: roasting a marshmallow on a long stick held out over
the low flames and watching it turn golden-brown, holding a steaming mug of warm cider in both
hands and breathing in the spiced warmth, pulling a soft knit blanket snug around the shoulders,
tucking bare toes just outside the fire's warm reach, leaning forward with hands held out toward
the flames to warm them, resting back against a stacked hay bale with a content, sleepy smile,
tipping a face upward to take in the night sky, laughing quietly at something just said, poking
gently at the fire's edge with a long stick to nudge a log back into place, cupping both hands
around a warm mug and blowing softly across the surface, tucking a striped scarf a little tighter
against the evening chill, sitting cross-legged on a folded blanket close to the fire's glow.

Every entry should read as ONE small, charming, cozy campfire moment — never work, always warm
and unhurried.

CRITICAL — every pose must keep the character's face naturally toward the fire, the sky, a
companion, or the camera — NEVER implying their back is turned or their face is hidden from
view (no "turning away," "facing the darkness beyond," "back to the fire," or similar).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 15-30 words each.

Examples:
["Roasting a marshmallow-topped stick out over the low flames, watching it slowly turn golden-brown with a small, satisfied smile.", "Cupping a steaming mug of warm spiced cider in both hands, breathing in its warmth before taking a slow, careful sip."]

🚫 STRICT BANS: NO named people, NO gendered nouns (man/woman/boy/girl/person), NO
labor-intensive/exhausting framing, NO readable text, NO brand names, NO photographer/
camera-brand names, NO back-turned/facing-away/face-hidden poses.

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
