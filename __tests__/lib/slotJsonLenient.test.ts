/**
 * The slot parser accepts a trailing comma (LLM_MIGRATION.md step 1): Sonnet 5.5 left one before the closing brace
 * in 3 of 120 nightly slot replies ("Expected double-quoted property name"), which cost a retry each time. Valid JSON
 * never reaches the lenient pass, so everything that parsed before parses identically.
 */
jest.mock('@engine/llm', () => ({ callSonnet: jest.fn() }));
import { parseSlotsJson } from '@engine/characterSlotPrompt';

const DUAL = {
  scene_description: 'A rustic barn glows with warm light, pumpkins on the floorboards.',
  left_wardrobe: 'the white shroud ghost costume',
  right_wardrobe: 'the vampire count costume',
  mood: 'playful festive glow',
  props: 'a cider cauldron',
};

describe('parseSlotsJson', () => {
  it('parses valid JSON exactly as before', () => {
    expect(parseSlotsJson(JSON.stringify(DUAL), 2)).toMatchObject(DUAL);
  });
  it('accepts a trailing comma before the closing brace', () => {
    const withComma = JSON.stringify(DUAL, null, 2).replace(/\n}$/, ',\n}');
    expect(() => JSON.parse(withComma)).toThrow();
    expect(parseSlotsJson(withComma, 2)).toMatchObject(DUAL);
  });
  it('still rejects JSON that is broken in any other way', () => {
    expect(() => parseSlotsJson('{"scene_description": "x", mood: }', 2)).toThrow();
  });
});
