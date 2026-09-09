/**
 * FarmBot — duck-pond (REWORK 2026-09-09, content overhaul not a rebuild).
 *
 * Kevin's verdict after a sibling QA pass found the old pool ~12% genuinely
 * duck-focused and 45% drifted into Japanese koi-garden/zen-garden imagery
 * (stone lanterns, curved bridges, maple trees), zero feeding content, and a
 * grammar rule that structurally BANNED the animal from ever being the
 * sentence's subject: "can you try and iterate on duck pond, see if you can
 * get it to show ducks or just cute pond scenes? frogs/ducks/birds... or
 * farm animals grazing next to it, etc. i'd hate to just throw that path
 * away." Full content rework, same path key, same koi-free Western farm
 * world FarmBot already lives in.
 *
 * ANIMAL-SPOTLIGHT-FORWARD BY DESIGN (applying the lesson found on
 * summer-evening-by-the-pond.js and barn-animal-shelter-interior.js from
 * the start, not retrofitted): the ANIMAL POND LIFE block is unconditional
 * — pulled on EVERY render, character or not — and sits FIRST in the
 * template, ahead of even THE CHARACTER, per the fleet-wide maxTokens: 400
 * lesson (content positioned late in a dense brief reliably gets thinned or
 * dropped by Sonnet's brief-to-Flux-prompt rewrite, independent of whether
 * the hard token cap is actually hit). A duck pond with no visible animal
 * life at all doesn't serve the concept, so this path does NOT gate animal
 * presence behind the human-character roll the way other paths gate their
 * ANIMAL_COMPANIONS pick.
 *
 * TWO bespoke pools (required directly, NOT added to pools.js — path-local,
 * mirrors BARN_INTERIOR_PLACE's precedent):
 *   - POND_LIFE (100, farmbot_duck_pond_scenes.json) — animal-hero pond-life
 *     scenes (adult ducks, ducklings in a row, frogs on lily pads, small
 *     birds at the water's edge, farm animals grazing/drinking at the pond
 *     edge, occasional mixed moments). No human content — safe standalone.
 *   - POND_FEEDING (20, farmbot_duck_pond_feeding.json) — the "feeding the
 *     ducks" variant from Kevin's own original creative brief (breadcrumbs/
 *     cracked corn tossed from an implied hand, ducks gathering eagerly).
 *     Only ever picked when a character is present — it's the animal block
 *     AND the activity in one, so the generic ACTIVITY pull is skipped for
 *     these renders to avoid two competing action descriptions.
 *
 * Differentiator from summer-evening-by-the-pond.js (Kevin's explicit ask):
 * that path is about the intimate POND SETTING itself with a character:
 * this path's hero is the ANIMAL LIFE AT the pond — ducks/ducklings/frogs/
 * birds/grazing farm animals are always the sentence's named-first subject,
 * the pond is the setting they're framed against.
 *
 * "ANIMAL COMPANY"-style neutral header, never "A VISITOR" (per the
 * standing animal-spotlight-parity lesson) — this path has no separate
 * "visitor" concept anyway, the animals ARE the whole point.
 */

const { lookOverride } = require('../shared-blocks');
const pools = require('../pools');

const POND_LIFE = require('../seeds/farmbot_duck_pond_scenes.json');
const POND_FEEDING = require('../seeds/farmbot_duck_pond_feeding.json');

// Manual content filter on the SHARED CAMERA_COMPOSITION pool (not a bare
// pull) — a pre-render dry-run of this path surfaced two live, confirmed
// bugs still sitting in the shared 109-entry pool despite the documented
// source-level fix (FARMBOT_PATH_BUILD_STATE.md, "back-turned + dwarfing"
// entry): (1) ~11 "tiny"/"dwarfed"/"small within" character-scale entries
// still exist — the earlier fix only stopped FUTURE generation via the gen
// script's meta-prompt, it never scrubbed the already-scaled pool, and this
// directly violates the standing hard rule ("Camera framing: never
// back-turned/dwarfing language"). (2) plain indoor/village framings
// ("Cozy interior composition", "Looking through a farmhouse window",
// "Framed through a barn doorway", "village street"/"rooftops") are
// setting-incompatible with an outdoor pond scene whose whole point is
// intimate closeness to the animal life — same "tags/pool don't know what
// physically fits together" gotcha documented on fishing-dock and
// village-street-wandering. Fixing the shared JSON file itself is out of
// this path's scope (other paths may rely on it, and it wasn't part of
// this task) — flagged for the orchestrator; filtered locally here instead,
// the same pattern fishing-dock used. 51/109 entries survive (wide shots,
// medium framing, intimate close-ups, foreground foliage, low-angle) —
// plenty of variety with zero dwarfing/village/indoor drift.
const CAMERA_INCOMPATIBLE =
  /\b(tiny|dwarf|dwarfed|small within|dominating the upper|farmhouse window|barn doorway|village|rooftops?|cozy interior|cosy interior)\b/i;
const POND_CAMERA = pools.CAMERA_COMPOSITION.filter((s) => !CAMERA_INCOMPATIBLE.test(s));

module.exports = ({ sharedDNA, picker }) => {
  // Fleet-standard 60/40 character/pure-scene split (2026-09-09 mid-push
  // directive, FARMBOT_PATH_BUILD_STATE.md) — governs the HUMAN character
  // only. Animal presence itself is unconditional (see header note).
  const includeCharacter = Math.random() < 0.6;

  // Feeding-the-ducks only ever fires when a character is present (it needs
  // a hand to hold the feed) — roughly 40% of character renders, ~24% of
  // all renders, giving Kevin's requested content real, visible frequency
  // without swallowing the whole path.
  const isFeeding = includeCharacter && Math.random() < 0.4;

  const pondLife = isFeeding
    ? picker.pickWithRecency(POND_FEEDING, 'pond_life_feeding')
    : picker.pickWithRecency(POND_LIFE, 'pond_life');

  const character = includeCharacter
    ? pools.pickCharacter(picker, ['ANY', 'leisure', 'farm'], 'duck_pond_character')
    : null;

  // A feeding entry already IS the activity (an implied hand scattering
  // feed) — pulling a second, unrelated leisure ACTIVITY on top of it would
  // compete for the same "what's happening" beat and risk contradicting it.
  // Only pull the generic leisure ACTIVITY for a non-feeding character
  // render.
  const activity =
    includeCharacter && !isFeeding
      ? picker.pickWithRecency(pools.byTags(pools.ACTIVITY, ['leisure']), 'duck_pond_activity')
      : null;

  const camera = picker.pickWithRecency(POND_CAMERA, 'duck_pond_camera');
  const magic =
    Math.random() < 0.15
      ? picker.pickWithRecency(pools.GENTLE_MAGIC.map((e) => e.description), 'duck_pond_magic')
      : null;

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ ANIMAL COMPANY (present in every render — the hero of the shot, a required, concrete, clearly-visible presence, not just background mood) ━━━
${pondLife}
${character ? `\n━━━ THE CHARACTER ━━━\n${character}\n` : ''}
${activity ? `━━━ WHAT'S HAPPENING ━━━\n${activity}\n\n` : ''}━━━ CAMERA ━━━
${camera}
${magic ? `\n━━━ ONE SMALL SERENDIPITY TOUCH ━━━\n${magic}\n` : ''}
${
  character
    ? `render a warm, unhurried farm-pond moment — the animal life named above is
the clear centerpiece of the frame, rendered with just as much loving
richness and detail as the character sharing the scene with it, who is a
clear, warmly present figure at the water's edge, never a small or distant
speck within a wide landscape. Every face in the frame, human and animal
alike, stays clearly separate and fully legible, each keeping its own open
pocket of air around it so every expression reads clean and unambiguous.`
    : `no human figure anywhere in the frame — this is a warm, unhurried farm-pond
moment carried entirely by the animal life named above, rendered as the
clear centerpiece of the frame with real, natural detail and charm. Every
animal face stays clearly separate and fully legible, its own open pocket
of air around it, so every expression reads clean and unambiguous.`
} no text, no words, no watermarks, gallery quality`;
};
