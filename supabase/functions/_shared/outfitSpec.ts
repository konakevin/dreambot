/**
 * OUTFIT SPEC — what the USER asked each person to wear (CREATE_OUTFIT_PLAN.md, phase 2).
 *
 * Kevin, 2026-09-23: "if the user specifies their outfits we need to honor their outfit but add in the color
 * and print … 'show me in a bikini' we apply our coloring/patterns … 'show me in a red bikini' we show them
 * in a red bikini."
 *
 * WHY A SEPARATE READ. Today the user's clothing reaches Sonnet only inside the LOCATION line, next to a
 * rolled palette that tells it to use other colours, and AFTER `cleanSelfReferences` has turned "me" into
 * "a person" and "Steph" into "a companion" (and deleted "show me" outright). So nobody knows who asked for
 * what: measured, 6 of 10 user colours survived one real prompt, and "matching red sweaters" lost red in 3 of
 * 3 harness runs. This reads the SANITIZED RAW prompt with a code-built key to who is who, and returns the
 * user's own words per person, for `planOutfits` to lock.
 *
 * CONTRACT
 *   - Runs only when `mentionsClothing` fires (~16% of Create prompts); otherwise no call, no spec.
 *   - Labelled lines, not JSON (the house style of promptSceneSplit; sanitizer-safe).
 *   - Every value must share a real word with the prompt, or it is dropped: the extractor may copy the
 *     user, never invent for them.
 *   - Face occluders (sunglasses, helmet, mask, visor, veil, a hood worn up) are stripped by code: the face
 *     swap needs the face. The rest of the outfit is still honored.
 *   - Fail-open: any error → `null` (no spec) → the render behaves exactly as without this module.
 */

import { callSonnet } from './llm.ts';
import { sanitizeUserText } from './sanitizeUserText.ts';
import {
  missingUserOutfit,
  userOutfitPhrase,
  type PersonOutfitPlan,
  type UserOutfitSpec,
} from './outfitPlan.ts';

// ── prefilter ────────────────────────────────────────────────────────────

const CLOTHING_WORDS = new RegExp(
  '\\b(' +
    [
      'wearing',
      'wears',
      'wore',
      'dressed',
      'outfits?',
      'clothes',
      'clothing',
      'attire',
      'costumes?',
      'uniforms?',
      'gowns?',
      'dress(es)?',
      'sundress(es)?',
      'suits?',
      'tux(edo)?s?',
      'bikinis?',
      'swimsuits?',
      'swimwear',
      'trunks',
      'lingerie',
      'pajamas',
      'pyjamas',
      'robes?',
      'kimonos?',
      'saris?',
      'jackets?',
      'coats?',
      'blazers?',
      'cardigans?',
      'sweaters?',
      'jumpers?',
      'hoodies?',
      'shirts?',
      't-?shirts?',
      'tees?',
      'tank tops?',
      'crop tops?',
      'blouses?',
      'jeans',
      'shorts',
      'skirts?',
      'pants',
      'trousers',
      'leggings',
      'overalls',
      'jumpsuits?',
      'onesies?',
      'bodysuits?',
      'leotards?',
      'wetsuits?',
      'jerseys?',
      'aprons?',
      'scarf',
      'scarves',
      'gloves',
      'capes?',
      'cloaks?',
      'armou?r',
      'corsets?',
      'tutus?',
      'vests?',
      'hats?',
      'caps?',
      'crowns?',
      'tiaras?',
      'heels',
      'stilettos?',
      'boots',
      'sneakers',
      'sandals',
      'sunglasses',
      'helmets?',
      'masks?',
    ].join('|') +
    ')\\b',
  'i'
);

/** True when the prompt plausibly names clothing. Errs broad: a false positive costs one cheap call that
 *  returns NONE; a false negative costs only today's behaviour. */
export function mentionsClothing(prompt: string | null | undefined): boolean {
  return !!prompt && CLOTHING_WORDS.test(prompt);
}

// ── occluders ────────────────────────────────────────────────────────────

const OCCLUDER =
  /\b(sun ?glasses|shades|goggles|aviators|helmets?|masks?|visors?|veils?|balaclavas?|face ?paint|hoods? up|hooded up)\b/gi;

/** Remove face occluders from a garment phrase. Returns the cleaned phrase (null if nothing wearable is left)
 *  and what was dropped. */
export function stripOccluders(garment: string | null): {
  garment: string | null;
  dropped: string[];
} {
  if (!garment) return { garment: null, dropped: [] };
  const dropped = (garment.match(OCCLUDER) ?? []).map((d) => d.toLowerCase());
  if (!dropped.length) return { garment, dropped };
  let cleaned = garment.replace(OCCLUDER, ' ').replace(/\s*,\s*(,\s*)+/g, ', ');
  // Peel dangling connectors off both ends until nothing changes ("hoodie with the" → "hoodie").
  for (let prev = ''; prev !== cleaned; ) {
    prev = cleaned;
    cleaned = cleaned
      .replace(/^[\s,;&-]+|[\s,;&-]+$/g, '')
      .replace(/\s+\b(and|with|plus|a|an|some|the)$/i, '')
      .replace(/^(and|with|plus)\b\s*/i, '');
  }
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
  // What is left must still name something wearable ("level 3 helmet" leaves "level 3", which is nothing).
  return { garment: CLOTHING_WORDS.test(cleaned) ? cleaned : null, dropped };
}

// ── the people ───────────────────────────────────────────────────────────

export interface OutfitPerson {
  /** Cast role — the key planOutfits and the brief use. */
  role: string;
  /** Who this is, for the legend: "the user themself", "Steph", "the user's wife". */
  label: string;
  gender: 'male' | 'female' | null;
}

const KEYS = ['A', 'B'] as const;

export function buildOutfitSpecBrief(prompt: string, people: readonly OutfitPerson[]): string {
  const legend = people
    .map((p, i) => {
      const isSelf = p.role === 'self';
      const who = isSelf
        ? 'the user themself (they write about themselves as me / I / my / myself)'
        : `${p.label} (the user may use this name, a relationship word, or a pronoun)`;
      const g = p.gender === 'female' ? ' A woman.' : p.gender === 'male' ? ' A man.' : '';
      return `PERSON ${KEYS[i]}: ${who}.${g}`;
    })
    .join('\n');
  const both = people.length === 2;
  const fields = people
    .map(
      (_, i) =>
        `${KEYS[i]}_GARMENT: <what ${KEYS[i]} wears, in the user's own words, without colour or pattern words — or NONE>
${KEYS[i]}_COLOUR: <the colour words the user gave for ${KEYS[i]}'s clothes — or IMPLIED — or NONE>
${KEYS[i]}_PATTERN: <the pattern words the user gave for ${KEYS[i]}'s clothes — or NONE>`
    )
    .join('\n');
  return `A user typed a request for a picture. Read ONLY what they asked ${both ? 'each person' : 'the person'} to WEAR.

REQUEST: "${prompt}"

${legend}

Rules:
- Copy the user's own words. Never invent, improve or complete an outfit. If the user did not say what ${both ? 'a person' : 'the person'} wears, write NONE.
- GARMENT is the clothing or accessory itself ("bikini", "tux", "space suits", "fancy hats", "Detroit Lions jersey", "regency gown", "80s clothes", "high heels"). Keep any team, brand or character name in it ("Lakers jerseys", "Chanel suit"). Leave colour and pattern words out of it. A mood with no garment ("dressed up to the nines", "a sexy outfit") is NONE.
- COLOUR is only colours the user wrote for that person's clothes ("red", "pink", "navy"). Write IMPLIED only when the garment has SPECIFIC colours everyone knows and the user gave none: a real team's jersey (\"Lakers jerseys\"), a brand's signature look, an official uniform (a Starfleet uniform), a named character's costume (Superman). A garment TYPE that comes in any colour is NONE, even from another era or culture (a regency gown, a kimono, 80s clothes, a tux). Otherwise NONE.
- PATTERN is only a pattern the user wrote ("floral", "with flowers", "striped", "leopard"). Otherwise NONE.${
    both
      ? `
- Words about "us", "we", "our", "both", "matching" or "each" apply to A AND B.
- If you cannot tell which person a clothing phrase belongs to, put it on UNASSIGNED and write NONE for both.`
      : ''
  }
- Things in the scene that nobody is wearing (a hat shop, a suit of armour on display) are NONE.

Reply with exactly these lines and nothing else:
${fields}${both ? '\nUNASSIGNED: <the phrase, or NONE>' : ''}`;
}

// ── parse ────────────────────────────────────────────────────────────────

export interface OutfitSpecResult {
  /** Keyed by cast role. A role with nothing asked is absent. */
  byRole: Record<string, UserOutfitSpec>;
  unassigned: string | null;
  /** Occluders stripped by code, per role. */
  droppedOccluders: Record<string, string[]>;
  /** Values the extractor produced that share no word with the prompt (dropped, never locked). */
  rejectedInventions: string[];
}

const NONE = /^(none|n\/?a|nothing|null|-|—|unknown|not specified)\.?$/i;
const STOP = new Set([
  'the',
  'and',
  'with',
  'a',
  'an',
  'in',
  'of',
  'some',
  'their',
  'our',
  'my',
  'her',
  'his',
  'your',
  'very',
  'looking',
]);

function tidy(v: string | undefined): string | null {
  if (!v) return null;
  const t = sanitizeUserText(v.replace(/^["'“”‘’\s<]+|["'“”‘’\s>.]+$/g, ''), 'hint')
    .replace(/^(my|her|his|their|our|your)\s+/i, '')
    .trim()
    .slice(0, 80);
  return !t || NONE.test(t) ? null : t;
}

/** A value is honest only if one of its real words appears in what the user typed (a trailing-letter
 *  tolerance lets "hat" match "hats" and "space suit" match "space suits"). */
function groundedIn(value: string, prompt: string): boolean {
  const p = prompt.toLowerCase();
  const words = value
    .toLowerCase()
    .split(/[^a-z0-9'-]+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));
  if (!words.length) return false;
  return words.some((w) => p.includes(w) || (w.length > 4 && p.includes(w.slice(0, -1))));
}

export function parseOutfitSpecReply(
  text: string,
  people: readonly OutfitPerson[],
  prompt: string
): OutfitSpecResult {
  const line = (label: string): string | undefined => {
    const m = text.match(new RegExp(`^\\s*\\**${label}\\**\\s*:\\s*(.*)$`, 'im'));
    return m ? m[1] : undefined;
  };
  const byRole: Record<string, UserOutfitSpec> = {};
  const droppedOccluders: Record<string, string[]> = {};
  const rejectedInventions: string[] = [];
  const honest = (v: string | null): string | null => {
    if (v && !groundedIn(v, prompt)) {
      rejectedInventions.push(v);
      return null;
    }
    return v;
  };

  people.forEach((person, i) => {
    const k = KEYS[i];
    const rawColour = tidy(line(`${k}_COLOUR`));
    const implied = !!rawColour && /^implied$/i.test(rawColour);
    const colour = implied ? null : honest(rawColour);
    const occl = stripOccluders(honest(tidy(line(`${k}_GARMENT`))));
    if (occl.dropped.length) droppedOccluders[person.role] = occl.dropped;
    const garment = occl.garment;
    const pattern = honest(tidy(line(`${k}_PATTERN`)));
    // IMPLIED only means something attached to a garment.
    const colourImplied = implied && !!garment;
    if (garment || colour || pattern || colourImplied) {
      byRole[person.role] = { garment, colour, colourImplied, pattern };
    }
  });
  return { byRole, unassigned: tidy(line('UNASSIGNED')), droppedOccluders, rejectedInventions };
}

// ── the call ─────────────────────────────────────────────────────────────

export type OutfitSpecOutcome =
  | { source: 'skipped'; result: null }
  | { source: 'error'; result: null; error: string }
  | { source: 'read'; result: OutfitSpecResult };

/** Read the user's outfit request. Never throws. `prompt` must be the sanitized RAW prompt (never the
 *  self-insert-cleaned one, which has lost who is who). */
export async function extractOutfitSpec(
  prompt: string,
  people: readonly OutfitPerson[],
  anthropicKey: string | undefined
): Promise<OutfitSpecOutcome> {
  if (!anthropicKey || !people.length || people.length > 2 || !mentionsClothing(prompt)) {
    return { source: 'skipped', result: null };
  }
  try {
    const reply = await callSonnet(buildOutfitSpecBrief(prompt, people), anthropicKey, 160);
    return { source: 'read', result: parseOutfitSpecReply(reply.text, people, prompt) };
  } catch (e) {
    return { source: 'error', result: null, error: (e as Error).message };
  }
}

/** One stamp for ai_generation_log: none | partial | full, plus what code stripped or refused. */
export function outfitSpecStamps(outcome: OutfitSpecOutcome, castCount: number): string[] {
  if (outcome.source === 'skipped') return ['outfit_spec:none'];
  if (outcome.source === 'error') return [`outfit_spec:fallback:${outcome.error.slice(0, 60)}`];
  const r = outcome.result;
  const n = Object.keys(r.byRole).length;
  const stamps = [`outfit_spec:${n === 0 ? 'none' : n >= castCount ? 'full' : 'partial'}`];
  for (const [role, d] of Object.entries(r.droppedOccluders)) {
    stamps.push(`outfit_occluder_dropped:${role}:${d.join('+')}`);
  }
  if (r.unassigned) stamps.push('outfit_spec_unassigned');
  if (r.rejectedInventions.length)
    stamps.push(`outfit_spec_rejected:${r.rejectedInventions.length}`);
  return stamps;
}

// ── Solo: enforce on Sonnet's freeform prompt (phase 4) ──────────────────

/** A face occluder in a finished prompt. Stricter than OCCLUDER: "in shades of blue" is a colour, not
 *  sunglasses, so "shades" only counts when someone is wearing them. */
const OCCLUDER_IN_PROMPT =
  /\b(sun ?glasses|goggles|helmets?|masks?|visors?|veils?|balaclavas?|hoods? (?:up|pulled up|drawn up|over))\b|\b(?:wearing|in|with|pair of) (?:dark |mirrored |oversized |retro |chic )?shades\b(?!\s+of\b)/i;

/**
 * The solo prompt is written freeform by Sonnet (no slots, no retry loop), so the guarantees run on the text:
 *   1. any comma/semicolon clause that puts a face occluder on the person is removed;
 *   2. if what the user asked for is missing, their own words are appended ("…, wearing red bikini").
 * Pure; the caller runs it on Sonnet's text before postProcessPrompt.
 */
export function enforceSoloOutfit(
  prompt: string,
  person: PersonOutfitPlan | null
): { prompt: string; stamps: string[] } {
  const stamps: string[] = [];
  const clauses = prompt.split(/(?<=[,;])/);
  const kept = clauses.filter((c) => !OCCLUDER_IN_PROMPT.test(c));
  let out = prompt;
  if (kept.length !== clauses.length) {
    out = kept
      .join('')
      .replace(/[\s,;]+$/, '')
      .replace(/,\s*,/g, ',');
    stamps.push(`outfit_occluder_stripped:${clauses.length - kept.length}`);
  }
  if (person) {
    const phrase = userOutfitPhrase(person);
    if (phrase) {
      if (missingUserOutfit(out, person).length) {
        out = `${out.replace(/[\s,.;]+$/, '')}, wearing ${phrase}`;
        stamps.push('outfit_lock:THE PERSON:code_applied');
      } else {
        stamps.push('outfit_lock:THE PERSON:kept');
      }
    }
  }
  return { prompt: out, stamps };
}
