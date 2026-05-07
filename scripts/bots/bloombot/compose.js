/**
 * BloomBot brief composer — every path uses this.
 *
 * Inputs:
 *   scene        — hardcoded SCENE block from the path builder (the one
 *                  thing that differs per path)
 *   sharedDNA    — { palette, lighting } from rollSharedDNA
 *   vibeDirective — engine-injected mood text (cinematic only)
 *   picker       — pickWithRecency provider
 *   regionKey    — optional override; tropical-paradise locks to 'tropical'
 *
 * Output: a complete Sonnet brief string. Engine polishes to ~70-100 words
 * (or 85-115 for closeup) before passing to Flux.
 */

const blocks = require('./shared-blocks');
const { REGION_KEYS_GENERAL, regionRosterPrompt } = require('./species-roster');

module.exports = function composeBrief({
  scene,
  sharedDNA,
  vibeDirective,
  picker,
  regionKey,
}) {
  const region = regionKey || picker.pickWithRecency(REGION_KEYS_GENERAL, 'region');
  const roster = regionRosterPrompt(region);

  return `You are a fine-art floral concept artist writing a SCENE DESCRIPTION for BloomBot. Output is a 70-100 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullet points in the output — just the prose.

━━━ SCENE ━━━
${scene}

━━━ COLOR PALETTE — STRICT ━━━
${sharedDNA.palette}

Render the palette EXACTLY as named — those are the only colors in the scene. The palette overrides any default Flux training-prior color. If the palette names "no other color", do not introduce additional hues.

━━━ FLOWER SPECIES ━━━
${roster}

Use the actual species names in your output (e.g. "kangaroo paw", "king protea", "torch ginger"). Do NOT substitute generic "wildflowers" or "blossoms". Each named species in its true natural color, then mass it in the scene at the palette's named color where they overlap.

━━━ LIGHTING ━━━
${sharedDNA.lighting}

${blocks.ARRANGEMENT_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ANTI_DRIFT_BLOCK}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT ━━━
70-100 words. Comma-separated phrase string. Lead with the SCENE structure, weave in 3-4 named species + palette colors, finish with the lighting. NO preamble, NO ━━━ markers, NO **bold**, NO numbered or bulleted output, NO "render as" trailer. Just the prose.`;
};
