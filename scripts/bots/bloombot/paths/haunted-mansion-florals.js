/**
 * AlphaBot candidate — haunted-mansion-florals (Halloween 2026, destination: BloomBot).
 *
 * Wild, overgrown flowering vines — ivy, dark climbing roses, dried trailing
 * vine — consuming an elegant old estate structure (a wrought-iron gate, a
 * mansion facade, a garden wall) at moody, fog-touched dusk. The register is
 * GOTHIC-ROMANTIC and ELEGANT, never derelict or genuinely scary: a lovingly
 * wild moonlit estate garden, not a haunted-house horror set. No people, no
 * horror props, no gore — the seasonal mood comes entirely from dark florals,
 * fog, dusk/moonlight, and old ironwork/stone.
 *
 * PORTABILITY CONTRACT (ALPHABOT.md) — the four hard-constraint blocks below
 * (NO_PEOPLE / DENSITY / ARRANGEMENT / ANTI-DRIFT) are cloned VERBATIM from
 * scripts/bots/bloombot/shared-blocks.js so this path proves out under
 * BloomBot's real identity, not a generic one. On promotion these clones can
 * be swapped for bloombot's shared-blocks.js imports 1:1 — the TEXT is
 * already identical. This path is otherwise fully self-contained (own axes,
 * own seed pools) and requires no shared-blocks.js / pools.js / species-roster
 * import from either bot, per the "function-form, no shared registry edits"
 * rule.
 *
 * Wiring (NOT done here — a later step per ALPHABOT.md CANDIDATES contract):
 * medium/model/twoPassPolish/chaos config should clone byte-identical from
 * BloomBot: mediums: ['bloom_hyperreal_cgi'], allowedModels:
 * ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],
 * vibes: ['cinematic'], twoPassPolish.skipPaths += this path (rich bespoke
 * pool language, same as every other BloomBot axis path), chaos.skipPaths +=
 * this path (new mood-heavy path, same posture as moon-garden/water-garden/
 * rain-garden/great-blossom-tree), sensoryAnchors.pathContext: 'scene'.
 *
 * Axes (7 — 4 generated MVP-25 pools, 3 small fixed lists):
 *   - structure  (POOL, seeds/haunted_mansion_florals_structure.json)
 *       the architectural anchor (gate / facade / veranda / wall / etc.)
 *       and how the florals consume it — the base "world" of the shot.
 *   - signature  (POOL, seeds/haunted_mansion_florals_signature.json)
 *       ★ MONEY-SHOT AXIS ★ — the one unmistakably iconic floral moment
 *       (an oversized rose bursting through ironwork, a cascade of dark
 *       roses pouring off a windowsill, etc). Gated ~50% — present, never
 *       mandatory, so renders don't homogenize into "the same one rose".
 *   - atmosphere (POOL, seeds/haunted_mansion_florals_atmosphere.json)
 *       the fog-touched dusk lighting condition.
 *   - decayDetail (POOL, seeds/haunted_mansion_florals_decay_detail.json)
 *       one small elegant-patina texture detail (tarnished bronze, weathered
 *       marble, verdigris copper) — gated ~65%, keeps "elegant not
 *       derelict" grounded without cluttering every render.
 *   - floraCast   (fixed list, inline) — named ivy/rose/dried-vine trio,
 *       mirrors BloomBot's "name the actual species" law.
 *   - wildlifeAccent (fixed list, inline, gated ~70%) — a friendly nocturnal
 *       garden creature (raven or bat nested among the blooms, black cat,
 *       moth, owl, firefly-scatter, garden spider) as peripheral accent
 *       only, never the subject. Raven/bat entries doubled + reworded to
 *       sit visibly amid the flowers (Kevin's R1 note: more clearly-legible
 *       Halloween nods, raven/bats "amongst the flowers") and gate raised
 *       from 35%->70% so the accent actually shows up most renders instead
 *       of being a rare 1-in-3.
 *   - framing (fixed list, inline) — composition axis; every option keeps
 *       the WHOLE structure + floral cascade readable, never a macro crop
 *       that dissolves the hero scene.
 */

const STRUCTURES = require('../seeds/haunted_mansion_florals_structure.json');
const SIGNATURES = require('../seeds/haunted_mansion_florals_signature.json');
const ATMOSPHERES = require('../seeds/haunted_mansion_florals_atmosphere.json');
const DECAY_DETAILS = require('../seeds/haunted_mansion_florals_decay_detail.json');

// ─── Cloned verbatim from bloombot/shared-blocks.js (2026-09) ───
const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE — NON-NEGOTIABLE ━━━
No humans, no faces, no figures, no silhouettes, no shadows of people anywhere in the frame. Wildlife (hummingbird, bee, butterfly, dragonfly, small lizard) is allowed only as peripheral accent — never the subject.`;

const DENSITY_BLOCK = `━━━ DENSITY — NON-NEGOTIABLE ━━━
Frame is FILLED edge-to-edge with blooms. Foreground, midground, background — every plane dense. No bare ground, no empty sky pockets, no negative-space rest. Petals overlap in thick carpets, vines cascade, climbing flowers consume vertical surfaces. Mix tiny microflowers with oversized statement blooms in the same frame for scale variety. Every entry must satisfy this rule, no matter the per-path scene.`;

const ARRANGEMENT_BLOCK = `━━━ ARRANGEMENT — CURATED, NOT RANDOM ━━━
3-4 species, repeated and MASSED into thick clusters. Patchwork clumps of contrasting species, not uniform fields, not random salad. The selection is INTENTIONAL — picture a high-end florist's masterpiece blown up to landscape scale. The 4-5 colors of the palette are balanced across the frame so no single color dominates more than its share.`;

const ANTI_DRIFT_BLOCK = `━━━ DEFAULTS TO RESIST ━━━
Balance warm with equal cool across the frame — orange/amber/coral is one accent among many, never the scene's overall mood (EXCEPTION: a sunset or desert scene is legitimately warm). No pink/rose dominance unless the palette names it. Use the exact species named in the roster.`;

// ─── This path's own core-identity mandate ───
const CORE_MANDATE_BLOCK = `━━━ HAUNTED-MANSION-FLORALS CORE MANDATE (NON-NEGOTIABLE) ━━━
This is BloomBot's Halloween-season gothic-romantic garden path. Wild, overgrown FLOWERING VINES — ivy, climbing dark roses, dried trailing vine — are the unmistakable HERO of every frame, consuming and cascading over an elegant old estate structure (a wrought-iron gate, a mansion facade, a garden wall). The architecture is a backdrop and canvas FOR the florals, never the reverse — the flowers still fill the frame as densely and richly as any other BloomBot scene. The register is ELEGANT and GOTHIC-ROMANTIC, like a lovingly wild moonlit estate garden time forgot — NOT derelict, NOT a haunted-house horror set, NOT a crime scene. NEVER include people, ghosts, skeletons, blood, cobweb-horror gore, jack-o'-lanterns, or costume-Halloween iconography of any kind — the seasonal mood comes ENTIRELY from atmosphere: dark florals, fog, dusk/moonlight, and old ironwork or stone. Light weathering (tarnish, patina, moss) is charming, not decay — never "crumbling", "ruined", or "rotting". THE SCENE MUST READ AS NIGHT OR DEEP DUSK, NEVER BRIGHT DAYLIGHT: the sky, background, and every shadowed plane stay dark (deep indigo, charcoal, near-black) — lantern light, candlelight, or moonlight exist ONLY as small warm or cool POOLS of light against that surrounding darkness, never brightening or paling the overall frame into an overcast-daylight look. Flower and foliage color skews deep, ink-saturated, and shadow-rich (near-black crimson, ink-wine burgundy, charcoal-plum, deep bottle-green) rather than bright, cheerful, saturated red or pink — jewel-DEEP, not jewel-BRIGHT.`;

// ─── Small fixed-list axes — no generated pool needed (short, combinatorial) ───
const FLORA_CASTS = [
  "Boston ivy in deep burgundy-red autumn color, black-red 'Black Baccara' roses in full bloom, and pale silver-grey dried clematis vines curling like lace",
  'English ivy in near-black emerald green, wine-dark red roses, and rust-brown dried wisteria vines',
  'Virginia creeper turning deep crimson, velvet burgundy roses, and dried honeysuckle vines gone silver',
  "Deep-green climbing ivy, moody plum-purple 'Twilight Zone' roses, and tangled dried bittersweet vine studded with rust-orange berries",
  "Glossy dark ivy, dusky mauve 'Sterling Silver' roses fading to lavender-grey, and pale dried grapevine tendrils",
  'Creeping fig in deep forest green, deep-red velvet roses, and dried morning-glory vines curled tight',
  "Silver-variegated English ivy, blush-to-wine ombré 'Distant Drums' roses, and dried trumpet-vine seed pods",
  'Boston ivy gone wine-red, near-black deep-crimson roses, and silvery lichen-draped dried vine tendrils',
  "Dark climbing ivy, deep maroon 'Falstaff' roses, and dried rosehip clusters glowing rust-orange",
  'Algerian ivy in deep glossy green, dusky purple-black roses, and pale dried clematis seed-heads',
  'Climbing hydrangea vine gone rust-brown, deep-red roses, and trailing dark ivy tendrils',
  "English ivy, moonlit white 'Iceberg' roses gone silver in the dusk, and dried pale silver-grey vine",
];

const WILDLIFE_ACCENTS = [
  'a glossy raven perched low directly amid the roses themselves, its whole body a large, unmistakable black silhouette against the pale blooms, one bloom brushing its folded wing, head cocked and feathers catching the last violet light',
  'a sleek black cat sitting statue-still atop a stone pillar, its dark silhouette clearly readable against the fog, tail curled neatly around its paws',
  'a small owl watching from a shadowed windowsill, its round pale-feathered shape standing out clearly against the dark stone, golden eyes half-lidded and calm',
  'a fat orange-and-black garden spider sitting at the center of a large, clearly-visible dew-strung web spun between two rose canes, the web itself rendered as a distinct silver pattern against the dark leaves',
  'a bat hanging folded and still from a vine directly above a cluster of blooms, its wings a large, sharply-defined dark cloak-shape clearly silhouetted against the paler petals behind it',
  'a raven perched deep within a cascade of dark roses, its black form large and clearly legible among the petals, one eye catching a glint of moonlight',
  'a pair of bats roosting quietly upside-down among the densest tangle of ivy and rose canes, their folded wings rendered as two unmistakable dark shapes clearly visible against the foliage, tails just brushing the topmost blooms',
  'a raven perched boldly at the very top of the structure, wings half-spread and sharply black against the pale moonlit sky, positioned high enough that its full silhouette reads clearly above the floral mass',
  'two or three bats caught mid-flight just above the cascading blooms, wings spread wide, their sharp black shapes standing out crisply against the pale fog-lit sky behind them',
  'a raven standing directly in the thick of the nearest rose cluster in the immediate foreground, close enough that individual petals brush its glossy black chest, its whole body large, unmistakable, and impossible to miss against the blooms',
  'a loose scatter of bats strung out low across the frame mid-flight, weaving between the tallest flowering spires at exactly eye level, each one a sharp, clean black silhouette cut crisply against the pale fog behind',
];

const FRAMINGS = [
  'Wide symmetric composition centered directly on the structure, the ironwork or facade filling the middle of the frame with fog receding evenly on both sides.',
  'A three-quarter angled view of the structure, one side catching more light, the other sinking into soft fog, the full structure kept readable.',
  'A low camera angle looking slightly up at the ironwork or facade, so it looms gently against the dusk sky, its full height still visible.',
  'A mid-wide view with the structure slightly off-center, foreground florals framing one edge of the shot while the structure recedes into misty depth behind.',
  'A straight-on eye-level view with the structure centered and the floral cascade balanced across both sides, classic and painterly.',
  'A wide establishing view placing the structure smaller within a larger misty garden setting, florals still dominant in the foreground plane.',
  'A gently elevated three-quarter view looking down and across the structure, showing both the floral cascade and the ground or path beneath it.',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const structure = picker.pickWithRecency(STRUCTURES, 'haunted_mansion_florals_structure');
  const atmosphere = picker.pickWithRecency(ATMOSPHERES, 'haunted_mansion_florals_atmosphere');
  const floraCast = picker.pickWithRecency(FLORA_CASTS, 'haunted_mansion_florals_flora_cast');
  const framing = picker.pickWithRecency(FRAMINGS, 'haunted_mansion_florals_framing');

  // MONEY-SHOT axis — present roughly half the time, never mandatory, so
  // every render doesn't converge on "the same one rose" (per the codebase's
  // own hard-won lesson on signature-feature homogenization).
  const signature =
    Math.random() < 0.5
      ? picker.pickWithRecency(SIGNATURES, 'haunted_mansion_florals_signature')
      : null;
  const signatureBlock = signature
    ? `\n━━━ THE MONEY SHOT — signature floral moment, must visibly anchor the render ━━━\n${signature}\n`
    : '';

  // Elegant-decay texture — gated ~65% so the "weathered, not derelict"
  // grounding detail shows up often but doesn't clutter every single frame.
  const decay =
    Math.random() < 0.65
      ? picker.pickWithRecency(DECAY_DETAILS, 'haunted_mansion_florals_decay_detail')
      : null;
  const decayBlock = decay
    ? `\n━━━ AN ELEGANT-DECAY DETAIL (charming patina, never disrepair) ━━━\n${decay}\n`
    : '';

  // Wildlife accent — peripheral only, gated ~85% (raised from 35%→70%→85%
  // across R1/R2/R3 per Kevin's direct, repeated note: more legible
  // Halloween nods, specifically bats or a raven amongst the flowers) —
  // still per NO_PEOPLE_BLOCK's own "peripheral accent — never the subject"
  // rule. R2 fix: R1's raised gate wasn't enough on its own — 3/3 R2 renders
  // picked a wildlife line (fireflies x2, luna moth x1) that the final image
  // rendered ZERO trace of, swallowed by the DENSITY block's wall of blooms.
  // Dropped the invisible-in-practice firefly/moth entries and reworded
  // every remaining one with explicit silhouette/legibility language. R3
  // fix: even after that reword, this round's batch landed 0-for-3 on
  // raven/bat specifically (one render got a spider, two got no creature at
  // all) despite raven/bat already being the majority of the pool — so
  // raised the gate again (70%→85%) and added two more raven/bat variants
  // (now 8 of 11 entries) to make the exact accent Kevin named show up
  // almost every render instead of being a coin flip away.
  const wildlife =
    Math.random() < 0.85
      ? picker.pickWithRecency(WILDLIFE_ACCENTS, 'haunted_mansion_florals_wildlife')
      : null;
  const wildlifeBlock = wildlife
    ? `\n━━━ A CLEARLY-VISIBLE CREATURE ACCENT (friendly, never the subject, but must survive the render as a legible shape — not lost in the floral density) ━━━\n${wildlife}\n`
    : '';

  return `You are a fine-art gothic-floral concept artist writing HAUNTED-MANSION-FLORALS scenes for BloomBot's Halloween season. Wild, overgrown flowering vines have consumed an elegant old estate structure at moody, fog-touched dusk — ivy and dark roses and dried vine as the unmistakable hero, gothic-romantic and beautiful, never scary. Output wraps with the bot's style prefix + suffix.

${NO_PEOPLE_BLOCK}

${DENSITY_BLOCK}

${ARRANGEMENT_BLOCK}

${ANTI_DRIFT_BLOCK}

${CORE_MANDATE_BLOCK}

━━━ THE STRUCTURE (stage the scene here, keeping the floral consumption + depth layers) ━━━
${structure}
${signatureBlock}
━━━ THE FLORA CAST — use these exact named species, massed and repeated ━━━
${floraCast}
${decayBlock}
━━━ ATMOSPHERE — fog-touched dusk light ━━━
${atmosphere}
${wildlifeBlock}
━━━ FRAMING ━━━
${framing}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
