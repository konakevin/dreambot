/**
 * FAILSAFE for the silent prompt-truncation bug found 2026-09-22.
 *
 * `botEngine.callClaude()` wrote every bot brief with a hardcoded `maxTokens: 400`.
 * When a brief ran past it, the Anthropic API returned `stop_reason: 'max_tokens'`
 * and the response was cut off MID-WORD — the tail of the Flux prompt (usually the
 * output-order block carrying the path's closing instructions) was silently
 * deleted. Nothing logged it, nothing stamped it, and no render failed, so it went
 * unnoticed for months.
 *
 * Measured across 1,496 live bot renders before the fix:
 *   - 6.7% of all bot prompts truncated mid-sentence, fleet-wide
 *   - 21.4% on FarmBot (a live public bot) — better than 1 in 5
 *
 * It cost CONTENT as well as quality. Two FarmBot paths diagnosed the truncation
 * correctly and then designed around it, believing a shared cap was immovable:
 * `farmbot-halloween-costume-parade` still caps its cast at 2 humans instead of 3
 * because figure 3 kept getting cut off, and `barn-animal-shelter-interior` had to
 * reorder its sections to get the animals into the prompt at all.
 *
 * This test locks BOTH halves of the fix, because either one alone lets the class
 * of bug come back:
 *   1. the budget is generous (a brief asking 110-140 words can never hit it), and
 *   2. truncation is DETECTED (`stop_reason` is checked) rather than swallowed.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ENGINE_PATH = join(__dirname, '../../scripts/lib/botEngine.js');
const src = readFileSync(ENGINE_PATH, 'utf8');

/** Smallest budget that can hold any brief in the fleet with real headroom. */
const MIN_SAFE_BUDGET = 900;

describe('botEngine brief budget — a prompt can never be silently cut off again', () => {
  it('declares one shared BRIEF_MAX_TOKENS constant', () => {
    expect(src).toMatch(/const BRIEF_MAX_TOKENS\s*=\s*\d+/);
  });

  it('sets that budget generously enough that a normal brief can never hit it', () => {
    const m = src.match(/const BRIEF_MAX_TOKENS\s*=\s*(\d+)/);
    expect(m).toBeTruthy();
    const budget = Number(m![1]);
    // A brief asking for 110-140 words needs ~200 output tokens; the densest
    // two-pass concept call asks for ~150 words of prose. 400 was the value that
    // truncated 6.7% of the fleet — anything in that neighbourhood is a regression.
    expect(budget).toBeGreaterThanOrEqual(MIN_SAFE_BUDGET);
  });

  it('never reintroduces a small hardcoded token cap on a brief-writing call', () => {
    // The exact shape of the original bug: `callClaude({ brief, maxTokens: 400 })`.
    // Any literal budget under the safe floor on a callClaude call is the bug back.
    const callSites = [...src.matchAll(/callClaude\(\{[\s\S]{0,220}?\}\)/g)].map((x) => x[0]);
    expect(callSites.length).toBeGreaterThan(0);

    for (const site of callSites) {
      const lit = site.match(/maxTokens:\s*(\d+)/);
      if (lit) {
        expect(Number(lit[1])).toBeGreaterThanOrEqual(MIN_SAFE_BUDGET);
      }
    }
  });

  it('defaults callClaude to the shared budget rather than a bare number', () => {
    expect(src).toMatch(/maxTokens\s*=\s*BRIEF_MAX_TOKENS/);
  });

  it('checks stop_reason so a truncated response is loud, not swallowed', () => {
    // Detection is the half that makes the budget safe: if a future brief really
    // does outgrow the ceiling, it must SAY so instead of shipping half a prompt.
    expect(src).toMatch(/stop_reason\s*===\s*['"]max_tokens['"]/);
    // and it must actually surface it, not just compute a dead variable
    expect(src).toMatch(/console\.(warn|error)\([\s\S]{0,200}TRUNCATED/);
  });

  it('propagates truncation to the caller and stamps it for DB forensics', () => {
    // `sonnet_truncated` in the render's own metadata is what makes a future
    // occurrence measurable from the DB instead of only from a lost console log.
    expect(src).toMatch(/sonnet_truncated:/);
    expect(src).toMatch(/truncated:\s*Boolean\(claude\.truncated\)/);
  });
});
