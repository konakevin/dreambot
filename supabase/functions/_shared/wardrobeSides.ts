/**
 * wardrobeSides.ts — the SECOND, independent read of "which side of a couple render is the man" (2026-09-12).
 *
 * Kevin's aquarelle couple: the Haiku gender pre-read (dualSwapPipeline.ts) read a sketchy short-haired man as a
 * woman and a long-haired woman as a man; that single read became the swap's genderOverride and put his face on
 * the woman's body and hers on the man's. The identity gate cannot see a cross (each pasted face matches its own
 * source) and the quality gate is broken-only by contract. So a dual now needs two INDEPENDENT reads that agree:
 * the gender read, and THIS one — which side wears the LEFT-locked outfit — mapped through the cast genders. The
 * two questions fail differently (a painterly face vs a garment colour), which is what makes the agreement rule
 * worth something. Pure helpers here (unit-tested); the Haiku call lives in vision.ts.
 */
export type Side = 'left' | 'right';
export type Gender = 'male' | 'female';

const MAX_OUTFIT_CHARS = 140;

/** One outfit description, trimmed for the probe: single line, no quotes / pipes, ≤ 140 chars. */
export function outfitForProbe(text: string): string {
  return (text || '')
    .replace(/[\r\n|"“”]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_OUTFIT_CHARS);
}

/** Closed-set, justification-free (Haiku refuses "justified" vision probes). */
export function buildWardrobeSidesPrompt(outfitA: string, outfitB: string): string {
  return (
    'This artwork shows two people. ' +
    `Outfit A: ${outfitForProbe(outfitA)}. Outfit B: ${outfitForProbe(outfitB)}. ` +
    'Reply with EXACTLY two fields separated by a vertical bar |: (1) which side, LEFT or RIGHT, the person wearing Outfit A is on, (2) which side the person wearing Outfit B is on. ' +
    'Use only the words LEFT, RIGHT or UNSURE. No other words. Examples: "LEFT|RIGHT" or "RIGHT|LEFT" or "UNSURE|UNSURE".'
  );
}

/** The side Outfit A is on — only when both fields are a side and they differ; anything else is null. */
export function parseWardrobeSidesReply(raw: string): Side | null {
  const parts = (raw || '').toUpperCase().split('|');
  if (parts.length < 2) return null;
  const read = (s: string): Side | null =>
    /\bLEFT\b/.test(s) && !/\bRIGHT\b/.test(s)
      ? 'left'
      : /\bRIGHT\b/.test(s) && !/\bLEFT\b/.test(s)
        ? 'right'
        : null;
  const a = read(parts[0]);
  const b = read(parts[1]);
  if (!a || !b || a === b) return null;
  return a;
}

/** Map "Outfit A (the prompt's LEFT cast member) is on <side>" to per-side genders. */
export function sidesToGenders(
  aSide: Side,
  leftCastGender: Gender,
  rightCastGender: Gender
): { left: Gender; right: Gender } {
  return aSide === 'left'
    ? { left: leftCastGender, right: rightCastGender }
    : { left: rightCastGender, right: leftCastGender };
}

/** Narrow an untyped cast gender to the two values the mapping understands. */
export function asGender(x: unknown): Gender | null {
  return x === 'male' || x === 'female' ? x : null;
}

export type SideCheckMode = 'off' | 'shadow' | 'enforce';
/** engine_config.dual_side_check_mode (mig 514) → a mode; anything unknown = 'off' (never a surprise enforce). */
export function sideCheckModeOf(raw: unknown): SideCheckMode {
  return raw === 'shadow' || raw === 'enforce' ? raw : 'off';
}
