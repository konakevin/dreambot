/**
 * Scene-first actions (SCENE_FIRST_ACTION_PLAN.md §7).
 *
 * Part A — GOLDEN LOCK. With `authorAction` unset (the create / DLT path, and every nightly
 * render that did not roll the feature) the slot brief and the assembled prompt must stay
 * BYTE-IDENTICAL to the pre-change output captured in `__tests__/fixtures/slot-golden.json`.
 * Regenerate deliberately with `WRITE_GOLDEN=1 npx jest sceneFirstAction` and review the diff.
 *
 * Part B — the feature itself (added with the implementation).
 */
import fs from 'fs';
import path from 'path';

// characterSlotPrompt imports ./llm.ts (network). Mock it so the module loads.
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import { buildSlotBrief, assembleCharacterPrompt } from '@engine/characterSlotPrompt';
import type {
  CharacterSlotPipelineInput,
  DualSlots,
  SingleSlots,
} from '@engine/characterSlotPrompt';

const GOLDEN = path.join(__dirname, '..', 'fixtures', 'slot-golden.json');

const soloInput = (): CharacterSlotPipelineInput => ({
  cast: [
    {
      role: 'self',
      promptDesc: 'a man, 43, with a full head of brown hair',
      gender: 'male',
      physicalSummary: 'brown hair swept back from the forehead, short trimmed chestnut beard',
    },
  ],
  iconicAnchor:
    'Towering cursed library at midnight, grimoires floating open off the shelves, rolling ladders, candle sconces guttering green, a cracked spellbook glowing on a lectern',
  userPlace: null,
  setAtOverride: 'Towering cursed library at midnight',
  timeAxis: 'candlelit midnight',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: 'a tweed blazer over a dark turtleneck',
  realWorldLocation: false,
  mediumFluxFragment: 'watercolor painting on cold-press paper',
  vibeDirective: 'quiet arcane tension',
  avoidList: '',
  action: 'standing with arms crossed, hands visible on biceps',
});

const dualInput = (): CharacterSlotPipelineInput => ({
  ...soloInput(),
  cast: [
    {
      role: 'plus_one',
      promptDesc: 'a woman, 43, with a full head of dark brown hair',
      gender: 'female',
      physicalSummary: 'dark brown hair with caramel highlights',
    },
    {
      role: 'self',
      promptDesc: 'a man, 43, with a full head of brown hair',
      gender: 'male',
      physicalSummary: 'brown hair swept back from the forehead, short trimmed chestnut beard',
    },
  ],
  wardrobeAnchor: 'a tweed blazer over a dark turtleneck, or a long black cardigan with a brooch',
  action:
    "standing a comfortable arm's length apart, one adjusting their collar, the other with thumbs tucked into their waistband",
});

const singleSlots: SingleSlots = {
  scene_description:
    'Towering archive hall, floating spell tomes circling overhead, emerald candle flames casting jade pools on ancient stone',
  wardrobe: 'structured midnight navy blazer, black ribbed turtleneck',
  mood: 'quiet arcane tension',
  props: '',
};
const dualSlots: DualSlots = {
  scene_description: singleSlots.scene_description,
  left_wardrobe: 'sweeping deep charcoal velvet coat, antique pearl brooch at collar',
  right_wardrobe: singleSlots.wardrobe,
  mood: singleSlots.mood,
  props: '',
};

/** Deterministic capture: the brief picks a wardrobe mood with Math.random. */
function capture() {
  const spy = jest.spyOn(Math, 'random').mockReturnValue(0.42);
  try {
    return {
      singleBrief: buildSlotBrief(soloInput()),
      dualBrief: buildSlotBrief(dualInput()),
      singlePrompt: assembleCharacterPrompt(singleSlots, soloInput()),
      dualPrompt: assembleCharacterPrompt(dualSlots, dualInput()),
    };
  } finally {
    spy.mockRestore();
  }
}

describe('scene-first actions — golden lock with authorAction unset', () => {
  if (process.env.WRITE_GOLDEN) {
    it('writes the golden fixture (WRITE_GOLDEN=1)', () => {
      fs.writeFileSync(GOLDEN, JSON.stringify(capture(), null, 2) + '\n');
      expect(fs.existsSync(GOLDEN)).toBe(true);
    });
    return;
  }
  it('brief + assembled prompt are byte-identical to the pre-change capture (create/DLT safe)', () => {
    const golden = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(capture()).toEqual(golden);
  });
});

// ── Part B — the feature ────────────────────────────────────────────────────────────────
import { runCharacterSlotPipeline } from '@engine/characterSlotPrompt';
import { callSonnet } from '@engine/llm';

const mockSonnet = (obj: Record<string, string>) =>
  (callSonnet as jest.Mock).mockResolvedValue({ text: JSON.stringify(obj), rawResponse: 'raw' });

const dualSonnetSlots = {
  scene_description: dualSlots.scene_description,
  left_wardrobe: dualSlots.left_wardrobe,
  right_wardrobe: dualSlots.right_wardrobe,
  mood: 'quiet arcane tension',
  props: '',
};
const EXEMPLARS = [
  "standing a comfortable arm's length apart, one flexing their fingers, the other with hands deep in jacket pockets",
  'both leaning back against a fence with a clear gap between them, arms hanging naturally at their sides',
  'standing side by side with a clear gap between them, one buttoning their coat, the other with hands tucked into back pockets',
];
const authored = (input: CharacterSlotPipelineInput): CharacterSlotPipelineInput => ({
  ...input,
  authorAction: { register: 'holiday:halloween / witch_cottage', exemplars: EXEMPLARS },
});

describe('scene-first actions — the brief when authorAction is set', () => {
  it('dual: asks for a SIXTH field "action" with the swap-safe envelope + register + exemplars, and drops ACTION CONTEXT', () => {
    const brief = buildSlotBrief(authored(dualInput()));
    expect(brief).toContain('You write SIX fields.');
    expect(brief).toContain('"action": "..."');
    expect(brief).toContain('action (20-40 words, HARD LIMIT 48');
    expect(brief).toContain('holiday:halloween / witch_cottage');
    expect(brief).toContain('CHEST LEVEL OR LOWER');
    expect(brief).toContain('one …, the other …');
    expect(brief).toContain(EXEMPLARS[1]);
    expect(brief).not.toContain('ACTION CONTEXT');
    expect(brief).not.toContain(dualInput().action as string); // the pool pose never reaches Sonnet
  });
  it('solo: FIVE fields, no couple-gap line', () => {
    const brief = buildSlotBrief(authored(soloInput()));
    expect(brief).toContain('You write FIVE fields.');
    expect(brief).toContain('action (8-20 words, HARD LIMIT 22');
    expect(brief).toContain('"action": "..."');
    expect(brief).not.toContain('one …, the other …');
    expect(brief).not.toContain('ACTION CONTEXT');
  });
});

describe('scene-first actions — the pipeline', () => {
  beforeEach(() => (callSonnet as jest.Mock).mockReset());

  it('ships a valid authored beat at the pose slot, drops the pool pose, stamps scene_action', async () => {
    const beat =
      'one lifting a glowing grimoire to chest height, the other a step apart steadying a rolling ladder';
    mockSonnet({ ...dualSonnetSlots, action: beat });
    const r = await runCharacterSlotPipeline(authored(dualInput()), 'k');
    expect(r.fallbackReasons).toContain('scene_action');
    expect(r.assembledPrompt).toContain(beat);
    expect(r.assembledPrompt).not.toContain('adjusting their collar');
    // Position: right after the dual anchor, before the identity blocks (assembly slot 5).
    expect(r.assembledPrompt.indexOf(beat)).toBeLessThan(
      r.assembledPrompt.indexOf('LEFT side of frame')
    );
    expect(r.assembledPrompt.indexOf(beat)).toBeGreaterThan(
      r.assembledPrompt.indexOf('ENVIRONMENTAL TWO-SHOT')
    );
  });

  it('a swap-breaking beat is dropped (no retry), the pool pose ships, reason is stamped', async () => {
    mockSonnet({
      ...dualSonnetSlots,
      action: 'facing each other over the cauldron, hands on the rim',
    });
    const r = await runCharacterSlotPipeline(authored(dualInput()), 'k');
    expect(r.fallbackReasons).toContain('scene_action_fallback:direction');
    expect(r.assembledPrompt).not.toContain('facing each other');
    expect(r.assembledPrompt).toContain('adjusting their collar');
    expect((callSonnet as jest.Mock).mock.calls.length).toBe(1);
  });

  it('a too-close couple beat is dropped with reason proximity', async () => {
    mockSonnet({
      ...dualSonnetSlots,
      action: 'leaning into each other over the cauldron, one holding a candle',
    });
    const r = await runCharacterSlotPipeline(authored(dualInput()), 'k');
    expect(r.fallbackReasons).toContain('scene_action_fallback:proximity');
    expect(r.assembledPrompt).toContain('adjusting their collar');
  });

  it('missing action → scene_action_fallback:missing, pool pose ships', async () => {
    mockSonnet(dualSonnetSlots);
    const r = await runCharacterSlotPipeline(authored(dualInput()), 'k');
    expect(r.fallbackReasons).toContain('scene_action_fallback:missing');
    expect(r.assembledPrompt).toContain('adjusting their collar');
  });

  it('flag OFF: a hallucinated "action" key is ignored — the pool pose ships, no stamps', async () => {
    mockSonnet({ ...dualSonnetSlots, action: 'one stirring a cauldron, the other a step apart' });
    const r = await runCharacterSlotPipeline(dualInput(), 'k');
    expect(r.assembledPrompt).not.toContain('stirring a cauldron');
    expect(r.assembledPrompt).toContain('adjusting their collar');
    expect(r.fallbackReasons.some((x) => x.startsWith('scene_action'))).toBe(false);
  });

  it('solo: authored beat ships after the single anchor', async () => {
    const beat = 'lifting a cracked spellbook from the lectern with both hands at chest height';
    mockSonnet({
      scene_description: singleSlots.scene_description,
      wardrobe: singleSlots.wardrobe,
      mood: 'quiet',
      props: '',
      action: beat,
    });
    const r = await runCharacterSlotPipeline(authored(soloInput()), 'k');
    expect(r.fallbackReasons).toContain('scene_action');
    expect(r.assembledPrompt).toContain(beat);
    expect(r.assembledPrompt.indexOf(beat)).toBeGreaterThan(
      r.assembledPrompt.indexOf('ONE person alone in the scene')
    );
    expect(r.assembledPrompt.indexOf(beat)).toBeLessThan(r.assembledPrompt.indexOf('CHARACTER:'));
  });
});

// ── Part C — couple variance (2026-09-06): stance in the brief, closer preset, conditional anchor ──
describe('couple variance', () => {
  const stanceText =
    'one seated on something in the scene, the other standing beside at a clear gap';
  it('the brief carries the rolled stance and no longer mandates busy hands', () => {
    const brief = buildSlotBrief({
      ...dualInput(),
      authorAction: { register: 'holiday:halloween', exemplars: EXEMPLARS, stance: stanceText },
    });
    expect(brief).toContain('STANCE for this render');
    expect(brief).toContain(stanceText);
    expect(brief).toContain('OR\n  simply natural');
    expect(brief).not.toContain('feet planted');
    expect(brief).not.toContain('lean together, sit, or face each other');
  });
  it('waist_up preset: anchor + framing say waist-up, default says knees-up; solo ignores it', () => {
    const closer = assembleCharacterPrompt(dualSlots, {
      ...dualInput(),
      dualComposition: 'waist_up',
    });
    expect(closer).toContain('shown from the waist up in a closer two-shot');
    expect(closer).toContain('both shown from the waist up, faces large and clear');
    expect(closer).not.toContain('knees up');
    const def = assembleCharacterPrompt(dualSlots, dualInput());
    expect(def).toContain('shown from at least mid-thigh');
    expect(def).toContain('both shown from the knees up');
    const solo = assembleCharacterPrompt(singleSlots, {
      ...soloInput(),
      dualComposition: 'waist_up',
    });
    expect(solo).toContain('shown from the knees up');
  });
  it('seated stance drops "stand" from the anchor; height contrast drops the same-height line', () => {
    const seated = assembleCharacterPrompt(dualSlots, {
      ...dualInput(),
      dualStance: { seated: true },
    });
    expect(seated).toContain('the two side by side with a clear gap');
    expect(seated).not.toContain('the two stand side by side');
    expect(seated).toContain('both at the same vertical height');
    const contrast = assembleCharacterPrompt(dualSlots, {
      ...dualInput(),
      dualStance: { seated: true, heightContrast: true },
    });
    expect(contrast).not.toContain('both at the same vertical height');
    // the load-bearing head-gap line survives every variant
    for (const p of [seated, contrast])
      expect(p).toContain('a clear gap between their two heads, faces apart and not touching');
  });
});
