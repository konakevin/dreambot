/**
 * SOLO ACTION EARLY (mig 656, 2026-10-02): a nightly solo's action rides right after "set at", next to the place it
 * uses, instead of after the ~60-word anchor where flux-1.1-pro dropped it (the fall / Halloween "woman on a path"
 * nightlies). Locks the order, the byte-identical off state, the QA flag and the nightly wiring.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));

import * as fs from 'fs';
import * as path from 'path';
import { parseQaFlags } from '@engine/nightlyQaFlags';
import {
  assembleCharacterPrompt,
  type CharacterSlotPipelineInput,
} from '@engine/characterSlotPrompt';

const solo = (): CharacterSlotPipelineInput => ({
  cast: [{ role: 'plus_one', promptDesc: 'a woman, 38', gender: 'female' }],
  iconicAnchor: 'Haunted autumn vineyard',
  userPlace: null,
  timeAxis: '',
  weatherAxis: '',
  phenomenaAxis: '',
  wardrobeAnchor: null,
  realWorldLocation: false,
  mediumFluxFragment: 'loose lineless watercolor painting',
  vibeDirective: 'hushed',
  avoidList: '',
  lookNeutralFraming: true,
  framingInAnchor: true,
});
const slots = {
  scene_description: 'twisted grapevines with crimson leaves, a broken fountain at center',
  wardrobe: 'waxed-canvas field jacket in deep plum, slim black trousers',
  mood: 'spooky wonder',
  props: '',
  action: 'resting one hand on the cracked fountain rim, a jack-o-lantern held at waist height.',
};

describe('nightly solo action early (mig 656)', () => {
  it('puts the action right after "set at", before the anchor, and only once', () => {
    const p = assembleCharacterPrompt(slots, { ...solo(), soloActionEarly: true });
    const setAt = p.indexOf('set at Haunted autumn vineyard');
    const act = p.indexOf('resting one hand on the cracked fountain rim');
    expect(setAt).toBeGreaterThanOrEqual(0);
    expect(act).toBeGreaterThan(setAt);
    expect(act).toBeLessThan(p.indexOf('ONE person alone in the scene'));
    expect(p.split('cracked fountain rim').length - 1).toBe(1);
    expect(p).not.toContain('waist height.,');
  });

  it('moves words, never adds or drops them', () => {
    const words = (s: string) => s.replace(/[.,]/g, ' ').split(/\s+/).filter(Boolean).sort();
    expect(words(assembleCharacterPrompt(slots, { ...solo(), soloActionEarly: true }))).toEqual(
      words(assembleCharacterPrompt(slots, solo()))
    );
  });

  it('off: the prompt is exactly the old one', () => {
    expect(assembleCharacterPrompt(slots, { ...solo(), soloActionEarly: false })).toBe(
      assembleCharacterPrompt(slots, solo())
    );
  });

  it('no action: on and off are the same prompt', () => {
    const still = { ...slots, action: null };
    expect(assembleCharacterPrompt(still, { ...solo(), soloActionEarly: true })).toBe(
      assembleCharacterPrompt(still, solo())
    );
  });

  it('a couple prompt ignores the flag', () => {
    const couple: CharacterSlotPipelineInput = {
      ...solo(),
      cast: [
        { role: 'plus_one', promptDesc: 'a woman, 38', gender: 'female' },
        { role: 'self', promptDesc: 'a man, 40', gender: 'male' },
      ],
    };
    const dual = {
      scene_description: slots.scene_description,
      left_wardrobe: 'a plum jacket',
      right_wardrobe: 'a tweed coat',
      mood: 'spooky wonder',
      props: '',
      action: 'both standing beside the fountain, a clear gap between their heads',
    };
    expect(assembleCharacterPrompt(dual, { ...couple, soloActionEarly: true })).toBe(
      assembleCharacterPrompt(dual, couple)
    );
  });

  it('force_solo_action_early is tri-state', () => {
    expect(parseQaFlags({}).force_solo_action_early).toBeNull();
    expect(parseQaFlags({ force_solo_action_early: true }).force_solo_action_early).toBe(true);
    expect(parseQaFlags({ force_solo_action_early: false }).force_solo_action_early).toBe(false);
  });

  it('nightly wires it for single-cast only, from the QA flag or engine_config, and stamps it', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '../../supabase/functions/nightly-dreams/index.ts'),
      'utf8'
    );
    expect(src).toMatch(
      /resolvedCast\.length === 1 &&\s*\(force_solo_action_early \?\? engineCfg0\.nightlySoloActionEarly\)/
    );
    expect(src).toContain("fallbackReasons.push('solo_action_early')");
    expect(src).toContain('...(soloActionEarly ? { soloActionEarly: true } : {})');
  });
});
