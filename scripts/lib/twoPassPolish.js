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
 *
 * preservePhrases note (softened 2026-05-29): used to be a hard MANDATORY
 * "MUST appear" rule. That bit MangaBot magical-girl when sensory anchors
 * were rolled that didn't fit the rolled concept (noir cigarette/convenience-
 * store phrases on a magical-girl cloudscape transformation) — Haiku
 * couldn't reconcile, refused politely with "I notice... Could you clarify?",
 * and the refusal text shipped as the Flux prompt. The softened wording
 * lets Haiku drop off-genre phrases instead of refusing, and the engine's
 * REFUSAL_PATTERNS now also catches the polite-refusal style as a backstop.
 */
function buildPolishBrief({ concept, polishedWords = '65-90', preservePhrases = [] }) {
  const preserveList = preservePhrases.length
    ? `\n\nPRESERVE WHERE THEY FIT: the following phrases (or close paraphrases) are visual anchors that strengthen the render IF they fit the concept. Weave any that align naturally; DROP any that don't fit the rolled scene rather than forcing them in. Do NOT refuse or ask for clarification — drop a mismatched phrase silently and proceed.\n${preservePhrases.map((p) => `   • "${p}"`).join('\n')}`
    : '';

  return `You are compressing a vivid scene concept into a Flux-ready prompt.

INPUT CONCEPT (${concept.split(/\s+/).length} words):
${concept}

TASK: rewrite this concept as a ${polishedWords}-word Flux prompt. Comma-separated phrases. Preserve every visual element from the concept — character description, makeup, glow, wardrobe, setting, lighting, mood. Drop only filler words and redundant adjectives. The compressed prompt should feel as vivid as the concept.${preserveList}

Output ONLY the compressed prompt — comma-separated phrases, ${polishedWords} words, NO preamble, NO headers. NEVER respond with a question, clarification request, or meta-commentary about the task; if anything in the input feels off, drop it silently and produce the best compressed prompt you can.`;
}

module.exports = {
  extendBriefForConcept,
  buildPolishBrief,
};
