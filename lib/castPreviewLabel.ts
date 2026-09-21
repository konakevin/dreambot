/**
 * The words next to the faces under the Create prompt: "You and Steph".
 *
 * Pure so it can be tested without a renderer — the label is the half of the preview
 * that catches a WRONG match. A photo confirms a face is a real person; only the name
 * tells you it is the person you asked for, which is exactly what name matching can
 * get wrong when two roster members share a name.
 *
 * Falls back to the relationship word when a member has no name, because "You and your
 * friend" is still true and still useful. It just cannot be summoned by name, which is
 * what the Settings roster's "Add a name" prompt is for.
 */

export interface LabelMember {
  name?: string;
  relationship?: 'partner' | 'friend';
}

/**
 * What the user calls this person, or the relationship if they never named them.
 *
 * `leading` picks the CASE of the fallback, and it is deliberately not a generic
 * capitalise-the-first-letter pass over the finished string: that would rewrite a real
 * name whose owner spells it lowercase ("mcKenna" → "McKenna"). A name is reproduced
 * byte for byte however it was typed; only the fallback wording we authored is cased.
 */
function refer(member: LabelMember, leading: boolean): string {
  const name = member.name?.trim();
  if (name) return name;
  if (member.relationship === 'partner') return leading ? 'Your partner' : 'your partner';
  return leading ? 'Your friend' : 'your friend';
}

export function castPreviewLabel(hasSelf: boolean, plusOne: LabelMember | null): string {
  if (hasSelf && plusOne) return `You and ${refer(plusOne, false)}`;
  if (hasSelf) return 'You';
  if (plusOne) return refer(plusOne, true);
  return '';
}
