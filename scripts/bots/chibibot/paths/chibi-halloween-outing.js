/**
 * AlphaBot candidate "chibi-halloween-outing" — Halloween candidate path,
 * built for eventual promotion to ChibiBot (ALPHABOT.md workflow).
 *
 * Cloned identity target: ChibiBot — 3D-CGI Pop-Mart-vinyl / Pixar chibi
 * creature register, NO humans ever, chibi proportions, never dark or
 * scary (chibibot/shared-blocks.js STYLIZED_NOT_PHOTOREAL_BLOCK /
 * NO_PEOPLE_BLOCK / NO_DARK_NO_INTENSE_BLOCK). Voice + structure mirrored
 * here in function-form from ChibiBot's own CHIBIBOT_CREATURE_OUTING
 * archetype (chibibot/archetype-templates.js — the proven "band of
 * creature friends on a day out" template used by creature-county-fair /
 * creature-autumn-day / creature-camping etc.), copied and adapted rather
 * than imported — this file is fully self-contained per the AlphaBot
 * prototyping contract (no shared-registry edits).
 *
 * CONCEPT: a little band of 2-3 chibi creature friends mid-action on a
 * Halloween adventure TOGETHER — door-to-door trick-or-treating with
 * baskets, a moonlit hayride, or racing through a corn maze. Verb-led and
 * dynamic, never a posed lineup. Playful/family-friendly Halloween only —
 * grinning jack-o-lanterns and friendly ghosts, never real horror.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE (this path's one hard rule): every figure
 * is an AFFIRMATIVELY-CAST CHIBI CREATURE, never a human / human child /
 * costumed human. The money-shot costume piece drapes OVER the creature's
 * own fur/feathers/scales (paws, tail, ears, wings, or fins stay visible) —
 * this guards the single biggest failure mode of a trick-or-treat concept,
 * which is "costume" defaulting Flux to a human child in a costume.
 *
 * 7 bespoke axes (none shared with any other path — full-bespoke-per-path):
 *   creature_group  (GENERATED, 2-3 picks) — who the friends are, physically
 *   activity        (GENERATED)            — the shared verb-led moment (headline)
 *   setting_detail  (GENERATED, pick 3)    — lived-in neighborhood/farm richness
 *   prop            (GENERATED)            — small charm one of them holds
 *   surprise_element(GENERATED, 2-FRIEND CASTS ONLY as of round-1 re-QA
 *                    2026-09-06 — see word-budget guard below)
 *                                          — tucked-away background cameo
 *   costume_detail  (GENERATED, MONEY-SHOT axis, ~50% present, never mandatory
 *                    per the playbook's homogenization failure mode)
 *   lighting_time   (inline fixed list — short, no Sonnet pool needed)
 *
 * Seeds: scripts/bots/alphabot/seeds/chibi_halloween_outing_*.json (MVP-25
 * each). Generator: scripts/gen-seeds/alphabot/gen-chibi-halloween-outing.js
 */

const CREATURES = require('../seeds/chibi_halloween_outing_creature.json');
const ACTIVITIES = require('../seeds/chibi_halloween_outing_activity.json');
const DETAILS = require('../seeds/chibi_halloween_outing_detail.json');
const PROPS = require('../seeds/chibi_halloween_outing_prop.json');
const SURPRISES = require('../seeds/chibi_halloween_outing_surprise.json');
const COSTUMES = require('../seeds/chibi_halloween_outing_costume.json');

// Short fixed list — inline per the playbook (a handful of options doesn't
// need a generated pool). Dusk-through-night register only, nothing bleak;
// the cold-blue-vs-warm-amber-light contrast carries the Halloween-evening
// signature the way it does on TinyBot's winter-village path.
const LIGHTING_TIME = [
  'golden late-afternoon light slanting low through turning leaves, long soft shadows',
  'blue-violet dusk settling in, porch lights just clicking on one by one',
  'deep autumn-blue evening lit warm by rows of grinning jack-o-lanterns',
  'a harvest moon rising silver-gold, strings of warm bulb lights glowing below',
  'soft grey overcast afternoon, crisp air, gentle diffused light',
  'warm amber sunset behind bare-branched trees, the sky streaked orange and rose',
  'twilight blue giving way to candlelit-orange porch glow up and down the street',
  'a clear indigo night sky, warm lantern-light pooling on the path underfoot',
];

// Mirrors chibibot/archetype-templates.js's lookOverride() — copied, not
// imported (that file belongs to ChibiBot, off-limits during prototyping).
function lookOverride(sharedDNA) {
  if (!sharedDNA || !sharedDNA.lookRegister) return '';
  return `━━━ LOOK — open your Flux prompt with THIS rendering style (overrides any other style wording below) ━━━
${sharedDNA.lookRegister}
Lead your Flux prompt with these style tokens FIRST, then describe the scene below rendered in THIS style — it sets the medium/finish only. Keep the scene's composition, the chibi proportions, and all rules exactly as written. NO humans.

`;
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // 2-3 friends, never solo — this is a "together" outing.
  const friendCount = Math.random() < 0.5 ? 2 : 3;
  const cast = [];
  for (let i = 0; i < friendCount; i++) {
    let pick = picker.pickWithRecency(CREATURES, 'chibi_halloween_outing_creature');
    let guard = 0;
    while (cast.includes(pick) && guard < 5) {
      pick = picker.pickWithRecency(CREATURES, 'chibi_halloween_outing_creature');
      guard++;
    }
    cast.push(pick);
  }
  const castBlock = cast.map((c, i) => `Friend ${i + 1}: ${c}`).join('\n\n');

  const activity = picker.pickWithRecency(ACTIVITIES, 'chibi_halloween_outing_activity');

  const details = [];
  for (let i = 0; i < 3; i++) {
    let pick = picker.pickWithRecency(DETAILS, 'chibi_halloween_outing_detail');
    let guard = 0;
    while (details.includes(pick) && guard < 5) {
      pick = picker.pickWithRecency(DETAILS, 'chibi_halloween_outing_detail');
      guard++;
    }
    details.push(pick);
  }
  const detailBlock = details.map((d, i) => `${i + 1}. ${d}`).join('\n');

  const prop = picker.pickWithRecency(PROPS, 'chibi_halloween_outing_prop');

  // MONEY-SHOT axis — present on roughly HALF the renders, never mandatory
  // (a mandatory signature feature homogenizes every render into "the same
  // one guy" — playbook failure-mode catalog). Rolled BEFORE the surprise
  // element (below) so the surprise gate can see it.
  const hasCostume = Math.random() < 0.5;
  const costumeBlock = hasCostume
    ? `\n\n━━━ SIGNATURE MONEY-SHOT DETAIL — ONE FRIEND'S HALLOWEEN COSTUME PIECE ━━━\n${picker.pickWithRecency(COSTUMES, 'chibi_halloween_outing_costume')}\nWorn OVER that friend's own fur/feathers/scales — its paws, tail, ears, wings, or fins stay clearly visible. The costume dresses the CREATURE; it never disguises a person.`
    : '';

  // WORD-BUDGET GUARD (round-1 re-QA fix, 2026-09-06, extended round-2
  // re-QA fix, same date): the closing instruction below tells Sonnet to
  // cut the SURPRISE ELEMENT first when the prompt is running long, but in
  // practice Sonnet keeps every axis's content instead of trimming.
  // Round-1 diagnosed a 3-friend cast overflowing the 90-120-word cap
  // (~183 words) and cut the surprise there. Round-2 re-QA measured the
  // SURVIVING 2-friend branch directly against its own rendered prompts:
  // a 2-friend cast with hasCostume=true PLUS all 3 setting details PLUS
  // prop PLUS surprise still overflows (151 words and 136 words measured
  // across two renders — both ~15-25% over cap), and the overflow tracks
  // directly with visible defects: the 151-word render dropped the named
  // hay-bales/barn/rooster-weathervane setting details and Flux
  // hallucinated stray floating candy shapes into the empty sky instead;
  // the 136-word render dropped the costume piece (the shark-fin cape)
  // entirely. The ONE render that stayed under budget (112 words, no
  // costume rolled) kept every named detail and was the strongest of the
  // three. So: costume and surprise are now MUTUALLY EXCLUSIVE — the
  // costume IS this path's money shot, and it shouldn't have to compete
  // with a background cameo for the same shrinking word budget. Surprise
  // now only rolls on a 2-friend cast WITHOUT a costume.
  //
  // Round-3 re-QA (2026-09-06): the mutual-exclusivity fix above did NOT
  // fix the overflow — all 3 round-3 renders measured over cap again (156,
  // 173, 143 words), worse than round-2's already-flagged 151/136. But the
  // visible defect this round was sharper and consistent across BOTH
  // over-budget renders that used a less-common species: the river-otter
  // friend (3-friend cast + costume, 156 words) and the opossum-joey friend
  // (2-friend cast + surprise, 143 words) each rendered as a generic
  // squirrel/mouse silhouette instead of their real species. Diffing the
  // rendered prompt against the creature seed's full description showed
  // the SAME pattern both times: Sonnet kept the color/pattern cues
  // ("espresso-brown", "pale silver fur") but silently dropped the
  // BODY-SHAPE cues ("broad whiskered muzzle", "thick tapered tail" /
  // "large rounded pink ears", "pointed little snout") when trimming for
  // length — technically legal under the old instruction ("trim
  // adjectives... never drop a friend to unnamed"), but color alone can't
  // override Flux's generic-rodent prior for a species it doesn't have a
  // strong default for. Fox/squirrel/bunny survive this trim fine because
  // Flux already knows their silhouette; otter/opossum/fennec don't. Fix:
  // the closing instruction now explicitly protects each friend's
  // body-shape cue from ever being the trim target, and reorders the trim
  // priority to hit a setting detail before touching any friend's own
  // description. (Did not also gate costume off the 3-friend branch this
  // round — one variable at a time; re-measure next round before touching
  // that too.)
  //
  // Round-4 re-QA (2026-09-06): word count was NOT the culprit this round —
  // the river-otter render (2-friend cast, otter + chipmunk, 121 words, at
  // cap but not trimmed) kept both of the otter's body-shape phrases
  // ("broad whiskered muzzle", "thick tapered tail") verbatim in the
  // rendered prompt, yet the otter still came out as a second identical
  // chipmunk/squirrel with no low sleek otter silhouette, and no held prop
  // (map / corn-husk doll) visible at all. Same failure, different
  // mechanism, hit the pine-marten render (cat + marten + raccoon, marten's
  // cue also kept verbatim): the marten rendered wearing the RACCOON's
  // charcoal eye-mask instead of its own plain face. Root cause traced to
  // the CREATURE SEED TEXT itself, not the trim logic: "whiskered muzzle" /
  // "bushy tail" / "rounded ears" are shared vocabulary with half the
  // roster (chipmunk, squirrel, raccoon all have some version of these), so
  // even fully intact and untrimmed they don't give Flux a silhouette it
  // can't confuse with a stronger-prior castmate standing right next to it.
  // Compare to entries that DO survive every round fine — fennec's
  // "satellite-dish ears nearly as wide as its whole body", opossum's
  // "naked pink-tipped tail" — those are singular, unshared shape cues.
  // Fix: added an explicit low-slung body-shape phrase to the two weak
  // entries only (river otter: "a long sleek low-slung tubular body"; pine
  // marten: "a long slender low-to-the-ground weasel-shaped body" + "a
  // plain unmarked face" so it stops borrowing the raccoon's mask) in
  // chibi_halloween_outing_creature.json — no other entry touched, no
  // template logic changed this round.
  const surprise = (friendCount === 2 && !hasCostume)
    ? picker.pickWithRecency(SURPRISES, 'chibi_halloween_outing_surprise')
    : null;
  const surpriseBlock = surprise
    ? `\n\n━━━ SURPRISE ELEMENT (tucked-away background detail) ━━━\n${surprise}`
    : '';
  const lightingTime = LIGHTING_TIME[Math.floor(Math.random() * LIGHTING_TIME.length)];

  return `${lookOverride(sharedDNA)}You are writing a HALLOWEEN-OUTING "day out" scene for ChibiBot — a little band of adorable chibi CREATURE friends mid-action on a Halloween adventure TOGETHER (door-to-door trick-or-treating, a hayride, a corn maze). The playful, story-driven side of ChibiBot — friends having the BEST spooky-cute evening out. Viewer reaction: "look at these little critters trick-or-treating!" Output wraps with style prefix + suffix.

NON-NEGOTIABLE TEMPLATE MANDATE: every figure in frame is an affirmatively-cast CHIBI CREATURE — a real animal or a cute fantasy critter — at chibi proportions (oversized round head, massive glassy multi-catchlight eyes, soft stubby body), NEVER a human, human child, or a human in costume. Friends are visibly different species/sizes. NO human hands, NO children. The render style/finish is set ONLY by the LOOK tokens above.

CORE RULES: Wholesome friendship joy — all friends happy and delighted, never scared or sad. PLAYFUL, friendly, giggly Halloween — grinning jack-o-lanterns, shy friendly ghosts, a kind neighborhood glow. This is trick-or-treat JOY, not a haunted house: no real horror, no gore, no genuine scares.

━━━ HARD RULE: A REAL-WORLD PLACE, FULLY BUILT, FILLING THE FRAME ━━━
This is a SCENE in a PLACE — the decorated neighborhood street, farm, or corn maze is fully built and readable, filling the frame with multi-tier depth: foreground detail, the friends mid-action in the midground, the place built out behind and to the sides. NEVER a creature on a blank/white/studio backdrop, NEVER a tight close-up portrait. The place is as fun and full as the creatures.

━━━ THE BAND OF FRIENDS (chibi creatures, all present, doing it TOGETHER as co-heroes) ━━━
${castBlock}

━━━ THE ACTIVITY (what they're doing together right now, mid-action — the headline; it sets the place) ━━━
${activity}

━━━ THREE SETTING DETAILS (lived-in Halloween richness that builds the place) ━━━
${detailBlock}

━━━ PROP (small charm one of them holds) ━━━
${prop}
${surpriseBlock}${costumeBlock}

━━━ LIGHT + TIME OF NIGHT ━━━
${lightingTime}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Captured mid-moment (three-quarter / off-center / low hero-up), the friends interacting with each other and the place, not lined up posing. Three-act depth: foreground detail, friends mid-action midground, the place built out behind.

EVERY friend named above MUST appear in the output with its own short visual tag (species + one distinguishing feature — e.g. "the raccoon kit" or "the hedgehog," never compressed into a vague "and friends"). Each friend's tag MUST keep at least one BODY-SHAPE cue from its creature description above — its distinctive snout/muzzle shape, tail shape, or ear shape/size — NOT just its color. Color alone does not save a less-common species (otter, opossum, fennec) from Flux defaulting it to a generic squirrel/mouse silhouette; the shape cue is what actually reads as "otter" instead of "rodent." If the prompt is running long, cut in this order: the SURPRISE ELEMENT, then the PROP, then ONE of the three setting details, then cosmetic flourishes (cheek blush, catchlight description) — never a friend's body-shape cue, never drop a friend down to an unnamed background presence, and never let one friend's description balloon into several phrases while another gets none at all.

Open with: "[Friend 1's species] and [friend 2's species](, and [friend 3's species]) [shared activity verb-phrase], at/on/in [the place]..." then unfold, giving each named friend its own visual beat before moving on to atmosphere. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; going over 120 words is the #1 reason Flux drops a friend or swaps it for a generic substitute. No labels, headers, or ━━━ markers.`;
};
