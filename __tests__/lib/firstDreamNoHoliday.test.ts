/**
 * A first dream always honours a place the user just picked in onboarding (Kevin 2026-09-30). Its place is
 * forced (force_place on every tier), but the scene-only holiday postcard ignored that, so the render skips
 * holiday resolution for first dreams entirely. One deletable condition, so it is locked here.
 */
import * as fs from 'fs';
import * as path from 'path';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'supabase', 'functions', 'nightly-dreams', 'index.ts'),
  'utf8'
);

describe('nightly-dreams: first dreams never roll a holiday', () => {
  it('resolves no holidays for a first dream (every holiday branch keys off activeHolidays)', () => {
    expect(SRC).toMatch(/else if \(isFirstDream\) holidayResolveNote = 'first_dream';/);
    expect(SRC).toMatch(/if \(holCfg\.holidaysEnabled && !isFirstDream\) \{/);
  });

  it('first-dream tiers still carry the flag the render reads', () => {
    const tiers = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'firstDreamTiers.ts'),
      'utf8'
    );
    expect(tiers).toMatch(/t\.body\.first_dream = true/);
    const flags = fs.readFileSync(
      path.join(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'nightlyQaFlags.ts'),
      'utf8'
    );
    expect(flags).toMatch(/isFirstDream: body\.first_dream === true/);
  });
});
