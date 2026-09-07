/**
 * AlphaBot candidate — toy-graveyard-diorama (prototyped for eventual
 * promotion to ToyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
 *
 * CONCEPT: a tabletop toy-graveyard diorama — vintage litho-printed TIN
 * WIND-UP skeleton/monster toys posed among miniature tombstones, moonlit
 * cinematic macro lighting, an optional dry-ice fog effect as the money
 * shot. Sibling to ToyBot's proven tin-toy-parade path (same material
 * identity — real pressed litho-tin, clockwork wind-up, never alive, never
 * human) but its OWN bespoke world: a spooky-cute Halloween tin-toy diorama
 * instead of a parade.
 *
 * Destination bot identity cloned (read from scripts/bots/toybot/index.js +
 * shared-blocks.js 2026-09-06): PROMPT_PREFIX = 'toy photography, real
 * physical toys, action-packed toy-world storytelling, toy-ness elevated as
 * the subject'; PROMPT_SUFFIX = 'no text, no words, no watermarks,
 * masterpiece quality'; allowedModels locked to
 * ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'].
 * ToyBot already has a `tin_toy_diorama` medium + matching
 * `promptPrefixByMedium` entry (REPLACES the bot-wide prefix for this
 * medium) — on promotion this path slots into that exact medium, so this
 * file stays fully self-contained (mirrors tin-toy-parade.js: it does not
 * lean on shared-blocks.js at all) and doesn't assume any wiring beyond
 * `sharedDNA.camera` / `vibeDirective`, which every ToyBot function-form
 * path already receives from the bot engine.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE (this path's one hard rule):
 *   Every skeleton / monster / creature in frame is affirmatively a REAL
 *   VINTAGE LITHOGRAPHED PRESSED-TIN WIND-UP CLOCKWORK TOY — a manufactured
 *   collectible with a wind-up key and a painted friendly grin — NEVER a
 *   real skeleton, NEVER an alive creature, NEVER a costumed human. The
 *   whole diorama is PLAYFUL spooky-cute Halloween (cheerful grins, punny
 *   epitaphs, friendly button-eyed ghosts) — never genuine horror, gore, or
 *   real scares.
 *
 * Axes (all bespoke to this path, none shared with any other):
 *   1. TOYBOT_GRAVEYARD_SCENE   — the diorama world (tombstones, fence,
 *      mausoleum, dead trees, punny grave-markers).
 *   2. TOYBOT_GRAVEYARD_MONSTER — the clockwork cast (1, +45% a 2nd) —
 *      mirrors tin-toy-parade's proven pieces pattern exactly.
 *   3. TOYBOT_GRAVEYARD_FOG     — MONEY-SHOT axis: a specific dry-ice fog
 *      vignette. Rolled ~55% of renders (never mandatory — a signature
 *      detail on every seed homogenizes the pool).
 *   4. TOYBOT_GRAVEYARD_PROP    — a secondary spooky-cute physical prop
 *      accent, independent roll (~50%), distinct from the fog effect so the
 *      two don't always stack and overcrowd the frame.
 *   5. MOONLIGHT (inline, fixed list — no pool needed) — the moonlit
 *      cinematic-macro lighting register named in the concept.
 *   6. GRAVEYARD_FRAMING (inline, fixed list — no pool needed) — bespoke
 *      framing guidance that always keeps the WHOLE diorama readable (never
 *      a body-part/object macro that dissolves the scene).
 */

const GRAVEYARD_SCENE = require('../seeds/toy_graveyard_scene.json');
const GRAVEYARD_MONSTER = require('../seeds/toy_graveyard_monster.json');
const GRAVEYARD_FOG = require('../seeds/toy_graveyard_fog.json');
const GRAVEYARD_PROP = require('../seeds/toy_graveyard_prop.json');

// Fixed short lists — no generated pool needed (per ALPHABOT task brief).
const MOONLIGHT = [
  'a huge cold harvest moon low behind drifting cloud, throwing long blue-white shadows across the stones',
  'a crisp full moon directly overhead, sharp silver rim-light tracing every tin edge',
  'a hazy moon behind thin cloud-scrim, soft diffused silver glow over the whole diorama',
  'a low moon on the horizon between two dead toy trees, warm amber near the ground fading to cold blue above',
  'cool blue-white moonbeams cutting in sharp shafts across the tabletop',
  'a bright moon doubled in a small puddle between the stones',
  'a slim crescent moon and a scatter of stars, faint enough that one jack-o-lantern glow competes for warmth',
];

const GRAVEYARD_FRAMING = [
  'a wide elevated three-quarter view over the WHOLE tabletop graveyard — every tombstone, the fence line, and the clockwork cast all readable in one frame',
  "a low toy's-eye-level shot down a row of miniature tombstones, the clockwork cast clearly readable in the near-to-mid distance, the graveyard receding behind them",
  'a straight-on eye-level view across the full diorama table, the entire graveyard layout and cast visible edge to edge, nothing cropped out',
  'a high-angle view looking down the length of the diorama, depth receding from a near tombstone to the fence line, the whole scene legible',
  'a level macro shot centered on the clockwork cast with the tombstone rows and fence still clearly readable behind them, never an isolated close-up on one prop',
  'a slightly elevated corner view taking in the whole tabletop scene at once, the foreground toy sharp, the graveyard layout unmistakably visible behind it',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(GRAVEYARD_SCENE, 'toy_graveyard_scene');
  const moonlight = picker.pickWithRecency(MOONLIGHT, 'toy_graveyard_moonlight');
  const framing = picker.pickWithRecency(GRAVEYARD_FRAMING, 'toy_graveyard_framing');

  // Clockwork cast — mirrors tin-toy-parade's proven pieces pattern exactly
  // (1 guaranteed, +45% a distinct 2nd).
  const pieces = [picker.pickWithRecency(GRAVEYARD_MONSTER, 'toy_graveyard_monster')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(GRAVEYARD_MONSTER, 'toy_graveyard_monster');
    if (second !== pieces[0]) pieces.push(second);
  }

  // MONEY-SHOT axis — dry-ice fog. Optional (~55%), never mandatory, so it
  // stays a signature MOMENT rather than homogenizing every render.
  const fogBlock =
    Math.random() < 0.55
      ? `\n━━━ THE DRY-ICE FOG MOMENT (the money shot — real dry-ice fog effect at toy scale) ━━━\n${picker.pickWithRecency(GRAVEYARD_FOG, 'toy_graveyard_fog')}\n`
      : '';

  // Secondary flavor prop — independent roll (~50%), distinct from the fog
  // so the two don't always stack.
  const propBlock =
    Math.random() < 0.5
      ? `\n━━━ A SPOOKY-CUTE ACCENT ━━━\n${picker.pickWithRecency(GRAVEYARD_PROP, 'toy_graveyard_prop')}\n`
      : '';

  return `You are a macro collectible photographer shooting a spooky-cute TOY GRAVEYARD DIORAMA for ToyBot — a tabletop Halloween scene built entirely from vintage LITHO-PRINTED TIN WIND-UP TOYS (Masudaya / Yonezawa register). Photoreal cinematic macro, shallow depth of field, moonlit.

━━━ THE GRAVEYARD DIORAMA ━━━
${scene}

━━━ THE CLOCKWORK CAST — the Halloween stars of the diorama (real pressed litho-tin, clockwork wind-up, manufactured collectibles) ━━━
${pieces.map((p, i) => `${i + 1}. ${p}`).join('\n')}
${fogBlock}${propBlock}
━━━ THE MATERIAL LOOK — NON-NEGOTIABLE ━━━
EVERYTHING in this scene is a REAL VINTAGE LITHOGRAPHED PRESSED-TIN WIND-UP TOY, in the Masudaya/Yonezawa register: colorful printed-on detail (rivets, stitches, dials, and faces all printed flat onto the metal), rigid pressed-tin body panels with tab-and-slot seams, slight patina and tiny scratches, hard riveted metal edges, and a warm enamel sheen catching every highlight like the tin robots and tin animals in a classic wind-up toy collection. Every skeleton, monster, and creature is a cheerful MANUFACTURED COLLECTIBLE with a rigid tin body and a painted friendly grin, angled three-quarters toward camera so the grin and its protruding clockwork wind-up key are both visible in the same shot (the key turned into view at its side, shoulder, or hip). The tombstones, fence, and trees are toy-scale tabletop props sized to match. This is a real vintage tin-toy diorama: PLAYFUL spooky-cute Halloween with cheerful grins and friendly button-eyes — every tombstone, banner, and sign in the scene is a smooth fieldstone slab whose entire face is given over to exactly two things: a thick blanket of weathered grey-green moss patched unevenly across the worn stone, and one small carved icon pressed dead-center into that mossy surface (a skull, a bat, or a crescent moon).

━━━ MOONLIT LIGHT ━━━
${moonlight}

━━━ CAMERA + FRAMING ━━━
${sharedDNA.camera}
${framing}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the 80-110 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: masterwork composition, hyper detailed.`;
};
