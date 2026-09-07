/**
 * AlphaBot candidate — chibi-halloween-village (destination: ChibiBot).
 *
 * Cloned onto ChibiBot's identity per ALPHABOT.md ("a path proven under the
 * wrong config proves nothing"): alphabot/shared-blocks.js carries ChibiBot's
 * prose blocks byte-identical (PROMPT_PREFIX/SUFFIX, mediums, no-humans /
 * cute-cozy / stylized-CGI / impossible-beauty / blow-it-up blocks); this
 * path only needs to require them from '../shared-blocks'.
 *
 * CONCEPT: a cozy chibi-critter HALLOWEEN VILLAGE — a lantern-lit cobblestone
 * street, a pumpkin-patch fair, or a town square — wide establishing shot,
 * MULTIPLE cute critters trick-or-treating, decorating, or gathered together.
 * Playful family-friendly Halloween: grinning jack-o-lanterns and friendly
 * ghosts, never real horror, gore, or genuine scares.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: every figure in the village — including
 * every "trick-or-treater" — is affirmatively cast as a chibi CREATURE (a
 * real animal or fantasy critter) wearing its own tiny Halloween costume,
 * NEVER a human or human child in costume. A human-shaped trick-or-treater
 * is the single most likely failure mode for a Halloween scene on a no-
 * humans bot, so the mandate is stated up front AND re-stated at the cast
 * block, and it bans human age/gender nouns outright rather than relying on
 * a single "no humans" line to out-vote a strong trick-or-treat prior.
 *
 * MONEY-SHOT axis: JACKOLANTERNS — one specific glowing jack-o-lantern
 * composition (a lit row lining the street, a pumpkin pyramid at the stall,
 * a lantern-flotilla on the canal...). Present on ~55% of renders, never
 * mandatory — a mandatory signature homogenizes every render into "the same
 * one shot" (known failure mode).
 *
 * 6 bespoke axes, all direct-JSON pools (no pools.js / no shared registry —
 * FULL-BESPOKE per path, per playbook):
 *   VILLAGE       — the wide establishing stage, always present
 *   CAST          — chibi critters mid-Halloween-activity; 2 always + ~45%
 *                   chance of a 3rd (concept requires MULTIPLE critters
 *                   every render, never a solo portrait)
 *   JACKOLANTERNS — the money-shot glow composition (~55%)
 *   DECOR         — non-pumpkin seasonal village dressing, always present
 *                   (stacks density without repeating the money shot)
 *   NIGHT_SKY     — the dusk/night sky + light mood, always present
 *   SURPRISE      — a small charming incidental detail (~50%)
 */

const blocks = require('../shared-blocks');
const VILLAGE = require('../seeds/chibi_halloween_village_scene.json');
const CAST = require('../seeds/chibi_halloween_village_cast.json');
const JACKOLANTERNS = require('../seeds/chibi_halloween_village_jackolantern.json');
const DECOR = require('../seeds/chibi_halloween_village_decor.json');
const NIGHT_SKY = require('../seeds/chibi_halloween_village_sky.json');
const SURPRISE = require('../seeds/chibi_halloween_village_surprise.json');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const village = picker.pickWithRecency(VILLAGE, 'chibi_halloween_village_scene');

  // MULTIPLE critters every render (concept mandate, not optional): 2 always,
  // ~45% chance of a 3rd. pickWithRecency already excludes this-render picks
  // for the same axis, so a defensive includes() check is enough (never a
  // retry loop — don't over-engineer).
  const cast = [
    picker.pickWithRecency(CAST, 'chibi_halloween_village_cast'),
    picker.pickWithRecency(CAST, 'chibi_halloween_village_cast'),
  ];
  if (Math.random() < 0.45) {
    const third = picker.pickWithRecency(CAST, 'chibi_halloween_village_cast');
    if (!cast.includes(third)) cast.push(third);
  }
  const castBlock = `━━━ THE CRITTER CAST (${cast.length} chibi critters, gathered / trick-or-treating / decorating TOGETHER — a village scene, never a solo portrait) ━━━\n${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}`;

  const moneyShot =
    Math.random() < 0.55
      ? `\n\n━━━ THE MONEY SHOT — the jack-o-lantern glow that makes this render ICONIC (this is BACKDROP LIGHTING the critter cast performs in front of, NEVER a second hero — even when the line below calls it "giant," "hero," or "centerpiece," that means biggest-of-the-pumpkins, not bigger-or-more-central-than-the-cast; the near-foreground critter must still read as the clear star of the frame) ━━━\n${picker.pickWithRecency(JACKOLANTERNS, 'chibi_halloween_village_jackolantern')}`
      : '';

  const decor = picker.pickWithRecency(DECOR, 'chibi_halloween_village_decor');
  const sky = picker.pickWithRecency(NIGHT_SKY, 'chibi_halloween_village_sky');

  const surprise =
    Math.random() < 0.5
      ? `\n\n━━━ A SMALL CHARMING DETAIL ━━━\n${picker.pickWithRecency(SURPRISE, 'chibi_halloween_village_surprise')}`
      : '';

  return `You are a master set-dresser and storyteller writing a COZY CHIBI-CRITTER HALLOWEEN VILLAGE scene for ChibiBot. A lantern-lit cobblestone street, a pumpkin-patch fair, or a town square, caught mid-celebration — the CAST OF CRITTERS are the heroes, staged inside a lived-in little village world, never lost or shrunk inside it, not one object posed on a bare stage. Wall-poster storybook-adorable. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE: EVERY FIGURE IS A CHIBI CREATURE — NEVER A HUMAN, EVEN IN COSTUME ━━━
Every "trick-or-treater," reveler, or stallkeeper in this village is a real animal or fantasy critter at chibi proportions (oversized head, big glossy eyes) wearing a TINY Halloween costume of its own — a hedgehog in a witch hat, a fox kit in a ghost sheet, an owlet in a pumpkin hood. NEVER describe a figure with a human age/gender noun ("a child," "a little girl," "a boy," "a trick-or-treater" left bare) — that reads as a costumed HUMAN child, the single biggest failure mode for this scene. Always name the species + its costume together.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ PLAYFUL HALLOWEEN, NEVER SCARY ━━━
Grinning friendly jack-o-lanterns, cheerful ghosts, cozy autumn-dusk warmth — pure trick-or-treat delight, the kind of Halloween scene a kid wants pinned above their bed. Every "spooky" icon (ghost, bat, cauldron, cobweb, tombstone) is drawn cute and harmless, smiling and gentle, never eerie or threatening.

━━━ THE VILLAGE (stage the scene here, keeping its foreground / midground / background layers) ━━━
${village}

${castBlock}${moneyShot}

━━━ SEASONAL VILLAGE DRESSING ━━━
${decor}

━━━ NIGHT SKY + LIGHT MOOD ━━━
${sky}${surprise}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — A LIVED-IN CELEBRATION, NOT A CATALOG SHOT ━━━
Wide establishing view of the village at Halloween, critters gathered / trick-or-treating / decorating together with a clear sense of shared activity. Build depth: a NEAR-FOREGROUND critter from the cast, rendered large enough to read clearly at a glance and actively mid-activity (the near detail is a CRITTER, never just a lit doorway or a pumpkin stall standing in for one), a village midground alive with the rest of the critters and glowing windows, and a background fading into soft autumn-dusk haze. EVERY additional critter named in the cast list — not only the near-foreground one — MUST also land in the frame individually visible and clearly mid its own scripted costume/action; a second or third critter that gets cropped out, shrunk to an unreadable smudge, or merely gestured at via "the rest of the critters" rather than actually drawn doing its thing is a FAILED render. Do not let rich beauty-detail on the near-foreground critter (fur glow, catchlights, rim light, armor seams) balloon into a tight bokeh close-up portrait that erases the village architecture and the other critters — the wide shot, the full village world, and every named critter must all survive together in the same frame. NOT a centered product shot, NOT a solo hero portrait, and NEVER a critter-free establishing shot — every render must show at least one cast critter large and clear in the foreground, with the village as its backdrop, not the other way around.

Output ONLY the raw 90-120 word scene description, and treat that ceiling as FIRM, not a suggestion — this render engine hard-cuts long generations off mid-word, so a description that runs past it does not get a graceful trim, it gets TRUNCATED and loses content outright. Comma-separated phrases, and order them so every cast critter's full costume+action clause is written FIRST, immediately after the opening location phrase — atmosphere, palette, and lighting flourish always come LAST, since that is the material to shorten or cut if you are running long, never a critter's clause. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
