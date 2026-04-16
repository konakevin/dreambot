/**
 * Self-Insert Detector — determines if a user prompt contains a self-reference
 * ("put me", "I'm standing", "myself in", etc.) that should trigger cast injection.
 *
 * Returns a cleaned prompt with self-references removed for scene building.
 * Avoids false positives like "show me a castle" (imperative, not self-insert).
 */

export interface SelfInsertResult {
  isSelfInsert: boolean;
  cleanedPrompt: string;
}

// FALSE POSITIVES — imperatives that contain "me" but aren't self-insert
const FALSE_POSITIVES = [
  /\bshow me a\b(?!\s+(?:in|at|on|as|standing|sitting|walking|riding|holding))/i,
  /\bgive me\b/i,
  /\btell me\b/i,
  /\blet me see\b/i,
  /\bsend me\b/i,
  /\bteach me\b/i,
];

// HIGH CONFIDENCE TRIGGERS — user explicitly wants themselves in the scene
const TRIGGERS = [
  /\bput me\b/i,
  /\bplace me\b/i,
  /\bme as a\b/i,
  /\bme as an\b/i,
  /\bi'?m standing\b/i,
  /\bi'?m sitting\b/i,
  /\bi'?m walking\b/i,
  /\bi'?m riding\b/i,
  /\bi'?m holding\b/i,
  /\bi'?m wearing\b/i,
  /\bi'?m running\b/i,
  /\bi'?m fighting\b/i,
  /\bmyself in\b/i,
  /\bmyself on\b/i,
  /\bmy face\b/i,
  /\bme in a\b/i,
  /\bme in the\b/i,
  /\bme on a\b/i,
  /\bme on the\b/i,
  /\bme at a\b/i,
  /\bme at the\b/i,
  /\bshow me in\b/i,
  /\bshow me at\b/i,
  /\bshow me on\b/i,
  /\bportrait of me\b/i,
  /\bselfie\b/i,
  // Bare "me [verb]ing" — matches "me sitting", "me walking", "me holding",
  // "me standing", "me running", etc. Natural phrasing users actually type.
  // False positives (give me, tell me, let me see, send me, teach me) are
  // already caught above and return early.
  /\bme \w+ing\b/i,
];

export function detectSelfInsert(prompt: string): SelfInsertResult {
  const lower = prompt.toLowerCase().trim();

  // Check false positives first
  for (const fp of FALSE_POSITIVES) {
    if (fp.test(lower)) {
      return { isSelfInsert: false, cleanedPrompt: prompt };
    }
  }

  // Check triggers
  for (const trigger of TRIGGERS) {
    if (trigger.test(lower)) {
      const cleaned = prompt
        .replace(/\b(put|place|show)\s+me\b/gi, '')
        .replace(/\bi'?m\b/gi, 'a person is')
        .replace(/\bmyself\b/gi, 'a person')
        // Bare "me [verb]ing" at prompt start or after a comma — replace with
        // "a person [verb]ing" so Sonnet/Flux have a grammatical subject.
        .replace(/(^|,\s*)me\s+(\w+ing)\b/gi, '$1a person $2')
        .replace(/\bmy face\b/gi, '')
        .replace(/\bselfie\b/gi, 'portrait')
        .replace(/\s+/g, ' ')
        .trim();
      return { isSelfInsert: true, cleanedPrompt: cleaned || 'in a cinematic scene' };
    }
  }

  return { isSelfInsert: false, cleanedPrompt: prompt };
}
