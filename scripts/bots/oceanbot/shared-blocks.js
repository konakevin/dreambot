/**
 * OceanBot — shared prose blocks injected into every path's Sonnet brief.
 *
 * BBC Blue Planet × Pre-Raphaelite oil painting × Master and Commander.
 * The full ocean experience — underwater wonder, surface drama, maritime
 * myth, deep-sea bioluminescence, polar seas, age-of-sail, sea-monsters,
 * sunken civilization, painted mermaid mythology. Concept: NatGeo
 * cinematic precision crossed with Turner/Aivazovsky/Waterhouse oil-painting
 * heritage. The OCEAN is the hero, biome-as-frame, figures (when present)
 * are scale-provers OR mythic-icons depending on path.
 *
 * Each path picks one of four mediums (hyperreal/render/canvas/illustration)
 * and rolls a bespoke ~10-axis pool set. No cross-path pool reuse per
 * [[feedback_full_bespoke_per_path_no_shared_pools]].
 *
 * 2026-06-01 — fresh-design v2 bot. Legacy 2026-05 OceanBot was retired
 * 2026-05-05 (deleted in 013ca103, merged into TravelBot→EarthBot). This
 * is a NEW bot built on the v2 axis-system architecture — not a restore.
 */

// Universal prompt prefix injected at the head of every Sonnet-built prompt.
// Medium-agnostic — the rolled medium's flux_fragment carries the visual
// register. Keep this short — heavy per-medium language belongs in the
// promptPrefixByMedium overrides on the bot.
const PROMPT_PREFIX =
  'cinematic ocean keyframe, museum-grade composition, atmospheric depth, layered tonal range, photographed-on-location feel — NOT cartoon, NOT toy, NOT clip-art';

// Universal suffix — quality finishing tags + universal bans.
const PROMPT_SUFFIX =
  'no text, no words, no letters, no watermarks, no logos, hyper-detailed, atmospheric, layered depth, masterwork composition';

// Scene-as-hero mandate — used by nature paths where the OCEAN is the
// subject, NOT a tiny figure in a vast scene. Distinguishes from
// 'epic_tiny' framing. Some paths (ghost-ship, pirates, kraken, mermaid)
// SKIP this block because they need the figure/vessel as the anchor.
const SCENE_AS_HERO_BLOCK = `━━━ OCEAN IS HERO ━━━
The ocean / biome fills 60-80% of the frame. The scene IS the subject —
caustic light, water column, marine life, atmospheric depth, color
gradient, the way light moves through water. Optional small figures
(diver / whale / kelp-frond / tiny boat at distance) are SCALE PROVERS,
never close-up portraits. NEVER a hero-character render.`;

// Anchor-as-hero mandate — used by ghost-ship, pirates, kraken-leviathan,
// mermaid-myth where a vessel/figure/creature IS the focal anchor and the
// ocean is the dramatic backdrop. Anchor fills 40-60% of frame.
const ANCHOR_AS_HERO_BLOCK = `━━━ ANCHOR IS HERO ━━━
The vessel / leviathan / mythic figure fills 40-60% of the frame as the
dramatic focal anchor. The OCEAN is the moody backdrop — vast, layered,
weathered. Scale provers (smaller boats / distant figures / sea creatures
nearby) prove the anchor's scale. Multi-tier depth: foreground texture
(spray / kelp / ice / fog) → anchor mid-frame → atmospheric ocean depth.`;

// Camera framing mandate — same pattern as MangaBot, BrickBot. The rolled
// camera_framing axis is the LAW. Without this block, Flux defaults to
// generic eye-level establishing shots regardless of pool variety.
const CAMERA_FRAMING_MANDATORY_BLOCK = `━━━ CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
⚠️ NON-NEGOTIABLE — the rolled camera_framing axis above DRIVES the
composition. Render the EXACT framing described:
• LOW-ANGLE LOOKING UP through water column at sun-shaft caustics
• ABYSSAL DEPTH looking down into deep blue void
• OVER-THE-DECK / OVER-THE-RAIL of a vessel
• THROUGH-FOREGROUND-KELP / THROUGH-WAVES reveal
• AERIAL / DRONE looking down on whale or wreck
• SUBMERGED 3/4 perspective from below toward surface
• EYE-LEVEL through fog / spray at vessel mid-frame
NEVER substitute a generic eye-level wide shot.`;

// No-text mandate — ocean scenes attract spurious nautical signage from
// Flux training data (ship names painted on hulls, "DANGER" buoys,
// lighthouse-text). Keep as a reinforcement.
const NO_TEXT_BLOCK = `━━━ NO TEXT IN SCENE ━━━
No visible text anywhere — no ship-name letters on hulls, no signage
on buoys, no painted-text decals, no flag wordmarks, no banner text.
Flags can show heraldic emblems / skulls / patterns but NO LETTERS.`;

// Painted-medium register — used by ghost-ship, kraken-leviathan,
// lost-cities, pirates, mermaid-myth. Forces Turner / Aivazovsky /
// Waterhouse / Caspar-David-Friedrich oil-painting heritage when the
// rolled medium is `canvas`. Falls through inert for hyperreal/render.
const PAINTED_MARITIME_BLOCK = `━━━ PAINTED MARITIME HERITAGE (when medium=canvas) ━━━
Turner / Aivazovsky / Winslow Homer / Caspar David Friedrich /
Waterhouse / Rossetti tradition — heavy impasto oil brushwork visible
on stretched canvas, dramatic chiaroscuro, atmospheric glazes, age-of-sail
romanticism, museum-gallery masterwork quality. Painterly-realism with
brush-stroke texture and pigment layering, NOT photoreal, NOT digital-smooth.`;

// Single-tail mermaid anatomy lock — used ONLY by mermaid-myth. Inherited
// from the legacy OceanBot's hard-won anti-Starbucks-logo bans.
const MERMAID_ANATOMY_LOCK = `━━━ MERMAID ANATOMY LOCK (mermaid-myth only) ━━━
TRADITIONAL ONE-TAIL MERMAID — half-human upper body fused into ONE
SINGLE FUSED FISH TAIL ending in ONE FLUKE. The tail is ONE continuous
scaled appendage from her waist to one fluke, exactly like a real fish.
NOT human legs. NOT feet. NOT toes. NOT ankles. NOT two tails. NOT
bifurcated tail. NOT split tail. NOT Starbucks-logo two-tail. NOT a
woman in a dress wading on land. NOT siren-with-legs. NOT walking,
NOT standing on land. Single fused mono-tail with ONE fluke.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  SCENE_AS_HERO_BLOCK,
  ANCHOR_AS_HERO_BLOCK,
  CAMERA_FRAMING_MANDATORY_BLOCK,
  NO_TEXT_BLOCK,
  PAINTED_MARITIME_BLOCK,
  MERMAID_ANATOMY_LOCK,
};
