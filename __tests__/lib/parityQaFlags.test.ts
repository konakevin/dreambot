/** force_dual_slots / force_slot_input (COUPLE_PROMPT_PARITY_PLAN.md §2) parse strictly or not at all. */
import { parseQaFlags } from '@engine/nightlyQaFlags';

const slots = {
  scene_description: 'golden stalks',
  left_wardrobe: 'flannel',
  right_wardrobe: 'sweater',
  mood: 'calm',
  props: 'a basket',
  action: 'leaning on the fence',
};
const slotInput = {
  cast: [{ role: 'self', promptDesc: 'a man', gender: 'male', physicalSummary: 'brown hair' }],
  iconicAnchor: null,
  userPlace: 'Kona',
  mediumFluxFragment: 'watercolor',
};

describe('parity QA flags', () => {
  it('force_dual_slots: full object round-trips; props defaults; missing field → null', () => {
    expect(parseQaFlags({ force_dual_slots: slots }).force_dual_slots).toEqual(slots);
    const noProps = parseQaFlags({
      force_dual_slots: { ...slots, props: undefined, action: undefined },
    });
    expect(noProps.force_dual_slots).toEqual({ ...slots, props: '', action: null });
    expect(parseQaFlags({ force_dual_slots: { ...slots, mood: 3 } }).force_dual_slots).toBeNull();
    expect(parseQaFlags({ force_dual_slots: 'x' }).force_dual_slots).toBeNull();
    expect(parseQaFlags({}).force_dual_slots).toBeNull();
  });
  it('force_slot_input: needs a 1-2 member cast, a medium fragment and the anchor keys', () => {
    expect(parseQaFlags({ force_slot_input: slotInput }).force_slot_input).toBe(slotInput);
    expect(
      parseQaFlags({ force_slot_input: { ...slotInput, cast: [] } }).force_slot_input
    ).toBeNull();
    expect(
      parseQaFlags({ force_slot_input: { ...slotInput, mediumFluxFragment: null } })
        .force_slot_input
    ).toBeNull();
    expect(
      parseQaFlags({ force_slot_input: { cast: slotInput.cast } }).force_slot_input
    ).toBeNull();
    expect(parseQaFlags({}).force_slot_input).toBeNull();
  });
});

describe('Phase A2 QA flags (NIGHTLY_LOOKS_REFACTOR_PLAN.md)', () => {
  const single = {
    scene_description: 'a glasshouse',
    wardrobe: 'green velvet jacket',
    mood: 'lush',
    props: 'a brass lantern',
    action: 'one hand on the railing',
  };
  it('force_single_slots: full object round-trips; props defaults; missing field → null', () => {
    expect(parseQaFlags({ force_single_slots: single }).force_single_slots).toEqual(single);
    expect(
      parseQaFlags({ force_single_slots: { ...single, props: undefined, action: undefined } })
        .force_single_slots
    ).toEqual({ ...single, props: '', action: null });
    expect(
      parseQaFlags({ force_single_slots: { ...single, wardrobe: undefined } }).force_single_slots
    ).toBeNull();
    expect(parseQaFlags({}).force_single_slots).toBeNull();
  });
  it('force_look: a key passes through; empty / missing → undefined (never touches force_medium)', () => {
    const f = parseQaFlags({ force_look: 'nightly_classical_oil' });
    expect(f.force_look).toBe('nightly_classical_oil');
    expect(f.force_medium).toBeUndefined();
    expect(parseQaFlags({ force_look: '' }).force_look).toBeUndefined();
    expect(parseQaFlags({}).force_look).toBeUndefined();
  });
});
