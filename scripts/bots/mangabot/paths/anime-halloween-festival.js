/**
 * AlphaBot candidate — anime-halloween-festival (destination: MangaBot).
 *
 * An anime school-or-shrine Halloween-festival night: costumed characters,
 * paper-lantern-lit stalls, a huge harvest moon presiding over everything,
 * autumn leaves drifting through lantern light. Leans straight into anime's
 * own beloved "Halloween episode" trope (Ghibli / Shinkai / Kyoto Animation
 * register) — never real horror.
 *
 * Identity is CLONED from MangaBot's own hard rules (read from
 * scripts/bots/mangabot/index.js + shared-blocks.js): hand-drawn anime
 * illustration ONLY (never photoreal, never 3D-CGI, never Western cartoon,
 * never manga pure-B&W), characters described BY ROLE/ARCHETYPE ONLY (never
 * named specific anime characters or franchises), Japanese culture and
 * setting rendered with respect and accuracy (no caricature, no
 * Orientalism), camera framing as a MANDATORY driving axis (Flux's anime
 * "back-of-character-looking-at-scenery" default must be overridden), and
 * the density mandate (2+ atmosphere effects, 2+ lighting descriptors, 8+
 * environmental micro-details — no empty space). A path proven under the
 * wrong config proves nothing, so — like the sibling
 * jack-o-lantern-toy-parade.js (ToyBot) — this file writes MangaBot's own
 * material identity directly into the returned brief rather than relying on
 * AlphaBot's bot-level medium config.
 *
 * AXES (bespoke to this path, not shared with festival-nights or any other
 * mangabot/alphabot path):
 *   1. CAST (pool, MVP-25)          — 1-2 costumed anime students/festival-
 *      goers, role + Halloween costume + anime appearance detail + playful
 *      action, folded into one entry (mirrors mangabot's "characters by
 *      role only" rule — never a named character, never a real franchise
 *      costume reference).
 *   2. STALL SCENE (pool, MVP-25)   — the matsuri yatai/stall midground:
 *      Japanese festival-game and food-stall traditions reimagined for
 *      Halloween (goldfish-scoop → mini-pumpkin scoop, taiyaki shaped like
 *      bats, omikuji tied to a bare tree strung with paper bats, etc.).
 *   3. MONEY SHOT — THE HARVEST MOON (pool, MVP-25) — the towering harvest
 *      moon and ONE striking silhouette/atmospheric pairing (a torii gate
 *      framing it, witches crossing it, a bat murmuration, floating sky
 *      lanterns drifting toward it...). This is the signature, always-
 *      present detail the whole concept is built around — but its 25-entry
 *      pool gives it real variety in HOW it appears each render, so it
 *      never repeats the same shot twice in a row.
 *   4. VENUE (inline, fixed list)   — school courtyard / shrine steps /
 *      torii approach / rooftop / riverside path / gymnasium-turned-fair.
 *   5. DECOR DETAILS (inline, fixed list, 3 sampled per render) — the
 *      bunting/lantern/leaf-litter micro-details that feed the density
 *      mandate.
 *   6. SENSORY BEAT (inline, fixed list) — one atmospheric/sensory anchor
 *      line (roasting-sweet-potato steam, a distant taiko drumbeat implied
 *      visually, incense curling, a cool autumn gust through the lanterns).
 *   7. CAMERA FRAMING (inline, fixed list) — the mandatory driving axis per
 *      MangaBot's own CAMERA_FRAMING_MANDATORY_BLOCK convention.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: this is the beloved ANIME HALLOWEEN
 * BOTTLE-EPISODE — warm, festive, and affectionately spooky, NEVER genuine
 * horror. Every costume, mask, and monster is a FRIENDLY anime-Halloween
 * trope (grinning jack-o-lanterns, cute ghost sheets, a cat-eared headband
 * — never real gore, real fear, or an actual supernatural threat), and the
 * towering harvest moon presides over every single frame as the scene's
 * emotional anchor.
 *
 * Self-contained function-form path (AlphaBot CANDIDATES contract, see
 * ALPHABOT.md "Workflow"). Requires its own seed pools directly as JSON —
 * no shared pools.js edits and no dependency on mangabot's declarative
 * archetype/pools registry needed to render this path standalone.
 */

const CAST = require('../seeds/anime_halloween_festival_cast.json');
const STALL_SCENES = require('../seeds/anime_halloween_festival_stall.json');
const MOON_MONEY_SHOT = require('../seeds/anime_halloween_festival_moon.json');

// ── Short fixed lists — inline, no generated pool needed ───────────────

const VENUES = [
  'a Japanese high-school courtyard transformed for the night, string lights zigzagging between the school wings',
  'the worn stone steps climbing a hillside Shinto shrine, paper lanterns lining both handrails',
  'the approach beneath a great vermillion torii gate, lanterns hanging from its crossbeam',
  'a school rooftop terrace strung with orange lantern lights, the town spread out below',
  'the open shrine courtyard ringed by stalls, a small bonfire pit at its center',
  'a narrow riverside walking path beside the shrine grounds, lanterns bobbing in the dark water',
  'the school gymnasium entrance converted into a lantern-strung haunted-fair archway',
  'a temple bell-tower plaza strung with lantern garlands for the festival night',
];

const DECOR_DETAILS = [
  'strings of cobweb bunting looped along the stall eaves',
  'rows of paper pumpkin lanterns swaying overhead',
  'ghost-shaped paper balloons drifting on their tethers',
  'a garland of hand-cut candy-corn paper triangles',
  'drifts of fallen leaves swirling across the ground',
  'a curl of incense smoke rising from a shrine burner',
  'a kite shaped like a bat tugging at its string',
  'black-cat silhouette cutouts pasted along a stall counter',
  'a straw scarecrow mascot propped by the gate, festival happi coat draped on it',
  'a fox-mask vendor stall hung with rows of paper masks',
  'a string of orange-and-purple paper lanterns swaying in the breeze',
  'small jack-o-lantern-carved daikon radishes lined up on a stall shelf',
  'origami-bat mobiles spinning slowly from a stall awning',
  'a paper ghost windsock rippling atop a bamboo pole',
];

const SENSORY_BEATS = [
  'steam curling up from a roasted-sweet-potato cart at the corner',
  'a distant taiko drum implied by a blurred drummer silhouette across the square',
  'the lanterns all swaying together in one cool autumn gust',
  'incense smoke drifting low from the shrine stone burner',
  'the warm smell of grilling takoyaki cutting through the crisp night air',
  'paper charms clinking softly together on their string',
  'a sudden hush as a shower of leaves crosses the lantern light',
  'the faint crackle of a bonfire threading through the festival noise',
  'wind chimes shaped like tiny bats ringing from a stall post',
  'the hush of the shrine grounds beyond the last stall, crickets in the dark',
];

const CAMERA_FRAMINGS = [
  'low-angle hero framing, the cast filling the lower third with the huge moon rising directly behind their head',
  'wide establishing shot straight down the lantern-lit stall aisle, the moon rising above the torii gate at the vanishing point',
  'over-the-shoulder framing looking past the cast down over the glowing stalls toward the moonlit shrine steps',
  'three-quarter view crossing a lantern-strung footbridge, the moon hanging low over the rooftops behind',
  'high vantage from a rooftop or hillside looking down over the glowing stall aisle and the moon beyond',
  'a ground-level framing from among the stalls looking up at the cast silhouetted against the huge moon',
  'a symmetrical frame centered on the torii gate, the cast to one side, the moon perfectly framed inside the gate',
  'a dynamic diagonal framing following the cast mid-stride down the stall aisle, lanterns streaking past on both sides',
];

function pickN(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length > 0) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const cast = [picker.pickWithRecency(CAST, 'anime_halloween_festival_cast')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(CAST, 'anime_halloween_festival_cast');
    if (second !== cast[0]) cast.push(second);
  }

  const stallScene = picker.pickWithRecency(STALL_SCENES, 'anime_halloween_festival_stall');
  const moonShot = picker.pickWithRecency(MOON_MONEY_SHOT, 'anime_halloween_festival_moon');

  const venue = VENUES[Math.floor(Math.random() * VENUES.length)];
  const decorDetails = pickN(DECOR_DETAILS, 3);
  const sensoryBeat = SENSORY_BEATS[Math.floor(Math.random() * SENSORY_BEATS.length)];
  const cameraFraming = CAMERA_FRAMINGS[Math.floor(Math.random() * CAMERA_FRAMINGS.length)];

  // Each CAST bio is written as its own self-contained solo vignette (own
  // prop, own micro-location). Concatenating two unrelated ones with zero
  // bridging instruction collapses into a generic "two students at a table"
  // two-shot that swallows the camera framing axis and crowds out the
  // stall/moon/decor richness (observed 2026-09-06 QA round 1: paired
  // lantern-lighting + pumpkin-painting bios rendered as a plain conversation
  // scene, losing the cotton-candy spinner, fox masks, torii, and the
  // mandated over-the-shoulder framing entirely). When a second cast member
  // is drawn, tell Flux explicitly how the two share the frame so their two
  // distinct props stay legible as ONE composed scene instead of dissolving.
  const castCohesionNote =
    cast.length > 1
      ? " Both figures share the SAME festival moment, close enough to be part of one composed shot together — each still doing their own distinct thing from their bio above, their two props both clearly visible in frame, never simplified into a generic posed conversation."
      : '';

  return `You are a Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe artist illustrating the beloved ANIME HALLOWEEN-FESTIVAL BOTTLE EPISODE — a matsuri-style school-or-shrine Halloween night. Hand-drawn anime illustration, cel-shaded clean linework with painterly atmospheric backgrounds, vibrant saturated color palette.

━━━ NON-NEGOTIABLE — PLAYFUL ANIME HALLOWEEN, NEVER GENUINE HORROR ━━━
This is the warm, festive, affectionately-spooky anime Halloween episode, not a horror scene. Every costume, mask, or "monster" is a FRIENDLY anime-Halloween trope — a grinning jack-o-lantern, a cute ghost-sheet, cat ears, a paper fox mask — never real gore, real fear, or an actual supernatural threat. The towering HARVEST MOON presides over every frame as the scene's emotional anchor — it is always huge, always glowing, always present.

━━━ THE FESTIVAL NIGHT — ${venue} ━━━
${stallScene}
Decor woven through the scene: ${decorDetails.join('; ')}. ${sensoryBeat}.

━━━ THE COSTUMED CAST — described by role only, NEVER a named character or franchise ━━━
${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}
Every figure is a real anime student or festival-goer in a Halloween costume — a costume, never an actual creature or threat. Engaged mid-action (reaching / laughing / lighting / racing / pointing), body weight shifted, never a static posed thumbnail. NEVER name a specific anime character or franchise, and never reference a specific copyrighted costume (no branded characters) — generic Halloween archetypes only.${castCohesionNote}

━━━ MONEY SHOT — THE HARVEST MOON ━━━
${moonShot}
This moon is the single most important element in the frame — oversized, glowing warm amber-orange, dominating the sky above everything else. Render its paired silhouette/crossing detail as a BOLD, high-contrast, unmistakably graphic black silhouette — a clean stencil-cut shape that reads instantly at a glance against the glowing face, never a faint, delicate, or diffuse overlay that could be missed or dropped. This exact silhouette shape is the one signature detail this whole render is built around — it must never be replaced by a generic temple-, pagoda-, or castle-behind-the-moon default; render THIS shape, bold and legible, or the shot has failed.

━━━ ANIME ILLUSTRATION IDENTITY (LOCKED) ━━━
Hand-drawn anime illustration only — Studio Ghibli / Makoto Shinkai / Kyoto Animation tradition. Cel-shaded clean linework, painterly atmospheric backgrounds, vibrant saturated palette, visible brushwork in the sky. NEVER photoreal, NEVER 3D-render, NEVER Disney-Pixar CGI, NEVER Western cartoon, NEVER manga pure-black-and-white (this is full-color keyframe art). Japanese festival culture (torii orientation, shrine architecture, lantern craft, seasonal harvest symbolism) rendered with respect and accuracy — no caricature, no Orientalism.

━━━ CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${cameraFraming}
Apply this exact camera position and match the cast's facing/engagement to it. No matter how wide, symmetric, or reflection-heavy the venue and stall scene read (a receding lantern aisle, a riverside row doubled in water, a row of stalls guiding the eye deep into the frame), the costumed cast is the large, legible, foreground visual anchor of the shot — their costume, pose, and action must read clearly at a glance, never shrunk to a tiny, distant, indistinct figure in service of the background. Reject the generic "tiny back-of-character silhouette swallowed by a wide landscape" default outright — a render where the cast reads smaller than the moon or the stall row itself is a failed shot for this path, regardless of which framing above was chosen.

━━━ DENSITY MANDATE — NO EMPTY SPACE ━━━
Layer the frame densely: 2+ atmosphere effects (drifting leaves / lantern glow / incense smoke / paper streamers / moonlit haze), 2+ lighting descriptors (warm lantern amber against cool moonlit blue), and 8+ specific environmental micro-details populating every stall, surface, and corner. The background is composed as carefully as the foreground.

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

Output ONLY the 85-110 word Flux prompt, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene content. End with: soft bloom highlights, filmic color grading, no text no words no watermarks no logos no frame borders.`;
};
