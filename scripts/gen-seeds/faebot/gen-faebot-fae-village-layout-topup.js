#!/usr/bin/env node
/**
 * FaeBot FAEBOT_FAE_VILLAGE_LAYOUT top-up (Stage 2 backfill 2026-06-05).
 *
 * Used by fae-village-axis path — defines the spatial LAYOUT of a fae
 * village (how dwellings are arranged). Existing 84 entries follow a
 * strict CAPS-LAYOUT-LABEL prefix-comma-description pattern (e.g.
 * "SINGLE-SOLITARY layout, one dwelling alone...").
 *
 * REGISTER: 30-55 words. ONE complete layout description. Must lead
 * with a CAPS-LAYOUT-LABEL (HYPHENATED) + " layout, " then a single
 * sentence describing dwelling-count, arrangement, paths/bridges, and
 * spacing. NO dwelling-TYPES (those live in another pool) — only
 * spatial layout.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/faebot_fae_village_layout.json',
  total: 200,
  batch: 20,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new FAE-VILLAGE LAYOUT entries for FaeBot's fae-village-axis path. Each entry describes the SPATIAL LAYOUT of a fae village — how many dwellings, how they're arranged, what connects them, what spacing patterns they form. NO dwelling type details (those come from another pool); ONLY the spatial layout.

Each entry: 30-55 words. ONE complete layout sentence.

━━━ STRICT FORMAT (NON-NEGOTIABLE) ━━━

Each entry MUST follow this pattern exactly:
"[CAPS-LAYOUT-LABEL] layout, [number-of-dwellings] dwellings [arrangement description], [connection mechanism — paths/bridges/ladders], [spacing or threshold detail]."

━━━ EXAMPLE PHRASINGS (mirror exact format) ━━━

"SINGLE-SOLITARY layout, one dwelling alone at the center of a wide sun-dappled clearing, deep enchanted forest pressing in on all sides, no neighbors visible, the dwelling is the sole structure, mossy ground undisturbed around it."

"CLUSTER layout, five dwellings grouped on the ground in a loose scatter across a small fae clearing, painted-pebble paths winding between each, moss carpeting the gaps, a central open area where the paths converge, no dwelling touching another."

"CANOPY-NETWORK layout, six dwellings spread across four ancient oaks, connected by an intricate web of vine-rope bridges and knotted-rope ladders, plank-walkways spiraling individual trunks, the entire village suspended above the forest floor in a continuous linked network."

"VERTICAL-STACK layout, four dwellings stacked at ascending heights along one massive ancient elm trunk, each on its own small platform, connected by spiral wooden stairs winding the bark and short knotted-rope ladders bridging each level to the next."

"OVER-WATER layout, three dwellings positioned on both banks of a forest stream, two clustered on the left bank and one set apart on the right, connected by a stone arch-bridge at the lower crossing and a wooden plank-bridge upstream."

"FAIRY-RING-COURTYARD layout, seven dwellings arranged in a perfect circle around a wide central courtyard of smooth packed earth, stepping-stone paths radiating outward from the center like spokes, the ring closed on all sides with equal spacing."

━━━ VARIETY MANDATE — VALID LAYOUT LABELS to use across ${n} entries ━━━

The existing pool uses these labels — distribute new entries proportionally and add a few new compatible labels:

CORE LABELS (distribute ~60% across these):
- SINGLE-SOLITARY (1 dwelling alone in various clearing contexts)
- CLUSTER (3-8 dwellings on the ground in loose grouping)
- CANOPY-NETWORK (4-9 dwellings suspended in tree canopy w/ rope-bridges)
- VERTICAL-STACK (3-5 dwellings ascending one trunk)
- OVER-WATER (2-5 dwellings spanning a stream / pool / brook)
- PAIR (2 dwellings facing or back-to-back around a trunk / boulder)
- FAIRY-RING-COURTYARD (5-9 dwellings in a perfect ring around a central courtyard)
- CLIFF-LEDGE (4-7 dwellings on cliff-face ledges at various heights)
- HANGING-INVERTED (3-6 dwellings hanging from overhead branches)

EXTENDED LABELS (distribute ~30% across these — propose new compatible labels):
- LINEAR-PROCESSIONAL (dwellings along a meandering forest path)
- AMPHITHEATER-TIERED (dwellings on stepped hillside tiers facing a central point)
- ROOTBALL-NEST (dwellings tucked into the upturned roots of a fallen ancient tree)
- HOLLOW-STUMP-COURTYARD (dwellings ringing inside a giant hollow stump)
- MUSHROOM-RING (dwellings encircling a fairy-ring of giant mushrooms)
- BOULDER-CLUSTER (dwellings nestled against and around a giant boulder cluster)
- WATERFALL-LEDGE (dwellings on tiered ledges beside a forest waterfall)
- HEDGE-MAZE (dwellings hidden within the corridors of a tall hedge-maze)
- CROSSROADS (dwellings clustered around a 4-way forest path intersection)
- ARCHWAY-GATE (dwellings flanking and lining a grand natural archway)
- ISLAND-GROVE (dwellings on a tiny island in a forest pond, reached by stepping stones)
- TWIN-CANOPY (dwellings split across two adjacent canopy giants, bridged at one main span)
- TERRACED-HILLSIDE (dwellings stepped down a moss-covered hillside in 3-5 terraces)
- CRESCENT-MOON-ARC (dwellings forming a crescent arc around a central pool/meadow)

EXOTIC LABELS (~10% to add)
- SUSPENDED-BASKET (dwellings hanging in pendant-baskets from a single great branch)
- FUNGUS-COLONY (dwellings built into the caps of a colony of giant glowing mushrooms)
- GIANT-FLOWER (dwellings inside the bells of a cluster of giant cup-flowers)
- HONEYCOMB-CELL (dwellings arranged in a honeycomb of hexagonal alcoves)
- SPIRAL-ASCENT (dwellings spiraling up an immense corkscrew root or vine)
- CRESCENT-POOL (dwellings ringed around a crescent-moon-shaped pool)
- STORK-NEST (dwellings on tall platform-posts above the forest floor like nests)

━━━ HARD MANDATES ━━━

- Lead with CAPS-LAYOUT-LABEL followed by " layout, " — the label is hyphenated UPPERCASE.
- Specify a SPECIFIC dwelling-count (NEVER "many", "several", "a few" — use a number).
- Describe the CONNECTION MECHANISM (paths / bridges / ladders / stairs / stepping-stones / rope-spans / vine-spans).
- Describe SPATIAL DETAILS (spacing, geometry, orientation, central feature).
- Each layout LABEL can appear multiple times (e.g. multiple SINGLE-SOLITARY entries with different clearing contexts) but each entry's setting context must be DIFFERENT.

━━━ HARD BANS ━━━

- NO dwelling TYPE details (mushroom-cottage / acorn-cap-house / leaf-hut etc.) — that lives in another pool.
- NO inhabitants / fae characters in the layout entries (people-less spatial description).
- NO modern objects (no doors-with-knockers, no chimneys-with-bricks, no streetlamps).
- NO "magical glowing" overload — restrained register, leave magic to other axes.
- NO repeating the same layout-label + count + context combo.

━━━ OUTPUT ━━━

JSON array of ${n} strings, each strictly in "[CAPS-LABEL] layout, ..." form. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
