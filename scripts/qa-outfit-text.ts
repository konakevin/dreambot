#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env
/**
 * Create OUTFIT text harness (CREATE_OUTFIT_PLAN.md, phase 0+).
 *
 * Replays the REAL Create prompt pipeline up to the image-model prompt — self-insert cleaning, the
 * setting/action split, the couple slot pipeline + narrative_fg composer, and the solo compiler + Sonnet —
 * over a fixed corpus of clothing prompts (the real ones users typed + authored hard cases). No images are
 * rendered and the database is never touched: Sonnet calls only, so it is cheap and safe to run any time.
 *
 * What it measures, per render:
 *   - user garment / colour / pattern kept on the RIGHT person (couples) or in the final prompt (solo)
 *   - couples with no clothing in the prompt: did both people wear BOTH palette colours (the mirror)?
 *   - same-gender formal couples: a dress-type garment next to a suit/jacket-type garment
 *   - stamps: plain-clothes violations, wardrobe fallbacks
 *
 *   deno run --allow-read --allow-write --allow-net --allow-env scripts/qa-outfit-text.ts \
 *     --runs=3 --out=/path/to/dir [--only=R7,S2] [--concurrency=4]
 *
 * Writes <out>/results.json (every render: brief, slots, final prompt, checks) and prints a summary.
 */
import { detectSelfInsert } from '../supabase/functions/_shared/selfInsertDetector.ts';
import { sanitizeUserText } from '../supabase/functions/_shared/sanitizeUserText.ts';
import {
  compilePrompt,
  postProcessPrompt,
  sanitizeUserPrompt,
} from '../supabase/functions/_shared/promptCompiler.ts';
import { splitPromptScene } from '../supabase/functions/_shared/promptSceneSplit.ts';
import {
  runCharacterSlotPipeline,
  type CharacterSlotPipelineInput,
  type DualSlots,
} from '../supabase/functions/_shared/characterSlotPrompt.ts';
import { composeExperimentalCouple } from '../supabase/functions/_shared/coupleComposerX.ts';
import { rollCreateSceneAxes } from '../supabase/functions/_shared/createSceneAxes.ts';
import { resolveCastForPrompt } from '../supabase/functions/_shared/castResolver.ts';
import { callSonnet } from '../supabase/functions/_shared/llm.ts';
import {
  planOutfits,
  DEFAULT_OUTFIT_ROLLS,
  type OutfitPlan,
} from '../supabase/functions/_shared/outfitPlan.ts';
import {
  extractOutfitSpec,
  outfitSpecStamps,
  enforceSoloOutfit,
  type OutfitPerson,
} from '../supabase/functions/_shared/outfitSpec.ts';

// ── env ────────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  Deno.readTextFileSync(new URL('../.env.local', import.meta.url))
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const KEY: string = env.ANTHROPIC_API_KEY ?? Deno.env.get('ANTHROPIC_API_KEY') ?? '';
if (!KEY) throw new Error('ANTHROPIC_API_KEY missing (.env.local)');

const arg = (name: string, dflt: string): string =>
  Deno.args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? dflt;
const RUNS = Number(arg('runs', '3'));
const OUT = arg('out', '');
const ONLY = arg('only', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const CONCURRENCY = Number(arg('concurrency', '4'));
/** pipeline = today's Create text pipeline end to end; extract = the phase-2 outfit reader only. */
const MODE = arg('mode', 'pipeline');
/** today = the live Create path; plan = phase 3: outfit reader + per-person plan in the slot brief. */
const VARIANT = arg('variant', 'today');
if (!OUT) throw new Error('--out=<dir> is required');

// ── corpus ─────────────────────────────────────────────────────────────
type Gender = 'male' | 'female';
/** Regex SOURCE strings (case-insensitive). Every listed check must match that person's outfit. */
interface Expect {
  garment?: string;
  colour?: string;
  pattern?: string;
  /** The garment carries its own colours (team jersey, period costume): the extractor must say IMPLIED. */
  implied?: boolean;
}
interface Case {
  id: string;
  prompt: string;
  shape: 'couple' | 'solo_self' | 'solo_partner';
  self: Gender;
  partner?: { name: string; gender: Gender; relationship: string };
  expectSelf?: Expect;
  expectPartner?: Expect;
  /** no_clothing: measure the palette mirror. formal_same_gender: dress-type vs suit-type mismatch.
   *  occluder: the user asked for a face occluder (observed, not scored). style_only: no token check. */
  tags?: string[];
}

const PINK = 'pink|blush|fuchsia|magenta|rose';
const GREEN = 'green|emerald|jade|sage|olive|forest|mint|moss';
const RED = 'red|scarlet|crimson|cherry';
const REL = { wife: 'partner', husband: 'partner', friend: 'friend', family: 'family' };

const CASES: Case[] = [
  // REAL prompts (dream_queue.payload.hint, Create, cast)
  {
    id: 'R1',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Summer', gender: 'female', relationship: REL.family },
    prompt:
      'I am in a regency gown at a ball dancing with a handsome dandy and so is my granddaughter summer',
    expectSelf: { garment: 'gown|dress', implied: false },
    expectPartner: { garment: 'gown|dress', implied: false },
  },
  {
    id: 'R2',
    shape: 'solo_self',
    self: 'female',
    prompt:
      "Imagine me wearing the 80's hairstyle, makeup and clothes surrounded by popular 80's nostalgia background",
    expectSelf: { garment: '80|clothes', implied: false },
  },
  {
    id: 'R3',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Brittany', gender: 'female', relationship: REL.friend },
    prompt: 'Me and Brittany dressed up to nines at a Fashion Show',
    tags: ['style_only', 'formal_same_gender'],
  },
  {
    id: 'R4',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Tiffany', gender: 'female', relationship: REL.friend },
    prompt: 'Me and Tiffany at the Kentucky Derby wearing fancy Hats!',
    expectSelf: { garment: 'hat|fascinator' },
    expectPartner: { garment: 'hat|fascinator' },
  },
  {
    id: 'R5',
    shape: 'solo_self',
    self: 'female',
    prompt:
      'Show a very glamorous version of me wearing a Detroit lions jersey, cheering at a lions football game',
    expectSelf: { garment: 'jersey', colour: 'blue|honolulu|silver', implied: true },
  },
  {
    id: 'R6',
    shape: 'couple',
    self: 'female',
    partner: { name: 'husband', gender: 'male', relationship: REL.husband },
    prompt: 'Show me and my Husband dressed up to the nines some where',
    tags: ['style_only'],
  },
  {
    id: 'R7',
    shape: 'couple',
    self: 'male',
    partner: { name: 'wife', gender: 'female', relationship: REL.wife },
    prompt:
      'Show me and my wife on a beach. She is wearing a pink bikini and I’m wearing green shorts with flowers.',
    expectPartner: { garment: 'bikini', colour: PINK },
    expectSelf: {
      garment: 'shorts|trunks|boardshorts',
      colour: GREEN,
      pattern: 'flor|flower|hibiscus|botanical|tropical',
    },
  },
  {
    id: 'R8',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Stephie', gender: 'female', relationship: REL.wife },
    prompt: 'Show me and Stephie on the moon in sleek looking space suits.',
    expectSelf: { garment: 'space ?suit|spacesuit|pressure suit|flight suit' },
    expectPartner: { garment: 'space ?suit|spacesuit|pressure suit|flight suit' },
  },
  {
    id: 'R9',
    shape: 'solo_self',
    self: 'female',
    prompt:
      'Show me with long dark hair as a very glamorous version of me wearing a Detroit lions cheerleading outfit, cheering at a home game',
    expectSelf: { garment: 'cheer', colour: 'blue|honolulu|silver', implied: true },
  },
  {
    id: 'R10',
    shape: 'solo_partner',
    self: 'male',
    partner: { name: 'Stephie', gender: 'female', relationship: REL.wife },
    prompt:
      'Show Stephie in a sexy bikini on the beach, make her look very sensual and flirty - with sunglasses and a fun hairstyle.',
    expectPartner: { garment: 'bikini' },
    tags: ['occluder'],
  },
  {
    id: 'R11',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Summer', gender: 'female', relationship: REL.family },
    prompt: 'Summer and I are whale watching and wearing pink chanel',
    expectSelf: { colour: PINK },
    expectPartner: { colour: PINK },
  },
  {
    id: 'R13',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Tiffany', gender: 'female', relationship: REL.friend },
    prompt:
      'Me and Tiffany are in the Victorian era and are suffragettes supporting votes for women with banners on our dresses',
    expectSelf: { garment: 'dress|gown|skirt' },
    expectPartner: { garment: 'dress|gown|skirt' },
  },
  {
    id: 'R14',
    shape: 'couple',
    self: 'male',
    partner: { name: 'wife', gender: 'female', relationship: REL.wife },
    prompt:
      'Show my wife in lingerie laying next to a beautiful Hawaiian pool with me, being flirty',
    expectPartner: { garment: 'lingerie|lace|bodysuit|slip|bralette|corset|teddy' },
  },
  {
    id: 'R15',
    shape: 'solo_partner',
    self: 'male',
    partner: { name: 'wife', gender: 'female', relationship: REL.wife },
    prompt:
      'Show my wife out on the night in Myrtle Beach in a fun, but sexy outfit - high heels and looking yummy.',
    expectPartner: { garment: 'heel|stiletto|pump' },
  },

  // AUTHORED hard cases
  {
    id: 'S1',
    shape: 'solo_self',
    self: 'female',
    prompt: 'Show me in a bikini at the beach',
    expectSelf: { garment: 'bikini' },
  },
  {
    id: 'S2',
    shape: 'solo_self',
    self: 'female',
    prompt: 'Show me in a red bikini at the beach',
    expectSelf: { garment: 'bikini', colour: RED },
  },
  {
    id: 'S3',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Steph', gender: 'female', relationship: REL.wife },
    prompt: "Show me and Steph at a gala. I'm in a tux and Steph is in a green dress.",
    expectSelf: { garment: 'tux|tuxedo|dinner jacket', implied: false },
    expectPartner: { garment: 'dress|gown', colour: GREEN },
  },
  {
    id: 'S4',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Steph', gender: 'female', relationship: REL.wife },
    prompt: 'Me and Steph in jeans and t-shirts at a bbq',
    expectSelf: { garment: 'jeans|denim' },
    expectPartner: { garment: 'jeans|denim' },
  },
  {
    id: 'S5',
    shape: 'solo_self',
    self: 'male',
    prompt: 'Me in my grey hoodie at a coffee shop',
    expectSelf: { garment: 'hoodie|hooded', colour: 'grey|gray|charcoal' },
  },
  {
    id: 'S6',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Tiffany', gender: 'female', relationship: REL.friend },
    prompt: 'Me and Tiffany at a black-tie gala',
    tags: ['no_clothing', 'formal_same_gender'],
  },
  {
    id: 'S7',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Steph', gender: 'female', relationship: REL.wife },
    prompt: 'Me and Steph snowboarding',
    tags: ['no_clothing'],
  },
  {
    id: 'S8',
    shape: 'couple',
    self: 'female',
    partner: { name: 'husband', gender: 'male', relationship: REL.husband },
    prompt: 'Me and my husband at the beach',
    tags: ['no_clothing'],
  },
  {
    id: 'S9',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Steph', gender: 'female', relationship: REL.wife },
    prompt: 'Me and Steph hiking in Yosemite',
    tags: ['no_clothing'],
  },
  {
    id: 'S10',
    shape: 'solo_self',
    self: 'female',
    prompt: 'Show me in a kimono in Kyoto',
    expectSelf: { garment: 'kimono', implied: false },
  },
  {
    id: 'S11',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Steph', gender: 'female', relationship: REL.wife },
    prompt: 'Me and Steph in matching red sweaters by the fireplace',
    expectSelf: { garment: 'sweater|jumper|knit', colour: RED },
    expectPartner: { garment: 'sweater|jumper|knit', colour: RED },
  },
  {
    id: 'S12',
    shape: 'solo_self',
    self: 'female',
    prompt: 'Me in a blue floral sundress at a picnic',
    expectSelf: {
      garment: 'dress',
      colour: 'blue|cobalt|navy|azure|cornflower',
      pattern: 'flor|flower',
    },
  },
  {
    id: 'S13',
    shape: 'couple',
    self: 'female',
    partner: { name: 'husband', gender: 'male', relationship: REL.husband },
    prompt:
      'Show me and my husband at the Kentucky Derby, me in a yellow dress and him in a navy suit',
    expectSelf: { garment: 'dress|gown', colour: 'yellow|lemon|butter|canary|marigold' },
    expectPartner: { garment: 'suit', colour: 'navy' },
  },
  {
    id: 'S14',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Steph', gender: 'female', relationship: REL.wife },
    prompt: 'Me and Steph at a Lakers game in Lakers jerseys',
    expectSelf: { garment: 'lakers.*jersey', colour: 'purple|gold|yellow', implied: true },
    expectPartner: { garment: 'lakers.*jersey', colour: 'purple|gold|yellow', implied: true },
  },
  {
    id: 'S15',
    shape: 'solo_self',
    self: 'male',
    prompt: 'Me wearing sunglasses on a yacht',
    tags: ['occluder'],
  },
  {
    id: 'S16',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Tiffany', gender: 'female', relationship: REL.friend },
    prompt: 'Me and Tiffany at a wedding, both in emerald gowns',
    expectSelf: { garment: 'gown|dress', colour: 'emerald|green' },
    expectPartner: { garment: 'gown|dress', colour: 'emerald|green' },
  },
  {
    id: 'S17',
    shape: 'couple',
    self: 'female',
    partner: { name: 'Brittany', gender: 'female', relationship: REL.friend },
    prompt: 'Me and Brittany at a formal ball',
    tags: ['no_clothing', 'formal_same_gender'],
  },
  {
    id: 'S18',
    shape: 'couple',
    self: 'male',
    partner: { name: 'wife', gender: 'female', relationship: REL.wife },
    prompt: 'Me and my wife at a fancy dinner in Paris',
    tags: ['no_clothing'],
  },
  {
    id: 'S19',
    shape: 'solo_self',
    self: 'male',
    prompt: 'Show me in a navy pinstripe suit in Manhattan',
    expectSelf: { garment: 'suit', colour: 'navy', pattern: 'pinstripe|stripe' },
  },
  {
    id: 'S20',
    shape: 'couple',
    self: 'male',
    partner: { name: 'Steph', gender: 'female', relationship: REL.wife },
    prompt:
      "Me and Steph at a luau. I'm wearing a hawaiian shirt and Steph is in a yellow sundress",
    expectSelf: { garment: 'shirt', pattern: 'hawaiian|tropical|flor|hibiscus|palm' },
    expectPartner: { garment: 'dress', colour: 'yellow|lemon|butter|canary|marigold' },
  },
];

// ── synthetic cast ─────────────────────────────────────────────────────
const DESC: Record<Gender, string> = {
  female:
    'A woman in her mid 30s with long wavy chestnut-brown hair, light skin, slim build, brown eyes.',
  male: 'A man in his late 30s with short dark brown hair and a trimmed beard, light skin, athletic build, blue eyes.',
};
const SUMMARY: Record<Gender, string> = {
  female: 'long wavy chestnut hair, slim build, brown eyes, light skin, mid 30s',
  male: 'short dark brown hair, trimmed beard, athletic build, blue eyes, light skin, late 30s',
};
function castMember(role: 'self' | 'plus_one', g: Gender, relationship?: string) {
  return {
    role,
    thumb_url: 'https://example.invalid/cast.jpg',
    description: DESC[g],
    gender: g,
    physical_summary: SUMMARY[g],
    ...(relationship ? { relationship } : {}),
  };
}

// ── checks ─────────────────────────────────────────────────────────────
const has = (text: string, src?: string): boolean | null =>
  src ? new RegExp(`(${src})`, 'i').test(text) : null;
function check(text: string, e?: Expect) {
  if (!e) return null;
  return {
    garment: has(text, e.garment),
    colour: has(text, e.colour),
    pattern: has(text, e.pattern),
  };
}
// No leading \\b: "ballgown" is a gown.
const DRESS_TYPE = /(gown|dress|sheath|skirt|frock)\b/i;
const SUIT_TYPE = /\b(suit|tux|tuxedo|blazer|jacket|trousers|pants|jumpsuit)\b/i;
/** Two palette colours → both present in BOTH outfits = the mirror. */
function mirrored(palette: string | null, left: string, right: string): boolean | null {
  if (!palette || /^(tonal|black|porcelain|storm)/i.test(palette)) return null;
  const parts = palette
    .toLowerCase()
    .split(/\s+(?:against|with|and|cutting across)\s+/)
    .map((p) =>
      p
        .replace(/^(deep|soft|warm|acid|burnt|dusty|ice|pale)\s+/, '')
        .replace(/\s+accents$/, '')
        .trim()
    );
  if (parts.length < 2) return null;
  const [a, b] = parts;
  const both = (t: string) => t.toLowerCase().includes(a) && t.toLowerCase().includes(b);
  return both(left) && both(right);
}

// ── one render ─────────────────────────────────────────────────────────
interface Result {
  id: string;
  run: number;
  shape: Case['shape'];
  prompt: string;
  cleaned: string;
  palette?: string | null;
  cut?: string | null;
  selfSide?: 'left' | 'right';
  selfOutfit?: string;
  partnerOutfit?: string;
  finalPrompt: string;
  fallbackReasons: string[];
  checks: {
    self: ReturnType<typeof check>;
    partner: ReturnType<typeof check>;
    mirrored: boolean | null;
    formalTypeMismatch: boolean | null;
    /** plan variant: every person we coloured wears their own colour. */
    ownColourKept?: boolean | null;
    /** plan variant: someone wears their partner's colour (the mirror). */
    crossColour?: boolean | null;
  };
  plan?: OutfitPlan | null;
  error?: string;
}

// The distinctive word(s) of a palette colour: "cobalt blue" → cobalt, "soft coral" → coral.
const GENERIC_COLOUR = new Set([
  'blue',
  'green',
  'pink',
  'red',
  'yellow',
  'purple',
  'orange',
  'brown',
  'white',
  'black',
  'grey',
  'gray',
  'deep',
  'soft',
  'warm',
  'pale',
  'light',
  'dark',
]);
function colourTokens(name: string): string[] {
  const words = name
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);
  const distinct = words.filter((w) => !GENERIC_COLOUR.has(w));
  return distinct.length ? distinct : words.slice(-1);
}
const wears = (outfit: string, colour: string): boolean =>
  colourTokens(colour).some((t) => new RegExp(`\\b${t}`, 'i').test(outfit));
function planColourChecks(plan: OutfitPlan, outfitByRole: Record<string, string>) {
  let own: boolean | null = null;
  let cross = false;
  for (const p of plan.people) {
    const mine = outfitByRole[p.role] ?? '';
    if (p.colourSource === 'roll' && p.colour) {
      own = (own ?? true) && wears(mine, p.colour.lead);
      for (const avoid of p.avoidColours) if (wears(mine, avoid)) cross = true;
    }
  }
  return { ownColourKept: own, crossColour: plan.colourMode === 'solo' ? null : cross };
}

async function renderOne(c: Case, run: number): Promise<Result> {
  const raw = sanitizeUserText(c.prompt, 'hint');
  const castNames =
    c.partner && /^[A-Z]/.test(c.partner.name) ? [{ id: 'p1', name: c.partner.name }] : [];
  const det = detectSelfInsert(raw, { castNames });
  const cleaned = sanitizeUserPrompt(det.cleanedPrompt);
  const base = { id: c.id, run, shape: c.shape, prompt: c.prompt, cleaned };

  if (c.shape === 'couple') {
    const legend: OutfitPerson[] = [
      { role: 'self', label: 'the user', gender: c.self },
      {
        role: 'plus_one',
        label: /^[A-Z]/.test(c.partner!.name) ? c.partner!.name : `the user's ${c.partner!.name}`,
        gender: c.partner!.gender,
      },
    ];
    const [split, specOut] = await Promise.all([
      splitPromptScene(cleaned, 2, KEY),
      VARIANT === 'plan' ? extractOutfitSpec(raw, legend, KEY) : Promise.resolve(null),
    ]);
    const plan =
      VARIANT === 'plan'
        ? planOutfits(
            ['self', 'plus_one'],
            DEFAULT_OUTFIT_ROLLS,
            specOut && specOut.source === 'read' ? specOut.result.byRole : {}
          )
        : null;
    const selfM = castMember('self', c.self);
    const partM = castMember('plus_one', c.partner!.gender, c.partner!.relationship);
    const flip = Math.random() < 0.5;
    const ordered = flip ? [partM, selfM] : [selfM, partM];
    const resolved = resolveCastForPrompt(ordered, {
      characterRenderMode: 'natural',
      key: 'photography',
    });
    const slotInput: CharacterSlotPipelineInput = {
      cast: resolved.map((rc) => {
        const src = ordered.find((m) => m.role === rc.role)!;
        return {
          role: rc.role,
          promptDesc: rc.promptDesc,
          age: null,
          physicalSummary: src.physical_summary,
          gender: src.gender,
          ethnicity: null,
        };
      }),
      iconicAnchor: null,
      userPlace: cleaned || null,
      ...(split.source === 'split' ? { setAtOverride: split.setting } : {}),
      ...rollCreateSceneAxes(),
      wardrobeAnchor: split.source === 'split' ? null : cleaned || null,
      mediumFluxFragment: 'a cinematic photograph with rich natural colour',
      vibeDirective: 'warm, cinematic and inviting',
      avoidList: '',
      vibeFragment: null,
      activityWardrobe: true,
      action:
        split.action ?? 'standing side by side, one with a hand resting on the other’s shoulder',
      ...(plan ? { outfitPlan: plan } : {}),
    };
    const res = await runCharacterSlotPipeline(slotInput, KEY);
    const slots = res.slots as DualSlots;
    const finalPrompt = composeExperimentalCouple({
      slots,
      input: slotInput,
      variant: 'narrative_fg',
    });
    const selfSide: 'left' | 'right' = resolved[0].role === 'self' ? 'left' : 'right';
    const selfOutfit = selfSide === 'left' ? slots.left_wardrobe : slots.right_wardrobe;
    const partnerOutfit = selfSide === 'left' ? slots.right_wardrobe : slots.left_wardrobe;
    const palette = res.briefUsed.match(/PALETTE for this render: ([^—]*)/)?.[1]?.trim() ?? null;
    const cut = res.briefUsed.match(/CUT for this render: ([^—]*)/)?.[1]?.trim() ?? null;
    const formal = c.tags?.includes('formal_same_gender')
      ? DRESS_TYPE.test(selfOutfit) !== DRESS_TYPE.test(partnerOutfit) ||
        (SUIT_TYPE.test(selfOutfit) && !DRESS_TYPE.test(selfOutfit)) !==
          (SUIT_TYPE.test(partnerOutfit) && !DRESS_TYPE.test(partnerOutfit))
      : null;
    return {
      ...base,
      palette,
      cut,
      selfSide,
      selfOutfit,
      partnerOutfit,
      finalPrompt,
      fallbackReasons: [
        `create_scene_split:${split.source}`,
        ...(specOut ? outfitSpecStamps(specOut, 2) : []),
        ...res.fallbackReasons,
      ],
      plan,
      checks: {
        self: check(selfOutfit, c.expectSelf),
        partner: check(partnerOutfit, c.expectPartner),
        mirrored: c.tags?.includes('no_clothing')
          ? mirrored(palette, slots.left_wardrobe, slots.right_wardrobe)
          : null,
        formalTypeMismatch: formal,
        ...(plan ? planColourChecks(plan, { self: selfOutfit, plus_one: partnerOutfit }) : {}),
      },
    };
  }

  // SOLO: the compiler + one freeform Sonnet call, as generate-dream does (no scene expansion).
  const who =
    c.shape === 'solo_self'
      ? castMember('self', c.self)
      : castMember('plus_one', c.partner!.gender, c.partner!.relationship);
  const resolved = resolveCastForPrompt([who], {
    characterRenderMode: 'natural',
    key: 'photography',
  });
  const soloRole = c.shape === 'solo_self' ? 'self' : 'plus_one';
  let soloPlan: OutfitPlan | null = null;
  const soloStamps: string[] = [];
  if (VARIANT === 'plan') {
    const legend: OutfitPerson[] = [
      soloRole === 'self'
        ? { role: 'self', label: 'the user', gender: c.self }
        : {
            role: 'plus_one',
            label: /^[A-Z]/.test(c.partner!.name)
              ? c.partner!.name
              : `the user's ${c.partner!.name}`,
            gender: c.partner!.gender,
          },
    ];
    const specOut = await extractOutfitSpec(raw, legend, KEY);
    soloStamps.push(...outfitSpecStamps(specOut, 1));
    soloPlan = planOutfits(
      [soloRole],
      DEFAULT_OUTFIT_ROLLS,
      specOut.source === 'read' ? specOut.result.byRole : {}
    );
  }
  const compiled = compilePrompt({
    inputType: 'self_insert',
    medium: {
      key: 'photography',
      directive: 'a cinematic photograph with rich natural colour',
      fluxFragment: 'a cinematic photograph with rich natural colour',
      characterRenderMode: 'natural',
      faceSwaps: true,
    },
    vibe: { key: 'cinematic', directive: 'warm, cinematic and inviting' },
    scene: { userPrompt: cleaned || undefined },
    cast: resolved,
    composition: {
      type: 'character',
      faceSwapEligible: true,
      shotDirection: 'medium shot',
      focalAnchor: 'the person',
    },
    ...(soloPlan ? { outfitPlan: soloPlan } : {}),
  });
  const sonnet = await callSonnet(compiled.sonnetBrief, KEY, compiled.maxTokens);
  let soloText = sonnet.text;
  if (soloPlan) {
    const enforced = enforceSoloOutfit(soloText, soloPlan.people[0]);
    soloText = enforced.prompt;
    soloStamps.push(...enforced.stamps);
  }
  const finalPrompt = postProcessPrompt(soloText, compiled.postProcess);
  const occluder =
    /\b(sun ?glasses|goggles|helmets?|masks?|visors?|veils?)\b|\bshades\b(?!\s+of\b)/i;
  const expect = c.shape === 'solo_self' ? c.expectSelf : c.expectPartner;
  return {
    ...base,
    finalPrompt,
    fallbackReasons: [
      ...soloStamps,
      ...(c.tags?.includes('occluder') && occluder.test(finalPrompt) ? ['OCCLUDER_IN_FINAL'] : []),
    ],
    plan: soloPlan,
    checks: {
      self: c.shape === 'solo_self' ? check(finalPrompt, expect) : null,
      partner: c.shape === 'solo_partner' ? check(finalPrompt, expect) : null,
      mirrored: null,
      formalTypeMismatch: null,
      ...(soloPlan ? planColourChecks(soloPlan, { [soloRole]: finalPrompt }) : {}),
    },
  };
}

// ── extract mode (phase 2): does the outfit reader get who-wears-what right? ──
async function runExtract(): Promise<void> {
  const personOf = (c: Case, role: 'self' | 'plus_one'): OutfitPerson =>
    role === 'self'
      ? { role: 'self', label: 'the user', gender: c.self }
      : {
          role: 'plus_one',
          label: /^[A-Z]/.test(c.partner!.name) ? c.partner!.name : `the user's ${c.partner!.name}`,
          gender: c.partner!.gender,
        };
  const todo: Array<{ c: Case; run: number }> = [];
  for (const c of CASES) {
    if (ONLY.length && !ONLY.includes(c.id)) continue;
    for (let r = 0; r < RUNS; r++) todo.push({ c, run: r });
  }
  const out: Array<Record<string, unknown>> = [];
  const tally = {
    garment: [0, 0],
    colour: [0, 0],
    pattern: [0, 0],
    falseLock: 0,
    missed: 0,
    errors: 0,
  };
  const marks = new Map<string, string[]>();
  let i = 0;
  const work = async () => {
    while (i < todo.length) {
      const { c, run } = todo[i++];
      const raw = sanitizeUserText(c.prompt, 'hint');
      const roles: Array<'self' | 'plus_one'> =
        c.shape === 'couple'
          ? ['self', 'plus_one']
          : c.shape === 'solo_self'
            ? ['self']
            : ['plus_one'];
      const people = roles.map((r) => personOf(c, r));
      const outcome = await extractOutfitSpec(raw, people, KEY);
      const m: string[] = [];
      if (outcome.source === 'error') tally.errors++;
      const byRole = outcome.source === 'read' ? outcome.result.byRole : {};
      for (const role of roles) {
        const e = role === 'self' ? c.expectSelf : c.expectPartner;
        const got = byRole[role];
        const who = role === 'self' ? 'self' : 'partner';
        if (!e) {
          if (got && (got.garment || got.colour)) {
            tally.falseLock++;
            m.push(`${who}:FALSE_LOCK(${got.garment ?? ''}/${got.colour ?? ''})`);
          }
          continue;
        }
        if (!got && outcome.source === 'skipped') {
          tally.missed++;
          m.push(`${who}:prefilter_missed`);
        }
        const g = got ?? { garment: null, colour: null, colourImplied: false, pattern: null };
        if (e.garment) {
          tally.garment[1]++;
          if (g.garment && new RegExp(e.garment, 'i').test(g.garment)) tally.garment[0]++;
          else m.push(`${who}.garment✗(${g.garment})`);
        }
        if (e.implied === false && g.colourImplied) {
          tally.colour[1]++;
          m.push(`${who}.WRONGLY_IMPLIED`);
        }
        if (e.implied || e.colour) {
          tally.colour[1]++;
          const ok = e.implied
            ? g.colourImplied
            : !!g.colour && new RegExp(e.colour!, 'i').test(g.colour);
          if (ok) tally.colour[0]++;
          else m.push(`${who}.colour✗(${g.colourImplied ? 'IMPLIED' : g.colour})`);
        }
        if (e.pattern) {
          tally.pattern[1]++;
          const hay = `${g.pattern ?? ''} ${g.garment ?? ''}`;
          if (new RegExp(e.pattern, 'i').test(hay)) tally.pattern[0]++;
          else m.push(`${who}.pattern✗(${g.pattern})`);
        }
      }
      marks.set(c.id, [...(marks.get(c.id) ?? []), m.length ? m.join(' ') : 'ok']);
      out.push({
        id: c.id,
        run,
        prompt: c.prompt,
        source: outcome.source,
        byRole,
        stamps: outfitSpecStamps(outcome, roles.length),
        unassigned: outcome.source === 'read' ? outcome.result.unassigned : null,
      });
      Deno.stdout.writeSync(new TextEncoder().encode('.'));
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, work));
  console.log('');
  Deno.mkdirSync(OUT, { recursive: true });
  out.sort(
    (a, b) =>
      String(a.id).localeCompare(String(b.id), undefined, { numeric: true }) ||
      Number(a.run) - Number(b.run)
  );
  Deno.writeTextFileSync(`${OUT}/extract.json`, JSON.stringify(out, null, 2));
  const f = ([p, t]: number[]) => (t ? `${p}/${t} (${Math.round((100 * p) / t)}%)` : 'n/a');
  console.log(`reads: ${out.length}  errors: ${tally.errors}  prefilter misses: ${tally.missed}`);
  console.log(`garment right : ${f(tally.garment)}`);
  console.log(
    `colour right  : ${f(tally.colour)}  (IMPLIED counted where the garment carries its own colours)`
  );
  console.log(`pattern right : ${f(tally.pattern)}`);
  console.log(
    `false locks (something locked on a person the user said nothing about): ${tally.falseLock}`
  );
  for (const [id, ms] of marks) console.log(`  ${id.padEnd(4)} ${ms.join(' | ')}`);
}
if (MODE === 'extract') {
  await runExtract();
  Deno.exit(0);
}

// ── run ────────────────────────────────────────────────────────────────
const jobs: Array<{ c: Case; run: number }> = [];
for (const c of CASES) {
  if (ONLY.length && !ONLY.includes(c.id)) continue;
  for (let r = 0; r < RUNS; r++) jobs.push({ c, run: r });
}
const results: Result[] = [];
let next = 0;
async function worker() {
  while (next < jobs.length) {
    const { c, run } = jobs[next++];
    try {
      results.push(await renderOne(c, run));
    } catch (e) {
      results.push({
        id: c.id,
        run,
        shape: c.shape,
        prompt: c.prompt,
        cleaned: '',
        finalPrompt: '',
        fallbackReasons: [],
        checks: { self: null, partner: null, mirrored: null, formalTypeMismatch: null },
        error: (e as Error).message,
      });
    }
    Deno.stdout.writeSync(new TextEncoder().encode('.'));
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log('');
Deno.mkdirSync(OUT, { recursive: true });
results.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }) || a.run - b.run);
Deno.writeTextFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));

// ── summary ────────────────────────────────────────────────────────────
type Tally = { pass: number; total: number };
const t = (): Tally => ({ pass: 0, total: 0 });
const garment = t(),
  colour = t(),
  pattern = t();
const mirror = t(),
  formal = t(),
  ownColour = t(),
  crossColour = t();
let codeApplied = 0;
let plainViolations = 0,
  wardrobeFallbacks = 0,
  errors = 0;
const perCase = new Map<string, string[]>();
for (const r of results) {
  if (r.error) {
    errors++;
    continue;
  }
  const marks: string[] = [];
  for (const [who, ck] of [
    ['self', r.checks.self],
    ['partner', r.checks.partner],
  ] as const) {
    if (!ck) continue;
    for (const [k, tally] of [
      ['garment', garment],
      ['colour', colour],
      ['pattern', pattern],
    ] as const) {
      const v = ck[k];
      if (v === null) continue;
      tally.total++;
      if (v) tally.pass++;
      else marks.push(`${who}.${k}✗`);
    }
  }
  if (r.checks.mirrored !== null) {
    mirror.total++;
    if (r.checks.mirrored) {
      mirror.pass++;
      marks.push('mirror');
    }
  }
  if (r.checks.ownColourKept !== undefined && r.checks.ownColourKept !== null) {
    ownColour.total++;
    if (r.checks.ownColourKept) ownColour.pass++;
    else marks.push('own-colour✗');
  }
  if (r.checks.crossColour !== undefined && r.checks.crossColour !== null) {
    crossColour.total++;
    if (r.checks.crossColour) {
      crossColour.pass++;
      marks.push('wears-partner-colour');
    }
  }
  if (r.fallbackReasons.includes('OCCLUDER_IN_FINAL')) marks.push('OCCLUDER_IN_FINAL');
  if (r.fallbackReasons.some((f) => /outfit_lock:.*code_applied/.test(f))) {
    codeApplied++;
    marks.push('lock-code-applied');
  }
  if (r.checks.formalTypeMismatch !== null) {
    formal.total++;
    if (r.checks.formalTypeMismatch) {
      formal.pass++;
      marks.push('dress-vs-suit');
    }
  }
  if (r.fallbackReasons.some((f) => /plain_clothes/.test(f))) {
    plainViolations++;
    marks.push('plain_clothes');
  }
  if (r.fallbackReasons.some((f) => /character_slot_fallback_used/.test(f))) {
    wardrobeFallbacks++;
    marks.push('FALLBACK');
  }
  perCase.set(r.id, [...(perCase.get(r.id) ?? []), marks.length ? marks.join(' ') : 'ok']);
}
const pct = (x: Tally) =>
  x.total ? `${x.pass}/${x.total} (${Math.round((100 * x.pass) / x.total)}%)` : 'n/a';
console.log(`renders: ${results.length}  errors: ${errors}`);
console.log(`user garment kept : ${pct(garment)}`);
console.log(`user colour kept  : ${pct(colour)}`);
console.log(`user pattern kept : ${pct(pattern)}`);
console.log(`palette mirrored (no-clothing couples) : ${pct(mirror)}`);
console.log(`dress next to suit (same-gender formal): ${pct(formal)}`);
if (VARIANT === 'plan') {
  console.log(`[plan] wears their own rolled colour : ${pct(ownColour)}`);
  console.log(`[plan] wears the partner's colour    : ${pct(crossColour)}`);
  console.log(`[plan] user outfit written in by code: ${codeApplied}`);
}
console.log(
  `plain-clothes violations: ${plainViolations}   wardrobe fallbacks: ${wardrobeFallbacks}`
);
for (const [id, marks] of perCase) console.log(`  ${id.padEnd(4)} ${marks.join(' | ')}`);
