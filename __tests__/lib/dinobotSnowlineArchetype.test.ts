/**
 * Locks DinoBot's `DINOBOT_SNOWLINE_FOREST` archetype against silent drift.
 *
 * `snowline-forest` was built as a clone of `paleo-landscape`, and the clone
 * inherited an archetype that CONTRADICTS the path's whole premise:
 *
 *   "The PALETTE skews WARM EARTH-TONES — autumn-gold + bronze + rust-red +
 *    earthy ochre + amber + … NOT cold-monochrome."
 *   "• NO Iceland-style snowy-grey-rocky alpine canyons"
 *
 * A cold blue-shadowed forest at the snowline IS the thing that second line
 * hard-bans, and the first orders the opposite palette. Measured, not theorised:
 * all 8 of the path's renders carried the warm vocabulary into the prompt
 * alongside the snow words ("amber" in 7 of 8, "bronze" in 6, "rust" in 5).
 *
 * The fix is a WRAPPER over the warm archetype that swaps exactly those two
 * strings, so the two paths never drift apart on composition. That design has
 * one failure mode, and it is a silent one: if anyone edits the palette line or
 * the ban line in `DINOBOT_PALEO_LANDSCAPE`, the wrapper's `includes()` check
 * stops matching and the path quietly goes back to being ordered to render warm
 * earth tones for a snow scene, with nothing failing.
 *
 * So this test asserts BOTH halves: the anchors still exist in the source
 * template (otherwise the wrapper is a no-op) AND the wrapped output actually
 * comes out cold.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('../../scripts/bots/dinobot/archetype-templates');

const anchors = templates.DINOBOT_SNOWLINE_FOREST.__anchors;

/** Slot values are irrelevant here — only the template's own boilerplate matters. */
const args = {
  slots: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERE',
    biome: 'BIOME',
    megaflora: 'MEGAFLORA',
    surprise_element: 'SURPRISE',
    sky_layer: 'SKY',
    phenomenon: null,
  },
  sharedDNA: { scenePalette: 'SCENE_PALETTE', colorPalette: 'COLOR_PALETTE' },
  vibeDirective: 'VIBE',
};

describe('DINOBOT_SNOWLINE_FOREST — the cold sibling cannot silently go warm', () => {
  it('exports both archetypes', () => {
    expect(typeof templates.DINOBOT_PALEO_LANDSCAPE).toBe('function');
    expect(typeof templates.DINOBOT_SNOWLINE_FOREST).toBe('function');
    expect(anchors).toBeTruthy();
  });

  describe('the wrapper still has something to replace', () => {
    const warmOut: string = templates.DINOBOT_PALEO_LANDSCAPE(args);

    // If either of these fails, the wrapper has become a NO-OP and snowline
    // renders are being ordered to be warm again. Re-sync the anchor strings in
    // archetype-templates.js with whatever the palette / ban lines now say.
    it('the WARM palette anchor is still present in the paleo template', () => {
      expect(warmOut).toContain(anchors.warm);
    });

    it('the snowy-alpine BAN anchor is still present in the paleo template', () => {
      expect(warmOut).toContain(anchors.snowBan);
    });
  });

  describe('the wrapped output is actually cold', () => {
    const coldOut: string = templates.DINOBOT_SNOWLINE_FOREST(args);

    it('drops the warm-earth-tones mandate', () => {
      expect(coldOut).not.toContain(anchors.warm);
      expect(coldOut).not.toContain('NOT cold-monochrome');
    });

    it('injects the committed cold palette', () => {
      expect(coldOut).toContain(anchors.cold);
      expect(coldOut).toMatch(/glacial cyan/);
    });

    it("drops the ban on this path's own subject", () => {
      expect(coldOut).not.toContain(anchors.snowBan);
    });

    it('keeps everything else the warm archetype provides', () => {
      // The value of a wrapper over a copy: composition rules stay shared.
      expect(coldOut).toContain('NO HUMANS');
      const warmOut: string = templates.DINOBOT_PALEO_LANDSCAPE(args);
      // Only the two swapped strings should move the length meaningfully.
      expect(Math.abs(coldOut.length - warmOut.length)).toBeLessThan(400);
    });
  });

  it('the path file is wired to the cold archetype', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('../../scripts/bots/dinobot/paths/snowline-forest');
    expect(path.archetype).toBe('DINOBOT_SNOWLINE_FOREST');
  });
});
