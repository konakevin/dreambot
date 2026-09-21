/**
 * TIME + WEATHER FOR CREATE (Kevin, 2026-09-21: "fix the time/weather axes for create").
 *
 * generate-dream passed `timeAxis: ''`, `weatherAxis: ''`, `phenomenaAxis: ''` — literally empty —
 * while nightly rolled real values from per-biome pools. Every Create dream of a given prompt was
 * lit the same way, which after three passes at wardrobe variety was the largest remaining reason
 * two dreams looked alike. Clothing is a detail; light is the whole frame.
 *
 * The load-bearing assertions are the CLIMATE-AGNOSTIC ones. Nightly can offer arctic weather
 * because it resolved an arctic biome first. Create has no biome — the place is whatever the user
 * typed — so any entry naming a climate is how you get fresh snowfall on a tropical beach.
 */

import {
  CREATE_TIME_AXES,
  CREATE_WEATHER_AXES,
  rollCreateSceneAxes,
} from '@engine/createSceneAxes';

describe('rollCreateSceneAxes', () => {
  it('rolls a real time and weather, never the empty strings it replaces', () => {
    const a = rollCreateSceneAxes(() => 0.5);
    expect(a.timeAxis.length).toBeGreaterThan(3);
    expect(a.weatherAxis.length).toBeGreaterThan(3);
  });

  it('leaves PHENOMENA empty — the vibe fragment already owns that register', () => {
    // Create's vibe supplies exactly this ("drifting motes of magical light, lanterns burning in
    // impossible colors, a soft luminous enchanted mist" for arcane) and the brief tells Sonnet the
    // vibe OWNS the light and weather. Rolling a phenomenon on top puts two authors on one
    // sentence.
    for (let i = 0; i < 20; i++) {
      expect(rollCreateSceneAxes(() => i / 20).phenomenaAxis).toBe('');
    }
  });

  it('reaches every entry in both pools', () => {
    const times = new Set(
      Array.from({ length: 60 }, (_, i) => rollCreateSceneAxes(() => i / 60).timeAxis)
    );
    const weather = new Set(
      Array.from({ length: 60 }, (_, i) => rollCreateSceneAxes(() => i / 60).weatherAxis)
    );
    expect(times.size).toBe(CREATE_TIME_AXES.length);
    expect(weather.size).toBe(CREATE_WEATHER_AXES.length);
  });

  it('multiplies to enough combinations that a batch does not share a look', () => {
    expect(CREATE_TIME_AXES.length * CREATE_WEATHER_AXES.length).toBeGreaterThanOrEqual(50);
  });

  it('is pure — same rng, same result', () => {
    expect(rollCreateSceneAxes(() => 0.3)).toEqual(rollCreateSceneAxes(() => 0.3));
  });
});

describe('the pools are CLIMATE-AGNOSTIC — the whole reason they are separate from nightly', () => {
  const CLIMATE =
    /\b(snow|snowfall|blizzard|arctic|tropical|desert|monsoon|heatwave|sandstorm|humid jungle|frost|sleet|hail)\b/i;

  it('no weather entry names a climate the user may not have asked for', () => {
    // "Fresh snowfall" is a perfectly good nightly entry because nightly resolved an arctic biome
    // first. Here it would land on a beach.
    for (const w of CREATE_WEATHER_AXES) expect(w).not.toMatch(CLIMATE);
  });

  it('no time entry names a climate or a season', () => {
    for (const t of CREATE_TIME_AXES) {
      expect(t).not.toMatch(CLIMATE);
      expect(t).not.toMatch(/\b(summer|winter|autumn|spring)\b/i);
    }
  });

  it('every time entry works INDOORS as well as out', () => {
    // A jazz club at "first light" still reads (what light there is, coming through the windows).
    // An entry naming the sky directly would not survive the move inside.
    for (const t of CREATE_TIME_AXES) {
      expect(t).not.toMatch(/\b(clear sky|open sky|cloudless|starfield|horizon)\b/i);
    }
  });

  it('covers the full day, not just the pretty end of it', () => {
    // A pool of nothing but golden hours is the same pigeonhole the wardrobe palettes had: every
    // render lit identically, just prettily.
    const joined = CREATE_TIME_AXES.join(' | ').toLowerCase();
    expect(joined).toMatch(/first light|early morning/);
    expect(joined).toMatch(/midday/);
    expect(joined).toMatch(/golden hour/);
    expect(joined).toMatch(/blue hour/);
    expect(joined).toMatch(/night/);
    // and the flattering hours are not the majority
    const flattering = CREATE_TIME_AXES.filter((t) => /golden hour|blue hour/i.test(t)).length;
    expect(flattering).toBeLessThanOrEqual(Math.ceil(CREATE_TIME_AXES.length / 3));
  });
});
