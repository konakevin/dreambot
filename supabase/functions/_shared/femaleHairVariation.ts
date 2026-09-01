/**
 * Female hairstyle variation for the NIGHTLY engine.
 *
 * Why: a cast member's hair is a single static clause pulled from their photo
 * description (extractHair → "shoulder-length chestnut-brown hair with center
 * part"), so every nightly render gives them the exact same hairdo. Women love
 * seeing their hair styled in fun new ways, so — for FEMALE cast only — we
 * occasionally re-style the hair while preserving the identity anchors
 * (COLOR + approximate LENGTH, plus BANGS and natural COILY/kinky texture,
 * which read as identity/ethnicity and must never be "styled away").
 *
 * The face swap only refines the FACE, and rendered hair variance is already
 * fine on swaps ("grade face-swaps on FACE only, hair variance good"), so
 * varying the prompt hair is swap-safe. Every style keeps the face/forehead
 * OPEN (nothing across the eyes) so the swap still lands a clean frontal face.
 *
 * Nightly-only by construction: the variation fires only when the caller passes
 * a `pct > 0`; the paid Create path passes nothing, so it never triggers there.
 *
 * Kevin's dials (2026-08-31): 50% keep her own look / 50% vary; dramatic styles
 * allowed; vary both how-it's-worn AND texture; bias the style toward the scene
 * register (elegant scenes → updos/glam, active → ponytails/braids).
 */

export type HairSceneRegister = 'elegant' | 'active' | 'casual';

type LengthBucket = 'short' | 'medium' | 'long';

type HairStyle = {
  /** The "worn as" phrase, e.g. "swept into an elegant updo". */
  text: string;
  /** Length buckets this style is physically possible on. */
  lengths: LengthBucket[];
  /** Scene registers this style leans into (used for weighted bias). */
  registers: HairSceneRegister[];
  /** True when the style pushes hair OFF the face — excluded when she has
   *  bangs (removing bangs changes how her face is framed = appearance change). */
  clearsFront?: boolean;
};

// Ordinary styles (straight/wavy hair). Texture variation is allowed here.
const STYLES: HairStyle[] = [
  // ── long ──
  { text: 'worn in loose flowing waves', lengths: ['long'], registers: ['casual', 'elegant'] },
  {
    text: 'styled in soft romantic curls',
    lengths: ['long', 'medium'],
    registers: ['casual', 'elegant'],
  },
  {
    text: 'swept into an elegant updo',
    lengths: ['long', 'medium'],
    registers: ['elegant'],
    clearsFront: true,
  },
  {
    text: 'in a sleek high ponytail',
    lengths: ['long', 'medium'],
    registers: ['active', 'elegant'],
    clearsFront: true,
  },
  {
    text: 'in a soft low bun at the nape',
    lengths: ['long', 'medium'],
    registers: ['elegant', 'casual'],
  },
  {
    text: 'in glamorous Hollywood side-swept waves',
    lengths: ['long', 'medium'],
    registers: ['elegant'],
  },
  { text: 'in a long braid over one shoulder', lengths: ['long'], registers: ['active', 'casual'] },
  {
    text: 'in a crown braid wrapped around the head',
    lengths: ['long', 'medium'],
    registers: ['elegant', 'active'],
    clearsFront: true,
  },
  {
    text: 'half-up with the length loose behind',
    lengths: ['long', 'medium'],
    registers: ['casual', 'elegant'],
  },
  {
    text: 'worn sleek and pin-straight',
    lengths: ['long', 'medium'],
    registers: ['elegant', 'casual'],
  },
  {
    text: 'in a relaxed messy bun with a few loose tendrils',
    lengths: ['long', 'medium'],
    registers: ['casual', 'active'],
  },
  {
    text: 'in a high sleek ballerina bun',
    lengths: ['long', 'medium'],
    registers: ['elegant', 'active'],
    clearsFront: true,
  },
  { text: 'in a fishtail braid', lengths: ['long'], registers: ['active', 'casual'] },
  {
    text: 'in a voluminous bouncy blowout',
    lengths: ['long', 'medium'],
    registers: ['elegant', 'casual'],
  },
  {
    text: 'gathered into a low side ponytail',
    lengths: ['long', 'medium'],
    registers: ['casual', 'elegant'],
  },
  { text: 'in beachy tousled waves', lengths: ['long', 'medium'], registers: ['casual', 'active'] },
  // ── medium-leaning ──
  {
    text: 'tucked sleekly behind the ears, polished',
    lengths: ['medium', 'short'],
    registers: ['elegant', 'casual'],
    clearsFront: true,
  },
  {
    text: 'in a chic low ponytail',
    lengths: ['medium'],
    registers: ['active', 'elegant'],
    clearsFront: true,
  },
  { text: 'in a small twisted half-updo', lengths: ['medium'], registers: ['elegant'] },
  { text: 'in a tousled textured lob', lengths: ['medium'], registers: ['casual'] },
  // ── short ──
  {
    text: 'styled with soft tousled texture',
    lengths: ['short'],
    registers: ['casual', 'elegant'],
  },
  { text: 'swept elegantly to one side', lengths: ['short'], registers: ['elegant', 'casual'] },
  { text: 'in a sleek polished finish', lengths: ['short'], registers: ['elegant'] },
  { text: 'with piecey tousled volume', lengths: ['short'], registers: ['casual', 'active'] },
  {
    text: 'slicked back off the face',
    lengths: ['short'],
    registers: ['elegant', 'active'],
    clearsFront: true,
  },
  { text: 'in soft vintage finger-waves', lengths: ['short', 'medium'], registers: ['elegant'] },
];

// Natural COILY / kinky hair: texture is identity — never straighten it. These
// preserve the natural texture and only vary how it's worn (protective styles +
// natural shapes). Applied regardless of length bucket when coily is detected.
const COILY_STYLES: HairStyle[] = [
  {
    text: 'worn in a full voluminous natural afro',
    registers: ['casual', 'elegant'],
    lengths: ['short', 'medium', 'long'],
  },
  {
    text: 'in a defined twist-out',
    registers: ['casual', 'elegant'],
    lengths: ['short', 'medium', 'long'],
  },
  { text: 'in neat box braids', registers: ['casual', 'active'], lengths: ['medium', 'long'] },
  {
    text: 'in sleek cornrows gathered back',
    registers: ['active', 'casual'],
    lengths: ['short', 'medium', 'long'],
    clearsFront: true,
  },
  {
    text: 'in a high curly puff',
    registers: ['active', 'elegant'],
    lengths: ['medium', 'long'],
    clearsFront: true,
  },
  {
    text: 'in bantu knots',
    registers: ['casual', 'active'],
    lengths: ['short', 'medium', 'long'],
    clearsFront: true,
  },
  {
    text: 'in a natural curly updo',
    registers: ['elegant'],
    lengths: ['medium', 'long'],
    clearsFront: true,
  },
  { text: 'in goddess braids', registers: ['elegant', 'casual'], lengths: ['medium', 'long'] },
  {
    text: 'in a wash-and-go with defined coils',
    registers: ['casual'],
    lengths: ['short', 'medium'],
  },
];

const COLOR_RE =
  /\b((?:jet[- ]?black|raven|dark brown|light brown|dirty blonde|dirty blond|salt[- ]and[- ]pepper|strawberry blonde|strawberry blond|ash blonde|ash blond|platinum|chestnut|chocolate|caramel|honey|golden|sandy|auburn|burgundy|copper|ginger|brunette|blonde|blond|black|brown|red|grey|gray|silver|white)(?:[- ]?(?:brown|blonde|blond))?)\b/i;

const COILY_RE = /\b(coily|kinky|afro|4[abc]|coils|natural curls|tight curls|dreadlocks|locs)\b/i;
const BANGS_RE = /\b(bangs|fringe|blunt bangs|wispy bangs|curtain bangs|side bangs|baby bangs)\b/i;

// Length buckets. Order matters: specific short/long markers before the generic
// bare words, and "bob"/"shoulder" → medium.
function detectLength(s: string): { bucket: LengthBucket; phrase: string } | null {
  const short = s.match(
    /\b(pixie|buzz(?:ed)?|shaved|close[- ]cropped|cropped|crop|ear[- ]length)\b/i
  );
  if (short) return { bucket: 'short', phrase: 'short' };
  const long = s.match(/\b(waist[- ]length|mid[- ]back|floor[- ]length|very long|long)\b/i);
  if (long)
    return {
      bucket: 'long',
      phrase: long[1].toLowerCase() === 'long' ? 'long' : `${long[1].toLowerCase()}`,
    };
  const medium = s.match(
    /\b(shoulder[- ]length|shoulder|collarbone[- ]length|collarbone|chin[- ]length|mid[- ]length|medium[- ]length|lob|bob)\b/i
  );
  if (medium)
    return {
      bucket: 'medium',
      phrase: /shoulder/i.test(medium[1]) ? 'shoulder-length' : medium[1].toLowerCase(),
    };
  if (/\bshort\b/i.test(s)) return { bucket: 'short', phrase: 'short' };
  return null;
}

export type ParsedHair = {
  color: string | null;
  length: { bucket: LengthBucket; phrase: string } | null;
  hasBangs: boolean;
  bangPhrase: string | null;
  coily: boolean;
};

export function parseHair(hairClause: string): ParsedHair {
  const s = hairClause || '';
  const colorMatch = s.match(COLOR_RE);
  const bangsMatch = s.match(BANGS_RE);
  return {
    color: colorMatch ? colorMatch[1].toLowerCase() : null,
    length: detectLength(s),
    hasBangs: !!bangsMatch,
    bangPhrase: bangsMatch ? bangsMatch[0].toLowerCase() : null,
    coily: COILY_RE.test(s),
  };
}

function weightedPick(
  styles: HairStyle[],
  register: HairSceneRegister | null,
  rng: () => number
): HairStyle {
  // Scene bias: a style whose registers include the scene register gets 3x
  // weight, so an elegant scene leans toward updos/glam and an active scene
  // toward ponytails/braids — without ever fully excluding the others.
  const weights = styles.map((st) => (register && st.registers.includes(register) ? 3 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < styles.length; i++) {
    r -= weights[i];
    if (r < 0) return styles[i];
  }
  return styles[styles.length - 1];
}

/**
 * Return a re-styled hair clause for a FEMALE cast member, or the ORIGINAL
 * clause when we should leave her signature look alone. Caller gates on gender
 * and only passes pct on the nightly path.
 *
 * @param hairClause the extracted hair clause (extractHair output)
 * @param opts.pct   0-100 chance of VARYING (Kevin: 50 → half varied, half own)
 * @param opts.register scene register for the style bias (or null)
 * @param opts.rng   injectable RNG for tests (default Math.random)
 */
export function varyFemaleHair(
  hairClause: string | null | undefined,
  opts: { pct: number; register?: HairSceneRegister | null; rng?: () => number }
): string | null {
  if (!hairClause) return hairClause ?? null;
  const rng = opts.rng || Math.random;
  const pct = Math.max(0, Math.min(100, opts.pct || 0));
  if (pct <= 0) return hairClause;

  const parsed = parseHair(hairClause);
  // Need a length bucket (ordinary hair) OR coily texture to vary safely.
  if (!parsed.length && !parsed.coily) return hairClause;

  // Roll: variation fires with probability pct%. Otherwise keep her own look.
  if (rng() * 100 >= pct) return hairClause;

  const register = opts.register ?? null;
  let pool: HairStyle[];
  if (parsed.coily) {
    pool = COILY_STYLES.filter(
      (st) => !parsed.length || st.lengths.includes(parsed.length!.bucket)
    );
    if (pool.length === 0) pool = COILY_STYLES;
  } else {
    const bucket = parsed.length!.bucket;
    pool = STYLES.filter((st) => st.lengths.includes(bucket));
    // Keep bangs: exclude styles that push all the hair off the face.
    if (parsed.hasBangs) pool = pool.filter((st) => !st.clearsFront);
  }
  if (pool.length === 0) return hairClause; // nothing compatible → leave alone

  const style = weightedPick(pool, register, rng);

  // Reassemble, PRESERVING the identity anchors: length phrase + color (+ bangs).
  // Length-then-color mirrors the describer's own order ("shoulder-length
  // chestnut-brown hair").
  const lengthPhrase = parsed.length ? parsed.length.phrase : null;
  const bits = [lengthPhrase, parsed.color, 'hair', style.text].filter(Boolean);
  let out = bits.join(' ');
  if (parsed.hasBangs && parsed.bangPhrase) out += `, with ${parsed.bangPhrase}`;
  return out;
}
