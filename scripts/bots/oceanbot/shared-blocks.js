/**
 * OceanBot — shared prose blocks injected across path templates.
 *
 * Identity: old naval lore × scenic ocean nature. NatGeo deep-water
 * cinematography crossed with age-of-sail maritime tradition. Five naval-lore
 * paths (pirates / kraken-leviathan / ghost-ship / shipwreck-kingdom /
 * lost-cities) + five scenic paths (deep-wonder / whale-encounter /
 * reef-paradise / polar-seas / bioluminescent-night).
 *
 * Design constraints applied throughout (per 2026-06-01/02 fleet cruft sweep):
 *   • Short single-noun anchors only — no enumeration locks
 *     (CLAUDE.md hard rule + BOT_SCENE_QUALITY_PLAYBOOK first-named-noun trap)
 *   • Zero negation chains in any layer (per feedback_negative_prompt_leak)
 *   • Per-medium overrides only where they earn their keep, ≤150ch each
 *   • Pre-1850 wooden vessels only for ship rendering
 *     (lesson from legacy commit f7f319cf — modern hulls / steamships /
 *     submarines are off-brand for the naval-lore register)
 *   • Standard mediums only — NO bot-only mediums. Legacy v1's bot-only
 *     maritime_oil_* mediums were the vehicles for the negation-soup
 *     that triggered the retirement.
 */

// Universal prompt prefix — short single-anchor. Bot-wide identity is
// "cinematic ocean keyframe with depth and atmosphere." No multi-noun lists.
const PROMPT_PREFIX = 'cinematic ocean keyframe, atmospheric depth, layered tonal range';

// Universal suffix — minimal quality tags + the no-text guard.
// Deliberately tiny: heavy suffixes were the cruft-sweep pattern.
const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper-detailed, atmospheric';

// Canvas medium override — Pre-Raphaelite maritime oil tradition. This
// is the only mediumStyles override OceanBot ships with. ≤150ch, single
// painter-tradition anchor (Turner is the dominant first-named noun, the
// other names are secondary anchors that Flux uses as flavor not lock).
const CANVAS_MARITIME =
  'Turner / Aivazovsky / Winslow Homer maritime oil tradition, museum-gallery painted-canvas brushwork';

// Ship anatomy guardrail — embedded into ANY naval-lore path template
// (pirates / ghost-ship / shipwreck-kingdom). Positive-language only.
// Per legacy lesson f7f319cf: modern hulls / steamships / submarines /
// propellers are off-brand. The guardrail says what we WANT, not what
// we don't. Flux's CLIP attends to the first-named noun ("wooden") and
// the descriptive props bias the era correctly.
const PRE_1850_VESSEL_BLOCK = `━━━ VESSEL ERA — PRE-1850 WOODEN ━━━
The vessel is a pre-1850 wooden sailing ship: timber hull, hemp rigging, canvas sails, brass and iron fittings. Age of sail era — galleons, schooners, brigs, barques, frigates, longships, junks. Wood, rope, canvas, brass.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CANVAS_MARITIME,
  PRE_1850_VESSEL_BLOCK,
};
