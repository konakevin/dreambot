// promptSceneSplit.ts — split a freeform CREATE prompt into a SETTING and an ACTION.
//
// THE BUG THIS EXISTS FOR (Kevin, 2026-09-21). generate-dream fed the user's ENTIRE
// cleaned prompt in as `userPlace`, and `characterSlotPrompt` spends that string as the
// location: it reaches Sonnet three times as "LOCATION (scene_description MUST depict
// this)" and lands in the prompt's highest-attention window as `set at <string>`.
//
// So "Show me and Steph snowboarding" cleaned to "a companion snowboarding" and rendered
// as `set at a companion snowboarding`. Sonnet invented a mountain slope to make sense of
// a grammatically broken place, the verb was never anybody's ACTION, and the couple stood
// in the snow doing nothing. The user's request survived as scenery and died as a beat.
//
// Nightly never has this problem because it never lets place and action be the same
// string: `userPlace` is a real place row, `setAtOverride` is a dieted setting clause
// (sceneHook.settingClauseOf), and `action` comes from castActionResolver. Create has no
// place row to start from — the prompt is all it gets — so the split has to be derived.
//
// WHY AN LLM AND NOT A REGEX. The two halves are not lexically separable: "at a bbq",
// "snowboarding", "as superheroes in Paris" and "riding horses through Rome" put the
// setting and the beat in different places, in different orders, or leave one absent
// entirely. settingClauseOf (the nightly tool) is a 12-word first-clause truncator built
// for authored seeds that reliably OPEN with their setting; on user text it returns the
// whole string unchanged, which is the bug. generateLocationActionBeat is the inverse
// (place → action) and needs a clean place it does not have here.
//
// FAIL-OPEN IS THE CONTRACT. Every failure path returns `{ setting: <the whole prompt>,
// action: null }`, which is byte-for-byte today's behaviour. A paid render must never be
// blocked, slowed past its budget, or degraded by this being unavailable — it can only
// ever improve the prompt or step aside.

import { callSonnet } from './llm.ts';
import { UNSAFE_WORDS, TOO_ENERGETIC, DIRECTION_WORDS } from './actionSafety.ts';

export interface PromptSceneSplit {
  /** Where the dream is set. Feeds `setAtOverride`. Never empty. */
  setting: string;
  /** What the cast is doing, or null to fall back to the rolled pose pool. */
  action: string | null;
  /** Forensics: how this was produced. */
  source: 'split' | 'fallback';
}

/** The untouched behaviour, used on every failure path. */
function whole(prompt: string): PromptSceneSplit {
  return { setting: prompt.trim(), action: null, source: 'fallback' };
}

/**
 * Strip a model's stray wrapping without being clever about content.
 * Mirrors locationActionBeat's cleaning so the two agree on what a beat looks like.
 */
function tidy(value: unknown, cap: number): string {
  if (typeof value !== 'string') return '';
  return value
    .split('\n')[0]
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, cap)
    .trim();
}

/**
 * Split `prompt` into the place it happens and the thing the cast is doing.
 *
 * Returns the whole prompt as the setting with a null action on ANY failure: no key, an
 * empty prompt, a thrown call, unparseable output, or a beat that trips the same safety
 * filters every other Sonnet-written beat passes through.
 */
export async function splitPromptScene(
  prompt: string,
  castCount: 1 | 2,
  anthropicKey: string | undefined
): Promise<PromptSceneSplit> {
  const text = (prompt || '').trim();
  if (!text || !anthropicKey) return whole(text);

  const dual = castCount === 2;
  // JSON is deliberately NOT used as the transport. sanitizeUserText strips { } [ ] and
  // newlines from anything user-typed, so a JSON-anchored parser reading a field that
  // contains user text is a known way to lose the payload entirely
  // (project_sanitize_breaks_structured_vision_parsers). Two labelled lines survive it.
  const brief = `A user asked for a photo of ${dual ? 'two people' : 'one person'}. Split their request into WHERE it happens and WHAT they are doing.

REQUEST: "${text}"

SETTING: the place, as a short noun phrase a photographer could stand in (4-12 words). If the request names no place, invent the most natural one for the activity. Never include people, never include the activity itself.
ACTION: what the ${dual ? 'people are' : 'person is'} doing, 5-18 words, present-tense gerund like a photo caption. If the request describes no activity, write NONE.

HARD RULES for ACTION — it is destroyed if you break any:
- Waist-up framing. Every hand, prop and gesture stays at CHEST LEVEL OR LOWER. Nothing at or above the head.
- Feet planted and near-stationary. No walking, running, jumping, climbing or moving through the scene.
- NEVER mention the face, eyes, head, hair, expression, a mask/helmet/hood/goggles, the camera or a lens.
${dual ? '- Keep a clear gap between them. They do NOT touch, hug, kiss, lean together or face each other.\n' : ''}
Reply with EXACTLY two lines and nothing else:
SETTING: <the place>
ACTION: <the action, or NONE>`;

  try {
    const result = await callSonnet(brief, anthropicKey, 150);
    const raw = result.text || '';
    const settingLine = /^\s*SETTING:\s*(.+)$/im.exec(raw);
    const actionLine = /^\s*ACTION:\s*(.+)$/im.exec(raw);

    const setting = tidy(settingLine?.[1], 160);
    // An unusable setting means the whole split is untrustworthy, so take neither half.
    if (!setting || setting.length < 3) return whole(text);

    let action: string | null = tidy(actionLine?.[1], 220);
    // A beat is OPTIONAL — plenty of real prompts are pure scenery. Dropping it falls
    // through to the rolled pose pool, which is what a placeless dream already uses.
    if (!action || action.length < 6 || /^none\b/i.test(action)) action = null;
    // The same safety net every other Sonnet-written beat passes: a beat that occludes a
    // face or turns it away breaks the swap, and the whole point of this work is swap
    // reliability. A rejected beat drops to the pool rather than failing the render.
    else if (
      UNSAFE_WORDS.test(action) ||
      TOO_ENERGETIC.test(action) ||
      DIRECTION_WORDS.test(action)
    ) {
      action = null;
    }

    return { setting, action, source: 'split' };
  } catch (_e) {
    return whole(text);
  }
}
