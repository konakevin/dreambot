/**
 * SWAP GEOMETRY (looks path, 2026-09-12). Kevin: the strict same-plane / clear-gap / no-contact couple language
 * was written before the engine had fault tolerance (dual re-render ×2 → identity gate → gender-safe solo
 * rebuild, never faceless). With that in place the prompt only has to maximise first-try odds, so 'natural'
 * lets the couple touch and move and the RE-RENDER falls back to the proven strict geometry.
 * Locks: strict / unset stays byte-identical everywhere; natural lifts ONLY the proximity rule; every natural
 * stance survives the natural validator; the strict retry drops the beat and restores the strict anchor.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import { validateActionBeat } from '@engine/actionSafety';
import { DUAL_STANCES_NATURAL, DUAL_STANCES_WIDE, DUAL_STANCES } from '@engine/dualStances';
import { resolveCastAction } from '@engine/castActionResolver';
import type { CastActionInputs } from '@engine/castActionResolver';
import { assembleCharacterPrompt, buildSlotBrief } from '@engine/characterSlotPrompt';
import type { CharacterSlotPipelineInput, DualSlots } from '@engine/characterSlotPrompt';
import { looksSlotInputFields, strictRetryPrompt } from '@engine/nightlyLooksPath';
import { parseQaFlags } from '@engine/nightlyQaFlags';

describe('validateActionBeat — natural geometry lifts the proximity rule and nothing else', () => {
  const contact =
    "one with an arm around the other's shoulders, standing close, the other holding a lantern";
  it('strict rejects contact as proximity; natural accepts the same beat', () => {
    expect(validateActionBeat(contact, 2)).toEqual({ ok: false, reason: 'proximity' });
    expect(validateActionBeat(contact, 2, 'strict')).toEqual({ ok: false, reason: 'proximity' });
    expect(validateActionBeat(contact, 2, 'natural')).toEqual({ ok: true });
  });
  it.each([
    ['one kissing the other on the forehead, standing close', 'unsafe_word'],
    ['both cheek to cheek at the rail', 'unsafe_word'],
    ['facing each other over the table, one pouring', 'direction'],
    ['she holds the lantern, the other the basket', 'pronoun'],
    ['both jumping off the low wall together', 'too_energetic'],
    ['one tilts a head toward the other, standing close', 'gaze'],
  ])('natural still rejects "%s" (%s)', (beat, reason) => {
    expect(validateActionBeat(beat, 2, 'natural')).toEqual({ ok: false, reason });
  });
  it('solo beats are unaffected by the mode', () => {
    expect(validateActionBeat('one hand on the gate, boot on the step', 1, 'natural')).toEqual({
      ok: true,
    });
  });
});

describe('DUAL_STANCES_NATURAL', () => {
  it('≥ 12 stances, unique keys, none shared with the strict sets by TEXT', () => {
    expect(DUAL_STANCES_NATURAL.length).toBeGreaterThanOrEqual(12);
    expect(new Set(DUAL_STANCES_NATURAL.map((s) => s.key)).size).toBe(DUAL_STANCES_NATURAL.length);
    const strictTexts = new Set([...DUAL_STANCES, ...DUAL_STANCES_WIDE].map((s) => s.text));
    expect(DUAL_STANCES_NATURAL.every((s) => !strictTexts.has(s.text))).toBe(true);
  });
  it.each(DUAL_STANCES_NATURAL.map((s) => [s.key, s.text]))(
    'natural stance "%s" passes the NATURAL validator verbatim (an echoed stance still ships)',
    (_key, text) => expect(validateActionBeat(text as string, 2, 'natural')).toEqual({ ok: true })
  );
  it('at least four stances are CONTACT stances the strict validator would drop (the mode is load-bearing)', () => {
    const dropped = DUAL_STANCES_NATURAL.filter(
      (s) => validateActionBeat(s.text, 2, 'strict').ok === false
    );
    expect(dropped.length).toBeGreaterThanOrEqual(4);
    expect(
      dropped.every((s) => validateActionBeat(s.text, 2, 'strict').reason === 'proximity')
    ).toBe(true);
  });
  it('covers contact, motion and geometry (seated + height contrast) variety', () => {
    expect(DUAL_STANCES_NATURAL.some((s) => /arm around|arms linked|shoulder/.test(s.text))).toBe(
      true
    );
    expect(DUAL_STANCES_NATURAL.some((s) => /walking|stroll|dance|twirl/.test(s.text))).toBe(true);
    expect(DUAL_STANCES_NATURAL.some((s) => s.seated)).toBe(true);
    expect(DUAL_STANCES_NATURAL.some((s) => s.heightContrast)).toBe(true);
  });
});

describe('resolveCastAction — naturalStances', () => {
  const base: CastActionInputs = {
    castCount: 2,
    forceAction: null,
    dualActiveScene: false,
    soloActiveScene: false,
    bespokePoolName: null,
    bespokePoses: [],
    sceneKind: null,
    hasSpecialScene: false,
    hasSpecialWardrobe: false,
    plusOneRelationship: 'wife',
    activePose: null,
    activeSinglePose: null,
    locationAction: null,
    dualAction: 'classic dual',
    singleAction: 'classic single',
    classicDualPools: { companion: ['c'], partner: ['p1', 'p2'], playful: ['pl'], dynamic: ['d'] },
    classicSoloCandid: ['candid A'],
    sfaRoll: true,
    sfaKind: 'location',
    holidayCategory: null,
    holidayPool: null,
    registerKey: null,
    rollRegisters: false,
    rng: () => 0,
  };
  it('rolls the NATURAL set and stamps natural_stances (never wide_stances); wide alone still rolls WIDE', () => {
    const nat = resolveCastAction({ ...base, wideStances: true, naturalStances: true });
    expect(DUAL_STANCES_NATURAL.some((s) => s.key === nat.dualStance!.key)).toBe(true);
    expect(nat.stamps).toContain('natural_stances');
    expect(nat.stamps).not.toContain('wide_stances');
    const wide = resolveCastAction({ ...base, wideStances: true });
    // 1.2.0-parity: wideStances rolls the generic + wide sets as one list
    expect(
      [...DUAL_STANCES, ...DUAL_STANCES_WIDE].some((s) => s.key === wide.dualStance!.key)
    ).toBe(true);
    expect(wide.stamps).toContain('wide_stances');
    // the pool pose is still the fallback the strict retry lands on
    expect(['p1', 'p2', 'classic dual']).toContain(nat.action);
  });
});

// ── composer + brief ──
const input = (extra: Partial<CharacterSlotPipelineInput> = {}): CharacterSlotPipelineInput => ({
  cast: [
    {
      role: 'plus_one',
      promptDesc: 'a woman, 43, dark brown hair',
      gender: 'female',
      physicalSummary: null,
    },
    { role: 'self', promptDesc: 'a man, 43, brown hair', gender: 'male', physicalSummary: null },
  ],
  iconicAnchor: 'Sunflower labyrinth at dusk',
  userPlace: null,
  setAtOverride: 'Sunflower labyrinth at dusk',
  timeAxis: 'dusk',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: 'a cream knit sweater',
  realWorldLocation: false,
  mediumFluxFragment: 'watercolor painting on cold-press paper',
  vibeDirective: 'meditative amber stillness',
  avoidList: '',
  action: 'both leaning on the split-rail fence, a clear gap between them',
  promptStyle: 'subject_first',
  authorAction: { register: 'candid travel', exemplars: ['x'], stance: 'arms linked' },
  ...extra,
});
const slots: DualSlots = {
  scene_description: 'towering golden stalks forming amber-glowing walls',
  left_wardrobe: 'a plaid flannel',
  right_wardrobe: 'a cream cable-knit sweater',
  mood: 'meditative amber stillness',
  props: '',
  action: "one with an arm around the other's shoulders, the other holding a lantern",
};
const STRICT_TAIL =
  'both facing the camera with large clearly visible faces and a clear gap between their heads, each head on its own side of the frame';
const STRICT_GAP =
  'a clear gap between their two heads, faces apart and not touching, not cheek to cheek';

describe('assembleCharacterPrompt — swapGeometry', () => {
  it('unset / null / strict are byte-identical (the legacy anchor + gap line)', () => {
    const a = assembleCharacterPrompt(slots, input());
    expect(assembleCharacterPrompt(slots, input({ swapGeometry: null }))).toBe(a);
    expect(assembleCharacterPrompt(slots, input({ swapGeometry: 'strict' }))).toBe(a);
    expect(a).toContain('two people standing side by side');
    expect(a).toContain(STRICT_TAIL);
    expect(a).toContain(STRICT_GAP);
    expect(a).toContain('both at the same vertical height');
  });
  it('natural: "two people together", the visibility clause only, no head-gap / own-side / same-height clauses', () => {
    const p = assembleCharacterPrompt(slots, input({ swapGeometry: 'natural' }));
    expect(p).toContain('two people together');
    expect(p).toContain('both with large clearly visible faces toward the viewer');
    expect(p).toContain('neither face hidden behind or pressed against the other');
    expect(p).not.toContain(STRICT_TAIL);
    expect(p).not.toContain(STRICT_GAP);
    expect(p).not.toContain('same vertical height');
    expect(p).not.toContain('each head on its own side');
    // the beat, scene, identities and the look all still ride
    expect(p).toContain(slots.action as string);
    expect(p).toContain(slots.scene_description);
    expect(p).toContain('watercolor painting on cold-press paper');
  });
  it('legacy prompt order ignores the mode (still the legacy dual anchor, byte-identical)', () => {
    const a = assembleCharacterPrompt(slots, input({ promptStyle: 'legacy' }));
    expect(
      assembleCharacterPrompt(slots, input({ promptStyle: 'legacy', swapGeometry: 'natural' }))
    ).toBe(a);
  });
});

describe('buildSlotBrief — swapGeometry', () => {
  it('strict / unset brief keeps the no-contact rule and the chest-level hands rule', () => {
    const b = buildSlotBrief(input());
    expect(b).toContain('they do NOT touch, hug, kiss, lean together, or face each other');
    expect(b).toContain('CHEST LEVEL OR LOWER');
    expect(buildSlotBrief(input({ swapGeometry: 'strict' }))).toContain('CHEST LEVEL OR LOWER');
  });
  it('natural brief allows real-couple contact and motion, still bans kiss / cheek to cheek / hidden / above the head', () => {
    const b = buildSlotBrief(input({ swapGeometry: 'natural' }));
    expect(b).toContain('They may touch the way a real couple does');
    expect(b).toContain(
      'never a kiss, never cheek to cheek, never one person hidden behind the other'
    );
    expect(b).toContain('Motion is welcome');
    expect(b).toContain('nothing raised above the head');
    expect(b).not.toContain('they do NOT touch');
    expect(b).not.toContain('CHEST LEVEL OR LOWER');
    // the face / gaze / pronoun rules are mode-independent
    expect(b).toContain('NEVER mention the head, chin, face');
  });
});

describe('looksSlotInputFields + strictRetryPrompt', () => {
  it('fields carry swapGeometry only when natural (strict stays byte-identical)', () => {
    const o = { vibeFragment: 'x', vibePosition: 'early' as const };
    expect(looksSlotInputFields(o, null, true, 'couple', () => 0.5, null)).not.toHaveProperty(
      'swapGeometry'
    );
    expect(
      looksSlotInputFields(o, null, true, 'couple', () => 0.5, null, 'strict')
    ).not.toHaveProperty('swapGeometry');
    expect(
      looksSlotInputFields(o, null, true, 'couple', () => 0.5, null, 'natural').swapGeometry
    ).toBe('natural');
  });
  it('strict retry: null for a strict input; for natural → strict anchor, beat dropped to the pool pose, stance + authorAction cleared', () => {
    expect(strictRetryPrompt(slots, input())).toBeNull();
    const r = strictRetryPrompt(
      slots,
      input({ swapGeometry: 'natural', dualStance: { seated: true } })
    );
    expect(r).not.toBeNull();
    expect(r!.input.swapGeometry).toBe('strict');
    expect(r!.input.authorAction).toBeNull();
    expect(r!.input.dualStance).toBeNull();
    expect(r!.slots.action).toBeNull();
    expect(r!.prompt).toContain(STRICT_TAIL);
    expect(r!.prompt).toContain(STRICT_GAP);
    expect(r!.prompt).toContain('two people standing side by side');
    expect(r!.prompt).toContain('both leaning on the split-rail fence');
    expect(r!.prompt).not.toContain('arm around');
    // identical to assembling the strict input directly — the retry is the plain strict prompt
    expect(r!.prompt).toBe(assembleCharacterPrompt(r!.slots, r!.input));
  });
});

describe('parseQaFlags — force_swap_geometry', () => {
  it('accepts natural / strict, null otherwise', () => {
    expect(parseQaFlags({}).force_swap_geometry).toBeNull();
    expect(parseQaFlags({ force_swap_geometry: 'natural' }).force_swap_geometry).toBe('natural');
    expect(parseQaFlags({ force_swap_geometry: 'strict' }).force_swap_geometry).toBe('strict');
    expect(parseQaFlags({ force_swap_geometry: 'loose' }).force_swap_geometry).toBeNull();
  });
});
