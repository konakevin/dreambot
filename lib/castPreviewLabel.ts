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

/**
 * The prompt box's placeholder once the user has PICKED a cast from the sheet.
 *
 * On Auto the placeholder has to teach the mechanic ("mention me or a cast member's
 * name"), because the prompt is what decides who appears. An explicit pick already
 * answered that question, so repeating it there would be instructions for a control the
 * user has just finished using. What is left to ask for is the scene — which is also
 * the input the engine most wants, since a picked cast plus a place and an action is a
 * complete brief (Kevin, 2026-09-22: "depending on which dropdown selection i make, we
 * should update the placeholder text").
 *
 * Phrased to match the PHOTO placeholder's "Set the scene and we'll dream you into it",
 * so the three states of this one box read as one voice rather than three authors.
 *
 * `null` means solo ("Just me"). An unnamed member falls back through `refer` to "your
 * friend" / "your partner", which keeps the sentence true for legacy members who never
 * got a name.
 */
export function castScenePlaceholder(plusOne: LabelMember | null): string {
  return plusOne
    ? `Describe the scene. We'll dream you and ${refer(plusOne, false)} into it.`
    : "Describe the scene. We'll dream you into it.";
}

export function castPreviewLabel(hasSelf: boolean, plusOne: LabelMember | null): string {
  if (hasSelf && plusOne) return `You and ${refer(plusOne, false)}`;
  if (hasSelf) return 'You';
  if (plusOne) return refer(plusOne, true);
  return '';
}
