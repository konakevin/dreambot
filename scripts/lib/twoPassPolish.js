/**
 * Two-Pass Polish — port of V4's concept-then-polish pattern (Step 2 of the
 * V4/nightly enhancement port).
 *
 * Single-pass problem: Sonnet has to write a vivid scene description AND
 * compress it to 65-90 words for Flux in one shot. Sensory detail gets
 * sacrificed to fit word count.
 *
 * Two-pass solution:
 *   Pass 1 — Sonnet writes a vivid 150-word concept with no compression
 *            pressure. Full sensory detail.
 *   Pass 2 — Haiku polishes that concept into a 65-90 word Flux-ready prompt,
 *            preserving mandatory anchor phrases (glowing eyes, heavy makeup,
 *            etc.) so they survive compression.
 *
 * Usage from a bot:
 *   bot.twoPassRefinement = {
 *     enabled: true,
 *     conceptWords: 150,             // optional, default 150
 *     polishedWords: '65-90',        // optional, default '65-90'
 *     preservePhrases: ['glowing', 'casting', 'heavy', 'smoky-eye',
 *                       'sharp dark eyeliner'],
 *   }
 */

/**
 * Append an instruction to the existing brief that asks Sonnet for a longer,
 * richer concept instead of the compressed final prompt.
 */
function extendBriefForConcept(brief, conceptWords = 150) {
  return `${brief}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TWO-PASS OVERRIDE — this is the CONCEPT pass, not the final prompt.

INSTEAD of the OUTPUT instruction above (which says 65-90 words), write a VIVID ${conceptWords}-word concept describing the scene in rich detail. Use the extra words to PRESERVE every required visual element from the brief — the eye glow, the heavy gothic makeup, the dead-pale skin, the wardrobe, the demonic tell, the setting, all of it. Don't sacrifice any visual anchor for brevity. A second model will compress this to Flux-ready length.

Output ${conceptWords} words, comma-separated phrases. NO preamble, NO headers.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Build the polish brief for the Haiku compression pass.
 */
function buildPolishBrief({ concept, polishedWords = '65-90', preservePhrases = [] }) {
  const preserveList = preservePhrases.length
    ? `\n\nMANDATORY: the following phrases (or close paraphrases) MUST appear in your compressed output. Do NOT compress them away — they are the visual anchors that make the render work:\n${preservePhrases.map((p) => `   • "${p}"`).join('\n')}`
    : '';

  return `You are compressing a vivid scene concept into a Flux-ready prompt.

INPUT CONCEPT (${concept.split(/\s+/).length} words):
${concept}

TASK: rewrite this concept as a ${polishedWords}-word Flux prompt. Comma-separated phrases. Preserve every visual element from the concept — character description, makeup, glow, wardrobe, setting, lighting, mood. Drop only filler words and redundant adjectives. The compressed prompt should feel as vivid as the concept.${preserveList}

Output ONLY the compressed prompt — comma-separated phrases, ${polishedWords} words, NO preamble, NO headers.`;
}

module.exports = {
  extendBriefForConcept,
  buildPolishBrief,
};
