/**
 * Turns the Create screen's cast pick into render-request fields.
 *
 * Pure so the mapping is testable on its own: getting it wrong does not throw, it
 * quietly renders the wrong person, which is the failure mode this whole feature
 * exists to remove.
 *
 * `auto` sends NOTHING, which is what keeps the default path byte-identical to what
 * it was before the picker existed: the engine detects cast roles from the prompt and
 * resolves the +1 through the starred default (or a name the prompt matched).
 */

/**
 * Who the render should cast.
 *   auto    — follow the prompt (a name it matched, else the starred default)
 *   solo    — just the user, whatever the prompt says
 *   partner — this specific roster member, alongside the user
 *
 * Lives here rather than beside the picker sheet so the store and the tests can read
 * it without pulling a React Native component into their module graph.
 */
export type CastChoice = { kind: 'auto' } | { kind: 'solo' } | { kind: 'partner'; id: string };

/** Identity for a union that carries a payload on only one arm. */
export function castChoiceEquals(a: CastChoice, b: CastChoice): boolean {
  if (a.kind !== b.kind) return false;
  return a.kind === 'partner' && b.kind === 'partner' ? a.id === b.id : true;
}

export interface CastChoiceRequest {
  /** 'self' = solo, 'dual' = the user plus the chosen member. Matches the engine's
   *  existing force_cast_role contract, so no new casting path is introduced. */
  force_cast_role?: 'self' | 'dual';
  /** Which roster member fills the +1 slot. The engine re-points the plus_one mirror
   *  at them, the same mechanism a matched NAME uses, and this takes precedence
   *  because an explicit tap is a stronger signal than a regex hit. */
  cast_partner_id?: string;
}

export function castChoiceRequest(choice: CastChoice): CastChoiceRequest {
  switch (choice.kind) {
    case 'solo':
      return { force_cast_role: 'self' };
    case 'partner':
      return { force_cast_role: 'dual', cast_partner_id: choice.id };
    default:
      return {};
  }
}
