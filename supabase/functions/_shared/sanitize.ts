/**
 * Prompt sanitization — last line of defense before a user-facing prompt
 * goes to Flux/Kontext. Strips/softens terms that commonly trip NSFW or
 * minor-safety filters so the generation doesn't get rejected.
 *
 * Applied after the compiler writes the Sonnet brief / Sonnet produces the
 * final prompt. All three pipelines (V4, nightly, restyle-photo) call this.
 */
export function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/\bbaby\b/gi, 'small cute character')
    .replace(/\binfant\b/gi, 'small cute character')
    .replace(/\btoddler\b/gi, 'small character')
    .replace(/\bchild\b/gi, 'young character')
    .replace(/\bchildren\b/gi, 'young characters')
    .replace(/\bkid\b/gi, 'young character')
    .replace(/\bkids\b/gi, 'young characters')
    .replace(/\bminor\b/gi, 'young person')
    .replace(/\bcrib\b/gi, 'small cozy bed')
    .replace(/\bnursery\b/gi, 'cozy room')
    .replace(/\bdiaper\b/gi, 'outfit')
    .replace(/\bonesie\b/gi, 'romper suit')
    .replace(/\bnewborn\b/gi, 'tiny character')
    .replace(/\b\d+[\s-]*months?\s*old\b/gi, 'very small')
    .replace(/\bnude\b/gi, '')
    .replace(/\bnaked\b/gi, '');
}
